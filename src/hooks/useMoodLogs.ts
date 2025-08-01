import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { MoodLog } from '../lib/supabase'

export function useMoodLogs(userId: string | undefined) {
  const [logs, setLogs] = useState<MoodLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    fetchLogs()
  }, [userId])

  const fetchLogs = async () => {
    if (!userId) return

    setLoading(true)
    const { data, error } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setLogs(data)
    }
    setLoading(false)
  }

  const addMoodLog = async (moodData: {
    mood: number
    stress_level: 'low' | 'medium' | 'high'
    journal_entry?: string
  }) => {
    if (!userId) return

    const aiResponse = await getAIResponse(moodData)
    
    const { data, error } = await supabase
      .from('mood_logs')
      .insert({
        user_id: userId,
        ...moodData,
        ai_response: aiResponse,
      })
      .select()
      .single()

    if (!error && data) {
      setLogs(prev => [data, ...prev])
      return data
    }
    return null
  }

  const getAIResponse = async (moodData: {
    mood: number
    stress_level: string
    journal_entry?: string
  }) => {
    // Mock AI response for demo - replace with n8n webhook in production
    const responses = {
      low: [
        "It's wonderful that you're feeling calm and centered today. Keep nurturing this positive energy!",
        "Your peaceful state is a strength. Consider what's working well for you right now.",
        "Feeling good is something to celebrate. Take a moment to appreciate this feeling."
      ],
      medium: [
        "You're doing great by checking in with yourself. It's normal to have ups and downs.",
        "This balanced feeling shows your resilience. What small thing could make today even better?",
        "You're handling things well. Remember that it's okay to take breaks when you need them."
      ],
      high: [
        "I hear that you're going through a challenging time. Take a deep breath - you're stronger than you know.",
        "Difficult moments are temporary. Try the 4-7-8 breathing technique: breathe in for 4, hold for 7, out for 8.",
        "You're not alone in this. Consider reaching out to someone you trust or trying a short mindfulness exercise."
      ]
    }

    let category = 'medium'
    if (moodData.mood >= 8 && moodData.stress_level === 'low') category = 'low'
    if (moodData.mood <= 4 || moodData.stress_level === 'high') category = 'high'

    const options = responses[category as keyof typeof responses]
    return options[Math.floor(Math.random() * options.length)]
  }

  return {
    logs,
    loading,
    addMoodLog,
    refetch: fetchLogs
  }
}