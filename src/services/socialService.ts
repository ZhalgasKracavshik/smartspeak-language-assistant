import { supabase } from '../lib/supabase';

export interface Friend {
    id: string;
    user_id: string;
    friend_id: string;
    status: 'pending' | 'accepted' | 'rejected';
    created_at: string;
    profile?: {
        full_name: string;
        avatar_url?: string;
        level: string;
        xp: number;
    };
}

export interface LeaderboardEntry {
    user_id: string;
    full_name: string;
    level: string;
    xp: number;
    avatar_url?: string;
    rank: number;
}

class SocialService {
    /**
     * Search for users by name
     */
    async searchUsers(query: string) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, full_name, level, xp, avatar_url')
                .ilike('full_name', `%${query}%`)
                .limit(10);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Search failed:', error);
            return [];
        }
    }

    /**
     * Send a friend request
     */
    async sendFriendRequest(friendId: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
            .from('friends')
            .insert({
                user_id: user.id,
                friend_id: friendId,
                status: 'pending'
            });

        if (error) throw error;
    }

    /**
     * Get friends list (accepted)
     */
    async getFriends(): Promise<Friend[]> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            const { data, error } = await supabase
                .from('friends')
                .select(`
                    *,
                    friend:profiles!friend_id(full_name, avatar_url, level, xp),
                    sender:profiles!user_id(full_name, avatar_url, level, xp)
                `)
                .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
                .eq('status', 'accepted');

            if (error) {
                console.error('Friends query error:', error);
                return [];
            }

            // Map to a cleaner structure
            return (data || []).map(f => {
                const isSender = f.user_id === user.id;
                const profile = isSender ? f.friend : f.sender;
                return {
                    ...f,
                    profile
                };
            });
        } catch (error) {
            console.error('Failed to load friends:', error);
            return [];
        }
    }

    /**
     * Get pending friend requests
     */
    async getFriendRequests() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            const { data, error } = await supabase
                .from('friends')
                .select(`
                    *,
                    sender:profiles!user_id(full_name, avatar_url, level, xp)
                `)
                .eq('friend_id', user.id)
                .eq('status', 'pending');

            if (error) {
                console.error('Friend requests query error:', error);
                return [];
            }
            return data || [];
        } catch (error) {
            console.error('Failed to load friend requests:', error);
            return [];
        }
    }

    /**
     * Accept friend request
     */
    async acceptFriendRequest(requestId: string) {
        const { error } = await supabase
            .from('friends')
            .update({ status: 'accepted' })
            .eq('id', requestId);

        if (error) throw error;
    }

    /**
     * Get leaderboard
     */
    async getLeaderboard(): Promise<LeaderboardEntry[]> {
        try {
            const { data, error } = await supabase
                .from('leaderboard')
                .select('*');

            if (error) {
                console.error('Leaderboard query error:', error);
                // Fallback: try to get from profiles directly
                return this.getLeaderboardFallback();
            }
            return data || [];
        } catch (error) {
            console.error('Leaderboard error:', error);
            return this.getLeaderboardFallback();
        }
    }

    /**
     * Fallback leaderboard from profiles table
     */
    private async getLeaderboardFallback(): Promise<LeaderboardEntry[]> {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, full_name, level, xp, avatar_url')
                .order('xp', { ascending: false })
                .limit(10);

            if (error || !data) return [];

            return data.map((profile, index) => ({
                user_id: profile.id,
                full_name: profile.full_name || 'Anonymous',
                level: profile.level || 'A1',
                xp: profile.xp || 0,
                avatar_url: profile.avatar_url,
                rank: index + 1
            }));
        } catch {
            return [];
        }
    }
}

export const socialService = new SocialService();
