
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Using anon key, assuming RLS allows insert or we blindly trust it for local dev script. Ideally use SERVICE_ROLE_KEY if available.

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing Supabase credentials in .env.local');
    process.exit(1);
}

// Check for service role key for bypassing RLS if needed, otherwise try anon
const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey);

const FIXED_CONTENT = [
    // From content.ts
    {
        title: 'English Conversation Practice',
        description: 'Күнделікті сөйлесу практикасы / Практика повседневного общения',
        type: 'video',
        cloudinary_url: '8irSFvoyLHQ', // YouTube ID
        thumbnail_url: 'https://img.youtube.com/vi/8irSFvoyLHQ/hqdefault.jpg',
        difficulty: 'A2',
        category: 'conversation',
        duration: 1800 // 30 mins
    },
    {
        title: 'English Fairy Tales',
        description: 'Жай английша ертегілер / Простые сказки на английском',
        type: 'cartoon',
        cloudinary_url: 'v7sz7GNs33k',
        thumbnail_url: 'https://img.youtube.com/vi/v7sz7GNs33k/hqdefault.jpg',
        difficulty: 'A1',
        category: 'kids',
        duration: 600
    },
    {
        title: 'Learn English with Songs - Easy Lyrics',
        description: 'Оңай әндермен үйреніңіз / Учитесь с легкими песнями',
        type: 'song',
        cloudinary_url: 'kJQP7kiw5Fk',
        thumbnail_url: 'https://img.youtube.com/vi/kJQP7kiw5Fk/hqdefault.jpg',
        difficulty: 'A2',
        category: 'music',
        duration: 270
    },
    {
        title: 'English Learning Songs for Kids',
        description: 'Балалар үшін әндер / Обучающие песни для детей',
        type: 'song',
        cloudinary_url: 'ZjBuJg2B5wk',
        thumbnail_url: 'https://img.youtube.com/vi/ZjBuJg2B5wk/hqdefault.jpg',
        difficulty: 'A1',
        category: 'kids',
        duration: 1500
    },
    {
        title: 'Short English Stories',
        description: 'Қысқа әңгімелер оқу практикасына / Короткие рассказы для практики чтения',
        type: 'story',
        cloudinary_url: 'TsOIf-7QQA8',
        thumbnail_url: 'https://img.youtube.com/vi/TsOIf-7QQA8/hqdefault.jpg',
        difficulty: 'A2',
        category: 'reading',
        duration: 480
    },

    // From ContentLibrary.ts (Recommendations)
    {
        title: 'Medical English: Hospital Vocabulary',
        description: 'Learn essential vocabulary for hospital settings.',
        type: 'video',
        cloudinary_url: 'https://res.cloudinary.com/demo/video/upload/dog.mp4', // Placeholder preserved
        thumbnail_url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80',
        difficulty: 'intermediate',
        category: 'medical',
        duration: 300
    },
    {
        title: 'Doctor-Patient Dialogue Practice',
        description: 'Advanced dialogue practice for medical professionals.',
        type: 'video',
        cloudinary_url: 'https://res.cloudinary.com/demo/video/upload/dog.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
        difficulty: 'advanced',
        category: 'medical',
        duration: 480
    },
    {
        title: 'Business English: Negotiating a Deal',
        description: 'Key phrases and strategies for business negotiations.',
        type: 'video',
        cloudinary_url: 'https://res.cloudinary.com/demo/video/upload/dog.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80',
        difficulty: 'intermediate',
        category: 'business',
        duration: 600
    },
    {
        title: 'Email Etiquette for Professionals',
        description: 'How to write professional emails.',
        type: 'video',
        cloudinary_url: 'https://res.cloudinary.com/demo/video/upload/dog.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
        difficulty: 'beginner',
        category: 'business',
        duration: 360
    },
    {
        title: 'At the Airport: Check-in & Security',
        description: 'Essential travel vocabulary.',
        type: 'video',
        cloudinary_url: 'https://res.cloudinary.com/demo/video/upload/dog.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&q=80',
        difficulty: 'beginner',
        category: 'travel',
        duration: 240
    },
    {
        title: 'Ordering Food in a Restaurant',
        description: 'How to order food in English.',
        type: 'video',
        cloudinary_url: 'https://res.cloudinary.com/demo/video/upload/dog.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
        difficulty: 'beginner',
        category: 'travel',
        duration: 300
    },
    {
        title: 'Learn English with Stranger Things',
        description: 'Fun vocabulary learning with TV shows.',
        type: 'video',
        cloudinary_url: 'https://res.cloudinary.com/demo/video/upload/dog.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=800&q=80',
        difficulty: 'intermediate',
        category: 'movies',
        duration: 180
    },
    {
        title: 'Tech Talk: Artificial Intelligence',
        description: 'Advanced vocabulary for technology topics.',
        type: 'video',
        cloudinary_url: 'https://res.cloudinary.com/demo/video/upload/dog.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
        difficulty: 'advanced',
        category: 'technology',
        duration: 420
    }
];

async function seed() {
    console.log('Starting seed...');

    // Check if empty
    const { count, error: countError } = await supabase.from('media_content').select('*', { count: 'exact', head: true });

    if (countError) {
        console.error('Error checking table:', countError);
        return;
    }

    if (count && count > 0) {
        console.log(`Table already has ${count} items. Skipping seed to avoid duplicates.`);
        return;
    }

    const { data, error } = await supabase.from('media_content').insert(FIXED_CONTENT).select();

    if (error) {
        console.error('Error inserting data:', error);
    } else {
        console.log(`Successfully inserted ${data.length} items!`);
    }
}

seed();
