/**
 * Agent 11 — Market Map
 * Phase: 8 (sequential, after project plan)
 * Inputs: agents 1 (demographics), 2 (gap analysis), 4 (real estate)
 * Output: Data for interactive SVG map with city pins and real estate markers
 *
 * Map is built using buildMapSVG() from src/utils/map.js
 * Uses simple linear lat/lng projection — no tile service needed
 *
 * Key schema fields:
 *   center.lat, .lng, .label  — origin point (ZIP 30097)
 *   cities[].name, .lat, .lng, .gap_score, .demand_score
 *   cities[].unserved_children, .competitor_count, .median_income
 *   cities[].real_estate_url  — direct link to search that city on LoopNet
 *   real_estate_pins[].label, .lat, .lng, .rent, .sqft, .url
 *   directions[].from, .to, .drive_mins, .miles, .google_url
 *
 * Toggle modes: 'gap' | 'demand' | 'competitors'
 * Color coding: green=9-10, amber=7-8, blue=5-6, purple=3-4, red=0-2
 */
export const MAP_BOUNDS = {
  latMin: 33.80, latMax: 34.35,
  lngMin: -84.55, lngMax: -83.60,
  svgW: 800, svgH: 520
};
