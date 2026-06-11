// ══════════════════════════════════════════════════════════════════════════════
// LOCAL API KEYS — personal copy, kept out of git
// ══════════════════════════════════════════════════════════════════════════════
//
// USAGE:
//   1. Copy this file to `src/js/local-keys.js` (already in .gitignore)
//   2. Replace each '' with your actual key
//   3. Run `node build.mjs && (cd v2 && node build-v2.mjs)` to bundle
//
// The keys load BEFORE prefetchRealData runs, so every pipeline run picks them
// up automatically. They never reach git, never leave your local clone.
//
// Get free keys (~5 min total):
//   Census  -> https://api.census.gov/data/key_signup.html         (REQUIRED for ACS, ZBP, PEP, BPS)
//   HUD     -> https://www.huduser.gov/portal/dataset/fmr-api.html (FMR, Income Limits, Vacancy)
//   BEA     -> https://apps.bea.gov/API/signup/                    (Per-capita personal income)
//   NOAA    -> https://www.ncdc.noaa.gov/cdo-web/token             (Climate normals)
//   AirNow  -> https://docs.airnowapi.org/account/request/         (Air quality)
//   BLS     -> https://data.bls.gov/registrationEngine/            (BLS OES wages — higher rate)
//   FRED    -> https://fred.stlouisfed.org/docs/api/api_key.html   (County LAUS)
//   SAM.gov -> https://sam.gov/data-services                       (Federal contracting)
//
// ══════════════════════════════════════════════════════════════════════════════

if (typeof window !== 'undefined') {
  window.CENSUS_API_KEY = '';   // 🚨 Required — unlocks 9 sources
  window.HUD_TOKEN      = '';
  window.BEA_API_KEY    = '';
  window.NOAA_TOKEN     = '';
  window.AIRNOW_API_KEY = '';
  window.BLS_API_KEY    = '';
  window.FRED_API_KEY   = '';
  window.SAM_API_KEY    = '';
  // Optional — provide real keys for production accuracy; public demo keys are not used
  window.NREL_API_KEY   = '';
  window.FBI_API_KEY    = '';
}
