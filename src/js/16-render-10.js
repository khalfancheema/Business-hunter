async function runAgent10(a3,a4,a5,a7,a9) {
  setDot(10,'running');
  const ind=industry();
  const sys=`You are a senior project manager specializing in ${ind.unit} launches. You create detailed, actionable project plans. Respond JSON only.`;
  const usr=`Create a comprehensive 18-month project execution plan to open a ${ind.unit} (${ind.capacity_label}: ${capacity()}) near ZIP ${zip()}, budget $${parseInt(budget()).toLocaleString()}.

SITE SELECTION: ${ctx(a3,['summary','locations'])}
REAL ESTATE: ${ctx(a4,['summary','by_city_summary'])}
COMPLIANCE: ${ctx(a5,['summary','requirements','timeline_phases'])}
FINANCIALS: ${ctx(a7,['summary','scenarios','startup_breakdown'])}
BUSINESS PLAN: ${ctx(a9,['executive_summary','financial_plan','operations_plan'])}

Return ONLY:
{
  "project_name": "Bright Futures Early Learning Center — Launch",
  "total_duration_months": 18,
  "target_open_date": "Month 19 from project start",
  "phases": [
    {
      "phase": "Phase 1: Foundation & Funding",
      "months": "1-3",
      "color": "#4a9eff",
      "tasks": [
        {"task":"Form Georgia LLC","month_start":1,"duration":0.5,"owner":"Owner","priority":"Critical","cost":150,"detail":"File Articles of Organization at sos.ga.gov ($100). Draft operating agreement. Appoint registered agent.","links":["https://sos.ga.gov/page/business-formation"]},
        {"task":"Obtain EIN from IRS","month_start":1,"duration":0.25,"owner":"Owner","priority":"Critical","cost":0,"detail":"Apply online at IRS.gov — free, instant. Required for banking and SBA.","links":["https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online"]},
        {"task":"Open Business Bank Account","month_start":1,"duration":0.5,"owner":"Owner","priority":"Critical","cost":0,"detail":"Truist or Regions preferred (active SBA lenders). Bring LLC docs, EIN, ID.","links":[]},
        {"task":"Engage SBA Lender — Pre-Qualification","month_start":1,"duration":2,"owner":"Owner + CPA","priority":"Critical","cost":0,"detail":"Contact Live Oak Bank (childcare specialist), Truist SBA, or Regions Bank. Submit personal financial statement, credit check, business plan draft.","links":["https://www.liveoak.bank","https://www.truist.com/loans/small-business/sba"]},
        {"task":"Hire CPA (Childcare Experience)","month_start":1,"duration":1,"owner":"Owner","priority":"High","cost":3600,"detail":"Annual engagement. Needs childcare industry experience. Will prepare financial projections for SBA, set up QuickBooks.","links":[]},
        {"task":"Hire Attorney (Business + Real Estate)","month_start":1,"duration":1,"owner":"Owner","priority":"High","cost":5000,"detail":"Review lease, LLC docs, employment agreements. Gwinnett County preferred.","links":[]},
        {"task":"Engage Georgia SBDC","month_start":1,"duration":1,"owner":"Owner","priority":"Medium","cost":0,"detail":"Free mentorship from Georgia SBDC. Gwinnett office: 678-985-6840. Will help refine business plan and financial projections for SBA.","links":["https://georgiasbdc.org"]},
        {"task":"Engage Commercial Real Estate Broker","month_start":1,"duration":1,"owner":"Owner","priority":"Critical","cost":0,"detail":"Broker commission paid by landlord. Specify: childcare use, C-1/C-2 zoning, 6,500–9,000 sqft, outdoor play space, Suwanee/Sugar Hill/Buford/Winder target areas.","links":["https://www.loopnet.com","https://www.crexi.com"]},
        {"task":"Tour Target Properties","month_start":2,"duration":1,"owner":"Owner + Broker","priority":"Critical","cost":0,"detail":"Tour minimum 5 properties. Evaluate: zoning certificate, outdoor footprint, parking, visibility, HVAC, plumbing for diaper stations and kitchen.","links":[]},
        {"task":"DECAL Pre-Application Consultation","month_start":2,"duration":1,"owner":"Owner + DECAL Consultant","priority":"Critical","cost":1500,"detail":"Hire DECAL consultant before signing lease. They will review your floor plan concept against Rules Chapter 591-1 requirements. Prevents costly mistakes.","links":["https://decal.ga.gov"]},
        {"task":"SBA Loan Package Submission","month_start":2,"duration":2,"owner":"Owner + CPA + Attorney","priority":"Critical","cost":0,"detail":"Submit full SBA 7(a) package: Form 1919, Form 413, business plan, financial projections, personal tax returns, credit authorization, lease LOI.","links":["https://www.sba.gov/document/sba-form-1919-borrower-information-form"]},
        {"task":"Letter of Intent — Target Lease","month_start":2,"duration":0.5,"owner":"Owner + Broker + Attorney","priority":"Critical","cost":500,"detail":"Non-binding LOI on top property. Negotiate: 5-year lease + 2 five-year options, TI allowance ($25-$50/sqft), 3-month free rent, CAP on NNN increases.","links":[]},
        {"task":"SBA Loan Approval","month_start":3,"duration":1,"owner":"Lender","priority":"Critical","cost":8000,"detail":"SBA approval typically 60-90 days from complete package. Closing costs ~1.5-2% of loan. Budget $8,000.","links":[]}
      ]
    },
    {
      "phase": "Phase 2: Legal, Lease & Design",
      "months": "3-6",
      "color": "#3dd68c",
      "tasks": [
        {"task":"Execute Commercial Lease","month_start":3,"duration":0.5,"owner":"Owner + Attorney","priority":"Critical","cost":42000,"detail":"Sign lease. Pay security deposit (3 months) and first/last month rent. Confirm Tenant Improvement allowance in writing.","links":[]},
        {"task":"Hire Licensed Architect","month_start":3,"duration":1,"owner":"Owner","priority":"Critical","cost":18000,"detail":"Architect must be familiar with Georgia childcare licensing. Will produce DECAL-compliant drawings: 35 sqft/child indoor, 75 sqft/child outdoor, fire egress, handwashing stations at each room entrance.","links":[]},
        {"task":"Architectural Drawing Review by DECAL","month_start":4,"duration":1,"owner":"Architect + Owner","priority":"Critical","cost":0,"detail":"Submit preliminary drawings to DECAL for informal review before permit submission. Prevents permit rejection.","links":["https://decal.ga.gov"]},
        {"task":"Apply for Building Permit","month_start":4,"duration":1,"owner":"Architect + Owner","priority":"Critical","cost":3500,"detail":"Submit to county building department. Change-of-occupancy permits often take 4-6 weeks. Start ASAP.","links":[]},
        {"task":"Zoning Certificate / Use Permit","month_start":3,"duration":1,"owner":"Owner + Attorney","priority":"Critical","cost":500,"detail":"Confirm childcare use permitted at specific address. Gwinnett County: 678-518-6000. Barrow County: 770-307-3000.","links":["https://www.gwinnettcounty.com"]},
        {"task":"Collect 2-3 Construction Bids","month_start":4,"duration":1,"owner":"Owner","priority":"Critical","cost":0,"detail":"Provide architect drawings to 3 licensed contractors. Specify: HVAC zoning, diaper stations, commercial kitchen, playground prep, security camera rough-in.","links":[]},
        {"task":"Select General Contractor","month_start":5,"duration":0.5,"owner":"Owner + Attorney","priority":"Critical","cost":0,"detail":"Review bids. Check license at sos.ga.gov. Check references (other childcare builds preferred). Execute AIA-standard contract with draw schedule.","links":[]},
        {"task":"DECAL Pre-Application Submission","month_start":5,"duration":1,"owner":"Owner + DECAL Consultant","priority":"Critical","cost":50,"detail":"Submit Form 282 pre-application to DECAL. Includes: business ownership, location, age groups, capacity, director information.","links":["https://decal.ga.gov/BftS/Home.aspx"]},
        {"task":"Order Playground Equipment","month_start":5,"duration":2,"owner":"Owner","priority":"High","cost":48000,"detail":"Lead time: 8-12 weeks. Must meet ASTM F1487 safety standards. Get 3 quotes. Vendors: Playworld, Landscape Structures, GameTime.","links":["https://www.playworld.com","https://www.playlsi.com"]},
        {"task":"Design Interior Classroom Layout","month_start":5,"duration":1,"owner":"Owner + Architect","priority":"High","cost":0,"detail":"Per Reggio approach: interest centers, natural lighting, low shelving, child-level displays. Each room needs: handwashing sink, diaper station (infant/toddler), reading corner, sensory table.","links":[]}
      ]
    },
    {
      "phase": "Phase 3: Construction & Licensing",
      "months": "6-12",
      "color": "#f5a623",
      "tasks": [
        {"task":"Construction / Build-Out Begins","month_start":6,"duration":4,"owner":"General Contractor","priority":"Critical","cost":185000,"detail":"Typical build-out: 14-18 weeks. Monitor weekly. Key milestones: rough-in complete (week 4), drywall (week 8), paint/flooring (week 12), punch list (week 16).","links":[]},
        {"task":"Background Checks — All Staff","month_start":7,"duration":2,"owner":"Owner + Director","priority":"Critical","cost":60,"detail":"FBI + GBI fingerprinting required for all owners, director, teachers, assistants, cooks, volunteers. Average 3 weeks processing. Use Cogent Systems (DECAL approved).","links":["https://decal.ga.gov"]},
        {"task":"Hire Center Director","month_start":7,"duration":2,"owner":"Owner","priority":"Critical","cost":0,"detail":"Must hold: BA in ECE, Child Development or related field + 2 years director experience, OR CDA + 5 years experience. DECAL lists director on license — they are legally responsible. Start recruiting on Indeed, LinkedIn, Georgia ECE job boards.","links":["https://www.indeed.com","https://www.linkedin.com/jobs"]},
        {"task":"DECAL Full Application Submission","month_start":8,"duration":2,"owner":"Owner + Director + DECAL Consultant","priority":"Critical","cost":500,"detail":"Complete Form 282 with: director's credentials, staff list, background check results, insurance proof, floor plan (approved), proof of zoning compliance. Pay license fee $50.","links":["https://decal.ga.gov/BftS/Home.aspx"]},
        {"task":"Fire Marshal Inspection","month_start":10,"duration":1,"owner":"Owner + Contractor","priority":"Critical","cost":0,"detail":"Schedule with local fire marshal after construction complete. They check: egress routes, fire suppression, extinguishers, smoke detectors, exit signage, door hardware.","links":[]},
        {"task":"County Health Inspection","month_start":10,"duration":1,"owner":"Owner + Director","priority":"Critical","cost":0,"detail":"Gwinnett Environmental Health: 770-963-5132. Inspects: kitchen, food storage, handwashing stations, diaper changing procedures, bathroom facilities.","links":[]},
        {"task":"Purchase Indoor FF&E","month_start":9,"duration":2,"owner":"Owner + Director","priority":"High","cost":92000,"detail":"Source: Whitney Brothers, Lakeshore Learning, Kaplan Early Learning. Budget by room: Infant $18K, Toddler $14K, Preschool $12K×2, Pre-K $12K×2, Common areas $12K, Kitchen $12K.","links":["https://www.whitneybros.com","https://www.lakeshorelearning.com"]},
        {"task":"Install Technology & Security","month_start":10,"duration":1,"owner":"Technology Vendor","priority":"High","cost":14000,"detail":"IP camera system (parent access via Brightwheel), door access control (keypad), intercom system, WiFi access points. Vendor: ADT Business, Verkada, or local integrator.","links":["https://www.brightwheel.com"]},
        {"task":"Playground Installation","month_start":10,"duration":2,"owner":"Playground Vendor","priority":"High","cost":0,"detail":"Install on certified surfacing (engineered wood fiber or rubber). Requires third-party CPSI inspection before use.","links":[]},
        {"task":"Set Up Brightwheel / Procare","month_start":10,"duration":1,"owner":"Director + Admin","priority":"High","cost":2400,"detail":"Configure parent communication platform, billing module, attendance tracking, daily reports. Train all staff before opening.","links":["https://mybrightwheel.com"]}
      ]
    },
    {
      "phase": "Phase 4: Staffing & Pre-Opening",
      "months": "12-16",
      "color": "#a78bfa",
      "tasks": [
        {"task":"Hire Lead Teachers (all rooms)","month_start":12,"duration":2,"owner":"Director","priority":"Critical","cost":0,"detail":"6 lead teachers. Post on Indeed, Handshake (college boards), local ECE Facebook groups. Offer signing bonus of $500-$1,000 if needed. Georgia average teacher salary: $32-$42K.","links":["https://www.indeed.com/q-child-care-teacher-l-gwinnett-county-ga-jobs.html"]},
        {"task":"Hire Support Staff","month_start":13,"duration":2,"owner":"Director","priority":"High","cost":0,"detail":"5 teacher assistants, 1 cook, 1 administrative coordinator. Consider part-time for assistants initially.","links":[]},
        {"task":"Staff CPR & First Aid Training","month_start":14,"duration":1,"owner":"Director","priority":"Critical","cost":900,"detail":"All staff certified before opening. Red Cross or American Heart. Pediatric CPR required for infant/toddler staff.","links":["https://www.redcross.org/take-a-class"]},
        {"task":"Staff Orientation & Training","month_start":14,"duration":2,"owner":"Director","priority":"Critical","cost":2000,"detail":"DECAL required: child abuse recognition, mandated reporter training, emergency procedures, GELDS curriculum training, Brightwheel platform, family communication protocols.","links":[]},
        {"task":"DECAL Licensing Site Visit","month_start":14,"duration":1,"owner":"Owner + Director","priority":"Critical","cost":0,"detail":"DECAL licensor visits facility for final inspection. Must pass to receive license. Have all staff on-site, all documentation ready, all rooms set up.","links":[]},
        {"task":"Receive DECAL License","month_start":15,"duration":0,"owner":"DECAL","priority":"Critical","cost":0,"detail":"License issued within 30 days of passing site inspection. Cannot legally operate without it.","links":[]},
        {"task":"CACFP Enrollment","month_start":13,"duration":2,"owner":"Director + Cook","priority":"High","cost":0,"detail":"Child & Adult Care Food Program — federal meal reimbursement program. Apply through Georgia Department of Education. Worth $8-12K/year in reimbursements.","links":["https://www.gadoe.org/School-Improvement/Federal-Programs/Pages/CACFP.aspx"]},
        {"task":"Georgia Quality Rated Application","month_start":14,"duration":2,"owner":"Director","priority":"High","cost":200,"detail":"Target 2-star minimum at opening. Quality Rated status opens access to state subsidies (CAPS vouchers), increases enrollment appeal, and boosts staff recruitment.","links":["https://qualityrated.decal.ga.gov"]},
        {"task":"Pre-Enrollment Marketing Campaign","month_start":12,"duration":4,"owner":"Owner + Director","priority":"High","cost":8000,"detail":"Target: Suwanee Parents Facebook (28K), Gwinnett Moms, NextDoor (Suwanee, Sugar Hill, Buford). Google Ads targeting 'daycare near me' in target ZIPs. Enroll a waitlist 90 days before opening.","links":[]},
        {"task":"Open Waitlist / Pre-Enrollment","month_start":13,"duration":3,"owner":"Owner + Director","priority":"High","cost":0,"detail":"Use Brightwheel or Google Form. Collect: child name, DOB, age group, expected start date, parent contact. Aim for 60+ pre-enrolled before Day 1.","links":[]},
        {"task":"Obtain Liability Insurance Policy","month_start":14,"duration":1,"owner":"Owner","priority":"Critical","cost":9600,"detail":"$1M general liability required by DECAL. Also obtain: commercial property, workers comp, directors & officers, professional liability. Brokers: Assured Partners, AmTrust.","links":[]}
      ]
    },
    {
      "phase": "Phase 5: Soft Open & Ramp",
      "months": "16-18",
      "color": "#2dd4bf",
      "tasks": [
        {"task":"Soft Open — Infants & Toddlers Only","month_start":16,"duration":1,"owner":"Director + All Staff","priority":"Critical","cost":0,"detail":"Open with 50% capacity in infant and toddler rooms only. Iron out operations, communication flows, daily schedule, parent check-in/out procedures, meal timing.","links":[]},
        {"task":"Full Open — All Age Groups","month_start":17,"duration":1,"owner":"Director","priority":"Critical","cost":0,"detail":"Open preschool and pre-K rooms. Begin Georgia Pre-K classroom if certified. Target 60%+ enrollment by end of month 17.","links":[]},
        {"task":"First Health & Safety Audit (Internal)","month_start":17,"duration":0.5,"owner":"Director","priority":"High","cost":0,"detail":"Internal audit of all DECAL compliance items: ratios, supervision, medication log, incident reports, emergency drills (fire, tornado, lockdown).","links":[]},
        {"task":"Parent Orientation Event","month_start":16,"duration":0.5,"owner":"Owner + Director","priority":"High","cost":1500,"detail":"Host open house / orientation for enrolled families. Tour rooms, meet teachers, demonstrate Brightwheel app, review policies, sign enrollment contracts.","links":[]},
        {"task":"Target 78% Enrollment (Break-Even)","month_start":18,"duration":1,"owner":"Owner + Director","priority":"Critical","cost":0,"detail":"Active enrollment management. Follow up with waitlist families. Offer refer-a-friend incentive ($100 tuition credit). Break-even requires 58 enrolled children at average $1,680/month.","links":[]},
        {"task":"First DECAL Annual Review Prep","month_start":18,"duration":1,"owner":"Director","priority":"High","cost":0,"detail":"DECAL conducts annual unannounced inspection. Maintain: current staff files, training records, background checks, incident logs, emergency plans, ratio documentation.","links":[]}
      ]
    }
  ],
  "milestones": [
    {"month":"Week 1","title":"Company Formed — LLC & EIN","detail":"Georgia LLC filed, EIN obtained, business bank account opened","owner":"Owner","priority":"critical"},
    {"month":"Month 1","title":"SBA Lender Engaged","detail":"Pre-qualification meeting with Live Oak Bank or Truist SBA completed","owner":"Owner + CPA","priority":"critical"},
    {"month":"Month 2","title":"Top Property Under LOI","detail":"Letter of Intent executed on target property in Suwanee or Sugar Hill","owner":"Owner + Broker","priority":"critical"},
    {"month":"Month 3","title":"SBA Loan Approved — $400K","detail":"SBA 7(a) approval received. Funds committed.","owner":"Lender","priority":"critical"},
    {"month":"Month 3","title":"Lease Executed","detail":"Commercial lease signed. Tenant Improvement negotiation complete.","owner":"Owner + Attorney","priority":"critical"},
    {"month":"Month 4","title":"Architect Hired & Plans Submitted","detail":"DECAL-compliant architectural drawings submitted for permit","owner":"Architect","priority":"high"},
    {"month":"Month 5","title":"Building Permit Approved","detail":"County building department issues permit. Construction can begin.","owner":"County","priority":"critical"},
    {"month":"Month 6","title":"Construction Begins","detail":"General contractor mobilizes. 16-week build-out starts.","owner":"GC","priority":"critical"},
    {"month":"Month 7","title":"Director Hired","detail":"Center director hired with DECAL-qualifying credentials. Background check submitted.","owner":"Owner","priority":"critical"},
    {"month":"Month 8","title":"DECAL Application Submitted","detail":"Full Form 282 application submitted to Georgia DECAL","owner":"Owner + Director","priority":"critical"},
    {"month":"Month 10","title":"Construction Complete","detail":"Punch list finalized. Fire marshal and health inspections scheduled.","owner":"GC + Owner","priority":"critical"},
    {"month":"Month 11","title":"Fire & Health Inspections Passed","detail":"Both inspections cleared. Final DECAL site visit can be scheduled.","owner":"Owner + Director","priority":"critical"},
    {"month":"Month 12","title":"Pre-Enrollment Opens","detail":"Waitlist and pre-enrollment campaign launches on social media","owner":"Owner + Director","priority":"high"},
    {"month":"Month 13","title":"60+ Pre-Enrolled Families","detail":"Enrollment target for soft-open confidence","owner":"Director","priority":"high"},
    {"month":"Month 14","title":"All Staff Hired & Trained","detail":"Full staff on payroll, CPR certified, DECAL orientation complete","owner":"Director","priority":"critical"},
    {"month":"Month 15","title":"DECAL License Received","detail":"Official Georgia DECAL childcare license issued","owner":"DECAL","priority":"critical"},
    {"month":"Month 16","title":"SOFT OPEN","detail":"Infant and toddler rooms open. Learning operations.","owner":"Director + Staff","priority":"critical"},
    {"month":"Month 17","title":"FULL OPEN","detail":"All age groups operational. Target 60%+ enrollment.","owner":"Director + Staff","priority":"critical"},
    {"month":"Month 18","title":"Break-Even Target","detail":"58 enrolled children / 78% capacity / $97K monthly revenue","owner":"Owner","priority":"critical"}
  ],
  "budget_tracker": [
    {"category":"SBA Loan Closing Costs","budgeted":8000,"phase":"Phase 1","due":"Month 3"},
    {"category":"Attorney & Legal Fees","budgeted":6500,"phase":"Phase 1-2","due":"Month 1-4"},
    {"category":"CPA & Accounting Setup","budgeted":4800,"phase":"Phase 1","due":"Month 1-3"},
    {"category":"DECAL Consultant","budgeted":2000,"phase":"Phase 2-3","due":"Month 2-8"},
    {"category":"Security Deposit + First/Last Rent","budgeted":42000,"phase":"Phase 2","due":"Month 3"},
    {"category":"Architect Fees","budgeted":18000,"phase":"Phase 2","due":"Month 3-5"},
    {"category":"Building Permit","budgeted":3500,"phase":"Phase 2","due":"Month 4"},
    {"category":"Construction / Build-Out","budgeted":185000,"phase":"Phase 3","due":"Month 6-10"},
    {"category":"Playground Equipment & Install","budgeted":48000,"phase":"Phase 3","due":"Month 5-10"},
    {"category":"Indoor FF&E (all rooms)","budgeted":92000,"phase":"Phase 3","due":"Month 9-11"},
    {"category":"Technology & Security Systems","budgeted":14000,"phase":"Phase 3","due":"Month 10"},
    {"category":"DECAL License Fee","budgeted":500,"phase":"Phase 3","due":"Month 8"},
    {"category":"Background Checks (all staff)","budgeted":900,"phase":"Phase 3","due":"Month 7-14"},
    {"category":"Liability Insurance (Year 1)","budgeted":9600,"phase":"Phase 4","due":"Month 14"},
    {"category":"Staff Training & Orientation","budgeted":2900,"phase":"Phase 4","due":"Month 14"},
    {"category":"Pre-Opening Marketing","budgeted":8000,"phase":"Phase 4","due":"Month 12-16"},
    {"category":"Brightwheel / Procare Setup","budgeted":2400,"phase":"Phase 4","due":"Month 10"},
    {"category":"Parent Orientation Event","budgeted":1500,"phase":"Phase 5","due":"Month 16"},
    {"category":"Contingency (5%)","budgeted":24400,"phase":"All","due":"As needed"}
  ],
  "risk_register": [
    {"risk":"SBA loan rejection or delay","probability":"Medium","impact":"Critical","mitigation":"Apply to 2 lenders simultaneously. Have 90-day delay contingency. Live Oak Bank specializes in childcare — higher approval rate.","owner":"Owner + CPA","phase":"Phase 1"},
    {"risk":"Building permit delay (>8 weeks)","probability":"Medium","impact":"High","mitigation":"Submit permit application as soon as architect drawings complete. Hire permit expediter ($1,500). Follow up weekly with building dept.","owner":"Architect + Owner","phase":"Phase 2"},
    {"risk":"DECAL licensing delay","probability":"Medium","impact":"Critical","mitigation":"Hire DECAL consultant Month 1. Submit application Month 8 (giving 7 months buffer). Common rejection reasons: staff credentials, floor plan non-compliance.","owner":"Owner + Director","phase":"Phase 3"},
    {"risk":"Director hire falls through","probability":"Low","impact":"Critical","mitigation":"Begin recruiting Month 7. Budget signing bonus. Partner with Georgia ECE programs. Director must be named on DECAL license — no director = no license.","owner":"Owner","phase":"Phase 3"},
    {"risk":"Construction cost overrun (>15%)","probability":"Medium","impact":"High","mitigation":"10% contingency in budget. Fixed-price GC contract with AIA penalty clause. Monthly owner-architect-contractor meetings.","owner":"GC + Owner","phase":"Phase 3"},
    {"risk":"Low pre-enrollment (<40 families by soft open)","probability":"Low","impact":"High","mitigation":"Start marketing Month 12. Target Facebook parent groups with 28K+ members. Offer early enrollment discount ($100 off first month).","owner":"Owner + Director","phase":"Phase 4"},
    {"risk":"Key competitor opens nearby","probability":"Low","impact":"Medium","mitigation":"Quality differentiation: Reggio curriculum, bilingual staff, live cameras. Lock in location with 5-year lease before competitor signs.","owner":"Owner","phase":"Ongoing"},
    {"risk":"Infant staffing ratio limits revenue","probability":"High","impact":"Medium","mitigation":"Price infant room at premium ($2,050/mo). Limit to 12 infant slots (2 rooms of 6). Use infant revenue to subsidize toddler/preschool ramp-up.","owner":"Director","phase":"Phase 5"}
  ],
  "team_vendors": [
    {"role":"SBA Lender","name":"Live Oak Bank — Childcare Division","contact":"liveoak.bank/childcare","phone":"910-202-8900","type":"Financial","notes":"National leader in childcare SBA loans. Dedicated childcare team."},
    {"role":"SBA Lender (Alt)","name":"Truist Bank SBA Georgia","contact":"truist.com/sba","phone":"800-786-8787","type":"Financial","notes":"Strong Georgia presence. Active SBA 7(a) lender."},
    {"role":"CPA","name":"Georgia SBDC CPA Referral","contact":"georgiasbdc.org","phone":"678-985-6840","type":"Professional","notes":"SBDC can refer CPAs with childcare experience."},
    {"role":"Attorney","name":"Gwinnett County Bar Referral","contact":"gwinnettbar.org","phone":"770-822-8000","type":"Professional","notes":"Request real estate + business formation specialist."},
    {"role":"DECAL Consultant","name":"Georgia DECAL Licensing Consultant","contact":"decal.ga.gov","phone":"888-438-7462","type":"Regulatory","notes":"DECAL hotline can refer approved pre-licensing consultants."},
    {"role":"Commercial RE Broker","name":"Colliers International — Atlanta","contact":"colliers.com/atlanta","phone":"404-888-9000","type":"Real Estate","notes":"Specialize in retail/flex. Active Gwinnett and Barrow listings."},
    {"role":"Architect","name":"Georgia Licensed Childcare Architect","contact":"aia.org/find-an-architect","phone":"","type":"Construction","notes":"Must be familiar with DECAL Rules Chapter 591-1."},
    {"role":"General Contractor","name":"Seek 3 Bids — verify sos.ga.gov","contact":"sos.ga.gov/index.php/licensing","phone":"","type":"Construction","notes":"Verify GC license. Prefer GC with prior childcare build experience."},
    {"role":"Playground Vendor","name":"Playworld Systems","contact":"playworld.com","phone":"800-233-8404","type":"Equipment","notes":"ASTM-certified equipment. 10+ week lead time."},
    {"role":"Childcare Software","name":"Brightwheel","contact":"mybrightwheel.com","phone":"800-287-6457","type":"Technology","notes":"Parent app, billing, attendance, daily reports. #1 in childcare."},
    {"role":"Insurance Broker","name":"Assured Partners — Childcare","contact":"assuredpartners.com","phone":"407-708-0031","type":"Insurance","notes":"Specializes in childcare liability, property, workers comp."},
    {"role":"Georgia SBDC","name":"Gwinnett SBDC","contact":"georgiasbdc.org","phone":"678-985-6840","type":"Support","notes":"Free mentorship, business plan review, lender referrals."}
  ],
  "checklist_phases": [
    {
      "phase":"Month 1-3: Foundation",
      "items":[
        {"task":"File Georgia LLC at sos.ga.gov","owner":"Owner","critical":true},
        {"task":"Obtain EIN from IRS.gov","owner":"Owner","critical":true},
        {"task":"Open business bank account (Truist or Regions)","owner":"Owner","critical":true},
        {"task":"Engage SBA lender for pre-qualification","owner":"Owner","critical":true},
        {"task":"Hire CPA with childcare experience","owner":"Owner","critical":true},
        {"task":"Hire business + real estate attorney","owner":"Owner","critical":true},
        {"task":"Engage Georgia SBDC (free)","owner":"Owner","critical":false},
        {"task":"Engage commercial real estate broker","owner":"Owner","critical":true},
        {"task":"Book DECAL pre-licensing consultation","owner":"Owner","critical":true},
        {"task":"Register with Dun & Bradstreet (dnb.com)","owner":"Owner","critical":false},
        {"task":"Complete SBA Form 1919 & Form 413","owner":"Owner + CPA","critical":true},
        {"task":"Submit SBA loan application package","owner":"Owner + CPA + Attorney","critical":true}
      ]
    },
    {
      "phase":"Month 3-6: Lease & Design",
      "items":[
        {"task":"Execute LOI on target property","owner":"Owner + Broker","critical":true},
        {"task":"SBA loan closing & funding","owner":"Lender","critical":true},
        {"task":"Execute commercial lease (attorney review)","owner":"Owner + Attorney","critical":true},
        {"task":"Obtain zoning use permit for childcare","owner":"Owner","critical":true},
        {"task":"Hire licensed architect (DECAL experience)","owner":"Owner","critical":true},
        {"task":"Submit preliminary plans to DECAL for review","owner":"Architect","critical":true},
        {"task":"Apply for building permit","owner":"Architect","critical":true},
        {"task":"Collect 3 construction bids","owner":"Owner","critical":true},
        {"task":"Order playground equipment (10+ wk lead time)","owner":"Owner","critical":true},
        {"task":"Submit DECAL Form 282 pre-application","owner":"Owner + Director","critical":true}
      ]
    },
    {
      "phase":"Month 6-12: Build & License",
      "items":[
        {"task":"Construction begins — monitor weekly","owner":"Owner + GC","critical":true},
        {"task":"Post Director position on Indeed & LinkedIn","owner":"Owner","critical":true},
        {"task":"Submit background checks for all owners","owner":"Owner","critical":true},
        {"task":"Interview & hire Center Director","owner":"Owner","critical":true},
        {"task":"Submit full DECAL application (Form 282)","owner":"Owner + Director","critical":true},
        {"task":"Construction punch list complete","owner":"GC","critical":true},
        {"task":"Fire marshal inspection scheduled & passed","owner":"Owner","critical":true},
        {"task":"County health inspection scheduled & passed","owner":"Owner + Director","critical":true},
        {"task":"Purchase indoor FF&E (all rooms)","owner":"Owner + Director","critical":true},
        {"task":"Install technology & security systems","owner":"Vendor","critical":true},
        {"task":"Playground installed & CPSI inspected","owner":"Vendor","critical":true},
        {"task":"Apply for CACFP enrollment","owner":"Director","critical":false},
        {"task":"Apply for Georgia Quality Rated","owner":"Director","critical":false}
      ]
    },
    {
      "phase":"Month 12-16: Staffing & Pre-Open",
      "items":[
        {"task":"Launch pre-enrollment marketing campaign","owner":"Owner","critical":true},
        {"task":"Open enrollment waitlist (Brightwheel)","owner":"Director","critical":true},
        {"task":"Post & hire all lead teacher positions","owner":"Director","critical":true},
        {"task":"Post & hire support staff positions","owner":"Director","critical":true},
        {"task":"Complete all staff background checks","owner":"Director","critical":true},
        {"task":"Complete staff CPR & First Aid training","owner":"Director","critical":true},
        {"task":"Complete DECAL mandated reporter training","owner":"Director + All Staff","critical":true},
        {"task":"Schedule & pass DECAL licensing site visit","owner":"Owner + Director","critical":true},
        {"task":"Receive DECAL license","owner":"DECAL","critical":true},
        {"task":"Purchase & activate liability insurance policy","owner":"Owner","critical":true},
        {"task":"Configure Brightwheel — billing, communication","owner":"Director + Admin","critical":true},
        {"task":"Host parent orientation open house","owner":"Owner + Director","critical":false},
        {"task":"Sign enrollment contracts with families","owner":"Director + Admin","critical":true}
      ]
    },
    {
      "phase":"Month 16-18: Open & Ramp",
      "items":[
        {"task":"Soft open — infant & toddler rooms","owner":"Director + Staff","critical":true},
        {"task":"Full open — all age groups","owner":"Director + Staff","critical":true},
        {"task":"Conduct fire & tornado drill (first week)","owner":"Director","critical":true},
        {"task":"Submit first monthly CACFP claim","owner":"Cook + Director","critical":false},
        {"task":"First internal compliance audit","owner":"Director","critical":true},
        {"task":"Hit 58-enrolled break-even target","owner":"Owner + Director","critical":true},
        {"task":"Submit Quality Rated documentation","owner":"Director","critical":false},
        {"task":"Plan Year 2 — expansion or second location?","owner":"Owner","critical":false}
      ]
    }
  ]
}`;
  try {
    let d = await claudeJSON(sys, usr);
    if(!d) { console.warn('Agent 10 fallback'); d=getFallback10(); }
    R.a10 = d;
    renderProjectPlan(d);
    setDot(10,'done'); showOut(10);
    return JSON.stringify(d);
  } catch(e){setDot(10,'error');showOut(10);$('10-gantt-c').innerHTML=`<div class="prose" style="color:var(--red)">Error: ${e.message}</div>`;throw e}
}

function renderProjectPlan(d) {
  // Gantt
  const totalMonths = d.total_duration_months;
  let gantt = `<div class="gantt-wrap"><div class="gantt">
    <div class="gantt-header">
      <div class="gantt-task-col">Task</div>
      <div class="gantt-months" style="grid-template-columns:repeat(${totalMonths},1fr)">`;
  for(let m=1;m<=totalMonths;m++) gantt+=`<div style="text-align:center;font-size:9px;color:var(--faint);font-family:'Syne',sans-serif">M${m}</div>`;
  gantt+=`</div></div>`;
  (d.phases||[]).forEach(phase=>{
    gantt+=`<div class="gantt-phase-sep">${phase.phase} (Mo ${phase.months})</div>`;
    (phase.tasks||[]).forEach(t=>{
      const left=((t.month_start-1)/totalMonths*100).toFixed(1);
      const width=Math.max(2,(t.duration/totalMonths*100)).toFixed(1);
      gantt+=`<div class="gantt-row" title="${t.task} — ${t.detail}">
        <div class="gantt-label">${t.task}<small>${t.owner} · $${(t.cost||0).toLocaleString()}</small></div>
        <div class="gantt-track">
          <div class="gantt-bar" style="left:${left}%;width:${width}%;background:${phase.color};opacity:${t.priority==='Critical'?1:0.7}">${t.duration>=1?t.task:''}</div>
        </div>
      </div>`;
    });
  });
  gantt+=`</div></div>`;
  $('10-gantt-c').innerHTML=gantt;

  // Milestones
  let mile=`<div class="milestone-line">`;
  (d.milestones||[]).forEach(m=>{
    mile+=`<div class="milestone ${m.priority}">
      <div class="milestone-month">${m.month}</div>
      <div class="milestone-title">${m.title}</div>
      <div class="milestone-detail">${m.detail}</div>
      <span class="milestone-owner">${m.owner}</span>
    </div>`;
  });
  mile+=`</div>`;
  $('10-mile-c').innerHTML=mile;

  // Budget tracker
  const total=(d.budget_tracker||[]).reduce((s,i)=>s+(i.budgeted||0),0);
  let bud=`<div style="margin-bottom:12px;padding:10px 14px;background:var(--surface2);border-radius:8px;border:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
    <div style="font-size:13px;font-weight:700;font-family:'Syne',sans-serif">Total Project Budget</div>
    <div style="font-size:22px;font-weight:700;font-family:'Syne',sans-serif;color:var(--blue)">$${total.toLocaleString()}</div>
  </div>
  <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Category</th><th>Budgeted</th><th>Phase</th><th>Due</th><th>% of Total</th></tr></thead><tbody>`;
  (d.budget_tracker||[]).forEach(b=>{
    const pct=(b.budgeted/total*100).toFixed(1);
    bud+=`<tr><td>${b.category}</td><td style="color:var(--amber)">$${b.budgeted.toLocaleString()}</td><td><span class="badge b-blue">${b.phase}</span></td><td style="font-size:11px;color:var(--muted)">${b.due}</td><td><div style="display:flex;align-items:center;gap:8px"><div style="flex:1;height:5px;background:var(--surface3);border-radius:3px;overflow:hidden;min-width:80px"><div style="width:${Math.min(100,pct/35*100)}%;height:100%;background:var(--blue);border-radius:3px"></div></div><span style="font-size:10px;width:36px">${pct}%</span></div></td></tr>`;
  });
  bud+=`</tbody></table></div>`;
  $('10-budget-c').innerHTML=bud;

  // Risk register
  let risk=`<div style="display:grid;grid-template-columns:1fr;gap:8px">
    <div style="display:grid;grid-template-columns:2fr 1fr 1fr 2fr;gap:8px;padding:8px 12px;background:var(--surface2);border-radius:6px;font-size:10px;font-weight:700;font-family:'Syne',sans-serif;color:var(--faint);text-transform:uppercase;letter-spacing:0.07em">
      <div>Risk</div><div>Probability</div><div>Impact</div><div>Mitigation</div>
    </div>`;
  (d.risk_register||[]).forEach(r=>{
    const pb=r.probability==='High'?'b-red':r.probability==='Medium'?'b-amber':'b-green';
    const ib=r.impact==='Critical'?'b-red':r.impact==='High'?'b-amber':'b-blue';
    risk+=`<div class="risk-row">
      <div><div class="risk-title">${r.risk}</div><div class="risk-detail">Phase: ${r.phase} · Owner: ${r.owner}</div></div>
      <div><span class="badge ${pb}">${r.probability}</span></div>
      <div><span class="badge ${ib}">${r.impact}</span></div>
      <div style="font-size:12px;color:var(--muted)">${r.mitigation}</div>
    </div>`;
  });
  risk+=`</div>`;
  $('10-risk-c').innerHTML=risk;

  // Team & Vendors
  let team=`<div class="team-grid">`;
  (d.team_vendors||[]).forEach(v=>{
    const typeCols={'Financial':'b-blue','Professional':'b-purple','Regulatory':'b-amber','Real Estate':'b-green','Construction':'b-red','Equipment':'b-amber','Technology':'b-blue','Insurance':'b-amber','Support':'b-green'};
    const bc=typeCols[v.type]||'b-blue';
    team+=`<div class="team-card">
      <div class="team-role"><span class="badge ${bc}">${v.type}</span></div>
      <div class="team-name">${v.role}</div>
      <div class="team-attrs">
        <strong style="color:var(--text)">${v.name}</strong><br>
        ${v.phone?`<span style="color:var(--blue)">${v.phone}</span><br>`:''}
        ${v.notes}
      </div>
      ${v.contact?`<a href="https://${v.contact.replace(/^https?:\/\//,'')}" target="_blank" class="team-link">↗ ${v.contact}</a>`:''}
    </div>`;
  });
  team+=`</div>`;
  $('10-team-c').innerHTML=team;

  // Checklist with interactive checkboxes
  let check=``;
  (d.checklist_phases||[]).forEach(p=>{
    check+=`<div class="checklist-phase"><h4>${p.phase}</h4>`;
    (p.items||[]).forEach((item,i)=>{
      const id=`chk-${p.phase.replace(/\W/g,'')}-${i}`;
      check+=`<div class="check-item">
        <div class="check-box" id="${id}" onclick="toggleCheck('${id}')" title="Mark complete">${''}</div>
        <div class="check-text">${item.task}${item.critical?` <span class="badge b-red" style="font-size:9px">Critical</span>`:''}</div>
        <div class="check-owner">${item.owner}</div>
      </div>`;
    });
    check+=`</div>`;
  });
  $('10-check-c').innerHTML=check;
}

function toggleCheck(id) {
  const el=$(id);
  const isChecked=el.classList.contains('checked');
  if(isChecked){el.classList.remove('checked');el.textContent='';}
  else{el.classList.add('checked');el.textContent='✓';}
}

// ══════════════════════════════════════════════════════════
// MARKET MAP AGENT (Agent 11)
// ══════════════════════════════════════════════════════════
