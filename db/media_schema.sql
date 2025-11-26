-- ============================================
-- SmartSpeak Media Content & Subtitles Schema
-- ============================================

-- Table: media_content
-- Stores video/audio content metadata
CREATE TABLE IF NOT EXISTS media_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('video', 'audio')),
  cloudinary_id TEXT NOT NULL UNIQUE,
  cloudinary_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER, -- in seconds
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  category TEXT, -- 'music', 'movies', 'podcasts', 'interviews', etc.
  tags TEXT[], -- array of tags for filtering
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: subtitles
-- Stores synchronized subtitles with word-level timing
CREATE TABLE IF NOT EXISTS subtitles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id UUID REFERENCES media_content(id) ON DELETE CASCADE,
  start_time DECIMAL(10, 3) NOT NULL, -- seconds with milliseconds (e.g., 1.234)
  end_time DECIMAL(10, 3) NOT NULL,
  text_en TEXT NOT NULL, -- English text
  text_ru TEXT, -- Russian translation
  words JSONB, -- Array of words with individual timing
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Example words JSONB structure:
-- [
--   {"word": "Hello", "start": 0.5, "end": 0.8, "translation": "Привет"},
--   {"word": "world", "start": 0.9, "end": 1.2, "translation": "мир"}
-- ]

-- Table: user_media_progress
-- Tracks user progress for each media
CREATE TABLE IF NOT EXISTS user_media_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- reference to auth.users if using Supabase Auth
  media_id UUID REFERENCES media_content(id) ON DELETE CASCADE,
  last_position DECIMAL(10, 3) DEFAULT 0, -- last playback position in seconds
  completed BOOLEAN DEFAULT FALSE,
  watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, media_id)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_media_type ON media_content(type);
CREATE INDEX IF NOT EXISTS idx_media_difficulty ON media_content(difficulty);
CREATE INDEX IF NOT EXISTS idx_media_category ON media_content(category);
CREATE INDEX IF NOT EXISTS idx_subtitles_media_id ON subtitles(media_id);
CREATE INDEX IF NOT EXISTS idx_subtitles_time ON subtitles(media_id, start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_media_progress(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_media_content_updated_at
  BEFORE UPDATE ON media_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Sample data (optional - for testing)
-- INSERT INTO media_content (title, type, cloudinary_id, cloudinary_url, thumbnail_url, duration, difficulty, category, tags)
-- VALUES (
--   'Learn English with Music - Hello by Adele',
--   'video',
--   'smartspeak/videos/hello_adele',
--   'https://res.cloudinary.com/demo/video/upload/smartspeak/videos/hello_adele.mp4',
--   'https://res.cloudinary.com/demo/video/upload/smartspeak/videos/hello_adele.jpg',
--   295,
--   'intermediate',
--   'music',
--   ARRAY['music', 'pop', 'emotions']
-- );
