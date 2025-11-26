# 🚀 Setup Instructions - Content Hub с Cloudinary

## ✅ Шаг 1: Cloudinary Setup

1. Зарегистрируйтесь на https://cloudinary.com (бесплатно)
2. После регистрации, перейдите в Dashboard
3. Скопируйте credentials:
   - Cloud Name
   - API Key
   - API Secret

4. Добавьте в `.env.local`:
```env
# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

---

## ✅ Шаг 2: Supabase - Database Setup

1. Откройте Supabase Dashboard: https://app.supabase.com
2. Выберите ваш проект
3. Перейдите в **SQL Editor**
4. Скопируйте и выполните содержимое файла: `db/media_schema.sql`
5. (Опционально) Для тестирования, выполните: `db/sample_data.sql`

---

## ✅ Шаг 3: Запуск Dev Server

Откройте терминал в папке проекта и выполните:

```bash
npm run dev
```

Откройте браузер: http://localhost:3000/content

---

## 🎬 Как добавить свои видео/аудио:

### Вариант 1: Вручную через Supabase

1. Загрузите файл на Cloudinary (через их Dashboard)
2. Скопируйте Cloudinary URL
3. Вставьте данные в Supabase SQL Editor (см. `db/sample_data.sql` для примера)

### Вариант 2: Через Admin Panel (будет создана позже)

Скоро будет создан UI для загрузки файлов прямо через приложение!

---

## 📝 Структура проекта:

```
SmartSpeak Language Assistant/
├── db/
│   ├── media_schema.sql       # Схема БД
│   └── sample_data.sql        # Примеры данных
├── src/
│   ├── app/
│   │   ├── content/
│   │   │   ├── page.tsx       # Каталог контента
│   │   │   └── [id]/
│   │   │       └── page.tsx   # Страница плеера
│   │   └── api/
│   │       └── media/
│   │           ├── route.ts   # API: список медиа
│   │           └── [id]/
│   │               └── route.ts # API: одно медиа
│   ├── components/
│   │   ├── MediaCard.tsx      # Карточка видео/аудио
│   │   ├── ContentHub.tsx     # Главная страница контента
│   │   ├── LyricsPlayer.tsx   # (старый, для YouTube)
│   │   └── SyncedLyrics.tsx   # Синхронизированные субтитры
│   ├── services/
│   │   ├── cloudinary.ts      # Работа с Cloudinary
│   │   └── subtitleSync.ts    # Утилиты для субтитров
│   └── types/
│       └── media.ts           # TypeScript типы
```

---

## 🐛 Troubleshooting:

### Проблема: "Cannot find module '@/types/media'"
**Решение:** Перезапустите TypeScript сервер в VS Code (Ctrl+Shift+P → "TypeScript: Restart TS Server")

### Проблема: Видео не загружается
**Решение 1:** Проверьте что Cloudinary credentials в `.env.local` правильные  
**Решение 2:** Проверьте что URL в базе данных правильный

### Проблема: Субтитры не синхронизируются
**Решение:** Проверьте что `start_time` и `end_time` в базе данных в секундах (не миллисекундах)

---

## 🎨 Что дальше?

- [ ] Создать Admin панель для загрузки медиа
- [ ] Добавить Playback Speed controls (0.5x, 0.75x, 1x, 1.5x, 2x)
- [ ] Добавить "Shadowing Mode" (запись голоса)
- [ ] Mobile optimization

---

**Всё готово к запуску!** �
