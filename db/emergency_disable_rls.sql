-- =========================================================
-- EMERGENCY DISABLE RLS (ОТКЛЮЧЕНИЕ ВСЕЙ ЗАЩИТЫ)
-- =========================================================
-- Этот скрипт полностью отключает Row Level Security.
-- После его запуска база данных будет работать как обычная, без скрытия данных.

-- 1. ОТКЛЮЧАЕМ RLS НА ТАБЛИЦАХ
ALTER TABLE modules DISABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary DISABLE ROW LEVEL SECURITY;
ALTER TABLE media_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE subtitles DISABLE ROW LEVEL SECURITY;
ALTER TABLE grammar_topics DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE friends DISABLE ROW LEVEL SECURITY;
ALTER TABLE friend_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE dialogue_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_quests DISABLE ROW LEVEL SECURITY;
ALTER TABLE security_logs DISABLE ROW LEVEL SECURITY;

-- 2. УДАЛЯЕМ ВСЕ ПОЛИТИКИ (ЧТОБЫ ОНИ НЕ МЕШАЛИСЬ ДАЖЕ ЕСЛИ RLS ВКЛЮЧИТСЯ)
DROP POLICY IF EXISTS "Modules are viewable by everyone." ON modules;
DROP POLICY IF EXISTS "Vocabulary is viewable by everyone." ON vocabulary;
DROP POLICY IF EXISTS "Media content is viewable by everyone" ON media_content;
DROP POLICY IF EXISTS "Subtitles are viewable by everyone" ON subtitles;
DROP POLICY IF EXISTS "Grammar topics are viewable by everyone." ON grammar_topics;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can view own messages" ON chat_messages;

-- 3. ПРОВЕРКА (ЕСЛИ НУЖНО ПРОЧИТАТЬ СТАТУС)
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
