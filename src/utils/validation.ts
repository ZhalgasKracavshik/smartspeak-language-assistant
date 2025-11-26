/**
 * Input validation utilities for API routes
 * Helps prevent SQL injection and invalid data
 */

import { MediaType, DifficultyLevel, MediaCategory } from '@/types/media';

const VALID_MEDIA_TYPES: MediaType[] = ['video', 'audio'];
const VALID_DIFFICULTIES: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced'];
const VALID_CATEGORIES: MediaCategory[] = [
    'music',
    'movies',
    'podcasts',
    'interviews',
    'tv-shows',
    'documentaries',
];

/**
 * Validate media type
 */
export function validateMediaType(type: string | null): MediaType | null {
    if (!type) return null;
    if (VALID_MEDIA_TYPES.includes(type as MediaType)) {
        return type as MediaType;
    }
    return null;
}

/**
 * Validate difficulty level
 */
export function validateDifficulty(difficulty: string | null): DifficultyLevel | null {
    if (!difficulty) return null;
    if (VALID_DIFFICULTIES.includes(difficulty as DifficultyLevel)) {
        return difficulty as DifficultyLevel;
    }
    return null;
}

/**
 * Validate category
 */
export function validateCategory(category: string | null): MediaCategory | null {
    if (!category) return null;
    if (VALID_CATEGORIES.includes(category as MediaCategory)) {
        return category as MediaCategory;
    }
    return null;
}

/**
 * Sanitize search query to prevent SQL injection
 */
export function sanitizeSearchQuery(search: string | null): string | null {
    if (!search) return null;

    // Remove potentially dangerous characters
    const sanitized = search
        .replace(/[<>]/g, '') // Remove HTML tags
        .replace(/[;'"\\]/g, '') // Remove SQL special characters
        .trim()
        .substring(0, 200); // Limit length

    return sanitized.length > 0 ? sanitized : null;
}

/**
 * Validate UUID format
 */
export function validateUUID(id: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
}

/**
 * Validate media content creation data
 */
export interface MediaContentInput {
    title: string;
    description?: string;
    type: MediaType;
    cloudinary_id: string;
    cloudinary_url: string;
    thumbnail_url?: string;
    duration: number;
    difficulty?: DifficultyLevel;
    category?: MediaCategory;
    tags?: string[];
}

export function validateMediaContentInput(data: any): {
    valid: boolean;
    errors: string[];
    data?: MediaContentInput;
} {
    const errors: string[] = [];

    // Required fields
    if (!data.title || typeof data.title !== 'string') {
        errors.push('Title is required and must be a string');
    } else if (data.title.length < 3 || data.title.length > 200) {
        errors.push('Title must be between 3 and 200 characters');
    }

    if (!data.type || !VALID_MEDIA_TYPES.includes(data.type)) {
        errors.push('Valid type is required (video or audio)');
    }

    if (!data.cloudinary_id || typeof data.cloudinary_id !== 'string') {
        errors.push('Cloudinary ID is required');
    }

    if (!data.cloudinary_url || typeof data.cloudinary_url !== 'string') {
        errors.push('Cloudinary URL is required');
    } else if (!data.cloudinary_url.startsWith('https://')) {
        errors.push('Cloudinary URL must be HTTPS');
    }

    if (typeof data.duration !== 'number' || data.duration <= 0) {
        errors.push('Duration must be a positive number');
    }

    // Optional fields validation
    if (data.description && typeof data.description !== 'string') {
        errors.push('Description must be a string');
    } else if (data.description && data.description.length > 1000) {
        errors.push('Description must be less than 1000 characters');
    }

    if (data.difficulty && !VALID_DIFFICULTIES.includes(data.difficulty)) {
        errors.push('Invalid difficulty level');
    }

    if (data.category && !VALID_CATEGORIES.includes(data.category)) {
        errors.push('Invalid category');
    }

    if (data.tags && !Array.isArray(data.tags)) {
        errors.push('Tags must be an array');
    } else if (data.tags && data.tags.some((tag: any) => typeof tag !== 'string')) {
        errors.push('All tags must be strings');
    }

    if (errors.length > 0) {
        return { valid: false, errors };
    }

    return {
        valid: true,
        errors: [],
        data: {
            title: data.title.trim(),
            description: data.description?.trim(),
            type: data.type,
            cloudinary_id: data.cloudinary_id,
            cloudinary_url: data.cloudinary_url,
            thumbnail_url: data.thumbnail_url,
            duration: data.duration,
            difficulty: data.difficulty,
            category: data.category,
            tags: data.tags,
        },
    };
}
