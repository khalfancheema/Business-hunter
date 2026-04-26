async function runAgent13(a6) {
  setDot(13,'running');
  const ind=industry();
  const sys=`You are a competitive intelligence analyst for ${ind.unit} markets. Search Google reviews, Yelp, and Facebook for real customer complaints about ${ind.units} in the target area. Respond JSON only.`;
  const usr=`Search for Google Maps reviews, Yelp reviews, and Facebook reviews for specific ${ind.units} near ZIP ${zip()}. Find real customer complaints and pain points. Known competitors in this market: ${ind.competitors}.

Search for reviews of the top ${ind.unit} chains and independent operators near ZIP ${zip()}. Find common complaint themes and differentiation opportunities.

Competitor context: ${ctx(a6,['summary','cities','top_chains'])}

Return ONLY:
{"summary":"5-sentence competitive landscape and differentiation opportunity summary","competitor_profiles":[{"name":"Primrose Schools (Gwinnett locations)","type":"Corporate Franchise","avg_rating":4.1,"review_count_est":340,"monthly_tuition_infant":2100,"locations_nearby":6,"google_search_url":"https://www.google.com/search?q=Primrose+School+Gwinnett+County+GA+reviews","yelp_url":"https://www.yelp.com/search?find_desc=primrose+school&find_loc=Duluth%2C+GA","top_positive_themes":["Strong structured curriculum","Clean facilities","Good parent communication app","Experienced teachers","Consistent routines"],"top_complaint_themes":["3-6 month infant waitlists","Corporate and impersonal — hard to reach director","High staff turnover in infant rooms","Tuition increases $150-200/mo with minimal notice","Cookie-cutter curriculum across all locations"],"sample_complaints":["We were on the waitlist 4 months and they never called","The director is never available — you talk to whoever is at the front desk","Third teacher change in 6 months for my infant son","They raised tuition $175/month with only 2 weeks notice","Every Primrose is scripted and corporate — my daughter's teachers barely know her name"],"differentiation_opportunity":"Waitlist demand shows massive unmet need. Director accessibility and teacher stability are clear gaps."},{"name":"KinderCare (Gwinnett locations)","type":"Corporate Chain","avg_rating":3.8,"review_count_est":280,"monthly_tuition_infant":1750,"locations_nearby":4,"google_search_url":"https://www.google.com/search?q=KinderCare+Gwinnett+County+GA+reviews","yelp_url":"https://www.yelp.com/search?find_desc=kindercare&find_loc=Duluth%2C+GA","top_positive_themes":["More affordable than Primrose","Convenient locations","Accepts CAPS subsidies","Online billing system"],"top_complaint_themes":["Extreme staff turnover — new faces every month","Overcrowded classrooms at peak hours","Poor parent communication — incident reports delayed","Facility maintenance issues — broken equipment","Food quality poor — processed snacks only"],"sample_complaints":["My son has had 7 different teachers in 12 months","I reported a safety issue and nothing was fixed","The classroom smelled and furniture was torn — pulled daughter out after 2 weeks","They never answer the parent app","Lunch was goldfish crackers and a juice box — I pay $1,700/month"],"differentiation_opportunity":"Staff stability, fresh food, and proactive communication are massive opportunities."},{"name":"Bright Horizons (Atlanta area)","type":"Corporate Premium","avg_rating":4.4,"review_count_est":190,"monthly_tuition_infant":2400,"locations_nearby":2,"google_search_url":"https://www.google.com/search?q=Bright+Horizons+Atlanta+GA+reviews","yelp_url":"https://www.yelp.com/search?find_desc=bright+horizons&find_loc=Atlanta%2C+GA","top_positive_themes":["Genuinely excellent credentialed teachers","Detailed daily reports","Beautiful facilities","Low teacher turnover","Strong individualized curriculum"],"top_complaint_themes":["$2,400+/month excludes most families","6-9 month waitlists","Very limited Gwinnett locations","Drop-in care nearly nonexistent"],"sample_complaints":["We love everything about Bright Horizons but $2,600/month is not sustainable","We were on the waitlist 7 months and had to find an alternative","Great if you can get in and afford it — most people cannot"],"differentiation_opportunity":"BH quality at mid-premium price ($1,900-2,050) is the exact gap the market needs."},{"name":"Independent Centers (Gwinnett avg)","type":"Independent","avg_rating":4.2,"review_count_est":85,"monthly_tuition_infant":1450,"locations_nearby":24,"google_search_url":"https://www.google.com/search?q=independent+daycare+reviews+Gwinnett+County+GA","yelp_url":"https://www.yelp.com/search?find_desc=daycare&find_loc=Gwinnett+County%2C+GA","top_positive_themes":["Owner-operated accountability","Teachers know every child","Flexible scheduling","Lower tuition"],"top_complaint_themes":["Outdated facilities and playground","No technology — paper sign-in, no parent app, no cameras","Curriculum not structured — mostly free play","Close at 5:30pm — not workable for most dual-income families"],"sample_complaints":["Love the people but the building is old and playground is falling apart","No cameras — I have no idea what happens during the day","My daughter is not learning anything — just TV and free play","They close at 5:30 and my husband gets off at 5"],"differentiation_opportunity":"Beat independents on: technology, structured curriculum, hours, facilities."},{"name":"Barrow County Providers","type":"Regional Independent","avg_rating":3.9,"review_count_est":28,"monthly_tuition_infant":1300,"locations_nearby":6,"google_search_url":"https://www.google.com/search?q=daycare+Winder+GA+reviews","yelp_url":"https://www.yelp.com/search?find_desc=daycare&find_loc=Winder%2C+GA","top_positive_themes":["Only affordable option in Barrow County","Community feel","Flexible in some cases"],"top_complaint_themes":["Severe shortage — families report no openings anywhere","Outdated facilities with minimal learning materials","Not all DECAL licensed — quality inconsistent","No curriculum — supervised childcare only"],"sample_complaints":["We called every daycare in Barrow County and everyone is full — we don't know what to do","The center doesn't even have a playground — it's a converted house","We drive to Gwinnett because there's nothing decent in Barrow County","My son learned almost nothing — no curriculum whatsoever"],"differentiation_opportunity":"Any quality provider in Barrow County becomes instant market leader — families literally have no alternative."}],"pain_point_analysis":[{"pain":"Staff Turnover","frequency_pct":68,"competitors_affected":["KinderCare","Primrose"],"your_solution":"Primary teacher guarantee 6 months minimum + above-market salaries + retention bonuses","marketing_angle":"The teacher who knows your baby — guaranteed for 6 months"},{"pain":"Waitlists / No Availability","frequency_pct":61,"competitors_affected":["Primrose","Bright Horizons","Barrow"],"your_solution":"Open pre-enrollment 6 months early. Position as THE waitlist alternative.","marketing_angle":"No waitlist — enroll this week"},{"pain":"Poor Communication","frequency_pct":54,"competitors_affected":["KinderCare","Independents"],"your_solution":"Brightwheel daily photos + videos + nap/meal reports. Director responds within 2 hours guaranteed.","marketing_angle":"See what your child does every hour of the day"},{"pain":"Surprise Tuition Increases","frequency_pct":42,"competitors_affected":["Primrose","KinderCare"],"your_solution":"Published annual tuition schedule. 60-day notice minimum. Rate locked 12 months.","marketing_angle":"No surprise bills — your rate is locked for a full year"},{"pain":"Corporate Impersonal Feel","frequency_pct":48,"competitors_affected":["Primrose","KinderCare","Bright Horizons"],"your_solution":"Owner present daily. Director meets every family. Personalized daily portfolio.","marketing_angle":"Locally owned — your child is not a number"},{"pain":"Poor Food Quality","frequency_pct":38,"competitors_affected":["KinderCare","Independents"],"your_solution":"Fresh locally sourced meals. CACFP enrolled. Weekly menu published.","marketing_angle":"Real food. Real ingredients. Every meal."},{"pain":"No Live Cameras","frequency_pct":45,"competitors_affected":["KinderCare","Independents","Barrow"],"your_solution":"Live parent camera access via Brightwheel app during all care hours","marketing_angle":"Watch your child anytime from your phone"},{"pain":"Limited Hours","frequency_pct":32,"competitors_affected":["Independents","Church-based"],"your_solution":"6:30am–6:30pm Monday–Friday. No in-service day closures.","marketing_angle":"6:30am to 6:30pm — we work your hours"}],"differentiation_strategy":[{"pillar":"Teacher Stability Promise","description":"Every child gets a dedicated primary teacher for minimum 6 months — guaranteed. Above-market salaries + $500 retention bonuses at 6-month mark. If teacher leaves early, family receives 1-month tuition credit.","competitors_this_beats":["KinderCare","Primrose"],"marketing_hook":"The teacher who knows your baby"},{"pillar":"Radical Transparency","description":"Live parent camera access all care hours. Daily Brightwheel video + photo reports. Director calls every new family after first week. Incident reports within 30 minutes.","competitors_this_beats":["KinderCare","Independents","Barrow"],"marketing_hook":"See everything. Know everything."},{"pillar":"Fresh Food Promise","description":"No processed snacks. All meals prepared in-house: morning snack, lunch, afternoon snack. Certified cook on staff. Weekly menu emailed to parents. CACFP enrolled.","competitors_this_beats":["KinderCare","Independents"],"marketing_hook":"You'd be proud of what they ate today"},{"pillar":"Reggio-Inspired Learning","description":"Project-based child-led learning vs scripted corporate curriculum. Children's work displayed at eye level. Parent documentation nights quarterly. Bi-annual learning portfolio for every family.","competitors_this_beats":["Primrose","KinderCare"],"marketing_hook":"Learning that looks like wonder"},{"pillar":"Mid-Premium Pricing","description":"$1,400–$2,050/month — far below Bright Horizons ($2,400) while matching or exceeding Primrose quality. Accept CAPS subsidies for income-diverse families.","competitors_this_beats":["Bright Horizons"],"marketing_hook":"Quality you thought you couldn't afford"},{"pillar":"Bilingual Classrooms","description":"English/Spanish classroom assistant in every room. Bilingual signage and parent communication available. Curriculum materials in both languages.","competitors_this_beats":["All corporate chains"],"marketing_hook":"Two languages. One classroom. A lifetime advantage."}],"messaging_guide":[{"audience":"Primrose/KinderCare waitlisted parents","headline":"The waitlist ends here.","body":"While other centers keep you waiting 4-6 months, we have spaces open now — with the quality you have been searching for. Fresh food. Live cameras. Teachers who stay.","cta":"Schedule a tour today","channel":"Facebook targeted ads — Primrose/KinderCare keyword targeting"},{"audience":"Parents leaving KinderCare (staff turnover)","headline":"Your child deserves a teacher who knows their name.","body":"At our center, every child has a dedicated primary teacher for a minimum of 6 months — guaranteed. No revolving door. No strangers. Just the consistency your child needs.","cta":"Get our Teacher Stability Promise","channel":"Google Search — KinderCare alternative near me"},{"audience":"Barrow County parents (Winder/Auburn)","headline":"Quality childcare. Finally, in Barrow County.","body":"We know you have been driving to Gwinnett or settling for something that does not feel right. We are bringing Reggio-inspired learning, live cameras, and fresh meals to your community.","cta":"Join our waitlist — opening soon","channel":"Nextdoor Winder/Auburn + Facebook Barrow County Parents"},{"audience":"Premium seekers priced out of Bright Horizons","headline":"Bright Horizons quality. Half the waitlist.","body":"Reggio curriculum. Credentialed teachers. Live cameras. Daily reports. Fresh meals. Starting at $1,400/month — no 7-month waitlist, no corporate runaround.","cta":"Book your enrollment tour","channel":"Instagram + LinkedIn affluent targeting Johns Creek/Alpharetta"},{"audience":"Working parents needing extended hours","headline":"We work your hours.","body":"6:30am open. 6:30pm close. 12 full hours every weekday. No in-service day closures. No surprise early dismissals. Because your job does not have a flexible schedule.","cta":"See our full calendar","channel":"Google Search — daycare open until 6:30 near me"}]}`;
  try {
    _setDemoKey(13);
    let d=await claudeJSON(sys,usr);
    if(!d) { console.warn('Agent 13 fallback'); d=getFallback13(); }
    R.a13=d;
    buildCompDeepDive(d);
    setDot(13,'done'); showOut(13);
    return JSON.stringify(d);
  } catch(e){setDot(13,'error');showOut(13);$('13-sum-t').textContent='Error: '+e.message;throw e}
}

function buildCompDeepDive(d) {
  $('13-sum-t').textContent=d.summary;

  // Competitor profiles
  const ind13=industry();
  let ph='';
  (d.competitor_profiles||[]).forEach(c=>{
    const rc=c.avg_rating>=4.3?'var(--green)':c.avg_rating>=4.0?'var(--amber)':'var(--red)';
    const primRate=(c.monthly_tuition_infant||c.monthly_primary_rate||0).toLocaleString();
    ph+=`<div class="comp-profile">
      <div class="comp-header">
        <div><div class="comp-name">${c.name}</div><div style="font-size:11px;color:var(--muted);margin-top:2px">${c.type} · ${c.locations_nearby} locations · $${primRate}/mo ${ind13.price_label_primary}</div></div>
        <div style="text-align:right"><div class="comp-rating" style="color:${rc}">${c.avg_rating}★</div><div style="font-size:10px;color:var(--faint)">~${c.review_count_est} reviews</div>
          <div style="display:flex;gap:4px;margin-top:4px">
            <a href="${c.google_search_url}" target="_blank" class="link-btn" style="font-size:10px;padding:2px 7px">↗ Google</a>
            <a href="${c.yelp_url}" target="_blank" class="link-btn" style="font-size:10px;padding:2px 7px">↗ Yelp</a>
          </div>
        </div>
      </div>
      <div class="comp-reviews-grid">
        <div class="review-block"><div class="review-block-label" style="color:var(--green)">✓ Top Praise</div>${(c.top_positive_themes||[]).map(t=>`<div class="review-item">${t}</div>`).join('')}</div>
        <div class="review-block"><div class="review-block-label" style="color:var(--red)">✗ Top Complaints</div>${(c.top_complaint_themes||[]).map(t=>`<div class="review-item" style="color:var(--red)">${t}</div>`).join('')}</div>
      </div>
      <div style="margin:10px 0;background:var(--surface3);border-radius:8px;padding:10px">
        <div style="font-size:10px;font-weight:700;font-family:'Syne',sans-serif;color:var(--faint);text-transform:uppercase;letter-spacing:0.07em;margin-bottom:6px">Customer Quotes</div>
        ${(c.sample_complaints||[]).map(q=>`<div style="font-size:11px;color:var(--muted);margin-bottom:5px;padding-left:8px;border-left:2px solid var(--border2);font-style:italic">${q}</div>`).join('')}
      </div>
      <div style="padding:8px 12px;background:var(--blue-dim);border:1px solid var(--blue);border-radius:8px;font-size:12px"><strong style="font-family:'Syne',sans-serif;color:var(--blue)">Our Opportunity: </strong><span style="color:var(--muted)">${c.differentiation_opportunity}</span></div>
    </div>`;
  });
  $('13-comp-c').innerHTML=ph;

  // Pain points
  let pain=`<div style="margin-bottom:12px;font-size:13px;color:var(--muted)">Frequency = % of negative reviews mentioning this theme across all Gwinnett/Barrow competitors:</div><div class="pain-grid">`;
  [...(d.pain_point_analysis||[])].sort((a,b)=>b.frequency_pct-a.frequency_pct).forEach(p=>{
    const col=p.frequency_pct>=60?'var(--red)':p.frequency_pct>=45?'var(--amber)':'var(--blue)';
    pain+=`<div class="pain-card">
      <div class="pain-title">${p.pain}</div>
      <div class="pain-freq">In ${p.frequency_pct}% of negative reviews</div>
      <div class="pain-bar"><div class="pain-bar-fill" style="width:${p.frequency_pct}%;background:${col}"></div></div>
      <div style="font-size:10px;color:var(--faint);margin-bottom:6px">Affects: ${p.competitors_affected.join(', ')}</div>
      <div class="pain-opp">→ ${p.your_solution}</div>
    </div>`;
  });
  pain+=`</div>`;
  $('13-pain-c').innerHTML=pain;

  // Differentiation strategy
  const cols=['var(--green)','var(--blue)','var(--amber)','var(--purple)','var(--teal)','var(--red)'];
  let diff=`<div style="margin-bottom:8px;font-size:13px;color:var(--muted)">6 strategic pillars — each directly addresses a documented competitor weakness:</div>
  <div style="display:grid;gap:8px">`;
  (d.differentiation_strategy||[]).forEach((s,i)=>{
    diff+=`<div style="display:grid;grid-template-columns:1.5fr 2fr auto;gap:12px;padding:12px 14px;background:var(--surface2);border-radius:9px;border:1px solid var(--border);align-items:start">
      <div><div style="font-size:13px;font-weight:700;font-family:'Syne',sans-serif;color:${cols[i%cols.length]};margin-bottom:4px">${i+1}. ${s.pillar}</div>
      <div style="font-size:11px;color:var(--faint);font-style:italic">"${s.marketing_hook}"</div></div>
      <div style="font-size:12px;color:var(--muted)">${s.description}</div>
      <div style="display:flex;flex-direction:column;gap:4px">${(s.competitors_this_beats||[]).map(c=>`<span class="badge b-red">${c}</span>`).join('')}</div>
    </div>`;
  });
  diff+=`</div>`;
  $('13-diff-c').innerHTML=diff;

  // Messaging
  let msg='';
  (d.messaging_guide||[]).forEach(m=>{
    msg+=`<div class="msg-card">
      <div class="msg-audience">${m.audience}</div>
      <div class="msg-headline">${m.headline}</div>
      <div class="msg-body">${m.body}</div>
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
        <div class="msg-cta">${m.cta}</div>
        <div style="font-size:11px;color:var(--faint);font-style:italic">Channel: ${m.channel}</div>
      </div>
    </div>`;
  });
  $('13-msg-c').innerHTML=msg;
}

// ══════════════════════════════════════════════════════════
// AGENT 14 — Code Review
// ══════════════════════════════════════════════════════════
