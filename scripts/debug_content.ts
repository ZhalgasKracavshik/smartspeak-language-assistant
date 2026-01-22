
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Need this to bypass RLS for truth check

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

async function debugContent() {
    console.log('--- Debugging Content Accessibility ---');

    // 1. Check Public Access (Anon Key)
    const publicClient = createClient(supabaseUrl!, supabaseKey!);
    const { data: publicData, error: publicError } = await publicClient
        .from('media_content')
        .select('id, title, type')
        .limit(5);

    console.log('\n[Public Client] Fetch Media Result:');
    if (publicError) console.error('Error:', publicError.message);
    else console.log(`Found ${publicData?.length} items.`);
    if (publicData && publicData.length > 0) console.log('Sample:', publicData[0]);

    // 2. Check Admin Access (Service Role Key) - The "Truth"
    if (serviceKey) {
        const adminClient = createClient(supabaseUrl!, serviceKey);
        const { data: adminData, error: adminError } = await adminClient
            .from('media_content')
            .select('id, title, type')
            .limit(5);

        console.log('\n[Service Role Client] Fetch Media Result (The Truth):');
        if (adminError) console.error('Error:', adminError.message);
        else console.log(`Found ${adminData?.length} items.`);
        if (adminData && adminData.length > 0) console.log('Sample:', adminData[0]);

        if (adminData?.length > 0 && publicData?.length === 0) {
            console.error('\nCRITICAL: Content exists but is hidden from public client! RLS BLOCKING DETECTED.');
        }
    } else {
        console.warn('\nSkipping Service Role check (No SUPABASE_SERVICE_ROLE_KEY in env). Cannot verify hidden content.');
    }
}

debugContent();
