const { PDFParse, VerbosityLevel } = require('pdf-parse');
try {
    const pdf = new PDFParse({ verbosity: VerbosityLevel?.ERRORS || 0 });
    console.log(pdf.load.toString());
} catch (e) {
    console.log('Error:', e.message);
}
