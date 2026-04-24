async function runAgent9(a1,a2,a3,a4,a5,a6,a7,a8) {
  setDot(9,'running');
  const ind=industry();
  const sys=`You are a senior business plan writer and SBA loan consultant with 20 years of experience helping ${ind.unit} businesses secure funding. You write detailed, bank-ready business plans. Respond JSON only.`;
  const usr=`Write a comprehensive SBA 7(a) loan-ready business plan for a ${ind.unit} (${ind.capacity_label}: ${capacity()}, budget $${parseInt(budget()).toLocaleString()}) near ZIP ${zip()}.

Use all research below:
DEMOGRAPHICS: ${ctx(a1,['summary','cities','overall_opportunity_score'])}
GAP ANALYSIS: ${ctx(a2,['summary','cities','overall_opportunity_score','age_gaps'])}
SITE SELECTION: ${ctx(a3,['summary','locations'])}
REAL ESTATE: ${ctx(a4,['summary','listings','by_city_summary'])}
COMPLIANCE: ${ctx(a5,['summary','requirements','timeline_phases'])}
COMPETITIVE INTEL: ${ctx(a6,['summary','cities','top_chains'])}
FINANCIALS: ${ctx(a7,['summary','scenarios','projections','by_city_financials'])}
EXECUTIVE SUMMARY: ${ctx(a8,['verdict','verdict_rationale','assessment','success_factors','risks','next_steps'])}

Return ONLY this JSON (be extremely detailed — this is a real bank document):
{
  "business_name": "Bright Futures Early Learning Center",
  "entity_type": "LLC",
  "owner_placeholder": "[Owner Name]",
  "executive_summary": {
    "concept": "3-paragraph detailed concept description covering mission, services, target market, and differentiation",
    "opportunity": "2-paragraph detailed market opportunity citing specific census data and gap analysis findings",
    "ask": "Total capital requested, use of funds breakdown, expected ROI for lender"
  },
  "company_overview": {
    "mission": "Full mission statement",
    "vision": "Full vision statement",
    "values": ["Value 1 with explanation","Value 2 with explanation","Value 3 with explanation","Value 4 with explanation"],
    "legal_structure": "Georgia LLC — single-member or multi-member detail",
    "location_rationale": "Detailed paragraph on why the chosen city/submarket was selected citing data",
    "services": [
      {"name":"Infant Care (6 weeks – 12 months)","capacity":12,"ratio":"1:4","monthly_tuition":2050,"annual_revenue":246000,"description":"Full-day care including feeding schedules, milestone tracking, parent communication app"},
      {"name":"Toddler Care (1–2 years)","capacity":18,"ratio":"1:6","monthly_tuition":1850,"annual_revenue":399600,"description":"Structured play, language development, potty training support"},
      {"name":"Preschool (3 years)","capacity":20,"ratio":"1:10","monthly_tuition":1600,"annual_revenue":384000,"description":"Pre-reading, STEM intro, social-emotional learning, school readiness"},
      {"name":"Pre-K (4–5 years)","capacity":20,"ratio":"1:12","monthly_tuition":1400,"annual_revenue":336000,"description":"Kindergarten readiness, Georgia Pre-K program eligible, full curriculum"},
      {"name":"Before/After School","capacity":15,"ratio":"1:15","monthly_tuition":800,"annual_revenue":144000,"description":"Transportation from local elementary schools, homework help"}
    ]
  },
  "market_analysis": {
    "target_market": "Detailed description of primary customer — dual-income households, age 25-45, household income $75k+",
    "market_size": {
      "total_addressable": "Children under 6 in 40-mile radius: ~65,000",
      "serviceable": "Children of working parents in target income bracket: ~28,000",
      "target_share": "Target 0.27% market share = 75 enrolled children at full capacity"
    },
    "competitor_comparison": [
      {"name":"Primrose Schools","locations":6,"monthly_tuition_infant":2100,"rating":4.1,"waitlist":true,"our_advantage":"Lower tuition, more personalized, locally owned"},
      {"name":"KinderCare","locations":4,"monthly_tuition_infant":1750,"rating":3.8,"waitlist":false,"our_advantage":"Higher quality staff, smaller class sizes, Reggio-inspired"},
      {"name":"Bright Horizons","locations":2,"monthly_tuition_infant":2400,"rating":4.4,"waitlist":true,"our_advantage":"More accessible price point with equivalent quality"},
      {"name":"Independent Centers","locations":24,"monthly_tuition_infant":1450,"rating":4.2,"waitlist":true,"our_advantage":"Better facilities, technology, curriculum structure"},
      {"name":"Winder/Auburn (Barrow)","locations":4,"monthly_tuition_infant":1300,"rating":3.9,"waitlist":true,"our_advantage":"Only quality provider if locating in Barrow County"}
    ],
    "differentiators": [
      "Reggio Emilia-inspired curriculum with STEM integration",
      "Live parent camera access via HiMama or Brightwheel app",
      "Bilingual (English/Spanish) classroom assistant in each room",
      "Georgia Bright from the Start Quality Rated — targeting 3-star minimum",
      "Fresh, locally-sourced snacks and meals — CACFP enrolled",
      "Director with Master's in Early Childhood Education"
    ],
    "trends": [
      "Post-pandemic childcare demand surge — supply still recovering",
      "Georgia childcare desert designation in Barrow County — federal priority funding available",
      "Dual-income household norm in Gwinnett/Barrow — 71%+ of families need full-day care",
      "Employer-sponsored childcare benefits growing — corporate partnership opportunity"
    ]
  },
  "operations_plan": {
    "facility": {
      "total_sqft": 8000,
      "indoor_sqft_per_child": 37,
      "outdoor_sqft_per_child": 80,
      "rooms": [
        {"name":"Infant Room A","sqft":480,"capacity":6,"ratio":"1:4"},
        {"name":"Infant Room B","sqft":480,"capacity":6,"ratio":"1:4"},
        {"name":"Toddler Room A","sqft":540,"capacity":9,"ratio":"1:6"},
        {"name":"Toddler Room B","sqft":540,"capacity":9,"ratio":"1:6"},
        {"name":"Preschool Room A","sqft":700,"capacity":10,"ratio":"1:10"},
        {"name":"Preschool Room B","sqft":700,"capacity":10,"ratio":"1:10"},
        {"name":"Pre-K Room A","sqft":700,"capacity":10,"ratio":"1:12"},
        {"name":"Pre-K Room B","sqft":700,"capacity":10,"ratio":"1:12"},
        {"name":"Multi-purpose / Before-After","sqft":900,"capacity":15,"ratio":"1:15"},
        {"name":"Director Office, Reception, Kitchen, Storage","sqft":2260,"capacity":0,"ratio":"N/A"}
      ]
    },
    "hours": "Monday–Friday 6:30 AM – 6:30 PM (12-hour operation)",
    "staffing_plan": [
      {"role":"Center Director","count":1,"salary":78000,"requirement":"Master's ECE or BA + 3 yrs director experience, DECAL required"},
      {"role":"Lead Infant Teacher","count":2,"salary":42000,"requirement":"CDA credential minimum, infant CPR"},
      {"role":"Lead Toddler Teacher","count":2,"salary":40000,"requirement":"CDA credential minimum"},
      {"role":"Lead Preschool Teacher","count":2,"salary":38000,"requirement":"CDA or ECE degree"},
      {"role":"Lead Pre-K Teacher","count":2,"salary":38000,"requirement":"Georgia Pre-K certification preferred"},
      {"role":"Teacher Assistants","count":5,"salary":29000,"requirement":"High school diploma, enrolled in CDA program"},
      {"role":"Cook / Nutrition Coordinator","count":1,"salary":32000,"requirement":"ServSafe certified, CACFP trained"},
      {"role":"Administrative Coordinator","count":1,"salary":36000,"requirement":"Childcare admin experience, billing software"}
    ],
    "curriculum": "Reggio Emilia-inspired with Georgia Early Learning & Development Standards (GELDS) alignment. HighScope assessment tools. Ages & Stages Questionnaire (ASQ-3) developmental screening.",
    "technology": ["Brightwheel parent communication & billing platform","IP camera system with parent portal access","Procare Solutions childcare management software","QuickBooks for accounting","Google Workspace for staff communication"]
  },
  "financial_plan": {
    "startup_capital_needed": 542000,
    "use_of_funds": [
      {"item":"Real Estate (deposit + first/last month rent)","amount":42000,"pct":7.8},
      {"item":"Build-Out & Renovation","amount":185000,"pct":34.1},
      {"item":"Playground & Outdoor Equipment","amount":48000,"pct":8.9},
      {"item":"Indoor FF&E (furniture, cribs, mats, etc.)","amount":92000,"pct":17.0},
      {"item":"Technology & Security Systems","amount":14000,"pct":2.6},
      {"item":"Licensing, Permits & Legal","amount":22000,"pct":4.1},
      {"item":"Insurance (first 12 months)","amount":9600,"pct":1.8},
      {"item":"Initial Marketing & Pre-Enrollment","amount":22000,"pct":4.1},
      {"item":"Working Capital (6 months operations)","amount":107400,"pct":19.8}
    ],
    "funding_sources": [
      {"source":"SBA 7(a) Loan","amount":400000,"pct":73.8,"terms":"10 year, prime + 2.75% (~7.75%), monthly payment ~$4,800","lender_contacts":["Truist Bank SBA Division: sba@truist.com","Regions Bank SBA: 1-800-REGIONS","Live Oak Bank (childcare specialist): liveoak.bank","TD Bank SBA: tdbank.com/sba"]},
      {"source":"Owner Equity","amount":100000,"pct":18.5,"terms":"Personal investment","lender_contacts":[]},
      {"source":"USDA Rural Development (Barrow Co.)","amount":25000,"pct":4.6,"terms":"Low-interest grant/loan if Barrow County site","lender_contacts":["USDA RD Georgia: rd.usda.gov/ga","Athens USDA office: 706-546-2136"]},
      {"source":"Georgia SBIC / SBDA","amount":17000,"pct":3.1,"terms":"State small business development grant","lender_contacts":["Georgia SBDC: georgiasbdc.org","Gwinnett SBDC: 678-985-6840"]}
    ],
    "year1_projections": {"revenue":580000,"cogs":0,"gross_profit":580000,"operating_expenses":480000,"ebitda":100000,"net_income":68000},
    "year2_projections": {"revenue":820000,"cogs":0,"gross_profit":820000,"operating_expenses":510000,"ebitda":310000,"net_income":248000},
    "year3_projections": {"revenue":980000,"cogs":0,"gross_profit":980000,"operating_expenses":545000,"ebitda":435000,"net_income":360000},
    "breakeven_analysis": "Break-even at 47 enrolled children (63% capacity) at average tuition of $1,680/month. Expected to reach break-even in Month 18.",
    "debt_service_coverage": "DSCR at full operation: 2.8x (well above SBA minimum of 1.25x)",
    "collateral": "Personal assets, equipment, leasehold improvements, assignment of lease"
  },
  "sba_checklist": [
    {"item":"SBA Form 1919 – Borrower Information","status":"Required","notes":"Complete for all 20%+ owners","link":"https://www.sba.gov/document/sba-form-1919-borrower-information-form"},
    {"item":"SBA Form 413 – Personal Financial Statement","status":"Required","notes":"All owners with 20%+ stake","link":"https://www.sba.gov/document/sba-form-413-personal-financial-statement"},
    {"item":"Business Plan (this document)","status":"This Document","notes":"Bank requires 3-5 year projections","link":""},
    {"item":"3 Years Personal Tax Returns","status":"Gather","notes":"All owners","link":""},
    {"item":"3 Years Business Tax Returns","status":"N/A – New Business","notes":"Startup exemption","link":""},
    {"item":"Personal Credit Report","status":"Required","notes":"650+ preferred, 680+ for best rates","link":"https://www.annualcreditreport.com"},
    {"item":"Business Credit (Dun & Bradstreet)","status":"Establish Now","notes":"Register at dnb.com","link":"https://www.dnb.com/duns-number.html"},
    {"item":"Georgia LLC Operating Agreement","status":"Required","notes":"File at sos.ga.gov","link":"https://sos.ga.gov/page/business-formation"},
    {"item":"EIN from IRS","status":"Required","notes":"Apply free at IRS.gov","link":"https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online"},
    {"item":"Commercial Lease Letter of Intent","status":"Required","notes":"Bank needs to see committed location","link":""},
    {"item":"DECAL License Application","status":"File After Lease","notes":"decal.ga.gov","link":"https://decal.ga.gov/BftS/Home.aspx"},
    {"item":"Construction Bids (2-3 minimum)","status":"Required","notes":"For build-out cost validation","link":""},
    {"item":"Business Insurance Quote","status":"Required","notes":"$1M general liability minimum","link":""},
    {"item":"Management Resumes","status":"Required","notes":"Director and owner resumes","link":""}
  ],
  "investor_slides": [
    {"slide":1,"title":"The Problem","content":"1 in 3 working families in Gwinnett and Barrow County Georgia cannot find licensed, quality childcare. Waitlists at top centers average 3-4 months. Barrow County has only 6 licensed centers for a county growing at 22% annually. Working parents are forced to reduce hours or leave the workforce entirely — costing Georgia's economy an estimated $1.2B in lost productivity annually."},
    {"slide":2,"title":"The Solution","content":"Bright Futures Early Learning Center: a premium, Reggio Emilia-inspired childcare center serving Infant through Pre-K in the highest-demand, lowest-supply corridor in the Atlanta metro. 75-child capacity, 12-hour operating day, bilingual staff, live parent cameras, and Quality Rated curriculum — positioned at the mid-premium price point ($1,400–$2,050/month) to capture the largest addressable market."},
    {"slide":3,"title":"Market Opportunity","content":"Total addressable market: 65,000 children under 6 within 40 miles. Serviceable market: 28,000 children of working parents in target income bracket. Current supply deficit: 2,400+ unserved children in top 3 target cities alone. Market growing 8-22% annually. Average competitor operating at 91% capacity with waitlists. This is a supply-constrained market."},
    {"slide":4,"title":"Business Model","content":"Revenue from monthly tuition across 5 age groups. Infant: $2,050/mo × 12 slots = $246K annual. Toddler: $1,850/mo × 18 slots = $399K annual. Preschool: $1,600/mo × 20 slots = $384K annual. Pre-K: $1,400/mo × 20 slots = $336K annual. Before/After: $800/mo × 15 slots = $144K annual. Total at full capacity: $1.51M annual revenue. Year 1 target (78% fill): $980K."},
    {"slide":5,"title":"Financial Projections","content":"Total startup investment: $542,000 (73.8% SBA 7(a) loan). Year 1: $580K revenue, $68K net income. Year 2: $820K revenue, $248K net income. Year 3: $980K revenue, $360K net income. Break-even: Month 18 at 63% capacity. 3-year cumulative net: $676,000. SBA DSCR at maturity: 2.8x."},
    {"slide":6,"title":"Competitive Advantage","content":"1. First quality provider in Barrow County corridor (if Auburn/Winder site). 2. ONLY Reggio-inspired center with bilingual staff in target market. 3. Technology-forward — Brightwheel app, live cameras, digital daily reports. 4. Georgia Quality Rated target — 3-star opens access to state subsidy families and employer partnerships. 5. Locally owned — personal service that corporate chains cannot match."},
    {"slide":7,"title":"Use of Funds","content":"$542,000 total: Real estate deposit & first/last rent $42K (7.8%) · Build-out & renovation $185K (34.1%) · Outdoor playground $48K (8.9%) · Indoor FF&E $92K (17.0%) · Technology & security $14K (2.6%) · Licensing, legal & permits $22K (4.1%) · Insurance year 1 $9.6K (1.8%) · Marketing & pre-enrollment $22K (4.1%) · 6-month working capital $107.4K (19.8%)."},
    {"slide":8,"title":"The Team","content":"[Owner/Operator] – [Background]. Director [Name] – [Credentials, years experience]. Advisory Board includes [DECAL consultant], [local pediatrician for health advisory], [CPA specializing in childcare]. Backed by Georgia SBDC mentorship program."},
    {"slide":9,"title":"The Ask","content":"Seeking $400,000 SBA 7(a) loan (10 year, ~7.75%) plus $100,000 owner equity and $42,000 in supplemental grants. Total capital: $542,000. Funds deployed over 14-month pre-opening period. Lender receives: 1st lien on all equipment, leasehold assignment, personal guarantee. SBA guarantee reduces lender risk to 25% of loan value."}
  ]
}`;
  try {
    let d = await claudeJSON(sys, usr);
    if(!d) { console.warn('Agent 9 fallback'); d=getFallback9(); }
    R.a9 = d;
    renderBusinessPlan(d);
    setDot(9,'done'); showOut(9);
    return JSON.stringify(d);
  } catch(e){setDot(9,'error');showOut(9);$('9-ov-c').innerHTML=`<div class="prose" style="color:var(--red)">Error: ${e.message}</div>`;throw e}
}

function renderBusinessPlan(d) {
  const es = d.executive_summary || {};
  const co = d.company_overview || {};
  const ma = d.market_analysis || {};
  const ms = ma.market_size || {};
  // Overview tab
  let ov = `<div class="bp-section">
    <h3>Executive Summary</h3>
    <div class="bp-prose"><strong style="color:var(--text)">${d.business_name}</strong> · ${d.entity_type} · Owner: ${d.owner_placeholder}</div>
    <div class="bp-prose" style="margin-top:10px">${es.concept||''}</div>
    <div class="bp-prose" style="margin-top:8px">${es.opportunity||''}</div>
    <div class="bp-prose" style="margin-top:8px;padding:10px;background:var(--blue-dim);border-radius:8px;border:1px solid var(--blue)">${es.ask||''}</div>
  </div>
  <div class="bp-section">
    <h3>Company Overview</h3>
    <h4>Mission</h4><div class="bp-prose">${co.mission||''}</div>
    <h4>Vision</h4><div class="bp-prose">${co.vision||''}</div>
    <h4>Core Values</h4>
    <div class="bp-grid">${(co.values||[]).map(v=>`<div class="bp-stat"><div class="bp-stat-val" style="font-size:13px">✦</div><div class="bp-stat-sub">${v}</div></div>`).join('')}</div>
    <h4>Location Rationale</h4><div class="bp-prose">${co.location_rationale||''}</div>
  </div>
  <div class="bp-section">
    <h3>Services &amp; Revenue by Age Group</h3>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Program</th><th>Capacity</th><th>Ratio</th><th>Tuition/mo</th><th>Annual Revenue</th><th>Description</th></tr></thead><tbody>`;
  (d.company_overview?.services||[]).forEach(s=>{
    ov+=`<tr><td><strong>${s.name}</strong></td><td>${s.capacity}</td><td>${s.ratio}</td><td>$${(s.monthly_tuition||0).toLocaleString()}</td><td style="color:var(--green)">$${(s.annual_revenue||0).toLocaleString()}</td><td style="font-size:11px;color:var(--muted)">${s.description}</td></tr>`;
  });
  const totalCap=(d.company_overview?.services||[]).reduce((s,x)=>s+(x.capacity||0),0);
  const totalRev=(d.company_overview?.services||[]).reduce((s,x)=>s+(x.annual_revenue||0),0);
  ov+=`<tr><td><strong>TOTAL</strong></td><td><strong>${totalCap}</strong></td><td>—</td><td>—</td><td style="color:var(--green);font-weight:700">$${totalRev.toLocaleString()}</td><td>—</td></tr>`;
  ov+=`</tbody></table></div></div>`;
  $('9-ov-c').innerHTML=ov;

  // Market tab
  let mkt=`<div class="bp-section">
    <h3>Target Market</h3><div class="bp-prose">${ma.target_market||''}</div>
    <h4>Market Size (TAM / SAM / SOM)</h4>
    <div class="bp-grid">
      <div class="bp-stat"><div class="bp-stat-label">Total Addressable</div><div class="bp-stat-val" style="font-size:14px">${ms.total_addressable||''}</div></div>
      <div class="bp-stat"><div class="bp-stat-label">Serviceable Market</div><div class="bp-stat-val" style="font-size:14px">${ms.serviceable||''}</div></div>
      <div class="bp-stat"><div class="bp-stat-label">Our Target Share</div><div class="bp-stat-val" style="font-size:14px">${ms.target_share||''}</div></div>
    </div>
    <h4>Competitive Comparison Table</h4>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Competitor</th><th>Locations</th><th>${industry().price_label_primary}</th><th>Rating</th><th>Waitlist</th><th>Our Advantage</th></tr></thead><tbody>`;
  (d.market_analysis?.competitor_comparison||[]).forEach(c=>{
    mkt+=`<tr><td><strong>${c.name}</strong></td><td>${c.locations}</td><td>$${(c.monthly_tuition_infant||c.monthly_primary_rate||0).toLocaleString()}</td><td>${c.rating}★</td><td><span class="badge ${c.waitlist?'b-amber':'b-green'}">${c.waitlist?'Yes':'No'}</span></td><td style="font-size:11px;color:var(--green)">${c.our_advantage}</td></tr>`;
  });
  mkt+=`</tbody></table></div>
    <h4>Key Differentiators</h4>
    <div style="display:flex;flex-direction:column;gap:6px">`;
  (d.market_analysis?.differentiators||[]).forEach((diff,i)=>{
    mkt+=`<div style="display:flex;gap:10px;padding:8px 12px;background:var(--surface2);border-radius:8px;border:1px solid var(--border)"><div style="color:var(--blue);font-weight:700;font-family:'Syne',sans-serif;min-width:20px">${i+1}.</div><div style="font-size:12.5px;color:var(--text)">${diff}</div></div>`;
  });
  mkt+=`</div>
    <h4>Industry Trends Supporting This Investment</h4>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px">`;
  (d.market_analysis?.trends||[]).forEach(t=>{
    mkt+=`<div style="padding:10px 12px;background:var(--green-dim);border:1px solid var(--green);border-radius:8px;font-size:12px;color:var(--muted)">${t}</div>`;
  });
  mkt+=`</div></div>`;
  $('9-mkt-c').innerHTML=mkt;

  // Financials tab
  const fp=d.financial_plan;
  let fin=`<div class="bp-section">
    <h3>Startup Capital Requirements — $${fp.startup_capital_needed.toLocaleString()}</h3>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Use of Funds</th><th>Amount</th><th>% of Total</th></tr></thead><tbody>`;
  (fp.use_of_funds||[]).forEach(u=>{
    fin+=`<tr><td>${u.item}</td><td>$${u.amount.toLocaleString()}</td><td><div style="display:flex;align-items:center;gap:8px"><div style="flex:1;height:6px;background:var(--surface3);border-radius:3px;overflow:hidden"><div style="width:${u.pct}%;height:100%;background:var(--blue);border-radius:3px"></div></div><span style="font-size:11px;width:36px">${u.pct}%</span></div></td></tr>`;
  });
  fin+=`</tbody></table></div>
    <h4>Funding Sources</h4>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Source</th><th>Amount</th><th>%</th><th>Terms</th><th>Lender Contacts</th></tr></thead><tbody>`;
  (fp.funding_sources||[]).forEach(s=>{
    const links=(s.lender_contacts||[]).map(l=>{
      const url=l.includes('http')||l.includes('www')||l.includes('.gov')||l.includes('.bank')||l.includes('.com')?`<a href="https://${l.replace(/^https?:\/\//,'').split(':')[0]}" target="_blank" class="link-btn" style="font-size:10px;padding:2px 7px;margin-bottom:3px">${l}</a>`:`<div style="font-size:10px;color:var(--muted)">${l}</div>`;
      return url;
    }).join('');
    fin+=`<tr><td><strong>${s.source}</strong></td><td style="color:var(--green)">$${s.amount.toLocaleString()}</td><td>${s.pct}%</td><td style="font-size:11px;color:var(--muted)">${s.terms}</td><td>${links}</td></tr>`;
  });
  fin+=`</tbody></table></div>
    <h4>3-Year Financial Projections</h4>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Metric</th><th>Year 1</th><th>Year 2</th><th>Year 3</th></tr></thead><tbody>`;
  const rows=[
    ['Revenue','revenue'],['Gross Profit','gross_profit'],['Operating Expenses','operating_expenses'],['EBITDA','ebitda'],['Net Income','net_income']
  ];
  rows.forEach(([label,key])=>{
    const y1=(fp.year1_projections||{})[key]||0,y2=(fp.year2_projections||{})[key]||0,y3=(fp.year3_projections||{})[key]||0;
    const col=key==='operating_expenses'?'var(--red)':'var(--green)';
    fin+=`<tr><td>${label}</td><td style="color:${col}">$${y1.toLocaleString()}</td><td style="color:${col}">$${y2.toLocaleString()}</td><td style="color:${col}">$${y3.toLocaleString()}</td></tr>`;
  });
  fin+=`</tbody></table></div>
    <div class="bp-grid" style="margin-top:12px">
      <div class="bp-stat"><div class="bp-stat-label">Break-Even Analysis</div><div class="bp-stat-sub">${fp.breakeven_analysis}</div></div>
      <div class="bp-stat"><div class="bp-stat-label">Debt Service Coverage Ratio</div><div class="bp-stat-val">${fp.debt_service_coverage}</div></div>
      <div class="bp-stat"><div class="bp-stat-label">Collateral Offered</div><div class="bp-stat-sub">${fp.collateral}</div></div>
    </div></div>`;
  $('9-fin-c').innerHTML=fin;

  // Operations tab
  const ops=d.operations_plan;
  let opsHtml=`<div class="bp-section">
    <h3>Facility Layout Plan</h3>
    <div class="bp-grid" style="grid-template-columns:repeat(auto-fill,minmax(160px,1fr))">
      <div class="bp-stat"><div class="bp-stat-label">Total Sq Ft</div><div class="bp-stat-val">${ops.facility.total_sqft.toLocaleString()}</div><div class="bp-stat-sub">sq ft</div></div>
      <div class="bp-stat"><div class="bp-stat-label">Indoor / Child</div><div class="bp-stat-val">${ops.facility.indoor_sqft_per_child}</div><div class="bp-stat-sub">sq ft (GA min: 35)</div></div>
      <div class="bp-stat"><div class="bp-stat-label">Outdoor / Child</div><div class="bp-stat-val">${ops.facility.outdoor_sqft_per_child}</div><div class="bp-stat-sub">sq ft (GA min: 75)</div></div>
    </div>
    <div class="tbl-wrap" style="margin-top:10px"><table class="tbl"><thead><tr><th>Room</th><th>Sq Ft</th><th>Capacity</th><th>Ratio</th></tr></thead><tbody>`;
  (ops.facility?.rooms||[]).forEach(r=>{
    opsHtml+=`<tr><td>${r.name}</td><td>${r.sqft.toLocaleString()}</td><td>${r.capacity||'—'}</td><td>${r.ratio}</td></tr>`;
  });
  opsHtml+=`</tbody></table></div>
    <h4>Operating Hours</h4><div class="bp-prose">${ops.hours}</div>
    <h4>Staffing Plan</h4>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Role</th><th>Headcount</th><th>Annual Salary</th><th>Annual Cost</th><th>Requirements</th></tr></thead><tbody>`;
  let totalStaff=0,totalCost=0;
  (ops.staffing_plan||[]).forEach(s=>{
    const cost=s.count*s.salary;totalStaff+=s.count;totalCost+=cost;
    opsHtml+=`<tr><td><strong>${s.role}</strong></td><td>${s.count}</td><td>$${s.salary.toLocaleString()}</td><td>$${cost.toLocaleString()}</td><td style="font-size:11px;color:var(--muted)">${s.requirement}</td></tr>`;
  });
  opsHtml+=`<tr><td><strong>Total</strong></td><td><strong>${totalStaff}</strong></td><td>—</td><td style="color:var(--amber);font-weight:700">$${totalCost.toLocaleString()}</td><td>—</td></tr>`;
  opsHtml+=`</tbody></table></div>
    <h4>Curriculum &amp; Assessment</h4><div class="bp-prose">${ops.curriculum}</div>
    <h4>Technology Stack</h4>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:6px">`;
  (ops.technology||[]).forEach(t=>{
    opsHtml+=`<div style="padding:6px 12px;background:var(--blue-dim);border:1px solid var(--blue);border-radius:6px;font-size:12px;color:var(--blue)">${t}</div>`;
  });
  opsHtml+=`</div></div>`;
  $('9-ops-c').innerHTML=opsHtml;

  // SBA Checklist tab
  let sba=`<div class="bp-section"><h3>SBA 7(a) Loan Application Checklist</h3>
    <div style="margin-bottom:12px;padding:10px 14px;background:var(--blue-dim);border:1px solid var(--blue);border-radius:8px;font-size:12px;color:var(--blue)">
      Complete all items below before submitting to your SBA lender. Recommended lenders: Truist Bank, Regions Bank, Live Oak Bank (childcare specialist), TD Bank.
    </div>`;
  (d.sba_checklist||[]).forEach(item=>{
    const sb=item.status==='Required'?'b-red':item.status==='This Document'?'b-green':item.status.includes('N/A')?'b-blue':'b-amber';
    sba+=`<div style="display:flex;align-items:flex-start;gap:12px;padding:10px 12px;background:var(--surface2);border:1px solid var(--border);border-radius:8px;margin-bottom:6px">
      <span class="badge ${sb}" style="margin-top:1px;flex-shrink:0">${item.status}</span>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:600;font-family:'Syne',sans-serif;color:var(--text)">${item.item}</div>
        <div style="font-size:11px;color:var(--muted);margin-top:2px">${item.notes}</div>
      </div>
      ${item.link?`<a href="${item.link}" target="_blank" class="link-btn primary-btn" style="font-size:10px;padding:3px 8px;flex-shrink:0">↗ Link</a>`:''}
    </div>`;
  });
  sba+=`</div>`;
  $('9-sba-c').innerHTML=sba;

  // Investor slides tab
  const slides9=d.investor_slides||[];
  let inv=`<div class="bp-section"><h3>Investor Pitch Deck — ${slides9.length} Slides</h3>`;
  slides9.forEach(s=>{
    inv+=`<div class="slide">
      <div class="slide-num">Slide ${s.slide}</div>
      <div class="slide-title">${s.title}</div>
      <div class="slide-body">${s.content}</div>
    </div>`;
  });
  inv+=`</div>`;
  $('9-inv-c').innerHTML=inv;
}

// ══════════════════════════════════════════════════════════
// PROJECT PLAN AGENT (Agent 10)
// ══════════════════════════════════════════════════════════
