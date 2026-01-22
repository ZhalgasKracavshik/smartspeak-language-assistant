-- ============================================
-- FIX MEDIA CONTENT TABLE & POLICIES (v3)
-- Run this script in Supabase SQL Editor to fix the invalid "Videos" list and ALL constraints
-- ============================================

-- 1. Relax Constraints & Update Schema (Safe to run on existing table)

-- Allow NULLs for Cloudinary fields (in case we use YouTube/other links)
ALTER TABLE media_content ALTER COLUMN cloudinary_id DROP NOT NULL;
ALTER TABLE media_content ALTER COLUMN cloudinary_url DROP NOT NULL;

-- 2. Fix Difficulty Check Constraint
-- First, drop the old constraint that limits to 'beginner', 'intermediate', 'advanced'
ALTER TABLE media_content DROP CONSTRAINT IF EXISTS media_content_difficulty_check;

-- Add new constraint with CEFR levels
ALTER TABLE media_content ADD CONSTRAINT media_content_difficulty_check 
CHECK (difficulty IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'beginner', 'intermediate', 'advanced'));

-- 3. Fix Type Check Constraint
-- Drop old constraint that might limit to 'video', 'audio'
ALTER TABLE media_content DROP CONSTRAINT IF EXISTS media_content_type_check;

-- Add new constraint with expanded types
ALTER TABLE media_content ADD CONSTRAINT media_content_type_check 
CHECK (type IN ('video', 'audio', 'cartoon', 'song', 'story'));


-- 4. Create Subtitles Table (if missing)
CREATE TABLE IF NOT EXISTS subtitles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id UUID REFERENCES media_content(id) ON DELETE CASCADE,
  start_time DECIMAL(10, 3) NOT NULL,
  end_time DECIMAL(10, 3) NOT NULL,
  text_en TEXT NOT NULL,
  text_ru TEXT,
  words JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Enable RLS
ALTER TABLE media_content ENABLE ROW LEVEL SECURITY;

-- 6. Apply Policies (Refresh)
DROP POLICY IF EXISTS "Media content is viewable by everyone" ON media_content;
DROP POLICY IF EXISTS "Admins can manage media content" ON media_content;

CREATE POLICY "Media content is viewable by everyone" 
ON media_content FOR SELECT USING (true);

CREATE POLICY "Admins can manage media content" 
ON media_content FOR ALL 
USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- 7. Insert Sample Data
-- Using ON CONFLICT DO NOTHING to avoid errors if run multiple times
INSERT INTO media_content (id, title, type, description, difficulty, category, created_at, cloudinary_id)
VALUES (
  '00000000-0000-0000-0000-000000000001', 
  'Welcome to SmartSpeak', 
  'video', 
  'Introduction to the platform', 
  'A1', 
  'tutorial', 
  NOW(),
  'sample_intro_video'
)
ON CONFLICT (id) DO NOTHING;
