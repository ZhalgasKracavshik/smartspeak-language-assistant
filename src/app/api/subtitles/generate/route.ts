import { NextRequest, NextResponse } from 'next/server';
import { createClient as createDeepgram } from '@deepgram/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
    try {
        // Initialize clients (lazy initialization to avoid build errors)
        const deepgram = createDeepgram(process.env.DEEPGRAM_API_KEY || '');

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { videoUrl, language = 'en' } = await request.json();

        if (!videoUrl) {
            return NextResponse.json(
                { error: 'Video URL is required' },
                { status: 400 }
            );
        }

        console.log('Generating subtitles for video:', videoUrl);

        // Step 1: Check cache first
        console.log('Checking subtitle cache...');
        const { data: cachedData } = await supabase
            .from('subtitle_cache')
            .select('*')
            .eq('video_url', videoUrl)
            .single();

        if (cachedData) {
            console.log('✅ Found cached subtitles!');
            return NextResponse.json({
                subtitles: cachedData.subtitles,
                duration: cachedData.duration,
                language,
                cached: true
            });
        }

        // Step 2: Download audio
        console.log('Downloading audio from:', videoUrl);
        const audioResponse = await fetch(videoUrl);
        if (!audioResponse.ok) {
            throw new Error('Failed to download video/audio');
        }

        const audioBlob = await audioResponse.blob();
        const audioBuffer = Buffer.from(await audioBlob.arrayBuffer());
        console.log('Audio downloaded, size:', audioBuffer.length, 'bytes');

        // Step 3: Transcribe with Deepgram
        console.log('Transcribing with Deepgram...');
        const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
            audioBuffer,
            {
                model: 'nova-2',
                smart_format: true,
                punctuate: true,
                paragraphs: true,
                utterances: true,
                language: 'en'
            }
        );

        if (error) {
            console.error('Deepgram error:', error);
            throw new Error(`Deepgram transcription failed: ${error.message}`);
        }

        if (!result?.results?.channels?.[0]?.alternatives?.[0]) {
            throw new Error('No transcription results from Deepgram');
        }

        const transcript = result.results.channels[0].alternatives[0];
        const fullText = transcript.transcript;

        if (!fullText || fullText.trim().length === 0) {
            throw new Error('No speech detected in audio');
        }

        console.log('Transcription successful, length:', fullText.length);

        // Step 4: Extract utterances (sentences with timestamps)
        const utterances = result.results.utterances || [];

        const englishSegments = utterances.map((utt: any) => ({
            text_en: utt.transcript,
            start_time: utt.start,
            end_time: utt.end
        }));

        console.log(`Created ${englishSegments.length} segments`);

        // Step 5: Translate to Russian using Gemini (same model as Smart Chat!)
        console.log('Translating to Russian with Gemini...');

        const GEMINI_KEYS = [
            process.env.GEMINI_API_KEY,
            process.env.GEMINI_API_KEY_2,
            process.env.GEMINI_API_KEY_3,
            process.env.GEMINI_API_KEY_4,
        ].filter(Boolean) as string[];

        const geminiKey = GEMINI_KEYS[Math.floor(Math.random() * GEMINI_KEYS.length)];
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }); // Same as Smart Chat!

        const sentences = englishSegments.map(s => s.text_en);
        const translationPrompt = `Translate these English sentences to Russian. Return ONLY a JSON array: ${JSON.stringify(sentences)}`;

        const translationResult = await model.generateContent(translationPrompt);
        const translationText = translationResult.response.text();

        const jsonMatch = translationText.match(/\[[\s\S]*\]/);
        const translations: string[] = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

        // Step 6: Combine English and Russian
        const subtitles = englishSegments.map((segment, index) => ({
            id: `subtitle-${index}`,
            media_id: 'generated',
            start_time: segment.start_time,
            end_time: segment.end_time,
            text_en: segment.text_en,
            text_ru: translations[index] || '',
            words: []
        }));

        console.log(`Generated ${subtitles.length} bilingual subtitles`);

        const duration = subtitles[subtitles.length - 1]?.end_time || 0;

        // Step 7: Save to cache
        console.log('Saving to cache...');
        await supabase
            .from('subtitle_cache')
            .upsert({
                video_url: videoUrl,
                subtitles: subtitles,
                duration: duration,
                provider: 'deepgram'
            });

        return NextResponse.json({
            subtitles,
            duration,
            language,
            cached: false
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
