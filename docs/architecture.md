# Pipeline Architecture

## Overview

```
User Input (ZIP, radius, grades, capacity, budget)
         │
         ▼
┌────────────────────────────────────────────────────────┐
│                   MASTER ORCHESTRATOR                  │
│          Manages phases, context passing,              │
│          parallel execution, error handling            │
└─────────────────────┬──────────────────────────────────┘
                      │
      ┌───────────────┼───────────────┐
      │          PHASE 1 (parallel)   │
      ▼               ▼               ▼
┌──────────┐   ┌──────────┐   ┌──────────────────┐
│  DEMO-   │   │ COMPLI-  │   │  COMPETITIVE     │
│ GRAPHICS │   │  ANCE    │   │  INTELLIGENCE    │
│ Agent 1  │   │ Agent 5  │   │  Agent 6         │
│ 🔍 Search│   │ 🔍 Search│   │  🔍 Search       │
└────┬─────┘   └────┬─────┘   └────────┬─────────┘
     │              │                   │
     └──────────────┼───────────────────┘
                    │
                    ▼
              ┌──────────┐
              │   GAP    │
              │ ANALYSIS │
              │ Agent 2  │
              └────┬─────┘
                   │
                   ▼
            ┌──────────────┐
            │     SITE     │
            │  SELECTION   │
            │   Agent 3   │
            └──────┬───────┘
                   │
        ┌──────────┴──────────┐
        │    PHASE 4 (parallel)│
        ▼                      ▼
┌─────────────┐       ┌──────────────────┐
│ REAL ESTATE │       │   FINANCIAL      │
│   Agent 4   │       │  FEASIBILITY     │
│  🔍 Search  │       │   Agent 7        │
└──────┬──────┘       └────────┬─────────┘
       │                        │
       └────────────┬───────────┘
                    │
                    ▼
           ┌─────────────────┐
           │    EXECUTIVE    │
           │    SUMMARY      │
           │    Agent 8      │
           └────────┬────────┘
                    │
         ┌──────────┴──────────┐
         │                      │
         ▼                      ▼
┌──────────────┐       ┌──────────────────┐
│   BUSINESS   │       │     PROJECT      │
│    PLAN      │       │      PLAN        │
│   Agent 9    │       │    Agent 10      │
└──────────────┘       └──────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────┐
│               PHASE 8-10 (sequential)                │
├──────────────┬───────────────┬──────────────────────-┤
│  MARKET MAP  │ GRANT SEARCH  │  COMPETITOR DEEP-DIVE │
│  Agent 11    │  Agent 12     │  Agent 13             │
│              │  🔍 Search    │  🔍 Search            │
└──────────────┴───────────────┴───────────────────────┘
                    │
                    ▼
           ┌─────────────────┐
           │  FINAL REPORT   │
           │  (assembled     │
           │   from all)     │
           └─────────────────┘
```

## Context Passing

Each agent receives truncated output from relevant upstream agents to stay within token budgets:

| Agent | Receives from |
|-------|--------------|
| 2 (Gap) | 1, 5, 6 (600 chars each) |
| 3 (Site) | 1, 2, 5 (400-500 chars each) |
| 4 (Real Estate) | 3, 5 |
| 7 (Financial) | 3, 5 |
| 8 (Executive) | 1-7 (250 chars each) |
| 9 (Business Plan) | 1-8 (300-500 chars each) |
| 10 (Project Plan) | 3, 4, 5, 7, 9 (300 chars each) |
| 11 (Map) | 1, 2, 4 |
| 12 (Grants) | 3, 5 |
| 13 (Competitors) | 6 |

## Data Flow Types

- **Structured JSON** — all agents emit and consume JSON; no free text passing
- **Truncated context** — upstream agent output is `.substring(0, N)` before passing down
- **Parallel execution** — `Promise.all()` for Phase 1 (agents 1+5+6) and Phase 4 (agents 4+7)

## Token Budget per Agent

| Agent | Max Tokens | System | User (approx) |
|-------|-----------|--------|--------------|
| 1 Demographics | 3000 | 200 | 800 |
| 5 Compliance | 3000 | 150 | 700 |
| 6 Competitive | 3000 | 150 | 600 |
| 2 Gap Analysis | 3000 | 150 | 1200 |
| 3 Site Selection | 3000 | 150 | 1400 |
| 4 Real Estate | 3000 | 150 | 1800 |
| 7 Financial | 3000 | 150 | 1600 |
| 8 Executive | 3000 | 150 | 2200 |
| 9 Business Plan | 3000 | 200 | 2400 |
| 10 Project Plan | 3000 | 200 | 2400 |
| 11 Market Map | 3000 | 150 | 900 |
| 12 Grants | 3000 | 150 | 1200 |
| 13 Comp Deep-Dive | 3000 | 150 | 1100 |

## Error Handling

- Each agent is wrapped in `try/catch`
- On error: agent card turns red, error message displayed in output panel
- Pipeline halts at the failed agent — earlier results remain visible
- User can inspect partial results and re-run after fixing

## Browser Requirements

- Chrome 90+ or Firefox 88+ (for `fetch`, ES2020, SVG support)
- No server required — runs as a local HTML file
- API key entered in UI — never stored, only held in memory for the session
