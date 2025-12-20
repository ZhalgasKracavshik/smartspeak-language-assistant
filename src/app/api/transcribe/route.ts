import { NextRequest, NextResponse } from 'next/server';
import { generateAITranscription, parseSRTFile } from '@/services/aiTranscription';
import { requireAuth } from '@/middleware/auth';

/**
 * POST /api/transcribe
 * Generate AI transcription from media URL
 */
export async function POST(request: NextRequest) {
    try {
        // SECURITY: Require authentication
        const authResult = await requireAuth(request);
        if (authResult instanceof NextResponse) {
            return authResult;
        }
        const { user } = authResult;

        const { mediaUrl, duration, srtContent } = await request.json();

        // Validate inputs
        if (!mediaUrl || !duration) {
            return NextResponse.json(
                { error: 'Media URL and duration are required' },
                { status: 400 }
            );
        }

        // SECURITY: Validate URL format
        try {
            const url = new URL(mediaUrl);
            if (!['http:', 'https:'].includes(url.protocol)) {
                return NextResponse.json(
                    { error: 'Invalid URL protocol. Must be http or https' },
                    { status: 400 }
                );
            }
        } catch {
            return NextResponse.json(
                { error: 'Invalid media URL format' },
                { status: 400 }
            );
        }

        if (typeof duration !== 'number' || duration <= 0 || duration > 3600) {
            return NextResponse.json(
                { error: 'Duration must be between 0 and 3600 seconds' },
                { status: 400 }
            );
        }

        let subtitles;

        // If SRT provided, parse it
        if (srtContent) {
            subtitles = parseSRTFile(srtContent);
        } else {
            // Otherwise, use AI transcription
            subtitles = await generateAITranscription(mediaUrl, duration);
        }

        return NextResponse.json({ subtitles });

    } catch (error) {
        console.error('Transcription API error:', error);
        return NextResponse.json(
            { error: 'Failed to generate transcription' },
            { status: 500 }
        );
    }
}
