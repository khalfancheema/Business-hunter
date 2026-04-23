/**
 * Agent 3 — Site Selection
 * Phase: 3 (sequential, after agent 2)
 * Inputs: agents 1, 2, 5
 * Output: 6 ranked locations with scores across 5 dimensions
 *
 * Key schema fields:
 *   locations[].rank, .city, .submarket, .overall_score
 *   locations[].scores.{demand,competition,demographics,real_estate,regulatory}
 *   locations[].sqft_needed, .est_monthly_rent_range, .zoning_needed
 *   locations[].pros[], .cons[], .risk, .timeline_months
 */
export const SCHEMA = {
  summary: 'string',
  locations: [{
    rank:0, city:'string', submarket:'string', overall_score:0,
    scores:{ demand:0, competition:0, demographics:0, real_estate:0, regulatory:0 },
    capacity_recommended:0, target_infant_tuition:0, target_preschool_tuition:0,
    risk:'string', timeline_months:0, children_under5_nearby:0, competitors_within_2mi:0,
    sqft_needed:0, est_monthly_rent_range:'string', ideal_property_type:'string',
    zoning_needed:'string', pros:['string'], cons:['string']
  }]
};
