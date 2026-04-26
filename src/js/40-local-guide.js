// ══════════════════════════════════════════════════════════
// 40-local-guide.js — Ollama/Local Model Setup Guide
//                   + Data Freshness Badge Helpers
//
// Guide appears when "OpenAI-Compatible / Local" provider
// is selected in the provider dropdown.
//
// Data freshness: _freshBadge(year, confidence) renders
// inline HTML badge for use in agent output tables.
// ══════════════════════════════════════════════════════════

// ── Ollama Setup Guide ────────────────────────────────────
function _showLocalGuide() {
  const panel = $('localGuidePanel');
  if (!panel) return;
  const prov = provider ? provider() : ($('providerSelect')?.value || '');
  panel.style.display = prov === 'openai_compat' ? 'block' : 'none';
}

// Patch onProviderChange to also show/hide the guide
(function patchProviderChange() {
  document.addEventListener('DOMContentLoaded', () => {
    const _orig = window.onProviderChange;
    window.onProviderChange = function() {
      if (_orig) _orig.call(this);
      _showLocalGuide();
    };
  });
})();

// ── Data Freshness Badge ──────────────────────────────────
/**
 * Returns an HTML badge string for inline use in tables.
 * @param {string|number} year  - Source year, e.g. "2023" or "2022 est."
 * @param {'verified'|'estimated'|'live'} confidence
 * @returns {string} HTML badge string
 */
function _freshBadge(year, confidence) {
  if (!year) return '';
  const cfg = {
    verified:  { icon:'✓', cls:'badge-fresh-verified',  title:'Verified government/authoritative source' },
    estimated: { icon:'~', cls:'badge-fresh-estimated', title:'Estimated or modeled value' },
    live:      { icon:'⚡', cls:'badge-fresh-live',     title:'Live search result' },
  }[confidence] || { icon:'?', cls:'badge-fresh-estimated', title:'Source unknown' };
  return `<span class="fresh-badge ${cfg.cls}" title="${cfg.title}">${cfg.icon} ${year}</span>`;
}

/**
 * Parse a data_note string like "ACS 2023" → { year:"2023", confidence:"verified" }
 * Attaches the badge after any table cell that has a data-note attribute.
 */
function _autoFreshBadges(containerId) {
  const el = $(containerId);
  if (!el) return;
  el.querySelectorAll('[data-note]').forEach(cell => {
    const note = cell.dataset.note || '';
    const yearMatch = note.match(/\b(20\d\d)\b/);
    const year = yearMatch ? yearMatch[1] : null;
    const confidence = /est\.|estimated|model/i.test(note) ? 'estimated'
      : /live|search|real.?time/i.test(note) ? 'live' : 'verified';
    if (year) cell.innerHTML += ' ' + _freshBadge(year, confidence);
  });
}
