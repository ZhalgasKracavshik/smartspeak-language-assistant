// Audio service using Web Speech API
export class AudioService {
    private synth: SpeechSynthesis;
    private voices: SpeechSynthesisVoice[] = [];
    private currentUtterance: SpeechSynthesisUtterance | null = null;

    constructor() {
        this.synth = window.speechSynthesis;
        this.loadVoices();

        // Load voices when they become available
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => this.loadVoices();
        }
    }

    private loadVoices(): void {
        this.voices = this.synth.getVoices();
    }

    /**
     * Speak text using Text-to-Speech
     */
    speak(text: string, lang: string = 'en-US', rate: number = 0.9, pitch: number = 1): Promise<void> {
        return new Promise((resolve, reject) => {
            this.stop();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.rate = rate;
            utterance.pitch = pitch;

            const voice = this.voices.find(v => v.lang.startsWith(lang.split('-')[0]));
            if (voice) {
                utterance.voice = voice;
            }

            utterance.onend = () => {
                this.currentUtterance = null;
                resolve();
            };

            utterance.onerror = (event) => {
                this.currentUtterance = null;
                reject(event.error);
            };

            this.currentUtterance = utterance;
            this.synth.speak(utterance);
        });
    }

    stop(): void {
        if (this.synth.speaking) {
            this.synth.cancel();
        }
        this.currentUtterance = null;
    }

    isSpeaking(): boolean {
        return this.synth.speaking;
    }

    getVoices(): SpeechSynthesisVoice[] {
        return this.voices;
    }

    async speakWord(word: string): Promise<void> {
        try {
            await this.speak(word, 'en-US', 0.8);
        } catch (error) {
            console.error('Error speaking word:', error);
        }
    }

    async speakExample(example: string): Promise<void> {
        try {
            await this.speak(example, 'en-US', 0.9);
        } catch (error) {
            console.error('Error speaking example:', error);
        }
    }

    /**
     * Start listening - automatically stops when user finishes speaking
     */
    async startListening(): Promise<{ transcript: string; confidence: number }> {
        return new Promise((resolve, reject) => {
            // Check for browser support including iOS/Safari
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

            if (!SpeechRecognition) {
                reject(new Error('Ваш браузер не поддерживает распознавание речи. Попробуйте Chrome или Safari.'));
                return;
            }

            const recognition = new SpeechRecognition();
            recognition.continuous = false; // Auto-stop when speech ends
            recognition.interimResults = true; // Show interim results
            recognition.lang = 'en-US';
            recognition.maxAlternatives = 1;

            let finalTranscript = '';
            let hasResolved = false;

            recognition.onresult = (event: any) => {
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    }
                }
            };

            recognition.onend = () => {
                if (!hasResolved) {
                    hasResolved = true;
                    if (finalTranscript) {
                        resolve({
                            transcript: finalTranscript,
                            confidence: 0.9
                        });
                    } else {
                        // Don't treat empty result as error immediately, user might have just stopped speaking
                        reject(new Error('Речь не распознана. Попробуйте еще раз.'));
                    }
                }
            };

            recognition.onerror = (event: any) => {
                if (!hasResolved) {
                    hasResolved = true;
                    console.error('Speech recognition error:', event.error);

                    if (event.error === 'no-speech') {
                        reject(new Error('Речь не обнаружена. Говорите громче.'));
                    } else if (event.error === 'audio-capture') {
                        reject(new Error('Микрофон не найден. Проверьте подключение.'));
                    } else if (event.error === 'not-allowed') {
                        reject(new Error('Доступ к микрофону запрещен. Пожалуйста, разрешите доступ в настройках браузера.'));
                    } else if (event.error === 'service-not-allowed') {
                        reject(new Error('Сервис распознавания речи недоступен.'));
                    } else {
                        reject(new Error(`Ошибка распознавания: ${event.error}`));
                    }
                }
            };

            try {
                recognition.start();
            } catch (error) {
                console.error('Failed to start recognition:', error);
                reject(new Error('Не удалось запустить микрофон. Обновите страницу.'));
            }
        });
    }

    /**
     * Calculate pronunciation similarity score (0-100)
     */
    calculatePronunciationScore(expected: string, actual: string): number {
        const exp = expected.toLowerCase().trim();
        const act = actual.toLowerCase().trim();

        if (exp === act) return 100;

        // Levenshtein distance
        const matrix: number[][] = [];

        for (let i = 0; i <= act.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= exp.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= act.length; i++) {
            for (let j = 1; j <= exp.length; j++) {
                if (act[i - 1] === exp[j - 1]) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }

        const distance = matrix[act.length][exp.length];
        const maxLength = Math.max(exp.length, act.length);
        const similarity = ((maxLength - distance) / maxLength) * 100;

        return Math.round(similarity);
    }
}

// Singleton instance
let audioServiceInstance: AudioService | null = null;

export function getAudioService(): AudioService {
    if (!audioServiceInstance) {
        audioServiceInstance = new AudioService();
    }
    return audioServiceInstance;
}
