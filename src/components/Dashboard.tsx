import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User } from '@supabase/supabase-js'
import { Brain, Plus, TrendingUp, BookOpen, Settings, LogOut } from 'lucide-react'
import { MoodTracker } from './MoodTracker'
import { JournalView } from './JournalView'
import { AnalyticsView } from './AnalyticsView'
import { useMoodLogs } from '../hooks/useMoodLogs'

interface DashboardProps {
  user: User
  onSignOut: () => void
}

export function Dashboard({ user, onSignOut }: DashboardProps) {
  const [activeView, setActiveView] = useState<'tracker' | 'journal' | 'analytics'>('tracker')
  const [showMoodTracker, setShowMoodTracker] = useState(false)
  const { logs, loading, addMoodLog } = useMoodLogs(user?.id)

  const todayLogs = logs.filter(log => {
    const today = new Date().toISOString().split('T')[0]
    const logDate = new Date(log.created_at).toISOString().split('T')[0]
    return today === logDate
  })

  const recentMood = logs[0]?.mood || 5
  const avgMood = logs.length > 0 ? Math.round(logs.slice(0, 7).reduce((sum, log) => sum + log.mood, 0) / Math.min(logs.length, 7)) : 5

  const views = [
    { id: 'tracker', label: 'Today', icon: Plus },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'analytics', label: 'Insights', icon: TrendingUp },
  ] as const

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50"
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">MindFlow AI</h1>
              <p className="text-sm text-slate-400">Welcome back, {user.email?.split('@')[0]}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-slate-700/50 rounded-lg p-2">
              <div className="text-sm text-slate-300">Recent: {recentMood}/10</div>
              <div className="w-px h-4 bg-slate-600"></div>
              <div className="text-sm text-slate-300">7-day avg: {avgMood}/10</div>
            </div>
            <button
              onClick={onSignOut}
              className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700/50"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-6xl mx-auto px-4 py-6"
      >
        <div className="flex space-x-2 bg-slate-800/30 backdrop-blur-xl rounded-2xl p-2">
          {views.map((view) => {
            const Icon = view.icon
            return (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all ${
                  activeView === view.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{view.label}</span>
              </button>
            )
          })}
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pb-8">
        <AnimatePresence mode="wait">
          {activeView === 'tracker' && (
            <motion.div
              key="tracker"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <MoodTracker
                todayLogs={todayLogs}
                onAddLog={addMoodLog}
                recentMood={recentMood}
              />
            </motion.div>
          )}

          {activeView === 'journal' && (
            <motion.div
              key="journal"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <JournalView logs={logs} loading={loading} />
            </motion.div>
          )}

          {activeView === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <AnalyticsView logs={logs} loading={loading} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}