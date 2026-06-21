// ══════════════════════════════════════════════════════════
// 45-deal-benchmarks.js — Industry Benchmark Data
// Median revenue, SDE, multiples, margins, SBA default rates
// for all 16 industries. Used by Deal Calculator & scoring.
// ══════════════════════════════════════════════════════════

const DEAL_BENCHMARKS = {
  daycare: {
    median_revenue: 850000, median_sde: 170000,
    avg_cf_multiple: 2.8, avg_revenue_multiple: 0.56,
    avg_margin_pct: 20, sba_default_rate_pct: 3.8,
    typical_asking: 475000, typical_down_pct: 15,
    owner_operated: true
  },
  gas_station: {
    median_revenue: 2400000, median_sde: 240000,
    avg_cf_multiple: 3.5, avg_revenue_multiple: 0.35,
    avg_margin_pct: 10, sba_default_rate_pct: 5.2,
    typical_asking: 840000, typical_down_pct: 20,
    owner_operated: true
  },
  laundromat: {
    median_revenue: 300000, median_sde: 105000,
    avg_cf_multiple: 2.5, avg_revenue_multiple: 0.88,
    avg_margin_pct: 35, sba_default_rate_pct: 3.1,
    typical_asking: 262000, typical_down_pct: 15,
    owner_operated: false
  },
  car_wash: {
    median_revenue: 450000, median_sde: 135000,
    avg_cf_multiple: 3.0, avg_revenue_multiple: 0.90,
    avg_margin_pct: 30, sba_default_rate_pct: 4.0,
    typical_asking: 405000, typical_down_pct: 15,
    owner_operated: false
  },
  restaurant: {
    median_revenue: 900000, median_sde: 126000,
    avg_cf_multiple: 2.2, avg_revenue_multiple: 0.31,
    avg_margin_pct: 14, sba_default_rate_pct: 7.8,
    typical_asking: 277000, typical_down_pct: 20,
    owner_operated: true
  },
  gym: {
    median_revenue: 600000, median_sde: 120000,
    avg_cf_multiple: 2.5, avg_revenue_multiple: 0.50,
    avg_margin_pct: 20, sba_default_rate_pct: 5.5,
    typical_asking: 300000, typical_down_pct: 15,
    owner_operated: true
  },
  indoor_play: {
    median_revenue: 400000, median_sde: 100000,
    avg_cf_multiple: 2.3, avg_revenue_multiple: 0.58,
    avg_margin_pct: 25, sba_default_rate_pct: 4.5,
    typical_asking: 230000, typical_down_pct: 15,
    owner_operated: true
  },
  dry_cleaning: {
    median_revenue: 350000, median_sde: 87500,
    avg_cf_multiple: 2.0, avg_revenue_multiple: 0.50,
    avg_margin_pct: 25, sba_default_rate_pct: 4.2,
    typical_asking: 175000, typical_down_pct: 15,
    owner_operated: true
  },
  senior_care: {
    median_revenue: 1200000, median_sde: 240000,
    avg_cf_multiple: 3.5, avg_revenue_multiple: 0.70,
    avg_margin_pct: 20, sba_default_rate_pct: 3.5,
    typical_asking: 840000, typical_down_pct: 20,
    owner_operated: false
  },
  tutoring: {
    median_revenue: 250000, median_sde: 75000,
    avg_cf_multiple: 2.0, avg_revenue_multiple: 0.60,
    avg_margin_pct: 30, sba_default_rate_pct: 3.0,
    typical_asking: 150000, typical_down_pct: 10,
    owner_operated: true
  },
  urgent_care: {
    median_revenue: 1800000, median_sde: 360000,
    avg_cf_multiple: 4.0, avg_revenue_multiple: 0.80,
    avg_margin_pct: 20, sba_default_rate_pct: 2.8,
    typical_asking: 1440000, typical_down_pct: 20,
    owner_operated: false
  },
  medical_practice: {
    median_revenue: 1500000, median_sde: 300000,
    avg_cf_multiple: 3.8, avg_revenue_multiple: 0.76,
    avg_margin_pct: 20, sba_default_rate_pct: 2.5,
    typical_asking: 1140000, typical_down_pct: 20,
    owner_operated: false
  },
  optometry: {
    median_revenue: 900000, median_sde: 225000,
    avg_cf_multiple: 3.2, avg_revenue_multiple: 0.80,
    avg_margin_pct: 25, sba_default_rate_pct: 2.2,
    typical_asking: 720000, typical_down_pct: 15,
    owner_operated: true
  },
  coffee_shop: {
    median_revenue: 500000, median_sde: 85000,
    avg_cf_multiple: 2.0, avg_revenue_multiple: 0.34,
    avg_margin_pct: 17, sba_default_rate_pct: 6.5,
    typical_asking: 170000, typical_down_pct: 15,
    owner_operated: true
  },
  barbershop: {
    median_revenue: 250000, median_sde: 75000,
    avg_cf_multiple: 1.8, avg_revenue_multiple: 0.54,
    avg_margin_pct: 30, sba_default_rate_pct: 3.5,
    typical_asking: 135000, typical_down_pct: 10,
    owner_operated: true
  },
  coworking: {
    median_revenue: 700000, median_sde: 140000,
    avg_cf_multiple: 3.0, avg_revenue_multiple: 0.60,
    avg_margin_pct: 20, sba_default_rate_pct: 5.0,
    typical_asking: 420000, typical_down_pct: 20,
    owner_operated: false
  }
};
