/**
 * Agent 4 — Real Estate Search
 * Phase: 4 (sequential, runs BEFORE agent 7 so financials get real estate data)
 * Inputs: agents 3 (site selection), 5 (compliance/zoning)
 * Output: Live listings with LoopNet/Crexi/BizBuySell links and broker contacts
 *
 * IMPORTANT: Agent 4 must complete before Agent 7 starts.
 * In runPipeline(): r4 = await runAgent4(...); r7 = await runAgent7(..., r4, ...)
 *
 * Key schema fields:
 *   listings[].address, .city, .sqft, .monthly_rent, .zoning
 *   listings[].listing_url, .broker_name, .broker_phone
 *   listings[].outdoor_space_available, .outdoor_sqft_est
 *   listings[].buildout_cost_est, .availability, .score
 *   by_city_summary[].avg_rent_sqft, .available_listings_est
 *
 * Covers: Suwanee, Sugar Hill, Johns Creek, Buford, Cumming, Winder (Barrow), Auburn (Barrow)
 * Sources: LoopNet, BizBuySell, Crexi, Barrow County Development Authority
 */
export const SCHEMA = {
  summary: 'string',
  search_urls: { loopnet:'url', loopnet_barrow:'url', bizbuysell:'url',
    crexi:'url', crexi_barrow:'url', costar:'url',
    gwinnett_gis:'url', barrow_planning:'url' },
  listings: [{
    id:0, address:'string', city:'string', property_type:'string',
    sqft:0, monthly_rent:0, price_per_sqft:0.0, zoning:'string',
    outdoor_space_available:true, outdoor_sqft_est:0,
    suitable_for_daycare:true, buildout_cost_est:0,
    source:'LoopNet|BizBuySell|CoStar|Crexi',
    listing_url:'string', broker_name:'string', broker_phone:'string',
    availability:'string', score:0, notes:'string'
  }],
  by_city_summary: [{
    city:'string', avg_rent_sqft:0.0, available_listings_est:0,
    best_zoning:'string', market_note:'string'
  }]
};
