import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Award, Target, Calendar, Star, Zap, BookOpen, Mic, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { achievements, monthlyGoals } from '../data/achievements';

const weeklyData = [
  { day: 'Mon', dayKz: 'Дс', dayRu: 'Пн', words: 12, practice: 25, dialogues: 2 },
  { day: 'Tue', dayKz: 'Сс', dayRu: 'Вт', words: 18, practice: 35, dialogues: 3 },
  { day: 'Wed', dayKz: 'Ср', dayRu: 'Ср', words: 15, practice: 30, dialogues: 2 },
  { day: 'Thu', dayKz: 'Бс', dayRu: 'Чт', words: 22, practice: 45, dialogues: 4 },
  { day: 'Fri', dayKz: 'Жм', dayRu: 'Пт', words: 20, practice: 40, dialogues: 3 },
  { day: 'Sat', dayKz: 'Сн', dayRu: 'Сб', words: 25, practice: 50, dialogues: 5 },
  { day: 'Sun', dayKz: 'Жк', dayRu: 'Вс', words: 18, practice: 38, dialogues: 3 },
];

const skillsData = [
  { skill: 'Speaking', value: 75 },
  { skill: 'Listening', value: 82 },
  { skill: 'Reading', value: 88 },
  { skill: 'Writing', value: 70 },
  { skill: 'Grammar', value: 78 },
  { skill: 'Vocabulary', value: 85 },
];

export function ProgressMap() {
  const { language } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  const translations = {
    title: { kz: 'Прогресс картасы', ru: 'Карта прогресса' },
    subtitle: { kz: 'Жетістіктеріңіз бен статистика', ru: 'Ваши достижения и статистика' },
    totalScore: { kz: 'Жалпы ұпай', ru: 'Общий счет' },
    learnedWords: { kz: 'Үйренілген сөздер', ru: 'Выученные слова' },
    streak: { kz: 'Streak', ru: 'Серия' },
    days: { kz: 'күн', ru: 'дней' },
    achievements: { kz: 'Жетістіктер', ru: 'Достижения' },
    weeklyActivity: { kz: 'Апталық белсенділік', ru: 'Недельная активность' },
    skillsAssessment: { kz: 'Дағдылар бағалауы', ru: 'Оценка навыков' },
    monthlyGoals: { kz: 'Айлық мақсаттар', ru: 'Ежемесячные цели' },
    words: { kz: 'Сөздер', ru: 'Слова' },
    practice: { kz: 'Жаттығулар', ru: 'Упражнения' },
    dialogues: { kz: 'Диалогтар', ru: 'Диалоги' },
    skills: { kz: 'Дағдылар', ru: 'Навыки' },
    unlocked: { kz: 'Ашылды!', ru: 'Открыто!' },
    locked: { kz: 'Құлыпталған', ru: 'Заблокировано' },
  };

  const localizedWeeklyData = weeklyData.map(d => ({
    ...d,
    day: language === 'kz' ? d.dayKz : d.dayRu
  }));

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="mb-2 text-gray-900">{translations.title[language]}</h1>
        <p className="text-gray-600 mb-6">{translations.subtitle[language]}</p>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">{language === 'kz' ? 'Дұрыстық' : 'Точность'}</p>
                  <p className="text-2xl font-bold text-gray-900">85%</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Target className="size-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">{translations.learnedWords[language]}</p>
                  <p className="text-2xl font-bold text-gray-900">245</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-xl">
                  <BookOpen className="size-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">{language === 'kz' ? 'Уақыт' : 'Время'}</p>
                  <p className="text-2xl font-bold text-gray-900">12h 30m</p>
                </div>
                <div className="bg-green-100 p-3 rounded-xl">
                  <Calendar className="size-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">{translations.achievements[language]}</p>
                  <p className="text-2xl font-bold text-gray-900">3 / 6</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-xl">
                  <Award className="size-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-gray-900">{translations.weeklyActivity[language]}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={localizedWeeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar dataKey="words" fill="#8b5cf6" radius={[8, 8, 0, 0]} name={translations.words[language]} />
                  <Bar dataKey="practice" fill="#3b82f6" radius={[8, 8, 0, 0]} name={translations.practice[language]} />
                  <Bar dataKey="dialogues" fill="#10b981" radius={[8, 8, 0, 0]} name={translations.dialogues[language]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-gray-600">{translations.words[language]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600">{translations.practice[language]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">{translations.dialogues[language]}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Skills Radar Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-gray-900">{translations.skillsAssessment[language]}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={skillsData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="skill" stroke="#6b7280" />
                  <PolarRadiusAxis stroke="#6b7280" />
                  <Radar
                    name={translations.skills[language]}
                    dataKey="value"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Monthly Goals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mb-8"
      >
        <h2 className="mb-4 text-gray-900">{translations.monthlyGoals[language]}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {monthlyGoals.map((goal, index) => {
            const Icon = goal.icon;
            const progress = (goal.current / goal.target) * 100;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <Card className="border-0 shadow-lg bg-white/90 backdrop-blur">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-3 rounded-xl">
                        <Icon className="size-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 mb-1">{language === 'kz' ? goal.titleKz : goal.titleRu}</p>
                        <p className="text-sm text-gray-500">
                          {goal.current} / {goal.target}
                        </p>
                      </div>
                    </div>
                    <Progress value={progress} className="h-3" />
                    <p className="text-right text-sm text-gray-600 mt-2">
                      {Math.round(progress)}%
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <h2 className="mb-4 text-gray-900">{translations.achievements[language]}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 + index * 0.1 }}
              >
                <Card className={`border-0 shadow-lg overflow-hidden ${achievement.unlocked
                  ? 'bg-white/90 backdrop-blur'
                  : 'bg-gray-100 opacity-60'
                  }`}>
                  <div className={`h-2 bg-gradient-to-r ${achievement.color}`} />
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-4 rounded-2xl ${achievement.unlocked
                        ? `bg-gradient-to-br ${achievement.color} shadow-lg`
                        : 'bg-gray-200'
                        }`}>
                        <Icon className={`size-8 ${achievement.unlocked ? 'text-white' : 'text-gray-400'
                          }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-900 mb-1">{language === 'kz' ? achievement.titleKz : achievement.titleRu}</h3>
                        <p className="text-sm text-gray-600">{language === 'kz' ? achievement.descriptionKz : achievement.descriptionRu}</p>
                        {achievement.unlocked && (
                          <div className="mt-3 flex items-center gap-2 text-green-600">
                            <Award className="size-4" />
                            <span className="text-sm">{translations.unlocked[language]}</span>
                          </div>
                        )}
                        {!achievement.unlocked && (
                          <div className="mt-3 text-sm text-gray-400">
                            🔒 {translations.locked[language]}
                          </div>
                        )}
                      </div>
                    </div>
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
