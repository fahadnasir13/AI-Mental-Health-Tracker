# n8n Workflows for MindFlow AI Mental Health Tracker

This directory contains production-ready n8n workflows that power the AI and automation features of the MindFlow AI Mental Health Tracker.

## 🔧 Workflows Overview

### 1. Mental Health AI Support Workflow (`mental-health-ai-workflow.json`)
**Purpose**: Main AI processing workflow that handles user mood logs and generates personalized responses.

**Features**:
- Emergency keyword detection with immediate crisis response
- Multi-persona AI responses (therapist, coach, spiritual guide, friend)
- Contextual coping strategies based on mood and stress levels
- OpenAI GPT-4 integration with fallback handling
- MongoDB logging for analytics and improvement
- Multi-language support
- Conversation history context

**Trigger**: Webhook POST to `/mental-health-ai`

**Input Format**:
```json
{
  "mood": 5,
  "stress_level": "medium",
  "journal_entry": "Feeling anxious about work presentation tomorrow",
  "persona": "therapist",
  "language": "en",
  "conversation_history": []
}
```

**Output Format**:
```json
{
  "ai_response": "I understand you're feeling anxious about your presentation...",
  "coping_strategies": ["Practice deep breathing", "Visualize success"],
  "emergency_detected": false,
  "confidence_score": 0.85,
  "follow_up_questions": ["What specific aspect worries you most?"],
  "meditation_suggestion": "Try a 10-minute mindfulness meditation...",
  "breathing_exercise": "Box breathing: 4-4-4-4 pattern..."
}
```

### 2. Daily Reminder Workflow (`daily-reminder-workflow.json`)
**Purpose**: Sends daily check-in reminders to users who have enabled notifications.

**Features**:
- Checks user notification preferences
- Verifies if user has already logged today
- Sends personalized email reminders
- Push notification support
- Beautiful HTML email templates
- Timezone-aware scheduling

**Schedule**: Daily at 9:00 AM (configurable per user)

### 3. Weekly Report Workflow (`weekly-report-workflow.json`)
**Purpose**: Generates comprehensive weekly mental health reports for users.

**Features**:
- Calculates weekly statistics and trends
- Identifies best and worst days
- Provides personalized insights and recommendations
- Beautiful HTML email reports with charts
- Mood trend analysis
- Stress pattern recognition
- Achievement highlighting

**Schedule**: Weekly on Sundays at 10:00 AM

## 🚀 Setup Instructions

### Prerequisites
1. n8n instance (cloud or self-hosted)
2. OpenAI API key
3. Supabase project with service key
4. MongoDB Atlas cluster (optional, for advanced logging)
5. SMTP credentials for email sending
6. Push notification service (optional)

### Environment Variables Required

```env
# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key

# MongoDB (optional)
MONGODB_WEBHOOK_URL=https://your-mongodb-webhook.com
MONGODB_API_KEY=your_mongodb_api_key

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Frontend
FRONTEND_URL=https://your-app.vercel.app

# Push Notifications (optional)
PUSH_NOTIFICATION_SERVICE_URL=https://your-push-service.com
PUSH_SERVICE_API_KEY=your_push_api_key
VAPID_PUBLIC_KEY=your_vapid_public_key
```

### Installation Steps

1. **Import Workflows**:
   - Open your n8n instance
   - Go to Workflows → Import from File
   - Import each JSON file from this directory

2. **Configure Credentials**:
   - Set up OpenAI API credentials
   - Configure Supabase HTTP credentials
   - Add SMTP email credentials
   - Set up any additional service credentials

3. **Set Environment Variables**:
   - Add all required environment variables to your n8n instance
   - Test each connection to ensure they're working

4. **Activate Workflows**:
   - Enable each workflow
   - Test the webhook endpoints
   - Verify cron schedules are correct for your timezone

5. **Test Integration**:
   - Send test requests to the AI workflow webhook
   - Verify daily reminders are working
   - Check weekly report generation

## 🔗 Integration with Frontend

### AI Service Integration
The frontend calls the n8n webhook through the `aiService.ts`:

```typescript
// In your frontend
const response = await fetch('https://your-n8n-instance.com/webhook/mental-health-ai', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    mood: 7,
    stress_level: 'low',
    journal_entry: 'Had a great day today!',
    persona: 'therapist'
  })
})

const aiResponse = await response.json()
```

### Webhook URLs
After importing, your webhook URLs will be:
- AI Support: `https://your-n8n-instance.com/webhook/mental-health-ai`
- Test endpoints available in n8n interface

## 📊 Monitoring and Analytics

### Built-in Logging
Each workflow includes comprehensive logging:
- Request/response tracking
- Error handling and fallbacks
- Performance metrics
- User interaction patterns

### MongoDB Analytics (Optional)
If MongoDB is configured, you'll get:
- Detailed AI interaction logs
- Token usage tracking
- Response quality metrics
- User behavior analytics

## 🛡️ Security Features

### Emergency Detection
The AI workflow includes sophisticated emergency keyword detection:
- Immediate crisis response
- Emergency contact notification
- Professional resource recommendations
- Safety-first approach

### Data Privacy
- All sensitive data can be encrypted
- GDPR-compliant data handling
- User consent management
- Secure credential storage

## 🔧 Customization Options

### AI Personas
Easily modify the AI personas in the workflow:
- Therapist: Professional, empathetic
- Coach: Motivational, action-oriented  
- Spiritual: Mindful, contemplative
- Friend: Casual, supportive

### Notification Timing
Adjust reminder schedules:
- Change cron expressions for different times
- Add timezone support
- Customize frequency per user

### Email Templates
Modify HTML email templates:
- Brand customization
- Content personalization
- Multi-language support

## 🚨 Troubleshooting

### Common Issues

1. **Webhook Not Responding**:
   - Check n8n workflow is active
   - Verify webhook URL is correct
   - Check environment variables

2. **OpenAI API Errors**:
   - Verify API key is valid
   - Check rate limits
   - Monitor token usage

3. **Email Not Sending**:
   - Verify SMTP credentials
   - Check spam folders
   - Test email service connection

4. **Database Connection Issues**:
   - Verify Supabase credentials
   - Check service key permissions
   - Test database connectivity

### Debug Mode
Enable debug mode in n8n to see detailed execution logs and troubleshoot issues.

## 📈 Performance Optimization

### Caching
- Implement response caching for common queries
- Cache user preferences
- Store conversation context efficiently

### Rate Limiting
- Implement user-based rate limiting
- Monitor API usage
- Set up alerts for unusual activity

### Scaling
- Use n8n cloud for automatic scaling
- Implement queue management for high volume
- Monitor workflow execution times

## 🔄 Updates and Maintenance

### Regular Tasks
- Monitor OpenAI API usage and costs
- Update AI prompts based on user feedback
- Review and improve emergency detection keywords
- Analyze user engagement metrics

### Version Control
- Export workflows regularly
- Document changes
- Test updates in staging environment
- Maintain backup configurations

## 📞 Support

For issues with these workflows:
1. Check the troubleshooting section above
2. Review n8n execution logs
3. Test individual nodes in isolation
4. Verify all credentials and environment variables

These workflows are production-ready and include comprehensive error handling, but always test thoroughly in your environment before deploying to users.