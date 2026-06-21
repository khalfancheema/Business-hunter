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
  f('dc-owner-op', bm.owner_operated ? 'yes' : 'no');
  f('dc-operator-salary', bm.operator_salary || 50000);
  _dcToggleOperatorSalary();
}

function _dcToggleOperatorSalary() {
  const wrap = $('dc-opsalary-wrap');
  if (!wrap) return;
  wrap.style.display = $('dc-owner-op')?.value === 'no' ? '' : 'none';
}

function _dcResetOnIndustryChange() {
  ['dc-asking-price','dc-annual-revenue','dc-sde','dc-down-pct','dc-loan-rate','dc-loan-term','dc-includes-re','dc-owner-op','dc-operator-salary']
    .forEach(id => { const el = $(id); if (el) el._userTouched = false; });
  _dcInitForm();
  const res = $('dc-results'); if (res) res.innerHTML = '';
  const aiOut = $('dc-ai-output'); if (aiOut) aiOut.innerHTML = '';
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

function _dcMinDownForDscr(askingPrice, sde, loanRate, loanTerm) {
  if (askingPrice <= 0 || sde <= 0 || loanRate <= 0) return 0;
  for (let pct = 5; pct <= 100; pct++) {
    const down = askingPrice * (pct / 100);
    const loan = askingPrice - down;
    const fee = _dcSbaGuarantyFee(loan, loanTerm);
    const pmt = _dcMonthlyPayment(loan + fee, loanRate, loanTerm);
    const ads = pmt * 12;
    if (ads > 0 && sde / ads >= 1.25) return pct;
  }
  return 100;
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
  const ownerOperated = $('dc-owner-op')?.value !== 'no';
  const operatorSalary = ownerOperated ? 0 : (_dcNum('dc-operator-salary') || bm.operator_salary || 50000);
  const adjustedSde = sde - operatorSalary;

  if (askingPrice <= 0 || sde <= 0) {
    $('dc-results').innerHTML = '<div style="color:var(--red);padding:20px;text-align:center">Enter a valid Asking Price and SDE to analyze.</div>';
    return;
  }

  const cashDown = askingPrice * (downPct / 100);
  const loanAmount = askingPrice - cashDown;
  const sbaFee = _dcSbaGuarantyFee(loanAmount, loanTerm);
  const totalLoanAmt = loanAmount + sbaFee;
  const closingCosts = askingPrice * 0.025;
  const totalAcquisitionCost = askingPrice + sbaFee + closingCosts;
  const totalCashNeeded = cashDown + sbaFee + closingCosts;
  const monthlyPayment = _dcMonthlyPayment(totalLoanAmt, loanRate, loanTerm);
  const annualDebtService = monthlyPayment * 12;
  const dscr = annualDebtService > 0 ? adjustedSde / annualDebtService : 0;
  const postDebtCF = adjustedSde - annualDebtService;
  const cashOnCash = cashDown > 0 ? (postDebtCF / cashDown) * 100 : 0;
  const paybackYrs = postDebtCF > 0 ? totalCashNeeded / postDebtCF : Infinity;
  const cfMultiple = sde > 0 ? askingPrice / sde : 0;
  const revMultiple = annualRevenue > 0 ? askingPrice / annualRevenue : 0;
  const profitMargin = annualRevenue > 0 ? (sde / annualRevenue) * 100 : 0;

  // Minimum down payment % to clear 1.25x DSCR (uses adjusted SDE)
  const minDownForDscr = _dcMinDownForDscr(askingPrice, adjustedSde, loanRate, loanTerm);

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
      <div class="dc-metric"><span class="dc-k">Cash Flow Multiple</span><span class="dc-v">${cfMultiple.toFixed(1)}x ${cfMultComp}</span></div>
      <div class="dc-metric"><span class="dc-k">Revenue Multiple</span><span class="dc-v">${revMultiple.toFixed(2)}x ${revMultComp}</span></div>
      <div class="dc-metric"><span class="dc-k">Profit Margin</span><span class="dc-v">${_dcPct(profitMargin)} ${marginComp}</span></div>
      <div class="dc-metric"><span class="dc-k">Revenue</span><span class="dc-v">${_dcFmt(annualRevenue)}</span></div>
      <div class="dc-metric"><span class="dc-k">SDE (Cash Flow)</span><span class="dc-v">${_dcFmt(sde)}</span></div>
    </div>

    <div class="dc-section">
      <div class="dc-section-title">Acquisition Cost</div>
      <div class="dc-metric"><span class="dc-k">Asking Price</span><span class="dc-v">${_dcFmt(askingPrice)}</span></div>
      <div class="dc-metric"><span class="dc-k">SBA Guaranty Fee</span><span class="dc-v">${_dcFmt(sbaFee)}</span></div>
      <div class="dc-metric"><span class="dc-k">Est. Closing Costs (2.5%)</span><span class="dc-v">${_dcFmt(closingCosts)}</span></div>
      <div class="dc-metric" style="font-weight:700;border-top:2px solid var(--border2);padding-top:8px"><span class="dc-k" style="font-weight:700">Total Acquisition Cost</span><span class="dc-v">${_dcFmt(totalAcquisitionCost)}</span></div>
    </div>

    <div class="dc-section">
      <div class="dc-section-title">SBA Loan Analysis</div>
      <div class="dc-metric"><span class="dc-k">Cash Down (${downPct}%)</span><span class="dc-v">${_dcFmt(cashDown)}</span></div>
      <div class="dc-metric"><span class="dc-k">Loan Amount</span><span class="dc-v">${_dcFmt(loanAmount)}</span></div>
      <div class="dc-metric"><span class="dc-k">Total Financed (+ SBA Fee)</span><span class="dc-v">${_dcFmt(totalLoanAmt)}</span></div>
      <div class="dc-metric"><span class="dc-k">Monthly Payment</span><span class="dc-v">${_dcFmt(monthlyPayment)}</span></div>
      <div class="dc-metric"><span class="dc-k">Annual Debt Service</span><span class="dc-v">${_dcFmt(annualDebtService)}</span></div>
      <div class="dc-metric"><span class="dc-k">Loan Term</span><span class="dc-v">${loanTerm} years${includesRE ? ' (RE)' : ''}</span></div>
      <div class="dc-metric"><span class="dc-k">Total Cash Needed</span><span class="dc-v" style="color:var(--amber)">${_dcFmt(totalCashNeeded)}</span></div>
    </div>

    <div class="dc-section">
      <div class="dc-section-title">Debt Service Coverage</div>
      <div class="dc-dscr-display" style="text-align:center;padding:12px 0">
        <div style="font-size:36px;font-weight:700;font-family:'Syne',sans-serif;color:${dscrColor}">${dscr.toFixed(2)}x</div>
        <div class="badge ${dscrBadge}" style="margin-top:6px;font-size:12px;padding:4px 12px">${dscrLabel}</div>
        <div style="font-size:11px;color:var(--muted);margin-top:8px">SBA minimum: 1.25x</div>
      </div>
      <div class="dc-metric"><span class="dc-k">SDE (Cash Flow)</span><span class="dc-v">${_dcFmt(sde)}</span></div>
      ${operatorSalary > 0 ? `<div class="dc-metric"><span class="dc-k">− Operator Salary</span><span class="dc-v" style="color:var(--red)">−${_dcFmt(operatorSalary)}</span></div>
      <div class="dc-metric" style="border-top:2px solid var(--border2);padding-top:6px"><span class="dc-k" style="font-weight:700">Adjusted Cash Flow</span><span class="dc-v" style="font-weight:700;color:${adjustedSde >= 0 ? 'var(--text)' : 'var(--red)'}">${_dcFmt(adjustedSde)}</span></div>` : ''}
      <div class="dc-metric"><span class="dc-k">Annual Debt Service</span><span class="dc-v">${_dcFmt(annualDebtService)}</span></div>
      <div class="dc-metric"><span class="dc-k">Min Equity for 1.25x</span><span class="dc-v" style="color:${minDownForDscr <= downPct ? 'var(--green)' : 'var(--red)'}">${minDownForDscr}% down${minDownForDscr > downPct ? ' (need more)' : ' ✓'}</span></div>
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

  ${_dcSensitivityTable(askingPrice, adjustedSde, loanRate, loanTerm, downPct)}

  <div style="text-align:center;margin-top:16px;display:flex;justify-content:center;gap:10px;flex-wrap:wrap">
    <button class="btn" onclick="_dcRunAiAnalysis()" id="dc-ai-btn" style="border-color:var(--purple);color:var(--purple)">
      AI Deep Analysis (uses API key)
    </button>
    <button class="btn" onclick="_dcSaveScenario()" style="border-color:var(--teal);color:var(--teal)">
      Save as Scenario
    </button>
    <button class="btn" onclick="_dcExport()" style="border-color:var(--amber);color:var(--amber)">
      Export / Print
    </button>
  </div>
  <div id="dc-ai-output"></div>
  <div id="dc-scenario-compare"></div>
  `;

  $('dc-results').innerHTML = html;

  // Store for AI analysis
  window._dcLastCalc = {
    askingPrice, annualRevenue, sde, adjustedSde, operatorSalary, ownerOperated,
    downPct, cashDown, loanAmount, sbaFee,
    totalLoanAmt, totalAcquisitionCost, totalCashNeeded, closingCosts,
    monthlyPayment, annualDebtService, dscr, postDebtCF,
    cashOnCash, paybackYrs, cfMultiple, revMultiple, profitMargin,
    minDownForDscr, overallScore, verdictText, loanTerm, loanRate, includesRE, indKey, bm
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
  if (!k && !demoMode && !(typeof _bhShouldUseLLMProxy === 'function' && _bhShouldUseLLMProxy())) {
    $('dc-ai-output').innerHTML = '<div style="color:var(--red);padding:12px;text-align:center;font-size:12px">Enter your API key first to use AI analysis.</div>';
    return;
  }
  const btn = $('dc-ai-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Analyzing...'; }

  const ind = industry();
  const sys = `You are a senior M&A advisor specializing in small business acquisitions. Analyze this deal and provide actionable insights. Return JSON only.`;
  const opInfo = d.operatorSalary > 0
    ? `\n- Owner-Operated: No (hiring manager)\n- Operator Salary Deducted: $${d.operatorSalary.toLocaleString()}/yr\n- Adjusted SDE (after operator): $${d.adjustedSde.toLocaleString()}`
    : '\n- Owner-Operated: Yes (buyer operates)';
  const usr = `Analyze this ${ind.label} acquisition deal:

DEAL METRICS:
- Asking Price: $${d.askingPrice.toLocaleString()}
- Total Acquisition Cost: $${d.totalAcquisitionCost.toLocaleString()} (incl SBA fee + closing costs)
- Annual Revenue: $${d.annualRevenue.toLocaleString()}
- SDE (Cash Flow): $${d.sde.toLocaleString()}${opInfo}
- CF Multiple: ${d.cfMultiple.toFixed(1)}x (industry avg: ${d.bm.avg_cf_multiple}x)
- Revenue Multiple: ${d.revMultiple.toFixed(2)}x (industry avg: ${d.bm.avg_revenue_multiple}x)
- DSCR: ${d.dscr.toFixed(2)}x${d.operatorSalary > 0 ? ' (based on adjusted SDE)' : ''}
- Min Down Payment for 1.25x DSCR: ${d.minDownForDscr}%
- Post-Debt Cash Flow: $${d.postDebtCF.toLocaleString()}/yr${d.operatorSalary > 0 ? ' (after operator salary)' : ''}
- Cash-on-Cash Return: ${d.cashOnCash.toFixed(1)}%
- Payback Period: ${d.paybackYrs.toFixed(1)} years
- Down Payment: $${d.cashDown.toLocaleString()} (${d.downPct}%)
- Total Cash Needed: $${d.totalCashNeeded.toLocaleString()} (down + SBA fee + closing)
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
    const result = await claudeJSON(sys, usr, { skipFeedback: true });
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

// ── Sensitivity Table ──────────────────────────────────
function _dcSensitivityTable(askingPrice, sde, baseRate, baseTerm, baseDown) {
  if (askingPrice <= 0 || sde <= 0) return '';
  const downSteps = [10, 15, 20, 25, 30];
  const rateSteps = [];
  const rBase = Math.max(6, Math.floor(baseRate - 2));
  for (let r = rBase; r <= rBase + 4; r += 1) rateSteps.push(r);

  let rows = rateSteps.map(rate => {
    const cells = downSteps.map(dp => {
      const down = askingPrice * (dp / 100);
      const loan = askingPrice - down;
      const fee = _dcSbaGuarantyFee(loan, baseTerm);
      const pmt = _dcMonthlyPayment(loan + fee, rate, baseTerm);
      const ads = pmt * 12;
      const dscr = ads > 0 ? sde / ads : 0;
      const postDebt = sde - ads;
      const coc = down > 0 ? (postDebt / down) * 100 : 0;
      const dscrColor = dscr >= 1.25 ? 'var(--green)' : (dscr >= 1.0 ? 'var(--amber)' : 'var(--red)');
      const isBase = Math.abs(rate - baseRate) < 0.01 && dp === baseDown;
      const bg = isBase ? 'var(--blue-dim)' : '';
      return `<td style="text-align:center;font-size:11px;${bg ? 'background:' + bg + ';' : ''}padding:6px 4px">
        <div style="color:${dscrColor};font-weight:700">${dscr.toFixed(2)}x</div>
        <div style="color:var(--muted);font-size:9px">${coc.toFixed(0)}% CoC</div>
      </td>`;
    }).join('');
    const isBaseRate = Math.abs(rate - baseRate) < 0.01;
    return `<tr><td style="font-weight:${isBaseRate ? '700' : '400'};font-size:11px;white-space:nowrap;padding:6px 8px">${rate.toFixed(1)}%</td>${cells}</tr>`;
  }).join('');

  return `<div class="dc-section" style="margin-top:14px">
    <div class="dc-section-title">Sensitivity Analysis — DSCR & Cash-on-Cash</div>
    <div style="font-size:11px;color:var(--muted);margin-bottom:8px">How DSCR and cash-on-cash return change across different down payments and interest rates. Your current inputs are highlighted.</div>
    <div class="tbl-wrap">
      <table class="tbl">
        <thead><tr>
          <th style="font-size:11px">Rate \\ Down</th>
          ${downSteps.map(d => `<th style="text-align:center;font-size:11px">${d}%</th>`).join('')}
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  </div>`;
}

// ── Scenario Comparison ────────────────────────────────
const _dcScenarios = [];

function _dcSaveScenario() {
  const d = window._dcLastCalc;
  if (!d) return;
  if (_dcScenarios.length >= 3) _dcScenarios.shift();
  const ind = INDUSTRIES[d.indKey] || {};
  _dcScenarios.push({
    name: 'Scenario ' + (_dcScenarios.length + 1),
    label: ind.label || d.indKey,
    emoji: ind.emoji || '',
    askingPrice: d.askingPrice,
    annualRevenue: d.annualRevenue,
    sde: d.sde,
    adjustedSde: d.adjustedSde,
    operatorSalary: d.operatorSalary,
    ownerOperated: d.ownerOperated,
    downPct: d.downPct,
    cashDown: d.cashDown,
    loanAmount: d.loanAmount,
    loanRate: d.loanRate,
    loanTerm: d.loanTerm,
    sbaFee: d.sbaFee,
    totalAcquisitionCost: d.totalAcquisitionCost,
    totalCashNeeded: d.totalCashNeeded,
    monthlyPayment: d.monthlyPayment,
    annualDebtService: d.annualDebtService,
    dscr: d.dscr,
    postDebtCF: d.postDebtCF,
    cashOnCash: d.cashOnCash,
    paybackYrs: d.paybackYrs,
    cfMultiple: d.cfMultiple,
    revMultiple: d.revMultiple,
    profitMargin: d.profitMargin,
    overallScore: d.overallScore,
    verdictText: d.verdictText,
    includesRE: d.includesRE,
    minDownForDscr: d.minDownForDscr,
  });
  _dcRenderComparison();
}

function _dcRemoveScenario(idx) {
  _dcScenarios.splice(idx, 1);
  _dcRenderComparison();
}

function _dcRenderComparison() {
  const el = $('dc-scenario-compare');
  if (!el || _dcScenarios.length < 1) { if (el) el.innerHTML = ''; return; }

  const metric = (label, fn, opts) => {
    const vals = _dcScenarios.map(fn);
    let bestIdx = -1;
    if (opts && opts.best) {
      const best = opts.best === 'max' ? Math.max(...vals) : Math.min(...vals);
      bestIdx = vals.indexOf(best);
    }
    return `<tr>
      <td style="font-size:11px;font-weight:600;white-space:nowrap;padding:6px 10px">${label}</td>
      ${vals.map((v, i) => `<td style="text-align:center;font-size:12px;font-weight:${i === bestIdx ? '700' : '400'};color:${i === bestIdx ? 'var(--green)' : 'var(--text)'};padding:6px 10px">${v}</td>`).join('')}
    </tr>`;
  };

  const dscrFmt = (s) => {
    const color = s.dscr >= 1.25 ? 'var(--green)' : (s.dscr >= 1.0 ? 'var(--amber)' : 'var(--red)');
    return `<span style="color:${color}">${s.dscr.toFixed(2)}x</span>`;
  };

  let html = `<div class="dc-section" style="margin-top:16px">
    <div class="dc-section-title">Scenario Comparison (${_dcScenarios.length}/3)</div>
    <div style="font-size:11px;color:var(--muted);margin-bottom:8px">Save up to 3 scenarios with different parameters to compare side by side. Adjust inputs and click "Save as Scenario" again to add another.</div>
    <div class="tbl-wrap">
      <table class="tbl">
        <thead><tr>
          <th style="font-size:11px">Metric</th>
          ${_dcScenarios.map((s, i) => `<th style="text-align:center;font-size:11px">
            ${_esc(s.emoji)} ${_esc(s.name)}
            <button onclick="_dcRemoveScenario(${i})" style="background:none;border:none;color:var(--red);cursor:pointer;font-size:10px;margin-left:4px" title="Remove">✕</button>
          </th>`).join('')}
        </tr></thead>
        <tbody>
          ${metric('Asking Price', s => _dcFmt(s.askingPrice))}
          ${metric('Total Acquisition', s => _dcFmt(s.totalAcquisitionCost))}
          ${metric('Revenue', s => _dcFmt(s.annualRevenue))}
          ${metric('SDE', s => _dcFmt(s.sde))}
          ${_dcScenarios.some(s => s.operatorSalary > 0) ? metric('Adjusted SDE', s => s.operatorSalary > 0 ? _dcFmt(s.adjustedSde) : _dcFmt(s.sde)) : ''}
          ${metric('Down Payment', s => _dcFmt(s.cashDown) + ' (' + s.downPct + '%)')}
          ${metric('Total Cash Needed', s => _dcFmt(s.totalCashNeeded))}
          ${metric('CF Multiple', s => s.cfMultiple.toFixed(1) + 'x', { best: 'min' })}
          ${metric('DSCR', s => dscrFmt(s), { best: 'max' })}
          ${metric('Post-Debt CF', s => _dcFmt(s.postDebtCF) + '/yr', { best: 'max' })}
          ${metric('Cash-on-Cash', s => s.cashOnCash.toFixed(1) + '%', { best: 'max' })}
          ${metric('Payback', s => s.paybackYrs < 100 ? s.paybackYrs.toFixed(1) + 'yr' : 'Never', { best: 'min' })}
          ${metric('Deal Score', s => s.overallScore.toFixed(1) + '/10', { best: 'max' })}
          ${metric('Verdict', s => s.verdictText)}
        </tbody>
      </table>
    </div>
    <div style="text-align:center;margin-top:8px">
      <button class="btn" onclick="_dcScenarios.length=0;_dcRenderComparison()" style="border-color:var(--muted);color:var(--muted);font-size:11px">Clear All Scenarios</button>
    </div>
  </div>`;

  el.innerHTML = html;
}

// ── Export / Print ─────────────────────────────────────
function _dcExport() {
  const d = window._dcLastCalc;
  if (!d) return;
  const ind = INDUSTRIES[d.indKey] || {};

  const lines = [
    '═══════════════════════════════════════════════════',
    '  DEAL CALCULATOR REPORT',
    '  ' + (ind.emoji || '') + ' ' + (ind.label || d.indKey),
    '  Generated: ' + new Date().toLocaleDateString(),
    '═══════════════════════════════════════════════════',
    '',
    '── DEAL OVERVIEW ──────────────────────────────────',
    'Deal Score:            ' + d.overallScore.toFixed(1) + '/10 — ' + d.verdictText,
    'Asking Price:          ' + _dcFmt(d.askingPrice),
    'Total Acquisition:     ' + _dcFmt(d.totalAcquisitionCost),
    'Annual Revenue:        ' + _dcFmt(d.annualRevenue),
    'SDE (Cash Flow):       ' + _dcFmt(d.sde),
  ];
  if (d.operatorSalary > 0) {
    lines.push('Operator Salary:       −' + _dcFmt(d.operatorSalary));
    lines.push('Adjusted SDE:          ' + _dcFmt(d.adjustedSde));
  }
  lines.push('Owner-Operated:        ' + (d.ownerOperated ? 'Yes' : 'No'));
  lines.push('');
  lines.push('── VALUATION ──────────────────────────────────────');
  lines.push('CF Multiple:           ' + d.cfMultiple.toFixed(1) + 'x (avg: ' + d.bm.avg_cf_multiple + 'x)');
  lines.push('Revenue Multiple:      ' + d.revMultiple.toFixed(2) + 'x (avg: ' + d.bm.avg_revenue_multiple + 'x)');
  lines.push('Profit Margin:         ' + d.profitMargin.toFixed(1) + '% (avg: ' + d.bm.avg_margin_pct + '%)');
  lines.push('');
  lines.push('── SBA LOAN ───────────────────────────────────────');
  lines.push('Down Payment:          ' + _dcFmt(d.cashDown) + ' (' + d.downPct + '%)');
  lines.push('Loan Amount:           ' + _dcFmt(d.loanAmount));
  lines.push('SBA Guaranty Fee:      ' + _dcFmt(d.sbaFee));
  lines.push('Total Financed:        ' + _dcFmt(d.totalLoanAmt));
  lines.push('Rate / Term:           ' + d.loanRate + '% / ' + d.loanTerm + ' years' + (d.includesRE ? ' (RE)' : ''));
  lines.push('Monthly Payment:       ' + _dcFmt(d.monthlyPayment));
  lines.push('Annual Debt Service:   ' + _dcFmt(d.annualDebtService));
  lines.push('Total Cash Needed:     ' + _dcFmt(d.totalCashNeeded));
  lines.push('');
  lines.push('── RETURNS ────────────────────────────────────────');
  lines.push('DSCR:                  ' + d.dscr.toFixed(2) + 'x ' + (d.dscr >= 1.25 ? '(PASS)' : d.dscr >= 1.0 ? '(TIGHT)' : '(FAIL)'));
  lines.push('Min Down for 1.25x:    ' + d.minDownForDscr + '%');
  lines.push('Post-Debt Cash Flow:   ' + _dcFmt(d.postDebtCF) + '/yr');
  lines.push('Cash-on-Cash Return:   ' + d.cashOnCash.toFixed(1) + '%');
  lines.push('Payback Period:        ' + (d.paybackYrs < 100 ? d.paybackYrs.toFixed(1) + ' years' : 'Never'));
  lines.push('Monthly Take-Home:     ' + _dcFmt(d.postDebtCF / 12) + '/mo');
  lines.push('');
  lines.push('── INDUSTRY BENCHMARKS (' + (ind.label || '') + ') ──────────');
  lines.push('Median Revenue:        ' + _dcFmt(d.bm.median_revenue));
  lines.push('Median SDE:            ' + _dcFmt(d.bm.median_sde));
  lines.push('SBA Default Rate:      ' + d.bm.sba_default_rate_pct + '%');
  if (d.bm.naics) lines.push('NAICS Code:            ' + d.bm.naics + ' — ' + d.bm.naics_label);
  lines.push('');
  lines.push('═══════════════════════════════════════════════════');
  lines.push('  Generated by Business Hunter Deal Calculator');
  lines.push('═══════════════════════════════════════════════════');

  const text = lines.join('\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'deal-analysis-' + d.indKey + '-' + new Date().toISOString().slice(0, 10) + '.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
