import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookMarked, Clock, Zap, CheckCircle, ArrowRight, Play, RefreshCw, Trophy, Puzzle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { tenses, conditionals, phrasalVerbs, irregularVerbs } from '../data/grammar';
import { useLanguage } from '../contexts/LanguageContext';
import { SentenceBuilder } from './games/SentenceBuilder';
import { aiService } from '../services/aiService';
import { Loader2, Sparkles } from 'lucide-react';
import { Textarea } from './ui/textarea';

export function GrammarCoach() {
  const { language } = useLanguage();
  const [selectedTab, setSelectedTab] = useState('tenses');
  const [testMode, setTestMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // AI Coach State
  const [aiInput, setAiInput] = useState('');
  const [aiResult, setAiResult] = useState<{ text: string; error?: string } | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAiCheck = async () => {
    if (!aiInput.trim()) return;
    setIsAiLoading(true);
    setAiResult(null);
    try {
      const result = await aiService.checkGrammar(aiInput);
      setAiResult(result);
    } catch (error) {
      setAiResult({ text: '', error: 'Failed to connect to AI.' });
    } finally {
      setIsAiLoading(false);
    }
  };

  const translations = {
    title: { kz: 'Грамматика жаттықтырушысы', ru: 'Грамматический тренер' },
    subtitle: { kz: 'Шақтар, шартты сөйлемдер, фразалық етістіктер', ru: 'Времена, условные предложения, фразовые глаголы' },
    tenses: { kz: 'Шақтар', ru: 'Времена' },
    conditionals: { kz: 'Шартты сөйлемдер', ru: 'Условные предложения' },
    phrasal: { kz: 'Фразалық етістіктер', ru: 'Фразовые глаголы' },
    irregular: { kz: 'Бұрыс етістіктер', ru: 'Неправильные глаголы' },
    builder: { kz: 'Сөйлем құрау', ru: 'Конструктор' },
    structure: { kz: 'Құрылымы:', ru: 'Структура:' },
    usage: { kz: 'Қолданылуы:', ru: 'Использование:' },
    examples: { kz: 'Мысалдар:', ru: 'Примеры:' },
    startTest: { kz: 'Тестті бастау', ru: 'Начать тест' },
    next: { kz: 'Келесі', ru: 'Далее' },
    finish: { kz: 'Аяқтау', ru: 'Завершить' },
    score: { kz: 'Ұпай:', ru: 'Счет:' },
    result: { kz: 'Нәтиже:', ru: 'Результат:' },
    restart: { kz: 'Қайта бастау', ru: 'Начать заново' },
    translate: { kz: 'Аударыңыз:', ru: 'Переведите:' },
    correct: { kz: 'Дұрыс!', ru: 'Правильно!' },
    incorrect: { kz: 'Қате!', ru: 'Неправильно!' },
    baseForm: { kz: 'Негізгі форма', ru: 'Базовая форма' },
    pastSimple: { kz: 'Өткен шақ', ru: 'Прошедшее время' },
    pastParticiple: { kz: 'Есімше', ru: 'Причастие' },
    translation: { kz: 'Аудармасы', ru: 'Перевод' },
    example: { kz: 'Мысал', ru: 'Пример' },
  };

  const generateQuestions = (type: string) => {
    let newQuestions = [];
    if (type === 'tenses') {
      newQuestions = tenses.map(tense => {
        const randomExample = tense.examples[Math.floor(Math.random() * tense.examples.length)];
        const otherTenses = tenses.filter(t => t.id !== tense.id);
        const wrongOptions = otherTenses
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(t => t.examples[0].en);

        return {
          question: `${translations.translate[language]} "${randomExample[language]}"`,
          correctAnswer: randomExample.en,
          options: [randomExample.en, ...wrongOptions].sort(() => Math.random() - 0.5)
        };
      }).sort(() => Math.random() - 0.5).slice(0, 10);
    } else if (type === 'conditionals') {
      newQuestions = conditionals.map(cond => {
        const randomExample = cond.examples[Math.floor(Math.random() * cond.examples.length)];
        const otherConds = conditionals.filter(c => c.id !== cond.id);
        const wrongOptions = otherConds
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(c => c.examples[0].en);

        return {
          question: `${translations.translate[language]} "${randomExample[language]}"`,
          correctAnswer: randomExample.en,
          options: [randomExample.en, ...wrongOptions].sort(() => Math.random() - 0.5)
        };
      }).sort(() => Math.random() - 0.5);
    } else if (type === 'phrasal') {
      newQuestions = phrasalVerbs
        .sort(() => Math.random() - 0.5)
        .slice(0, 10)
        .map(pv => {
          const otherPvs = phrasalVerbs.filter(p => p.id !== pv.id);
          const wrongOptions = otherPvs
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(p => language === 'kz' ? p.meaningKz : p.meaningRu);

          return {
            question: `${translations.translate[language]} "${pv.verb}"`,
            correctAnswer: language === 'kz' ? pv.meaningKz : pv.meaningRu,
            options: [language === 'kz' ? pv.meaningKz : pv.meaningRu, ...wrongOptions].sort(() => Math.random() - 0.5)
          };
        });
    } else if (type === 'irregular') {
      newQuestions = irregularVerbs
        .sort(() => Math.random() - 0.5)
        .slice(0, 10)
        .map(iv => {
          const otherIvs = irregularVerbs.filter(v => v.id !== iv.id);
          const wrongOptions = otherIvs
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(v => v.pastSimple);

          return {
            question: `Past Simple form of "${iv.baseForm}"`,
            correctAnswer: iv.pastSimple,
            options: [iv.pastSimple, ...wrongOptions].sort(() => Math.random() - 0.5)
          };
        });
    }
    setQuestions(newQuestions);
    setTestMode(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowAnswer(false);
    setSelectedAnswer(null);
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);
    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
    } else {
      // End of test
      // You could add a completion screen here, for now we just reset or show score
    }
  };

  const restartTest = () => {
    setTestMode(false);
    setQuestions([]);
    setScore(0);
    setCurrentQuestionIndex(0);
  };

  if (testMode && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    if (showAnswer && isLastQuestion && selectedAnswer) {
      return (
        <div className="p-8 max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <Trophy className="size-20 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{translations.result[language]}</h2>
            <p className="text-6xl font-bold text-blue-600 mb-6">{score} / {questions.length}</p>
            <Button onClick={restartTest} size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
              {translations.restart[language]}
            </Button>
          </motion.div>
        </div>
      )
    }

    return (
      <div className="p-8 max-w-2xl mx-auto">
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader>
            <div className="flex justify-between items-center">
              <Badge variant="outline">Question {currentQuestionIndex + 1}/{questions.length}</Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">{translations.score[language]} {score}</Badge>
            </div>
            <CardTitle className="text-xl text-center mt-4">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQuestion.options.map((option: string, idx: number) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => !showAnswer && handleAnswer(option)}
                disabled={showAnswer}
                className={`w-full p-4 rounded-xl text-left transition-all border-2 ${showAnswer
                  ? option === currentQuestion.correctAnswer
                    ? 'bg-green-100 border-green-500 text-green-900'
                    : option === selectedAnswer
                      ? 'bg-red-100 border-red-500 text-red-900'
                      : 'bg-gray-50 border-gray-200 opacity-50'
                  : 'bg-white border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                  }`}
              >
                {option}
              </motion.button>
            ))}

            {showAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-4"
              >
                <Button onClick={isLastQuestion ? () => { } : nextQuestion} className="w-full" size="lg">
                  {isLastQuestion ? translations.finish[language] : translations.next[language]}
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
        <div className="mt-4 text-center">
          <Button variant="ghost" onClick={restartTest} className="text-gray-500 hover:text-red-500">
            Exit Test
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="mb-2 text-gray-900">{translations.title[language]}</h1>
        <p className="text-gray-600 mb-6">{translations.subtitle[language]}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur cursor-pointer hover:scale-105 transition-transform" onClick={() => setSelectedTab('tenses')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{translations.tenses[language]}</p>
                <p className="text-blue-600">{tenses.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <Clock className="size-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur cursor-pointer hover:scale-105 transition-transform" onClick={() => setSelectedTab('conditionals')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{translations.conditionals[language]}</p>
                <p className="text-purple-600">{conditionals.length}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <Zap className="size-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur cursor-pointer hover:scale-105 transition-transform" onClick={() => setSelectedTab('phrasal')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{translations.phrasal[language]}</p>
                <p className="text-green-600">{phrasalVerbs.length}+</p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <ArrowRight className="size-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur cursor-pointer hover:scale-105 transition-transform" onClick={() => setSelectedTab('irregular')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{translations.irregular[language]}</p>
                <p className="text-orange-600">{irregularVerbs.length}+</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-xl">
                <CheckCircle className="size-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur cursor-pointer hover:scale-105 transition-transform" onClick={() => setSelectedTab('builder')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{translations.builder[language]}</p>
                <p className="text-pink-600">Game</p>
              </div>
              <div className="bg-pink-100 p-3 rounded-xl">
                <Puzzle className="size-6 text-pink-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur cursor-pointer hover:scale-105 transition-transform" onClick={() => setSelectedTab('ai')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">AI Coach</p>
                <p className="text-purple-600">Smart</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <Sparkles className="size-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList className="grid w-full max-w-4xl grid-cols-6">
            <TabsTrigger value="tenses">{translations.tenses[language]}</TabsTrigger>
            <TabsTrigger value="conditionals">{translations.conditionals[language]}</TabsTrigger>
            <TabsTrigger value="phrasal">{translations.phrasal[language]}</TabsTrigger>
            <TabsTrigger value="irregular">{translations.irregular[language]}</TabsTrigger>
            <TabsTrigger value="builder">{translations.builder[language]}</TabsTrigger>
            <TabsTrigger value="ai" className="text-purple-600">
              <Sparkles className="size-4 mr-2" />
              AI Coach
            </TabsTrigger>
          </TabsList>
          {selectedTab !== 'builder' && selectedTab !== 'ai' && (
            <Button onClick={() => generateQuestions(selectedTab)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Play className="size-4 mr-2" />
              {translations.startTest[language]}
            </Button>
          )}
        </div>

        <TabsContent value="ai">
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="size-6 text-purple-600" />
                AI Grammar Coach
              </CardTitle>
              <p className="text-gray-500">
                {language === 'kz'
                  ? 'Сөйлем жазыңыз, AI қателеріңізді түзетеді.'
                  : 'Напишите предложение, и ИИ исправит ваши ошибки.'}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  placeholder="Type your sentence here..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  className="min-h-[100px] text-lg"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleAiCheck}
                    disabled={isAiLoading || !aiInput.trim()}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isAiLoading ? (
                      <>
                        <Loader2 className="size-4 mr-2 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-4 mr-2" />
                        Check Grammar
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {aiResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl border ${aiResult.error ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200'}`}
                >
                  {aiResult.error ? (
                    <p>{aiResult.error}</p>
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      <h4 className="text-green-800 font-semibold mb-2">Feedback:</h4>
                      <p className="whitespace-pre-wrap text-gray-800">{aiResult.text}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tenses">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tenses.map((tense, index) => (
              <motion.div
                key={tense.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-0 shadow-lg bg-white/90 backdrop-blur hover:shadow-xl transition-shadow h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-gray-900 mb-1">{tense.name}</CardTitle>
                        <p className="text-sm text-gray-500">{language === 'kz' ? tense.nameKz : tense.nameRu}</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">Time</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">{translations.structure[language]}</p>
                        <p className="text-blue-900 font-medium">{tense.structure}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">{translations.usage[language]}</p>
                        <p className="text-gray-700">{language === 'kz' ? tense.usage : tense.usageRu}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">{translations.examples[language]}</p>
                        <div className="space-y-2">
                          {tense.examples.map((ex: { en: string; kz: string; ru: string }, idx: number) => (
                            <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-gray-900 mb-1">{ex.en}</p>
                              <p className="text-sm text-gray-500">{language === 'kz' ? ex.kz : ex.ru}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tense.keywords.map((keyword, idx) => (
                          <Badge key={idx} variant="secondary">{keyword}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="conditionals">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {conditionals.map((cond, index) => (
              <motion.div
                key={cond.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-lg bg-white/90 backdrop-blur hover:shadow-xl transition-shadow h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-gray-900 mb-1">{cond.type}</CardTitle>
                        <p className="text-sm text-gray-500">{language === 'kz' ? cond.typeKz : cond.typeRu}</p>
                      </div>
                      <Badge className="bg-purple-100 text-purple-700">If</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-purple-50 p-4 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">{translations.structure[language]}</p>
                        <p className="text-purple-900 font-medium">{cond.structure}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">{translations.usage[language]}</p>
                        <p className="text-gray-700">{language === 'kz' ? cond.usage : cond.usageRu}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">{translations.examples[language]}</p>
                        <div className="space-y-2">
                          {cond.examples.map((ex: { en: string; kz: string; ru: string }, idx: number) => (
                            <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-gray-900 mb-1">{ex.en}</p>
                              <p className="text-sm text-gray-500">{language === 'kz' ? ex.kz : ex.ru}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="phrasal">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {phrasalVerbs.map((pv, index) => (
              <motion.div
                key={pv.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card className="border-0 shadow-lg bg-white/90 backdrop-blur hover:shadow-xl transition-shadow h-full">
                  <CardHeader>
                    <CardTitle className="text-gray-900">{pv.verb}</CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge className="bg-green-100 text-green-700">{pv.meaning}</Badge>
                      {pv.separable && <Badge variant="outline">Separable</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-600 mb-3">{language === 'kz' ? pv.meaningKz : pv.meaningRu}</p>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-900 mb-1">{pv.examples[0].en}</p>
                      <p className="text-xs text-gray-500">{language === 'kz' ? pv.examples[0].kz : pv.examples[0].ru}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="irregular">
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur">
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left p-3 text-gray-900">{translations.baseForm[language]}</th>
                      <th className="text-left p-3 text-gray-900">{translations.pastSimple[language]}</th>
                      <th className="text-left p-3 text-gray-900">{translations.pastParticiple[language]}</th>
                      <th className="text-left p-3 text-gray-900">{translations.translation[language]}</th>
                      <th className="text-left p-3 text-gray-900">{translations.example[language]}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {irregularVerbs.map((verb: { id: string; baseForm: string; pastSimple: string; pastParticiple: string; translation: string; translationRu: string; example: { en: string; kz: string; ru: string } }, index: number) => (
                      <motion.tr
                        key={verb.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                      >
                        <td className="p-3 text-blue-600 font-medium">{verb.baseForm}</td>
                        <td className="p-3 text-gray-700">{verb.pastSimple}</td>
                        <td className="p-3 text-gray-700">{verb.pastParticiple}</td>
                        <td className="p-3 text-purple-600">{language === 'kz' ? verb.translation : verb.translationRu}</td>
                        <td className="p-3">
                          <div className="max-w-xs">
                            <p className="text-sm text-gray-900">{verb.example.en}</p>
                            <p className="text-xs text-gray-500">{language === 'kz' ? verb.example.kz : verb.example.ru}</p>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="builder">
          <SentenceBuilder />
        </TabsContent>
      </Tabs>
    </div >
  );
}
