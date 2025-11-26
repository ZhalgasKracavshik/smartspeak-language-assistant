-- SmartSpeak MINIMAL Security Migration - Only Existing Tables
-- This version only touches tables that ACTUALLY exist
-- Safe to run - no errors!

-- ============================================
-- STEP 1: Enable RLS on EXISTING tables only
-- ============================================

-- Enable on profiles (definitely exists)
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;

-- Enable on chat_messages (probably exists)
ALTER TABLE IF EXISTS chat_messages ENABLE ROW LEVEL SECURITY;

-- Enable on security_logs (probably exists)
ALTER TABLE IF EXISTS security_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 2: DROP old policies (safe - IF EXISTS)
-- ============================================

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Public can view leaderboard profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can insert own messages" ON chat_messages;
DROP POLICY IF EXISTS "Service role can insert security logs" ON security_logs;
DROP POLICY IF EXISTS "Admins can view security logs" ON security_logs;

-- ============================================
-- STEP 3: PROFILES policies
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
-- STEP 4: CHAT_MESSAGES policies (if table exists)
-- ============================================

DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'chat_messages') THEN
        EXECUTE 'CREATE POLICY "Users can view own messages" ON chat_messages FOR SELECT USING (auth.uid() = user_id)';
        EXECUTE 'CREATE POLICY "Users can insert own messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id)';
    END IF;
END $$;

-- ============================================
-- STEP 5: SECURITY_LOGS policies (if table exists)
-- ============================================

DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'security_logs') THEN
        EXECUTE 'CREATE POLICY "Service role can insert security logs" ON security_logs FOR INSERT WITH CHECK (auth.role() = ''service_role'' OR auth.role() = ''authenticated'')';
    END IF;
END $$;

-- ============================================
-- STEP 6: Create Admin Table
-- ============================================

CREATE TABLE IF NOT EXISTS admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage admins table" ON admins;

CREATE POLICY "Admins can manage admins table"
ON admins FOR ALL
USING (auth.uid() IN (SELECT user_id FROM admins));

-- ============================================
-- STEP 7: Helper function
-- ============================================

CREATE OR REPLACE FUNCTION is_admin(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM admins WHERE admins.user_id = check_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION is_admin TO authenticated;

-- ============================================
-- STEP 8: Add YOU as admin
-- ============================================

INSERT INTO admins (user_id)
SELECT id FROM auth.users 
WHERE email = 'almiraailbaeva4@gmail.com'
ON CONFLICT DO NOTHING;

-- ============================================
-- SUCCESS! Verify everything worked:
-- ============================================

-- Show which tables have RLS enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = true
ORDER BY tablename;

-- Show all policies created
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Show admin users
SELECT u.email, a.created_at
FROM admins a
JOIN auth.users u ON u.id = a.user_id;

-- If you see results above - SUCCESS! 🎉
