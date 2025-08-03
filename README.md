# MindFlow AI - Mental Health Tracker

A beautiful,  AI-powered mental health tracking application built with React, TypeScript, and Tailwind CSS.

## ✨ Features

- **Magic Link Authentication** - Secure, passwordless login via Supabase
- **Daily Mood Tracking** - Interactive mood and stress level logging
- **AI-Powered Insights** - Personalized wellness support and coping strategies
- **Journal Integration** - Reflect on your thoughts with AI feedback
- **Analytics Dashboard** - Visualize your mental health trends and progress
- **Beautiful UI** - Tesla/X.com inspired dark theme with smooth animations
- **Responsive Design** - Perfect experience across all devices

## 🚀 Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Animation**: Framer Motion
- **Charts**: Recharts
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: n8n + OpenAI API
- **Icons**: Lucide React
- **Build Tool**: Vite

## 🏗️ Architecture

```
Frontend (React + Tailwind)
         ↓
Backend API Routes
         ↓
┌─────────────────┬─────────────────┐
│   Supabase      │    n8n + GPT    │
│   (Auth + DB)   │   (AI Support)  │
└─────────────────┴─────────────────┘
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- Supabase account
- OpenAI API key (for AI features)

### 1. Clone and Install
```bash
git clone https://github.com/fahadnasir13/AI-Mental-Health-Tracker
cd mental-health-tracker
npm install
```

### 2. Environment Setup
Create a `.env` file with your credentials:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_N8N_WEBHOOK_URL=your-n8n-webhook-url
```

### 3. Database Schema
Create these tables in your Supabase database:

```sql
-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create mood_logs table
CREATE TABLE mood_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  mood INTEGER NOT NULL CHECK (mood >= 1 AND mood <= 10),
  stress_level TEXT NOT NULL CHECK (stress_level IN ('low', 'medium', 'high')),
  journal_entry TEXT,
  ai_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on mood_logs
ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own mood logs" ON mood_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood logs" ON mood_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mood logs" ON mood_logs
  FOR UPDATE USING (auth.uid() = user_id);
```

### 4. Development
```bash
npm run dev
```

### 5. Production Build
```bash
npm run build
npm run preview
```

## 🎯 Core Features Breakdown

### Authentication
- **Magic Link Login**: Passwordless authentication via email
- **Session Management**: Automatic token refresh and state management
- **Security**: Row Level Security (RLS) for all user data

### Mood Tracking
- **Interactive Sliders**: Smooth mood rating (1-10) with emoji feedback
- **Stress Levels**: Low/Medium/High stress tracking
- **Daily Streaks**: Gamification to encourage consistent logging

### AI Support
- **Contextual Responses**: AI analyzes mood + journal entries
- **Coping Strategies**: Personalized wellness suggestions
- **Real-time Support**: Immediate feedback on mood entries

### Analytics
- **Trend Visualization**: 7-day mood charts
- **Progress Tracking**: Streak counters and averages
- **Stress Analysis**: Distribution of stress levels over time

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6) to Purple (#8B5CF6) gradients
- **Background**: Dark slate gradients (#0F172A → #1E293B)
- **Glass Effects**: Backdrop blur with subtle borders
- **Status Colors**: Green (success), Yellow (warning), Red (high stress)

### Typography
- **Headings**: Bold, clean sans-serif
- **Body**: 150% line height for readability
- **Interactive**: Hover states and micro-animations

### Components
- **Cards**: Glassmorphism with rounded corners
- **Buttons**: Gradient backgrounds with smooth transitions
- **Forms**: Focus states with blue accent rings
- **Charts**: Custom tooltips with dark theme

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Other Platforms
- **Netlify**: Static site deployment
- **Railway**: Full-stack deployment with database
- **Render**: Container-based deployment

## 📱 Mobile Experience

- **PWA Ready**: Installable as mobile app
- **Touch Optimized**: Large tap targets and gestures
- **Responsive**: Adaptive layouts for all screen sizes
- **Performance**: Optimized loading and animations

## 🔐 Privacy & Security

- **Data Encryption**: All journal entries can be encrypted client-side
- **GDPR Compliant**: User data export and deletion
- **Anonymous Options**: Optional anonymous usage analytics
- **RLS Protection**: Database-level security policies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Roadmap

- [ ] Push notifications for daily check-ins
- [ ] Meditation timer integration
- [ ] Social features (anonymous community)
- [ ] Voice notes and transcription
- [ ] Wearable device integration
- [ ] Advanced AI insights and predictions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Supabase** - Backend infrastructure
- **OpenAI** - AI language model
- **Tailwind CSS** - Styling framework
- **Framer Motion** - Animation library
- **Recharts** - Data visualization

---

**🧠 Made with care for mental wellness**

For support or questions, please open an issue on GitHub.
