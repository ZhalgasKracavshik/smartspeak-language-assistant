'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Globe, LogOut, Moon, Sun } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

interface SettingsProps {
    onLogout: () => void;
}

export function Settings({ onLogout }: SettingsProps) {
    const { language, setLanguage } = useLanguage();
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const router = useRouter();

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

    const handleLogout = async () => {
        await supabase.auth.signOut();
        onLogout();
        router.push('/login');
    };

    return (
        <div className="p-4 md:p-6 max-w-2xl mx-auto mb-20 md:mb-0">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {language === 'ru' ? 'Настройки' : 'Баптаулар'}
                </h1>

                {/* Language Section */}
                <Card className="mb-6 border-0 shadow-lg dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 dark:text-white">
                            <Globe className="size-5 text-purple-600" />
                            {language === 'ru' ? 'Язык интерфейса' : 'Интерфейс тілі'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant={language === 'ru' ? 'default' : 'outline'}
                                onClick={() => setLanguage('ru')}
                                className="h-16 flex flex-col gap-1 dark:text-white dark:border-gray-600"
                            >
                                <span className="text-xl">🇷🇺</span>
                                <span className="text-sm">Русский</span>
                            </Button>
                            <Button
                                variant={language === 'kz' ? 'default' : 'outline'}
                                onClick={() => setLanguage('kz')}
                                className="h-16 flex flex-col gap-1 dark:text-white dark:border-gray-600"
                            >
                                <span className="text-xl">🇰🇿</span>
                                <span className="text-sm">Қазақша</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Appearance Section */}
                <Card className="mb-6 border-0 shadow-lg dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 dark:text-white">
                            {theme === 'light' ? <Sun className="size-5 text-orange-500" /> : <Moon className="size-5 text-indigo-400" />}
                            {language === 'ru' ? 'Оформление' : 'Безендіру'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label className="dark:text-gray-200">
                                    {language === 'ru' ? 'Тема' : 'Тақырып'}
                                </Label>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {theme === 'light'
                                        ? (language === 'ru' ? 'Светлая тема' : 'Жарық тақырып')
                                        : (language === 'ru' ? 'Тёмная тема' : 'Қараңғы тақырып')}
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

                {/* Logout Button */}
                <Card className="mb-6 border-0 shadow-lg dark:bg-gray-800">
                    <CardContent className="pt-6">
                        <Button
                            variant="destructive"
                            className="w-full justify-center"
                            onClick={handleLogout}
                        >
                            <LogOut className="size-4 mr-2" />
                            {language === 'ru' ? 'Выйти из аккаунта' : 'Аккаунттан шығу'}
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
