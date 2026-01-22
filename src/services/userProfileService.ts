import { supabase } from '../lib/supabase';

export interface ActivityLog {
    date: string; // ISO date string YYYY-MM-DD
    count: number; // minutes or actions count
}

export interface UserProfile {
    level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    name?: string;
    interests: string[];
    hasCompletedOnboarding: boolean;
    createdAt: string;
    lastUpdated: string;
    xp: number;
    levelNumber: number;
    streak: number;
    lastLoginDate: string;
    role?: 'user' | 'admin' | 'teacher'; // Role for RBAC
    activityHistory?: ActivityLog[]; // New field
    lastActivity?: {
        module: string;
        timestamp: string;
    };
    dailyContent?: {
        date: string;
        items: Array<{
            id: string;
            title: string;
            type: 'video' | 'article' | 'song';
            url: string;
            thumbnail?: string;
            description?: string;
        }>;
    };
}

const STORAGE_KEY = 'smartspeak_user_profile';

class UserProfileService {
    private profile: UserProfile | null = null;
    private isGuest: boolean = true;

    constructor() {
        // Initial load from local storage for guest/offline support
        this.loadLocalProfile();
        // Check auth state and sync if needed
        this.checkAuthAndSync();
    }

    private async checkAuthAndSync() {
        if (typeof window === 'undefined') return;

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            this.isGuest = false;
            await this.loadCloudProfile(session.user.id);
        } else {
            this.isGuest = true;
            // Ensure we are using local profile
            this.loadLocalProfile();
        }

        // Listen for auth changes
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                this.isGuest = false;
                await this.loadCloudProfile(session.user.id);
            } else if (event === 'SIGNED_OUT') {
                this.isGuest = true;
                this.profile = null; // Clear profile on logout to avoid leaking data
                localStorage.removeItem(STORAGE_KEY); // Clear local storage
            }
        });
    }

    private loadLocalProfile() {
        try {
            if (typeof window === 'undefined') return;
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                this.profile = JSON.parse(stored);
                this.ensureProfileDefaults();
            }
        } catch (error) {
            console.error('Error loading local profile:', error);
        }
    }

    private async loadCloudProfile(userId: string) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;

            if (data) {
                // Map Supabase data to UserProfile
                this.profile = {
                    level: (data.level && data.level.length > 0) ? data.level : 'A1',
                    name: data.full_name,
                    interests: data.interests || [],
                    hasCompletedOnboarding: !!data.level, // Assume completed if level is set
                    createdAt: data.created_at || new Date().toISOString(),
                    lastUpdated: data.updated_at || new Date().toISOString(),
                    xp: data.xp || 0,
                    levelNumber: Math.floor((data.xp || 0) / 100) + 1,
                    streak: data.progress?.streak || 0, // Load streak from progress
                    lastLoginDate: data.progress?.lastLoginDate || new Date().toISOString(),
                    role: data.role || 'user', // Load role from profiles table
                    // Merge any extra data from progress jsonb if needed
                    ...data.progress
                };
                this.ensureProfileDefaults();
            }
        } catch (error) {
            console.error('Error loading cloud profile:', error);
        }
    }

    private ensureProfileDefaults() {
        if (this.profile && typeof this.profile.xp === 'undefined') {
            this.profile.xp = 0;
            this.profile.levelNumber = 1;
            this.profile.streak = 0;
            this.profile.lastLoginDate = new Date().toISOString();
            this.profile.activityHistory = [];
            this.saveProfile({});
        }
        if (this.profile && !this.profile.activityHistory) {
            this.profile.activityHistory = [];
        }
    }

    /**
     * Save user profile
     */
    async saveProfile(updates: Partial<UserProfile>): Promise<void> {
        const now = new Date().toISOString();

        this.profile = {
            ...this.profile,
            ...updates,
            lastUpdated: now,
            createdAt: this.profile?.createdAt || now,
        } as UserProfile;

        if (this.isGuest) {
            // Save to local storage
            if (typeof window !== 'undefined') {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profile));
            }
        } else {
            // Save to cloud
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { error } = await supabase
                    .from('profiles')
                    .upsert({
                        id: user.id,
                        full_name: this.profile.name,
                        level: this.profile.level,
                        xp: this.profile.xp,
                        interests: this.profile.interests,
                        updated_at: now,
                        // Store other fields in progress JSONB
                        progress: {
                            hasCompletedOnboarding: this.profile.hasCompletedOnboarding,
                            streak: this.profile.streak,
                            lastLoginDate: this.profile.lastLoginDate,
                            lastActivity: this.profile.lastActivity
                        }
                    });

                if (error) console.error('Error saving to cloud:', error);
            }
        }
    }

    /**
     * Update profile with partial data
     */
    updateProfile(updates: Partial<UserProfile>): void {
        this.saveProfile(updates);
    }

    /**
     * Get current user profile
     */
    getProfile(): UserProfile | null {
        return this.profile;
    }

    /**
     * Check if user has completed onboarding
     */
    hasCompletedOnboarding(): boolean {
        return this.profile?.hasCompletedOnboarding || false;
    }

    /**
     * Complete onboarding with user selections
     */
    completeOnboarding(level: UserProfile['level'], interests: string[]): void {
        this.saveProfile({
            level,
            interests,
            hasCompletedOnboarding: true,
            xp: 0,
            levelNumber: 1,
            streak: 1,
            lastLoginDate: new Date().toISOString()
        });
    }

    /**
     * Update user level
     */
    updateLevel(level: UserProfile['level']): void {
        this.saveProfile({ level });
    }

    /**
     * Update user interests
     */
    updateInterests(interests: string[]): void {
        this.saveProfile({ interests });
    }

    /**
     * Add XP to user and check for level up
     */
    addXp(amount: number): { leveledUp: boolean, newLevel: number } {
        if (!this.profile) return { leveledUp: false, newLevel: 1 };

        const newXp = (this.profile.xp || 0) + amount;
        let newLevel = this.profile.levelNumber || 1;
        let leveledUp = false;

        // Simple level up logic: Level * 100 XP required for next level
        const xpForNextLevel = newLevel * 100;

        if (newXp >= xpForNextLevel) {
            newLevel++;
            leveledUp = true;
        }

        this.saveProfile({ xp: newXp, levelNumber: newLevel });
        return { leveledUp, newLevel };
    }

    /**
     * Update streak logic
     * Should be called once per app load
     */
    /**
     * Check streak logic
     */
    checkStreak(): void {
        if (!this.profile) return;

        const now = new Date();
        const lastLogin = new Date(this.profile.lastLoginDate);
        const todayStr = now.toISOString().split('T')[0];
        const lastLoginStr = lastLogin.toISOString().split('T')[0];

        // If already logged in today, do nothing (or maybe just ensure streak is at least 1)
        if (todayStr === lastLoginStr) {
            return;
        }

        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (lastLoginStr === yesterdayStr) {
            // Logged in yesterday -> Increment streak
            this.saveProfile({
                streak: (this.profile.streak || 0) + 1,
                lastLoginDate: now.toISOString()
            });
        } else {
            // Missed a day -> Reset streak
            // Note: If account is new (streak 0), it becomes 1.
            this.saveProfile({
                streak: 1,
                lastLoginDate: now.toISOString()
            });
        }
    }

    /**
     * Log activity (e.g., time spent or lessons finished)
     */
    logActivity(minutes: number = 1): void {
        if (!this.profile) return;

        const today = new Date().toISOString().split('T')[0];
        const history = this.profile.activityHistory || [];

        const existingEntryIndex = history.findIndex(h => h.date === today);
        let newHistory = [...history];

        if (existingEntryIndex >= 0) {
            newHistory[existingEntryIndex] = {
                ...newHistory[existingEntryIndex],
                count: newHistory[existingEntryIndex].count + minutes
            };
        } else {
            newHistory.push({ date: today, count: minutes });
        }

        this.saveProfile({ activityHistory: newHistory });
    }

    /**
     * Reset profile (for testing)
     */
    resetProfile(): void {
        this.profile = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY);
        }
    }

    /**
     * Get recommended content based on profile
     */
    getRecommendedContentTypes(): string[] {
        if (!this.profile) return [];

        const { level } = this.profile;

        // Recommend content types based on level
        if (level === 'A1' || level === 'A2') {
            return ['cartoons', 'simple-videos', 'songs'];
        } else if (level === 'B1' || level === 'B2') {
            return ['videos', 'stories', 'music'];
        } else {
            return ['videos', 'movies', 'podcasts', 'articles'];
        }
    }

    /**
     * Set last activity (which module user visited)
     */
    setLastActivity(module: string): void {
        this.saveProfile({
            lastActivity: {
                module,
                timestamp: new Date().toISOString()
            }
        });
    }

    /**
     * Get last activity
     */
    getLastActivity(): { module: string; timestamp: string } | null {
        return this.profile?.lastActivity || null;
    }
    async deleteAccount(): Promise<void> {
        try {
            const { error } = await supabase.rpc('delete_user_account');
            if (error) throw error;

            if (typeof window !== 'undefined') {
                localStorage.clear();
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            throw error;
        }
    }
}

// Singleton instance
let userProfileServiceInstance: UserProfileService | null = null;

export function getUserProfileService(): UserProfileService {
    if (!userProfileServiceInstance) {
        userProfileServiceInstance = new UserProfileService();
    }
    return userProfileServiceInstance;
}
