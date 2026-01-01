import { GoogleGenerativeAI } from '@google/generative-ai';
import { getUserProfileService } from './userProfileService';

// Rotate keys to avoid rate limits
const API_KEYS = [
    process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    process.env.NEXT_PUBLIC_GEMINI_API_KEY_2,
    process.env.NEXT_PUBLIC_GEMINI_API_KEY_3
].filter(Boolean) as string[];

let currentKeyIndex = 0;

const getNextKey = () => {
    const key = API_KEYS[currentKeyIndex];
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    return key;
};

const genAI = new GoogleGenerativeAI(getNextKey());

export interface GeneratedContent {
    vocabulary: Array<{ word: string; translation: string; context: string }>;
    dialogue: {
        title: string;
        lines: Array<{ speaker: string; text: string; translation: string }>;
    };
    reading: {
        title: string;
        text: string;
        questions: Array<{ question: string; options: string[]; answer: number }>;
    };
}

import { logSecurityEvent } from './securityLogger';

// ... (imports remain the same)

class GeminiContentService {
    private model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    async generateDailyContent(): Promise<GeneratedContent | null> {
        const profile = getUserProfileService().getProfile();
        if (!profile) return null;

        const { interests, level } = profile;
        const interestsStr = interests.join(', ');

        const prompt = `
            You are an expert English teacher. Create a personalized daily lesson for a student with level ${level} who is interested in: ${interestsStr}.
            
            Return ONLY a JSON object with the following structure (no markdown, no code blocks):
            {
                "vocabulary": [
                    { "word": "english word", "translation": "russian translation", "context": "example sentence" }
                ],
                "dialogue": {
                    "title": "Dialogue Title",
                    "lines": [
                        { "speaker": "A", "text": "English line", "translation": "Russian line" }
                    ]
                },
                "reading": {
                    "title": "Short Story Title",
                    "text": "A short text (approx 100 words) related to interests",
                    "questions": [
                        { "question": "Question about text?", "options": ["A", "B", "C"], "answer": 0 }
                    ]
                }
            }
            
            Generate 5 vocabulary words, a 6-line dialogue, and a short reading text with 2 questions.
            Ensure the difficulty matches ${level} level.
        `;

        try {
            await logSecurityEvent({
                action: 'ai_request',
                endpoint: 'generateDailyContent',
                metadata: { level, interests }
            });

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Clean up potential markdown formatting
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonStr);
        } catch (error: any) {
            console.error('Error generating content:', error);
            await logSecurityEvent({
                action: 'ai_request',
                endpoint: 'generateDailyContent',
                metadata: { error: error.message, status: 'failed' }
            });
            return null;
        }
    }

    async generateTopicVocabulary(topic: string): Promise<GeneratedContent['vocabulary'] | null> {
        const profile = getUserProfileService().getProfile();
        const level = profile?.level || 'A1';

        const prompt = `
            Generate 10 English vocabulary words related to "${topic}" for a student with level ${level}.
            Return ONLY a JSON array (no markdown):
            [
                { "word": "word", "translation": "russian translation", "context": "example sentence" }
            ]
        `;

        try {
            await logSecurityEvent({
                action: 'ai_request',
                endpoint: 'generateTopicVocabulary',
                metadata: { topic, level }
            });

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonStr);
        } catch (error: any) {
            console.error('Error generating vocabulary:', error);
            await logSecurityEvent({
                action: 'ai_request',
                endpoint: 'generateTopicVocabulary',
                metadata: { topic, error: error.message, status: 'failed' }
            });
            return null;
        }
    }
}

export const geminiContentService = new GeminiContentService();
