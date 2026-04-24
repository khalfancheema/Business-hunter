async function runAgent6() {
  setDot(6,'running');
  const ind=industry();
  const sys=`You are a market analyst specializing in competitive intelligence for ${ind.units}. Respond with ONLY a valid JSON object — no prose before or after.`;
  const usr=`Search for existing ${ind.units} within ${radius()} miles of ZIP ${zip()}. Key competitors to research: ${ind.competitors}.

Search queries to use: "${ind.unit} near ZIP ${zip()}", "${ind.units} [city name] reviews", Google Maps / Yelp listings.

Respond with ONLY this JSON:
{"summary":"4-sentence competitive landscape for ${ind.units} in this area","total_licensed_estimated":40,"cities":[{"city":"City A","center_count":8,"avg_monthly_infant":0,"avg_monthly_preschool":0,"avg_rating":4.1,"capacity_utilization_pct":88,"waitlist_common":false,"gap_score":7},{"city":"City B","center_count":3,"avg_monthly_infant":0,"avg_monthly_preschool":0,"avg_rating":4.3,"capacity_utilization_pct":94,"waitlist_common":true,"gap_score":9}],"top_chains":[{"name":"Competitor A","locations_in_area":4,"monthly_tuition_range":"varies","rating":4.1,"type":"Chain"},{"name":"Competitor B","locations_in_area":2,"monthly_tuition_range":"varies","rating":3.8,"type":"Independent"}]}

Use avg_monthly_infant and avg_monthly_preschool as the primary and secondary revenue price points for a ${ind.unit} (e.g. base service price and premium tier price). Replace example values with real search data.`;
  try {
    let d=await claudeJSON(sys,usr);
    // Fallback: if claudeJSON returns null after 3 retries, use baseline data
    if(!d) {
      const ind=industry();
      console.warn('Agent 6: using baseline fallback data');
      d={
        summary:`Competitive intelligence for ${radius()}-mile radius of ZIP ${zip()}. Baseline data used — run with a valid API key for live market research on ${ind.units} in this area.`,
        total_licensed_estimated:20,
        cities:[
          {city:"Area A",center_count:8,avg_monthly_infant:1800,avg_monthly_preschool:1400,avg_rating:4.1,capacity_utilization_pct:88,waitlist_common:true,gap_score:8},
          {city:"Area B",center_count:5,avg_monthly_infant:1600,avg_monthly_preschool:1200,avg_rating:4.0,capacity_utilization_pct:85,waitlist_common:false,gap_score:7},
          {city:"Area C",center_count:12,avg_monthly_infant:1500,avg_monthly_preschool:1100,avg_rating:3.8,capacity_utilization_pct:82,waitlist_common:false,gap_score:4}
        ],
        top_chains:ind.competitors.split(',').slice(0,4).map((name,i)=>({
          name:name.trim(),locations_in_area:Math.max(1,4-i),monthly_tuition_range:'varies',rating:4.0-i*0.1,type:i===0?'Franchise':'Independent'
        }))
      };
    }
    R.a6=d;
    $('6-s-t').textContent=d.summary;
    killChart('ch-6');
    const ctx=$('ch-6').getContext('2d');
    const cities6=d.cities||[];
    charts['ch-6']=new Chart(ctx,{type:'bar',data:{
      labels:cities6.map(c=>c.city),
      datasets:[
        {label:'Centers',data:cities6.map(c=>c.center_count),backgroundColor:'rgba(255,95,95,0.7)',borderWidth:0,borderRadius:3,yAxisID:'y'},
        {label:'Gap Score /10',data:cities6.map(c=>c.gap_score),backgroundColor:'rgba(61,214,140,0.7)',borderWidth:0,borderRadius:3,yAxisID:'y2'}
      ]
    },options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:'#8a8d96',font:{size:11}}}},scales:{x:{ticks:{color:'#8a8d96',font:{size:9}},grid:{color:'#2a2d35'}},y:{ticks:{color:'#ff5f5f'},grid:{color:'#2a2d35'},position:'left',title:{display:true,text:'# Centers',color:'#ff5f5f'}},y2:{ticks:{color:'#3dd68c'},grid:{display:false},position:'right',min:0,max:10,title:{display:true,text:'Gap Score',color:'#3dd68c'}}}}});
    const ind6=industry();
    let tbl=`<table class="tbl"><thead><tr><th>City</th><th>Centers</th><th>${ind6.price_label_primary}</th><th>${ind6.price_label_secondary}</th><th>Avg Rating</th><th>Utilization</th><th>Waitlist</th><th>Gap Score</th></tr></thead><tbody>`;
    cities6.forEach(c=>{
      const gb=c.gap_score>=8?'b-green':c.gap_score>=6?'b-amber':'b-red';
      const pRate=(c.avg_monthly_infant||c.avg_primary_rate||0).toLocaleString();
      const sRate=(c.avg_monthly_preschool||c.avg_secondary_rate||0).toLocaleString();
      tbl+=`<tr><td><strong>${c.city}</strong></td><td>${c.center_count}</td><td>$${pRate}</td><td>$${sRate}</td><td>${c.avg_rating}★</td><td>${c.capacity_utilization_pct}%</td><td><span class="badge ${c.waitlist_common?'b-amber':'b-blue'}">${c.waitlist_common?'Yes':'No'}</span></td><td><span class="badge ${gb}">${c.gap_score}/10</span></td></tr>`;
    });
    tbl+=`</tbody></table>`;
    $('6-t-c').innerHTML=tbl;
    setDot(6,'done'); showOut(6);
    return JSON.stringify(d);
  } catch(e){setDot(6,'error');showOut(6);$('6-s-t').textContent='Error: '+e.message;throw e}
}

// ══════════════════════════════════════════════════════════
// AGENT 2 — Gap Analysis
// ══════════════════════════════════════════════════════════
