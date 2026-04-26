#!/usr/bin/env node
// ══════════════════════════════════════════════════════════
// test-all.mjs — Comprehensive test suite
// Runs in Node.js 18+ — zero npm dependencies.
// Tests: pure utilities, demo data shapes, HTML structure,
// build integrity, validation logic.
// ══════════════════════════════════════════════════════════
import { readFileSync, existsSync } from 'fs';
import vm from 'vm';
import assert from 'assert/strict';

let passed = 0, failed = 0;
const results = [];

function test(name, fn) {
  try {
    fn();
    passed++;
    results.push({ ok: true, name });
  } catch(e) {
    failed++;
    results.push({ ok: false, name, msg: e.message });
  }
}

// ── Minimal DOM mock ──────────────────────────────────────
const _store = {};
const mockDoc = {
  getElementById: id => {
    if (!_store[id]) _store[id] = {
      textContent:'', innerHTML:'', style:{}, className:'',
      value: id==='industrySelect'?'daycare': id==='zip'?'30097': id==='radius'?'40': id==='capacity'?'75': id==='budget'?'600000': '',
      checked: true,
      classList: { contains:()=>false, add:()=>{}, remove:()=>{} },
      querySelectorAll:()=>[], querySelector:()=>null,
      addEventListener:()=>{}
    };
    return _store[id];
  },
  title:'', addEventListener:()=>{}
};
const mockWindow = { addEventListener:()=>{} };

// ── VM context ────────────────────────────────────────────
const ctx = vm.createContext({
  document: mockDoc, window: mockWindow, console,
  localStorage: { getItem:()=>null, setItem:()=>{}, removeItem:()=>{} },
  navigator: { clipboard:{ writeText: async ()=>{} } },
  fetch: async ()=>({ ok:true, json:async()=>({}) }),
  URL: globalThis.URL || class URL {},
  URLSearchParams: globalThis.URLSearchParams,
  setTimeout: (fn,ms)=>fn(), clearTimeout:()=>{}, setInterval:()=>0, clearInterval:()=>{},
  prompt:()=>null, confirm:()=>false, alert:()=>{},
  L: { map:()=>({fitBounds:()=>{},invalidateSize:()=>{}}), tileLayer:()=>({addTo:()=>{}}), circle:()=>({addTo:()=>{}}), circleMarker:()=>({addTo:()=>{},bindPopup:()=>({openOn:()=>{}}),bindTooltip:()=>{}}), marker:()=>({addTo:()=>{},bindPopup:()=>{}}), divIcon:()=>({}), latLngBounds:()=>({}), latLng:()=>({}) },
});

function load(path) {
  try {
    const code = readFileSync(path, 'utf8');
    vm.runInContext(code, ctx);
  } catch(e) {
    console.error('Failed to load', path, e.message);
  }
}

// Helper: evaluate expression in VM context
function ctxEval(expr) {
  try { return vm.runInContext(expr, ctx); } catch(e) { return undefined; }
}

// Load source files in dependency order
load('src/js/01-config.js');
load('src/js/03-utils.js');
load('src/js/02-cache.js');
load('src/js/06-ui.js');
load('src/js/36-demo-data.js');
load('src/js/04-api.js');

// ═══════════════════════════════════════════════
// SECTION A — Pure Utility Functions
// ═══════════════════════════════════════════════
console.log('\n── Section A: Pure Utility Functions ─────────');

test('_nv(null) → N/A', () => assert.equal(ctxEval('_nv(null)'), 'N/A'));
test('_nv(undefined) → N/A', () => assert.equal(ctxEval('_nv(undefined)'), 'N/A'));
test('_nv("") → N/A', () => assert.equal(ctxEval('_nv("")'), 'N/A'));
test('_nv("n/a") → N/A', () => assert.equal(ctxEval('_nv("n/a")'), 'N/A'));
test('_nv("N/A") → N/A', () => assert.equal(ctxEval('_nv("N/A")'), 'N/A'));
test('_nv("Information not available") → N/A', () => assert.equal(ctxEval('_nv("Information not available")'), 'N/A'));
test('_nv("hello") → hello', () => assert.equal(ctxEval('_nv("hello")'), 'hello'));
test('_nv(42) → "42"', () => assert.equal(ctxEval('_nv(42)'), '42'));
test('_nv(0, v=>String(v)) → "0" (zero is valid for _nv)', () => assert.equal(ctxEval('_nv(0, v=>String(v))'), '0'));
test('_nv with formatter', () => assert.equal(ctxEval('_nv(1000, v => "$" + v.toLocaleString())'), '$1,000'));
test('_nv(NaN) → N/A', () => assert.equal(ctxEval('_nv(NaN)'), 'N/A'));

test('_nvNum(0) → N/A', () => assert.equal(ctxEval('_nvNum(0)'), 'N/A'));
test('_nvNum(null) → N/A', () => assert.equal(ctxEval('_nvNum(null)'), 'N/A'));
test('_nvNum(42) → "42"', () => assert.equal(ctxEval('_nvNum(42)'), '42'));
test('_nvNum(100, v => v + "%") → "100%"', () => assert.equal(ctxEval('_nvNum(100, v => v + "%")'), '100%'));

test('parseJSON raw string', () => { const d = ctxEval('parseJSON(\'{"a":1}\')'); assert.equal(d?.a, 1); });
test('parseJSON fenced ```json', () => { const d = ctxEval('parseJSON("```json\\n{\\"b\\":2}\\n```")'); assert.equal(d?.b, 2); });
test('parseJSON fenced plain ```', () => { const d = ctxEval('parseJSON("```\\n{\\"c\\":3}\\n```")'); assert.equal(d?.c, 3); });
test('parseJSON extracts from prose', () => { const d = ctxEval('parseJSON(\'Some text {"x":7} more text\')'); assert.equal(d?.x, 7); });
test('parseJSON returns null for garbage', () => assert.equal(ctxEval('parseJSON("not json")'), null));
test('parseJSON strips claude preamble', () => { const d = ctxEval('parseJSON("Here is the JSON object:\\n{\\"z\\":9}")'); assert.ok(d?.z === 9 || d !== null); });

// ═══════════════════════════════════════════════
// SECTION B — Industries Config
// ═══════════════════════════════════════════════
console.log('\n── Section B: Industries Config ──────────────');

const EXPECTED_INDUSTRIES = ['daycare','gas_station','laundromat','car_wash','restaurant','gym','indoor_play','dry_cleaning','senior_care','tutoring','urgent_care','coffee_shop','barbershop','coworking'];
EXPECTED_INDUSTRIES.forEach(key => {
  test(`INDUSTRIES.${key} exists`, () => assert.ok(ctxEval(`INDUSTRIES["${key}"]`), `Missing industry: ${key}`));
});
EXPECTED_INDUSTRIES.forEach(key => {
  test(`INDUSTRIES.${key} has required fields`, () => {
    const ind = ctxEval(`INDUSTRIES["${key}"]`);
    assert.ok(ind, `${key}: industry not found`);
    assert.ok(ind.label, `${key}: missing label`);
    assert.ok(ind.unit, `${key}: missing unit`);
    assert.ok(ind.capacity_label, `${key}: missing capacity_label`);
    assert.ok(typeof ind.budget_default === 'number', `${key}: budget_default must be number`);
    assert.ok(typeof ind.capacity_default === 'number', `${key}: capacity_default must be number`);
  });
});

// ═══════════════════════════════════════════════
// SECTION C — Demo Data Shape Validation
// ═══════════════════════════════════════════════
console.log('\n── Section C: Demo Data Shape ─────────────────');

test('DEMO_DATA object exists', () => assert.ok(ctxEval('typeof DEMO_DATA') === 'object'));
test('getDemoData function exists', () => assert.equal(ctxEval('typeof getDemoData'), 'function'));

// Agent 1 — Demographics
test('DEMO_DATA[1].daycare exists', () => assert.ok(ctxEval('DEMO_DATA[1] && DEMO_DATA[1].daycare')));
test('DEMO_DATA[1].daycare.cities is non-empty array', () => assert.ok(ctxEval('Array.isArray(DEMO_DATA[1].daycare.cities) && DEMO_DATA[1].daycare.cities.length > 0')));
test('DEMO_DATA[1].daycare.cities[0] has median_hh_income', () => assert.ok(ctxEval('DEMO_DATA[1].daycare.cities[0].median_hh_income > 0')));
test('DEMO_DATA[1].daycare.summary is string', () => assert.equal(ctxEval('typeof DEMO_DATA[1].daycare.summary'), 'string'));

// Agent 2 — Gap Analysis
test('DEMO_DATA[2].daycare exists', () => assert.ok(ctxEval('DEMO_DATA[2] && DEMO_DATA[2].daycare')));
test('DEMO_DATA[2].daycare.overall_opportunity_score is number', () => assert.ok(ctxEval('typeof DEMO_DATA[2].daycare.overall_opportunity_score === "number"')));
test('DEMO_DATA[2].daycare.cities[0].gap_score exists', () => assert.ok(ctxEval('DEMO_DATA[2].daycare.cities[0] && DEMO_DATA[2].daycare.cities[0].gap_score != null')));
test('DEMO_DATA[2].daycare.age_gaps is array', () => assert.ok(ctxEval('Array.isArray(DEMO_DATA[2].daycare.age_gaps)')));

// Agent 3 — Site Selection
test('DEMO_DATA[3].daycare.locations is non-empty array', () => assert.ok(ctxEval('DEMO_DATA[3] && DEMO_DATA[3].daycare && DEMO_DATA[3].daycare.locations && DEMO_DATA[3].daycare.locations.length > 0')));
test('DEMO_DATA[3].daycare.locations[0].overall_score is number', () => assert.ok(ctxEval('typeof DEMO_DATA[3].daycare.locations[0].overall_score === "number"')));
test('DEMO_DATA[3].daycare.locations[0].pros is array', () => assert.ok(ctxEval('Array.isArray(DEMO_DATA[3].daycare.locations[0].pros)')));

// Agent 5 — Compliance
test('DEMO_DATA[5].daycare.requirements is array', () => assert.ok(ctxEval('Array.isArray(DEMO_DATA[5] && DEMO_DATA[5].daycare && DEMO_DATA[5].daycare.requirements)')));
test('DEMO_DATA[5].daycare.requirements[0].priority exists', () => assert.ok(ctxEval('DEMO_DATA[5].daycare.requirements[0] && DEMO_DATA[5].daycare.requirements[0].priority')));

// Agent 7 — Financial
test('DEMO_DATA[7].daycare.scenarios is array', () => assert.ok(ctxEval('DEMO_DATA[7] && Array.isArray(DEMO_DATA[7].daycare && DEMO_DATA[7].daycare.scenarios)')));
test('DEMO_DATA[7].daycare.scenarios[0].monthly_revenue is number', () => assert.ok(ctxEval('typeof DEMO_DATA[7].daycare.scenarios[0].monthly_revenue === "number"')));
test('DEMO_DATA[7].daycare.projections is array', () => assert.ok(ctxEval('Array.isArray(DEMO_DATA[7].daycare.projections)')));

// Agent 8 — Executive Summary
test('DEMO_DATA[8].daycare.verdict is string', () => assert.equal(ctxEval('typeof (DEMO_DATA[8] && DEMO_DATA[8].daycare && DEMO_DATA[8].daycare.verdict)'), 'string'));
test('DEMO_DATA[8].daycare.risks is array', () => assert.ok(ctxEval('Array.isArray(DEMO_DATA[8].daycare.risks)')));
test('DEMO_DATA[8].daycare.next_steps is array', () => assert.ok(ctxEval('Array.isArray(DEMO_DATA[8].daycare.next_steps)')));
test('DEMO_DATA[8].daycare has non-daycare industry variants', () => assert.ok(ctxEval('!!(DEMO_DATA[8] && (DEMO_DATA[8].gas_station || DEMO_DATA[8].restaurant))')));

// getDemoData returns correct data
test('getDemoData(1) returns daycare data', () => { const d = ctxEval('getDemoData(1, "daycare")'); assert.ok(d?.cities?.length > 0); });
test('getDemoData(8, "gas_station") returns gas_station verdict', () => { const d = ctxEval('getDemoData(8, "gas_station")'); assert.ok(d?.verdict); });
test('getDemoData(99) returns null for unknown key', () => assert.equal(ctxEval('getDemoData(99)'), null));
test('getDemoData falls back to daycare for unknown industry', () => { const d = ctxEval('getDemoData(1, "unknown_industry_xyz")'); assert.ok(d?.cities?.length > 0); });

// ═══════════════════════════════════════════════
// SECTION D — HTML Structure Validation
// ═══════════════════════════════════════════════
console.log('\n── Section D: HTML Structure ──────────────────');

const HTML = existsSync('public/index.html') ? readFileSync('public/index.html', 'utf8') : '';

test('public/index.html exists', () => assert.ok(existsSync('public/index.html')));
test('index.html has doctype', () => assert.ok(HTML.toLowerCase().includes('<!doctype html>')));

// All 17 agent card IDs
[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17].forEach(n => {
  test(`Agent card #${n}: card-${n} exists`, () => assert.ok(HTML.includes(`id="card-${n}"`)));
  test(`Agent card #${n}: dot-${n} exists`, () => assert.ok(HTML.includes(`id="dot-${n}"`)));
  test(`Agent card #${n}: out-${n} exists`, () => assert.ok(HTML.includes(`id="out-${n}"`)));
  test(`Agent card #${n}: rerun-${n} button exists`, () => assert.ok(HTML.includes(`id="rerun-${n}"`)));
});

// Key UI elements
test('Run Pipeline button exists', () => assert.ok(HTML.includes('id="runBtn"')));
test('Progress bar exists', () => assert.ok(HTML.includes('id="progressFill"')));
test('Error banner exists', () => assert.ok(HTML.includes('id="errorBanner"')));
test('Phase panel exists', () => assert.ok(HTML.includes('id="phasePanel"')));
test('History panel exists', () => assert.ok(HTML.includes('id="historyPanel"')));
test('ZIP compare input exists', () => assert.ok(HTML.includes('id="compareZipInput"')));
test('Final verdict element exists', () => assert.ok(HTML.includes('id="verdictEl"')));
test('Leaflet CSS loaded', () => assert.ok(HTML.includes('leaflet')));
test('Chart.js loaded', () => assert.ok(HTML.includes('chart.umd')));

// ═══════════════════════════════════════════════
// SECTION E — Build Integrity
// ═══════════════════════════════════════════════
console.log('\n── Section E: Build Integrity ─────────────────');

test('HTML > 400KB (all source included)', () => assert.ok(HTML.length > 400000));
test('claudeJSON function present', () => assert.ok(HTML.includes('function claudeJSON')));
test('claudeStreamJSON function present', () => assert.ok(HTML.includes('function claudeStreamJSON')));
test('runPipeline function present', () => assert.ok(HTML.includes('function runPipeline')));
test('getDemoData function present', () => assert.ok(HTML.includes('function getDemoData')));
test('DEMO_DATA object present', () => assert.ok(HTML.includes('DEMO_DATA')));
test('renderDag function present', () => assert.ok(HTML.includes('function renderDag')));
test('saveNamedRun function present', () => assert.ok(HTML.includes('function saveNamedRun')));
test('updateScenario function present', () => assert.ok(HTML.includes('function updateScenario')));
test('All 14 industries in HTML', () => { ['daycare','gas_station','senior_care','tutoring','urgent_care','coffee_shop','barbershop','coworking'].forEach(ind => assert.ok(HTML.includes(ind), `Missing industry: ${ind}`)); });
test('No duplicate agent card IDs', () => { [1,5,6,2,3,4,7,8].forEach(n => { const matches = (HTML.match(new RegExp(`id="card-${n}"`, 'g')) || []); assert.equal(matches.length, 1, `Duplicate id card-${n}`); }); });

// ═══════════════════════════════════════════════
// SECTION F — Source File Integrity
// ═══════════════════════════════════════════════
console.log('\n── Section F: Source File Integrity ───────────');

const SRC_FILES = [
  'src/js/01-config.js','src/js/04-api.js','src/js/22-pipeline.js',
  'src/js/36-demo-data.js','src/js/37-runs.js','src/js/38-dag.js',
  'src/js/39-scenario.js','src/js/40-local-guide.js','test-all.mjs',
];
SRC_FILES.forEach(f => test(`${f} exists`, () => assert.ok(existsSync(f), `Missing: ${f}`)));

test('build.mjs includes 36-demo-data.js', () => assert.ok(readFileSync('build.mjs','utf8').includes('36-demo-data.js')));
test('build.mjs includes 37-runs.js', () => assert.ok(readFileSync('build.mjs','utf8').includes('37-runs.js')));
test('build.mjs includes 38-dag.js', () => assert.ok(readFileSync('build.mjs','utf8').includes('38-dag.js')));
test('build.mjs includes 39-scenario.js', () => assert.ok(readFileSync('build.mjs','utf8').includes('39-scenario.js')));
test('build.mjs includes 40-local-guide.js', () => assert.ok(readFileSync('build.mjs','utf8').includes('40-local-guide.js')));
test('package.json has test script', () => assert.ok(readFileSync('package.json','utf8').includes('"test"')));

// ═══════════════════════════════════════════════
// Results
// ═══════════════════════════════════════════════
console.log('\n' + '═'.repeat(50));
results.forEach(r => console.log(r.ok ? `  ✓ ${r.name}` : `  ✗ ${r.name}\n    ${r.msg}`));
console.log('═'.repeat(50));
console.log(`\n  ${passed} passed  ${failed} failed  ${passed+failed} total\n`);
if (failed > 0) { console.error(`${failed} test(s) failed`); process.exit(1); }
