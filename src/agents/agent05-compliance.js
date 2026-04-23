/**
 * Agent 5 — Compliance
 * Phase: 1 (parallel with agents 1 and 6)
 * Inputs: zip, grades (from UI)
 * Output: Georgia DECAL requirements, zoning rules, licensing timeline
 *
 * Key schema fields:
 *   requirements[].category, .item, .detail, .timeline_weeks, .cost_usd, .priority
 *   timeline_phases[].phase, .weeks, .tasks
 *   decal_url: direct link to Georgia DECAL portal
 *
 * Covers:
 *   - Georgia DECAL licensing (Form 282)
 *   - Staff-to-child ratios (1:6 infant, 1:8 toddler, 1:10 preschool, 1:12 pre-k)
 *   - Space requirements (35 sqft/child indoor, 75 sqft/child outdoor)
 *   - Zoning: Gwinnett County C-1/O-I, Barrow County C-1/R-C, Forsyth County C-1
 *   - Fire marshal + county health inspections
 *   - Director qualifications (CDA or ECE degree)
 *   - $1M liability insurance requirement
 */
export const SCHEMA = {
  summary: 'string',
  decal_url: 'string',
  requirements: [{
    category:'string', item:'string', detail:'string',
    timeline_weeks:0, cost_usd:0, source:'string',
    priority:'Critical|High|Medium'
  }],
  timeline_phases: [{ phase:'string', weeks:0, tasks:'string' }]
};
