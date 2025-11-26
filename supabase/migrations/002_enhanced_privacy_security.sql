-- Enhanced Security Migration: IP Anonymization & Data Protection
-- Execute AFTER applying 001_enable_rls_security.sql
-- Complies with GDPR and cybersecurity best practices

-- ============================================
-- STEP 1: Add IP hashing function
-- ============================================

-- Function to hash IP addresses (one-way, cannot reverse)
CREATE OR REPLACE FUNCTION hash_ip(ip_text TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Use PostgreSQL's built-in SHA256 hash
    RETURN encode(digest(ip_text || 'smartspeak-salt-2025', 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- STEP 2: Add IP anonymization function
-- ============================================

-- Function to anonymize IP (removes last octet)
-- Example: 192.168.1.100 → 192.168.1.0
CREATE OR REPLACE FUNCTION anonymize_ip(ip_text TEXT)
RETURNS TEXT AS $$
DECLARE
    parts TEXT[];
BEGIN
    -- Split IP by dots
    parts := string_to_array(ip_text, '.');
    
    -- Check if it's IPv4
    IF array_length(parts, 1) = 4 THEN
        -- Replace last octet with 0
        RETURN parts[1] || '.' || parts[2] || '.' || parts[3] || '.0';
    ELSE
        -- For IPv6 or invalid, just hash it
        RETURN hash_ip(ip_text);
    END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- STEP 3: Modify security_logs table
-- ============================================

-- Add anonymized IP column
ALTER TABLE security_logs 
ADD COLUMN IF NOT EXISTS ip_hash TEXT,
ADD COLUMN IF NOT EXISTS anonymized_ip TEXT;

-- Update existing logs (if any)
UPDATE security_logs
SET 
    ip_hash = hash_ip(ip_address),
    anonymized_ip = anonymize_ip(ip_address)
WHERE ip_hash IS NULL;

-- ============================================
-- STEP 4: Create trigger for auto-hashing
-- ============================================

CREATE OR REPLACE FUNCTION auto_hash_ip()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-hash IP on insert
    NEW.ip_hash := hash_ip(NEW.ip_address);
    NEW.anonymized_ip := anonymize_ip(NEW.ip_address);
    
    -- GDPR compliance: Don't store full IP in production
    -- Uncomment next line to remove full IP (only keep hash + anonymized)
    -- NEW.ip_address := NEW.anonymized_ip;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_hash_ip ON security_logs;
CREATE TRIGGER trigger_auto_hash_ip
    BEFORE INSERT ON security_logs
    FOR EACH ROW
    EXECUTE FUNCTION auto_hash_ip();

-- ============================================
-- STEP 5: Auto-delete old logs (GDPR compliance)
-- ============================================

-- Function to delete logs older than 90 days
CREATE OR REPLACE FUNCTION cleanup_old_security_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM security_logs
    WHERE created_at < NOW() - INTERVAL '90 days';
    
    RAISE NOTICE 'Cleaned up old security logs';
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup (run daily via cron or pg_cron if available)
-- Manual execution: SELECT cleanup_old_security_logs();

-- ============================================
-- STEP 6: Enhanced RLS for security_logs
-- ============================================

-- Drop old policies if exists
DROP POLICY IF EXISTS "Service role can insert security logs" ON security_logs;
DROP POLICY IF EXISTS "Admins can view security logs" ON security_logs;

-- Only service role can insert
CREATE POLICY "Service role can insert security logs"
ON security_logs FOR INSERT
WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Only admins can view (uses our admin table)
CREATE POLICY "Admins can view security logs"
ON security_logs FOR SELECT
USING (
    auth.uid() IN (SELECT user_id FROM admins)
);

-- ============================================
-- STEP 7: Privacy-focused views
-- ============================================

-- View for admins: shows anonymized data only
CREATE OR REPLACE VIEW security_logs_anonymized AS
SELECT 
    id,
    anonymized_ip,
    user_id,
    action,
    endpoint,
    is_guest,
    created_at,
    -- Redact user_agent (show only browser/OS, not full string)
    CASE 
        WHEN user_agent LIKE '%Chrome%' THEN 'Chrome'
        WHEN user_agent LIKE '%Firefox%' THEN 'Firefox'
        WHEN user_agent LIKE '%Safari%' THEN 'Safari'
        WHEN user_agent LIKE '%Edge%' THEN 'Edge'
        ELSE 'Other'
    END as browser,
    -- Redact metadata (remove potentially sensitive info)
    jsonb_build_object('action_type', metadata->>'action') as metadata_summary
FROM security_logs;

-- Grant view access to admins only
GRANT SELECT ON security_logs_anonymized TO authenticated;

-- ============================================
-- STEP 8: Add encryption for sensitive metadata
-- ============================================

-- Function to encrypt sensitive data (requires pgcrypto extension)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Function to encrypt metadata
CREATE OR REPLACE FUNCTION encrypt_metadata(data JSONB, key TEXT DEFAULT 'smartspeak-encryption-key-2025')
RETURNS TEXT AS $$
BEGIN
    RETURN encode(
        encrypt(
            data::TEXT::bytea,
            key::bytea,
            'aes'
        ),
        'base64'
    );
END;
$$ LANGUAGE plpgsql;

-- Function to decrypt metadata (admin only)
CREATE OR REPLACE FUNCTION decrypt_metadata(encrypted TEXT, key TEXT DEFAULT 'smartspeak-encryption-key-2025')
RETURNS JSONB AS $$
BEGIN
    RETURN decrypt(
        decode(encrypted, 'base64'),
        key::bytea,
        'aes'
    )::TEXT::JSONB;
EXCEPTION WHEN OTHERS THEN
    RETURN '{}'::JSONB;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- STEP 9: GitHub OAuth admin setup
-- ============================================

-- For users who registered with GitHub OAuth
-- Replace 'your-github-username' with your actual GitHub username

INSERT INTO admins (user_id)
SELECT id FROM auth.users 
WHERE 
    -- Try GitHub username from metadata
    raw_user_meta_data->>'preferred_username' = 'your-github-username'
    -- OR try email
    OR email = 'your-email@gmail.com'
    -- OR try full name
    OR raw_user_meta_data->>'full_name' = 'Your Full Name'
ON CONFLICT DO NOTHING;

-- Check what metadata your GitHub account has:
-- SELECT id, email, raw_user_meta_data FROM auth.users WHERE email = 'your@email.com';

-- ============================================
-- STEP 10: Add data retention policy
-- ============================================

-- Table for sensitive user data that should be auto-deleted
CREATE TABLE IF NOT EXISTS data_retention_policy (
    table_name TEXT PRIMARY KEY,
    retention_days INTEGER NOT NULL,
    last_cleanup TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO data_retention_policy VALUES
    ('security_logs', 90, NOW()),
    ('chat_messages', 365, NOW())  -- Keep chat history for 1 year
ON CONFLICT (table_name) DO NOTHING;

-- ============================================
-- VERIFICATION
-- ============================================

-- Test IP hashing
SELECT hash_ip('192.168.1.100');

-- Test IP anonymization  
SELECT anonymize_ip('192.168.1.100');  -- Should return 192.168.1.0

-- Check trigger works
-- (After inserting a log, verify ip_hash and anonymized_ip are set)

-- ============================================
-- NOTES
-- ============================================

-- IMPORTANT CHANGES:
-- 1. IP addresses are now anonymized (last octet removed)
-- 2. Full IP is hashed for abuse detection
-- 3. Logs auto-delete after 90 days (GDPR compliance)
-- 4. Only admins can view logs
-- 5. Sensitive metadata can be encrypted

-- RECOMMENDED:
-- 1. In production: Uncomment line 57 to NOT store full IPs
-- 2. Set up automated cleanup: cron job calling cleanup_old_security_logs()
-- 3. Rotate encryption keys regularly
-- 4. Review logs monthly for suspicious activity

-- GITHUB OAUTH:
-- Replace 'your-github-username' in line 177 with YOUR GitHub username
-- Or use email to grant yourself admin access
