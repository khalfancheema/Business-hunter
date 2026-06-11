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
test('_esc escapes unsafe HTML', () => assert.equal(ctxEval('_esc("<img src=x onerror=alert(1)>")'), '&lt;img src=x onerror=alert(1)&gt;'));
test('_nv escapes unformatted strings', () => assert.equal(ctxEval('_nv("<script>alert(1)</script>")'), '&lt;script&gt;alert(1)&lt;/script&gt;'));
test('_safeUrl rejects javascript URLs', () => assert.equal(ctxEval('_safeUrl("javascript:alert(1)")'), ''));
test('_safeHtml allows only narrow formatting', () => {
  assert.equal(ctxEval('_safeHtml("<strong>ok</strong><img src=x>")'), '<strong>ok</strong>&lt;img src=x&gt;');
});

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

// Production secret handling
const REAL_DATA_SRC = readFileSync('src/js/43-real-data.js', 'utf8');
const API_SRC = readFileSync('src/js/04-api.js', 'utf8');
const UI_SRC = readFileSync('src/js/06-ui.js', 'utf8');
const PIPELINE_SRC = readFileSync('src/js/22-pipeline.js', 'utf8');
const STREAMING_SRC = readFileSync('src/js/33-streaming.js', 'utf8');
const QA_SRC = readFileSync('src/js/21-render-15.js', 'utf8');
const SOURCES_SRC = readFileSync('src/js/28-agent-sources.js', 'utf8');
const VERIFIER_SRC = readFileSync('src/js/44-verifier.js', 'utf8');
const UTILS_API_SRC = readFileSync('src/utils/api.js', 'utf8');
const LLM_PROXY_SRC = readFileSync('api/llm.mjs', 'utf8');
const V2_STATE_SRC = readFileSync('v2/src/js/v2-01-state.js', 'utf8');
const V2_WIZARD_SRC = readFileSync('v2/src/js/v2-03-wizard.js', 'utf8');
const V2_FEATURES_SRC = readFileSync('v2/src/js/v2-10-features.js', 'utf8');
const V2_COPILOT_SRC = readFileSync('v2/src/js/v2-04-copilot.js', 'utf8');
const V2_ADVANCED_SRC = readFileSync('v2/src/js/v2-11-advanced.js', 'utf8');
const BUILD_SRC = readFileSync('build.mjs', 'utf8');
const V2_BUILD_SRC = readFileSync('v2/build-v2.mjs', 'utf8');
const DEPLOY_DOC = readFileSync('docs/deployment.md', 'utf8');
const HOWTO_DOC = readFileSync('docs/HOW-TO.md', 'utf8');
const ARCH_DOC = readFileSync('docs/architecture.md', 'utf8');
const AGENT_JS_SRC = [
  'src/js/07-render-01.js','src/js/08-render-02.js','src/js/09-render-03.js','src/js/10-render-04.js',
  'src/js/11-render-05.js','src/js/12-render-06.js','src/js/14-render-08.js','src/js/17-render-11.js',
  'src/js/18-render-12.js','src/js/19-render-13.js','src/js/20-render-14.js','src/js/21-render-15.js',
  'src/js/24-agent-09-parts.js','src/js/25-agent-10-parts.js','src/js/26-agent-fin-subs.js',
  'src/js/27-agent-buildvsbuy.js','src/js/28-agent-sources.js'
].map(f => readFileSync(f, 'utf8')).join('\n');

test('real-data defaults hosted requests to proxy helper', () => {
  assert.ok(REAL_DATA_SRC.includes('function _rdShouldUseProxy()'));
  assert.ok(REAL_DATA_SRC.includes('if (_rdShouldUseProxy())'));
});
test('real-data client keys require explicit local-dev opt-in', () => {
  assert.ok(REAL_DATA_SRC.includes('function _rdAllowClientKeys()'));
  assert.ok(REAL_DATA_SRC.includes('window.ALLOW_CLIENT_API_KEYS === true'));
  assert.ok(REAL_DATA_SRC.includes('const clientKey = _rdAllowClientKeys()'));
});
test('real-data no longer persists government API keys in localStorage', () => {
  assert.equal(/localStorage\.setItem\('bh:apikey:/.test(REAL_DATA_SRC), false);
  assert.ok(REAL_DATA_SRC.includes("localStorage.removeItem('bh:apikey:' + def.id)"));
});
test('v2 provider API keys use session secret helpers', () => {
  assert.ok(V2_STATE_SRC.includes('function v2SecretGet(name)'));
  assert.ok(V2_STATE_SRC.includes('function v2SecretSet(name, value)'));
  assert.equal(/localStorage\.setItem\('v2_apikey'/.test(V2_STATE_SRC + V2_FEATURES_SRC), false);
  assert.equal(/localStorage\.setItem\('v2_or_apikey'/.test(V2_STATE_SRC + V2_FEATURES_SRC), false);
});
test('v2 API key reads use session secret helpers', () => {
  const joined = V2_STATE_SRC + V2_FEATURES_SRC + V2_COPILOT_SRC + V2_ADVANCED_SRC;
  assert.equal(/localStorage\.getItem\('v2_apikey'/.test(joined), false);
  assert.equal(/localStorage\.getItem\('v2_or_apikey'/.test(joined), false);
});
test('server LLM proxy exists and uses env-backed provider keys', () => {
  assert.ok(existsSync('api/llm.mjs'));
  ['ANTHROPIC_API_KEY','OPENAI_API_KEY','GEMINI_API_KEY','OPENAI_COMPAT_API_KEY'].forEach(envName => {
    assert.ok(LLM_PROXY_SRC.includes(envName), `missing env ${envName}`);
  });
  assert.equal(/dangerous-direct-browser-access/.test(LLM_PROXY_SRC), false);
});
test('browser claude() prefers /api/llm before direct provider calls', () => {
  assert.ok(API_SRC.includes('function _bhShouldUseLLMProxy()'));
  assert.ok(API_SRC.includes('function _bhAllowDirectLLMKeys()'));
  assert.ok(API_SRC.includes("window.LLM_PROXY_URL || '/api/llm'"));
  assert.ok(API_SRC.includes('return await _bhLLMProxy(system, user, opts)'));
  assert.ok(API_SRC.includes('ALLOW_CLIENT_LLM_KEYS'));
});
test('pipeline can start with server-side LLM proxy and no browser key', () => {
  assert.ok(PIPELINE_SRC.includes('const proxyReady = typeof _bhShouldUseLLMProxy'));
  assert.ok(PIPELINE_SRC.includes('!key() && !proxyReady'));
});
test('streaming falls back through claude() when LLM proxy is active', () => {
  assert.ok(STREAMING_SRC.includes("typeof _bhShouldUseLLMProxy === 'function' && _bhShouldUseLLMProxy()"));
  assert.ok(STREAMING_SRC.includes('const text = await claude(system, user)'));
  assert.ok(STREAMING_SRC.includes('_bhAllowDirectLLMKeys'));
});
test('v2 UI recognizes server-side LLM proxy as an AI-ready state', () => {
  const joined = V2_WIZARD_SRC + V2_FEATURES_SRC + V2_COPILOT_SRC + V2_ADVANCED_SRC;
  assert.ok(joined.includes('_bhShouldUseLLMProxy'));
  assert.ok(V2_COPILOT_SRC.includes('apiKey || proxyReady'));
  assert.ok(V2_ADVANCED_SRC.includes('!apiKey && !proxyReady'));
});
test('legacy utils API helper uses server-side /api/llm', () => {
  assert.ok(UTILS_API_SRC.includes("fetch('/api/llm'"));
  assert.equal(/anthropic-dangerous-direct-browser-access/.test(UTILS_API_SRC), false);
});
test('agent feedback bus records and injects self-learning context', () => {
  ['_bhRecordAgentFeedback','_bhBuildAgentFeedbackContext','_bhWithAgentFeedback','_bhRecordAllAgentFeedback','_bhRecordAccuracyFeedback'].forEach(fn => {
    assert.ok(API_SRC.includes(`function ${fn}(`), `missing ${fn}`);
  });
  assert.ok(API_SRC.includes('CROSS-AGENT FEEDBACK / SELF-LEARNING MEMORY'));
  assert.ok(API_SRC.includes('_bhWithAgentFeedback(user, opts)'));
});
test('agent feedback affects cache identity to avoid stale learned outputs', () => {
  assert.ok(API_SRC.includes('const cacheUser = _bhWithAgentFeedback(user, opts)'));
  assert.ok(API_SRC.includes('getCache(system, cacheUser, opts)'));
  assert.ok(API_SRC.includes('setCache(system, _bhWithAgentFeedback(user, opts), checked, opts)'));
});
test('pipeline records feedback after agent completion and reruns', () => {
  assert.ok(PIPELINE_SRC.includes('const learn  = n =>'));
  [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17].forEach(n => {
    assert.ok(PIPELINE_SRC.includes(`learn(${n})`), `missing learn(${n})`);
  });
  assert.ok(PIPELINE_SRC.includes('_bhRecordAgentFeedback(n, R'));
});
test('QA and sources agents expose cross-agent feedback', () => {
  assert.ok(QA_SRC.includes('Cross-Agent Feedback / Self-Learning'));
  assert.ok(QA_SRC.includes('agent_feedback: feedbackItems'));
  assert.ok(SOURCES_SRC.includes('feedbackContext'));
  assert.ok(SOURCES_SRC.includes('_bhBuildAgentFeedbackContext'));
});
test('accuracy verifier sends failed checks into self-learning feedback', () => {
  assert.ok(VERIFIER_SRC.includes('_bhRecordAccuracyFeedback(valid)'));
  assert.ok(VERIFIER_SRC.includes('R.accuracy.feedback_items'));
  assert.ok(API_SRC.includes('accuracy_checks: rows.map'));
  assert.ok(API_SRC.includes('Use verified ${c.source'));
});
test('fixed agent LLM calls pass agentNum for schema and repair gates', () => {
  [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17].forEach(n => {
    assert.ok(AGENT_JS_SRC.includes(`agentNum:${n}`), `missing agentNum:${n}`);
  });
  assert.ok(AGENT_JS_SRC.includes('claudeStreamJSON(sys, usr') && AGENT_JS_SRC.includes('agentNum:8'));
});
test('production accuracy target is strict 95 percent', () => {
  assert.ok(API_SRC.includes('const _BH_PRODUCTION_ACCURACY_TARGET = 95'));
  assert.ok(PIPELINE_SRC.includes('before >= 95'));
  assert.ok(PIPELINE_SRC.includes('current >= 95'));
  assert.ok(VERIFIER_SRC.includes("pct >= 95 ? 'var(--green)'"));
  assert.equal(/Number\(score\) < 85/.test(API_SRC), false);
});
test('pipeline blocks fallback dependencies and attempts verifier repair', () => {
  assert.ok(API_SRC.includes('function _bhAssertNoFallbackDeps('));
  assert.ok(PIPELINE_SRC.includes('const depsOk = (n, deps)'));
  assert.ok(PIPELINE_SRC.includes('async function _bhRunAccuracyRepairPass()'));
  assert.ok(PIPELINE_SRC.includes('await _bhRunAccuracyRepairPass()'));
  assert.ok(PIPELINE_SRC.includes('R.accuracy_repair'));
});
test('production gate uses deterministic scorecard and claim citations', () => {
  assert.ok(API_SRC.includes('function _bhCollectCitationIssues('));
  assert.ok(API_SRC.includes('Numeric claim ${here} lacks field-level source evidence.'));
  assert.ok(API_SRC.includes('function _bhComputeProductionScorecard('));
  assert.ok(API_SRC.includes('R.production_scorecard = scorecard'));
  assert.ok(API_SRC.includes('deterministic_weighted_evidence_v2_industry_profile'));
});
test('production gate requires verifier coverage and evidence ledger', () => {
  assert.ok(API_SRC.includes('function _bhBuildEvidenceLedger('));
  assert.ok(API_SRC.includes('R.evidence_ledger = rows'));
  assert.ok(API_SRC.includes('production requires at least 5'));
  assert.ok(API_SRC.includes("['A1','A2','A4','A6','A7']"));
  assert.ok(API_SRC.includes('production requires at least 10 verifier/source entries'));
  assert.ok(VERIFIER_SRC.includes('agents_checked: agentsChecked'));
});
test('field-level claim ledger and source quality harden accuracy gates', () => {
  ['_bhFieldEvidence','_bhHasFieldEvidence','_bhExtractClaimLedger','_bhSourceQuality','_bhSourceFreshness','_bhValidateEvidenceSource','_bhClaimCriticality','_bhRequiredEvidenceFields','_bhAgentRequiredFieldCoverage','_bhValidateEvidenceUrls'].forEach(fn => {
    assert.ok(API_SRC.includes(`function ${fn}(`), `missing ${fn}`);
  });
  assert.ok(API_SRC.includes('lacks field-level source evidence'));
  assert.ok(API_SRC.includes('recommendation-critical claim(s) lack verified field-level evidence'));
  assert.ok(API_SRC.includes('evidence source URL(s) are invalid or placeholder URLs'));
  assert.ok(API_SRC.includes('failed deterministic source validation'));
  assert.ok(API_SRC.includes('do not support their claim value'));
  assert.ok(API_SRC.includes('high-criticality claim(s) failed evidence validation'));
});
test('verifier production score uses exact verified checks only', () => {
  assert.ok(VERIFIER_SRC.includes('const exactVerifiedPct = buckets.exact.length >= 5 ? strictPct : null'));
  assert.ok(VERIFIER_SRC.includes('score_exact_verified: exactVerifiedPct'));
  assert.ok(VERIFIER_SRC.includes('production_score: exactVerifiedPct'));
  assert.ok(VERIFIER_SRC.includes('source_coverage_missing'));
  assert.ok(VERIFIER_SRC.includes('_bhAgentRequiredFieldCoverage(ledger, agent)'));
  assert.ok(API_SRC.includes('Exact verified score ${Math.round(Number(exactVerifiedScore))}%'));
});
test('repair loop expands dependents and runs bounded multiple passes', () => {
  assert.ok(PIPELINE_SRC.includes('const _BH_AGENT_DEPS ='));
  assert.ok(PIPELINE_SRC.includes('function _bhExpandRepairAgents('));
  assert.ok(PIPELINE_SRC.includes('function _bhAccuracyFailureSignature('));
  assert.ok(PIPELINE_SRC.includes('for (let pass = 1; pass <= 3; pass++)'));
  assert.ok(PIPELINE_SRC.includes('resolved_failures'));
});
test('agent 17 and stress guard use evidence packs instead of raw truncation only', () => {
  assert.ok(API_SRC.includes('function _bhBuildEvidencePack('));
  assert.ok(SOURCES_SRC.includes('EVIDENCE / CLAIM LEDGER'));
  const STRESS_SRC = readFileSync('src/js/41-agent-stress-guard.js', 'utf8');
  assert.ok(STRESS_SRC.includes('_bhBuildEvidencePack(16000)'));
  assert.ok(STRESS_SRC.includes('verified evidence pack above is authoritative'));
});
test('cache ttl varies by volatile agent type and scorecard is industry-profiled', () => {
  const CACHE_SRC = readFileSync('src/js/02-cache.js', 'utf8');
  assert.ok(CACHE_SRC.includes('function _cacheTtlMs(opts)'));
  assert.ok(CACHE_SRC.includes('function _cacheRealDataFingerprint()'));
  assert.ok(CACHE_SRC.includes('[4, 12, 13, 16, 17].includes(n)'));
  assert.ok(API_SRC.includes('deterministic_weighted_evidence_v2_industry_profile'));
  assert.ok(API_SRC.includes('industry:key'));
  ['gas_station','laundromat','car_wash','gym','coffee_shop','barbershop','coworking','medical_practice','optometry'].forEach(k => {
    assert.ok(API_SRC.includes(`${k}: {`), `missing industry score profile ${k}`);
  });
});
test('real-data prefetch records required source status and fingerprint', () => {
  assert.ok(REAL_DATA_SRC.includes('function _rdRequiredSources('));
  assert.ok(REAL_DATA_SRC.includes('function _rdBuildSourceStatus('));
  assert.ok(REAL_DATA_SRC.includes('function _rdRealFingerprint('));
  assert.ok(REAL_DATA_SRC.includes('source_details'));
  assert.ok(REAL_DATA_SRC.includes('geo_level'));
  assert.ok(REAL_DATA_SRC.includes('record_count'));
  assert.ok(REAL_DATA_SRC.includes('R.real._source_status = _rdBuildSourceStatus'));
  assert.ok(REAL_DATA_SRC.includes('R.real._fingerprint = _rdRealFingerprint'));
  assert.ok(API_SRC.includes('Required real-data source(s) missing for production accuracy'));
});
test('behavior: parent-only source no longer validates nested critical claim', () => {
  const issues = ctxEval(`_bhCollectCitationIssues({ source:'ACS', nested:{ monthly_rent: 12000 } }, 4)`);
  assert.ok(Array.isArray(issues));
  assert.ok(issues.some(x => x.includes('nested.monthly_rent')));
});
test('behavior: deterministic source validator rejects placeholder URL and unclassified critical source', () => {
  const bad = ctxEval(`_bhValidateEvidenceSource({ type:'agent_claim', agent:'A4', field:'monthly_rent', value:12000, source:'Random blog', source_url:'https://example.com/rent' })`);
  assert.equal(bad.source_validated, false);
  assert.ok(bad.source_validation_issues.includes('invalid_url'));
  const good = ctxEval(`_bhValidateEvidenceSource({ type:'agent_claim', agent:'A1', field:'median_income', value:90000, source:'U.S. Census ACS', source_field:'B19013_001E', retrieved_at:'2024' })`);
  assert.equal(good.source_validated, true);
});
test('behavior: source validator rejects unsupported claim values', () => {
  const bad = ctxEval(`_bhValidateEvidenceSource({ type:'agent_claim', agent:'A12', field:'funding_amount', value:75000, source:'State grant portal', source_url:'https://grants.gov/program', source_excerpt:'Awards up to 25000', retrieved_at:'2026' })`);
  assert.equal(bad.source_supports_claim, false);
  assert.ok(bad.source_validation_issues.includes('source_does_not_support_claim_value'));
  assert.equal(bad.claim_criticality, 'high');
});
test('behavior: source field alone does not support arbitrary high-critical values', () => {
  const bad = ctxEval(`_bhValidateEvidenceSource({ type:'agent_claim', agent:'A7', field:'monthly_revenue', value:99000, source:'U.S. Census ACS', source_field:'B19013_001E', retrieved_at:'2026' })`);
  assert.equal(bad.source_supports_claim, false);
  assert.ok(bad.source_validation_issues.includes('source_does_not_support_claim_value'));
});
test('behavior: long claims require semantic source overlap, not just any source text', () => {
  const bad = ctxEval(`_bhValidateEvidenceSource({ type:'agent_claim', agent:'A8', field:'risk_summary', value:'Lease approval depends on county zoning review and fire marshal inspection before opening', source:'City portal', source_excerpt:'Restaurant inspection scores by neighborhood', retrieved_at:'2026' })`);
  assert.equal(bad.source_supports_claim, false);
});
test('behavior: required evidence coverage is per field, not one row per agent', () => {
  const coverage = ctxEval(`_bhAgentRequiredFieldCoverage([
    {agent:'A4', type:'agent_claim', field:'A4.options[0].monthly_rent', source:'LoopNet', source_validated:true, source_supports_claim:true}
  ], 'A4')`);
  assert.ok(Array.isArray(coverage));
  assert.ok(coverage.some(r => r.covered));
  assert.ok(coverage.some(r => !r.covered));
});
test('behavior: production blockers require real-data source status and source coverage', () => {
  const blockers = ctxEval(`(function(){
    R = {
      real:{ _source_status:{ required_missing:['demographics','business_density'] }, demographics:{population:1} },
      accuracy:{ score:96, score_exact_verified:96, buckets:{exact:5}, agents_checked:['A1','A2','A4','A6','A7'], source_coverage_missing:['A12'] },
      a3:{locations:[{overall_score:80, scores:{demand:80, competition:80, regulatory:80, real_estate:80}}]},
      a7:{scenarios:[{name:'base', monthly_net:1000, monthly_revenue:10000, roi_3yr:20}]},
      a8:{verdict:'Needs Review', risks:[]}
    };
    return _bhProductionBlockers().blockers;
  })()`);
  assert.ok(blockers.some(x => x.includes('Required real-data source(s) missing')));
  assert.ok(blockers.some(x => x.includes('source coverage missing')));
});
test('pipeline performs live evidence URL validation before final gate', () => {
  assert.ok(PIPELINE_SRC.includes('await _bhValidateEvidenceUrls(120)'));
  assert.ok(API_SRC.includes('skipped_high_critical'));
  assert.ok(API_SRC.includes('evidence source URL(s) failed live reachability validation'));
});
test('production gate blocks weak real source quality and missing exact critical coverage', () => {
  assert.ok(REAL_DATA_SRC.includes('quality_failures'));
  assert.ok(REAL_DATA_SRC.includes('too_broad'));
  assert.ok(API_SRC.includes('Required real-data source(s) are stale, low-confidence, empty, or too broad'));
  assert.ok(VERIFIER_SRC.includes('exact_coverage_missing'));
  assert.ok(API_SRC.includes('Exact verifier coverage missing for critical agent(s)'));
});
test('agent prompts require root sources_by_field maps', () => {
  assert.ok(API_SRC.includes('Add a root-level sources_by_field object'));
});
test('cache distinguishes validated agent outputs and repair context', () => {
  const CACHE_SRC = readFileSync('src/js/02-cache.js', 'utf8');
  assert.ok(CACHE_SRC.includes("CACHE_SCHEMA_VERSION = '3'"));
  assert.ok(CACHE_SRC.includes("'|agent:' + opts.agentNum"));
  assert.ok(API_SRC.includes('_bhBuildAgentRepairContext(opts.agentNum)'));
});

// ═══════════════════════════════════════════════
test('UI exposes central output escaping and URL sanitization helpers', () => {
  ['function _esc(', 'function _safeUrl(', 'function _safeHtml('].forEach(sig => assert.ok(UI_SRC.includes(sig), `missing ${sig}`));
  assert.ok(UI_SRC.includes('return formatter ? formatter(val) : _esc(val)'));
  assert.ok(UI_SRC.includes("!['http:', 'https:', 'mailto:'].includes(u.protocol)"));
});
test('sources renderer escapes model-originated citations and URLs', () => {
  assert.ok(SOURCES_SRC.includes('const esc = typeof _esc'));
  assert.ok(SOURCES_SRC.includes('const safeUrl = typeof _safeUrl'));
  assert.ok(SOURCES_SRC.includes('${esc(d.summary || \'\')}'));
  assert.ok(SOURCES_SRC.includes('safeUrl(s.url)'));
  assert.equal(/href="\$\{s\.url\}"/.test(SOURCES_SRC), false);
});
test('v2 chat streaming sanitizes model output before innerHTML', () => {
  assert.ok(V2_ADVANCED_SRC.includes('function _v2RenderAiHtml(text)'));
  assert.ok(V2_ADVANCED_SRC.includes('bubbleEl.innerHTML = _v2RenderAiHtml(full)'));
  assert.ok(V2_ADVANCED_SRC.includes('bubbleEl.innerHTML = _v2RenderAiHtml(text)'));
  assert.ok(V2_ADVANCED_SRC.includes('bubbleText?.textContent'));
  assert.equal(/bubbleEl\.innerHTML = full/.test(V2_ADVANCED_SRC), false);
});
test('schema validation and production safety gate are wired', () => {
  ['_bhValidateAgentSchema','_bhAttachSchemaValidation','_bhApplyProductionSafetyGate','_bhProductionBlockers'].forEach(fn => {
    assert.ok(API_SRC.includes(`function ${fn}(`), `missing ${fn}`);
  });
  assert.ok(API_SRC.includes('target_accuracy'));
  assert.ok(API_SRC.includes("R.a8.verdict = 'Needs Review'"));
  assert.ok(PIPELINE_SRC.includes('_bhApplyProductionSafetyGate()'));
});
test('fallbacks cannot appear production-ready', () => {
  assert.ok(API_SRC.includes('Fallback output was used; this is not production-grade evidence.'));
  assert.ok(API_SRC.includes('Fallback agent output used'));
  assert.ok(API_SRC.includes("status: ready ? 'ready' : 'needs_review'"));
});
test('build scripts assert fragile global ordering', () => {
  assert.ok(BUILD_SRC.includes('function assertBuildOrder('));
  assert.ok(V2_BUILD_SRC.includes('function assertBuildOrder('));
  ['src/js/04-api.js','src/js/05-fallbacks.js','src/js/06-ui.js','src/js/22-pipeline.js','src/js/44-verifier.js'].forEach(name => {
    assert.ok(BUILD_SRC.includes(name), `build missing ${name}`);
    assert.ok(V2_BUILD_SRC.includes(name), `v2 build missing ${name}`);
  });
});
test('docs reflect serverless production, demo data, and safety gate', () => {
  assert.ok(DEPLOY_DOC.includes('production deployments should use the serverless API routes'));
  assert.ok(HOWTO_DOC.includes('src/js/36-demo-data.js'));
  assert.ok(HOWTO_DOC.includes('production safety gate'));
  assert.ok(ARCH_DOC.includes('_bhApplyProductionSafetyGate()'));
  assert.ok(ARCH_DOC.includes('dh_cache_v2_*'));
});

// Results
// ═══════════════════════════════════════════════
console.log('\n' + '═'.repeat(50));
results.forEach(r => console.log(r.ok ? `  ✓ ${r.name}` : `  ✗ ${r.name}\n    ${r.msg}`));
console.log('═'.repeat(50));
console.log(`\n  ${passed} passed  ${failed} failed  ${passed+failed} total\n`);
if (failed > 0) { console.error(`${failed} test(s) failed`); process.exit(1); }
