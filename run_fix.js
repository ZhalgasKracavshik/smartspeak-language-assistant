
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Use Service Role Key if available to bypass RLS for admin fixes
const keyToUse = serviceRoleKey || supabaseKey;

if (!supabaseUrl || !keyToUse) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, keyToUse, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function run() {
    console.log('Running Admin & Content Fix...');

    // Read the SQL file
    const sqlPath = path.join(__dirname, 'db', 'fix_admin_and_content.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Supabase JS client doesn't support raw SQL execution directly on the public interface easily
    // WITHOUT a postgres connection string or RPC.
    // HOWEVER, we can use the 'rpc' method if we had a function 'exec_sql'.
    // Since we probably don't, and the user environment might not have 'psql' installed...
    // Wait, I can use the 'rpc' if I create a function, OR I can just use the provided 'role' update
    // using standard method if I have service role.

    // 1. Update Profiles (Safe way via Table API)
    console.log('Updating profiles to admin...');
    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .neq('role', 'admin'); // Update all who are not admin

    if (profileError) {
        console.error('Error updating profiles:', profileError);
        // If table doesn't exist or RLS blocks even service role (unlikely), we have issues.
    } else {
        console.log('Profiles updated.');
    }

    // 2. Insert Puss in Boots if missing
    console.log('Checking media content...');
    const { data: existing } = await supabase
        .from('media_content')
        .select('id')
        .eq('title', 'Puss in Boots: The Last Wish')
        .single();

    if (!existing) {
        console.log('Restoring Puss in Boots...');
        const { error: insertError } = await supabase
            .from('media_content')
            .insert({
                title: 'Puss in Boots: The Last Wish',
                description: 'Official Trailer for Puss in Boots: The Last Wish',
                type: 'video',
                cloudinary_url: 'https://res.cloudinary.com/demo/video/upload/v1683274983/puss_in_boots_trailer.mp4',
                thumbnail_url: 'https://res.cloudinary.com/demo/video/upload/w_300,h_200,c_fill/v1683274983/puss_in_boots_trailer.jpg',
                duration: 145,
                difficulty: 'intermediate',
                category: 'movies',
                tags: ['cartoon', 'trailer']
            });

        if (insertError) console.error('Error restoring video:', insertError);
        else console.log('Video restored.');
    } else {
        console.log('Puss in Boots already exists.');
    }

    console.log('Fix complete. Please check the Admin Panel.');
}

run();
