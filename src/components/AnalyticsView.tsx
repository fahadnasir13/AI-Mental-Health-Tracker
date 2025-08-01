import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Calendar, Target, Award, Activity, Brain } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { MoodLog } from '../lib/supabase'
import { format, subDays, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns'

interface AnalyticsViewProps {
  logs: MoodLog[]
  loading: boolean
}

export function AnalyticsView({ logs, loading }: AnalyticsViewProps) {
  // Calculate analytics data
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date()
  })

  const chartData = last7Days.map(date => {
    const dayLogs = logs.filter(log => {
      const logDate = new Date(log.created_at)
      return logDate.toDateString() === date.toDateString()
    })
    
    const avgMood = dayLogs.length > 0 
      ? dayLogs.reduce((sum, log) => sum + log.mood, 0) / dayLogs.length
      : null

    return {
      date: format(date, 'MMM dd'),
      mood: avgMood ? Math.round(avgMood * 10) / 10 : 0,
      entries: dayLogs.length
    }
  })

  const thisWeekLogs = logs.filter(log => {
    const logDate = new Date(log.created_at)
    const weekStart = startOfWeek(new Date())
    const weekEnd = endOfWeek(new Date())
    return logDate >= weekStart && logDate <= weekEnd
  })

  const stressData = [
    { level: 'Low', count: logs.filter(log => log.stress_level === 'low').length, color: '#10b981' },
    { level: 'Medium', count: logs.filter(log => log.stress_level === 'medium').length, color: '#f59e0b' },
    { level: 'High', count: logs.filter(log => log.stress_level === 'high').length, color: '#ef4444' }
  ]

  const totalEntries = logs.length
  const avgMood = logs.length > 0 ? Math.round((logs.reduce((sum, log) => sum + log.mood, 0) / logs.length) * 10) / 10 : 0
  const currentStreak = calculateStreak(logs)
  const bestMood = logs.length > 0 ? Math.max(...logs.map(log => log.mood)) : 0

  function calculateStreak(logs: MoodLog[]): number {
    if (logs.length === 0) return 0
    
    let streak = 0
    const today = new Date()
    
    for (let i = 0; i < 30; i++) {
      const checkDate = subDays(today, i)
      const hasEntry = logs.some(log => {
        const logDate = new Date(log.created_at)
        return logDate.toDateString() === checkDate.toDateString()
      })
      
      if (hasEntry) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center"
      >
        <TrendingUp className="w-12 h-12 text-slate-500 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-white mb-2">No data to analyze yet</h3>
        <p className="text-slate-400">Start logging your moods to see insights and trends here</p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
      >
        <h2 className="text-2xl font-bold text-white mb-1 flex items-center space-x-2">
          <TrendingUp className="w-7 h-7" />
          <span>Wellness Insights</span>
        </h2>
        <p className="text-slate-400">Understand your mental health patterns and progress</p>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">{totalEntries}</span>
          </div>
          <p className="text-blue-200 font-medium">Total Entries</p>
          <p className="text-blue-300/70 text-sm">All time</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <Brain className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">{avgMood}</span>
          </div>
          <p className="text-purple-200 font-medium">Average Mood</p>
          <p className="text-purple-300/70 text-sm">Out of 10</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl border border-green-500/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8 text-green-400" />
            <span className="text-2xl font-bold text-white">{currentStreak}</span>
          </div>
          <p className="text-green-200 font-medium">Current Streak</p>
          <p className="text-green-300/70 text-sm">Days logging</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl border border-yellow-500/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 text-yellow-400" />
            <span className="text-2xl font-bold text-white">{bestMood}</span>
          </div>
          <p className="text-yellow-200 font-medium">Best Mood</p>
          <p className="text-yellow-300/70 text-sm">Peak feeling</p>
        </motion.div>
      </div>

      {/* Mood Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
      >
        <h3 className="text-lg font-medium text-white mb-6 flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>7-Day Mood Trend</span>
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                domain={[1, 10]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  color: '#F1F5F9'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="url(#moodGradient)" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Stress Level Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
      >
        <h3 className="text-lg font-medium text-white mb-6">Stress Level Distribution</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="level" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  color: '#F1F5F9'
                }}
              />
              <Bar 
                dataKey="count" 
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Weekly Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-br from-indigo-500/10 to-purple-600/10 backdrop-blur-xl border border-indigo-500/20 rounded-2xl p-6"
      >
        <h3 className="text-lg font-medium text-white mb-4">This Week's Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-400 mb-1">
              {thisWeekLogs.length}
            </div>
            <p className="text-slate-300 text-sm">Entries Logged</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {thisWeekLogs.length > 0 ? Math.round((thisWeekLogs.reduce((sum, log) => sum + log.mood, 0) / thisWeekLogs.length) * 10) / 10 : 0}
            </div>
            <p className="text-slate-300 text-sm">Average Mood</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-400 mb-1">
              {thisWeekLogs.filter(log => log.journal_entry).length}
            </div>
            <p className="text-slate-300 text-sm">Journal Entries</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}