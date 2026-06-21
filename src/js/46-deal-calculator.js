// ══════════════════════════════════════════════════════════
// 46-deal-calculator.js — BizHub-style Deal Calculator
// Pure client-side SDE, DSCR, SBA loan, cash-on-cash,
// payback, valuation multiples, deal scoring, AI analysis.
// ══════════════════════════════════════════════════════════

let _dcVisible = false;

function toggleDealCalculator() {
  _dcVisible = !_dcVisible;
  const panel = $('dealCalcPanel');
  if (!panel) return;
  panel.style.display = _dcVisible ? 'block' : 'none';
  const btn = $('dealCalcBtn');
  if (btn) {
    btn.style.background = _dcVisible ? 'var(--teal-dim, rgba(45,212,191,0.12))' : '';
    btn.style.borderColor = 'var(--teal)';
    btn.style.color = 'var(--teal)';
  }
  if (_dcVisible) _dcInitForm();
}

function _dcInitForm() {
  const indKey = industryKey();
  const bm = DEAL_BENCHMARKS[indKey];
  if (!bm) return;
  const f = (id, v) => { const el = $(id); if (el && !el._userTouched) el.value = v; };
  f('dc-asking-price', bm.typical_asking);
  f('dc-annual-revenue', bm.median_revenue);
  f('dc-sde', bm.median_sde);
  f('dc-down-pct', bm.typical_down_pct);
  f('dc-loan-rate', '10.5');
  f('dc-loan-term', '10');
  f('dc-includes-re', 'no');
}

function _dcResetOnIndustryChange() {
  ['dc-asking-price','dc-annual-revenue','dc-sde','dc-down-pct','dc-loan-rate','dc-loan-term','dc-includes-re']
    .forEach(id => { const el = $(id); if (el) el._userTouched = false; });
  if (_dcVisible) { _dcInitForm(); $('dc-results').innerHTML = ''; }
  if (typeof _bmDashVisible !== 'undefined' && _bmDashVisible && typeof _bmRenderDashboard === 'function') _bmRenderDashboard();
}

// Wrap onIndustryChange to also reset deal calculator defaults
(function() {
  const _orig = onIndustryChange;
  onIndustryChange = function() { _orig(); _dcResetOnIndustryChange(); };
})();

function _dcMarkTouched(el) { if (el) el._userTouched = true; }

function _dcNum(id) { return parseFloat($(id)?.value) || 0; }

function _dcFmt(n) {
  if (Math.abs(n) >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
  if (Math.abs(n) >= 1e3) return '$' + (n / 1e3).toFixed(0) + 'K';
  return '$' + n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function _dcPct(n) { return n.toFixed(1) + '%'; }

function _dcSbaGuarantyFee(loanAmt, termYrs) {
  if (loanAmt <= 0) return 0;
  let feePct;
  if (loanAmt <= 150000) feePct = 2.0;
  else if (loanAmt <= 700000) feePct = 3.0;
  else if (loanAmt <= 1000000) feePct = 3.5;
  else feePct = 3.75;
  if (termYrs > 15) feePct += 0.25;
  const guarantyPct = loanAmt <= 150000 ? 0.85 : (loanAmt <= 500000 ? 0.75 : 0.75);
  return loanAmt * guarantyPct * (feePct / 100);
}

function _dcMonthlyPayment(principal, annualRate, termYrs) {
  if (principal <= 0 || annualRate <= 0 || termYrs <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = termYrs * 12;
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function runDealCalculator() {
  const indKey = industryKey();
  const bm = DEAL_BENCHMARKS[indKey] || {};
  const ind = industry();

  const askingPrice = _dcNum('dc-asking-price');
  const annualRevenue = _dcNum('dc-annual-revenue');
  const sde = _dcNum('dc-sde');
  const downPct = _dcNum('dc-down-pct');
  const loanRate = _dcNum('dc-loan-rate');
  const includesRE = $('dc-includes-re')?.value === 'yes';
  const loanTerm = includesRE ? 25 : _dcNum('dc-loan-term');

  if (askingPrice <= 0 || sde <= 0) {
    $('dc-results').innerHTML = '<div style="color:var(--red);padding:20px;text-align:center">Enter a valid Asking Price and SDE to analyze.</div>';
    return;
  }

  const cashDown = askingPrice * (downPct / 100);
  const loanAmount = askingPrice - cashDown;
  const sbaFee = _dcSbaGuarantyFee(loanAmount, loanTerm);
  const totalLoanAmt = loanAmount + sbaFee;
  const monthlyPayment = _dcMonthlyPayment(totalLoanAmt, loanRate, loanTerm);
  const annualDebtService = monthlyPayment * 12;
  const dscr = annualDebtService > 0 ? sde / annualDebtService : 0;
  const postDebtCF = sde - annualDebtService;
  const cashOnCash = cashDown > 0 ? (postDebtCF / cashDown) * 100 : 0;
  const paybackYrs = postDebtCF > 0 ? cashDown / postDebtCF : Infinity;
  const cfMultiple = sde > 0 ? askingPrice / sde : 0;
  const revMultiple = annualRevenue > 0 ? askingPrice / annualRevenue : 0;
  const profitMargin = annualRevenue > 0 ? (sde / annualRevenue) * 100 : 0;

  // ── Scoring (0-10 per dimension) ──────────────────────
  const scores = _dcScoreDeal({
    cfMultiple, dscr, cashOnCash, profitMargin, paybackYrs, revMultiple
  }, bm);
  const overallScore = scores.overall;

  // ── Amortization schedule (first 5 years) ─────────────
  const amort = _dcAmortSchedule(totalLoanAmt, loanRate, loanTerm, 5);

  // ── Build HTML ────────────────────────────────────────
  const dscrColor = dscr >= 1.25 ? 'var(--green)' : (dscr >= 1.0 ? 'var(--amber)' : 'var(--red)');
  const dscrBadge = dscr >= 1.25 ? 'b-green' : (dscr >= 1.0 ? 'b-amber' : 'b-red');
  const dscrLabel = dscr >= 1.25 ? 'PASS' : (dscr >= 1.0 ? 'TIGHT' : 'FAIL');
  const scoreColor = overallScore >= 7 ? 'var(--green)' : (overallScore >= 5 ? 'var(--amber)' : 'var(--red)');
  const verdictText = overallScore >= 7 ? 'Strong Deal' : (overallScore >= 5 ? 'Proceed with Caution' : 'High Risk');
  const verdictClass = overallScore >= 7 ? 'v-go' : (overallScore >= 5 ? 'v-caution' : 'v-nogo');

  const cfMultComp = bm.avg_cf_multiple ? _dcCompare(cfMultiple, bm.avg_cf_multiple, true) : '';
  const revMultComp = bm.avg_revenue_multiple ? _dcCompare(revMultiple, bm.avg_revenue_multiple, true) : '';
  const marginComp = bm.avg_margin_pct ? _dcCompare(profitMargin, bm.avg_margin_pct, false) : '';

  let html = `
  <div class="dc-score-hero">
    <div class="dc-score-ring">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="52" fill="none" stroke="var(--surface3)" stroke-width="8"/>
        <circle cx="60" cy="60" r="52" fill="none" stroke="${scoreColor}" stroke-width="8" stroke-linecap="round"
          stroke-dasharray="${(overallScore / 10) * 327} 327" transform="rotate(-90 60 60)"/>
      </svg>
      <div class="dc-score-num">
        <span style="color:${scoreColor}">${overallScore.toFixed(1)}</span>
        <small>/ 10</small>
      </div>
    </div>
    <div class="verdict ${verdictClass}" style="font-size:14px;padding:8px 16px">${verdictText}</div>
    <div style="font-size:11px;color:var(--muted);margin-top:4px">${ind.emoji} ${ind.label} Acquisition Analysis</div>
  </div>

  <div class="dc-section-grid">
    <div class="dc-section">
      <div class="dc-section-title">Valuation</div>
      <div class="dc-metric"><span class="dc-k">Asking Price</span><span class="dc-v">${_dcFmt(askingPrice)}</span></div>
      <div class="dc-metric"><span class="dc-k">Cash Flow Multiple</span><span class="dc-v">${cfMultiple.toFixed(1)}x ${cfMultComp}</span></div>
      <div class="dc-metric"><span class="dc-k">Revenue Multiple</span><span class="dc-v">${revMultiple.toFixed(2)}x ${revMultComp}</span></div>
      <div class="dc-metric"><span class="dc-k">Profit Margin</span><span class="dc-v">${_dcPct(profitMargin)} ${marginComp}</span></div>
    </div>

    <div class="dc-section">
      <div class="dc-section-title">SBA Loan Analysis</div>
      <div class="dc-metric"><span class="dc-k">Cash Down (${downPct}%)</span><span class="dc-v">${_dcFmt(cashDown)}</span></div>
      <div class="dc-metric"><span class="dc-k">Loan Amount</span><span class="dc-v">${_dcFmt(loanAmount)}</span></div>
      <div class="dc-metric"><span class="dc-k">SBA Guaranty Fee</span><span class="dc-v">${_dcFmt(sbaFee)}</span></div>
      <div class="dc-metric"><span class="dc-k">Total Financed</span><span class="dc-v">${_dcFmt(totalLoanAmt)}</span></div>
      <div class="dc-metric"><span class="dc-k">Monthly Payment</span><span class="dc-v">${_dcFmt(monthlyPayment)}</span></div>
      <div class="dc-metric"><span class="dc-k">Annual Debt Service</span><span class="dc-v">${_dcFmt(annualDebtService)}</span></div>
      <div class="dc-metric"><span class="dc-k">Loan Term</span><span class="dc-v">${loanTerm} years${includesRE ? ' (RE)' : ''}</span></div>
    </div>

    <div class="dc-section">
      <div class="dc-section-title">Debt Service Coverage</div>
      <div class="dc-dscr-display" style="text-align:center;padding:12px 0">
        <div style="font-size:36px;font-weight:700;font-family:'Syne',sans-serif;color:${dscrColor}">${dscr.toFixed(2)}x</div>
        <div class="badge ${dscrBadge}" style="margin-top:6px;font-size:12px;padding:4px 12px">${dscrLabel}</div>
        <div style="font-size:11px;color:var(--muted);margin-top:8px">SBA minimum: 1.25x</div>
      </div>
      <div class="dc-metric"><span class="dc-k">SDE (Cash Flow)</span><span class="dc-v">${_dcFmt(sde)}</span></div>
      <div class="dc-metric"><span class="dc-k">Annual Debt Service</span><span class="dc-v">${_dcFmt(annualDebtService)}</span></div>
    </div>

    <div class="dc-section">
      <div class="dc-section-title">Returns</div>
      <div class="dc-metric"><span class="dc-k">Post-Debt Cash Flow</span><span class="dc-v" style="color:${postDebtCF >= 0 ? 'var(--green)' : 'var(--red)'}">${_dcFmt(postDebtCF)}/yr</span></div>
      <div class="dc-metric"><span class="dc-k">Cash-on-Cash Return</span><span class="dc-v" style="color:${cashOnCash >= 15 ? 'var(--green)' : (cashOnCash >= 0 ? 'var(--amber)' : 'var(--red)')}">${_dcPct(cashOnCash)}</span></div>
      <div class="dc-metric"><span class="dc-k">Payback Period</span><span class="dc-v">${paybackYrs < 100 ? paybackYrs.toFixed(1) + ' years' : 'Never'}</span></div>
      <div class="dc-metric"><span class="dc-k">Monthly Take-Home</span><span class="dc-v">${_dcFmt(postDebtCF / 12)}/mo</span></div>
    </div>
  </div>

  <div class="dc-section" style="margin-top:14px">
    <div class="dc-section-title">Deal Score Breakdown</div>
    <div class="dc-score-bars">
      ${_dcScoreBar('Valuation Fairness', scores.valuation, 'How the CF multiple compares to industry avg')}
      ${_dcScoreBar('DSCR Strength', scores.dscr_score, 'Distance from 1.25x SBA threshold')}
      ${_dcScoreBar('Cash-on-Cash Return', scores.coc_score, 'Return on your equity invested')}
      ${_dcScoreBar('Margin Health', scores.margin_score, 'Profit margin vs industry avg')}
      ${_dcScoreBar('Payback Period', scores.payback_score, 'Years to recoup your down payment')}
      ${_dcScoreBar('Default Risk', scores.risk_score, 'Industry SBA default rate')}
    </div>
  </div>

  <div class="dc-section" style="margin-top:14px">
    <div class="dc-section-title">Industry Benchmarks: ${ind.label}</div>
    <div class="dc-bench-grid">
      <div class="dc-bench-item"><div class="dc-bench-label">Median Revenue</div><div class="dc-bench-val">${_dcFmt(bm.median_revenue)}</div></div>
      <div class="dc-bench-item"><div class="dc-bench-label">Median SDE</div><div class="dc-bench-val">${_dcFmt(bm.median_sde)}</div></div>
      <div class="dc-bench-item"><div class="dc-bench-label">Avg CF Multiple</div><div class="dc-bench-val">${bm.avg_cf_multiple}x</div></div>
      <div class="dc-bench-item"><div class="dc-bench-label">Avg Rev Multiple</div><div class="dc-bench-val">${bm.avg_revenue_multiple}x</div></div>
      <div class="dc-bench-item"><div class="dc-bench-label">Avg Margin</div><div class="dc-bench-val">${bm.avg_margin_pct}%</div></div>
      <div class="dc-bench-item"><div class="dc-bench-label">SBA Default Rate</div><div class="dc-bench-val">${bm.sba_default_rate_pct}%</div></div>
    </div>
  </div>

  <div class="dc-section" style="margin-top:14px">
    <div class="dc-section-title">Amortization Schedule (First 5 Years)</div>
    <div class="tbl-wrap">
      <table class="tbl">
        <thead><tr><th>Year</th><th>Payment</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead>
        <tbody>
          ${amort.map(r => `<tr>
            <td>${r.year}</td>
            <td>${_dcFmt(r.totalPaid)}</td>
            <td>${_dcFmt(r.principalPaid)}</td>
            <td>${_dcFmt(r.interestPaid)}</td>
            <td>${_dcFmt(r.endBalance)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <div style="text-align:center;margin-top:16px">
    <button class="btn" onclick="_dcRunAiAnalysis()" id="dc-ai-btn" style="border-color:var(--purple);color:var(--purple)">
      AI Deep Analysis (uses API key)
    </button>
  </div>
  <div id="dc-ai-output"></div>
  `;

  $('dc-results').innerHTML = html;

  // Store for AI analysis
  window._dcLastCalc = {
    askingPrice, annualRevenue, sde, downPct, cashDown, loanAmount, sbaFee,
    totalLoanAmt, monthlyPayment, annualDebtService, dscr, postDebtCF,
    cashOnCash, paybackYrs, cfMultiple, revMultiple, profitMargin,
    overallScore, verdictText, loanTerm, loanRate, includesRE, indKey, bm
  };
}

function _dcCompare(actual, benchmark, lowerIsBetter) {
  const diff = ((actual - benchmark) / benchmark) * 100;
  const absDiff = Math.abs(diff).toFixed(0);
  if (Math.abs(diff) < 3) return '<span style="color:var(--muted);font-size:10px">= avg</span>';
  if (lowerIsBetter) {
    return diff > 0
      ? `<span style="color:var(--red);font-size:10px">${absDiff}% above avg</span>`
      : `<span style="color:var(--green);font-size:10px">${absDiff}% below avg</span>`;
  }
  return diff > 0
    ? `<span style="color:var(--green);font-size:10px">${absDiff}% above avg</span>`
    : `<span style="color:var(--red);font-size:10px">${absDiff}% below avg</span>`;
}

function _dcScoreDeal(metrics, bm) {
  // Valuation: lower CF multiple vs avg = better
  let valuation = 10;
  if (bm.avg_cf_multiple) {
    const ratio = metrics.cfMultiple / bm.avg_cf_multiple;
    if (ratio <= 0.7) valuation = 10;
    else if (ratio <= 0.9) valuation = 8;
    else if (ratio <= 1.1) valuation = 6;
    else if (ratio <= 1.5) valuation = 4;
    else if (ratio <= 2.0) valuation = 2;
    else valuation = 1;
  }

  // DSCR: above 1.25 = pass
  let dscr_score = 1;
  if (metrics.dscr >= 2.0) dscr_score = 10;
  else if (metrics.dscr >= 1.5) dscr_score = 8;
  else if (metrics.dscr >= 1.25) dscr_score = 6;
  else if (metrics.dscr >= 1.0) dscr_score = 3;
  else dscr_score = 1;

  // Cash-on-cash: 20%+ is great
  let coc_score = 1;
  if (metrics.cashOnCash >= 30) coc_score = 10;
  else if (metrics.cashOnCash >= 20) coc_score = 8;
  else if (metrics.cashOnCash >= 15) coc_score = 6;
  else if (metrics.cashOnCash >= 10) coc_score = 4;
  else if (metrics.cashOnCash >= 0) coc_score = 2;
  else coc_score = 1;

  // Margin vs industry avg
  let margin_score = 5;
  if (bm.avg_margin_pct) {
    const ratio = metrics.profitMargin / bm.avg_margin_pct;
    if (ratio >= 1.3) margin_score = 10;
    else if (ratio >= 1.1) margin_score = 8;
    else if (ratio >= 0.9) margin_score = 6;
    else if (ratio >= 0.7) margin_score = 4;
    else margin_score = 2;
  }

  // Payback: under 3 years is great
  let payback_score = 1;
  if (metrics.paybackYrs <= 2) payback_score = 10;
  else if (metrics.paybackYrs <= 3) payback_score = 8;
  else if (metrics.paybackYrs <= 5) payback_score = 6;
  else if (metrics.paybackYrs <= 7) payback_score = 4;
  else if (metrics.paybackYrs <= 10) payback_score = 2;
  else payback_score = 1;

  // Default risk (industry baseline)
  let risk_score = 5;
  if (bm.sba_default_rate_pct) {
    if (bm.sba_default_rate_pct <= 2.5) risk_score = 10;
    else if (bm.sba_default_rate_pct <= 3.5) risk_score = 8;
    else if (bm.sba_default_rate_pct <= 5.0) risk_score = 6;
    else if (bm.sba_default_rate_pct <= 7.0) risk_score = 4;
    else risk_score = 2;
  }

  const weights = { valuation: 0.25, dscr_score: 0.20, coc_score: 0.20, margin_score: 0.15, payback_score: 0.10, risk_score: 0.10 };
  const overall = valuation * weights.valuation + dscr_score * weights.dscr_score +
    coc_score * weights.coc_score + margin_score * weights.margin_score +
    payback_score * weights.payback_score + risk_score * weights.risk_score;

  return { valuation, dscr_score, coc_score, margin_score, payback_score, risk_score, overall };
}

function _dcScoreBar(label, score, desc) {
  const pct = (score / 10) * 100;
  const color = score >= 7 ? 'var(--green)' : (score >= 5 ? 'var(--amber)' : 'var(--red)');
  return `<div class="dc-score-bar-row">
    <div class="dc-bar-label">${_esc(label)}<span class="dc-bar-desc">${_esc(desc)}</span></div>
    <div class="dc-bar-track"><div class="dc-bar-fill" style="width:${pct}%;background:${color}"></div></div>
    <div class="dc-bar-val" style="color:${color}">${score.toFixed(1)}</div>
  </div>`;
}

function _dcAmortSchedule(principal, annualRate, termYrs, showYears) {
  const rows = [];
  let bal = principal;
  const r = annualRate / 100 / 12;
  const pmt = _dcMonthlyPayment(principal, annualRate, termYrs);
  for (let y = 1; y <= Math.min(showYears, termYrs); y++) {
    let yearPrinc = 0, yearInt = 0;
    for (let m = 0; m < 12 && bal > 0; m++) {
      const interest = bal * r;
      const princPay = Math.min(pmt - interest, bal);
      bal -= princPay;
      yearPrinc += princPay;
      yearInt += interest;
    }
    rows.push({ year: y, totalPaid: yearPrinc + yearInt, principalPaid: yearPrinc, interestPaid: yearInt, endBalance: Math.max(0, bal) });
  }
  return rows;
}

async function _dcRunAiAnalysis() {
  const d = window._dcLastCalc;
  if (!d) return;
  const k = key();
  if (!k && !demoMode) {
    $('dc-ai-output').innerHTML = '<div style="color:var(--red);padding:12px;text-align:center;font-size:12px">Enter your API key first to use AI analysis.</div>';
    return;
  }
  const btn = $('dc-ai-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Analyzing...'; }

  const ind = industry();
  const sys = `You are a senior M&A advisor specializing in small business acquisitions. Analyze this deal and provide actionable insights. Return JSON only.`;
  const usr = `Analyze this ${ind.label} acquisition deal:

DEAL METRICS:
- Asking Price: $${d.askingPrice.toLocaleString()}
- Annual Revenue: $${d.annualRevenue.toLocaleString()}
- SDE (Cash Flow): $${d.sde.toLocaleString()}
- CF Multiple: ${d.cfMultiple.toFixed(1)}x (industry avg: ${d.bm.avg_cf_multiple}x)
- Revenue Multiple: ${d.revMultiple.toFixed(2)}x (industry avg: ${d.bm.avg_revenue_multiple}x)
- DSCR: ${d.dscr.toFixed(2)}x
- Post-Debt Cash Flow: $${d.postDebtCF.toLocaleString()}/yr
- Cash-on-Cash Return: ${d.cashOnCash.toFixed(1)}%
- Payback Period: ${d.paybackYrs.toFixed(1)} years
- Down Payment: $${d.cashDown.toLocaleString()} (${d.downPct}%)
- Loan: $${d.loanAmount.toLocaleString()} at ${d.loanRate}% for ${d.loanTerm} years
- Industry SBA Default Rate: ${d.bm.sba_default_rate_pct}%
- Profit Margin: ${d.profitMargin.toFixed(1)}% (industry avg: ${d.bm.avg_margin_pct}%)
- Deal Score: ${d.overallScore.toFixed(1)}/10 — ${d.verdictText}

Return ONLY:
{
  "verdict": "Go / Cautious Go / No Go",
  "headline": "One-sentence deal summary",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "negotiation_tips": ["tip 1 with specific numbers", "tip 2"],
  "what_to_verify": ["due diligence item 1", "item 2", "item 3"],
  "fair_price_estimate": 0,
  "fair_price_rationale": "2-sentence explanation of fair price"
}`;

  try {
    const result = await claudeJSON(sys, usr, { agentNum: 'dc' });
    if (!result) throw new Error('No response');
    const v = result.verdict || '';
    const vCls = /no\s*go/i.test(v) ? 'v-nogo' : (/cautious/i.test(v) ? 'v-caution' : 'v-go');
    const fairPrice = result.fair_price_estimate || 0;

    let aiHtml = `
    <div class="dc-section" style="margin-top:16px">
      <div class="dc-section-title">AI Deal Analysis</div>
      <div style="text-align:center;margin-bottom:12px">
        <div class="verdict ${vCls}" style="font-size:14px;padding:8px 16px">${_esc(v)}</div>
        <div style="font-size:13px;color:var(--text);margin-top:8px;font-style:italic">${_esc(result.headline || '')}</div>
      </div>
      <div class="dc-ai-grid">
        <div class="dc-ai-col">
          <div class="dc-ai-col-title" style="color:var(--green)">Strengths</div>
          ${(result.strengths || []).map(s => `<div class="dc-ai-item"><span style="color:var(--green)">+</span> ${_esc(s)}</div>`).join('')}
        </div>
        <div class="dc-ai-col">
          <div class="dc-ai-col-title" style="color:var(--red)">Weaknesses</div>
          ${(result.weaknesses || []).map(w => `<div class="dc-ai-item"><span style="color:var(--red)">-</span> ${_esc(w)}</div>`).join('')}
        </div>
      </div>
      ${fairPrice > 0 ? `<div class="dc-fair-price">
        <div class="dc-fair-label">AI Fair Price Estimate</div>
        <div class="dc-fair-val">${_dcFmt(fairPrice)}</div>
        <div class="dc-fair-rationale">${_esc(result.fair_price_rationale || '')}</div>
      </div>` : ''}
      <div style="margin-top:12px">
        <div class="dc-ai-col-title">Negotiation Tips</div>
        ${(result.negotiation_tips || []).map(t => `<div class="dc-ai-item" style="margin-bottom:4px"><span style="color:var(--blue)">></span> ${_esc(t)}</div>`).join('')}
      </div>
      <div style="margin-top:12px">
        <div class="dc-ai-col-title">Due Diligence Checklist</div>
        ${(result.what_to_verify || []).map(d => `<div class="dc-ai-item" style="margin-bottom:4px"><span style="color:var(--amber)">!</span> ${_esc(d)}</div>`).join('')}
      </div>
    </div>`;
    $('dc-ai-output').innerHTML = aiHtml;
  } catch (e) {
    $('dc-ai-output').innerHTML = `<div style="color:var(--red);padding:12px;text-align:center;font-size:12px">AI analysis failed: ${_esc(e.message)}</div>`;
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'AI Deep Analysis (uses API key)'; }
  }
}
