import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);

        // Extract filters
        const type = searchParams.get('type');
        const difficulty = searchParams.get('difficulty');
        const category = searchParams.get('category');
        const search = searchParams.get('search');

        // Build query
        let query = supabase
            .from('media_content')
            .select('*')
            .order('created_at', { ascending: false });

        // Apply filters
        if (type) query = query.eq('type', type);
        if (difficulty) query = query.eq('difficulty', difficulty);
        if (category) query = query.eq('category', category);
        if (search) query = query.ilike('title', `%${search}%`);

        const { data, error } = await query;

        if (error) {
            console.error('Database error:', error);
            return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
        }

        return NextResponse.json(data || []);
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const supabase = await createClient();
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'Media ID required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('media_content')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Update error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Media ID required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('media_content')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Delete error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
