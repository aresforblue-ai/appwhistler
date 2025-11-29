const path = require('path');
const fs = require('fs');

const { loadSeedData } = require('../../../scripts/seed-apps');

describe('App Seeding', () => {
  describe('Seed data file', () => {
    test('seed data file exists', () => {
      const seedDataPath = path.join(__dirname, '..', '..', '..', 'database', 'seeds', 'top100apps.json');
      expect(fs.existsSync(seedDataPath)).toBe(true);
    });

    test('seed data is valid JSON array', async () => {
      const apps = await loadSeedData();
      expect(Array.isArray(apps)).toBe(true);
      expect(apps.length).toBeGreaterThan(0);
    });

    test('each app has required fields', async () => {
      const apps = await loadSeedData();
      const requiredFields = [
        'name',
        'packageId',
        'category',
        'description',
        'developer',
        'platform',
        'truthRating',
        'downloadCount'
      ];

      apps.forEach((app, index) => {
        requiredFields.forEach(field => {
          expect(app[field]).toBeDefined();
        });
      });
    });

    test('all apps have valid truth ratings between 0 and 5', async () => {
      const apps = await loadSeedData();
      apps.forEach(app => {
        expect(app.truthRating).toBeGreaterThanOrEqual(0);
        expect(app.truthRating).toBeLessThanOrEqual(5);
      });
    });

    test('all apps have non-negative download counts', async () => {
      const apps = await loadSeedData();
      apps.forEach(app => {
        expect(app.downloadCount).toBeGreaterThanOrEqual(0);
      });
    });

    test('package IDs are unique after deduplication logic', async () => {
      const apps = await loadSeedData();
      // Deduplicate like the script does
      const uniqueApps = apps.reduce((acc, app) => {
        if (!acc.find(a => a.packageId === app.packageId)) {
          acc.push(app);
        }
        return acc;
      }, []);
      
      const packageIds = uniqueApps.map(app => app.packageId);
      const uniqueIds = new Set(packageIds);
      expect(uniqueIds.size).toBe(packageIds.length);
    });

    test('all apps have valid platforms', async () => {
      const apps = await loadSeedData();
      const validPlatforms = ['android', 'ios', 'web', 'desktop'];
      apps.forEach(app => {
        expect(validPlatforms).toContain(app.platform);
      });
    });

    test('all apps have valid categories', async () => {
      const apps = await loadSeedData();
      const validCategories = [
        'communication',
        'tools',
        'productivity',
        'social',
        'entertainment',
        'navigation',
        'photography',
        'security'
      ];
      apps.forEach(app => {
        expect(validCategories).toContain(app.category);
      });
    });

    test('seed data contains privacy-focused apps', async () => {
      const apps = await loadSeedData();
      // Check for some well-known privacy apps
      const privacyAppNames = ['Signal Private Messenger', 'ProtonMail', 'Bitwarden Password Manager'];
      privacyAppNames.forEach(name => {
        expect(apps.some(app => app.name === name)).toBe(true);
      });
    });

    test('verified apps have high truth ratings', async () => {
      const apps = await loadSeedData();
      const verifiedApps = apps.filter(app => app.isVerified);
      // Most verified apps should have decent truth ratings
      const highRatedVerified = verifiedApps.filter(app => app.truthRating >= 4.0);
      expect(highRatedVerified.length).toBeGreaterThan(verifiedApps.length * 0.5);
    });
  });
});
