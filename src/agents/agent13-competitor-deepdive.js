/**
 * Agent 13 — Competitor Deep-Dive
 * Phase: 10 (sequential, after grant search)
 * Inputs: agent 6 (competitive intel)
 * Output: Review analysis, pain points, differentiation strategy, messaging guide
 *
 * Renders 5 tabs:
 *   Summary          — Competitive landscape overview
 *   Competitor Profiles — Each competitor with Google/Yelp links, ratings, reviews
 *   Pain Points        — Top complaint categories ranked by frequency with bar chart
 *   Differentiation    — Strategy pillars mapped to competitor weaknesses
 *   Messaging Guide    — Channel-by-channel ad copy exploiting pain points
 *
 * Key competitors analyzed:
 *   - Primrose Schools (franchise, 6 locations, $1,800-$2,200/mo)
 *   - KinderCare (corporate, 4 locations, $1,500-$1,900/mo)
 *   - Bright Horizons (corporate, 2 locations, $2,100-$2,600/mo)
 *   - Top local independents in Suwanee, Johns Creek, Buford
 *
 * Review sources: Google Maps, Yelp, Care.com, Winnie
 */
export const PAIN_POINT_CATEGORIES = [
  'Staff turnover', 'Communication with parents', 'Pricing transparency',
  'Curriculum quality', 'Facility cleanliness', 'Director accessibility',
  'Wait times / enrollment process', 'Technology / app usage'
];
