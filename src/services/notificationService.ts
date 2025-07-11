import toast from 'react-hot-toast';

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  paymentReminders: boolean;
  bookingUpdates: boolean;
  promotions: boolean;
}

export interface Notification {
  id: string;
  type: 'payment' | 'booking' | 'promotion' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

class NotificationService {
  private static instance: NotificationService;
  private notifications: Notification[] = [];
  private preferences: NotificationPreferences = {
    email: true,
    sms: true,
    push: true,
    inApp: true,
    paymentReminders: true,
    bookingUpdates: true,
    promotions: false
  };

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // SMS Notifications (Twilio integration)
  async sendSMS(phone: string, message: string): Promise<boolean> {
    try {
      const response = await fetch('/api/notifications/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, message })
      });
      return response.ok;
    } catch (error) {
      console.error('SMS sending failed:', error);
      return false;
    }
  }

  // Email Notifications
  async sendEmail(email: string, subject: string, content: string): Promise<boolean> {
    try {
      const response = await fetch('/api/notifications/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, subject, content })
      });
      return response.ok;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  // Push Notifications
  async sendPushNotification(title: string, body: string, data?: any): Promise<void> {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      
      if (Notification.permission === 'granted') {
        registration.showNotification(title, {
          body,
          icon: '/logo192.png',
          badge: '/logo192.png',
          data,
          vibrate: [100, 50, 100],
          actions: [
            { action: 'view', title: 'View', icon: '/logo192.png' },
            { action: 'dismiss', title: 'Dismiss', icon: '/logo192.png' }
          ]
        });
      }
    }
  }

  // In-app Notifications
  addInAppNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    
    this.notifications.unshift(newNotification);
    
    // Show toast for immediate feedback
    toast(notification.message, {
      icon: this.getNotificationIcon(notification.type),
      duration: 4000
    });
  }

  // Payment Due Notifications
  async sendPaymentReminder(userPhone: string, userEmail: string, dueDate: string, amount: number): Promise<void> {
    const message = `Payment reminder: Your rent of ₹${amount.toLocaleString()} is due on ${dueDate}. Pay now to avoid late fees. - Team Ghar`;
    
    if (this.preferences.sms) {
      await this.sendSMS(userPhone, message);
    }
    
    if (this.preferences.email) {
      await this.sendEmail(userEmail, 'Rent Payment Reminder', message);
    }
    
    if (this.preferences.push) {
      await this.sendPushNotification('Payment Due', message);
    }
    
    if (this.preferences.inApp) {
      this.addInAppNotification({
        type: 'payment',
        title: 'Payment Due',
        message: `Rent payment of ₹${amount.toLocaleString()} is due on ${dueDate}`,
        actionUrl: '/manage-subscription'
      });
    }
  }

  // Booking Notifications
  async sendBookingConfirmation(userPhone: string, userEmail: string, bookingDetails: any): Promise<void> {
    const message = `Booking confirmed! Your room at ${bookingDetails.pgName} is reserved. Check-in: ${bookingDetails.checkInDate}. Contact: 9907002817 - Team Ghar`;
    
    if (this.preferences.sms) {
      await this.sendSMS(userPhone, message);
    }
    
    if (this.preferences.email) {
      await this.sendEmail(userEmail, 'Booking Confirmation', message);
    }
    
    if (this.preferences.inApp) {
      this.addInAppNotification({
        type: 'booking',
        title: 'Booking Confirmed',
        message: `Your room at ${bookingDetails.pgName} is confirmed`,
        actionUrl: '/profile'
      });
    }
  }

  // Notification Preferences
  updatePreferences(newPreferences: Partial<NotificationPreferences>): void {
    this.preferences = { ...this.preferences, ...newPreferences };
    localStorage.setItem('notificationPreferences', JSON.stringify(this.preferences));
  }

  getPreferences(): NotificationPreferences {
    const saved = localStorage.getItem('notificationPreferences');
    if (saved) {
      this.preferences = JSON.parse(saved);
    }
    return this.preferences;
  }

  // Get notifications
  getNotifications(): Notification[] {
    return this.notifications;
  }

  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  clearAll(): void {
    this.notifications = [];
  }

  private getNotificationIcon(type: string): string {
    switch (type) {
      case 'payment': return '💳';
      case 'booking': return '🏠';
      case 'promotion': return '🎉';
      default: return '📢';
    }
  }
}

export default NotificationService;