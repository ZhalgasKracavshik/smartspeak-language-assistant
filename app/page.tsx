'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../src/components/Sidebar';
import { Dashboard } from '../src/components/Dashboard';
import { VoicePractice } from '../src/components/VoicePractice';
import { SmartVocabulary } from '../src/components/SmartVocabulary';
import { DialogueGenerator } from '../src/components/DialogueGenerator';
import { GrammarCoach } from '../src/components/GrammarCoach';
import { getUserProfileService } from '../src/services/userProfileService';
import { ContentHub } from '../src/components/ContentHub';
import { MobileNav } from '../src/components/MobileNav';
import { SmartChat } from '../src/components/SmartChat';
import { Settings } from '../src/components/Settings';
import { Auth } from '../src/components/Auth';
import { ChevronRight } from 'lucide-react';
import { timeTrackingService } from '../src/services/timeTrackingService';
import { useLanguage } from '../src/contexts/LanguageContext';
import { Onboarding } from '../src/components/Onboarding';

function AppContent() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        // Start tracking time when app mounts
        timeTrackingService.startTracking();

        // Check authentication status
        const checkAuth = () => {
            const profileService = getUserProfileService();
            const profile = profileService.getProfile();
            setIsAuthenticated(!!profile);

            // Check onboarding status
            if (profile && !profileService.hasCompletedOnboarding()) {
                setShowOnboarding(true);
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
        // Clear guest flag and all local data
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
            case 'dialogues':
                return <DialogueGenerator />;
            case 'grammar':
                return <GrammarCoach />;
            case 'chat':
                return <SmartChat />;
            case 'content':
                return <ContentHub />;
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
            progress: t.progress,
            profile: t.profile
        };
        return map[activeTab] || 'Home';
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
            {/* Sidebar (Desktop) */}
            <div className="hidden md:block sticky top-0 h-screen">
                <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogin={handleLogout} />
            </div>

            <main className="flex-1 overflow-y-auto h-screen flex flex-col pb-16 md:pb-0">
                {/* Breadcrumbs (Desktop) */}
                <div className="hidden md:flex items-center gap-2 px-8 py-4 text-sm text-gray-500">
                    <span>SmartSpeak</span>
                    <ChevronRight className="size-4" />
                    <span className="font-medium text-gray-900">{getBreadcrumb()}</span>
                </div>

                <div className="flex-1">
                    {renderContent()}
                </div>
            </main>

            {/* Mobile Navigation (Bottom Bar) */}
            <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
    );
}

export default function Home() {
    return <AppContent />;
}
