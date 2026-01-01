import { NextRequest, NextResponse } from 'next/server';
import { getGeminiModel } from '@/lib/gemini';
import { optionalAuth } from '@/middleware/auth';

// Simple in-memory rate limiter for guests
// Note: In serverless, this is per-instance, but provides a baseline defense.
const guestRateLimits = new Map<string, { count: number; resetTime: number }>();
const GUEST_LIMIT = 3;
const GUEST_WINDOW_MS = 60 * 1000; // 1 minute

// SmartSpeak AI Teacher System Prompt
const PROMPTS = {
    tutor: `Ты — SmartSpeak AI Teacher, дружелюбный и опытный учитель английского языка для казахстанских школьников (5-11 классы).
    
    ## Твои основные задачи:
    1. Объяснять грамматику английского языка простым и понятным языком
    2. Помогать с переводами (английский ↔ русский ↔ казахский) and исправлять ошибки
    3. Давать примеры использования слов и фраз
    
    ## Правила общения:
    - Отвечай на том языке, на котором задан вопрос (русский, казахский или английский)
    - Используй простые объяснения и эмодзи 😊
    - Формат для грамматики: правило → пример → упражнение`,

    conversation: `Ты — собеседник для практики английского языка. 
    
    ## Твоя цель:
    Поддерживать непринужденный диалог на английском языке, как друг.
    
    ## Правила:
    1. Общайся ТОЛЬКО на английском языке (если ученик не попросит перевести).
    2. Задавай встречные вопросы, чтобы поддерживать разговор.
    3. Используй простой, разговорный английский (A2-B1 уровень).
    4. Исправляй ошибки МЯГКО и КРАТКО только в конце своего сообщения, не перебивая ход беседы.
    5. Будь веселым и интересным собеседником! 😎`,

    quiz: `Ты — Quiz Master, ведущий викторины по английскому языку.
    
    ## Твоя цель:
    Проверить знания ученика через интересные вопросы.
    
    ## Алгоритм работы:
    1. Если ученик не выбрал тему, предложи: "Grammar", "Vocabulary" или "General Knowledge".
    2. Задай ОДИН вопрос с 3 вариантами ответа (A, B, C).
    3. Жди ответа ученика.
    4. Если ответ верный: Похвали и объясни, почему это правильно. Затем задай следующий вопрос.
    5. Если ответ неверный: Объясни ошибку и дай правильный ответ. Затем задай следующий вопрос.
    6. Используй эмодзи 🎯🏆`
};

export async function POST(request: NextRequest) {
    try {
        const ip = request.headers.get('x-forwarded-for') || 'anonymous';

        // SECURITY: Optional authentication - allow guest access
        const authResult = await optionalAuth(request);
        const user = authResult.user;

        // Rate limiting for guests
        if (!user) {
            const now = Date.now();
            const rateData = guestRateLimits.get(ip) || { count: 0, resetTime: now + GUEST_WINDOW_MS };

            if (now > rateData.resetTime) {
                rateData.count = 0;
                rateData.resetTime = now + GUEST_WINDOW_MS;
            }

            if (rateData.count >= GUEST_LIMIT) {
                const waitSec = Math.ceil((rateData.resetTime - now) / 1000);
                return NextResponse.json({
                    error: `Guest limit reached. Please log in for unlimited chat or wait ${waitSec}s.`,
                    retryAfter: waitSec,
                    isRateLimit: true
                }, { status: 429 });
            }

            rateData.count++;
            guestRateLimits.set(ip, rateData);
        }

        const { message, history = [], mode = 'tutor' } = await request.json();

        // SECURITY: Validate inputs
        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: 'Invalid message format' },
                { status: 400 }
            );
        }

        if (message.length === 0 || message.length > 10000) {
            return NextResponse.json(
                { error: 'Message must be between 1 and 10,000 characters' },
                { status: 400 }
            );
        }

        if (!Array.isArray(history) || history.length > 100) {
            return NextResponse.json(
                { error: 'Invalid history format or too many messages' },
                { status: 400 }
            );
        }

        const model = getGeminiModel();

        // Select system prompt based on mode
        const systemPrompt = PROMPTS[mode as keyof typeof PROMPTS] || PROMPTS.tutor;

        // Build chat history with system prompt
        const chatHistory = [
            {
                role: 'user' as const,
                parts: [{ text: 'System Instructions:\n\n' + systemPrompt }],
            },
            {
                role: 'model' as const,
                parts: [{ text: 'Ok, I understand based on the mode: ' + mode }],
            },
            ...history.map((msg: any) => ({
                role: msg.role === 'user' ? 'user' as const : 'model' as const,
                parts: [{ text: msg.content }],
            })),
        ];

        const chat = model.startChat({
            history: chatHistory,
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ reply: text });
    } catch (error: any) {
        console.error('Chat API Error:', error);

        // Handle Gemini Quota Errors specifically for the countdown
        const isQuotaError = error?.message?.includes('429') || error?.status === 429;

        return NextResponse.json({
            error: isQuotaError
                ? '🤖 **Quota Reached**: My free-tier brain needs a short break. Please wait 60 seconds.'
                : `⚠️ **System Error**: ${error?.message}`,
            retryAfter: isQuotaError ? 60 : undefined,
            isQuota: isQuotaError,
            model: getGeminiModel()?.model
        }, { status: isQuotaError ? 429 : 500 });
    }
}
