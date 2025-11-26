import React from 'react';
import { Home, Mic, BookOpen, MessageSquare, BookMarked, Bot, Gamepad, GraduationCap, FileText, Globe, User, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

interface MobileNavProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
    const { t, language } = useLanguage();

    const navItems = [
        { id: 'dashboard', icon: Home, label: t.home },
        { id: 'voice', icon: Mic, label: t.voicePractice },
        { id: 'vocabulary', icon: BookOpen, label: t.smartVocabulary },
        { id: 'dialogues', icon: MessageSquare, label: t.dialogues },
        { id: 'grammar', icon: BookMarked, label: t.grammarCoach },
        { id: 'chat', icon: Bot, label: 'Smart Chat' },
        { id: 'games', icon: Gamepad, label: 'Mini-Games' },
        { id: 'classes', icon: GraduationCap, label: language === 'kz' ? 'Сыныптар' : 'Классы' },
        { id: 'terms', icon: FileText, label: language === 'kz' ? 'Терминдер' : 'Термины' },
        { id: 'content', icon: Globe, label: t.contentHub },
        { id: 'profile', icon: User, label: t.profile },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom overflow-x-auto">
            <div className="flex items-center px-2 py-2 min-w-max">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`flex flex-col items-center gap-1 px-3 py-2 flex-shrink-0 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                animate={isActive ? { y: -2 } : { y: 0 }}
                            >
                                <Icon className={`size-5 ${isActive ? 'fill-current' : ''}`} />
                            </motion.div>
                            <span className="text-[9px] font-medium whitespace-nowrap">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
