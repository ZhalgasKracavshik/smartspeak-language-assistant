import { supabase } from '../lib/supabase';

export type InterestTopic = 'business' | 'medical' | 'travel' | 'technology' | 'general' | 'movies' | 'career';

interface InteractionMetadata {
    word?: string;
    dialogue_id?: string;
    category?: string;
    video_id?: string;
    [key: string]: any;
}

export const InterestService = {
    /**
     * Log a user action and update interest scores automatically
     */
    async trackAction(actionType: string, topic: InterestTopic, weight: number, metadata: InteractionMetadata = {}) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // 1. Log the raw interaction
            await supabase.from('interaction_logs').insert({
                user_id: user.id,
                action_type: actionType,
                metadata: { ...metadata, topic, weight }
            });

            // 2. Update the interest score
            // First, get current score
            const { data: currentInterest } = await supabase
                .from('user_interests')
                .select('score')
                .eq('user_id', user.id)
                .eq('topic', topic)
                .single();

            const newScore = (currentInterest?.score || 0) + weight;

            // Upsert the new score
            await supabase.from('user_interests').upsert({
                user_id: user.id,
                topic: topic,
                score: newScore,
                last_updated: new Date().toISOString()
            });

            console.log(`[InterestService] Updated ${topic} score to ${newScore}`);

        } catch (error) {
            console.error('[InterestService] Error tracking action:', error);
        }
    },

    /**
     * Get user's top interests sorted by score
     */
    async getTopInterests(limit = 3): Promise<InterestTopic[]> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return ['general'];

        const { data } = await supabase
            .from('user_interests')
            .select('topic, score')
            .eq('user_id', user.id)
            .order('score', { ascending: false })
            .limit(limit);

        if (!data || data.length === 0) return ['general'];

        return data.map(row => row.topic as InterestTopic);
    }
};
