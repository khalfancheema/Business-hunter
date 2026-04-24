async function runAgent1() {
  setDot(1,'running');
  const ind=industry();
  const sys=`You are a demographics and market analyst with expertise in US Census ACS data and GIS mapping. You are researching demand signals for a ${ind.unit} business. Always respond with a JSON object only.`;

  const usr=`Search US Census Bureau ACS 2022 5-year estimates for cities within ${radius()} miles of ZIP ${zip()}.

Industry: ${ind.label}. Revenue unit: ${ind.revenue_unit}.

Identify the top cities by population, income, traffic, and growth. For a ${ind.unit}, the most relevant demand signals are: total population, median household income, labor force participation, population growth 2019–2023, household counts, and daily traffic volume.

Return ONLY this JSON (use real data, note "est." if estimated):
{"data_sources":["US Census ACS 2022 5-year estimates","ACS Table B19013","local GIS data"],"summary":"4-5 sentence narrative on demographic opportunity for a ${ind.unit} in this area","cities":[{"name":"City A","county":"County","distance_miles":10,"pop_total":82000,"pop_under5":4800,"pop_under5_pct":5.8,"median_hh_income":112000,"labor_force_pct":68,"pop_growth_pct_5yr":4.2,"households":28000,"working_parents_est_pct":71,"demand_score":88,"data_note":"ACS 2022 est."},{"name":"City B","county":"County","distance_miles":28,"pop_total":18000,"pop_under5":1400,"pop_under5_pct":7.8,"median_hh_income":52000,"labor_force_pct":65,"pop_growth_pct_5yr":14,"households":6800,"working_parents_est_pct":74,"demand_score":72,"data_note":"ACS 2022 est."}],"age_breakdown_county":[{"age_group":"Segment 1","gwinnett_pop":7200,"fulton_pop":5100,"gap_capacity":380},{"age_group":"Segment 2","gwinnett_pop":14800,"fulton_pop":10400,"gap_capacity":620}]}`;

  try {
    let d=await claudeJSON(sys,usr);
    if(!d) { console.warn('Agent 1 fallback'); d=getFallback1(); }
    R.a1=d;
    $('1-s-t').textContent=d.summary+(d.data_sources?'\n\nSources: '+d.data_sources.join(' · '):'');
    // Heatmap
    const ind=industry();
    const cities1=d.cities||[];
    renderHmap('1-h-c',cities1,[
      {key:'pop_under5',label:ind.capacity_label.split(' ')[0]+' Pop',fmt:v=>v.toLocaleString()},
      {key:'median_hh_income',label:'Median Income',fmt:v=>'$'+(v/1000).toFixed(0)+'k'},
      {key:'working_parents_est_pct',label:'Labor Force %',fmt:v=>v+'%'},
      {key:'pop_growth_pct_5yr',label:'Pop Growth 5yr',fmt:v=>v+'%'},
      {key:'demand_score',label:'Demand Score',fmt:v=>v+'/100'}
    ]);
    // Chart
    killChart('ch-1');
    const ctx=$('ch-1').getContext('2d');
    charts['ch-1']=new Chart(ctx,{type:'bar',data:{
      labels:cities1.map(c=>c.name),
      datasets:[
        {label:'Children Under 5',data:cities1.map(c=>c.pop_under5||0),backgroundColor:'rgba(74,158,255,0.7)',borderWidth:0,borderRadius:3,yAxisID:'y'},
        {label:'Demand Score',data:cities1.map(c=>c.demand_score||0),backgroundColor:'rgba(61,214,140,0.7)',borderWidth:0,borderRadius:3,yAxisID:'y2'}
      ]
    },options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:'#8a8d96',font:{size:11}}}},scales:{x:{ticks:{color:'#8a8d96',font:{size:9}},grid:{color:'#2a2d35'}},y:{ticks:{color:'#4a9eff'},grid:{color:'#2a2d35'},position:'left'},y2:{ticks:{color:'#3dd68c'},grid:{display:false},position:'right',min:0,max:100}}}});
    // Table
    let tbl=`<table class="tbl"><thead><tr><th>City</th><th>County</th><th>Dist</th><th>Children &lt;5</th><th>Median Income</th><th>Labor Force</th><th>Growth 5yr</th><th>Demand</th><th>Notes</th></tr></thead><tbody>`;
    cities1.forEach(c=>{
      const b=(c.demand_score||0)>=80?'b-green':(c.demand_score||0)>=65?'b-amber':'b-red';
      tbl+=`<tr><td><strong>${c.name}</strong></td><td>${c.county}</td><td>${c.distance_miles}mi</td><td>${(c.pop_under5||0).toLocaleString()}</td><td>$${((c.median_hh_income||0)/1000).toFixed(0)}k</td><td>${c.labor_force_pct||'—'}%</td><td>${c.pop_growth_pct_5yr||'—'}%</td><td><span class="badge ${b}">${c.demand_score}</span></td><td style="font-size:10px;color:var(--faint)">${c.data_note||''}</td></tr>`;
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
