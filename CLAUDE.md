# Daycare Planning Agent System

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
