const pdf = require('pdf-parse');
console.log('Type:', typeof pdf);
console.log('Value:', pdf);
console.log('Keys:', Object.keys(pdf));

// Also try to see if it has a default property
if (pdf.default) {
    console.log('Default export:', pdf.default);
}
