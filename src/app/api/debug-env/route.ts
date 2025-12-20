import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const keys = {
            GEMINI_API_KEY: process.env.GEMINI_API_KEY ? 'SET (first 10 chars: ' + process.env.GEMINI_API_KEY.substring(0, 10) + '...)' : 'NOT SET',
            GEMINI_API_KEY_2: process.env.GEMINI_API_KEY_2 ? 'SET' : 'NOT SET',
            GEMINI_API_KEY_3: process.env.GEMINI_API_KEY_3 ? 'SET' : 'NOT SET',
            GEMINI_API_KEY_4: process.env.GEMINI_API_KEY_4 ? 'SET' : 'NOT SET',
            SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
            SUPABASE_ANON: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
        };

        const totalKeys = [
            process.env.GEMINI_API_KEY,
            process.env.GEMINI_API_KEY_2,
            process.env.GEMINI_API_KEY_3,
            process.env.GEMINI_API_KEY_4,
        ].filter(Boolean).length;

        return NextResponse.json({
            status: 'ok',
            keys,
            totalGeminiKeys: totalKeys,
            message: totalKeys > 0 ? 'Gemini is configured!' : 'No Gemini keys found! Add GEMINI_API_KEY to Vercel.'
        });
    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            error: error.message
        }, { status: 500 });
    }
}
