/**
 * AI-powered transcription using Gemini
 * Generates subtitles with word-level timing and Russian translation
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface AISubtitle {
    start_time: number;
    end_time: number;
    text_en: string;
    text_ru: string;
    words: Array<{
        word: string;
        start: number;
        end: number;
        translation?: string;
    }>;
}

/**
 * Generate AI transcription with word timings and translation
 */
export async function generateAITranscription(
    audioUrl: string,
    duration: number
): Promise<AISubtitle[]> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

        const prompt = `
You are a professional transcription and translation AI.

Task: Transcribe the audio from this Cloudinary URL and translate to Russian.

Audio URL: ${audioUrl}
Duration: ${duration} seconds

Provide the result as a JSON array with this exact structure:
[
  {
    "start_time": 0.5,
    "end_time": 4.2,
    "text_en": "Hello, it's me",
    "text_ru": "Привет, это я",
    "words": [
      {"word": "Hello", "start": 0.5, "end": 1.2, "translation": "Привет"},
      {"word": "it's", "start": 1.5, "end": 1.8, "translation": "это"},
      {"word": "me", "start": 2.0, "end": 4.2, "translation": "я"}
    ]
  }
]

Requirements:
- Accurate English transcription
- Natural Russian translation (not word-by-word, but meaning-preserving)
- Word-level timestamps for karaoke-style highlighting
- Word-by-word translations for vocabulary learning
- Split into subtitle-friendly lines (max 12 words per line)
- No overlapping timestamps

Return ONLY the JSON array, no other text.
`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Extract JSON from response
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            throw new Error('AI did not return valid JSON');
        }

        const subtitles: AISubtitle[] = JSON.parse(jsonMatch[0]);
        return subtitles;

    } catch (error) {
        console.error('AI Transcription error:', error);
        throw error;
    }
}

/**
 * Fallback: Parse SRT file
 */
export function parseSRTFile(srtContent: string): AISubtitle[] {
    const subtitles: AISubtitle[] = [];
    const blocks = srtContent.trim().split(/\n\s*\n/);

    for (const block of blocks) {
        const lines = block.split('\n');
        if (lines.length < 3) continue;

        const timeLine = lines[1];
        const text = lines.slice(2).join(' ');

        const timeMatch = timeLine.match(/(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})/);

        if (timeMatch) {
            const startTime = parseTime(timeMatch[1], timeMatch[2], timeMatch[3], timeMatch[4]);
            const endTime = parseTime(timeMatch[5], timeMatch[6], timeMatch[7], timeMatch[8]);

            // Estimate word timings
            const words = estimateWordTimings(text, startTime, endTime);

            subtitles.push({
                start_time: startTime,
                end_time: endTime,
                text_en: text,
                text_ru: '', // Needs AI translation
                words: words.map(w => ({ ...w, translation: '' })),
            });
        }
    }

    return subtitles;
}

function parseTime(h: string, m: string, s: string, ms: string): number {
    return parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s) + parseInt(ms) / 1000;
}

function estimateWordTimings(
    text: string,
    startTime: number,
    endTime: number
): Array<{ word: string; start: number; end: number }> {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const totalDuration = endTime - startTime;
    const avgWordDuration = totalDuration / words.length;

    return words.map((word, index) => ({
        word,
        start: startTime + (index * avgWordDuration),
        end: startTime + ((index + 1) * avgWordDuration),
    }));
}
