import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

    // Use production URL for redirect (must match Google Cloud Console exactly)
    const baseUrl = process.env.NODE_ENV === 'production'
        ? 'https://smartspeak-language-assistant.vercel.app'
        : request.nextUrl.origin;

    const REDIRECT_URI = `${baseUrl}/api/auth/callback/google`;

    // Scopes needed for YouTube Data API (readonly)
    const SCOPES = [
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ].join(' ');

    const params = new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID!,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        scope: SCOPES,
        access_type: 'offline', // Important for getting refresh token
        prompt: 'consent' // Force consent to ensure we get refresh token
    });

    return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}
