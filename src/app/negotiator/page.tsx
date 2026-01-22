'use client';

import React, { useState, useRef, useEffect } from 'react';
import '@/styles/negotiator.css';

interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    price?: number;
}

export default function NegotiatorPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hello, my friend! Welcome to my humble shop in the Grand Bazaar. I see you are eyeing this magnificent antique carpet. It is a rare piece, 19th century, hand-woven silk. For you, a special price: $500. It's a steal!",
            price: 500
        }
    ]);
    const [input, setInput] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [loading, setLoading] = useState(false);
    const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
    const [micStatus, setMicStatus] = useState<'idle' | 'listening' | 'error'>('idle');
    const [autoSpeak, setAutoSpeak] = useState(true); // TTS toggle
    const [isSpeaking, setIsSpeaking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading || gameState !== 'playing') return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('/api/negotiate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    history: [...messages, userMsg],
                    targetPrice: 250 // The goal is to get it under $250
                }),
            });

            const data = await response.json();

            const cleanReply = data.reply.replace(/\*\*/g, ''); // Remove bold markdown
            const assistantMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: cleanReply,
                price: data.currentPrice
            };

            setMessages(prev => [...prev, assistantMsg]);

            // Auto-speak merchant's response
            if (autoSpeak && cleanReply) {
                speakText(cleanReply);
            }

            if (data.dealReached) {
                setGameState('won');
            } else if (data.dealBroken) {
                setGameState('lost');
            }

        } catch (error) {
            console.error('Negotiation error:', error);
        } finally {
            setLoading(false);
        }
    };

    // ... (keep speech recognition existing code) ...
    // Note: I need to use `replace_file_content` carefully. 
    // I can't see the speech recognition code inside my replacement content if I strictly replace handleSend and the return.
    // I will target the `handleSend` function first, then the Return statement in a separate call or large block?
    // The previous view_file showed lines 37-82 for handleSend.
    // And 151-245 for Return.
    // I will do two edits or one large edit.
    // Let's do the handleSend edit first.


    // Speech recognition with improved error handling
    const speakText = (text: string) => {
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();
            setIsSpeaking(true);

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.9; // Slightly slower for clarity
            utterance.pitch = 1.0;

            utterance.onend = () => {
                setIsSpeaking(false);
            };

            utterance.onerror = () => {
                setIsSpeaking(false);
            };

            window.speechSynthesis.speak(utterance);
        }
    };

    const toggleRecording = () => {
        // Check for Speech Recognition API support
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

        if (!SpeechRecognition) {
            alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
            return;
        }

        if (isRecording) {
            setIsRecording(false);
            return;
        }

        try {
            setIsRecording(true);
            setMicStatus('listening');
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onstart = () => {
                console.log('Speech recognition started');
                setMicStatus('listening');
            };

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsRecording(false);
                setMicStatus('idle');
            };

            recognition.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setIsRecording(false);
                setMicStatus('error');

                let errorMessage = `Error: ${event.error}`;
                if (event.error === 'no-speech') {
                    errorMessage = 'No speech detected. Please speak louder.';
                } else if (event.error === 'not-allowed') {
                    errorMessage = 'Microphone access denied. Check browser settings.';
                } else if (event.error === 'network') {
                    errorMessage = 'Network error. Check internet connection.';
                }

                alert(errorMessage);
            };

            recognition.onend = () => {
                setIsRecording(false);
                if (micStatus !== 'error') setMicStatus('idle');
            };

            recognition.start();
        } catch (error) {
            console.error('Failed to start speech recognition:', error);
            setIsRecording(false);
            setMicStatus('error');
            alert('Failed to start microphone. Please check permissions.');
        }
    };

    return (
        <div className="negotiator-page">
            <div className="negotiator-container">
                <div className="negotiator-header">
                    <h1>👳‍♂️ The Negotiator</h1>
                    <p>Scenario: Grand Bazaar Carpet Seller</p>
                    <div className="goal-badge">
                        Target: Buy for under $250
                    </div>
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
                        <label style={{ fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="checkbox"
                                checked={autoSpeak}
                                onChange={(e) => setAutoSpeak(e.target.checked)}
                                style={{ cursor: 'pointer' }}
                            />
                            🔊 Auto-Speak (Merchant talks)
                        </label>
                        {isSpeaking && <span style={{ fontSize: '0.875rem', color: '#10b981' }}>🗣️ Speaking...</span>}
                    </div>
                </div>



                <div className="chat-window">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`message ${msg.role}`}>
                            <div className="message-avatar">
                                {msg.role === 'assistant' ? '👳‍♂️' : '👤'}
                            </div>
                            <div className="message-content">
                                <p>{msg.content}</p>
                                {msg.price && (
                                    <div className="price-tag">Current Offer: ${msg.price}</div>
                                )}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="message assistant">
                            <div className="message-avatar">👳‍♂️</div>
                            <div className="message-content typing">Thinking...</div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="input-area">
                    <button
                        className={`btn-mic ${isRecording ? 'recording' : ''}`}
                        onClick={toggleRecording}
                        title={micStatus === 'error' ? 'Microphone Error' : 'Click to Speak'}
                        disabled={gameState !== 'playing'}
                    >
                        {isRecording ? '🛑' : '🎤'}
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={gameState === 'playing' ? "Type or speak your offer..." : "Game Over"}
                        disabled={loading || gameState !== 'playing'}
                    />
                    <button
                        className="btn-send"
                        onClick={handleSend}
                        disabled={loading || !input.trim() || gameState !== 'playing'}
                    >
                        Send
                    </button>
                </div>

                {gameState !== 'playing' && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center transform scale-100 transition-all border border-white/10 relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-full h-2 ${gameState === 'won' ? 'bg-green-500' : 'bg-red-500'}`} />

                            <div className="mb-6 text-6xl">
                                {gameState === 'won' ? '🎉' : '🚪'}
                            </div>

                            <h2 className={`text-3xl font-bold mb-4 ${gameState === 'won' ? 'text-green-600' : 'text-red-500'}`}>
                                {gameState === 'won' ? 'DEAL ACCEPTED!' : 'GET OUT!'}
                            </h2>

                            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed">
                                {gameState === 'won'
                                    ? "You are a master negotiator! You saved a lot of money and the merchant respects you."
                                    : "The merchant got offended by your offer and kicked you out of the shop!"}
                            </p>

                            <button
                                onClick={() => window.location.reload()}
                                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transform transition-transform hover:scale-105 active:scale-95 ${gameState === 'won' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                                    }`}
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
