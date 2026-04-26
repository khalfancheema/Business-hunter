// ══════════════════════════════════════════════════════════
// 39-scenario.js — Interactive Financial Scenario Builder
//
// Injected into Agent 7's output after pipeline run.
// Lets the user adjust occupancy %, tuition, and rent in
// real-time and see the P&L recalculate instantly.
// ══════════════════════════════════════════════════════════

function injectScenarioBuilder() {
  const container = $('7-sc-builder');
  if (!container || !R.a7) return;
  const d = R.a7;
  const base = d.scenarios?.[0] || {};  // use first scenario as base
  const ind  = industry();

  const startOcc = base.enrolled && parseInt(capacity()) > 0
    ? Math.round((base.enrolled / parseInt(capacity())) * 100)
    : 75;
  const startTuition = base.avg_tuition || 1800;
  const startRent    = (() => {
    const ops = d.monthly_ops || [];
    const rentItem = ops.find(o => /rent|lease/i.test(o.item || ''));
    return rentItem?.amount || 10000;
  })();
  const totalExp = (d.monthly_ops || []).reduce((s, o) => s + (o.amount || 0), 0);
  const nonRentExp = totalExp - startRent;

  container.innerHTML = `
  <div class="scenario-builder">
    <div class="scenario-builder-title">📊 Interactive Scenario Builder</div>
    <div class="scenario-builder-sub">Adjust inputs — P&amp;L updates in real time</div>
    <div class="scenario-sliders">
      <div class="scenario-slider-row">
        <label>Occupancy Rate <span class="scenario-val" id="sb-occ-val">${startOcc}%</span></label>
        <input type="range" id="sb-occ" min="40" max="100" value="${startOcc}" step="1" oninput="updateScenario()">
      </div>
      <div class="scenario-slider-row">
        <label>${ind.price_label_primary || 'Primary Rate'} <span class="scenario-val" id="sb-t1-val">$${startTuition.toLocaleString()}</span></label>
        <input type="range" id="sb-t1" min="800" max="3500" value="${startTuition}" step="25" oninput="updateScenario()">
      </div>
      <div class="scenario-slider-row">
        <label>Monthly Rent <span class="scenario-val" id="sb-rent-val">$${startRent.toLocaleString()}</span></label>
        <input type="range" id="sb-rent" min="3000" max="25000" value="${startRent}" step="250" oninput="updateScenario()">
      </div>
    </div>
    <div class="scenario-output" id="sb-output"></div>
  </div>`;

  // Store base non-rent expenses for recalc
  container._nonRentExp = nonRentExp;
  container._capacity   = parseInt(capacity()) || 75;
  updateScenario();
}

function updateScenario() {
  const container = $('7-sc-builder');
  if (!container) return;
  const cap    = container._capacity || 75;
  const nrExp  = container._nonRentExp || 60000;

  const occ    = parseInt($('sb-occ')?.value || 75);
  const tuition= parseInt($('sb-t1')?.value  || 1800);
  const rent   = parseInt($('sb-rent')?.value || 10000);

  if ($('sb-occ-val'))  $('sb-occ-val').textContent  = occ + '%';
  if ($('sb-t1-val'))   $('sb-t1-val').textContent   = '$' + tuition.toLocaleString();
  if ($('sb-rent-val')) $('sb-rent-val').textContent = '$' + rent.toLocaleString();

  const enrolled = Math.round(cap * occ / 100);
  const revenue  = enrolled * tuition;
  const expenses = nrExp + rent;
  const net      = revenue - expenses;
  const margin   = revenue > 0 ? Math.round((net / revenue) * 100) : 0;
  const annualNet = net * 12;

  // Break-even months calculation (simplified)
  const startup  = parseInt(budget()) || 600000;
  const beMonths = net > 0 ? Math.ceil(startup / net) : null;

  const netColor = net >= 0 ? 'var(--green)' : 'var(--red)';
  const marginColor = margin >= 15 ? 'var(--green)' : margin >= 5 ? 'var(--amber)' : 'var(--red)';

  const out = $('sb-output');
  if (!out) return;
  out.innerHTML = `
  <div class="scenario-kpis">
    <div class="scenario-kpi">
      <div class="scenario-kpi-val">$${revenue.toLocaleString()}</div>
      <div class="scenario-kpi-lbl">Monthly Revenue</div>
      <div class="scenario-kpi-sub">${enrolled} enrolled × $${tuition.toLocaleString()}</div>
    </div>
    <div class="scenario-kpi">
      <div class="scenario-kpi-val">$${expenses.toLocaleString()}</div>
      <div class="scenario-kpi-lbl">Monthly Expenses</div>
      <div class="scenario-kpi-sub">Rent $${rent.toLocaleString()} + Ops $${nrExp.toLocaleString()}</div>
    </div>
    <div class="scenario-kpi">
      <div class="scenario-kpi-val" style="color:${netColor}">$${net >= 0 ? '' : '-'}${Math.abs(net).toLocaleString()}</div>
      <div class="scenario-kpi-lbl">Monthly Net</div>
      <div class="scenario-kpi-sub" style="color:${marginColor}">${margin}% margin</div>
    </div>
    <div class="scenario-kpi">
      <div class="scenario-kpi-val" style="color:${netColor}">$${Math.abs(annualNet).toLocaleString()}</div>
      <div class="scenario-kpi-lbl">Annual Net</div>
      <div class="scenario-kpi-sub">${net < 0 ? 'Loss' : 'Profit'}</div>
    </div>
    <div class="scenario-kpi">
      <div class="scenario-kpi-val">${beMonths ? beMonths + ' mo' : 'N/A'}</div>
      <div class="scenario-kpi-lbl">Break-Even</div>
      <div class="scenario-kpi-sub">on $${(startup/1000).toFixed(0)}k investment</div>
    </div>
  </div>
  <div class="scenario-bar-wrap">
    <div class="scenario-bar" style="width:${Math.min(100, Math.max(0, (expenses/Math.max(revenue,expenses))*100)).toFixed(1)}%;background:var(--red-dim);border:1px solid var(--red)"></div>
    <div class="scenario-bar" style="width:${Math.min(100, Math.max(0, (revenue/Math.max(revenue,expenses))*100)).toFixed(1)}%;background:var(--green-dim);border:1px solid var(--green);margin-top:4px"></div>
    <div style="font-size:10px;color:var(--muted);margin-top:4px;display:flex;gap:12px"><span style="color:var(--red)">▪ Expenses</span><span style="color:var(--green)">▪ Revenue</span></div>
  </div>`;
}

// Inject after Agent 7 completes
// Hook into the pipeline — called after R.a7 is set and agent 7 output shown
(function patchAgent7ForScenario() {
  document.addEventListener('DOMContentLoaded', () => {
    const _origSO = window.showOut;
    if (!_origSO) return;
    window.showOut = function(id) {
      _origSO.call(this, id);
      if (id == 7) {
        setTimeout(() => { if ($('7-sc-builder')) injectScenarioBuilder(); }, 100);
      }
    };
  });
})();
