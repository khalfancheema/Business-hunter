// ══════════════════════════════════════════════════════════════════════════════
// V2-15 DEMO SHOWCASE — Seeds portfolio state and localStorage for demo mode
// ══════════════════════════════════════════════════════════════════════════════

// ── Seed two portfolio runs for "What Changed" diff ───────────────────────────
const _V2_DEMO_RUN_A = {
  id: 'demo-run-001',
  zip: '30097',
  city: 'Johns Creek',
  state: 'GA',
  industry: 'daycare',
  radius: '15',
  capacity: '75',
  budget: '526500',
  score: 74.2,
  label: 'Initial Analysis — Mar 2025',
  savedAt: new Date('2025-03-01').getTime(),
  timestamp: new Date('2025-03-01').getTime(),
  gap_score: 18.2,
  financial_score: 17.8,
  ai_score: 14.4,
  competition_score: 12.8,
  compliance_score: 11.0,
  verdict: 'Cautious Go',
  notes: 'First run — conservative enrollment assumptions',
};

const _V2_DEMO_RUN_B = {
  id: 'demo-run-002',
  zip: '30097',
  city: 'Johns Creek',
  state: 'GA',
  industry: 'daycare',
  radius: '15',
  capacity: '90',
  budget: '600000',
  score: 82.7,
  label: 'Updated Analysis — Apr 2025',
  savedAt: new Date('2025-04-15').getTime(),
  timestamp: new Date('2025-04-15').getTime(),
  gap_score: 21.4,
  financial_score: 20.1,
  ai_score: 16.2,
  competition_score: 13.5,
  compliance_score: 11.5,
  verdict: 'Go',
  notes: 'Updated with 90-slot capacity and confirmed grant funding',
};

(function _v2SeedDemoPortfolio() {
  // Only seed if portfolio is empty (don't overwrite real user data)
  if (!V2.portfolio || V2.portfolio.length === 0) {
    V2.portfolio = [_V2_DEMO_RUN_A, _V2_DEMO_RUN_B];
  }
})();

// ── Seed localStorage saved searches ─────────────────────────────────────────
(function _v2SeedDemoSavedSearches() {
  try {
    const existing = JSON.parse(localStorage.getItem('v2_saved_searches') || '[]');
    if (existing.length === 0) {
      const demo = [
        {
          id: 'saved-demo-001',
          savedAt: new Date('2025-03-01').getTime(),
          label: 'Suwanee Childcare — Primary',
          industry: 'daycare',
          zip: '30097',
          radius: '15',
          capacity: '75',
          budget: '526500',
          score: 82.7,
        },
        {
          id: 'saved-demo-002',
          savedAt: new Date('2025-02-14').getTime(),
          label: 'Sugar Hill — Backup Site',
          industry: 'daycare',
          zip: '30518',
          radius: '10',
          capacity: '80',
          budget: '480000',
          score: 78.3,
        },
        {
          id: 'saved-demo-003',
          savedAt: new Date('2025-01-20').getTime(),
          label: 'Duluth — Feasibility Check',
          industry: 'daycare',
          zip: '30096',
          radius: '10',
          capacity: '65',
          budget: '420000',
          score: 71.5,
        },
      ];
      localStorage.setItem('v2_saved_searches', JSON.stringify(demo));
    }
  } catch(e) {}
})();

// ── Showcase banner injected into dashboard header ────────────────────────────
function v2InjectShowcaseBanner() {
  const wrap = document.getElementById('v2-dash-wrap');
  if (!wrap || document.getElementById('v2-showcase-banner')) return;

  const banner = document.createElement('div');
  banner.id = 'v2-showcase-banner';
  banner.style.cssText = `
    background: linear-gradient(135deg, rgba(99,102,241,.15), rgba(139,92,246,.12));
    border: 1px solid rgba(99,102,241,.3);
    border-radius: 12px;
    padding: 14px 20px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  `;
  banner.innerHTML = `
    <div style="font-size:20px">🎬</div>
    <div style="flex:1;min-width:200px">
      <div style="font-size:13px;font-weight:700;color:var(--v2-t1)">Demo Mode — Childcare Center · Suwanee, GA (ZIP 30097)</div>
      <div style="font-size:11px;color:var(--v2-t3);margin-top:2px">
        All 17 agents ran · Score <strong style="color:#22c55e">82.7/100</strong> · Verdict: <strong style="color:#22c55e">GO</strong> ·
        All tabs, charts, exports, and drill-downs are fully functional
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="v2-btn primary sm" onclick="v2TourDashboard()">▶ Feature Tour</button>
      <button class="v2-btn ghost sm" onclick="document.getElementById('v2-showcase-banner').style.display='none'">✕ Dismiss</button>
    </div>
  `;
  wrap.insertBefore(banner, wrap.firstChild);
}

// ── Feature tour — cycles through all tabs showing key features ───────────────
const _V2_TOUR_STEPS = [
  { tab: 'market',      label: 'Market Gap',        msg: '📊 Age-group gaps by infant/toddler/pre-K with 5-year demand forecast and subsidy-eligible population %' },
  { tab: 'competition', label: 'Competitor Intel',   msg: '🏪 Click any competitor row for full profile — tuition, staff ratios, NAEYC status, capacity utilization' },
  { tab: 'financials',  label: 'Financials',         msg: '💰 Full 18-month enrollment ramp · Click any month for P&L detail · Lease sensitivity slider · Wage inflation scenario' },
  { tab: 'risks',       label: 'Risk Scoring',       msg: '⚠️ Probability × Impact scores with trigger conditions and mitigation cost per risk' },
  { tab: 'realestate',  label: 'Real Estate',        msg: '🏠 5 scored listings — zoning, ADA, school proximity, density, parking all rated out of 10' },
  { tab: 'multizip',    label: 'Multi-ZIP',          msg: '📍 5 cities ranked by composite score — click any to launch sub-analysis' },
  { tab: 'compare',     label: 'Compare',            msg: '⚖️ Side-by-side run comparison · "What Changed" diff between your March and April analyses' },
  { tab: 'sensitivity', label: 'Sensitivity',        msg: '🎯 Which single assumption most changes your break-even month — enrollment rate, tuition, lease, wages' },
  { tab: 'trends',      label: 'Trends',             msg: '📈 5-year market trends for demand, income growth, and competitor entry rate' },
  { tab: 'freshness',   label: 'Sources',            msg: '🔍 Source attribution with confidence %, stale warnings, and live link checker for all 13 data sources' },
  { tab: 'saved',       label: 'Saved Searches',     msg: '🔖 3 bookmarked analyses — ZIP + industry + score history' },
];

let _v2ShowcaseTourIdx = 0;
let _v2ShowcaseTourTimer = null;

function v2TourDashboard() {
  _v2ShowcaseTourIdx = 0;
  _v2RunTourStep();
}

function _v2RunTourStep() {
  if (_v2ShowcaseTourIdx >= _V2_TOUR_STEPS.length) {
    _v2ShowTourToast('✅ Tour complete! Every tab and feature is live — explore freely.', 4000);
    return;
  }
  const step = _V2_TOUR_STEPS[_v2ShowcaseTourIdx];

  // Switch to the tab
  const tabEl = document.querySelector(`[onclick*="v2DashTab('${step.tab}'"]`);
  if (tabEl && typeof v2DashTab === 'function') v2DashTab(step.tab, tabEl);

  // Show toast
  _v2ShowTourToast(`<strong>${step.label}:</strong> ${step.msg}`, 3200);

  _v2ShowcaseTourIdx++;
  if (_v2ShowcaseTourTimer) clearTimeout(_v2ShowcaseTourTimer);
  _v2ShowcaseTourTimer = setTimeout(_v2RunTourStep, 3400);
}

function _v2ShowTourToast(msg, duration) {
  let toast = document.getElementById('v2-tour-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'v2-tour-toast';
    toast.style.cssText = `
      position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
      background: rgba(15,15,30,.96); border: 1px solid rgba(99,102,241,.4);
      border-radius: 12px; padding: 12px 20px; max-width: 500px; width: calc(100% - 40px);
      font-size: 13px; color: var(--v2-t1); z-index: 9999; text-align: center;
      box-shadow: 0 8px 32px rgba(0,0,0,.6);
      transition: opacity .3s;
    `;
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <div>${msg}</div>
    <div style="margin-top:6px;font-size:10px;color:var(--v2-t3)">
      Step ${_v2ShowcaseTourIdx}/${_V2_TOUR_STEPS.length} ·
      <span style="cursor:pointer;color:var(--v2-a1)" onclick="clearTimeout(_v2ShowcaseTourTimer);this.closest('#v2-tour-toast').style.opacity=0">Skip tour</span>
    </div>
  `;
  toast.style.opacity = '1';
  setTimeout(() => { if (toast) toast.style.opacity = '0'; }, duration - 400);
}

// ── Full showcase launch: load demo run + inject banner + show score ───────────
function v2LaunchShowcase() {
  // Build a full demo run object that mirrors what v2RenderDashboard expects
  const demoRun = {
    ..._V2_DEMO_RUN_B,
    ts: Date.now(),
    // Inject the rich R data for all panels
    _demoMode: true,
  };

  // Populate the global R used by all render functions
  if (typeof getDemoData === 'function') {
    window.R = {
      a1:  getDemoData(1,  'daycare') || {},
      a2:  getDemoData(2,  'daycare') || {},
      a3:  getDemoData(3,  'daycare') || {},
      a4:  getDemoData(4,  'daycare') || {},
      a5:  getDemoData(5,  'daycare') || {},
      a6:  getDemoData(6,  'daycare') || {},
      a7:  getDemoData(7,  'daycare') || {},
      a8:  getDemoData(8,  'daycare') || {},
      a9:  getDemoData(9,  'daycare') || {},
      a10: getDemoData(10, 'daycare') || {},
      a11: getDemoData(11, 'daycare') || {},
      a12: getDemoData(12, 'daycare') || {},
      a13: getDemoData(13, 'daycare') || {},
      a14: getDemoData(14, 'daycare') || {},
      a15: getDemoData(15, 'daycare') || {},
      a16: getDemoData(16, 'daycare') || {},
      a17: getDemoData(17, 'daycare') || {},
    };
  }

  // Go to dashboard screen
  if (typeof v2GoTo === 'function') v2GoTo('dashboard');

  // Render the dashboard
  if (typeof v2RenderDashboard === 'function') v2RenderDashboard(demoRun);

  // Inject the showcase banner after a tick
  setTimeout(v2InjectShowcaseBanner, 100);
}

// ── Wire the "Try Demo" button on landing to use the showcase ─────────────────
(function _v2PatchLandingDemo() {
  // Override the existing v2StartDemo if present
  const _origDemo = (typeof v2StartDemo === 'function') ? v2StartDemo : null;
  window.v2StartDemo = function() {
    v2LaunchShowcase();
  };
})();

// ── Auto-seed on every dashboard render ──────────────────────────────────────
(function() {
  if (typeof v2RenderDashboard !== 'function') return;
  const _base15 = v2RenderDashboard;
  v2RenderDashboard = function(run) {
    _base15(run);
    // After a tick, inject banner if demo run
    if (run && run._demoMode) {
      setTimeout(v2InjectShowcaseBanner, 150);
    }
  };
})();
