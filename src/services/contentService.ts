import { createClient } from '@/utils/supabase/client';

export interface Module {
    id: number;
    title: string;
    description: string;
    grade_level: number;
    color_theme: string;
    image_url?: string;
}

export interface VocabularyWord {
    id: string; // uuid
    word: string;
    translation_ru: string;
    translation_kz: string;
    section?: string; // e.g. '1a'
    audio_url?: string;
    image_url?: string;
    module_id?: number;
}

export interface GrammarTopic {
    id: string;
    module_id: number;
    title_en: string;
    title_ru?: string;
    rule_en: string;
    rule_ru?: string;
    examples: string[]; // stored as JSONB in DB
}

export interface PhrasalVerb {
    id: string;
    module_id: number;
    base_verb: string;
    particle: string;
    meaning_en: string;
    meaning_ru?: string;
    meaning_kz?: string;
    example_en?: string;
    example_ru?: string;
}

export interface PracticeQuestion {
    id: string;
    module_id: number;
    question_en: string;
    question_ru?: string;
    question_kz?: string;
    answer_key?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
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
            return [];
        }
        return data || [];
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
        // Try fetching from the new table first
        const { data, error } = await supabase
            .from('module_vocabulary')
            .select('*')
            .eq('module_id', moduleId)
            .order('section', { ascending: true });

        if (error) {
            console.warn('Error fetching module_vocabulary, trying legacy table:', error.message);
            // Fallback to legacy 'vocabulary' table if new one fails (or not ready)
            const { data: legacyData, error: legacyError } = await supabase
                .from('vocabulary')
                .select('*')
                .eq('module_id', moduleId);

            if (legacyError) return [];
            return legacyData || [];
        }
        return data || [];
    },

    getModuleGrammar: async (moduleId: number): Promise<GrammarTopic[]> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('grammar_rules')
            .select('*')
            .eq('module_id', moduleId);

        if (error) {
            console.error('Error fetching grammar rules:', error);
            return [];
        }
        return data || [];
    },

    getModulePhrasalVerbs: async (moduleId: number): Promise<PhrasalVerb[]> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('phrasal_verbs')
            .select('*')
            .eq('module_id', moduleId);

        if (error) {
            console.error('Error fetching phrasal verbs:', error);
            return [];
        }
        return data || [];
    },

    getModulePracticeQuestions: async (moduleId: number): Promise<PracticeQuestion[]> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('practice_questions')
            .select('*')
            .eq('module_id', moduleId);

        if (error) {
            console.error('Error fetching practice questions:', error);
            return [];
        }
        return data || [];
    },

    getAllVocabulary: async (): Promise<VocabularyWord[]> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('module_vocabulary') // Use new table
            .select('*')
            .order('word', { ascending: true });

        if (error) {
            // Fallback
            const { data: legacyData } = await supabase.from('vocabulary').select('*');
            return legacyData || [];
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

        if (interests.length > 0 && !interests.includes('general')) {
            query = query.in('category', interests);
        }

        const { data, error } = await query.limit(10);

        if (error) {
            console.error('Error fetching recommendations:', error);
            return [];
        }
        return data || [];
    },

    // --- Admin Operations ---

    addVocabularyWord: async (word: Omit<VocabularyWord, 'id'>): Promise<VocabularyWord | null> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('vocabulary')
            .insert(word)
            .select()
            .single();

        if (error) {
            console.error('Error adding word:', error);
            return null;
        }
        return data;
    },

    updateVocabularyWord: async (id: string, updates: Partial<VocabularyWord>): Promise<VocabularyWord | null> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('vocabulary')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating word:', error);
            return null;
        }
        return data;
    },

    deleteVocabularyWord: async (id: string): Promise<boolean> => {
        const supabase = createClient();
        const { error } = await supabase
            .from('vocabulary')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting word:', error);
            return false;
        }
        return true;
    },

    // --- Media Content Admin ---

    addMediaContent: async (media: Omit<MediaItem, 'id' | 'created_at'>): Promise<MediaItem | null> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('media_content')
            .insert(media)
            .select()
            .single();

        if (error) {
            console.error('Error adding media:', error);
            return null;
        }
        return data;
    },

    updateMediaContent: async (id: string, updates: Partial<MediaItem>): Promise<MediaItem | null> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('media_content')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating media:', error);
            return null;
        }
        return data;
    },

    deleteMediaContent: async (id: string): Promise<boolean> => {
        const supabase = createClient();
        const { error } = await supabase
            .from('media_content')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting media:', error);
            return false;
        }
        return true;
    },

    // --- Subtitle Management ---

    getSubtitles: async (mediaIdOrUrl: string): Promise<any[]> => {
        const isUrl = mediaIdOrUrl.includes('/') || mediaIdOrUrl.length > 20;
        const param = isUrl ? 'videoUrl' : (mediaIdOrUrl.length === 36 ? 'mediaId' : 'videoId');
        const response = await fetch(`/api/subtitles?${param}=${encodeURIComponent(mediaIdOrUrl)}`);
        if (!response.ok) return [];
        return response.json();
    },

    updateSubtitle: async (id: string, updates: any): Promise<any | null> => {
        const response = await fetch('/api/subtitles', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, ...updates }),
        });
        if (!response.ok) return null;
        return response.json();
    },

    deleteSubtitle: async (id: string): Promise<boolean> => {
        const response = await fetch(`/api/subtitles?id=${id}`, {
            method: 'DELETE',
        });
        return response.ok;
    },

    // --- Quest Admin ---

    getQuests: async (): Promise<Quest[]> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('quests')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching quests:', error);
            return [];
        }
        return data || [];
    },

    addQuest: async (quest: Omit<Quest, 'id' | 'created_at'>): Promise<Quest | null> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('quests')
            .insert(quest)
            .select()
            .single();

        if (error) {
            console.error('Error adding quest:', error);
            return null;
        }
        return data;
    },

    updateQuest: async (id: string, updates: Partial<Quest>): Promise<Quest | null> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('quests')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating quest:', error);
            return null;
        }
        return data;
    },

    deleteQuest: async (id: string): Promise<boolean> => {
        const supabase = createClient();
        const { error } = await supabase
            .from('quests')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting quest:', error);
            return false;
        }
        return true;
    },

    // --- Grammar Topics Admin ---

    addGrammarTopic: async (topic: Omit<GrammarTopic, 'id'>): Promise<GrammarTopic | null> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('grammar_topics')
            .insert(topic)
            .select()
            .single();

        if (error) {
            console.error('Error adding grammar topic:', error);
            return null;
        }
        return data;
    },

    updateGrammarTopic: async (id: string, updates: Partial<GrammarTopic>): Promise<GrammarTopic | null> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('grammar_topics')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating grammar topic:', error);
            return null;
        }
        return data;
    },

    deleteGrammarTopic: async (id: string): Promise<boolean> => {
        const supabase = createClient();
        const { error } = await supabase
            .from('grammar_topics')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting grammar topic:', error);
            return false;
        }
        return true;
    },

    // --- User Quests ---

    getUserDailyQuests: async (): Promise<(Quest & { progress: number; is_completed: boolean })[]> => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return [];

        // 1. Get all available quests
        const { data: quests, error: questsError } = await supabase
            .from('quests')
            .select('*');

        if (questsError || !quests) {
            console.error('Error fetching quests:', questsError);
            return [];
        }

        // 2. Get user's progress for today
        const today = new Date().toISOString().split('T')[0];
        const { data: userProgress, error: progressError } = await supabase
            .from('daily_quests')
            .select('*')
            .eq('user_id', user.id)
            .eq('date', today);

        if (progressError) {
            console.error('Error fetching quest progress:', progressError);
            return [];
        }

        // 3. Merge
        return quests.map(quest => {
            const progress = userProgress?.find(p => p.quest_id === quest.id);
            return {
                ...quest,
                progress: progress?.progress || 0,
                is_completed: progress?.is_completed || false
            };
        });
    },

    updateQuestProgress: async (questId: string, increment: number = 1): Promise<void> => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const today = new Date().toISOString().split('T')[0];

        // Get current progress
        const { data: current, error: fetchError } = await supabase
            .from('daily_quests')
            .select('*')
            .eq('user_id', user.id)
            .eq('quest_id', questId)
            .eq('date', today)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is 'Row not found'
            console.error('Error fetching current progress:', fetchError);
            return;
        }

        // Get Quest Definition to check target
        const { data: questDef } = await supabase
            .from('quests')
            .select('target_count, xp_reward')
            .eq('id', questId)
            .single();

        if (!questDef) return;

        const newProgress = (current?.progress || 0) + increment;
        const isCompleted = newProgress >= questDef.target_count;

        // If newly completed, award XP (logic should be here or separate service)
        if (isCompleted && !current?.is_completed) {
            // Award XP to profile
            await supabase.rpc('increment_xp', { amount: questDef.xp_reward });
        }

        if (current) {
            await supabase
                .from('daily_quests')
                .update({
                    progress: newProgress,
                    is_completed: isCompleted
                })
                .eq('id', current.id);
        } else {
            await supabase
                .from('daily_quests')
                .insert({
                    user_id: user.id,
                    quest_id: questId,
                    progress: newProgress,
                    is_completed: isCompleted,
                    date: today
                });
        }
    },
    // --- Stats & Progress ---

    getModuleStats: async (): Promise<Record<number, { totalWords: number; startCount: number; learnedCount: number; masteredCount: number }>> => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // 1. Get total words per module from module_vocabulary
        const { data: allVocab, error: vocabError } = await supabase
            .from('module_vocabulary')
            .select('id, module_id');

        if (vocabError) return {};

        const stats: Record<number, { totalWords: number; startCount: number; learnedCount: number; masteredCount: number }> = {};

        // Init stats
        allVocab?.forEach(v => {
            if (v.module_id) {
                if (!stats[v.module_id]) {
                    stats[v.module_id] = { totalWords: 0, startCount: 0, learnedCount: 0, masteredCount: 0 };
                }
                stats[v.module_id].totalWords++;
            }
        });

        if (!user) return stats;

        // 2. Get user progress
        const { data: userProgress } = await supabase
            .from('vocabulary_progress')
            .select('word_id, status')
            .eq('user_id', user.id);

        if (userProgress) {
            // Create a lookup for word -> module
            const wordModuleMap = new Map<string, number>();
            allVocab?.forEach(v => wordModuleMap.set(v.id, v.module_id || 0));

            userProgress.forEach(p => {
                const moduleId = wordModuleMap.get(p.word_id.toString());
                if (moduleId && stats[moduleId]) {
                    if (p.status === 'new') stats[moduleId].startCount++;
                    if (p.status === 'learning') stats[moduleId].learnedCount++;
                    if (p.status === 'mastered') stats[moduleId].masteredCount++;
                }
            });
        }

        return stats;
    }
};

export interface Quest {
    id: string;
    title: string;
    description?: string;
    xp_reward: number;
    target_count: number;
    type: 'vocabulary' | 'grammar' | 'speech' | 'dialogue' | 'mixed';
    created_at?: string;
}

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
