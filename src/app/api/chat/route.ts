import { NextRequest, NextResponse } from 'next/server';
import { getGeminiModel } from '@/lib/gemini';

export async function POST(request: NextRequest) {
    try {
        const { message, history = [] } = await request.json();

        const model = getGeminiModel();
        const chat = model.startChat({
            history: history.map((msg: any) => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }],
            })),
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ reply: text });
    } catch (error: any) {
        console.error('Chat API Error:', error);
        console.error('Error message:', error?.message);
        console.error('Error stack:', error?.stack);
        return NextResponse.json(
            { error: 'Failed to process chat message', details: error?.message },
            { status: 500 }
        );
    }
}
