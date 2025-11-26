import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const keys = {
        GEMINI_API_KEY: process.env.GEMINI_API_KEY ? 'SET' : 'NOT SET',
        GEMINI_API_KEY_2: process.env.GEMINI_API_KEY_2 ? 'SET' : 'NOT SET',
        GEMINI_API_KEY_3: process.env.GEMINI_API_KEY_3 ? 'SET' : 'NOT SET',
        GEMINI_API_KEY_4: process.env.GEMINI_API_KEY_4 ? 'SET' : 'NOT SET',
    };

    return NextResponse.json({
        message: 'Environment Variables Check',
        keys,
        nodeEnv: process.env.NODE_ENV
    });
}
