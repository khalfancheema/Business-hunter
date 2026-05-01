// ══════════════════════════════════════════════════════════
// 36-demo-data.js — Dedicated static demo data per industry
//
// Replaces the fragile "parse JSON template from prompt" demo
// mode with deterministic, realistic, richly-shaped data.
//
// Usage:
//   getDemoData(agentKey)    → data object for current industry
//   getDemoData(agentKey, 'daycare') → explicit industry key
//
// All objects match the exact JSON schema each render function
// expects — verified against the render functions in 07–21.
// ══════════════════════════════════════════════════════════

function _demoIndKey() {
  try { return (document.getElementById('industrySelect') || {}).value || 'daycare'; }
  catch(e) { return 'daycare'; }
}

function getDemoData(agentKey, industryKey) {
  const key = industryKey || _demoIndKey();
  const agent = DEMO_DATA[agentKey];
  if (!agent) return null;
  return agent[key] || agent['daycare'] || null;
}

// ── Shared city geo used by multiple agents ────────────────
const _DC = {
  suwanee:  { lat:34.0514, lng:-84.0663 },
  sugar:    { lat:34.1029, lng:-84.0547 },
  duluth:   { lat:33.9959, lng:-84.1447 },
  buford:   { lat:34.1215, lng:-83.9913 },
  flowery:  { lat:34.1840, lng:-83.9243 },
};

// ════════════════════════════════════════════════════════════
const DEMO_DATA = {

// ── AGENT 1 — Demographics ───────────────────────────────
1: {
  daycare: {
    summary: "The Gwinnett County corridor shows exceptional childcare demand fundamentals: five high-income suburban cities with median household incomes ranging $78k–$112k, above-average under-5 populations (6.5–7.9%), and dual-income household rates above 67%. Sugar Hill leads 5-year population growth at +18.2%. Suwanee scores highest overall at 92/100 driven by income and working-parent concentration.",
    metro_overview: { metro_name:"Atlanta-Sandy Springs-Alpharetta, GA MSA", metro_pop:6200000, metro_growth_pct:8.4, unemployment_rate:3.1, median_metro_income:74200 },
    cities: [
      { name:"Suwanee",        county:"Gwinnett",       distance_miles:8,  pop_total:21720, pop_under5:1580, pop_under5_pct:7.3, median_hh_income:112400, labor_force_pct:72, pop_growth_pct_5yr:12.4, households:8100, working_parents_est_pct:74, demand_score:92, data_note:"Census ACS 2023" },
      { name:"Sugar Hill",     county:"Gwinnett",       distance_miles:12, pop_total:27800, pop_under5:1890, pop_under5_pct:6.8, median_hh_income:98700,  labor_force_pct:70, pop_growth_pct_5yr:18.2, households:9400, working_parents_est_pct:71, demand_score:88, data_note:"Census ACS 2023" },
      { name:"Duluth",         county:"Gwinnett",       distance_miles:15, pop_total:32100, pop_under5:2100, pop_under5_pct:6.5, median_hh_income:89200,  labor_force_pct:68, pop_growth_pct_5yr:8.6,  households:11200, working_parents_est_pct:69, demand_score:82, data_note:"Census ACS 2023" },
      { name:"Buford",         county:"Gwinnett/Hall",  distance_miles:22, pop_total:17900, pop_under5:1350, pop_under5_pct:7.5, median_hh_income:78400,  labor_force_pct:67, pop_growth_pct_5yr:22.4, households:6200, working_parents_est_pct:68, demand_score:80, data_note:"Census ACS 2023" },
      { name:"Flowery Branch", county:"Hall",           distance_miles:28, pop_total:12400, pop_under5:980,  pop_under5_pct:7.9, median_hh_income:82100,  labor_force_pct:66, pop_growth_pct_5yr:31.8, households:4600, working_parents_est_pct:67, demand_score:78, data_note:"Census ACS 2023" },
    ],
    data_sources: ["US Census ACS 2023 1-year estimates (Tables B01001, B19013, B23025)","BLS QCEW Q3 2024 — Gwinnett/Hall Counties","Census PEP 2023 population estimates","FRED Atlanta MSA unemployment Jan 2025","Georgia ORS birth records 2022 (Gwinnett County)"],
    key_insights: ["Suwanee: $112k median income + 74% working-parent rate = highest ability-to-pay","Sugar Hill: fastest-growing city (+18%) — supply gaps widening faster than new center openings","All 5 cities show under-5 populations 6.5–7.9% vs national avg 5.9%"],
  },
  gas_station: {
    summary: "The search corridor shows high vehicle traffic density with AADT counts exceeding 28,000 on primary arterials. Median household income of $82k supports premium fuel and c-store spending. Population growth averaging 14% over 5 years is expanding the daily driver base.",
    metro_overview: { metro_name:"Atlanta-Sandy Springs-Alpharetta, GA MSA", metro_pop:6200000, metro_growth_pct:8.4, unemployment_rate:3.1, median_metro_income:74200 },
    cities: [
      { name:"Suwanee",        county:"Gwinnett", distance_miles:8,  pop_total:21720, pop_under5:null, pop_under5_pct:null, median_hh_income:112400, labor_force_pct:72, pop_growth_pct_5yr:12.4, households:8100, working_parents_est_pct:74, demand_score:90, aadt_primary:42000, data_note:"Census ACS 2023 + GDOT AADT 2023" },
      { name:"Sugar Hill",     county:"Gwinnett", distance_miles:12, pop_total:27800, pop_under5:null, pop_under5_pct:null, median_hh_income:98700,  labor_force_pct:70, pop_growth_pct_5yr:18.2, households:9400, working_parents_est_pct:71, demand_score:85, aadt_primary:35000, data_note:"Census ACS 2023 + GDOT AADT 2023" },
      { name:"Duluth",         county:"Gwinnett", distance_miles:15, pop_total:32100, pop_under5:null, pop_under5_pct:null, median_hh_income:89200,  labor_force_pct:68, pop_growth_pct_5yr:8.6,  households:11200, working_parents_est_pct:69, demand_score:80, aadt_primary:38000, data_note:"Census ACS 2023 + GDOT AADT 2023" },
    ],
    data_sources: ["US Census ACS 2023","GDOT Annual Average Daily Traffic 2023","BLS CES fuel spending by income tier 2024"],
    key_insights: ["Suwanee I-85 access corridor shows highest AADT at 42k/day","Sugar Hill fastest-growing — new residential subdivisions adding 800+ homes/yr","Duluth offers existing commercial pads with UST-cleared sites"],
  },
  laundromat: {
    summary: "The corridor shows strong laundromat demand indicators: dense apartment and rental housing stock (28–35% renter-occupied), moderate median incomes supporting coin-op pricing, and limited modern self-service laundry competition.",
    metro_overview: { metro_name:"Atlanta-Sandy Springs-Alpharetta, GA MSA", metro_pop:6200000, metro_growth_pct:8.4, unemployment_rate:3.1, median_metro_income:74200 },
    cities: [
      { name:"Duluth",     county:"Gwinnett", distance_miles:15, pop_total:32100, pop_under5:null, pop_under5_pct:null, median_hh_income:89200, labor_force_pct:68, pop_growth_pct_5yr:8.6,  households:11200, working_parents_est_pct:null, demand_score:84, renter_pct:34, data_note:"Census ACS 2023" },
      { name:"Buford",     county:"Gwinnett", distance_miles:22, pop_total:17900, pop_under5:null, pop_under5_pct:null, median_hh_income:78400, labor_force_pct:67, pop_growth_pct_5yr:22.4, households:6200,  working_parents_est_pct:null, demand_score:81, renter_pct:31, data_note:"Census ACS 2023" },
      { name:"Suwanee",   county:"Gwinnett", distance_miles:8,  pop_total:21720, pop_under5:null, pop_under5_pct:null, median_hh_income:112400,labor_force_pct:72, pop_growth_pct_5yr:12.4, households:8100,  working_parents_est_pct:null, demand_score:73, renter_pct:22, data_note:"Census ACS 2023" },
    ],
    data_sources: ["US Census ACS 2023 (B25003 tenure)","BLS Consumer Expenditure Survey — laundry services 2024"],
    key_insights: ["Duluth leads with 34% renter-occupied households","Buford growing rapidly — new apartment complexes opening 2024-2025","Lower-income renters in both cities show highest coin-op demand"],
  },
  car_wash: {
    summary: "High-income suburban markets with strong vehicle ownership rates (2.1 vehicles per household). AADT counts on key corridors exceed 35k — sufficient volume for express tunnel throughput targets. Limited premium car wash competition identified.",
    metro_overview: { metro_name:"Atlanta-Sandy Springs-Alpharetta, GA MSA", metro_pop:6200000, metro_growth_pct:8.4, unemployment_rate:3.1, median_metro_income:74200 },
    cities: [
      { name:"Suwanee",    county:"Gwinnett", distance_miles:8,  pop_total:21720, median_hh_income:112400, labor_force_pct:72, pop_growth_pct_5yr:12.4, households:8100, demand_score:91, vehicles_per_hh:2.2, aadt_primary:42000, data_note:"Census ACS 2023 + GDOT" },
      { name:"Sugar Hill", county:"Gwinnett", distance_miles:12, pop_total:27800, median_hh_income:98700,  labor_force_pct:70, pop_growth_pct_5yr:18.2, households:9400, demand_score:87, vehicles_per_hh:2.1, aadt_primary:35000, data_note:"Census ACS 2023 + GDOT" },
    ],
    data_sources: ["US Census ACS 2023","GDOT AADT 2023","IBA Car Wash Industry Report 2024"],
    key_insights: ["Suwanee: $112k median income + 2.2 vehicles/HH = premium wash membership potential","Sugar Hill: new residential growth driving vehicle count increases"],
  },
  restaurant: {
    summary: "Strong restaurant market fundamentals: above-average household income, high dual-income concentration meaning frequent dining-out, and limited competition in the fast-casual premium segment.",
    metro_overview: { metro_name:"Atlanta-Sandy Springs-Alpharetta, GA MSA", metro_pop:6200000, metro_growth_pct:8.4, unemployment_rate:3.1, median_metro_income:74200 },
    cities: [
      { name:"Suwanee",    county:"Gwinnett", distance_miles:8,  pop_total:21720, median_hh_income:112400, labor_force_pct:72, pop_growth_pct_5yr:12.4, households:8100, demand_score:89, dining_spend_per_hh_mo:420, data_note:"Census ACS 2023 + BLS CES" },
      { name:"Sugar Hill", county:"Gwinnett", distance_miles:12, pop_total:27800, median_hh_income:98700,  labor_force_pct:70, pop_growth_pct_5yr:18.2, households:9400, demand_score:85, dining_spend_per_hh_mo:380, data_note:"Census ACS 2023 + BLS CES" },
      { name:"Duluth",     county:"Gwinnett", distance_miles:15, pop_total:32100, median_hh_income:89200,  labor_force_pct:68, pop_growth_pct_5yr:8.6,  households:11200,demand_score:82, dining_spend_per_hh_mo:340, data_note:"Census ACS 2023 + BLS CES" },
    ],
    data_sources: ["US Census ACS 2023","BLS Consumer Expenditure Survey — food away from home 2024"],
    key_insights: ["Suwanee households spend average $420/mo dining out — 24% above metro average","Sugar Hill fastest-growing population base — ideal for first mover"],
  },
  gym: {
    summary: "High-income professional demographic with strong fitness spending. Survey data shows 42% of households have active gym memberships. Limited boutique/premium fitness competition in the immediate corridor.",
    metro_overview: { metro_name:"Atlanta-Sandy Springs-Alpharetta, GA MSA", metro_pop:6200000, metro_growth_pct:8.4, unemployment_rate:3.1, median_metro_income:74200 },
    cities: [
      { name:"Suwanee",    county:"Gwinnett", distance_miles:8,  pop_total:21720, median_hh_income:112400, labor_force_pct:72, pop_growth_pct_5yr:12.4, households:8100, demand_score:90, gym_membership_pct:44, data_note:"Census ACS 2023 + IHRSA 2024" },
      { name:"Sugar Hill", county:"Gwinnett", distance_miles:12, pop_total:27800, median_hh_income:98700,  labor_force_pct:70, pop_growth_pct_5yr:18.2, households:9400, demand_score:86, gym_membership_pct:41, data_note:"Census ACS 2023 + IHRSA 2024" },
    ],
    data_sources: ["US Census ACS 2023","IHRSA Health Club Consumer Report 2024","BLS CES recreation spending 2024"],
    key_insights: ["Suwanee: 44% gym membership penetration vs 37% national average","Under-served by premium boutique formats — Planet Fitness and LA Fitness fill low/mid tier"],
  },
  indoor_play: {
    summary: "Family-rich suburban corridor with high under-5 and school-age populations. Median household income supports $15–25 admission pricing and birthday party packages. Limited direct indoor play area competition identified within 10-mile radius.",
    metro_overview: { metro_name:"Atlanta-Sandy Springs-Alpharetta, GA MSA", metro_pop:6200000, metro_growth_pct:8.4, unemployment_rate:3.1, median_metro_income:74200 },
    cities: [
      { name:"Suwanee",    county:"Gwinnett", distance_miles:8,  pop_total:21720, pop_under5:1580, median_hh_income:112400, labor_force_pct:72, pop_growth_pct_5yr:12.4, households:8100, demand_score:92, kids_under12:4200, data_note:"Census ACS 2023" },
      { name:"Sugar Hill", county:"Gwinnett", distance_miles:12, pop_total:27800, pop_under5:1890, median_hh_income:98700,  labor_force_pct:70, pop_growth_pct_5yr:18.2, households:9400, demand_score:88, kids_under12:5800, data_note:"Census ACS 2023" },
    ],
    data_sources: ["US Census ACS 2023 (B01001 age breakdown)","IBISWorld Indoor Recreation 2024"],
    key_insights: ["Suwanee: 4,200 children under 12 — ideal birthday party + membership target","Sugar Hill growth driving 1,200+ new family households over 3 years"],
  },
  dry_cleaning: {
    summary: "High-income professional households with significant dry-clean spending. Remote/hybrid work has moderated demand but premium household income offsets volume decline. Pickup/delivery model particularly strong in car-dependent suburban markets.",
    metro_overview: { metro_name:"Atlanta-Sandy Springs-Alpharetta, GA MSA", metro_pop:6200000, metro_growth_pct:8.4, unemployment_rate:3.1, median_metro_income:74200 },
    cities: [
      { name:"Suwanee",    county:"Gwinnett", distance_miles:8,  pop_total:21720, median_hh_income:112400, labor_force_pct:72, pop_growth_pct_5yr:12.4, households:8100, demand_score:84, professional_pct:38, data_note:"Census ACS 2023" },
      { name:"Sugar Hill", county:"Gwinnett", distance_miles:12, pop_total:27800, median_hh_income:98700,  labor_force_pct:70, pop_growth_pct_5yr:18.2, households:9400, demand_score:80, professional_pct:34, data_note:"Census ACS 2023" },
    ],
    data_sources: ["US Census ACS 2023","BLS CES personal care services 2024"],
    key_insights: ["Suwanee: 38% professional occupation households — highest dry-clean demand","Pickup/delivery model reduces reliance on foot traffic in low-walkability suburbs"],
  },
},

// ── AGENT 2 — Gap Analysis ───────────────────────────────
2: {
  daycare: {
    summary: "Critical childcare gap across the Gwinnett corridor — Suwanee and Sugar Hill show combined supply deficits serving fewer than 42% of estimated demand. Infant/toddler slots show the largest gap (53-point deficit) making age-group targeting essential. Overall opportunity score: 87/100.",
    overall_opportunity_score: 87,
    ndcp_median_preschool_rate: 1245,
    cities: [
      { city:"Suwanee",        rank:1, demand_score:9.2, supply_score:3.1, gap_score:9.0, unserved_children:680, income_tier:"High",       recommended_tuition_infant:2050, recommended_tuition_preschool:1650, priority:"Critical Gap",  rationale:"Only 3 licensed centers within 2mi for 1,580 children under 5" },
      { city:"Sugar Hill",     rank:2, demand_score:8.8, supply_score:4.2, gap_score:8.1, unserved_children:520, income_tier:"Upper-Mid",  recommended_tuition_infant:1950, recommended_tuition_preschool:1550, priority:"Critical Gap",  rationale:"18% population growth outpacing licensed capacity additions" },
      { city:"Duluth",         rank:3, demand_score:8.2, supply_score:6.0, gap_score:6.4, unserved_children:380, income_tier:"Mid-High",   recommended_tuition_infant:1800, recommended_tuition_preschool:1450, priority:"Good Opportunity", rationale:"More supply but demand still exceeds capacity at infant level" },
      { city:"Buford",         rank:4, demand_score:7.8, supply_score:5.5, gap_score:6.0, unserved_children:290, income_tier:"Mid",        recommended_tuition_infant:1750, recommended_tuition_preschool:1400, priority:"Good Opportunity", rationale:"Rapid growth — supply gap widening" },
      { city:"Flowery Branch", rank:5, demand_score:7.4, supply_score:4.8, gap_score:6.8, unserved_children:210, income_tier:"Mid",        recommended_tuition_infant:1700, recommended_tuition_preschool:1350, priority:"Good Opportunity", rationale:"Highest under-5 pct (7.9%) — underserved smaller market" },
    ],
    demand_forecast: [
      { year:2024, demand:4200, supply:2340, gap:1860, label:'2024' },
      { year:2025, demand:4580, supply:2520, gap:2060, label:'2025' },
      { year:2026, demand:4990, supply:2700, gap:2290, label:'2026' },
      { year:2027, demand:5450, supply:2890, gap:2560, label:'2027' },
      { year:2028, demand:5940, supply:3080, gap:2860, label:'2028' },
    ],
    subsidy_eligible_pct: 28,
    median_wait_weeks: 9,
    age_gaps: [
      { age:"Infant (0–12 mo)",   demand_idx:88, supply_idx:35, gap:53 },
      { age:"Toddler (1–2 yr)",   demand_idx:82, supply_idx:48, gap:34 },
      { age:"Preschool (3–4 yr)", demand_idx:76, supply_idx:62, gap:14 },
      { age:"Pre-K (4–5 yr)",     demand_idx:70, supply_idx:65, gap:5  },
    ],
  },
  gas_station: {
    summary: "Fuel retail gap analysis shows under-representation of convenience-oriented gas stations in high-AADT corridors. Key opportunity: Suwanee I-85 interchange has no branded full-service c-store within 1.4 miles of interchange exit.",
    overall_opportunity_score: 78,
    cities: [
      { city:"Suwanee",    rank:1, demand_score:9.0, supply_score:5.0, gap_score:8.5, unserved_children:null, income_tier:"High",     recommended_tuition_infant:null, recommended_tuition_preschool:null, priority:"High Opportunity", rationale:"I-85 interchange — no branded c-store within 1.4mi of exit" },
      { city:"Sugar Hill", rank:2, demand_score:8.5, supply_score:5.5, gap_score:7.2, unserved_children:null, income_tier:"Upper-Mid", recommended_tuition_infant:null, recommended_tuition_preschool:null, priority:"Good Opportunity", rationale:"Residential growth driving commuter fuel demand" },
    ],
    age_gaps: [],
  },
  laundromat: {
    summary: "Laundromat density gap: 1.8 machines per 100 renter households vs industry benchmark of 3.2. Duluth and Buford show the largest underservice ratios with growing apartment stock.",
    overall_opportunity_score: 74,
    cities: [
      { city:"Duluth", rank:1, demand_score:8.4, supply_score:4.8, gap_score:7.8, unserved_children:null, income_tier:"Mid-High", recommended_tuition_infant:null, recommended_tuition_preschool:null, priority:"Good Opportunity", rationale:"34% renter HH, 1.6 machines/100 renters — well below benchmark" },
      { city:"Buford", rank:2, demand_score:8.0, supply_score:5.0, gap_score:7.1, unserved_children:null, income_tier:"Mid",      recommended_tuition_infant:null, recommended_tuition_preschool:null, priority:"Good Opportunity", rationale:"Rapid apartment growth — supply not keeping pace" },
    ],
    age_gaps: [],
  },
  car_wash:     { summary:"Express car wash gap: Suwanee has 1 express tunnel vs benchmark of 2.4 per 10k vehicles. Membership model strong given income demographics.", overall_opportunity_score:82, cities:[{ city:"Suwanee", rank:1, demand_score:9.1, supply_score:4.5, gap_score:8.7, unserved_children:null, income_tier:"High", recommended_tuition_infant:null, recommended_tuition_preschool:null, priority:"Critical Gap", rationale:"1 express tunnel for 42k AADT corridor" }], age_gaps:[] },
  restaurant:   { summary:"Fast-casual premium restaurant gap: Suwanee Town Center has 8 dining options with no chef-driven independent in the $22–35 avg check segment.", overall_opportunity_score:75, cities:[{ city:"Suwanee", rank:1, demand_score:8.9, supply_score:6.0, gap_score:7.2, unserved_children:null, income_tier:"High", recommended_tuition_infant:null, recommended_tuition_preschool:null, priority:"Good Opportunity", rationale:"Premium price point under-served" }], age_gaps:[] },
  gym:          { summary:"Premium fitness gap: no boutique strength/functional fitness studio within 5 miles of Suwanee Town Center. Planet Fitness occupies the budget tier; gap sits at $60–120/mo price point.", overall_opportunity_score:80, cities:[{ city:"Suwanee", rank:1, demand_score:9.0, supply_score:4.8, gap_score:8.2, unserved_children:null, income_tier:"High", recommended_tuition_infant:null, recommended_tuition_preschool:null, priority:"High Opportunity", rationale:"No boutique gym within 5mi — premium tier underserved" }], age_gaps:[] },
  indoor_play:  { summary:"Indoor play area gap: 4,200 children under 12 in Suwanee with zero dedicated indoor play facility within 8 miles. Closest competitor is in Alpharetta (14mi).", overall_opportunity_score:88, cities:[{ city:"Suwanee", rank:1, demand_score:9.2, supply_score:2.0, gap_score:9.3, unserved_children:null, income_tier:"High", recommended_tuition_infant:null, recommended_tuition_preschool:null, priority:"Critical Gap", rationale:"Zero indoor play facilities within 8mi of 4,200 children" }], age_gaps:[] },
  dry_cleaning: { summary:"Dry cleaning gap: 1 independent cleaner vs estimated demand for 2.2 plants at current professional household density. Pickup/delivery demand unmet.", overall_opportunity_score:71, cities:[{ city:"Suwanee", rank:1, demand_score:8.4, supply_score:5.5, gap_score:6.8, unserved_children:null, income_tier:"High", recommended_tuition_infant:null, recommended_tuition_preschool:null, priority:"Good Opportunity", rationale:"38% professional HH + only 1 cleaner — delivery model uncontested" }], age_gaps:[] },
},

// ── AGENT 3 — Site Selection ─────────────────────────────
3: {
  daycare: {
    summary: "Top recommendation: Suwanee Town Center corridor (SR-317 / Lawrenceville-Suwanee Rd). Highest composite score (88/100) driven by gap score, income, traffic, and available retail space. Sugar Hill (Hwy 20 corridor) is a strong backup at 82/100.",
    locations: [
      { rank:1, city:"Suwanee",    submarket:"Town Center / SR-317",           overall_score:88, scores:{ demand:92, competition:88, demographics:94, real_estate:80, regulatory:85 }, capacity_recommended:90, target_infant_tuition:2050, target_preschool_tuition:1650, target_primary_rate:2050, target_secondary_rate:1650, risk:"Low-Medium", timeline_months:14, children_under5_nearby:1580, competitors_within_2mi:2, sqft_needed:6200, est_monthly_rent_range:"$9,500–$12,500", ideal_property_type:"Freestanding or end-cap retail with outdoor pad", zoning_needed:"C-2 Commercial", pros:["Highest median income ($112k)","Only 2 competitors within 2 miles","Town Center foot traffic + daytime workforce population","Suwanee Parents FB group (28k members) for pre-enrollment"], cons:["Premium lease rates","End-cap spaces limited — may require new construction pad"], reasoning:"Suwanee's combination of high income, low supply, and strong demand growth makes it the strongest childcare market in the corridor. The Town Center area offers the best visibility and the demographic profile supports premium pricing." },
      { rank:2, city:"Sugar Hill", submarket:"Hwy 20 / Nelson Brogdon Blvd",   overall_score:82, scores:{ demand:88, competition:85, demographics:88, real_estate:82, regulatory:82 }, capacity_recommended:80, target_infant_tuition:1950, target_preschool_tuition:1550, target_primary_rate:1950, target_secondary_rate:1550, risk:"Low-Medium", timeline_months:13, children_under5_nearby:1890, competitors_within_2mi:3, sqft_needed:5800, est_monthly_rent_range:"$8,200–$10,800", ideal_property_type:"Strip mall anchor or standalone", zoning_needed:"C-1/C-2 Commercial", pros:["Fastest-growing city in corridor (+18%)","Lower initial lease rates than Suwanee","Largest under-5 population (1,890)"], cons:["3 competitors within 2mi — marginally more saturated","Slightly lower income ceiling ($98k)"], reasoning:"Sugar Hill's population growth rate means demand is expanding rapidly, creating opportunity even where some supply exists. The lower entry cost creates better financial flexibility." },
      { rank:3, city:"Duluth",     submarket:"Peachtree Industrial Blvd",       overall_score:74, scores:{ demand:82, competition:70, demographics:82, real_estate:78, regulatory:80 }, capacity_recommended:75, target_infant_tuition:1800, target_preschool_tuition:1450, target_primary_rate:1800, target_secondary_rate:1450, risk:"Medium", timeline_months:12, children_under5_nearby:2100, competitors_within_2mi:5, sqft_needed:5500, est_monthly_rent_range:"$7,500–$9,800", ideal_property_type:"Strip mall or office conversion", zoning_needed:"C-1 Commercial", pros:["Largest under-5 population (2,100)","Lower cost of entry","Multiple available commercial spaces"], cons:["Most saturated (5 competitors within 2mi)","Lower income than Suwanee"], reasoning:"Duluth has the raw population numbers but higher competition density reduces the opportunity score. Viable if targeting a specific underserved submarket (e.g. infant-only)." },
    ],
  },
  gas_station:  { summary:"Top site: Suwanee I-85 Exit 111 interchange (SR-317 corridor). 42k AADT with no branded c-store within 1.4 miles of exit.", locations:[{ rank:1, city:"Suwanee", submarket:"I-85 Exit 111 / SR-317", overall_score:86, scores:{ demand:90, competition:88, demographics:82, real_estate:76, regulatory:80 }, capacity_recommended:8, target_primary_rate:null, target_secondary_rate:null, risk:"Medium", timeline_months:18, children_under5_nearby:null, competitors_within_2mi:2, sqft_needed:3200, est_monthly_rent_range:"$8k–$14k", ideal_property_type:"Corner outparcel with canopy clearance", zoning_needed:"Highway Commercial (HC)", pros:["42k AADT + I-85 interchange visibility","No branded c-store within 1.4mi"], cons:["Premium land cost near interchange","Environmental review required for UST"], reasoning:"Interchange sites generate the highest fuel volume; existing supply gap makes this the primary opportunity." }] },
  laundromat:   { summary:"Top site: Duluth strip mall on Peachtree Industrial Blvd near apartment cluster.", locations:[{ rank:1, city:"Duluth", submarket:"Peachtree Industrial / Pleasant Hill", overall_score:80, scores:{ demand:84, competition:80, demographics:76, real_estate:82, regulatory:82 }, capacity_recommended:30, target_primary_rate:null, target_secondary_rate:null, risk:"Low-Medium", timeline_months:8, children_under5_nearby:null, competitors_within_2mi:1, sqft_needed:2800, est_monthly_rent_range:"$5,200–$7,800", ideal_property_type:"Strip mall anchor near apartment complex", zoning_needed:"C-1 Commercial", pros:["Dense renter population within 0.5mi","Low competition (1 coin-op)","Low-cost lease vs full market"], cons:["Utility upgrade costs (400A electrical + water capacity)"], reasoning:"Proximity to 800+ apartment units within walking distance makes this the strongest self-service laundry site." }] },
  car_wash:     { summary:"Top site: Suwanee Lawrenceville-Suwanee Rd at SR-317 corner.", locations:[{ rank:1, city:"Suwanee", submarket:"SR-317 / Lawrenceville-Suwanee", overall_score:87, scores:{ demand:91, competition:84, demographics:92, real_estate:78, regulatory:82 }, capacity_recommended:4, target_primary_rate:null, target_secondary_rate:null, risk:"Low", timeline_months:10, children_under5_nearby:null, competitors_within_2mi:1, sqft_needed:8000, est_monthly_rent_range:"$12k–$18k", ideal_property_type:"Corner outparcel 0.8+ acres with stacking lane", zoning_needed:"C-2 Highway Commercial", pros:["42k AADT","Only 1 car wash within 2mi (non-express)","High-income membership potential"], cons:["Land premium in Suwanee Town Center area"], reasoning:"High-income, high-AADT site with minimal express car wash competition." }] },
  restaurant:   { summary:"Top site: Suwanee Town Center mixed-use development inline space.", locations:[{ rank:1, city:"Suwanee", submarket:"Suwanee Town Center", overall_score:83, scores:{ demand:89, competition:74, demographics:94, real_estate:76, regulatory:80 }, capacity_recommended:80, target_primary_rate:null, target_secondary_rate:null, risk:"Medium", timeline_months:9, children_under5_nearby:null, competitors_within_2mi:8, sqft_needed:3200, est_monthly_rent_range:"$11k–$16k", ideal_property_type:"Inline retail with patio potential", zoning_needed:"Mixed-Use Commercial", pros:["Highest income demographic","Town Center foot traffic + events","Premium avg-check support at $28–34"], cons:["High lease rate","8 existing dining options — differentiation essential"], reasoning:"Town Center offers built-in lunch/dinner traffic from office workers and residents; premium price point justified by demographics." }] },
  gym:          { summary:"Top site: Suwanee / Sugar Hill border on Buford Hwy — 5,000+ sqft retail bay available.", locations:[{ rank:1, city:"Suwanee", submarket:"Suwanee / Sugar Hill Buford Hwy", overall_score:85, scores:{ demand:90, competition:82, demographics:90, real_estate:80, regulatory:80 }, capacity_recommended:400, target_primary_rate:null, target_secondary_rate:null, risk:"Low-Medium", timeline_months:6, children_under5_nearby:null, competitors_within_2mi:2, sqft_needed:5500, est_monthly_rent_range:"$8,500–$12,000", ideal_property_type:"Large retail bay or standalone", zoning_needed:"C-1 or C-2", pros:["No boutique gym within 5mi","5,500 sqft bays available","High professional HH concentration"], cons:["Planet Fitness in adjacent market — price anchor lower"], reasoning:"Premium fitness gap clearly defined; site offers affordable rent for margin-positive launch." }] },
  indoor_play:  { summary:"Top site: Sugar Hill Hwy 20 large format retail (former big-box bay).", locations:[{ rank:1, city:"Sugar Hill", submarket:"Hwy 20 Nelson Brogdon corridor", overall_score:89, scores:{ demand:92, competition:92, demographics:88, real_estate:84, regulatory:82 }, capacity_recommended:300, target_primary_rate:null, target_secondary_rate:null, risk:"Low", timeline_months:7, children_under5_nearby:1890, competitors_within_2mi:0, sqft_needed:9000, est_monthly_rent_range:"$9,000–$13,000", ideal_property_type:"Large bay or former retail anchor (8,000+ sqft)", zoning_needed:"C-2 Commercial", pros:["Zero direct competitors within 8mi","Largest under-5 population in corridor","Birthday party + membership revenue model"], cons:["Large sqft requirement raises lease cost"], reasoning:"Zero competition within 8 miles + 5,800 children under 12 creates a dominant first-mover opportunity." }] },
  dry_cleaning: { summary:"Top site: Suwanee SR-317 strip mall with drive-through bay potential.", locations:[{ rank:1, city:"Suwanee", submarket:"SR-317 / Lawrenceville-Suwanee", overall_score:78, scores:{ demand:84, competition:78, demographics:92, real_estate:72, regulatory:76 }, capacity_recommended:500, target_primary_rate:null, target_secondary_rate:null, risk:"Medium", timeline_months:6, children_under5_nearby:null, competitors_within_2mi:1, sqft_needed:2200, est_monthly_rent_range:"$5,500–$8,200", ideal_property_type:"Strip mall bay with drive-through window or parking", zoning_needed:"C-1 Commercial", pros:["38% professional HH — highest dry-clean spend per capita","Drive-through + delivery model reduces walk-in dependency"], cons:["EPA PERC compliance or green-cleaning transition capital cost"], reasoning:"Highest-income market with minimal competition; drive-through plus pickup/delivery model maximizes revenue per labor hour." }] },
},

// ── AGENT 4 — Real Estate ────────────────────────────────
4: {
  daycare: {
    summary: "Active childcare-suitable commercial inventory in Suwanee and Sugar Hill. Three properties on Lawrenceville-Suwanee Rd meet DECAL footprint requirements (35 sqft/child indoor, 75 sqft/child outdoor). Average asking rents: $17–22/sqft NNN in Suwanee vs $14–18/sqft in Sugar Hill.",
    listings: [
      { city:"Suwanee",    address:"3820 Lawrenceville-Suwanee Rd, Suwanee GA 30024", sqft:6400, monthly_rent:10800, price_per_sqft:20.25, property_type:"Freestanding Retail", zoning:"C-2", url:"https://www.loopnet.com", highlights:["Existing playground pad","Drive-through lane convertible","Immediate I-85 access"] },
      { city:"Suwanee",    address:"475 Buford Hwy, Suwanee GA 30024",               sqft:5800, monthly_rent:9600,  price_per_sqft:19.86, property_type:"End-Cap Retail",      zoning:"C-2", url:"https://www.loopnet.com", highlights:["Corner visibility","Large rear yard (outdoor play possible)","2024 HVAC"] },
      { city:"Sugar Hill", address:"3340 Peachtree Industrial Blvd, Sugar Hill GA 30518", sqft:6100, monthly_rent:8900, price_per_sqft:17.51, property_type:"Strip Mall Anchor",    zoning:"C-1", url:"https://www.loopnet.com", highlights:["Below-market NNN","High residential density within 0.5mi","Separate entrance"] },
      { city:"Sugar Hill", address:"4885 Nelson Brogdon Blvd, Sugar Hill GA 30518",   sqft:5500, monthly_rent:8200,  price_per_sqft:17.89, property_type:"Standalone Retail",    zoning:"C-2", url:"https://www.loopnet.com", highlights:["Fenced rear lot","ADA parking","2022 roof"] },
    ],
    by_city_summary: [
      { city:"Suwanee",    avg_rent_sqft:20.06, listings_found:6, recommended_range:"$9,500–$12,500/mo", notes:"Premium market; limited turnkey spaces — factor 60–90 day build-out window" },
      { city:"Sugar Hill", avg_rent_sqft:17.70, listings_found:9, recommended_range:"$8,200–$10,800/mo", notes:"More available inventory; recent new construction adding Class A space" },
      { city:"Duluth",     avg_rent_sqft:15.40, listings_found:12, recommended_range:"$7,500–$9,800/mo", notes:"Lowest cost; higher competition density" },
    ],
    search_urls: { loopnet:"https://www.loopnet.com/search/commercial-real-estate/suwanee-ga/for-lease/", crexi:"https://www.crexi.com/lease/georgia/gwinnett-county", bizbuysell:"https://www.bizbuysell.com/Georgia/Gwinnett-County/" },
  },
},

// ── AGENT 5 — Compliance ─────────────────────────────────
5: {
  daycare: {
    summary: "Georgia DECAL licensing governs all childcare center operations. Eight requirements are Critical including Director credential, background checks, and facility inspection. Primary agencies: DECAL (state), Gwinnett County Building & Zoning (local), GA DPH (health permit). Budget $4,200–$8,500 for initial licensing fees and inspections. Plan for 12-month lead time from lease to license.",
    requirements: [
      { category:"State License",  item:"DECAL Center License",           detail:"Required before accepting any children. Director must be hired first.",              timeline_weeks:16, cost_usd:250,  source:"Ga Code 20-1A-1 et seq.", priority:"Critical",  application_url:"https://decal.ga.gov" },
      { category:"Personnel",      item:"Director Credential",            detail:"Director must hold CDA or accredited ECE degree; must be hired 6 months before opening.", timeline_weeks:4,  cost_usd:0,    source:"DECAL Rule 591-1-1",       priority:"Critical",  application_url:"https://decal.ga.gov" },
      { category:"Personnel",      item:"Background Checks (GCIC+FBI)",   detail:"All staff and owners; DECAL processes via GAPS online system.",                       timeline_weeks:3,  cost_usd:38,   source:"DECAL Rule 591-1-1-.06",   priority:"Critical",  application_url:"https://gaps.ga.gov" },
      { category:"Facility",       item:"DECAL Facility Inspection",      detail:"35 sqft/child indoor, 75 sqft/child outdoor, separate infant room required.",          timeline_weeks:8,  cost_usd:150,  source:"DECAL Physical Standards",  priority:"Critical",  application_url:"https://decal.ga.gov" },
      { category:"Zoning",         item:"Gwinnett County CUP / Zoning",   detail:"Childcare centers require Conditional Use Permit in most commercial zones.",           timeline_weeks:10, cost_usd:800,  source:"Gwinnett Unified Dev Ord",  priority:"Critical",  application_url:"https://www.gwinnettcounty.com/planning" },
      { category:"Health",         item:"GA DPH Food Service Permit",     detail:"Required if center serves meals; annual renewal.",                                       timeline_weeks:4,  cost_usd:200,  source:"GA DPH Rule 290-5-14",      priority:"High",      application_url:"https://dph.georgia.gov" },
      { category:"Fire",           item:"Gwinnett County Fire Inspection", detail:"Annual fire inspection; sprinkler system required for 6+ children capacity.",          timeline_weeks:2,  cost_usd:100,  source:"NFPA 101 / Gwinnett FMO",   priority:"High",      application_url:"https://www.gwinnettcounty.com/fire" },
      { category:"Business",       item:"Georgia LLC Registration",        detail:"File Articles of Organization with GA SOS; obtain EIN from IRS.",                      timeline_weeks:1,  cost_usd:100,  source:"GA Code 14-11-204",         priority:"High",      application_url:"https://ecorp.sos.ga.gov" },
      { category:"Subsidy",        item:"CAPS (Childcare & Parent Svcs)", detail:"Accept low-income subsidy — significantly expands market; apply through DECAL.",       timeline_weeks:8,  cost_usd:0,    source:"DECAL CAPS Program",        priority:"Medium",    application_url:"https://decal.ga.gov/CAPS" },
      { category:"Nutrition",      item:"USDA CACFP Enrollment",           detail:"Childcare food reimbursement program; adds $3–8/day/child in revenue.",               timeline_weeks:6,  cost_usd:0,    source:"USDA FNS 7 CFR Part 226",   priority:"Medium",    application_url:"https://www.fns.usda.gov/cacfp" },
    ],
    timeline_phases: [
      { phase:"Business Formation",    weeks:2,  tasks:"File GA LLC, obtain EIN, open business bank account" },
      { phase:"Site & Zoning",         weeks:10, tasks:"Sign lease, file CUP with Gwinnett County, architect drawings" },
      { phase:"DECAL Pre-Application", weeks:4,  tasks:"DECAL consultant review of floor plan, Director hire" },
      { phase:"Background Checks",     weeks:3,  tasks:"GAPS submissions for all staff and owners" },
      { phase:"Construction",          weeks:12, tasks:"Build-out per DECAL Physical Standards, fire sprinkler" },
      { phase:"Inspections",           weeks:4,  tasks:"Fire, building, health, DECAL facility inspection" },
      { phase:"DECAL Application",     weeks:8,  tasks:"Submit full package, await approval" },
      { phase:"Soft Launch",           weeks:4,  tasks:"Staff training, CACFP enrollment, CAPS approval" },
    ],
    how_to_apply: [
      { requirement:"DECAL Center License", agency:"Georgia Dept of Early Care and Learning (DECAL)", form_name:"Child Care Center License Application", is_online:true, phone:"(404) 656-5957", email:"decal@decal.ga.gov", steps:["Create account at decal.ga.gov","Complete online license application (allow 90 min)","Upload: floor plan, CUP, background checks, Director credential","Pay $250 license fee","Schedule DECAL facility inspection","Await written approval (6–10 weeks)"], notes:"Director must be named on application; center cannot open until license is issued.", url:"https://decal.ga.gov" },
    ],
  },
},

// ── AGENT 6 — Competitive Intel ──────────────────────────
6: {
  daycare: {
    summary: "Gwinnett corridor childcare market is dominated by national chains (Primrose, KinderCare) at the premium tier and independent centers at mid-tier. Suwanee has only 3 licensed centers within 2 miles vs. demand for 6+. No NAEYC-accredited center exists in Sugar Hill. Competitive differentiation opportunity: premium infant/toddler program with NAEYC pathway.",
    cities: [
      { city:"Suwanee",        total_centers:3, licensed_capacity:285, qris_rated_count:2, naeyc_count:1, avg_tuition_infant:1980, avg_tuition_preschool:1520, avg_rating:4.2, market_saturation:"Low",    gap_score:9.0, lat:34.0514, lng:-84.0663, notes:"One Primrose; two independent; no true infant waitlist capacity" },
      { city:"Sugar Hill",     total_centers:4, licensed_capacity:340, qris_rated_count:1, naeyc_count:0, avg_tuition_infant:1850, avg_tuition_preschool:1420, avg_rating:3.9, market_saturation:"Low",    gap_score:8.1, lat:34.1029, lng:-84.0547, notes:"No NAEYC-accredited center; quality gap at infant level" },
      { city:"Duluth",         total_centers:7, licensed_capacity:620, qris_rated_count:3, naeyc_count:2, avg_tuition_infant:1790, avg_tuition_preschool:1380, avg_rating:4.0, market_saturation:"Medium", gap_score:6.4, lat:33.9959, lng:-84.1447, notes:"KinderCare and 2 Brightspring centers; more competitive" },
      { city:"Buford",         total_centers:5, licensed_capacity:420, qris_rated_count:2, naeyc_count:1, avg_tuition_infant:1750, avg_tuition_preschool:1380, avg_rating:3.8, market_saturation:"Low",    gap_score:6.0, lat:34.1215, lng:-83.9913, notes:"Growing market; 3 independents + 2 national chains" },
      { city:"Flowery Branch", total_centers:2, licensed_capacity:160, qris_rated_count:0, naeyc_count:0, avg_tuition_infant:1700, avg_tuition_preschool:1350, avg_rating:3.7, market_saturation:"Low",    gap_score:6.8, lat:34.1840, lng:-83.9243, notes:"Very underserved small market — only 2 licensed centers for fastest-growing ZIP" },
    ],
    top_chains: [
      { name:"Primrose Schools",   locations_in_area:2, avg_tuition_infant:2100, avg_tuition_preschool:1700, avg_rating:4.5, qris_stars:4, naeyc:true,  utilization_pct:94, avg_capacity:110, waitlist_weeks:10 },
      { name:"KinderCare",         locations_in_area:3, avg_tuition_infant:1900, avg_tuition_preschool:1520, avg_rating:4.0, qris_stars:3, naeyc:false, utilization_pct:86, avg_capacity:140, waitlist_weeks:3  },
      { name:"Bright Horizons",    locations_in_area:1, avg_tuition_infant:2300, avg_tuition_preschool:1880, avg_rating:4.6, qris_stars:4, naeyc:true,  utilization_pct:97, avg_capacity:100, waitlist_weeks:14 },
      { name:"Independent Centers",locations_in_area:8, avg_tuition_infant:1650, avg_tuition_preschool:1320, avg_rating:3.8, qris_stars:2, naeyc:false, utilization_pct:71, avg_capacity:65,  waitlist_weeks:1  },
    ],
  },
},

// ── AGENT 7 — Financial Feasibility ─────────────────────
7: {
  daycare: {
    summary: "Base case shows profitability by Month 14 with 75% enrollment. At full capacity (90 children), annual net income reaches $182k (Year 2) rising to $228k (Year 3). Infant/toddler rooms drive 60% of revenue despite occupying 45% of licensed slots. SBA 7(a) recommended for $380k of $600k total startup.",
    startup_breakdown: [
      { item:"Leasehold improvements & build-out", amount:180000 },
      { item:"Furniture, fixtures & equipment",    amount:85000  },
      { item:"Playground equipment & surfacing",   amount:42000  },
      { item:"DECAL licensing fees & deposits",    amount:8500   },
      { item:"Working capital (6 months ops)",     amount:120000 },
      { item:"Marketing & pre-enrollment",         amount:15000  },
      { item:"Technology (software, cameras)",     amount:12000  },
      { item:"Legal, accounting, insurance",       amount:18000  },
      { item:"Contingency (10%)",                  amount:46000  },
    ],
    monthly_ops: [
      { item:"Director salary",             amount:5800  },
      { item:"Lead teachers (6 × $3,400)",  amount:20400 },
      { item:"Assistants (5 × $2,600)",     amount:13000 },
      { item:"Lease (NNN)",                 amount:10800 },
      { item:"Utilities",                   amount:3200  },
      { item:"Food program (CACFP offset)", amount:1800  },
      { item:"Insurance (liability + GL)",  amount:1400  },
      { item:"Supplies & curriculum",       amount:2200  },
      { item:"Marketing",                   amount:1200  },
      { item:"Misc / admin",                amount:800   },
    ],
    scenarios: [
      { name:"Base Case",     label:"75% occupancy",  enrolled:67, revenue_infant:58600, revenue_toddler:38400, revenue_preschool:22800, revenue_prek:18200, avg_tuition:1978, monthly_revenue:138000, monthly_expenses:108400, monthly_net:29600,  annual_net:355200,  breakeven_months:14, roi_3yr:28, color:"var(--blue)"  },
      { name:"Conservative",  label:"60% occupancy",  enrolled:54, revenue_infant:46800, revenue_toddler:30200, revenue_preschool:18400, revenue_prek:14200, avg_tuition:1978, monthly_revenue:110000, monthly_expenses:97200,  monthly_net:12800,  annual_net:153600,  breakeven_months:22, roi_3yr:14, color:"var(--amber)" },
      { name:"Optimistic",    label:"Full capacity",  enrolled:90, revenue_infant:78800, revenue_toddler:51400, revenue_preschool:30400, revenue_prek:24400, avg_tuition:1978, monthly_revenue:185000, monthly_expenses:118600, monthly_net:66400,  annual_net:796800,  breakeven_months:9,  roi_3yr:44, color:"var(--green)" },
    ],
    projections: [
      { month:"M1",  rev:12000,   exp:108400, cum:-590000 },
      { month:"M2",  rev:28000,   exp:108400, cum:-565000 },
      { month:"M3",  rev:46000,   exp:108400, cum:-536000 },
      { month:"M4",  rev:63000,   exp:108400, cum:-502000 },
      { month:"M5",  rev:78000,   exp:108400, cum:-466000 },
      { month:"M6",  rev:91000,   exp:108400, cum:-430000 },
      { month:"M7",  rev:102000,  exp:108400, cum:-395000 },
      { month:"M8",  rev:110000,  exp:108400, cum:-361000 },
      { month:"M9",  rev:117000,  exp:108400, cum:-318000 },
      { month:"M10", rev:123000,  exp:108400, cum:-268000 },
      { month:"M11", rev:129000,  exp:108400, cum:-212000 },
      { month:"M12", rev:133000,  exp:108400, cum:-152000 },
      { month:"M13", rev:136000,  exp:108400, cum:-88000  },
      { month:"M14", rev:138000,  exp:108400, cum:-22000  },
      { month:"M15", rev:140000,  exp:108400, cum:48000   },
      { month:"M16", rev:142000,  exp:110000, cum:120000  },
      { month:"M17", rev:145000,  exp:110000, cum:195000  },
      { month:"M18", rev:148000,  exp:112000, cum:271000  },
      { month:"M24", rev:158000,  exp:114000, cum:594000  },
    ],
    by_city_financials: [
      { city:"Suwanee",    avg_tuition:2050, break_even_mo:13, annual_net_yr2:228000, risk:"Low-Med" },
      { city:"Sugar Hill", avg_tuition:1950, break_even_mo:15, annual_net_yr2:198000, risk:"Low-Med" },
      { city:"Duluth",     avg_tuition:1800, break_even_mo:18, annual_net_yr2:162000, risk:"Medium"  },
    ],
    funding: [
      { source:"SBA 7(a) Loan",        amount:380000, rate_pct:8.5, term_months:120, notes:"Pre-qualify with Regions Bank or Truist; plan 60-90 day approval" },
      { source:"Owner Equity",          amount:180000, rate_pct:0,   term_months:0,   notes:"Minimum 20% equity; demonstrates commitment to SBA lender" },
      { source:"Seller Note / Partner", amount:40000,  rate_pct:6.0, term_months:60,  notes:"Optional; reduces SBA loan size and approval complexity" },
    ],
  },
},

// ── AGENT 8 — Executive Summary ──────────────────────────
8: {
  daycare: {
    verdict: "Go",
    verdict_rationale: "Suwanee (gap score 9.0/10, median income $112k, only 2 competitors within 2mi) presents a clear, data-supported Go — the first center to open with a quality infant/toddler program at the SR-317 corridor will capture waitlist demand within 90 days of opening.",
    assessment: "The Gwinnett County corridor shows a structural childcare undersupply that demographic trends are widening, not closing. Suwanee leads with only 285 licensed seats for an estimated 1,580+ children under 5 — a 5.5x demand-to-supply ratio that dwarfs the 2.5x industry threshold for new-market entry. At $112k median household income, the market easily supports $1,900–$2,050/month infant tuition (below Primrose at $2,100 but 20% above independents). A 75-child center achieving 75% enrollment in Year 1 generates $138k monthly revenue against $108k in operating costs — a 14-month break-even on the base case. Sugar Hill provides a backup site with even faster population growth (+18% over 5 years) and slightly lower entry costs. The primary risk — DECAL licensing timeline — is fully manageable with a 6-month director hire and pre-application DECAL consultant engagement starting immediately.",
    success_factors: [
      "Open in Suwanee SR-317 corridor: highest gap score (9.0/10), only 2 competitors within 2mi, $112k median income",
      "Lead with infant/toddler rooms: 53-point supply-demand deficit at infant level — command $2,050/mo vs market avg $1,980",
      "Hire DECAL-credentialed Director immediately — license application requires named director; every week of delay = 1 week later opening",
      "Engage DECAL consultant before signing lease — floor plan approval takes 8-10 weeks; catch issues before construction costs are locked",
      "Launch pre-enrollment waitlist in Suwanee Parents Facebook group (28k members) 6 months before opening — converts curiosity to signed contracts",
    ],
    risks: [
      { risk:"DECAL licensing timeline can push open date 60–90 days", mitigation:"Hire director in Month 1; file DECAL pre-application before lease signing; budget 16-week total license timeline", severity:"High" },
      { risk:"SBA 7(a) approval delays can freeze build-out capital", mitigation:"Begin SBA pre-qualification at Regions Bank or Truist immediately; maintain 6-month working capital reserve from owner equity", severity:"High" },
      { risk:"Infant staffing ratios (1:6 teacher:child) compress revenue per room", mitigation:"Design infant room as premium offering at $2,200/mo — higher tuition offsets ratio constraint; limit infant slots to 12", severity:"Medium" },
      { risk:"Suwanee lease market tightening — suitable spaces limited", mitigation:"Engage commercial RE broker specializing in childcare immediately; identify backup Sugar Hill site; consider build-to-suit negotiation", severity:"Medium" },
      { risk:"Staff recruitment at required CDA credential level", mitigation:"Partner with Georgia Gwinnett College ECE program; offer signing bonuses; start recruiting 8 months before opening", severity:"Medium" },
    ],
    next_steps: [
      "This week: Engage Gwinnett County commercial RE broker specializing in childcare — tour 3820 Lawrenceville-Suwanee Rd and 475 Buford Hwy listings",
      "This week: File Georgia LLC with Secretary of State ($100 at ecorp.sos.ga.gov) and obtain EIN from IRS.gov",
      "Week 2–3: Begin SBA 7(a) pre-qualification with Regions Bank or Truist (both active childcare lenders in Gwinnett)",
      "Week 3–4: Post Director job listing on Indeed and Handshake (Georgia Gwinnett College ECE dept) — plan to hire 6 months before opening",
      "Month 2: Hire DECAL consultant ($1,500–$3,000) for pre-review of intended facility layout before signing lease",
      "Month 2–3: Sign lease; commission architect for DECAL-compliant drawings (35 sqft/child indoor, 75 outdoor)",
      "Month 3: Post pre-enrollment interest form in Suwanee Parents Facebook group (28k members) and NextDoor",
      "Month 5: Submit full DECAL application package with background checks for all owners and named staff",
    ],
  },
  gas_station: {
    verdict: "Cautious Go",
    verdict_rationale: "Suwanee I-85 interchange shows strong fuel volume fundamentals (42k AADT, no branded c-store within 1.4mi) but capital requirements ($1.5M+) and EPA UST compliance complexity warrant careful lender and environmental review before committing.",
    assessment: "The corridor shows a genuine fuel-retail gap at the I-85 Exit 111 interchange. However, land acquisition and UST installation costs are significantly higher than standard retail, and Georgia EPD environmental review adds 60–90 days to the timeline.",
    success_factors: ["Secure outparcel at Exit 111 before competitor moves","Commission Phase I ESA immediately to assess soil conditions","Lock in fuel supplier agreement (Shell, BP, or RaceTrac branded deal) before site acquisition"],
    risks: [{ risk:"EPA UST environmental review finds pre-existing contamination", mitigation:"Phase I and Phase II ESA before purchase; negotiate environmental indemnification with seller", severity:"High" }],
    next_steps: ["Week 1: Contact EPD UST program to confirm available sites are UST-clear","Week 2: Engage commercial RE broker for interchange outparcel options","Month 2: Commission Phase I ESA ($2,500–$4,000) on top candidate site"],
  },
  laundromat: {
    verdict: "Go",
    verdict_rationale: "Duluth strip mall site shows strong renter density (34% renter-occupied households) and 1 machine per 62 renter households vs industry benchmark of 1:31 — clear undersupply at acceptable cost of entry ($280k–$350k buildout).",
    assessment: "Laundromat fundamentals in Duluth are sound. Dense rental housing creates reliable recurring revenue without geographic marketing. Equipment ROI at 80% utilization supports debt service on a $200k equipment loan.",
    success_factors: ["Target Peachtree Industrial strip mall anchor adjacent to apartment cluster","Use Speed Queen commercial equipment for lowest total maintenance cost","Launch wash-dry-fold service to differentiate and increase revenue per customer"],
    risks: [{ risk:"Utility costs (water/gas/electric) can reach 40% of revenue at low utilization", mitigation:"Install high-efficiency machines; negotiate time-of-use electric rate; optimize hours to peak demand windows", severity:"Medium" }],
    next_steps: ["Week 1: Tour Duluth Peachtree Industrial spaces; confirm water/sewer capacity with Gwinnett County Utilities","Week 2: Get Speed Queen equipment quote ($120k for 30-machine mix)"],
  },
  car_wash: {
    verdict: "Go",
    verdict_rationale: "Suwanee SR-317 corridor shows the highest car wash opportunity score in the region: $112k median income, 42k AADT, and only 1 non-express competitor within 2 miles — ideal conditions for an unlimited membership express tunnel.",
    assessment: "Premium suburban demographics plus high AADT create ideal conditions. Unlimited monthly membership at $29–39/mo is the industry's highest-margin model and income demographics support it.",
    success_factors: ["Unlimited membership model — target 800 active members by Year 2","Corner outparcel with 100+ ft tunnel stacking lane","Eco-friendly water reclaim system — differentiator in environmentally-aware market"],
    risks: [{ risk:"Build-out cost (tunnel + equipment) typically $850k–$1.2M", mitigation:"Seek SBA 7(a) or equipment financing; car wash has strong collateral profile for lenders", severity:"High" }],
    next_steps: ["Week 1: Identify corner outparcel opportunities on SR-317","Week 2: Get express tunnel equipment quotes from Ryko or PDQ"],
  },
  restaurant: {
    verdict: "Cautious Go",
    verdict_rationale: "Suwanee Town Center supports a $28–34 average-check independent restaurant concept given $112k median income and limited premium dining options, but high NNN lease rates ($11k–$16k/mo) compress early-stage margins and require a disciplined opening approach.",
    assessment: "Strong income demographics and a clear gap in the $28–34 average check segment. Lease cost and build-out ($180k–$280k) create a 20–24 month break-even on base-case covers.",
    success_factors: ["Focus on lunch + dinner with catering/events as revenue diversifier","Pre-open buzz via Suwanee Town Center social media presence"],
    risks: [{ risk:"Labor cost (kitchen + front-of-house) at current wage rates", mitigation:"Cross-train staff; optimize covers per server per shift; avoid over-staffing pre-ramp", severity:"High" }],
    next_steps: ["Week 1: Tour Town Center inline spaces and confirm permitted use for full-service restaurant","Week 2: Model 3 cover scenarios (150/200/250/day) against lease cost"],
  },
  gym: {
    verdict: "Go",
    verdict_rationale: "No boutique fitness facility within 5 miles of Suwanee/Sugar Hill at the $80–120/month price point; strong professional demographic (44% membership propensity) and available 5,500 sqft bays at acceptable rent create a clearly underserved market.",
    assessment: "Premium fitness gap is well-documented. Low competition from pure boutique operators; Planet Fitness serves the budget tier leaving the $80–120 price point open.",
    success_factors: ["Open with founding member pre-sale (120 members before Day 1)","Focus on functional fitness / strength — differentiates from Planet Fitness and national chains"],
    risks: [{ risk:"Member retention below 70% in first 12 months", mitigation:"Build community programming (challenges, events) from Month 1; assign member success coach", severity:"Medium" }],
    next_steps: ["Week 1: Identify 5,000+ sqft retail bay on Suwanee/Sugar Hill border","Week 2: Launch founding member pre-sale waitlist targeting 100 sign-ups before signing lease"],
  },
  indoor_play: {
    verdict: "Go",
    verdict_rationale: "Zero direct competitors within 8 miles of Sugar Hill's 5,800 children under 12 and $98k median income — a textbook first-mover opportunity with birthday party + membership revenue model supporting 18-month break-even.",
    assessment: "Indoor play area market in this corridor is completely uncontested. Parent willingness to drive 14+ miles to the nearest facility in Alpharetta confirms latent demand.",
    success_factors: ["Secure 8,000+ sqft former retail bay on Hwy 20","Launch birthday party booking system 3 months before opening","Partner with Suwanee/Sugar Hill youth sports leagues for field trip traffic"],
    risks: [{ risk:"Build-out cost for CPSC/ASTM compliant equipment ($150k–$200k)", mitigation:"Phase equipment additions; start with core play structure + toddler area; add attractions Year 2", severity:"Medium" }],
    next_steps: ["Week 1: Contact Sugar Hill Hwy 20 RE broker about former retail anchor spaces","Week 2: Get commercial play structure quotes from PlayCore or Landscape Structures"],
  },
  dry_cleaning: {
    verdict: "Cautious Go",
    verdict_rationale: "Strong professional household income supports dry-cleaning demand but EPA PERC compliance or green-cleaning transition adds $40k–$80k capital requirement; pickup/delivery model reduces location dependency and improves economics.",
    assessment: "Remote/hybrid work has reduced daily dry-clean volume nationally, but Suwanee's $112k median income and 38% professional household concentration maintain above-average per-capita spending. Pickup/delivery model critical to offset walk-in traffic decline.",
    success_factors: ["Launch route-based pickup/delivery before opening plant","Partner with HOAs in Suwanee and Sugar Hill for resident delivery service","Green cleaning (GreenEarth or CO2 process) — strong differentiator and avoids PERC compliance burden"],
    risks: [{ risk:"PERC alternative equipment costs $40k–$80k more than traditional", mitigation:"Finance equipment through SBA; green positioning commands 15–20% price premium that pays back in 3 years", severity:"Medium" }],
    next_steps: ["Week 1: Contact Gwinnett County EPD for PERC permit requirements vs green-clean licensing","Week 2: Get equipment quotes for GreenEarth solvent system"],
  },
},

// ── AGENT 11 — Market Map ────────────────────────────────
11: {
  daycare: {
    summary: "Market map shows clear geographic concentration of opportunity in the northern Gwinnett corridor. Suwanee (gap 9.0) and Sugar Hill (gap 8.1) form the primary opportunity cluster 8–12 miles from the target ZIP.",
    center: { lat:33.9600, lng:-84.0800, label:"ZIP 30097 — Johns Creek" },
    cities: [
      { name:"Suwanee",        county:"Gwinnett", lat:_DC.suwanee.lat,  lng:_DC.suwanee.lng,  gap_score:9.0, demand_score:9.2, supply_score:3.1, unserved_children:680, median_income:112400, competitor_count:2, priority:"Critical Gap",     recommended_action:"Primary site — move immediately", real_estate_url:"https://www.loopnet.com" },
      { name:"Sugar Hill",     county:"Gwinnett", lat:_DC.sugar.lat,    lng:_DC.sugar.lng,    gap_score:8.1, demand_score:8.8, supply_score:4.2, unserved_children:520, median_income:98700,  competitor_count:3, priority:"Critical Gap",     recommended_action:"Backup site — tour immediately", real_estate_url:"https://www.loopnet.com" },
      { name:"Duluth",         county:"Gwinnett", lat:_DC.duluth.lat,   lng:_DC.duluth.lng,   gap_score:6.4, demand_score:8.2, supply_score:6.0, unserved_children:380, median_income:89200,  competitor_count:5, priority:"Good Opportunity", recommended_action:"Monitor; viable if Suwanee/SH unavailable", real_estate_url:"https://www.loopnet.com" },
      { name:"Buford",         county:"Hall",     lat:_DC.buford.lat,   lng:_DC.buford.lng,   gap_score:6.0, demand_score:7.8, supply_score:5.5, unserved_children:290, median_income:78400,  competitor_count:4, priority:"Good Opportunity", recommended_action:"Secondary market — lower income ceiling", real_estate_url:"https://www.loopnet.com" },
      { name:"Flowery Branch", county:"Hall",     lat:_DC.flowery.lat,  lng:_DC.flowery.lng,  gap_score:6.8, demand_score:7.4, supply_score:4.8, unserved_children:210, median_income:82100,  competitor_count:2, priority:"Good Opportunity", recommended_action:"Small market — high gap but limited ceiling", real_estate_url:"https://www.loopnet.com" },
    ],
    real_estate_pins: [
      { label:"3820 Lawrenceville-Suwanee Rd",      lat:34.055, lng:-84.072, city:"Suwanee",        sqft:6400, monthly_rent:10800, type:"Freestanding",   zoning:"C-2", ada_parking:true,  schools_within_half_mi:2, highlights:["Existing playground pad","Drive-through convertible","I-85 access"] },
      { label:"475 Buford Hwy — End Cap",            lat:34.051, lng:-84.062, city:"Suwanee",        sqft:5800, monthly_rent:9600,  type:"End-Cap Retail", zoning:"C-2", ada_parking:true,  schools_within_half_mi:1, highlights:["Corner visibility","Large rear yard","2024 HVAC"] },
      { label:"3340 Peachtree Industrial Blvd",      lat:34.108, lng:-84.058, city:"Sugar Hill",     sqft:6100, monthly_rent:8900,  type:"Strip Anchor",   zoning:"C-1", ada_parking:true,  schools_within_half_mi:3, highlights:["Below-market NNN","High residential density","Separate entrance"] },
      { label:"4885 Nelson Brogdon Blvd",            lat:34.112, lng:-84.050, city:"Sugar Hill",     sqft:5500, monthly_rent:8200,  type:"Freestanding",   zoning:"C-2", ada_parking:true,  schools_within_half_mi:2, highlights:["Fenced rear lot","ADA parking","2022 roof"] },
      { label:"3455 Hamilton Mill Rd — Retail Bay",  lat:34.002, lng:-84.101, city:"Duluth",         sqft:5200, monthly_rent:7400,  type:"Strip Anchor",   zoning:"C-1", ada_parking:false, schools_within_half_mi:1, highlights:["Lowest rent in corridor","Near apartment cluster","ADA upgrade needed"] },
    ],
    directions: [],
  },
},

// ── AGENT 12 — Grant Search ──────────────────────────────
12: {
  daycare: {
    summary: "Seven funding sources identified totaling $180k–$420k in potential non-dilutive capital. USDA CACFP provides ongoing revenue ($3–8/child/day). Georgia's CAPS subsidy expands market access. Key one-time grants: USDA Rural Development Business Grant ($50k avg) and GA DECAL Quality Rated incentives ($15k–$50k).",
    federal_grants: [
      { name:"USDA CACFP",                       amount_range:"$3–8/child/day ongoing", deadline:"Rolling", url:"https://www.fns.usda.gov/cacfp",      notes:"Revenue stream, not one-time grant — enroll immediately at opening" },
      { name:"USDA Rural Business Dev Grant",     amount_range:"$10k–$100k",            deadline:"Varies",  url:"https://www.rd.usda.gov/programs-services/business-programs/rural-business-development-grants", notes:"Gwinnett County may qualify for rural set-aside; check with USDA GA state office" },
      { name:"SBA 7(a) Loan (not grant but low-cost)", amount_range:"Up to $5M",         deadline:"Rolling", url:"https://www.sba.gov/funding-programs/loans/7a-loans", notes:"10-year term at current prime + 2.75%; best childcare financing vehicle" },
    ],
    state_grants: [
      { name:"Georgia CAPS Subsidy",              amount_range:"$500–$1,200/child/mo",  deadline:"Rolling", url:"https://decal.ga.gov/CAPS",           notes:"Accept state-subsidized children — expands market by 15–25% at no marketing cost" },
      { name:"DECAL Quality Rated Incentives",    amount_range:"$15k–$50k",             deadline:"Annual",  url:"https://decal.ga.gov/QualityRated",    notes:"Achieve 2-Star Quality Rated within 18 months; $50k one-time + ongoing grants" },
      { name:"Georgia OneGeorgia Authority",      amount_range:"$5k–$25k",              deadline:"Varies",  url:"https://www.onegeorgia.org",           notes:"Rural community development; check Gwinnett/Hall county eligibility" },
    ],
    local_incentives: [
      { name:"Gwinnett Chamber SEED Grant",       amount_range:"$2k–$10k",              deadline:"Quarterly", url:"https://www.gwinnettchamber.org",   notes:"Small business development fund; childcare prioritized category" },
      { name:"Suwanee CID Tax Abatement",         amount_range:"5-year property tax abatement", deadline:"At permitting", url:"https://www.suwanee.com/business", notes:"Contact Suwanee Economic Development office early in site selection process" },
    ],
    grants_table: [],
  },
},

// ── AGENT 13 — Competitor Deep-Dive ─────────────────────
13: {
  daycare: {
    summary: "Primrose Schools leads the premium tier with strong brand recognition and waitlists at all 2 Gwinnett locations. Independent centers fill mid-tier with inconsistent quality. Key gap: no NAEYC-accredited center in Sugar Hill. Differentiation strategy: premium infant/toddler program + NAEYC pathway + transparent pricing.",
    competitor_profiles: [
      { name:"Primrose Schools (Suwanee)",  city:"Suwanee",    tuition_infant:2100, tuition_preschool:1700, rating:4.5, qris_stars:4, naeyc:true,  capacity:110, waitlist:"Yes (8–12 weeks)", strengths:["Strong brand","Structured curriculum","Outdoor programs"], weaknesses:["Premium price limits accessible market","High director turnover in 2023"] },
      { name:"KinderCare (Duluth)",         city:"Duluth",     tuition_infant:1880, tuition_preschool:1480, rating:4.0, qris_stars:3, naeyc:false, capacity:95,  waitlist:"No",              strengths:["National brand","Corporate benefit programs","Good location"], weaknesses:["Curriculum less structured than Primrose","Lower QRIS rating"] },
      { name:"Sunshine Academy (Sugar Hill)",city:"Sugar Hill", tuition_infant:1750, tuition_preschool:1350, rating:3.8, qris_stars:2, naeyc:false, capacity:72,  waitlist:"No",              strengths:["Lower price point","Community relationships"], weaknesses:["No NAEYC","Aging facility","Limited infant slots (8 total)"] },
    ],
    pain_point_analysis: [
      { pain_point:"Infant waitlists at premium centers are 8–12 weeks", opportunity:"Open with 18 dedicated infant slots as primary differentiator" },
      { pain_point:"Parents want transparent, online enrollment — most centers require in-person tours first", opportunity:"Build digital enrollment funnel with pricing shown upfront" },
      { pain_point:"Sugar Hill has zero NAEYC-accredited centers", opportunity:"Commit to NAEYC pathway from Day 1 — becomes marketing anchor within 18 months" },
    ],
    differentiation_strategy: ["Premium infant/toddler program — highest gap, highest margin, lowest competition","NAEYC accreditation commitment — first in Sugar Hill","Online enrollment + transparent pricing page — removes #1 parent friction","CACFP-enrolled + CAPS-accepting — expands accessible market without discounting"],
    messaging_guide: [
      { segment:"Dual-income professional parents", message:"Your infant deserves the same quality investment as your home. Suwanee's first NAEYC-pathway center — with transparent pricing starting at $2,050/month." },
      { segment:"Working parents needing subsidy", message:"CAPS-enrolled and CACFP-certified. Quality care that works with your budget — apply in 10 minutes online." },
    ],
  },
},

// ── AGENT 14 — Code Review ───────────────────────────────
14: {
  daycare: {
    summary: "Pipeline review complete. 3 medium-priority issues identified (no critical). Total estimated cost per full run: $0.42–$0.68 at Claude Sonnet pricing. Primary optimization opportunity: response caching eliminates 60–70% of repeat costs.",
    overall_grade: "B+",
    issues: [
      { severity:"Medium", agent:"Agent 7 (Financial)", issue:"sub-agent merging does not handle partial failure — if sub-call B fails, merged object has undefined fields", fix:"Add null-coalesce for each sub-agent result before merge" },
      { severity:"Medium", agent:"Agent 11 (Map)",      issue:"Leaflet map does not invalidateSize() when tab is hidden then shown — tiles may not render correctly after tab switch", fix:"Call map.invalidateSize() on tab click for the Map tab" },
      { severity:"Low",    agent:"Agent 1 (Demographics)", issue:"ctx() truncation at 400 chars may cut JSON mid-key for very long city names — parseJSON on receiving end handles gracefully but loses data", fix:"Increase ctx limit to 600 chars for Agent 1 city data" },
    ],
    performance_metrics: { avg_response_time_ms:8400, max_response_time_ms:22100, total_tokens_per_run:185000, streaming_agents:1 },
    cost_analysis: { total_cost_per_run:0.54, optimized_cost_per_run:0.18, monthly_cost_10runs:5.40, monthly_cost_50runs:27.00, agents:[], optimization_tips:["Enable caching for all agents — same ZIP+industry will cost $0.00 on repeat","Use Quick Verdict preset for initial market screening"] },
    recommended_fixes_priority: ["Fix Agent 7 sub-agent partial failure handling","Add Map tab invalidateSize() on show","Increase Demographics ctx limit"],
  },
},

// ── AGENT 15 — QA Validation ─────────────────────────────
15: {
  daycare: {
    summary: "17-agent pipeline QA complete. Overall pass rate: 94%. 3 warnings (non-blocking), 0 critical failures. Data integrity: 91% of numeric fields populated with real data (vs fallback). UX: all 17 agent tabs functional; heatmap cells clickable in Agents 2 and 6.",
    overall_pass_rate: 94,
    test_suites: [
      { suite:"JSON Schema Validation", tests:17, passed:17, failed:0, warnings:0 },
      { suite:"Null-safe Rendering",    tests:42, passed:41, failed:0, warnings:1 },
      { suite:"Tab Navigation",         tests:34, passed:34, failed:0, warnings:0 },
      { suite:"Chart Rendering",        tests:8,  passed:8,  failed:0, warnings:0 },
      { suite:"Demo Mode",              tests:17, passed:17, failed:0, warnings:0 },
      { suite:"Export Functions",       tests:6,  passed:5,  failed:0, warnings:1 },
    ],
    data_validation: { fields_checked:186, fields_passed:169, fields_warned:14, fields_failed:3, critical_issues:[], warnings:["Agent 4: 2 of 4 listing URLs return 404 (LoopNet listing expiry)","Agent 5: DECAL application URL redirects — may need updating"], by_agent:[] },
    ux_audit: [
      { area:"Mobile responsiveness",  status:"Pass", notes:"All cards responsive at 375px viewport" },
      { area:"Heatmap cell clicks",     status:"Pass", notes:"Gap Analysis and Competitive Intel deep-dive working" },
      { area:"Tab switching",           status:"Pass", notes:"All 17 agents — tabs switch correctly" },
      { area:"Re-run buttons",          status:"Pass", notes:"Visible on all completed agent cards" },
      { area:"Demo mode pipeline",      status:"Pass", notes:"Full 17-agent run completes in 8s (demo mode)" },
    ],
    health_score: { overall:94, dimensions:[ { name:"Data Integrity", score:91 }, { name:"UI Correctness", score:98 }, { name:"Performance", score:92 }, { name:"Error Handling", score:95 } ] },
  },
},

// ── AGENT 16 — Build vs Buy ──────────────────────────────
16: {
  daycare: {
    summary: "Build (custom open with SBA financing) wins over franchise (Primrose, KinderCare) for this market. Franchise fees ($45k–$75k + 7% royalty) reduce Year 1 net income by ~$42k vs. independent. Custom build preserves full brand ownership and DECAL relationship. Buy (existing center acquisition) is viable if a distressed independent is identified at 2–3× EBITDA.",
    platforms: [
      { name:"Open Independent (Build)", type:"Build", fee_upfront:0, royalty_pct:0, pros:["Full brand ownership","No territory restrictions","Keep 100% of margin"], cons:["No brand recognition on Day 1","Must build own curriculum"], recommendation:"Recommended — best long-term economics given market gap" },
      { name:"Primrose Schools (Franchise)", type:"Buy-Franchise", fee_upfront:75000, royalty_pct:7, pros:["National brand","Established curriculum","Referral network"], cons:["$75k upfront + 7% royalty","Restricted territory","Corporate oversight"], recommendation:"Not recommended — royalty cost not justified in under-served market where independent can build own waitlist" },
      { name:"Acquire Existing Center", type:"Buy-Acquisition", fee_upfront:null, royalty_pct:0, pros:["Existing enrollment = Day 1 revenue","No DECAL licensing wait"], cons:["Premium 3–5× EBITDA multiples for quality centers","Takes on existing staff and lease"], recommendation:"Conditional — pursue if distressed center available at 2–3× EBITDA; otherwise Build" },
    ],
    comparison_table: [],
    decision_matrix: [
      { criterion:"Upfront cost",     build_score:8, franchise_score:4, acquisition_score:6 },
      { criterion:"Time to revenue",  build_score:6, franchise_score:7, acquisition_score:9 },
      { criterion:"Long-term margin", build_score:9, franchise_score:5, acquisition_score:7 },
      { criterion:"Brand equity",     build_score:6, franchise_score:9, acquisition_score:7 },
      { criterion:"Control",          build_score:10, franchise_score:4, acquisition_score:8 },
    ],
    recommendation: "Open as an independent with a clear NAEYC accreditation pathway and DECAL Quality Rated 2-Star target within 18 months. The market gap is strong enough that brand recognition is not a barrier — parents in an under-served market will enroll wherever there is a quality, available seat.",
    action_steps: ["Confirm Build path — begin LLC formation and SBA pre-qualification","Set NAEYC accreditation as 18-month milestone — use it as marketing anchor","Explore acquisition of Sunshine Academy (Sugar Hill) as contingency if Build timeline slips"],
  },
},

// ── AGENT 9 — Business Plan ───────────────────────────────
9: {
  daycare: {
    business_name: "Bright Futures Early Learning Center",
    entity_type: "LLC",
    owner_placeholder: "[Owner Name]",
    executive_summary: {
      concept: "Bright Futures Early Learning Center is a premium, Reggio Emilia-inspired childcare and early education center in Suwanee, GA, offering full-day programs for infants through Pre-K. Our 8,200-square-foot facility provides 75 licensed slots across 6 age-differentiated classrooms, with child-to-teacher ratios exceeding state minimums. We serve dual-income professional families in Gwinnett County's highest-income submarket — households earning $100k+ who currently face 8–14 week waitlists at competing centers.",
      opportunity: "Gwinnett County has 4,200+ working families with children under 5 and only 2,340 licensed slots within 10 miles of ZIP 30097 — a verified childcare desert per NDCP 2024 data. Sugar Hill and Suwanee lead the corridor in population growth (+18% and +12% over 5 years), with median household incomes of $98k–$112k supporting premium tuition. Three of the top 5 competitors operate at 95%+ capacity with documented waitlists.",
      ask: "Total capital: $526,500 (30% equity / 70% SBA 7(a) loan at 7.5%). Use of funds: build-out $228K · FF&E $92K · playground $48K · working capital 9 months $103K · licensing/legal $28K · marketing $15K · tech $12K. Projected 3-year ROI: 42%. Break-even at 58% enrollment (month 16).",
    },
    company_overview: {
      mission: "To nurture every child's full potential through inquiry-based learning, genuine relationships, and an environment designed for wonder — so that working families can pursue their careers with complete peace of mind.",
      vision: "To become the childcare provider of choice in Gwinnett County's northern corridor, recognized for measurable school-readiness outcomes, transparent communication, and a waitlist that proves demand.",
      values: [
        "Whole-Child Development: We address cognitive, social-emotional, and physical growth in every daily experience",
        "Radical Transparency: Parents receive daily digital updates, open-door access, and financial clarity",
        "Teacher Excellence: Above-market wages and professional development to achieve <20% annual turnover vs 45% industry average",
        "Community Partnership: Collaborate with Gwinnett County Schools, DECAL, and local pediatricians"
      ],
      legal_structure: "Georgia Limited Liability Company (LLC). Registered with Georgia SOS. EIN obtained. Converting to multi-member LLC upon equity partner entry.",
      location_rationale: "Suwanee, GA scored highest (92/100) in site analysis: $112,400 median household income, 74% working-parent concentration, 7.3% under-5 population, 12.4% 5-year population growth, and gap score 8.9/10 — the highest in the corridor. The target pad at 2847 Lawrenceville-Suwanee Rd offers existing commercial shell, adequate parking, C-2 zoning clearance, and $35/sqft TI allowance.",
      services: [
        { name: "Infant Program (6 wk – 11 mo)", capacity: 12, ratio: "1:4", monthly_tuition: 2350, annual_revenue: 338400, description: "Full-day care with sensory-rich environment, individualized feeding/sleep schedules, daily photo updates via Brightwheel" },
        { name: "Toddler Program (12 – 23 mo)", capacity: 12, ratio: "1:6", monthly_tuition: 2050, annual_revenue: 295200, description: "Language-rich program with Reggio provocation stations, outdoor play twice daily, music and movement" },
        { name: "Preschool 1 (age 2–3)", capacity: 14, ratio: "1:7", monthly_tuition: 1850, annual_revenue: 310800, description: "Project-based learning with literacy foundations, emergent curriculum, dedicated outdoor classroom access" },
        { name: "Preschool 2 (age 3–4)", capacity: 14, ratio: "1:10", monthly_tuition: 1750, annual_revenue: 294000, description: "Pre-reading, STEM explorations, social skill development with kindergarten-readiness progress reports" },
        { name: "Pre-K (age 4–5)", capacity: 16, ratio: "1:10", monthly_tuition: 1650, annual_revenue: 316800, description: "Georgia Pre-K program eligible. Structured literacy, numeracy, full-day format with school-readiness assessment" },
      ],
    },
    market_analysis: {
      target_market: "Primary customer: dual-income professional households in Gwinnett County's northern corridor earning $90k–$130k annually, typically aged 28–42 with one or two children under 5. These parents prioritize educational quality, digital transparency (app updates), and reliable hours over cost. Currently underserved — nearest rated childcare has a 14-week infant waitlist. Secondary market: corporate relocations to Suwanee Technology Park and Sugar Hill housing developments adding 800+ units/year.",
      market_size: {
        total_addressable: "47,200 households within 25 miles with children 0–5 (Census ACS 2023). At $20K avg annual spend, TAM = $944M/year.",
        serviceable: "12,400 households within 10 miles in $90k+ income bracket willing to pay premium tuition. SAM = $248M/year.",
        target_share: "75-slot center at 90% utilization = $1.38M/year revenue. Represents 0.56% of SAM — achievable given demonstrated demand gap.",
      },
      competitor_comparison: [
        { name: "Primrose School of Suwanee", locations: 1, monthly_primary_rate: 2200, rating: 4.7, waitlist: true, our_advantage: "Match Primrose quality at 7% lower infant tuition, add Brightwheel digital transparency, no current waitlist at opening" },
        { name: "Learning Experience (Duluth)", locations: 1, monthly_primary_rate: 1950, rating: 4.2, waitlist: false, our_advantage: "Reggio curriculum vs corporate TLE approach; our Suwanee location 7 miles closer to target ZIP" },
        { name: "KinderCare Sugar Hill", locations: 1, monthly_primary_rate: 1850, rating: 3.9, waitlist: false, our_advantage: "Higher teacher ratios, above-market pay cutting turnover (KinderCare 48% vs our target 20%)" },
        { name: "Sunshine House (Buford)", locations: 2, monthly_primary_rate: 1700, rating: 4.0, waitlist: false, our_advantage: "Premium positioning — not competing for price-sensitive segment; 15 miles closer to Suwanee corridor" },
      ],
      differentiators: [
        "Reggio Emilia-inspired curriculum with digital learning portfolios shared via Brightwheel — measurable school-readiness outcomes",
        "Above-market teacher pay ($18-22/hr vs $14-16/hr market) targeting <20% turnover vs 45% industry average",
        "Real-time parent app with photo updates, daily reports, electronic invoicing — 94% parent satisfaction at comparable centers",
        "NAEYC accreditation pathway beginning Month 6 — premium market signal",
        "Partner pediatrician for monthly developmental screenings included in tuition",
        "Phased enrollment with pre-enrollment waitlist strategy before opening day",
      ],
      trends: [
        "Georgia added 94,000 jobs in 2024 (BLS) — dual-income household formation rising, increasing childcare demand",
        "NDCP 2024: 49% of Gwinnett County ZIP codes are childcare deserts — supply has not kept pace with growth",
        "SBA 7(a) approval rate for childcare businesses: 78% (vs 68% all industries) per SBA FY2024 data",
        "Post-COVID: 71% of working mothers cite childcare quality as primary factor in returning to work (McKinsey 2024)",
        "Georgia Pre-K expansion adds $4,000/year/child subsidy available to qualifying centers",
      ],
    },
    financial_plan: {
      startup_capital_needed: 526500,
      use_of_funds: [
        { category: "Leasehold Improvement / Build-Out", amount: 228000, pct: 43 },
        { category: "Furniture, Fixtures & Equipment (FF&E)", amount: 92000, pct: 17 },
        { category: "Playground Equipment", amount: 48000, pct: 9 },
        { category: "Working Capital (9 months)", amount: 103500, pct: 20 },
        { category: "Licensing, Permits & Legal", amount: 28000, pct: 5 },
        { category: "Marketing & Pre-Enrollment", amount: 15000, pct: 3 },
        { category: "Technology & Software", amount: 12000, pct: 2 },
      ],
      funding_sources: [
        { source: "Owner Equity", amount: 157950, pct: 30, type: "Equity" },
        { source: "SBA 7(a) Loan (10-year, 7.5%)", amount: 368550, pct: 70, type: "Debt" },
      ],
      year1_projections:  { revenue: 830400,  gross_profit: 664320,  operating_expenses: 602800, ebitda: 61520,  net_income: 27600  },
      year2_projections:  { revenue: 1242000, gross_profit: 993600,  operating_expenses: 632400, ebitda: 361200, net_income: 279000 },
      year3_projections:  { revenue: 1386000, gross_profit: 1108800, operating_expenses: 648900, ebitda: 459900, net_income: 371400 },
      breakeven_analysis: "Month 16 at 58% enrollment (44 of 75 slots). Requires: 6 infants, 8 toddlers, 12 preschool, 10 pre-K, 8 school-age.",
      debt_service_coverage: "DSCR 1.42 at Year 2 base case — exceeds SBA minimum of 1.25",
      collateral: "SBA 7(a): personal guarantee, equipment lien ($140K FF&E), lease assignment. Owner primary residence equity ($180K) as additional collateral.",
    },
    operations_plan: {
      facility: {
        total_sqft: 8200, indoor_sqft_per_child: 38, outdoor_sqft_per_child: 82,
        rooms: [
          { name: "Infant Suite A", capacity: 6, ratio: "1:4", sqft: 420, equipment: "4 cribs, changing station, feeding chairs, sensory mat, baby monitor" },
          { name: "Infant Suite B", capacity: 6, ratio: "1:4", sqft: 420, equipment: "4 cribs, changing station, feeding chairs, sensory mat" },
          { name: "Toddler Room", capacity: 12, ratio: "1:6", sqft: 720, equipment: "Low shelving, dramatic play, art table, outdoor door" },
          { name: "Preschool A (2-3 yr)", capacity: 14, ratio: "1:7", sqft: 820, equipment: "6 interest centers, reading corner, sensory table, smart display" },
          { name: "Preschool B (3-4 yr)", capacity: 14, ratio: "1:10", sqft: 780, equipment: "Project tables, science center, block area, smart display" },
          { name: "Pre-K Room (4-5 yr)", capacity: 16, ratio: "1:10", sqft: 940, equipment: "5 student tables, whiteboard, reading library, 4 computer stations" },
        ],
      },
      hours: "Monday–Friday 6:30 AM – 6:30 PM",
      staffing_plan: [
        { role: "Center Director", count: 1, annual_salary: 68000, qualifications: "BA in ECE + 2 yrs director experience (DECAL requirement)" },
        { role: "Lead Teacher", count: 5, annual_salary: 48000, qualifications: "CDA or AA in ECE" },
        { role: "Assistant Teacher", count: 8, annual_salary: 36000, qualifications: "HS diploma + CDA in progress" },
        { role: "Cook / Nutrition Aide", count: 1, annual_salary: 34000, qualifications: "ServSafe certified, CACFP training" },
        { role: "Administrative Assistant", count: 1, annual_salary: 38000, qualifications: "Office experience, Brightwheel proficiency" },
      ],
      curriculum: "Reggio Emilia-inspired emergent curriculum with GELDS alignment. Monthly theme projects documented in digital portfolios. Annual ASQ-3 developmental screenings.",
      technology: ["Brightwheel (parent communication, check-in/out, billing)", "Procare (center management, DECAL compliance)", "4-camera IP security with parent app access", "Amazon Echo Dot for classroom music/timers"],
    },
    sba_narrative: {
      loan_purpose: "SBA 7(a) $368,550 for leasehold improvements, FF&E, playground, and working capital to open a licensed childcare center in Suwanee, GA addressing a verified childcare desert.",
      owner_experience: "Owner brings management experience and has completed Georgia SBDC childcare entrepreneurship program. Director hire brings 8 years DECAL-licensed center experience.",
      repayment_source: "Annual debt service: $54,200 (10-year term, 7.5%). Covered by Year 2 projected EBITDA of $361,200 (DSCR 1.42).",
      collateral_offered: "Personal guarantee. Equipment lien on $140K assets. Lease assignment to SBA.",
    },
    investor_slides: [
      { slide: 1, title: "The Problem", content: "49% of Gwinnett County ZIP codes are childcare deserts. 4,200+ working families — no licensed slot available within 10 miles." },
      { slide: 2, title: "The Opportunity", content: "$526K investment → $1.38M/year revenue at capacity. 42% 3-year ROI. Break-even month 16." },
      { slide: 3, title: "Why Now?", content: "Sugar Hill +18% population growth. SBA 7(a) approvals at 78% for childcare. Competitor waitlists proving unmet demand." },
      { slide: 4, title: "The Business", content: "75-slot premium center, Suwanee GA. Reggio curriculum, 6 age-differentiated classrooms. $112K median household income market." },
      { slide: 5, title: "Financial Highlights", content: "Year 1: $830K revenue | Year 2: $1.24M | Year 3: $1.39M. DSCR 1.42 at Year 2." },
    ],
  },
},

// ── AGENT 10 — Project Plan ───────────────────────────────
10: {
  daycare: {
    project_name: "Bright Futures Early Learning Center — Launch Plan",
    total_duration_months: 18,
    target_open_date: "Month 19 from project start",
    phases: [
      {
        phase: "Phase 1: Foundation & Funding",
        months: "1-3",
        color: "#4a9eff",
        tasks: [
          { task: "Form Georgia LLC", month_start: 1, duration: 0.5, owner: "Owner", priority: "Critical", cost: 150, detail: "File Articles of Organization at sos.ga.gov ($100 fee). Draft operating agreement. Appoint registered agent.", links: ["https://sos.ga.gov/page/business-formation"] },
          { task: "Obtain EIN from IRS", month_start: 1, duration: 0.25, owner: "Owner", priority: "Critical", cost: 0, detail: "Apply online at IRS.gov — free, instant. Required for banking and SBA loan.", links: ["https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online"] },
          { task: "Open Business Bank Account", month_start: 1, duration: 0.5, owner: "Owner", priority: "Critical", cost: 0, detail: "Truist or Regions preferred (active SBA lenders in Gwinnett). Bring LLC docs, EIN, photo ID.", links: [] },
          { task: "Engage SBA Lender — Pre-Qualification", month_start: 1, duration: 2, owner: "Owner + CPA", priority: "Critical", cost: 0, detail: "Contact Live Oak Bank (childcare specialist), Truist SBA, or Regions. Submit personal financial statement, credit check, business plan draft.", links: ["https://www.liveoak.bank", "https://www.truist.com/loans/small-business/sba"] },
          { task: "Hire CPA (Childcare Experience)", month_start: 1, duration: 1, owner: "Owner", priority: "High", cost: 3600, detail: "Annual engagement. Childcare industry experience required. Prepare financial projections for SBA, set up QuickBooks.", links: [] },
          { task: "Hire Attorney (Business + Real Estate)", month_start: 1, duration: 1, owner: "Owner", priority: "High", cost: 5000, detail: "Review lease, LLC docs, employment agreements. Gwinnett County experience preferred.", links: [] },
          { task: "Engage Commercial Real Estate Broker", month_start: 1, duration: 1, owner: "Owner", priority: "Critical", cost: 0, detail: "Broker commission paid by landlord. Specify: childcare use, C-1/C-2 zoning, 6,500–9,000 sqft, outdoor play space, Suwanee/Sugar Hill target.", links: ["https://www.loopnet.com", "https://www.crexi.com"] },
          { task: "DECAL Pre-Application Consultation", month_start: 2, duration: 1, owner: "Owner + DECAL Consultant", priority: "Critical", cost: 1500, detail: "Hire DECAL consultant before signing lease. Review floor plan concept against Rules Chapter 591-1. Prevents costly mistakes.", links: ["https://decal.ga.gov"] },
          { task: "SBA Loan Package Submission", month_start: 2, duration: 2, owner: "Owner + CPA + Attorney", priority: "Critical", cost: 0, detail: "Submit full SBA 7(a) package: Form 1919, Form 413, business plan, projections, personal returns, credit auth, lease LOI.", links: ["https://www.sba.gov/document/sba-form-1919-borrower-information-form"] },
          { task: "Letter of Intent on Target Lease", month_start: 2, duration: 0.5, owner: "Owner + Broker + Attorney", priority: "Critical", cost: 500, detail: "Non-binding LOI. Negotiate: 5-year lease + 2 five-year options, $35/sqft TI allowance, 3-month free rent.", links: [] },
        ],
      },
      {
        phase: "Phase 2: Legal, Lease & Design",
        months: "3-6",
        color: "#3dd68c",
        tasks: [
          { task: "Execute Commercial Lease", month_start: 3, duration: 0.5, owner: "Owner + Attorney", priority: "Critical", cost: 42000, detail: "Sign lease. Pay security deposit (3 months) + first/last month rent. Confirm TI allowance in writing.", links: [] },
          { task: "Hire Licensed Architect", month_start: 3, duration: 1, owner: "Owner", priority: "Critical", cost: 18000, detail: "Must be familiar with Georgia childcare licensing — 35 sqft/child indoor, 75 sqft/child outdoor, fire egress, handwashing stations.", links: [] },
          { task: "Apply for Building Permit", month_start: 4, duration: 1, owner: "Architect + Owner", priority: "Critical", cost: 3500, detail: "Submit to Gwinnett County building department. Change-of-occupancy permits take 4-6 weeks. Start ASAP.", links: [] },
          { task: "Zoning Certificate / Use Permit", month_start: 3, duration: 1, owner: "Owner + Attorney", priority: "Critical", cost: 500, detail: "Confirm childcare use permitted at specific address. Gwinnett County: 678-518-6000.", links: ["https://www.gwinnettcounty.com"] },
          { task: "Collect 2-3 Construction Bids", month_start: 4, duration: 1, owner: "Owner", priority: "Critical", cost: 0, detail: "Provide architect drawings to 3 licensed GCs. Specify: HVAC zoning, diaper stations, commercial kitchen, playground prep.", links: [] },
          { task: "Order Playground Equipment", month_start: 5, duration: 2, owner: "Owner", priority: "High", cost: 48000, detail: "Lead time: 8-12 weeks. ASTM F1487 safety standards required. Vendors: Playworld, Landscape Structures, GameTime.", links: ["https://www.playworld.com"] },
          { task: "DECAL Pre-Application Submission", month_start: 5, duration: 1, owner: "Owner + Consultant", priority: "Critical", cost: 50, detail: "Submit Form 282 to DECAL: business ownership, location, age groups, capacity, director info.", links: ["https://decal.ga.gov/BftS/Home.aspx"] },
        ],
      },
      {
        phase: "Phase 3: Construction & Licensing",
        months: "6-12",
        color: "#f5a623",
        tasks: [
          { task: "Construction / Build-Out", month_start: 6, duration: 4, owner: "General Contractor", priority: "Critical", cost: 185000, detail: "Typical 14-18 weeks. Monitor weekly. Key: rough-in (week 4), drywall (week 8), paint/flooring (week 12), punch list (week 16).", links: [] },
          { task: "Background Checks — All Staff", month_start: 7, duration: 2, owner: "Owner + Director", priority: "Critical", cost: 60, detail: "FBI + GBI fingerprinting for all owners, director, teachers, assistants. ~3 weeks processing. Cogent Systems (DECAL approved).", links: ["https://decal.ga.gov"] },
          { task: "Hire Center Director", month_start: 7, duration: 2, owner: "Owner", priority: "Critical", cost: 0, detail: "Must hold BA in ECE + 2 years director experience OR CDA + 5 years. DECAL lists director on license. Recruit via Indeed, LinkedIn, Georgia ECE boards.", links: ["https://www.indeed.com"] },
          { task: "DECAL Full Application", month_start: 8, duration: 2, owner: "Owner + Director + Consultant", priority: "Critical", cost: 500, detail: "Complete Form 282: director credentials, staff list, background checks, insurance proof, approved floor plan, zoning. Pay license fee $50.", links: ["https://decal.ga.gov/BftS/Home.aspx"] },
          { task: "Fire Marshal Inspection", month_start: 10, duration: 1, owner: "Owner + Contractor", priority: "Critical", cost: 0, detail: "Schedule after construction complete. Check: egress routes, fire suppression, extinguishers, smoke detectors, exit signage.", links: [] },
          { task: "Purchase Indoor FF&E", month_start: 9, duration: 2, owner: "Owner + Director", priority: "High", cost: 92000, detail: "Source: Whitney Brothers, Lakeshore Learning, Kaplan Early Learning. Budget by room: Infant $18K, Toddler $14K, Preschool $12K×2, Pre-K $12K×2.", links: ["https://www.whitneybros.com", "https://www.lakeshorelearning.com"] },
        ],
      },
      {
        phase: "Phase 4: Staffing & Pre-Opening",
        months: "12-16",
        color: "#b45cf4",
        tasks: [
          { task: "Hire Lead Teachers (5)", month_start: 12, duration: 2, owner: "Director", priority: "Critical", cost: 0, detail: "Target: CDA or AA in ECE. Post on Indeed, Georgia ECE job boards, local college career centers. $48K base salary.", links: [] },
          { task: "Hire Assistant Teachers (8)", month_start: 12, duration: 2, owner: "Director", priority: "Critical", cost: 0, detail: "HS diploma + CDA in progress. $36K base salary. Offer CDA sponsorship as retention incentive.", links: [] },
          { task: "Pre-Enrollment Marketing Campaign", month_start: 13, duration: 3, owner: "Owner", priority: "High", cost: 8000, detail: "Facebook/Instagram ads targeting Suwanee parents. Google My Business setup. Neighborhood placard campaign. Target: 40+ pre-enrolled families.", links: [] },
          { task: "Staff Training — DECAL Orientation", month_start: 14, duration: 2, owner: "Director", priority: "Critical", cost: 2000, detail: "DECAL pre-service training: CPR/First Aid, Universal Precautions, Shaken Baby Syndrome. All staff must complete before opening.", links: ["https://decal.ga.gov"] },
          { task: "Brightwheel / Procare Setup", month_start: 14, duration: 1, owner: "Admin", priority: "High", cost: 3600, detail: "Set up parent accounts, billing schedules, classroom management. Run test billing cycle.", links: ["https://www.mybrightwheel.com"] },
          { task: "DECAL License Issuance", month_start: 15, duration: 1, owner: "Owner + DECAL", priority: "Critical", cost: 0, detail: "Expect DECAL to issue license within 30 days of final inspection approval. Keep copy posted at entry per GA rules.", links: [] },
        ],
      },
      {
        phase: "Phase 5: Soft Open & Ramp",
        months: "16-18",
        color: "#22c55e",
        tasks: [
          { task: "Soft Opening — 40% Capacity", month_start: 16, duration: 1, owner: "Director + Owner", priority: "Critical", cost: 0, detail: "Open with pre-enrolled families only. Limit to ~30 children for first 2 weeks. Iron out operational workflows.", links: [] },
          { task: "First Parent Communication", month_start: 16, duration: 0.25, owner: "Director", priority: "High", cost: 0, detail: "Send welcome packet via Brightwheel. Include: daily schedule, meal menu, curriculum overview, emergency contact forms.", links: [] },
          { task: "CACFP Enrollment", month_start: 16, duration: 1, owner: "Cook + Director", priority: "High", cost: 0, detail: "Apply for Child and Adult Care Food Program reimbursement. Adds ~$18K/year for meals. Contact Georgia Department of Education.", links: ["https://www.gadoe.org/nutrition"] },
          { task: "Ramp to 75% Capacity", month_start: 17, duration: 2, owner: "Director + Owner", priority: "High", cost: 0, detail: "Enroll from pre-registration list. Target 56 children by end of Month 18. Begin waitlist.", links: [] },
          { task: "NAEYC Accreditation Application", month_start: 18, duration: 1, owner: "Director", priority: "Medium", cost: 1000, detail: "Submit NAEYC self-study application. Process takes 12-18 months. Premium market signal — commands 8-12% tuition premium.", links: ["https://www.naeyc.org/accreditation"] },
        ],
      },
    ],
    milestones: [
      { month: "Month 1",  title: "Entity Formation Complete",     detail: "LLC formed, EIN obtained, bank account open, SBA lender engaged", owner: "Owner",          priority: "critical" },
      { month: "Month 2",  title: "SBA Loan Package Submitted",    detail: "Full 7(a) package submitted — Form 1919, 413, projections, LOI", owner: "Owner + CPA",    priority: "critical" },
      { month: "Month 3",  title: "Lease Signed + Architect Hired", detail: "Commercial lease executed, architect retained, building permit submitted", owner: "Owner", priority: "critical" },
      { month: "Month 5",  title: "SBA Loan Approved",             detail: "SBA approval received, loan closes, funds available", owner: "Lender",          priority: "critical" },
      { month: "Month 6",  title: "Construction Begins",           detail: "GC mobilizes, build-out underway, playground order placed",        owner: "GC",             priority: "critical" },
      { month: "Month 10", title: "Construction Complete",         detail: "Building ready, fire marshal inspection passed, health inspection passed", owner: "Owner",  priority: "critical" },
      { month: "Month 12", title: "Hiring Phase Begins",           detail: "Director hired, teacher recruiting active, DECAL application submitted", owner: "Owner",   priority: "critical" },
      { month: "Month 15", title: "DECAL License Issued",          detail: "State childcare license received — legally permitted to operate",  owner: "DECAL",          priority: "critical" },
      { month: "Month 16", title: "Soft Open — 40% Capacity",      detail: "30 children enrolled, staff trained, billing system live",        owner: "Director",       priority: "critical" },
      { month: "Month 18", title: "Full Ramp — 75% Capacity Target",detail: "56+ children enrolled, CACFP active, NAEYC application submitted", owner: "Owner",       priority: "high"     },
    ],
    budget_tracker: [
      { category: "Leasehold Improvement",   budgeted: 228000, actual: 0, variance: 228000, status: "Pending" },
      { category: "FF&E (Furniture/Fixtures)", budgeted: 92000, actual: 0, variance: 92000, status: "Pending" },
      { category: "Playground Equipment",    budgeted: 48000,  actual: 0, variance: 48000,  status: "Pending" },
      { category: "Working Capital Reserve", budgeted: 103500, actual: 0, variance: 103500, status: "Pending" },
      { category: "Legal / Permits",         budgeted: 28000,  actual: 0, variance: 28000,  status: "Pending" },
      { category: "Marketing (Pre-Open)",    budgeted: 15000,  actual: 0, variance: 15000,  status: "Pending" },
      { category: "Technology / Software",   budgeted: 12000,  actual: 0, variance: 12000,  status: "Pending" },
    ],
    risk_register: [
      { risk: "SBA Loan Delayed > 90 days",         probability: "Medium", impact: "High",   mitigation: "Start SBA process Month 1. Parallel-path USDA loan or equipment financing as backup.", owner: "Owner" },
      { risk: "Construction Cost Overrun > 15%",    probability: "Medium", impact: "High",   mitigation: "AIA contract with fixed-price bid. 10% contingency in budget. Weekly GC check-ins.", owner: "Owner + GC" },
      { risk: "DECAL License Delay",                probability: "Low",    impact: "Critical",mitigation: "Hire DECAL consultant Month 2. Submit application Month 8. Allow 30-day buffer.", owner: "Owner + Consultant" },
      { risk: "Director Hire Takes > 3 Months",     probability: "Medium", impact: "High",   mitigation: "Start recruiting Month 7. Use staffing agency. Maintain temp director option via DECAL waiver.", owner: "Owner" },
      { risk: "Pre-Enrollment < 30 Families",       probability: "Low",    impact: "Medium", mitigation: "Launch marketing Month 13. Target $8K paid social campaign. Offer founding-family discount.", owner: "Owner" },
      { risk: "Lease TI Allowance Clawback",        probability: "Low",    impact: "Medium", mitigation: "Attorney reviews TI terms before signing. Ensure TI is non-recourse on lease termination.", owner: "Attorney" },
    ],
    team_vendors: [
      { role: "SBA Lender", vendor: "Live Oak Bank", contact: "1-866-518-0286", url: "https://www.liveoak.bank", phase: "Month 1" },
      { role: "CPA (Childcare)", vendor: "Local CPA TBD", contact: "Georgia Society of CPAs referral: 404-231-8676", url: "https://www.gscpa.org", phase: "Month 1" },
      { role: "Real Estate Broker", vendor: "Gwinnett Commercial Brokers", contact: "Via LoopNet referral", url: "https://www.loopnet.com", phase: "Month 1" },
      { role: "DECAL Consultant", vendor: "Georgia Childcare Consulting LLC", contact: "See DECAL vendor list", url: "https://decal.ga.gov", phase: "Month 2" },
      { role: "Architect", vendor: "Local architect with childcare experience", contact: "AIA Georgia referral: 404-253-2453", url: "https://www.aiaatlanta.com", phase: "Month 3" },
      { role: "General Contractor", vendor: "Competitive bid — 3 quotes required", contact: "Via sos.ga.gov license verification", url: "https://sos.ga.gov", phase: "Month 5" },
      { role: "Playground Equipment", vendor: "Playworld / Landscape Structures", contact: "1-800-233-4080", url: "https://www.playworld.com", phase: "Month 5" },
      { role: "Center Management Software", vendor: "Brightwheel + Procare", contact: "support@mybrightwheel.com", url: "https://www.mybrightwheel.com", phase: "Month 14" },
    ],
    checklist_phases: [
      { phase: "Pre-Opening Legal", items: ["LLC filed ✓","EIN obtained ✓","Bank account open ✓","SBA loan approved ✓","Commercial lease signed ✓","Business insurance (GL + property) ✓","DECAL license issued ✓"] },
      { phase: "Facility Readiness", items: ["Building permit approved ✓","Construction complete ✓","Fire marshal inspection passed ✓","Health department inspection passed ✓","Playground installed + safety audit ✓","All FF&E delivered + installed ✓"] },
      { phase: "Staffing & Compliance", items: ["Director hired + credentialed ✓","All staff background checks complete ✓","CPR/First Aid certified — all staff ✓","Staff DECAL orientation complete ✓","Student-teacher ratios verified ✓"] },
      { phase: "Operations Ready", items: ["Brightwheel configured + tested ✓","Procare billing tested ✓","CACFP enrollment submitted ✓","Daily schedule finalized ✓","Parent handbook distributed ✓","Emergency procedures posted ✓"] },
    ],
  },
},

// ── AGENT 17 — Sources & Citations ───────────────────────
17: {
  daycare: {
    summary: "Source review complete across all 17 agents. 94% of factual claims are sourced to verifiable public data (Census, BLS, DECAL, USDA). 6 claims flagged as AI-estimated and clearly labeled. No fabricated business names, addresses, or statistics detected. Citation quality score: 88/100.",
    data_sources: [
      { category: "Demographics", source: "US Census ACS 2023 1-year estimates (Tables B01001, B19013, B23025)", url: "https://data.census.gov", agent: "Agent 1", data_used: "Population by age group, household income, employment status for ZIP codes in analysis radius", last_updated: "2023 (ACS 1-year)", reliability: "High" },
      { category: "Demographics", source: "BLS Quarterly Census of Employment and Wages (QCEW) Q3 2024", url: "https://www.bls.gov/cew/", agent: "Agent 1", data_used: "Local employment levels, wage data for Gwinnett/Hall Counties", last_updated: "Q3 2024", reliability: "High" },
      { category: "Demographics", source: "Census Population Estimates Program (PEP) 2023", url: "https://www.census.gov/programs-surveys/popest.html", agent: "Agent 1", data_used: "Annual population estimates, growth rates 2020–2023", last_updated: "2023", reliability: "High" },
      { category: "Compliance & Licensing", source: "DECAL Child Care Licensing Rules (Chapter 591-1-1)", url: "https://decal.ga.gov", agent: "Agent 5", data_used: "Physical space requirements, staff ratios, director qualifications, application process", last_updated: "2024", reliability: "High" },
      { category: "Compliance & Licensing", source: "Gwinnett County Zoning Ordinance", url: "https://www.gwinnettcounty.com", agent: "Agent 5", data_used: "C-1/C-2 zoning requirements for childcare use, outdoor space requirements", last_updated: "2024", reliability: "High" },
      { category: "Competitive Intelligence", source: "DECAL Licensed Facility Public Search", url: "https://www.decal.ga.gov/Search/PublicFacilitySearch", agent: "Agent 6", data_used: "Licensed childcare provider count, capacity, location within 25-mile radius of ZIP 30097", last_updated: "January 2025", reliability: "High" },
      { category: "Competitive Intelligence", source: "Google Maps / Winnie childcare marketplace", url: "https://www.winniehq.com", agent: "Agent 6", data_used: "Competitor tuition rates, Google ratings, waitlist status", last_updated: "January 2025", reliability: "Medium" },
      { category: "Financial", source: "SBA 7(a) Loan Program Guidelines FY2024", url: "https://www.sba.gov/funding-programs/loans/7a-loans", agent: "Agent 7", data_used: "Loan terms, approval rates, collateral requirements for childcare businesses", last_updated: "FY2024", reliability: "High" },
      { category: "Financial", source: "National Childcare Association Financial Benchmarks 2024", url: "https://www.naccrra.org", agent: "Agent 7", data_used: "Industry-standard labor cost ratios (65-70% of revenue), typical startup cost ranges", last_updated: "2024", reliability: "Medium" },
      { category: "Market Research", source: "National Day Care & Pre-school Statistics (NDCP) State Fact Sheets 2024", url: "https://www.childcaredeserts.org", agent: "Agent 8", data_used: "Childcare desert designation for Gwinnett County ZIPs, licensed slot vs demand gap data", last_updated: "2024", reliability: "High" },
      { category: "Funding & Grants", source: "USDA CACFP Program Guidelines", url: "https://www.fns.usda.gov/cacfp", agent: "Agent 12", data_used: "Child and Adult Care Food Program reimbursement rates, eligibility criteria", last_updated: "FY2025", reliability: "High" },
      { category: "Funding & Grants", source: "Georgia Department of Early Care and Learning Grant Portal", url: "https://decal.ga.gov/Bft/Grants.aspx", agent: "Agent 12", data_used: "Available state grants for new childcare centers, application requirements", last_updated: "2024", reliability: "High" },
    ],
    data_quality_notes: [
      { note: "Competitor tuition rates sourced from Winnie/Google public listings — may not reflect current pricing. Verify by calling each center directly.", severity: "Warning" },
      { note: "Real estate rental rates are LoopNet market estimates — actual rates depend on lease negotiation. Verify with listing broker before LOI.", severity: "Warning" },
      { note: "Population growth projections beyond 5 years are extrapolated from historical Census PEP data — treat as directional, not precise.", severity: "Info" },
      { note: "SBA approval rate (78%) is national average for childcare — individual approval depends on applicant creditworthiness and business plan quality.", severity: "Info" },
    ],
    sourced_claims: [
      { claim: "Median household income in Suwanee GA: $112,400", source: "US Census ACS 2023", verifiable: true },
      { claim: "49% of Gwinnett County ZIP codes are childcare deserts", source: "NDCP State Fact Sheets 2024", verifiable: true },
      { claim: "Sugar Hill 5-year population growth: +18.2%", source: "Census PEP 2023", verifiable: true },
      { claim: "SBA 7(a) approval rate for childcare businesses: 78%", source: "SBA FY2024 Annual Report", verifiable: true },
      { claim: "DECAL requires 35 sqft/child indoor, 75 sqft/child outdoor", source: "DECAL Rules Chapter 591-1-1", verifiable: true },
      { claim: "Georgia Pre-K program adds $4,000/year/child subsidy", source: "Georgia DOE Pre-K Program", verifiable: true },
    ],
    unable_to_source: [
      { claim: "Competitor waitlist lengths (8-14 weeks for infants)", reason: "AI estimate based on Google review analysis and reported anecdotal data — not from a verified public dataset", agent: "Agent 6 — Competitive Intel" },
      { claim: "Working parent concentration: 74% in Suwanee", reason: "Derived estimate combining Census B23025 (employment status) + B11003 (family composition) — not a direct Census figure", agent: "Agent 1 — Demographics" },
      { claim: "Industry teacher turnover rate: 45%", reason: "National industry estimate from multiple advocacy reports — no single authoritative dataset", agent: "Agent 9 — Business Plan" },
    ],
    citation_quality_score: 88,
  },
},

}; // end DEMO_DATA
