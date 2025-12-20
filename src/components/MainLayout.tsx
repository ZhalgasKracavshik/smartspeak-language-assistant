'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { t, language } = useLanguage();

    const isAuthPage = pathname === '/login' || pathname === '/registration' || pathname === '/forgot-password';

    if (isAuthPage) {
        return <>{children}</>;
    }

    const getBreadcrumb = () => {
        const map: Record<string, string> = {
            '/': t.home,
            '/learning': language === 'kz' ? 'Оқыту' : 'Изучение',
            '/learning/voice': t.voicePractice,
            '/learning/vocabulary': t.smartVocabulary,
            '/learning/dialogues': t.dialogues,
            '/learning/grammar': t.grammarCoach,
            '/learning/content': t.contentHub,
            '/chat': 'Smart Chat',
            '/learning/games': 'Mini-Games',
            '/learning/medical': language === 'kz' ? 'Медициналық терминдер' : 'Медицинские термины',
            '/profile': t.profile,
            '/settings': 'Settings'
        };
        return map[pathname || ''] || 'SmartSpeak';
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
            <div className="hidden md:block sticky top-0 h-screen">
                <Sidebar />
            </div>

            <main className="flex-1 overflow-y-auto h-screen flex flex-col pb-16 md:pb-0">
                <div className="hidden md:flex items-center gap-2 px-8 py-4 text-sm text-gray-500">
                    <span>SmartSpeak</span>
                    <ChevronRight className="size-4" />
                    <span className="font-medium text-gray-900">{getBreadcrumb()}</span>
                </div>

                <div className="flex-1">
                    {children}
                </div>
            </main>

            <MobileNav />
            <footer className="hidden md:block fixed bottom-0 right-0 p-2 text-xs text-gray-400 bg-white/80 backdrop-blur-sm rounded-tl-lg pointer-events-none z-50">
                v1.0.1 (Deployed)
            </footer>
        </div>
    );
}
