import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, MessageCircle, Calendar, Filter, Search } from 'lucide-react'
import { MoodLog } from '../lib/supabase'
import { format, isToday, isYesterday, startOfWeek, isWithinInterval } from 'date-fns'

interface JournalViewProps {
  logs: MoodLog[]
  loading: boolean
}

export function JournalView({ logs, loading }: JournalViewProps) {
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const moodEmojis = {
    1: '😢', 2: '😔', 3: '😐', 4: '🙂', 5: '😊',
    6: '😄', 7: '😁', 8: '🤗', 9: '😍', 10: '🥳'
  }

  const stressColors = {
    low: 'from-green-500 to-emerald-600',
    medium: 'from-yellow-500 to-orange-500',
    high: 'from-red-500 to-pink-600'
  }

  const filteredLogs = logs.filter(log => {
    const logDate = new Date(log.created_at)
    const now = new Date()
    
    let dateMatch = true
    if (filter === 'week') {
      dateMatch = isWithinInterval(logDate, { start: startOfWeek(now), end: now })
    } else if (filter === 'month') {
      dateMatch = logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear()
    }

    const searchMatch = !searchTerm || 
      (log.journal_entry?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.ai_response?.toLowerCase().includes(searchTerm.toLowerCase()))

    return dateMatch && searchMatch && (log.journal_entry || log.ai_response)
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (isToday(date)) return 'Today'
    if (isYesterday(date)) return 'Yesterday'
    return format(date, 'MMM d, yyyy')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1 flex items-center space-x-2">
              <BookOpen className="w-7 h-7" />
              <span>Journal & Insights</span>
            </h2>
            <p className="text-slate-400">Reflect on your mental wellness journey</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your journal entries..."
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>
          <div className="flex space-x-2">
            {(['all', 'week', 'month'] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-3 rounded-xl transition-all ${
                  filter === filterOption
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                }`}
              >
                {filterOption === 'all' ? 'All Time' : filterOption === 'week' ? 'This Week' : 'This Month'}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Journal Entries */}
      {filteredLogs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center"
        >
          <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No journal entries found</h3>
          <p className="text-slate-400">
            {searchTerm ? 'Try adjusting your search terms' : 'Start logging your moods with journal entries to see them here'}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
            >
              {/* Entry Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{moodEmojis[log.mood as keyof typeof moodEmojis]}</span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{log.mood}/10</span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium bg-gradient-to-r ${stressColors[log.stress_level]} text-white`}>
                        {log.stress_level} stress
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-400 mt-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(log.created_at)} at {format(new Date(log.created_at), 'h:mm a')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Journal Entry */}
              {log.journal_entry && (
                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2">Your Thoughts</h4>
                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{log.journal_entry}</p>
                  </div>
                </div>
              )}

              {/* AI Response */}
              {log.ai_response && (
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 backdrop-blur-xl border border-blue-500/20 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-blue-200 font-medium mb-2">AI Wellness Support</h4>
                      <p className="text-slate-300 leading-relaxed">{log.ai_response}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}