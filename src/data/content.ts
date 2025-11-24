export interface ContentItem {
    id: string;
    type: 'video' | 'cartoon' | 'song' | 'story' | 'tiktok';
    title: string;
    titleKz: string;
    titleRu: string;
    description: string;
    descriptionKz: string;
    descriptionRu: string;
    thumbnail: string;
    url: string; // YouTube ID or link
    level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    duration: string;
    tags: string[];
}

export const contentDatabase: ContentItem[] = [
    // Videos
    {
        id: 'v1',
        type: 'video',
        title: 'Learn English with Friends',
        titleKz: 'Friends сериалымен ағылшын тілін үйрену',
        titleRu: 'Учим английский с сериалом Друзья',
        description: 'Funny scenes from the Friends TV show with subtitles and explanations.',
        descriptionKz: 'Субтитрлар мен түсіндірмелері бар Friends телехикаясынан қызықты көріністер.',
        descriptionRu: 'Смешные сцены из сериала Друзья с субтитрами и объяснениями.',
        thumbnail: 'https://img.youtube.com/vi/Vw8RjYq7W3I/maxresdefault.jpg',
        url: 'Vw8RjYq7W3I',
        level: 'B1',
        duration: '10:05',
        tags: ['comedy', 'daily life', 'slang']
    },
    {
        id: 'v2',
        type: 'video',
        title: 'TED Talk: The power of introverts',
        titleKz: 'TED Talk: Интроверттердің күші',
        titleRu: 'TED Talk: Сила интровертов',
        description: 'Susan Cain argues that introverts bring extraordinary talents and abilities to the world.',
        descriptionKz: 'Сюзан Кейн интроверттер әлемге ерекше таланттар мен қабілеттер әкеледі деп санайды.',
        descriptionRu: 'Сьюзан Кейн утверждает, что интроверты приносят в мир необычайные таланты и способности.',
        thumbnail: 'https://img.youtube.com/vi/c0KYU2j0TM4/maxresdefault.jpg',
        url: 'c0KYU2j0TM4',
        level: 'C1',
        duration: '19:04',
        tags: ['psychology', 'education', 'public speaking']
    },

    // Cartoons
    {
        id: 'c1',
        type: 'cartoon',
        title: 'Peppa Pig: The Library',
        titleKz: 'Пеппа шошқа: Кітапхана',
        titleRu: 'Свинка Пеппа: Библиотека',
        description: 'Peppa and her family go to the library to return a book.',
        descriptionKz: 'Пеппа және оның отбасы кітапты қайтару үшін кітапханаға барады.',
        descriptionRu: 'Пеппа и ее семья идут в библиотеку, чтобы вернуть книгу.',
        thumbnail: 'https://img.youtube.com/vi/L7FaM_GgceA/maxresdefault.jpg',
        url: 'L7FaM_GgceA',
        level: 'A1',
        duration: '5:00',
        tags: ['kids', 'family', 'vocabulary']
    },

    // Songs
    {
        id: 's1',
        type: 'song',
        title: 'Ed Sheeran - Shape of You',
        titleKz: 'Ed Sheeran - Shape of You',
        titleRu: 'Ed Sheeran - Shape of You',
        description: 'Learn English with lyrics from this popular song.',
        descriptionKz: 'Осы танымал әннің мәтінімен ағылшын тілін үйреніңіз.',
        descriptionRu: 'Учите английский с текстом этой популярной песни.',
        thumbnail: 'https://img.youtube.com/vi/JGwWNGJdvx8/maxresdefault.jpg',
        url: 'JGwWNGJdvx8',
        level: 'A2',
        duration: '4:23',
        tags: ['music', 'pop', 'lyrics']
    },
    {
        id: 's2',
        type: 'song',
        title: 'Adele - Hello',
        titleKz: 'Adele - Hello',
        titleRu: 'Adele - Hello',
        description: 'Deep dive into the lyrics and meaning of Hello by Adele.',
        descriptionKz: 'Adele-дің Hello әнінің мәтіні мен мағынасына терең үңілу.',
        descriptionRu: 'Глубокое погружение в текст и смысл песни Hello от Adele.',
        thumbnail: 'https://img.youtube.com/vi/YQHsXMglC9A/maxresdefault.jpg',
        url: 'YQHsXMglC9A',
        level: 'B1',
        duration: '6:06',
        tags: ['music', 'ballad', 'emotions']
    },

    // Stories
    {
        id: 'st1',
        type: 'story',
        title: 'The Lion and the Mouse',
        titleKz: 'Арыстан мен тышқан',
        titleRu: 'Лев и мышь',
        description: 'A classic fable about kindness and helping others.',
        descriptionKz: 'Мейірімділік пен басқаларға көмектесу туралы классикалық мысал.',
        descriptionRu: 'Классическая басня о доброте и помощи другим.',
        thumbnail: 'https://img.youtube.com/vi/GxcGVCEEdcU/maxresdefault.jpg',
        url: 'GxcGVCEEdcU',
        level: 'A1',
        duration: '3:00',
        tags: ['fable', 'moral', 'reading']
    },

    // TikTok Style
    {
        id: 'tt1',
        type: 'tiktok',
        title: '3 Slang Words You Need to Know',
        titleKz: 'Сіз білуіңіз керек 3 сленг сөзі',
        titleRu: '3 сленговых слова, которые нужно знать',
        description: 'Quick lesson on modern English slang.',
        descriptionKz: 'Қазіргі ағылшын сленгі бойынша қысқаша сабақ.',
        descriptionRu: 'Быстрый урок по современному английскому сленгу.',
        thumbnail: 'https://img.youtube.com/vi/7X8II6J-6mU/maxresdefault.jpg', // Placeholder
        url: '7X8II6J-6mU',
        level: 'B2',
        duration: '0:59',
        tags: ['slang', 'quick', 'speaking']
    }
];
