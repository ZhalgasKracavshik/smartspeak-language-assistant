
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkModules() {
    console.log('Fetching modules...');
    const { data, error } = await supabase.from('modules').select('*');
    if (error) {
        console.error('Error:', error);
        return;
    }
    console.log('Modules found:', data?.length);
    data?.forEach(m => {
        console.log(`[${m.id}] ${m.title} - Theme: "${m.color_theme}"`);
    });
}

checkModules();
