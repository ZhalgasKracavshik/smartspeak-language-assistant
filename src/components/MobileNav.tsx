import React from 'react';
import { Home, BookOpen, Mic, User, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

interface MobileNavProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
    const { t } = useLanguage();

    const navItems = [
        { id: 'dashboard', icon: Home, label: t.home },
        { id: 'learn', icon: BookOpen, label: 'Learn' }, // Groups Vocab & Grammar
        { id: 'practice', icon: Mic, label: 'Practice' }, // Groups Voice & Dialogues
        { id: 'content', icon: Globe, label: 'Content' },
        { id: 'profile', icon: User, label: 'Profile' }, // New Profile/Settings tab
    ];

    // Logic to highlight parent tabs if a sub-tab is active
    const isTabActive = (itemId: string) => {
        if (itemId === 'learn' && (activeTab === 'vocabulary' || activeTab === 'grammar')) return true;
        if (itemId === 'practice' && (activeTab === 'voice' || activeTab === 'dialogues')) return true;
        return activeTab === itemId;
    };

    const handleTabClick = (itemId: string) => {
        if (itemId === 'learn') onTabChange('vocabulary');
        else if (itemId === 'practice') onTabChange('voice');
        else onTabChange(itemId);
    };

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 z-50 safe-area-bottom">
            <div className="flex justify-between items-center">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isTabActive(item.id);

                    return (
                        <button
                            key={item.id}
                            onClick={() => handleTabClick(item.id)}
                            className={`flex flex-col items-center gap-1 p-2 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                animate={isActive ? { y: -2 } : { y: 0 }}
                            >
                                <Icon className={`size-6 ${isActive ? 'fill-current' : ''}`} />
                            </motion.div>
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
