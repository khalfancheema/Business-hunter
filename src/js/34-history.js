// ══════════════════════════════════════════════════════════
// 34-history.js — Session history: last 5 pipeline runs
//
// After every pipeline completion, saves a lightweight
// summary to localStorage (biz_history_v1).
// The "Recent Reports" panel lists them with key stats
// and lets users restore inputs or re-run.
// ══════════════════════════════════════════════════════════

const HISTORY_KEY  = 'biz_history_v1';
const HISTORY_LIMIT = 5;

// ── Save a history entry after pipeline completes ────────────
(function patchRunPipelineForHistory() {
  document.addEventListener('DOMContentLoaded', function() {
    const _orig = window.runPipeline;
    if (!_orig) return;
    window.runPipeline = async function() {
      let result;
      try {
        result = await _orig.apply(this, arguments);
      } finally {
        // Save regardless of whether it completed fully or partially
        const count = Object.keys(R).filter(k => k.match(/^a\d+$/)).length;
        if (count > 0) historySave();
      }
      return result;
    };
  });
})();

function historySave() {
  try {
    const entry = {
      id:         Date.now(),
      date:       new Date().toISOString(),
      zip:        $('zip')            ? $('zip').value.trim()           : '?',
      industry:   $('industrySelect') ? $('industrySelect').value       : 'daycare',
      radius:     $('radius')         ? $('radius').value               : '40',
      capacity:   $('capacity')       ? $('capacity').value             : '',
      budget:     $('budget')         ? $('budget').value               : '',
      verdict:    R.a8?.verdict       || null,
      verdictRationale: (R.a8?.verdict_rationale || '').slice(0, 120),
      agentCount: Object.keys(R).filter(k => k.match(/^a\d+$/)).length,
      oppScore:   R.a2?.overall_opportunity_score || null,
      topCity:    (R.a3?.locations?.[0]?.city) || null,
      summary:    (R.a8?.assessment || R.a1?.summary || '').slice(0, 200),
    };

    const history = historyLoad();
    // Remove duplicate (same ZIP + industry + same day)
    const today = entry.date.slice(0, 10);
    const filtered = history.filter(h =>
      !(h.zip === entry.zip && h.industry === entry.industry && h.date.slice(0, 10) === today)
    );
    filtered.unshift(entry);
    const trimmed = filtered.slice(0, HISTORY_LIMIT);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
    historyRenderPanel();
  } catch(e) { console.warn('History save failed:', e.message); }
}

function historyLoad() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch(e) { return []; }
}

function historyClear() {
  try { localStorage.removeItem(HISTORY_KEY); } catch(e) {}
  historyRenderPanel();
}

// ── Restore inputs from a history entry ─────────────────────
function historyRestoreInputs(id) {
  const history = historyLoad();
  const entry = history.find(h => h.id === id);
  if (!entry) return;

  if ($('zip') && entry.zip)          $('zip').value          = entry.zip;
  if ($('radius') && entry.radius)    $('radius').value       = entry.radius;
  if ($('capacity') && entry.capacity) $('capacity').value    = entry.capacity;
  if ($('budget') && entry.budget)    $('budget').value       = entry.budget;
  if ($('industrySelect') && entry.industry) {
    $('industrySelect').value = entry.industry;
    if (typeof onIndustryChange === 'function') onIndustryChange();
  }

  // Show restore confirmation
  const panel = $('historyPanel');
  if (panel) {
    const notice = panel.querySelector('.history-restore-notice');
    if (notice) {
      notice.textContent = `✓ Inputs restored — ZIP ${entry.zip} · ${entry.industry}. Click ▶ Run Pipeline to re-run.`;
      notice.style.display = 'block';
      setTimeout(() => { notice.style.display = 'none'; }, 4000);
    }
  }
  if (typeof urlParamsUpdate === 'function') urlParamsUpdate();
}

// ── Render the Recent Reports panel ─────────────────────────
function historyRenderPanel() {
  const panel = $('historyPanel');
  if (!panel) return;
  const history = historyLoad();

  if (!history.length) {
    panel.innerHTML = `<div class="history-empty">No saved runs yet — run the pipeline to start building history.</div>`;
    return;
  }

  const verdictClass = v => {
    if (!v) return 'h-vna';
    const vl = v.toLowerCase();
    if (vl === 'go') return 'h-vgo';
    if (vl.includes('caution')) return 'h-vcaution';
    return 'h-vnogo';
  };
  const verdictIcon = v => {
    if (!v) return '—';
    const vl = v.toLowerCase();
    if (vl === 'go') return '✓ Go';
    if (vl.includes('caution')) return '⚡ Cautious';
    return '✗ No Go';
  };
  const relTime = iso => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.round(diff / 60000);
    if (m < 60) return m + 'm ago';
    const h = Math.round(m / 60);
    if (h < 24) return h + 'h ago';
    return Math.round(h / 24) + 'd ago';
  };
  const ind = id => {
    const found = Object.values(INDUSTRIES || {}).find((_, i) => Object.keys(INDUSTRIES)[i] === id);
    return found ? found.emoji + ' ' + found.label : id;
  };

  let html = `<div class="history-restore-notice" style="display:none"></div><div class="history-list">`;
  history.forEach(h => {
    html += `
    <div class="history-item">
      <div class="history-meta">
        <span class="history-zip">ZIP ${h.zip}</span>
        <span class="history-ind">${ind(h.industry)}</span>
        <span class="history-time">${relTime(h.date)}</span>
        <span class="history-agents">${h.agentCount} agents</span>
        ${h.verdict ? `<span class="history-verdict ${verdictClass(h.verdict)}">${verdictIcon(h.verdict)}</span>` : ''}
      </div>
      ${h.verdictRationale ? `<div class="history-rationale">${h.verdictRationale}</div>` : ''}
      ${h.topCity ? `<div class="history-detail">Top location: ${h.topCity}${h.oppScore ? ` · Opportunity score ${h.oppScore}/10` : ''}</div>` : ''}
      <div class="history-actions">
        <button class="history-btn" onclick="historyRestoreInputs(${h.id})">↩ Restore Inputs</button>
      </div>
    </div>`;
  });
  html += `</div>
  <div class="history-footer">
    <button class="history-clear-btn" onclick="historyClear()">✕ Clear History</button>
  </div>`;
  panel.innerHTML = html;
}

function toggleHistoryPanel() {
  const panel   = $('historyPanel');
  const btn     = $('historyToggleBtn');
  if (!panel) return;
  const isOpen = panel.style.display !== 'none';
  panel.style.display = isOpen ? 'none' : 'block';
  if (btn) btn.textContent = isOpen ? '🕐 Recent Reports' : '🕐 Recent Reports ▲';
  if (!isOpen) historyRenderPanel();
}

// ── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  historyRenderPanel();
});
