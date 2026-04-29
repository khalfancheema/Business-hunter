async function runAgent11(a1,a2,a4) {
  setDot(11,'running');
  const ind=industry();
  const sys=`You are a geographic data analyst. Respond with JSON only.`;
  const usr=`Build geographic mapping data for cities within ${radius()} miles of ZIP ${zip()} for a ${ind.unit} site analysis.
DEMOGRAPHICS: ${ctx(a1,['summary','cities'],1000)}
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
  const container = $('11-map-c');
  if (!container) return;

  // Destroy existing Leaflet instance
  if (window._leafletMap) {
    try { window._leafletMap.remove(); } catch(_) {}
    window._leafletMap = null;
  }

  // Build wrapping HTML
  container.innerHTML = `
    <div id="leafletMapEl" style="width:100%;height:490px;border-radius:10px;overflow:hidden;border:1px solid var(--border)"></div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px;font-size:11px;color:var(--muted)">
      <span style="font-weight:700;color:var(--muted);font-family:'Syne',sans-serif">Gap Score:</span>
      ${[['#3dd68c','9-10 Critical'],['#f5a623','7-8 High'],['#4a9eff','5-6 Moderate'],['#a78bfa','3-4 Low'],['#ff5f5f','1-2 Avoid']].map(([c,l])=>
        `<span style="display:inline-flex;align-items:center;gap:5px"><span style="width:11px;height:11px;border-radius:50%;background:${c};display:inline-block"></span>${l}</span>`
      ).join('')}
      <span style="display:inline-flex;align-items:center;gap:5px"><span style="font-size:13px">🏢</span> RE Listing</span>
      <span style="display:inline-flex;align-items:center;gap:5px"><span style="font-size:13px">★</span> Home ZIP</span>
    </div>
    <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
      <a href="https://maps.google.com/maps?q=${encodeURIComponent(industry().unit)}+near+${zip()}" target="_blank" class="link-btn primary-btn">↗ Google Maps</a>
      <a href="https://www.loopnet.com/search/commercial-real-estate/${zip()}/for-lease/" target="_blank" class="link-btn">↗ LoopNet Listings</a>
      <a href="https://www.crexi.com/lease/properties?address=${zip()}" target="_blank" class="link-btn">↗ Crexi Listings</a>
      <a href="https://www.bizbuysell.com/search/" target="_blank" class="link-btn">↗ BizBuySell</a>
    </div>`;

  // Guard: Leaflet must be loaded
  if (typeof L === 'undefined') {
    $('leafletMapEl').innerHTML = '<div style="padding:20px;color:var(--muted);font-size:13px">Map unavailable — Leaflet library not loaded. Check internet connection.</div>';
    return;
  }

  const center = [d.center?.lat || 34.0, d.center?.lng || -84.1];

  const map = L.map('leafletMapEl', {
    center,
    zoom: 10,
    zoomControl: true,
    attributionControl: true,
  });
  window._leafletMap = map;

  // CartoDB Dark Matter tiles — dark theme, no API key needed
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  // ── Home ZIP star marker ──────────────────────────────────
  const homeHtml = `<div style="background:#4a9eff;width:28px;height:28px;border-radius:50%;border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900;color:#000;box-shadow:0 2px 8px rgba(0,0,0,.5)">★</div>`;
  const homeIcon = L.divIcon({ html: homeHtml, className: '', iconSize: [28,28], iconAnchor: [14,14], popupAnchor: [0,-16] });
  L.marker(center, { icon: homeIcon, zIndexOffset: 1000 })
    .addTo(map)
    .bindPopup(`<strong>${d.center.label || 'ZIP ' + zip()}</strong><br>Your search center`);

  // ── Radius circle ─────────────────────────────────────────
  const radiusMiles = parseFloat(radius()) || 40;
  L.circle(center, {
    radius: radiusMiles * 1609.34,
    color: '#4a9eff',
    weight: 1.5,
    dashArray: '6 5',
    fillOpacity: 0.04,
    opacity: 0.35,
  }).addTo(map);

  // ── Real estate pins ──────────────────────────────────────
  (d.real_estate_pins || []).forEach(pin => {
    if (!pin.lat || !pin.lng) return;
    const reHtml = `<div style="background:#0f2a45;border:2px solid #4a9eff;border-radius:5px;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:13px;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.4)">🏢</div>`;
    const reIcon = L.divIcon({ html: reHtml, className: '', iconSize: [24,24], iconAnchor: [12,12], popupAnchor: [0,-14] });
    L.marker([pin.lat, pin.lng], { icon: reIcon })
      .addTo(map)
      .bindPopup(`<strong>${pin.label}</strong><br>$${(pin.rent||0).toLocaleString()}/mo · ${(pin.sqft||0).toLocaleString()} sqft<br><a href="${pin.url}" target="_blank" style="color:#4a9eff">View listing ↗</a>`);
  });

  // ── City circles ──────────────────────────────────────────
  (d.cities || []).forEach(city => {
    if (!city.lat || !city.lng) return;
    const col     = gapCol(city.gap_score || 0);
    const radius  = Math.max(10, Math.min(22, 8 + (city.gap_score || 0) * 1.3));
    const unserved = (city.unserved_children || 0).toLocaleString();
    const income   = '$' + Math.round((city.median_income || 0) / 1000) + 'k';

    const circle = L.circleMarker([city.lat, city.lng], {
      radius,
      fillColor: col,
      color:     col,
      weight:    2,
      opacity:   1,
      fillOpacity: 0.75,
    })
    .addTo(map)
    .bindPopup(`
      <div style="min-width:200px">
        <div style="font-size:14px;font-weight:700;margin-bottom:4px">${city.name}</div>
        <div style="font-size:11px;color:#888;margin-bottom:8px">${city.county || ''} County</div>
        <table style="font-size:11px;width:100%;border-collapse:collapse">
          <tr><td style="color:#888;padding:2px 0">Gap Score</td><td style="font-weight:700;color:${col};text-align:right">${city.gap_score}/10</td></tr>
          <tr><td style="color:#888;padding:2px 0">Priority</td><td style="font-weight:600;text-align:right">${city.priority||'—'}</td></tr>
          <tr><td style="color:#888;padding:2px 0">Unserved</td><td style="text-align:right">${unserved}</td></tr>
          <tr><td style="color:#888;padding:2px 0">Median Income</td><td style="text-align:right">${income}</td></tr>
          <tr><td style="color:#888;padding:2px 0">Competitors</td><td style="text-align:right">${city.competitor_count || 0}</td></tr>
        </table>
        <div style="margin-top:8px;padding:5px 8px;background:#1a3a5c;border-radius:4px;font-size:11px;font-weight:700;color:#4a9eff">${city.recommended_action||''}</div>
        ${city.real_estate_url ? `<div style="margin-top:6px"><a href="${city.real_estate_url}" target="_blank" style="font-size:11px;color:#4a9eff">View real estate listings ↗</a></div>` : ''}
      </div>`);

    // Permanent label
    const label = L.tooltip({
      permanent:  true,
      direction:  'top',
      offset:     [0, -(radius + 4)],
      className:  'leaflet-city-lbl',
      interactive: false,
    })
    .setContent(`<span style="font-weight:700">${city.gap_score}</span> ${city.name.split(' ')[0]}`)
    .setLatLng([city.lat, city.lng]);
    map.addLayer(label);
  });

  // Fix tile rendering if map was in a hidden panel
  setTimeout(() => map.invalidateSize(), 100);
}

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
