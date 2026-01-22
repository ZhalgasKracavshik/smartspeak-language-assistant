
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// User provided service key
const serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvcndhZnViYmZuc3J1Yml3YnhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzkwMTYzNywiZXhwIjoyMDc5NDc3NjM3fQ.mCGPnCz4WzktO3olcRDaM1fKaibE6vjqu_MnW7LpAUk";

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

async function debugContent() {
    console.log('--- Debugging Content Accessibility (WITH KEY) ---');

    // 1. Check Public Access (Anon Key)
    const publicClient = createClient(supabaseUrl!, supabaseKey!);
    const { data: publicData, error: publicError } = await publicClient
        .from('media_content')
        .select('id, title, type')
        .limit(10);

    console.log('\n[Public Client] Fetch Media Result:');
    if (publicError) console.error('Error:', publicError.message);
    else console.log(`Found ${publicData?.length} items.`);
    publicData?.forEach(i => console.log(` - ${i.title}`));

    // 2. Check Admin Access (Service Role Key)
    const adminClient = createClient(supabaseUrl!, serviceKey);
    const { data: adminData, error: adminError } = await adminClient
        .from('media_content')
        .select('id, title, type')
        .limit(50); // Fetch more to find Puss in Boots

    console.log('\n[Service Role Client] Fetch Media Result (The Truth):');
    if (adminError) console.error('Error:', adminError.message);
    else console.log(`Found ${adminData?.length} items.`);
    adminData?.forEach(i => console.log(` - ${i.title} [${i.type}]`));

    // Check for Puss in Boots specifically
    const puss = adminData?.find(i => i.title.toLowerCase().includes('puss') || i.title.toLowerCase().includes('boots'));
    if (puss) {
        console.log('\nFOUND PUSS IN BOOTS in DB:', puss);
        // Check RLS policies? No, we just proved it's there.
        // If public didn't see it, it is RLS.
    } else {
        console.log('\nNOT FOUND PUSS IN BOOTS in DB. It was likely never saved or deleted.');
    }
}

debugContent();
