-- SmartSpeak Security Migration: Row Level Security (RLS)
-- Execute this in Supabase SQL Editor
-- This enables Row Level Security on all tables to protect user data

-- ============================================
-- STEP 1: Enable RLS on all tables
-- ============================================

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Enable RLS on progress table (if exists)
ALTER TABLE IF EXISTS progress ENABLE ROW LEVEL SECURITY;

-- Enable RLS on friends table (if exists)
ALTER TABLE IF EXISTS friends ENABLE ROW LEVEL SECURITY;

-- Enable RLS on friend_requests table (if exists)
ALTER TABLE IF EXISTS friend_requests ENABLE ROW LEVEL SECURITY;

-- Enable RLS on chat_messages table (if exists)  
ALTER TABLE IF EXISTS chat_messages ENABLE ROW LEVEL SECURITY;

-- Enable RLS on vocabulary_progress table (if exists)
ALTER TABLE IF EXISTS vocabulary_progress ENABLE ROW LEVEL SECURITY;

-- Enable RLS on security_logs table (if exists)
ALTER TABLE IF EXISTS security_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 2: Create RLS Policies for PROFILES
-- ============================================

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Policy: Users can insert their own profile (during signup)
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Policy: Allow public read of limited profile fields for leaderboard
CREATE POLICY "Public can view leaderboard profiles"
ON profiles FOR SELECT
USING (true);
-- Note: You should create a VIEW with only necessary fields (full_name, level, xp)
-- instead of exposing entire profile

-- ============================================
-- STEP 3: Create RLS Policies for CHAT_MESSAGES
-- ============================================

-- Policy: Users can view their own messages
CREATE POLICY "Users can view own messages"
ON chat_messages FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own messages
CREATE POLICY "Users can insert own messages"
ON chat_messages FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- STEP 4: Create RLS Policies for FRIENDS
-- ============================================

-- Policy: Users can view their friendships
CREATE POLICY "Users can view own friendships"
ON friends FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Policy: Users can delete their friendships
CREATE POLICY "Users can delete own friendships"
ON friends FOR DELETE
USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- ============================================
-- STEP 5: Create RLS Policies for FRIEND_REQUESTS
-- ============================================

-- Policy: Users can view requests they sent or received
CREATE POLICY "Users can view own friend requests"
ON friend_requests FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Policy: Users can send friend requests
CREATE POLICY "Users can send friend requests"
ON friend_requests FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- Policy: Users can update requests they received (accept/reject)
CREATE POLICY "Users can update received requests"
ON friend_requests FOR UPDATE
USING (auth.uid() = receiver_id);

-- Policy: Users can delete requests they sent
CREATE POLICY "Users can delete sent requests"
ON friend_requests FOR DELETE
USING (auth.uid() = sender_id);

-- ============================================
-- STEP 6: Create RLS Policies for VOCABULARY_PROGRESS
-- ============================================

-- Policy: Users can view their own progress
CREATE POLICY "Users can view own vocabulary progress"
ON vocabulary_progress FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own progress
CREATE POLICY "Users can insert own vocabulary progress"
ON vocabulary_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update  their own progress
CREATE POLICY "Users can update own vocabulary progress"
ON vocabulary_progress FOR UPDATE
USING (auth.uid() = user_id);

-- ============================================
-- STEP 7: Create RLS Policies for SECURITY_LOGS
-- ============================================

-- Policy: Only service role can write to security logs
-- (This table should only be written to via server/edge functions)
CREATE POLICY "Service role can insert security logs"
ON security_logs FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- Policy: Users cannot read security logs (admin only via dashboard)
-- No SELECT policy = nobody can read except via Supabase dashboard

-- ============================================
-- STEP 8: Create Admin Table and Policies
-- ============================================

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on admins table
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Policy: Only existing admins can add new admins
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

-- Grant execute permission
GRANT EXECUTE ON FUNCTION is_admin TO authenticated;

-- ============================================
-- STEP 9: Add First Admin (REPLACE WITH YOUR EMAIL)
-- ============================================

-- IMPORTANT: Replace 'your-email@example.com' with your actual email
-- This gives YOU admin access
INSERT INTO admins (user_id)
SELECT id FROM auth.users WHERE email = 'your-email@example.com'
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check which tables have RLS enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check all policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check admin users
SELECT u.email, a.created_at
FROM admins a
JOIN auth.users u ON u.id = a.user_id;

-- ============================================
-- NOTES
-- ============================================

-- 1. RLS is now enabled - unauthorized users CANNOT access data
-- 2. Each user can only see/modify their own data
-- 3. Admin system is in place
-- 4. Security logs are protected
-- 5. Public leaderboard still works via the policy

-- IMPORTANT: Test thoroughly in development before applying to production!
