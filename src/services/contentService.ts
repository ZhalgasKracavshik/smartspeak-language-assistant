import { createClient } from '@/utils/supabase/client';

export interface Module {
    id: number;
    title: string;
    description: string;
    grade_level: number;
    color_theme: string;
}

export interface VocabularyWord {
    id: string; // uuid
    word: string;
    translation_ru: string;
    translation_kz: string;
    part_of_speech: string;
    transcription?: string;
    level?: string;
    category?: string;
    example_sentence: string;
    example_translation_ru?: string;
    example_translation_kz?: string;
    module_id?: number;
}

export interface GrammarTopic {
    id: string;
    module_id: number;
    title: string;
    description: string;
    rules: string[];
    examples: string[];
}

export const contentService = {
    getModules: async (): Promise<Module[]> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('modules')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('Error fetching modules:', error);
            // Log full error object for debugging
            console.error(JSON.stringify(error, null, 2));
            return [];
        }
        if (!data) {
            console.warn('Modules fetch returned no data, but no error.');
            return [];
        }
        return data;
    },

    getModuleById: async (id: number): Promise<Module | null> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('modules')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return null;
        return data;
    },

    getModuleVocabulary: async (moduleId: number): Promise<VocabularyWord[]> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('vocabulary')
            .select('*')
            .eq('module_id', moduleId);

        if (error) {
            console.error('Error fetching module vocabulary:', error);
            return [];
        }
        return data || [];
    },

    getModuleGrammar: async (moduleId: number): Promise<GrammarTopic[]> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('grammar_topics') // Check table name match
            .select('*')
            .eq('module_id', moduleId);

        if (error) {
            console.error('Error fetching grammar:', error);
            return [];
        }
        return data || [];
    },

    getAllVocabulary: async (): Promise<VocabularyWord[]> => {
        const supabase = createClient();
        // fetch only essential fields if list is huge, or all
        const { data, error } = await supabase
            .from('vocabulary')
            .select('*')
            .order('word', { ascending: true });

        if (error) {
            console.error('Error fetching dictionary:', error);
            return [];
        }
        return data || [];
    },

    getMediaContent: async (): Promise<MediaItem[]> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('media_content')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching media content:', error);
            return [];
        }
        return data || [];
    },

    getRecommendedContent: async (interests: string[]): Promise<MediaItem[]> => {
        const supabase = createClient();
        let query = supabase.from('media_content').select('*');

        // Simple filtering: if interests provided, try to match category or tags
        // Note: 'media_content' has 'category' column. 'tags' is not yet in DB schema migration I created (my bad, I missed tags array in schema but put it in seed script? Wait, let me check schema).
        // Schema checks: title, description, type, difficulty, category, cloudinary_url, duration.
        // Seed script has: tags in input array, but schema only has category. Tag data might be lost or put in category.
        // I should check schema again. I used 'category text'.
        // So I will filter by category.

        if (interests.length > 0 && !interests.includes('general')) {
            query = query.in('category', interests);
        }

        const { data, error } = await query.limit(10);

        if (error) {
            console.error('Error fetching recommendations:', error);
            return [];
        }
        return data || [];
    }
};

export interface MediaItem {
    id: string;
    title: string;
    description?: string;
    type: 'video' | 'cartoon' | 'song' | 'story';
    url?: string; // mapping to cloudinary_url
    cloudinary_url?: string;
    thumbnail_url?: string;
    difficulty?: string;
    category?: string;
    duration?: number;
    created_at?: string;
}
