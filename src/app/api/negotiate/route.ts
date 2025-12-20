import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { requireAuth } from '@/middleware/auth';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

function extractPriceFromMessage(message: string): number | null {
    // Extract numbers from user message
    const numbers = message.match(/\d+/g);
    if (!numbers) return null;

    // Find the largest number (likely the price)
    const prices = numbers.map(n => parseInt(n));
    return Math.max(...prices);
}

function calculateCounterOffer(userOffer: number, currentPrice: number): number {
    // If user offers very low (< 30% of current), reduce by 10%
    if (userOffer < currentPrice * 0.3) {
        return Math.max(220, Math.floor(currentPrice * 0.9));
    }
    // If reasonable offer (30-60%), reduce by 15%
    else if (userOffer < currentPrice * 0.6) {
        return Math.max(220, Math.floor(currentPrice * 0.85));
    }
    // If good offer (60-80%), reduce by 20%
    else if (userOffer < currentPrice * 0.8) {
        return Math.max(220, Math.floor(currentPrice * 0.8));
    }
    // If close offer (80%+), meet halfway
    else {
        return Math.max(220, Math.floor((currentPrice + userOffer) / 2));
    }
}

export async function POST(request: NextRequest) {
    try {
        // SECURITY: Require authentication
        const authResult = await requireAuth(request);
        if (authResult instanceof NextResponse) {
            return authResult;
        }
        const { user } = authResult;

        const { history, targetPrice } = await request.json();
        const lastUserMessage = history[history.length - 1].content;
        const currentPriceFromHistory = history[history.length - 2]?.price || 500;

        // Try to extract user's offer
        const userOffer = extractPriceFromMessage(lastUserMessage);

        // Calculate new price based on user's offer
        let newPrice = currentPriceFromHistory;
        if (userOffer) {
            if (userOffer < 100) {
                // Too low - get offended
                return NextResponse.json({
                    reply: "LEAVE! $" + userOffer + "?! Are you insulting me?! This is a SILK carpet, not a doormat! GET OUT of my shop!",
                    currentPrice: currentPriceFromHistory,
                    dealReached: false,
                    dealBroken: true
                });
            } else if (userOffer <= targetPrice) {
                // User wins!
                return NextResponse.json({
                    reply: "DEAL! Okay okay, you drive a hard bargain, my friend. $" + userOffer + " it is. You are a tough negotiator!",
                    currentPrice: userOffer,
                    dealReached: true,
                    dealBroken: false
                });
            } else {
                // Calculate counter offer
                newPrice = calculateCounterOffer(userOffer, currentPriceFromHistory);
            }
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `
You are Ahmed, a dramatic carpet seller in Istanbul Grand Bazaar.

Current situation:
- Your current asking price: $${currentPriceFromHistory}
- Your NEW counter-offer: $${newPrice} (USE THIS EXACT PRICE)
- Customer offered: $${userOffer || 'nothing specific'}
- Customer said: "${lastUserMessage}"

Instructions:
1. Be emotional and dramatic: "My friend!", "You're killing me!", "I have a family!"
2. Counter with EXACTLY $${newPrice} (say this price clearly)
3. Make it feel like you're doing them a huge favor
4. Keep it to 2-3 sentences max

Example: "Ah, you are breaking my heart! This carpet is worth a fortune... but you seem like good person. Okay, FINAL price - $${newPrice}. This is practically robbery!"

Reply:`;

        const result = await model.generateContent(prompt);
        const reply = result.response.text().trim();

        return NextResponse.json({
            reply: reply,
            currentPrice: newPrice,
            dealReached: false,
            dealBroken: false
        });
    } catch (error) {
        console.error('Negotiation AI error:', error);
        return NextResponse.json({
            reply: "I didn't quite catch that, my friend. Make me an offer!",
            currentPrice: 500,
            dealReached: false,
            dealBroken: false
        });
    }
}
