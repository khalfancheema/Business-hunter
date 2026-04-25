# How-To Guide — Business Planning Agent System

> Complete step-by-step instructions for every feature in the system.

---

## Table of Contents

1. [First Run](#1-first-run)
2. [Choosing Your Inputs](#2-choosing-your-inputs)
3. [Running the Pipeline](#3-running-the-pipeline)
4. [Reading the Results](#4-reading-the-results)
5. [Phase Selection — Run Only What You Need](#5-phase-selection--run-only-what-you-need)
6. [Session Restore — Pick Up Where You Left Off](#6-session-restore--pick-up-where-you-left-off)
7. [Shareable URL — Share Your Setup](#7-shareable-url--share-your-setup)
8. [Full PDF Export](#8-full-pdf-export)
9. [Per-Agent Export (PDF · Word · Excel · Slides)](#9-per-agent-export-pdf--word--excel--slides)
10. [Drill-Down & Raw Data Inspection](#10-drill-down--raw-data-inspection)
11. [Compliance — How to Apply for Each Requirement](#11-compliance--how-to-apply-for-each-requirement)
12. [Industry Comparison](#12-industry-comparison)
13. [Personalizing Your Report](#13-personalizing-your-report)
14. [Demo Mode](#14-demo-mode)
15. [Response Caching & Cache Management](#15-response-caching--cache-management)
16. [Re-running Individual Agents](#16-re-running-individual-agents)
17. [Switching AI Providers](#17-switching-ai-providers)
18. [Understanding Data Quality & "N/A" Values](#18-understanding-data-quality--na-values)
19. [Building from Source](#19-building-from-source)
20. [Troubleshooting](#20-troubleshooting)

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

## 5. Phase Selection — Run Only What You Need

The **⚙ Phases** button opens the phase selector panel. Use it to skip phases you've already run or don't need.

### How to Use

1. Click **⚙ Phases** — the panel expands below the controls
2. Uncheck any phase you want to skip
3. Click **▶ Run Pipeline**

Skipped phases use **cached R data** from a previous run — so downstream agents still receive context. For example, if you uncheck Phase 1 (Demographics) but run Phase 2 (Gap Analysis), Agent 2 will receive your previously cached Agent 1 data.

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

## 7. Shareable URL — Share Your Setup

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

## 8. Full PDF Export

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

## 9. Per-Agent Export (PDF · Word · Excel · Slides)

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

## 10. Drill-Down & Raw Data Inspection

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

## 11. Compliance — How to Apply for Each Requirement

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

## 12. Industry Comparison

Compare two industries side-by-side for the same location.

### How to Use

1. Select your primary industry in the **Industry** dropdown
2. Select a second industry in the **Compare With** dropdown (below the progress bar)
3. Click **⚖ Compare Industries**
4. A comparison panel expands showing both industries across key metrics: startup cost, revenue potential, regulatory complexity, market saturation, and overall opportunity score

This is useful when you're deciding between business types — e.g. should you open a daycare or a gym in ZIP 30097?

---

## 13. Personalizing Your Report

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

## 14. Demo Mode

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

## 15. Response Caching & Cache Management

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

## 16. Re-running Individual Agents

Each agent card has a **↺ Re-run** button in the header. This re-runs just that one agent — useful for:
- Refreshing a chart after session restore
- Getting a second opinion on a specific agent's output
- Fixing a failed agent without re-running the entire pipeline

The re-run passes the same upstream context (R.a1, R.a2, etc.) that the original pipeline used. Only the target agent makes a new API call.

---

## 17. Switching AI Providers

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

## 18. Understanding Data Quality & "N/A" Values

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

## 19. Building from Source

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

## 20. Troubleshooting

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
