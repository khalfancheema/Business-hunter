# Agent JSON Schemas

All agents return structured JSON. This document lists each agent's output schema — used by the render functions in `public/index.html`.

---

## Agent 1 — Demographics
```json
{
  "data_sources": ["string"],
  "summary": "string",
  "cities": [{
    "name": "string", "county": "string", "distance_miles": 0,
    "pop_total": 0, "pop_under5": 0, "pop_under5_pct": 0.0,
    "median_hh_income": 0, "labor_force_pct": 0.0,
    "pop_growth_pct_5yr": 0.0, "households": 0,
    "working_parents_est_pct": 0, "demand_score": 0,
    "data_note": "string"
  }],
  "age_breakdown_county": [{
    "age_group": "string", "gwinnett_pop": 0,
    "fulton_pop": 0, "gap_capacity": 0
  }]
}
```

## Agent 5 — Compliance
```json
{
  "summary": "string",
  "decal_url": "string",
  "requirements": [{
    "category": "string", "item": "string", "detail": "string",
    "timeline_weeks": 0, "cost_usd": 0,
    "source": "string", "priority": "Critical|High|Medium"
  }],
  "timeline_phases": [{
    "phase": "string", "weeks": 0, "tasks": "string"
  }]
}
```

## Agent 6 — Competitive Intelligence
```json
{
  "summary": "string",
  "total_licensed_estimated": 0,
  "cities": [{
    "city": "string", "center_count": 0,
    "avg_monthly_infant": 0, "avg_monthly_preschool": 0,
    "avg_rating": 0.0, "capacity_utilization_pct": 0,
    "waitlist_common": true, "gap_score": 0
  }],
  "top_chains": [{
    "name": "string", "locations_in_area": 0,
    "monthly_tuition_range": "string",
    "rating": 0.0, "type": "string"
  }]
}
```

## Agent 2 — Gap Analysis
```json
{
  "summary": "string",
  "overall_opportunity_score": 0,
  "cities": [{
    "city": "string", "rank": 0,
    "demand_score": 0, "supply_score": 0, "gap_score": 0,
    "unserved_children": 0, "income_tier": "string",
    "recommended_tuition_infant": 0, "recommended_tuition_preschool": 0,
    "priority": "string", "rationale": "string"
  }],
  "age_gaps": [{
    "age": "string", "demand_idx": 0, "supply_idx": 0, "gap": 0
  }]
}
```

## Agent 3 — Site Selection
```json
{
  "summary": "string",
  "locations": [{
    "rank": 0, "city": "string", "submarket": "string",
    "overall_score": 0,
    "scores": {"demand":0,"competition":0,"demographics":0,"real_estate":0,"regulatory":0},
    "capacity_recommended": 0,
    "target_infant_tuition": 0, "target_preschool_tuition": 0,
    "risk": "string", "timeline_months": 0,
    "children_under5_nearby": 0, "competitors_within_2mi": 0,
    "sqft_needed": 0, "est_monthly_rent_range": "string",
    "ideal_property_type": "string", "zoning_needed": "string",
    "pros": ["string"], "cons": ["string"]
  }]
}
```

## Agent 4 — Real Estate
```json
{
  "summary": "string",
  "search_urls": {"loopnet":"url","bizbuysell":"url","crexi":"url","barrow_planning":"url"},
  "listings": [{
    "id": 0, "address": "string", "city": "string",
    "property_type": "string", "sqft": 0, "monthly_rent": 0,
    "price_per_sqft": 0.0, "zoning": "string",
    "outdoor_space_available": true, "outdoor_sqft_est": 0,
    "suitable_for_daycare": true, "buildout_cost_est": 0,
    "source": "LoopNet|BizBuySell|CoStar|Crexi",
    "listing_url": "string",
    "broker_name": "string", "broker_phone": "string",
    "availability": "string", "score": 0, "notes": "string"
  }],
  "by_city_summary": [{
    "city": "string", "avg_rent_sqft": 0.0,
    "available_listings_est": 0, "best_zoning": "string",
    "market_note": "string"
  }]
}
```

## Agent 7 — Financial Feasibility
```json
{
  "summary": "string",
  "total_startup_cost": 0,
  "startup_breakdown": [{"item":"string","amount":0,"category":"string"}],
  "monthly_ops": [{"item":"string","amount":0}],
  "scenarios": [{
    "name": "string", "label": "string", "enrolled": 0,
    "avg_tuition": 0, "monthly_revenue": 0, "monthly_expenses": 0,
    "monthly_net": 0, "annual_net": 0,
    "breakeven_months": 0, "roi_3yr": 0, "color": "string"
  }],
  "projections": [{"month":"string","rev":0,"exp":0,"cum":0}],
  "by_city_financials": [{
    "city":"string","monthly_rent":0,"avg_infant_tuition":0,
    "break_even_enrolled":0,"yr1_net":0,"yr3_net":0
  }],
  "funding": [{"source":"string","amount":0,"terms":"string","notes":"string"}]
}
```

## Agent 8 — Executive Summary
```json
{
  "verdict": "Go|Cautious Go|No Go",
  "verdict_rationale": "string",
  "assessment": "string",
  "success_factors": ["string"],
  "risks": [{"risk":"string","mitigation":"string","severity":"High|Medium|Low"}],
  "next_steps": ["string"]
}
```

## Agent 9 — Business Plan
*(See full schema in `src/agents/agent09-business-plan.js`)*

## Agent 10 — Project Plan
*(See full schema in `src/agents/agent10-project-plan.js`)*

## Agent 11 — Market Map
```json
{
  "center": {"lat":0,"lng":0,"label":"string"},
  "cities": [{
    "name":"string","county":"string",
    "lat":0,"lng":0,
    "gap_score":0,"demand_score":0,"supply_score":0,
    "unserved_children":0,"median_income":0,
    "competitor_count":0,"priority":"string",
    "recommended_action":"string","real_estate_url":"string"
  }],
  "real_estate_pins": [{"label":"string","lat":0,"lng":0,"rent":0,"sqft":0,"url":"string"}],
  "directions": [{"from":"string","to":"string","drive_mins":0,"miles":0,"google_url":"string"}]
}
```

## Agent 12 — Grant Search
*(See full schema in `src/agents/agent12-grants.js`)*

## Agent 13 — Competitor Deep-Dive
*(See full schema in `src/agents/agent13-competitor-deepdive.js`)*
