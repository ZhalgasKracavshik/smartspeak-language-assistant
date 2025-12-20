'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Globe, Trash2, Save, Camera, Moon, Sun, LogOut, ChevronDown, AlertTriangle, Shield } from 'lucide-react';
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
    const { language, setLanguage, t } = useLanguage();
    const userProfileService = getUserProfileService();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [showDangerZone, setShowDangerZone] = useState(false);
    const [confirmReset, setConfirmReset] = useState('');
    const [confirmDelete, setConfirmDelete] = useState('');
    const [isSaving, setIsSaving] = useState(false);

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

        // Load user data from Supabase
        loadUserData();
    }, []);

    const loadUserData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setEmail(user.email || '');
            setName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student');
            setAvatar(user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`);
        } else {
            // Guest mode
            const profile = userProfileService.getProfile();
            setName('Guest');
            setAvatar('https://api.dicebear.com/7.x/avataaars/svg?seed=guest');
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { error } = await supabase.auth.updateUser({
                data: { full_name: name }
            });
            if (error) throw error;
            alert(language === 'ru' ? 'Профиль обновлен!' : 'Профиль жаңартылды!');
        } catch (e) {
            console.error(e);
            alert(language === 'ru' ? 'Ошибка сохранения' : 'Сақтау қатесі');
        } finally {
            setIsSaving(false);
        }
    };

    const handleResetProgress = () => {
        if (confirmReset.toLowerCase() !== 'reset') {
            alert(language === 'ru'
                ? 'Введите "reset" для подтверждения'
                : '"reset" деп жазыңыз растау үшін');
            return;
        }
        userProfileService.resetProfile();
        setConfirmReset('');
        setShowDangerZone(false);
        window.location.reload();
    };

    const handleDeleteAccount = async () => {
        if (confirmDelete.toLowerCase() !== 'delete my account') {
            alert(language === 'ru'
                ? 'Введите "delete my account" для подтверждения'
                : '"delete my account" деп жазыңыз растау үшін');
            return;
        }
        try {
            await userProfileService.deleteAccount();
            await supabase.auth.signOut();
            onLogout();
            window.location.reload();
        } catch (e) {
            console.error(e);
            alert('Failed to delete account. Please try again.');
        }
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

                {/* Profile Section */}
                <Card className="mb-6 border-0 shadow-lg dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 dark:text-white">
                            <User className="size-5 text-blue-600" />
                            {language === 'ru' ? 'Профиль' : 'Профиль'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative">
                                <img
                                    src={avatar}
                                    alt="Avatar"
                                    className="size-24 rounded-full border-4 border-blue-100 dark:border-blue-900 mb-2 bg-gray-100"
                                />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{email}</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name" className="dark:text-gray-200">
                                {language === 'ru' ? 'Имя' : 'Аты'}
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={language === 'ru' ? 'Введите имя' : 'Атыңызды енгізіңіз'}
                                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            />
                        </div>

                        <Button
                            onClick={handleSave}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={isSaving}
                        >
                            <Save className="size-4 mr-2" />
                            {isSaving
                                ? (language === 'ru' ? 'Сохранение...' : 'Сақтау...')
                                : (language === 'ru' ? 'Сохранить' : 'Сақтау')}
                        </Button>
                    </CardContent>
                </Card>

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
                            variant="outline"
                            className="w-full justify-center text-gray-700 dark:text-gray-300 dark:border-gray-600"
                            onClick={onLogout}
                        >
                            <LogOut className="size-4 mr-2" />
                            {language === 'ru' ? 'Выйти из аккаунта' : 'Аккаунттан шығу'}
                        </Button>
                    </CardContent>
                </Card>

                {/* Danger Zone - Collapsible */}
                <Card className="border-gray-200 dark:border-gray-700 shadow-lg dark:bg-gray-800">
                    <CardHeader className="cursor-pointer" onClick={() => setShowDangerZone(!showDangerZone)}>
                        <CardTitle className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                                <Shield className="size-5" />
                                {language === 'ru' ? 'Опасная зона' : 'Қауіпті аймақ'}
                            </div>
                            <ChevronDown className={`size-5 transition-transform ${showDangerZone ? 'rotate-180' : ''}`} />
                        </CardTitle>
                    </CardHeader>

                    <AnimatePresence>
                        {showDangerZone && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <CardContent className="space-y-6 border-t border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10">
                                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 pt-4">
                                        <AlertTriangle className="size-4" />
                                        <p className="text-sm font-medium">
                                            {language === 'ru'
                                                ? 'Эти действия необратимы!'
                                                : 'Бұл әрекеттерді қайтару мүмкін емес!'}
                                        </p>
                                    </div>

                                    {/* Reset Progress */}
                                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-900/30">
                                        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                                            {language === 'ru' ? 'Сбросить прогресс' : 'Прогресті қалпына келтіру'}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                            {language === 'ru'
                                                ? 'Весь прогресс обучения будет удалён'
                                                : 'Барлық оқу прогресі жойылады'}
                                        </p>
                                        <div className="flex gap-2">
                                            <Input
                                                value={confirmReset}
                                                onChange={(e) => setConfirmReset(e.target.value)}
                                                placeholder={language === 'ru' ? 'Введите "reset"' : '"reset" деп жазыңыз'}
                                                className="flex-1 text-sm"
                                            />
                                            <Button
                                                variant="destructive"
                                                onClick={handleResetProgress}
                                                disabled={confirmReset.toLowerCase() !== 'reset'}
                                                size="sm"
                                            >
                                                {language === 'ru' ? 'Сбросить' : 'Қалпына келтіру'}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Delete Account */}
                                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-900/30">
                                        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                                            {language === 'ru' ? 'Удалить аккаунт' : 'Аккаунтты жою'}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                            {language === 'ru'
                                                ? 'Аккаунт и все данные будут удалены навсегда'
                                                : 'Аккаунт пен барлық деректер мәңгілікке жойылады'}
                                        </p>
                                        <div className="flex gap-2">
                                            <Input
                                                value={confirmDelete}
                                                onChange={(e) => setConfirmDelete(e.target.value)}
                                                placeholder={language === 'ru' ? 'Введите "delete my account"' : '"delete my account" деп жазыңыз'}
                                                className="flex-1 text-sm"
                                            />
                                            <Button
                                                variant="destructive"
                                                onClick={handleDeleteAccount}
                                                disabled={confirmDelete.toLowerCase() !== 'delete my account'}
                                                size="sm"
                                            >
                                                {language === 'ru' ? 'Удалить' : 'Жою'}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>
            </motion.div>
        </div>
    );
}
