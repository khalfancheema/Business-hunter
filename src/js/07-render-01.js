async function runAgent1() {
  setDot(1,'running');
  const ind=industry();
  const sys=`You are a senior demographics and market research analyst with deep expertise in US Census data, GIS mapping, labor economics, and consumer demand modeling. You source data from multiple authoritative federal, state, and commercial databases. Always respond with a JSON object only.`;

  const usr=`Conduct a comprehensive demographic research sweep for a ${ind.unit} business opportunity within ${radius()} miles of ZIP ${zip()}.

Industry: ${ind.label}. Revenue unit: ${ind.revenue_unit}.

PRIMARY DATA SOURCES — search and cite as many of the following as possible:
1. US Census Bureau ACS 2023 1-year & 2022 5-year estimates
   - Table B01001 (sex by age), B01003 (total population)
   - Table B19013 (median household income), B19001 (income distribution)
   - Table B23025 (employment status), B23022 (employment by sex/age)
   - Table B25001 (housing units), B25003 (tenure — own vs rent)
   - Table S1101 (households and families), S0901 (children characteristics)
   - Table B08303 (travel time to work — commute demand proxy)
   - Table B14001 (school enrollment), B14003 (school type)
2. Census Bureau Population Estimates Program (PEP) — annual population estimates 2020–2023
3. Census TIGER/Line shapefiles + ZIP Code Tabulation Areas (ZCTAs) for geographic precision
4. BLS Quarterly Census of Employment and Wages (QCEW) — local industry employment levels
5. BLS Consumer Expenditure Survey (CES) — spending on ${ind.units} / relevant services by income tier
6. BLS Occupational Employment and Wage Statistics (OEWS) — working parent occupations in area
7. HUD Location Affordability Portal — housing cost burden, who can afford premium services
8. EPA Smart Location Database — walkability index, transit access, employment accessibility score
9. FHWA / state DOT Annual Average Daily Traffic (AADT) counts near major corridors
10. National Center for Education Statistics (NCES) — public school enrollment as demand proxy
11. State vital statistics / birth records — annual birth rates by county (lagging demand indicator)
12. FRED (Federal Reserve Economic Data) — local unemployment rate, GDP, housing starts for area
13. Esri / ArcGIS Business Analyst Community Profile (if accessible) — lifestyle segmentation
14. NAR / Realtor.com migration data — net in-migration by metro area
15. USDA ERS rural-urban commuting area (RUCA) codes — urban density classification

SEARCH STRATEGY:
- Search "US Census ACS ZIP ${zip()} population income"
- Search "Census QuickFacts [county name]"
- Search "BLS employment [city/county name] QCEW"
- Search "FRED [city/metro] economic data"
- Search "birth rate [county name] vital statistics [state]"
- Search "[city name] school enrollment NCES"
- For each city within ${radius()} miles, find ACTUAL census tract / place-level data

KEY DEMAND SIGNALS FOR A ${ind.unit.toUpperCase()}:
- ${ind.capacity_label} population density (children under 5 or primary demographic)
- Median household income and income tier distribution
- Dual-income / working parent household percentage
- Labor force participation rate (especially women 25–44)
- Population growth rate 2019–2023 (momentum indicator)
- Household formation rate (new construction permits as proxy)
- Daily traffic count on primary commercial corridors
- School-age population as pipeline / future demand
- Birth rate trend (leading indicator, 2–3 yr lag)
- Housing affordability index (determines ability to pay)

Return ONLY this JSON (use real data from the sources above, note source and "est." if estimated):
{
  "data_sources": [
    "US Census ACS 2023 1-year estimates (Tables B01001, B19013, B23025, B25001)",
    "US Census ACS 2022 5-year estimates (Tables S0901, B08303, B14001)",
    "Census Population Estimates Program 2020–2023",
    "BLS QCEW Q3 2023 — county-level employment",
    "BLS Consumer Expenditure Survey 2022",
    "HUD Location Affordability Portal",
    "FHWA AADT traffic counts",
    "NCES school enrollment data 2022–23",
    "State vital statistics birth records 2022",
    "FRED economic data — local metro",
    "NAR migration trends 2023"
  ],
  "summary": "5-sentence narrative citing specific numbers and sources on demographic opportunity for a ${ind.unit} in this area",
  "metro_overview": {
    "metro_name": "Atlanta-Sandy Springs-Alpharetta MSA",
    "total_pop_metro": 6200000,
    "pop_growth_pct_1yr": 1.8,
    "median_hh_income_metro": 78000,
    "unemployment_rate_pct": 3.4,
    "net_migration_annual": 45000,
    "birth_rate_per_1000": 11.2,
    "source": "Census PEP 2023 / FRED / Vital Statistics"
  },
  "cities": [
    {
      "name": "City A", "county": "County", "distance_miles": 10,
      "pop_total": 82000, "pop_under5": 4800, "pop_under5_pct": 5.8,
      "median_hh_income": 112000, "income_distribution": {"under_50k_pct": 12, "50_100k_pct": 28, "over_100k_pct": 60},
      "labor_force_pct": 68, "women_25_44_lfp_pct": 74,
      "pop_growth_pct_5yr": 4.2, "pop_growth_pct_1yr": 1.1,
      "households": 28000, "owner_occupied_pct": 72, "renter_pct": 28,
      "working_parents_est_pct": 71, "dual_income_hh_est_pct": 64,
      "avg_commute_minutes": 28,
      "school_enrollment_k12": 14200,
      "annual_births_county_est": 1800,
      "traffic_aadt_main_corridor": 32000,
      "walkability_score": 42,
      "housing_affordability_index": 88,
      "demand_score": 88,
      "data_note": "ACS 2022 5yr est. + PEP 2023"
    },
    {
      "name": "City B", "county": "County", "distance_miles": 28,
      "pop_total": 18000, "pop_under5": 1400, "pop_under5_pct": 7.8,
      "median_hh_income": 52000, "income_distribution": {"under_50k_pct": 45, "50_100k_pct": 38, "over_100k_pct": 17},
      "labor_force_pct": 65, "women_25_44_lfp_pct": 68,
      "pop_growth_pct_5yr": 14, "pop_growth_pct_1yr": 3.2,
      "households": 6800, "owner_occupied_pct": 58, "renter_pct": 42,
      "working_parents_est_pct": 74, "dual_income_hh_est_pct": 55,
      "avg_commute_minutes": 34,
      "school_enrollment_k12": 3800,
      "annual_births_county_est": 620,
      "traffic_aadt_main_corridor": 14000,
      "walkability_score": 28,
      "housing_affordability_index": 112,
      "demand_score": 72,
      "data_note": "ACS 2022 5yr est. + Vital Stats 2022"
    }
  ],
  "age_breakdown_county": [
    {"age_group": "Segment 1", "gwinnett_pop": 7200, "fulton_pop": 5100, "gap_capacity": 380, "source": "ACS B01001"},
    {"age_group": "Segment 2", "gwinnett_pop": 14800, "fulton_pop": 10400, "gap_capacity": 620, "source": "ACS B01001"}
  ],
  "labor_market_summary": {
    "top_employer_sectors": ["Healthcare", "Professional Services", "Technology", "Education"],
    "median_wage_primary_occupation": 72000,
    "female_labor_force_pct_county": 59,
    "source": "BLS QCEW + OEWS 2023"
  },
  "housing_market_summary": {
    "median_home_value": 420000,
    "new_permits_issued_2023": 3200,
    "yoy_permit_growth_pct": 8.4,
    "source": "Census Building Permits Survey 2023"
  }
}`;

  try {
    let d=await claudeJSON(sys,usr);
    if(!d) { console.warn('Agent 1 fallback'); d=getFallback1(); }
    R.a1=d;

    // Summary + sources
    let summaryHtml = d.summary || '';
    if (d.data_sources && d.data_sources.length) {
      summaryHtml += '\n\n📚 Sources used: ' + d.data_sources.join(' · ');
    }
    // Metro overview panel
    if (d.metro_overview) {
      const m = d.metro_overview;
      summaryHtml += `\n\n🌆 Metro: ${m.metro_name||''} · Pop ${(m.total_pop_metro||0).toLocaleString()} · Growth ${m.pop_growth_pct_1yr||'—'}%/yr · Median HHI $${((m.median_hh_income_metro||0)/1000).toFixed(0)}k · Unemployment ${m.unemployment_rate_pct||'—'}% · Net migration +${(m.net_migration_annual||0).toLocaleString()}/yr · Birth rate ${m.birth_rate_per_1000||'—'}/1k (${m.source||''})`;
    }
    if (d.labor_market_summary) {
      const l = d.labor_market_summary;
      summaryHtml += `\n\n💼 Labor market: Top sectors — ${(l.top_employer_sectors||[]).join(', ')} · Female LFP ${l.female_labor_force_pct_county||'—'}% · Median wage $${((l.median_wage_primary_occupation||0)/1000).toFixed(0)}k (${l.source||''})`;
    }
    if (d.housing_market_summary) {
      const h = d.housing_market_summary;
      summaryHtml += `\n\n🏠 Housing: Median value $${((h.median_home_value||0)/1000).toFixed(0)}k · ${(h.new_permits_issued_2023||0).toLocaleString()} new permits · ${h.yoy_permit_growth_pct||'—'}% YoY growth (${h.source||''})`;
    }
    $('1-s-t').textContent=summaryHtml;

    // Heatmap — now with more dimensions
    const ind=industry();
    const cities1=d.cities||[];
    renderHmap('1-h-c',cities1,[
      {key:'pop_under5',label:ind.capacity_label.split(' ')[0]+' Pop',fmt:v=>v.toLocaleString()},
      {key:'median_hh_income',label:'Median Income',fmt:v=>'$'+(v/1000).toFixed(0)+'k'},
      {key:'dual_income_hh_est_pct',label:'Dual Income %',fmt:v=>v+'%'},
      {key:'pop_growth_pct_5yr',label:'Pop Growth 5yr',fmt:v=>v+'%'},
      {key:'annual_births_county_est',label:'Annual Births',fmt:v=>(v||0).toLocaleString()},
      {key:'traffic_aadt_main_corridor',label:'Traffic AADT',fmt:v=>(v||0).toLocaleString()},
      {key:'demand_score',label:'Demand Score',fmt:v=>v+'/100'}
    ]);

    // Chart — 3 datasets: children under 5, dual-income HHs, demand score
    killChart('ch-1');
    const ctx=$('ch-1').getContext('2d');
    charts['ch-1']=new Chart(ctx,{type:'bar',data:{
      labels:cities1.map(c=>c.name),
      datasets:[
        {label:'Children Under 5',data:cities1.map(c=>c.pop_under5||0),backgroundColor:'rgba(74,158,255,0.7)',borderWidth:0,borderRadius:3,yAxisID:'y'},
        {label:'Annual Births (est.)',data:cities1.map(c=>c.annual_births_county_est||0),backgroundColor:'rgba(167,139,250,0.7)',borderWidth:0,borderRadius:3,yAxisID:'y'},
        {label:'Demand Score',data:cities1.map(c=>c.demand_score||0),backgroundColor:'rgba(61,214,140,0.7)',borderWidth:0,borderRadius:3,yAxisID:'y2'}
      ]
    },options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:'#8a8d96',font:{size:11}}}},scales:{x:{ticks:{color:'#8a8d96',font:{size:9}},grid:{color:'#2a2d35'}},y:{ticks:{color:'#4a9eff'},grid:{color:'#2a2d35'},position:'left'},y2:{ticks:{color:'#3dd68c'},grid:{display:false},position:'right',min:0,max:100}}}});

    // Rich city table with expanded columns
    let tbl=`<table class="tbl"><thead><tr><th>City</th><th>County</th><th>Dist</th><th>Kids&lt;5</th><th>Income</th><th>Dual Income%</th><th>LFP%</th><th>Growth 5yr</th><th>Births/yr</th><th>AADT</th><th>School Enroll.</th><th>Demand</th><th>Source</th></tr></thead><tbody>`;
    cities1.forEach(c=>{
      const b=(c.demand_score||0)>=80?'b-green':(c.demand_score||0)>=65?'b-amber':'b-red';
      tbl+=`<tr>
        <td><strong>${c.name}</strong></td>
        <td>${c.county||'—'}</td>
        <td>${c.distance_miles||'—'}mi</td>
        <td>${(c.pop_under5||0).toLocaleString()}</td>
        <td>$${((c.median_hh_income||0)/1000).toFixed(0)}k</td>
        <td>${c.dual_income_hh_est_pct||'—'}%</td>
        <td>${c.labor_force_pct||'—'}%</td>
        <td>${c.pop_growth_pct_5yr||'—'}%</td>
        <td>${(c.annual_births_county_est||0).toLocaleString()}</td>
        <td>${(c.traffic_aadt_main_corridor||0).toLocaleString()}</td>
        <td>${(c.school_enrollment_k12||0).toLocaleString()}</td>
        <td><span class="badge ${b}">${c.demand_score}</span></td>
        <td style="font-size:10px;color:var(--faint)">${c.data_note||''}</td>
      </tr>`;
    });
    tbl+=`</tbody></table>`;
    $('1-t-c').innerHTML=tbl;
    setDot(1,'done'); showOut(1);
    return JSON.stringify(d);
  } catch(e){setDot(1,'error');showOut(1);$('1-s-t').textContent='Error: '+e.message;throw e}
}

// ══════════════════════════════════════════════════════════
// AGENT 5 — Regulatory
// ══════════════════════════════════════════════════════════
