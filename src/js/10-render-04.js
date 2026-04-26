async function runAgent2(a1,a5,a6) {
  setDot(2,'running');
  const ind=industry();
  const sys=`You are a senior market gap analyst specializing in small business feasibility studies. You cross-reference federal, state, and local data sources to quantify supply-demand imbalances. You always cite your sources with specific table numbers, database names, and retrieval methods. Respond JSON only.`;
  const usr=`Conduct a comprehensive market gap analysis for a ${ind.unit} (capacity: ${capacity()}, budget: $${parseInt(budget()).toLocaleString()}) within ${radius()} miles of ZIP ${zip()}.

AUTHORITATIVE DATA SOURCES — search, reference, and cite as many of the following as possible:

SUPPLY-SIDE (licensed provider data):
1. State child care licensing database — search your state's licensing portal for licensed ${ind.units}
   - Georgia: childcare.georgia.gov/find-licensed-program (CAPS database)
   - National lookup: childcareeta.acf.hhs.gov or state-specific portals
2. Child Care Aware of America — state fact sheets & supply estimates (childcareaware.org)
3. CCDF (Child Care Development Fund) state data — HHS Office of Child Care annual reports
4. National Database of Childcare Prices (NDCP) — DOL Women's Bureau, county-level pricing & supply
5. Head Start / Early Head Start locator — eclkc.acf.hhs.gov/center-locator
6. NAEYC accreditation database — naeyc.org/accreditation/find (quality-accredited centers only)
7. Google Maps business search — "${ind.unit} near [city, state]" for total count + ratings
8. Winnie.com — childcare-specific directory with real-time availability
9. Care.com provider directory — additional unlicensed/in-home providers
10. Child Care Resource and Referral (CCR&R) agencies — local referral network data
11. IRS Form 990 data — ProPublica Nonprofit Explorer for non-profit center capacity/revenue

DEMAND-SIDE (population & economic data):
12. US Census ACS 2023 1-yr & 2022 5-yr estimates — Tables B01001, S0901, B23025, B19013
13. Census Bureau Population Estimates Program (PEP) 2020–2023 — growth trajectory
14. State vital statistics — county birth rates 2019–2022 (lagging demand signal)
15. NCES school enrollment — K-12 enrollment as pipeline demand proxy
16. BLS Women's Labor Force Participation rates by county (QCEW + LAUS)
17. Child Trends — childcare access and affordability research
18. Urban Institute — child care affordability gap maps (urban.org)
19. National Women's Law Center — childcare shortage data by county
20. Annie E. Casey Foundation KIDS COUNT Data Center — child well-being & care access by state

PRICING DATA:
21. NDCP (National Database of Childcare Prices) — median market rates by county for all care types
22. Child Care Aware of America — annual "Price of Care" state report
23. State subsidy rate schedules (CCDF) — sets market floor pricing

DEMOGRAPHICS: ${ctx(a1,['summary','cities','metro_overview','labor_market_summary'])}
REGULATORY: ${ctx(a5,['summary','requirements','timeline_phases'])}
COMPETITORS: ${ctx(a6,['summary','cities','total_licensed_estimated','data_sources'])}

SEARCH STRATEGY:
- Search "child care desert [county name]" (Child Care Aware defines deserts as <1 slot per 3 children)
- Search "NDCP childcare prices [county name] [state]"
- Search "licensed childcare [city] [state]" on state licensing portal
- Search "Head Start [county name]" on eclkc.acf.hhs.gov
- Search "KIDS COUNT [state] child care" on datacenter.kidscount.org
- Check if county is a "child care desert" per Child Care Aware criteria

Return ONLY:
{
  "summary": "5-sentence gap analysis citing specific data sources and numbers",
  "overall_opportunity_score": 81,
  "data_sources_used": ["US Census ACS 2022 (Tables B01001, S0901)", "State CAPS licensing database", "NDCP DOL county childcare prices", "Child Care Aware of America state report", "Head Start locator", "Google Maps search", "KIDS COUNT Data Center"],
  "is_childcare_desert": true,
  "childcare_desert_ratio": "1 slot per 4.8 children (Child Care Aware threshold: >3 children per slot)",
  "ndcp_median_infant_rate": 1820,
  "ndcp_median_toddler_rate": 1540,
  "ndcp_median_preschool_rate": 1280,
  "ndcp_source": "National Database of Childcare Prices, DOL Women's Bureau 2022",
  "cities": [
    {
      "city": "City A", "rank": 1,
      "demand_score": 9, "supply_score": 3, "gap_score": 9,
      "unserved_children": 580, "licensed_centers_count": 8, "total_licensed_capacity_est": 480,
      "children_under5_census": 3900, "demand_to_supply_ratio": 4.8,
      "income_tier": "Premium",
      "recommended_tuition_infant": 2050, "recommended_tuition_preschool": 1650,
      "ndcp_county_median_infant": 1820, "pricing_premium_vs_market_pct": 12,
      "head_start_slots": 120, "subsidized_slots_est": 80,
      "is_desert": true,
      "priority": "Critical Opportunity",
      "rationale": "High demand, critically low supply",
      "why_gap": "3,900 children under 5 per Census ACS 2022 vs 8 licensed centers with ~480 total capacity per state CAPS database. Demand-to-supply ratio of 4.8:1 exceeds Child Care Aware desert threshold (3:1). Only 120 Head Start slots serve income-qualified families. Net gap of 3,420+ unserved children, growing at 4.2%/yr per Census PEP.",
      "data_points": [
        {"label": "Children Under 5", "value": "3,900", "source": "US Census ACS 2022 Table B01001"},
        {"label": "Licensed Centers", "value": "8", "source": "State CAPS licensing database"},
        {"label": "Total Licensed Capacity", "value": "~480 slots", "source": "State CAPS + Google Maps"},
        {"label": "Demand:Supply Ratio", "value": "4.8:1", "source": "Derived (CAPS + Census)"},
        {"label": "Head Start Slots", "value": "120", "source": "eclkc.acf.hhs.gov locator"},
        {"label": "NDCP Median Infant Rate", "value": "$1,820/mo", "source": "DOL NDCP 2022"},
        {"label": "Child Care Desert", "value": "Yes — exceeds 3:1 threshold", "source": "Child Care Aware of America"}
      ],
      "sources": ["US Census ACS 2022 (B01001)", "State CAPS licensing database", "NDCP DOL 2022", "Head Start locator eclkc.acf.hhs.gov", "Child Care Aware of America", "Google Maps business search"]
    }
  ],
  "age_gaps": [
    {"age": "${ind.tiers[0]||'Tier 1'}", "demand_idx": 95, "supply_idx": 42, "gap": 53, "source": "Census S0901 + State CAPS"},
    {"age": "${ind.tiers[1]||'Tier 2'}", "demand_idx": 82, "supply_idx": 71, "gap": 11, "source": "Census ACS + NCES enrollment"}
  ]
}

Use recommended_tuition_infant as the primary price point and recommended_tuition_preschool as the secondary price point for a ${ind.unit}. Revenue model: ${ind.revenue_unit}.
For pricing, cross-reference NDCP county median rates to validate recommendations (premium operators typically price 10-20% above market median).`;
  try {
    _setDemoKey(2);
    let d=await claudeJSON(sys,usr);
    if(!d) { console.warn('Agent 2 fallback'); d=getFallback2(); }
    R.a2=d;

    // Summary + meta badges
    let summaryText = d.summary || '';
    if (d.is_childcare_desert) summaryText += '\n\n🚨 CHILD CARE DESERT: ' + (d.childcare_desert_ratio || 'Supply critically below demand threshold (Child Care Aware: >3 children per slot)');
    if (d.ndcp_median_infant_rate) summaryText += `\n\n💰 NDCP Market Rates (${d.ndcp_source||'DOL NDCP'}): Infant $${(d.ndcp_median_infant_rate||0).toLocaleString()}/mo · Toddler $${(d.ndcp_median_toddler_rate||0).toLocaleString()}/mo · Preschool $${(d.ndcp_median_preschool_rate||0).toLocaleString()}/mo`;
    if (d.data_sources_used && d.data_sources_used.length) summaryText += '\n\n📚 Sources: ' + d.data_sources_used.join(' · ');
    $('2-s-t').textContent=summaryText;

    // Heatmap — cells are clickable for drill-down detail
    renderHmap('2-h-c',d.cities,[
      {key:'demand_score',label:'Demand Score',fmt:v=>v+'/10'},
      {key:'supply_score',label:'Supply Score',fmt:v=>v+'/10'},
      {key:'gap_score',label:'Gap Score',fmt:v=>v+'/10'},
      {key:'demand_to_supply_ratio',label:'D:S Ratio',fmt:v=>(v||0).toFixed(1)+'x'},
      {key:'unserved_children',label:'Unserved Kids',fmt:v=>v.toLocaleString()}
    ],'openGapCellDetail');

    // Rankings — now with desert badge and NDCP pricing
    let ranks=`<div class="city-compare">`;
    (d.cities||[]).forEach((c,i)=>{
      const pct=c.gap_score/10*100;
      const col=c.gap_score>=8?'var(--green)':c.gap_score>=6?'var(--amber)':'var(--red)';
      const desertBadge = c.is_desert ? `<span class="badge b-red" style="font-size:10px;margin-left:6px">🏜 Desert</span>` : '';
      const ndcpNote = c.ndcp_county_median_infant ? `<span style="font-size:10px;color:var(--faint);margin-left:4px">NDCP median: $${(c.ndcp_county_median_infant||0).toLocaleString()}/mo</span>` : '';
      ranks+=`<div class="city-row">
        <div class="city-rank">${c.rank}</div>
        <div class="city-name">${c.city}${desertBadge}${ndcpNote}</div>
        <div class="city-bar-wrap">
          <div style="font-size:10px;color:var(--muted);margin-bottom:3px">${c.priority} · ${c.income_tier} · ${c.licensed_centers_count||'?'} licensed centers · D:S ${(c.demand_to_supply_ratio||'?')}:1</div>
          <div class="city-bar-track"><div class="city-bar-fill" style="width:${pct}%;background:${col}"></div></div>
        </div>
        <div class="city-score" style="color:${col}">${c.gap_score}/10</div>
      </div>`;
    });
    ranks+=`</div>`;
    $('2-r-c').innerHTML=ranks;
    // Chart
    killChart('ch-2');
    const ctx=$('ch-2').getContext('2d');
    const ageGaps2=d.age_gaps||[];
    charts['ch-2']=new Chart(ctx,{type:'bar',data:{
      labels:ageGaps2.map(a=>a.age),
      datasets:[
        {label:'Demand Index',data:ageGaps2.map(a=>a.demand_idx),backgroundColor:'rgba(74,158,255,0.7)',borderWidth:0,borderRadius:3},
        {label:'Supply Index',data:ageGaps2.map(a=>a.supply_idx),backgroundColor:'rgba(245,166,35,0.7)',borderWidth:0,borderRadius:3},
        {label:'Gap',data:ageGaps2.map(a=>Math.max(0,a.gap)),backgroundColor:'rgba(61,214,140,0.85)',borderWidth:0,borderRadius:3}
      ]
    },options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:'#8a8d96',font:{size:11}}}},scales:{x:{ticks:{color:'#8a8d96'},grid:{color:'#2a2d35'}},y:{ticks:{color:'#8a8d96'},grid:{color:'#2a2d35'},max:100}}}});
    setDot(2,'done'); showOut(2);
    return JSON.stringify(d);
  } catch(e){setDot(2,'error');showOut(2);$('2-s-t').textContent='Error: '+e.message;throw e}
}

// ── Gap Analysis: drill-down on heatmap cell click ──────────
function openGapCellDetail(cityName, dimKey, dimLabel, val) {
  // Find city data from R.a2
  let cityData = null;
  try {
    const d = typeof R.a2 === 'string' ? JSON.parse(R.a2) : R.a2;
    if (d && d.cities) cityData = d.cities.find(c => (c.city||c.name||'') === cityName);
  } catch(e) {}

  // Build display value
  const fmts = {
    demand_score: v => v + '/10',
    supply_score: v => v + '/10',
    gap_score: v => v + '/10',
    unserved_children: v => Number(v).toLocaleString() + ' kids'
  };
  const dispVal = fmts[dimKey] ? fmts[dimKey](val) : val;
  const scoreColor = dimKey === 'gap_score'
    ? (val >= 8 ? 'var(--green)' : val >= 6 ? 'var(--amber)' : 'var(--red)')
    : 'var(--blue)';

  // Build data points HTML
  let dataPointsHtml = '';
  if (cityData && cityData.data_points && cityData.data_points.length) {
    dataPointsHtml = `<div class="gap-data-grid">` +
      cityData.data_points.map(dp =>
        `<div class="gdp-item">
          <div class="gdp-label">${dp.label}</div>
          <div class="gdp-val">${dp.value}</div>
          <div style="font-size:10px;color:var(--faint);margin-top:2px">${dp.source||''}</div>
        </div>`
      ).join('') + `</div>`;
  }

  const why = cityData ? (cityData.why_gap || cityData.rationale || 'No detailed reasoning available for this metric.') : 'Run the pipeline to see detailed reasoning.';
  const sources = cityData && cityData.sources ? cityData.sources.join(' · ') : 'US Census ACS 2022 · State licensing database · Google Maps';
  const priority = cityData ? (cityData.priority || '') : '';

  // Inject overlay if not present
  if (!document.getElementById('gapDetailOverlay')) {
    const ov = document.createElement('div');
    ov.id = 'gapDetailOverlay';
    ov.className = 'gap-detail-overlay';
    ov.onclick = function(e){ if(e.target===ov) closeGapDetail(); };
    document.body.appendChild(ov);
  }

  const ov = document.getElementById('gapDetailOverlay');
  ov.innerHTML = `
    <div class="gap-detail-panel">
      <button class="gap-detail-close" onclick="closeGapDetail()">✕</button>
      <div class="gap-detail-city">${cityName}</div>
      <div class="gap-detail-metric">${dimLabel}${priority ? ' · ' + priority : ''}</div>
      <div class="gap-detail-value" style="color:${scoreColor}">${dispVal}</div>
      ${dataPointsHtml}
      <div class="gap-detail-why">${why}</div>
      <div class="gap-detail-sources">📚 Sources: ${sources}</div>
    </div>`;
  ov.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeGapDetail() {
  const ov = document.getElementById('gapDetailOverlay');
  if (ov) { ov.classList.remove('open'); document.body.style.overflow = ''; }
}

// ══════════════════════════════════════════════════════════
// AGENT 3 — Site Recommendations
// ══════════════════════════════════════════════════════════
