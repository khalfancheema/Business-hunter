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
  // Update masthead
  $('mastheadTitle').textContent = ind.emoji+' '+ind.label+' Planning Agent System';
  // Update capacity label
  $('capacityLabel').textContent = ind.capacity_label;
  $('capacity').value = ind.capacity_default;
  $('budget').value = ind.budget_default;
  // Update tiers dropdown
  $('tiersLabel').textContent = ind.tiers_label;
  const sel = $('grades');
  sel.innerHTML = ind.tiers.map(t=>`<option value="${t}">${t}</option>`).join('');
  // Update page title
  document.title = ind.emoji+' '+ind.label+' Planning Agent System';
}
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

