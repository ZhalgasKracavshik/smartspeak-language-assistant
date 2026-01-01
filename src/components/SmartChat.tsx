import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Sparkles, Loader2, RefreshCw, ChevronDown, BookOpen, MessageCircle, Trophy } from 'lucide-react';
import { ChatSkeleton } from './skeletons/ChatSkeleton';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useLanguage } from '../contexts/LanguageContext';
import { aiService } from '../services/aiService';
import { supabase } from '../lib/supabase';
import { rateLimiter } from '../services/rateLimiter';
import { inputSanitizer } from '../services/inputSanitizer';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export function SmartChat() {
    const { language } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [mode, setMode] = useState<'tutor' | 'conversation' | 'quiz'>('tutor');
    const [quotaCountdown, setQuotaCountdown] = useState<number | null>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Load history on mount
    useEffect(() => {
        const loadMessages = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            const isGuest = localStorage.getItem('smartspeak-is-guest') === 'true';

            if (user && !isGuest) {
                // Load from Supabase for authenticated users
                const { data, error } = await supabase
                    .from('chat_messages')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: true });

                if (data && !error) {
                    const supabaseMessages: Message[] = data.map(msg => ({
                        id: msg.id,
                        role: msg.role as 'user' | 'assistant',
                        content: msg.content,
                        timestamp: new Date(msg.created_at)
                    }));
                    if (supabaseMessages.length > 0) {
                        setMessages(supabaseMessages);
                    } else {
                        setMessages([{
                            id: '1',
                            role: 'assistant',
                            content: language === 'kz'
                                ? 'Сәлем! Мен SmartSpeak AI көмекшісімін. Қалай көмектесе аламын?'
                                : 'Привет! Я AI помощник SmartSpeak. Чем могу помочь?',
                            timestamp: new Date() // This is client-side only fetch, so Date() is safe here as it runs in useEffect
                        }]);
                    }
                    setIsInitialLoading(false);
                    return;
                }
            }

            // Load from localStorage for guests or fallback
            const saved = localStorage.getItem('smartspeak-chat-history');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    const hydrated = parsed.map((m: any) => ({
                        ...m,
                        timestamp: new Date(m.timestamp)
                    }));
                    setMessages(hydrated);
                    setIsInitialLoading(false);
                } catch (e) {
                    console.error('Failed to parse chat history', e);
                }
            } else {
                setMessages([{
                    id: '1',
                    role: 'assistant',
                    content: language === 'kz'
                        ? 'Сәлем! Мен SmartSpeak AI көмекшісімін. Қалай көмектесе аламын?'
                        : 'Привет! Я AI помощник SmartSpeak. Чем могу помочь?',
                    timestamp: new Date()
                }]);
                setIsInitialLoading(false);
            }
        };
        loadMessages();
    }, [language]);

    // Save history and auto-scroll
    useEffect(() => {
        const saveMessages = async () => {
            if (messages.length === 0) return;

            const { data: { user } } = await supabase.auth.getUser();
            const isGuest = localStorage.getItem('smartspeak-is-guest') === 'true';

            if (user && !isGuest) {
                // Save to Supabase for authenticated users
                const lastMessage = messages[messages.length - 1];
                if (lastMessage && lastMessage.id !== '1') { // Skip default welcome message
                    await supabase.from('chat_messages').insert({
                        user_id: user.id,
                        role: lastMessage.role,
                        content: lastMessage.content,
                        created_at: lastMessage.timestamp.toISOString()
                    });
                }
            } else {
                // Save to localStorage for guests
                localStorage.setItem('smartspeak-chat-history', JSON.stringify(messages));
            }
        };

        saveMessages();

        // Auto-scroll to bottom
        if (scrollAreaRef.current) {
            const scrollElement = scrollAreaRef.current;
            // Scroll to the bottom smoothly
            scrollElement.scrollTop = scrollElement.scrollHeight;
        }
    }, [messages, isLoading]);

    // Quota countdown timer
    useEffect(() => {
        if (quotaCountdown !== null && quotaCountdown > 0) {
            timerRef.current = setInterval(() => {
                setQuotaCountdown(prev => (prev && prev > 0) ? prev - 1 : null);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
            setQuotaCountdown(null);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [quotaCountdown]);

    const handleSend = async () => {
        if (!input.trim()) return;

        // Rate Limit Check
        const rateCheck = rateLimiter.check('chat');
        if (!rateCheck.allowed) {
            const errorMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: `You are sending messages too fast. Please wait ${rateCheck.waitTime} seconds.`,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
            return;
        }
        rateLimiter.increment('chat');

        // Input Sanitization
        const sanitizedInput = inputSanitizer.sanitizeText(input);
        if (!sanitizedInput.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: sanitizedInput,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await aiService.getChatResponse(sanitizedInput, mode);

            if (response.error) {
                const errorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: response.error,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, errorMessage]);

                if (response.retryAfter) {
                    setQuotaCountdown(response.retryAfter);
                }
            } else {
                const botMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: response.text,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botMessage]);
            }
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto h-[calc(100vh-100px)]">
            <Card className="h-full flex flex-col border-0 shadow-xl bg-white/90 backdrop-blur">
                <CardHeader className="border-b bg-white/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-100 p-2 rounded-xl">
                                <Bot className="size-6 text-purple-600" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Smart Chat</CardTitle>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <Sparkles className="size-3 text-purple-500" />
                                    Powered by Gemini AI
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="gap-2">
                                        {mode === 'tutor' && <BookOpen className="size-4 text-blue-500" />}
                                        {mode === 'conversation' && <MessageCircle className="size-4 text-green-500" />}
                                        {mode === 'quiz' && <Trophy className="size-4 text-orange-500" />}
                                        <span className="capitalize">{mode} Mode</span>
                                        <ChevronDown className="size-4 text-gray-500" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setMode('tutor')}>
                                        <BookOpen className="size-4 mr-2 text-blue-500" />
                                        Tutor
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setMode('conversation')}>
                                        <MessageCircle className="size-4 mr-2 text-green-500" />
                                        Conversation
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setMode('quiz')}>
                                        <Trophy className="size-4 mr-2 text-orange-500" />
                                        Quiz
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button variant="ghost" size="icon" onClick={() => setMessages([messages[0]])}>
                                <RefreshCw className="size-5 text-gray-500 hover:text-purple-600" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
                    <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-4">
                            {isInitialLoading ? (
                                <ChatSkeleton />
                            ) : (
                                messages.map((message) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <Avatar className="size-8 mt-1">
                                                <AvatarFallback className={message.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}>
                                                    {message.role === 'user' ? <User className="size-4" /> : <Bot className="size-4" />}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div
                                                className={`p-3 rounded-2xl ${message.role === 'user'
                                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                                    : 'bg-gray-100 text-gray-900 rounded-tl-none'
                                                    }`}
                                            >
                                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                                <p className={`text-[10px] mt-1 ${message.role === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="flex gap-3">
                                        <Avatar className="size-8 mt-1">
                                            <AvatarFallback className="bg-purple-100 text-purple-600">
                                                <Bot className="size-4" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    <div className="p-4 bg-white border-t">
                        {quotaCountdown !== null && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mb-2 p-2 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-amber-800 text-xs"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                                    <span>AI brain cooling down...</span>
                                </div>
                                <span className="font-mono font-bold">{quotaCountdown}s</span>
                            </motion.div>
                        )}
                        <div className="flex gap-2">
                            <Input
                                placeholder={quotaCountdown !== null ? `Locked for ${quotaCountdown}s...` : "Type a message..."}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                disabled={isLoading || quotaCountdown !== null}
                                className="flex-1"
                            />
                            <Button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim() || quotaCountdown !== null}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                <Send className="size-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
