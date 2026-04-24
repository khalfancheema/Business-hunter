# 🏢 Business Planning Agent System

> A 15-agent AI pipeline that performs comprehensive business planning across 6 industries — demographics research, gap analysis, site selection, live real estate search, regulatory compliance, financial modeling, SBA business plan generation, project planning, market mapping, grant discovery, competitor deep-dive, code review, and QA — all in a single browser file.

---

## Quick Start

1. **Download** `public/index.html`
2. **Open** it in Chrome or Firefox (double-click)
3. **Choose** your industry (Daycare, Gas Station, Laundromat, Car Wash, Restaurant, Gym)
4. **Select** your AI provider and enter your API key
5. **Click** ▶ Run Pipeline

No server, no install, no dependencies. Just open and run.

> **Try it first:** Click **Demo Mode** to run the full pipeline with no API key.

---

## Supported AI Providers

| Provider | Models | API Key |
|----------|--------|---------|
| **Anthropic (Claude)** | claude-sonnet-4-6, claude-opus-4-5, etc. | [console.anthropic.com](https://console.anthropic.com) |
| **OpenAI (GPT-4o)** | gpt-4o, gpt-4o-mini, etc. | [platform.openai.com](https://platform.openai.com) |
| **Google Gemini** | gemini-1.5-pro, gemini-2.0-flash, etc. | [aistudio.google.com](https://aistudio.google.com) |
| **OpenAI-Compatible** | Any local or hosted model (LM Studio, Ollama, Together, etc.) | Custom URL + key |

---

## Supported Industries

| Industry | Planning Focus |
|----------|----------------|
| 🧒 **Daycare** | Enrollment capacity, infant/preschool rates, CAPS compliance |
| ⛽ **Gas Station** | Fuel volume, convenience margin, environmental permits |
| 👕 **Laundromat** | Machine count, wash-dry-fold revenue, utility costs |
| 🚗 **Car Wash** | Ticket volume, membership model, throughput analysis |
| 🍽️ **Restaurant** | Covers/day, ticket average, health permits, labor |
| 💪 **Gym** | Member count, PT revenue, equipment capex |

---

## What It Does

The system runs 15 specialized AI agents in a structured pipeline:

```
Phase 1 (Parallel)    Agent 1: Demographics  +  Agent 5: Compliance  +  Agent 6: Competitive Intel
Phase 2               Agent 2: Gap Analysis
Phase 3               Agent 3: Site Selection (top 6 locations ranked)
Phase 4 (Parallel)    Agent 4: Real Estate Search  +  Agent 7: Financial Feasibility
Phase 5               Agent 8: Executive Summary (Go/No-Go verdict)
Phase 6               Agent 9: Business Plan (SBA 7a + Investor Deck)
Phase 7               Agent 10: Project Plan (18-month Gantt + risk register)
Phase 8 (Parallel)    Agent 11: Market Map  +  Agent 12: Grant Search  +  Agent 13: Competitor Deep-Dive
Phase 9               Agent 14: Code Review (pipeline self-assessment)
Phase 10              Agent 15: QA Validation (data integrity + UX audit)
```

---

## Agent Outputs

| Agent | Output Tabs |
|-------|-------------|
| **1 · Demographics** | Summary · Heatmap · Chart · City Table |
| **2 · Gap Analysis** | Analysis · Heatmap · City Rankings · Gap Chart |
| **3 · Site Selection** | Strategy · 6 Options · Radar Chart · Comparison Table |
| **4 · Real Estate** | Summary · Live Listings (links) · By City · Cost Chart |
| **5 · Compliance** | Summary · Requirements · Timeline |
| **6 · Competitive Intel** | Summary · Market Chart · By City |
| **7 · Financial Feasibility** | Summary · 3 Scenarios · P&L Chart · Cost by City |
| **8 · Executive Summary** | Go/No-Go verdict + rationale |
| **9 · Business Plan** | Overview · Market · Financials · Operations · SBA Package · Investor Deck |
| **10 · Project Plan** | Gantt · Milestones · Budget Tracker · Risk Register · Team & Vendors · Checklist |
| **11 · Market Map** | Interactive Map · Legend · Directions |
| **12 · Grant Search** | Summary · Federal Grants · State Grants · Local Incentives · Full Table |
| **13 · Competitor Deep-Dive** | Profiles · Pain Points · Differentiation · Messaging Guide |
| **14 · Code Review** | Issues · Metrics · Cost Analysis · Recommended Fixes |
| **15 · QA Validation** | Test Suites · Data Validation · UX Audit · Health Score |

Every agent card has a **{ } Raw** button to inspect the full JSON driving that panel.

---

## Features

### Pipeline Controls
- **▶ Run Pipeline** — starts all 15 agents
- **⬛ Stop** — halts the pipeline after the current agent completes
- **Per-agent timers** — each dot shows elapsed seconds while running and total time when done
- **Demo Mode** — runs a full simulated pipeline with no API key

### Performance
- **Response caching** — results are cached in memory + localStorage (4-hour TTL); re-running the same inputs skips API calls
- **Clear Cache** button — forces fresh data on next run
- **Parallel phases** — Agents 1+5+6 run simultaneously; Agents 11+12+13 run simultaneously

### Data Quality
- **Error recovery** — every agent has fallback data; partial failures don't crash the pipeline
- **Drill-down** — click **{ } Raw** on any agent to see the exact JSON output driving that panel
- **Industry-aware labels** — all tables, charts, and cards use terminology appropriate to the selected industry

---

## Configuration

| Field | Default | Description |
|-------|---------|-------------|
| Industry | `Daycare` | Business type — changes all labels, prompts, and financial models |
| ZIP Code | `30097` | Center of search radius |
| Radius | `40` miles | Search area |
| Capacity | `75` | Target units (enrollment, pumps, machines, covers, members) |
| Budget | `$600,000` | Total startup capital |
| Provider | `Anthropic` | AI provider |
| API Key | *(your key)* | Provider API key |
| Model | *(auto)* | Model ID (defaults to provider best-fit) |

---

## API Cost Estimate

| Scenario | Agents | Est. cost (Claude Sonnet) |
|----------|--------|---------------------------|
| Full pipeline | 15 agents | ~$0.30–$0.55 |
| Phases 1–5 only | 8 agents | ~$0.12–$0.20 |
| Cached re-run | 15 agents | ~$0.00 |

Costs vary based on response length and provider pricing.

---

## Tech Stack

- **AI**: Multi-provider — Anthropic, OpenAI, Google Gemini, OpenAI-compatible local models
- **Charts**: Chart.js 4.4.1
- **Map**: Custom SVG (inline, no tile service needed)
- **Fonts**: Syne + Instrument Sans (Google Fonts)
- **Build**: Zero — single HTML file, no bundler, no install

---

## Project Structure

```
daycare-agent-system/
├── public/
│   └── index.html          ← THE APP (open this in a browser)
├── README.md
├── package.json
└── .gitignore
```

---

## License

MIT — use freely, modify as needed.

---

## Built With

Claude Sonnet 4.6 · Anthropic API · Chart.js · Syne & Instrument Sans
