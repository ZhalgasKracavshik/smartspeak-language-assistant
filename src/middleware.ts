import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
    // 1. Update Session (handles auth cookies)
    // This is critical for Server Components and API routes to work with Supabase Auth
    const response = await updateSession(request)

    // 2. Security Headers
    response.headers.set('X-DNS-Prefetch-Control', 'on')
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
    response.headers.set('X-Frame-Options', 'SAMEORIGIN')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(self), geolocation=()')

    // Content Security Policy
    const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com https://www.youtube.com https://s.ytimg.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https: blob: https://res.cloudinary.com https://img.youtube.com;
    media-src 'self' https://res.cloudinary.com;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://*.supabase.co https://accounts.google.com https://oauth2.googleapis.com https://www.googleapis.com https://generativelanguage.googleapis.com https://youtube-transcript-api.vercel.app https://res.cloudinary.com;
    frame-src 'self' https://accounts.google.com https://www.youtube.com https://open.spotify.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim()

    response.headers.set('Content-Security-Policy', cspHeader)

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         * - api/debug-env (debug endpoint)
         */
        '/((?!_next/static|_next/image|favicon.ico|api/debug-env|api/debug-models|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
