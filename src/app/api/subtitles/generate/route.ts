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

Return the result as a JSON array with this exact structure:
[
  {
    "startTime": 0.0,
    "endTime": 3.5,
    "text": "Hello, welcome to our lesson"
  },
  {
    "startTime": 3.5,
    "endTime": 7.2,
    "text": "Today we will learn about present simple tense"
  }
]

Important:
- startTime and endTime should be in seconds (decimals allowed)
- text should be the exact spoken words
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
            startTime: parseFloat(sub.startTime),
            endTime: parseFloat(sub.endTime),
            text: sub.text.trim(),
        }));

        console.log(`Generated ${subtitles.length} subtitles`);

        return NextResponse.json({
            subtitles,
            duration: subtitles[subtitles.length - 1]?.endTime || 0,
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
