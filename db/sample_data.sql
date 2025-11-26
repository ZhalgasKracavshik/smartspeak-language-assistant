-- ============================================
-- Sample Data for Testing
-- Run this AFTER creating the media_schema.sql
-- ============================================

-- Sample Video Content
INSERT INTO media_content (
  title,
  description,
  type,
  cloudinary_id,
  cloudinary_url,
  thumbnail_url,
  duration,
  difficulty,
  category,
  tags
) VALUES (
  'Learn English with Adele - Hello',
  'Practice your English with this emotional ballad by Adele. Follow along with synchronized lyrics and translations.',
  'video',
  'sample/hello_adele',
  'https://res.cloudinary.com/demo/video/upload/sample.mp4',
  'https://res.cloudinary.com/demo/video/upload/sample.jpg',
  295,
  'intermediate',
  'music',
  ARRAY['music', 'pop', 'emotions', 'slow']
);

-- Get the ID of the inserted media
-- Replace 'YOUR_MEDIA_ID' below with the actual UUID from the insert above

-- Sample Subtitles with Word-Level Timing
INSERT INTO subtitles (
  media_id,
  start_time,
  end_time,
  text_en,
  text_ru,
  words
) VALUES (
  'YOUR_MEDIA_ID', -- Replace with actual media ID
  0.5,
  4.2,
  'Hello, it''s me',
  'Привет, это я',
  '[
    {"word": "Hello", "start": 0.5, "end": 1.2, "translation": "Привет"},
    {"word": "it''s", "start": 1.5, "end": 1.8, "translation": "это"},
    {"word": "me", "start": 2.0, "end": 4.2, "translation": "я"}
  ]'::jsonb
),
(
  'YOUR_MEDIA_ID',
  4.5,
  8.3,
  'I was wondering if after all these years',
  'Я думала, может быть после всех этих лет',
  '[
    {"word": "I", "start": 4.5, "end": 4.8, "translation": "Я"},
    {"word": "was", "start": 4.9, "end": 5.2, "translation": "была"},
    {"word": "wondering", "start": 5.3, "end": 6.0, "translation": "думала"},
    {"word": "if", "start": 6.1, "end": 6.3, "translation": "если"},
    {"word": "after", "start": 6.4, "end": 6.8, "translation": "после"},
    {"word": "all", "start": 6.9, "end": 7.1, "translation": "всех"},
    {"word": "these", "start": 7.2, "end": 7.5, "translation": "этих"},
    {"word": "years", "start": 7.6, "end": 8.3, "translation": "лет"}
  ]'::jsonb
);

-- Sample Audio Content
INSERT INTO media_content (
  title,
  description,
  type,
  cloudinary_id,
  cloudinary_url,
  thumbnail_url,
  duration,
  difficulty,
  category,
  tags
) VALUES (
  'Daily English Conversation - At the Coffee Shop',
  'Learn everyday English phrases used at a coffee shop. Perfect for beginners!',
  'audio',
  'sample/coffee_shop_audio',
  'https://res.cloudinary.com/demo/video/upload/sample_audio.mp3',
  'https://res.cloudinary.com/demo/image/upload/coffee_shop.jpg',
  180,
  'beginner',
  'podcasts',
  ARRAY['conversation', 'daily-life', 'vocabulary']
);

-- ============================================
-- How to Add Your Own Content
-- ============================================

/*
1. Upload your video/audio to Cloudinary using the admin panel (to be created)
   OR manually upload and get the public_id

2. Insert into media_content table:

INSERT INTO media_content (
  title,
  description,
  type,
  cloudinary_id,
  cloudinary_url,
  thumbnail_url,
  duration,
  difficulty,
  category,
  tags
) VALUES (
  'Your Title Here',
  'Description of the content',
  'video', -- or 'audio'
  'your_cloudinary_public_id',
  'https://res.cloudinary.com/YOUR_CLOUD_NAME/video/upload/your_cloudinary_public_id.mp4',
  'https://res.cloudinary.com/YOUR_CLOUD_NAME/video/upload/your_cloudinary_public_id.jpg',
  240, -- duration in seconds
  'intermediate', -- beginner, intermediate, or advanced
  'music', -- music, movies, podcasts, etc.
  ARRAY['tag1', 'tag2', 'tag3']
) RETURNING id;

3. Create subtitles with word-level timing:

INSERT INTO subtitles (
  media_id,
  start_time,
  end_time,
  text_en,
  text_ru,
  words
) VALUES (
  'YOUR_MEDIA_ID_FROM_STEP_2',
  0.0,
  5.5,
  'Your English subtitle text here',
  'Ваш русский перевод здесь',
  '[
    {"word": "Your", "start": 0.0, "end": 0.5, "translation": "Ваш"},
    {"word": "English", "start": 0.6, "end": 1.2, "translation": "английский"},
    {"word": "subtitle", "start": 1.3, "end": 2.0, "translation": "субтитры"}
  ]'::jsonb
);

Note: To get word-level timings, you can:
- Use speech recognition APIs (Google Cloud Speech-to-Text, AWS Transcribe)
- Manually time each word using a video editor
- Use our estimateWordTimings() function as a fallback (less accurate)
*/
