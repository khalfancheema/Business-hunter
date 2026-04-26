async function runAgent12(a3,a5) {
  setDot(12,'running');
  const ind=industry();
  const sys=`You are a grant research specialist for ${ind.unit} businesses. Search for real, current grant and subsidy programs. Respond JSON only.`;
  const usr=`Search for all available grants, subsidies, and funding incentives for opening a ${ind.unit} near ZIP ${zip()}. Regulatory body: ${ind.regulatory}. Search for SBA programs, USDA Rural Development grants, local county business incentives, industry-specific subsidies (${ind.grants}), and federal small business grants applicable to ${ind.unit} businesses.
Return ONLY:
{"summary":"5-sentence summary of funding landscape","total_potential_funding":287000,"caps_program":{"program_name":"Georgia Childcare and Parent Services (CAPS)","administered_by":"Georgia DECAL","website":"https://decal.ga.gov/Families/CAPS.aspx","phone":"1-877-255-2277","what_it_is":"State subsidy program paying childcare costs for income-eligible families. Guaranteed monthly payment to provider from state.","benefit_to_provider":"Guaranteed payment per enrolled CAPS child. CAPS families fill hard-to-fill slots with zero collection risk.","current_rates_gwinnett":[{"age_group":"Infant (0-12 mo)","daily_rate":37.50,"monthly_est":813,"notes":"Gwinnett County Rate A — 2024 schedule"},{"age_group":"Toddler (1-2 yr)","daily_rate":32.00,"monthly_est":694,"notes":"Gwinnett Rate A"},{"age_group":"Preschool (3 yr)","daily_rate":28.00,"monthly_est":607,"notes":"Gwinnett Rate A"},{"age_group":"Pre-K (4 yr)","daily_rate":25.00,"monthly_est":542,"notes":"Gwinnett Rate A"}],"current_rates_barrow":[{"age_group":"Infant (0-12 mo)","daily_rate":28.00,"monthly_est":607,"notes":"Barrow County Rate B"},{"age_group":"Toddler (1-2 yr)","daily_rate":24.00,"monthly_est":520,"notes":"Barrow Rate B"},{"age_group":"Preschool (3 yr)","daily_rate":20.00,"monthly_est":433,"notes":"Barrow Rate B"},{"age_group":"Pre-K (4 yr)","daily_rate":18.00,"monthly_est":390,"notes":"Barrow Rate B"}],"eligibility_for_provider":"Active DECAL license + Quality Rated 2-star minimum","how_to_apply":"Complete CAPS Provider Agreement at decal.ga.gov after licensing","revenue_impact":"15 CAPS children @ avg $650/mo = $9,750/month guaranteed revenue ($117K/yr)"},"georgia_pre_k":{"program_name":"Georgia Pre-K Program","administered_by":"Georgia DECAL","website":"https://www.decal.ga.gov/prek/","phone":"404-656-5957","what_it_is":"State-funded Pre-K for all Georgia 4-year-olds. State pays provider per enrolled Pre-K child per year.","annual_revenue_per_class":84000,"class_size":20,"eligibility":"DECAL license + Quality Rated 2-star + classroom assessment","website_apply":"https://www.decal.ga.gov/prek/ApplyToBeAProvider.aspx","notes":"One Pre-K class adds $84K/yr in guaranteed state revenue. Apply by February each year for fall enrollment."},"federal_grants":[{"name":"USDA Child & Adult Care Food Program (CACFP)","agency":"USDA / Georgia DOE","website":"https://www.gadoe.org/School-Improvement/Federal-Programs/Pages/CACFP.aspx","phone":"404-657-8000","amount_available":"$10,000–$14,000 annually","direct_apply":true,"apply_url":"https://www.gadoe.org/School-Improvement/Federal-Programs/Pages/CACFP.aspx","notes":"Meal reimbursement for breakfast, lunch, snacks. Barrow County may qualify for Tier 1 (higher rate). Apply after licensing."},{"name":"USDA Rural Development Community Facilities Grant","agency":"USDA Rural Development","website":"https://www.rd.usda.gov/programs-services/community-facilities/community-facilities-direct-loan-grant-program","phone":"706-546-2136","amount_available":"$25,000–$150,000 (Barrow County locations)","direct_apply":true,"apply_url":"https://www.rd.usda.gov/ga","notes":"Barrow County childcare centers may qualify. Contact Athens USDA office. No repayment required for grant portion.","eligibility_zip":"Winder GA 30680 and Auburn GA 30011 — confirm rural designation with USDA"},{"name":"SBA Microloan Program","agency":"SBA / ACE Georgia","website":"https://www.sba.gov/funding-programs/loans/microloans","amount_available":"Up to $50,000 at below-market rates","direct_apply":true,"apply_url":"https://aceloans.org","notes":"Georgia intermediary: ACE Loans (aceloans.org) 770-527-6100. For startups needing supplemental capital."},{"name":"HHS Child Care Stabilization Grant","agency":"HHS / ACF","website":"https://www.acf.hhs.gov/occ/child-care-stabilization-grants","amount_available":"$10,000–$50,000 if re-authorized in 2026","direct_apply":true,"notes":"Monitor acf.hhs.gov for renewal. Previously covered payroll, rent, equipment for new providers under American Rescue Plan."}],"barrow_county_incentives":[{"name":"Barrow County Development Authority","contact":"Barrow County Development Authority","phone":"770-307-3021","email":"bda@barrowga.org","website":"https://www.barrowga.org/economic-development/","incentives":["Property tax abatement up to 5 years for qualifying new businesses","Potential permit fee waivers","Site preparation assistance","Childcare declared workforce priority sector in Barrow County Strategic Plan 2024"],"notes":"Contact BDA before signing any lease. They may negotiate incentives with landlord or county commission directly."},{"name":"Georgia Job Tax Credit","agency":"Georgia Dept of Revenue","website":"https://dor.georgia.gov/job-tax-credit","amount":"$1,250–$3,500 per new full-time job (Barrow County Tier 3)","notes":"16 staff × $1,250 = up to $20,000 state tax credit Year 1. File Form IT-CA.","apply_url":"https://dor.georgia.gov/job-tax-credit"},{"name":"Winder Downtown Development Authority","contact":"Winder DDA","phone":"770-867-3106","website":"https://www.cityofwinder.com/development-authority/","incentives":["Façade grant up to $10,000","TIF district benefits","Sign grant up to $2,000"],"notes":"If locating in or near Winder downtown corridor."}],"quality_rated_benefits":{"program":"Georgia Quality Rated","website":"https://qualityrated.decal.ga.gov","benefits_by_star":[{"stars":1,"benefits":"CAPS eligible","additional_per_child":0},{"stars":2,"benefits":"Georgia Pre-K eligible, enhanced CAPS rate, workforce grants","additional_per_child":1.50},{"stars":3,"benefits":"Maximum CAPS rate, employer partnerships, enhanced Pre-K slot priority","additional_per_child":3.00},{"stars":4,"benefits":"National accreditation support, maximum state benefits","additional_per_child":4.50}],"recommendation":"Target 2-star at opening, 3-star by Year 2"},"all_grants_table":[{"program":"Georgia CAPS Subsidy","type":"Ongoing Revenue","amount_est":"$117,000/yr (15 CAPS kids)","deadline":"After licensing","probability":"High","action_required":"DECAL license + Quality Rated 2-star"},{"program":"Georgia Pre-K Slot","type":"Annual Revenue","amount_est":"$84,000/yr","deadline":"Apply by February","probability":"Medium-High","action_required":"Apply to DECAL after licensing"},{"program":"CACFP Meals","type":"Ongoing Revenue","amount_est":"$10,000–$14,000/yr","deadline":"Any time","probability":"High","action_required":"Enroll with Georgia DOE CACFP"},{"program":"USDA Rural Dev Grant","type":"One-Time Grant","amount_est":"$25,000–$150,000","deadline":"Rolling","probability":"High (Barrow Co.)","action_required":"Call Athens USDA 706-546-2136"},{"program":"Barrow Co. Tax Abatement","type":"Tax Savings","amount_est":"$5,000–$20,000/yr","deadline":"Before opening","probability":"High (Barrow)","action_required":"Contact BDA 770-307-3021 before lease"},{"program":"Georgia Job Tax Credit","type":"Tax Credit","amount_est":"Up to $20,000 Yr 1","deadline":"With tax return","probability":"High (Barrow)","action_required":"File Form IT-CA with GA Dept of Revenue"},{"program":"SBA Microloan","type":"Loan","amount_est":"Up to $50,000","deadline":"Rolling","probability":"Medium","action_required":"Apply at aceloans.org"},{"program":"Childcare Stabilization Grant","type":"Grant","amount_est":"$10,000–$50,000","deadline":"TBD 2026","probability":"Medium","action_required":"Monitor acf.hhs.gov"},{"program":"Winder DDA Façade Grant","type":"One-Time Grant","amount_est":"Up to $10,000","deadline":"Rolling","probability":"High (Winder)","action_required":"Contact Winder DDA 770-867-3106"},{"program":"DECAL Workforce Grant","type":"Per-staff grant","amount_est":"Up to $2,000/teacher","deadline":"As announced","probability":"Medium","action_required":"Monitor decal.ga.gov"}]}`;
  try {
    _setDemoKey(12);
    let d=await claudeJSON(sys,usr);
    if(!d) { console.warn('Agent 12 fallback'); d={summary:'Grant data unavailable.',total_potential_funding:0,federal_grants:[],all_grants_table:[]}; }
    R.a12=d;
    buildGrants(d);
    setDot(12,'done'); showOut(12);
    return JSON.stringify(d);
  } catch(e){setDot(12,'error');showOut(12);$('12-sum-t').textContent='Error: '+e.message;throw e}
}

function buildGrantCard(g) {
  return `<div class="grant-card">
    <div class="grant-card-top"><div><div class="grant-name">${g.name||g.program_name||''}</div><div style="font-size:11px;color:var(--muted);margin-top:2px">${g.agency||g.contact||''}</div></div>
    <div class="grant-amount" style="font-size:15px">${g.amount_available||g.amount||''}</div></div>
    <div class="grant-meta">${g.direct_apply!==undefined?`<span class="badge ${g.direct_apply?'b-green':'b-blue'}">${g.direct_apply?'Direct Apply':'Indirect'}</span>`:''}</div>
    ${Array.isArray(g.incentives)&&g.incentives.length?`<div style="display:flex;flex-direction:column;gap:5px;margin-bottom:10px">${g.incentives.map(i=>`<div style="display:flex;gap:8px;font-size:12px;color:var(--muted)"><span style="color:var(--green);flex-shrink:0">✓</span>${i}</div>`).join('')}</div>`:''}
    <div class="grant-body">${g.notes||g.what_it_is||''}</div>
    <div class="grant-actions">
      ${g.website?`<a href="${g.website}" target="_blank" class="link-btn primary-btn">↗ Info</a>`:''}
      ${g.apply_url?`<a href="${g.apply_url}" target="_blank" class="link-btn">↗ Apply</a>`:''}
      ${g.phone?`<span style="padding:5px 10px;font-size:11px;color:var(--muted)">${g.phone}</span>`:''}
    </div>
  </div>`;
}

function buildGrants(d) {
  const total = d.total_potential_funding||0;
  $('12-sum-t').textContent=d.summary+(total?`\n\nTotal potential funding (Year 1): $${total.toLocaleString()} across grants + ongoing programs.`:'');

  // Industry subsidy tab — supports both daycare CAPS structure and generic subsidy lists
  let ch='';
  if(d.caps_program) {
    const caps=d.caps_program;
    ch+=`<div class="bp-section"><h3>${caps.program_name||'Industry Subsidy Program'}</h3>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
        ${caps.website?`<a href="${caps.website}" target="_blank" class="link-btn primary-btn">↗ Portal</a>`:''}
        ${caps.phone?`<span style="padding:6px 12px;background:var(--surface2);border-radius:6px;font-size:12px;color:var(--muted)">${caps.phone}</span>`:''}
      </div>
      <div class="bp-prose" style="margin-bottom:10px">${caps.what_it_is||''}</div>
      ${caps.revenue_impact?`<div style="padding:10px 14px;background:var(--green-dim);border:1px solid var(--green);border-radius:8px;margin-bottom:12px;font-size:12px;color:var(--muted)"><strong style="color:var(--green)">Revenue Impact: </strong>${caps.revenue_impact}</div>`:''}`;
    const rateTable=(rates,title)=>{
      if(!rates||!rates.length) return '';
      return `<h4>${title}</h4><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Tier</th><th>Daily Rate</th><th>Monthly Est.</th><th>Notes</th></tr></thead><tbody>`
        +rates.map(r=>`<tr><td>${r.age_group||r.tier||''}</td><td style="color:var(--green)">$${r.daily_rate}/day</td><td style="color:var(--green)">~$${r.monthly_est}/mo</td><td style="font-size:11px;color:var(--faint)">${r.notes||''}</td></tr>`).join('')
        +`</tbody></table></div>`;
    };
    if(caps.current_rates_gwinnett) ch+=rateTable(caps.current_rates_gwinnett,'Primary Market Rates');
    if(caps.current_rates_barrow) ch+=rateTable(caps.current_rates_barrow,'Secondary Market Rates');
    if(caps.current_rates) ch+=rateTable(caps.current_rates,'Subsidy Rates');
    ch+=`</div>`;
    if(d.georgia_pre_k) {
      const prek=d.georgia_pre_k;
      ch+=`<div class="bp-section"><h3>${prek.program_name||'State Program'}</h3>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
          ${prek.website?`<a href="${prek.website}" target="_blank" class="link-btn primary-btn">↗ Info</a>`:''}
          ${prek.website_apply?`<a href="${prek.website_apply}" target="_blank" class="link-btn">↗ Apply</a>`:''}
        </div>
        ${prek.annual_revenue_per_class?`<div class="bp-grid"><div class="bp-stat"><div class="bp-stat-label">Annual Revenue</div><div class="bp-stat-val">$${prek.annual_revenue_per_class.toLocaleString()}</div><div class="bp-stat-sub">Guaranteed state payment</div></div>${prek.class_size?`<div class="bp-stat"><div class="bp-stat-label">Class Size</div><div class="bp-stat-val">${prek.class_size}</div></div>`:''}</div>`:''}
        <div class="bp-prose">${prek.what_it_is||''}</div>
        ${prek.notes?`<div style="margin-top:8px;padding:8px 12px;background:var(--amber-dim);border:1px solid var(--amber);border-radius:8px;font-size:12px;color:var(--amber)">⚡ ${prek.notes}</div>`:''}
      </div>`;
    }
  } else if(d.industry_subsidies) {
    (d.industry_subsidies||[]).forEach(g=>{ch+=buildGrantCard(g);});
  } else {
    ch=`<div style="font-size:13px;color:var(--muted);padding:16px">Industry-specific subsidy details will appear here after running the pipeline.</div>`;
  }
  $('12-caps-c').innerHTML=ch;

  // Federal/USDA tab
  const fedGrants=d.federal_grants||d.grants||[];
  let fh=`<div class="bp-section"><h3>Federal &amp; SBA Grant Programs</h3>`;
  fedGrants.forEach(g=>{fh+=buildGrantCard(g);});
  if(!fedGrants.length) fh+=`<div style="font-size:13px;color:var(--muted)">No federal grants data available.</div>`;
  fh+=`</div>`;
  $('12-usda-c').innerHTML=fh;

  // Local incentives tab
  const localIncentives=d.local_incentives||d.barrow_county_incentives||d.county_incentives||[];
  let lh=`<div class="bp-section"><h3>Local &amp; County Incentives</h3>`;
  localIncentives.forEach(g=>{lh+=buildGrantCard(g);});
  if(!localIncentives.length) lh+=`<div style="font-size:13px;color:var(--muted)">No local incentive data available.</div>`;
  const qr=d.quality_rated_benefits;
  if(qr) {
    lh+=`<h3 style="margin-top:16px">${qr.program}</h3>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Level</th><th>Key Benefits</th><th>Extra Per Unit/Day</th></tr></thead><tbody>`;
    (qr.benefits_by_star||[]).forEach(s=>{lh+=`<tr><td>${'★'.repeat(s.stars)}</td><td style="font-size:12px">${s.benefits}</td><td style="color:var(--green)">+$${s.additional_per_child}/day</td></tr>`;});
    lh+=`</tbody></table></div>${qr.website?`<div style="margin-top:8px"><a href="${qr.website}" target="_blank" class="link-btn primary-btn">↗ Program Portal</a></div>`:''}`;
  }
  lh+=`</div>`;
  $('12-local-c').innerHTML=lh;

  // Full table
  let tbl=`<div style="margin-bottom:10px;padding:10px 14px;background:var(--green-dim);border:1px solid var(--green);border-radius:8px;display:flex;justify-content:space-between;align-items:center">
    <div style="font-size:13px;font-weight:700;font-family:'Syne',sans-serif">Total Potential Funding (Year 1)</div>
    <div style="font-size:22px;font-weight:700;font-family:'Syne',sans-serif;color:var(--green)">$${total.toLocaleString()}</div>
  </div>
  <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Program</th><th>Type</th><th>Estimated Amount</th><th>Deadline</th><th>Probability</th><th>Next Action</th></tr></thead><tbody>`;
  (d.all_grants_table||[]).forEach(g=>{
    const pb=g.probability.startsWith('High')?'b-green':g.probability.startsWith('Medium')?'b-amber':'b-red';
    const tb=g.type.includes('Revenue')||g.type.includes('Grant')?'b-green':g.type.includes('Tax')?'b-amber':'b-blue';
    tbl+=`<tr><td><strong>${g.program}</strong></td><td><span class="badge ${tb}">${g.type}</span></td><td style="color:var(--green);font-weight:600">${g.amount_est}</td><td style="font-size:11px;color:var(--muted)">${g.deadline}</td><td><span class="badge ${pb}">${g.probability}</span></td><td style="font-size:11px;color:var(--muted)">${g.action_required}</td></tr>`;
  });
  tbl+=`</tbody></table></div>`;
  $('12-tbl-c').innerHTML=tbl;
}

// ══════════════════════════════════════════════════════════
// COMPETITOR DEEP-DIVE AGENT (Agent 13)
// ══════════════════════════════════════════════════════════
