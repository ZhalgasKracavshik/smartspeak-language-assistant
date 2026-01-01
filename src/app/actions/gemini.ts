'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { headers } from 'next/headers';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests per minute per IP

// In-memory store for rate limiting (Note: This resets on server restart/lambda cold start)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

// Rotate keys to avoid rate limits
const API_KEYS = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY_4,
    process.env.NEXT_PUBLIC_GEMINI_API_KEY, // Fallback if user hasn't renamed yet
    process.env.NEXT_PUBLIC_GEMINI_API_KEY_2,
    process.env.NEXT_PUBLIC_GEMINI_API_KEY_3
].filter(Boolean) as string[];

let currentKeyIndex = 0;

const getNextKey = () => {
    if (API_KEYS.length === 0) throw new Error('No Gemini API keys found');
    const key = API_KEYS[currentKeyIndex];
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    return key;
};

// Helper to get a Gemini model instance with key rotation
const getGeminiModel = () => {
    const genAI = new GoogleGenerativeAI(getNextKey());
    return genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
};

// Updated checkRateLimit to be async and return an object for consistency
async function checkRateLimit(ip: string): Promise<{ success: boolean }> {
    const now = Date.now();
    const record = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    if (now - record.lastReset > RATE_LIMIT_WINDOW) {
        // Reset window
        record.count = 1;
        record.lastReset = now;
    } else {
        record.count++;
    }

    rateLimitMap.set(ip, record);
    return { success: record.count <= MAX_REQUESTS_PER_WINDOW };
}

import { z } from 'zod';

// Input Validation Schemas
const VocabularySchema = z.object({
    topic: z.string().min(1).max(50).regex(/^[a-zA-Z0-9\s\-_]+$/),
    level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
});

const DialogueSchema = z.object({
    topic: z.string().min(1).max(100),
    level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
});

export async function generateTopicVocabularyAction(topic: string, level: string) {
    // 1. Input Validation
    const validation = VocabularySchema.safeParse({ topic, level });
    if (!validation.success) {
        console.error('Validation Error:', validation.error);
        throw new Error('Invalid input parameters');
    }

    // 2. Security: Rate Limiting
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';

    const rateLimitResult = await checkRateLimit(ip);
    if (!rateLimitResult.success) {
        throw new Error('Rate limit exceeded. Please try again later.');
    }

    // 3. Security: API Key Rotation (Server-side only)
    const model = getGeminiModel();

    // 4. Security Logging
    console.log(`[AI Request] IP: ${ip}, Topic: ${validation.data.topic}, Level: ${validation.data.level}`);

    const prompt = `
    Generate 10 English vocabulary words related to "${validation.data.topic}" for a student with level ${validation.data.level}.
    Return ONLY a JSON array (no markdown):
    [
      { "word": "word", "translation": "russian translation", "context": "example sentence" }
    ]
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);
    } catch (error) {
        console.error('Error generating vocabulary:', error);
        return null;
    }
}

export async function generateDialogueAction(topic: string, level: string) {
    // 1. Input Validation
    const validation = DialogueSchema.safeParse({ topic, level });
    if (!validation.success) {
        throw new Error('Invalid input parameters');
    }

    const ip = (headers().get('x-forwarded-for') ?? '127.0.0.1').split(',')[0];

    const rateLimitResult = await checkRateLimit(ip);
    if (!rateLimitResult.success) {
        throw new Error('Rate limit exceeded. Please try again later.');
    }

    // Security Logging
    console.log(`[AI Dialogue] IP: ${ip}, Topic: ${validation.data.topic}, Level: ${validation.data.level}`);

    try {
        const prompt = `Generate a short dialogue (5-6 messages) for English learners.
    Topic: ${validation.data.topic}
    Level: ${validation.data.level}
    
    Format: JSON object with:
    - scenario: Title of the scenario (in English)
    - scenarioTranslation: object with "ru" and "kz" keys for the title
    - messages: array of objects with:
      - speaker: "user" or "bot"
      - text: English text
      - translation: object with "ru" and "kz" keys

    Example structure:
    {
      "scenario": "Ordering Coffee",
      "scenarioTranslation": { "ru": "Заказ кофе", "kz": "Кофеге тапсырыс беру" },
      "messages": [
        { "speaker": "bot", "text": "Hello!", "translation": { "ru": "Привет!", "kz": "Сәлем!" } }
      ]
    }
    
    IMPORTANT: Return ONLY the JSON object. No markdown formatting.`;

        const model = getGeminiModel();
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);
    } catch (error) {
        console.error('Error generating dialogue:', error);
        return null;
    }
}
