async function runAgent6() {
  setDot(6,'running');
  const ind=industry();
  const sys=`You are a market analyst specializing in competitive intelligence for ${ind.units}. Use Google Maps, Yelp, state licensing databases, and industry association data. Respond with ONLY a valid JSON object — no prose before or after.`;
  const usr=`Search for ALL existing ${ind.units} within ${radius()} miles of ZIP ${zip()}. Key competitors: ${ind.competitors}.

Search sources to use:
1. Google Maps: "${ind.unit} near ${zip()}" — find actual business names, addresses, ratings
2. Yelp: search ${ind.units} in each city
3. State licensing database / CAPS / CCLD / similar
4. Industry association directories
5. "${ind.unit} reviews [city name]"

For each city, find the ACTUAL names and addresses of competitors. Include gap_score_explanation (WHY this gap score — e.g. "8/10 because only 3 centers serve 2,800 children under 5").

Return ONLY this JSON:
{"summary":"4-sentence competitive landscape citing specific numbers and sources","total_licensed_estimated":40,"data_sources":["Google Maps search","State CAPS database","Yelp"],"cities":[{"city":"City A","center_count":8,"avg_monthly_infant":0,"avg_monthly_preschool":0,"avg_rating":4.1,"capacity_utilization_pct":88,"waitlist_common":false,"gap_score":7,"gap_score_explanation":"Gap score 7/10: 8 centers serving estimated 3,400 children under 5 (Census ACS 2022). Utilization 88% with waitlists at 3 of 8 centers. Market is underserved but not critical.","centers":[{"name":"Bright Horizons Suwanee","address":"123 Main St, City A","rating":4.3,"type":"Chain","monthly_rate_est":1900,"google_maps_url":"https://maps.google.com/?q=Bright+Horizons+Suwanee+GA","notes":"120 capacity, waitlist 6 weeks"},{"name":"KinderCare City A","address":"456 Oak Ave, City A","rating":4.0,"type":"Chain","monthly_rate_est":1750,"google_maps_url":"https://maps.google.com/?q=KinderCare+City+A+GA","notes":"90 capacity, currently full"}]},{"city":"City B","center_count":3,"avg_monthly_infant":0,"avg_monthly_preschool":0,"avg_rating":4.3,"capacity_utilization_pct":94,"waitlist_common":true,"gap_score":9,"gap_score_explanation":"Gap score 9/10: only 3 centers for 2,200 children under 5. 94% utilization and all centers report 8+ week waitlists. Critical underservice.","centers":[{"name":"Happy Kids Academy","address":"789 Pine Rd, City B","rating":4.4,"type":"Independent","monthly_rate_est":1650,"google_maps_url":"https://maps.google.com/?q=Happy+Kids+Academy+City+B","notes":"75 capacity, 10-week waitlist"}]}],"top_chains":[{"name":"Competitor A","locations_in_area":4,"monthly_tuition_range":"$1,600–$2,100","rating":4.1,"type":"Chain","market_share_pct":22},{"name":"Competitor B","locations_in_area":2,"monthly_tuition_range":"$1,400–$1,800","rating":3.8,"type":"Independent","market_share_pct":8}]}

Replace ALL example values with real search data for ZIP ${zip()}. Use avg_monthly_infant and avg_monthly_preschool as the primary and secondary revenue price points. Revenue model: ${ind.revenue_unit}.`;
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
    const _comp6data = d; // capture for click handler
    charts['ch-6']=new Chart(ctx,{type:'bar',data:{
      labels:cities6.map(c=>c.city),
      datasets:[
        {label:'Centers',data:cities6.map(c=>c.center_count),backgroundColor:'rgba(255,95,95,0.7)',borderWidth:0,borderRadius:3,yAxisID:'y'},
        {label:'Gap Score /10',data:cities6.map(c=>c.gap_score),backgroundColor:'rgba(61,214,140,0.7)',borderWidth:0,borderRadius:3,yAxisID:'y2'}
      ]
    },options:{responsive:true,maintainAspectRatio:false,
      plugins:{
        legend:{labels:{color:'#8a8d96',font:{size:11}}},
        tooltip:{callbacks:{footer:(items)=>{const c=cities6[items[0].dataIndex];return c?'↗ Click bar for center details':''}}}
      },
      onClick:(evt,elements)=>{
        if(elements&&elements.length>0){
          const idx=elements[0].index;
          window._comp6cities=cities6;
          window._comp6full=_comp6data;
          openCompCityDetail(idx);
        }
      },
      scales:{x:{ticks:{color:'#8a8d96',font:{size:9}},grid:{color:'#2a2d35'}},y:{ticks:{color:'#ff5f5f'},grid:{color:'#2a2d35'},position:'left',title:{display:true,text:'# Centers (click bar)',color:'#ff5f5f'}},y2:{ticks:{color:'#3dd68c'},grid:{display:false},position:'right',min:0,max:10,title:{display:true,text:'Gap Score',color:'#3dd68c'}}}
    }});
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

// ── Competitive Intel: drill-down on chart bar click ────────
function openCompCityDetail(idx) {
  const cities = window._comp6cities || [];
  const full   = window._comp6full   || {};
  const c = cities[idx];
  if (!c) return;
  const ind6 = industry();

  const gapColor = c.gap_score >= 8 ? 'var(--green)' : c.gap_score >= 6 ? 'var(--amber)' : 'var(--red)';
  const centersHtml = (c.centers || []).map(center =>
    `<div class="comp-center-card">
      <div class="comp-center-top">
        <div class="comp-center-name">${center.name || 'Unknown'}</div>
        <div class="comp-center-rating">${center.rating ? center.rating + '★' : '—'}</div>
      </div>
      <div class="comp-center-detail">
        📍 ${center.address || '—'}<br>
        💰 Est. ${ind6.price_label_primary}: $${(center.monthly_rate_est||0).toLocaleString()}/mo
        · Type: ${center.type || '—'}<br>
        ${center.notes ? '📝 ' + center.notes : ''}
      </div>
      ${center.google_maps_url ? `<a href="${center.google_maps_url}" target="_blank" class="link-btn" style="margin-top:8px;font-size:11px">↗ Google Maps</a>` : ''}
    </div>`
  ).join('');

  const noCentersMsg = c.centers && c.centers.length ? '' :
    `<div style="font-size:12px;color:var(--muted);padding:12px 0">Individual center data not available. Search Google Maps for "${ind6.unit} in ${c.city}" for a live list.</div>`;

  if (!document.getElementById('compCityOverlay')) {
    const ov = document.createElement('div');
    ov.id = 'compCityOverlay';
    ov.className = 'comp-city-overlay';
    ov.onclick = function(e){ if(e.target===ov) closeCompCityDetail(); };
    document.body.appendChild(ov);
  }
  const ov = document.getElementById('compCityOverlay');
  ov.innerHTML = `
    <div class="comp-city-panel">
      <button class="comp-city-close" onclick="closeCompCityDetail()">✕</button>
      <div style="font-size:22px;font-weight:700;font-family:'Syne',sans-serif;margin-bottom:4px">${c.city}</div>
      <div style="font-size:11px;color:var(--muted);margin-bottom:14px">${c.center_count} ${ind6.units} · Avg Rating ${c.avg_rating}★ · Utilization ${c.capacity_utilization_pct}%</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:16px">
        <div class="gdp-item"><div class="gdp-label">Gap Score</div><div class="gdp-val" style="color:${gapColor}">${c.gap_score}/10</div></div>
        <div class="gdp-item"><div class="gdp-label">${ind6.price_label_primary}</div><div class="gdp-val">$${(c.avg_monthly_infant||0).toLocaleString()}</div></div>
        <div class="gdp-item"><div class="gdp-label">Waitlist</div><div class="gdp-val">${c.waitlist_common ? '🔴 Yes' : '🟢 No'}</div></div>
      </div>
      ${c.gap_score_explanation ? `<div class="comp-gap-box">💡 ${c.gap_score_explanation}</div>` : ''}
      <div style="font-size:12px;font-weight:700;font-family:'Syne',sans-serif;margin:12px 0 8px">
        Known ${ind6.units} in this area (${(c.centers||[]).length} found):
      </div>
      ${centersHtml}${noCentersMsg}
      ${full.data_sources ? `<div style="font-size:10px;color:var(--faint);margin-top:12px;padding-top:10px;border-top:1px solid var(--border)">📚 Sources: ${full.data_sources.join(' · ')}</div>` : ''}
    </div>`;
  ov.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCompCityDetail() {
  const ov = document.getElementById('compCityOverlay');
  if (ov) { ov.classList.remove('open'); document.body.style.overflow = ''; }
}

// ══════════════════════════════════════════════════════════
// AGENT 2 — Gap Analysis
// ══════════════════════════════════════════════════════════
