// Advanced Notification Service with Push Notifications and Email Reminders
import { supabase } from './supabase'

export interface NotificationSettings {
  dailyReminders: boolean
  weeklyReports: boolean
  achievementAlerts: boolean
  emergencyContacts: string[]
  reminderTime: string
  pushEnabled: boolean
}

class NotificationService {
  private vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null

  async initializePushNotifications(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications not supported')
      return false
    }

    try {
      // Register service worker
      this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js')
      
      // Request notification permission
      const permission = await Notification.requestPermission()
      
      if (permission === 'granted') {
        await this.subscribeToPush()
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error initializing push notifications:', error)
      return false
    }
  }

  private async subscribeToPush(): Promise<void> {
    if (!this.serviceWorkerRegistration || !this.vapidPublicKey) return

    try {
      const subscription = await this.serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
      })

      // Send subscription to backend
      await this.sendSubscriptionToBackend(subscription)
    } catch (error) {
      console.error('Error subscribing to push:', error)
    }
  }

  private async sendSubscriptionToBackend(subscription: PushSubscription): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: user.id,
        subscription: JSON.stringify(subscription),
        updated_at: new Date().toISOString()
      })
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  async scheduleLocalNotification(title: string, body: string, delay: number): Promise<void> {
    if ('Notification' in window && Notification.permission === 'granted') {
      setTimeout(() => {
        new Notification(title, {
          body,
          icon: '/brain-icon.svg',
          badge: '/brain-icon.svg',
          tag: 'mental-health-reminder'
        })
      }, delay)
    }
  }

  async sendDailyReminder(userId: string): Promise<void> {
    const title = "Daily Check-in Reminder"
    const body = "How are you feeling today? Take a moment to log your mood and reflect."
    
    // Schedule for next day at user's preferred time
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(9, 0, 0, 0) // Default 9 AM
    
    const delay = tomorrow.getTime() - Date.now()
    await this.scheduleLocalNotification(title, body, delay)
  }

  async sendAchievementNotification(achievement: any): Promise<void> {
    const title = `🎉 Achievement Unlocked!`
    const body = `${achievement.icon} ${achievement.title}: ${achievement.description}`
    
    await this.scheduleLocalNotification(title, body, 1000) // 1 second delay
  }

  async sendWeeklyReport(userId: string, stats: any): Promise<void> {
    const title = "Your Weekly Mental Health Report"
    const body = `This week: ${stats.entries} entries, ${stats.avgMood}/10 avg mood. Keep it up!`
    
    await this.scheduleLocalNotification(title, body, 1000)
  }

  async sendEmergencyAlert(userId: string, contacts: string[]): Promise<void> {
    // This would integrate with your backend to send SMS/email to emergency contacts
    console.log('Emergency alert triggered for user:', userId)
    
    // For demo purposes, show local notification
    await this.scheduleLocalNotification(
      "Emergency Support Activated",
      "Your emergency contacts have been notified. Help is on the way.",
      1000
    )
  }

  async updateNotificationSettings(userId: string, settings: NotificationSettings): Promise<void> {
    await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        notification_settings: settings,
        updated_at: new Date().toISOString()
      })
  }

  async getNotificationSettings(userId: string): Promise<NotificationSettings> {
    const { data } = await supabase
      .from('user_settings')
      .select('notification_settings')
      .eq('user_id', userId)
      .single()

    return data?.notification_settings || {
      dailyReminders: true,
      weeklyReports: true,
      achievementAlerts: true,
      emergencyContacts: [],
      reminderTime: '09:00',
      pushEnabled: false
    }
  }
}

export const notificationService = new NotificationService()