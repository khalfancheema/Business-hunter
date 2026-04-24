import { readFileSync } from 'fs';
const html = readFileSync('public/index.html', 'utf8');
const scriptStart = html.indexOf('<script>') + 8;
const scriptEnd = html.lastIndexOf('</script>');
const script = html.slice(scriptStart, scriptEnd);
const lines = script.split('\n');

let backtickDepth = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Count unescaped backticks
  for (let j = 0; j < line.length; j++) {
    if (line[j] === '`' && (j === 0 || line[j-1] !== '\\')) backtickDepth++;
  }
  const inTemplate = backtickDepth % 2 !== 0;
  // After this line, are we outside a template literal on the next line?
  const nextLine = (lines[i+1] || '').trim();
  if (!inTemplate && /^<[a-zA-Z\/]/.test(nextLine)) {
    const htmlLine = scriptStart / 1 + i + 2; // approximate
    console.log(`Bare HTML at script line ${i+2} (approx HTML line ${761 + i + 1}):`);
    console.log('  ' + nextLine.slice(0, 120));
  }
}
console.log('Scan complete. Total script lines:', lines.length);
