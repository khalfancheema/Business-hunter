// ══════════════════════════════════════════════════════════════
// V2 Dashboard — tabs, empty state, demo-mode wiring
// Bug #1 fix: empty state on Dashboard sub-tab
// Bug #5 fix: demo data flows into v2 tab content
// ══════════════════════════════════════════════════════════════

var v2DashTab = 'overview';

var V2_AGENTS = [
  { n:1,  ico:'📊', name:'Demographics'        },
  { n:5,  ico:'⚖️', name:'Compliance'          },
  { n:6,  ico:'🔍', name:'Competitive Intel'   },
  { n:2,  ico:'📈', name:'Gap Analysis'        },
  { n:3,  ico:'📍', name:'Site Selection'      },
  { n:4,  ico:'🏢', name:'Real Estate'         },
  { n:7,  ico:'💰', name:'Financials'          },
  { n:8,  ico:'📋', name:'Executive Summary'   },
  { n:9,  ico:'🏦', name:'Business Plan'       },
  { n:10, ico:'🗂️', name:'Project Plan'        },
  { n:11, ico:'🗺️', name:'Market Map'          },
  { n:12, ico:'💵', name:'Grants'              },
  { n:13, ico:'🎯', name:'Competitor Deep-Dive'},
  { n:16, ico:'🏗️', name:'Build vs Buy'        },
  { n:14, ico:'🔬', name:'Code Review'         },
  { n:15, ico:'✅', name:'QA Testing'          },
  { n:17, ico:'📚', name:'Sources'             },
];

function v2SwitchDashTab(tab) {
  v2DashTab = tab;
  document.querySelectorAll('.v2-dash-tab').forEach(function(t) {
    t.classList.toggle('active', t.dataset.tab === tab);
  });
  v2RenderDashTab(tab);
}

function v2RenderDashboard() {
  var hasData = Object.keys(R).length > 0;

  // Bug #5: update demo banner
  var banner = document.getElementById('v2DemoBanner');
  if (banner) {
    if (demoMode && hasData) {
      var verdict = (R.a8 || {}).verdict || 'GO';
      var score = 82.7;
      if (R.a8 && R.a8.score) score = R.a8.score;
      banner.innerHTML = '⚡ Demo Mode &nbsp;·&nbsp; All 17 agents ran &nbsp;·&nbsp; Score ' + score + '/100 &nbsp;·&nbsp; Verdict: ' + verdict;
      banner.style.display = 'block';
    } else if (!demoMode) {
      banner.style.display = 'none';
    }
  }

  // Bug #1: empty state — shown when no results exist
  var content = document.getElementById('v2DashContent');
  if (!content) return;

  if (!hasData) {
    content.innerHTML = '<div class="v2-empty-state">'
      + '<div class="v2-empty-icon">📊</div>'
      + '<div class="v2-empty-title">Run your first analysis to see results here</div>'
      + '<div class="v2-empty-sub">Choose an industry, enter your target ZIP code, and let the 17-agent pipeline do the work.</div>'
      + '<button class="btn primary" style="margin-top:4px" onclick="v2OpenWizard()">+ New Analysis</button>'
      + '</div>';
    return;
  }

  // Render tab bar and content
  content.innerHTML = '<div class="v2-dash-tabs">'
    + '<button class="v2-dash-tab' + (v2DashTab==='overview'  ?' active':'') + '" data-tab="overview"  onclick="v2SwitchDashTab(\'overview\')">Overview</button>'
    + '<button class="v2-dash-tab' + (v2DashTab==='financials'?' active':'') + '" data-tab="financials" onclick="v2SwitchDashTab(\'financials\')">Financials</button>'
    + '<button class="v2-dash-tab' + (v2DashTab==='agents'   ?' active':'') + '" data-tab="agents"     onclick="v2SwitchDashTab(\'agents\')">All Agents</button>'
    + '<button class="v2-dash-tab' + (v2DashTab==='report'   ?' active':'') + '" data-tab="report"     onclick="v2SwitchDashTab(\'report\')">Report</button>'
    + '</div>'
    + '<div id="v2TabContent" style="margin-top:16px"></div>';

  v2RenderDashTab(v2DashTab);
}

function v2RenderDashTab(tab) {
  var el = document.getElementById('v2TabContent');
  if (!el) return;
  if (tab === 'overview')   el.innerHTML = v2BuildOverview();
  else if (tab === 'financials') el.innerHTML = v2BuildFinancials();
  else if (tab === 'agents')     el.innerHTML = v2BuildAgents();
  else if (tab === 'report')     el.innerHTML = v2BuildReport();
}

function v2BuildOverview() {
  var a8 = R.a8 || {};
  var a7 = R.a7 || {};
  var a1 = R.a1 || {};
  var a3 = R.a3 || {};

  // Bug #5: pull real data from R (populated by both live and demo runs)
  var verdict = a8.verdict || (demoMode ? 'GO' : '—');
  var verdictClass = verdict.toLowerCase().indexOf('no') >= 0 ? 'v-nogo'
    : verdict.toLowerCase().indexOf('caution') >= 0 ? 'v-caution' : 'v-go';

  var score = a8.score || (demoMode ? 82.7 : null);
  var topCity = '';
  var locs = a3.locations || a3.sites || [];
  if (locs.length) topCity = locs[0].city || locs[0].name || '';

  var revAnnual = '';
  if (a7.scenarios) {
    var base = a7.scenarios.base || a7.scenarios.Base || {};
    revAnnual = base.annual_revenue || base.revenue_year1 || base.revenue || '';
  }
  if (!revAnnual && a7.revenue_projections) {
    var rp = a7.revenue_projections;
    revAnnual = rp.year1_annual || rp.base_annual || '';
  }

  var cities = a1.cities || [];
  var cityCount = cities.length || (demoMode ? 14 : 0);

  var metrics = [
    { label:'Verdict',         val: verdict ? '<span class="verdict ' + verdictClass + '" style="font-size:13px;padding:5px 12px">' + verdict + '</span>' : '<span style="color:var(--muted)">Run pipeline to see</span>', raw: true },
    { label:'Score',           val: score ? score + '/100' : '—' },
    { label:'Top City',        val: topCity || (demoMode ? 'Suwanee, GA' : '—') },
    { label:'Cities Analysed', val: cityCount ? String(cityCount) : '—' },
    { label:'Year-1 Revenue',  val: revAnnual ? '$' + parseInt(String(revAnnual).replace(/[^0-9]/g, '')).toLocaleString() : (demoMode ? '$1.24M' : '—') },
    { label:'Agents Complete', val: V2_AGENTS.filter(function(a) { return R['a'+a.n]; }).length + ' / ' + V2_AGENTS.length },
  ];

  var cards = metrics.map(function(m) {
    return '<div class="v2-metric-card">'
      + '<div class="v2-metric-label">' + m.label + '</div>'
      + '<div class="v2-metric-val">' + (m.raw ? m.val : m.val) + '</div>'
      + '</div>';
  }).join('');

  var assess = a8.assessment || (demoMode ? 'Strong demographic tailwinds in Gwinnett County with underserved childcare demand across 6 high-priority cities. Financial projections support a break-even within 18 months at standard capacity. Site selection favors Suwanee and Sugar Hill as top opportunities.' : '');
  var assessHtml = assess ? '<div class="card" style="margin-top:16px"><div style="font-size:11px;font-weight:700;font-family:\'Syne\',sans-serif;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px">Overall Assessment</div><div style="font-size:13px;line-height:1.8;color:var(--muted)">' + assess + '</div></div>' : '';

  return '<div class="v2-metrics-grid">' + cards + '</div>' + assessHtml;
}

function v2BuildFinancials() {
  var a7 = R.a7 || {};

  // Bug #5: check for real data; only show "no data" if truly empty and not demo
  var scenarios = a7.scenarios || a7.financial_scenarios || {};
  var hasScenarios = Object.keys(scenarios).length > 0;

  if (!hasScenarios && !demoMode) {
    return '<div class="v2-empty-state">'
      + '<div class="v2-empty-icon">💰</div>'
      + '<div class="v2-empty-title">No financial data yet</div>'
      + '<div class="v2-empty-sub">Financial projections are generated by Agent 7 — Financial Feasibility. Run the pipeline to populate this view.</div>'
      + '</div>';
  }

  // Use demo fallback values if in demo mode and no real data
  if (!hasScenarios && demoMode) {
    scenarios = {
      conservative: { label:'Conservative', annual_revenue: 987000, net_income: 148000, break_even_months: 22 },
      base:         { label:'Base Case',    annual_revenue: 1243000, net_income: 267000, break_even_months: 17 },
      optimistic:   { label:'Optimistic',   annual_revenue: 1586000, net_income: 412000, break_even_months: 13 },
    };
    hasScenarios = true;
  }

  var scenariosHtml = '<div class="scenario-grid">';
  var colors = ['var(--amber)', 'var(--blue)', 'var(--green)'];
  var keys = Object.keys(scenarios);
  keys.forEach(function(k, idx) {
    var s = scenarios[k];
    var rev = s.annual_revenue || s.revenue_year1 || s.revenue || 0;
    var net = s.net_income || s.net_profit || 0;
    var be = s.break_even_months || s.breakeven_months || '';
    scenariosHtml += '<div class="scenario-card">'
      + '<div class="sc-label" style="color:' + (colors[idx] || 'var(--blue)') + '">' + (s.label || k) + '</div>'
      + '<div class="sc-revenue" style="color:' + (colors[idx] || 'var(--blue)') + '">$' + (rev ? (rev/1000).toFixed(0) + 'K' : '—') + '</div>'
      + '<div class="sc-detail">Net income: $' + (net ? (net/1000).toFixed(0) + 'K' : '—') + '<br>Break-even: ' + (be ? be + ' months' : '—') + '</div>'
      + '</div>';
  });
  scenariosHtml += '</div>';

  var summary = a7.summary || (demoMode ? 'Three-scenario financial model for a 75-child capacity daycare in Gwinnett County. Revenue projections are based on market-rate tuition blended across age groups, CAPS subsidy income, and USDA CACFP reimbursements.' : '');
  var sumHtml = summary ? '<div style="font-size:13px;line-height:1.8;color:var(--muted);margin-bottom:16px">' + summary + '</div>' : '';

  return sumHtml + scenariosHtml;
}

function v2BuildAgents() {
  // Bug #5: tiles show real status from R; demo data populates R so tiles show done
  var tiles = V2_AGENTS.map(function(ag) {
    var data = R['a' + ag.n];
    var isDone = !!data;
    var statusText = isDone ? 'Complete' : (demoMode ? 'Idle' : '— Idle');
    return '<div class="v2-agent-tile' + (isDone ? ' done' : ' idle') + '">'
      + '<div class="v2-agent-tile-head">'
      + '<span class="v2-agent-tile-ico">' + ag.ico + '</span>'
      + '<span class="v2-agent-tile-name">Agent ' + ag.n + '</span>'
      + '</div>'
      + '<div style="font-size:12px;font-family:\'Syne\',sans-serif;font-weight:600;color:var(--text);margin-bottom:3px">' + ag.name + '</div>'
      + '<div class="v2-agent-tile-status' + (isDone ? ' done' : '') + '">' + statusText + '</div>'
      + '</div>';
  }).join('');

  return '<div class="v2-agents-grid">' + tiles + '</div>';
}

function v2BuildReport() {
  var a8 = R.a8 || {};
  if (!a8.verdict && !demoMode) {
    return '<div class="v2-empty-state"><div class="v2-empty-icon">📋</div>'
      + '<div class="v2-empty-title">Executive report not yet generated</div>'
      + '<div class="v2-empty-sub">Complete the pipeline to see the full executive summary and verdict.</div></div>';
  }
  var verdict = a8.verdict || (demoMode ? 'GO' : '—');
  var verdictClass = verdict.toLowerCase().indexOf('no') >= 0 ? 'v-nogo'
    : verdict.toLowerCase().indexOf('caution') >= 0 ? 'v-caution' : 'v-go';
  var rationale = a8.verdict_rationale || a8.rationale || '';
  var assess = a8.assessment || '';
  var steps = a8.next_steps || [];

  var stepsHtml = '';
  if (steps.length) {
    stepsHtml = '<div class="final-section full" style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:16px;margin-top:12px"><div style="font-size:11px;font-weight:700;font-family:\'Syne\',sans-serif;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);margin-bottom:12px">Next Steps</div><div class="step-list">'
      + steps.map(function(s, i) {
          return '<div class="step"><div class="step-num">' + (i+1) + '</div><div>' + s + '</div></div>';
        }).join('')
      + '</div></div>';
  }

  return '<div><div class="verdict ' + verdictClass + '" style="margin-bottom:14px">' + verdict + '</div>'
    + (rationale ? '<div style="font-size:13px;color:var(--muted);margin-bottom:14px;line-height:1.7">' + rationale + '</div>' : '')
    + (assess ? '<div style="font-size:13px;color:var(--muted);line-height:1.8">' + assess + '</div>' : '')
    + stepsHtml + '</div>';
}

// Called from pipeline.js after run completes — update dashboard if visible
function v2OnPipelineComplete() {
  if (v2CurrentView === 'dashboard') v2RenderDashboard();
  // Auto-switch to dashboard view on completion
  v2ShowView('dashboard');
  // Save to portfolio
  v2SaveToPortfolio();
}

function v2SaveToPortfolio() {
  try {
    var sessions = JSON.parse(localStorage.getItem('bh_sessions') || '[]');
    var entry = {
      date: new Date().toLocaleDateString(),
      industry: (document.getElementById('industrySelect') || {}).value || '',
      zip: (document.getElementById('zip') || {}).value || '',
      verdict: (R.a8 || {}).verdict || '',
      R: R
    };
    sessions.unshift(entry);
    if (sessions.length > 20) sessions = sessions.slice(0, 20);
    localStorage.setItem('bh_sessions', JSON.stringify(sessions));
  } catch(e) {}
}
