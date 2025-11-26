const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function testGemini() {
    const keys = [
        process.env.GEMINI_API_KEY,
        process.env.GEMINI_API_KEY_2,
        process.env.GEMINI_API_KEY_3,
        process.env.GEMINI_API_KEY_4
    ].filter(Boolean);

    console.log(`Found ${keys.length} keys.`);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        console.log(`Testing Key ${i + 1}: ${key.substring(0, 10)}...`);

        try {
            const genAI = new GoogleGenerativeAI(key);
            // Try gemini-1.5-flash first
            let model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            console.log("  Attempting with model: gemini-1.5-flash");
            let result = await model.generateContent("Hello");
            console.log("  Success! Response:", result.response.text());
            return; // Stop if one works
        } catch (error) {
            console.error("  Failed with gemini-1.5-flash:", error.message);

            // Try gemini-pro as fallback
            try {
                const genAI = new GoogleGenerativeAI(key);
                let model = genAI.getGenerativeModel({ model: "gemini-pro" });
                console.log("  Attempting with model: gemini-pro");
                let result = await model.generateContent("Hello");
                console.log("  Success! Response:", result.response.text());
                return; // Stop if one works
            } catch (error2) {
                console.error("  Failed with gemini-pro:", error2.message);
            }
        }
    }
    console.log("All keys failed.");
}

testGemini();
