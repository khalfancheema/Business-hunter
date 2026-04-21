# 🏫 Daycare Planning Agent System

> A 13-agent AI pipeline that performs comprehensive childcare business planning — demographics research, gap analysis, site selection, live real estate search, regulatory compliance, financial modeling, SBA business plan generation, project planning, market mapping, grant discovery, and competitor deep-dive — all in a single browser file.

---

## Quick Start

1. **Download** `public/index.html`
2. **Open** it in Chrome or Firefox (double-click)
3. **Enter** your [Anthropic API key](https://console.anthropic.com)
4. **Click** ▶ Run Pipeline

No server, no install, no dependencies. Just open and run.

---

## What It Does

The system runs 13 specialized AI agents in a structured pipeline:

```
Phase 1 (Parallel)    Demographics + Compliance + Competitive Intel
Phase 2               Gap Analysis
Phase 3               Site Selection (6 locations ranked)
Phase 4 (Parallel)    Real Estate Search + Financial Feasibility
Phase 5               Executive Summary (Go/No-Go)
Phase 6               Business Plan (SBA 7a + Investor Deck)
Phase 7               Project Plan (18-month Gantt)
Phase 8               Market Map (interactive, color-coded)
Phase 9               Grant Search (CAPS, USDA, Barrow County)
Phase 10              Competitor Deep-Dive (reviews + differentiation)
```

---

## Agent Outputs

| Agent | Output Tabs |
|-------|-------------|
| **Demographics** | Summary · Heatmap · Chart · City Table |
| **Compliance** | Summary · Requirements · Timeline |
| **Competitive Intel** | Summary · Market Chart · By City |
| **Gap Analysis** | Analysis · Heatmap · City Rankings · Gap Chart |
| **Site Selection** | Strategy · 6 Options · Radar Chart · Comparison Table |
| **Real Estate** | Summary · Live Listings (links) · By City · Cost Chart |
| **Financial Feasibility** | Summary · 3 Scenarios · P&L Chart · Cost by City |
| **Executive Summary** | Go/No-Go verdict + rationale |
| **Business Plan** | Overview · Market · Financials · Operations · SBA Package · Investor Deck |
| **Project Plan** | Gantt · Milestones · Budget Tracker · Risk Register · Team & Vendors · Checklist |
| **Market Map** | Interactive Map · Legend · Directions |
| **Grant Search** | Summary · GA CAPS Rates · USDA & Federal · Local Incentives · Full Table |
| **Competitor Deep-Dive** | Summary · Profiles · Pain Points · Differentiation · Messaging Guide |

---

## Configuration

| Field | Default | Description |
|-------|---------|-------------|
| ZIP Code | `30097` | Center of search radius (Duluth, GA) |
| Radius | `40` miles | Search area |
| Grades | Infant–Pre-K | Age groups served |
| Capacity | `75` | Target enrollment |
| Budget | `$600,000` | Total startup capital |

---

## Coverage Area

- **Gwinnett County**: Duluth, Suwanee, Sugar Hill, Buford, Lawrenceville, Norcross, Peachtree Corners
- **Barrow County**: Winder, Auburn, Bethlehem *(fastest growing, most underserved)*
- **Forsyth County**: Cumming
- **Fulton County**: Johns Creek, Alpharetta

---

## Tech Stack

- **AI**: Anthropic Claude Sonnet 4.6 via direct browser API calls
- **Charts**: Chart.js 4.4.1
- **Map**: Custom SVG (inline, no tile service needed)
- **Fonts**: Syne + Instrument Sans (Google Fonts)
- **Build**: Zero — single HTML file, no bundler

---

## API Cost Estimate

| Scenario | API calls | Est. cost |
|----------|-----------|-----------|
| Full pipeline | 13 agents | ~$0.25–$0.45 |
| Phases 1–5 only | 8 agents | ~$0.12–$0.20 |

Costs vary based on how much context each agent receives.

---

## Project Structure

```
daycare-agent-system/
├── CLAUDE.md                  # Claude Code instructions
├── README.md                  # This file
├── package.json               # Project metadata
├── .gitignore
├── public/
│   └── index.html             # ← THE APP (open this)
├── src/
│   ├── agents/                # Agent prompts & schemas (reference)
│   │   ├── agent01-demographics.js
│   │   ├── agent02-gap-analysis.js
│   │   ├── agent03-site-selection.js
│   │   ├── agent04-real-estate.js
│   │   ├── agent05-compliance.js
│   │   ├── agent06-competitive-intel.js
│   │   ├── agent07-financials.js
│   │   ├── agent08-executive-summary.js
│   │   ├── agent09-business-plan.js
│   │   ├── agent10-project-plan.js
│   │   ├── agent11-market-map.js
│   │   ├── agent12-grants.js
│   │   └── agent13-competitor-deepdive.js
│   ├── utils/
│   │   ├── api.js             # Anthropic API wrapper
│   │   ├── charts.js          # Chart.js helpers
│   │   ├── map.js             # SVG map builder
│   │   └── parseJSON.js       # Safe JSON parser
│   ├── styles/
│   │   └── main.css           # Full dark theme CSS
│   └── components/
│       ├── agentCard.html     # Agent card template
│       ├── heatmap.html       # Heatmap template
│       └── linkCard.html      # Real estate listing card
└── docs/
    ├── architecture.md        # Pipeline architecture diagram
    ├── agent-schemas.md       # All JSON schemas
    └── deployment.md          # Deployment options
```

---

## License

MIT — use freely, modify as needed.

---

## Built With

Claude Sonnet 4.6 · Anthropic API · Chart.js · Syne & Instrument Sans
