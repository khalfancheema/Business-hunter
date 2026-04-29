// ── V2 VIABILITY SCORE ────────────────────────────────────────────────────
function v2CalcScore() {
  if (typeof R === 'undefined') return 0;

  let score = 0, weight = 0;

  // Agent 2: Gap analysis — top city gap score (0–10 → 0–25 pts)
  if (R.a2) {
    const cities = R.a2.cities || [];
    const topGap = Math.max(...cities.map(c => c.gap_score || 0), 0);
    score  += (topGap / 10) * 25;
    weight += 25;
  }

  // Agent 7: Financial — base-case monthly net (0–25 pts)
  if (R.a7) {
    const scenarios = _toArr(R.a7.scenarios);
    const base = scenarios.find(s => (s.name||'').toLowerCase().includes('base')) || scenarios[1] || {};
    const net  = base.monthly_net || 0;
    const roi  = base.roi_3yr || 0;
    // Positive net = good; break-even < 24mo is ideal
    const be   = base.breakeven_months || 36;
    const finScore = Math.max(0, Math.min(25, (net > 0 ? 15 : 5) + (be < 18 ? 10 : be < 24 ? 6 : be < 36 ? 3 : 0)));
    score  += finScore;
    weight += 25;
  }

  // Agent 8: Executive Summary verdict
  if (R.a8) {
    const text = (R.a8.verdict || R.a8.recommendation || R.a8.summary || '').toLowerCase();
    let v = 0;
    if (text.includes('go') && !text.includes('no-go') && !text.includes('no go')) v = 20;
    else if (text.includes('cautious')) v = 12;
    else if (text.includes('no-go') || text.includes('no go') || text.includes('avoid')) v = 4;
    else v = 10;
    score  += v;
    weight += 20;
  }

  // Agent 6: Competitive intel — market saturation
  if (R.a6) {
    const cities = _toArr(R.a6.cities || R.a6.by_city || []);
    const avgComp = cities.length
      ? cities.reduce((s,c)=>s+(c.competitor_count||c.total_competitors||5),0)/cities.length
      : 5;
    // Fewer competitors → better opportunity (up to 15 pts)
    const compScore = Math.max(0, Math.min(15, 15 - avgComp));
    score  += compScore;
    weight += 15;
  }

  // Agent 5: Compliance — timeline (simpler = better)
  if (R.a5) {
    const months = R.a5.total_timeline_months || R.a5.timeline_months || 6;
    const compScore = months <= 3 ? 15 : months <= 6 ? 12 : months <= 12 ? 8 : 5;
    score  += compScore;
    weight += 15;
  }

  if (weight === 0) return 0;
  return Math.round((score / weight) * 100);
}

function v2ScoreVerdict(score) {
  if (score >= 70) return {
    label: '✓ GO',
    badge: 'green',
    color: 'var(--v2-green)',
    colorClass: 'go',
    icon: '🟢',
    title: 'Strong Opportunity',
    summary: 'Market data supports moving forward. Solid demand, manageable competition, and favorable financials align with your goals.',
  };
  if (score >= 45) return {
    label: '⚠ CAUTIOUS GO',
    badge: 'amber',
    color: 'var(--v2-amber)',
    colorClass: 'caution',
    icon: '🟡',
    title: 'Proceed with Caution',
    summary: 'Opportunity exists but notable risks require mitigation. Review the financial model and competitive landscape before committing.',
  };
  return {
    label: '✗ NO-GO',
    badge: 'red',
    color: 'var(--v2-red)',
    colorClass: 'no',
    icon: '🔴',
    title: 'High Risk — Do Not Proceed',
    summary: 'Current market conditions, financial projections, or competitive density make this a risky investment at this time.',
  };
}

function v2GetKPIs() {
  const kpis = [];
  if (typeof R === 'undefined') return kpis;

  // Break-even
  if (R.a7) {
    const sc = _toArr(R.a7.scenarios);
    const base = sc.find(s=>(s.name||'').toLowerCase().includes('base'))||sc[1]||{};
    if (base.breakeven_months) kpis.push({ ico:'📅', val:`${base.breakeven_months} mo`, lbl:'Break-Even' });
    if (base.monthly_revenue)  kpis.push({ ico:'💵', val:`$${Math.round(base.monthly_revenue/1000)}K/mo`, lbl:'Base Revenue' });
    if (base.roi_3yr!=null)    kpis.push({ ico:'📈', val:`${base.roi_3yr>0?'+':''}${base.roi_3yr}%`, lbl:'3yr ROI' });
  }
  if (R.a7?.total_startup_cost)
    kpis.push({ ico:'💰', val:`$${Math.round(R.a7.total_startup_cost/1000)}K`, lbl:'Startup Cost' });

  // Top gap city
  if (R.a2?.cities?.length) {
    const top = [...R.a2.cities].sort((a,b)=>(b.gap_score||0)-(a.gap_score||0))[0];
    if (top) kpis.push({ ico:'🏆', val:top.city||'—', lbl:'Top City' });
    kpis.push({ ico:'🎯', val:`${top?.gap_score||0}/10`, lbl:'Gap Score' });
  }

  // Compliance timeline
  if (R.a5?.total_timeline_months)
    kpis.push({ ico:'⏱', val:`${R.a5.total_timeline_months} mo`, lbl:'Permit Timeline' });

  return kpis.slice(0, 6);
}

function v2GetRisks() {
  if (typeof R === 'undefined' || !R.a8) return [];
  const raw = R.a8.risks || R.a8.risk_factors || R.a8.key_risks || [];
  return _toArr(raw).slice(0, 6).map(r => ({
    title:    typeof r === 'string' ? r : (r.risk || r.title || r.name || ''),
    desc:     typeof r === 'string' ? '' : (r.mitigation || r.description || r.detail || ''),
    severity: typeof r === 'string' ? 'medium' : (r.severity || r.level || 'medium'),
  })).filter(r => r.title);
}

function v2GetInsights() {
  const insights = [];
  if (typeof R === 'undefined') return insights;

  if (R.a1?.summary) insights.push({ ico:'📊', title:'Demographics', body: _truncate(R.a1.summary, 160) });
  if (R.a5?.summary) insights.push({ ico:'⚖️', title:'Compliance', body: _truncate(R.a5.summary, 160) });
  if (R.a6?.summary) insights.push({ ico:'🔍', title:'Competition', body: _truncate(R.a6.summary, 160) });
  if (R.a12?.summary) insights.push({ ico:'💵', title:'Grants Available', body: _truncate(R.a12.summary, 160) });

  return insights.slice(0, 4);
}

function _truncate(str, n) {
  if (!str) return '';
  return str.length > n ? str.slice(0, n) + '…' : str;
}
