import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Phone, MessageCircle, Heart, AlertTriangle, Users, Clock, MapPin } from 'lucide-react'

interface EmergencyViewProps {
  darkMode: boolean
}

export function EmergencyView({ darkMode }: EmergencyViewProps) {
  const [emergencyContacts, setEmergencyContacts] = useState<string[]>([])
  const [newContact, setNewContact] = useState('')

  const crisisResources = [
    {
      name: 'National Suicide Prevention Lifeline',
      number: '988',
      description: '24/7 crisis support for suicidal thoughts',
      icon: '🆘',
      color: 'from-red-500 to-pink-600'
    },
    {
      name: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      description: 'Free 24/7 crisis support via text',
      icon: '💬',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      name: 'SAMHSA National Helpline',
      number: '1-800-662-4357',
      description: 'Treatment referral and information service',
      icon: '🏥',
      color: 'from-green-500 to-emerald-600'
    },
    {
      name: 'National Domestic Violence Hotline',
      number: '1-800-799-7233',
      description: '24/7 support for domestic violence',
      icon: '🛡️',
      color: 'from-purple-500 to-indigo-600'
    }
  ]

  const copingStrategies = [
    {
      title: '5-4-3-2-1 Grounding',
      description: 'Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste',
      icon: '🌟',
      steps: [
        'Look around and name 5 things you can see',
        'Touch and name 4 things you can feel',
        'Listen and name 3 things you can hear',
        'Identify 2 things you can smell',
        'Name 1 thing you can taste'
      ]
    },
    {
      title: 'Box Breathing',
      description: 'Breathe in a 4-4-4-4 pattern to calm your nervous system',
      icon: '📦',
      steps: [
        'Inhale slowly for 4 counts',
        'Hold your breath for 4 counts',
        'Exhale slowly for 4 counts',
        'Hold empty for 4 counts',
        'Repeat 4-8 times'
      ]
    },
    {
      title: 'STOP Technique',
      description: 'A quick way to interrupt overwhelming thoughts',
      icon: '✋',
      steps: [
        'STOP what you\'re doing',
        'TAKE a deep breath',
        'OBSERVE your thoughts and feelings',
        'PROCEED with intention and awareness'
      ]
    }
  ]

  const addEmergencyContact = () => {
    if (newContact.trim() && !emergencyContacts.includes(newContact.trim())) {
      setEmergencyContacts([...emergencyContacts, newContact.trim()])
      setNewContact('')
    }
  }

  const removeContact = (contact: string) => {
    setEmergencyContacts(emergencyContacts.filter(c => c !== contact))
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
          <Shield className="w-7 h-7 text-red-500" />
          <span>Crisis Support</span>
        </h2>
        <p className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
          You're not alone. Help is available 24/7.
        </p>
      </motion.div>

      {/* Immediate Help Alert */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-red-500/10 to-pink-600/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6"
      >
        <div className="flex items-start space-x-4">
          <AlertTriangle className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              If you're in immediate danger
            </h3>
            <p className={`mb-4 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              If you're having thoughts of suicide or self-harm, please reach out for help immediately.
            </p>
            <div className="flex flex-wrap gap-3">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="tel:988"
                className="inline-flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Call 988</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="sms:741741&body=HOME"
                className="inline-flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Text HOME to 741741</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="tel:911"
                className="inline-flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Call 911</span>
              </motion.a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Crisis Resources */}
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
          <Phone className="w-5 h-5" />
          <span>Crisis Hotlines</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {crisisResources.map((resource, index) => (
            <motion.div
              key={resource.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border transition-all hover:scale-105 ${
                darkMode 
                  ? 'bg-slate-700/30 border-slate-600/50 hover:border-slate-500' 
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${resource.color} flex items-center justify-center text-xl flex-shrink-0`}>
                  {resource.icon}
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {resource.name}
                  </h4>
                  <p className={`text-lg font-mono mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {resource.number}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    {resource.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Emergency Contacts */}
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
          <Users className="w-5 h-5" />
          <span>Personal Emergency Contacts</span>
        </h3>

        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newContact}
              onChange={(e) => setNewContact(e.target.value)}
              placeholder="Add emergency contact (name and phone)"
              className={`flex-1 px-4 py-2 rounded-xl border transition-all ${
                darkMode 
                  ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-500/50' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              onKeyPress={(e) => e.key === 'Enter' && addEmergencyContact()}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addEmergencyContact}
              className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              Add
            </motion.button>
          </div>

          {emergencyContacts.length === 0 ? (
            <div className={`text-center py-8 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No emergency contacts added yet.</p>
              <p className="text-sm">Add trusted friends or family members who can support you.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {emergencyContacts.map((contact, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    darkMode ? 'bg-slate-700/30' : 'bg-gray-100'
                  }`}
                >
                  <span className={darkMode ? 'text-white' : 'text-gray-900'}>{contact}</span>
                  <button
                    onClick={() => removeContact(contact)}
                    className={`text-red-500 hover:text-red-600 transition-colors ${
                      darkMode ? 'hover:text-red-400' : ''
                    }`}
                  >
                    Remove
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Coping Strategies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`backdrop-blur-xl border rounded-2xl p-6 ${
          darkMode 
            ? 'bg-slate-800/50 border-slate-700/50' 
            : 'bg-white/50 border-gray-200/50'
        }`}
      >
        <h3 className={`text-lg font-medium mb-6 flex items-center space-x-2 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          <Heart className="w-5 h-5" />
          <span>Immediate Coping Strategies</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {copingStrategies.map((strategy, index) => (
            <motion.div
              key={strategy.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border ${
                darkMode 
                  ? 'bg-slate-700/30 border-slate-600/50' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="text-center mb-4">
                <div className="text-3xl mb-2">{strategy.icon}</div>
                <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {strategy.title}
                </h4>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  {strategy.description}
                </p>
              </div>
              
              <div className="space-y-2">
                {strategy.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className={`text-sm flex items-start space-x-2 ${
                    darkMode ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    <span className="text-blue-500 font-bold flex-shrink-0">{stepIndex + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Additional Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`backdrop-blur-xl border rounded-2xl p-6 ${
          darkMode 
            ? 'bg-slate-800/50 border-slate-700/50' 
            : 'bg-white/50 border-gray-200/50'
        }`}
      >
        <h3 className={`text-lg font-medium mb-4 flex items-center space-x-2 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          <MapPin className="w-5 h-5" />
          <span>Find Local Help</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.a
            whileHover={{ scale: 1.02 }}
            href="https://findtreatment.samhsa.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className={`p-4 rounded-xl border transition-all ${
              darkMode 
                ? 'bg-slate-700/30 border-slate-600/50 hover:border-slate-500' 
                : 'bg-gray-50 border-gray-200 hover:border-gray-300'
            }`}
          >
            <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Find Treatment Facilities
            </h4>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              Locate mental health and substance abuse treatment facilities near you
            </p>
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.02 }}
            href="https://www.psychologytoday.com/us/therapists"
            target="_blank"
            rel="noopener noreferrer"
            className={`p-4 rounded-xl border transition-all ${
              darkMode 
                ? 'bg-slate-700/30 border-slate-600/50 hover:border-slate-500' 
                : 'bg-gray-50 border-gray-200 hover:border-gray-300'
            }`}
          >
            <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Find a Therapist
            </h4>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              Search for mental health professionals in your area
            </p>
          </motion.a>
        </div>

        <div className={`mt-6 p-4 rounded-xl ${
          darkMode ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'
        }`}>
          <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
            <strong>Remember:</strong> Seeking help is a sign of strength, not weakness. You deserve support and care. 
            Your life has value, and there are people who want to help you through difficult times.
          </p>
        </div>
      </motion.div>
    </div>
  )
}