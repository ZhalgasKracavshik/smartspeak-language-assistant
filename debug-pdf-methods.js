const { PDFParse } = require('pdf-parse');
try {
    console.log('Prototype methods:', Object.getOwnPropertyNames(PDFParse.prototype));
    console.log('Static methods:', Object.getOwnPropertyNames(PDFParse));
} catch (e) {
    console.log('Error inspecting:', e.message);
}
