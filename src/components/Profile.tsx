import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Settings, LogOut, Trophy, Flame, Calendar, Edit2, Save, X, Search, UserPlus, Users, Map, Camera, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useLanguage } from '../contexts/LanguageContext';
import { getUserProfileService, UserProfile } from '../services/userProfileService';
import { supabase } from '../lib/supabase';
import { socialService, LeaderboardEntry } from '../services/socialService';
import { ProgressMap } from './ProgressMap';
import { ActivityCalendar } from './profile/ActivityCalendar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface ProfileProps {
    onLogout: () => void;
}

export function Profile({ onLogout }: ProfileProps) {
    const { t, language } = useLanguage();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editAvatar, setEditAvatar] = useState('');
    const [isGuest, setIsGuest] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'friends' | 'leaderboard' | 'journey'>('profile');
    const [friends, setFriends] = useState<any[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoadingFriends, setIsLoadingFriends] = useState(false);
    const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const loadProfile = async () => {
            const userProfile = getUserProfileService().getProfile();
            setProfile(userProfile);
            setEditName(userProfile?.name || '');
            // Default avatar or existing
            setEditAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile?.name || 'User'}`);
            setIsGuest(localStorage.getItem('smartspeak-is-guest') === 'true');

            // If not guest, ensure we have fresh data from database
            if (!localStorage.getItem('smartspeak-is-guest')) {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                    if (data) {
                        // Update local profile with database values
                        const freshProfile: UserProfile = {
                            level: data.level || userProfile?.level || 'A1',
                            name: data.full_name || userProfile?.name,
                            interests: data.interests || userProfile?.interests || [],
                            hasCompletedOnboarding: true,
                            createdAt: data.created_at || new Date().toISOString(),
                            lastUpdated: data.updated_at || new Date().toISOString(),
                            xp: data.xp || 0,
                            levelNumber: Math.floor((data.xp || 0) / 100) + 1,
                            streak: data.progress?.streak || 0,
                            lastLoginDate: data.progress?.lastLoginDate || new Date().toISOString(),
                            role: data.role || 'user',
                            activityHistory: data.progress?.activityHistory || []
                        };
                        setProfile(freshProfile);
                    }
                }
            }
        };
        loadProfile();
    }, []);

    useEffect(() => {
        let isMounted = true;
        const loadCurrentUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (isMounted) {
                    setCurrentUserId(user?.id || null);
                    if (user) {
                        setCurrentUserEmail(user.email || '');
                        // Try to get avatar from metadata if available
                        if (user.user_metadata?.avatar_url) {
                            setEditAvatar(user.user_metadata.avatar_url);
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to load user:', error);
            }
        };
        loadCurrentUser();
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (activeTab === 'friends' && !isGuest) {
            loadFriends();
        } else if (activeTab === 'leaderboard' && !isGuest) {
            loadLeaderboard();
        }
    }, [activeTab, isGuest]);

    const loadFriends = async () => {
        setIsLoadingFriends(true);
        try {
            const friendsList = await socialService.getFriends();
            setFriends(friendsList);
        } catch (error) {
            console.error('Failed to load friends:', error);
        } finally {
            setIsLoadingFriends(false);
        }
    };

    const loadLeaderboard = async () => {
        setIsLoadingLeaderboard(true);
        try {
            const data = await socialService.getLeaderboard();
            setLeaderboard(data || []);
        } catch (error) {
            console.error('Failed to load leaderboard:', error);
        } finally {
            setIsLoadingLeaderboard(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim() || isGuest) return;

        setIsSearching(true);
        try {
            const results = await socialService.searchUsers(searchQuery);
            setSearchResults(results || []);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleAddFriend = async (friendId: string) => {
        try {
            await socialService.sendFriendRequest(friendId);
            alert('Friend request sent!');
            setSearchResults(searchResults.filter(u => u.id !== friendId));
        } catch (error: any) {
            alert(error.message || 'Failed to send friend request');
        }
    };

    const handleSaveProfile = async () => {
        if (profile) {
            const updatedProfile = { ...profile, name: editName };
            getUserProfileService().updateProfile(updatedProfile);
            setProfile(updatedProfile);
            setIsEditing(false);

            if (!isGuest) {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    // Update Supabase profile
                    await supabase.from('profiles').update({
                        full_name: editName,
                        // If we were saving avatar url, we'd do it here too, but for now it's generated or basic
                    }).eq('id', user.id);

                    // Update Auth Metadata for Avatar (if we were persisting it there)
                    await supabase.auth.updateUser({
                        data: {
                            full_name: editName,
                            avatar_url: editAvatar
                        }
                    });
                }
            }
        }
    };

    if (!profile && !isGuest) return null;
    const currentLevel = isGuest ? 1 : (profile?.levelNumber || 1);
    const currentXp = isGuest ? 0 : (profile?.xp || 0);

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{t.profile}</h1>
                    <p className="text-gray-500">Manage your account and view progress</p>
                </div>
                {/* Logout button removed - moved to Settings */}
            </motion.div>

            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
                <Button variant={activeTab === 'profile' ? 'default' : 'ghost'} onClick={() => setActiveTab('profile')} size="sm">Profile</Button>
                <Button variant={activeTab === 'friends' ? 'default' : 'ghost'} onClick={() => setActiveTab('friends')} size="sm">Friends</Button>
                <Button variant={activeTab === 'leaderboard' ? 'default' : 'ghost'} onClick={() => setActiveTab('leaderboard')} size="sm">Leaderboard</Button>
                <Button variant={activeTab === 'journey' ? 'default' : 'ghost'} onClick={() => setActiveTab('journey')} size="sm"><Map className="size-4 mr-1" />Journey</Button>
            </div>


            {activeTab === 'profile' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <Avatar className="size-24 border-4 border-blue-50">
                                        <AvatarImage src={editAvatar} />
                                        <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">{isGuest ? 'G' : (profile?.name?.[0] || 'U')}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h2 className="text-2xl font-bold">{isGuest ? 'Guest User' : (profile?.name || 'Student')}</h2>
                                                <p className="text-gray-500">{currentUserEmail || 'English Learner'}</p>
                                            </div>
                                            {!isGuest && (
                                                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm">
                                                            <Edit2 className="size-4 mr-2" />
                                                            Edit Profile
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Edit Profile</DialogTitle>
                                                            <DialogDescription>
                                                                Make changes to your profile here. Click save when you're done.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="grid gap-4 py-4">
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <Label htmlFor="name" className="text-right">
                                                                    Name
                                                                </Label>
                                                                <Input
                                                                    id="name"
                                                                    value={editName}
                                                                    onChange={(e) => setEditName(e.target.value)}
                                                                    className="col-span-3"
                                                                />
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <Label className="text-right">Avatar</Label>
                                                                <div className="col-span-3 flex gap-2">
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        onClick={() => setEditAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`)}
                                                                    >
                                                                        <RefreshCw className="size-4 mr-2" />
                                                                        Generate New
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-center py-4">
                                                                <img src={editAvatar} alt="Preview" className="size-24 rounded-full border" />
                                                            </div>
                                                        </div>
                                                        <DialogFooter>
                                                            <Button type="submit" onClick={handleSaveProfile}>Save changes</Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <p className="text-sm text-gray-500 mb-1">Current Level</p>
                                        <p className="text-xl font-bold text-blue-600">{isGuest ? 'A1' : profile?.level}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <p className="text-sm text-gray-500 mb-1">Total XP</p>
                                        <p className="text-xl font-bold text-purple-600">{currentXp}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Activity Calendar Section */}
                        <ActivityCalendar data={profile?.activityHistory || []} />
                    </div>

                    <Card className="h-fit">
                        <CardHeader><CardTitle>Statistics</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
                                <div className="bg-orange-100 p-2 rounded-lg"><Flame className="size-5 text-orange-600" /></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{profile?.streak || 0} Day Streak</p>
                                    <p className="text-xs text-gray-500">Keep it up!</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                                <div className="bg-blue-100 p-2 rounded-lg"><Trophy className="size-5 text-blue-600" /></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Level {currentLevel}</p>
                                    <p className="text-xs text-gray-500">Top 10% of learners</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                                <div className="bg-green-100 p-2 rounded-lg"><Calendar className="size-5 text-green-600" /></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Joined</p>
                                    <p className="text-xs text-gray-500">
                                        {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {activeTab === 'friends' && (
                <Card>
                    <CardHeader><CardTitle>Friends</CardTitle><CardDescription>Connect with other learners</CardDescription></CardHeader>
                    <CardContent>
                        {isGuest ? (
                            <div className="text-center py-8">
                                <Users className="size-12 mx-auto mb-4 text-gray-300" />
                                <p className="text-gray-500 mb-4">Sign in to add friends and compete!</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input placeholder="Search users by name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} className="pl-10" />
                                        </div>
                                        <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()}>{isSearching ? 'Searching...' : 'Search'}</Button>
                                    </div>
                                    {searchResults.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-gray-700">Search Results:</p>
                                            {searchResults.map(user => (
                                                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar><AvatarFallback>{user.full_name?.[0] || 'U'}</AvatarFallback></Avatar>
                                                        <div>
                                                            <p className="font-medium">{user.full_name}</p>
                                                            <p className="text-xs text-gray-500">{user.level} • {user.xp} XP</p>
                                                        </div>
                                                    </div>
                                                    <Button size="sm" onClick={() => handleAddFriend(user.id)}><UserPlus className="size-4 mr-1" />Add</Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-700">Your Friends ({friends.length}):</p>
                                    {isLoadingFriends ? <div className="text-center py-8 text-gray-500">Loading friends...</div> : friends.length === 0 ? <div className="text-center py-8 text-gray-500">No friends yet. Search to add someone!</div> : friends.map(friend => (
                                        <div key={friend.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                            <Avatar><AvatarFallback>{friend.profile?.full_name?.[0] || 'F'}</AvatarFallback></Avatar>
                                            <div className="flex-1">
                                                <p className="font-bold">{friend.profile?.full_name || 'Friend'}</p>
                                                <p className="text-xs text-gray-500">{friend.profile?.level} • {friend.profile?.xp} XP</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {activeTab === 'leaderboard' && (
                <Card>
                    <CardHeader><CardTitle>🏆 Leaderboard</CardTitle><CardDescription>Top learners ranked by XP</CardDescription></CardHeader>
                    <CardContent>
                        {isGuest ? (
                            <div className="text-center py-8">
                                <Trophy className="size-12 mx-auto mb-4 text-gray-300" />
                                <p className="text-gray-500 mb-4">Sign in to see the leaderboard!</p>
                            </div>
                        ) : isLoadingLeaderboard ? (
                            <div className="text-center py-8 text-gray-500">Loading leaderboard...</div>
                        ) : (
                            <div className="space-y-2">
                                {leaderboard.length === 0 ? <div className="text-center py-8 text-gray-500">No data available yet</div> : leaderboard.map((entry) => {
                                    const isCurrentUser = entry.user_id === currentUserId;
                                    return (
                                        <div key={entry.user_id} className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${isCurrentUser ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'}`}>
                                            <div className={`size-10 flex items-center justify-center font-bold rounded-full ${entry.rank === 1 ? 'bg-yellow-100 text-yellow-600' : entry.rank === 2 ? 'bg-gray-200 text-gray-600' : entry.rank === 3 ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                                            </div>
                                            <Avatar><AvatarFallback>{entry.full_name?.[0] || 'U'}</AvatarFallback></Avatar>
                                            <div className="flex-1">
                                                <p className={`font-bold ${isCurrentUser ? 'text-blue-700' : ''}`}>{entry.full_name}{isCurrentUser ? ' (You)' : ''}</p>
                                                <p className="text-xs text-gray-500">{entry.level}</p>
                                            </div>
                                            <p className="font-bold text-blue-600">{entry.xp.toLocaleString()} XP</p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {activeTab === 'journey' && (
                <div>
                    <ProgressMap />
                </div>
            )}
        </div>
    );
}
