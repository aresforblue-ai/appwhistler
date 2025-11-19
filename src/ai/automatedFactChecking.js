// src/ai/automatedFactChecking.js
// Automated cron job to re-verify old claims periodically

const cron = require('node-cron');
const { getSecret } = require('../config/secrets');

/**
 * Automated fact-checking service
 * Re-verifies claims older than 90 days to catch outdated information
 */
class AutomatedFactChecker {
  constructor(pool, factChecker) {
    this.pool = pool;
    this.factChecker = factChecker;
    this.isRunning = false;
    this.cronSchedule = getSecret('FACT_CHECK_CRON_SCHEDULE', '0 2 * * *'); // 2 AM daily
    this.staleThresholdDays = parseInt(getSecret('FACT_CHECK_STALE_DAYS', '90'));
    this.batchSize = 50; // Process 50 claims per run
  }

  /**
   * Start the automated fact-checking cron job
   */
  start() {
    if (this.isRunning) {
      console.log('⚠️  Automated fact-checker already running');
      return;
    }

    console.log(`🤖 Starting automated fact-checker (schedule: ${this.cronSchedule})`);
    
    // Schedule cron job
    this.cronJob = cron.schedule(this.cronSchedule, async () => {
      await this.runFactCheckCycle();
    });

    this.isRunning = true;
  }

  /**
   * Stop the cron job
   */
  stop() {
    if (this.cronJob) {
      this.cronJob.stop();
      this.isRunning = false;
      console.log('🛑 Automated fact-checker stopped');
    }
  }

  /**
   * Run a single fact-checking cycle
   * Finds stale claims and re-verifies them
   */
  async runFactCheckCycle() {
    console.log('🔄 Starting automated fact-check cycle...');
    
    try {
      // Find stale claims (older than threshold and not verified recently)
      const staleClaims = await this.findStaleClaims();
      
      if (staleClaims.length === 0) {
        console.log('✅ No stale claims found. All fact-checks are up to date.');
        return;
      }

      console.log(`📋 Found ${staleClaims.length} stale claims to re-verify`);

      // Process each claim
      let updated = 0;
      let unchanged = 0;
      let errors = 0;

      for (const claim of staleClaims) {
        try {
          const result = await this.reverifyClaimWithComparison(claim);
          
          if (result.verdictChanged) {
            updated++;
            await this.notifyUsersOfVerdictChange(claim, result);
          } else {
            unchanged++;
          }
        } catch (error) {
          console.error(`Error re-verifying claim ${claim.id}:`, error.message);
          errors++;
        }
      }

      console.log(`✅ Fact-check cycle complete: ${updated} updated, ${unchanged} unchanged, ${errors} errors`);

      // Log cycle to database
      await this.logFactCheckCycle(updated, unchanged, errors);

    } catch (error) {
      console.error('Automated fact-check cycle failed:', error);
    }
  }

  /**
   * Find claims that need re-verification
   * @private
   */
  async findStaleClaims() {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - this.staleThresholdDays);

    const result = await this.pool.query(
      `SELECT id, claim, verdict, confidence_score, category, sources, created_at
       FROM fact_checks
       WHERE created_at < $1
         AND (last_verified_at IS NULL OR last_verified_at < $1)
         AND verified_by IS NOT NULL
       ORDER BY created_at ASC
       LIMIT $2`,
      [thresholdDate, this.batchSize]
    );

    return result.rows;
  }

  /**
   * Re-verify a claim and compare with original verdict
   * @private
   */
  async reverifyClaimWithComparison(claimRecord) {
    const { id, claim, verdict: oldVerdict, confidence_score: oldConfidence, category } = claimRecord;

    console.log(`🔍 Re-verifying: "${claim.substring(0, 60)}..."`);

    // Run new fact-check
    const newResult = await this.factChecker.verifyClaimComprehensive(claim, category);

    // Compare verdicts
    const verdictChanged = this.isSignificantChange(
      oldVerdict,
      newResult.verdict,
      oldConfidence,
      newResult.confidence
    );

    if (verdictChanged) {
      console.log(`⚠️  Verdict changed: ${oldVerdict} (${oldConfidence}) → ${newResult.verdict} (${newResult.confidence})`);
      
      // Update database
      await this.pool.query(
        `UPDATE fact_checks
         SET verdict = $1,
             confidence_score = $2,
             sources = $3,
             explanation = $4,
             last_verified_at = CURRENT_TIMESTAMP,
             automated_update_count = COALESCE(automated_update_count, 0) + 1,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $5`,
        [
          newResult.verdict,
          newResult.confidence,
          JSON.stringify(newResult.sources),
          newResult.explanation,
          id
        ]
      );

      // Create update history record
      await this.pool.query(
        `INSERT INTO fact_check_updates (fact_check_id, old_verdict, new_verdict, old_confidence, new_confidence, reason, created_at)
         VALUES ($1, $2, $3, $4, $5, 'automated_reverification', CURRENT_TIMESTAMP)`,
        [id, oldVerdict, newResult.verdict, oldConfidence, newResult.confidence]
      );
    } else {
      // Just update last_verified_at
      await this.pool.query(
        `UPDATE fact_checks
         SET last_verified_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [id]
      );
    }

    return {
      claimId: id,
      verdictChanged,
      oldVerdict,
      newVerdict: newResult.verdict,
      oldConfidence,
      newConfidence: newResult.confidence
    };
  }

  /**
   * Determine if verdict change is significant enough to notify users
   * @private
   */
  isSignificantChange(oldVerdict, newVerdict, oldConfidence, newConfidence) {
    // Verdict changed completely
    if (oldVerdict !== newVerdict) {
      return true;
    }

    // Confidence changed significantly (more than 20 points)
    if (Math.abs(oldConfidence - newConfidence) > 0.2) {
      return true;
    }

    return false;
  }

  /**
   * Notify users who interacted with the claim
   * @private
   */
  async notifyUsersOfVerdictChange(claimRecord, updateResult) {
    try {
      // Find users who voted or commented on this fact-check
      const usersToNotify = await this.pool.query(
        `SELECT DISTINCT user_id
         FROM (
           SELECT user_id FROM fact_check_votes WHERE fact_check_id = $1
           UNION
           SELECT submitted_by as user_id FROM fact_checks WHERE id = $1
         ) AS affected_users`,
        [claimRecord.id]
      );

      if (usersToNotify.rows.length === 0) {
        return;
      }

      // Create notification for each user
      const notificationData = {
        type: 'fact_check_updated',
        title: 'Fact-Check Updated',
        message: `A fact-check you interacted with has been updated: "${claimRecord.claim.substring(0, 50)}..."`,
        metadata: {
          fact_check_id: claimRecord.id,
          old_verdict: updateResult.oldVerdict,
          new_verdict: updateResult.newVerdict,
          automated: true
        }
      };

      for (const user of usersToNotify.rows) {
        await this.pool.query(
          `INSERT INTO notifications (user_id, type, title, message, metadata, created_at)
           VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
          [
            user.user_id,
            notificationData.type,
            notificationData.title,
            notificationData.message,
            JSON.stringify(notificationData.metadata)
          ]
        );
      }

      console.log(`📧 Notified ${usersToNotify.rows.length} users about verdict change`);
    } catch (error) {
      console.error('Failed to notify users:', error.message);
    }
  }

  /**
   * Log cycle statistics to database
   * @private
   */
  async logFactCheckCycle(updated, unchanged, errors) {
    try {
      await this.pool.query(
        `INSERT INTO automated_fact_check_logs (updated_count, unchanged_count, error_count, created_at)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
        [updated, unchanged, errors]
      );
    } catch (error) {
      console.error('Failed to log fact-check cycle:', error.message);
    }
  }

  /**
   * Manually trigger a fact-check cycle (for testing or admin use)
   */
  async runManual() {
    console.log('🚀 Manual fact-check cycle triggered');
    await this.runFactCheckCycle();
  }

  /**
   * Get statistics about automated fact-checking
   */
  async getStats() {
    try {
      const result = await this.pool.query(
        `SELECT 
           COUNT(*) as total_cycles,
           SUM(updated_count) as total_updated,
           SUM(unchanged_count) as total_unchanged,
           SUM(error_count) as total_errors,
           MAX(created_at) as last_run
         FROM automated_fact_check_logs
         WHERE created_at > NOW() - INTERVAL '30 days'`
      );

      return result.rows[0];
    } catch (error) {
      console.error('Failed to get stats:', error.message);
      return null;
    }
  }
}

module.exports = AutomatedFactChecker;
