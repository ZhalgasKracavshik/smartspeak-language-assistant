import React, { useEffect, useState } from 'react';
import { Home, Mic, BookOpen, MessageSquare, BookMarked, TrendingUp, Sparkles, Globe, Zap, Trophy, Bot, User, Settings, LogIn } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { getUserProfileService, UserProfile } from '../services/userProfileService';
import { Progress } from './ui/progress';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange, onLogin }: SidebarProps & { onLogin?: () => void }) {
  const { language, setLanguage, t } = useLanguage();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const userProfile = getUserProfileService().getProfile();
    setProfile(userProfile);

    // Check streak on mount
    getUserProfileService().checkStreak();
  }, []);

  const menuItems = [
    { id: 'dashboard', label: t.home, icon: Home },
    { id: 'voice', label: t.voicePractice, icon: Mic },
    { id: 'vocabulary', label: t.smartVocabulary, icon: BookOpen },
    { id: 'dialogues', label: t.dialogues, icon: MessageSquare },
    { id: 'grammar', label: t.grammarCoach, icon: BookMarked },
    { id: 'chat', label: 'Smart Chat', icon: Bot },
    { id: 'content', label: t.contentHub, icon: Globe },
    { id: 'profile', label: t.profile, icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const isGuest = typeof window !== 'undefined' && localStorage.getItem('smartspeak-is-guest') === 'true';

  // Calculate level progress
  const currentLevel = isGuest ? 1 : (profile?.levelNumber || 1);
  const currentXp = isGuest ? 0 : (profile?.xp || 0);
  const xpForNextLevel = currentLevel * 100;
  const progressPercent = Math.min(100, (currentXp / xpForNextLevel) * 100);

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-xl p-6 flex flex-col h-screen sticky top-0"
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

        {/* Language Switcher */}
        <div className="flex gap-2 mt-4">
          <Button
            variant={language === 'ru' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLanguage('ru')}
            className="flex-1 text-xs"
          >
            RU
          </Button>
          <Button
            variant={language === 'kz' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLanguage('kz')}
            className="flex-1 text-xs"
          >
            KZ
          </Button>
        </div>
      </div>

      {/* User Stats */}
      {(profile || isGuest) && (
        <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <div className="bg-yellow-100 p-1.5 rounded-lg">
                <Trophy className="size-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Level {currentLevel}</p>
                <p className="text-sm font-bold text-gray-900">{isGuest ? 'Guest' : profile?.level}</p>
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
            <button
              onClick={onLogin}
              className="text-xs text-blue-600 hover:text-blue-700 hover:underline mt-2 w-full text-left font-medium transition-colors flex items-center gap-1"
            >
              Sign in to save progress
              <LogIn className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      <nav className="space-y-2 flex-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="size-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </motion.button>
          );
        })}
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
