import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User } from '@supabase/supabase-js'
import { 
  Brain, Plus, TrendingUp, BookOpen, Settings, LogOut, Award, 
  Bell, Download, Search, Zap, Heart, Shield, Target,
  Calendar, Clock, Users, Sparkles, Moon, Sun
} from 'lucide-react'
import { MoodTracker } from './MoodTracker'
import { JournalView } from './JournalView'
import { AnalyticsView } from './AnalyticsView'
import { AchievementsView } from './AchievementsView'
import { SettingsView } from './SettingsView'
import { MeditationView } from './MeditationView'
import { EmergencyView } from './EmergencyView'
import { useMoodLogs } from '../hooks/useMoodLogs'
import { useAdvancedFeatures } from '../hooks/useAdvancedFeatures'
import toast, { Toaster } from 'react-hot-toast'

interface AdvancedDashboardProps {
  user: User
  onSignOut: () => void
}

export function AdvancedDashboard({ user, onSignOut }: AdvancedDashboardProps) {
  const [activeView, setActiveView] = useState<'tracker' | 'journal' | 'analytics' | 'achievements' | 'meditation' | 'emergency' | 'settings'>('tracker')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearch, setShowSearch] = useState(false)
  const [darkMode, setDarkMode] = useState(true)

  const { logs, loading, addMoodLog } = useMoodLogs(user?.id)
  const { 
    achievements, 
    userLevel, 
    notifications,
    checkForNewAchievements,
    searchJournalEntries,
    getUserStats,
    exportData
  } = useAdvancedFeatures(user?.id)

  const [userStats, setUserStats] = useState<any>(null)

  useEffect(() => {
    loadUserStats()
  }, [logs])

  const loadUserStats = async () => {
    const stats = await getUserStats()
    setUserStats(stats)
  }

  const handleMoodLog = async (data: any) => {
    const result = await addMoodLog(data)
    if (result) {
      // Check for new achievements after logging mood
      await checkForNewAchievements()
      toast.success('Mood logged successfully! 🎉')
    }
    return result
  }

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    const results = await searchJournalEntries(query)
    setSearchResults(results)
  }

  const handleExport = async (format: 'pdf' | 'json' | 'csv') => {
    await exportData({
      format,
      dateRange: 'all',
      includeJournal: true,
      includeAIResponses: true,
      includeCharts: format === 'pdf'
    })
  }

  const todayLogs = logs.filter(log => {
    const today = new Date().toISOString().split('T')[0]
    const logDate = new Date(log.created_at).toISOString().split('T')[0]
    return today === logDate
  })

  const recentMood = logs[0]?.mood || 5
  const avgMood = logs.length > 0 ? Math.round(logs.slice(0, 7).reduce((sum, log) => sum + log.mood, 0) / Math.min(logs.length, 7)) : 5

  const views = [
    { id: 'tracker', label: 'Today', icon: Plus, color: 'from-blue-500 to-purple-600' },
    { id: 'journal', label: 'Journal', icon: BookOpen, color: 'from-green-500 to-teal-600' },
    { id: 'analytics', label: 'Insights', icon: TrendingUp, color: 'from-orange-500 to-red-600' },
    { id: 'achievements', label: 'Goals', icon: Award, color: 'from-yellow-500 to-orange-600' },
    { id: 'meditation', label: 'Mindful', icon: Heart, color: 'from-pink-500 to-rose-600' },
    { id: 'emergency', label: 'Support', icon: Shield, color: 'from-red-500 to-pink-600' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'from-gray-500 to-slate-600' },
  ] as const

  const currentView = views.find(v => v.id === activeView)

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: darkMode ? '#1e293b' : '#ffffff',
            color: darkMode ? '#f1f5f9' : '#0f172a',
            border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
          },
        }}
      />

      {/* Enhanced Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`backdrop-blur-xl border-b transition-colors duration-300 ${
          darkMode 
            ? 'bg-slate-800/50 border-slate-700/50' 
            : 'bg-white/50 border-gray-200/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and User Info */}
            <div className="flex items-center space-x-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <Brain className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  MindFlow AI
                </h1>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  Welcome back, {user.email?.split('@')[0]}
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
              <div className="relative w-full">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  darkMode ? 'text-slate-400' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    handleSearch(e.target.value)
                    setShowSearch(e.target.value.length > 0)
                  }}
                  placeholder="Search your journal entries..."
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border transition-all ${
                    darkMode 
                      ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-500/50' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                />
                
                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {showSearch && searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-lg z-50 max-h-64 overflow-y-auto ${
                        darkMode 
                          ? 'bg-slate-800 border-slate-700' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      {searchResults.map((result, index) => (
                        <div
                          key={result.id}
                          className={`p-3 border-b last:border-b-0 hover:bg-opacity-50 cursor-pointer ${
                            darkMode 
                              ? 'border-slate-700 hover:bg-slate-700' 
                              : 'border-gray-100 hover:bg-gray-50'
                          }`}
                          onClick={() => {
                            setActiveView('journal')
                            setShowSearch(false)
                            setSearchQuery('')
                          }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              Mood: {result.mood}/10
                            </span>
                            <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                              {new Date(result.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className={`text-sm line-clamp-2 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                            {result.journal_entry}
                          </p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Stats and Controls */}
            <div className="flex items-center space-x-4">
              {/* User Level Badge */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`hidden sm:flex items-center space-x-2 px-3 py-2 rounded-lg ${
                  darkMode ? 'bg-slate-700/50' : 'bg-gray-100'
                }`}
              >
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Level {userLevel.level}
                </span>
                <div className={`w-16 h-1 rounded-full ${darkMode ? 'bg-slate-600' : 'bg-gray-300'}`}>
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-300"
                    style={{ width: `${(userLevel.points % 100)}%` }}
                  />
                </div>
              </motion.div>

              {/* Quick Stats */}
              <div className={`hidden lg:flex items-center space-x-4 px-4 py-2 rounded-lg ${
                darkMode ? 'bg-slate-700/50' : 'bg-gray-100'
              }`}>
                <div className="text-center">
                  <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {recentMood}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Recent
                  </div>
                </div>
                <div className={`w-px h-8 ${darkMode ? 'bg-slate-600' : 'bg-gray-300'}`}></div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {avgMood}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    7-day avg
                  </div>
                </div>
              </div>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'text-slate-400 hover:text-white hover:bg-slate-700/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>

              {/* Export Menu */}
              <div className="relative group">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode 
                      ? 'text-slate-400 hover:text-white hover:bg-slate-700/50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Download className="w-5 h-5" />
                </motion.button>
                
                <div className={`absolute right-0 top-full mt-2 w-48 rounded-xl border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 ${
                  darkMode 
                    ? 'bg-slate-800 border-slate-700' 
                    : 'bg-white border-gray-200'
                }`}>
                  <div className="p-2">
                    <button
                      onClick={() => handleExport('pdf')}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        darkMode 
                          ? 'text-slate-300 hover:bg-slate-700 hover:text-white' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      Export as PDF
                    </button>
                    <button
                      onClick={() => handleExport('json')}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        darkMode 
                          ? 'text-slate-300 hover:bg-slate-700 hover:text-white' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      Export as JSON
                    </button>
                    <button
                      onClick={() => handleExport('csv')}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        darkMode 
                          ? 'text-slate-300 hover:bg-slate-700 hover:text-white' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      Export as CSV
                    </button>
                  </div>
                </div>
              </div>

              {/* Sign Out */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSignOut}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'text-slate-400 hover:text-white hover:bg-slate-700/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Enhanced Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-7xl mx-auto px-4 py-6"
      >
        <div className={`flex space-x-2 p-2 rounded-2xl backdrop-blur-xl ${
          darkMode 
            ? 'bg-slate-800/30 border border-slate-700/50' 
            : 'bg-white/30 border border-gray-200/50'
        }`}>
          {views.map((view) => {
            const Icon = view.icon
            const isActive = activeView === view.id
            return (
              <motion.button
                key={view.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveView(view.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all relative overflow-hidden ${
                  isActive
                    ? `bg-gradient-to-r ${view.color} text-white shadow-lg`
                    : darkMode
                      ? 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className="w-5 h-5 relative z-10" />
                <span className="font-medium relative z-10 hidden sm:block">{view.label}</span>
                
                {/* Achievement notification badge */}
                {view.id === 'achievements' && achievements.filter(a => !a.notified).length > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center z-20"
                  >
                    <span className="text-xs text-white font-bold">
                      {achievements.filter(a => !a.notified).length}
                    </span>
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>
      </motion.nav>

      {/* Main Content with Enhanced Transitions */}
      <main className="max-w-7xl mx-auto px-4 pb-8">
        <AnimatePresence mode="wait">
          {activeView === 'tracker' && (
            <motion.div
              key="tracker"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <MoodTracker
                todayLogs={todayLogs}
                onAddLog={handleMoodLog}
                recentMood={recentMood}
                darkMode={darkMode}
              />
            </motion.div>
          )}

          {activeView === 'journal' && (
            <motion.div
              key="journal"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <JournalView logs={logs} loading={loading} darkMode={darkMode} />
            </motion.div>
          )}

          {activeView === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <AnalyticsView logs={logs} loading={loading} darkMode={darkMode} />
            </motion.div>
          )}

          {activeView === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <AchievementsView 
                achievements={achievements} 
                userLevel={userLevel}
                userStats={userStats}
                darkMode={darkMode}
              />
            </motion.div>
          )}

          {activeView === 'meditation' && (
            <motion.div
              key="meditation"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <MeditationView darkMode={darkMode} />
            </motion.div>
          )}

          {activeView === 'emergency' && (
            <motion.div
              key="emergency"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <EmergencyView darkMode={darkMode} />
            </motion.div>
          )}

          {activeView === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <SettingsView 
                notifications={notifications}
                darkMode={darkMode}
                onToggleDarkMode={() => setDarkMode(!darkMode)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}