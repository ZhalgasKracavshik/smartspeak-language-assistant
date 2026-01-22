'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, BookOpen, MessageSquare, Gamepad, Stethoscope, Volume2, Globe, GraduationCap, Bot, User, Settings, BookMarked } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';

export function FloatingMobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { language, t } = useLanguage();

    // Full list of items from Sidebar
    const menuItems = [
        { id: 'dashboard', label: t.home, icon: Home, path: '/' },
        { id: 'classes', label: language === 'kz' ? 'Сыныптар' : 'Классы', icon: GraduationCap, path: '/classes' },
        { id: 'chat', label: 'Smart Chat', icon: Bot, path: '/chat' },
        { id: 'grammar', label: language === 'kz' ? 'Грамматика' : 'Грамматика', icon: BookMarked, path: '/learning/grammar' },
        { id: 'dialogues', label: language === 'kz' ? 'Диалогтар' : 'Диалоги', icon: MessageSquare, path: '/learning/dialogues' },
        { id: 'games', label: 'Mini-Games', icon: Gamepad, path: '/learning/games' },
        { id: 'vocabulary', label: language === 'kz' ? 'Сөздік' : 'Словарь', icon: BookOpen, path: '/learning/vocabulary' },
        { id: 'voice', label: t.voicePractice, icon: Volume2, path: '/learning/voice' },
        { id: 'content', label: t.contentHub, icon: Globe, path: '/learning/content' },
        { id: 'profile', label: t.profile, icon: User, path: '/profile' },
        { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
    ];

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black z-40 md:hidden"
                        />
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 20 }}
                            className="fixed bottom-24 right-4 z-50 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-4 w-64 md:hidden border border-gray-200 dark:border-slate-700 max-h-[70vh] overflow-y-auto"
                        >
                            <div className="grid grid-cols-2 gap-2">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.path;
                                    return (
                                        <Link
                                            key={item.id}
                                            href={item.path}
                                            onClick={() => setIsOpen(false)}
                                            className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${isActive
                                                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30'
                                                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-slate-700'
                                                }`}
                                        >
                                            <Icon className="size-6 mb-1" />
                                            <span className="text-xs font-medium text-center line-clamp-1">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-20 right-4 z-50 p-4 rounded-full shadow-lg md:hidden transition-colors ${isOpen
                    ? 'bg-red-500 text-white rotate-180'
                    : 'bg-blue-600 text-white'
                    }`}
            >
                {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </motion.button>
        </>
    );
}
