const $ = id => document.getElementById(id);
const key = () => $('apiKey').value.trim();
const provider = () => $('providerSelect')?.value||'anthropic';
const model = () => $('modelInput')?.value||PROVIDERS[provider()].model_default;
const customUrl = () => $('customUrlInput')?.value||'';
const zip = () => $('zip').value||'30097';
const radius = () => $('radius').value||'40';
const grades = () => $('grades').value||INDUSTRIES[($('industrySelect')||{value:'daycare'}).value||'daycare'].tiers[0];
const capacity = () => $('capacity').value||'75';
const budget = () => $('budget').value||'600000';
const industry = () => INDUSTRIES[$('industrySelect')?.value||'daycare'];

function onIndustryChange() {
  const ind = industry();
  const indKey = $('industrySelect')?.value || 'daycare';
  const ui = (typeof IND_UI !== 'undefined' && IND_UI[indKey]) || {};

  // ── Masthead & title ─────────────────────────────────────
  $('mastheadTitle').textContent = ind.emoji+' '+ind.label+' Planning Agent System';
  document.title = ind.emoji+' '+ind.label+' Planning Agent System';

  // ── Inputs ───────────────────────────────────────────────
  $('capacityLabel').textContent = ind.capacity_label;
  $('capacity').value = ind.capacity_default;
  $('budget').value = ind.budget_default;
  $('tiersLabel').textContent = ind.tiers_label;
  const sel = $('grades');
  sel.innerHTML = ind.tiers.map(t=>`<option value="${t}">${t}</option>`).join('');

  // ── Agent card subtitles ─────────────────────────────────
  // Agent 1 — Demographics: show the relevant demographic focus
  _setRole('role-1', `Census · GIS · ${ui.dem || 'Population · Income · ACS'}`);

  // Agent 5 — Compliance: show the primary regulatory body
  const reg1 = (ind.regulatory||'').split(',')[0].trim();
  _setRole('role-5', `${reg1} · Zoning · Licensing · Permits`);

  // Agent 6 — Competitive Intel: show the top competitors
  _setRole('role-6', `${ui.comp || (ind.competitors||'').split(',').slice(0,3).join(' · ')} · Market Mapping`);

  // Agent 7 — Financial Feasibility: show the revenue model
  _setRole('role-7', `${ui.fin || ind.revenue_unit || '3-Scenario Model'} · Break-Even`);

  // Agent 12 — Grant Search: show primary grant program name
  _setRole('role-12', `${ui.grant1||'SBA Programs'} · ${ui.grant2||'Federal Grants'} · Local Incentives`);

  // Agent 13 — Competitor Deep-Dive: show top competitor names
  _setRole('role-13', `${ui.comp || (ind.competitors||'').split(',').slice(0,3).join(' · ')} · Review Analysis`);

  // Agent 2 — Gap Analysis
  _setRole('role-2', `Supply vs Demand · ${ind.units||'Business'} Concentration · Opportunity Score`);

  // Agent 3 — Site Selection
  _setRole('role-3', `6 Ranked Locations · Walk/Transit/Schools · ${ind.capacity_label}`);

  // Agent 4 — Real Estate
  _setRole('role-4', `${ind.real_estate ? ind.real_estate.split(',')[0].trim() : 'Live Listings'} · LoopNet · BizBuySell`);

  // Agent 9 — Business Plan
  _setRole('role-9', `SBA 7(a) Package · Investor Deck · ${ind.label} Financials`);

  // ── Agent 12 grant tab labels ────────────────────────────
  _setText('tab-12-grant1', ui.grant1 || 'Primary Grants');
  _setText('tab-12-grant2', ui.grant2 || 'Federal Grants');
}

// helpers used only by onIndustryChange
function _setRole(id, text) { const el=$(id); if(el) el.textContent=text; }
function _setText(id, text) { const el=$(id); if(el) el.textContent=text; }

// Init on load
window.addEventListener('DOMContentLoaded', onIndustryChange);

function toggleDemo(){
  demoMode=!demoMode;
  const btn=$('demoBtn');
  btn.textContent=demoMode?'⚡ Demo ON':'⚡ Demo Mode';
  btn.style.background=demoMode?'var(--amber-dim)':'';
  btn.style.borderColor='var(--amber)';
  btn.style.color='var(--amber)';
}

