/**
 * split-src.mjs — splits extracted-script.js into src/js/*.js files
 * Run: node split-src.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const js = readFileSync('extracted-script.js', 'utf8');
const lines = js.split('\n');

function slice(startLine, endLine) {
  // 1-indexed, inclusive start, exclusive end
  return lines.slice(startLine - 1, endLine - 1).join('\n');
}

function write(file, startLine, endLine) {
  const content = slice(startLine, endLine);
  writeFileSync('src/js/' + file, content + '\n');
  console.log(`  ${file}: lines ${startLine}-${endLine-1} (${content.split('\n').length} lines)`);
}

mkdirSync('src/js', { recursive: true });

// Line boundaries (1-indexed) from analysis:
// Line 1: start of script
// Line 6: const INDUSTRIES
// Line 111: const PROVIDERS
// Line 151: const CACHE_KEY_PREFIX
// Line 155: const $ = ...
// Line 186-198: utility assignments (key, provider, model, etc.)
// Line 198: onIndustryChange
// Line 216: toggleDemo
// Line 225: setDot
// Line 247-251: showOut, setProgress, showErr, hideErr
// Line 252: tab
// Line 262: parseJSON
// Line 285: killChart
// Line 288: claudeJSON
// Line 316: claude (inside claudeJSON block - actually at line 306+)
// Line 335: onProviderChange
// Line 347: ctx
// Line 358: getFallback*
// Line 392: renderHmap

// Let me verify a few exact boundaries
const exactLines = {
  'const INDUSTRIES': null,
  'const PROVIDERS': null,
  'const CACHE_KEY_PREFIX': null,
  'const memCache': null,
  'const $ =': null,
  'function onIndustryChange': null,
  'function toggleDemo': null,
  'function setDot': null,
  'function showOut': null,
  'function setProgress': null,
  'function tab': null,
  'function parseJSON': null,
  'function killChart': null,
  'async function claudeJSON': null,
  'async function claude(': null,
  'function onProviderChange': null,
  'function ctx(': null,
  'function getFallback1': null,
  'function renderHmap': null,
  'async function runAgent1': null,
  'async function runAgent5': null,
  'async function runAgent6': null,
  'async function runAgent2': null,
  'async function runAgent3': null,
  'async function runAgent4': null,
  'async function runAgent7': null,
  'async function runAgent8': null,
  'async function runAgent9': null,
  'function renderBusinessPlan': null,
  'async function runAgent10': null,
  'function renderProjectPlan': null,
  'async function runAgent11': null,
  'function gapCol': null,
  'function buildMap(': null,
  'function buildMapLegend': null,
  'function buildDirections': null,
  'async function runAgent12': null,
  'function buildGrantCard': null,
  'function buildGrants(': null,
  'async function runAgent13': null,
  'function buildCompDeepDive': null,
  'async function runAgent14': null,
  'function renderCodeReview': null,
  'async function runAgent15': null,
  'function renderQA': null,
  'function toggleCheck': null,
  'async function runPipeline': null,
  'async function reRunAgent': null,
  'function exportResults': null,
  'function printReport': null,
  'function resetAll': null,
};

for (const [key] of Object.entries(exactLines)) {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trimStart().startsWith(key)) {
      exactLines[key] = i + 1; // 1-indexed
      break;
    }
  }
}

// Print found lines for verification
Object.entries(exactLines).forEach(([k, v]) => {
  if (!v) console.warn('NOT FOUND:', k);
});

const L = exactLines;

// 01-config.js: API constants + INDUSTRIES + PROVIDERS
// Lines 1-150 (before CACHE_KEY_PREFIX)
write('01-config.js', 1, L['const CACHE_KEY_PREFIX']);

// 02-cache.js: CACHE_KEY_PREFIX, CACHE_TTL_MS, memCache, cacheKey, getCache, setCache, clearAllCache
// Lines 151 to start of $ =
write('02-cache.js', L['const CACHE_KEY_PREFIX'], L['const $ =']);

// 03-utils.js: $, key, provider, model, customUrl, zip, radius, grades, capacity, budget, industry
// onIndustryChange, toggleDemo
// Lines from $ = to start of setDot
write('03-utils.js', L['const $ ='], L['function setDot']);

// 04-api.js: setDot, showOut, setProgress, showErr, hideErr, tab, parseJSON, killChart,
// claudeJSON, claude, onProviderChange, ctx
// Lines from setDot to getFallback1
write('04-api.js', L['function setDot'], L['function getFallback1']);

// 05-fallbacks.js: getFallback1 through getFallback15
// Lines from getFallback1 to renderHmap
write('05-fallbacks.js', L['function getFallback1'], L['function renderHmap']);

// 06-ui.js: renderHmap, showRaw
// Lines from renderHmap to runAgent1
write('06-ui.js', L['function renderHmap'], L['async function runAgent1']);

// 07-render-01.js: runAgent1 (demographics)
write('07-render-01.js', L['async function runAgent1'], L['async function runAgent5']);

// 08-render-02.js: (compliance = agent 5 in the file)
write('08-render-02.js', L['async function runAgent5'], L['async function runAgent6']);

// 09-render-03.js: (competitive intel = agent 6)
write('09-render-03.js', L['async function runAgent6'], L['async function runAgent2']);

// 10-render-04.js: runAgent2 (gap analysis)
write('10-render-04.js', L['async function runAgent2'], L['async function runAgent3']);

// 11-render-05.js: runAgent3 (site selection)
write('11-render-05.js', L['async function runAgent3'], L['async function runAgent4']);

// 12-render-06.js: runAgent4 (real estate)
write('12-render-06.js', L['async function runAgent4'], L['async function runAgent7']);

// 13-render-07.js: runAgent7 (financial)
write('13-render-07.js', L['async function runAgent7'], L['async function runAgent8']);

// 14-render-08.js: runAgent8 (executive summary)
write('14-render-08.js', L['async function runAgent8'], L['async function runAgent9']);

// 15-render-09.js: runAgent9 + renderBusinessPlan
write('15-render-09.js', L['async function runAgent9'], L['async function runAgent10']);

// 16-render-10.js: runAgent10 + renderProjectPlan + toggleCheck
// toggleCheck is at line 1892, renderProjectPlan at 1786
// runAgent10 starts at 1522, runAgent11 starts at 1902
write('16-render-10.js', L['async function runAgent10'], L['async function runAgent11']);

// 17-render-11.js: runAgent11 + gapCol + buildMap + buildMapLegend + buildDirections
write('17-render-11.js', L['async function runAgent11'], L['async function runAgent12']);

// 18-render-12.js: runAgent12 + buildGrantCard + buildGrants
write('18-render-12.js', L['async function runAgent12'], L['async function runAgent13']);

// 19-render-13.js: runAgent13 + buildCompDeepDive
write('19-render-13.js', L['async function runAgent13'], L['async function runAgent14']);

// 20-render-14.js: runAgent14 + renderCodeReview
write('20-render-14.js', L['async function runAgent14'], L['async function runAgent15']);

// 21-render-15.js: runAgent15 + renderQA
write('21-render-15.js', L['async function runAgent15'], L['async function runPipeline']);

// 22-pipeline.js: runPipeline + reRunAgent + exportResults + printReport + resetAll
// Lines from runPipeline to end
write('22-pipeline.js', L['async function runPipeline'], lines.length + 1);

console.log('\nDone! Created src/js/*.js files');
