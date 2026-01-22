-- ===================================================================
-- GRADE 9 CONTENT - PART 3: MODULES 7-9
-- Populates modules 7-9 with textbook content
-- ===================================================================

-- Clean up old vocabulary from modules 7-9
DELETE FROM module_vocabulary WHERE module_id IN (
  SELECT id FROM modules WHERE grade_level = 9 AND title IN (
    'Entertainment & Media',
    'Travel & Tourism',
    'Science & Technology'
  )
);

-- ===================================================================
-- MODULE 7: ENTERTAINMENT & MEDIA
-- ===================================================================

-- Module 7 Vocabulary - Section 7a (Universe/Inspiration)
INSERT INTO module_vocabulary (word, translation_ru, translation_kz, module_id, section)
SELECT 
  word, translation_ru, translation_kz,
  (SELECT id FROM modules WHERE title = 'Entertainment & Media' AND grade_level = 9 LIMIT 1),
  '7a'
FROM (VALUES
  ('rush', 'спешить', 'асығу'),
  ('wonder', 'чудо', 'керемет'),
  ('universe', 'вселенная', 'әлем'),
  ('inspirational', 'вдохновляющий', 'шабыттандырушы'),
  ('precious', 'драгоценный', 'құнды'),
  ('capture', 'захватывать', 'ұстау'),
  ('self-belief', 'вера в себя', 'өзіне сенім')
) AS v(word, translation_ru, translation_kz);

-- Module 7 Vocabulary - Section 7c (Internet/Social Media)
INSERT INTO module_vocabulary (word, translation_ru, translation_kz, module_id, section)
SELECT 
  word, translation_ru, translation_kz,
  (SELECT id FROM modules WHERE title = 'Entertainment & Media' AND grade_level = 9 LIMIT 1),
  '7c'
FROM (VALUES
  ('access', 'доступ', 'қол жеткізу'),
  ('interconnection', 'взаимосвязь', 'өзара байланыс'),
  ('lyrics', 'текст песни', 'ән мәтіні'),
  ('purchase', 'покупать', 'сатып алу'),
  ('social media', 'социальные сети', 'әлеуметтік желілер'),
  ('available', 'доступный', 'қол жетімді')
) AS v(word, translation_ru, translation_kz);

-- Module 7 Vocabulary - Section 7e (Music/Dance)
INSERT INTO module_vocabulary (word, translation_ru, translation_kz, module_id, section)
SELECT 
  word, translation_ru, translation_kz,
  (SELECT id FROM modules WHERE title = 'Entertainment & Media' AND grade_level = 9 LIMIT 1),
  '7e'
FROM (VALUES
  ('marionette', 'марионетка', 'қуыршақ'),
  ('rhythm', 'ритм', 'ырғақ'),
  ('ribbon', 'лента', 'таспа'),
  ('couple', 'пара', 'жұп'),
  ('compose', 'сочинять', 'шығарма жазу'),
  ('upbeat', 'оптимистичный', 'бодрый'),
  ('movement', 'движение', 'қозғалыс')
) AS v(word, translation_ru, translation_kz);

-- Module 7 Vocabulary - Section 7f (Music Elements)
INSERT INTO module_vocabulary (word, translation_ru, translation_kz, module_id, section)
SELECT 
  word, translation_ru, translation_kz,
  (SELECT id FROM modules WHERE title = 'Entertainment & Media' AND grade_level = 9 LIMIT 1),
  '7f'
FROM (VALUES
  ('element', 'элемент', 'элемент'),
  ('tune', 'мелодия', 'әуен'),
  ('bone', 'кость', 'сүйек'),
  ('pitch', 'высота звука', 'дыбыс биіктігі'),
  ('organize', 'организовывать', 'ұйымдастыру'),
  ('divide', 'разделять', 'бөлу'),
  ('harmony', 'гармония', 'үйлесім')
) AS v(word, translation_ru, translation_kz);

-- Module 7 Vocabulary - Section 7g (Film Production)
INSERT INTO module_vocabulary (word, translation_ru, translation_kz, module_id, section)
SELECT 
  word, translation_ru, translation_kz,
  (SELECT id FROM modules WHERE title = 'Entertainment & Media' AND grade_level = 9 LIMIT 1),
  '7g'
FROM (VALUES
  ('star', 'звезда', 'жұлдыз'),
  ('direct', 'режиссировать', 'режиссураламен айналысу'),
  ('villain', 'злодей', 'зұлым'),
  ('plot', 'сюжет', 'сюжет'),
  ('defeat', 'поражение', 'жеңіліс'),
  ('special effect', 'спецэффект', 'арнайы әсер'),
  ('stunt', 'трюк', 'трюк'),
  ('genre', 'жанр', 'жанр')
) AS v(word, translation_ru, translation_kz);

-- ===================================================================
-- MODULE 8: TRAVEL & TOURISM
-- ===================================================================

-- Module 8 Vocabulary - Section 8a (Travel Destinations)
INSERT INTO module_vocabulary (word, translation_ru, translation_kz, module_id, section)
SELECT 
  word, translation_ru, translation_kz,
  (SELECT id FROM modules WHERE title = 'Travel & Tourism' AND grade_level = 9 LIMIT 1),
  '8a'
FROM (VALUES
  ('destination', 'место назначения', 'мақсатты жер'),
  ('marvel', 'чудо', 'ғажайып'),
  ('domed', 'куполообразный', 'күмбезді'),
  ('meander', 'извиваться', 'иірілу'),
  ('activity-filled', 'наполненный деятельностью', 'іс-шараға толы'),
  ('stroll', 'прогулка', 'серуендеу')
) AS v(word, translation_ru, translation_kz);

-- Module 8 Vocabulary - Section 8c (Burabay/Landscapes)
INSERT INTO module_vocabulary (word, translation_ru, translation_kz, module_id, section)
SELECT 
  word, translation_ru, translation_kz,
  (SELECT id FROM modules WHERE title = 'Travel & Tourism' AND grade_level = 9 LIMIT 1),
  '8c'
FROM (VALUES
  ('highest', 'самый высокий', 'ең биік'),
  ('dense', 'плотный', 'тығыз'),
  ('crystal-clear', 'кристально чистый', 'мөлдір'),
  ('advance', 'продвигаться', 'жылжу'),
  ('defeat', 'поражение', 'жеңіліс'),
  ('wounded', 'раненый', 'жараланған')
) AS v(word, translation_ru, translation_kz);

-- Module 8 Vocabulary - Section 8d (Travel Problems)
INSERT INTO module_vocabulary (word, translation_ru, translation_kz, module_id, section)
SELECT 
  word, translation_ru, translation_kz,
  (SELECT id FROM modules WHERE title = 'Travel & Tourism' AND grade_level = 9 LIMIT 1),
  '8d'
FROM (VALUES
  ('delay', 'задержка', 'кідіріс'),
  ('announcement', 'объявление', 'хабарлама'),
  ('sticker', 'наклейка', 'жапсырма'),
  ('handle', 'ручка', 'тұтқа'),
  ('trip', 'поездка', 'саяхат')
) AS v(word, translation_ru, translation_kz);

-- Module 8 Vocabulary - Section 8e (Mausoleum/Heritage)
INSERT INTO module_vocabulary (word, translation_ru, translation_kz, module_id, section)
SELECT 
  word, translation_ru, translation_kz,
  (SELECT id FROM modules WHERE title = 'Travel & Tourism' AND grade_level = 9 LIMIT 1),
  '8e'
FROM (VALUES
  ('grand', 'великий', 'үлкен'),
  ('locate', 'располагать', 'орналасқан'),
  ('landscape', 'пейзаж', 'көрініс'),
  ('privacy', 'приватность', 'жеке'),
  ('mausoleum', 'мавзолей', 'кесене'),
  ('modern-day', 'современный', 'қазіргі'),
  ('pilgrim', 'паломник', 'қажылық')
) AS v(word, translation_ru, translation_kz);

-- Module 8 Vocabulary - Section 8f (Silk Road Legacy)
INSERT INTO module_vocabulary (word, translation_ru, translation_kz, module_id, section)
SELECT 
  word, translation_ru, translation_kz,
  (SELECT id FROM modules WHERE title = 'Travel & Tourism' AND grade_level = 9 LIMIT 1),
  '8f'
FROM (VALUES
  ('loop', 'петля', 'ілмек'),
  ('settlement', 'поселение', 'қоныс'),
  ('merchant', 'купец', 'саудагер'),
  ('exchange', 'обмен', 'алмасу'),
  ('porcelain', 'фарфор', 'фарфор'),
  ('gunpowder', 'порох', 'порох'),
  ('legacy', 'наследие', 'мұра'),
  ('globalization', 'глобализация', 'жаһандану')
) AS v(word, translation_ru, translation_kz);

-- ===================================================================
-- MODULE 9: SCIENCE & TECHNOLOGY
-- ===================================================================

-- Module 9 Vocabulary - Section 9a (Bionic Technology)
INSERT INTO module_vocabulary (word, translation_ru, translation_kz, module_id, section)
SELECT 
  word, translation_ru, translation_kz,
  (SELECT id FROM modules WHERE title = 'Science & Technology' AND grade_level = 9 LIMIT 1),
  '9a'
FROM (VALUES
  ('fascination', 'очарование', 'қызығушылық'),
  ('flesh', 'плоть', 'ет'),
  ('part-mechanical', 'частично механический', 'ішінара механикалық'),
  ('identify', 'идентифицировать', 'анықтау'),
  ('sophisticated', 'сложный', 'күрделі'),
  ('limb', 'конечность', 'мүше'),
  ('artificial', 'искусственный', 'жасанды'),
  ('function', 'функция', 'функция')
) AS v(word, translation_ru, translation_kz);

-- Module 9 Vocabulary - Section 9c (Screenagers/Addiction)
INSERT INTO module_vocabulary (word, translation_ru, translation_kz, module_id, section)
SELECT 
  word, translation_ru, translation_kz,
  (SELECT id FROM modules WHERE title = 'Science & Technology' AND grade_level = 9 LIMIT 1),
  '9c'
FROM (VALUES
  ('screenager', 'скринажер', 'экранға тәуелді жасөспірім'),
  ('constantly', 'постоянно', 'үнемі'),
  ('glued to', 'приклеенный к', 'жабысқан'),
  ('multi-tasking', 'многозадачность', 'көп тапсырма'),
  ('addiction', 'зависимость', 'тәуелділік'),
  ('boot camp', 'исправительный лагерь', 'түзеу лагері'),
  ('balance', 'баланс', 'тепе-теңдік')
) AS v(word, translation_ru, translation_kz);

-- Module 9 Vocabulary - Section 9d (Camera Problems)
INSERT INTO module_vocabulary (word, translation_ru, translation_kz, module_id, section)
SELECT 
  word, translation_ru, translation_kz,
  (SELECT id FROM modules WHERE title = 'Science & Technology' AND grade_level = 9 LIMIT 1),
  '9d'
FROM (VALUES
  ('faulty', 'неисправный', 'ақаулы'),
  ('lens', 'линза', 'линза'),
  ('scratched', 'поцарапанный', 'тырналған'),
  ('blurry', 'размытый', 'бұлдыр'),
  ('no change', 'без изменений', 'өзгеріссіз')
) AS v(word, translation_ru, translation_kz);

-- Module 9 Vocabulary - Section 9e (Science Museum)
INSERT INTO module_vocabulary (word, translation_ru, translation_kz, module_id, section)
SELECT 
  word, translation_ru, translation_kz,
  (SELECT id FROM modules WHERE title = 'Science & Technology' AND grade_level = 9 LIMIT 1),
  '9e'
FROM (VALUES
  ('attraction', 'аттракцион', 'аттракцион'),
  ('planetarium', 'планетарий', 'планетарий'),
  ('universe', 'вселенная', 'әлем'),
  ('interactive', 'интерактивный', 'интерактивті'),
  ('optical illusion', 'оптическая иллюзия', 'оптикалық иллюзия'),
  ('gravity', 'гравитация', 'гравитация')
) AS v(word, translation_ru, translation_kz);

-- Module 9 Vocabulary - Section 9f (Computer Parts)
INSERT INTO module_vocabulary (word, translation_ru, translation_kz, module_id, section)
SELECT 
  word, translation_ru, translation_kz,
  (SELECT id FROM modules WHERE title = 'Science & Technology' AND grade_level = 9 LIMIT 1),
  '9f'
FROM (VALUES
  ('circuit board', 'печатная плата', 'микросхема тақтасы'),
  ('command centre', 'командный центр', 'басқару орталығы'),
  ('interpret', 'интерпретировать', 'түсіндіру'),
  ('software', 'программное обеспечение', 'бағдарлама'),
  ('generate', 'генерировать', 'жасау'),
  ('graphics', 'графика', 'графика'),
  ('permanently', 'постоянно', 'тұрақты'),
  ('port', 'порт', 'порт')
) AS v(word, translation_ru, translation_kz);

-- ===================================================================
-- COMPLETION MESSAGE
-- ===================================================================
SELECT 'Part 3 (Modules 7-9) completed successfully!' AS status;
SELECT 'All Grade 9 modules vocabulary loaded!' AS final_status;
