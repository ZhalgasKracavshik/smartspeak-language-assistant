-- ===================================================================
-- GRADE 9 CONTENT - PART 2: MODULES 4-6
-- Populates modules 4-6 with textbook content
-- ===================================================================

-- Clean up old vocabulary from modules 4-6
DELETE FROM module_vocabulary WHERE module_id IN (
  SELECT id FROM modules WHERE grade_level = 9 AND title IN (
    'Charities & Conflict',
    'Traditions & Language',
    'Reading for Pleasure'
  )
);

-- ===================================================================
-- MODULE 4: CHARITIES & CONFLICT
-- ===================================================================

-- Module 4 Vocabulary - Section 4a (Achievements/Inspiration)
INSERT INTO module_vocabulary (word, translation_ru, translation_kz, module_id, section)
SELECT 
  word, translation_ru, translation_kz,
  (SELECT id FROM modules WHERE title = 'Charities & Conflict' AND grade_level = 9 LIMIT 1),
  '4a'
FROM (VALUES
  ('honour', 'честь', 'құрмет'),
  ('awareness', 'осведомленность', 'хабардарлық'),
  ('objective', 'цель', 'мақсат'),
  ('feat', 'подвиг', 'ерлік'),
  ('overcome obstacles', 'преодолевать препятствия', 'кедергілерді жеңу'),
  ('inspiration', 'вдохновение', 'шабыт'),
  ('determination', 'решительность', 'шешімділік')
) AS v(word, translation_ru, translation_kz);

-- Module 4 Vocabulary - Section 4c (Refugee Camps/Aid)
INSERT INTO module_vocabulary (word, translation_ru, translation_kz, module_id, section)
SELECT 
  word, translation_ru, translation_kz,
  (SELECT id FROM modules WHERE title = 'Charities & Conflict' AND grade_level = 9 LIMIT 1),
  '4c'
FROM (VALUES
  ('refugee camp', 'лагерь беженцев', 'босқындар лагері'),
  ('non-profit', 'некоммерческий', 'коммерциялық емес'),
  ('healthcare', 'здравоохранение', 'денсаулық сақтау'),
  ('sustainable development', 'устойчивое развитие', 'тұрақты даму'),
  ('aid', 'помощь', 'көмек')
) AS v(word, translation_ru, translation_kz);

-- Module 4 Vocabulary - Section 4e (Wildlife Conservation)
INSERT INTO module_vocabulary (word, translation_ru, translation_kz, module_id, section)
SELECT 
  word, translation_ru, translation_kz,
  (SELECT id FROM modules WHERE title = 'Charities & Conflict' AND grade_level = 9 LIMIT 1),
  '4e'
FROM (VALUES
  ('sanctuary', 'заповедник', 'қорық'),
  ('abused', 'подвергшийся жестокому обращению', 'қатыгездікке ұшыраған'),
  ('conservation', 'сохранение', 'сақтау'),
  ('critically endangered', 'под критической угрозой исчезновения', 'өте қауіпті'),
  ('habitat', 'среда обитания', 'мекен')
) AS v(word, translation_ru, translation_kz);

-- Module 4 Vocabulary - Section 4f (UNESCO Objectives)
INSERT INTO module_vocabulary (word, translation_ru, translation_kz, module_id, section)
SELECT 
  word, translation_ru, translation_kz,
  (SELECT id FROM modules WHERE title = 'Charities & Conflict' AND grade_level = 9 LIMIT 1),
  '4f'
FROM (VALUES
  ('allied', 'союзный', 'одақтас'),
  ('headquarters', 'штаб-квартира', 'штаб-пәтер'),
  ('promote peace', 'содействовать миру', 'бейбітшілікті қолдау'),
  ('cultural heritage', 'культурное наследие', 'мәдени мұра')
) AS v(word, translation_ru, translation_kz);

-- ===================================================================
-- MODULE 5: TRADITIONS & LANGUAGE (Literature/Stories)
-- ===================================================================

-- Module 5 Vocabulary - Section 5a (Kazakh Legends)
INSERT INTO module_vocabulary (word, translation_ru, translation_kz, module_id, section)
SELECT 
  word, translation_ru, translation_kz,
  (SELECT id FROM modules WHERE title = 'Traditions & Language' AND grade_level = 9 LIMIT 1),
  '5a'
FROM (VALUES
  ('light', 'свет', 'жарық'),
  ('footsteps', 'шаги', 'қадамдар'),
  ('sight', 'зрение/вид', 'көру/көрініс'),
  ('burn', 'гореть', 'жану'),
  ('chain', 'цепь', 'тізбек'),
  ('insulted', 'оскорбленный', 'қорланған'),
  ('revenge', 'месть', 'кек'),
  ('greed', 'жадность', 'сараңдық')
) AS v(word, translation_ru, translation_kz);

-- Module 5 Vocabulary - Section 5b (Treasure Hunt)
INSERT INTO module_vocabulary (word, translation_ru, translation_kz, module_id, section)
SELECT 
  word, translation_ru, translation_kz,
  (SELECT id FROM modules WHERE title = 'Traditions & Language' AND grade_level = 9 LIMIT 1),
  '5b'
FROM (VALUES
  ('heat', 'жара', 'ыстық'),
  ('pickaxe', 'кирка', 'кетпен'),
  ('rope', 'веревка', 'арқан'),
  ('mark', 'отметка', 'белгі'),
  ('compass', 'компас', 'компас'),
  ('hiss', 'шипение', 'сыбдыр')
) AS v(word, translation_ru, translation_kz);

-- Module 5 Vocabulary - Section 5c (Greed/Treasure)
INSERT INTO module_vocabulary (word, translation_ru, translation_kz, module_id, section)
SELECT 
  word, translation_ru, translation_kz,
  (SELECT id FROM modules WHERE title = 'Traditions & Language' AND grade_level = 9 LIMIT 1),
  '5c'
FROM (VALUES
  ('abandoned', 'заброшенный', 'тасталған'),
  ('dig', 'копать', 'қазу'),
  ('purse', 'кошелек', 'әмиян'),
  ('contented', 'довольный', 'қанағат'),
  ('eternal', 'вечный', 'мәңгілік'),
  ('palace', 'дворец', 'сарай'),
  ('greed', 'жадность', 'сараңдық')
) AS v(word, translation_ru, translation_kz);

-- Module 5 Vocabulary - Section 5d (Philosophers/Goals)
INSERT INTO module_vocabulary (word, translation_ru, translation_kz, module_id, section)
SELECT 
  word, translation_ru, translation_kz,
  (SELECT id FROM modules WHERE title = 'Traditions & Language' AND grade_level = 9 LIMIT 1),
  '5d'
FROM (VALUES
  ('figure', 'фигура/личность', 'тұлға'),
  ('philosopher', 'философ', 'философ'),
  ('respect', 'уважение', 'құрмет'),
  ('military theory', 'военная теория', 'әскери теория'),
  ('living conditions', 'условия жизни', 'өмір сүру жағдайлары'),
  ('achieve', 'достигать', 'жету'),
  ('goal', 'цель', 'мақсат')
) AS v(word, translation_ru, translation_kz);

-- ===================================================================
-- MODULE 6: READING FOR PLEASURE (Celebrations/Culture)
-- ===================================================================

-- Module 6 Vocabulary - Section 6a (Sun/Sculptor)
INSERT INTO module_vocabulary (word, translation_ru, translation_kz, module_id, section)
SELECT 
  word, translation_ru, translation_kz,
  (SELECT id FROM modules WHERE title = 'Reading for Pleasure' AND grade_level = 9 LIMIT 1),
  '6a'
FROM (VALUES
  ('sun', 'солнце', 'күн'),
  ('creature', 'существо', 'жан'),
  ('sculptor', 'скульптор', 'мүсінші'),
  ('professional', 'профессиональный', 'кәсіби'),
  ('crowning', 'коронация', 'тәж киғізу'),
  ('come alive', 'оживать', 'жанданып кету')
) AS v(word, translation_ru, translation_kz);

-- Module 6 Vocabulary - Section 6c (Nauryz Celebration)
INSERT INTO module_vocabulary (word, translation_ru, translation_kz, module_id, section)
SELECT 
  word, translation_ru, translation_kz,
  (SELECT id FROM modules WHERE title = 'Reading for Pleasure' AND grade_level = 9 LIMIT 1),
  '6c'
FROM (VALUES
  ('calendar', 'календарь', 'күнтізбе'),
  ('equinox', 'равноденствие', 'күндіз бен түннің теңелуі'),
  ('prosperity', 'процветание', 'өркендеу'),
  ('demonstrate', 'демонстрировать', 'көрсету'),
  ('ingredient', 'ингредиент', 'ингредиент'),
  ('forgiveness', 'прощение', 'кешірім'),
  ('celebrate', 'праздновать', 'мерекелеу')
) AS v(word, translation_ru, translation_kz);

-- Module 6 Vocabulary - Section 6e (Environmental Presentation)
INSERT INTO module_vocabulary (word, translation_ru, translation_kz, module_id, section)
SELECT 
  word, translation_ru, translation_kz,
  (SELECT id FROM modules WHERE title = 'Reading for Pleasure' AND grade_level = 9 LIMIT 1),
  '6e'
FROM (VALUES
  ('reduce', 'уменьшать', 'азайту'),
  ('waste', 'отходы', 'қалдық'),
  ('presentation', 'презентация', 'презентация'),
  ('environmentally-friendly', 'экологически чистый', 'экологиялық таза')
) AS v(word, translation_ru, translation_kz);

-- Module 6 Vocabulary - Section 6f (War Memorials)
INSERT INTO module_vocabulary (word, translation_ru, translation_kz, module_id, section)
SELECT 
  word, translation_ru, translation_kz,
  (SELECT id FROM modules WHERE title = 'Reading for Pleasure' AND grade_level = 9 LIMIT 1),
  '6f'
FROM (VALUES
  ('war', 'война', 'соғыс'),
  ('honour', 'честь', 'құрмет'),
  ('memorial', 'мемориал', 'ескерткіш'),
  ('bugle', 'горн', 'керней'),
  ('silence', 'тишина', 'тыныштық'),
  ('poppy', 'мак', 'көкнәр'),
  ('battlefield', 'поле боя', 'ұрыс алаңы')
) AS v(word, translation_ru, translation_kz);

-- ===================================================================
-- COMPLETION MESSAGE
-- ===================================================================
SELECT 'Part 2 (Modules 4-6) completed successfully!' AS status;
