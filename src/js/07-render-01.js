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
    "metro_name":              null,
    "total_pop_metro":         null,
    "pop_growth_pct_1yr":      null,
    "median_hh_income_metro":  null,
    "median_family_income":    null,
    "per_capita_income":       null,
    "per_capita_personal_income": null,
    "unemployment_rate_pct":   null,
    "poverty_rate_pct":        null,
    "uninsured_pct":           null,
    "net_migration_annual":    null,
    "net_migration_annual_pct":null,
    "birth_rate_per_1000":     null,
    "source":                  null
  },
  "cities": [
    {
      "name":               null,
      "county":             null,
      "distance_miles":     null,
      "pop_total":          null,
      "pop_under5":         null,
      "pop_under5_pct":     null,
      "median_hh_income":   null,
      "income_distribution": {"under_50k_pct": null, "50_100k_pct": null, "over_100k_pct": null},
      "poverty_rate_pct":   null,
      "labor_force_pct":    null,
      "women_25_44_lfp_pct":null,
      "pop_growth_pct_5yr": null,
      "pop_growth_pct_1yr": null,
      "households":         null,
      "owner_occupied_pct": null,
      "renter_pct":         null,
      "working_parents_est_pct": null,
      "dual_income_hh_est_pct":  null,
      "avg_commute_minutes":null,
      "school_enrollment_k12": null,
      "annual_births_county_est": null,
      "traffic_aadt_main_corridor": null,
      "walkability_score":  null,
      "housing_affordability_index": null,
      "demand_score":       null,
      "data_note":          null
    }
  ],
  "age_breakdown_county": [
    {"age_group": null, "gwinnett_pop": null, "fulton_pop": null, "gap_capacity": null, "source": null}
  ],
  "labor_market_summary": {
    "top_employer_sectors":          [],
    "median_wage_primary_occupation": null,
    "female_labor_force_pct_county":  null,
    "source": null
  },
  "housing_market_summary": {
    "median_home_value":      null,
    "new_permits_issued_2023":null,
    "yoy_permit_growth_pct":  null,
    "source": null
  }
}`;
  // ── Part 2 prompt (community profile — separate sub-call to avoid max_tokens) ──
  const usr2 = `Return community profile data for ZIP ${zip()} area (${radius()} mile radius). Use US Census ACS, BLS CES, and Esri lifestyle segmentation sources.
All numbers/strings in the schema are placeholders. Replace every value with verified data for ZIP ${zip()}, or use null/"N/A" when not verified.
Return ONLY this JSON:
{
  "age_pyramid": [{"bracket":null,"male":null,"female":null}],
  "generation_breakdown": [{"gen":null,"population_pct":null,"households_pct":null}],
  "multi_radius": [{"ring":null,"population":null,"households":null,"median_hh_income":null,"pct_with_children":null,"pop_under5":null,"avg_hh_size":null}],
  "consumer_expenditure": {"radius_miles":null,"total_expenditure_millions":null,"categories":[{"category":null,"amount_millions":null,"pct_of_total":null}]},
  "lifestyle_segments": [{"segment":null,"pct":null,"description":null}],
  "population_projections": [{"year":null,"population":null}],
  "occupation_lq": [{"occupation":null,"area_pct":null,"us_pct":null,"lq":null}],
  "education_attainment": {"radius_miles":null,"less_than_hs_pct":null,"hs_grad_pct":null,"some_college_pct":null,"associates_pct":null,"bachelors_pct":null,"graduate_pct":null},
  "housing_detail": {"median_home_value":null,"avg_home_value":null,"owner_occupied_pct":null,"renter_occupied_pct":null,"median_gross_rent":null,"built_2010_later_pct":null,"built_2000_2009_pct":null},
  "language_spoken": [{"language":null,"pct":null}],
  "daytime_population": {"residential_pop":null,"daytime_pop":null,"daytime_to_residential_ratio":null,"workers_present":null,"workers_at_home":null}
}`;

  // Prepend verified Census ACS data so agent anchors to real numbers
  const _rdCtx1 = typeof buildRealDataCtx === 'function'
    ? buildRealDataCtx(['demographics','business_density','macro','crime','health','acs_expanded','rural_urban','cbp_county','food_access','local_unemp','crime_city','schools','acs_home_value','cdc_svi','hud_income','acs_industry_mix','building_permits','bea_income','acs_migration','census_pep','air_quality','county_health','noaa_climate','cdc_places_x'])
    : '';
  const usrWithReal = _rdCtx1 ? _rdCtx1 + '\n\nNow complete the full demographic analysis:\n' + usr : usr;

  try {
    _setDemoKey(1);
    let d=await claudeJSON(sys, usrWithReal, {webSearch:true, agentNum:1});
    if(!d) { console.warn('Agent 1 Part 1 fallback'); d=getFallback1(); }
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

    // ── Inject verified ACS numbers above summary ────────────
    if (typeof rdRenderRealDataBadge === 'function') {
      rdRenderRealDataBadge('1-s-t', ['demographics','business_density','macro','crime']);
    }

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
      const score=c.demand_score;
      const b=score>=80?'b-green':score>=65?'b-amber':'b-red';
      tbl+=`<tr>
        <td><strong>${c.name}</strong></td>
        <td>${_nv(c.county)}</td>
        <td>${_nv(c.distance_miles, v=>v+'mi')}</td>
        <td>${_nvNum(c.pop_under5, v=>v.toLocaleString())}</td>
        <td>${_nvNum(c.median_hh_income, v=>'$'+(v/1000).toFixed(0)+'k')}</td>
        <td>${_nv(c.dual_income_hh_est_pct, v=>v+'%')}</td>
        <td>${_nv(c.labor_force_pct, v=>v+'%')}</td>
        <td>${_nv(c.pop_growth_pct_5yr, v=>v+'%')}</td>
        <td>${_nvNum(c.annual_births_county_est, v=>v.toLocaleString())}</td>
        <td>${_nvNum(c.traffic_aadt_main_corridor, v=>v.toLocaleString())}</td>
        <td>${_nvNum(c.school_enrollment_k12, v=>v.toLocaleString())}</td>
        <td>${score!=null?`<span class="badge ${b}">${score}</span>`:'<span style="color:var(--faint);font-size:11px">N/A</span>'}</td>
        <td style="font-size:10px;color:var(--faint)">${c.data_note||''}</td>
      </tr>`;
    });
    tbl+=`</tbody></table>`;
    $('1-t-c').innerHTML=tbl;
    // ── Part 2 of 2: Community Profile (separate sub-call to avoid max_tokens) ──
    // Runs after Part 1 renders and before A1 is marked done, so downstream
    // agents can rely on the complete demographics package.
    if (!demoMode) {
      try {
        const sys2 = `You are a community profile analyst. Return only accurate JSON — no text before or after.`;
        const cp = await claudeJSON(sys2, usr2, {webSearch:true, agentNum:1});
        if (cp) {
          // Merge community profile fields into R.a1
          const cpFields = ['age_pyramid','generation_breakdown','multi_radius','consumer_expenditure',
            'lifestyle_segments','population_projections','occupation_lq','education_attainment',
            'housing_detail','language_spoken','daytime_population'];
          cpFields.forEach(f => { if (cp[f] !== undefined) R.a1[f] = cp[f]; });
          d = R.a1;
        }
      } catch(e2) { console.warn('Agent 1 Part 2 community profile failed:', e2.message); }
    }

    setDot(1,'done'); showOut(1);

    return JSON.stringify(d);
  } catch(e){setDot(1,'error');showOut(1);$('1-s-t').textContent='Error: '+e.message;throw e}
}

// ══════════════════════════════════════════════════════════
// AGENT 5 — Regulatory
// ══════════════════════════════════════════════════════════
