import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, User, Bot, Mic, Volume2, RefreshCw, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { dialogues, Dialogue } from '../data/dialogues';
import { useLanguage } from '../contexts/LanguageContext';
import { getAudioService } from '../services/audioService';
import { generateDialogueAction } from '../app/actions/gemini';
import { getUserProfileService } from '../services/userProfileService';

export function DialogueGenerator() {
  const { language } = useLanguage();
  const [selectedDialogue, setSelectedDialogue] = useState<Dialogue | null>(null);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [userResponded, setUserResponded] = useState(false);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');
  const [customDialogues, setCustomDialogues] = useState<Dialogue[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const audioService = getAudioService();

  // Simulated Speech Recognition Hook (similar to VoicePractice)
  const useSpeechRecognition = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');

    const startListening = (onResult: (text: string) => void) => {
      setIsListening(true);
      setTranscript('');

      // Check if browser supports speech recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = true; // Enable interim results for real-time display
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          const currentTranscript = finalTranscript || interimTranscript;
          setTranscript(currentTranscript);

          if (finalTranscript) {
            onResult(finalTranscript);
            setIsListening(false);
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
          alert('Microphone error. Please check permissions.');
        };

        recognition.onend = () => {
          // Don't set isListening to false here immediately if we want to keep showing the last result, 
          // but usually onend means it stopped. 
          // We'll handle state in onResult or manual stop.
          if (isListening) setIsListening(false);
        };

        recognition.start();
      } else {
        // Fallback for browsers without support (Simulation)
        setTimeout(() => {
          const simulatedText = "Simulated speech input";
          setTranscript(simulatedText);
          onResult(simulatedText);
          setIsListening(false);
        }, 2000);
      }
    };

    return { isListening, transcript, startListening, setTranscript };
  };

  const { isListening, transcript, startListening, setTranscript } = useSpeechRecognition();

  // Combine static and custom dialogues
  const allDialogues = useMemo(() => [
    ...dialogues,
    ...customDialogues
  ], [customDialogues]);

  const handleGenerateDialogue = async () => {
    setIsGenerating(true);
    try {
      const profile = getUserProfileService().getProfile();
      const interests = profile?.interests || ['general'];
      const topic = interests[Math.floor(Math.random() * interests.length)];
      const level = profile?.level || 'A1';

      const generated = await generateDialogueAction(topic, level);

      if (generated && generated.scenario && generated.messages) {
        const newDialogue: Dialogue = {
          id: `gen_${Date.now()}`,
          level: level as any,
          scenario: generated.scenario,
          scenarioTranslation: generated.scenarioTranslation || { kz: '', ru: '' },
          messages: generated.messages
        };

        setCustomDialogues(prev => [newDialogue, ...prev]);
        alert(language === 'kz' ? 'Жаңа диалог қосылды!' : 'Новый диалог добавлен!');
      }
    } catch (error) {
      console.error('Dialogue generation failed:', error);
      alert('Failed to generate dialogue. Please try again later.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartDialogue = (dialogue: Dialogue) => {
    setSelectedDialogue(dialogue);
    setCurrentMessageIndex(0);
    setUserResponded(false);
    setFeedback('none');
    setTranscript('');
  };

  const handleNext = () => {
    if (selectedDialogue && currentMessageIndex < selectedDialogue.messages.length - 1) {
      setCurrentMessageIndex(prev => prev + 1);
      setUserResponded(false);
      setFeedback('none');
      setTranscript('');
    }
  };

  const handleRecord = () => {
    setFeedback('none');
    startListening((spokenText) => {
      const currentMessage = selectedDialogue?.messages[currentMessageIndex];
      if (!currentMessage) return;

      // Simple fuzzy matching (case insensitive, remove punctuation)
      const cleanSpoken = spokenText.toLowerCase().replace(/[.,!?]/g, '').trim();
      const cleanExpected = currentMessage.text.toLowerCase().replace(/[.,!?]/g, '').trim();

      // Calculate similarity (simplified)
      const isMatch = cleanSpoken === cleanExpected || cleanSpoken.includes(cleanExpected) || cleanExpected.includes(cleanSpoken);

      if (isMatch) {
        setFeedback('correct');
        setTimeout(() => {
          setUserResponded(true);
          setFeedback('none');
          setTranscript('');
        }, 2000); // Give them time to see "Correct"
      } else {
        setFeedback('incorrect');
        // Optional: Allow them to proceed anyway after a few tries or show the "Next" button manually
      }
    });
  };

  const handleReset = () => {
    setSelectedDialogue(null);
    setCurrentMessageIndex(0);
    setUserResponded(false);
    setFeedback('none');
    setTranscript('');
  };

  const playAudio = async (text: string) => {
    try {
      await audioService.speak(text);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  if (selectedDialogue) {
    const currentMessage = selectedDialogue.messages[currentMessageIndex];
    const isUserTurn = currentMessage.speaker === 'user';

    return (
      <div className="p-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="mb-2 text-gray-900">{selectedDialogue.scenario}</h1>
              <p className="text-gray-600">{selectedDialogue.scenarioTranslation[language]}</p>
            </div>
            <Button onClick={handleReset} variant="outline">
              <RefreshCw className="size-5 mr-2" />
              {language === 'kz' ? 'Басқа диалог' : 'Другой диалог'}
            </Button>
          </div>
        </motion.div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Badge variant="secondary">{selectedDialogue.level}</Badge>
              <p className="text-sm text-gray-600">
                {currentMessageIndex + 1} / {selectedDialogue.messages.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 mb-6">
          {selectedDialogue.messages.slice(0, currentMessageIndex + 1).map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: msg.speaker === 'user' ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${msg.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-md ${msg.speaker === 'user' ? 'order-2' : 'order-1'}`}>
                <Card className={`border-0 shadow-lg ${msg.speaker === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white'
                  }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${msg.speaker === 'user'
                        ? 'bg-white/20'
                        : 'bg-blue-100'
                        }`}>
                        {msg.speaker === 'user' ? (
                          <User className={`size-5 ${msg.speaker === 'user' ? 'text-white' : 'text-blue-600'}`} />
                        ) : (
                          <Bot className="size-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className={msg.speaker === 'user' ? 'text-white' : 'text-gray-900'}>
                            {msg.text}
                          </p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => playAudio(msg.text)}
                            className="p-1"
                          >
                            <Volume2 className={`size-4 ${msg.speaker === 'user' ? 'text-white' : 'text-blue-500'}`} />
                          </Button>
                        </div>
                        <p className={`text-sm ${msg.speaker === 'user' ? 'text-white/80' : 'text-gray-500'}`}>
                          {msg.translation[language]}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>

        {isUserTurn && !userResponded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className={`border-0 shadow-2xl transition-colors duration-300 ${feedback === 'correct' ? 'bg-green-50' :
              feedback === 'incorrect' ? 'bg-red-50' :
                'bg-gradient-to-br from-purple-50 to-blue-50'
              }`}>
              <CardContent className="p-8">
                <p className="text-center text-gray-600 mb-6">
                  {language === 'kz' ? 'Сіздің кезек! Келесі сөйлемді айтыңыз:' : 'Ваша очередь! Произнесите следующее предложение:'}
                </p>
                <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
                  <p className="text-gray-900 mb-2 font-medium text-lg text-center">{currentMessage.text}</p>
                  <p className="text-sm text-gray-500 text-center">{currentMessage.translation[language]}</p>
                </div>

                {/* Real-time Transcript Display */}
                {(isListening || transcript) && (
                  <div className="mb-6 p-4 bg-white/50 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1 text-center">
                      {language === 'kz' ? 'Сіз айттыңыз:' : 'Вы сказали:'}
                    </p>
                    <p className="text-lg text-gray-800 text-center font-medium">
                      {transcript || "..."}
                    </p>
                  </div>
                )}

                {feedback === 'incorrect' && (
                  <div className="text-center mb-4 text-red-500 font-medium animate-pulse">
                    {language === 'kz' ? 'Қайталап көріңіз!' : 'Попробуйте еще раз!'}
                  </div>
                )}
                {feedback === 'correct' && (
                  <div className="text-center mb-4 text-green-600 font-bold">
                    {language === 'kz' ? 'Тамаша!' : 'Отлично!'}
                  </div>
                )}

                <div className="flex flex-col items-center gap-4">
                  <motion.button
                    onClick={handleRecord}
                    disabled={isListening || feedback === 'correct'}
                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${isListening
                      ? 'bg-red-500 scale-110'
                      : feedback === 'correct' ? 'bg-green-500'
                        : 'bg-blue-600 hover:scale-105'
                      }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Mic className={`size-12 text-white ${isListening ? 'animate-pulse' : ''}`} />
                  </motion.button>
                  <p className="text-gray-600">
                    {isListening
                      ? (language === 'kz' ? 'Жазып алуда...' : 'Запись...')
                      : (language === 'kz' ? 'Батырманы басып, сөйлеңіз' : 'Нажмите кнопку и говорите')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {(!isUserTurn || userResponded) && currentMessageIndex < selectedDialogue.messages.length - 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <Button
              onClick={handleNext}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {language === 'kz' ? 'Жалғастыру' : 'Продолжить'}
            </Button>
          </motion.div>
        )}

        {currentMessageIndex === selectedDialogue.messages.length - 1 && userResponded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-8 text-center">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="size-10 text-green-600" />
                </div>
                <h2 className="text-green-900 mb-2">{language === 'kz' ? 'Керемет!' : 'Отлично!'}</h2>
                <p className="text-gray-600 mb-6">{language === 'kz' ? 'Диалогты аяқтадыңыз!' : 'Вы завершили диалог!'}</p>
                <Button onClick={handleReset} className="bg-blue-600 hover:bg-blue-700">
                  {language === 'kz' ? 'Басқа диалог таңдау' : 'Выбрать другой диалог'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="mb-2 text-gray-900">Mini Dialogues Generator</h1>
            <p className="text-gray-600">
              {language === 'kz' ? 'Интерактивті диалогтар генерациясы' : 'Генератор интерактивных диалогов'}
            </p>
          </div>
          <Button
            onClick={handleGenerateDialogue}
            disabled={isGenerating}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90"
          >
            {isGenerating ? (
              <RefreshCw className="size-5 mr-2 animate-spin" />
            ) : (
              <Sparkles className="size-5 mr-2" />
            )}
            {language === 'kz' ? 'Диалог жасау (AI)' : 'Создать диалог (AI)'}
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allDialogues.map((dialogue, index) => (
          <motion.div
            key={dialogue.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur hover:shadow-xl transition-all group cursor-pointer"
              onClick={() => handleStartDialogue(dialogue)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{dialogue.level}</Badge>
                  <MessageSquare className="size-6 text-purple-500 group-hover:scale-110 transition-transform" />
                </div>
                <CardTitle className="text-gray-900">{dialogue.scenario}</CardTitle>
                <p className="text-sm text-gray-500">{dialogue.scenarioTranslation[language]}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  {dialogue.messages.length} {language === 'kz' ? 'сөйлем' : 'предложений'}
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  {language === 'kz' ? 'Бастау' : 'Начать'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
