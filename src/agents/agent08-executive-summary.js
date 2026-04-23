/**
 * Agent 8 — Executive Summary
 * Phase: 5 (sequential, after all research agents complete)
 * Inputs: agents 1-7 (all research outputs)
 *
 * Key schema fields:
 *   verdict: 'Go' | 'Cautious Go' | 'No Go'
 *   verdict_rationale: one sentence with specific data
 *   assessment: 5-6 sentence narrative
 *   success_factors[]: specific, data-backed success factors
 *   risks[].risk, .mitigation, .severity
 *   next_steps[]: numbered, time-bound action items
 */
export const SCHEMA = {
  verdict: 'Go|Cautious Go|No Go',
  verdict_rationale: 'string',
  assessment: 'string',
  success_factors: ['string'],
  risks: [{ risk:'string', mitigation:'string', severity:'High|Medium|Low' }],
  next_steps: ['string']
};
