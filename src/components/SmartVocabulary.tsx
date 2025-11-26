
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Search, Filter, BookOpen, Star, CheckCircle, XCircle, Brain, Clock, Sparkles, Loader2, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { vocabularyDatabase, Word } from '../data/vocabulary';
import { getAudioService } from '../services/audioService';
import { SpacedRepetitionService, WordProgress } from '../services/spacedRepetition';
import { generateTopicVocabularyAction } from '../app/actions/gemini';
import { getUserProfileService } from '../services/userProfileService';
import { SentenceBuilder } from './games/SentenceBuilder';

export function SmartVocabulary() {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [savedWords, setSavedWords] = useState<Set<string>>(new Set());
  const [customWords, setCustomWords] = useState<Word[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [testScore, setTestScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'flashcards'>('list');
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [dueWords, setDueWords] = useState<Word[]>([]);

  // Load saved words and custom words
  useEffect(() => {
    const saved = localStorage.getItem('smartspeak_saved_words');
    if (saved) {
      setSavedWords(new Set(JSON.parse(saved)));
    }

    const custom = localStorage.getItem('smartspeak_custom_words');
    if (custom) {
      setCustomWords(JSON.parse(custom));
    }

    refreshDueWords();
  }, []);

  // Save words to local storage
  useEffect(() => {
    localStorage.setItem('smartspeak_saved_words', JSON.stringify(Array.from(savedWords)));
    localStorage.setItem('smartspeak_custom_words', JSON.stringify(customWords));
    refreshDueWords();
  }, [savedWords, customWords]);

  const allWords = useMemo(() => {
    return [...vocabularyDatabase, ...customWords];
  }, [customWords]);

  const refreshDueWords = () => {
    const due = SpacedRepetitionService.getDueWords(allWords);
    const savedDue = due.filter(w => savedWords.has(w.id));
    setDueWords(savedDue);
  };

  const handleGenerateWords = async () => {
    setIsGenerating(true);
    try {
      const profile = getUserProfileService().getProfile();
      // Ensure we have valid defaults for guests
      const interests = (profile?.interests && profile.interests.length > 0) ? profile.interests : ['general'];
      let topic = interests[Math.floor(Math.random() * interests.length)];

      // Sanitize topic to match Zod schema (alphanumeric, spaces, hyphens, underscores)
      topic = topic.replace(/[^a-zA-Z0-9\s\-_]/g, '');
      if (!topic) topic = 'general';

      const level = profile?.level || 'A1';



      const generated = await generateTopicVocabularyAction(topic, level);

      if (generated) {
        const newWords: Word[] = generated.map((item: any, index: number) => ({
          id: `gen_${Date.now()}_${index}`,
          word: item.word,
          translation: {
            ru: item.translation,
            kz: item.translation // Fallback for now
          },
          level: level,
          category: topic,
          transcription: '',
          example: item.context,
          exampleTranslation: {
            ru: item.translation,
            kz: item.translation
          }
        }));

        setCustomWords(prev => [...prev, ...newWords]);
        // Auto-save generated words
        setSavedWords(prev => {
          const newSet = new Set(prev);
          newWords.forEach(w => newSet.add(w.id));
          return newSet;
        });
        alert(language === 'kz' ? 'Жаңа сөздер қосылды!' : 'Новые слова добавлены!');
      } else {
        throw new Error('No data returned from AI');
      }
    } catch (error) {
      console.error('Generation failed:', error);
      alert(language === 'kz'
        ? 'Қате орын алды. Кейінірек қайталап көріңіз.'
        : 'Ошибка генерации. Возможно, сервер перегружен или неверный API ключ.');
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredWords = useMemo(() => {
    return allWords.filter(word => {
      const matchesSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.translation[language].toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = selectedLevel === 'all' || word.level === selectedLevel;
      const matchesCategory = selectedCategory === 'all' || word.category === selectedCategory;
      return matchesSearch && matchesLevel && matchesCategory;
    });
  }, [searchTerm, selectedLevel, selectedCategory, language, allWords]);

  const categories = useMemo(() => {
    const cats = new Set(allWords.map(w => w.category));
    return ['all', ...Array.from(cats)];
  }, [allWords]);

  const levels = ['all', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const toggleSaveWord = (wordId: string) => {
    setSavedWords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(wordId)) {
        newSet.delete(wordId);
      } else {
        newSet.add(wordId);
        SpacedRepetitionService.initializeWord(wordId);
      }
      return newSet;
    });
  };

  const [testItems, setTestItems] = useState<Array<{ type: 'translation' | 'sentence', word: Word }>>([]);

  const startTest = (isReview: boolean = false) => {
    const wordsToTest = isReview ? dueWords : allWords.filter(w => savedWords.has(w.id));

    if (wordsToTest.length === 0) {
      alert(language === 'kz'
        ? (isReview ? 'Қайталайтын сөздер жоқ!' : 'Алдымен сөздерді сақтаңыз!')
        : (isReview ? 'Нет слов для повторения!' : 'Сначала сохраните слова!')
      );
      return;
    }

    const items: Array<{ type: 'translation' | 'sentence', word: Word }> = [];
    const shuffled = [...wordsToTest].sort(() => Math.random() - 0.5);

    shuffled.forEach(word => {
      // 30% chance for sentence builder if example exists
      if (word.example && Math.random() < 0.3) {
        items.push({ type: 'sentence', word });
      } else {
        items.push({ type: 'translation', word });
      }
    });

    setTestItems(items);
    setCurrentTestIndex(0);
    setTestScore(0);
    setShowAnswer(false);
    setTestMode(true);
    setReviewMode(isReview);
  };

  const toggleCardFlip = (wordId: string) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(wordId)) {
        newSet.delete(wordId);
      } else {
        newSet.add(wordId);
      }
      return newSet;
    });
  };

  const playAudio = (text: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    getAudioService().speak(text);
  };

  const getDistractors = (currentWord: Word) => {
    const profile = getUserProfileService().getProfile();
    const userLevel = profile?.level || 'A1';

    let candidates = allWords.filter(w => w.id !== currentWord.id);

    // Adaptive difficulty for A2 and above
    if (userLevel !== 'A1') {
      const sameCategory = candidates.filter(w => w.category === currentWord.category);
      if (sameCategory.length >= 3) {
        candidates = sameCategory;
      } else {
        const sameLevelOrHigher = candidates.filter(w => w.level >= currentWord.level);
        if (sameLevelOrHigher.length >= 3) {
          candidates = sameLevelOrHigher;
        }
      }
    }

    return candidates
      .map(w => w.translation[language])
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  };

  const handleTestAnswer = (correct: boolean) => {
    setShowAnswer(true);
    if (correct) {
      setTestScore(prev => prev + 1);
      playAudio(testItems[currentTestIndex].word.word);
    }

    setTimeout(() => {
      if (currentTestIndex < testItems.length - 1) {
        setCurrentTestIndex(prev => prev + 1);
        setShowAnswer(false);
      } else {
        setTestMode(false);
        alert(language === 'kz'
          ? `Тест аяқталды! Нәтиже: ${testScore + (correct ? 1 : 0)}/${testItems.length}`
          : `Тест завершен! Результат: ${testScore + (correct ? 1 : 0)}/${testItems.length}`
        );

        if (reviewMode) {
          testItems.forEach(item => {
            SpacedRepetitionService.updateProgress(item.word.id, true);
          });
          refreshDueWords();
        }
      }
    }, 1500);
  };

  const handleSentenceComplete = (success: boolean) => {
    handleTestAnswer(success);
  };

  const renderWordCard = (word: Word) => {
    const isFlipped = flippedCards.has(word.id);

    if (viewMode === 'flashcards') {
      return (
        <div
          key={word.id}
          className="h-64 perspective-1000 cursor-pointer group"
          onClick={() => toggleCardFlip(word.id)}
        >
          <motion.div
            className="relative w-full h-full transition-all duration-500 preserve-3d"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
          >
            {/* Front */}
            <div className="absolute w-full h-full backface-hidden">
              <Card className="h-full border-2 border-transparent hover:border-purple-200 transition-all shadow-md hover:shadow-xl bg-white">
                <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center relative">
                  <div className="absolute top-4 right-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); toggleSaveWord(word.id); }}
                      className={savedWords.has(word.id) ? 'text-purple-600' : 'text-gray-400'}
                    >
                      <Star className={`size-5 ${savedWords.has(word.id) ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{word.word}</h3>
                  <p className="text-gray-500 mb-4">{word.transcription}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:bg-blue-50 rounded-full"
                    onClick={(e) => playAudio(word.word, e)}
                  >
                    <Volume2 className="size-6" />
                  </Button>
                  <p className="text-xs text-gray-400 mt-4 absolute bottom-4">
                    {language === 'kz' ? 'Аудармасын көру үшін басыңыз' : 'Нажмите, чтобы увидеть перевод'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Back */}
            <div className="absolute w-full h-full backface-hidden rotate-y-180">
              <Card className="h-full bg-gradient-to-br from-purple-50 to-white border-2 border-purple-100 shadow-md">
                <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center relative">
                  <div className="absolute top-4 right-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); toggleSaveWord(word.id); }}
                      className={savedWords.has(word.id) ? 'text-purple-600' : 'text-gray-400'}
                    >
                      <Star className={`size-5 ${savedWords.has(word.id) ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                  <h3 className="text-2xl font-bold text-purple-700 mb-2">{word.translation[language]}</h3>
                  <p className="text-gray-600 italic mb-4">"{word.exampleTranslation[language]}"</p>
                  <div className="mt-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    {word.category}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      );
    }

    return (
      <motion.div
        key={word.id}
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="group"
      >
        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                  {word.word}
                </h3>
                <p className="text-sm text-gray-500">{word.transcription}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSaveWord(word.id)}
                className={savedWords.has(word.id) ? 'text-purple-600' : 'text-gray-400'}
              >
                <Star className={`size-5 ${savedWords.has(word.id) ? 'fill-current' : ''}`} />
              </Button>
            </div>

            <div className="mb-3">
              <p className="text-gray-800 font-medium">{word.translation[language]}</p>
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className={`text-xs px-2 py-1 rounded-full ${word.level === 'A1' || word.level === 'A2' ? 'bg-green-100 text-green-700' :
                word.level === 'B1' || word.level === 'B2' ? 'bg-blue-100 text-blue-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                {word.level}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-blue-600"
                onClick={(e) => playAudio(word.word, e)}
              >
                <Volume2 className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (testMode && testItems.length > 0) {
    const currentItem = testItems[currentTestIndex];
    const currentWord = currentItem.word;
    const progress = ((currentTestIndex + 1) / testItems.length) * 100;

    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => setTestMode(false)}>
            <XCircle className="mr-2 size-5" />
            {language === 'kz' ? 'Аяқтау' : 'Завершить'}
          </Button>
          <div className="flex items-center gap-4">
            <span className="font-bold text-purple-600">
              {currentTestIndex + 1} / {testItems.length}
            </span>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentTestIndex}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {currentItem.type === 'sentence' ? (
              <SentenceBuilder
                sentence={currentWord.example || ''}
                translation={currentWord.exampleTranslation[language]}
                onComplete={handleSentenceComplete}
              />
            ) : (
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
                <CardContent className="p-8 text-center">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{currentWord.word}</h2>
                    {showAnswer && (
                      <p className="text-xl text-purple-600 font-medium">{currentWord.translation[language]}</p>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-4 text-blue-600 hover:bg-blue-50 rounded-full"
                      onClick={() => playAudio(currentWord.word)}
                    >
                      <Volume2 className="size-8" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {[currentWord.translation[language], ...getDistractors(currentWord)]
                      .sort(() => Math.random() - 0.5)
                      .map((option, idx) => (
                        <Button
                          key={idx}
                          variant={showAnswer
                            ? option === currentWord.translation[language] ? "default" : "outline"
                            : "outline"
                          }
                          className={`w-full py-6 text-lg justify-start px-6 ${showAnswer && option === currentWord.translation[language]
                            ? "bg-green-500 hover:bg-green-600 text-white border-green-500"
                            : ""
                            }`}
                          onClick={() => !showAnswer && handleTestAnswer(option === currentWord.translation[language])}
                          disabled={showAnswer}
                        >
                          {option}
                          {showAnswer && option === currentWord.translation[language] && (
                            <CheckCircle className="ml-auto size-5" />
                          )}
                        </Button>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'kz' ? 'Smart Сөздік' : 'Smart Словарь'}
          </h1>
          <p className="text-gray-600">
            {language === 'kz'
              ? 'Жаңа сөздерді үйреніңіз және қайталаңыз'
              : 'Изучайте новые слова и повторяйте пройденные'}
          </p>
        </div>
        <Button
          onClick={handleGenerateWords}
          disabled={isGenerating}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0 shadow-lg hover:shadow-xl transition-all"
        >
          {isGenerating ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
          {language === 'kz' ? 'AI Сөздер жасау' : 'Создать слова (AI)'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{language === 'kz' ? 'Барлық сөздер' : 'Все слова'}</p>
                <p className="text-2xl font-bold text-blue-600">{allWords.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <BookOpen className="size-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{language === 'kz' ? 'Сақталған' : 'Сохраненные'}</p>
                <p className="text-2xl font-bold text-purple-600">{savedWords.size}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <Star className="size-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{language === 'kz' ? 'Қайталауға' : 'На повторение'}</p>
                <p className="text-2xl font-bold text-orange-600">{dueWords.length}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-xl">
                <Clock className="size-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => startTest(false)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all hover:scale-[1.02]"
                disabled={savedWords.size === 0}
              >
                <Star className="size-4 mr-2" />
                {language === 'kz' ? 'Тест' : 'Тест'}
              </Button>
              <Button
                onClick={() => startTest(true)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white shadow-md transition-all hover:scale-[1.02]"
                disabled={dueWords.length === 0}
              >
                <Brain className="size-4 mr-2" />
                {language === 'kz' ? 'Қайталау' : 'Повторить'} ({dueWords.length})
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400" />
              <Input
                placeholder={language === 'kz' ? "Сөз іздеу..." : "Поиск слов..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex-1 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 scrollbar-hide">
              <div className="flex gap-2">
                <div className="flex items-center gap-2 pr-4 border-r border-gray-200 mr-2">
                  <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
                    {language === 'kz' ? 'Деңгей:' : 'Уровень:'}
                  </span>
                  {levels.map(level => (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(level)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedLevel === level
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      {level === 'all' ? (language === 'kz' ? 'Барлығы' : 'Все') : level}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
                    {language === 'kz' ? 'Категория:' : 'Категория:'}
                  </span>
                  {categories.map((cat: string) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === cat
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      {cat === 'all' ? (language === 'kz' ? 'Барлығы' : 'Все') : cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex bg-gray-100 p-1 rounded-lg shrink-0">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
              >
                <Filter className="size-5" />
              </button>
              <button
                onClick={() => setViewMode('flashcards')}
                className={`p-2 rounded-md transition-all ${viewMode === 'flashcards' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
              >
                <BookOpen className="size-5" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">{language === 'kz' ? 'Барлық сөздер' : 'Все слова'} ({filteredWords.length})</TabsTrigger>
          <TabsTrigger value="saved">{language === 'kz' ? 'Сақталған' : 'Сохраненные'} ({savedWords.size})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className={viewMode === 'list' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
            <AnimatePresence>
              {filteredWords.map(word => renderWordCard(word))}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="saved">
          <div className={viewMode === 'list' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
            <AnimatePresence>
              {filteredWords.filter(w => savedWords.has(w.id)).map(word => renderWordCard(word))}
            </AnimatePresence>
            {savedWords.size === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                {language === 'kz' ? 'Сақталған сөздер жоқ' : 'Нет сохраненных слов'}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
