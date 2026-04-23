/**
 * Agent 2 — Gap Analysis
 * Phase: 2 (sequential, after agents 1+5+6)
 * Inputs: agents 1 (demographics), 5 (compliance), 6 (competitive intel)
 * Output: City rankings by gap score, age-group gaps, price point gaps
 *
 * Key schema fields:
 *   cities[].city, .rank, .gap_score (0-10), .unserved_children
 *   cities[].recommended_tuition_infant, .recommended_tuition_preschool
 *   age_gaps[].age, .demand_idx, .supply_idx, .gap
 */
export const SCHEMA = {
  summary: 'string',
  overall_opportunity_score: 0,
  cities: [{ city:'string', rank:0, demand_score:0, supply_score:0, gap_score:0,
    unserved_children:0, income_tier:'string', recommended_tuition_infant:0,
    recommended_tuition_preschool:0, priority:'string', rationale:'string' }],
  age_gaps: [{ age:'string', demand_idx:0, supply_idx:0, gap:0 }]
};
