const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function listModels() {
    const key = process.env.GEMINI_API_KEY; // Try the first key
    if (!key) {
        console.error("No GEMINI_API_KEY found in .env.local");
        return;
    }

    console.log(`Using key: ${key.substring(0, 10)}...`);
    const genAI = new GoogleGenerativeAI(key);

    try {
        // For listing models, we don't need a specific model instance
        // We access the model manager directly via the API
        // The SDK exposes this via the getGenerativeModel factory, but listing is on the client
        // Actually, in the node SDK, it's usually on the GoogleGenerativeAI instance or a separate manager
        // Let's try to fetch the list via raw fetch if SDK method is obscure, 
        // but SDK usually has genAI.getGenerativeModel... wait, listModels is often on the client.

        // Let's try raw fetch to be sure, as SDK method signatures change
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${await response.text()}`);
        }

        const data = await response.json();
        console.log("Available Models:");
        if (data.models) {
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name} (Supported methods: ${m.supportedGenerationMethods.join(', ')})`);
                }
            });
        } else {
            console.log("No models found in response:", data);
        }

    } catch (error) {
        console.error("Error listing models:", error.message);
    }
}

listModels();
