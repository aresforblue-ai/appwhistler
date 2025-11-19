// tests/unit/notifications/NotificationService.test.js
/**
 * NotificationService Unit Tests
 * Tests for in-app notification system (toast notifications)
 */

describe('NotificationService', () => {
  let notificationService;

  beforeEach(() => {
    // Create a fresh instance for each test
    notificationService = {
      listeners: [],
      notifications: [],

      notify(message, type = 'info', duration = 4000) {
        const id = Date.now();
        const notification = { id, message, type, duration };
        this.notifications.push(notification);
        this.listeners.forEach(listener => listener([...this.notifications]));

        if (duration > 0) {
          setTimeout(() => {
            this.notifications = this.notifications.filter(n => n.id !== id);
            this.listeners.forEach(listener => listener([...this.notifications]));
          }, duration);
        }
        return id;
      },

      subscribe(listener) {
        this.listeners.push(listener);
        return () => {
          this.listeners = this.listeners.filter(l => l !== listener);
        };
      },

      remove(id) {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.listeners.forEach(listener => listener([...this.notifications]));
      },

      clearAll() {
        this.notifications = [];
        this.listeners.forEach(listener => listener([]));
      }
    };
  });

  describe('notify()', () => {
    test('should add notification to list', () => {
      let notifications = [];
      notificationService.subscribe(list => {
        notifications = list;
      });

      const id = notificationService.notify('Test message', 'info', 0);

      expect(notifications).toHaveLength(1);
      expect(notifications[0].message).toBe('Test message');
      expect(notifications[0].type).toBe('info');
      expect(notifications[0].id).toBe(id);
    });

    test('should use different types correctly', () => {
      let notifications = [];
      notificationService.subscribe(list => {
        notifications = list;
      });

      notificationService.notify('Success', 'success', 0);
      notificationService.notify('Error', 'error', 0);
      notificationService.notify('Warning', 'warning', 0);

      expect(notifications).toHaveLength(3);
      expect(notifications[0].type).toBe('success');
      expect(notifications[1].type).toBe('error');
      expect(notifications[2].type).toBe('warning');
    });

    test('should persist notification when duration is 0', (done) => {
      let notifications = [];
      notificationService.subscribe(list => {
        notifications = list;
      });

      notificationService.notify('Permanent', 'info', 0);

      setTimeout(() => {
        expect(notifications).toHaveLength(1);
        done();
      }, 100);
    });
  });

  describe('subscribe()', () => {
    test('should notify all subscribers of changes', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      notificationService.subscribe(listener1);
      notificationService.subscribe(listener2);

      notificationService.notify('Test', 'info', 0);

      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });

    test('should unsubscribe listener', () => {
      const listener = jest.fn();
      const unsubscribe = notificationService.subscribe(listener);

      notificationService.notify('Test1', 'info', 0);
      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();

      notificationService.notify('Test2', 'info', 0);
      expect(listener).toHaveBeenCalledTimes(1); // Should not be called again
    });
  });

  describe('remove()', () => {
    test('should remove notification by id', () => {
      let notifications = [];
      notificationService.subscribe(list => {
        notifications = list;
      });

      const id = notificationService.notify('Test', 'info', 0);
      expect(notifications).toHaveLength(1);

      notificationService.remove(id);
      expect(notifications).toHaveLength(0);
    });
  });

  describe('clearAll()', () => {
    test('should clear all notifications', () => {
      let notifications = [];
      notificationService.subscribe(list => {
        notifications = list;
      });

      notificationService.notify('Test1', 'info', 0);
      notificationService.notify('Test2', 'info', 0);
      expect(notifications).toHaveLength(2);

      notificationService.clearAll();
      expect(notifications).toHaveLength(0);
    });
  });
});
