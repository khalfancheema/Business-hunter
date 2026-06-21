// ══════════════════════════════════════════════════════════
// 45-deal-benchmarks.js — Industry Benchmark Data
// Median revenue, SDE, multiples, margins, SBA default rates,
// operator salaries, NAICS codes, and SBA loan statistics
// for all 16 industries. Used by Deal Calculator & scoring.
// ══════════════════════════════════════════════════════════

const DEAL_BENCHMARKS = {
  daycare: {
    median_revenue: 850000, median_sde: 170000,
    avg_cf_multiple: 2.8, avg_revenue_multiple: 0.56,
    avg_margin_pct: 20, sba_default_rate_pct: 3.8,
    typical_asking: 475000, typical_down_pct: 15,
    owner_operated: true, operator_salary: 52000,
    naics: '624410', naics_label: 'Child Day Care Services',
    sba_avg_loan: 350000, sba_avg_term: 10, sba_approval_pct: 68,
    sba_total_loans_yr: 1850, top_states: ['TX','CA','FL']
  },
  gas_station: {
    median_revenue: 2400000, median_sde: 240000,
    avg_cf_multiple: 3.5, avg_revenue_multiple: 0.35,
    avg_margin_pct: 10, sba_default_rate_pct: 5.2,
    typical_asking: 840000, typical_down_pct: 20,
    owner_operated: true, operator_salary: 45000,
    naics: '447110', naics_label: 'Gasoline Stations with Convenience Stores',
    sba_avg_loan: 620000, sba_avg_term: 12, sba_approval_pct: 58,
    sba_total_loans_yr: 3200, top_states: ['TX','CA','FL']
  },
  laundromat: {
    median_revenue: 300000, median_sde: 105000,
    avg_cf_multiple: 2.5, avg_revenue_multiple: 0.88,
    avg_margin_pct: 35, sba_default_rate_pct: 3.1,
    typical_asking: 262000, typical_down_pct: 15,
    owner_operated: false, operator_salary: 38000,
    naics: '812310', naics_label: 'Coin-Operated Laundries and Drycleaners',
    sba_avg_loan: 210000, sba_avg_term: 10, sba_approval_pct: 72,
    sba_total_loans_yr: 980, top_states: ['CA','NY','TX']
  },
  car_wash: {
    median_revenue: 450000, median_sde: 135000,
    avg_cf_multiple: 3.0, avg_revenue_multiple: 0.90,
    avg_margin_pct: 30, sba_default_rate_pct: 4.0,
    typical_asking: 405000, typical_down_pct: 15,
    owner_operated: false, operator_salary: 42000,
    naics: '811192', naics_label: 'Car Washes',
    sba_avg_loan: 380000, sba_avg_term: 10, sba_approval_pct: 65,
    sba_total_loans_yr: 1100, top_states: ['TX','FL','CA']
  },
  restaurant: {
    median_revenue: 900000, median_sde: 126000,
    avg_cf_multiple: 2.2, avg_revenue_multiple: 0.31,
    avg_margin_pct: 14, sba_default_rate_pct: 7.8,
    typical_asking: 277000, typical_down_pct: 20,
    owner_operated: true, operator_salary: 55000,
    naics: '722511', naics_label: 'Full-Service Restaurants',
    sba_avg_loan: 450000, sba_avg_term: 10, sba_approval_pct: 52,
    sba_total_loans_yr: 8500, top_states: ['CA','TX','NY']
  },
  gym: {
    median_revenue: 600000, median_sde: 120000,
    avg_cf_multiple: 2.5, avg_revenue_multiple: 0.50,
    avg_margin_pct: 20, sba_default_rate_pct: 5.5,
    typical_asking: 300000, typical_down_pct: 15,
    owner_operated: true, operator_salary: 48000,
    naics: '713940', naics_label: 'Fitness and Recreational Sports Centers',
    sba_avg_loan: 320000, sba_avg_term: 10, sba_approval_pct: 60,
    sba_total_loans_yr: 2100, top_states: ['CA','TX','FL']
  },
  indoor_play: {
    median_revenue: 400000, median_sde: 100000,
    avg_cf_multiple: 2.3, avg_revenue_multiple: 0.58,
    avg_margin_pct: 25, sba_default_rate_pct: 4.5,
    typical_asking: 230000, typical_down_pct: 15,
    owner_operated: true, operator_salary: 40000,
    naics: '713120', naics_label: 'Amusement Arcades',
    sba_avg_loan: 250000, sba_avg_term: 10, sba_approval_pct: 62,
    sba_total_loans_yr: 420, top_states: ['TX','CA','FL']
  },
  dry_cleaning: {
    median_revenue: 350000, median_sde: 87500,
    avg_cf_multiple: 2.0, avg_revenue_multiple: 0.50,
    avg_margin_pct: 25, sba_default_rate_pct: 4.2,
    typical_asking: 175000, typical_down_pct: 15,
    owner_operated: true, operator_salary: 38000,
    naics: '812320', naics_label: 'Drycleaning and Laundry Services',
    sba_avg_loan: 180000, sba_avg_term: 10, sba_approval_pct: 66,
    sba_total_loans_yr: 750, top_states: ['CA','NY','TX']
  },
  senior_care: {
    median_revenue: 1200000, median_sde: 240000,
    avg_cf_multiple: 3.5, avg_revenue_multiple: 0.70,
    avg_margin_pct: 20, sba_default_rate_pct: 3.5,
    typical_asking: 840000, typical_down_pct: 20,
    owner_operated: false, operator_salary: 62000,
    naics: '623110', naics_label: 'Nursing Care Facilities',
    sba_avg_loan: 750000, sba_avg_term: 15, sba_approval_pct: 70,
    sba_total_loans_yr: 1400, top_states: ['CA','TX','FL']
  },
  tutoring: {
    median_revenue: 250000, median_sde: 75000,
    avg_cf_multiple: 2.0, avg_revenue_multiple: 0.60,
    avg_margin_pct: 30, sba_default_rate_pct: 3.0,
    typical_asking: 150000, typical_down_pct: 10,
    owner_operated: true, operator_salary: 42000,
    naics: '611691', naics_label: 'Exam Preparation and Tutoring',
    sba_avg_loan: 120000, sba_avg_term: 7, sba_approval_pct: 74,
    sba_total_loans_yr: 380, top_states: ['CA','TX','NY']
  },
  urgent_care: {
    median_revenue: 1800000, median_sde: 360000,
    avg_cf_multiple: 4.0, avg_revenue_multiple: 0.80,
    avg_margin_pct: 20, sba_default_rate_pct: 2.8,
    typical_asking: 1440000, typical_down_pct: 20,
    owner_operated: false, operator_salary: 85000,
    naics: '621493', naics_label: 'Freestanding Ambulatory Surgical and Emergency Centers',
    sba_avg_loan: 950000, sba_avg_term: 15, sba_approval_pct: 75,
    sba_total_loans_yr: 620, top_states: ['TX','FL','CA']
  },
  medical_practice: {
    median_revenue: 1500000, median_sde: 300000,
    avg_cf_multiple: 3.8, avg_revenue_multiple: 0.76,
    avg_margin_pct: 20, sba_default_rate_pct: 2.5,
    typical_asking: 1140000, typical_down_pct: 20,
    owner_operated: false, operator_salary: 78000,
    naics: '621111', naics_label: 'Offices of Physicians',
    sba_avg_loan: 880000, sba_avg_term: 15, sba_approval_pct: 78,
    sba_total_loans_yr: 1800, top_states: ['CA','TX','NY']
  },
  optometry: {
    median_revenue: 900000, median_sde: 225000,
    avg_cf_multiple: 3.2, avg_revenue_multiple: 0.80,
    avg_margin_pct: 25, sba_default_rate_pct: 2.2,
    typical_asking: 720000, typical_down_pct: 15,
    owner_operated: true, operator_salary: 65000,
    naics: '621320', naics_label: 'Offices of Optometrists',
    sba_avg_loan: 520000, sba_avg_term: 10, sba_approval_pct: 80,
    sba_total_loans_yr: 950, top_states: ['CA','TX','FL']
  },
  coffee_shop: {
    median_revenue: 500000, median_sde: 85000,
    avg_cf_multiple: 2.0, avg_revenue_multiple: 0.34,
    avg_margin_pct: 17, sba_default_rate_pct: 6.5,
    typical_asking: 170000, typical_down_pct: 15,
    owner_operated: true, operator_salary: 42000,
    naics: '722515', naics_label: 'Snack and Nonalcoholic Beverage Bars',
    sba_avg_loan: 280000, sba_avg_term: 10, sba_approval_pct: 55,
    sba_total_loans_yr: 4200, top_states: ['CA','NY','WA']
  },
  barbershop: {
    median_revenue: 250000, median_sde: 75000,
    avg_cf_multiple: 1.8, avg_revenue_multiple: 0.54,
    avg_margin_pct: 30, sba_default_rate_pct: 3.5,
    typical_asking: 135000, typical_down_pct: 10,
    owner_operated: true, operator_salary: 38000,
    naics: '812111', naics_label: 'Barber Shops',
    sba_avg_loan: 110000, sba_avg_term: 7, sba_approval_pct: 70,
    sba_total_loans_yr: 650, top_states: ['TX','CA','GA']
  },
  coworking: {
    median_revenue: 700000, median_sde: 140000,
    avg_cf_multiple: 3.0, avg_revenue_multiple: 0.60,
    avg_margin_pct: 20, sba_default_rate_pct: 5.0,
    typical_asking: 420000, typical_down_pct: 20,
    owner_operated: false, operator_salary: 55000,
    naics: '531120', naics_label: 'Lessors of Nonresidential Buildings',
    sba_avg_loan: 480000, sba_avg_term: 10, sba_approval_pct: 58,
    sba_total_loans_yr: 520, top_states: ['CA','NY','TX']
  }
};
