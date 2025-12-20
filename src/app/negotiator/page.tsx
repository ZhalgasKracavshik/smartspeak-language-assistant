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

            const assistantMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.reply,
                price: data.currentPrice
            };

            setMessages(prev => [...prev, assistantMsg]);

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

    // Speech recognition with improved error handling
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
                </div>

                {/* Hint Panel */}
                <div className="hint-panel" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    margin: '12px 0',
                    fontSize: '13px',
                    lineHeight: '1.5'
                }}>
                    <strong>💡 Negotiation Tips:</strong>
                    <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
                        <li>Start low: "How about $150?"</li>
                        <li>Complain: "That's too expensive!"</li>
                        <li>Walk away: "I'll look elsewhere..."</li>
                        <li>Flatter: "You seem like a fair person"</li>
                    </ul>
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

                {gameState === 'playing' ? (
                    <div className="input-area">
                        <button
                            className={`btn-mic ${isRecording ? 'recording' : ''}`}
                            onClick={toggleRecording}
                            title={micStatus === 'error' ? 'Microphone Error' : 'Click to Speak'}
                        >
                            {isRecording ? '🛑' : '🎤'}
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type or speak your offer..."
                            disabled={loading}
                        />
                        <button
                            className="btn-send"
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                        >
                            Send
                        </button>
                    </div>
                ) : (
                    <div className={`game-over ${gameState}`}>
                        <h2>{gameState === 'won' ? '🎉 DEAL ACCEPTED!' : '🚪 GET OUT!'}</h2>
                        <p>
                            {gameState === 'won'
                                ? "You are a master negotiator! You saved a lot of money."
                                : "The merchant got offended and kicked you out."}
                        </p>
                        <button onClick={() => window.location.reload()} className="btn-restart">
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
