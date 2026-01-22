import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await request.json();
        const { mediaId, subtitles } = body;

        if (!mediaId || !Array.isArray(subtitles)) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        // Insert subtitles
        const { data, error } = await supabase
            .from('subtitles')
            .insert(
                subtitles.map((sub: any) => ({
                    media_id: mediaId,
                    start_time: sub.start_time,
                    end_time: sub.end_time,
                    text_en: sub.text_en,
                    text_ru: sub.text_ru || '',
                    words: sub.words || []
                }))
            )
            .select();

        if (error) {
            console.error('Subtitle insert error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Subtitles API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
