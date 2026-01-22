import { NextRequest, NextResponse } from 'next/server';
import { getGeminiModel } from '@/lib/gemini';
import { optionalAuth } from '@/middleware/auth';

export async function POST(request: NextRequest) {
    try {
        // SECURITY: Optional authentication (allows guests)
        const authResult = await optionalAuth(request);
        const user = authResult?.user;

        const { topic, history, userArgument } = await request.json();

        const model = getGeminiModel();

        const prompt = `
      You are a master debater and logic expert.
      Current Topic: "${topic}"
      Your Stance: You are AGAINST the user. You must find flaws in their logic, point out fallacies, or provide counter-evidence.
      
      User's latest argument: "${userArgument}"
      
      Task:
      1. Analyze the user's argument.
      2. Rate it from 1-10 based on logic, grammar, and persuasion.
      3. Provide a sharp, witty, and logical counter-argument.
      4. Keep it concise (max 2-3 sentences).
      
      Respond in JSON format:
      {
        "reply": "Your counter-argument here",
        "score": number (1-10)
      }
    `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // More robust JSON extraction
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('AI did not return valid JSON');
        }

        const data = JSON.parse(jsonMatch[0]);

        return NextResponse.json(data);
    } catch (error) {
        console.error('Debate AI error:', error);
        return NextResponse.json({
            reply: "I see what you're trying to do, but your logic is flawed. Try again!",
            score: 5
        });
    }
}
