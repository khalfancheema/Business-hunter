/**
 * Agent 12 — Grant Search
 * Phase: 9 (sequential, after market map)
 * Inputs: agents 3 (site selection), 5 (compliance)
 * Output: Grant programs, CAPS subsidy rates, local incentives with apply links
 *
 * Renders 5 tabs:
 *   Summary         — Total potential Year 1 funding across all programs
 *   GA CAPS Rates   — Rate tables for Gwinnett (Rate A) and Barrow (Rate B) by age
 *   USDA & Federal  — CACFP, USDA Rural Dev, SBA Microloan, HHS Stabilization
 *   Local Incentives — Barrow County Dev Authority, GA Job Tax Credit, Quality Rated
 *   Full Grant Table — All programs ranked by probability with deadlines
 *
 * Key grant programs:
 *   - GA CAPS (childcare subsidy): decal.ga.gov/CAPS
 *   - CACFP (meal reimbursement): gadoe.org/CACFP
 *   - USDA Rural Development: rd.usda.gov/ga (Barrow County eligible)
 *   - Georgia Job Tax Credit: $20K for 16+ new hires
 *   - Barrow County Dev Authority: 770-307-3021, bda@barrowga.org
 *   - Quality Rated star bonuses: qualityrated.decal.ga.gov
 */
export const KEY_GRANT_SOURCES = [
  'GA CAPS', 'CACFP', 'USDA Rural Development',
  'HHS Stabilization', 'Georgia Job Tax Credit',
  'Barrow County Dev Authority', 'Quality Rated',
  'SBA Microloan', 'Georgia SBDC'
];
