// ══════════════════════════════════════════════════════════
// 48-benchmarks-dashboard.js — Industry Benchmarks Dashboard
// Compare all 16 industries side-by-side on key metrics.
// ══════════════════════════════════════════════════════════

let _bmDashVisible = false;
let _bmSortKey = 'revenue';

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
  };
  return [...entries].sort(sortMap[key] || sortMap.revenue);
}

function _bmRenderDashboard() {
  const container = $('benchDashContent');
  if (!container) return;
  const currentInd = industryKey();

  const entries = Object.entries(DEAL_BENCHMARKS).map(([key, bm]) => {
    const ind = INDUSTRIES[key];
    if (!ind) return null;
    return { key, label: ind.label, emoji: ind.emoji, ...bm };
  }).filter(Boolean);

  const sorted = _bmSortEntries(entries, _bmSortKey);

  const sortBtns = ['revenue','sde','margin','multiple','risk'].map(k => {
    const labels = { revenue:'By Revenue', sde:'By SDE', margin:'By Margin', multiple:'By Multiple', risk:'By Risk (Low→High)' };
    const active = _bmSortKey === k ? ' active' : '';
    return `<button class="phase-quick-btn bm-sort-btn${active}" onclick="_bmSort('${k}',this)">${labels[k]}</button>`;
  }).join('');

  let html = `
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
  </div>
  `;

  container.innerHTML = html;
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

function _bmSort(key, btnEl) {
  _bmSortKey = key;
  _bmRenderDashboard();
}
