# Business Hunter — CLAUDE.md

## What This Is

Business Hunter is a **17-agent AI pipeline** that evaluates market viability for opening a small business across **14 industries** near a target ZIP code. It runs entirely in the browser as a single static HTML file — no backend, no server, no database.

The user provides a ZIP code, industry, capacity, and budget. The pipeline runs 17 sequential AI agents (with parallel phases), each building on the previous, and produces an executive report with a Go / Cautious Go / No Go verdict.

---

## Architecture

```
src/
  styles.css           → All CSS
  template.html        → HTML skeleton with <!-- BUILD:CSS --> and <!-- BUILD:JS --> placeholders
  js/
    01-config.js       → INDUSTRIES config (14 industries), PROVIDERS config, global state, R.real init
    02-cache.js        → In-memory + localStorage response cache (4h TTL)
    03-utils.js        → ctx(), parseJSON(), $(), setDot(), showOut() helpers
    04-api.js          → claudeJSON() — multi-provider + strictSystem anti-hallucination injection; opts.webSearch adds web_search tool
    05-fallbacks.js    → getFallbackN() — hardcoded demo responses for all 17 agents
    06-ui.js           → _nv(), _nvNum() null-safe renderers; renderHmap() heatmap builder
    07-render-01.js    → Agent 1: Demographics (+ buildRealDataCtx health key)
    08-render-02.js    → Agent 5: Compliance + How to Apply tab
    09-render-03.js    → Agent 6: Competitive Intelligence (+ buildRealDataCtx health key)
    10-render-04.js    → Agent 2: Gap Analysis
    11-render-05.js    → Agent 3: Site Selection
    12-render-06.js    → Agent 4: Real Estate
    13-render-07.js    → Legacy stub — active Agent 7 logic is in 26-agent-fin-subs.js
    14-render-08.js    → Agent 8: Executive Summary (claudeStreamJSON + webSearch + flood/sba context)
    15-render-09.js    → Agent 9: Business Plan
    16-render-10.js    → Agent 10: Project Plan
    17-render-11.js    → Agent 11: Market Map (Leaflet.js)
    18-render-12.js    → Agent 12: Grant Search
    19-render-13.js    → Agent 13: Competitor Deep-Dive
    20-render-14.js    → Agent 14: Code Review (Part B webSearch for live pricing)
    21-render-15.js    → Agent 15: QA Validation
    22-pipeline.js     → Pipeline orchestration: 12 phases, phase gating, runPipeline(), reRunAgent()
    23-drilldown.js    → Expand button injection, agent drill-down modal, reasoning card builder
    24-agent-09-parts.js → Business Plan: 4 sub-agent calls (all with webSearch:true)
    25-agent-10-parts.js → Project Plan: 3 sub-agent calls
    26-agent-fin-subs.js → Agent 7 Financial Feasibility: 3 sub-agents + buildRealDataCtx + webSearch
    27-agent-buildvsbuy.js → Agent 16: Build vs Buy (Sub-call B has buildRealDataCtx + webSearch)
    28-agent-sources.js → Agent 17: Sources & Citations
    29-export.js        → Per-agent export (PDF/Word/Excel/Slides); runIndustryComparison()
    30-session.js       → Auto-save, session restore, shareable URL params
    31-full-export.js   → fullPipelineExport(): print-ready 17-agent document
    32-phases.js        → Phase checkboxes, phaseShouldRun(n), input validation, presets
    33-streaming.js     → claudeStream() SSE; claudeStreamJSON() — bypasses streaming when webSearch requested
    34-history.js       → Session history panel: last 5 runs
    35-compare-zip.js   → ZIP comparison mode
    36-demo-data.js     → Rich demo data for all 17 agents × 14 industries
    37-runs.js          → Persistent named pipeline runs (save/restore/delete, up to 10)
    38-dag.js           → Agent dependency graph (SVG DAG, live status)
    39-scenario.js      → Interactive financial scenario builder (Agent 7)
    40-local-guide.js   → Ollama/local LLM guide + data freshness badges
    41-agent-stress-guard.js → Stress-test protection: max_tokens truncation detection, JSON repair, retry logic
    43-real-data.js     → Real data pipeline: prefetch 17 government APIs → R.real; buildRealDataCtx(keys); rdShowDataStatus() badge panel
    44-verifier.js      → Accuracy verifier: 15 cross-checks AI outputs vs R.real; renders scored card in #realDataStatus
v2/
  src/js/              → v2-only additions (v2-01-state.js … v2-16-free-apis.js)
  public/index.html    → v2 built output
  build-v2.mjs         → Concatenates both src/js/*.js AND v2/src/js/*.js → v2/public/index.html
build.mjs              → Concatenates src/ → public/index.html (v1)
public/index.html      → v1 built output (the app; commit this)
vercel.json            → { "buildCommand": "node v2/build-v2.mjs", "outputDirectory": "v2/public" }
```

**Build commands:**
- **v1:** `node build.mjs` → `public/index.html`
- **v2:** `node v2/build-v2.mjs` → `v2/public/index.html` (uses both `src/js/*.js` and `v2/src/js/*.js`)

The v1 build reads `src/styles.css`, concatenates all `src/js/*.js` files in numeric order, and injects them into `src/template.html` via the placeholder comments.

**Vercel deployment** currently targets v2: `buildCommand: node v2/build-v2.mjs`, `outputDirectory: v2/public`.

**IMPORTANT:** `build.mjs` uses a function callback for `.replace()` to avoid corrupting JS template literals:
```javascript
html = html.replace('<!-- BUILD:JS -->', () => jsContent);
```

---

## Key Concepts

### INDUSTRIES config (`01-config.js`)

Fourteen industries: `daycare`, `gas_station`, `laundromat`, `car_wash`, `restaurant`, `gym`, `indoor_play`, `dry_cleaning`, `senior_care`, `tutoring`, `urgent_care`, `coffee_shop`, `barbershop`, `coworking`. Each has:
- `label`, `emoji`, `unit`, `units`
- `capacity_label`, `capacity_default`, `budget_default`
- `regulatory`, `regulatory_url`, `tiers_label`, `tiers`
- `compliance`, `grants`, `competitors`, `financials`, `staffing`, `real_estate`
- `revenue_unit`, `price_label_primary`, `price_label_secondary`

These fields are injected into every agent's prompt via `industry()` and string interpolation.

### PROVIDERS config (`01-config.js`)

Five AI providers: `anthropic`, `openai`, `deepseek`, `gemini`, `openai_compat`. Each implements:
- `url` / `url_custom` — endpoint
- `headers(key)` — request headers
- `buildBody(system, user, model)` — request body
- `extractText(d)` — parse response text
- `extractStop(d)` — parse stop reason

All providers use `max_tokens: 8192` (Gemini: `maxOutputTokens: 8192`).

### `claudeJSON()` (`04-api.js`)

The core API call function. Features:
- 3 retries with `attempt * 1500ms` exponential backoff
- Checks `stop_reason === 'max_tokens'` and throws before attempting JSON parse
- Hits in-memory cache first, then localStorage cache (4h TTL)
- **Demo mode**: skips API, parses JSON from the `Return ONLY:` marker in the user prompt

### Demo Mode JSON Parsing (`04-api.js`)

When `demoMode` is true, `claudeJSON()` parses the response template directly from the prompt:
```javascript
const marker = user.search(/Return ONLY[:\s]/i);
const src = marker >= 0 ? user.slice(marker) : user;
const d = parseJSON(src);
```

**Why the marker matters:** `ctx()` calls embed upstream agent JSON earlier in the prompt. Without the marker, `parseJSON` (which searches for the first `{`) would parse the ctx JSON instead of the template response JSON, causing crashes like `Cannot read properties of undefined (reading 'map')`.

### `ctx()` helper (`03-utils.js`)

Extracts specified fields from an upstream agent's result object:
```javascript
ctx(agentResult, ['summary', 'cities', 'top_chains'])
```
Returns a compact JSON string with only those fields. Used in every agent prompt to pass context without token bloat.

### Per-Agent Error Recovery (`22-pipeline.js`)

Every agent call in `runPipeline()` is individually wrapped:
```javascript
try {
  a1 = await runAgent1();
} catch(e) {
  a1 = JSON.stringify(getFallback1());
  console.warn('Agent 1 failed, using fallback:', e.message);
}
```
This lets the pipeline continue even if individual agents fail or return malformed JSON.

### Null Guards Pattern

Every `renderAgentN()` function starts with null guards on deeply nested response objects:
```javascript
const es = d.executive_summary || {};
const co = d.company_overview || {};
const ma = d.market_analysis || {};
const ms = ma.market_size || {};
```
Then use `es.mission`, `co.vision`, etc. — never `d.executive_summary.mission` directly.

---

## Pipeline Flow

```
Phase 1 (parallel):   Agents 1, 5, 6
  1. Demographics
  5. Compliance
  6. Competitive Intelligence

Phase 2 (sequential): Agent 2 — Gap Analysis
Phase 3 (sequential): Agent 3 — Site Selection
Phase 4 (sequential): Agent 4 — Real Estate
Phase 5 (sequential): Agent 7 — Financial Feasibility (3 sub-agents)
Phase 6 (sequential): Agent 8 — Executive Summary (streams via claudeStreamJSON)
Phase 7 (sequential): Agent 9 — Business Plan (4 sub-agents, all webSearch:true)
Phase 8 (sequential): Agent 10 — Project Plan (3 sub-agents)

Phase 9 (parallel):   Agents 11, 12, 13, 16
  11. Market Map
  12. Grant Search
  13. Competitor Deep-Dive
  16. Build vs Buy

Phase 11 (sequential): Agents 14, 15 — Code Review, QA Validation
Phase 12 (sequential): Agent 17 — Sources & Citations
```

Phases 10 is reserved. All 12 phases are gated by `phaseShouldRun(n)` in `32-phases.js`.

---

## Real Data Pipeline

`43-real-data.js` prefetches **17 live government APIs** before any agent runs and stores the results in `R.real`:

**Sources:** Census ACS, BLS QCEW, FRED (Federal Reserve), EIA (energy rates), FEMA/NFIP (flood risk), SBA FOIA (loan data), FBI CDE (crime), CDC PLACES (health), Open-Meteo (climate), OSM Overpass (competitor POIs), OpenStreetMap NPI (healthcare providers), and more.

`buildRealDataCtx(keys)` returns a formatted block injected into agent prompts:
```
══ VERIFIED REAL DATA ══
[key]: [verified value] (source: [API])
...
══ END REAL DATA ══
```

**Which agents use which keys:**

| Agent | Keys injected |
|-------|--------------|
| A1 (Demographics) | demographics, wages, macro, rents, flood, health |
| A5 (Compliance) | demographics |
| A6 (Competitive Intel) | competitors_osm, npi_providers, health |
| A7 (Financial Feasibility) | demographics, wages, macro, rents, energy_rates, energy_state, flood, climate, sba |
| A8 (Executive Summary) | demographics, wages, macro, rents, competitors_osm, npi_providers, flood, sba |
| A9 (Business Plan) | wages, rents, macro |
| A16 (Build vs Buy) | rents, wages, macro |

`rdShowDataStatus()` renders a badge panel showing which of the 17 sources loaded successfully.

### Accuracy Verifier

`44-verifier.js` cross-checks **15 specific fields** from AI agent outputs against `R.real` values (median income, population, rents, competitor counts, education %, renter %, SBA loan amounts, revenue projections, etc.) and renders a scored accuracy card in `#realDataStatus` after the pipeline completes. If a source fails to prefetch, the relevant agent falls back to webSearch for that data category.

---

## Common Tasks

### Add a new industry

Edit `INDUSTRIES` in `src/js/01-config.js`. Add a key with all required fields. The UI selector, all agent prompts, and the report are driven by this config — no other changes needed.

### Change max_tokens

Edit `buildBody` in each provider in `PROVIDERS` (`src/js/01-config.js`). All are currently `8192`. Gemini uses `maxOutputTokens` inside `generationConfig`.

### Update demo data for an agent

Edit the matching `getFallbackN()` function in `src/js/05-fallbacks.js`. The demo JSON must match the schema the agent's `Return ONLY:` template specifies — check `src/js/0N-render-0N.js` for the exact shape.

### Fix a rendering crash (`Cannot read properties of undefined`)

1. Find the agent's render function in `src/js/0N-render-0N.js`
2. Add null guards at the top: `const field = d.field || defaultValue`
3. Use the guarded variable throughout the render function

### Add a city to the market map

Edit the `cities` array in `src/js/17-render-11.js`. Each entry:
```javascript
{
  name: 'City Name',
  lat: 34.0615, lng: -83.7249,
  gap_score: 8,
  demand_score: 8, supply_score: 3,
  unserved_children: 420,
  median_income: 78000,
  competitor_count: 1,
  priority: 'High',
  recommended_action: 'Prime opportunity — act now',
  real_estate_url: 'https://...'
}
```

### Rebuild and preview

```bash
node build.mjs
# open public/index.html in browser
```

---

## Executive Report — Personalize Form

After Agent 8 runs, an `✏️ Personalize Report` toggle appears on the final report card. Fields:
- Business Name, Owner Name, Target Location (dropdown from Agent 3 results)
- Planned Opening (month/year), Equity Amount
- Contact Email, Notes

Saved to `localStorage` under key `bh_profile`. Restored on page load via `loadSavedProfile()`. Included in Export JSON and Print output. The rendered header card uses CSS class `.ph-wrap`.

Functions in `src/js/22-pipeline.js`: `toggleProfileForm()`, `applyProfile()`, `clearProfile()`, `loadSavedProfile()`, `populateLocationDropdown()`.

---

## Deployment

Hosted on Vercel as a static BYOK (bring your own key) app. The user enters their AI API key in the browser — it is never sent to any server other than the AI provider.

- `vercel.json`: `buildCommand: node v2/build-v2.mjs`, `outputDirectory: v2/public` (currently deploys v2)
- Zero npm dependencies — `build.mjs` uses only Node.js built-ins
- GitHub repo: `khalfancheema/Business-Hunter`

---

## Coding Rules

- **No npm dependencies** — keep the build zero-dependency; `build.mjs` uses only `node:fs` and `node:path`
- **No ES6 import/export** — all JS files are concatenated into one `<script>` block; use global scope
- **Always null-guard** nested response fields before rendering
- **Always use the `Return ONLY:` marker** in demo mode parsing — never assume position of JSON in a prompt
- **Rebuild after every JS/CSS/HTML change**: `node build.mjs`
- **Commit `public/index.html`** — it's the deployable artifact
