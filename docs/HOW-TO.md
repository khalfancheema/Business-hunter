# How-To Guide — Business Planning Agent System

> Complete step-by-step instructions for every feature in the system.

---

## Table of Contents

1. [First Run](#1-first-run)
2. [Choosing Your Inputs](#2-choosing-your-inputs)
3. [Running the Pipeline](#3-running-the-pipeline)
4. [Reading the Results](#4-reading-the-results)
5. [Phase Selection & Quick Presets](#5-phase-selection--quick-presets)
6. [Session Restore — Pick Up Where You Left Off](#6-session-restore--pick-up-where-you-left-off)
7. [Session History — Recent Reports](#7-session-history--recent-reports)
8. [Shareable URL — Share Your Setup](#8-shareable-url--share-your-setup)
9. [ZIP Comparison Mode](#9-zip-comparison-mode)
10. [Streaming Responses](#10-streaming-responses)
11. [Full PDF Export](#11-full-pdf-export)
12. [Per-Agent Export (PDF · Word · Excel · Slides)](#12-per-agent-export-pdf--word--excel--slides)
13. [Drill-Down & Raw Data Inspection](#13-drill-down--raw-data-inspection)
14. [Compliance — How to Apply for Each Requirement](#14-compliance--how-to-apply-for-each-requirement)
15. [Industry Comparison](#15-industry-comparison)
16. [Market Map — Leaflet Interactive Map](#16-market-map--leaflet-interactive-map)
17. [Personalizing Your Report](#17-personalizing-your-report)
18. [Demo Mode](#18-demo-mode)
19. [Response Caching & Cache Management](#19-response-caching--cache-management)
20. [Re-running Individual Agents](#20-re-running-individual-agents)
21. [Switching AI Providers](#21-switching-ai-providers)
22. [Understanding Data Quality & "N/A" Values](#22-understanding-data-quality--na-values)
23. [Building from Source](#23-building-from-source)
24. [Troubleshooting](#24-troubleshooting)

---

## 1. First Run

**Step 1 — Get the app**

Download `public/index.html` from the repository, or clone the repo and run `node build.mjs` to build it yourself.

**Step 2 — Open in a browser**

Double-click `index.html`, or:
```bash
# Mac
open public/index.html

# Windows
start public/index.html

# Linux
xdg-open public/index.html
```

No server, no install, no dependencies.

**Step 3 — Get an API key**

The system works with any of these providers:
- **Anthropic Claude** → [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)
- **OpenAI GPT-4o** → [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **Google Gemini** → [aistudio.google.com](https://aistudio.google.com)
- **Local model** → Use the OpenAI-Compatible option with your local server URL

Paste your key into the **API Key** field. It is never stored — it lives in memory for the session only.

> **Don't have a key yet?** Click **⚡ Demo Mode** to run the full pipeline with built-in sample data at zero cost.

---

## 2. Choosing Your Inputs

### Industry
Select your business type from the dropdown. This changes everything:
- All agent prompts adapt to the industry's terminology and regulations
- Financial models use industry-specific cost structures
- Compliance requirements show the correct agencies and permits
- Capacity labels change (children enrolled, fuel pumps, washers, seats, members, etc.)

### ZIP Code
Enter a 5-digit US ZIP code — the geographic center of your search. The pipeline finds cities within your radius from this point.

*Example: `30097` for Johns Creek, GA*

### Radius
How far to search, in miles. The system will analyze cities within this radius of the ZIP code.
- Minimum: **10 miles**
- Maximum: **150 miles**
- Recommended for most searches: **25–50 miles**

### Capacity
The target size of your business:

| Industry | Capacity Means | Typical Range |
|----------|---------------|---------------|
| Daycare | Enrolled children | 30–150 |
| Gas Station | Fuel pumps | 4–24 |
| Laundromat | Washing machines | 15–60 |
| Car Wash | Wash bays | 2–12 |
| Restaurant | Seats | 30–200 |
| Gym | Member slots | 100–2,000 |
| Indoor Play | Daily visitor capacity | 50–500 |
| Dry Cleaning | Garments per day | 100–1,000 |

### Budget
Your total startup capital in USD. The financial feasibility agent uses this to model scenarios and flag if the budget is insufficient.

**Industry minimums:**

| Industry | Typical Minimum |
|----------|----------------|
| Daycare | $150,000 |
| Gas Station | $500,000 |
| Laundromat | $100,000 |
| Car Wash | $300,000 |
| Restaurant | $100,000 |
| Gym | $150,000 |
| Indoor Play | $200,000 |
| Dry Cleaning | $100,000 |

---

## 3. Running the Pipeline

1. Fill in all inputs (ZIP, radius, capacity, budget, industry)
2. Select your AI provider and enter your API key
3. Click **▶ Run Pipeline**

The pipeline validates your inputs first. If any field is invalid, a red tip message appears under it — fix it and click Run again.

### Watching Progress

A progress bar and status text shows the current phase. Each agent card shows:
- **Grey dot** — waiting
- **Pulsing blue dot** — currently running (with elapsed time in seconds)
- **Green dot** — completed successfully
- **Red dot** — failed (check the error message in the output panel)

### Stopping Early

Click **⬛ Stop** to halt the pipeline after the current agent completes. All results up to that point remain visible and usable.

### After Completion

When all phases complete, the pipeline progress reaches 100% and each agent card shows its output. The **↺ Reset** button appears — click it to clear everything and start fresh.

---

## 4. Reading the Results

Each agent card expands to show output in tabs:

### Navigating Tabs
Click any tab heading (Summary, Heatmap, Chart, etc.) to switch views within an agent.

### Heatmaps
Color-coded grids comparing cities across multiple metrics. Darker cells = higher values. On agents where cells are clickable (Gap Analysis, Competitive Intel), click any cell for a city-level deep-dive.

### Charts
Bar and line charts built with Chart.js. Hovering shows exact values in a tooltip.

### Tables
Sortable data tables. Numeric values use `_nv` null-safe rendering — any field the AI couldn't find real data for shows "N/A" instead of a made-up number.

### { } Raw Button
Click **{ } Raw** on any agent card to see the exact JSON object the AI returned. This is the source of truth for everything shown in that agent's panels. Useful for debugging or extracting data programmatically.

---

## 5. Phase Selection & Quick Presets

The **⚙ Phases** button opens the phase selector panel. Use it to pick a preset scope or manually choose exactly which phases to run.

### Quick Presets

Four one-click preset buttons appear at the top of the panel:

| Preset | Phases | Est. Cost | Est. Time | Best For |
|--------|--------|-----------|-----------|---------|
| ⚡ **Quick Verdict** | 1–6 | ~$0.15 | ~2 min | Fast Go/No-Go before committing to a full run |
| 🔬 **Foundation Only** | 1 | ~$0.06 | ~1 min | Demographics, compliance, and competitor snapshot only |
| 💰 **Thru Financials** | 1–5 | ~$0.20 | ~3 min | Everything through the financial model |
| 📋 **Full Report** | All 12 phases | ~$0.40 | ~8 min | Complete 17-agent business plan |

Click any preset to automatically check/uncheck the right phases — then click **▶ Run Pipeline**.

### Custom Phase Selection

1. Click **⚙ Phases** — the panel expands below the controls
2. Check or uncheck individual phases
3. Click **▶ Run Pipeline**

Skipped phases use **cached R data** from a previous run — downstream agents still receive context. For example, if you uncheck Phase 1 (Demographics) but run Phase 2 (Gap Analysis), Agent 2 receives your previously cached Agent 1 data.

### Phase Reference

| Phase | Agents | When to Skip |
|-------|--------|-------------|
| 1 | Demographics · Compliance · Competitive Intel | Already ran, ZIP didn't change |
| 2 | Gap Analysis | Already have gap data |
| 3 | Site Selection | Already selected a location |
| 4 | Real Estate | Already have property candidates |
| 5 | Financial Feasibility | Already ran financial model |
| 6 | Executive Summary | Just need to re-run specific agents |
| 7 | Business Plan | Already have a plan draft |
| 8 | Project Plan | Already have a project timeline |
| 9 | Market Map · Grants · Competitor · Build vs Buy | Supplemental analysis only |
| 11 | Code Review · QA Validation | Skip meta-analysis to save cost |
| 12 | Sources & Citations | Skip if you don't need citation verification |

### Shortcuts
- **All** — checks all 12 phases
- **None** — unchecks all phases (run nothing)

---

## 6. Session Restore — Pick Up Where You Left Off

Every time an agent completes, the system automatically saves:
- All agent outputs (rendered HTML)
- The full R data object (all JSON results)
- Your input settings (ZIP, industry, radius, capacity, budget)

This snapshot is stored in your browser's localStorage with a **24-hour expiration**.

### Restoring a Session

If you open the app and a recent session exists, a banner appears at the top:

> 💾 **Previous session found** — ZIP 30097 · daycare · 12 agents completed (saved 5 min ago)
> **↩ Restore** | **✕ Discard**

Click **↩ Restore** to:
- Reload all agent HTML outputs (no API calls needed)
- Restore the R data object for re-runs and exports
- Restore your input settings

> **Note on charts:** Charts cannot be restored from saved HTML — they require live Chart.js rendering. After restoring, click **↺ Re-run** on any agent whose chart you want to see.

Click **✕ Discard** to delete the saved session and start fresh.

---

## 7. Session History — Recent Reports

The **🕐 Recent Reports** button opens a history panel showing your last **5 pipeline runs**, stored in your browser's localStorage.

### What's Saved

Each history entry records:
- ZIP code and industry
- Date and time of the run
- How many agents completed
- The Go / Cautious Go / No Go verdict with rationale
- The overall opportunity score and top recommended city

No full agent data is stored in history — only the summary metadata. Full agent data lives in the 24-hour session restore snapshot.

### How to Use

1. Click **🕐 Recent Reports** — the history panel expands below the controls
2. Browse your recent runs — each shows the verdict badge, ZIP, industry, date, and a one-line rationale
3. Click **↩ Restore Inputs** on any run to refill the ZIP, industry, radius, capacity, and budget fields exactly as they were
4. Then click **▶ Run Pipeline** to generate a fresh analysis for that scenario

### Managing History

- **Clear History** — removes all saved history entries
- History is stored per-browser (not synced to other devices)
- After 5 runs, the oldest entry is automatically removed to make room

> **Tip:** History entries are great for comparing results across different ZIPs or industries you've already evaluated — you can jump back to any scenario in seconds.

---

## 8. Shareable URL — Share Your Setup

The **🔗 Copy Link** button creates a URL that encodes all your input settings:

```
https://yoursite.com/?zip=30097&industry=daycare&radius=40&capacity=75&budget=600000
```

### How to Use

1. Set your ZIP, industry, radius, capacity, and budget
2. Click **🔗 Copy Link**
3. The button shows **✓ Copied!** — the URL is in your clipboard
4. Share it with a colleague or bookmark it

When someone opens the link, the app auto-fills all inputs exactly as you had them. They can then click **▶ Run Pipeline** to generate a fresh analysis for the same scenario.

The URL also updates automatically in the browser's address bar whenever you change any input — so you can copy from the address bar at any time.

---

## 9. ZIP Comparison Mode

Compare two ZIP code markets side by side with a single AI call — no need to re-run all 17 agents.

### How to Use

1. Run the primary pipeline for your main ZIP code (or use a restored session)
2. Find the **Compare ZIP** field in the compare bar below the progress bar
3. Enter a second 5-digit US ZIP code
4. Click **⚖ Compare ZIPs**

A comparison panel expands showing:

### Comparison Panel Contents

- **Recommended Market** — the ZIP with the stronger opportunity and a one-sentence rationale
- **Side-by-side metrics table:**
  - Population (primary city)
  - Children under 5 / primary demographic
  - Median household income
  - Income growth %
  - Dual-income household %
  - Competitor count
  - Real estate cost
  - Opportunity score (1–10)
- **Strengths** and **Weaknesses** for each ZIP
- **2–3 sentence recommendation** on which ZIP to prioritize and why
- **Data sources** cited by the AI

### How It Works

The comparison AI call receives:
- Your primary ZIP's existing results (verdict, opportunity score, top city, income, demographics)
- Real-time research on the comparison ZIP
- Your capacity, budget, and industry settings

This makes it fast (~10–15 seconds) and much cheaper than running the full pipeline twice (~$0.03 vs ~$0.40).

> **Tip:** Run Quick Verdict (phases 1–6) on your primary ZIP first, then use ZIP Comparison to evaluate 2–3 alternative markets before committing to the full 8-minute report.

---

## 10. Streaming Responses

Agent 8 (Executive Summary) streams its response token-by-token directly into the prose panel.

### What You'll See

Instead of a spinner followed by a sudden full reveal, you'll see:
1. A pulsing green dot and "Generating executive report…" header appears immediately
2. Text streams in word by word — verdict, rationale, assessment, risks, next steps
3. When the full response arrives, it's parsed and rendered as the normal structured output

### Provider Support

| Provider | Streaming |
|----------|----------|
| **Anthropic (Claude)** | ✅ Full SSE streaming |
| **OpenAI** | ✅ Full SSE streaming |
| **Google Gemini** | ⚠️ Falls back to standard call |
| **OpenAI-Compatible** | ✅ If provider supports SSE |

Streaming falls back silently to the standard call if SSE is not supported — you'll never see an error, just no live preview.

---

## 11. Full PDF Export

The **📄 Full PDF** button generates a complete, print-ready business planning report with all 17 agents.

### What's Included

- **Cover page** — industry, ZIP, business name (if personalized), founder, date, agent count
- **Table of contents** — all 17 agents with completion status
- **Executive Summary** first (most important section)
- **All completed agents** in priority order — charts are captured as PNG images
- All tables, prose, and data rendered in a clean, black-on-white print layout

### Steps

1. Run the pipeline (or restore a session) so at least some agents have results
2. Click **📄 Full PDF**
3. A new browser window opens with the formatted report
4. Click **🖨 Print / Save as PDF** in the top bar
5. In the print dialog, choose **Save as PDF** as the destination

> **Pop-up blocked?** The app opens the export in a new window. If your browser blocks it, click the pop-up notification in the address bar and allow pop-ups for this page.

> **Chart images:** Charts are captured at the moment you click the button. If an agent's chart hasn't been rendered yet (e.g. after session restore), re-run that agent first, then export.

---

## 12. Per-Agent Export (PDF · Word · Excel · Slides)

Each agent card has a **⬇ Export** dropdown with four format options.

### How to Use

1. After an agent completes, look for the **⬇ Export** button in the agent card header
2. Click the dropdown arrow
3. Select your format: **PDF**, **Word Doc**, **Excel**, or **Slides**

### Formats

| Format | Contents | Best For |
|--------|----------|---------|
| **PDF** | Full agent output formatted for print | Sharing with lenders or partners |
| **Word Doc** | Editable `.doc` with all text and tables | Editing and annotation |
| **Excel** | Tabular data from that agent as spreadsheet | Further analysis, modeling |
| **Slides** | Presentation-ready summary of key findings | Investor or partner pitches |

---

## 13. Drill-Down & Raw Data Inspection

### Expand Modal
Click **↗ Expand** on any agent card to open a full-screen modal. The modal shows:
- The agent's full output in all its tabs
- A **Reasoning Card** extracted from the agent's JSON — shows the AI's reasoning, rationale, key insights, or recommendation logic
- A **{ } Raw** view of the complete JSON object

### Clickable Heatmap Cells
In **Gap Analysis** (Agent 2) and **Competitive Intel** (Agent 6), the heatmap cells are clickable:
- Click any city cell to open a city-level deep-dive overlay
- Gap Analysis shows supply/demand breakdown, NDCP rate data, child care desert status
- Competitive Intel shows per-center cards with NAEYC accreditation, QRIS stars, waitlist info, and Winnie/Yelp links

### { } Raw Button
On any agent card, click **{ } Raw** to expand the raw JSON in a scrollable panel beneath the tabs. This is exactly what the AI returned — useful for verifying data integrity or copying values into other tools.

---

## 14. Compliance — How to Apply for Each Requirement

Agent 5 (Compliance) includes a dedicated **How to Apply** tab that goes beyond listing requirements — it tells you exactly how and where to apply for each one.

### Requirements Table
The **Requirements** tab shows a table with:
- Category and requirement name
- Priority (Critical / High / Medium)
- Estimated cost and timeline in weeks
- An **↗ Apply** button that opens the direct application portal (only shown for verified URLs)

### How to Apply Tab
Click the **How to Apply** tab to see detailed cards for every requirement:

Each card includes:
- **Agency name** — the exact government agency or body
- **Form name/number** — the specific form you'll need
- **Online / In-Person** badge — whether you can apply online
- **Phone and email** — contact info for the agency (when available)
- **Step-by-step instructions** — numbered steps explaining exactly what to do
- **Notes** — any important caveats, prerequisites, or common issues
- **↗ Go to Application Portal** button — direct link to the online application

> **Data availability note:** Application URLs and instructions are provided by the AI based on its training data. Always verify current URLs and requirements directly with the issuing agency before submitting applications.

---

## 15. Industry Comparison

Compare two industries side-by-side for the same location.

### How to Use

1. Select your primary industry in the **Industry** dropdown
2. Select a second industry in the **Compare With** dropdown (below the progress bar)
3. Click **⚖ Compare Industries**
4. A comparison panel expands showing both industries across key metrics: startup cost, revenue potential, regulatory complexity, market saturation, and overall opportunity score

This is useful when you're deciding between business types — e.g. should you open a daycare or a gym in ZIP 30097?

---

## 16. Market Map — Leaflet Interactive Map

Agent 11 (Market Map) renders a full interactive map powered by **Leaflet.js** with **CartoDB Dark Matter** tiles — real street-level geography that matches the app's dark theme. No API key is required.

### Map Elements

| Element | Meaning |
|---------|---------|
| Blue star marker (📍) | Your search center (entered ZIP code) |
| Dashed circle | Your search radius boundary |
| Colored circle markers | Cities — sized and colored by gap/opportunity score |
| 🏢 square markers | Real estate listings and competitor locations |
| Permanent labels | City names always visible on the map |

### Color Scale (Circle Markers)

- **Green** — high gap score (strong opportunity)
- **Amber/Yellow** — medium gap score
- **Red** — low gap score (saturated or weak demand)

### Interacting with the Map

- **Click any circle marker** — opens a popup with full stats: population, median income, children under 5, gap score, opportunity score, and a link to view real estate listings
- **Scroll to zoom** — standard map zoom
- **Click and drag** — pan the map
- **Zoom controls** (top-left) — + / − buttons

### After Session Restore

The Leaflet map cannot be restored from saved HTML (it requires live JavaScript rendering). After restoring a session, click **↺ Re-run** on the Market Map agent card to regenerate it.

---

## 17. Personalizing Your Report

Add your business details to personalize all exports and the printed report.

### How to Use

1. Click the **✏️ Personalize Report** section (below the agent pipeline)
2. Fill in:
   - **Business Name** — appears on the cover page
   - **Founder/Owner** — your name or LLC name
   - **Target Opening** — month/year
   - **Location** — choose from Agent 3's top locations, or type manually
   - **Equity** — your startup capital contribution
   - **Email** — contact info for the report header
   - **Notes** — any additional context
3. Click **Apply**

The profile header appears at the top of the page and is included in all PDF and print exports. Your profile is saved to localStorage and reloads automatically next time you open the app.

---

## 18. Demo Mode

Run the full pipeline with no API key to see what the system produces.

### How to Use

1. Click **⚡ Demo Mode** (yellow button)
2. The button changes to **⚡ Demo Mode ON**
3. Click **▶ Run Pipeline** — all 17 agents run using built-in sample data instantly (no API calls)
4. Click **⚡ Demo Mode** again to turn it off before running a real analysis

Demo Mode uses the hardcoded fallback data in `src/js/05-fallbacks.js`. It's useful for:
- Exploring the UI before committing to an API key
- Testing changes during development
- Showing the system to stakeholders without burning API credits

---

## 19. Response Caching & Cache Management

All API responses are cached automatically to avoid repeating identical calls.

### How Caching Works

- **In-memory cache** — within a session, calling the same agent with the same inputs returns the cached result instantly
- **localStorage cache** — persists across page refreshes for 4 hours (keyed on system prompt + user prompt hash)
- When a cache hit occurs, the agent completes almost instantly (< 100ms)

### Clearing the Cache

Click **Clear Cache** to delete all cached API responses. The next pipeline run will make fresh API calls for every agent. Use this when:
- Data may have changed (new listings, regulatory updates)
- You want to see if the AI returns different results
- Responses from a previous run seem outdated

---

## 20. Re-running Individual Agents

Every **completed** agent card has a **↺ Re-run** button in the header (visible on green/done agents, not just red/error ones). This re-runs just that one agent — useful for:
- Refreshing a chart after session restore
- Getting a second opinion on a specific agent's output
- Trying a different AI provider on one agent while keeping the rest
- Fixing a failed agent without re-running the entire pipeline

The re-run passes the same upstream context (R.a1, R.a2, etc.) that the original pipeline used. Only the target agent makes a new API call.

> **Example workflows:**
> - Run the full pipeline → see Agent 3 selected an undesirable city → click **↺ Re-run** on Agent 3 to get new site options → click **↺ Re-run** on Agents 7 and 8 to refresh financials and exec summary with the new location
> - Run Quick Verdict (phases 1–6) → click **↺ Re-run** on Agent 8 to get a fresh executive summary after manually tweaking inputs

---

## 21. Switching AI Providers

### Provider Selection

Use the **Provider** dropdown to switch between:
- **Anthropic (Claude)** — default; best quality for business planning tasks
- **OpenAI (GPT-4o)** — strong alternative; different reasoning style
- **Google Gemini** — good for research-heavy agents
- **OpenAI-Compatible** — for local models (LM Studio, Ollama) or hosted endpoints (Together AI, Fireworks, etc.)

### Model Override

Leave the **Model** field empty to use each provider's default. To use a specific model:
- Enter `claude-opus-4-5` for Anthropic's most capable model
- Enter `gpt-4o-mini` for a faster, cheaper OpenAI option
- Enter any model name your local server supports

### OpenAI-Compatible Setup

For local models:
1. Select **OpenAI-Compatible / Local**
2. Enter your server URL in the endpoint field (e.g. `http://localhost:11434/v1/chat/completions`)
3. Enter your key (or any placeholder if your server doesn't require auth)
4. Enter the model name your server exposes

---

## 22. Understanding Data Quality & "N/A" Values

The system enforces a strict anti-hallucination policy across all 17 agents.

### The Rule

Every agent is instructed: **never fabricate, invent, or estimate specific data points**. If a number isn't available from real sources, the agent must return:
- `null` — for any numeric field where real data isn't available
- `"N/A"` — for short string fields
- `"Information not available"` — for longer descriptive fields

### What This Means in Practice

- A city with `"N/A"` for median income means the AI couldn't find real Census data for that ZIP — not that the income is zero
- A compliance requirement with `"N/A"` for cost means the fee wasn't found — not that it's free
- Real estate listings with `null` for price means no listing was found — not that it's free

### How to Verify

- Click **{ } Raw** on any agent to see exactly which fields are null vs. populated
- The **Sources & Citations agent (Agent 17)** reviews every agent's sources and flags unsourced claims
- For critical numbers (regulatory fees, real estate prices), always verify directly with the source agency or broker

---

## 23. Building from Source

The app is a single `public/index.html` file assembled from source files in `src/`.

### Setup

```bash
# No npm install needed — the app has no runtime dependencies
# Node.js is only needed for the build script

node build.mjs
# → Built public/index.html (X bytes, Y lines)
```

### Development Workflow

```bash
# Edit source files in src/
# Then rebuild:
node build.mjs

# Serve locally (optional):
npx serve public -l 8080
# → http://localhost:8080
```

### Source File Organization

All JS files in `src/js/` are concatenated in order into a single `<script>` tag. All variables are global — agents communicate through the shared `R` object. File order matters for declaration order.

See [architecture.md](architecture.md) for the full technical architecture.

---

## 24. Troubleshooting

### "Please enter your Anthropic API key"
You haven't entered an API key. Either enter a key in the API Key field, or click **⚡ Demo Mode** to run without one.

### Agent fails with a red dot
- Check the error message in the agent's output panel
- The most common causes: API key expired, insufficient credits, or the AI returned malformed JSON
- Click **↺ Re-run** on that agent to try again
- If the pipeline keeps failing on the same agent, try switching to Demo Mode to verify the UI works correctly

### Tabs don't switch when I click them
This was a known bug (fixed) where inline `display:` styles on panel divs overrode the tab CSS. If you see this, hard-refresh the page (Ctrl+Shift+R / Cmd+Shift+R) to get the latest build.

### Charts are blank after session restore
Charts are rendered by Chart.js at runtime and can't be serialized to localStorage. After restoring a session, click **↺ Re-run** on any agent whose chart you want to see.

### "Pop-up blocked" when clicking Full PDF
Your browser is blocking the export window. Click the pop-up notification in the browser address bar and select "Always allow pop-ups from this page."

### The page is very slow
- Large radii (100+ miles) with many cities generate longer agent responses — this is normal
- Try a smaller radius (25–40 miles) for faster results
- Use **⚙ Phases** to skip phases you don't need
- Use **Clear Cache** if localStorage is very large

### "Restore session" banner doesn't appear
- The session expired (>24 hours old) — it was automatically deleted
- Or the browser's localStorage is disabled or in private/incognito mode
- Or you discarded a previous session

### Data looks wrong / AI seems to be making things up
Click **{ } Raw** on the agent — if you see `null` values for fields that should have data, the AI correctly admitted it couldn't find the information. If you see suspiciously specific numbers where you'd expect nulls, check the **Sources & Citations** agent (Agent 17) which will flag unsourced claims.
