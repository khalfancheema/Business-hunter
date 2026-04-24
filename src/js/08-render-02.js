async function runAgent5() {
  setDot(5,'running');
  const ind=industry();
  const sys=`You are a regulatory compliance expert for small businesses in the US. Research current licensing, zoning, and permit requirements for opening a ${ind.unit}. Respond JSON only.`;
  const usr=`Search for all federal, state, and local requirements to open a ${ind.unit} near ZIP ${zip()}.

Regulatory authority: ${ind.regulatory}
Key compliance areas: ${ind.compliance}

Return ONLY:
{"summary":"4-sentence overview of the main regulatory requirements","decal_url":"https://www.sba.gov/business-guide/launch-your-business/apply-licenses-permits","requirements":[{"category":"Licensing","item":"Business License","detail":"Required from city/county before opening","timeline_weeks":4,"cost_usd":200,"source":"Local municipality","priority":"Critical"},{"category":"Zoning","item":"Zoning/Use Permit","detail":"Confirm ${ind.unit} is permitted use in target zone","timeline_weeks":4,"cost_usd":400,"source":"Local planning dept","priority":"Critical"},{"category":"Regulatory","item":"Industry-Specific License","detail":"${ind.regulatory} — obtain required permits","timeline_weeks":8,"cost_usd":500,"source":"${ind.regulatory}","priority":"Critical"},{"category":"Fire","item":"Fire Marshal Inspection","detail":"Required before occupancy certificate","timeline_weeks":4,"cost_usd":0,"source":"Local Fire Marshal","priority":"Critical"},{"category":"Insurance","item":"General Liability Insurance","detail":"$1M–$2M policy required before opening","timeline_weeks":1,"cost_usd":3000,"source":"Insurance broker","priority":"Critical"},{"category":"Building","item":"Certificate of Occupancy","detail":"Building dept CO required before opening","timeline_weeks":6,"cost_usd":300,"source":"Local building dept","priority":"Critical"}],"timeline_phases":[{"phase":"Business Formation","weeks":2,"tasks":"LLC, EIN, business bank account"},{"phase":"Site & Zoning","weeks":6,"tasks":"Confirm zoning, negotiate lease or purchase"},{"phase":"Permits & Plans","weeks":10,"tasks":"Building permit, architect drawings if needed, industry license application"},{"phase":"Build-Out","weeks":14,"tasks":"Construction, equipment installation, signage"},{"phase":"Final Inspections","weeks":4,"tasks":"Fire marshal, health/safety, CO, industry regulator"},{"phase":"Staffing & Training","weeks":4,"tasks":"Hire, train, certify staff per ${ind.compliance}"},{"phase":"Soft Open","weeks":2,"tasks":"Marketing, grand opening"}]}`;
  try {
    let d=await claudeJSON(sys,usr);
    if(!d) { console.warn('Agent 5 fallback'); d=getFallback5(); }
    R.a5=d;
    $('5-s-t').textContent=d.summary+(d.decal_url?'\n\nRegulatory portal: '+d.decal_url:'');
    let tbl=`<table class="tbl"><thead><tr><th>Category</th><th>Requirement</th><th>Detail</th><th>Timeline</th><th>Cost</th><th>Source</th><th>Priority</th></tr></thead><tbody>`;
    (d.requirements||[]).forEach(r=>{
      const pb=r.priority==='Critical'?'b-red':r.priority==='High'?'b-amber':'b-blue';
      tbl+=`<tr><td><span class="badge b-blue">${r.category}</span></td><td><strong>${r.item}</strong></td><td style="font-size:11px;color:var(--muted)">${r.detail}</td><td>${r.timeline_weeks>0?r.timeline_weeks+' wks':'—'}</td><td>${r.cost_usd>0?'$'+r.cost_usd.toLocaleString():'—'}</td><td style="font-size:10px;color:var(--faint)">${r.source||''}</td><td><span class="badge ${pb}">${r.priority}</span></td></tr>`;
    });
    tbl+=`</tbody></table>`;
    $('5-t-c').innerHTML=tbl;
    killChart('ch-5');
    const ctx=$('ch-5').getContext('2d');
    charts['ch-5']=new Chart(ctx,{type:'bar',data:{
      labels:(d.timeline_phases||[]).map(p=>p.phase),
      datasets:[{label:'Weeks',data:(d.timeline_phases||[]).map(p=>p.weeks),backgroundColor:['rgba(74,158,255,0.7)','rgba(61,214,140,0.7)','rgba(245,166,35,0.7)','rgba(167,139,250,0.7)','rgba(45,212,191,0.7)','rgba(255,95,95,0.7)','rgba(74,158,255,0.5)'],borderWidth:0,borderRadius:4}]
    },options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>` ${c.raw} weeks — ${d.timeline_phases[c.dataIndex].tasks}`}}},scales:{x:{ticks:{color:'#8a8d96'},grid:{color:'#2a2d35'}},y:{ticks:{color:'#8a8d96',font:{size:10}},grid:{color:'#2a2d35'}}}}});
    setDot(5,'done'); showOut(5);
    return JSON.stringify(d);
  } catch(e){setDot(5,'error');showOut(5);$('5-s-t').textContent='Error: '+e.message;throw e}
}

// ══════════════════════════════════════════════════════════
// AGENT 6 — Competitor Analysis (Live Search)
// ══════════════════════════════════════════════════════════
