'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../components/Sidebar';
import { Dashboard } from '../components/Dashboard';
import { VoicePractice } from '../components/VoicePractice';
import { SmartVocabulary } from '../components/SmartVocabulary';
import { DialogueGenerator } from '../components/DialogueGenerator';
import { GrammarCoach } from '../components/GrammarCoach';
import { getUserProfileService } from '../services/userProfileService';
import { ContentHub } from '../components/ContentHub';
import { MobileNav } from '../components/MobileNav';
import { SmartChat } from '../components/SmartChat';
import { Settings } from '../components/Settings';
import { Auth } from '../components/Auth';
import { Classes } from '../components/Classes';
import { ChevronRight } from 'lucide-react';
import { timeTrackingService } from '../services/timeTrackingService';
import { useLanguage } from '../contexts/LanguageContext';
import { Onboarding } from '../components/Onboarding';

function AppContent() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const { t, language } = useLanguage();

    useEffect(() => {
        timeTrackingService.startTracking();

        const checkAuth = () => {
            try {
                const profileService = getUserProfileService();
                const profile = profileService.getProfile();
                setIsAuthenticated(!!profile);

                if (profile && !profileService.hasCompletedOnboarding()) {
                    setShowOnboarding(true);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
        const profileService = getUserProfileService();
        if (!profileService.hasCompletedOnboarding()) {
            setShowOnboarding(true);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('smartspeak-is-guest');
        localStorage.removeItem('smartspeak-user-profile');
        setIsAuthenticated(false);
        setActiveTab('dashboard');
    };

    if (!isAuthenticated) {
        return <Auth onLogin={handleLogin} />;
    }

    if (showOnboarding) {
        return <Onboarding onComplete={() => setShowOnboarding(false)} />;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
            case 'profile':
                return <Dashboard onNavigate={setActiveTab} activeTab={activeTab} onLogout={handleLogout} />;
            case 'voice':
                return <VoicePractice />;
            case 'vocabulary':
                return <SmartVocabulary />;
            case 'classes':
                return <Classes />;
            case 'dialogues':
                return <DialogueGenerator />;
            case 'grammar':
                return <GrammarCoach />;
            case 'chat':
                return <SmartChat />;
            case 'content':
                return <ContentHub />;
            case 'games':
                router.push('/games');
                return null;
            case 'terms':
                router.push('/terms');
                return null;
            case 'settings':
                return <Settings onLogout={handleLogout} />;
            default:
                return <Dashboard onNavigate={setActiveTab} activeTab={activeTab} onLogout={handleLogout} />;
        }
    };

    const getBreadcrumb = () => {
        const map: Record<string, string> = {
            dashboard: t.home,
            voice: t.voicePractice,
            vocabulary: t.smartVocabulary,
            dialogues: t.dialogues,
            grammar: t.grammarCoach,
            content: t.contentHub,
            chat: 'Smart Chat',
            games: 'Mini-Games',
            classes: language === 'kz' ? 'Сыныптар' : 'Классы',
            terms: language === 'kz' ? 'Терминдер' : 'Термины',
            progress: t.progress,
            profile: t.profile
        };
        return map[activeTab] || 'Home';
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
            <div className="hidden md:block sticky top-0 h-screen">
                <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogin={handleLogout} />
            </div>

            <main className="flex-1 overflow-y-auto h-screen flex flex-col pb-16 md:pb-0">
                <div className="hidden md:flex items-center gap-2 px-8 py-4 text-sm text-gray-500">
                    <span>SmartSpeak</span>
                    <ChevronRight className="size-4" />
                    <span className="font-medium text-gray-900">{getBreadcrumb()}</span>
                </div>

                <div className="flex-1">
                    {renderContent()}
                </div>
            </main>

            <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
            <footer className="hidden md:block fixed bottom-0 right-0 p-2 text-xs text-gray-400 bg-white/80 backdrop-blur-sm rounded-tl-lg pointer-events-none z-50">
                v1.0.1 (Deployed)
            </footer>
        </div>
    );
}

export default function Home() {
    return <AppContent />;
}
