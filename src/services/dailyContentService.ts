import { GoogleGenerativeAI } from '@google/generative-ai';
import { getUserProfileService } from './userProfileService';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

interface DailyContent {
    id: string;
    title: string;
    type: 'video' | 'article' | 'song';
    url: string;
    thumbnail?: string;
    description?: string;
}

/**
 * Generate daily content recommendations based on user profile
 */
export async function generateDailyContent(): Promise<DailyContent[]> {
    try {
        const profile = getUserProfileService().getProfile();
        if (!profile) {
            return getDefaultContent();
        }

        const { level, interests } = profile;
        const interestsStr = interests.length > 0 ? interests.join(', ') : 'general English learning';

        // Use the stable free model
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

        const prompt = `You are an expert English teacher curating content. 
        Select 3 REAL, EXISTING, and POPULAR YouTube videos for a student with:
        - Level: ${level}
        - Interests: ${interestsStr}

        Strict requirements:
        1. Videos MUST be real and popular (TED Talks, Learn English with TV Series, BBC Learning English, etc.)
        2. URLs must be standard YouTube links (https://www.youtube.com/watch?v=...)
        3. Do not invent videos. If unsure, use famous educational channels.

        Return ONLY a raw JSON array (no markdown code blocks) with this structure:
        [
          {
            "title": "Exact Title",
            "type": "video",
            "url": "https://www.youtube.com/watch?v=VIDEO_ID",
            "description": "Why this matches their interest (1 sentence)"
          }
        ]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse JSON response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            console.error('No JSON found in response');
            return getDefaultContent();
        }

        const items = JSON.parse(jsonMatch[0]);

        // Transform to DailyContent format
        return items.map((item: any, index: number) => ({
            id: `daily-${Date.now()}-${index}`,
            title: item.title || 'Untitled',
            type: item.type || 'video',
            url: item.url || '',
            description: item.description || '',
            thumbnail: item.type === 'video' ? `https://img.youtube.com/vi/${extractYouTubeId(item.url)}/mqdefault.jpg` : undefined
        })).filter((item: DailyContent) => item.url); // Filter out items without URL

    } catch (error) {
        console.error('Error generating daily content:', error);
        return getDefaultContent();
    }
}

function extractYouTubeId(url: string): string {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
}

function getDefaultContent(): DailyContent[] {
    return [
        {
            id: 'default-1',
            title: 'English Listening Practice - Easy Conversation',
            type: 'video',
            url: 'https://www.youtube.com/watch?v=VBu_bc40ytc',
            description: 'Practice your listening skills with simple everyday conversations.',
            thumbnail: 'https://img.youtube.com/vi/VBu_bc40ytc/mqdefault.jpg'
        },
        {
            id: 'default-2',
            title: 'Learn English Through Story',
            type: 'video',
            url: 'https://www.youtube.com/watch?v=K3mYLJdZ39o',
            description: 'Improve your English by listening to interesting stories.',
            thumbnail: 'https://img.youtube.com/vi/K3mYLJdZ39o/mqdefault.jpg'
        },
        {
            id: 'default-3',
            title: 'English Songs for Learning',
            type: 'song',
            url: 'https://www.youtube.com/watch?v=ru0K8uYEZWw',
            description: 'Learn English vocabulary and pronunciation through popular songs.',
            thumbnail: 'https://img.youtube.com/vi/ru0K8uYEZWw/mqdefault.jpg'
        }
    ];
}
