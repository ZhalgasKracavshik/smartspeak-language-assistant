# Supabase Security Setup Guide

## ⚠️ CRITICAL: Execute RLS Migration

Your database is currently **UNPROTECTED**. Anyone with your database URL can access all user data.

### Step 1: Apply RLS Migration

1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `smartspeak-language-assistant`
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy contents of `supabase/migrations/001_enable_rls_security.sql`
6. **IMPORTANT**: Replace `your-email@example.com` with YOUR actual email (line 171)
7. Click **Run** (or press Ctrl+Enter)
8. Verify success - should see "Success" message

### Step 2: Verify RLS is Active

Run this query in SQL Editor:
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

All tables should show `rowsecurity = true` ✅

### Step 3: Test Protection

Try accessing data from browser console:
```javascript
// This should FAIL (return empty or error)
const { data } = await supabase
  .from('profiles')
  .select('*')
  .neq('id', 'your-user-id');
```

If it fails = RLS is working! 🎉

---

## What RLS Protects

### ✅ Protected Tables
- `profiles` - User information
- `chat_messages` - AI chat history
- `friends` - Social connections
- `friend_requests` - Pending requests
- `vocabulary_progress` - Learning data
- `security_logs` - Security events

### 🔒 Security Rules
- Users can ONLY see their own data
- Users CANNOT see other users' private info
- Admins have special access
- Service role can write logs
- Public leaderboard shows limited data only

---

## Admin Access

### How to Add More Admins

1. Get the user's email
2. Run in Supabase SQL Editor:

```sql
INSERT INTO admins (user_id)
SELECT id FROM auth.users WHERE email = 'admin@example.com';
```

### How to Check Admin Status

```sql
SELECT u.email, a.created_at
FROM admins a
JOIN auth.users u ON u.id = a.user_id;
```

### How to Remove Admin

```sql
DELETE FROM admins 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'former-admin@example.com');
```

---

## Additional Security Recommendations

### 1. Enable Email Verification
In Supabase Dashboard → Authentication → Email Auth:
- ✅ Enable email confirmation
- ✅ Enable secure email change
- ✅ Set up email templates

### 2. Configure Auth Settings
In Supabase Dashboard → Authentication → Settings:
- Session timeout: 7 days (or less)
- Refresh token rotation: Enabled
- JWT expiry: 3600 seconds (1 hour)

### 3. Set Up Database Backups
In Supabase Dashboard → Database → Backups:
- Enable automatic daily backups
- Retention: 7 days minimum

### 4. Monitor API Usage
In Supabase Dashboard → Settings → API:
- Check for unusual patterns
- Set up alerts for high usage

### 5. Review Security Logs
```sql
SELECT action, created_at, metadata
FROM security_logs
ORDER BY created_at DESC
LIMIT 100;
```

---

## Environment Variables Security

### ✅ Safe to Expose (in client code)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

These are safe because RLS protects the database!

### ❌ NEVER EXPOSE
```env
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...  # SERVER ONLY!
```

Keep service role key ONLY on server/backend!

---

## Emergency Procedures

### If You Suspect a Breach

1. **Immediately revoke compromised API keys**:
   - Supabase Dashboard → Settings → API → Generate new keys
   - Update `.env.local` with new keys
   - Redeploy application

2. **Check security logs**:
```sql
SELECT * FROM security_logs
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

3. **Review all admin users**:
```sql
SELECT * FROM admins;
```

4. **Force logout all users**:
   - Supabase Dashboard → Authentication → Users
   - "Sign out all users" button

5. **Contact Supabase support** if serious breach suspected

---

## Testing Checklist

Before going to production:

- [ ] RLS enabled on all tables
- [ ] Policies tested (users see only own data)
- [ ] Admin access works
- [ ] Email verification enabled
- [ ] Backups configured
- [ ] Security logs working
- [ ] Service role key secured
- [ ] Environment variables correct

---

## Questions?

- Supabase RLS Docs: https://supabase.com/docs/guides/auth/row-level-security
- Support: https://supabase.com/support

**IMPORTANT**: Complete Step 1 NOW before proceeding with deployment!
