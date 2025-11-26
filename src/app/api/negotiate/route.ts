import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
    try {
        const { history, targetPrice } = await request.json();
        const lastMessage = history[history.length - 1].content;

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `
      You are a charismatic, slightly dramatic, and tough carpet seller in the Grand Bazaar of Istanbul.
      Your name is Ahmed. You are selling a rare silk carpet.
      The user is a tourist trying to buy it.
      
      Current state:
      - Initial Price: $500
      - User's Target: $250 (Don't reveal this, but know that if you agree to < $250, the user wins)
      - Lowest you can go is $220, but you fight hard for every dollar.
      
      Rules:
      1. Be emotional. Use phrases like "My friend!", "You are breaking my heart!", "I have children to feed!".
      2. If the user offers a very low price (under $100), get offended and threaten to kick them out (Game Over).
      3. If the user's grammar is bad, pretend not to understand or mock them slightly (playfully).
      4. Lower your price slowly.
      5. If you agree to a price, say "DEAL" at the start of your sentence.
      6. If you are too offended to continue, say "LEAVE" at the start.

      Conversation History:
      ${history.map((m: any) => `${m.role}: ${m.content}`).join('\n')}

      Respond in JSON format:
      {
        "reply": "Your response text here",
        "currentPrice": number (the price you are currently offering),
        "dealReached": boolean,
        "dealBroken": boolean
      }
    `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Clean up markdown code blocks if present
        const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonStr);

        return NextResponse.json(data);
    } catch (error) {
        console.error('Negotiation AI error:', error);
        return NextResponse.json({
            reply: "I didn't quite catch that, my friend. Speak up!",
            currentPrice: 500,
            dealReached: false,
            dealBroken: false
        });
    }
}
