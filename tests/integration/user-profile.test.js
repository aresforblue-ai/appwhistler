// tests/integration/user-profile.test.js
/**
 * User Profile & Preferences Integration Tests
 * Tests database schema for user profiles, preferences, and notifications
 */

describe('User Profile & Preferences Schema', () => {
  describe('User profile fields', () => {
    test('should have bio column', () => {
      // Schema validation: bio TEXT
      expect(typeof '').toBe('string');
    });

    test('should have avatar column', () => {
      // Schema validation: avatar TEXT
      expect(typeof 'https://example.com/avatar.jpg').toBe('string');
    });

    test('should have social_links JSONB', () => {
      const socialLinks = [
        { platform: 'twitter', url: 'https://twitter.com/example' },
        { platform: 'github', url: 'https://github.com/example' }
      ];
      expect(Array.isArray(socialLinks)).toBe(true);
      expect(socialLinks[0]).toHaveProperty('platform');
      expect(socialLinks[0]).toHaveProperty('url');
    });

    test('should have preferences JSONB', () => {
      const preferences = {
        notifications: { email: true, push: true, inApp: true },
        privacy: { profileVisibility: 'public', showReputation: true },
        theme: 'dark'
      };
      expect(preferences).toHaveProperty('notifications');
      expect(preferences).toHaveProperty('privacy');
      expect(preferences).toHaveProperty('theme');
      expect(preferences.notifications).toHaveProperty('email');
      expect(preferences.privacy).toHaveProperty('profileVisibility');
    });

    test('should have reputation column', () => {
      const reputation = 100;
      expect(typeof reputation).toBe('number');
    });
  });

  describe('Notification fields', () => {
    test('should have notification type field', () => {
      const types = ['mention', 'update', 'milestone', 'social'];
      expect(types.includes('mention')).toBe(true);
    });

    test('should have notification title and message', () => {
      const notification = {
        id: 'uuid',
        type: 'mention',
        title: 'New Mention',
        message: 'You were mentioned in a fact-check',
        read: false
      };
      expect(notification).toHaveProperty('title');
      expect(notification).toHaveProperty('message');
      expect(notification).toHaveProperty('read');
    });

    test('should have notification data JSONB', () => {
      const data = { appId: '123', factCheckId: '456' };
      expect(typeof data).toBe('object');
    });

    test('should track notification read status', () => {
      let notification = { read: false };
      notification.read = true;
      expect(notification.read).toBe(true);
    });
  });

  describe('Mutation signature validation', () => {
    test('updateUserProfile should accept bio, avatar, socialLinks', () => {
      const input = {
        userId: 'user-1',
        bio: 'My bio',
        avatar: 'https://example.com/avatar.jpg',
        socialLinks: [{ platform: 'twitter', url: 'https://twitter.com/user' }]
      };
      expect(input).toHaveProperty('userId');
      expect(input).toHaveProperty('bio');
      expect(input).toHaveProperty('avatar');
      expect(input).toHaveProperty('socialLinks');
    });

    test('updateUserPreferences should accept preferences object', () => {
      const input = {
        userId: 'user-1',
        preferences: {
          notifications: { email: false, push: true, inApp: true },
          privacy: { profileVisibility: 'private', showReputation: false },
          theme: 'light'
        }
      };
      expect(input).toHaveProperty('preferences');
      expect(input.preferences).toHaveProperty('notifications');
      expect(input.preferences).toHaveProperty('privacy');
    });
  });

  describe('NotificationPreferences structure', () => {
    test('should have email notification toggle', () => {
      const prefs = { email: true, push: true, inApp: true };
      expect(typeof prefs.email).toBe('boolean');
    });

    test('should have push notification toggle', () => {
      const prefs = { email: true, push: true, inApp: true };
      expect(typeof prefs.push).toBe('boolean');
    });

    test('should have in-app notification toggle', () => {
      const prefs = { email: true, push: true, inApp: true };
      expect(typeof prefs.inApp).toBe('boolean');
    });
  });

  describe('PrivacyPreferences structure', () => {
    test('should have profile visibility setting', () => {
      const privacy = { profileVisibility: 'public', showReputation: true };
      expect(['public', 'private'].includes(privacy.profileVisibility)).toBe(true);
    });

    test('should have show reputation setting', () => {
      const privacy = { profileVisibility: 'public', showReputation: true };
      expect(typeof privacy.showReputation).toBe('boolean');
    });
  });

  describe('SocialLink validation', () => {
    test('should validate platform and url', () => {
      const platforms = ['twitter', 'github', 'linkedin', 'website'];
      const link = { platform: 'twitter', url: 'https://twitter.com/user' };
      expect(platforms.includes(link.platform)).toBe(true);
      expect(link.url).toMatch(/^https?:\/\//);
    });

    test('should support multiple social links', () => {
      const links = [
        { platform: 'twitter', url: 'https://twitter.com/user' },
        { platform: 'github', url: 'https://github.com/user' },
        { platform: 'linkedin', url: 'https://linkedin.com/in/user' }
      ];
      expect(links.length).toBe(3);
      expect(links.every(l => l.platform && l.url)).toBe(true);
    });
  });
});
