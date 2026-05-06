// ══════════════════════════════════════════════════════════════
// V2 Navigation — view switching, hamburger, light mode
// ══════════════════════════════════════════════════════════════

var v2CurrentView = 'home';
var v2LightMode = false;
var v2DrawerOpen = false;

function v2ShowView(name) {
  v2CurrentView = name;
  var ids = ['viewHome', 'viewDashboard', 'viewClassic', 'viewPortfolio'];
  ids.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  var cap = name.charAt(0).toUpperCase() + name.slice(1);
  var target = document.getElementById('view' + cap);
  if (target) target.style.display = '';
  document.querySelectorAll('.v2-nav-link, .v2-drawer-link').forEach(function(l) {
    l.classList.toggle('active', l.dataset.view === name);
  });
  if (name === 'dashboard') v2RenderDashboard();
  if (name === 'portfolio') v2RenderPortfolio();
  v2CloseDrawer();
}

function v2ToggleDrawer() {
  v2DrawerOpen = !v2DrawerOpen;
  var drawer = document.getElementById('navDrawer');
  var btn = document.getElementById('hamburgerBtn');
  if (drawer) drawer.classList.toggle('open', v2DrawerOpen);
  if (btn) btn.classList.toggle('open', v2DrawerOpen);
}

function v2CloseDrawer() {
  v2DrawerOpen = false;
  var drawer = document.getElementById('navDrawer');
  var btn = document.getElementById('hamburgerBtn');
  if (drawer) drawer.classList.remove('open');
  if (btn) btn.classList.remove('open');
}

function v2ToggleLightMode() {
  v2LightMode = !v2LightMode;
  document.body.classList.toggle('light-mode', v2LightMode);
  try { localStorage.setItem('bh_lightmode', v2LightMode ? '1' : '0'); } catch(e) {}
  var btn = document.getElementById('themeBtn');
  if (btn) btn.textContent = v2LightMode ? '🌙' : '☀️';
}

function v2InitNav() {
  // restore light mode preference
  try {
    if (localStorage.getItem('bh_lightmode') === '1') {
      v2LightMode = true;
      document.body.classList.add('light-mode');
      var btn = document.getElementById('themeBtn');
      if (btn) btn.textContent = '🌙';
    }
  } catch(e) {}
  // close drawer on outside click
  document.addEventListener('click', function(e) {
    if (!v2DrawerOpen) return;
    var drawer = document.getElementById('navDrawer');
    var hamburger = document.getElementById('hamburgerBtn');
    if (drawer && hamburger && !drawer.contains(e.target) && !hamburger.contains(e.target)) {
      v2CloseDrawer();
    }
  });
  // render home page industry quick-pick grid
  var grid = document.getElementById('homeIndustriesGrid');
  if (grid && typeof INDUSTRIES !== 'undefined') {
    grid.innerHTML = Object.keys(INDUSTRIES).map(function(k) {
      var ind = INDUSTRIES[k];
      return '<div class="v2-industry-card" onclick="wizIndustry=\'' + k + '\';v2OpenWizard()">'
        + '<div class="v2-industry-card-emoji">' + (ind.emoji || '🏢') + '</div>'
        + '<div class="v2-industry-card-label">' + ind.label + '</div>'
        + '</div>';
    }).join('');
  }
  // show home by default
  v2ShowView('home');
}

function v2RenderPortfolio() {
  var el = document.getElementById('viewPortfolio');
  if (!el) return;
  var sessions = [];
  try {
    var raw = localStorage.getItem('bh_sessions');
    if (raw) sessions = JSON.parse(raw);
  } catch(e) {}

  if (!sessions.length) {
    el.innerHTML = '<div class="v2-portfolio"><div class="v2-portfolio-empty"><div style="font-size:48px;margin-bottom:16px">📁</div><div class="v2-empty-title">No analyses saved yet</div><div class="v2-empty-sub">Run an analysis and save it to your portfolio to track opportunities over time.</div><button class="btn primary" onclick="v2OpenWizard()">+ New Analysis</button></div></div>';
    return;
  }
  var rows = sessions.map(function(s, i) {
    return '<div class="v2-portfolio-row"><div class="v2-portfolio-row-info"><div class="v2-portfolio-row-name">' + (s.industry || 'Analysis') + ' — ZIP ' + (s.zip || '—') + '</div><div class="v2-portfolio-row-date">' + (s.date || '') + '</div></div><div class="v2-portfolio-row-verdict badge ' + verdictBadgeClass(s.verdict) + '">' + (s.verdict || '—') + '</div><button class="btn" onclick="v2LoadSession(' + i + ')">Load</button></div>';
  }).join('');
  el.innerHTML = '<div class="v2-portfolio"><div class="v2-dash-header"><div class="v2-dash-title">Portfolio</div></div>' + rows + '</div>';
}

function verdictBadgeClass(v) {
  if (!v) return 'b-blue';
  v = v.toLowerCase();
  if (v.includes('go') && !v.includes('no') && !v.includes('caution')) return 'b-green';
  if (v.includes('caution')) return 'b-amber';
  if (v.includes('no')) return 'b-red';
  return 'b-blue';
}

function v2LoadSession(idx) {
  try {
    var sessions = JSON.parse(localStorage.getItem('bh_sessions') || '[]');
    var s = sessions[idx];
    if (!s || !s.R) return;
    R = s.R;
    if (s.zip && document.getElementById('zip')) document.getElementById('zip').value = s.zip;
    if (s.industry && document.getElementById('industrySelect')) {
      document.getElementById('industrySelect').value = s.industry;
      if (typeof onIndustryChange === 'function') onIndustryChange();
    }
    v2ShowView('dashboard');
  } catch(e) {}
}

window.addEventListener('DOMContentLoaded', function() {
  v2InitNav();
  if (typeof loadSavedProfile === 'function') loadSavedProfile();
  if (typeof restoreSession === 'function') restoreSession();
});
