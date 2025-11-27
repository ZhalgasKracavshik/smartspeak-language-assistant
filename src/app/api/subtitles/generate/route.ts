import { NextRequest, NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';
import { GoogleGenerativeAI } from '@google/generative-ai';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
    try {
        const { videoUrl, language = 'en' } = await request.json();

        if (!videoUrl) {
            return NextResponse.json(
                { error: 'Video URL is required' },
                { status: 400 }
            );
        }

        console.log('Generating subtitles for video:', videoUrl);

        // Step 1: Download the audio from the video URL
        console.log('Downloading audio from:', videoUrl);
        const audioResponse = await fetch(videoUrl);
        if (!audioResponse.ok) {
            throw new Error('Failed to download video/audio');
        }

        const audioBlob = await audioResponse.blob();
        console.log('Audio downloaded, size:', audioBlob.size, 'bytes');

        // Step 2: Transcribe using Whisper via Hugging Face Inference API
        console.log('Transcribing with Whisper...');

        // Use direct HTTP request for better compatibility
        const hfResponse = await fetch(
            'https://router.huggingface.co/models/openai/whisper-large-v3',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    'Content-Type': 'application/octet-stream',
                },
                body: audioBlob,
            }
        );

        if (!hfResponse.ok) {
            const errorText = await hfResponse.text();
            console.error('HF API Error:', errorText);
            throw new Error(`Hugging Face API error: ${errorText}`);
        }

        const transcriptionResult = await hfResponse.json();
        console.log('Whisper transcription result:', transcriptionResult);

        // Whisper returns: { text: "full transcription" }
        // We need to chunk it into sentences with timestamps
        const fullTranscript = transcriptionResult.text;

        if (!fullTranscript || fullTranscript.trim().length === 0) {
            throw new Error('No speech detected in audio');
        }

        // Step 3: Split transcript into sentences (basic approach)
        // Note: Whisper API doesn't always return word-level timestamps in free tier
        // So we'll estimate timestamps based on sentence length
        const sentences = fullTranscript
            .split(/[.!?]+/)
            .map(s => s.trim())
            .filter(s => s.length > 0);

        console.log(`Split into ${sentences.length} sentences`);

        // Estimate duration (you might want to get actual duration from video metadata)
        // For now, assume average speaking rate: ~150 words per minute
        const totalWords = fullTranscript.split(/\s+/).length;
        const estimatedDuration = (totalWords / 150) * 60; // seconds

        // Step 4: Create timestamped segments
        let currentTime = 0;
        const segmentDuration = estimatedDuration / sentences.length;

        const englishSegments = sentences.map((sentence, index) => {
            const segment = {
                text_en: sentence,
                start_time: parseFloat(currentTime.toFixed(2)),
                end_time: parseFloat((currentTime + segmentDuration).toFixed(2))
            };
            currentTime += segmentDuration;
            return segment;
        });

        // Step 5: Translate to Russian using Gemini
        console.log('Translating to Russian with Gemini...');
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

        const translationPrompt = `Translate the following English sentences to Russian. Return ONLY a JSON array of translations in the same order, no markdown:
        
${sentences.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Return format: ["translation 1", "translation 2", ...]`;

        const translationResult = await model.generateContent(translationPrompt);
        const translationText = translationResult.response.text();

        // Extract JSON array from response
        const jsonMatch = translationText.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            throw new Error('Failed to parse translations from Gemini');
        }

        const translations: string[] = JSON.parse(jsonMatch[0]);

        // Step 6: Combine English and Russian
        const subtitles = englishSegments.map((segment, index) => ({
            id: `subtitle-${index}`,
            media_id: 'generated',
            start_time: segment.start_time,
            end_time: segment.end_time,
            text_en: segment.text_en,
            text_ru: translations[index] || '',
            words: [] // Word-level timestamps not available in free tier
        }));

        console.log(`Generated ${subtitles.length} subtitles`);

        return NextResponse.json({
            subtitles,
            duration: subtitles[subtitles.length - 1]?.end_time || 0,
            language
        });

    } catch (error) {
        console.error('Subtitle generation error:', error);

        const errorMessage = error instanceof Error
            ? error.message
            : 'Failed to generate subtitles';

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
