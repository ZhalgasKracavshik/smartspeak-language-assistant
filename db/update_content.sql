-- =========================================================
-- CONTENT UPDATE: REFRESH VIDEOS
-- =========================================================

-- 1. Удаляем все старые видео (так как они не работают)
DELETE FROM media_content;

-- 2. Добавляем новые рабочие видео
INSERT INTO media_content (title, description, type, cloudinary_url, duration, difficulty, category)
VALUES 
(
  'Puss in Boots vs Death', 
  'Epic fight scene from Puss in Boots: The Last Wish', 
  'video', 
  'https://res.cloudinary.com/dvn30df1m/video/upload/v1767309465/Puss_in_Boots__The_Last_Wish_2022_Puss_in_Boots_vs_Death_Scene___n8krqz.mp4',
  240, 
  'B1', 
  'movies'
),
(
  'SmartSpeak Introduction', 
  'New introductory video for the platform', 
  'video', 
  'https://res.cloudinary.com/dvn30df1m/video/upload/v1768045425/WhatsApp_Video_2026-01-10_at_16.21.38_pvdhav.mp4',
  120, 
  'A1', 
  'general'
);

-- =========================================================
-- ИНСТРУКЦИЯ ПО АДМИНКАМ (Ваш способ):
-- =========================================================
-- Чтобы сделать кого-то админом, просто найдите его в таблице 'profiles'
-- в Supabase Dashboard и поменяйте значение в колонке 'role' с 'user' на 'admin'.
-- Это абсолютно безопасно и правильно.

-- Если хотите сделать всех текущих пользователей админами (например для тестов):
-- UPDATE profiles SET role = 'admin';

-- Проверить текущих пользователей и их роли:
-- SELECT id, full_name, role FROM profiles;
