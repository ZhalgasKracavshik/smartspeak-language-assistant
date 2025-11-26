-- SmartSpeak Security Migration: Row Level Security (RLS) - FIXED VERSION
-- Execute this in Supabase SQL Editor
-- This version removes existing policies before creating new ones

-- ============================================
-- ============================================
-- STEP 0: Setup Extensions & Create Missing Tables
-- ============================================

-- Enable UUID extension for uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS security_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    event_type TEXT NOT NULL,
    description TEXT,
    user_id UUID REFERENCES auth.users(id),
    ip_address TEXT,
    user_agent TEXT
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    content TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS friends (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    friend_id UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, friend_id)
);

CREATE TABLE IF NOT EXISTS friend_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sender_id UUID REFERENCES auth.users(id) NOT NULL,
    receiver_id UUID REFERENCES auth.users(id) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(sender_id, receiver_id)
);

CREATE TABLE IF NOT EXISTS vocabulary_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  word_id integer not null,
  status text check (status in ('new', 'learning', 'mastered')) default 'new',
  next_review timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TABLE IF NOT EXISTS dialogue_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  dialogue_id text not null,
  score integer default 0,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  achievement_id text not null,
  unlocked_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TABLE IF NOT EXISTS daily_quests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  quest_id text not null,
  progress integer default 0,
  is_completed boolean default false,
  date date default CURRENT_DATE
);

-- ============================================
-- STEP 1: Enable RLS on all tables
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS vocabulary_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 2: DROP OLD POLICIES (if they exist)
-- ============================================

-- Drop old profile policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Public can view leaderboard profiles" ON profiles;

-- Drop old chat_messages policies
DROP POLICY IF EXISTS "Users can view own messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can insert own messages" ON chat_messages;

-- Drop old friends policies
DROP POLICY IF EXISTS "Users can view own friendships" ON friends;
DROP POLICY IF EXISTS "Users can delete own friendships" ON friends;

-- Drop old friend_requests policies
DROP POLICY IF EXISTS "Users can view own friend requests" ON friend_requests;
DROP POLICY IF EXISTS "Users can send friend requests" ON friend_requests;
DROP POLICY IF EXISTS "Users can update received requests" ON friend_requests;
DROP POLICY IF EXISTS "Users can delete sent requests" ON friend_requests;

-- Drop old vocabulary_progress policies
DROP POLICY IF EXISTS "Users can view own vocabulary progress" ON vocabulary_progress;
DROP POLICY IF EXISTS "Users can insert own vocabulary progress" ON vocabulary_progress;
DROP POLICY IF EXISTS "Users can update own vocabulary progress" ON vocabulary_progress;

-- Drop old security_logs policies
DROP POLICY IF EXISTS "Service role can insert security logs" ON security_logs;

-- ============================================
-- STEP 3: Create RLS Policies for PROFILES
-- ============================================

CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Public can view leaderboard profiles"
ON profiles FOR SELECT
USING (true);

-- ============================================
-- STEP 4: Create RLS Policies for CHAT_MESSAGES
-- ============================================

CREATE POLICY "Users can view own messages"
ON chat_messages FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages"
ON chat_messages FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- STEP 5: Create RLS Policies for FRIENDS
-- ============================================

CREATE POLICY "Users can view own friendships"
ON friends FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can delete own friendships"
ON friends FOR DELETE
USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- ============================================
-- STEP 6: Create RLS Policies for FRIEND_REQUESTS
-- ============================================

CREATE POLICY "Users can view own friend requests"
ON friend_requests FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send friend requests"
ON friend_requests FOR INSERT
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update received requests"
ON friend_requests FOR UPDATE
USING (auth.uid() = receiver_id);

CREATE POLICY "Users can delete sent requests"
ON friend_requests FOR DELETE
USING (auth.uid() = sender_id);

-- ============================================
-- STEP 7: Create RLS Policies for VOCABULARY_PROGRESS
-- ============================================

CREATE POLICY "Users can view own vocabulary progress"
ON vocabulary_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vocabulary progress"
ON vocabulary_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vocabulary progress"
ON vocabulary_progress FOR UPDATE
USING (auth.uid() = user_id);

-- ============================================
-- STEP 7.1: Create RLS Policies for DIALOGUE_PROGRESS
-- ============================================

ALTER TABLE dialogue_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own dialogue progress"
ON dialogue_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dialogue progress"
ON dialogue_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- STEP 7.2: Create RLS Policies for USER_ACHIEVEMENTS
-- ============================================

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
ON user_achievements FOR SELECT
USING (auth.uid() = user_id);

-- ============================================
-- STEP 7.3: Create RLS Policies for DAILY_QUESTS
-- ============================================

ALTER TABLE daily_quests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own daily quests"
ON daily_quests FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own daily quests"
ON daily_quests FOR ALL
USING (auth.uid() = user_id);

-- ============================================
-- STEP 8: Create RLS Policies for SECURITY_LOGS
-- ============================================

CREATE POLICY "Service role can insert security logs"
ON security_logs FOR INSERT
WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- ============================================
-- STEP 9: Create Admin Table and Policies
-- ============================================

CREATE TABLE IF NOT EXISTS admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Drop old admin policies
DROP POLICY IF EXISTS "Admins can manage admins table" ON admins;

CREATE POLICY "Admins can manage admins table"
ON admins FOR ALL
USING (
    auth.uid() IN (SELECT user_id FROM admins)
);

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM admins WHERE admins.user_id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION is_admin TO authenticated;

-- ============================================
-- STEP 10: Add First Admin
-- ============================================
-- IMPORTANT: Replace with YOUR email

INSERT INTO admins (user_id)
SELECT id FROM auth.users WHERE email = 'almiraailbaeva4@gmail.com'
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICATION
-- ============================================

-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check policies exist
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check admin users
SELECT u.email, a.created_at
FROM admins a
JOIN auth.users u ON u.id = a.user_id;
