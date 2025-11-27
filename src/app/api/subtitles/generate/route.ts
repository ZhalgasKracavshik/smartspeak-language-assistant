import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

        // Используем Gemini 2.0 Flash (бесплатный tier)
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash-exp'
        });

        const prompt = `
Analyze this video and transcribe the spoken content.
Provide timestamps for each sentence or phrase.
Also provide a Russian translation for each subtitle.

Return the result as a JSON array with this exact structure:
[
  {
    "start_time": 0.0,
    "end_time": 3.5,
    "text_en": "Hello, welcome to our lesson",
    "text_ru": "Привет, добро пожаловать на наш урок"
  },
  {
    "start_time": 3.5,
    "end_time": 7.2,
    "text_en": "Today we will learn about present simple tense",
    "text_ru": "Сегодня мы узнаем о настоящем простом времени"
  }
]

Important:
- start_time and end_time should be in seconds (decimals allowed)
- text_en should be the exact spoken words
- text_ru should be the Russian translation
- Return ONLY the JSON array, no markdown, no explanation
`;

        // Отправляем видео URL напрямую в Gemini
        const result = await model.generateContent([
            {
                fileData: {
                    fileUri: videoUrl,
                    mimeType: 'video/mp4'
                }
            },
            prompt
        ]);

        const response = await result.response;
        const text = response.text();

        console.log('Gemini response:', text);

        // Извлекаем JSON из ответа
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            throw new Error('Could not parse subtitles from AI response');
        }

        const parsedSubtitles = JSON.parse(jsonMatch[0]);

        // Форматируем в нужную структуру
        const subtitles = parsedSubtitles.map((sub: any, index: number) => ({
            id: `subtitle-${index}`,
            media_id: 'generated',
            start_time: parseFloat(sub.start_time || sub.startTime),
            end_time: parseFloat(sub.end_time || sub.endTime),
            text_en: (sub.text_en || sub.text || '').trim(),
            text_ru: (sub.text_ru || sub.translation || '').trim(),
            words: [] // Gemini 2.0 Flash doesn't support word-level timestamps easily yet
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
