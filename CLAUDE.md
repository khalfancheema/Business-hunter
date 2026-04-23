# Daycare Planning Agent System

## Project Overview
A 15-agent AI pipeline built on the Anthropic API that performs comprehensive daycare/childcare business planning. Runs entirely in the browser — no backend required.

## Architecture
- **Single-file deployable**: `public/index.html` — open directly in any browser
- **15 specialized agents** passing structured JSON context to each other
- **Sequential pipeline** with one parallel phase (agents 1+5+6)
- **claudeJSON() wrapper**: 3 retries + 5-strategy JSON parsing on every agent call
- **Chart.js 4.4.1** for all data visualizations (bar, line, radar, doughnut charts)
- **SVG map** built inline for the geographic market map
- **Web search disabled** (`useSearch` hardcoded to `false`) to avoid multi-turn API complexity

## Agent Pipeline

| # | Name | Phase | Inputs | Key Output |
|---|------|-------|--------|-----------|
| 1 | Demographics | 1 (parallel) | zip, radius, grades | City population, income, demand scores |
| 5 | Compliance | 1 (parallel) | zip, grades | DECAL requirements, zoning, timeline |
| 6 | Competitive Intel | 1 (parallel) | zip, radius | Competitor counts, tuition, gap scores by city |
| 2 | Gap Analysis | 2 | agents 1,5,6 | City rankings, unserved children, opportunity scores |
| 3 | Site Selection | 3 | agents 1,2,5 | 6 locations scored on 5 dimensions |
| 4 | Real Estate | 4 | agents 3,5 | Live listings with LoopNet/Crexi links, broker contacts |
| 7 | Financial Feasibility | 4 (after 4) | agents 3,4,5 | 3 scenarios, P&L projection, by-city financials |
| 8 | Executive Summary | 5 | agents 1-7 | Go/No-Go verdict, risks, next steps |
| 9 | Business Plan | 6 | agents 1-8 | SBA 7(a) package, investor deck, operations plan |
| 10 | Project Plan | 7 | agents 3,4,5,7,9 | 18-month Gantt, milestones, risk register |
| 11 | Market Map | 8 | agents 1,2,4 | Interactive SVG map with color-coded gap scores |
| 12 | Grant Search | 9 | agents 3,5 | CAPS rates, USDA funds, Barrow County incentives |
| 13 | Competitor Deep-Dive | 10 | agent 6 | Review pain points, differentiation, messaging guide |
| 14 | Code Review | 11 | all results (R{}) | Issues, performance metrics, cost analysis |
| 15 | QA & Testing | 12 | all results (R{}) | 34 tests, data validation, UX audit, health score |

## Key Files
```
public/index.html          ← THE APP — open this in browser (3,000+ lines)
src/utils/api.js           ← Anthropic API wrapper + parseJSON utility
src/utils/charts.js        ← Chart.js helpers (bar, line, radar, doughnut)
src/utils/map.js           ← SVG map builder with lat/lng projection
docs/architecture.md       ← Full pipeline diagram + token budget table
docs/agent-schemas.md      ← All 15 agent JSON schemas
docs/deployment.md         ← Local, GitHub Pages, Netlify, S3 options
CLAUDE.md                  ← This file (Claude Code instructions)
README.md                  ← Project overview and quick start
package.json               ← npm scripts for serving and linting
```

## Running Locally
```bash
# Simplest — just open the file
open public/index.html

# Or serve with Python
python3 -m http.server 8080 --directory public

# Or with Node
npx serve public -l 8080
```

## API Configuration
- **Key**: Entered by user in browser UI — never hardcoded
- **Model**: `claude-sonnet-4-6`
- **Max tokens**: 4096 per agent
- **Required header**: `anthropic-dangerous-direct-browser-access: true`
- **Web search**: Disabled (`useSearch = false` in `claude()` function)
- **Retry logic**: `claudeJSON()` wraps every call with 3 attempts + strict JSON enforcement

## Coverage Area (Default)
- **ZIP**: 30097 (Duluth, GA) — configurable in UI
- **Radius**: 40 miles
- **Counties**: Gwinnett, Barrow (Winder/Auburn), Forsyth (Cumming), Fulton (Johns Creek)

## Adding a New Agent
1. Add HTML card in `public/index.html` with `card-N`, `dot-N`, `out-N` IDs and tab structure
2. Add CSS for any new component types needed
3. Write `async function runAgentN(inputs)` following the existing pattern:
   - Define `sys` (system prompt with strict JSON instruction)
   - Define `usr` (user prompt with inline JSON schema example)
   - Call `const d = await claudeJSON(sys, usr)`
   - Call `renderAgentN(d)` to populate the UI tabs
   - Call `setDot(N, 'done')` and `showOut(N)`
   - Return `JSON.stringify(d)`
4. Add render function `function renderAgentN(d)` that populates all tab panels
5. Call `await runAgentN(inputs)` in `runPipeline()` at the correct phase
6. Add `'N'` to the `resetAll()` array

## Modifying Agent Prompts
Every agent uses a structured JSON response. The prompt includes:
- A system role with explicit "Respond JSON only" instruction
- An inline JSON schema example the agent must match exactly
- Context from upstream agents (truncated to fit token budget)

**Known issue (CR-001)**: Context is passed as `JSON.stringify(d).substring(0, N)` which truncates mid-object. Better approach: extract only the 5-10 most relevant fields before passing downstream.

## Known Issues & Planned Fixes
| ID | Issue | Priority | Effort |
|----|-------|----------|--------|
| CR-001 | Context truncation loses data | High | 2h |
| CR-002 | No stop_reason check | Critical | 15min |
| CR-003 | Agents 9+10 prompts too large | High | 1h |
| CR-004 | No retry backoff | Medium | 10min |
| CR-005 | No per-agent elapsed timer | Medium | 20min |
| CR-006 | API key visible in DevTools | Low | 10min |
| CR-007 | Single-file monolith | Low | 4h |
| CR-008 | Agents 11+12+13 not parallel | Low | 5min |

## Cost per Pipeline Run
- **Current**: ~$0.47/run (15 agents × avg $0.031)
- **Optimized**: ~$0.31/run with prompt size reductions
- **10 runs/month**: ~$4.75
- **50 runs/month**: ~$23.75


## Project Overview
A 13-agent AI pipeline built on the Anthropic API that performs comprehensive daycare/childcare business planning. Runs entirely in the browser — no backend required.

## Architecture
- **Single-file deployable**: `public/index.html` — open directly in any browser
- **13 specialized agents** that pass structured JSON context to each other
- **Live web search** via Anthropic's `web_search_20250305` tool on Agents 1, 4, 5, 6, 12, 13
- **Chart.js** for all data visualizations
- **SVG map** built inline for the geographic market map

## Agent Pipeline
| # | Name | Phase | Search | Inputs |
|---|------|-------|--------|--------|
| 1 | Demographics | 1 (parallel) | ✓ | zip, radius, grades |
| 5 | Compliance | 1 (parallel) | ✓ | zip, grades |
| 6 | Competitive Intel | 1 (parallel) | ✓ | zip, radius |
| 2 | Gap Analysis | 2 | — | agents 1,5,6 |
| 3 | Site Selection | 3 | — | agents 1,2,5 |
| 4 | Real Estate | 4 (parallel) | ✓ | agents 3,5 |
| 7 | Financial Feasibility | 4 (parallel) | — | agents 3,5 |
| 8 | Executive Summary | 5 | — | agents 1-7 |
| 9 | Business Plan | 6 | — | agents 1-8 |
| 10 | Project Plan | 7 | — | agents 3,4,5,7,9 |
| 11 | Market Map | 8 | — | agents 1,2,4 |
| 12 | Grant Search | 9 | ✓ | agents 3,5 |
| 13 | Competitor Deep-Dive | 10 | ✓ | agent 6 |

## Key Files
```
public/index.html          # Single deployable file — open this in browser
src/agents/               # Individual agent prompts and logic (reference)
src/utils/api.js          # Anthropic API wrapper
src/utils/charts.js       # Chart.js rendering helpers
src/utils/map.js          # SVG map builder
src/styles/main.css       # All CSS (dark theme)
src/components/           # Reusable HTML component templates
docs/                     # Architecture diagrams and notes
```

## Running the Project
```bash
# Option 1: Open directly (no server needed)
open public/index.html

# Option 2: Serve locally
npx serve public/
# or
python3 -m http.server 8080 --directory public
```

## Development Commands
```bash
# Rebuild single-file bundle from src/
npm run build

# Watch mode (rebuilds on save)
npm run dev

# Validate JS syntax
npm run lint
```

## Environment
- **API Key**: Entered by user in the browser UI — never hardcoded
- **Model**: `claude-sonnet-4-6`
- **Max tokens per agent**: 3000
- **Required header**: `anthropic-dangerous-direct-browser-access: true`
- **Web search tool**: `web_search_20250305`

## Adding a New Agent
1. Add HTML card in `public/index.html` with a new `card-N` / `dot-N` / `out-N` id
2. Add `async function runAgentN(inputs)` following the existing pattern
3. Call it in `runPipeline()` at the correct phase
4. Add `'N'` to the `resetAll()` array
5. Write the agent's system prompt and JSON schema in `src/agents/agentN.js`

## Modifying Agent Prompts
Each agent uses a structured JSON response format. The prompt includes:
- A detailed system role
- An example JSON schema the agent must match
- Input context from previous agents (truncated to fit token budget)

When modifying prompts, keep the JSON schema stable — the render functions depend on specific field names.

## Target Market Context
- **ZIP code**: 30097 (Duluth, GA) — default, configurable in UI
- **Radius**: 40 miles — covers Gwinnett, Barrow, Forsyth, and Fulton counties
- **Grades**: Infant–Pre-K (configurable)
- **Counties covered**: Gwinnett, Barrow (Winder/Auburn), Forsyth (Cumming), Fulton (Johns Creek)

## Known Limitations
- Browser sandbox blocks API calls from Claude.ai artifacts — must run as a local file
- CORS requires the `anthropic-dangerous-direct-browser-access` header
- Agent 13 (Competitor Deep-Dive) references review data from Claude's training — live Yelp/Google scraping is not possible via browser
- Map uses static SVG coordinates — not a live tile map

## Potential Enhancements
- [ ] Export full report as PDF
- [ ] Save/load pipeline results to localStorage
- [ ] Add a second-location analysis agent
- [ ] Integrate Google Maps embed for real tile map
- [ ] Add email draft agent for outreach to brokers/DECAL
- [ ] Multi-zip comparison mode
