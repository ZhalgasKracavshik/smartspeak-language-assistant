import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Globe, Trash2, Save, Camera, Moon, Sun, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useLanguage } from '../contexts/LanguageContext';
import { getUserProfileService, UserProfile } from '../services/userProfileService';
import { supabase } from '../lib/supabase';

interface SettingsProps {
    onLogout: () => void;
}

export function Settings({ onLogout }: SettingsProps) {
    const { language, setLanguage } = useLanguage();
    const userProfileService = getUserProfileService();
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        // Load theme
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    useEffect(() => {
        const currentProfile = userProfileService.getProfile();
        // In a real app, these would come from the profile. 
        setName('Student');
        setAvatar('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix');

        // Load API Key
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) setApiKey(savedKey);
    }, []);

    const handleSaveApiKey = () => {
        localStorage.setItem('gemini_api_key', apiKey);
        alert('API Key saved successfully!');
    };

    const handleSave = () => {
        alert('Profile updated! (Simulation)');
    };

    const handleResetProgress = () => {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            userProfileService.resetProfile();
            window.location.reload();
        }
    };

    const handleDeleteAccount = async () => {
        if (confirm('Are you ABSOLUTELY sure? This action cannot be undone. All your data will be permanently lost.')) {
            try {
                await userProfileService.deleteAccount();
                await supabase.auth.signOut();
                onLogout();
                window.location.reload();
            } catch (e) {
                console.error(e);
                alert('Failed to delete account. Please try again.');
            }
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto mb-20 md:mb-0">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings & Profile</h1>

                {/* Profile Section */}
                <Card className="mb-6 border-0 shadow-lg dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 dark:text-white">
                            <User className="size-5 text-blue-600" />
                            Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative">
                                <img
                                    src={avatar}
                                    alt="Avatar"
                                    className="size-24 rounded-full border-4 border-blue-100 mb-2"
                                />
                                <button className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700 transition-colors">
                                    <Camera className="size-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name" className="dark:text-gray-200">Display Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            />
                        </div>

                        <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                            <Save className="size-4 mr-2" />
                            Save Changes
                        </Button>
                    </CardContent>
                </Card>

                {/* Language Section */}
                <Card className="mb-6 border-0 shadow-lg dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 dark:text-white">
                            <Globe className="size-5 text-purple-600" />
                            Language Preferences
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant={language === 'ru' ? 'default' : 'outline'}
                                onClick={() => setLanguage('ru')}
                                className="h-20 flex flex-col gap-2 dark:text-white dark:border-gray-600"
                            >
                                <span className="text-2xl">🇷🇺</span>
                                Russian
                            </Button>
                            <Button
                                variant={language === 'kz' ? 'default' : 'outline'}
                                onClick={() => setLanguage('kz')}
                                className="h-20 flex flex-col gap-2 dark:text-white dark:border-gray-600"
                            >
                                <span className="text-2xl">🇰🇿</span>
                                Kazakh
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Appearance Section */}
                <Card className="mb-6 border-0 shadow-lg dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 dark:text-white">
                            {theme === 'light' ? <Sun className="size-5 text-orange-500" /> : <Moon className="size-5 text-indigo-400" />}
                            Appearance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label className="dark:text-gray-200">Theme</Label>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {theme === 'light' ? 'Light mode is active' : 'Dark mode is active'}
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={toggleTheme}
                                className="rounded-full size-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            >
                                {theme === 'light' ? <Moon className="size-5" /> : <Sun className="size-5" />}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Actions */}
                <Card className="mb-6 border-0 shadow-lg dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 dark:text-white">
                            <LogOut className="size-5 text-gray-600 dark:text-gray-400" />
                            Account Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button
                            variant="outline"
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 dark:border-gray-600"
                            onClick={onLogout}
                        >
                            <LogOut className="size-4 mr-2" />
                            Log Out
                        </Button>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-red-100 shadow-lg bg-red-50 dark:bg-red-900/10 dark:border-red-900/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                            <Trash2 className="size-5" />
                            Danger Zone
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-red-100 dark:border-red-900/30">
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-gray-100">Reset Progress</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Clear all learning data and start over</p>
                            </div>
                            <Button variant="destructive" onClick={handleResetProgress}>
                                Reset
                            </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-red-100 dark:border-red-900/30">
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-gray-100">Delete Account</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Permanently remove your account and data</p>
                            </div>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteAccount}
                            >
                                Delete Account
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
