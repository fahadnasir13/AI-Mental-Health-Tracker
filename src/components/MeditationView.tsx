import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Play, Pause, RotateCcw, Clock, Sparkles } from 'lucide-react'

interface MeditationViewProps {
  darkMode: boolean
}

export function MeditationView({ darkMode }: MeditationViewProps) {
  const [selectedSession, setSelectedSession] = useState<any>(null)
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [moodBefore, setMoodBefore] = useState(5)
  const [moodAfter, setMoodAfter] = useState(5)
  const [showMoodAfter, setShowMoodAfter] = useState(false)

  const meditationSessions = [
    {
      id: 'breathing',
      title: '4-7-8 Breathing',
      description: 'Calm your nervous system with this powerful breathing technique',
      duration: 5,
      icon: '🫁',
      color: 'from-blue-500 to-cyan-500',
      instructions: [
        'Sit comfortably with your back straight',
        'Exhale completely through your mouth',
        'Inhale through your nose for 4 counts',
        'Hold your breath for 7 counts',
        'Exhale through your mouth for 8 counts',
        'Repeat this cycle 4 times'
      ]
    },
    {
      id: 'mindfulness',
      title: 'Mindful Awareness',
      description: 'Focus on the present moment and observe your thoughts',
      duration: 10,
      icon: '🧘',
      color: 'from-purple-500 to-pink-500',
      instructions: [
        'Find a quiet, comfortable position',
        'Close your eyes gently',
        'Focus on your natural breathing',
        'Notice thoughts without judgment',
        'Gently return focus to your breath',
        'Stay present and aware'
      ]
    },
    {
      id: 'loving_kindness',
      title: 'Loving Kindness',
      description: 'Cultivate compassion for yourself and others',
      duration: 15,
      icon: '💝',
      color: 'from-pink-500 to-rose-500',
      instructions: [
        'Sit comfortably and close your eyes',
        'Start by sending love to yourself',
        'Extend love to someone you care about',
        'Include someone neutral in your life',
        'Send love to someone difficult',
        'Extend love to all beings everywhere'
      ]
    },
    {
      id: 'body_scan',
      title: 'Body Scan',
      description: 'Release tension by scanning through your entire body',
      duration: 20,
      icon: '🌊',
      color: 'from-green-500 to-teal-500',
      instructions: [
        'Lie down comfortably',
        'Start at the top of your head',
        'Slowly scan down through your body',
        'Notice any tension or sensations',
        'Breathe into areas of tension',
        'End at your toes, feeling relaxed'
      ]
    }
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false)
      setShowMoodAfter(true)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft])

  const startSession = (session: any) => {
    setSelectedSession(session)
    setTimeLeft(session.duration * 60) // Convert minutes to seconds
    setIsActive(true)
    setShowMoodAfter(false)
  }

  const pauseSession = () => {
    setIsActive(!isActive)
  }

  const resetSession = () => {
    setIsActive(false)
    setTimeLeft(selectedSession ? selectedSession.duration * 60 : 0)
    setShowMoodAfter(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const completeSession = async () => {
    // Here you would log the meditation session
    console.log('Meditation session completed:', {
      session_type: selectedSession.id,
      duration_minutes: selectedSession.duration,
      mood_before: moodBefore,
      mood_after: moodAfter
    })
    
    setSelectedSession(null)
    setShowMoodAfter(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`backdrop-blur-xl border rounded-2xl p-6 ${
          darkMode 
            ? 'bg-slate-800/50 border-slate-700/50' 
            : 'bg-white/50 border-gray-200/50'
        }`}
      >
        <h2 className={`text-2xl font-bold mb-1 flex items-center space-x-2 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          <Heart className="w-7 h-7 text-pink-500" />
          <span>Mindful Moments</span>
        </h2>
        <p className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
          Take a moment to center yourself and find inner peace
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!selectedSession ? (
          /* Session Selection */
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {meditationSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`backdrop-blur-xl border rounded-2xl p-6 cursor-pointer transition-all ${
                  darkMode 
                    ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600' 
                    : 'bg-white/50 border-gray-200/50 hover:border-gray-300'
                }`}
                onClick={() => {
                  setSelectedSession(session)
                  setMoodBefore(5)
                }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${session.color} flex items-center justify-center text-2xl`}>
                    {session.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {session.title}
                    </h3>
                    <p className={`text-sm mb-3 ${
                      darkMode ? 'text-slate-400' : 'text-gray-600'
                    }`}>
                      {session.description}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className={`text-sm ${
                        darkMode ? 'text-slate-300' : 'text-gray-700'
                      }`}>
                        {session.duration} minutes
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : !isActive && !showMoodAfter ? (
          /* Pre-Session Setup */
          <motion.div
            key="setup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`backdrop-blur-xl border rounded-2xl p-8 text-center ${
              darkMode 
                ? 'bg-slate-800/50 border-slate-700/50' 
                : 'bg-white/50 border-gray-200/50'
            }`}
          >
            <div className={`w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-r ${selectedSession.color} flex items-center justify-center text-4xl`}>
              {selectedSession.icon}
            </div>
            
            <h3 className={`text-2xl font-bold mb-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {selectedSession.title}
            </h3>
            
            <p className={`text-lg mb-6 ${
              darkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>
              {selectedSession.duration} minute session
            </p>

            {/* Mood Before */}
            <div className="mb-8">
              <label className={`block text-lg font-medium mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                How are you feeling right now? {moodBefore}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={moodBefore}
                onChange={(e) => setMoodBefore(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm mt-2">
                <span className={darkMode ? 'text-slate-400' : 'text-gray-500'}>Stressed</span>
                <span className={darkMode ? 'text-slate-400' : 'text-gray-500'}>Peaceful</span>
              </div>
            </div>

            {/* Instructions */}
            <div className={`text-left mb-8 p-6 rounded-xl ${
              darkMode ? 'bg-slate-700/30' : 'bg-gray-100'
            }`}>
              <h4 className={`font-semibold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Session Guide:
              </h4>
              <ul className="space-y-2">
                {selectedSession.instructions.map((instruction: string, index: number) => (
                  <li key={index} className={`flex items-start space-x-2 ${
                    darkMode ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    <span className="text-blue-500 font-bold">{index + 1}.</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex space-x-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedSession(null)}
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                  darkMode 
                    ? 'bg-slate-700 text-white hover:bg-slate-600' 
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                Back
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => startSession(selectedSession)}
                className={`px-8 py-3 rounded-xl font-medium text-white bg-gradient-to-r ${selectedSession.color} hover:opacity-90 transition-opacity flex items-center space-x-2`}
              >
                <Play className="w-5 h-5" />
                <span>Begin Session</span>
              </motion.button>
            </div>
          </motion.div>
        ) : isActive || timeLeft > 0 ? (
          /* Active Session */
          <motion.div
            key="active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`backdrop-blur-xl border rounded-2xl p-12 text-center ${
              darkMode 
                ? 'bg-slate-800/50 border-slate-700/50' 
                : 'bg-white/50 border-gray-200/50'
            }`}
          >
            {/* Breathing Animation Circle */}
            <motion.div
              animate={isActive ? {
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              } : {}}
              transition={isActive ? {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              } : {}}
              className={`w-48 h-48 mx-auto mb-8 rounded-full bg-gradient-to-r ${selectedSession.color} flex items-center justify-center text-6xl`}
            >
              {selectedSession.icon}
            </motion.div>

            <h3 className={`text-3xl font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {formatTime(timeLeft)}
            </h3>

            <p className={`text-lg mb-8 ${
              darkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>
              {isActive ? 'Breathe deeply and stay present' : 'Session paused'}
            </p>

            <div className="flex space-x-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={pauseSession}
                className={`p-4 rounded-full ${
                  darkMode 
                    ? 'bg-slate-700 text-white hover:bg-slate-600' 
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                } transition-colors`}
              >
                {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetSession}
                className={`p-4 rounded-full ${
                  darkMode 
                    ? 'bg-slate-700 text-white hover:bg-slate-600' 
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                } transition-colors`}
              >
                <RotateCcw className="w-6 h-6" />
              </motion.button>
            </div>
          </motion.div>
        ) : showMoodAfter ? (
          /* Post-Session Mood Check */
          <motion.div
            key="completion"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`backdrop-blur-xl border rounded-2xl p-8 text-center ${
              darkMode 
                ? 'bg-slate-800/50 border-slate-700/50' 
                : 'bg-white/50 border-gray-200/50'
            }`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center"
            >
              <Sparkles className="w-12 h-12 text-white" />
            </motion.div>

            <h3 className={`text-2xl font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Session Complete! 🎉
            </h3>

            <p className={`text-lg mb-8 ${
              darkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>
              How are you feeling now?
            </p>

            <div className="mb-8">
              <label className={`block text-lg font-medium mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Current mood: {moodAfter}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={moodAfter}
                onChange={(e) => setMoodAfter(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm mt-2">
                <span className={darkMode ? 'text-slate-400' : 'text-gray-500'}>Stressed</span>
                <span className={darkMode ? 'text-slate-400' : 'text-gray-500'}>Peaceful</span>
              </div>
            </div>

            {moodAfter > moodBefore && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl mb-6 ${
                  darkMode ? 'bg-green-500/20 border border-green-500/30' : 'bg-green-50 border border-green-200'
                }`}
              >
                <p className={`text-green-600 font-medium ${darkMode ? 'text-green-400' : ''}`}>
                  Great! Your mood improved by {moodAfter - moodBefore} points! 🌟
                </p>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={completeSession}
              className="px-8 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 transition-opacity"
            >
              Complete Session
            </motion.button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}