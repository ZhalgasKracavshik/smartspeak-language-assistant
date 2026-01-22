import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        const { id } = params;

        // Fetch media with subtitles
        const { data: media, error: mediaError } = await supabase
            .from('media_content')
            .select('*')
            .eq('id', id)
            .single();

        if (mediaError || !media) {
            return NextResponse.json({ error: 'Media not found' }, { status: 404 });
        }

        // Fetch subtitles
        const { data: subtitles } = await supabase
            .from('subtitles')
            .select('*')
            .eq('media_id', id)
            .order('start_time', { ascending: true });

        // Combine
        const result = {
            ...media,
            subtitles: subtitles || []
        };

        return NextResponse.json(result);
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
