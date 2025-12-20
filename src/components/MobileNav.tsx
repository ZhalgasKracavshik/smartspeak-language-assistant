import React from 'react';
import { Home, User, Bot, BookOpen, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function MobileNav() {
    const { t, language } = useLanguage();
    const pathname = usePathname();

    const mainNavItems = [
        { id: 'dashboard', icon: Home, label: language === 'ru' ? 'Главная' : 'Үйге', path: '/' },
        { id: 'profile', icon: User, label: language === 'ru' ? 'Профиль' : 'Профиль', path: '/profile' },
        { id: 'chat', icon: Bot, label: 'Smart Chat', path: '/chat' },
        { id: 'learning', icon: BookOpen, label: language === 'ru' ? 'Изучение' : 'Оқу', path: '/learning' },
        { id: 'settings', icon: Settings, label: language === 'ru' ? 'Настройки' : 'Параметрлер', path: '/settings' },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
            <div className="flex items-center justify-around px-2 py-2">
                {mainNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path || (item.path !== '/' && pathname?.startsWith(item.path));

                    return (
                        <Link
                            key={item.id}
                            href={item.path}
                            className={`flex flex-col items-center gap-1 px-3 py-2 flex-1 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                animate={isActive ? { y: -2 } : { y: 0 }}
                            >
                                <Icon className={`size-6 ${isActive ? 'fill-current' : ''}`} />
                            </motion.div>
                            <span className="text-[10px] font-medium whitespace-nowrap">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
