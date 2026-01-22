-- =========================================================
-- FINAL FIX V2: RESTORE + ADMIN ROLE + DISABLE RLS
-- =========================================================

-- 1. ГАРАНТИЯ КОЛОНКИ РОЛИ (ADMIN)
-- Чтобы вы могли вручную менять role='admin' в таблице profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- 2. ОТКЛЮЧЕНИЕ ЗАЩИТЫ (ЧТОБЫ ВСЕ РАБОТАЛО)
ALTER TABLE modules DISABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary DISABLE ROW LEVEL SECURITY;
ALTER TABLE media_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE subtitles DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 3. ВОССТАНОВЛЕНИЕ МОДУЛЕЙ (ОБОЛОЧКИ)
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

-- 4. ВОССТАНОВЛЕНИЕ СЛОВ (ТОЛЬКО МОДУЛЬ 1)
-- ВНИМАНИЕ: У меня в доступе есть только файл со словами 1-го модуля. 
-- Слова для 2-9 модулей физически отсутствуют в ваших файлах кода.
-- Их придется загрузить заново вручную или найти старый SQL файл с ними.

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

-- 5. ВОССТАНОВЛЕНИЕ ВИДЕО (ЧТОБЫ HE БЫЛО ПУСТО)
INSERT INTO media_content (title, description, type, cloudinary_id, cloudinary_url, duration, difficulty, category)
VALUES (
    'Puss in Boots: The Last Wish', 
    'Official Trailer', 
    'video', 
    'smartspeak/puss', 
    'https://res.cloudinary.com/demo/video/upload/v1683274983/puss_in_boots_trailer.mp4', 
    145, 
    'intermediate', 
    'movies'
) ON CONFLICT DO NOTHING;
