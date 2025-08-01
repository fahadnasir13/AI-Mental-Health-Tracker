import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { achievementSystem } from '../lib/achievementSystem'
import { notificationService } from '../lib/notificationService'
import { exportService } from '../lib/exportService'
import { aiService } from '../lib/aiService'
import toast from 'react-hot-toast'

export function useAdvancedFeatures(userId: string | undefined) {
  const [achievements, setAchievements] = useState<any[]>([])
  const [userLevel, setUserLevel] = useState({ level: 1, points: 0, nextLevelPoints: 100 })
  const [notifications, setNotifications] = useState<any>({
    dailyReminders: true,
    weeklyReports: true,
    achievementAlerts: true,
    pushEnabled: false
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId) return
    
    loadAchievements()
    loadUserLevel()
    loadNotificationSettings()
    initializePushNotifications()
  }, [userId])

  const loadAchievements = async () => {
    if (!userId) return

    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false })

      if (!error && data) {
        setAchievements(data)
      }
    } catch (error) {
      console.error('Error loading achievements:', error)
    }
  }

  const loadUserLevel = async () => {
    if (!userId) return

    try {
      const levelData = await achievementSystem.getUserLevel(userId)
      setUserLevel(levelData)
    } catch (error) {
      console.error('Error loading user level:', error)
    }
  }

  const loadNotificationSettings = async () => {
    if (!userId) return

    try {
      const settings = await notificationService.getNotificationSettings(userId)
      setNotifications(settings)
    } catch (error) {
      console.error('Error loading notification settings:', error)
    }
  }

  const initializePushNotifications = async () => {
    try {
      const enabled = await notificationService.initializePushNotifications()
      setNotifications(prev => ({ ...prev, pushEnabled: enabled }))
    } catch (error) {
      console.error('Error initializing push notifications:', error)
    }
  }

  const checkForNewAchievements = async () => {
    if (!userId) return

    try {
      const newAchievements = await achievementSystem.checkAndAwardAchievements(userId)
      
      if (newAchievements.length > 0) {
        // Update achievements list
        setAchievements(prev => [...newAchievements, ...prev])
        
        // Update user level
        await loadUserLevel()
        
        // Show notifications for new achievements
        newAchievements.forEach(achievement => {
          toast.success(`🎉 Achievement Unlocked: ${achievement.title}!`, {
            duration: 5000,
            position: 'top-center'
          })
          
          if (notifications.achievementAlerts) {
            notificationService.sendAchievementNotification(achievement)
          }
        })
      }
    } catch (error) {
      console.error('Error checking achievements:', error)
    }
  }

  const updateNotificationSettings = async (newSettings: any) => {
    if (!userId) return

    try {
      await notificationService.updateNotificationSettings(userId, newSettings)
      setNotifications(newSettings)
      toast.success('Notification settings updated!')
    } catch (error) {
      console.error('Error updating notification settings:', error)
      toast.error('Failed to update notification settings')
    }
  }

  const exportData = async (options: any) => {
    if (!userId) return

    setLoading(true)
    try {
      // Get user's mood logs
      const { data: logs, error } = await supabase
        .from('mood_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      await exportService.exportData(logs || [], options)
      toast.success(`Data exported as ${options.format.toUpperCase()}!`)
    } catch (error) {
      console.error('Error exporting data:', error)
      toast.error('Failed to export data')
    } finally {
      setLoading(false)
    }
  }

  const searchJournalEntries = async (query: string) => {
    if (!userId || !query.trim()) return []

    try {
      const { data, error } = await supabase
        .rpc('search_journal_entries', {
          user_uuid: userId,
          search_query: query,
          limit_count: 20
        })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error searching journal entries:', error)
      return []
    }
  }

  const getUserStats = async () => {
    if (!userId) return null

    try {
      const { data, error } = await supabase
        .rpc('get_user_stats', { user_uuid: userId })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting user stats:', error)
      return null
    }
  }

  const getMoodTrends = async (days: number = 30) => {
    if (!userId) return []

    try {
      const { data, error } = await supabase
        .rpc('calculate_mood_trend', {
          user_uuid: userId,
          days: days
        })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting mood trends:', error)
      return []
    }
  }

  const logMeditationSession = async (sessionData: {
    session_type: string
    duration_minutes: number
    mood_before?: number
    mood_after?: number
    notes?: string
  }) => {
    if (!userId) return

    try {
      const { data, error } = await supabase
        .from('meditation_sessions')
        .insert({
          user_id: userId,
          ...sessionData,
          completed: true
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Meditation session logged!')
      
      // Check for meditation-related achievements
      await checkForNewAchievements()
      
      return data
    } catch (error) {
      console.error('Error logging meditation session:', error)
      toast.error('Failed to log meditation session')
    }
  }

  const getEmergencyContacts = async () => {
    if (!userId) return []

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('emergency_contacts')
        .eq('user_id', userId)
        .single()

      if (error) throw error
      return data?.emergency_contacts || []
    } catch (error) {
      console.error('Error getting emergency contacts:', error)
      return []
    }
  }

  const updateEmergencyContacts = async (contacts: string[]) => {
    if (!userId) return

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: userId,
          emergency_contacts: contacts,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      toast.success('Emergency contacts updated!')
    } catch (error) {
      console.error('Error updating emergency contacts:', error)
      toast.error('Failed to update emergency contacts')
    }
  }

  const scheduleDataExport = async (exportType: 'pdf' | 'json' | 'csv', dateRange: 'week' | 'month' | 'all') => {
    if (!userId) return

    try {
      const { data, error } = await supabase
        .from('export_requests')
        .insert({
          user_id: userId,
          export_type: exportType,
          date_range: dateRange,
          status: 'pending'
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Export request scheduled! You\'ll receive an email when ready.')
      return data
    } catch (error) {
      console.error('Error scheduling export:', error)
      toast.error('Failed to schedule export')
    }
  }

  const getConversationHistory = async (limit: number = 10) => {
    if (!userId) return []

    try {
      const { data, error } = await supabase
        .from('ai_conversation_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting conversation history:', error)
      return []
    }
  }

  return {
    // State
    achievements,
    userLevel,
    notifications,
    loading,

    // Achievement functions
    checkForNewAchievements,
    loadAchievements,

    // Notification functions
    updateNotificationSettings,
    initializePushNotifications,

    // Export functions
    exportData,
    scheduleDataExport,

    // Search and analytics
    searchJournalEntries,
    getUserStats,
    getMoodTrends,

    // Meditation tracking
    logMeditationSession,

    // Emergency features
    getEmergencyContacts,
    updateEmergencyContacts,

    // AI conversation history
    getConversationHistory
  }
}