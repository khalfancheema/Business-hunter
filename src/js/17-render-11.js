async function runAgent11(a1,a2,a4) {
  setDot(11,'running');
  const ind=industry();
  const sys=`You are a geographic data analyst. Respond with JSON only.`;
  const usr=`Build geographic mapping data for cities within ${radius()} miles of ZIP ${zip()} for a ${ind.unit} site analysis.
DEMOGRAPHICS: ${ctx(a1,['summary','cities'])}
GAP ANALYSIS: ${ctx(a2,['summary','cities','overall_opportunity_score'])}
REAL ESTATE: ${ctx(a4,['summary','listings','by_city_summary'])}
Return ONLY:
{"center":{"lat":34.0020,"lng":-84.1455,"label":"ZIP 30097 — Duluth, GA"},"cities":[{"name":"Suwanee","county":"Gwinnett","lat":34.0512,"lng":-84.0710,"gap_score":9,"demand_score":9,"supply_score":3,"unserved_children":580,"median_income":112000,"competitor_count":2,"priority":"Critical Opportunity","recommended_action":"Open Here #1","real_estate_url":"https://www.loopnet.com/search/commercial-real-estate/suwanee-ga/for-lease/"},{"name":"Sugar Hill","county":"Gwinnett","lat":34.1118,"lng":-84.0541,"gap_score":8,"demand_score":8,"supply_score":3,"unserved_children":420,"median_income":89000,"competitor_count":1,"priority":"High Opportunity","recommended_action":"Open Here #2","real_estate_url":"https://www.loopnet.com/search/commercial-real-estate/sugar-hill-ga/for-lease/"},{"name":"Johns Creek","county":"Fulton","lat":34.0289,"lng":-84.1986,"gap_score":7,"demand_score":9,"supply_score":5,"unserved_children":390,"median_income":125000,"competitor_count":4,"priority":"High Opportunity","recommended_action":"Open Here #3","real_estate_url":"https://www.crexi.com/lease/properties?address=Johns+Creek%2C+GA"},{"name":"Buford","county":"Gwinnett","lat":34.1193,"lng":-83.9938,"gap_score":7,"demand_score":7,"supply_score":4,"unserved_children":310,"median_income":81000,"competitor_count":1,"priority":"High Opportunity","recommended_action":"Open Here #4","real_estate_url":"https://www.loopnet.com/search/commercial-real-estate/buford-ga/for-lease/"},{"name":"Cumming","county":"Forsyth","lat":34.2073,"lng":-84.1401,"gap_score":7,"demand_score":8,"supply_score":4,"unserved_children":350,"median_income":98000,"competitor_count":3,"priority":"Good Opportunity","recommended_action":"Consider #5","real_estate_url":"https://www.crexi.com/lease/properties?address=Cumming%2C+GA"},{"name":"Winder","county":"Barrow","lat":33.9937,"lng":-83.7196,"gap_score":9,"demand_score":8,"supply_score":2,"unserved_children":480,"median_income":52000,"competitor_count":1,"priority":"Critical — Underserved","recommended_action":"First-Mover Opportunity","real_estate_url":"https://www.loopnet.com/search/commercial-real-estate/winder-ga/for-lease/"},{"name":"Auburn","county":"Barrow","lat":34.0151,"lng":-83.8266,"gap_score":8,"demand_score":7,"supply_score":2,"unserved_children":310,"median_income":68000,"competitor_count":0,"priority":"High — Underserved","recommended_action":"Zero Competition","real_estate_url":"https://www.crexi.com/lease/properties?address=Auburn%2C+GA"},{"name":"Duluth","county":"Gwinnett","lat":34.0020,"lng":-84.1455,"gap_score":4,"demand_score":7,"supply_score":7,"unserved_children":160,"median_income":76000,"competitor_count":8,"priority":"Saturating","recommended_action":"Avoid — Competitive","real_estate_url":"https://www.loopnet.com/search/commercial-real-estate/duluth-ga/for-lease/"},{"name":"Lawrenceville","county":"Gwinnett","lat":33.9526,"lng":-83.9880,"gap_score":2,"demand_score":7,"supply_score":9,"unserved_children":80,"median_income":58000,"competitor_count":14,"priority":"Saturated","recommended_action":"Do Not Enter","real_estate_url":"https://www.loopnet.com/search/commercial-real-estate/lawrenceville-ga/for-lease/"},{"name":"Norcross","county":"Gwinnett","lat":33.9412,"lng":-84.2135,"gap_score":2,"demand_score":6,"supply_score":8,"unserved_children":70,"median_income":52000,"competitor_count":12,"priority":"Saturated","recommended_action":"Do Not Enter","real_estate_url":"https://www.loopnet.com/search/commercial-real-estate/norcross-ga/for-lease/"},{"name":"Alpharetta","county":"Fulton","lat":34.0754,"lng":-84.2941,"gap_score":5,"demand_score":8,"supply_score":6,"unserved_children":200,"median_income":120000,"competitor_count":7,"priority":"Moderate","recommended_action":"Premium niche possible","real_estate_url":"https://www.loopnet.com/search/commercial-real-estate/alpharetta-ga/for-lease/"}],"real_estate_pins":[{"label":"Suwanee – Peachtree Pkwy","lat":34.0480,"lng":-84.0690,"rent":13800,"sqft":8400,"url":"https://www.loopnet.com/search/commercial-real-estate/suwanee-ga/for-lease/"},{"label":"Sugar Hill – PI Blvd","lat":34.1090,"lng":-84.0520,"rent":9200,"sqft":7200,"url":"https://www.loopnet.com/search/commercial-real-estate/sugar-hill-ga/for-lease/"},{"label":"Buford – Hamilton Mill","lat":34.1170,"lng":-83.9910,"rent":8400,"sqft":6900,"url":"https://www.bizbuysell.com/georgia/child-care-businesses-for-sale/"},{"label":"Winder – Athens Hwy","lat":33.9910,"lng":-83.7210,"rent":5800,"sqft":6500,"url":"https://www.loopnet.com/search/commercial-real-estate/winder-ga/for-lease/"},{"label":"Auburn – Hwy 316","lat":34.0130,"lng":-83.8280,"rent":5200,"sqft":6200,"url":"https://www.crexi.com/lease/properties?address=Auburn%2C+GA"}],"directions":[{"from":"ZIP 30097 (Duluth)","to":"Suwanee Town Center","drive_mins":12,"miles":8.2,"google_url":"https://maps.google.com/?saddr=Duluth+GA+30097&daddr=Suwanee+Town+Center+Suwanee+GA"},{"from":"ZIP 30097 (Duluth)","to":"Sugar Hill City Hall","drive_mins":18,"miles":11.4,"google_url":"https://maps.google.com/?saddr=Duluth+GA+30097&daddr=Sugar+Hill+GA+30518"},{"from":"ZIP 30097 (Duluth)","to":"Johns Creek","drive_mins":14,"miles":9.8,"google_url":"https://maps.google.com/?saddr=Duluth+GA+30097&daddr=Johns+Creek+GA+30022"},{"from":"ZIP 30097 (Duluth)","to":"Buford / Hamilton Mill","drive_mins":22,"miles":14.1,"google_url":"https://maps.google.com/?saddr=Duluth+GA+30097&daddr=Hamilton+Mill+Buford+GA+30519"},{"from":"ZIP 30097 (Duluth)","to":"Winder, Barrow County","drive_mins":38,"miles":29.4,"google_url":"https://maps.google.com/?saddr=Duluth+GA+30097&daddr=Winder+GA+30680"},{"from":"ZIP 30097 (Duluth)","to":"Auburn, Barrow County","drive_mins":32,"miles":23.6,"google_url":"https://maps.google.com/?saddr=Duluth+GA+30097&daddr=Auburn+GA+30011"}]}`;
  try {
    let d=await claudeJSON(sys,usr);
    if(!d) { console.warn('Agent 11 fallback'); d=getFallback11(); }
    R.a11=d;
    buildMap(d);
    buildMapLegend(d);
    buildDirections(d);
    setDot(11,'done'); showOut(11);
    return JSON.stringify(d);
  } catch(e){setDot(11,'error');showOut(11);$('11-map-c').innerHTML=`<div class="prose" style="color:var(--red)">Error: ${e.message}</div>`;throw e}
}

function gapCol(s){return s>=9?'#3dd68c':s>=7?'#f5a623':s>=5?'#4a9eff':s>=3?'#a78bfa':'#ff5f5f';}
function gapBadge(s){return s>=9?'b-green':s>=7?'b-amber':s>=5?'b-blue':s>=3?'b-purple':'b-red';}

function buildMap(d) {
  const cities=d.cities;
  const lats=cities.map(c=>c.lat), lngs=cities.map(c=>c.lng);
  const minLat=Math.min(...lats)-0.08, maxLat=Math.max(...lats)+0.08;
  const minLng=Math.min(...lngs)-0.08, maxLng=Math.max(...lngs)+0.08;
  const W=880, H=490;
  function px(lng){return ((lng-minLng)/(maxLng-minLng)*(W-80)+40).toFixed(1);}
  function py(lat){return (((maxLat-lat)/(maxLat-minLat))*(H-60)+30).toFixed(1);}

  let svg=`<div style="position:relative;width:100%;height:${H}px;border-radius:10px;overflow:hidden;background:#1a1d22;border:1px solid var(--border)">
  <svg width="100%" height="100%" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" fill="#1a1d22"/>
    <g stroke="#2a2d35" stroke-width="0.5" opacity="0.4">`;
  for(let i=0;i<=8;i++) svg+=`<line x1="${40+i*100}" y1="20" x2="${40+i*100}" y2="${H-20}"/>`;
  for(let i=0;i<=4;i++) svg+=`<line x1="30" y1="${30+i*108}" x2="${W-20}" y2="${30+i*108}"/>`;
  svg+=`</g>`;
  const hx=px(d.center.lng), hy=py(d.center.lat);
  svg+=`<ellipse cx="${hx}" cy="${hy}" rx="270" ry="215" fill="none" stroke="#4a9eff" stroke-width="1.2" stroke-dasharray="6,5" opacity="0.25"/>
  <text x="${hx}" y="${parseFloat(hy)-222}" fill="#4a9eff" font-size="10" text-anchor="middle" opacity="0.4" font-family="sans-serif">40-mile radius</text>`;

  // RE pins first (background layer)
  (d.real_estate_pins||[]).forEach(pin=>{
    const bx=px(pin.lng), by=py(pin.lat);
    svg+=`<g style="cursor:pointer" onclick="window.open('${pin.url}','_blank')" title="${pin.label} — $${pin.rent.toLocaleString()}/mo">
      <rect x="${parseFloat(bx)-9}" y="${parseFloat(by)-9}" width="18" height="18" rx="3" fill="#0f2a45" stroke="#4a9eff" stroke-width="1.5"/>
      <text x="${bx}" y="${parseFloat(by)+5}" font-size="11" text-anchor="middle" fill="#4a9eff">🏢</text>
    </g>`;
  });

  // City circles
  cities.forEach(city=>{
    const cx=px(city.lng), cy=py(city.lat);
    const col=gapCol(city.gap_score);
    const r=Math.max(16,Math.min(30,12+city.unserved_children/22));
    const nameShort=city.name.split(' ')[0];
    svg+=`<g style="cursor:pointer"
      onmouseover="mTip(event,'${city.name}','${city.county} County','${city.gap_score}/10','${city.priority}','$${Math.round(city.median_income/1000)}k income','${city.unserved_children} unserved','${city.competitor_count} competitors','${city.recommended_action}')"
      onmouseout="mHide()"
      onclick="window.open('${city.real_estate_url}','_blank')">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${col}" opacity="0.18"/>
      <circle cx="${cx}" cy="${cy}" r="${r*0.58}" fill="${col}" opacity="0.9"/>
      <text x="${cx}" y="${parseFloat(cy)+4}" font-size="${city.gap_score>=8?12:10}" font-weight="700" text-anchor="middle" fill="#000" font-family="'Syne',sans-serif">${city.gap_score}</text>
      <text x="${cx}" y="${parseFloat(cy)+r+13}" font-size="9" text-anchor="middle" fill="${col}" font-family="'Syne',sans-serif" font-weight="600">${nameShort}</text>
    </g>`;
  });

  // Home pin
  svg+=`<g>
    <circle cx="${hx}" cy="${hy}" r="9" fill="#f0f0ee" stroke="#4a9eff" stroke-width="2.5"/>
    <text x="${hx}" y="${parseFloat(hy)+5}" font-size="10" text-anchor="middle" fill="#0e0f11" font-weight="900" font-family="sans-serif">★</text>
    <text x="${hx}" y="${parseFloat(hy)+23}" font-size="9" text-anchor="middle" fill="#f0f0ee" font-family="sans-serif">30097</text>
  </g>`;

  svg+=`</svg>
  <div id="mTipEl" style="position:absolute;background:#16181c;border:1px solid #363a44;border-radius:8px;padding:10px 13px;font-size:12px;display:none;z-index:10;min-width:210px;pointer-events:none;box-shadow:0 4px 24px rgba(0,0,0,.5)"></div>
  </div>`;

  svg+=`<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px;font-size:11px;color:var(--muted)">
    <span style="font-weight:700;color:var(--muted);font-family:'Syne',sans-serif">Gap Score:</span>
    ${[['#3dd68c','9-10 Critical'],['#f5a623','7-8 High'],['#4a9eff','5-6 Moderate'],['#a78bfa','3-4 Low'],['#ff5f5f','1-2 Avoid']].map(([c,l])=>`<span style="display:inline-flex;align-items:center;gap:5px"><span style="width:11px;height:11px;border-radius:50%;background:${c};display:inline-block"></span>${l}</span>`).join('')}
    <span style="display:inline-flex;align-items:center;gap:5px"><span style="width:11px;height:11px;border-radius:2px;background:#0f2a45;border:1px solid #4a9eff;display:inline-block"></span>🏢 RE Listing</span>
    <span style="display:inline-flex;align-items:center;gap:5px"><span style="width:11px;height:11px;border-radius:50%;background:#f0f0ee;border:2px solid #4a9eff;display:inline-block"></span>★ Home ZIP</span>
  </div>
  <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
    <a href="https://maps.google.com/maps?q=${encodeURIComponent(industry().unit)}+near+${zip()}" target="_blank" class="link-btn primary-btn">↗ Google Maps</a>
    <a href="https://www.loopnet.com/search/commercial-real-estate/${zip()}/for-lease/" target="_blank" class="link-btn">↗ LoopNet Listings</a>
    <a href="https://www.crexi.com/lease/properties?address=${zip()}" target="_blank" class="link-btn">↗ Crexi Listings</a>
    <a href="https://www.bizbuysell.com/search/" target="_blank" class="link-btn">↗ BizBuySell</a>
  </div>`;
  $('11-map-c').innerHTML=svg;
}

function mTip(e,name,county,gap,priority,income,unserved,competitors,action){
  const t=$('mTipEl');
  if(!t)return;
  const col=gap.startsWith('9')||gap.startsWith('8')?'#3dd68c':gap.startsWith('7')?'#f5a623':'#ff5f5f';
  t.innerHTML=`<div style="font-size:13px;font-weight:700;font-family:'Syne',sans-serif;margin-bottom:5px">${name}</div>
    <div style="font-size:11px;color:#8a8d96;margin-bottom:8px">${county}</div>
    <div style="display:grid;gap:3px;font-size:11px">
      <div style="display:flex;justify-content:space-between"><span style="color:#8a8d96">Gap Score</span><strong style="color:${col}">${gap}</strong></div>
      <div style="display:flex;justify-content:space-between"><span style="color:#8a8d96">Priority</span><strong>${priority}</strong></div>
      <div style="display:flex;justify-content:space-between"><span style="color:#8a8d96">Income</span><strong>${income}</strong></div>
      <div style="display:flex;justify-content:space-between"><span style="color:#8a8d96">Unserved</span><strong>${unserved}</strong></div>
      <div style="display:flex;justify-content:space-between"><span style="color:#8a8d96">Competitors</span><strong>${competitors}</strong></div>
    </div>
    <div style="margin-top:7px;padding:4px 8px;background:#1a3a5c;border-radius:5px;font-size:11px;font-weight:700;font-family:'Syne',sans-serif;color:#4a9eff">${action}</div>
    <div style="font-size:10px;color:#4a4d56;margin-top:4px">Click to open listings ↗</div>`;
  const rect=t.parentElement.getBoundingClientRect();
  const ex=e.clientX-rect.left+12, ey=e.clientY-rect.top+12;
  t.style.left=Math.min(ex,rect.width-230)+'px';
  t.style.top=Math.min(ey,rect.height-200)+'px';
  t.style.display='block';
}
function mHide(){const t=$('mTipEl');if(t)t.style.display='none';}

function buildMapLegend(d) {
  let html=`<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Rank</th><th>City</th><th>County</th><th>Gap Score</th><th>Priority</th><th>Unserved</th><th>Median Income</th><th>Competitors</th><th>Recommendation</th><th>Listings</th></tr></thead><tbody>`;
  [...(d.cities||[])].sort((a,b)=>b.gap_score-a.gap_score).forEach((c,i)=>{
    html+=`<tr>
      <td><strong style="color:var(--blue)">#${i+1}</strong></td>
      <td><strong>${c.name}</strong></td>
      <td style="font-size:11px;color:var(--muted)">${c.county}</td>
      <td><span class="badge ${gapBadge(c.gap_score)}">${c.gap_score}/10</span></td>
      <td style="font-size:11px">${c.priority}</td>
      <td>${(c.unserved_children||0).toLocaleString()}</td>
      <td>$${((c.median_income||0)/1000).toFixed(0)}k</td>
      <td>${c.competitor_count}</td>
      <td style="font-size:11px;color:var(--green);font-weight:600">${c.recommended_action}</td>
      <td><a href="${c.real_estate_url}" target="_blank" class="link-btn primary-btn" style="font-size:10px;padding:3px 7px">↗</a></td>
    </tr>`;
  });
  html+=`</tbody></table></div>`;
  $('11-leg-c').innerHTML=html;
}

function buildDirections(d) {
  let html=`<div style="margin-bottom:10px;font-size:13px;color:var(--muted)">Drive times from ZIP ${zip()} to each key market:</div><div style="display:grid;gap:8px">`;
  (d.directions||[]).forEach(dir=>{
    html+=`<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--surface2);border-radius:8px;border:1px solid var(--border)">
      <div style="font-size:22px;font-weight:700;font-family:'Syne',sans-serif;color:var(--blue);width:58px;text-align:center;flex-shrink:0">${dir.drive_mins}<span style="font-size:11px;font-weight:400">min</span></div>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:600;font-family:'Syne',sans-serif">${dir.to}</div>
        <div style="font-size:11px;color:var(--muted)">${dir.from} · ${dir.miles} miles</div>
      </div>
      <a href="${dir.google_url}" target="_blank" class="link-btn primary-btn" style="font-size:11px;flex-shrink:0">↗ Google Maps</a>
    </div>`;
  });
  html+=`</div>`;
  $('11-dir-c').innerHTML=html;
}

// ══════════════════════════════════════════════════════════
// GRANT SEARCH AGENT (Agent 12)
// ══════════════════════════════════════════════════════════
