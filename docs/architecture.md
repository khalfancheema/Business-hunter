# Pipeline Architecture

## Overview

```
User Input (ZIP · Industry · Radius · Capacity · Budget)
         │
         ▼  [Input validation — 32-phases.js]
         │
┌────────────────────────────────────────────────────────────────┐
│                     MASTER ORCHESTRATOR                        │
│          22-pipeline.js · 12 phases · parallel execution       │
│          Phase gating via phaseShouldRun(n)                    │
└─────────────────────────┬──────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          │         PHASE 1 (parallel)    │
          ▼               ▼               ▼
  ┌─────────────┐  ┌────────────┐  ┌──────────────────┐
  │ DEMOGRAPHICS│  │ COMPLIANCE │  │  COMPETITIVE     │
  │  Agent 1   │  │  Agent 5   │  │  INTELLIGENCE    │
  │ 07-render  │  │ 08-render  │  │  Agent 6         │
  │ Census·BLS │  │ Permits·   │  │  09-render       │
  │ ACS·FRED   │  │ How-to-    │  │  Winnie·NAEYC·   │
  │ FHWA·NCES  │  │ Apply links│  │  QRIS·Care.com   │
  └──────┬──────┘  └─────┬──────┘  └────────┬─────────┘
         └───────────────┼──────────────────┘
                         │
                Phase 2 ─▶ ┌──────────────┐
                            │  GAP ANALYSIS │
                            │   Agent 2    │
                            │  10-render   │
                            │ NDCP·CCDF·   │
                            │ ChildCareAware│
                            └──────┬───────┘
                                   │
                Phase 3 ─▶ ┌──────────────────┐
                            │  SITE SELECTION  │
                            │     Agent 3      │
                            │   11-render      │
                            │ 6 ranked locations│
                            │ + reasoning      │
                            └──────┬───────────┘
                                   │
                Phase 4 ─▶ ┌──────────────────┐
                            │   REAL ESTATE    │
                            │     Agent 4      │
                            │   12-render      │
                            │ LoopNet·Crexi·   │
                            │ BizBuySell·Zillow│
                            └──────┬───────────┘
                                   │
                Phase 5 ─▶ ┌──────────────────────┐
                            │  FINANCIAL FEASIBILITY│
                            │  Agent 7 (3 sub-calls)│
                            │  26-agent-fin-subs    │
                            │  Revenue·Cost·Analysis│
                            └──────┬───────────────┘
                                   │
                Phase 6 ─▶ ┌──────────────────┐
                            │ EXECUTIVE SUMMARY│
                            │    Agent 8       │
                            │  14-render       │
                            │ Go/No-Go verdict │
                            └──────┬───────────┘
                                   │
                Phase 7 ─▶ ┌──────────────────────┐
                            │   BUSINESS PLAN      │
                            │  Agent 9 (4 sub-calls)│
                            │  24-agent-09-parts   │
                            │  Overview·Market·Fin·│
                            │  Ops·SBA·InvDeck     │
                            └──────┬───────────────┘
                                   │
                Phase 8 ─▶ ┌──────────────────────┐
                            │    PROJECT PLAN       │
                            │  Agent 10 (3 sub-calls│
                            │  25-agent-10-parts   │
                            │  Gantt·Risk·Team     │
                            └──────┬───────────────┘
                                   │
          ┌─────────────┬──────────┼──────────────────┐
          │        PHASE 9 (parallel supplemental)    │
          ▼             ▼          ▼                   ▼
  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐
  │MARKET MAP│  │  GRANT   │  │COMPETITOR│  │ BUILD VS BUY │
  │ Agent 11 │  │  SEARCH  │  │DEEP-DIVE │  │   Agent 16   │
  │17-render │  │ Agent 12 │  │ Agent 13 │  │27-buildvsbuy │
  │Leaflet.js│  │18-render │  │19-render │  │Platform·Make │
  │Dark tiles│  │Federal·  │  │Profiles· │  │vs Buy matrix │
  │Popups    │  │State·    │  │Messaging │  │              │
  └──────────┘  │Local     │  │Guide     │  └──────────────┘
                └──────────┘  └──────────┘
                                   │
                Phase 11 ─▶ ┌──────────────┐  ┌──────────────┐
                             │ CODE REVIEW  │  │  QA TESTING  │
                             │  Agent 14   │  │   Agent 15   │
                             │  20-render  │  │  21-render   │
                             └─────────────┘  └──────────────┘
                                   │
                Phase 12 ─▶ ┌──────────────────────┐
                             │ SOURCES & CITATIONS  │
                             │       Agent 17       │
                             │   28-agent-sources   │
                             │  All-agent review    │
                             └──────────────────────┘
```

---

## Context Passing

Each agent receives truncated JSON from relevant upstream agents to stay within token budgets. The `ctx()` helper in `04-api.js` truncates strings to the specified character limit.

| Agent | Receives from | Char limit |
|-------|--------------|------------|
| 2 — Gap Analysis | 1 (Demographics), 5 (Compliance), 6 (Competitive) | 600 chars each |
| 3 — Site Selection | 1 (Demographics), 2 (Gap), 5 (Compliance) | 400–500 chars each |
| 4 — Real Estate | 3 (Site Selection), 5 (Compliance) | 500 chars each |
| 7 — Financial | 3 (Site), 4 (Real Estate), 5 (Compliance) | 400–500 chars each |
| 8 — Executive | 1–7 (all foundation agents) | 250 chars each |
| 9 — Business Plan | 1–8 (all agents so far) | 300–500 chars each |
| 10 — Project Plan | 3 (Site), 4 (RE), 5 (Compliance), 7 (Financial), 9 (Plan) | 300 chars each |
| 11 — Market Map | 1 (Demographics), 2 (Gap), 4 (Real Estate) | full JSON |
| 12 — Grants | 3 (Site), 5 (Compliance) | full JSON |
| 13 — Comp Deep-Dive | 6 (Competitive Intel) | full JSON |
| 14 — Code Review | R (full results object) | full R |
| 15 — QA Testing | R (full results object) | full R |
| 16 — Build vs Buy | 3 (Site), 4 (RE), 7 (Financial), 8 (Executive) | 400 chars each |
| 17 — Sources | R (full results object) | full R |

---

## Phase Gating

Every phase in `22-pipeline.js` is gated by `phaseShouldRun(n)` (defined in `32-phases.js`):

```javascript
if (phaseShouldRun(2)) {
  // run Agent 2
} else {
  // use best(2) = cached R.a2 || fallback
}
```

When a phase is skipped, downstream agents receive context from cached `R` data (if a previous run exists) or from `getFallback(n)`. This ensures the pipeline can be re-run for specific phases without losing context chain integrity.

---

## Data Flow

- **Structured JSON** — all agents emit and consume JSON; no free-text context passing
- **Parallel execution** — `Promise.allSettled()` for Phase 1 (agents 1+5+6) and Phase 9 (agents 11+12+13+16)
- **Sequential phases** — phases 2–8, 11, 12 run in sequence; each depends on previous phase outputs
- **Error isolation** — each agent is wrapped in `try/catch`; failures use `getFallback(n)` and don't halt the pipeline

---

## Global State

```javascript
// Defined in 01-config.js
let running = false;       // true while pipeline is running
let R = {};                // agent results: R.a1, R.a2, ..., R.a17
let charts = {};           // Chart.js instances keyed by canvas id
let demoMode = false;      // true in demo mode
let stopRequested = false; // true when user clicks Stop
```

---

## Anti-Hallucination Policy

All agents share a `strictSystem` suffix injected by `claudeJSON()` in `04-api.js`:

```javascript
CRITICAL — DATA INTEGRITY:
- NEVER fabricate, invent, or estimate specific data points
- Return null for any numeric field where real data is not available
- Return "N/A" for short string fields
- Return "Information not available" for longer descriptive fields
- Do NOT use 0 when the real value is unknown
```

This single injection covers all 17 agents automatically. The `_nv()` and `_nvNum()` helper functions in `06-ui.js` render `null` / `"N/A"` gracefully in all tables and cards.

---

## Source File Map

| File | Responsibility |
|------|---------------|
| `01-config.js` | INDUSTRIES config (8 industries), PROVIDERS config, global state variables |
| `02-cache.js` | localStorage response cache, 4-hour TTL, hash-keyed by system+user prompt |
| `03-utils.js` | DOM helpers: `$()`, `zip()`, `radius()`, `industry()`, `key()`, `setDot()`, `showOut()`, `tab()`, `setProgress()` |
| `04-api.js` | `claudeJSON()` — multi-provider API call + JSON extraction + `strictSystem` injection |
| `05-fallbacks.js` | `getFallback1()` through `getFallback17()` — demo/error fallback data |
| `06-ui.js` | `_nv()`, `_nvNum()` null-safe renderers; `renderHmap()` heatmap builder |
| `07-render-01.js` | Agent 1 render: Demographics (Census · BLS · 15 sources · metro overview) |
| `08-render-02.js` | Agent 5 render: Compliance + How to Apply tab |
| `09-render-03.js` | Agent 6 render: Competitive Intel (NAEYC · QRIS · Winnie · Care.com) |
| `10-render-04.js` | Agent 2 render: Gap Analysis (NDCP · childcare deserts · D:S ratio) |
| `11-render-05.js` | Agent 3 render: Site Selection (ranked locations + per-location reasoning) |
| `12-render-06.js` | Agent 4 render: Real Estate (LoopNet · Crexi · BizBuySell · Zillow Commercial) |
| `14-render-08.js` | Agent 8 render: Executive Summary (Go/No-Go verdict) |
| `15-render-09.js` | Agent 9 render: Business Plan (overview · market · financials · ops · SBA · investor deck) |
| `16-render-10.js` | Agent 10 render: Project Plan (Gantt · milestones · budget · risk · team · checklist) |
| `17-render-11.js` | Agent 11 render: Market Map (Leaflet.js · CartoDB Dark tiles · circle markers · popups · radius ring) |
| `18-render-12.js` | Agent 12 render: Grant Search (federal · state · local) |
| `19-render-13.js` | Agent 13 render: Competitor Deep-Dive (profiles · pain points · messaging) |
| `20-render-14.js` | Agent 14 render: Code Review (issues · metrics · cost · fixes) |
| `21-render-15.js` | Agent 15 render: QA Validation (test suites · data · UX · score) |
| `22-pipeline.js` | Pipeline orchestration: 12 phases, phase gating, `runPipeline()`, `reRunAgent()`, profile management |
| `23-drilldown.js` | Expand button injection, agent drill-down modal, reasoning card builder |
| `24-agent-09-parts.js` | Business Plan: 4 focused sub-agent calls (overview, market, financial, operations) |
| `25-agent-10-parts.js` | Project Plan: 3 focused sub-agent calls (gantt, risk, team/checklist) |
| `26-agent-fin-subs.js` | Financial Feasibility: 3 sub-agent calls (revenue model, cost model, combined analysis) |
| `27-agent-buildvsbuy.js` | Agent 16: Build vs Buy (platforms · comparison · decision matrix · action steps) |
| `28-agent-sources.js` | Agent 17: Sources & Citations (reviews all agents, flags unsourced claims) |
| `29-export.js` | Per-agent export dropdown (PDF/Word/Excel/Slides); `runIndustryComparison()` |
| `30-session.js` | Auto-save to localStorage, session restore banner, shareable URL params |
| `31-full-export.js` | `fullPipelineExport()`: full 17-agent print-ready document with chart PNG capture |
| `32-phases.js` | Phase checkboxes, `phaseShouldRun(n)`, input validation, `validateInputs()`, phase presets |
| `33-streaming.js` | `claudeStream()` SSE reader; `claudeStreamJSON()` live-streaming variant for text-heavy agents |
| `34-history.js` | Session history panel: last 5 runs in localStorage, restore inputs, verdict badges |
| `35-compare-zip.js` | ZIP comparison mode: single AI call comparing two markets, structured metrics table |

---

## Streaming Architecture

Agent 8 (Executive Summary) uses `claudeStreamJSON()` for live token streaming:

```
claudeStreamJSON(system, user, panelId)
  │
  ├─ Check cache → if hit, skip streaming, return cached JSON
  │
  ├─ Create .stream-live panel with pulsing dot header
  │
  ├─ Call claudeStream(system, user, onChunk)
  │   ├─ Anthropic: fetch SSE, parse `data:` lines, extract text_delta
  │   ├─ Other providers: fall back to claude() standard call
  │   └─ Throttle onChunk to ≤30fps (33ms gap)
  │
  ├─ Stream text into panel (last 700 chars to keep DOM lean)
  │
  └─ On complete: parseJSON(accumulated) → return d
       └─ On parse fail: fall back to claudeJSON() (non-streaming retry)
```

The `runPipeline` patch chain (multiple files each wrap `window.runPipeline` on DOMContentLoaded):

```
user clicks Run
  → 34-history.js wrapper (saves run on completion)
    → 32-phases.js wrapper (validates inputs)
      → original runPipeline() in 22-pipeline.js
```

---

## localStorage Keys

| Key | TTL | Contents |
|-----|-----|---------|
| `biz_session_v1` | 24 hours | Full session: R object, rendered HTML, inputs |
| `biz_history_v1` | Permanent (max 5 entries) | Lightweight run summaries (verdict, zip, date, scores) |
| `biz_cache_v1_*` | 4 hours | Individual agent API responses, keyed by prompt hash |

---

## Build System

`build.mjs` concatenates all files in `JS_FILES` order into a single `<script>` block and inlines `styles.css`. No bundler, no transpilation. All variables are global — declaration order determines availability at parse time (function declarations are hoisted, so inter-file calls work regardless of order).

```bash
node build.mjs
# → public/index.html (~530KB, ~8000 lines)
```

---

## Browser Requirements

| Browser | Version | Notes |
|---------|---------|-------|
| Chrome | 90+ | Fully supported — recommended |
| Firefox | 88+ | Fully supported |
| Safari | 14+ | Supported |
| Edge | 90+ | Fully supported |
| IE 11 | — | Not supported |

Required browser APIs: `fetch` (with SSE/ReadableStream for streaming), `ES2020`, `CSS custom properties`, `localStorage`, `URLSearchParams`, `navigator.clipboard`, `canvas.toDataURL`.

Leaflet.js 1.9.4 is loaded from `unpkg.com` CDN — requires internet access for the Market Map tile layer. All other features work fully offline (no CDN calls except Leaflet).
