import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const mediaId = searchParams.get('mediaId');
        const videoUrl = searchParams.get('videoUrl');
        const videoId = searchParams.get('videoId');

        if (!mediaId && !videoUrl && !videoId) {
            return NextResponse.json({ error: 'Media ID, Video URL, or Video ID required' }, { status: 400 });
        }

        let query = supabase
            .from('subtitles')
            .select('*')
            .order('start_time', { ascending: true });

        if (mediaId) {
            query = query.eq('media_id', mediaId);
        } else if (videoUrl || videoId) {
            const searchVal = videoUrl || videoId;
            // Find media item by URL or cloudinary_id (which might store the youtube ID)
            const { data: media } = await supabase
                .from('media_content')
                .select('id')
                .or(`cloudinary_url.ilike.%${searchVal}%,url.ilike.%${searchVal}%,cloudinary_id.eq.${videoId}`)
                .single();

            if (media) {
                query = query.eq('media_id', media.id);
            } else if (videoId) {
                // Try searching directly by videoId if it looks like a UUID
                if (videoId.length === 36) {
                    query = query.eq('media_id', videoId);
                } else {
                    return NextResponse.json([]);
                }
            } else {
                return NextResponse.json([]);
            }
        }

        const { data, error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // FALLBACK: If no subtitles in 'subtitles' table, check 'subtitle_cache'
        if ((!data || data.length === 0) && videoUrl) {
            const { data: cached } = await supabase
                .from('subtitle_cache')
                .select('subtitles')
                .eq('video_url', videoUrl)
                .single();

            if (cached?.subtitles) {
                return NextResponse.json(cached.subtitles);
            }
        }

        return NextResponse.json(data || []);
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'Subtitle ID required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('subtitles')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Subtitle ID required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('subtitles')
            .delete()
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
