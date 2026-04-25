# Agent JSON Schemas

All 17 agents return structured JSON. This document lists each agent's output schema — used by the render functions to build the UI panels.

> **Null-safety rule:** Any numeric field where real data is unavailable will be `null` (not `0`). Any string field will be `"N/A"` or `"Information not available"`. The render functions use `_nv()` / `_nvNum()` to display these gracefully.

---

## Agent 1 — Demographics
*File: `07-render-01.js` · Phase 1 (parallel)*

Sources: US Census ACS 2023 1-year & 2022 5-year (Tables B01001, B19013, B23025, B25001, S0901, B08303), Census PEP 2020–2023, BLS QCEW, BLS Consumer Expenditure Survey, FHWA AADT, NCES, FRED, State vital statistics, NAR migration data.

```json
{
  "data_sources": ["string"],
  "summary": "string",
  "metro_overview": {
    "metro_name": "string",
    "total_pop_metro": 0,
    "pop_growth_pct_1yr": 0.0,
    "median_hh_income_metro": 0,
    "unemployment_rate_pct": 0.0,
    "net_migration_annual": 0,
    "birth_rate_per_1000": 0.0,
    "source": "string"
  },
  "cities": [
    {
      "name": "string",
      "county": "string",
      "distance_miles": 0,
      "pop_total": 0,
      "pop_under5": 0,
      "pop_under5_pct": 0.0,
      "median_hh_income": 0,
      "income_distribution": {
        "under_50k_pct": 0,
        "50_100k_pct": 0,
        "over_100k_pct": 0
      },
      "labor_force_pct": 0.0,
      "women_25_44_lfp_pct": 0.0,
      "pop_growth_pct_5yr": 0.0,
      "pop_growth_pct_1yr": 0.0,
      "households": 0,
      "owner_occupied_pct": 0,
      "renter_pct": 0,
      "working_parents_est_pct": 0,
      "dual_income_hh_est_pct": 0,
      "avg_commute_minutes": 0,
      "school_enrollment_k12": 0,
      "annual_births_county_est": 0,
      "traffic_aadt_main_corridor": 0,
      "walkability_score": 0,
      "housing_affordability_index": 0,
      "demand_score": 0,
      "data_note": "string"
    }
  ],
  "age_breakdown_county": [
    {
      "age_group": "string",
      "gwinnett_pop": 0,
      "fulton_pop": 0,
      "gap_capacity": 0,
      "source": "string"
    }
  ],
  "labor_market_summary": {
    "top_employer_sectors": ["string"],
    "median_wage_primary_occupation": 0,
    "female_labor_force_pct_county": 0.0,
    "source": "string"
  },
  "housing_market_summary": {
    "median_home_value": 0,
    "new_permits_issued_2023": 0,
    "yoy_permit_growth_pct": 0.0,
    "source": "string"
  }
}
```

---

## Agent 2 — Gap Analysis
*File: `10-render-04.js` · Phase 2*

Sources: NDCP (National Database of Childcare Prices), Child Care Aware, CCDF subsidy data, Head Start Program locator, NAEYC, Winnie, CCR&R agency reports, ProPublica, Urban Institute, Child Trends, NWLC, KIDS COUNT.

```json
{
  "summary": "string",
  "overall_opportunity_score": 0,
  "is_childcare_desert": true,
  "childcare_desert_ratio": 0.0,
  "ndcp_median_infant_rate": 0,
  "ndcp_median_toddler_rate": 0,
  "ndcp_median_preschool_rate": 0,
  "ndcp_source": "string",
  "data_sources_used": ["string"],
  "cities": [
    {
      "city": "string",
      "rank": 0,
      "demand_score": 0,
      "supply_score": 0,
      "gap_score": 0,
      "unserved_children": 0,
      "licensed_centers_count": 0,
      "total_licensed_capacity_est": 0,
      "demand_to_supply_ratio": 0.0,
      "ndcp_county_median_infant": 0,
      "head_start_slots": 0,
      "is_desert": true,
      "income_tier": "string",
      "recommended_tuition_infant": 0,
      "recommended_tuition_preschool": 0,
      "pricing_premium_vs_market_pct": 0.0,
      "priority": "string",
      "rationale": "string"
    }
  ],
  "age_gaps": [
    {
      "age": "string",
      "demand_idx": 0,
      "supply_idx": 0,
      "gap": 0
    }
  ]
}
```

---

## Agent 3 — Site Selection
*File: `11-render-05.js` · Phase 3*

```json
{
  "summary": "string",
  "locations": [
    {
      "rank": 0,
      "city": "string",
      "submarket": "string",
      "overall_score": 0,
      "scores": {
        "demand": 0,
        "competition": 0,
        "demographics": 0,
        "real_estate": 0,
        "regulatory": 0
      },
      "capacity_recommended": 0,
      "target_infant_tuition": 0,
      "target_preschool_tuition": 0,
      "risk": "string",
      "timeline_months": 0,
      "children_under5_nearby": 0,
      "competitors_within_2mi": 0,
      "sqft_needed": 0,
      "est_monthly_rent_range": "string",
      "ideal_property_type": "string",
      "zoning_needed": "string",
      "pros": ["string"],
      "cons": ["string"],
      "reasoning": "string",
      "reasoning_sources": ["string"],
      "address": "string"
    }
  ]
}
```

---

## Agent 4 — Real Estate Search
*File: `12-render-06.js` · Phase 4*

Sources: LoopNet, Crexi, BizBuySell, Zillow Commercial, CoStar, county GIS/property records, state economic development portals.

```json
{
  "summary": "string",
  "search_urls": {
    "loopnet_primary": "string",
    "loopnet_secondary": "string",
    "bizbuysell": "string",
    "crexi_primary": "string",
    "crexi_secondary": "string",
    "zillow_commercial": "string",
    "costar": "string",
    "county_gis": "string",
    "economic_dev": "string"
  },
  "listings": [
    {
      "id": 0,
      "address": "string",
      "city": "string",
      "property_type": "string",
      "sqft": 0,
      "monthly_rent": 0,
      "price_per_sqft": 0.0,
      "zoning": "string",
      "outdoor_space_available": true,
      "outdoor_sqft_est": 0,
      "suitable_for_industry": true,
      "buildout_cost_est": 0,
      "source": "LoopNet|BizBuySell|CoStar|Crexi|Zillow Commercial",
      "listing_url": "string",
      "broker_name": "string",
      "broker_phone": "string",
      "availability": "string",
      "score": 0,
      "notes": "string"
    }
  ],
  "by_city_summary": [
    {
      "city": "string",
      "avg_rent_sqft": 0.0,
      "available_listings_est": 0,
      "best_zoning": "string",
      "market_note": "string",
      "loopnet_url": "string",
      "crexi_url": "string"
    }
  ]
}
```

---

## Agent 5 — Compliance & Regulatory
*File: `08-render-02.js` · Phase 1 (parallel)*

```json
{
  "summary": "string",
  "agency_url": "string",
  "requirements": [
    {
      "category": "string",
      "item": "string",
      "detail": "string",
      "timeline_weeks": 0,
      "cost_usd": 0,
      "source": "string",
      "priority": "Critical|High|Medium",
      "apply_url": "string",
      "agency_name": "string",
      "apply_instructions": ["string"],
      "form_name": "string",
      "apply_phone": "string",
      "apply_email": "string",
      "online_available": true,
      "apply_notes": "string"
    }
  ],
  "timeline_phases": [
    {
      "phase": "string",
      "weeks": 0,
      "tasks": "string"
    }
  ]
}
```

> **How to Apply tab:** `apply_url`, `agency_name`, `apply_instructions[]`, `form_name`, `apply_phone`, `apply_email`, `online_available`, and `apply_notes` power the How to Apply cards in Agent 5's third tab.

---

## Agent 6 — Competitive Intelligence
*File: `09-render-03.js` · Phase 1 (parallel)*

Sources: Winnie.com, Care.com, state QRIS databases, NAEYC accreditation finder, Head Start Program locator, ProPublica 990 nonprofit filings, NDCP county rates, Yelp Business API, Google Business.

```json
{
  "summary": "string",
  "total_licensed_estimated": 0,
  "competitive_intensity_score": 0,
  "market_structure_note": "string",
  "total_accredited_naeyc": 0,
  "total_head_start_slots": 0,
  "ndcp_median_rates": {
    "infant": 0,
    "toddler": 0,
    "preschool": 0,
    "source": "string"
  },
  "cities": [
    {
      "city": "string",
      "center_count": 0,
      "licensed_capacity_total": 0,
      "chain_count": 0,
      "independent_count": 0,
      "nonprofit_count": 0,
      "naeyc_accredited_count": 0,
      "qris_avg_stars": 0.0,
      "head_start_slots_city": 0,
      "avg_monthly_infant": 0,
      "avg_monthly_preschool": 0,
      "avg_rating": 0.0,
      "avg_review_count": 0,
      "avg_waitlist_weeks": 0,
      "capacity_utilization_pct": 0,
      "waitlist_common": true,
      "gap_score": 0
    }
  ],
  "centers": [
    {
      "name": "string",
      "city": "string",
      "type": "Chain|Independent|Nonprofit",
      "accreditation": "NAEYC|None|string",
      "qris_stars": 0,
      "currently_enrolling": true,
      "waitlist_weeks": 0,
      "monthly_infant": 0,
      "monthly_preschool": 0,
      "rating": 0.0,
      "review_count": 0,
      "capacity_est": 0,
      "nonprofit": false,
      "yelp_url": "string",
      "winnie_url": "string",
      "notes": "string"
    }
  ]
}
```

---

## Agent 7 — Financial Feasibility
*File: `26-agent-fin-subs.js` · Phase 5 (3 sub-agent calls)*

```json
{
  "summary": "string",
  "total_startup_cost": 0,
  "startup_breakdown": [
    { "item": "string", "amount": 0, "category": "string" }
  ],
  "monthly_ops": [
    { "item": "string", "amount": 0 }
  ],
  "scenarios": [
    {
      "name": "string",
      "label": "string",
      "enrolled": 0,
      "avg_tuition": 0,
      "monthly_revenue": 0,
      "monthly_expenses": 0,
      "monthly_net": 0,
      "annual_net": 0,
      "breakeven_months": 0,
      "roi_3yr": 0,
      "color": "string"
    }
  ],
  "projections": [
    { "month": "string", "rev": 0, "exp": 0, "cum": 0 }
  ],
  "by_city_financials": [
    {
      "city": "string",
      "monthly_rent": 0,
      "avg_primary_rate": 0,
      "break_even_enrolled": 0,
      "yr1_net": 0,
      "yr3_net": 0
    }
  ],
  "funding": [
    { "source": "string", "amount": 0, "terms": "string", "notes": "string" }
  ]
}
```

---

## Agent 8 — Executive Summary
*File: `14-render-08.js` · Phase 6*

```json
{
  "verdict": "Go|Cautious Go|No Go",
  "verdict_rationale": "string",
  "assessment": "string",
  "strengths": ["string"],
  "success_factors": ["string"],
  "risks": [
    {
      "risk": "string",
      "mitigation": "string",
      "severity": "High|Medium|Low"
    }
  ],
  "next_steps": ["string"],
  "recommendation_rationale": "string"
}
```

---

## Agent 9 — Business Plan
*File: `15-render-09.js` + `24-agent-09-parts.js` · Phase 7 (4 sub-agent calls)*

```json
{
  "executive_summary": {
    "concept": "string",
    "opportunity": "string",
    "competitive_advantage": "string",
    "funding_ask": 0,
    "projected_revenue_yr1": 0,
    "projected_revenue_yr3": 0
  },
  "market_analysis": {
    "target_market": "string",
    "market_size": "string",
    "trends": ["string"],
    "customer_segments": ["string"]
  },
  "financial_plan": {
    "revenue_model": "string",
    "key_assumptions": ["string"],
    "five_year_projection": [
      { "year": "string", "revenue": 0, "expenses": 0, "net": 0 }
    ]
  },
  "operations_plan": {
    "facility_requirements": "string",
    "staffing_plan": "string",
    "daily_operations": "string",
    "technology_systems": ["string"]
  },
  "sba_package": {
    "loan_type": "string",
    "loan_amount": 0,
    "use_of_funds": ["string"],
    "collateral": "string",
    "personal_guarantee": "string"
  },
  "investor_deck": {
    "slides": [
      { "title": "string", "content": "string" }
    ]
  }
}
```

---

## Agent 10 — Project Plan
*File: `16-render-10.js` + `25-agent-10-parts.js` · Phase 8 (3 sub-agent calls)*

```json
{
  "gantt": [
    {
      "phase": "string",
      "start_month": 0,
      "duration_months": 0,
      "tasks": ["string"],
      "dependencies": ["string"]
    }
  ],
  "milestones": [
    {
      "month": 0,
      "name": "string",
      "deliverable": "string",
      "owner": "string"
    }
  ],
  "budget_tracker": [
    { "category": "string", "budgeted": 0, "notes": "string" }
  ],
  "risk_register": [
    {
      "risk": "string",
      "probability": "High|Medium|Low",
      "impact": "High|Medium|Low",
      "mitigation": "string",
      "owner": "string"
    }
  ],
  "team_vendors": [
    {
      "role": "string",
      "type": "Employee|Contractor|Vendor",
      "hire_month": 0,
      "cost_monthly": 0,
      "notes": "string"
    }
  ],
  "launch_checklist": [
    {
      "category": "string",
      "item": "string",
      "deadline_month": 0,
      "status": "string"
    }
  ]
}
```

---

## Agent 11 — Market Map
*File: `17-render-11.js` · Phase 9 (parallel)*

```json
{
  "center": { "lat": 0.0, "lng": 0.0, "label": "string" },
  "cities": [
    {
      "name": "string",
      "county": "string",
      "lat": 0.0,
      "lng": 0.0,
      "gap_score": 0,
      "demand_score": 0,
      "supply_score": 0,
      "unserved_children": 0,
      "median_income": 0,
      "competitor_count": 0,
      "priority": "string",
      "recommended_action": "string",
      "real_estate_url": "string"
    }
  ],
  "real_estate_pins": [
    { "label": "string", "lat": 0.0, "lng": 0.0, "rent": 0, "sqft": 0, "url": "string" }
  ],
  "directions": [
    {
      "from": "string",
      "to": "string",
      "drive_mins": 0,
      "miles": 0.0,
      "google_url": "string"
    }
  ]
}
```

---

## Agent 12 — Grant Search
*File: `18-render-12.js` · Phase 9 (parallel)*

```json
{
  "summary": "string",
  "total_funding_available": 0,
  "federal_grants": [
    {
      "name": "string",
      "agency": "string",
      "amount_range": "string",
      "eligibility": "string",
      "deadline": "string",
      "url": "string",
      "notes": "string"
    }
  ],
  "state_grants": [
    {
      "name": "string",
      "agency": "string",
      "amount_range": "string",
      "eligibility": "string",
      "url": "string",
      "notes": "string"
    }
  ],
  "local_incentives": [
    {
      "name": "string",
      "source": "string",
      "amount_range": "string",
      "type": "Grant|Tax Credit|Loan|Rebate",
      "notes": "string"
    }
  ],
  "usda_programs": [
    {
      "name": "string",
      "type": "string",
      "amount": 0,
      "notes": "string"
    }
  ]
}
```

---

## Agent 13 — Competitor Deep-Dive
*File: `19-render-13.js` · Phase 9 (parallel)*

```json
{
  "summary": "string",
  "competitive_landscape": "string",
  "competitor_profiles": [
    {
      "name": "string",
      "type": "Chain|Independent|Franchise",
      "market_share_est": "string",
      "strengths": ["string"],
      "weaknesses": ["string"],
      "pricing": "string",
      "url": "string"
    }
  ],
  "pain_points": [
    {
      "issue": "string",
      "frequency": "Common|Occasional|Rare",
      "source": "string",
      "opportunity": "string"
    }
  ],
  "differentiation_matrix": [
    {
      "factor": "string",
      "you": "string",
      "competitor_avg": "string",
      "advantage": "High|Medium|Low|None"
    }
  ],
  "messaging_guide": {
    "headline": "string",
    "value_props": ["string"],
    "proof_points": ["string"],
    "objection_handling": [
      { "objection": "string", "response": "string" }
    ]
  }
}
```

---

## Agent 14 — Code Review
*File: `20-render-14.js` · Phase 11*

```json
{
  "summary": "string",
  "overall_score": 0,
  "issues": [
    {
      "severity": "Critical|High|Medium|Low",
      "category": "string",
      "description": "string",
      "agent_affected": 0,
      "recommendation": "string"
    }
  ],
  "performance_metrics": {
    "api_calls_total": 0,
    "estimated_cost_usd": 0.0,
    "avg_response_time_sec": 0.0,
    "cache_hit_rate_pct": 0
  },
  "data_quality_issues": ["string"],
  "recommended_fixes": ["string"]
}
```

---

## Agent 15 — QA Validation
*File: `21-render-15.js` · Phase 11*

```json
{
  "summary": "string",
  "health_score": 0,
  "test_suites": [
    {
      "suite": "string",
      "tests_run": 0,
      "passed": 0,
      "failed": 0,
      "issues": ["string"]
    }
  ],
  "data_validation": [
    {
      "field": "string",
      "agent": 0,
      "status": "Valid|Suspicious|Missing",
      "note": "string"
    }
  ],
  "ux_audit": [
    {
      "component": "string",
      "issue": "string",
      "severity": "High|Medium|Low"
    }
  ],
  "recommendations": ["string"]
}
```

---

## Agent 16 — Build vs Buy
*File: `27-agent-buildvsbuy.js` · Phase 9 (parallel)*

```json
{
  "summary": "string",
  "recommendation": "Build|Buy|Hybrid",
  "recommendation_reasoning": "string",
  "platforms": [
    {
      "name": "string",
      "type": "Franchise|SaaS|Open Source|Custom Build",
      "setup_cost": 0,
      "monthly_cost": 0,
      "pros": ["string"],
      "cons": ["string"],
      "url": "string"
    }
  ],
  "comparison_matrix": [
    {
      "criterion": "string",
      "build_score": 0,
      "buy_score": 0,
      "weight": 0.0
    }
  ],
  "action_steps": ["string"],
  "decision_rationale": "string"
}
```

---

## Agent 17 — Sources & Citations
*File: `28-agent-sources.js` · Phase 12*

```json
{
  "summary": "string",
  "citation_quality_score": 0,
  "all_sources": [
    {
      "agent": 0,
      "source_name": "string",
      "url": "string",
      "data_type": "string",
      "reliability": "High|Medium|Low"
    }
  ],
  "unsourced_claims": [
    {
      "agent": 0,
      "claim": "string",
      "field": "string",
      "severity": "High|Medium|Low",
      "recommendation": "string"
    }
  ],
  "source_count_by_agent": [
    { "agent": 0, "label": "string", "source_count": 0, "quality": "string" }
  ]
}
```
