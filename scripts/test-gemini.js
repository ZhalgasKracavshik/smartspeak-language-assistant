const https = require('https');
const fs = require('fs');
const path = require('path');

// Load env file manually since we're running standalone
const envPath = path.join(__dirname, '../.env.local');
let apiKey = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/GEMINI_API_KEY=(.*)/);
    if (match) {
        apiKey = match[1].trim();
    }
} catch (e) {
    console.error('Error reading .env.local:', e.message);
    process.exit(1);
}

if (!apiKey) {
    console.error('GEMINI_API_KEY not found in .env.local');
    process.exit(1);
}

console.log('Testing Gemini API with key ending in:', apiKey.slice(-4));

function testModel(model) {
    return new Promise((resolve) => {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const data = JSON.stringify({
            contents: [{ parts: [{ text: "Hello, are you working?" }] }]
        });

        const req = https.request(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log(`✅ ${model}: SUCCESS`);
                    resolve(true);
                } else {
                    console.log(`❌ ${model}: FAILED (${res.statusCode})`);
                    try {
                        const error = JSON.parse(body);
                        console.log('   Error:', error.error.message);
                    } catch (e) {
                        console.log('   Raw body:', body);
                    }
                    resolve(false);
                }
            });
        });

        req.on('error', (e) => {
            console.error(`❌ ${model}: NETWORK ERROR`, e.message);
            resolve(false);
        });

        req.write(data);
        req.end();
    });
}

async function runTests() {
    console.log('\nStarting Model Connectivity Tests...\n');
    // Testing models found in the list
    const validModels = ['gemini-pro-latest', 'gemini-2.0-flash'];

    for (const model of validModels) {
        await testModel(model);
    }
}

runTests();
