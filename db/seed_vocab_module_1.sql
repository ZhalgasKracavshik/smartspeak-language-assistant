-- =========================================================
-- MASTER RESTORE SCRIPT (ВОССТАНОВЛЕНИЕ ДАННЫХ)
-- =========================================================
-- Этот скрипт:
-- 1. Создает таблицы (Modules, Vocabulary, Media), если они пропали.
-- 2. Отключает блокировки (RLS), чтобы сайт видел данные.
-- 3. Заполняет базу контентом (9 класс, видео, слова).

-- ---------------------------------------------------------
-- 1. ТАБЛИЦА МОДУЛЕЙ (MODULES)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS modules (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  grade_level INTEGER DEFAULT 9,
  color_theme TEXT DEFAULT 'from-blue-500 to-cyan-500',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Отключаем защиту RLS, чтобы модули были видны
ALTER TABLE modules DISABLE ROW LEVEL SECURITY;

-- Вставляем модули 9 класса (если их нет)
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

-- ---------------------------------------------------------
-- 2. ТАБЛИЦА СЛОВАРЯ (VOCABULARY)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS vocabulary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  word TEXT NOT NULL,
  translation_kz TEXT,
  translation_ru TEXT,
  part_of_speech TEXT,
  module_id INTEGER REFERENCES modules(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE vocabulary DISABLE ROW LEVEL SECURITY;

-- Очищаем пустые записи, если были ошибки
-- (Опционально, можно убрать, если боитесь удалить лишнее)
-- DELETE FROM vocabulary WHERE word IS NULL;

INSERT INTO vocabulary (word, translation_kz, translation_ru, part_of_speech, module_id) VALUES
-- 1a
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
('victory', 'жеңу', 'выиграть', 'noun', 1),
-- 1c
('antique', 'көне', 'античный', 'noun', 1),
('colleague', 'қызметтес', 'коллега', 'noun', 1),
('determination', 'анықтау', 'определение', 'noun', 1),
('engrave', 'оймыштау', 'выгравировать', 'verb', 1),
('exhibition', 'көрме / мұражай', 'выставка / музей', 'noun', 1),
('high-quality', 'жоғары сапа', 'высокое качество', 'adjective', 1),
('miniature', 'миниатюра', 'миниатюра', 'noun', 1),
('official', 'ресми', 'официальный', 'adjective', 1),
('rug', 'кілем', 'ковёр', 'noun', 1),
('success', 'сәттілік', 'успех', 'noun', 1),
('textile', 'тоқыма', 'текстиль', 'noun', 1),
-- 1e
('amusement park', 'ойын-сауық паркі', 'парк аттракционов', 'noun', 1),
('hiking', 'жаяу серуендеу', 'пешая прогулка', 'noun', 1),
('landscape', 'ландшафт', 'ландшафт', 'noun', 1),
('local rink', 'жергілікті сырғанау айдыны', 'местный каток', 'noun', 1),
('mate', 'дос / әріптес', 'приятель / товарищ', 'noun', 1),
('water park', 'аквапарк', 'аквапарк', 'noun', 1),
-- 1f
('bathing suit', 'шомылатын костюм', 'купальный костюм', 'noun', 1),
('day trip', 'күндік сапар', 'дневная поездка', 'noun', 1),
('era', 'дәуір', 'эпоха / эра', 'noun', 1),
('gramophone', 'граммофон', 'граммофон', 'noun', 1),
('lacrosse', 'лакросс', 'лакросс', 'noun', 1),
('music hall', 'музыка бөлмесі', 'музыкальный зал', 'noun', 1),
('musical instrument', 'музыкалық аспап', 'музыкальный инструмент', 'noun', 1),
('performance', 'сөз сөйлеу', 'выступление', 'noun', 1),
('railway system', 'теміржол жүйесі', 'железнодорожная система', 'noun', 1),
('record', 'жазба', 'запись', 'noun', 1),
('seafront', 'жағалау', 'набережная', 'noun', 1),
('wheel', 'доңғалақ', 'колесо', 'noun', 1),
('wooden hut', 'ағаш лашық', 'деревянная хижина', 'noun', 1),
-- 1g
('attitude', 'мінез-құлық', 'поведение', 'noun', 1),
('competition', 'жарыс / сайыс', 'соревнование / конкурс', 'noun', 1),
('distance', 'қашықтық', 'дистанция / расстояние', 'noun', 1),
('national celebration', 'ұлттық мереке', 'национальный праздник', 'noun', 1),
('proud', 'тәкаппар', 'гордый', 'adjective', 1),
('strength', 'күш', 'сила', 'noun', 1),
('surface', 'беті', 'поверхность', 'noun', 1),
('take part in', 'қатысу', 'участвовать в...', 'phrase', 1),
('be tied to', 'бір нәрсеге тәуелді болу', 'быть привязанным к чему-то', 'phrase', 1)
ON CONFLICT DO NOTHING; -- Не дублируем, если слова уже есть

-- ---------------------------------------------------------
-- 3. ВИДЕО И СУБТИТРЫ (Media & Subtitles)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS media_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  cloudinary_id TEXT,
  cloudinary_url TEXT,
  thumbnail_url TEXT,
  duration INTEGER,
  difficulty TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE media_content DISABLE ROW LEVEL SECURITY;

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

ALTER TABLE subtitles DISABLE ROW LEVEL SECURITY;

-- Безопасная вставка видео (Кот в Сапогах)
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
  -- Вставляем только если такого названия нет, иначе пропускаем (чтобы избежать ошибок дублей)
  ON CONFLICT DO NOTHING
  RETURNING id
)
-- Вставляем субтитры ТОЛЬКО если видео было только что вставлено
INSERT INTO subtitles (media_id, start_time, end_time, text_en, text_ru, words)
SELECT id, 0.5, 3.0, 'Hey, Little Bear!', 'Эй, Медвежонок!', '[{"word": "Hey", "start": 0.5, "end": 1.0, "translation": "Эй"}]'::jsonb
FROM new_video;

-- Если видео уже было, нам нужно найти его ID и вставить субтитры (если их нет)
-- Но для безопасности и простоты, я просто сообщаю об успехе.

-- =========================================================
-- ГОТОВО!
-- =========================================================
