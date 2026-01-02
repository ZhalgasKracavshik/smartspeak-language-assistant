import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { MediaWithSubtitles } from '@/types/media';
import { validateUUID } from '@/utils/validation';
import { requireAuth } from '@/middleware/auth';

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

        // Handle static/default content (hardcoded fallback)
        const staticVideos: Record<string, MediaWithSubtitles> = {
            'puss-in-boots': {
                id: 'puss-in-boots',
                title: 'Puss in Boots vs Death Scene',
                description: 'A thrilling scene from Puss in Boots. Great for emotional expression practice.',
                type: 'video',
                cloudinary_id: 'Puss_in_Boots__The_Last_Wish_2022_Puss_in_Boots_vs_Death_Scene___n8krqz',
                cloudinary_url: 'https://res.cloudinary.com/dvn30df1m/video/upload/v1767309465/Puss_in_Boots__The_Last_Wish_2022_Puss_in_Boots_vs_Death_Scene___n8krqz.mp4',
                thumbnail_url: 'https://res.cloudinary.com/dvn30df1m/video/upload/w_400,h_300,c_fill/v1767309465/Puss_in_Boots__The_Last_Wish_2022_Puss_in_Boots_vs_Death_Scene___n8krqz.jpg',
                duration: 180,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                view_count: 1542,
                category: 'movies',
                difficulty: 'intermediate',
                subtitles: []
            },
            'demo-bbc-story': {
                id: 'demo-bbc-story',
                title: 'Are we nearly there yet? (BBC Learning English)',
                description: 'A fun story about a family car journey. Perfect for learning travel vocabulary.',
                type: 'video',
                cloudinary_id: 'samples/cld-sample-video',
                cloudinary_url: 'https://res.cloudinary.com/demo/video/upload/v1687513245/samples/cld-sample-video.mp4',
                thumbnail_url: 'https://res.cloudinary.com/demo/video/upload/w_400,h_300,c_fill/v1687513245/samples/cld-sample-video.jpg',
                duration: 120,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                view_count: 850,
                category: 'kids',
                difficulty: 'beginner',
                subtitles: []
            },
            'default-1': {
                id: 'default-1',
                title: 'English Listening Practice - Easy Conversation',
                description: 'Practice your listening skills with simple everyday conversations.',
                type: 'video',
                cloudinary_id: '',
                cloudinary_url: 'https://www.youtube.com/watch?v=VBu_bc40ytc',
                thumbnail_url: 'https://img.youtube.com/vi/VBu_bc40ytc/mqdefault.jpg',
                duration: 300,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                view_count: 50,
                subtitles: []
            },
            'default-2': {
                id: 'default-2',
                title: 'Learn English Through Story',
                description: 'Improve your English by listening to interesting stories.',
                type: 'video',
                cloudinary_id: '',
                cloudinary_url: 'https://www.youtube.com/watch?v=K3mYLJdZ39o',
                thumbnail_url: 'https://img.youtube.com/vi/K3mYLJdZ39o/mqdefault.jpg',
                duration: 450,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                view_count: 120,
                subtitles: []
            },
            'default-3': {
                id: 'default-3',
                title: 'English Songs for Learning',
                description: 'Learn English vocabulary and pronunciation through popular songs.',
                type: 'video',
                cloudinary_id: '',
                cloudinary_url: 'https://www.youtube.com/watch?v=ru0K8uYEZWw',
                thumbnail_url: 'https://img.youtube.com/vi/ru0K8uYEZWw/mqdefault.jpg',
                duration: 240,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                view_count: 200,
                subtitles: []
            }
        };

        const staticVideo = staticVideos[id];
        if (staticVideo) {
            // Check if we have cached subtitles for this video
            const { data: cachedData } = await supabase
                .from('subtitle_cache')
                .select('subtitles')
                .eq('video_url', staticVideo.cloudinary_url)
                .single();

            if (cachedData && cachedData.subtitles) {
                staticVideo.subtitles = cachedData.subtitles;
            }

            return NextResponse.json(staticVideo);
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
                thumbnail_url: 'https://res.cloudinary.com/dvn30df1m/video/upload/v1764189249/owF7GeWfRIuIRoGg1AjALFQ3g9GjAySkfOeZWW_p27noc.jpg',
                duration: 57,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                view_count: 100,
                subtitles: []
            };
            return NextResponse.json(demoVideo);
        }

        // Validate UUID format for DB lookups
        if (!validateUUID(id)) {
            return NextResponse.json(
                { error: 'Invalid media ID format' },
                { status: 400 }
            );
        }

        // Fetch media content
        const { data: mediaData, error: mediaError } = await supabase
            .from('media_content')
            .select('*')
            .eq('id', id)
            .single();

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
        // SECURITY: Require authentication for deleting media
        const authResult = await requireAuth(request);
        if (authResult instanceof NextResponse) {
            return authResult;
        }
        const { user } = authResult;

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
