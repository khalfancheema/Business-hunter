// ══════════════════════════════════════════════════════════════
// V2 API Key Modal
// Bug #2 fix: modal overflow hidden by default; auto only when custom URL shown
// ══════════════════════════════════════════════════════════════

function v2OpenApiModal() {
  var modal = document.getElementById('apiKeyModal');
  if (!modal) return;
  modal.classList.add('open');
  // Sync current values into modal fields
  var provEl = document.getElementById('modalProviderSelect');
  var mainProv = document.getElementById('providerSelect');
  if (provEl && mainProv) provEl.value = mainProv.value;

  var keyEl = document.getElementById('modalApiKey');
  var mainKey = document.getElementById('apiKey');
  if (keyEl && mainKey) keyEl.value = mainKey.value;

  v2SyncModalCustomUrl();
  // focus key input
  setTimeout(function() { if (keyEl) keyEl.focus(); }, 50);
}

function v2CloseApiModal() {
  var modal = document.getElementById('apiKeyModal');
  if (modal) modal.classList.remove('open');
}

function v2SyncModalCustomUrl() {
  var provEl = document.getElementById('modalProviderSelect');
  if (!provEl) return;
  var isCustom = provEl.value === 'openai_compat';
  var urlRow = document.getElementById('modalCustomUrlRow');
  var body = document.querySelector('.api-modal-body');
  if (urlRow) urlRow.style.display = isCustom ? 'block' : 'none';
  // Bug #2: only allow scroll when custom URL field is visible
  if (body) body.classList.toggle('has-custom', isCustom);
}

function v2SaveApiKey() {
  var provEl = document.getElementById('modalProviderSelect');
  var keyEl = document.getElementById('modalApiKey');
  var modelEl = document.getElementById('modalModelInput');
  var urlEl = document.getElementById('modalCustomUrlInput');

  // Sync back to main form
  if (provEl) {
    var mainProv = document.getElementById('providerSelect');
    if (mainProv) { mainProv.value = provEl.value; if (typeof onProviderChange === 'function') onProviderChange(); }
  }
  if (keyEl) {
    var mainKey = document.getElementById('apiKey');
    if (mainKey) mainKey.value = keyEl.value;
    // persist key for session
    try { if (keyEl.value) localStorage.setItem('bh_apikey_' + (provEl ? provEl.value : 'anthropic'), keyEl.value); } catch(e) {}
  }
  if (modelEl) {
    var mainModel = document.getElementById('modelInput');
    if (mainModel) mainModel.value = modelEl.value;
  }
  if (urlEl) {
    var mainUrl = document.getElementById('customUrlInput');
    if (mainUrl) mainUrl.value = urlEl.value;
  }
  v2CloseApiModal();
  // Show brief confirmation
  var saved = document.getElementById('apiKeySavedMsg');
  if (saved) {
    saved.style.display = 'inline';
    setTimeout(function() { saved.style.display = 'none'; }, 2000);
  }
}

function v2RestoreApiKeys() {
  // Auto-fill saved key for current provider on page load
  try {
    var provEl = document.getElementById('providerSelect');
    var provider = provEl ? provEl.value : 'anthropic';
    var saved = localStorage.getItem('bh_apikey_' + provider);
    if (saved) {
      var keyEl = document.getElementById('apiKey');
      if (keyEl && !keyEl.value) keyEl.value = saved;
    }
  } catch(e) {}
}

// Close on backdrop click
document.addEventListener('click', function(e) {
  var modal = document.getElementById('apiKeyModal');
  if (modal && modal.classList.contains('open') && e.target === modal) {
    v2CloseApiModal();
  }
});

// Close on Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    v2CloseApiModal();
    v2CloseWizard();
  }
});

window.addEventListener('DOMContentLoaded', function() {
  v2RestoreApiKeys();
});
