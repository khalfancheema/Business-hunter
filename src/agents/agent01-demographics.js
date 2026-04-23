/**
 * Agent 1 — Demographics
 *
 * Purpose: Research population, income, and childcare demand metrics
 * for all cities within the target radius using US Census ACS data.
 *
 * Phase: 1 (runs in parallel with Compliance and Competitive Intel)
 * Search: Disabled
 * Max tokens: 4096
 *
 * Input: zip, radius, grades, capacity (from UI)
 * Output: cities[], age_breakdown_county[], data_sources[], summary
 *
 * Key fields consumed by downstream agents:
 *   - cities[].name, .demand_score, .pop_under5, .median_hh_income
 *   - cities[].pop_growth_pct_5yr, .working_parents_est_pct
 *
 * Cities covered (default 40mi of 30097):
 *   Gwinnett: Johns Creek, Duluth, Suwanee, Buford, Sugar Hill,
 *             Lawrenceville, Norcross, Peachtree Corners
 *   Barrow:   Winder, Auburn, Bethlehem
 *   Forsyth:  Cumming
 *   Fulton:   Alpharetta
 *
 * Data sources referenced in prompt:
 *   - US Census ACS 2022 5-year estimates (data.census.gov)
 *   - Georgia GIS Clearinghouse
 *   - ACS Tables B09001 (children), B19013 (income)
 */

export const AGENT_1_SYSTEM = `You are a demographics research analyst with expertise in US Census ACS data and GIS mapping. Always respond with a JSON object only — no prose outside the JSON block.`;

export const AGENT_1_SCHEMA = {
  data_sources: ['string'],
  summary: 'string',
  cities: [{
    name: 'string',
    county: 'string',
    distance_miles: 0,
    pop_total: 0,
    pop_under5: 0,
    pop_under5_pct: 0.0,
    median_hh_income: 0,
    labor_force_pct: 0.0,
    pop_growth_pct_5yr: 0.0,
    households: 0,
    working_parents_est_pct: 0,
    demand_score: 0,  // 0-100
    data_note: 'string'
  }],
  age_breakdown_county: [{
    age_group: 'string',
    gwinnett_pop: 0,
    fulton_pop: 0,
    gap_capacity: 0
  }]
};
