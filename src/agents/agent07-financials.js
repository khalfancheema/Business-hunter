/**
 * Agent 7 — Financial Feasibility
 * Phase: 4 (sequential, runs AFTER Agent 4 completes)
 * Inputs: agents 3 (site), 4 (real estate — critical for rent accuracy), 5 (compliance)
 *
 * Key schema fields:
 *   startup_breakdown[].item, .amount, .category
 *   monthly_ops[].item, .amount
 *   scenarios[].name, .enrolled, .monthly_revenue, .monthly_net, .breakeven_months
 *   projections[].month, .rev, .exp, .cum  (30-month P&L)
 *   by_city_financials[].city, .monthly_rent, .break_even_enrolled, .yr1_net, .yr3_net
 *   funding[].source, .amount, .terms, .notes
 */
export const SCHEMA = {
  summary: 'string',
  total_startup_cost: 0,
  startup_breakdown: [{ item:'string', amount:0, category:'string' }],
  monthly_ops: [{ item:'string', amount:0 }],
  scenarios: [{
    name:'string', label:'string', enrolled:0, avg_tuition:0,
    monthly_revenue:0, monthly_expenses:0, monthly_net:0,
    annual_net:0, breakeven_months:0, roi_3yr:0, color:'string'
  }],
  projections: [{ month:'string', rev:0, exp:0, cum:0 }],
  by_city_financials: [{
    city:'string', monthly_rent:0, avg_infant_tuition:0,
    break_even_enrolled:0, yr1_net:0, yr3_net:0
  }],
  funding: [{ source:'string', amount:0, terms:'string', notes:'string' }]
};
