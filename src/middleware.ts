import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
    // Check if request is for admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        let response = NextResponse.next({
            request: {
                headers: request.headers,
            },
        });

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return request.cookies.get(name)?.value;
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        request.cookies.set({
                            name,
                            value,
                            ...options,
                        });
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        });
                        response.cookies.set({
                            name,
                            value,
                            ...options,
                        });
                    },
                    remove(name: string, options: CookieOptions) {
                        request.cookies.set({
                            name,
                            value: '',
                            ...options,
                        });
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        });
                        response.cookies.set({
                            name,
                            value: '',
                            ...options,
                        });
                    },
                },
            }
        );

        const { data: { session } } = await supabase.auth.getSession();

        // 1. Check if user is authenticated
        if (!session) {
            const redirectUrl = request.nextUrl.clone();
            redirectUrl.pathname = '/login';
            redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname);
            return NextResponse.redirect(redirectUrl);
        }

        // 2. Check if user has admin role
        // Fetch profile role. Note: This adds a DB read per request. 
        // Optimization: In production, consider using Custom Claims in JWT to avoid this DB hit.
        // For now, robust DB check is safer.
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

        if (!profile || profile.role !== 'admin') {
            // Unauthorized - Redirect to home or 403 page
            const redirectUrl = request.nextUrl.clone();
            // Redirect to home as a safe default for non-admins trying to access admin
            redirectUrl.pathname = '/';
            return NextResponse.redirect(redirectUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        // Add other protected routes here if needed
    ],
};
