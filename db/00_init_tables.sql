-- ===================================================================
-- 00. INITIAL SETUP - RUN THIS FIRST!
-- Creates necessary tables if they don't exist
-- ===================================================================

-- 1. Ensure MODULES table exists
CREATE TABLE IF NOT EXISTS modules (
  id SERIAL PRIMARY KEY, -- Integer ID (matches foreign keys)
  title TEXT NOT NULL,
  description TEXT,
  grade_level INTEGER DEFAULT 9,
  color_theme TEXT DEFAULT 'from-blue-500 to-cyan-500',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for modules
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read modules" ON modules;
CREATE POLICY "Allow public read modules" ON modules FOR SELECT USING (true);

-- 2. Ensure MODULE_VOCABULARY table exists
CREATE TABLE IF NOT EXISTS module_vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE, -- Must be INTEGER to match modules.id
  word TEXT NOT NULL,
  translation_ru TEXT,
  translation_kz TEXT,
  section TEXT, -- e.g., '1a', '1c'
  audio_url TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for vocabulary
ALTER TABLE module_vocabulary ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read vocabulary" ON module_vocabulary;
CREATE POLICY "Allow public read vocabulary" ON module_vocabulary FOR SELECT USING (true);


-- 3. Insert Modules (if they don't exist)
INSERT INTO modules (id, title, description, grade_level, color_theme)
VALUES 
  (1, 'Hobbies & Qualities', 'Talking about hobbies, qualities, and profiles.', 9, 'from-blue-500 to-indigo-500'),
  (2, 'Exercise & Sport', 'Sports, equipment, and health vocabulary.', 9, 'from-green-500 to-emerald-600'),
  (3, 'Earth & our place on it', 'Environment, geography, and ecology.', 9, 'from-teal-500 to-cyan-600'),
  (4, 'Charities & Conflict', 'Social issues, charity, and conflict resolution.', 9, 'from-red-500 to-orange-500'),
  (5, 'Traditions & Language', 'Culture, customs, and linguistic diversity.', 9, 'from-violet-500 to-purple-600'),
  (6, 'Reading for Pleasure', 'Literature, stories, and reading enjoyment.', 9, 'from-pink-500 to-rose-500'),
  (7, 'Entertainment & Media', 'Movies, music, and media vocabulary.', 9, 'from-purple-500 to-fuchsia-600'),
  (8, 'Travel & Tourism', 'Travel, destinations, and tourism.', 9, 'from-blue-400 to-sky-500'),
  (9, 'Science & Technology', 'Innovation, tech, and scientific progress.', 9, 'from-cyan-500 to-blue-600')
ON CONFLICT (id) DO NOTHING;
