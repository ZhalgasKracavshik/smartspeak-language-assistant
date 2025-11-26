export interface LyricLine {
    startTime: number; // in seconds
    text: string; // English text
    translation: string; // Russian/Kazakh translation
}

export interface ContentItem {
    id: string;
    type: 'video' | 'cartoon' | 'song' | 'story' | 'tiktok';
    platform?: 'youtube' | 'tiktok'; // Video platform
    title: {
        kz: string;
        ru: string;
    };
    description: {
        kz: string;
        ru: string;
    };
    thumbnail: string;
    url: string; // YouTube ID, TikTok URL, or link
    level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    duration: string;
    tags: string[];
    lyrics?: LyricLine[]; // For songs only
}

export const contentDatabase: ContentItem[] = [
    // Videos - Only embeddable content
    {
        id: 'v2',
        type: 'video',
        platform: 'youtube',
        title: {
            kz: 'English Conversation Practice',
            ru: 'Практика разговорного английского'
        },
        description: {
            kz: 'Күнделікті сөйлесу практикасы',
            ru: 'Практика повседневного общения'
        },
        thumbnail: 'https://img.youtube.com/vi/8irSFvoyLHQ/maxresdefault.jpg',
        url: '8irSFvoyLHQ',
        level: 'A2',
        duration: '30:00',
        tags: ['conversation', 'daily life', 'practice']
    },

    // Cartoons
    {
        id: 'c1',
        type: 'cartoon',
        platform: 'youtube',
        title: {
            kz: 'English Fairy Tales',
            ru: 'Английские сказки для детей'
        },
        description: {
            kz: 'Жай английша ертегілер',
            ru: 'Простые сказки на английском'
        },
        thumbnail: 'https://img.youtube.com/vi/v7sz7GNs33k/maxresdefault.jpg',
        url: 'v7sz7GNs33k',
        level: 'A1',
        duration: '10:00',
        tags: ['kids', 'fairy tales', 'easy']
    },

    // Songs with Lyrics
    {
        id: 's1',
        type: 'song',
        platform: 'youtube',
        title: {
            kz: 'Learn English with Songs - Easy Lyrics',
            ru: 'Учим английский с песнями - простые тексты'
        },
        description: {
            kz: 'Оңай әндермен үйреніңіз',
            ru: 'Учитесь с легкими песнями'
        },
        thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
        url: 'kJQP7kiw5Fk',
        level: 'A2',
        duration: '4:30',
        tags: ['music', 'lyrics', 'easy'],
        lyrics: [
            { startTime: 5, text: "I'm walking alone", translation: "Я иду один" },
            { startTime: 8, text: "The streets are empty", translation: "Улицы пусты" },
            { startTime: 12, text: "The only thing I can see", translation: "Единственное, что я вижу" },
            { startTime: 15, text: "Is my own silhouette", translation: "Это мой силуэт" },
            { startTime: 20, text: "I'm getting stronger", translation: "Я становлюсь сильнее" },
            { startTime: 24, text: "Step by step", translation: "Шаг за шагом" },
            { startTime: 28, text: "I'm walking alone", translation: "Я иду один" },
            { startTime: 32, text: "Through the darkness", translation: "Сквозь тьму" },
            { startTime: 36, text: "Finding my way", translation: "Находя свой путь" },
            { startTime: 40, text: "Learning every day", translation: "Учусь каждый день" }
        ]
    },
    {
        id: 's2',
        type: 'song',
        platform: 'youtube',
        title: {
            kz: 'English Learning Songs for Kids',
            ru: 'Песни для изучения английского'
        },
        description: {
            kz: 'Балалар үшін әндер',
            ru: 'Обучающие песни для детей'
        },
        thumbnail: 'https://img.youtube.com/vi/ZjBuJg2B5wk/maxresdefault.jpg',
        url: 'ZjBuJg2B5wk',
        level: 'A1',
        duration: '25:00',
        tags: ['kids', 'songs', 'educational']
    },

    // Stories
    {
        id: 'st1',
        type: 'story',
        platform: 'youtube',
        title: {
            kz: 'Short English Stories',
            ru: 'Короткие английские рассказы'
        },
        description: {
            kz: 'Қысқа әңгімелер оқу практикасына',
            ru: 'Короткие рассказы для практики чтения'
        },
        thumbnail: 'https://img.youtube.com/vi/TsOIf-7QQA8/maxresdefault.jpg',
        url: 'TsOIf-7QQA8',
        level: 'A2',
        duration: '8:00',
        tags: ['story', 'reading', 'beginner']
    },

    // TikTok Style
    {
        id: 'tt1',
        type: 'tiktok',
        platform: 'youtube',
        title: {
            kz: 'Quick English Tips',
            ru: 'Быстрые советы по английскому'
        },
        description: {
            kz: 'Жылдам кеңестер мен трюктер',
            ru: 'Быстрые советы и трюки'
        },
        thumbnail: 'https://img.youtube.com/vi/tC-Vgc2YaIw/maxresdefault.jpg',
        url: 'tC-Vgc2YaIw',
        level: 'B1',
        duration: '10:00',
        tags: ['tips', 'quick', 'useful']
    }
];
