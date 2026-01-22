import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await request.json();

        // Insert media
        const { data, error } = await supabase
            .from('media_content')
            .insert({
                title: body.title,
                description: body.description,
                type: body.type,
                cloudinary_url: body.cloudinary_url,
                cloudinary_id: body.cloudinary_id,
                thumbnail_url: body.thumbnail_url,
                duration: body.duration,
                difficulty: body.difficulty,
                category: body.category,
            })
            .select()
            .single();

        if (error) {
            console.error('Insert error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Upload API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
