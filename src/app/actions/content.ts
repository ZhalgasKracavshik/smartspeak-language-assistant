'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

interface DailyContentItem {
    id: string;
    title: string;
    type: 'video' | 'article' | 'song';
    url: string;
    thumbnail?: string;
    description?: string;
}

export async function generateDailyContentAction(level: string, interests: string[]): Promise<DailyContentItem[]> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `
            You are an expert English teacher.
            Generate 3 daily content recommendations for a student with English level "${level}" who is interested in: ${interests.join(', ')}.
            
            The content should be a mix of YouTube videos, articles, or songs that are suitable for learning English at this level.
            Ensure the content is safe, educational, and engaging.
            
            Return ONLY a valid JSON array with the following structure for each item:
            [
                {
                    "id": "unique_id",
                    "title": "Content Title",
                    "type": "video" | "article" | "song",
                    "url": "URL to the content (must be a real, valid URL, preferably YouTube for videos/songs)",
                    "thumbnail": "URL to a thumbnail image (optional, use a placeholder if unknown)",
                    "description": "Brief description of why this is good for their level"
                }
            ]
            
            Do not include any markdown formatting or explanations, just the raw JSON array.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up potential markdown code blocks
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const content: DailyContentItem[] = JSON.parse(cleanJson);
        return content;

    } catch (error) {
        console.error('Error generating daily content:', error);
        // Return fallback content if AI fails
        return [
            {
                id: 'fallback-1',
                title: 'Learn English with TV Series',
                type: 'video',
                url: 'https://www.youtube.com/results?search_query=learn+english+with+tv+series',
                description: 'Popular way to learn English naturally.'
            },
            {
                id: 'fallback-2',
                title: 'BBC Learning English',
                type: 'article',
                url: 'https://www.bbc.co.uk/learningenglish/',
                description: 'Trusted resources for all levels.'
            },
            {
                id: 'fallback-3',
                title: 'English Songs with Lyrics',
                type: 'song',
                url: 'https://www.youtube.com/results?search_query=english+songs+with+lyrics',
                description: 'Improve listening and vocabulary with music.'
            }
        ];
    }
}
