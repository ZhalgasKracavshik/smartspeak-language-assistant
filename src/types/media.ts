/**
 * Type definitions for media content and subtitles
 */

export type MediaType = 'video' | 'audio';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type MediaCategory = 'music' | 'movies' | 'podcasts' | 'interviews' | 'tv-shows' | 'documentaries';

export interface Word {
    word: string;
    start: number; // seconds
    end: number; // seconds
    translation?: string;
}

export interface Subtitle {
    id: string;
    media_id: string;
    start_time: number; // seconds
    end_time: number; // seconds
    text_en: string;
    text_ru?: string;
    words: Word[];
}

export interface MediaContent {
    id: string;
    title: string;
    description?: string;
    type: MediaType;
    cloudinary_id: string;
    cloudinary_url: string;
    thumbnail_url?: string;
    duration: number; // seconds
    difficulty?: DifficultyLevel;
    category?: MediaCategory;
    tags?: string[];
    view_count?: number;
    created_at: string;
    updated_at?: string;
}

export interface MediaWithSubtitles extends MediaContent {
    subtitles: Subtitle[];
}

export interface UserMediaProgress {
    id: string;
    user_id: string;
    media_id: string;
    last_position: number; // seconds
    completed: boolean;
    watched_at: string;
}

export interface MediaFilters {
    type?: MediaType;
    difficulty?: DifficultyLevel;
    category?: MediaCategory;
    search?: string;
}
