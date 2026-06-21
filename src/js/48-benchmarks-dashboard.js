// ══════════════════════════════════════════════════════════
// 48-benchmarks-dashboard.js — Industry Benchmarks Dashboard
// Compare all 16 industries side-by-side on key metrics,
// plus SBA Market Data by NAICS code.
// ══════════════════════════════════════════════════════════

let _bmDashVisible = false;
let _bmSortKey = 'revenue';
let _bmTab = 'benchmarks';

function toggleBenchmarksDash() {
  _bmDashVisible = !_bmDashVisible;
  const panel = $('benchDashPanel');
  if (!panel) return;
  panel.style.display = _bmDashVisible ? 'block' : 'none';
  const btn = $('benchDashBtn');
  if (btn) {
    btn.style.background = _bmDashVisible ? 'var(--blue-dim)' : '';
    btn.style.borderColor = 'var(--blue)';
    btn.style.color = 'var(--blue)';
  }
  if (_bmDashVisible) _bmRenderDashboard();
}

function _bmSortEntries(entries, key) {
  const sortMap = {
    revenue: (a, b) => b.median_revenue - a.median_revenue,
    sde: (a, b) => b.median_sde - a.median_sde,
    margin: (a, b) => b.avg_margin_pct - a.avg_margin_pct,
    multiple: (a, b) => b.avg_cf_multiple - a.avg_cf_multiple,
    risk: (a, b) => a.sba_default_rate_pct - b.sba_default_rate_pct,
    sba_loan: (a, b) => b.sba_avg_loan - a.sba_avg_loan,
    sba_approval: (a, b) => b.sba_approval_pct - a.sba_approval_pct,
    sba_volume: (a, b) => b.sba_total_loans_yr - a.sba_total_loans_yr,
  };
  return [...entries].sort(sortMap[key] || sortMap.revenue);
}

function _bmGetEntries() {
  return Object.entries(DEAL_BENCHMARKS).map(([key, bm]) => {
    const ind = INDUSTRIES[key];
    if (!ind) return null;
    return { key, label: ind.label, emoji: ind.emoji, ...bm };
  }).filter(Boolean);
}

function _bmRenderDashboard() {
  const container = $('benchDashContent');
  if (!container) return;

  const tabBench = _bmTab === 'benchmarks' ? ' active' : '';
  const tabSba = _bmTab === 'sba' ? ' active' : '';

  let html = `<div style="display:flex;gap:6px;margin-bottom:16px;border-bottom:1px solid var(--border);padding-bottom:10px">
    <button class="phase-quick-btn bm-sort-btn${tabBench}" onclick="_bmSwitchTab('benchmarks')" style="font-size:12px;padding:6px 14px">Industry Benchmarks</button>
    <button class="phase-quick-btn bm-sort-btn${tabSba}" onclick="_bmSwitchTab('sba')" style="font-size:12px;padding:6px 14px">SBA Market Data</button>
  </div>`;

  if (_bmTab === 'benchmarks') {
    html += _bmRenderBenchmarksTab();
  } else {
    html += _bmRenderSbaTab();
  }

  container.innerHTML = html;
}

function _bmSwitchTab(tab) {
  _bmTab = tab;
  _bmRenderDashboard();
}

function _bmRenderBenchmarksTab() {
  const currentInd = industryKey();
  const entries = _bmGetEntries();
  const sorted = _bmSortEntries(entries, _bmSortKey);

  const sortBtns = ['revenue','sde','margin','multiple','risk'].map(k => {
    const labels = { revenue:'By Revenue', sde:'By SDE', margin:'By Margin', multiple:'By Multiple', risk:'By Risk (Low→High)' };
    const active = _bmSortKey === k ? ' active' : '';
    return `<button class="phase-quick-btn bm-sort-btn${active}" onclick="_bmSort('${k}')">${labels[k]}</button>`;
  }).join('');

  return `
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px">
    <div style="font-size:14px;font-weight:700;font-family:'Syne',sans-serif">Industry Benchmark Comparison</div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">${sortBtns}</div>
  </div>

  <div class="bm-chart-row">
    ${_bmBarChart(sorted, 'median_revenue', 'Median Revenue', v => _dcFmt(v), 'var(--blue)')}
    ${_bmBarChart(sorted, 'median_sde', 'Median SDE', v => _dcFmt(v), 'var(--green)')}
  </div>

  <div class="bm-chart-row" style="margin-top:14px">
    ${_bmBarChart(sorted, 'avg_margin_pct', 'Avg Profit Margin', v => v + '%', 'var(--teal)')}
    ${_bmBarChart(sorted, 'avg_cf_multiple', 'Avg CF Multiple', v => v + 'x', 'var(--purple)')}
  </div>

  <div style="margin-top:14px">
    <div class="dc-section-title">Full Comparison Table</div>
    <div class="tbl-wrap" style="max-height:500px">
      <table class="tbl" id="bmFullTable">
        <thead><tr>
          <th>Industry</th>
          <th>Revenue</th>
          <th>SDE</th>
          <th>CF Mult</th>
          <th>Rev Mult</th>
          <th>Margin</th>
          <th>Default %</th>
          <th>Typical Ask</th>
        </tr></thead>
        <tbody>
        ${sorted.map(e => {
          const isActive = e.key === currentInd;
          const rowStyle = isActive ? 'background:var(--blue-dim);border:1px solid var(--blue)' : '';
          return `<tr style="${rowStyle}">
            <td style="white-space:nowrap;font-weight:${isActive ? '700' : '400'}">${e.emoji} ${_esc(e.label)}</td>
            <td>${_dcFmt(e.median_revenue)}</td>
            <td>${_dcFmt(e.median_sde)}</td>
            <td>${e.avg_cf_multiple}x</td>
            <td>${e.avg_revenue_multiple}x</td>
            <td>${e.avg_margin_pct}%</td>
            <td><span style="color:${e.sba_default_rate_pct <= 3.5 ? 'var(--green)' : (e.sba_default_rate_pct <= 5.5 ? 'var(--amber)' : 'var(--red)')}">${e.sba_default_rate_pct}%</span></td>
            <td>${_dcFmt(e.typical_asking)}</td>
          </tr>`;
        }).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <div class="bm-chart-row" style="margin-top:14px">
    ${_bmBarChart(sorted, 'sba_default_rate_pct', 'SBA Default Rate', v => v + '%', 'var(--red)')}
    ${_bmBarChart(sorted, 'typical_asking', 'Typical Asking Price', v => _dcFmt(v), 'var(--amber)')}
  </div>`;
}

function _bmRenderSbaTab() {
  const currentInd = industryKey();
  const entries = _bmGetEntries();

  const sbaSortKey = ['sba_loan','sba_approval','sba_volume','risk'].includes(_bmSortKey) ? _bmSortKey : 'sba_volume';
  const sorted = _bmSortEntries(entries, sbaSortKey);

  const sortBtns = ['sba_volume','sba_loan','sba_approval','risk'].map(k => {
    const labels = { sba_volume:'By Loan Volume', sba_loan:'By Avg Loan', sba_approval:'By Approval Rate', risk:'By Default Rate' };
    const active = sbaSortKey === k ? ' active' : '';
    return `<button class="phase-quick-btn bm-sort-btn${active}" onclick="_bmSort('${k}')">${labels[k]}</button>`;
  }).join('');

  const totalLoans = sorted.reduce((s, e) => s + (e.sba_total_loans_yr || 0), 0);
  const avgApproval = sorted.length > 0 ? (sorted.reduce((s, e) => s + (e.sba_approval_pct || 0), 0) / sorted.length).toFixed(1) : 0;
  const avgDefault = sorted.length > 0 ? (sorted.reduce((s, e) => s + (e.sba_default_rate_pct || 0), 0) / sorted.length).toFixed(1) : 0;
  const avgLoan = sorted.length > 0 ? Math.round(sorted.reduce((s, e) => s + (e.sba_avg_loan || 0), 0) / sorted.length) : 0;

  const currentBm = DEAL_BENCHMARKS[currentInd] || {};
  const currentLabel = INDUSTRIES[currentInd]?.label || '';
  const currentEmoji = INDUSTRIES[currentInd]?.emoji || '';

  let html = `
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px">
    <div style="font-size:14px;font-weight:700;font-family:'Syne',sans-serif">SBA 7(a) Loan Data by Industry</div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">${sortBtns}</div>
  </div>

  <div class="dc-section-grid" style="margin-bottom:14px">
    <div class="dc-section">
      <div class="dc-section-title">Cross-Industry SBA Summary</div>
      <div class="dc-metric"><span class="dc-k">Total Annual SBA Loans (tracked)</span><span class="dc-v" style="font-weight:700">${totalLoans.toLocaleString()}</span></div>
      <div class="dc-metric"><span class="dc-k">Avg Loan Size</span><span class="dc-v">${_dcFmt(avgLoan)}</span></div>
      <div class="dc-metric"><span class="dc-k">Avg Approval Rate</span><span class="dc-v">${avgApproval}%</span></div>
      <div class="dc-metric"><span class="dc-k">Avg Default Rate</span><span class="dc-v">${avgDefault}%</span></div>
    </div>`;

  if (currentBm.naics) {
    html += `
    <div class="dc-section">
      <div class="dc-section-title">${currentEmoji} ${_esc(currentLabel)} — Your Industry</div>
      <div class="dc-metric"><span class="dc-k">NAICS Code</span><span class="dc-v" style="font-family:monospace;font-weight:700;color:var(--blue)">${_esc(currentBm.naics)}</span></div>
      <div class="dc-metric"><span class="dc-k">Classification</span><span class="dc-v" style="font-size:11px">${_esc(currentBm.naics_label)}</span></div>
      <div class="dc-metric"><span class="dc-k">Avg SBA Loan</span><span class="dc-v">${_dcFmt(currentBm.sba_avg_loan)}</span></div>
      <div class="dc-metric"><span class="dc-k">Avg Term</span><span class="dc-v">${currentBm.sba_avg_term} years</span></div>
      <div class="dc-metric"><span class="dc-k">Approval Rate</span><span class="dc-v" style="color:${currentBm.sba_approval_pct >= 70 ? 'var(--green)' : (currentBm.sba_approval_pct >= 60 ? 'var(--amber)' : 'var(--red)')}">${currentBm.sba_approval_pct}%</span></div>
      <div class="dc-metric"><span class="dc-k">Default Rate</span><span class="dc-v" style="color:${currentBm.sba_default_rate_pct <= 3.5 ? 'var(--green)' : (currentBm.sba_default_rate_pct <= 5.5 ? 'var(--amber)' : 'var(--red)')}">${currentBm.sba_default_rate_pct}%</span></div>
      <div class="dc-metric"><span class="dc-k">Annual Loan Volume</span><span class="dc-v">${(currentBm.sba_total_loans_yr || 0).toLocaleString()} loans/yr</span></div>
      <div class="dc-metric"><span class="dc-k">Top States</span><span class="dc-v">${(currentBm.top_states || []).join(', ')}</span></div>
    </div>`;
  }

  html += `</div>

  <div class="bm-chart-row">
    ${_bmBarChart(sorted, 'sba_avg_loan', 'Avg SBA Loan Size', v => _dcFmt(v), 'var(--blue)')}
    ${_bmBarChart(sorted, 'sba_approval_pct', 'SBA Approval Rate', v => v + '%', 'var(--green)')}
  </div>

  <div class="bm-chart-row" style="margin-top:14px">
    ${_bmBarChart(sorted, 'sba_total_loans_yr', 'Annual Loan Volume', v => v.toLocaleString(), 'var(--teal)')}
    ${_bmBarChart(sorted, 'sba_default_rate_pct', 'Default Rate by Industry', v => v + '%', 'var(--red)')}
  </div>

  <div style="margin-top:14px">
    <div class="dc-section-title">SBA Data by NAICS Code</div>
    <div class="tbl-wrap" style="max-height:500px">
      <table class="tbl">
        <thead><tr>
          <th>Industry</th>
          <th>NAICS</th>
          <th>Avg Loan</th>
          <th>Term</th>
          <th>Approval</th>
          <th>Default</th>
          <th>Volume/yr</th>
          <th>Top States</th>
        </tr></thead>
        <tbody>
        ${sorted.map(e => {
          const isActive = e.key === currentInd;
          const rowStyle = isActive ? 'background:var(--blue-dim);border:1px solid var(--blue)' : '';
          const approvalColor = e.sba_approval_pct >= 70 ? 'var(--green)' : (e.sba_approval_pct >= 60 ? 'var(--amber)' : 'var(--red)');
          const defaultColor = e.sba_default_rate_pct <= 3.5 ? 'var(--green)' : (e.sba_default_rate_pct <= 5.5 ? 'var(--amber)' : 'var(--red)');
          return `<tr style="${rowStyle}">
            <td style="white-space:nowrap;font-weight:${isActive ? '700' : '400'}">${e.emoji} ${_esc(e.label)}</td>
            <td style="font-family:monospace;font-size:11px" title="${_esc(e.naics_label)}">${_esc(e.naics)}</td>
            <td>${_dcFmt(e.sba_avg_loan)}</td>
            <td>${e.sba_avg_term}yr</td>
            <td><span style="color:${approvalColor};font-weight:700">${e.sba_approval_pct}%</span></td>
            <td><span style="color:${defaultColor};font-weight:700">${e.sba_default_rate_pct}%</span></td>
            <td>${(e.sba_total_loans_yr || 0).toLocaleString()}</td>
            <td style="font-size:11px">${(e.top_states || []).join(', ')}</td>
          </tr>`;
        }).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <div class="dc-section" style="margin-top:14px">
    <div class="dc-section-title">SBA Risk-Reward Matrix</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px;margin-top:8px">
    ${sorted.map(e => {
      const isActive = e.key === currentInd;
      const borderColor = isActive ? 'var(--blue)' : 'var(--border)';
      const bg = isActive ? 'var(--blue-dim)' : 'var(--surface2)';
      const riskColor = e.sba_default_rate_pct <= 3.5 ? 'var(--green)' : (e.sba_default_rate_pct <= 5.5 ? 'var(--amber)' : 'var(--red)');
      const riskLabel = e.sba_default_rate_pct <= 3.5 ? 'LOW RISK' : (e.sba_default_rate_pct <= 5.5 ? 'MEDIUM' : 'HIGH RISK');
      return `<div style="background:${bg};border:1px solid ${borderColor};border-radius:8px;padding:10px;text-align:center">
        <div style="font-size:16px;margin-bottom:4px">${e.emoji}</div>
        <div style="font-size:11px;font-weight:700;font-family:'Syne',sans-serif;margin-bottom:6px">${_esc(e.label)}</div>
        <div style="font-size:10px;color:var(--muted);margin-bottom:2px">NAICS ${_esc(e.naics)}</div>
        <div style="font-size:18px;font-weight:700;font-family:'Syne',sans-serif;color:var(--blue);margin:4px 0">${_dcFmt(e.sba_avg_loan)}</div>
        <div style="font-size:10px;color:var(--muted)">avg loan</div>
        <div style="display:flex;justify-content:space-between;margin-top:6px;font-size:10px">
          <span style="color:var(--green)">${e.sba_approval_pct}% apr</span>
          <span style="color:${riskColor}">${e.sba_default_rate_pct}% def</span>
        </div>
        <div class="badge" style="margin-top:6px;font-size:9px;background:transparent;color:${riskColor};border:1px solid ${riskColor}">${riskLabel}</div>
      </div>`;
    }).join('')}
    </div>
  </div>

  <div style="margin-top:14px;padding:12px;background:var(--surface2);border:1px solid var(--border);border-radius:8px">
    <div style="font-size:11px;color:var(--muted);line-height:1.6">
      <strong style="color:var(--text)">About this data:</strong> SBA 7(a) loan statistics compiled from SBA FOIA data, industry reports, and NAICS-classified lending records. Default rates represent historical averages for each industry classification. Approval rates and loan volumes are annual estimates based on recent fiscal year data. NAICS codes shown are primary classifications — some businesses may qualify under multiple codes.
    </div>
  </div>`;

  return html;
}

function _bmBarChart(entries, field, title, fmt, color) {
  const max = Math.max(...entries.map(e => e[field] || 0));
  const currentInd = industryKey();
  return `<div class="bm-mini-chart">
    <div class="dc-section-title">${title}</div>
    ${entries.map(e => {
      const val = e[field] || 0;
      const pct = max > 0 ? (val / max) * 100 : 0;
      const isActive = e.key === currentInd;
      const textColor = isActive ? 'var(--text)' : 'var(--muted)';
      return `<div class="bm-bar-row">
        <div class="bm-bar-label" style="color:${textColor}">${e.emoji} ${_esc(e.label.split('/')[0].split('(')[0].trim())}</div>
        <div class="bm-bar-track"><div class="bm-bar-fill" style="width:${pct}%;background:${isActive ? color : 'var(--border2)'}"></div></div>
        <div class="bm-bar-val" style="color:${textColor}">${fmt(val)}</div>
      </div>`;
    }).join('')}
  </div>`;
}

function _bmSort(key) {
  _bmSortKey = key;
  _bmRenderDashboard();
}
