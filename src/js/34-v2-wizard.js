// ══════════════════════════════════════════════════════════════
// V2 Wizard — "+ New Analysis" 3-step flow
// Bug #3 fix: wizard z-index 900 > AI Answers widget z-index 400
// Bug #4 fix: wizBudget initialised to default on open; card picks register state
// ══════════════════════════════════════════════════════════════

var wizStep = 1;
var wizIndustry = 'daycare';
var wizZip = '30097';
var wizRadius = '40';
// Bug #4: state is initialised to the default value so Continue works immediately
var wizBudget = 600000;

var WIZ_BUDGETS = [
  { amount: 150000,  label: 'Bootstrap'   },
  { amount: 300000,  label: 'Lean'        },
  { amount: 600000,  label: 'Standard'    },
  { amount: 1000000, label: 'Growth'      },
  { amount: 1500000, label: 'Enterprise'  },
  { amount: 2500000, label: 'Premium'     },
];

function v2OpenWizard() {
  wizStep = 1;
  // inherit current form values if set
  var indEl = document.getElementById('industrySelect');
  wizIndustry = (indEl && indEl.value) ? indEl.value : 'daycare';
  var zipEl = document.getElementById('zip');
  wizZip = (zipEl && zipEl.value) ? zipEl.value : '30097';
  var radEl = document.getElementById('radius');
  wizRadius = (radEl && radEl.value) ? radEl.value : '40';
  // Bug #4: set wizBudget to industry default (not undefined)
  var ind = (typeof INDUSTRIES !== 'undefined') ? INDUSTRIES[wizIndustry] : null;
  wizBudget = ind ? ind.budget_default : 600000;

  var overlay = document.getElementById('wizardOverlay');
  if (overlay) overlay.classList.add('open');
  v2RenderWizStep();
}

function v2CloseWizard() {
  var overlay = document.getElementById('wizardOverlay');
  if (overlay) overlay.classList.remove('open');
}

function v2WizPickIndustry(ind) {
  wizIndustry = ind;
  // update budget default for chosen industry
  var cfg = (typeof INDUSTRIES !== 'undefined') ? INDUSTRIES[ind] : null;
  if (cfg && cfg.budget_default) wizBudget = cfg.budget_default;
  v2RenderWizStep();
}

// Bug #4: every budget card click calls this; state is always registered
function v2WizPickBudget(amount) {
  wizBudget = amount;
  v2RenderWizStep();
}

function v2WizContinue() {
  if (wizStep === 1) {
    if (!wizIndustry) return;
    wizStep = 2;
    v2RenderWizStep();
    return;
  }
  if (wizStep === 2) {
    var inp = document.getElementById('wizZipInput');
    if (inp) wizZip = inp.value.trim() || wizZip;
    var rad = document.getElementById('wizRadiusInput');
    if (rad) wizRadius = rad.value.trim() || wizRadius;
    if (!wizZip.match(/^\d{5}$/)) {
      var tip = document.getElementById('wizZipTip');
      if (tip) { tip.textContent = 'Please enter a valid 5-digit ZIP code.'; tip.style.display = 'block'; }
      return;
    }
    wizStep = 3;
    v2RenderWizStep();
    return;
  }
  if (wizStep === 3) {
    // Bug #4: wizBudget is always set; if somehow 0 guard anyway
    if (!wizBudget) return;
    v2LaunchFromWizard();
  }
}

function v2WizBack() {
  if (wizStep > 1) { wizStep--; v2RenderWizStep(); }
}

function v2LaunchFromWizard() {
  // Push wizard values into the classic form
  var indEl = document.getElementById('industrySelect');
  if (indEl) { indEl.value = wizIndustry; if (typeof onIndustryChange === 'function') onIndustryChange(); }
  var zipEl = document.getElementById('zip');
  if (zipEl) zipEl.value = wizZip;
  var radEl = document.getElementById('radius');
  if (radEl) radEl.value = wizRadius;
  var budEl = document.getElementById('budget');
  if (budEl) budEl.value = wizBudget;
  v2CloseWizard();
  // Switch to classic view to show the pipeline running
  v2ShowView('classic');
  if (typeof runPipeline === 'function') runPipeline();
}

function v2RenderWizStep() {
  var body = document.getElementById('wizBody');
  var footer = document.getElementById('wizFooter');
  if (!body || !footer) return;

  // Update step dots
  for (var i = 1; i <= 3; i++) {
    var dot = document.getElementById('wizDot' + i);
    if (!dot) continue;
    dot.className = 'wiz-step-dot' + (i < wizStep ? ' done' : i === wizStep ? ' active' : '');
    dot.textContent = i < wizStep ? '✓' : String(i);
  }

  if (wizStep === 1) {
    var inds = (typeof INDUSTRIES !== 'undefined') ? INDUSTRIES : {};
    var cards = Object.keys(inds).map(function(k) {
      var cfg = inds[k];
      return '<div class="wiz-industry-card' + (wizIndustry === k ? ' selected' : '') + '" onclick="v2WizPickIndustry(\'' + k + '\')">' 
        + '<div class="wiz-industry-emoji">' + (cfg.emoji || '🏢') + '</div>'
        + '<div class="wiz-industry-label">' + cfg.label + '</div>'
        + '</div>';
    }).join('');
    body.innerHTML = '<div class="wiz-step-label">Step 1 of 3</div>'
      + '<div class="wiz-step-heading">What type of business?</div>'
      + '<div class="wiz-industries">' + cards + '</div>';
    footer.innerHTML = '<span></span>'
      + '<button class="wiz-continue" onclick="v2WizContinue()"' + (!wizIndustry ? ' disabled' : '') + '>Continue →</button>';
    return;
  }

  if (wizStep === 2) {
    body.innerHTML = '<div class="wiz-step-label">Step 2 of 3</div>'
      + '<div class="wiz-step-heading">Where are you targeting?</div>'
      + '<div style="margin-bottom:6px"><label style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em;display:block;margin-bottom:5px;font-family:\'Syne\',sans-serif">ZIP Code</label>'
      + '<input id="wizZipInput" class="wiz-input" type="text" maxlength="5" pattern="[0-9]{5}" placeholder="e.g. 30097" value="' + wizZip + '" oninput="document.getElementById(\'wizZipTip\').style.display=\'none\'" />'
      + '<div id="wizZipTip" class="input-tip tip-error" style="display:none"></div></div>'
      + '<div><label style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em;display:block;margin-bottom:5px;font-family:\'Syne\',sans-serif">Search Radius (miles)</label>'
      + '<input id="wizRadiusInput" class="wiz-input" type="number" min="5" max="150" placeholder="40" value="' + wizRadius + '" /></div>';
    footer.innerHTML = '<button class="wiz-back" onclick="v2WizBack()">← Back</button>'
      + '<button class="wiz-continue" onclick="v2WizContinue()">Continue →</button>';
    // focus ZIP input
    setTimeout(function() { var el = document.getElementById('wizZipInput'); if (el) el.focus(); }, 50);
    return;
  }

  if (wizStep === 3) {
    // Budget defaults driven by industry
    var ind = (typeof INDUSTRIES !== 'undefined') ? INDUSTRIES[wizIndustry] : null;
    var indDefault = ind ? ind.budget_default : 600000;
    // Bug #4: if wizBudget hasn't been explicitly changed, use industry default
    if (!wizBudget) wizBudget = indDefault;

    var budgetCards = WIZ_BUDGETS.map(function(b) {
      var isSelected = (wizBudget === b.amount);
      var isDefault = (b.amount === indDefault);
      return '<div class="wiz-budget-card' + (isSelected ? ' selected' : '') + '" onclick="v2WizPickBudget(' + b.amount + ')">'
        + '<div class="wiz-budget-amount">$' + (b.amount >= 1000000 ? (b.amount/1000000).toFixed(1) + 'M' : (b.amount/1000).toFixed(0) + 'K') + '</div>'
        + '<div class="wiz-budget-label">' + b.label + (isDefault ? ' · Recommended' : '') + '</div>'
        + '</div>';
    }).join('');

    body.innerHTML = '<div class="wiz-step-label">Step 3 of 3</div>'
      + '<div class="wiz-step-heading">What\'s your startup budget?</div>'
      + '<div class="wiz-budgets">' + budgetCards + '</div>'
      + '<div style="font-size:11px;color:var(--muted);margin-top:6px">All agents will use this budget for financial projections and site scoring.</div>';

    // Bug #4: Continue is enabled because wizBudget is always set
    footer.innerHTML = '<button class="wiz-back" onclick="v2WizBack()">← Back</button>'
      + '<button class="wiz-continue" onclick="v2WizContinue()" id="wizLaunchBtn">🚀 Launch Analysis</button>';
    return;
  }
}
