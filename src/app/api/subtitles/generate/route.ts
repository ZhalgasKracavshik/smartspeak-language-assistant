import { NextRequest, NextResponse } from 'next/server';
import { createClient as createDeepgram } from '@deepgram/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import { requireAuth, optionalAuth } from '../../../../middleware/auth';

export async function POST(request: NextRequest) {
    try {
        // SECURITY: Optional authentication - allow guest check
        const authResult = await optionalAuth(request);
        const user = authResult.user;

        // If no user, we still let them check cache, but generation might be restricted
        // (Decision: Keep restricted for now to save quota, but give better error)

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

        // Check if this is a YouTube URL
        const isYouTube = videoUrl.includes('youtube.com/') || videoUrl.includes('youtu.be/');
        if (isYouTube) {
            return NextResponse.json(
                { error: 'YouTube subtitles are handled automatically via the transcript service. Please use the "Show Transcript" button instead.' },
                { status: 400 }
            );
        }

        // SECURITY: Validate URL format
        try {
            const url = new URL(videoUrl);
            if (!['http:', 'https:'].includes(url.protocol)) {
                return NextResponse.json(
                    { error: 'Invalid URL protocol. Must be http or https' },
                    { status: 400 }
                );
            }
        } catch {
            return NextResponse.json(
                { error: 'Invalid video URL format' },
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

        // Step 5: Process with Gemini for natural translation and word-level details
        console.log('Processing with Gemini for transcription & translation...');

        const GEMINI_KEYS = [
            process.env.GEMINI_API_KEY,
            process.env.GEMINI_API_KEY_2,
            process.env.GEMINI_API_KEY_3,
            process.env.GEMINI_API_KEY_4,
        ].filter(Boolean) as string[];

        const geminiKey = GEMINI_KEYS[Math.floor(Math.random() * GEMINI_KEYS.length)];
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        const sentences = englishSegments.map(s => s.text_en);

        // Revised prompt for phonetic correction and multilingual support (Spanish/English)
        const prompt = `Act as an expert linguist and English teacher.
Process these English sentences (which may contain phonetically transcribed Spanish words, especially if related to "Puss in Boots").
For EACH sentence return:
1. "translation": Natural Russian translation of the whole sentence.
2. "wordDetails": An array of objects for each word in the sentence containing:
   - "word": The corrected word. If you detect a word that was clearly a mis-transcription of a Spanish word (e.g., "Kato" instead of "Gato", "Leech" instead of "Leche"), CORRECT it to the proper Spanish spelling.
   - "transcription": Phonetic transcription in US/UK English (e.g., [həˈloʊ]). For Spanish words, use Spanish transcription.
   - "translation": Russian translation for THIS SPECIFIC word in context.

Return ONLY a JSON array of objects.
Input: ${JSON.stringify(sentences)}`;

        const geminiResult = await model.generateContent(prompt);
        const geminiText = geminiResult.response.text();

        const jsonMatch = geminiText.match(/\[[\s\S]*\]/);
        const geminiData = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

        // Get all words from Deepgram to use their timings
        const deepgramWords = result.results.channels[0].alternatives[0].words || [];

        // Step 6: Combine everything into final subtitles
        const subtitles = englishSegments.map((segment, index) => {
            const data = geminiData[index] || {};

            // Filter Deepgram words that fall into this segment's time range
            const segmentWords = deepgramWords.filter(
                (w: any) => w.start >= segment.start_time && w.end <= segment.end_time + 0.1
            );

            // Merge Gemini's word-level data (transcription/translation) with Deepgram's timing
            const finalWords = segmentWords.map((dw: any) => {
                // Use punctuated_word if available, otherwise raw word to keep punctuation
                const displayWord = dw.punctuated_word || dw.word;

                // Try to find matching word in Gemini's wordDetails
                // Remove punctuation for matching
                const cleanDeepgramWord = dw.word.toLowerCase().replace(/[.,!?;:]/g, '');
                const gWord = data.wordDetails?.find((gw: any) =>
                    gw.word.toLowerCase().replace(/[.,!?;:]/g, '') === cleanDeepgramWord
                );

                return {
                    word: displayWord,
                    start: dw.start,
                    end: dw.end,
                    transcription: gWord?.transcription || '',
                    translation: gWord?.translation || ''
                };
            });

            return {
                id: `subtitle-${index}`,
                media_id: 'generated',
                start_time: segment.start_time,
                end_time: segment.end_time,
                text_en: segment.text_en,
                text_ru: data.translation || '',
                words: finalWords
            };
        });

        console.log(`Generated ${subtitles.length} enriched bilingual subtitles`);

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
