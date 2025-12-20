import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEYS = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY_4,
].filter(Boolean) as string[];

let currentKeyIndex = 0;

export const getGeminiModel = () => {
    if (API_KEYS.length === 0) {
        console.error('GEMINI_API_KEY environment variables not found');
        console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('GEMINI')));
        throw new Error('No Gemini API keys found in environment variables. Please add GEMINI_API_KEY to your environment.');
    }

    // Rotate key randomly for better load distribution
    currentKeyIndex = Math.floor(Math.random() * API_KEYS.length);
    const key = API_KEYS[currentKeyIndex];

    console.log(`Using Gemini API key index: ${currentKeyIndex} of ${API_KEYS.length}`);

    const genAI = new GoogleGenerativeAI(key);
    // Using gemini-flash-latest (Stable 1.5 Flash) to avoid 2.0 quota limits
    return genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
};

// Export function to check if API is configured
export const isGeminiConfigured = () => API_KEYS.length > 0;

// Export key count for debugging
export const getKeyCount = () => API_KEYS.length;
