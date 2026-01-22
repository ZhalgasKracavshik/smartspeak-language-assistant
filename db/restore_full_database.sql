-- =========================================================
-- FULL DATABASE RESTORATION (BASED ON ORIGINAL SCHEMA)
-- =========================================================

-- 1. CLEANUP (Очистка старых поломанных таблиц если нужно)
-- DROP TABLE IF EXISTS vocabulary CASCADE;
-- DROP TABLE IF EXISTS grammar_topics CASCADE;
-- DROP TABLE IF EXISTS modules CASCADE;
-- DROP TABLE IF EXISTS media_content CASCADE;
-- DROP TABLE IF EXISTS subtitles CASCADE;

-- 2. STRUCTURE (Структура из вашего файла supabase_content_migration.sql)
create extension if not exists "uuid-ossp";

-- MODULES TABLE
create table if not exists public.modules (
  id bigint primary key,
  title text not null,
  description text,
  grade_level integer default 9,
  color_theme text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- VOCABULARY TABLE
create table if not exists public.vocabulary (
  id uuid default uuid_generate_v4() primary key,
  word text not null,
  translation_ru text,
  translation_kz text,
  transcription text,
  part_of_speech text,
  level text,
  category text,
  example_sentence text,
  example_translation_ru text,
  example_translation_kz text,
  module_id bigint references public.modules(id) on delete set null,
  audio_url text, -- Future proofing
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- MEDIA CONTENT TABLE
CREATE TABLE IF NOT EXISTS media_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- video, audio
  cloudinary_id TEXT,
  cloudinary_url TEXT,
  thumbnail_url TEXT,
  duration INTEGER,
  difficulty TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SUBTITLES TABLE
CREATE TABLE IF NOT EXISTS subtitles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  media_id UUID REFERENCES media_content(id) ON DELETE CASCADE,
  start_time DECIMAL(10, 3) NOT NULL,
  end_time DECIMAL(10, 3) NOT NULL,
  text_en TEXT NOT NULL,
  text_ru TEXT,
  words JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. POLICIES (Отключение защиты RLS для гарантии доступа)
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtitles ENABLE ROW LEVEL SECURITY;

-- Удаляем старые политики и разрешаем ВСЕМ всё видеть
DROP POLICY IF EXISTS "Modules are viewable by everyone." ON modules;
CREATE POLICY "Modules are viewable by everyone." ON modules FOR SELECT USING (true);

DROP POLICY IF EXISTS "Vocabulary is viewable by everyone." ON vocabulary;
CREATE POLICY "Vocabulary is viewable by everyone." ON vocabulary FOR SELECT USING (true);

DROP POLICY IF EXISTS "Media content is viewable by everyone" ON media_content;
CREATE POLICY "Media content is viewable by everyone" ON media_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Subtitles are viewable by everyone" ON subtitles;
CREATE POLICY "Subtitles are viewable by everyone" ON subtitles FOR SELECT USING (true);


-- 4. DATA SEEDING (Заполнение данными)

-- Insert Modules
INSERT INTO modules (id, title, description, grade_level, color_theme) VALUES 
(1, 'Hobbies & Qualities', 'Talking about hobbies, qualities, and profiles.', 9, 'from-blue-500 to-indigo-500'),
(2, 'Exercise & Sport', 'Sports, equipment, and health vocabulary.', 9, 'from-green-500 to-emerald-600'),
(3, 'Earth & Our Place in it', 'Environment, geography, and ecology.', 9, 'from-teal-500 to-cyan-600'),
(4, 'Charities & Conflict', 'Social issues, charity, and conflict resolution.', 9, 'from-red-500 to-orange-500'),
(5, 'Traditions & Language', 'Culture, customs, and linguistic diversity.', 9, 'from-violet-500 to-purple-600'),
(6, 'Music & Film', 'Entertainment, genres, and artistic expression.', 9, 'from-pink-500 to-rose-500'),
(7, 'Travel & Tourism', 'Destinations, transport, and holiday planning.', 9, 'from-yellow-400 to-orange-500'),
(8, 'History & Figures', 'Historical events and famous personalities.', 9, 'from-amber-600 to-yellow-600'),
(9, 'Science & Technology', 'Innovation, gadgets, and scientific progress.', 9, 'from-blue-600 to-cyan-400')
ON CONFLICT (id) DO NOTHING;

-- Insert Vocabulary (Module 1)
INSERT INTO vocabulary (word, translation_kz, translation_ru, part_of_speech, module_id) VALUES
('blood', 'қан', 'кровь', 'noun', 1),
('catch a wave', 'толқынды ұстау', 'поймать волну', 'phrase', 1),
('enter a competition', 'додаға қатысу', 'вступить в соревнование', 'phrase', 1),
('escape death', 'өлімнен аулақ болу', 'избежать смерти', 'phrase', 1),
('fit', 'сай / сәйкестік', 'поместить / соответствовать', 'verb', 1),
('handle', 'тұтқа', 'рукоятка', 'noun', 1),
('look bright', 'ақылды болып көріну', 'казаться умным', 'phrase', 1),
('lose an arm', 'қолын жоғалту', 'потерять руку', 'phrase', 1),
('overcome obstacles', 'кедергілерді еңсеру', 'преодолевать препятствия', 'phrase', 1),
('rank', 'дәреже', 'ранг / звание', 'verb', 1),
('rush', 'асығу', 'спешить', 'verb', 1),
('shark attack', 'акуланың шабуылы', 'атака акулы', 'noun', 1),
('sharp pain', 'өткір ауырсыну', 'резкая боль', 'noun', 1),
('strike', 'ұру, соғу', 'ударить', 'verb', 1),
('terror', 'террор', 'террор', 'noun', 1),
('victim', 'құрбан', 'жертва', 'noun', 1),
('victory', 'жеңу', 'выиграть', 'noun', 1)
ON CONFLICT DO NOTHING;

-- Insert Media (Puss in Boots)
WITH new_video AS (
  INSERT INTO media_content (title, description, type, cloudinary_id, cloudinary_url, thumbnail_url, duration, difficulty, category)
  VALUES (
    'Puss in Boots: The Last Wish', 
    'Official Trailer for Puss in Boots: The Last Wish', 
    'video', 
    'smartspeak/puss', 
    'https://res.cloudinary.com/demo/video/upload/v1683274983/puss_in_boots_trailer.mp4', 
    'https://res.cloudinary.com/demo/video/upload/w_300,h_200,c_fill/v1683274983/puss_in_boots_trailer.jpg', 
    145, 
    'intermediate', 
    'movies'
  ) 
  ON CONFLICT DO NOTHING
  RETURNING id
)
INSERT INTO subtitles (media_id, start_time, end_time, text_en, text_ru, words)
SELECT id, 0.5, 3.0, 'Hey, Little Bear!', 'Эй, Медвежонок!', '[{"word": "Hey", "start": 0.5, "end": 1.0, "translation": "Эй"}]'::jsonb
FROM new_video;
