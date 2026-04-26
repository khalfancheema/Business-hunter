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
      { city:"Suwanee",    total_centers:3, licensed_capacity:285, qris_rated_count:2, naeyc_count:1, avg_tuition_infant:1980, avg_tuition_preschool:1520, avg_rating:4.2, market_saturation:"Low",    notes:"One Primrose; two independent; no true infant waitlist capacity" },
      { city:"Sugar Hill", total_centers:4, licensed_capacity:340, qris_rated_count:1, naeyc_count:0, avg_tuition_infant:1850, avg_tuition_preschool:1420, avg_rating:3.9, market_saturation:"Low",    notes:"No NAEYC-accredited center; quality gap at infant level" },
      { city:"Duluth",     total_centers:7, licensed_capacity:620, qris_rated_count:3, naeyc_count:2, avg_tuition_infant:1790, avg_tuition_preschool:1380, avg_rating:4.0, market_saturation:"Medium", notes:"KinderCare and 2 Brightspring centers; more competitive" },
    ],
    top_chains: [
      { name:"Primrose Schools",   locations_in_area:2, avg_tuition_infant:2100, avg_rating:4.5, qris_stars:4 },
      { name:"KinderCare",         locations_in_area:3, avg_tuition_infant:1900, avg_rating:4.0, qris_stars:3 },
      { name:"Bright Horizons",    locations_in_area:1, avg_tuition_infant:2300, avg_rating:4.6, qris_stars:4 },
      { name:"Independent Centers",locations_in_area:8, avg_tuition_infant:1650, avg_rating:3.8, qris_stars:2 },
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
      { month:"M1",  rev:18000,   exp:108400, cum:-526000 },
      { month:"M3",  rev:55000,   exp:108400, cum:-440000 },
      { month:"M6",  rev:85000,   exp:108400, cum:-340000 },
      { month:"M9",  rev:110000,  exp:108400, cum:-245000 },
      { month:"M12", rev:130000,  exp:108400, cum:-155000 },
      { month:"M15", rev:140000,  exp:108400, cum:-40000  },
      { month:"M18", rev:145000,  exp:110000, cum:95000   },
      { month:"M24", rev:155000,  exp:112000, cum:320000  },
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
      { label:"3820 Lawrenceville-Suwanee Rd", lat:34.055, lng:-84.072, city:"Suwanee",    sqft:6400, monthly_rent:10800, type:"Freestanding" },
      { label:"3340 Peachtree Industrial Blvd", lat:34.108, lng:-84.058, city:"Sugar Hill", sqft:6100, monthly_rent:8900,  type:"Strip Anchor"  },
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

// ── AGENT 17 — Sources & Citations ───────────────────────
17: {
  daycare: {
    summary: "Source review complete across all 17 agents. 94% of factual claims are sourced to verifiable public data (Census, BLS, DECAL, USDA). 6 claims flagged as AI-estimated and clearly labeled. No fabricated business names, addresses, or statistics detected. Citation quality score: 88/100.",
    all_sources: [
      { agent:"Agent 1", source:"US Census ACS 2023 1-year estimates", url:"https://data.census.gov", type:"Government" },
      { agent:"Agent 1", source:"BLS QCEW Q3 2024", url:"https://www.bls.gov/cew/", type:"Government" },
      { agent:"Agent 5", source:"DECAL Child Care Licensing Rules", url:"https://decal.ga.gov", type:"Government" },
      { agent:"Agent 6", source:"DECAL Licensed Facility Search", url:"https://www.decal.ga.gov/Search/PublicFacilitySearch", type:"Government" },
      { agent:"Agent 7", source:"SBA 7(a) Loan Program Guidelines", url:"https://www.sba.gov", type:"Government" },
      { agent:"Agent 8", source:"NDCP State Fact Sheets 2024", url:"https://www.childcaredeserts.org", type:"Research" },
    ],
    unverified_claims: [
      { agent:"Agent 4", claim:"LoopNet listing monthly rents are estimates based on market comparables", suggested_action:"Verify with listing broker before signing LOI" },
      { agent:"Agent 6", claim:"Competitor tuition rates are based on public Winnie/Google listing data and may not reflect current pricing", suggested_action:"Call each competitor to confirm current infant and preschool rates" },
    ],
    citation_quality_score: 88,
  },
},

}; // end DEMO_DATA
