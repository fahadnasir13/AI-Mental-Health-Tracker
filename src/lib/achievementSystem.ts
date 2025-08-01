// Advanced Achievement and Gamification System
import { supabase } from './supabase'
import { Achievement } from './supabase'

export interface AchievementRule {
  id: string
  type: 'streak' | 'milestone' | 'first_time' | 'mood_improvement' | 'consistency'
  title: string
  description: string
  icon: string
  condition: (userStats: UserStats) => boolean
  points: number
}

export interface UserStats {
  totalEntries: number
  currentStreak: number
  longestStreak: number
  averageMood: number
  moodImprovement: number
  journalEntries: number
  aiInteractions: number
  daysActive: number
  weeklyConsistency: number
}

class AchievementSystem {
  private achievements: AchievementRule[] = [
    {
      id: 'first_entry',
      type: 'first_time',
      title: 'First Step',
      description: 'Logged your first mood entry',
      icon: '🌱',
      condition: (stats) => stats.totalEntries >= 1,
      points: 10
    },
    {
      id: 'first_journal',
      type: 'first_time',
      title: 'Opening Up',
      description: 'Wrote your first journal entry',
      icon: '📝',
      condition: (stats) => stats.journalEntries >= 1,
      points: 15
    },
    {
      id: 'week_streak',
      type: 'streak',
      title: 'Week Warrior',
      description: '7 days in a row of mood tracking',
      icon: '🔥',
      condition: (stats) => stats.currentStreak >= 7,
      points: 50
    },
    {
      id: 'month_streak',
      type: 'streak',
      title: 'Monthly Master',
      description: '30 days of consistent tracking',
      icon: '💎',
      condition: (stats) => stats.currentStreak >= 30,
      points: 200
    },
    {
      id: 'mood_improver',
      type: 'mood_improvement',
      title: 'Rising Star',
      description: 'Improved average mood by 2 points',
      icon: '⭐',
      condition: (stats) => stats.moodImprovement >= 2,
      points: 75
    },
    {
      id: 'ai_friend',
      type: 'milestone',
      title: 'AI Companion',
      description: 'Had 10 conversations with AI',
      icon: '🤖',
      condition: (stats) => stats.aiInteractions >= 10,
      points: 30
    },
    {
      id: 'journal_master',
      type: 'milestone',
      title: 'Reflection Master',
      description: 'Written 25 journal entries',
      icon: '📚',
      condition: (stats) => stats.journalEntries >= 25,
      points: 100
    },
    {
      id: 'consistency_king',
      type: 'consistency',
      title: 'Consistency Champion',
      description: '90% weekly consistency for a month',
      icon: '👑',
      condition: (stats) => stats.weeklyConsistency >= 0.9,
      points: 150
    },
    {
      id: 'hundred_club',
      type: 'milestone',
      title: 'Century Club',
      description: '100 mood entries logged',
      icon: '💯',
      condition: (stats) => stats.totalEntries >= 100,
      points: 300
    },
    {
      id: 'wellness_guru',
      type: 'milestone',
      title: 'Wellness Guru',
      description: 'Maintained 8+ average mood for 2 weeks',
      icon: '🧘',
      condition: (stats) => stats.averageMood >= 8 && stats.currentStreak >= 14,
      points: 250
    }
  ]

  async checkAndAwardAchievements(userId: string): Promise<Achievement[]> {
    const userStats = await this.getUserStats(userId)
    const existingAchievements = await this.getUserAchievements(userId)
    const existingIds = existingAchievements.map(a => a.type)

    const newAchievements: Achievement[] = []

    for (const rule of this.achievements) {
      if (!existingIds.includes(rule.id) && rule.condition(userStats)) {
        const achievement = await this.awardAchievement(userId, rule)
        if (achievement) {
          newAchievements.push(achievement)
        }
      }
    }

    return newAchievements
  }

  private async getUserStats(userId: string): Promise<UserStats> {
    // Get mood logs
    const { data: logs } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!logs || logs.length === 0) {
      return {
        totalEntries: 0,
        currentStreak: 0,
        longestStreak: 0,
        averageMood: 0,
        moodImprovement: 0,
        journalEntries: 0,
        aiInteractions: 0,
        daysActive: 0,
        weeklyConsistency: 0
      }
    }

    const totalEntries = logs.length
    const journalEntries = logs.filter(log => log.journal_entry).length
    const aiInteractions = logs.filter(log => log.ai_response).length
    const averageMood = logs.reduce((sum, log) => sum + log.mood, 0) / logs.length

    // Calculate streaks
    const { currentStreak, longestStreak } = this.calculateStreaks(logs)

    // Calculate mood improvement (last 7 days vs previous 7 days)
    const moodImprovement = this.calculateMoodImprovement(logs)

    // Calculate unique active days
    const uniqueDays = new Set(logs.map(log => 
      new Date(log.created_at).toDateString()
    )).size

    // Calculate weekly consistency
    const weeklyConsistency = this.calculateWeeklyConsistency(logs)

    return {
      totalEntries,
      currentStreak,
      longestStreak,
      averageMood,
      moodImprovement,
      journalEntries,
      aiInteractions,
      daysActive: uniqueDays,
      weeklyConsistency
    }
  }

  private calculateStreaks(logs: any[]): { currentStreak: number, longestStreak: number } {
    if (logs.length === 0) return { currentStreak: 0, longestStreak: 0 }

    const today = new Date()
    const dates = logs.map(log => new Date(log.created_at).toDateString())
    const uniqueDates = [...new Set(dates)].sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    )

    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0

    // Calculate current streak
    for (let i = 0; i < uniqueDates.length; i++) {
      const date = new Date(uniqueDates[i])
      const daysDiff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === i) {
        currentStreak++
      } else {
        break
      }
    }

    // Calculate longest streak
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const current = new Date(uniqueDates[i])
      const next = new Date(uniqueDates[i + 1])
      const daysDiff = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === 1) {
        tempStreak++
      } else {
        longestStreak = Math.max(longestStreak, tempStreak + 1)
        tempStreak = 0
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak + 1)

    return { currentStreak, longestStreak }
  }

  private calculateMoodImprovement(logs: any[]): number {
    if (logs.length < 14) return 0

    const sortedLogs = logs.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    const recent7 = sortedLogs.slice(0, 7)
    const previous7 = sortedLogs.slice(7, 14)

    const recentAvg = recent7.reduce((sum, log) => sum + log.mood, 0) / recent7.length
    const previousAvg = previous7.reduce((sum, log) => sum + log.mood, 0) / previous7.length

    return recentAvg - previousAvg
  }

  private calculateWeeklyConsistency(logs: any[]): number {
    const fourWeeksAgo = new Date()
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28)

    const recentLogs = logs.filter(log => 
      new Date(log.created_at) >= fourWeeksAgo
    )

    if (recentLogs.length === 0) return 0

    const uniqueDays = new Set(recentLogs.map(log => 
      new Date(log.created_at).toDateString()
    )).size

    return uniqueDays / 28 // 28 days = 4 weeks
  }

  private async awardAchievement(userId: string, rule: AchievementRule): Promise<Achievement | null> {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .insert({
          user_id: userId,
          type: rule.id,
          title: rule.title,
          description: rule.description,
          icon: rule.icon,
          points: rule.points
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error awarding achievement:', error)
      return null
    }
  }

  private async getUserAchievements(userId: string): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching achievements:', error)
      return []
    }

    return data || []
  }

  async getUserLevel(userId: string): Promise<{ level: number, points: number, nextLevelPoints: number }> {
    const achievements = await this.getUserAchievements(userId)
    const totalPoints = achievements.reduce((sum, achievement) => sum + (achievement as any).points, 0)
    
    const level = Math.floor(totalPoints / 100) + 1
    const nextLevelPoints = level * 100
    
    return { level, points: totalPoints, nextLevelPoints }
  }
}

export const achievementSystem = new AchievementSystem()