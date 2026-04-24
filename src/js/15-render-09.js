async function runAgent9(a1,a2,a3,a4,a5,a6,a7,a8) {
  setDot(9,'running');
  $('9-ov-c').innerHTML = subProgress(1,4,'Starting business plan sub-agents…');
  // Use 4 focused sub-calls instead of one large call to prevent max_tokens truncation

  try {
    let d = await runAgent9Parts(a1,a2,a3,a4,a5,a6,a7,a8);
    if(!d || !d.business_name) { console.warn('Agent 9 fallback'); d=getFallback9(); }
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
  // Support both new one_time_costs structure and legacy use_of_funds
  const oneTimeCosts = fp.one_time_costs || fp.use_of_funds || [];
  const fixedCosts   = fp.fixed_monthly_costs || [];
  const varCosts     = fp.variable_monthly_costs || [];
  const totalOTC = oneTimeCosts.reduce((s,x)=>s+(x.amount||0),0);
  const startup = fp.startup_capital_needed || totalOTC;
  let fin=`<div class="bp-section">
    <h3>One-Time Startup Costs — $${startup.toLocaleString()}</h3>
    <div style="font-size:11px;color:var(--muted);margin-bottom:8px">Capital needed before opening day. These are non-recurring investment costs.</div>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Item</th><th>Amount</th><th>Category</th><th>Notes</th><th>% of Total</th></tr></thead><tbody>`;
  oneTimeCosts.forEach(u=>{
    const pct = u.pct || (startup ? (u.amount/startup*100).toFixed(1) : 0);
    fin+=`<tr><td><strong>${u.item}</strong></td><td style="color:var(--amber)">$${(u.amount||0).toLocaleString()}</td><td><span class="badge b-blue">${u.category||'Startup'}</span></td><td style="font-size:11px;color:var(--muted)">${u.notes||''}</td><td><div style="display:flex;align-items:center;gap:6px"><div style="flex:1;height:5px;background:var(--surface3);border-radius:3px;overflow:hidden;min-width:60px"><div style="width:${Math.min(100,pct)}%;height:100%;background:var(--amber);border-radius:3px"></div></div><span style="font-size:10px;width:32px">${pct}%</span></div></td></tr>`;
  });
  fin+=`</tbody></table></div>`;

  if(fixedCosts.length) {
    const totalFixed = fixedCosts.reduce((s,x)=>s+(x.amount||0),0);
    fin+=`<h4 style="margin-top:16px">Fixed Monthly Costs — $${totalFixed.toLocaleString()}/mo</h4>
    <div style="font-size:11px;color:var(--muted);margin-bottom:8px">Costs that do not change with revenue/volume. Must be covered regardless of occupancy.</div>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Item</th><th>Monthly Amount</th><th>Annual</th><th>Notes</th></tr></thead><tbody>`;
    fixedCosts.forEach(f=>{
      fin+=`<tr><td>${f.item}</td><td style="color:var(--red)">$${(f.amount||0).toLocaleString()}</td><td style="color:var(--red)">$${((f.amount||0)*12).toLocaleString()}</td><td style="font-size:11px;color:var(--muted)">${f.notes||''}</td></tr>`;
    });
    fin+=`<tr><td><strong>Total Fixed</strong></td><td style="color:var(--red);font-weight:700">$${totalFixed.toLocaleString()}</td><td style="color:var(--red);font-weight:700">$${(totalFixed*12).toLocaleString()}</td><td>—</td></tr>`;
    fin+=`</tbody></table></div>`;
  }

  if(varCosts.length) {
    fin+=`<h4 style="margin-top:16px">Variable Monthly Costs</h4>
    <div style="font-size:11px;color:var(--muted);margin-bottom:8px">Costs that scale with revenue, occupancy, or customer volume.</div>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Item</th><th>Estimated/mo</th><th>Scales With</th><th>Notes</th></tr></thead><tbody>`;
    varCosts.forEach(v=>{
      fin+=`<tr><td>${v.item}</td><td style="color:var(--amber)">$${(v.amount||0).toLocaleString()}</td><td style="font-size:11px;color:var(--blue)">${v.per_unit||'revenue'}</td><td style="font-size:11px;color:var(--muted)">${v.notes||''}</td></tr>`;
    });
    fin+=`</tbody></table></div>`;
  }

  fin+=`
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
