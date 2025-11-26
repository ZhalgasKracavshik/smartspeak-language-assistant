import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
    const isProtectedApiRoute =
        request.nextUrl.pathname.startsWith('/api/transcribe') ||
        (request.nextUrl.pathname.startsWith('/api/media') && ['POST', 'DELETE'].includes(request.method)) ||
        (request.nextUrl.pathname.startsWith('/api/subtitles') && ['POST', 'DELETE'].includes(request.method));

    if (isAdminRoute || isProtectedApiRoute) {
        // Basic Auth using a simple cookie
        // You can set this cookie manually in the browser console for access:
        // document.cookie = "admin_access=true; path=/"

        const adminCookie = request.cookies.get('admin_access');

        if (!adminCookie || adminCookie.value !== 'true') {
            // If it's an API request, return 401
            if (request.nextUrl.pathname.startsWith('/api/')) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }

            // If it's a page request, redirect to login
            return NextResponse.redirect(new URL('/admin', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/api/transcribe',
        '/api/media',
        '/api/subtitles',
    ],
};
