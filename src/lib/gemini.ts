import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEYS = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY_4,
].filter(Boolean) as string[];

let currentKeyIndex = 0;

export const getGeminiModel = () => {
    console.log('API_KEYS array length:', API_KEYS.length);
    console.log('Available keys:', API_KEYS.map((k, i) => `Key ${i + 1}: ${k ? '✓' : '✗'}`));

    if (API_KEYS.length === 0) {
        console.error('No Gemini API keys found!');
        console.error('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✓' : '✗');
        console.error('GEMINI_API_KEY_2:', process.env.GEMINI_API_KEY_2 ? '✓' : '✗');
        console.error('GEMINI_API_KEY_3:', process.env.GEMINI_API_KEY_3 ? '✓' : '✗');
        console.error('GEMINI_API_KEY_4:', process.env.GEMINI_API_KEY_4 ? '✓' : '✗');
        throw new Error('No Gemini API keys found in environment variables');
    }

    // Rotate key
    const key = API_KEYS[currentKeyIndex];
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;

    const genAI = new GoogleGenerativeAI(key);
    return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
};
