#!/usr/bin/env node
// scripts/seed-apps.js
// Seed the database with top 100 privacy-focused apps

const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Load seed data
const seedDataPath = path.join(__dirname, '..', 'database', 'seeds', 'top100apps.json');

async function loadSeedData() {
  try {
    const data = fs.readFileSync(seedDataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Failed to load seed data:', error.message);
    process.exit(1);
  }
}

function buildDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const user = encodeURIComponent(process.env.DB_USER || 'postgres');
  const password = process.env.DB_PASSWORD ? `:${encodeURIComponent(process.env.DB_PASSWORD)}` : '';
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || '5432';
  const database = process.env.DB_NAME || 'appwhistler';

  return `postgres://${user}${password}@${host}:${port}/${database}`;
}

async function seedApps(options = {}) {
  const { 
    clearExisting = false, 
    skipExisting = true,
    verbose = true 
  } = options;

  const pool = new Pool({
    connectionString: buildDatabaseUrl(),
    max: 5
  });

  try {
    // Test connection
    await pool.query('SELECT NOW()');
    if (verbose) console.log('✅ Database connected');

    const apps = await loadSeedData();
    if (verbose) console.log(`📦 Loaded ${apps.length} apps from seed file`);

    // Remove duplicates from seed data (by packageId)
    const uniqueApps = apps.reduce((acc, app) => {
      if (!acc.find(a => a.packageId === app.packageId)) {
        acc.push(app);
      }
      return acc;
    }, []);

    if (verbose) console.log(`📦 ${uniqueApps.length} unique apps after deduplication`);

    if (clearExisting) {
      if (verbose) console.log('🗑️  Clearing existing apps...');
      await pool.query('DELETE FROM apps WHERE 1=1');
    }

    let inserted = 0;
    let skipped = 0;
    let updated = 0;

    for (const app of uniqueApps) {
      try {
        // Check if app already exists
        const existing = await pool.query(
          'SELECT id FROM apps WHERE package_id = $1',
          [app.packageId]
        );

        if (existing.rows.length > 0) {
          if (skipExisting) {
            skipped++;
            continue;
          }
          
          // Update existing app
          await pool.query(
            `UPDATE apps SET
              name = $1,
              category = $2,
              description = $3,
              developer = $4,
              platform = $5,
              privacy_score = $6,
              security_score = $7,
              truth_rating = $8,
              download_count = $9,
              website_url = $10,
              is_verified = $11,
              updated_at = CURRENT_TIMESTAMP
            WHERE package_id = $12`,
            [
              app.name,
              app.category,
              app.description,
              app.developer,
              app.platform,
              app.privacyScore,
              app.securityScore,
              app.truthRating,
              app.downloadCount,
              app.websiteUrl,
              app.isVerified,
              app.packageId
            ]
          );
          updated++;
        } else {
          // Insert new app
          const id = uuidv4();
          await pool.query(
            `INSERT INTO apps (
              id, name, package_id, category, description, developer,
              platform, privacy_score, security_score, truth_rating,
              download_count, website_url, is_verified, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [
              id,
              app.name,
              app.packageId,
              app.category,
              app.description,
              app.developer,
              app.platform,
              app.privacyScore,
              app.securityScore,
              app.truthRating,
              app.downloadCount,
              app.websiteUrl,
              app.isVerified
            ]
          );
          inserted++;
        }
      } catch (error) {
        console.error(`❌ Failed to seed ${app.name}:`, error.message);
      }
    }

    if (verbose) {
      console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Seeding Complete!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ Inserted: ${inserted}
  🔄 Updated:  ${updated}
  ⏭️  Skipped:  ${skipped}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `);
    }

    return { inserted, updated, skipped };
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    clearExisting: args.includes('--clear'),
    skipExisting: !args.includes('--update'),
    verbose: !args.includes('--quiet')
  };

  if (args.includes('--help')) {
    console.log(`
AppWhistler App Seeder
━━━━━━━━━━━━━━━━━━━━━━

Usage: node scripts/seed-apps.js [options]

Options:
  --clear   Clear existing apps before seeding
  --update  Update existing apps instead of skipping
  --quiet   Suppress output messages
  --help    Show this help message

Environment Variables:
  DATABASE_URL  Full PostgreSQL connection string
  DB_HOST       Database host (default: localhost)
  DB_PORT       Database port (default: 5432)
  DB_NAME       Database name (default: appwhistler)
  DB_USER       Database user (default: postgres)
  DB_PASSWORD   Database password
    `);
    process.exit(0);
  }

  seedApps(options)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { seedApps, loadSeedData };
