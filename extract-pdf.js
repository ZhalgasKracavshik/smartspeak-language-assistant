const fs = require('fs');
const { PDFParse, VerbosityLevel } = require('pdf-parse');

async function extract() {
    try {
        const buffer = fs.readFileSync('469.pdf');
        const uint8Array = new Uint8Array(buffer);

        const pdf = new PDFParse({
            data: uint8Array,
            verbosity: VerbosityLevel?.ERRORS || 0
        });

        console.log('Loading PDF...');
        await pdf.load();

        console.log('Extracting text...');
        const result = await pdf.getText();

        // Result is an object with text property!
        const text = result.text;

        console.log('=== SUCCESS ===');
        if (text) {
            console.log(`Length: ${text.length}`);
            fs.writeFileSync('extracted_textbook.txt', text, 'utf8');
            console.log('Saved to extracted_textbook.txt');
            console.log('\n=== PREVIEW ===\n');
            console.log(text.substring(0, 5000));
        } else {
            console.log('Text is undefined or empty');
            console.log('Result object keys:', Object.keys(result));
        }

    } catch (e) {
        console.error('Error:', e);
    }
}

extract();
