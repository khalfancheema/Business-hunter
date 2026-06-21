// ══════════════════════════════════════════════════════════
// 47-cim-analyzer.js — CIM Analyzer (AI-powered)
// Paste or upload a Confidential Information Memorandum
// and get structured financial extraction + risk analysis.
// ══════════════════════════════════════════════════════════

let _cimVisible = false;

function toggleCimAnalyzer() {
  _cimVisible = !_cimVisible;
  const panel = $('cimPanel');
  if (!panel) return;
  panel.style.display = _cimVisible ? 'block' : 'none';
  const btn = $('cimBtn');
  if (btn) {
    btn.style.background = _cimVisible ? 'var(--purple-dim, rgba(167,139,250,0.12))' : '';
    btn.style.borderColor = 'var(--purple)';
    btn.style.color = 'var(--purple)';
  }
}

async function runCimAnalysis() {
  const text = $('cim-text')?.value?.trim();
  if (!text || text.length < 100) {
    $('cim-results').innerHTML = '<div style="color:var(--red);padding:20px;text-align:center;font-size:12px">Paste at least 100 characters of CIM content to analyze.</div>';
    return;
  }
  const k = key();
  if (!k && !demoMode) {
    $('cim-results').innerHTML = '<div style="color:var(--red);padding:20px;text-align:center;font-size:12px">Enter your API key first.</div>';
    return;
  }

  const btn = $('cim-run-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Analyzing CIM...'; }
  $('cim-results').innerHTML = '<div class="comp-loading"><div class="live-dot"></div> Extracting financials and risks from CIM...</div>';

  const indKey = industryKey();
  const ind = industry();
  const bm = DEAL_BENCHMARKS[indKey] || {};

  const cimTrunc = text.length > 12000 ? text.slice(0, 12000) + '\n[...truncated]' : text;

  const sys = `You are a senior M&A advisor. Extract structured financial data and risk analysis from this Confidential Information Memorandum (CIM). Return JSON only.`;
  const usr = `Analyze this CIM for a ${ind.label} business acquisition.

INDUSTRY BENCHMARKS:
- Avg CF Multiple: ${bm.avg_cf_multiple || 'N/A'}x
- Avg Revenue Multiple: ${bm.avg_revenue_multiple || 'N/A'}x
- Avg Margin: ${bm.avg_margin_pct || 'N/A'}%
- SBA Default Rate: ${bm.sba_default_rate_pct || 'N/A'}%

CIM CONTENT:
${cimTrunc}

Return ONLY:
{
  "business_name": "extracted or 'Not specified'",
  "location": "extracted or 'Not specified'",
  "asking_price": 0,
  "annual_revenue": 0,
  "annual_expenses": 0,
  "sde": 0,
  "ebitda": 0,
  "years_in_business": 0,
  "employees": 0,
  "includes_real_estate": false,
  "real_estate_value": 0,
  "add_backs": [
    {"item": "Add-back description", "amount": 0, "confidence": "high/medium/low", "note": "Why this is valid or suspect"}
  ],
  "revenue_trend": "growing / stable / declining",
  "revenue_breakdown": [
    {"stream": "Revenue source", "amount": 0, "pct": 0}
  ],
  "key_financials": {
    "gross_margin_pct": 0,
    "net_margin_pct": 0,
    "cf_multiple": 0,
    "revenue_multiple": 0
  },
  "risks": [
    {"risk": "Risk description", "severity": "high/medium/low", "mitigation": "How to address"}
  ],
  "strengths": ["strength 1", "strength 2"],
  "deal_verdict": "Go / Cautious Go / No Go",
  "verdict_rationale": "2-3 sentence explanation",
  "questions_for_seller": ["Question 1 to ask the seller", "Question 2", "Question 3"],
  "negotiation_leverage": ["Point 1 you can negotiate on", "Point 2"]
}`;

  try {
    const result = await claudeJSON(sys, usr, { agentNum: 'cim' });
    if (!result) throw new Error('No response from AI');
    _cimRender(result, ind, bm);
  } catch (e) {
    $('cim-results').innerHTML = `<div style="color:var(--red);padding:20px;text-align:center;font-size:12px">CIM analysis failed: ${_esc(e.message)}</div>`;
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Analyze CIM'; }
  }
}

function _cimRender(d, ind, bm) {
  const v = d.deal_verdict || 'N/A';
  const vCls = /no\s*go/i.test(v) ? 'v-nogo' : (/cautious/i.test(v) ? 'v-caution' : 'v-go');
  const kf = d.key_financials || {};

  let html = `
  <div class="dc-score-hero">
    <div class="verdict ${vCls}" style="font-size:16px;padding:10px 20px">${_esc(v)}</div>
    <div style="font-size:15px;font-weight:700;font-family:'Syne',sans-serif;margin-top:10px">${_esc(d.business_name || 'Unknown Business')}</div>
    <div style="font-size:12px;color:var(--muted);margin-top:4px">${_esc(d.location || '')} ${ind.emoji} ${ind.label}</div>
    <div style="font-size:12px;color:var(--muted);margin-top:8px;max-width:600px;line-height:1.6">${_esc(d.verdict_rationale || '')}</div>
  </div>

  <div class="dc-section-grid">
    <div class="dc-section">
      <div class="dc-section-title">Extracted Financials</div>
      <div class="dc-metric"><span class="dc-k">Asking Price</span><span class="dc-v">${d.asking_price ? _dcFmt(d.asking_price) : 'Not specified'}</span></div>
      <div class="dc-metric"><span class="dc-k">Annual Revenue</span><span class="dc-v">${d.annual_revenue ? _dcFmt(d.annual_revenue) : 'Not specified'}</span></div>
      <div class="dc-metric"><span class="dc-k">Annual Expenses</span><span class="dc-v">${d.annual_expenses ? _dcFmt(d.annual_expenses) : 'N/A'}</span></div>
      <div class="dc-metric"><span class="dc-k">SDE</span><span class="dc-v">${d.sde ? _dcFmt(d.sde) : 'N/A'}</span></div>
      <div class="dc-metric"><span class="dc-k">EBITDA</span><span class="dc-v">${d.ebitda ? _dcFmt(d.ebitda) : 'N/A'}</span></div>
      <div class="dc-metric"><span class="dc-k">Years in Business</span><span class="dc-v">${d.years_in_business || 'N/A'}</span></div>
      <div class="dc-metric"><span class="dc-k">Employees</span><span class="dc-v">${d.employees || 'N/A'}</span></div>
      ${d.includes_real_estate ? `<div class="dc-metric"><span class="dc-k">Real Estate Value</span><span class="dc-v">${d.real_estate_value ? _dcFmt(d.real_estate_value) : 'Included'}</span></div>` : ''}
    </div>

    <div class="dc-section">
      <div class="dc-section-title">Valuation Multiples</div>
      <div class="dc-metric"><span class="dc-k">CF Multiple</span><span class="dc-v">${kf.cf_multiple ? kf.cf_multiple.toFixed(1) + 'x' : 'N/A'}${bm.avg_cf_multiple ? ' <span style="font-size:10px;color:var(--muted)">(avg: ' + bm.avg_cf_multiple + 'x)</span>' : ''}</span></div>
      <div class="dc-metric"><span class="dc-k">Revenue Multiple</span><span class="dc-v">${kf.revenue_multiple ? kf.revenue_multiple.toFixed(2) + 'x' : 'N/A'}${bm.avg_revenue_multiple ? ' <span style="font-size:10px;color:var(--muted)">(avg: ' + bm.avg_revenue_multiple + 'x)</span>' : ''}</span></div>
      <div class="dc-metric"><span class="dc-k">Gross Margin</span><span class="dc-v">${kf.gross_margin_pct ? kf.gross_margin_pct.toFixed(1) + '%' : 'N/A'}</span></div>
      <div class="dc-metric"><span class="dc-k">Net Margin</span><span class="dc-v">${kf.net_margin_pct ? kf.net_margin_pct.toFixed(1) + '%' : 'N/A'}${bm.avg_margin_pct ? ' <span style="font-size:10px;color:var(--muted)">(avg: ' + bm.avg_margin_pct + '%)</span>' : ''}</span></div>
      <div class="dc-metric"><span class="dc-k">Revenue Trend</span><span class="dc-v">${_cimTrendBadge(d.revenue_trend)}</span></div>
    </div>
  </div>`;

  // Add-backs
  const addBacks = _toArr(d.add_backs);
  if (addBacks.length) {
    html += `<div class="dc-section" style="margin-top:14px">
      <div class="dc-section-title">Add-Back Validation</div>
      <div class="tbl-wrap"><table class="tbl">
        <thead><tr><th>Item</th><th>Amount</th><th>Confidence</th><th>Notes</th></tr></thead>
        <tbody>${addBacks.map(a => {
          const confColor = a.confidence === 'high' ? 'var(--green)' : (a.confidence === 'medium' ? 'var(--amber)' : 'var(--red)');
          return `<tr>
            <td>${_esc(a.item)}</td>
            <td>${a.amount ? _dcFmt(a.amount) : 'N/A'}</td>
            <td><span style="color:${confColor};font-weight:700;font-size:11px">${_esc((a.confidence || '').toUpperCase())}</span></td>
            <td style="font-size:11px;color:var(--muted)">${_esc(a.note || '')}</td>
          </tr>`;
        }).join('')}</tbody>
      </table></div>
    </div>`;
  }

  // Revenue breakdown
  const revBreak = _toArr(d.revenue_breakdown);
  if (revBreak.length) {
    html += `<div class="dc-section" style="margin-top:14px">
      <div class="dc-section-title">Revenue Breakdown</div>
      ${revBreak.map(r => {
        const pct = r.pct || 0;
        return `<div style="margin-bottom:6px">
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px">
            <span>${_esc(r.stream)}</span>
            <span style="font-weight:700">${r.amount ? _dcFmt(r.amount) : ''} (${pct}%)</span>
          </div>
          <div style="height:6px;background:var(--surface3);border-radius:3px;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:var(--blue);border-radius:3px"></div>
          </div>
        </div>`;
      }).join('')}
    </div>`;
  }

  // Risks
  const risks = _toArr(d.risks);
  if (risks.length) {
    html += `<div class="dc-section" style="margin-top:14px">
      <div class="dc-section-title">Risk Assessment</div>
      ${risks.map(r => {
        const sevColor = r.severity === 'high' ? 'var(--red)' : (r.severity === 'medium' ? 'var(--amber)' : 'var(--green)');
        const sevBg = r.severity === 'high' ? 'var(--red-dim)' : (r.severity === 'medium' ? 'var(--amber-dim)' : 'var(--green-dim)');
        return `<div style="padding:10px 12px;background:${sevBg};border:1px solid ${sevColor};border-radius:8px;margin-bottom:6px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
            <span style="font-size:12px;font-weight:700;color:var(--text)">${_esc(r.risk)}</span>
            <span class="badge" style="background:${sevBg};color:${sevColor};border:1px solid ${sevColor}">${_esc((r.severity || '').toUpperCase())}</span>
          </div>
          <div style="font-size:11px;color:var(--muted);line-height:1.5">${_esc(r.mitigation || '')}</div>
        </div>`;
      }).join('')}
    </div>`;
  }

  // Strengths + Questions
  html += `<div class="dc-ai-grid" style="margin-top:14px">
    <div class="dc-ai-col">
      <div class="dc-ai-col-title" style="color:var(--green)">Strengths</div>
      ${_toArr(d.strengths).map(s => `<div class="dc-ai-item"><span style="color:var(--green)">+</span> ${_esc(s)}</div>`).join('')}
    </div>
    <div class="dc-ai-col">
      <div class="dc-ai-col-title" style="color:var(--amber)">Questions for Seller</div>
      ${_toArr(d.questions_for_seller).map(q => `<div class="dc-ai-item"><span style="color:var(--amber)">?</span> ${_esc(q)}</div>`).join('')}
    </div>
  </div>`;

  // Negotiation leverage
  const leverage = _toArr(d.negotiation_leverage);
  if (leverage.length) {
    html += `<div class="dc-section" style="margin-top:14px">
      <div class="dc-section-title">Negotiation Leverage</div>
      ${leverage.map(l => `<div class="dc-ai-item" style="margin-bottom:6px"><span style="color:var(--blue)">></span> ${_esc(l)}</div>`).join('')}
    </div>`;
  }

  // Auto-fill deal calculator button
  if (d.asking_price && d.sde) {
    html += `<div style="text-align:center;margin-top:16px;padding-top:14px;border-top:1px solid var(--border)">
      <button class="btn" onclick="_cimPopulateCalc()" style="border-color:var(--teal);color:var(--teal)">
        Send to Deal Calculator
      </button>
      <div style="font-size:11px;color:var(--muted);margin-top:4px">Auto-fill the Deal Calculator with extracted financials</div>
    </div>`;
    window._cimLastExtract = d;
  }

  $('cim-results').innerHTML = html;
}

function _cimTrendBadge(trend) {
  if (!trend) return 'N/A';
  const t = trend.toLowerCase();
  if (t.includes('grow')) return '<span class="badge b-green">GROWING</span>';
  if (t.includes('declin')) return '<span class="badge b-red">DECLINING</span>';
  return '<span class="badge b-amber">STABLE</span>';
}

function _cimPopulateCalc() {
  const d = window._cimLastExtract;
  if (!d) return;
  if (!_dcVisible) toggleDealCalculator();
  const set = (id, v) => { const el = $(id); if (el && v) { el.value = v; el._userTouched = true; } };
  set('dc-asking-price', d.asking_price);
  set('dc-annual-revenue', d.annual_revenue);
  set('dc-sde', d.sde);
  if (d.includes_real_estate) set('dc-includes-re', 'yes');
  runDealCalculator();
}
