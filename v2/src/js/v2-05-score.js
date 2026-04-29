// ── V2 VIABILITY SCORE & DATA EXTRACTION ─────────────────────────────────
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
    label: '✓ GO', badge: 'green', color: 'var(--v2-green)', colorClass: 'go', icon: '🟢',
    title: 'Strong Opportunity',
    summary: 'Market data supports moving forward. Solid demand, manageable competition, and favorable financials align with your goals.',
  };
  if (score >= 45) return {
    label: '⚠ CAUTIOUS GO', badge: 'amber', color: 'var(--v2-amber)', colorClass: 'caution', icon: '🟡',
    title: 'Proceed with Caution',
    summary: 'Opportunity exists but notable risks require mitigation. Review the financial model and competitive landscape before committing.',
  };
  return {
    label: '✗ NO-GO', badge: 'red', color: 'var(--v2-red)', colorClass: 'no', icon: '🔴',
    title: 'High Risk — Do Not Proceed',
    summary: 'Current market conditions, financial projections, or competitive density make this a risky investment at this time.',
  };
}

function v2GetKPIs() {
  const kpis = [];
  if (typeof R === 'undefined') return kpis;

  if (R.a7) {
    const sc = _toArr(R.a7.scenarios);
    const base = sc.find(s=>(s.name||'').toLowerCase().includes('base'))||sc[1]||{};
    if (base.breakeven_months) kpis.push({ ico:'📅', val:`${base.breakeven_months} mo`, lbl:'Break-Even' });
    if (base.monthly_revenue)  kpis.push({ ico:'💵', val:`$${Math.round(base.monthly_revenue/1000)}K/mo`, lbl:'Base Revenue' });
    if (base.roi_3yr!=null)    kpis.push({ ico:'📈', val:`${base.roi_3yr>0?'+':''}${base.roi_3yr}%`, lbl:'3yr ROI' });
  }
  const startupCost = R.a7?.total_startup_cost || R.a7?.startup_cost ||
    _toArr(R.a7?.startup_breakdown||[]).reduce((s,b)=>s+(b.amount||b.cost||0),0);
  if (startupCost)
    kpis.push({ ico:'💰', val:`$${Math.round(startupCost/1000)}K`, lbl:'Startup Cost' });

  if (R.a2?.cities?.length) {
    const top = [...R.a2.cities].sort((a,b)=>(b.gap_score||0)-(a.gap_score||0))[0];
    if (top) kpis.push({ ico:'🏆', val:top.city||'—', lbl:'Top City' });
    kpis.push({ ico:'🎯', val:`${top?.gap_score||0}/10`, lbl:'Gap Score' });
  }

  if (R.a5?.total_timeline_months)
    kpis.push({ ico:'⏱', val:`${R.a5.total_timeline_months} mo`, lbl:'Permit Timeline' });

  return kpis.slice(0, 6);
}

function v2GetRisks() {
  if (typeof R === 'undefined' || !R.a8) return [];
  const raw = R.a8.risks || R.a8.risk_factors || R.a8.key_risks || [];
  return _toArr(raw).slice(0, 8).map(r => ({
    title:    typeof r === 'string' ? r : (r.risk || r.title || r.name || ''),
    desc:     typeof r === 'string' ? '' : (r.mitigation || r.description || r.detail || ''),
    severity: typeof r === 'string' ? 'medium' : (r.severity || r.level || 'medium'),
  })).filter(r => r.title);
}

function v2GetInsights() {
  const insights = [];
  if (typeof R === 'undefined') return insights;
  if (R.a1?.summary) insights.push({ ico:'📊', title:'Demographics', body: _truncate(R.a1.summary, 200) });
  if (R.a5?.summary) insights.push({ ico:'⚖️', title:'Compliance', body: _truncate(R.a5.summary, 200) });
  if (R.a6?.summary) insights.push({ ico:'🔍', title:'Competition', body: _truncate(R.a6.summary, 200) });
  if (R.a12?.summary) insights.push({ ico:'💵', title:'Grants Available', body: _truncate(R.a12.summary, 200) });
  return insights;
}

function v2GetAssessment() {
  if (typeof R === 'undefined' || !R.a8) return null;
  return {
    verdict:       R.a8.verdict || R.a8.recommendation || '',
    rationale:     R.a8.verdict_rationale || R.a8.rationale || '',
    assessment:    R.a8.assessment || R.a8.summary || '',
    successFactors:_toArr(R.a8.success_factors || R.a8.strengths || []).slice(0, 8),
    nextStepsAI:   _toArr(R.a8.next_steps || R.a8.action_items || []).slice(0, 8),
  };
}

function v2GetFinancialsDetail() {
  if (typeof R === 'undefined' || !R.a7) return null;
  const scenarios = _toArr(R.a7.scenarios || []);
  const breakdown = _toArr(R.a7.startup_breakdown || R.a7.cost_breakdown || []).slice(0, 10);

  // Derive startup cost: explicit field OR sum breakdown OR fall back to scenario
  let startup = R.a7.total_startup_cost || R.a7.startup_cost || 0;
  if (!startup && breakdown.length) {
    startup = breakdown.reduce((s, b) => s + (b.amount || b.cost || b.value || 0), 0);
  }

  // Derive monthly expenses: explicit field OR from first scenario OR from monthly_ops
  const monthlyOps = R.a7.monthly_ops;
  let monthly_expenses = R.a7.monthly_expenses || R.a7.fixed_costs || R.a7.monthly_fixed_costs || 0;
  if (!monthly_expenses) {
    if (scenarios.length) {
      const base = scenarios.find(s => (s.name||'').toLowerCase().includes('base')) || scenarios[1] || scenarios[0] || {};
      monthly_expenses = base.monthly_expenses || base.operating_costs || 0;
    }
    if (!monthly_expenses && monthlyOps) {
      const opsArr = Array.isArray(monthlyOps) ? monthlyOps : Object.values(monthlyOps);
      if (opsArr.length) {
        const first = opsArr[0];
        monthly_expenses = typeof first === 'object'
          ? (first.total || first.amount || first.expenses || 0)
          : (typeof first === 'number' ? first : 0);
      }
    }
  }

  return {
    startup,
    monthly_expenses,
    scenarios,
    funding:     _toArr(R.a7.funding_sources || R.a7.funding || []).slice(0, 6),
    assumptions: _toArr(R.a7.key_assumptions || []).slice(0, 6),
    startup_breakdown: breakdown,
  };
}

function v2GetGrantsDetail() {
  if (typeof R === 'undefined' || !R.a12) return [];
  // Support both generic and demo-specific data shapes
  const raw = _toArr(
    R.a12.grants || R.a12.programs || R.a12.opportunities ||
    R.a12.all_grants_table || R.a12.grant_list || []
  );
  return raw.slice(0, 12).map(g => ({
    name:        g.name || g.program || g.title || '',
    amount:      g.amount || g.max_award || g.funding || g.amount_est || '',
    deadline:    g.deadline || g.due_date || '',
    eligibility: g.eligibility || g.requirements || g.action_required || '',
    type:        g.type || g.category || g.source || 'Program',
    probability: g.probability || '',
  })).filter(g => g.name);
}

function v2GetMarketData() {
  if (typeof R === 'undefined') return { gap: null, sites: [], realEstate: [] };
  const gap = R.a2 ? {
    summary:     R.a2.summary || '',
    total_pop:   R.a2.total_population || 0,
    demand:      R.a2.demand_units || R.a2.unserved_demand || 0,
    cities:      _toArr(R.a2.cities || []).sort((a,b)=>(b.gap_score||0)-(a.gap_score||0)).slice(0, 8),
  } : null;
  const sites      = R.a3 ? _toArr(R.a3.sites || R.a3.locations || R.a3.top_sites || []).slice(0, 6) : [];
  const realEstate = R.a4 ? _toArr(R.a4.listings || R.a4.properties || []).slice(0, 4) : [];
  return { gap, sites, realEstate };
}

function v2GetCompetitorData() {
  if (typeof R === 'undefined') return { comp6: null, comp13: null };
  const comp6 = R.a6 ? {
    summary:    R.a6.summary || '',
    cities:     _toArr(R.a6.cities || R.a6.by_city || []).slice(0, 6),
    avg_rating: R.a6.avg_rating || 0,
    total:      R.a6.total_competitors || 0,
  } : null;

  const comp13 = R.a13 ? (() => {
    // pain points: generic or demo-specific shape
    const rawPain = _toArr(
      R.a13.pain_points || R.a13.competitor_weaknesses ||
      R.a13.pain_point_analysis || []
    ).slice(0, 5).map(p =>
      typeof p === 'string' ? p : (p.pain || p.issue || p.problem || p.title || '')
    ).filter(Boolean);

    // differentiators: may be array or keyed object
    let rawDiff = R.a13.differentiators || R.a13.your_advantages || R.a13.differentiation_strategy || [];
    if (!Array.isArray(rawDiff) && typeof rawDiff === 'object') {
      rawDiff = Object.values(rawDiff);
    }
    const diffs = _toArr(rawDiff).slice(0, 5).map(d =>
      typeof d === 'string' ? d : (d.pillar || d.advantage || d.differentiator || d.title || d.description || '')
    ).filter(Boolean);

    return {
      summary:         R.a13.summary || '',
      pain_points:     rawPain,
      differentiators: diffs,
    };
  })() : null;

  return { comp6, comp13 };
}

function v2GetActionPlan() {
  if (typeof R === 'undefined') return { steps: [], phases: [] };
  const steps  = _toArr(R.a8?.next_steps || R.a8?.action_items || []).slice(0, 10);
  const phases = _toArr(R.a10?.milestones || R.a10?.phases || []).slice(0, 5);
  return { steps, phases };
}

function v2GetAgentSummary(id) {
  if (typeof R === 'undefined') return '';
  const d = R[`a${id}`];
  if (!d) return '';
  return _truncate(d.summary || d.assessment || d.overview || '', 180);
}

function _truncate(str, n) {
  if (!str) return '';
  return str.length > n ? str.slice(0, n) + '…' : str;
}
