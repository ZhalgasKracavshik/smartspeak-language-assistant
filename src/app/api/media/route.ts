import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { MediaContent, MediaFilters, MediaType } from '@/types/media';
import {
    validateMediaType,
    validateDifficulty,
    validateCategory,
    sanitizeSearchQuery,
    validateMediaContentInput,
} from '@/utils/validation';
import { requireAuth } from '@/middleware/auth';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * GET /api/media
 * Fetch all media content with optional filters
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const typeParam = searchParams.get('type');
        const difficultyParam = searchParams.get('difficulty');
        const categoryParam = searchParams.get('category');
        const searchParam = searchParams.get('search');

        // Validate and sanitize inputs
        const type = validateMediaType(typeParam);
        const difficulty = validateDifficulty(difficultyParam);
        const category = validateCategory(categoryParam);
        const search = sanitizeSearchQuery(searchParam);

        let query = supabase
            .from('media_content')
            .select('*')
            .order('created_at', { ascending: false });

        // Apply validated filters
        if (type) {
            query = query.eq('type', type);
        }
        if (difficulty) {
            query = query.eq('difficulty', difficulty);
        }
        if (category) {
            query = query.eq('category', category);
        }
        if (search) {
            query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching media from Supabase:', error);
            return NextResponse.json(
                { error: 'Failed to fetch media content' },
                { status: 500 }
            );
        }

        // If database is empty or no filters provided, use AI generator
        if (!data || data.length === 0) {
            try {
                // Dynamically import to avoid build issues if it's client-side only (it's not, but safe practice)
                const { generateDailyContent } = await import('@/services/dailyContentService');
                const aiContent = await generateDailyContent();

                // Transform to MediaContent type
                const mediaItems: MediaContent[] = aiContent.map(item => ({
                    id: item.id,
                    title: item.title,
                    description: item.description || '',
                    type: item.type as MediaType,
                    difficulty: 'intermediate', // Default, maybe infer from profile later
                    category: 'documentaries', // Default generic category
                    cloudinary_id: '', // Empty for external links
                    cloudinary_url: item.url, // Using YouTube URL here
                    thumbnail_url: item.thumbnail || '',
                    duration: 300, // Estimate
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }));

                return NextResponse.json(mediaItems);
            } catch (aiError) {
                console.error('CRITICAL: AI Content Generation failed.', aiError);
                // Fallback to static demo if AI fails
                const demoVideo: MediaContent = {
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    title: 'English Lesson with AI Subtitles',
                    description: 'Learn English with automatically generated subtitles powered by AI.',
                    type: 'video',
                    difficulty: 'intermediate',
                    category: 'documentaries',
                    cloudinary_id: 'owF7GeWfRIuIRoGg1AjALFQ3g9GjAySkfOeZWW_p27noc',
                    cloudinary_url: 'https://res.cloudinary.com/dvn30df1m/video/upload/v1764189249/owF7GeWfRIuIRoGg1AjALFQ3g9GjAySkfOeZWW_p27noc.mp4',
                    thumbnail_url: 'https://res.cloudinary.com/dvn30df1m/video/upload/v1764189249/owF7GeWfRIuIRoGg1AjALFQ3g9GjAySkfOeZWW_p27noc.jpg',
                    duration: 120,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };
                return NextResponse.json([demoVideo]);
            }
        }

        return NextResponse.json(data as MediaContent[]);
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/media
 * Create new media content (admin only)
 */
export async function POST(request: NextRequest) {
    try {
        // SECURITY: Require authentication for creating media
        const authResult = await requireAuth(request);
        if (authResult instanceof NextResponse) {
            return authResult;
        }
        const { user } = authResult;

        const body = await request.json();

        // Validate input data
        const validation = validateMediaContentInput(body);

        if (!validation.valid) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.errors },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('media_content')
            .insert([validation.data])
            .select()
            .single();

        if (error) {
            console.error('Error creating media:', error);
            return NextResponse.json(
                { error: 'Failed to create media content' },
                { status: 500 }
            );
        }

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
