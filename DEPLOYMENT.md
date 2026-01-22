# Vercel Deployment Instructions

## Step 1: Add Environment Variables

Before deploying, you MUST add environment variables to your Vercel project:

### Option A: Via Vercel Dashboard (Recommended)
1. Go to https://vercel.com/dashboard
2. Select your project (or create new one)
3. Go to **Settings** → **Environment Variables**
4. Add these variables for **Production**, **Preview**, and **Development**:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
GEMINI_API_KEY=your-gemini-key
GEMINI_API_KEY_2=your-second-key (optional)
GEMINI_API_KEY_3=your-third-key (optional)
GEMINI_API_KEY_4=your-fourth-key (optional)
NEXT_PUBLIC_GEMINI_API_KEY=your-public-gemini-key
NEXT_PUBLIC_GEMINI_API_KEY_2=your-second-public-key (optional)
NEXT_PUBLIC_GEMINI_API_KEY_3=your-third-public-key (optional)
```

### Option B: Via Vercel CLI
```bash
# Add each variable
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add GEMINI_API_KEY production
# ... add all others
```

## Step 2: Deploy to Production

Once environment variables are added, deploy:

```bash
vercel --prod
```

## Step 3: Verify Deployment

After deployment completes:
1. Visit the provided URL
2. Test key features:
   - ✅ Login/Signup
   - ✅ Profile (shows B1 level)
   - ✅ Vocabulary learning
   - ✅ Dialogues with speech
   - ✅ Mini-games (Debater & Negotiator)
   - ✅ Classes page

## Troubleshooting

### Build Fails
```bash
# Check build logs
vercel logs

# Force rebuild with cleared cache
vercel --prod --force
```

### Environment Variables Not Working
- Make sure variables are added for **ALL** environments (Production, Preview, Development)
- Redeploy after adding new variables: `vercel --prod`

### Functions Timing Out
- Gemini API calls are configured with proper timeout handling
- If issues persist, check Vercel function logs

## Quick Reference

Your Supabase URL format:
```
https://[project-id].supabase.co
```

Your Supabase Anon Key starts with:
```
eyJhbGc...
```

---

**Ready!** Environment variables added → Run `vercel --prod`
