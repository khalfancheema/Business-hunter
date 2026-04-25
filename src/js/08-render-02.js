async function runAgent5() {
  setDot(5,'running');
  const ind=industry();
  const sys=`You are a regulatory compliance expert for small businesses in the US. Research current licensing, zoning, and permit requirements for opening a ${ind.unit}. For every requirement you list, you MUST provide the exact agency name, the direct URL to apply or start the application, the specific form number/name if applicable, and step-by-step instructions for how to apply. Respond JSON only.`;
  const usr=`Search for ALL federal, state, and local requirements to open a ${ind.unit} near ZIP ${zip()}.

Regulatory authority: ${ind.regulatory}
Key compliance areas: ${ind.compliance}

CRITICAL REQUIREMENT: For every item in the requirements array, you must include:
- apply_url: The DIRECT URL to the online application portal or the agency's licensing page (not just the homepage). For state licensing, search "[state] ${ind.unit} license application" and find the exact portal URL.
- agency_name: The exact official agency name (e.g. "Georgia Department of Early Care and Learning (DECAL)", "Gwinnett County Building & Development", "Georgia Secretary of State — Business Registration")
- apply_instructions: An array of 3–6 specific numbered steps explaining exactly HOW to apply (e.g. "1. Go to childcare.georgia.gov, click 'Apply for a License'", "2. Create an account with your email", "3. Complete the Bright from the Start Form 100 online")
- form_name: The specific form number and name (e.g. "Form 100 — Initial Application for Child Care Center License") or null if online-only
- apply_phone: The agency's direct phone number for application inquiries
- apply_email: The agency's contact email if available
- apply_notes: Any important caveats (e.g. "Background checks must be completed BEFORE submitting", "Requires notarized signature", "Fire inspection must precede this application")
- online_available: true if the application can be completed online, false if paper/in-person only

Search specifically for:
1. "[state name] ${ind.unit} license application online" — find the state licensing portal
2. "[county name] business license application" — find the county portal
3. "[county name] zoning permit application" — find planning dept URL
4. "[county name] building permit online application" — find building dept portal
5. "SBA licenses permits [state] ${ind.unit}" — cross-reference federal requirements
6. "[state] LLC formation online" — Secretary of State portal
7. "IRS EIN application" — always online at irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online

Return ONLY:
{
  "summary": "4-sentence overview of the main regulatory requirements, mentioning the key agencies by name",
  "decal_url": "https://childcare.georgia.gov/apply-license",
  "sba_permits_url": "https://www.sba.gov/business-guide/launch-your-business/apply-licenses-permits",
  "state_portal_url": "https://[actual state licensing portal URL]",
  "requirements": [
    {
      "category": "Business Formation",
      "item": "LLC / Business Entity Formation",
      "detail": "Register your business entity with the state Secretary of State before applying for any licenses",
      "timeline_weeks": 1,
      "cost_usd": 100,
      "source": "Georgia Secretary of State",
      "priority": "Critical",
      "agency_name": "Georgia Secretary of State — Corporations Division",
      "apply_url": "https://ecorp.sos.ga.gov/",
      "form_name": "Articles of Organization (online filing)",
      "apply_phone": "404-656-2817",
      "apply_email": "corporations@sos.ga.gov",
      "online_available": true,
      "apply_instructions": [
        "1. Go to ecorp.sos.ga.gov and click 'File a New Domestic LLC'",
        "2. Enter your proposed business name and check availability",
        "3. Complete the Articles of Organization form online — list your registered agent",
        "4. Pay the $100 filing fee online by credit card",
        "5. Download your Certificate of Organization (usually issued same day)"
      ],
      "apply_notes": "Choose your business name carefully — it must match exactly on all subsequent license applications"
    },
    {
      "category": "Tax",
      "item": "Federal EIN (Employer Identification Number)",
      "detail": "Required to hire employees, open a business bank account, and file taxes",
      "timeline_weeks": 0,
      "cost_usd": 0,
      "source": "IRS",
      "priority": "Critical",
      "agency_name": "Internal Revenue Service (IRS)",
      "apply_url": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "form_name": "IRS Form SS-4 (online EIN application)",
      "apply_phone": "800-829-4933",
      "apply_email": null,
      "online_available": true,
      "apply_instructions": [
        "1. Go to irs.gov and search 'EIN Online Application' or use the direct link",
        "2. Select entity type 'Limited Liability Company'",
        "3. Answer questions about your business structure and purpose",
        "4. Submit — your EIN is issued immediately online",
        "5. Print and save the EIN confirmation letter (EIN Assignment Notice)"
      ],
      "apply_notes": "Apply online Mon–Fri 7am–10pm ET. EIN is issued instantly. Free — no charge."
    },
    {
      "category": "Licensing",
      "item": "State ${ind.unit} Operating License",
      "detail": "Primary state license required to operate — issued by ${ind.regulatory}",
      "timeline_weeks": 8,
      "cost_usd": 500,
      "source": "${ind.regulatory}",
      "priority": "Critical",
      "agency_name": "Replace with actual agency full name",
      "apply_url": "https://Replace-with-actual-state-portal-URL",
      "form_name": "Replace with actual form name/number",
      "apply_phone": "Replace with actual phone",
      "apply_email": "Replace with actual email or null",
      "online_available": true,
      "apply_instructions": [
        "1. Complete all prerequisite steps first (LLC formation, EIN, lease agreement, background checks)",
        "2. Go to the state licensing portal URL above",
        "3. Create an account / log in",
        "4. Complete the initial license application form with facility details",
        "5. Upload required documents: floor plan, lease/deed, proof of insurance, staff credentials",
        "6. Pay application fee online",
        "7. Schedule pre-licensing inspection with the state licensor"
      ],
      "apply_notes": "Do NOT sign a lease until you have confirmed the zoning allows a ${ind.unit}. License cannot be transferred — it is tied to the specific address."
    },
    {
      "category": "Zoning",
      "item": "Zoning / Conditional Use Permit",
      "detail": "Confirm ${ind.unit} is a permitted or conditional use in your target zoning district",
      "timeline_weeks": 4,
      "cost_usd": 400,
      "source": "Local planning department",
      "priority": "Critical",
      "agency_name": "Replace with county/city Planning & Zoning Department name",
      "apply_url": "https://Replace-with-actual-county-planning-dept-URL",
      "form_name": "Replace with actual permit form name",
      "apply_phone": "Replace with actual phone",
      "apply_email": null,
      "online_available": false,
      "apply_instructions": [
        "1. Visit the county/city planning department website (link above)",
        "2. Look up the zoning designation of your target property using the GIS map or parcel lookup",
        "3. Check the zoning ordinance to confirm ${ind.unit} is a permitted or conditional use",
        "4. If conditional use: download and complete the Conditional Use Permit (CUP) application",
        "5. Submit application with site plan, fee, and any required neighbor notifications",
        "6. Attend public hearing if required for conditional use approval"
      ],
      "apply_notes": "Do this BEFORE signing a lease. Zoning approval can take 4–8 weeks and is not guaranteed."
    },
    {
      "category": "Building",
      "item": "Building Permit",
      "detail": "Required for any construction, renovation, or change of occupancy to the space",
      "timeline_weeks": 6,
      "cost_usd": 1500,
      "source": "Local Building Department",
      "priority": "Critical",
      "agency_name": "Replace with county/city Building Department name",
      "apply_url": "https://Replace-with-actual-building-dept-URL",
      "form_name": "Building Permit Application",
      "apply_phone": "Replace with actual phone",
      "apply_email": null,
      "online_available": true,
      "apply_instructions": [
        "1. Hire a licensed architect to prepare construction drawings/plans per local code",
        "2. Go to the building department portal (link above) and create a contractor/owner account",
        "3. Submit permit application with: architect's stamped drawings, site plan, energy calculations",
        "4. Pay permit fee (usually based on construction value)",
        "5. Wait for plan review (2–6 weeks) — respond to any correction requests",
        "6. Once approved, post the permit on-site before construction begins"
      ],
      "apply_notes": "Permit is required even if you are not doing major construction — change of occupancy classification alone triggers a permit in most jurisdictions."
    },
    {
      "category": "Fire",
      "item": "Fire Marshal Inspection & Certificate",
      "detail": "Fire safety inspection required before Certificate of Occupancy is issued",
      "timeline_weeks": 2,
      "cost_usd": 0,
      "source": "Local Fire Marshal",
      "priority": "Critical",
      "agency_name": "Replace with county/city Fire Marshal name",
      "apply_url": "https://Replace-with-county-fire-marshal-URL",
      "form_name": "Fire Inspection Request Form",
      "apply_phone": "Replace with actual phone",
      "apply_email": null,
      "online_available": false,
      "apply_instructions": [
        "1. Complete all construction and install all fire safety equipment (sprinklers, extinguishers, exit signs, smoke detectors)",
        "2. Contact the fire marshal office (phone/link above) to schedule a pre-occupancy inspection",
        "3. Provide address, square footage, and intended occupancy type",
        "4. Pass the inspection — correct any deficiencies and schedule re-inspection if needed",
        "5. Receive fire safety certificate — required before applying for Certificate of Occupancy"
      ],
      "apply_notes": "Fire marshal inspections are typically free. Allow 2–4 weeks for scheduling. Sprinkler systems may be required for spaces over a certain size — confirm with fire marshal early."
    },
    {
      "category": "Building",
      "item": "Certificate of Occupancy (CO)",
      "detail": "Final building department sign-off that the space is safe and legal to occupy",
      "timeline_weeks": 2,
      "cost_usd": 300,
      "source": "Local Building Department",
      "priority": "Critical",
      "agency_name": "Replace with county/city Building Department name",
      "apply_url": "https://Replace-with-actual-building-dept-URL",
      "form_name": "Certificate of Occupancy Application",
      "apply_phone": "Replace with actual phone",
      "apply_email": null,
      "online_available": false,
      "apply_instructions": [
        "1. Ensure all permitted construction work has passed final building inspections",
        "2. Obtain fire marshal certificate (prerequisite)",
        "3. Contact the building department to request a final inspection and CO",
        "4. Pass all final inspections (building, electrical, plumbing, mechanical)",
        "5. Pay CO fee and receive your Certificate of Occupancy",
        "6. State licensor will require a copy of the CO before issuing your operating license"
      ],
      "apply_notes": "You CANNOT open or occupy the space without a valid CO. The state licensing agency will ask for a copy."
    },
    {
      "category": "Insurance",
      "item": "General Liability & Professional Liability Insurance",
      "detail": "State licensing requires proof of insurance before issuing operating license",
      "timeline_weeks": 1,
      "cost_usd": 3000,
      "source": "Licensed Insurance Broker",
      "priority": "Critical",
      "agency_name": "Licensed Insurance Broker (see notes for recommended providers)",
      "apply_url": "https://www.thehartford.com/small-business-insurance/daycare-insurance",
      "form_name": "Certificate of Insurance (ACORD 25)",
      "apply_phone": null,
      "apply_email": null,
      "online_available": true,
      "apply_instructions": [
        "1. Contact a commercial insurance broker who specializes in childcare or small business",
        "2. Request a quote for: General Liability ($1M–$2M), Professional Liability, Abuse & Molestation coverage, Workers Compensation (required once you hire staff)",
        "3. Compare quotes from at least 3 insurers — recommended: The Hartford, Philadelphia Insurance, Markel, West Bend",
        "4. Purchase the policy and request a Certificate of Insurance (ACORD 25 form)",
        "5. Name the state licensing agency as an additional interested party on the certificate",
        "6. Upload the certificate to your state license application"
      ],
      "apply_notes": "Abuse & Molestation (A&M) coverage is specifically required by most state childcare licensing agencies — ensure your policy includes it explicitly."
    },
    {
      "category": "Staffing",
      "item": "Director & Staff Background Checks",
      "detail": "All staff must pass criminal background checks and fingerprinting before hire",
      "timeline_weeks": 3,
      "cost_usd": 50,
      "source": "${ind.regulatory}",
      "priority": "Critical",
      "agency_name": "Replace with state background check agency (e.g. Georgia GAPS / FBI CJIS)",
      "apply_url": "https://Replace-with-state-background-check-portal-URL",
      "form_name": "Replace with state form (e.g. Georgia Form CJIS-1)",
      "apply_phone": "Replace with actual phone",
      "apply_email": null,
      "online_available": false,
      "apply_instructions": [
        "1. All employees (including the director/owner) must be fingerprinted before working with children",
        "2. Go to the state licensing portal and complete the background check authorization form",
        "3. Schedule a fingerprinting appointment at an authorized location (LiveScan or IdentoGO)",
        "4. Pay the fingerprinting fee per person (typically $40–$70)",
        "5. Results are sent directly to the licensing agency — not to you",
        "6. Staff must have clearance BEFORE they can count in staff-to-child ratios"
      ],
      "apply_notes": "Start background checks early — they can take 2–6 weeks. Out-of-state staff may require FBI checks in addition to state checks."
    }
  ],
  "timeline_phases": [
    {"phase": "Business Formation", "weeks": 2, "tasks": "LLC registration, EIN, business bank account"},
    {"phase": "Site & Zoning", "weeks": 6, "tasks": "Zoning confirmation, lease negotiation, zoning/CUP application"},
    {"phase": "Permits & Plans", "weeks": 10, "tasks": "Architect drawings, building permit application, state license pre-application"},
    {"phase": "Build-Out", "weeks": 14, "tasks": "Construction, equipment install, signage, fire safety systems"},
    {"phase": "Final Inspections", "weeks": 4, "tasks": "Fire marshal, building final, Certificate of Occupancy"},
    {"phase": "Licensing & Insurance", "weeks": 4, "tasks": "State license application, insurance, background checks, staff hiring"},
    {"phase": "Soft Open", "weeks": 2, "tasks": "Pre-licensing inspection, staff training, marketing, grand opening"}
  ]
}

Replace ALL placeholder text (e.g. "Replace with actual...") with REAL URLs, phone numbers, agency names, and instructions specific to ZIP ${zip()} and the state/county. Search for the actual portal URLs.`;

  try {
    let d=await claudeJSON(sys,usr);
    if(!d) { console.warn('Agent 5 fallback'); d=getFallback5(); }
    R.a5=d;

    // ── Summary tab ────────────────────────────────────────
    let sumText = d.summary || '';
    const portalLinks = [
      d.state_portal_url  ? `State licensing portal: ${d.state_portal_url}` : '',
      d.decal_url         ? `Apply / info: ${d.decal_url}` : '',
      d.sba_permits_url   ? `SBA permits guide: ${d.sba_permits_url}` : ''
    ].filter(Boolean);
    if (portalLinks.length) sumText += '\n\n🔗 Key portals:\n' + portalLinks.join('\n');
    $('5-s-t').textContent = sumText;

    // ── Requirements table ────────────────────────────────
    let tbl = `<table class="tbl"><thead><tr><th>Category</th><th>Requirement</th><th>Detail</th><th>Timeline</th><th>Cost</th><th>Agency</th><th>Priority</th><th>Apply</th></tr></thead><tbody>`;
    (d.requirements||[]).forEach(r => {
      const pb = r.priority==='Critical'?'b-red':r.priority==='High'?'b-amber':'b-blue';
      const applyBtn = r.apply_url
        ? `<a href="${r.apply_url}" target="_blank" class="link-btn primary-btn" style="font-size:11px;white-space:nowrap">↗ Apply</a>`
        : `<span style="font-size:10px;color:var(--faint)">See How to Apply tab</span>`;
      tbl += `<tr>
        <td><span class="badge b-blue">${r.category}</span></td>
        <td><strong>${r.item}</strong></td>
        <td style="font-size:11px;color:var(--muted)">${r.detail}</td>
        <td>${r.timeline_weeks>0?r.timeline_weeks+' wks':'—'}</td>
        <td>${r.cost_usd>0?'$'+r.cost_usd.toLocaleString():'Free'}</td>
        <td style="font-size:10px;color:var(--faint)">${r.agency_name||r.source||''}</td>
        <td><span class="badge ${pb}">${r.priority}</span></td>
        <td>${applyBtn}</td>
      </tr>`;
    });
    tbl += `</tbody></table>`;
    $('5-t-c').innerHTML = tbl;

    // ── How to Apply cards ────────────────────────────────
    const applyContainer = $('5-a-c');
    if (applyContainer) {
      let applyHtml = `<div style="padding:14px;display:flex;flex-direction:column;gap:14px">`;
      (d.requirements||[]).forEach((r, i) => {
        const pb = r.priority==='Critical'?'b-red':r.priority==='High'?'b-amber':'b-blue';
        const onlineBadge = r.online_available
          ? `<span class="badge b-green" style="font-size:10px">🌐 Online</span>`
          : `<span class="badge b-amber" style="font-size:10px">📄 In-Person / Paper</span>`;
        const stepsHtml = (r.apply_instructions||[]).map(step =>
          `<div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:6px">
            <span style="background:var(--blue-dim);color:var(--blue);border-radius:50%;width:22px;height:22px;min-width:22px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;font-family:'Syne',sans-serif">${step.match(/^\d+/)?step.match(/^\d+/)[0]:'•'}</span>
            <span style="font-size:12px;line-height:1.65;color:var(--text)">${step.replace(/^\d+\.\s*/,'')}</span>
          </div>`
        ).join('');
        const contactRow = [
          r.apply_phone ? `📞 ${r.apply_phone}` : '',
          r.apply_email ? `✉ <a href="mailto:${r.apply_email}" style="color:var(--blue)">${r.apply_email}</a>` : ''
        ].filter(Boolean).join(' &nbsp;·&nbsp; ');

        applyHtml += `
          <div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;overflow:hidden">
            <div style="padding:12px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px;flex-wrap:wrap">
              <span class="badge ${pb}">${r.category}</span>
              ${onlineBadge}
              <strong style="font-size:13px;font-family:'Syne',sans-serif;flex:1;min-width:140px">${r.item}</strong>
              <span style="font-size:11px;color:var(--faint)">${r.timeline_weeks>0?r.timeline_weeks+' wks':''} ${r.cost_usd>0?'· $'+r.cost_usd.toLocaleString():'· Free'}</span>
            </div>
            <div style="padding:12px 14px;display:flex;flex-direction:column;gap:10px">
              <div style="font-size:11px;color:var(--muted)">🏛 <strong>${r.agency_name||r.source||''}</strong></div>
              ${r.form_name ? `<div style="font-size:11px;color:var(--faint)">📋 Form: ${r.form_name}</div>` : ''}
              ${contactRow ? `<div style="font-size:11px;color:var(--muted)">${contactRow}</div>` : ''}
              ${stepsHtml ? `<div style="margin-top:4px">${stepsHtml}</div>` : ''}
              ${r.apply_notes ? `<div style="padding:8px 10px;background:var(--surface3);border-left:3px solid var(--amber);border-radius:0 6px 6px 0;font-size:11px;color:var(--amber);line-height:1.6">⚠ ${r.apply_notes}</div>` : ''}
              <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px">
                ${r.apply_url ? `<a href="${r.apply_url}" target="_blank" class="link-btn primary-btn" style="font-size:12px">↗ Go to Application Portal</a>` : ''}
              </div>
            </div>
          </div>`;
      });
      applyHtml += `</div>`;
      applyContainer.innerHTML = applyHtml;
    }

    // ── Timeline chart ────────────────────────────────────
    killChart('ch-5');
    const ctx=$('ch-5').getContext('2d');
    charts['ch-5']=new Chart(ctx,{type:'bar',data:{
      labels:(d.timeline_phases||[]).map(p=>p.phase),
      datasets:[{label:'Weeks',data:(d.timeline_phases||[]).map(p=>p.weeks),backgroundColor:['rgba(74,158,255,0.7)','rgba(61,214,140,0.7)','rgba(245,166,35,0.7)','rgba(167,139,250,0.7)','rgba(45,212,191,0.7)','rgba(255,95,95,0.7)','rgba(74,158,255,0.5)'],borderWidth:0,borderRadius:4}]
    },options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>` ${c.raw} weeks — ${(d.timeline_phases||[])[c.dataIndex]?.tasks||''}`}}},scales:{x:{ticks:{color:'#8a8d96'},grid:{color:'#2a2d35'}},y:{ticks:{color:'#8a8d96',font:{size:10}},grid:{color:'#2a2d35'}}}}});

    setDot(5,'done'); showOut(5);
    return JSON.stringify(d);
  } catch(e){setDot(5,'error');showOut(5);$('5-s-t').textContent='Error: '+e.message;throw e}
}

// ══════════════════════════════════════════════════════════
// AGENT 6 — Competitor Analysis (Live Search)
// ══════════════════════════════════════════════════════════
