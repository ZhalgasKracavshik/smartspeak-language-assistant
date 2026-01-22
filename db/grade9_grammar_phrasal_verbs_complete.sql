-- ===================================================================
-- GRADE 9 GRAMMAR & PHRASAL VERBS - COMPLETE (ALL 9 MODULES)
-- FIXED VERSION: Uses INTEGER for module_id to match modules table
-- ===================================================================

-- ===================================================================
-- STEP 1: CREATE TABLES (with correct types)
-- ===================================================================

-- Phrasal Verbs Table
CREATE TABLE IF NOT EXISTS phrasal_verbs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE, -- Changed from UUID to INTEGER
  base_verb TEXT NOT NULL,
  particle TEXT NOT NULL,
  meaning_en TEXT NOT NULL,
  meaning_ru TEXT,
  meaning_kz TEXT,
  example_en TEXT,
  example_ru TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grammar Rules Table
CREATE TABLE IF NOT EXISTS grammar_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE, -- Changed from UUID to INTEGER
  title_en TEXT NOT NULL,
  title_ru TEXT,
  rule_en TEXT NOT NULL,
  rule_ru TEXT,
  examples JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Practice Questions Table
CREATE TABLE IF NOT EXISTS practice_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE, -- Changed from UUID to INTEGER
  question_en TEXT NOT NULL,
  question_ru TEXT,
  question_kz TEXT,
  answer_key TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE phrasal_verbs ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_questions ENABLE ROW LEVEL SECURITY;

-- Allow public read access (drop first to avoid error if exists)
DROP POLICY IF EXISTS "Allow public read phrasal_verbs" ON phrasal_verbs;
DROP POLICY IF EXISTS "Allow public read grammar_rules" ON grammar_rules;
DROP POLICY IF EXISTS "Allow public read practice_questions" ON practice_questions;

CREATE POLICY "Allow public read phrasal_verbs" ON phrasal_verbs FOR SELECT USING (true);
CREATE POLICY "Allow public read grammar_rules" ON grammar_rules FOR SELECT USING (true);
CREATE POLICY "Allow public read practice_questions" ON practice_questions FOR SELECT USING (true);

-- ===================================================================
-- MODULE 1: POPULATION (Hobbies & Qualities)
-- ===================================================================

-- Phrasal Verbs: turn
INSERT INTO phrasal_verbs (module_id, base_verb, particle, meaning_en, meaning_ru, meaning_kz, example_en, example_ru)
SELECT 
  (SELECT id FROM modules WHERE title = 'Hobbies & Qualities' AND grade_level = 9 LIMIT 1),
  base_verb, particle, meaning_en, meaning_ru, meaning_kz, example_en, example_ru
FROM (VALUES
  ('turn', 'up', 'appear, arrive', 'появляться', 'пайда болу', 'He turned up late.', 'Он появился поздно.'),
  ('turn', 'down', 'refuse', 'отказываться', 'бас тарту', 'She turned down the offer.', 'Она отказалась от предложения.'),
  ('turn', 'off', 'switch off', 'выключать', 'өшіру', 'Turn off the lights.', 'Выключи свет.'),
  ('turn', 'into', 'become', 'превращаться в', 'айналу', 'Water turns into ice.', 'Вода превращается в лёд.')
) AS v(base_verb, particle, meaning_en, meaning_ru, meaning_kz, example_en, example_ru);

-- Grammar Rules
INSERT INTO grammar_rules (module_id, title_en, title_ru, rule_en, rule_ru, examples)
SELECT 
  (SELECT id FROM modules WHERE title = 'Hobbies & Qualities' AND grade_level = 9 LIMIT 1),
  title_en, title_ru, rule_en, rule_ru, examples::jsonb
FROM (VALUES
  (
    'Present Simple vs Present Continuous',
    'Present Simple против Present Continuous',
    'Present Simple: habits, routines, schedules. Present Continuous: actions happening now or planned future actions.',
    'Present Simple: привычки, расписание. Present Continuous: действия происходящие сейчас или запланированные действия.',
    '["I play tennis every Sunday. (habit)", "I am playing tennis now. (in progress)", "The train leaves at 6 PM. (schedule)"]'
  ),
  (
    'Past Simple vs Past Continuous',
    'Past Simple против Past Continuous',
    'Past Simple: completed actions. Past Continuous: background info or actions in progress in the past.',
    'Past Simple: завершенные действия. Past Continuous: фоновая информация или действия в процессе.',
    '["She lost her arm in 2003. (completed)", "She was surfing when it happened. (background)"]'
  )
) AS v(title_en, title_ru, rule_en, rule_ru, examples);

-- Practice Questions
INSERT INTO practice_questions (module_id, question_en, question_ru, question_kz, difficulty)
SELECT 
  (SELECT id FROM modules WHERE title = 'Hobbies & Qualities' AND grade_level = 9 LIMIT 1),
  question_en, question_ru, question_kz, difficulty
FROM (VALUES
  ('What happened to Bethany when she was 13?', 'Что случилось с Bethany когда ей было 13?', 'Bethany 13 жасында не болды?', 'easy'),
  ('How did Bethany manage to surf again?', 'Как Bethany смогла снова заняться серфингом?', 'Bethany қалай серфингпен қайта айналысты?', 'medium')
) AS v(question_en, question_ru, question_kz, difficulty);

-- ===================================================================
-- MODULE 2: POPULATION (Exercise & Sport)
-- ===================================================================

-- Phrasal Verbs: run
INSERT INTO phrasal_verbs (module_id, base_verb, particle, meaning_en, meaning_ru, meaning_kz, example_en, example_ru)
SELECT 
  (SELECT id FROM modules WHERE title = 'Exercise & Sport' AND grade_level = 9 LIMIT 1),
  base_verb, particle, meaning_en, meaning_ru, meaning_kz, example_en, example_ru
FROM (VALUES
  ('run', 'off', 'escape', 'убегать', 'қашу', 'The thief ran off.', 'Вор убежал.'),
  ('run', 'across', 'meet by chance', 'случайно встретить', 'кездейсоқ кездесу', 'I ran across an old friend.', 'Я встретил старого друга.'),
  ('run', 'away with', 'steal and escape', 'убежать с чем-то', 'ұрлап қашу', 'He ran away with money.', 'Он убежал с деньгами.'),
  ('run', 'after', 'chase', 'преследовать', 'қуу', 'The dog ran after the ball.', 'Собака бежала за мячом.'),
  ('run', 'into', 'encounter problems', 'столкнуться', 'кездесу', 'We ran into difficulties.', 'Мы столкнулись с трудностями.'),
  ('run', 'up', 'accumulate', 'накапливать', 'жинақтау', 'He ran up debts.', 'Он накопил долги.'),
  ('run', 'out of', 'have no more', 'заканчиваться', 'біту', 'We ran out of time.', 'Время вышло.'),
  ('run', 'over', 'hit / review', 'переехать / повторить', 'қағу / қайталау', 'Let''s run over the plan.', 'Давайте повторим план.')
) AS v(base_verb, particle, meaning_en, meaning_ru, meaning_kz, example_en, example_ru);

-- Grammar Rules
INSERT INTO grammar_rules (module_id, title_en, title_ru, rule_en, rule_ru, examples)
SELECT 
  (SELECT id FROM modules WHERE title = 'Exercise & Sport' AND grade_level = 9 LIMIT 1),
  title_en, title_ru, rule_en, rule_ru, examples::jsonb
FROM (VALUES
  (
    'Present Perfect vs Past Perfect',
    'Present Perfect против Past Perfect',
    'Present Perfect: unspecified past time or connection to present. Past Perfect: before another past action.',
    'Present Perfect: неуказанное время или связь с настоящим. Past Perfect: до другого прошедшего действия.',
    '["I have won 3 medals. (unspecified)", "By 2010, I had won 5 medals. (before 2010)"]'
  )
) AS v(title_en, title_ru, rule_en, rule_ru, examples);

-- Practice Questions
INSERT INTO practice_questions (module_id, question_en, question_ru, question_kz, difficulty)
SELECT 
  (SELECT id FROM modules WHERE title = 'Exercise & Sport' AND grade_level = 9 LIMIT 1),
  question_en, question_ru, question_kz, difficulty
FROM (VALUES
  ('What is first aid?', 'Что такое первая помощь?', 'Алғашқы көмек дегеніміз не?', 'easy'),
  ('What should you do if you see an unconscious person?', 'Что делать при виде человека без сознания?', 'Есінсіз адамды көргенде не істеу керек?', 'hard')
) AS v(question_en, question_ru, question_kz, difficulty);

-- ===================================================================
-- MODULE 3: POPULATION (Earth & our place on it)
-- ===================================================================

-- Phrasal Verbs: break
INSERT INTO phrasal_verbs (module_id, base_verb, particle, meaning_en, meaning_ru, meaning_kz, example_en, example_ru)
SELECT 
  (SELECT id FROM modules WHERE title = 'Earth & our place on it' AND grade_level = 9 LIMIT 1),
  base_verb, particle, meaning_en, meaning_ru, meaning_kz, example_en, example_ru
FROM (VALUES
  ('break', 'away', 'escape', 'сбежать', 'қашу', 'The prisoner broke away.', 'Заключенный сбежал.'),
  ('break', 'down', 'stop working', 'сломаться', 'бұзылу', 'The car broke down.', 'Машина сломалась.'),
  ('break', 'into', 'enter by force', 'вламываться', 'күшпен кіру', 'Thieves broke into the house.', 'Воры вломились.'),
  ('break', 'out', 'start suddenly', 'разразиться', 'басталу', 'War broke out in 1914.', 'Война началась в 1914.'),
  ('break', 'through', 'make progress', 'прорваться', 'табысқа жету', 'Scientists broke through.', 'Ученые совершили прорыв.')
) AS v(base_verb, particle, meaning_en, meaning_ru, meaning_kz, example_en, example_ru);

-- Grammar Rules
INSERT INTO grammar_rules (module_id, title_en, title_ru, rule_en, rule_ru, examples)
SELECT 
  (SELECT id FROM modules WHERE title = 'Earth & our place on it' AND grade_level = 9 LIMIT 1),
  title_en, title_ru, rule_en, rule_ru, examples::jsonb
FROM (VALUES
  (
    'Modal Verbs',
    'Модальные глаголы',
    'Must/Have to: obligation. Mustn''t: prohibition. Don''t have to: no obligation. Should: advice.',
    'Must/Have to: обязательство. Mustn''t: запрет. Don''t have to: нет нужды. Should: совет.',
    '["You must see Sauran.", "You mustn''t touch artifacts.", "You don''t have to pay.", "You should visit in summer."]'
  ),
  (
    'Passive Voice',
    'Пассивный залог',
    'Used when doer is unknown or unimportant. Form: be + past participle.',
    'Используется когда действующее лицо неизвестно или неважно. Форма: be + past participle.',
    '["Sauran was built in 10th century.", "Ruins were excavated.", "Mountains are formed by plates."]'
  )
) AS v(title_en, title_ru, rule_en, rule_ru, examples);

-- Practice Questions
INSERT INTO practice_questions (module_id, question_en, question_ru, question_kz, difficulty)
SELECT 
  (SELECT id FROM modules WHERE title = 'Earth & our place on it' AND grade_level = 9 LIMIT 1),
  question_en, question_ru, question_kz, difficulty
FROM (VALUES
  ('Was the Silk Road a single road?', 'Был ли Шёлковый путь одной дорогой?', 'Жібек жолы бір жол ма еді?', 'easy'),
  ('Why are mountains important?', 'Почему горы важны?', 'Таулар неге маңызды?', 'medium')
) AS v(question_en, question_ru, question_kz, difficulty);

-- ===================================================================
-- MODULE 4: POPULATION (Charities & Conflict)
-- ===================================================================

-- Phrasal Verbs: look
INSERT INTO phrasal_verbs (module_id, base_verb, particle, meaning_en, meaning_ru, meaning_kz, example_en, example_ru)
SELECT 
  (SELECT id FROM modules WHERE title = 'Charities & Conflict' AND grade_level = 9 LIMIT 1),
  base_verb, particle, meaning_en, meaning_ru, meaning_kz, example_en, example_ru
FROM (VALUES
  ('look', 'after', 'take care of', 'присматривать', 'қарау', 'She looks after children.', 'Она присматривает за детьми.'),
  ('look', 'into', 'investigate', 'расследовать', 'тексеру', 'Police will look into it.', 'Полиция расследует.'),
  ('look', 'up', 'search for info', 'искать информацию', 'іздестіру', 'Look it up online.', 'Поищи в интернете.'),
  ('look', 'out for', 'watch for', 'высматривать', 'ұстап тұру', 'Look out for danger.', 'Будь осторожен.'),
  ('look', 'around', 'explore', 'осматриваться', 'айналып қарау', 'Let''s look around the museum.', 'Давайте осмотрим музей.'),
  ('look', 'back', 'recall past', 'оглядываться назад', 'артқа қарау', 'Looking back, I was wrong.', 'Вспоминая, я был неправ.')
) AS v(base_verb, particle, meaning_en, meaning_ru, meaning_kz, example_en, example_ru);

-- Grammar Rules
INSERT INTO grammar_rules (module_id, title_en, title_ru, rule_en, rule_ru, examples)
SELECT 
  (SELECT id FROM modules WHERE title = 'Charities & Conflict' AND grade_level = 9 LIMIT 1),
  title_en, title_ru, rule_en, rule_ru, examples::jsonb
FROM (VALUES
  (
    'Reported Speech',
    'Косвенная речь',
    'Shift tenses back when reporting. Change time expressions (now->then, today->that day).',
    'Сдвигаем времена назад при пересказе. Меняем указатели времени (now->then, today->that day).',
    '["He said, ''I am tired.'' -> He said he was tired.", "She said, ''I will help.'' -> She said she would help."]'
  )
) AS v(title_en, title_ru, rule_en, rule_ru, examples);

-- Practice Questions
INSERT INTO practice_questions (module_id, question_en, question_ru, question_kz, difficulty)
SELECT 
  (SELECT id FROM modules WHERE title = 'Charities & Conflict' AND grade_level = 9 LIMIT 1),
  question_en, question_ru, question_kz, difficulty
FROM (VALUES
  ('Why did Clint create The Borgen Project?', 'Почему Clint создал проект Borgen?', 'Clint Borgen жобасын неге жасады?', 'medium'),
  ('What are UNESCO''s main objectives?', 'Каковы основные цели ЮНЕСКО?', 'ЮНЕСКО-ның негізгі мақсаттары қандай?', 'hard')
) AS v(question_en, question_ru, question_kz, difficulty);

-- ===================================================================
-- MODULE 5: POPULATION (Traditions & Language)
-- ===================================================================

-- Phrasal Verbs: set
INSERT INTO phrasal_verbs (module_id, base_verb, particle, meaning_en, meaning_ru, meaning_kz, example_en, example_ru)
SELECT 
  (SELECT id FROM modules WHERE title = 'Traditions & Language' AND grade_level = 9 LIMIT 1),
  base_verb, particle, meaning_en, meaning_ru, meaning_kz, example_en, example_ru
FROM (VALUES
  ('set', 'off', 'start a journey', 'отправляться', 'жолға шығу', 'We set off at dawn.', 'Мы отправились на рассвете.'),
  ('set', 'back', 'delay', 'задерживать', 'кідірту', 'Rain set us back.', 'Дождь нас задержал.'),
  ('set', 'aside', 'save for later', 'откладывать', 'бөлек қою', 'Set aside some money.', 'Отложи немного денег.'),
  ('set', 'up', 'establish', 'основывать', 'ашу', 'He set up a business.', 'Он открыл бизнес.')
) AS v(base_verb, particle, meaning_en, meaning_ru, meaning_kz, example_en, example_ru);

-- Grammar Rules
INSERT INTO grammar_rules (module_id, title_en, title_ru, rule_en, rule_ru, examples)
SELECT 
  (SELECT id FROM modules WHERE title = 'Traditions & Language' AND grade_level = 9 LIMIT 1),
  title_en, title_ru, rule_en, rule_ru, examples::jsonb
FROM (VALUES
  (
    'Conditionals (Type 1, 2, 3)',
    'Условные предложения (Типы 1, 2, 3)',
    'Type 1: real future (If+Present, will+verb). Type 2: unreal present (If+Past, would+verb). Type 3: past regret (If+Past Perfect, would have+PP).',
    'Тип 1: реальное будущее. Тип 2: нереальное настоящее. Тип 3: сожаление о прошлом.',
    '["If you find treasure, you will be rich. (Type 1)", "If I found treasure, I would share it. (Type 2)", "If he had listened, he would have succeeded. (Type 3)"]'
  )
) AS v(title_en, title_ru, rule_en, rule_ru, examples);

-- Practice Questions
INSERT INTO practice_questions (module_id, question_en, question_ru, question_kz, difficulty)
SELECT 
  (SELECT id FROM modules WHERE title = 'Traditions & Language' AND grade_level = 9 LIMIT 1),
  question_en, question_ru, question_kz, difficulty
FROM (VALUES
  ('Why did Saját sit down by the road?', 'Почему Sajat сел у дороги?', 'Саят неге жол жиегінде отырды?', 'medium'),
  ('How did Asan Kaigy learn to respect nature?', 'Как Асан Кайгы научился уважать природу?', 'Асан Қайғы табиғатты құрметтеуді қалай үйренді?', 'hard')
) AS v(question_en, question_ru, question_kz, difficulty);

-- ===================================================================
-- MODULE 6: POPULATION (Reading for Pleasure)
-- ===================================================================

-- Phrasal Verbs: keep
INSERT INTO phrasal_verbs (module_id, base_verb, particle, meaning_en, meaning_ru, meaning_kz, example_en, example_ru)
SELECT 
  (SELECT id FROM modules WHERE title = 'Reading for Pleasure' AND grade_level = 9 LIMIT 1),
  base_verb, particle, meaning_en, meaning_ru, meaning_kz, example_en, example_ru
FROM (VALUES
  ('keep', 'off', 'stay away from', 'не приближаться', 'жақындамау', 'Keep off the grass.', 'Не ходи по траве.'),
  ('keep', 'down', 'prevent from growing', 'мешать расти', 'өсуге кедергі', 'Keep noise down.', 'Не шумите.'),
  ('keep', 'on', 'continue', 'продолжать', 'жалғастыру', 'Keep on trying.', 'Продолжай пытаться.'),
  ('keep', 'out', 'prevent from entering', 'не допускать', 'кіруге жол бермеу', 'Keep strangers out.', 'Не пускай чужих.'),
  ('keep', 'up', 'maintain tradition', 'поддерживать', 'сақтау', 'Keep up the tradition.', 'Поддерживай традицию.')
) AS v(base_verb, particle, meaning_en, meaning_ru, meaning_kz, example_en, example_ru);

-- Grammar Rules
INSERT INTO grammar_rules (module_id, title_en, title_ru, rule_en, rule_ru, examples)
SELECT 
  (SELECT id FROM modules WHERE title = 'Reading for Pleasure' AND grade_level = 9 LIMIT 1),
  title_en, title_ru, rule_en, rule_ru, examples::jsonb
FROM (VALUES
  (
    'I wish / If only',
    'I wish / If only (сожаления)',
    'I wish + Past Simple: regret about present. I wish + Past Perfect: regret about past.',
    'I wish + Past Simple: сожаление о настоящем. I wish + Past Perfect: сожаление о прошлом.',
    '["I wish I had more time. (present regret)", "I wish I had studied harder. (past regret)", "If only I could fly!"]'
  )
) AS v(title_en, title_ru, rule_en, rule_ru, examples);

-- Practice Questions
INSERT INTO practice_questions (module_id, question_en, question_ru, question_kz, difficulty)
SELECT 
  (SELECT id FROM modules WHERE title = 'Reading for Pleasure' AND grade_level = 9 LIMIT 1),
  question_en, question_ru, question_kz, difficulty
FROM (VALUES
  ('How is Winter Carnival celebrated?', 'Как празднуют Зимний карнавал?', 'Қыс карнавалын қалай тойлайды?', 'medium')
) AS v(question_en, question_ru, question_kz, difficulty);

-- ===================================================================
-- MODULE 7: POPULATION (Entertainment & Media)
-- ===================================================================

-- Phrasal Verbs: carry
INSERT INTO phrasal_verbs (module_id, base_verb, particle, meaning_en, meaning_ru, meaning_kz, example_en, example_ru)
SELECT 
  (SELECT id FROM modules WHERE title = 'Entertainment & Media' AND grade_level = 9 LIMIT 1),
  base_verb, particle, meaning_en, meaning_ru, meaning_kz, example_en, example_ru
FROM (VALUES
  ('carry', 'over', 'continue to exist', 'продолжать существовать', 'жалғасу', 'Traditions carry over.', 'Традиции продолжаются.'),
  ('carry', 'on', 'continue', 'продолжать', 'жалғастыру', 'Carry on working.', 'Продолжай работать.'),
  ('carry', 'out', 'perform', 'выполнять', 'орындау', 'Carry out the plan.', 'Выполните план.'),
  ('carry', 'through', 'complete', 'доводить до конца', 'аяқтау', 'She carried it through.', 'Она довела до конца.'),
  ('carry', 'off', 'succeed', 'успешно справиться', 'сәтті өту', 'He carried off the role.', 'Он блестяще сыграл роль.')
) AS v(base_verb, particle, meaning_en, meaning_ru, meaning_kz, example_en, example_ru);

-- Grammar Rules
INSERT INTO grammar_rules (module_id, title_en, title_ru, rule_en, rule_ru, examples)
SELECT 
  (SELECT id FROM modules WHERE title = 'Entertainment & Media' AND grade_level = 9 LIMIT 1),
  title_en, title_ru, rule_en, rule_ru, examples::jsonb
FROM (VALUES
  (
    'Relative Clauses',
    'Придаточные определительные',
    'Who: people. Which: things. Whose: possession. Where: places. That: people or things.',
    'Who: люди. Which: вещи. Whose: принадлежность. Where: места. That: люди или вещи.',
    '["The actor who played Bond is famous.", "The film which won Oscar is great.", "The man whose car broke down called us."]'
  )
) AS v(title_en, title_ru, rule_en, rule_ru, examples);

-- Practice Questions  
INSERT INTO practice_questions (module_id, question_en, question_ru, question_kz, difficulty)
SELECT 
  (SELECT id FROM modules WHERE title = 'Entertainment & Media' AND grade_level = 9 LIMIT 1),
  question_en, question_ru, question_kz, difficulty
FROM (VALUES
  ('What elements make up music?', 'Какие элементы составляют музыку?', 'Музыканы қандай элементтер құрайды?', 'medium')
) AS v(question_en, question_ru, question_kz, difficulty);

-- ===================================================================
-- MODULE 8: POPULATION (Travel & Tourism)
-- ===================================================================

-- Phrasal Verbs: take
INSERT INTO phrasal_verbs (module_id, base_verb, particle, meaning_en, meaning_ru, meaning_kz, example_en, example_ru)
SELECT 
  (SELECT id FROM modules WHERE title = 'Travel & Tourism' AND grade_level = 9 LIMIT 1),
  base_verb, particle, meaning_en, meaning_ru, meaning_kz, example_en, example_ru
FROM (VALUES
  ('take', 'off', 'remove clothing / depart', 'снимать / взлетать', 'шешу / ұшу', 'The plane took off.', 'Самолет взлетел.'),
  ('take', 'to', 'develop liking', 'пристраститься', 'ұнату', 'I took to hiking.', 'Я полюбил пеший туризм.'),
  ('take', 'after', 'resemble', 'быть похожим', 'ұқсау', 'She takes after her mother.', 'Она похожа на мать.'),
  ('take', 'up', 'start hobby', 'начать хобби', 'бастау', 'He took up painting.', 'Он начал рисовать.')
) AS v(base_verb, particle, meaning_en, meaning_ru, meaning_kz, example_en, example_ru);

-- Grammar Rules
INSERT INTO grammar_rules (module_id, title_en, title_ru, rule_en, rule_ru, examples)
SELECT 
  (SELECT id FROM modules WHERE title = 'Travel & Tourism' AND grade_level = 9 LIMIT 1),
  title_en, title_ru, rule_en, rule_ru, examples::jsonb
FROM (VALUES
  (
    'Clauses of Purpose and Concession',
    'Придаточные цели и уступки',
    'Purpose: in order to, so that. Concession: although, despite, in spite of.',
    'Цель: in order to, so that. Уступка: although, despite, in spite of.',
    '["I study hard in order to pass. (purpose)", "Although it rained, we went out. (concession)", "Despite being tired, she worked."]'
  )
) AS v(title_en, title_ru, rule_en, rule_ru, examples);

-- Practice Questions
INSERT INTO practice_questions (module_id, question_en, question_ru, question_kz, difficulty)
SELECT 
  (SELECT id FROM modules WHERE title = 'Travel & Tourism' AND grade_level = 9 LIMIT 1),
  question_en, question_ru, question_kz, difficulty
FROM (VALUES
  ('What is special about Burabay?', 'Что особенного в Бурабае?', 'Бурабайдың ерекшелігі неде?', 'medium')
) AS v(question_en, question_ru, question_kz, difficulty);

-- ===================================================================
-- MODULE 9: POPULATION (Science & Technology)
-- ===================================================================

-- Phrasal Verbs: come
INSERT INTO phrasal_verbs (module_id, base_verb, particle, meaning_en, meaning_ru, meaning_kz, example_en, example_ru)
SELECT 
  (SELECT id FROM modules WHERE title = 'Science & Technology' AND grade_level = 9 LIMIT 1),
  base_verb, particle, meaning_en, meaning_ru, meaning_kz, example_en, example_ru
FROM (VALUES
  ('come', 'about', 'happen', 'случаться', 'болу', 'How did it come about?', 'Как это произошло?'),
  ('come', 'across', 'find by chance', 'случайно встретить', 'кездейсоқ табу', 'I came across this book.', 'Я наткнулся на эту книгу.'),
  ('come', 'down with', 'become ill', 'заболеть', 'ауырып қалу', 'He came down with flu.', 'Он заболел гриппом.'),
  ('come', 'down to', 'be reduced to', 'сводиться к', 'келіп тіреу', 'It comes down to money.', 'Всё сводится к деньгам.'),
  ('come', 'out', 'be published', 'публиковаться', 'шығу', 'The book came out in 2020.', 'Книга вышла в 2020.'),
  ('come', 'up with', 'think of idea', 'придумать идею', 'ой тауу', 'She came up with a plan.', 'Она придумала план.')
) AS v(base_verb, particle, meaning_en, meaning_ru, meaning_kz, example_en, example_ru);

-- Grammar Rules
INSERT INTO grammar_rules (module_id, title_en, title_ru, rule_en, rule_ru, examples)
SELECT 
  (SELECT id FROM modules WHERE title = 'Science & Technology' AND grade_level = 9 LIMIT 1),
  title_en, title_ru, rule_en, rule_ru, examples::jsonb
FROM (VALUES
  (
    'Infinitives and -ing forms',
    'Инфинитивы и -ing формы',
    'Some verbs take infinitive (want, decide, hope), others take -ing (enjoy, avoid, finish), and some take both with different meanings.',
    'Некоторые глаголы берут инфинитив, другие -ing форму, а некоторые оба варианта с разным значением.',
    '["I want to learn. (infinitive)", "I enjoy reading. (-ing)", "I stopped to rest. (purpose)", "I stopped smoking. (quit)"]'
  )
) AS v(title_en, title_ru, rule_en, rule_ru, examples);

-- Practice Questions
INSERT INTO practice_questions (module_id, question_en, question_ru, question_kz, difficulty)
SELECT 
  (SELECT id FROM modules WHERE title = 'Science & Technology' AND grade_level = 9 LIMIT 1),
  question_en, question_ru, question_kz, difficulty
FROM (VALUES
  ('How do you define a screenager?', 'Как определить скринэйджера?', 'Скринэйджерді қалай анықтаймыз?', 'medium'),
  ('What does CPU stand for?', 'Что означает CPU?', 'CPU не білдіреді?', 'easy'),
  ('What does a sound card do?', 'Что делает звуковая карта?', 'Дыбыс картасы не істейді?', 'medium')
) AS v(question_en, question_ru, question_kz, difficulty);

-- ===================================================================
-- COMPLETION MESSAGE
-- ===================================================================
SELECT 'Grammar rules, phrasal verbs, and practice questions loaded successfully!' AS status;
