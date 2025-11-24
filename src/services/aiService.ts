export interface AIResponse {
    text: string;
    error?: string;
}

export const aiService = {
    async generateText(prompt: string): Promise<AIResponse> {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: prompt,
                    context: ''
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { text: '', error: errorData.error || 'Failed to fetch response from AI.' };
            }

            const data = await response.json();
            return { text: data.text || '' };
        } catch (error) {
            console.error('AI Service Error:', error);
            return { text: '', error: 'Network error or invalid response.' };
        }
    },

    async checkGrammar(text: string): Promise<AIResponse> {
        const prompt = `Correct the grammar of the following sentence and explain the mistakes if any. If it's correct, just say "Correct".\n\nSentence: "${text}"`;
        return this.generateText(prompt);
    },

    async getChatResponse(message: string, context: string = ''): Promise<AIResponse> {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message,
                    context
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { text: '', error: errorData.error || 'Failed to fetch response from AI.' };
            }

            const data = await response.json();
            return { text: data.text || '' };
        } catch (error) {
            console.error('AI Service Error:', error);
            return { text: '', error: 'Network error or invalid response.' };
        }
    }
};
