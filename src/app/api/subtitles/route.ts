import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * POST /api/subtitles
 * Create subtitle entry (supports single or batch insert)
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Check if body is array (batch insert) or object (single insert)
        const { data, error } = await supabase
            .from('subtitles')
            .insert(body) // Supabase handles both array and object
            .select();

        if (error) {
            console.error('Error creating subtitle:', error);
            return NextResponse.json(
                { error: 'Failed to create subtitle' },
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
