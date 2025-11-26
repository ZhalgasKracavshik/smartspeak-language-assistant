import { NextRequest, Next Response } from 'next/server';

// Simple test endpoint - doesn't use Gemini, just returns success
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('Test API received:', body);

        return NextResponse.json({
            reply: 'Test successful! API keys are loaded. Testing Gemini next...',
            receivedMessage: body.message
        });
    } catch (error: any) {
        console.error('Test API Error:', error);
        return NextResponse.json(
            { error: error?.message },
            { status: 500 }
        );
    }
}
