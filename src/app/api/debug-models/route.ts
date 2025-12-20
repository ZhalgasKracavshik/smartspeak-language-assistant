import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const key = process.env.GEMINI_API_KEY;
        if (!key) {
            return NextResponse.json({ error: 'GEMINI_API_KEY not set' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(key);
        // Access the model manager to list models
        // Note: listModels might not be directly exposed on GoogleGenerativeAI instance in all versions, 
        // but usually it is via the API. 
        // Since the SDK wraps it, let's try to use the raw fetch if SDK doesn't support it easily, 
        // but SDK usually has a way. 
        // Actually, looking at SDK docs, it's usually via a ModelManager or similar, but for simplicity
        // in this debug script, let's try to just fetch the list from the API directly using the key.

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();

        return NextResponse.json({
            status: 'ok',
            models: data
        });
    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
