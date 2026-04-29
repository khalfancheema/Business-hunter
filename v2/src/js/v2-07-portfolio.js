// ── V2 PORTFOLIO ──────────────────────────────────────────────────────────
function v2RenderPortfolio() {
  const wrap = document.getElementById('v2-port-wrap');
  if (!wrap) return;

  const list = V2.portfolio;

  wrap.innerHTML = `
    <div class="v2-port-header">
      <div class="v2-port-title">📁 My Portfolio</div>
      <div style="display:flex;gap:8px">
        ${list.length ? `<button class="v2-btn ghost sm" onclick="v2ClearPortfolio()">🗑 Clear All</button>` : ''}
        <button class="v2-btn primary sm" onclick="v2GoTo('wizard')">+ New Analysis</button>
      </div>
    </div>
    ${list.length === 0 ? `
      <div class="v2-port-grid">
        <div class="v2-empty-state">
          <div class="v2-empty-ico">📁</div>
          <div class="v2-empty-title">No analyses saved yet</div>
          <div class="v2-empty-desc">Run your first analysis and click "Save to Portfolio" to build your business idea library.</div>
          <button class="v2-btn primary" onclick="v2GoTo('wizard')">🚀 Start Your First Analysis</button>
        </div>
      </div>
    ` : `
      <div style="margin-bottom:20px">
        ${v2RenderPortfolioStats(list)}
      </div>
      <div class="v2-port-grid">
        ${list.map(r => v2RenderPortfolioCard(r)).join('')}
      </div>
    `}
  `;
}

function v2RenderPortfolioStats(list) {
  const avg = list.length ? Math.round(list.reduce((s,r)=>s+r.score,0)/list.length) : 0;
  const goes = list.filter(r=>r.verdict==='go').length;
  return `
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px">
      <div class="v2-kpi"><div class="v2-kpi-ico">📁</div><div class="v2-kpi-val">${list.length}</div><div class="v2-kpi-lbl">Analyses</div></div>
      <div class="v2-kpi"><div class="v2-kpi-ico">📊</div><div class="v2-kpi-val">${avg}</div><div class="v2-kpi-lbl">Avg Score</div></div>
      <div class="v2-kpi"><div class="v2-kpi-ico">✅</div><div class="v2-kpi-val">${goes}</div><div class="v2-kpi-lbl">GO Verdicts</div></div>
      <div class="v2-kpi"><div class="v2-kpi-ico">🏆</div><div class="v2-kpi-val">${list.length ? [...list].sort((a,b)=>b.score-a.score)[0].indEmoji : '—'}</div><div class="v2-kpi-lbl">Top Industry</div></div>
    </div>
  `;
}

function v2RenderPortfolioCard(r) {
  const verdict = v2ScoreVerdict(r.score);
  const ringColor = r.score >= 70 ? 'var(--v2-green)' : r.score >= 45 ? 'var(--v2-amber)' : 'var(--v2-red)';
  return `
    <div class="v2-port-card">
      <div class="v2-port-card-head">
        <div>
          <div class="v2-port-ico">${r.indEmoji||'🏢'}</div>
          <div class="v2-port-name">${r.indLabel||'Business'}</div>
          <div class="v2-port-loc">📍 ZIP ${r.zip} · $${parseInt(r.budget||0).toLocaleString()}</div>
        </div>
        <div style="text-align:right">
          <div class="v2-port-score" style="color:${ringColor}">${r.score}</div>
          <div class="v2-port-score-lbl">/ 100</div>
          <span class="v2-port-badge ${r.verdict||'caution'}" style="margin-top:6px;display:inline-block">${r.label||'—'}</span>
        </div>
      </div>
      <div style="font-size:12px;color:var(--v2-t3)">${new Date(r.ts||Date.now()).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</div>
      <div class="v2-port-actions">
        <button class="v2-btn ghost sm" style="flex:1;justify-content:center" onclick="v2PortRestore('${r.id}')">↩ Restore</button>
        <button class="v2-btn danger sm" onclick="v2PortDelete('${r.id}')">🗑</button>
      </div>
    </div>
  `;
}

function v2PortRestore(id) {
  const entry = V2.portfolio.find(r => String(r.id) === String(id));
  if (!entry) { v2Toast('Run not found'); return; }
  V2.run = entry;
  v2GoTo('dashboard');
  v2Toast(`↩ Restored: ${entry.indEmoji} ${entry.indLabel}`);
}

function v2PortDelete(id) {
  V2.portfolio = V2.portfolio.filter(r => String(r.id) !== String(id));
  v2SavePortfolio();
  v2RenderPortfolio();
  v2Toast('Deleted');
}

function v2ClearPortfolio() {
  if (!confirm('Clear all saved analyses?')) return;
  V2.portfolio = [];
  v2SavePortfolio();
  v2RenderPortfolio();
}
