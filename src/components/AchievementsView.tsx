import React from 'react'
import { motion } from 'framer-motion'
import { Award, Trophy, Star, Target, Zap, Calendar, TrendingUp, Heart } from 'lucide-react'

interface AchievementsViewProps {
  achievements: any[]
  userLevel: { level: number; points: number; nextLevelPoints: number }
  userStats: any
  darkMode: boolean
}

export function AchievementsView({ achievements, userLevel, userStats, darkMode }: AchievementsViewProps) {
  const progressPercentage = ((userLevel.points % 100) / 100) * 100

  const achievementCategories = [
    { id: 'streak', name: 'Consistency', icon: Calendar, color: 'from-blue-500 to-cyan-500' },
    { id: 'milestone', name: 'Milestones', icon: Target, color: 'from-purple-500 to-pink-500' },
    { id: 'mood', name: 'Wellness', icon: Heart, color: 'from-green-500 to-emerald-500' },
    { id: 'journal', name: 'Reflection', icon: Star, color: 'from-yellow-500 to-orange-500' },
  ]

  const upcomingAchievements = [
    { title: 'Week Warrior', description: '7 days in a row', progress: 5, target: 7, icon: '🔥' },
    { title: 'Century Club', description: '100 mood entries', progress: userStats?.total_entries || 0, target: 100, icon: '💯' },
    { title: 'Reflection Master', description: '25 journal entries', progress: userStats?.journal_entries || 0, target: 25, icon: '📚' },
    { title: 'AI Companion', description: '10 AI conversations', progress: userStats?.ai_interactions || 0, target: 10, icon: '🤖' },
  ]

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`backdrop-blur-xl border rounded-2xl p-6 ${
          darkMode 
            ? 'bg-slate-800/50 border-slate-700/50' 
            : 'bg-white/50 border-gray-200/50'
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Level {userLevel.level}
            </h2>
            <p className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              {userLevel.points} / {userLevel.nextLevelPoints} XP
            </p>
          </div>
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
            <Trophy className="w-10 h-10 text-white" />
          </div>
        </div>

        <div className={`w-full h-4 rounded-full mb-4 ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`text-center p-4 rounded-xl ${darkMode ? 'bg-slate-700/30' : 'bg-gray-100'}`}>
            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {userStats?.total_entries || 0}
            </div>
            <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              Total Entries
            </div>
          </div>
          <div className={`text-center p-4 rounded-xl ${darkMode ? 'bg-slate-700/30' : 'bg-gray-100'}`}>
            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {userStats?.current_streak || 0}
            </div>
            <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              Current Streak
            </div>
          </div>
          <div className={`text-center p-4 rounded-xl ${darkMode ? 'bg-slate-700/30' : 'bg-gray-100'}`}>
            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {userStats?.average_mood || 0}
            </div>
            <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              Avg Mood
            </div>
          </div>
          <div className={`text-center p-4 rounded-xl ${darkMode ? 'bg-slate-700/30' : 'bg-gray-100'}`}>
            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {achievements.length}
            </div>
            <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              Achievements
            </div>
          </div>
        </div>
      </motion.div>

      {/* Earned Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`backdrop-blur-xl border rounded-2xl p-6 ${
          darkMode 
            ? 'bg-slate-800/50 border-slate-700/50' 
            : 'bg-white/50 border-gray-200/50'
        }`}
      >
        <h3 className={`text-lg font-medium mb-6 flex items-center space-x-2 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          <Award className="w-5 h-5" />
          <span>Your Achievements</span>
        </h3>

        {achievements.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`} />
            <h4 className={`text-xl font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Start Your Journey
            </h4>
            <p className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              Log your first mood entry to earn your first achievement!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border transition-all hover:scale-105 ${
                  darkMode 
                    ? 'bg-slate-700/30 border-slate-600/50 hover:border-slate-500' 
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div>
                    <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      {achievement.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    darkMode ? 'bg-slate-600 text-slate-300' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {achievement.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {achievement.points || 0} XP
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Upcoming Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`backdrop-blur-xl border rounded-2xl p-6 ${
          darkMode 
            ? 'bg-slate-800/50 border-slate-700/50' 
            : 'bg-white/50 border-gray-200/50'
        }`}
      >
        <h3 className={`text-lg font-medium mb-6 flex items-center space-x-2 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          <Target className="w-5 h-5" />
          <span>Next Goals</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingAchievements.map((goal, index) => {
            const progress = Math.min((goal.progress / goal.target) * 100, 100)
            const isCompleted = goal.progress >= goal.target
            
            return (
              <motion.div
                key={goal.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border ${
                  isCompleted
                    ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30'
                    : darkMode 
                      ? 'bg-slate-700/30 border-slate-600/50' 
                      : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{goal.icon}</div>
                    <div>
                      <h4 className={`font-medium ${
                        isCompleted 
                          ? 'text-green-400' 
                          : darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {goal.title}
                      </h4>
                      <p className={`text-sm ${
                        darkMode ? 'text-slate-400' : 'text-gray-600'
                      }`}>
                        {goal.description}
                      </p>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${
                    isCompleted 
                      ? 'text-green-400' 
                      : darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {goal.progress}/{goal.target}
                  </div>
                </div>
                
                <div className={`w-full h-2 rounded-full ${
                  darkMode ? 'bg-slate-600' : 'bg-gray-200'
                }`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      isCompleted
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500'
                    }`}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Achievement Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`backdrop-blur-xl border rounded-2xl p-6 ${
          darkMode 
            ? 'bg-slate-800/50 border-slate-700/50' 
            : 'bg-white/50 border-gray-200/50'
        }`}
      >
        <h3 className={`text-lg font-medium mb-6 flex items-center space-x-2 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          <Star className="w-5 h-5" />
          <span>Categories</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievementCategories.map((category) => {
            const Icon = category.icon
            const categoryAchievements = achievements.filter(a => a.category === category.id)
            
            return (
              <motion.div
                key={category.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-xl text-center cursor-pointer transition-all ${
                  darkMode 
                    ? 'bg-slate-700/30 hover:bg-slate-700/50' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h4 className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {category.name}
                </h4>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  {categoryAchievements.length} earned
                </p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}