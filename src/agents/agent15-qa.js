/**
 * Agent 15 — QA & Testing
 * Phase: 12 (final agent)
 * Inputs: R{} — all accumulated agent results
 * Output: 34 test results, data validation, UX audit, health score
 *
 * Renders 5 tabs:
 *   QA Summary       — Pass rate, key findings, critical failures
 *   Test Results     — 34 tests across 4 suites with ✅/❌/⚠️ status
 *   Data Validation  — 52 fields validated, scored per-agent
 *   UX Audit         — 6 UX findings with specific recommendations
 *   Health Score     — Animated SVG ring + 8 dimension breakdown
 *
 * Test Suites:
 *   API & Connectivity (5 tests)
 *   Agent Output Validation (14 tests)
 *   Data Accuracy & Consistency (8 tests)
 *   UX & Rendering (8 tests)
 *
 * Health Score Dimensions:
 *   API Reliability, Data Accuracy, Output Completeness, UX Quality,
 *   Code Quality, Cost Efficiency, Test Coverage, Barrow County Coverage
 *
 * Current baseline scores:
 *   Overall: 86/100
 *   Pass rate: ~87%
 *   Fields validated: 52
 */
export const TEST_SUITE_NAMES = [
  'API & Connectivity',
  'Agent Output Validation',
  'Data Accuracy & Consistency',
  'UX & Rendering'
];
