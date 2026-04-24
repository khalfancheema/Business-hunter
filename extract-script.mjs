import { readFileSync, writeFileSync } from 'fs';
const html = readFileSync('public/index.html', 'utf8');
const start = html.indexOf('<script>') + 8;
const end = html.lastIndexOf('</script>');
writeFileSync('extracted-script.js', html.slice(start, end));
console.log('Extracted', end - start, 'bytes to extracted-script.js');
