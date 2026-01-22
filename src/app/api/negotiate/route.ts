import { NextRequest, NextResponse } from 'next/server';
import { getGeminiModel } from '@/lib/gemini';
import { optionalAuth } from '@/middleware/auth';

export async function POST(request: NextRequest) {
    try {
        const { history, targetPrice } = await request.json();
        const lastUserMessage = history[history.length - 1].content;
        const currentPriceFromHistory = history[history.length - 2]?.price || 500;

        const model = getGeminiModel();

        const prompt = `
You are Ahmed, a charismatic, dramatic, and shrewd carpet seller in the Grand Bazaar of Istanbul.
You are selling a rare, 19th-century hand-woven silk carpet.
Your goal is to sell it for as high a price as possible, but you are willing to negotiate if the customer is persuasive, polite, or shrewd.

Current State:
- Your last asking price: $${currentPriceFromHistory}
- The user's target price (secret): $${targetPrice} (If they offer this or lower, and you accept, they win).
- Customer says: "${lastUserMessage}"

Instructions:
1. Analyze the customer's input.
   - If they offer a price, evaluate it.
   - If they use persuasion (flattery, pointing out flaws, walking away), typically lower your price more.
   - If they are rude or offer an insultingly low price (e.g. under $50), you might get offended and kick them out (dealBroken).
   - If they agree to your price, or you agree to theirs, dealReached = true.

2. Determine your response and new price.
   - If their offer is reasonable (e.g. > $${targetPrice}), you might accept it or counter slightly higher.
   - If their offer is very low but they are polite, give a counter-offer.
   - If they don't offer a price but just complain/flatter, adjust your price slightly to show goodwill (or keep it same if they are weak).

3. Return ONLY a JSON object with this format:
{
  "reply": "Your spoken response here (be dramatic, use 'My friend!', etc.)",
  "newPrice": number (the new asking price, or the final agreed price),
  "dealReached": boolean (true if a price is agreed upon),
  "dealBroken": boolean (true if you kick them out)
}

Compatibility Rules:
- If dealReached is true, newPrice must be the final agreed amount.
- If dealBroken is true, newPrice doesn't matter much but keep it same.
- DO NOT use markdown formatting in the JSON.
`;

        const result = await model.generateContent(prompt);
        let textCallback = result.response.text().trim();

        // Cleanup if the model wraps JSON in markdown blocks
        textCallback = textCallback.replace(/```json/g, '').replace(/```/g, '');

        let decision;
        try {
            decision = JSON.parse(textCallback);
        } catch (e) {
            console.error("Failed to parse JSON from AI:", textCallback);
            // Fallback if AI fails to return JSON
            decision = {
                reply: "My friend, you drive a hard bargain! Let me think... how about $" + Math.floor(currentPriceFromHistory * 0.95) + "?",
                newPrice: Math.floor(currentPriceFromHistory * 0.95),
                dealReached: false,
                dealBroken: false
            };
        }

        return NextResponse.json({
            reply: decision.reply,
            currentPrice: decision.newPrice,
            dealReached: decision.dealReached,
            dealBroken: decision.dealBroken
        });

    } catch (error) {
        console.error('Negotiation AI error:', error);
        return NextResponse.json({
            reply: "I didn't quite catch that, my friend. Speak up! The market is noisy!",
            currentPrice: 500, // Should probably ideally persist previous price, but this is error fallback
            dealReached: false,
            dealBroken: false
        });
    }
}
