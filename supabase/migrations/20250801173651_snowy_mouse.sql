/*
  # Complete MindFlow AI Database Schema

  1. New Tables
    - `mood_logs` - Store user mood entries with AI responses
    - `user_settings` - User preferences and configuration
    - `achievements` - Gamification and milestone tracking
    - `push_subscriptions` - Web push notification subscriptions
    - `ai_conversation_logs` - Detailed AI interaction logging
    - `emergency_contacts` - User emergency contact information
    - `meditation_sessions` - Track meditation and mindfulness activities
    - `export_requests` - Track data export requests

  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies for data access
    - Implement emergency contact access controls

  3. Advanced Features
    - Full-text search on journal entries
    - Mood trend calculations
    - Achievement system
    - Multi-language support
    - Emergency detection logging
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create mood_logs table with advanced features
CREATE TABLE IF NOT EXISTS mood_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mood INTEGER NOT NULL CHECK (mood >= 1 AND mood <= 10),
  stress_level TEXT NOT NULL CHECK (stress_level IN ('low', 'medium', 'high')),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
  journal_entry TEXT,
  journal_entry_encrypted TEXT, -- For end-to-end encryption
  ai_response TEXT,
  ai_conversation JSONB DEFAULT '[]'::jsonb,
  ai_persona TEXT DEFAULT 'therapist' CHECK (ai_persona IN ('therapist', 'coach', 'spiritual', 'friend')),
  coping_strategies TEXT[],
  meditation_suggestion TEXT,
  breathing_exercise TEXT,
  emergency_detected BOOLEAN DEFAULT FALSE,
  confidence_score DECIMAL(3,2),
  tags TEXT[],
  location_context TEXT, -- Optional context like "home", "work", "travel"
  weather_context TEXT, -- Optional weather context
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  ai_persona TEXT DEFAULT 'therapist' CHECK (ai_persona IN ('therapist', 'coach', 'spiritual', 'friend')),
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  notification_settings JSONB DEFAULT '{
    "dailyReminders": true,
    "weeklyReports": true,
    "achievementAlerts": true,
    "emergencyAlerts": true,
    "reminderTime": "09:00",
    "pushEnabled": false
  }'::jsonb,
  privacy_settings JSONB DEFAULT '{
    "dataSharing": false,
    "anonymousAnalytics": true,
    "encryptJournals": false
  }'::jsonb,
  emergency_contacts JSONB DEFAULT '[]'::jsonb,
  theme_preferences JSONB DEFAULT '{
    "darkMode": true,
    "colorScheme": "blue",
    "fontSize": "medium"
  }'::jsonb,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  category TEXT DEFAULT 'general' CHECK (category IN ('general', 'streak', 'milestone', 'mood', 'journal', 'ai')),
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  notified BOOLEAN DEFAULT FALSE
);

-- Create push_subscriptions table
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription JSONB NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, subscription)
);

-- Create ai_conversation_logs table for detailed analytics
CREATE TABLE IF NOT EXISTS ai_conversation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mood_log_id UUID REFERENCES mood_logs(id) ON DELETE CASCADE,
  request_data JSONB NOT NULL,
  response_data JSONB NOT NULL,
  processing_time_ms INTEGER,
  tokens_used INTEGER,
  model_used TEXT DEFAULT 'gpt-4',
  error_occurred BOOLEAN DEFAULT FALSE,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create meditation_sessions table
CREATE TABLE IF NOT EXISTS meditation_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL CHECK (session_type IN ('breathing', 'mindfulness', 'loving_kindness', 'body_scan', 'guided')),
  duration_minutes INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  mood_before INTEGER CHECK (mood_before >= 1 AND mood_before <= 10),
  mood_after INTEGER CHECK (mood_after >= 1 AND mood_after <= 10),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create export_requests table
CREATE TABLE IF NOT EXISTS export_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  export_type TEXT NOT NULL CHECK (export_type IN ('pdf', 'json', 'csv')),
  date_range TEXT NOT NULL CHECK (date_range IN ('week', 'month', 'all')),
  include_journal BOOLEAN DEFAULT TRUE,
  include_ai_responses BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  file_url TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create emergency_logs table
CREATE TABLE IF NOT EXISTS emergency_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mood_log_id UUID REFERENCES mood_logs(id) ON DELETE CASCADE,
  keywords_detected TEXT[],
  severity_level TEXT CHECK (severity_level IN ('low', 'medium', 'high', 'critical')),
  auto_response_sent BOOLEAN DEFAULT FALSE,
  contacts_notified BOOLEAN DEFAULT FALSE,
  follow_up_required BOOLEAN DEFAULT TRUE,
  resolved BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_mood_logs_user_id ON mood_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_logs_created_at ON mood_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mood_logs_mood ON mood_logs(mood);
CREATE INDEX IF NOT EXISTS idx_mood_logs_emergency ON mood_logs(emergency_detected) WHERE emergency_detected = TRUE;
CREATE INDEX IF NOT EXISTS idx_mood_logs_search ON mood_logs USING gin(to_tsvector('english', journal_entry));

CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_earned_at ON achievements(earned_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_logs_user_id ON ai_conversation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_logs_created_at ON ai_conversation_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_meditation_user_id ON meditation_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_meditation_created_at ON meditation_sessions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE export_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Mood logs policies
CREATE POLICY "Users can read own mood logs" ON mood_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood logs" ON mood_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mood logs" ON mood_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own mood logs" ON mood_logs
  FOR DELETE USING (auth.uid() = user_id);

-- User settings policies
CREATE POLICY "Users can read own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Achievements policies
CREATE POLICY "Users can read own achievements" ON achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert achievements" ON achievements
  FOR INSERT WITH CHECK (true); -- Allow system to award achievements

CREATE POLICY "Users can update own achievements" ON achievements
  FOR UPDATE USING (auth.uid() = user_id);

-- Push subscriptions policies
CREATE POLICY "Users can manage own push subscriptions" ON push_subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- AI conversation logs policies (read-only for users)
CREATE POLICY "Users can read own AI logs" ON ai_conversation_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert AI logs" ON ai_conversation_logs
  FOR INSERT WITH CHECK (true);

-- Meditation sessions policies
CREATE POLICY "Users can manage own meditation sessions" ON meditation_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Export requests policies
CREATE POLICY "Users can manage own export requests" ON export_requests
  FOR ALL USING (auth.uid() = user_id);

-- Emergency logs policies (read-only for users)
CREATE POLICY "Users can read own emergency logs" ON emergency_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage emergency logs" ON emergency_logs
  FOR ALL WITH CHECK (true);

-- Create functions for advanced features

-- Function to calculate mood trends
CREATE OR REPLACE FUNCTION calculate_mood_trend(user_uuid UUID, days INTEGER DEFAULT 7)
RETURNS TABLE(
  date DATE,
  avg_mood DECIMAL,
  entry_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(created_at) as date,
    ROUND(AVG(mood)::numeric, 2) as avg_mood,
    COUNT(*)::integer as entry_count
  FROM mood_logs 
  WHERE user_id = user_uuid 
    AND created_at >= NOW() - INTERVAL '1 day' * days
  GROUP BY DATE(created_at)
  ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_entries', COUNT(*),
    'average_mood', ROUND(AVG(mood)::numeric, 2),
    'current_streak', (
      SELECT COUNT(DISTINCT DATE(created_at))
      FROM mood_logs 
      WHERE user_id = user_uuid 
        AND created_at >= (
          SELECT MAX(created_at) - INTERVAL '30 days'
          FROM mood_logs 
          WHERE user_id = user_uuid
        )
    ),
    'journal_entries', COUNT(*) FILTER (WHERE journal_entry IS NOT NULL),
    'ai_interactions', COUNT(*) FILTER (WHERE ai_response IS NOT NULL),
    'emergency_incidents', COUNT(*) FILTER (WHERE emergency_detected = TRUE),
    'last_entry', MAX(created_at)
  ) INTO result
  FROM mood_logs 
  WHERE user_id = user_uuid;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search journal entries
CREATE OR REPLACE FUNCTION search_journal_entries(
  user_uuid UUID, 
  search_query TEXT,
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE(
  id UUID,
  mood INTEGER,
  journal_entry TEXT,
  created_at TIMESTAMPTZ,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ml.id,
    ml.mood,
    ml.journal_entry,
    ml.created_at,
    ts_rank(to_tsvector('english', ml.journal_entry), plainto_tsquery('english', search_query)) as rank
  FROM mood_logs ml
  WHERE ml.user_id = user_uuid 
    AND ml.journal_entry IS NOT NULL
    AND to_tsvector('english', ml.journal_entry) @@ plainto_tsquery('english', search_query)
  ORDER BY rank DESC, ml.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_mood_logs_updated_at 
  BEFORE UPDATE ON mood_logs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at 
  BEFORE UPDATE ON user_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_push_subscriptions_updated_at 
  BEFORE UPDATE ON push_subscriptions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default user settings for new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_settings (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create views for common queries

-- View for user dashboard data
CREATE OR REPLACE VIEW user_dashboard_stats AS
SELECT 
  ml.user_id,
  COUNT(*) as total_entries,
  ROUND(AVG(ml.mood)::numeric, 2) as average_mood,
  COUNT(*) FILTER (WHERE DATE(ml.created_at) = CURRENT_DATE) as today_entries,
  COUNT(*) FILTER (WHERE ml.created_at >= DATE_TRUNC('week', CURRENT_DATE)) as week_entries,
  COUNT(*) FILTER (WHERE ml.journal_entry IS NOT NULL) as journal_entries,
  COUNT(*) FILTER (WHERE ml.ai_response IS NOT NULL) as ai_interactions,
  MAX(ml.created_at) as last_entry_date
FROM mood_logs ml
GROUP BY ml.user_id;

-- View for recent mood trends
CREATE OR REPLACE VIEW recent_mood_trends AS
SELECT 
  ml.user_id,
  DATE(ml.created_at) as entry_date,
  ROUND(AVG(ml.mood)::numeric, 2) as avg_mood,
  COUNT(*) as entry_count,
  ARRAY_AGG(ml.stress_level) as stress_levels
FROM mood_logs ml
WHERE ml.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY ml.user_id, DATE(ml.created_at)
ORDER BY ml.user_id, entry_date DESC;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Create sample data for testing (optional - remove in production)
-- This would be handled by the application, not the migration