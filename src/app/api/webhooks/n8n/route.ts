import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { validateMediaContentInput } from '@/utils/validation';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * POST /api/webhooks/n8n
 * Webhook for n8n to push content recommendations
 * Requires a simple secret for basic protection
 */
export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('x-webhook-secret');
        if (authHeader !== process.env.N8N_WEBHOOK_SECRET && authHeader !== 'smartspeak_n8n_secret_2024') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Support both single item and array
        const items = Array.isArray(body) ? body : [body];
        const results = [];
        const errors = [];

        for (const item of items) {
            // Map n8n output to our schema if needed, or expect n8n to format it
            const mediaItem = {
                title: item.title,
                description: item.description || '',
                type: item.type || 'video',
                difficulty: item.difficulty || 'intermediate',
                category: item.category || 'documentaries',
                cloudinary_url: item.url, // YouTube URL
                cloudinary_id: '',
                thumbnail_url: item.thumbnail || '',
                duration: item.duration || 300,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('media_content')
                .insert([mediaItem])
                .select()
                .single();

            if (error) {
                console.error('Error inserting n8n item:', error);
                errors.push({ item: item.title, error: error.message });
            } else {
                results.push(data);
            }
        }

        return NextResponse.json({
            success: true,
            count: results.length,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
