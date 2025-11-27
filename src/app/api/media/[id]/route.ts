import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { MediaWithSubtitles } from '@/types/media';
import { validateUUID } from '@/utils/validation';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * GET /api/media/[id]
 * Fetch single media content with subtitles
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        // Validate UUID format
        if (!validateUUID(id)) {
            return NextResponse.json(
                { error: 'Invalid media ID format' },
                { status: 400 }
            );
        }

        // Check for demo video ID
        if (id === '123e4567-e89b-12d3-a456-426614174000') {
            const demoVideo: MediaWithSubtitles = {
                id: '123e4567-e89b-12d3-a456-426614174000',
                title: 'English Lesson with AI Subtitles',
                description: 'Learn English with automatically generated subtitles powered by AI.',
                type: 'video',
                difficulty: 'intermediate',
                category: 'documentaries',
                cloudinary_id: 'owF7GeWfRIuIRoGg1AjALFQ3g9GjAySkfOeZWW_p27noc',
                cloudinary_url: 'https://res.cloudinary.com/dvn30df1m/video/upload/v1764189249/owF7GeWfRIuIRoGg1AjALFQ3g9GjAySkfOeZWW_p27noc.mp4',
                // Fetch media content
                const { data: mediaData, error: mediaError } = await supabase
                    .from('media_content')
                    .select('*')
                    .eq('id', id)
                    .single();

                if(mediaError || !mediaData) {
                    return NextResponse.json(
                        { error: 'Media not found' },
                        { status: 404 }
                    );
        }

        // Fetch subtitles
        const { data: subtitlesData, error: subtitlesError } = await supabase
            .from('subtitles')
            .select('*')
            .eq('media_id', id)
            .order('start_time', { ascending: true });

        if (subtitlesError) {
            console.error('Error fetching subtitles:', subtitlesError);
        }

        // Combine data
        const result: MediaWithSubtitles = {
            ...mediaData,
            subtitles: subtitlesData || [],
        };

        // Increment view count
        await supabase
            .from('media_content')
            .update({ view_count: (mediaData.view_count || 0) + 1 })
            .eq('id', id);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/media/[id]
 * Delete media content (admin only)
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        // Validate UUID format
        if (!validateUUID(id)) {
            return NextResponse.json(
                { error: 'Invalid media ID format' },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from('media_content')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting media:', error);
            return NextResponse.json(
                { error: 'Failed to delete media' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
