export interface Subtitle {
    id: string;
    startTime: number;    // в секундах
    endTime: number;      // в секундах
    text_en: string;      // английский текст
    text_ru?: string;     // русский текст
    words?: any[];        // слова для подсветки (опционально)
    translation?: {
        kz?: string;
        ru?: string;
    };
}

export interface SubtitleGenerationResult {
    subtitles: Subtitle[];
    duration: number;
    language: string;
}
