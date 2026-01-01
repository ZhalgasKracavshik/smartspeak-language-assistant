'use client';

import React, { useEffect, useState } from 'react';
import { Home, Mic, BookOpen, MessageSquare, BookMarked, TrendingUp, Sparkles, Zap, Trophy, Bot, User, Settings, LogIn, Gamepad, GraduationCap, FileText, Brain, Stethoscope, Volume2, ChevronDown, ChevronRight, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { getUserProfileService, UserProfile } from '../services/userProfileService';
import { Progress } from './ui/progress';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export function Sidebar() {
  const { language, t } = useLanguage();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const loadProfile = () => {
      const userProfile = getUserProfileService().getProfile();
      setProfile(userProfile);
      setIsProfileLoaded(true);
    };

    loadProfile();

    // Check streak on mount
    getUserProfileService().checkStreak();

    // Listen for profile updates (from other components)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'smartspeak-profile') {
        loadProfile();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom profile update events
    const handleProfileUpdate = () => loadProfile();
    window.addEventListener('profile-updated', handleProfileUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profile-updated', handleProfileUpdate);
    };
  }, []);

  const [isLearningExpanded, setIsLearningExpanded] = useState(false);

  const learningItems = [
    { id: 'grammar', label: language === 'kz' ? 'Грамматика' : 'Грамматика', icon: BookMarked, path: '/learning/grammar' },
    { id: 'dialogues', label: language === 'kz' ? 'Диалогтар' : 'Диалоги', icon: MessageSquare, path: '/learning/dialogues' },
    { id: 'games', label: 'Mini-Games', icon: Gamepad, path: '/learning/games' },
    { id: 'vocabulary', label: 'Smart Vocabulary', icon: BookOpen, path: '/learning/vocabulary' },
    { id: 'medical', label: language === 'kz' ? 'Медициналық терминдер' : 'Медицинские термины', icon: Stethoscope, path: '/learning/medical' },
    { id: 'voice', label: t.voicePractice, icon: Volume2, path: '/learning/voice' },
    { id: 'content', label: t.contentHub, icon: Globe, path: '/learning/content' },
  ];

  const mainMenuItems = [
    { id: 'dashboard', label: t.home, icon: Home, path: '/' },
    { id: 'classes', label: language === 'kz' ? 'Сыныптар (5-9)' : 'Классы (5-9)', icon: GraduationCap, path: '/classes' },
    { id: 'chat', label: 'Smart Chat', icon: Bot, path: '/chat' },
  ];

  const bottomItems = [
    { id: 'profile', label: t.profile, icon: User, path: '/profile' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const isGuest = typeof window !== 'undefined' && localStorage.getItem('smartspeak-is-guest') === 'true';

  // Calculate level progress
  const currentLevel = isGuest ? 1 : (profile?.levelNumber || 1);
  const currentXp = isGuest ? 0 : (profile?.xp || 0);
  const xpForNextLevel = currentLevel * 100;
  const progressPercent = Math.min(100, (currentXp / xpForNextLevel) * 100);

  const renderMenuItem = (item: any) => {
    const Icon = item.icon;
    const isActive = pathname === item.path || (item.path !== '/' && pathname?.startsWith(item.path));

    return (
      <Link
        key={item.id}
        href={item.path}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
          ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
      >
        <Icon className="size-5" />
        <span className="text-sm font-medium">{item.label}</span>
      </Link>
    );
  };

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-xl p-6 flex flex-col h-screen sticky top-0 overflow-y-auto"
    >
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
            <Sparkles className="size-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{t.appName}</h1>
            <p className="text-xs text-gray-500">{t.appSubtitle}</p>
          </div>
        </div>
      </div>

      {/* User Stats */}
      {isProfileLoaded && (profile || isGuest) && (
        <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <div className="bg-yellow-100 p-1.5 rounded-lg">
                <Trophy className="size-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Level {currentLevel}</p>
                <p className="text-sm font-bold text-gray-900">{isGuest ? 'Guest' : (profile?.level || 'A1')}</p>
              </div>
            </div>
            {!isGuest && (
              <div className="text-right">
                <p className="text-xs text-gray-500">XP</p>
                <p className="text-sm font-bold text-blue-600">{currentXp}</p>
              </div>
            )}
          </div>
          {!isGuest && <Progress value={progressPercent} className="h-1.5" />}
          {!isGuest && <p className="text-[10px] text-gray-400 mt-1 text-right">{currentXp} / {xpForNextLevel} XP</p>}
          {isGuest && (
            <Link
              href="/login"
              className="text-xs text-blue-600 hover:text-blue-700 hover:underline mt-2 w-full text-left font-medium transition-colors flex items-center gap-1"
            >
              Sign in to save progress
              <LogIn className="w-3 h-3" />
            </Link>
          )}
        </div>
      )}

      {/* Loading skeleton for user stats */}
      {!isProfileLoaded && (
        <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100 animate-pulse">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <div className="bg-gray-200 p-1.5 rounded-lg w-7 h-7" />
              <div>
                <div className="h-3 w-12 bg-gray-200 rounded mb-1" />
                <div className="h-4 w-8 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="text-right">
              <div className="h-3 w-6 bg-gray-200 rounded mb-1 ml-auto" />
              <div className="h-4 w-10 bg-gray-200 rounded ml-auto" />
            </div>
          </div>
          <div className="h-1.5 w-full bg-gray-200 rounded" />
        </div>
      )}

      <nav className="space-y-2">
        {/* Main Menu */}
        <div className="space-y-1">
          {mainMenuItems.map(renderMenuItem)}

          {/* Learning Hub with Submenu */}
          <div>
            <button
              onClick={() => setIsLearningExpanded(!isLearningExpanded)}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all ${pathname?.startsWith('/learning') || pathname === '/classes'
                ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <div className="flex items-center gap-3">
                <Brain className="size-5" />
                <span className="text-sm font-medium">{language === 'kz' ? 'Оқыту' : 'Изучение'}</span>
              </div>
              {isLearningExpanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
            </button>

            <AnimatePresence>
              {isLearningExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-4 mt-1 space-y-1 overflow-hidden"
                >
                  {learningItems.map(renderMenuItem)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Items */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          {bottomItems.map(renderMenuItem)}
        </div>
      </nav>

      <div className="mt-auto p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="size-4 text-amber-500 fill-amber-500" />
          <p className="text-sm font-bold text-amber-900">{t.streak}: {profile?.streak || 0} {t.streakDays}</p>
        </div>
        <p className="text-xs text-amber-700">{t.keepGoing}</p>
      </div>
    </motion.aside>
  );
}
