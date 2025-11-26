import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mic, BookOpen, MessageSquare, BookMarked, Target, Zap, Award, Clock, TrendingUp, Globe, Play, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useLanguage } from '../contexts/LanguageContext';
import { getProgress, UserProgress } from '../services/progressService';
import { contentDatabase } from '../data/content';
import { getUserProfileService } from '../services/userProfileService';
import { AnalyticsCharts } from './AnalyticsCharts';
import { timeTrackingService } from '../services/timeTrackingService';
import { SmartChat } from './SmartChat';
import { Profile } from './Profile';
import { generateDailyContent } from '../services/dailyContentService';

interface DashboardProps {
  onNavigate: (tab: string) => void;
  activeTab?: string;
  onLogout: () => void;
}

export function Dashboard({ onNavigate, activeTab, onLogout }: DashboardProps) {
  const { t, language } = useLanguage();
  const [progress, setProgress] = useState<UserProgress>(getProgress());
  const [lastActivity, setLastActivity] = useState<{ module: string; timestamp: string } | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [dailyContent, setDailyContent] = useState<any[]>([]);
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  useEffect(() => {
    // Check if guest
    const isGuest = localStorage.getItem('smartspeak-is-guest') === 'true';

    if (!isGuest) {
      // Refresh progress on mount only for logged in users
      setProgress(getProgress());
      const activity = getUserProfileService().getLastActivity();
      setLastActivity(activity);
    }

    // Get time spent today
    setTimeSpent(timeTrackingService.getTodayMinutes());

    // Load daily content
    const loadDailyContent = async () => {
      if (isGuest) return;

      const profile = getUserProfileService().getProfile();
      const today = new Date().toDateString();

      // Check if we already have today's content
      if (profile?.dailyContent && profile.dailyContent.date === today) {
        setDailyContent(profile.dailyContent.items);
      } else {
        // Generate new content
        setIsLoadingContent(true);
        const content = await generateDailyContent();
        setDailyContent(content);

        // Save to profile
        getUserProfileService().updateProfile({
          dailyContent: {
            date: today,
            items: content
          }
        });
        setIsLoadingContent(false);
      }
    };

    loadDailyContent();
  }, []);

  const isGuest = typeof window !== 'undefined' && localStorage.getItem('smartspeak-is-guest') === 'true';
  const userName = isGuest ? 'Guest' : (getUserProfileService().getProfile()?.name || 'Student');
  const userLevel = isGuest ? 1 : (getUserProfileService().getProfile()?.levelNumber || 1);
  const userXp = isGuest ? 0 : (getUserProfileService().getProfile()?.xp || 0);

  const features = [
    {
      id: 'voice',
      title: t.voicePractice,
      description: t.voicePracticeDesc,
      icon: Mic,
      color: 'from-blue-500 to-cyan-500',
      stats: `45 ${t.exercises}`
    },
    {
      id: 'vocabulary',
      title: t.smartVocabulary,
      description: t.smartVocabularyDesc,
      icon: BookOpen,
      color: 'from-purple-500 to-pink-500',
      stats: `2000+ ${t.words}`
    },
    {
      id: 'dialogues',
      title: t.dialogues,
      description: t.dialoguesDesc,
      icon: MessageSquare,
      color: 'from-green-500 to-emerald-500',
      stats: `20+ ${t.dialoguesCount}`
    },
    {
      id: 'grammar',
      title: t.grammarCoach,
      description: t.grammarCoachDesc,
      icon: BookMarked,
      color: 'from-orange-500 to-red-500',
      stats: `200+ ${t.exercises}`
    },
    {
      id: 'content',
      title: t.contentHub,
      description: language === 'kz' ? 'Видеолар, әндер және оқиғалар' : 'Видео, песни и истории',
      icon: Globe,
      color: 'from-indigo-500 to-violet-500',
      stats: `50+ ${t.exercises}` // Generic stats for now
    }
  ];

  const stats = [
    {
      label: t.learnedWords,
      value: progress.learnedWords.toString(),
      icon: Target,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: t.completedLessons,
      value: progress.completedLessons.toString(),
      icon: Clock,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      label: t.points,
      value: progress.points.toLocaleString(),
      icon: Zap,
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    {
      label: t.achievements,
      value: progress.achievements.toString(),
      icon: Award,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      label: 'Time Today',
      value: `${timeSpent}m`,
      icon: Clock,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
  ];

  // Get random recommendations
  const recommendations = contentDatabase.sort(() => 0.5 - Math.random()).slice(0, 2);

  const getModuleInfo = (moduleId: string) => {
    switch (moduleId) {
      case 'voice': return { title: t.voicePractice, icon: Mic, color: 'bg-blue-600' };
      case 'vocabulary': return { title: t.smartVocabulary, icon: BookOpen, color: 'bg-purple-600' };
      case 'dialogues': return { title: t.dialogues, icon: MessageSquare, color: 'bg-green-600' };
      case 'grammar': return { title: t.grammarCoach, icon: BookMarked, color: 'bg-orange-600' };
      case 'content': return { title: t.contentHub, icon: Globe, color: 'bg-indigo-600' };
      default: return { title: t.smartVocabulary, icon: BookOpen, color: 'bg-blue-600' };
    }
  };

  const lastModuleInfo = lastActivity ? getModuleInfo(lastActivity.module) : getModuleInfo('vocabulary');

  if (activeTab === 'profile') {
    return <Profile onLogout={onLogout} />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold mb-1 text-gray-900">{t.greeting}, {userName}! 👋</h1>
        <p className="text-gray-600">{t.continueLeaning}</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Analytics Charts */}
      <AnalyticsCharts />

      {/* Continue Learning & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold mb-4 text-gray-900">{t.continueLeaning}</h2>
            <Card className="border-0 shadow-md bg-white overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className={`${lastModuleInfo.color} p-6 flex items-center justify-center md:w-1/3`}>
                  <lastModuleInfo.icon className="size-16 text-white opacity-80" />
                </div>
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{lastModuleInfo.title}</h3>
                      <p className="text-gray-500 text-sm">
                        {lastActivity
                          ? (language === 'kz' ? 'Соңғы белсенділік' : 'Последняя активность')
                          : (language === 'kz' ? 'Оқуды бастаңыз' : 'Начните обучение')}
                      </p>
                    </div>
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                      {language === 'kz' ? 'Деңгей ' : 'Уровень '}{userLevel}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                    <div
                      className={`${lastModuleInfo.color} h-2 rounded-full transition-all duration-500`}
                      style={{
                        width: `${Math.min(100, Math.max(5, (userXp % 100)))}%`
                      }}
                    ></div>
                  </div>
                  <Button onClick={() => onNavigate(lastActivity ? lastActivity.module : 'vocabulary')} className="w-full md:w-auto">
                    {language === 'kz' ? 'Жалғастыру' : 'Продолжить'} <ArrowRight className="ml-2 size-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Recommendations */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-bold mb-4 text-gray-900">{language === 'kz' ? 'Ұсыныстар' : 'Рекомендации'}</h2>
            <div className="space-y-4">
              {recommendations.map((item, idx) => (
                <Card key={idx} className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.open(`https://www.youtube.com/watch?v=${item.url}`, '_blank')}>
                  <div className="flex gap-3 p-3">
                    <div className="relative w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                      <img src={item.thumbnail} alt={item.title[language]} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Play className="size-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-900 line-clamp-1">
                        {item.title[language]}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.type.toUpperCase()} • {item.level}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Modules */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-bold mb-4 text-gray-900">{t.mainModules}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer"
                onClick={() => onNavigate(feature.id)}
              >
                <Card className="border-0 shadow-md bg-white hover:shadow-xl transition-all overflow-hidden group h-full">
                  <div className={`h-1 bg-gradient-to-r ${feature.color}`} />
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`bg-gradient-to-br ${feature.color} p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform`}>
                        <Icon className="size-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                        <p className="text-xs text-gray-500 mb-1">{feature.stats}</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{feature.description}</p>
                      </div>
                    </div>
                    <Button
                      className={`mt-3 w-full bg-gradient-to-r ${feature.color} hover:opacity-90 text-white border-0`}
                      size="sm"
                    >
                      {t.start}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
