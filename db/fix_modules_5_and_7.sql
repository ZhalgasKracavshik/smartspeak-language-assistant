-- ===================================================================
-- FIX SCRIPT: CORRECT MODULE TITLES AND RE-POPULATE CONTENT
-- ===================================================================

-- 1. Update Module Titles to match User Screenshot Order
-- Module 5 should be "Reading for Pleasure"
-- Module 6 should be "Traditions & Language"
-- Module 7 should be "Music & Film"

UPDATE modules SET title = 'Reading for Pleasure', description = 'Fiction types, phrasal verbs', color_theme = 'from-purple-500 to-indigo-500' WHERE id = 5;
UPDATE modules SET title = 'Traditions & Language', description = 'Celebrations, adjectives, phrasal verbs', color_theme = 'from-orange-500 to-amber-500' WHERE id = 6;
UPDATE modules SET title = 'Music & Film', description = 'Films, music, dancing, phrasal verbs', color_theme = 'from-pink-500 to-rose-500' WHERE id = 7;

-- 2. Clean up existing vocab for these specific IDs to avoid duplicates/confusion
DELETE FROM module_vocabulary WHERE module_id IN (5, 6, 7);
DELETE FROM phrasal_verbs WHERE module_id IN (5, 6, 7);
DELETE FROM grammar_rules WHERE module_id IN (5, 6, 7);
DELETE FROM practice_questions WHERE module_id IN (5, 6, 7);

-- 3. Re-Insert Content for Module 5: Reading for Pleasure (formerly Module 6 in SQL)
-- Using Content from former "Reading for Pleasure" section
INSERT INTO module_vocabulary (word, translation_ru, translation_kz, module_id, section) VALUES
-- Section 5a (Sun/Sculptor)
('sun', 'солнце', 'күн', 5, '5a'),
('creature', 'существо', 'жан', 5, '5a'),
('sculptor', 'скульптор', 'мүсінші', 5, '5a'),
('professional', 'профессиональный', 'кәсіби', 5, '5a'),
('crowning', 'коронация', 'тәж киғізу', 5, '5a'),
('come alive', 'оживать', 'жанданып кету', 5, '5a'),
-- Section 5c (Nauryz)
('calendar', 'календарь', 'күнтізбе', 5, '5c'),
('equinox', 'равноденствие', 'күндіз бен түннің теңелуі', 5, '5c'),
('prosperity', 'процветание', 'өркендеу', 5, '5c'),
('demonstrate', 'демонстрировать', 'көрсету', 5, '5c'),
('ingredient', 'ингредиент', 'ингредиент', 5, '5c'),
('forgiveness', 'прощение', 'кешірім', 5, '5c'),
('celebrate', 'праздновать', 'мерекелеу', 5, '5c'),
-- Section 5e (Environment)
('reduce', 'уменьшать', 'азайту', 5, '5e'),
('waste', 'отходы', 'қалдық', 5, '5e'),
('presentation', 'презентация', 'презентация', 5, '5e'),
('environmentally-friendly', 'экологически чистый', 'экологиялық таза', 5, '5e'),
-- Section 5f (War Memorials)
('war', 'война', 'соғыс', 5, '5f'),
('honour', 'честь', 'құрмет', 5, '5f'),
('memorial', 'мемориал', 'ескерткіш', 5, '5f'),
('bugle', 'горн', 'керней', 5, '5f'),
('silence', 'тишина', 'тыныштық', 5, '5f'),
('poppy', 'мак', 'көкнәр', 5, '5f'),
('battlefield', 'поле боя', 'ұрыс алаңы', 5, '5f');

-- 4. Re-Insert Content for Module 6: Traditions & Language (formerly Module 5 in SQL)
INSERT INTO module_vocabulary (word, translation_ru, translation_kz, module_id, section) VALUES
-- Section 6a (Kazakh Legends)
('light', 'свет', 'жарық', 6, '6a'),
('footsteps', 'шаги', 'қадамдар', 6, '6a'),
('sight', 'зрение/вид', 'көру/көрініс', 6, '6a'),
('burn', 'гореть', 'жану', 6, '6a'),
('chain', 'цепь', 'тізбек', 6, '6a'),
('insulted', 'оскорбленный', 'қорланған', 6, '6a'),
('revenge', 'месть', 'кек', 6, '6a'),
('greed', 'жадность', 'сараңдық', 6, '6a'),
-- Section 6b (Treasure Hunt)
('heat', 'жара', 'ыстық', 6, '6b'),
('pickaxe', 'кирка', 'кетпен', 6, '6b'),
('rope', 'веревка', 'арқан', 6, '6b'),
('mark', 'отметка', 'белгі', 6, '6b'),
('compass', 'компас', 'компас', 6, '6b'),
('hiss', 'шипение', 'сыбдыр', 6, '6b'),
-- Section 6c (Greed/Treasure)
('abandoned', 'заброшенный', 'тасталған', 6, '6c'),
('dig', 'копать', 'қазу', 6, '6c'),
('purse', 'кошелек', 'әмиян', 6, '6c'),
('contented', 'довольный', 'қанағат', 6, '6c'),
('eternal', 'вечный', 'мәңгілік', 6, '6c'),
('palace', 'дворец', 'сарай', 6, '6c'),
('greed', 'жадность', 'сараңдық', 6, '6c'),
-- Section 6d (Philosophers/Goals)
('figure', 'фигура/личность', 'тұлға', 6, '6d'),
('philosopher', 'философ', 'философ', 6, '6d'),
('respect', 'уважение', 'құрмет', 6, '6d'),
('military theory', 'военная теория', 'әскери теория', 6, '6d'),
('living conditions', 'условия жизни', 'өмір сүру жағдайлары', 6, '6d'),
('achieve', 'достигать', 'жету', 6, '6d'),
('goal', 'цель', 'мақсат', 6, '6d');

-- 5. Re-Insert Content for Module 7: Music & Film
INSERT INTO module_vocabulary (word, translation_ru, translation_kz, module_id, section) VALUES
-- Section 7a (Universe/Inspiration)
('rush', 'спешить', 'асығу', 7, '7a'),
('wonder', 'чудо', 'керемет', 7, '7a'),
('universe', 'вселенная', 'әлем', 7, '7a'),
('inspirational', 'вдохновляющий', 'шабыттандырушы', 7, '7a'),
('precious', 'драгоценный', 'құнды', 7, '7a'),
('capture', 'захватывать', 'ұстау', 7, '7a'),
('self-belief', 'вера в себя', 'өзіне сенім', 7, '7a'),
-- Section 7c (Internet/Social Media)
('access', 'доступ', 'қол жеткізу', 7, '7c'),
('interconnection', 'взаимосвязь', 'өзара байланыс', 7, '7c'),
('lyrics', 'текст песни', 'ән мәтіні', 7, '7c'),
('purchase', 'покупать', 'сатып алу', 7, '7c'),
('social media', 'социальные сети', 'әлеуметтік желілер', 7, '7c'),
('available', 'доступный', 'қол жетімді', 7, '7c'),
-- Section 7e (Music/Dance)
('marionette', 'марионетка', 'қуыршақ', 7, '7e'),
('rhythm', 'ритм', 'ырғақ', 7, '7e'),
('ribbon', 'лента', 'таспа', 7, '7e'),
('couple', 'пара', 'жұп', 7, '7e'),
('compose', 'сочинять', 'шығарма жазу', 7, '7e'),
('upbeat', 'оптимистичный', 'бодрый', 7, '7e'),
('movement', 'движение', 'қозғалыс', 7, '7e'),
-- Section 7f (Music Elements)
('element', 'элемент', 'элемент', 7, '7f'),
('tune', 'мелодия', 'әуен', 7, '7f'),
('bone', 'кость', 'сүйек', 7, '7f'),
('pitch', 'высота звука', 'дыбыс биіктігі', 7, '7f'),
('organize', 'организовывать', 'ұйымдастыру', 7, '7f'),
('divide', 'разделять', 'бөлу', 7, '7f'),
('harmony', 'гармония', 'үйлесім', 7, '7f'),
-- Section 7g (Film Production)
('star', 'звезда', 'жұлдыз', 7, '7g'),
('direct', 'режиссировать', 'режиссураламен айналысу', 7, '7g'),
('villain', 'злодей', 'зұлым', 7, '7g'),
('plot', 'сюжет', 'сюжет', 7, '7g'),
('defeat', 'поражение', 'жеңіліс', 7, '7g'),
('special effect', 'спецэффект', 'арнайы әсер', 7, '7g'),
('stunt', 'трюк', 'трюк', 7, '7g'),
('genre', 'жанр', 'жанр', 7, '7g');

-- 6. Insert Grammar Rules for Module 5, 6, 7
-- Module 5: Readings -> Conditionals? (Originally Mod 5 had Conditionals).
-- Wait, in old SQL, Module 5 was Traditions. Module 6 was Reading.
-- Now Module 5 is Reading. So Grammar for 5 should be what was 6?
-- Old Mod 6 (Reading) had Wishes/If only.
-- Old Mod 5 (Traditions) had Conditionals.
-- So New Mod 5 (Reading) -> Wishes/If Only.
-- New Mod 6 (Traditions) -> Conditionals.

INSERT INTO grammar_rules (module_id, title_en, title_ru, rule_en, rule_ru, examples) VALUES
-- New Module 5 (Reading): Wishes / If Only
(5, 'Wishes and If only', 'Wishes / If only (Тілектер)',
 'We use "wish" or "if only" to express a desire for something to be different.',
 'Біз "wish" немесе "if only" сөздерін бір нәрсенің басқаша болғанын қалау үшін қолданамыз.',
 '["I wish I had more time.", "If only I knew the answer."]'::jsonb),

-- New Module 6 (Traditions): Conditionals
(6, 'Conditionals (Type 1, 2, 3)', 'Шартты райлар (1, 2, 3 түрлері)',
 'Conditionals describe the result of something that might happen (present or future) or might have happened but didn''t (past).',
 'Шартты сөйлемдер орындалуы мүмкін (осы шақ немесе келешек) немесе орындалмаған (өткен шақ) іс-әрекеттің нәтижесін сипаттайды.',
 '["If it rains, we will stay home.", "If I were you, I would study harder."]'::jsonb),

-- New Module 7 (Music): Relative Clauses
(7, 'Relative Clauses', 'Қатыстық сөйлемдер',
 'Relative clauses give more information about a person, thing, or place, using words like who, which, where.',
 'Қатыстық сөйлемдер who, which, where сияқты сөздерді қолдана отырып, адам, зат немесе орын туралы көбірек ақпарат береді.',
 '["The film which we watched was scary.", "The actor who played the villain was great."]'::jsonb);

-- 7. Insert Phrasal Verbs
-- Mod 5 (Reading) -> keep (from old Mod 6)
-- Mod 6 (Traditions) -> set (from old Mod 5)
-- Mod 7 (Music) -> carry (from old Mod 7)

INSERT INTO phrasal_verbs (module_id, base_verb, particle, meaning_en, meaning_ru, meaning_kz, example_en, example_ru) VALUES
-- Mod 5 (Reading) - keep
(5, 'keep', 'on', 'continue', 'продолжать', 'жалғастыру', 'Keep on reading!', 'Продолжай читать!'),
(5, 'keep', 'off', 'avoid', 'избегать', 'аулақ болу', 'Keep off the grass.', 'Не ходите по траве.'),
-- Mod 6 (Traditions) - set
(6, 'set', 'up', 'establish', 'устанавливать', 'орнату', 'They set up a new company.', 'Они основали новую компанию.'),
(6, 'set', 'off', 'start journey', 'отправляться', 'жолға шығу', 'We set off early.', 'Мы отправились рано.'),
-- Mod 7 (Music) - carry
(7, 'carry', 'on', 'continue', 'продолжать', 'жалғастыру', 'Carry on with your work.', 'Продолжай работу.'),
(7, 'carry', 'out', 'perform', 'выполнять', 'орындау', 'Scientists carry out experiments.', 'Ученые проводят эксперименты.');

-- 8. Practice Questions (Placeholder - will be auto-generated mostly, but adding a few hard ones)
INSERT INTO practice_questions (module_id, question_en, question_ru, question_kz, answer_key, difficulty) VALUES
(7, 'Complete the sentence: "The director decided to ___ the film in black and white."', 'Дополните: Режиссер решил ___ фильм в черно-белом.', 'Сөйлемді толықтырыңыз', 'shoot', 'hard'),
(5, 'Translate: "To save for later use"', 'Перевести: Сохранить для использования позже', 'Аудару', 'store', 'medium');

SELECT 'Fix completed. Modules 5, 6, 7 titles and content updated.' AS status;
