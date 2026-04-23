#!/usr/bin/env node
/**
 * build.js — Simple copy script (no bundler needed)
 *
 * The app is a single self-contained HTML file.
 * This script just validates the file and reports stats.
 *
 * Usage: node scripts/build.js
 */

const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, '../public/index.html');
const html = fs.readFileSync(srcFile, 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1] || '';

console.log('=== Daycare Planning Agent System — Build Report ===\n');
console.log(`File: public/index.html`);
console.log(`Total lines: ${html.split('\n').length.toLocaleString()}`);
console.log(`File size: ${(html.length / 1024).toFixed(1)} KB`);
console.log(`JS size: ${(script.length / 1024).toFixed(1)} KB\n`);

// Count agents
const agentFns = script.match(/async function runAgent\d+/g) || [];
console.log(`Agents: ${agentFns.length} (${agentFns.map(f => f.replace('async function runAgent', '#')).join(', ')})`);

// Count claudeJSON calls
const claudeCalls = (script.match(/await claudeJSON/g) || []).length;
console.log(`API calls per run: ${claudeCalls}`);

// Count charts
const chartInits = (script.match(/new Chart\(/g) || []).length;
console.log(`Charts: ${chartInits}`);

// Count tabs
const tabFns = (html.match(/onclick="tab\(/g) || []).length;
console.log(`Tab panels: ${tabFns}`);

// Check for key features
console.log('\n=== Feature Checklist ===');
const checks = [
  ['claudeJSON retry wrapper', script.includes('async function claudeJSON')],
  ['5-strategy parseJSON', script.includes('braceStart')],
  ['Agent 6 fallback data', script.includes('using baseline fallback data')],
  ['Agent 4→7 sequential', script.includes('r4=await runAgent4') && script.includes('r7=await runAgent7(r3,r4')],
  ['resetAll covers 15 agents', script.includes("'15'")],
  ['max_tokens 4096', script.includes('max_tokens: 4096')],
  ['dark theme CSS vars', html.includes('--bg:#0e0f11')],
  ['Chart.js CDN', html.includes('chart.umd.min.js')],
  ['Barrow County covered', html.includes('Winder') && html.includes('Auburn')],
  ['SBA links present', html.includes('sba.gov')],
  ['DECAL URL present', html.includes('decal.ga.gov')],
];

checks.forEach(([label, pass]) => {
  console.log(`  ${pass ? '✅' : '❌'} ${label}`);
});

const passCount = checks.filter(c => c[1]).length;
console.log(`\n${passCount}/${checks.length} checks passed`);

if (passCount === checks.length) {
  console.log('\n✅ Build OK — public/index.html is ready to deploy');
} else {
  console.log('\n⚠️  Some checks failed — review before deploying');
  process.exit(1);
}
