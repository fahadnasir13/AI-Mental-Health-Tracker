// Advanced AI Service with n8n integration and fallback
import CryptoJS from 'crypto-js'

export interface AIRequest {
  mood: number
  stress_level: string
  journal_entry?: string
  conversation_history?: any[]
  user_persona?: string
  language?: string
  emergency_keywords?: string[]
}

export interface AIResponse {
  response: string
  coping_strategies: string[]
  emergency_detected: boolean
  confidence_score: number
  follow_up_questions: string[]
  meditation_suggestion?: string
  breathing_exercise?: string
}

class AIService {
  private n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL
  private encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY || 'default-key-change-in-production'

  // Emergency keywords detection
  private emergencyKeywords = [
    'suicide', 'kill myself', 'end it all', 'hurt myself', 'self harm',
    'want to die', 'no point living', 'better off dead', 'harm myself'
  ]

  // Encrypt sensitive data
  private encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, this.encryptionKey).toString()
  }

  // Decrypt sensitive data
  private decrypt(encryptedText: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedText, this.encryptionKey)
    return bytes.toString(CryptoJS.enc.Utf8)
  }

  // Check for emergency keywords
  private detectEmergency(text: string): boolean {
    const lowerText = text.toLowerCase()
    return this.emergencyKeywords.some(keyword => lowerText.includes(keyword))
  }

  // Main AI processing function
  async processAIRequest(request: AIRequest): Promise<AIResponse> {
    try {
      // Check for emergency first
      const emergencyDetected = request.journal_entry ? 
        this.detectEmergency(request.journal_entry) : false

      if (emergencyDetected) {
        return this.getEmergencyResponse()
      }

      // Try n8n webhook first
      if (this.n8nWebhookUrl) {
        try {
          const n8nResponse = await this.callN8nWebhook(request)
          if (n8nResponse) return n8nResponse
        } catch (error) {
          console.warn('n8n webhook failed, falling back to local AI')
        }
      }

      // Fallback to local AI processing
      return this.getLocalAIResponse(request)
    } catch (error) {
      console.error('AI Service error:', error)
      return this.getDefaultResponse(request)
    }
  }

  // n8n Webhook Integration
  private async callN8nWebhook(request: AIRequest): Promise<AIResponse | null> {
    const response = await fetch(this.n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_N8N_API_KEY || ''}`
      },
      body: JSON.stringify({
        mood: request.mood,
        stress_level: request.stress_level,
        journal_entry: request.journal_entry,
        persona: request.user_persona || 'therapist',
        language: request.language || 'en',
        conversation_history: request.conversation_history || []
      })
    })

    if (!response.ok) throw new Error('n8n webhook failed')

    const data = await response.json()
    return {
      response: data.ai_response || data.response,
      coping_strategies: data.coping_strategies || [],
      emergency_detected: false,
      confidence_score: data.confidence_score || 0.8,
      follow_up_questions: data.follow_up_questions || [],
      meditation_suggestion: data.meditation_suggestion,
      breathing_exercise: data.breathing_exercise
    }
  }

  // Advanced local AI responses based on mood and context
  private getLocalAIResponse(request: AIRequest): AIResponse {
    const { mood, stress_level, journal_entry, user_persona = 'therapist' } = request

    // Determine response category
    let category = 'neutral'
    if (mood <= 3 || stress_level === 'high') category = 'support'
    else if (mood >= 8 && stress_level === 'low') category = 'celebrate'
    else if (mood >= 6) category = 'encourage'

    const responses = this.getResponsesByPersona(user_persona, category, mood, stress_level)
    const copingStrategies = this.getCopingStrategies(mood, stress_level)
    const followUpQuestions = this.getFollowUpQuestions(category)

    return {
      response: this.selectRandomResponse(responses),
      coping_strategies: copingStrategies,
      emergency_detected: false,
      confidence_score: 0.85,
      follow_up_questions: followUpQuestions,
      meditation_suggestion: this.getMeditationSuggestion(stress_level),
      breathing_exercise: this.getBreathingExercise(stress_level)
    }
  }

  private getResponsesByPersona(persona: string, category: string, mood: number, stress: string) {
    const responses = {
      therapist: {
        support: [
          "I hear that you're going through a difficult time right now. It's completely valid to feel this way, and I want you to know that these feelings are temporary.",
          "Thank you for sharing this with me. It takes courage to acknowledge when we're struggling. Let's work through this together.",
          "Your feelings are important and deserve attention. What you're experiencing is real, and there are ways we can help you feel better."
        ],
        encourage: [
          "It sounds like you're managing things well despite some challenges. That shows real resilience on your part.",
          "I notice you're maintaining a balanced perspective even when things aren't perfect. That's a valuable skill.",
          "You're doing better than you might realize. Sometimes we need to pause and acknowledge our progress."
        ],
        celebrate: [
          "It's wonderful to hear that you're feeling so positive! This is a great time to reflect on what's contributing to this good feeling.",
          "Your positive energy is evident, and it's beautiful to witness. What do you think is working well for you right now?",
          "This is a moment to savor. High points like these can teach us a lot about what brings us joy and peace."
        ],
        neutral: [
          "Thank you for checking in today. How would you like to use our time together?",
          "I'm here to listen and support you. What's on your mind today?",
          "Every day brings its own experiences. What would be most helpful to explore right now?"
        ]
      },
      coach: {
        support: [
          "Champions face tough moments - that's what makes the victories so sweet. You've got the strength to push through this.",
          "This is your training ground. Every challenge you face is building your mental muscle for bigger wins ahead.",
          "I see a fighter in you. Let's turn this struggle into your comeback story. What's one small step you can take right now?"
        ],
        encourage: [
          "You're in the game and playing well! Keep that momentum going - you're closer to your breakthrough than you think.",
          "I love seeing this steady progress. You're building something great, one day at a time.",
          "This is exactly the kind of consistency that leads to major wins. Stay focused on your goals!"
        ],
        celebrate: [
          "YES! This is what I'm talking about! You're absolutely crushing it right now - soak in this victory!",
          "Look at you go! This high energy and positive mindset is your secret weapon. How can we bottle this feeling?",
          "You're on fire! This is the energy that moves mountains. What big dreams are calling your name right now?"
        ],
        neutral: [
          "Ready to level up today? I'm here to help you unlock your potential.",
          "Every day is a new opportunity to grow stronger. What's your focus today?",
          "You've got this! What challenge are we tackling together today?"
        ]
      },
      spiritual: {
        support: [
          "In this moment of difficulty, remember that you are held by something greater than yourself. This pain is not your final destination.",
          "The universe has a way of using our darkest moments to prepare us for our greatest light. Trust in the process, even when it's hard to see.",
          "Your soul is stronger than any temporary storm. Breathe deeply and connect with the peace that exists within you, always."
        ],
        encourage: [
          "I sense a beautiful balance in your energy today. You're learning to dance with life's rhythms with grace.",
          "There's a quiet wisdom in how you're navigating this journey. Trust your inner guidance - it knows the way.",
          "Your spirit is growing stronger through both the challenges and the calm moments. This is sacred work you're doing."
        ],
        celebrate: [
          "Your light is shining so brightly today! This joy you're feeling is your soul's natural state - remember this feeling.",
          "What a beautiful reminder of the abundance that flows through you when you're aligned with your highest self.",
          "This radiant energy you're experiencing is a gift not just to you, but to everyone whose life you touch. Shine on!"
        ],
        neutral: [
          "Welcome to this sacred space of reflection. What is your heart calling you to explore today?",
          "In this moment of stillness, what wisdom is trying to emerge from within you?",
          "You are exactly where you need to be. What would serve your highest good right now?"
        ]
      },
      friend: {
        support: [
          "Hey, I'm really glad you felt comfortable sharing this with me. You don't have to go through this alone - I'm here for you.",
          "That sounds really tough, and I want you to know that what you're feeling makes total sense given what you're dealing with.",
          "I care about you, and I can see you're hurting right now. Let's figure out some ways to help you feel a bit better, okay?"
        ],
        encourage: [
          "You know what? I think you're handling this really well. It might not feel like it, but you're stronger than you give yourself credit for.",
          "I've been thinking about how much you've grown lately. Even on the harder days, you keep showing up, and that means something.",
          "You're doing great, honestly. Life isn't always easy, but you're navigating it with such grace."
        ],
        celebrate: [
          "Oh my gosh, I LOVE seeing you this happy! Your energy is absolutely contagious right now - tell me everything!",
          "This is amazing! You deserve all this good stuff that's happening. I'm so happy for you!",
          "YES! This is the energy I love to see from you! You're absolutely glowing right now!"
        ],
        neutral: [
          "Hey there! How's your day going? I'm here if you want to chat about anything.",
          "What's up? I'm all ears if you want to share what's on your mind.",
          "Good to see you! What's been happening in your world lately?"
        ]
      }
    }

    return responses[persona as keyof typeof responses]?.[category as keyof typeof responses.therapist] || responses.therapist.neutral
  }

  private getCopingStrategies(mood: number, stress: string): string[] {
    const strategies = []

    if (mood <= 4 || stress === 'high') {
      strategies.push(
        "Try the 5-4-3-2-1 grounding technique: 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste",
        "Practice deep breathing: 4 counts in, hold for 4, out for 6",
        "Take a 10-minute walk outside if possible",
        "Write down 3 things you're grateful for today"
      )
    }

    if (stress === 'medium' || (mood >= 4 && mood <= 7)) {
      strategies.push(
        "Try progressive muscle relaxation",
        "Listen to calming music or nature sounds",
        "Do some gentle stretching or yoga",
        "Call a friend or family member"
      )
    }

    if (mood >= 7 && stress === 'low') {
      strategies.push(
        "Engage in a creative activity you enjoy",
        "Plan something fun for later this week",
        "Share your positive energy with someone else",
        "Reflect on what's working well in your life"
      )
    }

    return strategies.slice(0, 3) // Return top 3 strategies
  }

  private getFollowUpQuestions(category: string): string[] {
    const questions = {
      support: [
        "What's one small thing that might bring you a moment of peace today?",
        "Who in your life makes you feel supported and understood?",
        "What has helped you get through difficult times before?"
      ],
      encourage: [
        "What's one thing you're proud of about how you're handling things?",
        "What positive changes have you noticed in yourself lately?",
        "What are you looking forward to in the coming days?"
      ],
      celebrate: [
        "What do you think is contributing most to this positive feeling?",
        "How can you carry this energy into the rest of your week?",
        "What would you like to do to honor this good moment?"
      ],
      neutral: [
        "What's been on your mind lately?",
        "How would you like to focus your energy today?",
        "What would make today feel meaningful for you?"
      ]
    }

    return questions[category as keyof typeof questions] || questions.neutral
  }

  private getMeditationSuggestion(stress: string): string {
    const suggestions = {
      high: "Try a 5-minute loving-kindness meditation: Start by sending love to yourself, then extend it to loved ones, neutral people, difficult people, and finally all beings.",
      medium: "Practice a 10-minute mindfulness meditation: Focus on your breath and gently return attention to breathing whenever your mind wanders.",
      low: "Enjoy a 15-minute gratitude meditation: Reflect on things you're thankful for, allowing feelings of appreciation to fill your heart."
    }
    return suggestions[stress as keyof typeof suggestions] || suggestions.medium
  }

  private getBreathingExercise(stress: string): string {
    const exercises = {
      high: "4-7-8 Breathing: Inhale for 4 counts, hold for 7, exhale for 8. Repeat 4 times. This activates your parasympathetic nervous system.",
      medium: "Box Breathing: Inhale for 4, hold for 4, exhale for 4, hold for 4. Repeat for 2-3 minutes. Used by Navy SEALs for stress management.",
      low: "Coherent Breathing: Breathe in and out for 5 counts each. This creates heart rate variability and promotes calm alertness."
    }
    return exercises[stress as keyof typeof exercises] || exercises.medium
  }

  private getEmergencyResponse(): AIResponse {
    return {
      response: "I'm very concerned about what you've shared. You're not alone, and there are people who want to help. Please reach out to a crisis helpline: National Suicide Prevention Lifeline: 988 or Crisis Text Line: Text HOME to 741741. Your life has value, and there are people trained to support you through this difficult time.",
      coping_strategies: [
        "Call 988 (National Suicide Prevention Lifeline) immediately",
        "Text HOME to 741741 (Crisis Text Line)",
        "Go to your nearest emergency room",
        "Call a trusted friend or family member to stay with you"
      ],
      emergency_detected: true,
      confidence_score: 1.0,
      follow_up_questions: [
        "Do you have someone who can stay with you right now?",
        "Have you contacted a crisis helpline before?",
        "What has helped you feel safer in the past?"
      ],
      meditation_suggestion: "Focus on staying present and safe. Try counting your breaths: 1 on inhale, 2 on exhale, up to 10, then start over.",
      breathing_exercise: "Emergency grounding: Take slow, deep breaths while naming 5 things you can see around you right now."
    }
  }

  private getDefaultResponse(request: AIRequest): AIResponse {
    return {
      response: "Thank you for sharing with me today. I'm here to support you on your mental health journey. While I process your request, remember that taking time to check in with yourself is a positive step.",
      coping_strategies: [
        "Take three deep breaths",
        "Drink a glass of water",
        "Step outside for fresh air"
      ],
      emergency_detected: false,
      confidence_score: 0.5,
      follow_up_questions: [
        "How are you feeling right now?",
        "What would be most helpful for you today?"
      ]
    }
  }

  private selectRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // Conversation management
  async saveConversation(userId: string, conversation: AIMessage[]) {
    // Encrypt conversation before saving
    const encryptedConversation = conversation.map(msg => ({
      ...msg,
      content: this.encrypt(msg.content)
    }))

    // Save to Supabase or MongoDB
    // Implementation depends on your storage choice
  }

  async getConversationHistory(userId: string): Promise<AIMessage[]> {
    // Retrieve and decrypt conversation history
    // Implementation depends on your storage choice
    return []
  }
}

export const aiService = new AIService()