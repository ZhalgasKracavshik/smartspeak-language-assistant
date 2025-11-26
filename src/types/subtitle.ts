export interface Subtitle {
    id: string;
    startTime: number;    // в секундах
    endTime: number;      // в секундах
    text: string;         // английский текст
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
