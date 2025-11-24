-- Security Logging System for SmartSpeak

-- 1. Create table if not exists
CREATE TABLE IF NOT EXISTS public.security_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    endpoint TEXT,
    user_agent TEXT,
    is_guest BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create indexes (IF NOT EXISTS handles duplicates automatically)
CREATE INDEX IF NOT EXISTS idx_security_logs_ip ON public.security_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_security_logs_user_id ON public.security_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_logs_action ON public.security_logs(action);
CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON public.security_logs(created_at DESC);

-- 3. Enable RLS
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- 4. DROP EXISTING POLICIES to avoid "already exists" error
DROP POLICY IF EXISTS "Service role can manage security logs" ON public.security_logs;
DROP POLICY IF EXISTS "Users can insert logs" ON public.security_logs;

-- 5. Create Policies

-- Allow Service Role (Admin) full access
CREATE POLICY "Service role can manage security logs"
    ON public.security_logs
    FOR ALL
    USING (auth.role() = 'service_role');

-- Allow Everyone (Auth + Guest) to INSERT logs
CREATE POLICY "Users can insert logs"
    ON public.security_logs
    FOR INSERT
    WITH CHECK (true);  -- 'true' means anyone can insert (needed for login logs)

-- 6. Create View (OR REPLACE handles updates)
CREATE OR REPLACE VIEW public.suspicious_activity AS
SELECT 
    ip_address,
    COUNT(*) as request_count,
    COUNT(DISTINCT action) as unique_actions,
    MAX(created_at) as last_seen,
    ARRAY_AGG(DISTINCT action) as actions
FROM public.security_logs
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY ip_address
HAVING COUNT(*) > 100
ORDER BY request_count DESC;
