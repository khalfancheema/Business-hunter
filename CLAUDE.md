# Business Hunter — CLAUDE.md

## What This Is

Business Hunter is a **15-agent AI pipeline** that evaluates market viability for opening a small business (daycare, gas station, laundromat, car wash, restaurant, gym) near a target ZIP code. It runs entirely in the browser as a single static HTML file — no backend, no server, no database.

The user provides a ZIP code, industry, capacity, and budget. The pipeline runs 15 sequential AI agents (with two parallel phases), each building on the previous, and produces an executive report with a Go / Cautious Go / No Go verdict.

---

## Architecture

```
src/
  styles.css           → All CSS
  template.html        → HTML skeleton with <!-- BUILD:CSS --> and <!-- BUILD:JS --> placeholders
  js/
    01-config.js       → INDUSTRIES config, PROVIDERS config, global state vars
    02-cache.js        → In-memory + localStorage response cache (4h TTL)
    03-utils.js        → ctx(), parseJSON(), $(), setDot(), showOut() helpers
    04-api.js          → claudeJSON() — calls AI API with 3 retries + exponential backoff
    05-fallbacks.js    → getFallbackN() — hardcoded demo responses for all 15 agents
    06-ui.js           → UI event handlers, tab switching, industry selector, key storage
    07-render-01.js    → Agent 1: Demographics
    08-render-02.js    → Agent 2: Gap Analysis
    09-render-03.js    → Agent 3: Location Scoring
    10-render-04.js    → Agent 4: Real Estate
    11-render-05.js    → Agent 5: Regulatory
    12-render-06.js    → Agent 6: Competitor Analysis
    13-render-07.js    → Agent 7: Financial Projections
    14-render-08.js    → Agent 8: Executive Summary (verdict + final report)
    15-render-09.js    → Agent 9: Business Plan
    16-render-10.js    → Agent 10: Marketing Strategy
    17-render-11.js    → Agent 11: Market Map (Leaflet.js pins)
    18-render-12.js    → Agent 12: Risk Assessment
    19-render-13.js    → Agent 13: Operations Playbook
    20-render-14.js    → Agent 14: Code Review (meta-agent reviewing the pipeline)
    21-render-15.js    → Agent 15: QA Report
    22-pipeline.js     → runPipeline(), per-agent try/catch, profile form, export, print
build.mjs              → Concatenates src/ → public/index.html
public/index.html      → Built output (the app; commit this)
vercel.json            → { "buildCommand": "node build.mjs", "outputDirectory": "public" }
```

**Build command:** `node build.mjs`

The build reads `src/styles.css`, concatenates all `src/js/*.js` files in numeric order, and injects them into `src/template.html` via the placeholder comments. The result is written to `public/index.html`.

**IMPORTANT:** `build.mjs` uses a function callback for `.replace()` to avoid corrupting JS template literals:
```javascript
html = html.replace('<!-- BUILD:JS -->', () => jsContent);
```

---

## Key Concepts

### INDUSTRIES config (`01-config.js`)

Six industries: `daycare`, `gas_station`, `laundromat`, `car_wash`, `restaurant`, `gym`. Each has:
- `label`, `emoji`, `unit`, `units`
- `capacity_label`, `capacity_default`, `budget_default`
- `regulatory`, `regulatory_url`, `tiers_label`, `tiers`
- `compliance`, `grants`, `competitors`, `financials`, `staffing`, `real_estate`
- `revenue_unit`, `price_label_primary`, `price_label_secondary`

These fields are injected into every agent's prompt via `industry()` and string interpolation.

### PROVIDERS config (`01-config.js`)

Four AI providers: `anthropic`, `openai`, `gemini`, `openai_compat`. Each implements:
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
Phase 1 (sequential): Agents 1–7
  1. Demographics
  2. Gap Analysis
  3. Location Scoring
  4. Real Estate
  5. Regulatory
  6. Competitor Analysis
  7. Financial Projections

Phase 2 (Executive Report): Agent 8
  8. Executive Summary → verdict + final report card

Phase 3 (parallel): Agents 9–13
  9.  Business Plan
  10. Marketing Strategy
  11. Market Map
  12. Risk Assessment
  13. Operations Playbook

Phase 4 (meta): Agents 14–15
  14. Code Review (reviews the pipeline itself)
  15. QA Report
```

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

- `vercel.json`: `buildCommand: node build.mjs`, `outputDirectory: public`
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
