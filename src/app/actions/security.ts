'use server';

import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin client for logging (needs service role to write to security_logs if RLS is strict, 
// but our previous setup allowed inserts. We'll use the standard client pattern for now, 
// assuming the table allows inserts from anon or we use a service key if needed).
// Ideally, security logs should be write-only for anon.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function logGuestAccessAction() {
    const headersList = headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const realIp = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    console.log(`[Security] Guest Access: IP=${realIp}, UA=${userAgent}`);

    try {
        const { error } = await supabase
            .from('security_logs')
            .insert({
                ip_address: realIp,
                action: 'GUEST_LOGIN',
                user_agent: userAgent,
                is_guest: true,
                metadata: { source: 'auth_screen' }
            });

        if (error) {
            console.error('[Security] Failed to log guest access:', error);
        }
    } catch (e) {
        console.error('[Security] Exception logging guest access:', e);
    }
}
