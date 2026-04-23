/**
 * Agent 6 — Competitive Intelligence
 * Phase: 1 (parallel with agents 1 and 5)
 * Inputs: zip, radius (from UI)
 * Output: Competitor counts, tuition rates, utilization, gap scores by city
 *
 * RESILIENCE: Agent 6 has a hardcoded fallback dataset.
 * If claudeJSON() returns null after 3 retries, the pipeline continues
 * with baseline Gwinnett/Barrow County competitor data.
 * See the `if(!d)` block in runAgent6() in public/index.html.
 *
 * Cities covered: Johns Creek, Suwanee, Duluth, Buford, Sugar Hill,
 *                 Lawrenceville, Norcross, Cumming, Winder (Barrow), Auburn (Barrow)
 *
 * Key schema fields:
 *   cities[].city, .center_count, .avg_monthly_infant, .avg_monthly_preschool
 *   cities[].avg_rating, .capacity_utilization_pct, .waitlist_common, .gap_score
 *   top_chains[].name, .locations_in_area, .monthly_tuition_range, .rating, .type
 */
export const SCHEMA = {
  summary: 'string',
  total_licensed_estimated: 0,
  cities: [{
    city:'string', center_count:0, avg_monthly_infant:0, avg_monthly_preschool:0,
    avg_rating:0.0, capacity_utilization_pct:0, waitlist_common:true, gap_score:0
  }],
  top_chains: [{
    name:'string', locations_in_area:0, monthly_tuition_range:'string',
    rating:0.0, type:'Franchise|Corporate|Independent'
  }]
};
