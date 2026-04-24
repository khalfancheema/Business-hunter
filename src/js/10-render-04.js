async function runAgent2(a1,a5,a6) {
  setDot(2,'running');
  const ind=industry();
  const sys=`You are a market gap analyst for small businesses. Respond JSON only.`;
  const usr=`Synthesize a market gap analysis for a ${ind.unit} (capacity: ${capacity()}, budget: $${parseInt(budget()).toLocaleString()}) within ${radius()} miles of ZIP ${zip()}.

DEMOGRAPHICS: ${ctx(a1,['summary','cities','overall_opportunity_score'])}
REGULATORY: ${ctx(a5,['summary','requirements','timeline_phases'])}
COMPETITORS: ${ctx(a6,['summary','cities','total_licensed_estimated'])}

Return ONLY:
{"summary":"5-sentence gap analysis for a ${ind.unit} in this area","overall_opportunity_score":81,"cities":[{"city":"City A","rank":1,"demand_score":9,"supply_score":3,"gap_score":9,"unserved_children":580,"income_tier":"Premium","recommended_tuition_infant":2050,"recommended_tuition_preschool":1650,"priority":"Critical Opportunity","rationale":"High demand, low competition"},{"city":"City B","rank":2,"demand_score":8,"supply_score":4,"gap_score":7,"unserved_children":310,"income_tier":"Mid","recommended_tuition_infant":1750,"recommended_tuition_preschool":1380,"priority":"High Opportunity","rationale":"Growing area, few competitors"}],"age_gaps":[{"age":"${ind.tiers[0]||'Tier 1'}","demand_idx":95,"supply_idx":42,"gap":53},{"age":"${ind.tiers[1]||'Tier 2'}","demand_idx":82,"supply_idx":71,"gap":11}]}

Use recommended_tuition_infant as the primary price point and recommended_tuition_preschool as the secondary price point for a ${ind.unit}. Revenue model: ${ind.revenue_unit}.`;
  try {
    let d=await claudeJSON(sys,usr);
    if(!d) { console.warn('Agent 2 fallback'); d=getFallback2(); }
    R.a2=d;
    $('2-s-t').textContent=d.summary;
    // Heatmap
    renderHmap('2-h-c',d.cities,[
      {key:'demand_score',label:'Demand Score',fmt:v=>v+'/10'},
      {key:'supply_score',label:'Supply Score',fmt:v=>v+'/10'},
      {key:'gap_score',label:'Gap Score',fmt:v=>v+'/10'},
      {key:'unserved_children',label:'Unserved Kids',fmt:v=>v.toLocaleString()}
    ]);
    // Rankings
    let ranks=`<div class="city-compare">`;
    (d.cities||[]).forEach((c,i)=>{
      const pct=c.gap_score/10*100;
      const col=c.gap_score>=8?'var(--green)':c.gap_score>=6?'var(--amber)':'var(--red)';
      ranks+=`<div class="city-row">
        <div class="city-rank">${c.rank}</div>
        <div class="city-name">${c.city}</div>
        <div class="city-bar-wrap">
          <div style="font-size:10px;color:var(--muted);margin-bottom:3px">${c.priority} · ${c.income_tier}</div>
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

// ══════════════════════════════════════════════════════════
// AGENT 3 — Site Recommendations
// ══════════════════════════════════════════════════════════
