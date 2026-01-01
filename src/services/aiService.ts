import { supabase } from '@/lib/supabase';

export interface AIResponse {
    text: string;
    error?: string;
    retryAfter?: number;
    isQuota?: boolean;
    isRateLimit?: boolean;
}

async function getAuthHeader() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {};
}

export const aiService = {
    async generateText(prompt: string): Promise<AIResponse> {
        try {
            const authHeader = await getAuthHeader();
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeader
                },
                body: JSON.stringify({
                    message: prompt,
                    context: ''
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                return {
                    text: '',
                    error: errorData.error || 'Failed to fetch response from AI.',
                    retryAfter: errorData.retryAfter,
                    isQuota: errorData.isQuota,
                    isRateLimit: errorData.isRateLimit
                };
            }

            const data = await response.json();
            return { text: data.reply || '' };
        } catch (error) {
            console.error('AI Service Error:', error);
            return { text: '', error: 'Network error or invalid response.' };
        }
    },

    async checkGrammar(text: string): Promise<AIResponse> {
        const prompt = `Correct the grammar of the following sentence and explain the mistakes if any. If it's correct, just say "Correct".\n\nSentence: "${text}"`;
        return this.generateText(prompt);
    },

    async getChatResponse(message: string, mode: 'tutor' | 'conversation' | 'quiz' = 'tutor', context: string = ''): Promise<AIResponse> {
        try {
            const authHeader = await getAuthHeader();
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeader
                },
                body: JSON.stringify({
                    message,
                    mode,
                    history: []
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                return {
                    text: '',
                    error: errorData.error || 'Failed to fetch response from AI.',
                    retryAfter: errorData.retryAfter,
                    isQuota: errorData.isQuota,
                    isRateLimit: errorData.isRateLimit
                };
            }

            const data = await response.json();
            return { text: data.reply || '' };
        } catch (error) {
            console.error('AI Service Error:', error);
            return { text: '', error: 'Network error or invalid response.' };
        }
    }
};
