import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Authentication middleware for API routes
 * Verifies Supabase JWT token and returns authenticated user
 */
export async function requireAuth(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Unauthorized - No authentication token provided' },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            }
        );

        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            console.error('Auth error:', error);
            return NextResponse.json(
                { error: 'Unauthorized - Invalid or expired token' },
                { status: 401 }
            );
        }

        return { user, supabase };
    } catch (error) {
        console.error('Auth middleware error:', error);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
}

/**
 * Optional authentication - allows guest users
 * Returns user if authenticated, null if guest
 */
export async function optionalAuth(request: NextRequest) {
    const authHeader = request.headers.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
        return { user: null, supabase: null };
    }

    const result = await requireAuth(request);
    if (result instanceof NextResponse) {
        // Auth failed, but that's okay for optional auth
        return { user: null, supabase: null };
    }

    return result;
}
