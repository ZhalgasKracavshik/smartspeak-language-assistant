
import { NextRequest, NextResponse } from 'next/server';
import { getGeminiModel } from '@/lib/gemini';

export async function POST(request: NextRequest) {
    try {
        const { question, userAnswer, correctAnswer } = await request.json();

        if (!userAnswer) {
            return NextResponse.json({ isCorrect: false, feedback: "No answer provided." });
        }

        // 1. Exact match check (fast path)
        if (userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
            return NextResponse.json({ isCorrect: true, feedback: "Exact match!" });
        }

        // 2. AI Semantic Check
        const model = getGeminiModel();
        const prompt = `
        You are a strict but fair English teacher grading a test.
        
        Question: "${question}"
        Correct Answer (Context): "${correctAnswer}"
        Student Answer: "${userAnswer}"

        Task: Determine if the student's answer is factually and grammatically correct considering the context of the correct answer.
        - The student's answer does not need to be word-for-word identical.
        - It must convey the same meaning.
        - Minor spelling errors are okay if phonetic (e.g., "Bethany" vs "Bethanny"), unless it's a spelling test.
        - If the question asks "What happened...", and the answer describes the event correctly, mark it correct.

        Respond with ONLY a JSON object:
        {
            "isCorrect": boolean,
            "feedback": "Short explanation if incorrect, or 'Correct' if correct"
        }
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        let decision;
        try {
            decision = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
        } catch (e) {
            console.error("AI JSON Parse Error", text);
            // Fallback to strict (fail safe)
            return NextResponse.json({ isCorrect: false, feedback: "Could not verify answer." });
        }

        return NextResponse.json(decision);

    } catch (error) {
        console.error('Test Check Error:', error);
        return NextResponse.json({ isCorrect: false, feedback: "System error." }, { status: 500 });
    }
}
