// Localization system for SmartSpeak
export type Language = 'ru' | 'kz';

export interface Translations {
  // Sidebar
  appName: string;
  appSubtitle: string;
  home: string;
  voicePractice: string;
  smartVocabulary: string;
  dialogues: string;
  grammarCoach: string;
  contentHub: string;
  profile: string;
  progress: string;
  streak: string;
  streakDays: string;
  keepGoing: string;

  // Dashboard
  greeting: string;
  continueLeaning: string;
  learnedWords: string;
  completedLessons: string;
  points: string;
  achievements: string;
  mainModules: string;
  start: string;
  todayGoal: string;
  todayGoalDescription: string;

  // Features
  voicePracticeDesc: string;
  smartVocabularyDesc: string;
  dialoguesDesc: string;
  grammarCoachDesc: string;

  // Stats
  exercises: string;
  words: string;
  dialoguesCount: string;

  // Common
  search: string;
  filter: string;
  level: string;
  category: string;
  example: string;
  translation: string;
  play: string;
  record: string;
  stop: string;
  next: string;
  previous: string;
  close: string;
  save: string;
  cancel: string;
}

const translations: Record<Language, Translations> = {
  ru: {
    // Sidebar
    appName: 'SmartSpeak',
    appSubtitle: 'Умный языковой помощник',
    home: 'Главная',
    voicePractice: 'Практика речи',
    smartVocabulary: 'Умный словарь',
    dialogues: 'Диалоги',
    grammarCoach: 'Грамматика',
    contentHub: 'Контент',
    profile: 'Профиль',
    progress: 'Прогресс',
    streak: 'Серия',
    streakDays: 'дней',
    keepGoing: 'Отлично! Продолжай!',

    // Dashboard
    greeting: 'Привет! 👋',
    continueLeaning: 'Продолжим изучение английского',
    learnedWords: 'Изученных слов',
    completedLessons: 'Пройденных уроков',
    points: 'Баллов',
    achievements: 'Достижений',
    mainModules: 'Основные модули',
    start: 'Начать',
    todayGoal: 'Цель на сегодня',
    todayGoalDescription: 'Выучи 10 новых слов и пройди 2 урока',

    // Features
    voicePracticeDesc: 'Тренируй произношение и учись правильно говорить',
    smartVocabularyDesc: '2000+ слов, личный словарь и тесты',
    dialoguesDesc: 'Интерактивные диалоги для практики',
    grammarCoachDesc: 'Времена, условные предложения, фразовые глаголы',

    // Stats
    exercises: 'упражнений',
    words: 'слов',
    dialoguesCount: 'диалогов',

    // Common
    search: 'Поиск',
    filter: 'Фильтр',
    level: 'Уровень',
    category: 'Категория',
    example: 'Пример',
    translation: 'Перевод',
    play: 'Воспроизвести',
    record: 'Записать',
    stop: 'Остановить',
    next: 'Далее',
    previous: 'Назад',
    close: 'Закрыть',
    save: 'Сохранить',
    cancel: 'Отмена',
  },
  kz: {
    // Sidebar
    appName: 'SmartSpeak',
    appSubtitle: 'Ақылды тілдік көмекші',
    home: 'Басты бет',
    voicePractice: 'Айтылым жаттығу',
    smartVocabulary: 'Ақылды сөздік',
    dialogues: 'Диалогтар',
    grammarCoach: 'Грамматика',
    contentHub: 'Контент',
    profile: 'Профиль',
    progress: 'Прогресс',
    streak: 'Серия',
    streakDays: 'күн',
    keepGoing: 'Керемет! Жалғастыр!',

    // Dashboard
    greeting: 'Сәлем! 👋',
    continueLeaning: 'Ағылшын тілін үйренуді жалғастырайық',
    learnedWords: 'Үйренілген сөздер',
    completedLessons: 'Өтілген сабақтар',
    points: 'Ұпай',
    achievements: 'Жетістіктер',
    mainModules: 'Негізгі модульдер',
    start: 'Бастау',
    todayGoal: 'Бүгінгі мақсат',
    todayGoalDescription: '10 жаңа сөз үйрен және 2 сабақ өт',

    // Features
    voicePracticeDesc: 'Айтылым жаттықтыру және дұрыс сөйлеуге үйрену',
    smartVocabularyDesc: '2000+ сөз, жеке сөздік және тесттер',
    dialoguesDesc: 'Интерактивті диалогтар практикасы үшін',
    grammarCoachDesc: 'Времена, шартты сөйлемдер, фразалық етістіктер',

    // Stats
    exercises: 'жаттығу',
    words: 'сөз',
    dialoguesCount: 'диалог',

    // Common
    search: 'Іздеу',
    filter: 'Сүзгі',
    level: 'Деңгей',
    category: 'Санат',
    example: 'Мысал',
    translation: 'Аударма',
    play: 'Ойнату',
    record: 'Жазу',
    stop: 'Тоқтату',
    next: 'Келесі',
    previous: 'Артқа',
    close: 'Жабу',
    save: 'Сақтау',
    cancel: 'Болдырмау',
  },
};

export function getTranslations(lang: Language): Translations {
  return translations[lang];
}

export function getCurrentLanguage(): Language {
  if (typeof window === 'undefined') return 'ru';
  const saved = localStorage.getItem('smartspeak-language');
  return (saved === 'kz' ? 'kz' : 'ru') as Language;
}

export function setCurrentLanguage(lang: Language): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('smartspeak-language', lang);
}
