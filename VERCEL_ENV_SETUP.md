# Quick Setup for Vercel Deployment

## Fast Track: Add these environment variables in Vercel Dashboard

Go to: https://vercel.com → Your Project → Settings → Environment Variables

Add for **Production**, **Preview**, AND **Development**:

```bash
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://nmwjojitmxx1tiusgdxv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5td2pvamlteHgxdGl1c2dkeHYiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNDE5OTQxNCwiZXhwIjoyMDQ5Nzc1NDE0fQ.cRBV2eJeNt9yfQCHD9sdcJ62LMSWTwBQMo6OE-JH0D0

# Gemini API Keys (get from your .env.local)
GEMINI_API_KEY=your-key-here
NEXT_PUBLIC_GEMINI_API_KEY=your-key-here

# Optional: Additional Gemini keys if you have them
GEMINI_API_KEY_2=
GEMINI_API_KEY_3=
GEMINI_API_KEY_4=
NEXT_PUBLIC_GEMINI_API_KEY_2=
NEXT_PUBLIC_GEMINI_API_KEY_3=
```

## Then Deploy

```bash
vercel --prod
```

Done! 🚀
