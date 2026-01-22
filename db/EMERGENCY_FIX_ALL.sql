-- =========================================================
-- EMERGENCY: ПОЛНОЕ ИСПРАВЛЕНИЕ ВСЕХ ПРОБЛЕМ
-- =========================================================
-- Этот скрипт:
-- 1. Отключает RLS на ВСЕХ таблицах
-- 2. Создает недостающую таблицу vocabulary_progress (источник зависаний)
-- 3. Восстанавливает структуру базы

-- ОТКЛЮЧЕНИЕ RLS (чтобы убрать бесконечную загрузку)
ALTER TABLE IF EXISTS modules DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS vocabulary DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS media_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS subtitles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS grammar_topics DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS vocabulary_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS quests DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS daily_quests DISABLE ROW LEVEL SECURITY;

-- СОЗДАНИЕ ТАБЛИЦЫ vocabulary_progress (если её нет)
-- Эта таблица нужна для getModuleStats(), без неё код зависает
CREATE TABLE IF NOT EXISTS vocabulary_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  word_id UUID REFERENCES vocabulary(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'new', -- 'new', 'learning', 'mastered'
  review_count INTEGER DEFAULT 0,
  last_reviewed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Добавляем role в profiles (для админки)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Проверяем, что хотя бы 1 видео есть
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM media_content LIMIT 1) THEN
    INSERT INTO media_content (title, description, type, cloudinary_url, duration, difficulty, category)
    VALUES (
      'Puss in Boots: The Last Wish', 
      'Official Trailer', 
      'video', 
      'https://res.cloudinary.com/demo/video/upload/v1683274983/puss_in_boots_trailer.mp4',
      145, 
      'intermediate', 
      'movies'
    );
  END IF;
END $$;
