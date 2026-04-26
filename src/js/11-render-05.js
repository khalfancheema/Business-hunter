async function runAgent3(a1,a2,a5) {
  setDot(3,'running');
  const ind=industry();
  const sys=`You are a ${ind.unit} site selection consultant with deep knowledge of demographics, zoning, and real estate. You cite specific data sources. Respond JSON only.`;
  const usr=`Recommend the top 5 specific locations for a ${ind.unit} (${ind.capacity_label}: ${capacity()}, budget $${parseInt(budget()).toLocaleString()}) within ${radius()} miles of ZIP ${zip()}.

DEMOGRAPHICS: ${ctx(a1,['summary','cities'])}
GAP ANALYSIS: ${ctx(a2,['summary','cities','overall_opportunity_score'])}
REGULATORY: ${ctx(a5,['summary','requirements','timeline_phases'])}

Return ONLY:
{
  "summary": "5-sentence site selection strategy",
  "locations": [
    {
      "rank":1,"city":"Suwanee","submarket":"Suwanee Town Center / Peachtree Pkwy corridor",
      "overall_score":92,
      "scores":{"demand":94,"competition":88,"demographics":96,"real_estate":82,"regulatory":90,"walkability":45,"transit":22,"schools":78},
      "capacity_recommended":90,"target_infant_tuition":2050,"target_preschool_tuition":1650,
      "risk":"Low","timeline_months":14,
      "children_under5_nearby":3900,"competitors_within_2mi":2,
      "sqft_needed":8000,"est_monthly_rent_range":"$11,000-$14,000",
      "ideal_property_type":"Freestanding commercial, end-cap retail, or former restaurant",
      "zoning_needed":"C-1 or C-2",
      "pros":["Fastest-growing ZIP in Gwinnett","Premium income demographics","Only 2 competitors within 2 miles","Strong town center foot traffic"],
      "cons":["Higher lease rates","Land becoming scarce","Premium build-out expectations"],
      "reasoning":"Ranked #1 because Census ACS 2022 shows 3,900 children under 5 within 2 miles (highest in search area) against only 2 licensed competitors with combined capacity of ~180. Median household income of $112,000 supports premium tuition. Suwanee is the fastest-growing ZIP in Gwinnett County (7.2% 5yr growth per Census). The Peachtree Pkwy corridor has 28,000+ daily traffic count and mixed-use zoning actively welcomes childcare tenants. Risk is Low because zoning is already permitted use and the city has a proactive business licensing office.",
      "walk_score": 45,
      "walk_score_label": "Car-Dependent",
      "transit_score": 22,
      "transit_description": "GRTA Xpress bus 1.2mi; no rail",
      "nearest_school_name": "Roberts Elementary",
      "nearest_school_rating": 9,
      "nearest_school_distance_mi": 0.8,
      "school_avg_rating_2mi": 8.2,
      "reasoning_sources":["US Census Bureau ACS 2022 (B01001, B19013)","Georgia CAPS licensing database","Google Maps competitor search","Gwinnett County GIS traffic data","Suwanee City business development office"]
    },
    {
      "rank":2,"city":"Sugar Hill","submarket":"Sugar Hill Town Center / Ga-20 corridor",
      "overall_score":87,
      "scores":{"demand":88,"competition":90,"demographics":84,"real_estate":86,"regulatory":88},
      "capacity_recommended":75,"target_infant_tuition":1900,"target_preschool_tuition":1500,
      "risk":"Low-Medium","timeline_months":13,
      "children_under5_nearby":2200,"competitors_within_2mi":1,
      "sqft_needed":7000,"est_monthly_rent_range":"$8,000-$10,500",
      "ideal_property_type":"Retail strip, flex space, new mixed-use development",
      "zoning_needed":"C-1 or PUD",
      "pros":["City actively recruiting family amenities","Lowest competition in the corridor","New residential development drives demand"],
      "cons":["Smaller existing population base","Newer, unproven market"]
    },
    {
      "rank":3,"city":"Johns Creek","submarket":"State Bridge / McGinnis Ferry corridor",
      "overall_score":84,
      "scores":{"demand":88,"competition":78,"demographics":96,"real_estate":74,"regulatory":88},
      "capacity_recommended":80,"target_infant_tuition":2200,"target_preschool_tuition":1800,
      "risk":"Medium","timeline_months":16,
      "children_under5_nearby":4800,"competitors_within_2mi":4,
      "sqft_needed":7500,"est_monthly_rent_range":"$10,500-$13,500",
      "ideal_property_type":"Office conversion, freestanding retail",
      "zoning_needed":"O-I or C-1",
      "pros":["Highest income demographics in area","Premium tuition possible","Large population base"],
      "cons":["More established competition","Higher lease rates","Fulton County regulations slightly stricter"]
    },
    {
      "rank":4,"city":"Buford","submarket":"Hamilton Mill / Bona Rd corridor",
      "overall_score":80,
      "scores":{"demand":82,"competition":90,"demographics":76,"real_estate":88,"regulatory":85},
      "capacity_recommended":75,"target_infant_tuition":1750,"target_preschool_tuition":1380,
      "risk":"Medium","timeline_months":12,
      "children_under5_nearby":2500,"competitors_within_2mi":1,
      "sqft_needed":6800,"est_monthly_rent_range":"$7,500-$9,500",
      "ideal_property_type":"Strip mall end-cap, freestanding, church conversion",
      "zoning_needed":"C-1 or C-2",
      "pros":["Very low competition","Most affordable rents","Gwinnett's fastest-growing residential pocket"],
      "cons":["Lower income than Suwanee/JC","Smaller current population","Fewer walk-in amenities"]
    },
    {
      "rank":5,"city":"Cumming","submarket":"GA-400 / Keith Bridge Rd corridor",
      "overall_score":77,
      "scores":{"demand":82,"competition":80,"demographics":80,"real_estate":78,"regulatory":75},
      "capacity_recommended":70,"target_infant_tuition":1850,"target_preschool_tuition":1480,
      "risk":"Medium","timeline_months":15,
      "children_under5_nearby":3100,"competitors_within_2mi":3,
      "sqft_needed":6500,"est_monthly_rent_range":"$8,500-$11,000",
      "ideal_property_type":"Retail, flex, professional office conversion",
      "zoning_needed":"C-1 (Forsyth County)",
      "pros":["Forsyth County boom market","Strong income growth","Willing to pay for quality"],
      "cons":["Different county regulations (Forsyth)","Separate licensing jurisdiction","Slightly longer commute from base"]
    },
    {
      "rank":6,"city":"Winder / Auburn","submarket":"Barrow County – Hwy 316 / Athens Hwy corridor",
      "overall_score":74,
      "scores":{"demand":85,"competition":96,"demographics":62,"real_estate":90,"regulatory":72},
      "capacity_recommended":65,"target_infant_tuition":1400,"target_preschool_tuition":1100,
      "risk":"Medium","timeline_months":13,
      "children_under5_nearby":2400,"competitors_within_2mi":1,
      "sqft_needed":6200,"est_monthly_rent_range":"$5,500-$7,500",
      "ideal_property_type":"Freestanding retail, former bank or restaurant, strip anchor",
      "zoning_needed":"C-1 or R-C (Barrow County)",
      "pros":["Extremely underserved — only 4-6 licensed centers in entire county","Lowest rents in the metro area","Fastest population growth rate (22%+ in Auburn)","First-mover advantage in a high-growth corridor"],
      "cons":["Lower income demographics than Gwinnett","Separate Barrow County zoning and permitting process","Smaller existing population base","Less brand recognition for premium childcare"]
    }
  ]
}`;
  try {
    _setDemoKey(3);
    let d=await claudeJSON(sys,usr);
    if(!d) { console.warn('Agent 3 fallback'); d=getFallback3(); }
    R.a3=d;
    $('3-s-t').textContent=d.summary;
    // Option cards
    const ind3=industry();
    const colors=['var(--green)','var(--blue)','var(--amber)','var(--purple)','var(--teal)','var(--pink)'];
    let cards=`<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px">`;
    (d.locations||[]).forEach((loc,i)=>{
      const pRate=(loc.target_infant_tuition||loc.target_primary_rate||0).toLocaleString();
      const sRate=(loc.target_preschool_tuition||loc.target_secondary_rate||0).toLocaleString();
      const col=colors[i]||'var(--muted)';
      const rid=`loc-r-${i}`;
      const prosHtml=(loc.pros||[]).map(p=>`<div style="font-size:10px;color:var(--green);margin-bottom:2px;display:flex;gap:4px"><span>+</span><span>${p}</span></div>`).join('');
      const consHtml=(loc.cons||[]).map(p=>`<div style="font-size:10px;color:var(--red);margin-bottom:2px;display:flex;gap:4px"><span>−</span><span>${p}</span></div>`).join('');
      const sourcesHtml=loc.reasoning_sources?`<div class="reasoning-source">📚 ${loc.reasoning_sources.join(' · ')}</div>`:'';
      const reasoningHtml=loc.reasoning?`
        <div class="loc-reasoning-body" id="${rid}">
          <div class="reasoning-card" style="margin:0">
            <div class="reasoning-title">💡 Why #${loc.rank}?</div>
            ${loc.reasoning.split(/\.\s+/).filter(s=>s.trim()).map(s=>`<div class="reasoning-item">${s.trim().replace(/\.$/,'')}.</div>`).join('')}
            ${sourcesHtml}
          </div>
        </div>
        <button class="loc-reasoning-toggle" onclick="(function(btn,id){const el=document.getElementById(id);el.classList.toggle('open');btn.textContent=el.classList.contains('open')?'▲ Hide Reasoning':'💡 Why #${loc.rank}? (show reasoning)';})(this,'${rid}')">💡 Why #${loc.rank}? (show reasoning)</button>
      `:''
      cards+=`<div class="loc-card">
        <div style="font-size:10px;font-weight:700;color:${col};font-family:'Syne',sans-serif;margin-bottom:4px">#${loc.rank} · ${loc.risk} Risk · ${loc.timeline_months} mo</div>
        <div style="font-size:15px;font-weight:700;font-family:'Syne',sans-serif;margin-bottom:1px">${loc.city}</div>
        <div style="font-size:11px;color:var(--muted);margin-bottom:10px">${loc.submarket}</div>
        <div style="font-size:30px;font-weight:700;font-family:'Syne',sans-serif;color:${col};margin-bottom:10px">${loc.overall_score}<span style="font-size:13px;color:var(--faint)">/100</span></div>
        <div style="display:grid;gap:4px;font-size:11px;margin-bottom:10px">
          <div style="display:flex;justify-content:space-between"><span style="color:var(--muted)">Capacity</span><strong>${loc.capacity_recommended}</strong></div>
          <div style="display:flex;justify-content:space-between"><span style="color:var(--muted)">${ind3.price_label_primary}</span><strong>$${pRate}/mo</strong></div>
          <div style="display:flex;justify-content:space-between"><span style="color:var(--muted)">${ind3.price_label_secondary}</span><strong>$${sRate}/mo</strong></div>
          <div style="display:flex;justify-content:space-between"><span style="color:var(--muted)">Est. rent</span><strong>${loc.est_monthly_rent_range}</strong></div>
          <div style="display:flex;justify-content:space-between"><span style="color:var(--muted)">Kids &lt;5 nearby</span><strong>${(loc.children_under5_nearby||0).toLocaleString()}</strong></div>
          <div style="display:flex;justify-content:space-between"><span style="color:var(--muted)">Competitors 2mi</span><strong>${loc.competitors_within_2mi}</strong></div>
        </div>
        <div style="margin-bottom:8px">${prosHtml}${consHtml}</div>
        ${(loc.walk_score!=null||loc.transit_score!=null||loc.nearest_school_rating!=null)?`
        <div class="location-ext-scores">
          ${loc.walk_score!=null?`<div class="loc-score-badge loc-score-walk"><div class="loc-score-badge-val">${loc.walk_score}</div><div class="loc-score-badge-lbl">Walk${loc.walk_score_label?'<br><span style="font-size:8px">'+loc.walk_score_label+'</span>':''}</div></div>`:''}
          ${loc.transit_score!=null?`<div class="loc-score-badge loc-score-transit"><div class="loc-score-badge-val">${loc.transit_score}</div><div class="loc-score-badge-lbl">Transit</div></div>`:''}
          ${loc.nearest_school_rating!=null?`<div class="loc-score-badge loc-score-school" title="${loc.nearest_school_name||''} (${loc.nearest_school_distance_mi||'?'}mi)"><div class="loc-score-badge-val">${loc.nearest_school_rating}/10</div><div class="loc-score-badge-lbl">School</div></div>`:''}
        </div>`:''}
        ${reasoningHtml}
      </div>`;
    });
    cards+=`</div>`;
    $('3-r-c').innerHTML=cards;
    // Chart — radar on desktop, horizontal bar on mobile
    killChart('ch-3');
    const ctx=$('ch-3').getContext('2d');
    const dims=['demand','competition','demographics','real_estate','regulatory'];
    const isMobile = window.innerWidth < 500;
    if (isMobile) {
      // Horizontal bar: one dataset per location showing overall_score, stacked by dim
      const colors=['#4a9eff','#3dd68c','#f5a623','#a78bfa','#2dd4bf'];
      charts['ch-3']=new Chart(ctx,{type:'bar',data:{
        labels:['Demand','Competition','Demographics','Real Estate','Regulatory'],
        datasets:(d.locations||[]).slice(0,3).map((loc,i)=>({
          label:loc.city,
          data:dims.map(k=>loc.scores[k]||0),
          backgroundColor:colors[i]+'cc',
          borderWidth:0,borderRadius:3
        }))
      },options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:'#8a8d96',font:{size:10}}}},scales:{x:{ticks:{color:'#8a8d96'},grid:{color:'#2a2d35'},min:0,max:100},y:{ticks:{color:'#8a8d96',font:{size:9}},grid:{color:'#2a2d35'}}}}});
    } else {
      charts['ch-3']=new Chart(ctx,{type:'radar',data:{
        labels:['Demand','Competition','Demographics','Real Estate','Regulatory'],
        datasets:(d.locations||[]).map((loc,i)=>({
          label:loc.city,
          data:dims.map(k=>loc.scores[k]),
          borderColor:['#4a9eff','#3dd68c','#f5a623','#a78bfa','#2dd4bf'][i],
          backgroundColor:['rgba(74,158,255,0.08)','rgba(61,214,140,0.08)','rgba(245,166,35,0.08)','rgba(167,139,250,0.08)','rgba(45,212,191,0.08)'][i],
          borderWidth:2,pointRadius:3
        }))
      },options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:'#8a8d96',font:{size:11}}}},scales:{r:{ticks:{color:'#8a8d96',backdropColor:'transparent'},grid:{color:'#2a2d35'},pointLabels:{color:'#8a8d96',font:{size:10}},min:60,max:100}}}});
    }
    // Comparison table
    let tbl=`<table class="tbl"><thead><tr><th>Rank</th><th>City / Submarket</th><th>Score</th><th>Sq Ft</th><th>Rent Range</th><th>${ind3.price_label_primary}</th><th>${ind3.price_label_secondary}</th><th>Competitors 2mi</th><th>Zoning</th><th>Risk</th><th>Timeline</th></tr></thead><tbody>`;
    (d.locations||[]).forEach(loc=>{
      const rb=(loc.risk||'').startsWith('Low')?'b-green':loc.risk==='Medium'?'b-amber':'b-red';
      const pRate=(loc.target_infant_tuition||loc.target_primary_rate||0).toLocaleString();
      const sRate=(loc.target_preschool_tuition||loc.target_secondary_rate||0).toLocaleString();
      tbl+=`<tr><td><strong>#${loc.rank}</strong></td><td><strong>${loc.city}</strong><br><span style="font-size:10px;color:var(--faint)">${loc.submarket}</span></td><td><span class="badge b-green">${loc.overall_score}</span></td><td>${(loc.sqft_needed||0).toLocaleString()}</td><td>${loc.est_monthly_rent_range}</td><td>$${pRate}</td><td>$${sRate}</td><td>${loc.competitors_within_2mi}</td><td>${loc.zoning_needed}</td><td><span class="badge ${rb}">${loc.risk}</span></td><td>${loc.timeline_months} mo</td></tr>`;
    });
    tbl+=`</tbody></table>`;
    $('3-t-c').innerHTML=tbl;
    setDot(3,'done'); showOut(3);
    return JSON.stringify(d);
  } catch(e){setDot(3,'error');showOut(3);$('3-s-t').textContent='Error: '+e.message;throw e}
}

// ══════════════════════════════════════════════════════════
// AGENT 4 — Real Estate (Live Search w/ Links)
// ══════════════════════════════════════════════════════════
