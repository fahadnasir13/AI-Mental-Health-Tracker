import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Heart, MessageCircle, TrendingUp, Award } from 'lucide-react'
import { MoodLog } from '../lib/supabase'
import Confetti from 'react-confetti'

interface MoodTrackerProps {
  todayLogs: MoodLog[]
  onAddLog: (data: { mood: number; stress_level: 'low' | 'medium' | 'high'; journal_entry?: string }) => Promise<MoodLog | null>
  recentMood: number
}

export function MoodTracker({ todayLogs, onAddLog, recentMood }: MoodTrackerProps) {
  const [mood, setMood] = useState(5)
  const [stressLevel, setStressLevel] = useState<'low' | 'medium' | 'high'>('medium')
  const [journalEntry, setJournalEntry] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [latestResponse, setLatestResponse] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const moodEmojis = {
    1: '😢', 2: '😔', 3: '😐', 4: '🙂', 5: '😊',
    6: '😄', 7: '😁', 8: '🤗', 9: '😍', 10: '🥳'
  }

  const stressColors = {
    low: 'from-green-500 to-emerald-600',
    medium: 'from-yellow-500 to-orange-500',
    high: 'from-red-500 to-pink-600'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    const result = await onAddLog({
      mood,
      stress_level: stressLevel,
      journal_entry: journalEntry || undefined
    })

    if (result) {
      setLatestResponse(result.ai_response || null)
      setJournalEntry('')
      
      // Show confetti for high moods or first log of the day
      if (mood >= 8 || todayLogs.length === 0) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }
    }
    setIsSubmitting(false)
  }

  const hasLoggedToday = todayLogs.length > 0

  return (
    <div className="space-y-6">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}

      {/* Today's Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">How are you feeling today?</h2>
            <p className="text-slate-400">
              {hasLoggedToday ? `You've logged ${todayLogs.length} entries today` : "Let's check in with your mental wellness"}
            </p>
          </div>
          {hasLoggedToday && (
            <div className="flex items-center space-x-2 bg-green-500/20 text-green-400 px-3 py-2 rounded-lg">
              <Award className="w-5 h-5" />
              <span className="text-sm font-medium">Checked In</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mood Slider */}
          <div>
            <label className="block text-lg font-medium text-white mb-4">
              Mood Level: {mood}/10 <span className="text-3xl ml-2">{moodEmojis[mood as keyof typeof moodEmojis]}</span>
            </label>
            <div className="relative">
              <input
                type="range"
                min="1"
                max="10"
                value={mood}
                onChange={(e) => setMood(Number(e.target.value))}
                className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer mood-slider"
                style={{
                  background: `linear-gradient(to right, #ef4444 0%, #f97316 20%, #eab308 40%, #22c55e 60%, #3b82f6 80%, #8b5cf6 100%)`
                }}
              />
              <div 
                className="absolute top-0 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg pointer-events-none"
                style={{ width: `${(mood / 10) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>Very Low</span>
              <span>Excellent</span>
            </div>
          </div>

          {/* Stress Level */}
          <div>
            <label className="block text-lg font-medium text-white mb-4">Stress Level</label>
            <div className="grid grid-cols-3 gap-3">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <motion.button
                  key={level}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStressLevel(level)}
                  className={`p-4 rounded-xl text-center transition-all ${
                    stressLevel === level
                      ? `bg-gradient-to-r ${stressColors[level]} text-white shadow-lg`
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                  }`}
                >
                  <div className="font-medium capitalize">{level}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Journal Entry */}
          <div>
            <label className="block text-lg font-medium text-white mb-4">
              Journal Entry <span className="text-sm text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="What's on your mind? Share your thoughts, feelings, or what happened today..."
              className="w-full p-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Get AI Support & Log Entry</span>
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* AI Response */}
      {latestResponse && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6"
        >
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">AI Wellness Support</h3>
              <p className="text-slate-300 leading-relaxed">{latestResponse}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent Entries Preview */}
      {todayLogs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
        >
          <h3 className="text-lg font-medium text-white mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Today's Entries</span>
          </h3>
          <div className="space-y-3">
            {todayLogs.slice(0, 3).map((log, index) => (
              <div key={log.id} className="bg-slate-700/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{moodEmojis[log.mood as keyof typeof moodEmojis]}</span>
                    <span className="text-white font-medium">{log.mood}/10</span>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium bg-gradient-to-r ${stressColors[log.stress_level]} text-white`}>
                      {log.stress_level} stress
                    </span>
                  </div>
                  <span className="text-sm text-slate-400">
                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {log.journal_entry && (
                  <p className="text-slate-300 text-sm mb-2">{log.journal_entry.substring(0, 150)}...</p>
                )}
                {log.ai_response && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mt-2">
                    <p className="text-blue-200 text-sm">{log.ai_response.substring(0, 200)}...</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}