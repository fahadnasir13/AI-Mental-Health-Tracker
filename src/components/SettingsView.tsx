import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, Bell, Shield, Download, Palette, Globe, 
  Moon, Sun, Smartphone, Mail, Clock, Users, Key
} from 'lucide-react'

interface SettingsViewProps {
  notifications: any
  darkMode: boolean
  onToggleDarkMode: () => void
}

export function SettingsView({ notifications, darkMode, onToggleDarkMode }: SettingsViewProps) {
  const [activeSection, setActiveSection] = useState('notifications')
  const [localNotifications, setLocalNotifications] = useState(notifications)

  const sections = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'data', label: 'Data & Export', icon: Download },
    { id: 'account', label: 'Account', icon: Users },
  ]

  const updateNotificationSetting = (key: string, value: any) => {
    setLocalNotifications(prev => ({ ...prev, [key]: value }))
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
          <Settings className="w-7 h-7" />
          <span>Settings</span>
        </h2>
        <p className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
          Customize your MindFlow AI experience
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`backdrop-blur-xl border rounded-2xl p-4 h-fit ${
            darkMode 
              ? 'bg-slate-800/50 border-slate-700/50' 
              : 'bg-white/50 border-gray-200/50'
          }`}
        >
          <nav className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <motion.button
                  key={section.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : darkMode
                        ? 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                </motion.button>
              )
            })}
          </nav>
        </motion.div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`backdrop-blur-xl border rounded-2xl p-6 ${
              darkMode 
                ? 'bg-slate-800/50 border-slate-700/50' 
                : 'bg-white/50 border-gray-200/50'
            }`}
          >
            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Notification Preferences
                </h3>

                {/* Daily Reminders */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-blue-500" />
                      <div>
                        <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Daily Check-in Reminders
                        </h4>
                        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                          Get reminded to log your mood daily
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localNotifications.dailyReminders}
                        onChange={(e) => updateNotificationSetting('dailyReminders', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {localNotifications.dailyReminders && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`ml-8 p-4 rounded-xl ${darkMode ? 'bg-slate-700/30' : 'bg-gray-100'}`}
                    >
                      <label className={`block text-sm font-medium mb-2 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Reminder Time
                      </label>
                      <input
                        type="time"
                        value={localNotifications.reminderTime || '09:00'}
                        onChange={(e) => updateNotificationSetting('reminderTime', e.target.value)}
                        className={`px-3 py-2 rounded-lg border ${
                          darkMode 
                            ? 'bg-slate-600 border-slate-500 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </motion.div>
                  )}
                </div>

                {/* Weekly Reports */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-green-500" />
                    <div>
                      <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Weekly Reports
                      </h4>
                      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                        Receive weekly mental health insights
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localNotifications.weeklyReports}
                      onChange={(e) => updateNotificationSetting('weeklyReports', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Achievement Alerts */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-5 h-5 text-yellow-500" />
                    <div>
                      <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Achievement Notifications
                      </h4>
                      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                        Get notified when you earn achievements
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localNotifications.achievementAlerts}
                      onChange={(e) => updateNotificationSetting('achievementAlerts', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Push Notifications */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-purple-500" />
                    <div>
                      <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Push Notifications
                      </h4>
                      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                        Enable browser push notifications
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localNotifications.pushEnabled}
                      onChange={(e) => updateNotificationSetting('pushEnabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            )}

            {activeSection === 'appearance' && (
              <div className="space-y-6">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Appearance Settings
                </h3>

                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {darkMode ? <Moon className="w-5 h-5 text-blue-500" /> : <Sun className="w-5 h-5 text-yellow-500" />}
                    <div>
                      <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Dark Mode
                      </h4>
                      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                        Switch between light and dark themes
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onToggleDarkMode}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      darkMode
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    }`}
                  >
                    {darkMode ? 'Dark' : 'Light'}
                  </motion.button>
                </div>

                {/* Language Selection */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-green-500" />
                    <div>
                      <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Language
                      </h4>
                      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                        Choose your preferred language
                      </p>
                    </div>
                  </div>
                  <select className={`ml-8 px-3 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-slate-600 border-slate-500 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>

                {/* AI Persona Selection */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-purple-500" />
                    <div>
                      <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        AI Persona
                      </h4>
                      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                        Choose how your AI assistant responds
                      </p>
                    </div>
                  </div>
                  <div className="ml-8 grid grid-cols-2 gap-3">
                    {[
                      { id: 'therapist', name: 'Therapist', desc: 'Professional & empathetic' },
                      { id: 'coach', name: 'Coach', desc: 'Motivational & energetic' },
                      { id: 'spiritual', name: 'Spiritual Guide', desc: 'Mindful & contemplative' },
                      { id: 'friend', name: 'Friend', desc: 'Casual & supportive' }
                    ].map((persona) => (
                      <motion.div
                        key={persona.id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          darkMode 
                            ? 'bg-slate-700/30 border-slate-600/50 hover:border-slate-500' 
                            : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <h5 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {persona.name}
                        </h5>
                        <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                          {persona.desc}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'privacy' && (
              <div className="space-y-6">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Privacy & Security
                </h3>

                {/* Data Encryption */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Key className="w-5 h-5 text-green-500" />
                    <div>
                      <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Encrypt Journal Entries
                      </h4>
                      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                        End-to-end encryption for your private thoughts
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Anonymous Analytics */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-blue-500" />
                    <div>
                      <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Anonymous Analytics
                      </h4>
                      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                        Help improve the app with anonymous usage data
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Data Retention */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <div>
                      <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Data Retention
                      </h4>
                      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                        How long to keep your data
                      </p>
                    </div>
                  </div>
                  <select className={`ml-8 px-3 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-slate-600 border-slate-500 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}>
                    <option value="forever">Keep forever</option>
                    <option value="1year">1 year</option>
                    <option value="6months">6 months</option>
                    <option value="3months">3 months</option>
                  </select>
                </div>
              </div>
            )}

            {activeSection === 'data' && (
              <div className="space-y-6">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Data Management
                </h3>

                {/* Export Options */}
                <div className="space-y-4">
                  <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Export Your Data
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { format: 'PDF', desc: 'Formatted report with charts' },
                      { format: 'JSON', desc: 'Raw data for developers' },
                      { format: 'CSV', desc: 'Spreadsheet compatible' }
                    ].map((option) => (
                      <motion.button
                        key={option.format}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          darkMode 
                            ? 'bg-slate-700/30 border-slate-600/50 hover:border-slate-500' 
                            : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {option.format}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                          {option.desc}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Data Usage */}
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-700/30' : 'bg-gray-100'}`}>
                  <h4 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Storage Usage
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>Mood Logs</span>
                      <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>2.3 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>Journal Entries</span>
                      <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>1.8 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>AI Conversations</span>
                      <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>0.9 MB</span>
                    </div>
                    <hr className={`my-2 ${darkMode ? 'border-slate-600' : 'border-gray-300'}`} />
                    <div className="flex justify-between font-medium">
                      <span className={darkMode ? 'text-white' : 'text-gray-900'}>Total</span>
                      <span className={darkMode ? 'text-white' : 'text-gray-900'}>5.0 MB</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'account' && (
              <div className="space-y-6">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Account Settings
                </h3>

                {/* Account Info */}
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-700/30' : 'bg-gray-100'}`}>
                  <h4 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Account Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>Email</span>
                      <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>user@example.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>Member since</span>
                      <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>January 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>Plan</span>
                      <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>Free</span>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="border border-red-500/30 rounded-xl p-4">
                  <h4 className="font-medium text-red-500 mb-3">Danger Zone</h4>
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Delete All Data
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete Account
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}