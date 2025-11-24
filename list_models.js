const https = require('https');

const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyDuMBhTHDt1Y_LiIxH4tXcZSHYtfOzQgcQ';
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('Available Models:');
            if (json.models) {
                json.models.forEach(m => {
                    if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                        console.log(`- ${m.name}`);
                    }
                });
            } else {
                console.log('No models found or error:', json);
            }
        } catch (e) {
            console.error('Error parsing JSON:', e);
            console.log('Raw data:', data);
        }
    });
}).on('error', (e) => {
    console.error('Error:', e);
});
