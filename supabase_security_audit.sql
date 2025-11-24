-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING ( true );

CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING ( auth.uid() = id );

-- Security Logs Policies
DROP POLICY IF EXISTS "Logs are insertable by everyone" ON security_logs;
DROP POLICY IF EXISTS "Logs are viewable by admins only" ON security_logs;

CREATE POLICY "Logs are insertable by everyone" 
ON security_logs FOR INSERT 
WITH CHECK ( true );

CREATE POLICY "Logs are viewable by admins only" 
ON security_logs FOR SELECT 
USING ( auth.role() = 'service_role' );

-- Friends Policies
DROP POLICY IF EXISTS "Users can view their own friends" ON friends;
DROP POLICY IF EXISTS "Users can add friends" ON friends;
DROP POLICY IF EXISTS "Users can remove friends" ON friends;

CREATE POLICY "Users can view their own friends" 
ON friends FOR SELECT 
USING ( auth.uid() = user_id OR auth.uid() = friend_id );

CREATE POLICY "Users can add friends" 
ON friends FOR INSERT 
WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can remove friends" 
ON friends FOR DELETE 
USING ( auth.uid() = user_id );

-- Secure Account Deletion Function
CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete public profile (cascade should handle this, but being explicit is good)
  DELETE FROM public.profiles WHERE id = auth.uid();
  
  -- Delete auth user (this requires service_role privileges, which SECURITY DEFINER provides)
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;
