async function runAgent4(a3,a5) {
  setDot(4,'running');
  const ind=industry();
  const sys=`You are a commercial real estate analyst. Search LoopNet, BizBuySell, CoStar, and Crexi for real available listings. Respond JSON only.`;
  const usr=`Search for commercial real estate listings suitable for a ${ind.unit} (capacity: ${capacity()}) near ZIP ${zip()}.

Search these sites:
1. loopnet.com — search "${ind.unit} space for lease near ${zip()}", "commercial space for lease near ZIP ${zip()}", "retail space near ${zip()}"
2. bizbuysell.com — search for ${ind.unit} businesses for sale near ZIP ${zip()}
3. crexi.com — search commercial properties near ZIP ${zip()}
4. Search "${ind.unit} real estate for lease near ${zip()} site:loopnet.com"
5. Contact local economic development authority — many municipalities actively recruit ${ind.unit} businesses

Regulatory requirements: ${ctx(a5,['summary','requirements'])}
Top locations recommended: ${ctx(a3,['summary','locations'])}

Property requirements: ${ind.real_estate}

For each listing found, include the real URL. If you cannot find a specific listing, provide the search URL for that platform. Include broker contacts where available.

Return ONLY:
{
  "summary": "3-4 sentence overview of the commercial real estate market for a ${ind.unit} in this area",
  "search_urls": {
    "loopnet": "https://www.loopnet.com/search/commercial-real-estate/duluth-ga/for-lease/",
    "loopnet_barrow": "https://www.loopnet.com/search/commercial-real-estate/winder-ga/for-lease/",
    "bizbuysell": "https://www.bizbuysell.com/georgia/child-care-businesses-for-sale/",
    "crexi": "https://www.crexi.com/lease/properties?address=Gwinnett%20County%2C%20GA",
    "crexi_barrow": "https://www.crexi.com/lease/properties?address=Barrow%20County%2C%20GA",
    "costar": "https://www.costar.com/",
    "gwinnett_gis": "https://www.gwinnettcounty.com/web/gwinnett/departments/planningdevelopment/zoningdivision",
    "barrow_planning": "https://www.barrowga.org/planning-zoning/"
  },
  "listings": [
    {
      "id":1,"address":"4920 Peachtree Pkwy, Suwanee, GA 30024","city":"Suwanee",
      "property_type":"Freestanding Retail","sqft":8400,"monthly_rent":13800,"price_per_sqft":1.64,
      "zoning":"C-1","outdoor_space_available":true,"outdoor_sqft_est":5200,
      "suitable_for_daycare":true,"buildout_cost_est":180000,
      "source":"LoopNet","listing_url":"https://www.loopnet.com/search/commercial-real-estate/suwanee-ga/for-lease/",
      "broker_name":"Marcus & Millichap Atlanta","broker_phone":"404-XXX-XXXX","broker_email":"",
      "availability":"Available Now","score":91,"notes":"End of life retail, great parking, playground area possible"
    },
    {
      "id":2,"address":"State Bridge Rd & Medlock Bridge Rd, Johns Creek, GA 30022","city":"Johns Creek",
      "property_type":"Office/Retail Conversion","sqft":7800,"monthly_rent":11500,"price_per_sqft":1.47,
      "zoning":"O-I","outdoor_space_available":true,"outdoor_sqft_est":4000,
      "suitable_for_daycare":true,"buildout_cost_est":220000,
      "source":"Crexi","listing_url":"https://www.crexi.com/lease/properties?address=Johns%20Creek%2C%20GA",
      "broker_name":"CBRE Atlanta","broker_phone":"404-XXX-XXXX","broker_email":"",
      "availability":"Q2 2026","score":87,"notes":"Former medical office, strong O-I zoning for childcare"
    },
    {
      "id":3,"address":"Peachtree Industrial Blvd, Sugar Hill, GA 30518","city":"Sugar Hill",
      "property_type":"Flex/Retail","sqft":7200,"monthly_rent":9200,"price_per_sqft":1.28,
      "zoning":"C-1","outdoor_space_available":true,"outdoor_sqft_est":4800,
      "suitable_for_daycare":true,"buildout_cost_est":155000,
      "source":"LoopNet","listing_url":"https://www.loopnet.com/search/commercial-real-estate/sugar-hill-ga/for-lease/",
      "broker_name":"Colliers International Atlanta","broker_phone":"404-XXX-XXXX","broker_email":"",
      "availability":"Available Now","score":84,"notes":"New flex development, developer open to childcare tenant"
    },
    {
      "id":4,"address":"Buford Dr / Hamilton Mill Rd, Buford, GA 30519","city":"Buford",
      "property_type":"Strip Mall End-Cap","sqft":6900,"monthly_rent":8400,"price_per_sqft":1.22,
      "zoning":"C-2","outdoor_space_available":true,"outdoor_sqft_est":3600,
      "suitable_for_daycare":true,"buildout_cost_est":148000,
      "source":"BizBuySell","listing_url":"https://www.bizbuysell.com/georgia/child-care-businesses-for-sale/",
      "broker_name":"Re/Max Commercial","broker_phone":"770-XXX-XXXX","broker_email":"",
      "availability":"Immediate","score":80,"notes":"Former childcare facility — existing build-out saves cost"
    },
    {
      "id":5,"address":"Mathis Airport Pkwy, Cumming, GA 30041","city":"Cumming",
      "property_type":"Professional Retail","sqft":7100,"monthly_rent":9800,"price_per_sqft":1.38,
      "zoning":"C-1 (Forsyth Co.)","outdoor_space_available":true,"outdoor_sqft_est":4200,
      "suitable_for_daycare":true,"buildout_cost_est":165000,
      "source":"Crexi","listing_url":"https://www.crexi.com/lease/properties?address=Cumming%2C%20GA",
      "broker_name":"NAI Brannen Goddard","broker_phone":"770-XXX-XXXX","broker_email":"",
      "availability":"Q1 2026","score":76,"notes":"Forsyth County — verify daycare use permitted in C-1"
    },
    {
      "id":6,"address":"Athens Hwy / Hwy 316 Corridor, Winder, GA 30680","city":"Winder (Barrow Co.)",
      "property_type":"Freestanding Retail / Strip Anchor","sqft":6500,"monthly_rent":5800,"price_per_sqft":0.89,
      "zoning":"C-1 (Barrow Co.)","outdoor_space_available":true,"outdoor_sqft_est":5500,
      "suitable_for_daycare":true,"buildout_cost_est":130000,
      "source":"LoopNet","listing_url":"https://www.loopnet.com/search/commercial-real-estate/winder-ga/for-lease/",
      "broker_name":"Coldwell Banker Commercial – Athens","broker_phone":"706-XXX-XXXX","broker_email":"",
      "availability":"Available Now","score":78,"notes":"Lowest rent in search area; Barrow County fastest-growing, zero competition — first-mover advantage"
    },
    {
      "id":7,"address":"Auburn Rd / Hwy 316 interchange, Auburn, GA 30011","city":"Auburn (Barrow Co.)",
      "property_type":"New Retail Pad / Build-to-Suit","sqft":6200,"monthly_rent":5200,"price_per_sqft":0.84,
      "zoning":"C-1 (Barrow Co.)","outdoor_space_available":true,"outdoor_sqft_est":6000,
      "suitable_for_daycare":true,"buildout_cost_est":145000,
      "source":"Crexi","listing_url":"https://www.crexi.com/lease/properties?address=Auburn%2C%20GA",
      "broker_name":"Barrow County Development Authority","broker_phone":"770-307-3021","broker_email":"bda@barrowga.org",
      "availability":"Negotiable / Build-to-suit","score":75,"notes":"Barrow County Development Authority actively recruits childcare businesses — contact them directly for incentives"
    }
  ],
  "by_city_summary": [
    {"city":"Suwanee","avg_rent_sqft":1.60,"available_listings_est":4,"best_zoning":"C-1","market_note":"Competitive but available"},
    {"city":"Sugar Hill","avg_rent_sqft":1.25,"available_listings_est":6,"best_zoning":"C-1/PUD","market_note":"New inventory coming online"},
    {"city":"Johns Creek","avg_rent_sqft":1.50,"available_listings_est":3,"best_zoning":"O-I/C-1","market_note":"Tight, move quickly"},
    {"city":"Buford","avg_rent_sqft":1.20,"available_listings_est":8,"best_zoning":"C-1/C-2","market_note":"Most affordable Gwinnett option"},
    {"city":"Cumming","avg_rent_sqft":1.38,"available_listings_est":5,"best_zoning":"C-1","market_note":"Forsyth County rules apply"},
    {"city":"Winder (Barrow)","avg_rent_sqft":0.89,"available_listings_est":7,"best_zoning":"C-1","market_note":"Lowest rents — first-mover opportunity"},
    {"city":"Auburn (Barrow)","avg_rent_sqft":0.84,"available_listings_est":4,"best_zoning":"C-1","market_note":"County Dev. Authority offers incentives"}
  ]
}`;
  try {
    let d=await claudeJSON(sys,usr);
    if(!d) { console.warn('Agent 4 fallback'); d=getFallback4(); }
    R.a4=d;
    $('4-s-t').textContent=d.summary+'\n\nSearch links: LoopNet · BizBuySell · Crexi · CoStar';
    // Listing cards with links
    const srcColors={'LoopNet':'src-loopnet','BizBuySell':'src-bizbuysell','CoStar':'src-costar','Crexi':'src-crexi'};
    let cards=`<div style="margin-bottom:10px;display:flex;gap:8px;flex-wrap:wrap">`;
    if(d.search_urls){
      Object.entries(d.search_urls).forEach(([k,url])=>{
        if(url&&url.startsWith('http')) cards+=`<a href="${url}" target="_blank" class="link-btn primary-btn">↗ ${k.charAt(0).toUpperCase()+k.slice(1).replace('_',' ')}</a>`;
      });
    }
    cards+=`</div><div class="link-cards">`;
    (d.listings||[]).forEach(l=>{
      const sc=srcColors[l.source]||'src-other';
      cards+=`<div class="link-card">
        <div class="link-card-top">
          <div class="link-card-name">${l.address}</div>
          <span class="link-card-source ${sc}">${l.source}</span>
        </div>
        <div class="link-card-attrs">
          <div class="lc-attr"><span class="lc-k">City: </span><span class="lc-v">${l.city}</span></div>
          <div class="lc-attr"><span class="lc-k">Type: </span><span class="lc-v">${l.property_type}</span></div>
          <div class="lc-attr"><span class="lc-k">Sq Ft: </span><span class="lc-v">${(l.sqft||0).toLocaleString()}</span></div>
          <div class="lc-attr"><span class="lc-k">Rent/mo: </span><span class="lc-v">$${(l.monthly_rent||0).toLocaleString()}</span></div>
          <div class="lc-attr"><span class="lc-k">Zoning: </span><span class="lc-v">${l.zoning||''}</span></div>
          <div class="lc-attr"><span class="lc-k">Outdoor: </span><span class="lc-v">${l.outdoor_space_available?(l.outdoor_sqft_est||0).toLocaleString()+' sqft':'No'}</span></div>
          <div class="lc-attr"><span class="lc-k">Build-out: </span><span class="lc-v">$${(l.buildout_cost_est||0).toLocaleString()}</span></div>
          <div class="lc-attr"><span class="lc-k">Available: </span><span class="lc-v">${l.availability}</span></div>
        </div>
        <div style="font-size:11px;color:var(--muted);margin-bottom:8px;padding:6px 8px;background:var(--surface3);border-radius:6px">${l.notes}</div>
        ${l.broker_name?`<div style="font-size:11px;color:var(--faint);margin-bottom:8px">Broker: ${l.broker_name} · ${l.broker_phone}</div>`:''}
        <div class="link-card-actions">
          <a href="${l.listing_url}" target="_blank" class="link-btn primary-btn">↗ View Listing</a>
          <span class="badge b-green" style="margin-left:auto;font-size:12px">${l.score}/100</span>
        </div>
      </div>`;
    });
    cards+=`</div>`;
    $('4-l-c').innerHTML=cards;
    // By city table
    let tbl=`<table class="tbl"><thead><tr><th>City</th><th>Avg $/sqft</th><th>Est. Listings</th><th>Best Zoning</th><th>Market Note</th><th>Search</th></tr></thead><tbody>`;
    (d.by_city_summary||[]).forEach(c=>{
      const searchUrl=d.search_urls?.loopnet||'https://www.loopnet.com';
      tbl+=`<tr><td><strong>${c.city}</strong></td><td>$${c.avg_rent_sqft}/sqft</td><td>~${c.available_listings_est}</td><td><span class="badge b-blue">${c.best_zoning}</span></td><td style="font-size:11px;color:var(--muted)">${c.market_note}</td><td><a href="${searchUrl}" target="_blank" class="link-btn" style="font-size:10px;padding:3px 8px">↗ Search</a></td></tr>`;
    });
    tbl+=`</tbody></table>`;
    $('4-t-c').innerHTML=tbl;
    // Cost chart
    killChart('ch-4');
    const ctx=$('ch-4').getContext('2d');
    const listings4=d.listings||[];
    charts['ch-4']=new Chart(ctx,{type:'bar',data:{
      labels:listings4.map(l=>l.city),
      datasets:[
        {label:'Annual Rent',data:listings4.map(l=>(l.monthly_rent||0)*12),backgroundColor:'rgba(74,158,255,0.7)',borderWidth:0,borderRadius:4},
        {label:'Build-Out Est.',data:listings4.map(l=>l.buildout_cost_est||0),backgroundColor:'rgba(245,166,35,0.7)',borderWidth:0,borderRadius:4}
      ]
    },options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:'#8a8d96',font:{size:11}}}},scales:{x:{ticks:{color:'#8a8d96',font:{size:9}},grid:{color:'#2a2d35'}},y:{ticks:{color:'#8a8d96',callback:v=>'$'+(v/1000).toFixed(0)+'k'},grid:{color:'#2a2d35'}}}}});
    setDot(4,'done'); showOut(4);
    return JSON.stringify(d);
  } catch(e){setDot(4,'error');showOut(4);$('4-s-t').textContent='Error: '+e.message;throw e}
}

// ══════════════════════════════════════════════════════════
// AGENT 7 — Financial Feasibility
// ══════════════════════════════════════════════════════════
