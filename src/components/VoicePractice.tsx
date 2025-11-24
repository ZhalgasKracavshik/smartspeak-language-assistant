import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mic, Volume2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { getAudioService } from '../services/audioService';

const practiceSentences = [
  { id: 1, text: 'Hello, how are you today?', translation: 'Сәлем, бүгін қалыңыз қалай?', difficulty: 'easy' },
  { id: 2, text: 'I am learning English every day.', translation: 'Мен күн сайын ағылшын тілін үйреніп жатырмын.', difficulty: 'easy' },
  { id: 3, text: 'The weather is beautiful today.', translation: 'Бүгін ауа райы керемет.', difficulty: 'easy' },
  { id: 4, text: 'Could you please help me with this?', translation: 'Мұнда маған көмектесе аласыз ба?', difficulty: 'medium' },
  { id: 5, text: 'I would like to improve my pronunciation.', translation: 'Мен айтылымымды жақсартқым келеді.', difficulty: 'medium' },
  { id: 6, text: 'She has been working here for five years.', translation: 'Ол мұнда бес жыл бойы жұмыс істеп жатыр.', difficulty: 'hard' },
  { id: 7, text: 'If I had known earlier, I would have told you.', translation: 'Егер ертерек білсем, сізге айтқан болар едім.', difficulty: 'hard' },
];

export function VoicePractice() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [feedback, setFeedback] = useState<'good' | 'needsWork' | null>(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [recognizedText, setRecognizedText] = useState('');
  const [pronunciationScore, setPronunciationScore] = useState(0);
  const audioService = getAudioService();
  const recognitionRef = useRef<any>(null);

  const currentSentence = practiceSentences[currentIndex];

  const handleRecord = async () => {
    if (isRecording) {
      // Stop recording
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      return;
    }

    try {
      setIsRecording(true);
      setRecognizedText('');

      const result = await audioService.startListening();

      setIsRecording(false);
      setHasRecorded(true);
      setRecognizedText(result.transcript);

      // Calculate pronunciation score
      const scoreValue = audioService.calculatePronunciationScore(
        currentSentence.text,
        result.transcript
      );

      setPronunciationScore(scoreValue);
      setTotalAttempts(prev => prev + 1);

      // Good if score is above 70%
      const isGood = scoreValue >= 70;
      setFeedback(isGood ? 'good' : 'needsWork');

      if (isGood) {
        setScore(prev => prev + 1);
      }
    } catch (error) {
      console.error('Speech recognition error:', error);
      setIsRecording(false);
      alert('Микрофонға қол жеткізу мүмкін емес. Браузерде рұқсат берілгеніне көз жеткізіңіз.');
    }
  };

  const handleNext = () => {
    if (currentIndex < practiceSentences.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setFeedback(null);
      setHasRecorded(false);
      setRecognizedText('');
      setPronunciationScore(0);
    }
  };

  useEffect(() => {
    if (feedback === 'good') {
      const timer = setTimeout(() => {
        handleNext();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handlePlayAudio = async () => {
    try {
      await audioService.speakExample(currentSentence.text);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setFeedback(null);
    setHasRecorded(false);
    setScore(0);
    setTotalAttempts(0);
    setRecognizedText('');
    setPronunciationScore(0);
  };

  const progress = totalAttempts > 0 ? (score / totalAttempts) * 100 : 0;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="mb-2 text-gray-900">Voice Practice</h1>
        <p className="text-gray-600 mb-6">Айтылымыңызды жақсартыңыз</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Дұрыстық</p>
                <p className="text-blue-600">{totalAttempts > 0 ? `${Math.round(progress)}%` : '0%'}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <CheckCircle className="size-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Өткен сөйлемдер</p>
                <p className="text-purple-600">{currentIndex + 1} / {practiceSentences.length}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <Mic className="size-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ұпай</p>
                <p className="text-green-600">{score} / {totalAttempts}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <CheckCircle className="size-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50/30 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900">
                Сөйлем #{currentIndex + 1}
              </CardTitle>
              <span className={`px-3 py-1 rounded-full text-sm ${currentSentence.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                currentSentence.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                {currentSentence.difficulty === 'easy' ? 'Оңай' :
                  currentSentence.difficulty === 'medium' ? 'Орташа' : 'Қиын'}
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Button
                  onClick={handlePlayAudio}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  <Volume2 className="size-5 mr-2" />
                  Тыңдау
                </Button>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg mb-4">
                <p className="text-gray-900 mb-2">{currentSentence.text}</p>
                <p className="text-sm text-gray-500">{currentSentence.translation}</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6">
              <motion.button
                onClick={handleRecord}
                disabled={isRecording}
                className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-xl border-4 ${isRecording
                  ? 'bg-red-500 scale-110 border-red-200'
                  : 'bg-gray-400 hover:scale-105 border-gray-200 hover:bg-gray-500'
                  }`}
                whileTap={{ scale: 0.95 }}
                animate={isRecording ? {
                  boxShadow: [
                    '0 0 0 0 rgba(239, 68, 68, 0.7)',
                    '0 0 0 20px rgba(239, 68, 68, 0)',
                    '0 0 0 0 rgba(239, 68, 68, 0)'
                  ]
                } : {}}
                transition={isRecording ? {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                } : {}}
              >
                <Mic className={`size-10 text-white ${isRecording ? 'animate-pulse' : ''}`} />
                {isRecording && (
                  <>
                    <div className="absolute inset-0 rounded-full border-4 border-white opacity-50 animate-ping" />
                    <div className="absolute inset-0 rounded-full border-2 border-white opacity-30" style={{
                      animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite'
                    }} />
                  </>
                )}
              </motion.button>

              <div className="text-center">
                <p className="text-gray-900 font-medium mb-1">
                  {isRecording ? '🎤 Слушаю...' : 'Нажмите кнопку и говорите'}
                </p>
                {isRecording && (
                  <p className="text-sm text-gray-500 animate-pulse">
                    Говорите четко и громко
                  </p>
                )}
              </div>

              <div className="w-full min-h-[100px] flex flex-col items-center justify-center">
                {isRecording ? (
                  <div className="text-center animate-pulse">
                    <p className="text-lg text-blue-600 font-medium">Тыңдау...</p>
                    <p className="text-sm text-gray-500">Listening...</p>
                  </div>
                ) : recognizedText ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full bg-blue-50 p-4 rounded-xl border-2 border-blue-200 text-center"
                  >
                    <p className="text-xs text-gray-500 mb-1">Сіз айттыңыз / You said:</p>
                    <p className="text-xl text-blue-900 font-medium mb-2">"{recognizedText}"</p>
                    {pronunciationScore > 0 && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-blue-100">
                        <span className="text-sm text-gray-600">Accuracy:</span>
                        <span className={`font-bold ${pronunciationScore >= 70 ? 'text-green-600' : 'text-orange-600'}`}>
                          {pronunciationScore}%
                        </span>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <p className="text-gray-400 text-sm">Press the microphone to start speaking</p>
                )}
              </div>

              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`w-full p-6 rounded-2xl ${feedback === 'good'
                    ? 'bg-green-50 border-2 border-green-200'
                    : 'bg-orange-50 border-2 border-orange-200'
                    }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {feedback === 'good' ? (
                      <>
                        <CheckCircle className="size-6 text-green-600" />
                        <p className="text-green-900">Керемет! Айтылым дұрыс!</p>
                      </>
                    ) : (
                      <>
                        <XCircle className="size-6 text-orange-600" />
                        <p className="text-orange-900">Жақсы, бірақ жақсартуға болады</p>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {feedback === 'good'
                      ? 'Сіздің айтылымыңыз өте жақсы. Жалғастырыңыз!'
                      : 'Тағы бір рет тыңдап, қайталап көріңіз.'}
                  </p>
                </motion.div>
              )}

              <div className="flex gap-4 w-full">
                {hasRecorded && feedback === 'needsWork' && (
                  <Button
                    onClick={handleRecord}
                    variant="outline"
                    className="flex-1"
                  >
                    <RefreshCw className="size-5 mr-2" />
                    Қайталау
                  </Button>
                )}
                {hasRecorded && (
                  <Button
                    onClick={handleNext}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={currentIndex === practiceSentences.length - 1}
                  >
                    Келесі сөйлем
                  </Button>
                )}
              </div>

              {currentIndex === practiceSentences.length - 1 && hasRecorded && (
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCw className="size-5 mr-2" />
                  Қайтадан бастау
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="mt-6">
        <p className="text-sm text-gray-600 mb-2">Прогресс</p>
        <Progress value={(currentIndex / practiceSentences.length) * 100} className="h-3" />
      </div>
    </div>
  );
}
