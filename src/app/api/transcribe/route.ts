import { NextRequest, NextResponse } from 'next/server';
import { generateAITranscription, parseSRTFile } from '@/services/aiTranscription';

/**
 * POST /api/transcribe
 * Generate AI transcription from media URL
 */
export async function POST(request: NextRequest) {
    try {
        const { mediaUrl, duration, srtContent } = await request.json();

        // Validate inputs
        if (!mediaUrl || !duration) {
            return NextResponse.json(
                { error: 'Media URL and duration are required' },
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
