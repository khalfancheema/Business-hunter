/**
 * Agent 9 — Business Plan
 * Phase: 6 (sequential, after executive summary)
 * Inputs: agents 1-8
 * Output: Full SBA 7(a)-ready business plan + investor pitch deck
 *
 * Renders 6 tabs:
 *   Overview   — Executive summary, mission/vision, services & revenue table
 *   Market     — TAM/SAM/SOM, competitor comparison, differentiators, trends
 *   Financials — Startup capital waterfall, funding sources with links, 3-year P&L
 *   Operations — Room-by-room facility plan, staffing table, curriculum, tech stack
 *   SBA Package — 14-item checklist with direct links (sba.gov, irs.gov, sos.ga.gov)
 *   Investor Deck — 9 investor pitch slides
 *
 * KNOWN ISSUE (CR-003): This agent's prompt is very large (~2400 input tokens)
 * due to inline JSON schema examples. Optimization: remove example values,
 * keep only field names. Estimated savings: 600-800 tokens.
 *
 * SBA Lender contacts included:
 *   - Live Oak Bank (childcare specialist): liveoak.bank
 *   - Truist Bank SBA: truist.com/sba
 *   - Regions Bank SBA: regions.com
 */
export const KEY_FIELDS = [
  'business_name', 'executive_summary', 'company_overview',
  'market_analysis', 'operations_plan', 'financial_plan',
  'sba_checklist', 'investor_slides'
];
