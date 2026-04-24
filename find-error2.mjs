import { readFileSync } from 'fs';
const html = readFileSync('public/index.html', 'utf8');
const scriptStart = html.indexOf('<script>') + 8;
const scriptEnd = html.lastIndexOf('</script>');
const script = html.slice(scriptStart, scriptEnd);
const lines = script.split('\n');

let depth = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (let j = 0; j < line.length; j++) {
    const c = line[j];
    const prev = j > 0 ? line[j-1] : '';
    if (c === '`' && prev !== '\\') depth++;
  }
  // If depth is odd after this line, we're inside an unclosed template
  // Track where depth FIRST becomes odd and doesn't come back to even
  if (depth % 2 !== 0 && i + 1 < lines.length) {
    const nextLine = lines[i + 1].trim();
    if (/^<[a-zA-Z\/]/.test(nextLine)) {
      console.log(`Unclosed template at HTML line ${761 + i} (depth=${depth}), next line starts with HTML:`);
      console.log('  This line: ' + line.trim().slice(0, 100));
      console.log('  Next line: ' + nextLine.slice(0, 100));
      console.log('');
    }
  }
}
// Report final depth
console.log('Final backtick depth:', depth, depth % 2 === 0 ? '(balanced)' : '(UNBALANCED - missing closing backtick!)');
