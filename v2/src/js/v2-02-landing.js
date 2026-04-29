// ── V2 LANDING ────────────────────────────────────────────────────────────
function v2RenderLandingDemo() {
  const el = document.getElementById('v2-demo-preview');
  if (!el) return;
  el.innerHTML = `
    <div class="v2-demo-card">
      <div class="v2-demo-label">✨ Sample Analysis — Coffee Shop · Austin TX</div>
      <div class="v2-demo-biz">☕ Coffee Shop / Café</div>
      <div class="v2-demo-meta">ZIP 78701 · Austin, TX · $350,000 budget · 60 seats</div>
      <div class="v2-demo-stats">
        <div class="v2-demo-stat">
          <div class="v2-demo-stat-val" style="background:linear-gradient(135deg,#22c55e,#16a34a);-webkit-background-clip:text;-webkit-text-fill-color:transparent">82</div>
          <div class="v2-demo-stat-lbl">Viability Score</div>
        </div>
        <div class="v2-demo-stat">
          <div class="v2-demo-stat-val" style="color:#22c55e">$18K</div>
          <div class="v2-demo-stat-lbl">Net/mo (Base)</div>
        </div>
        <div class="v2-demo-stat">
          <div class="v2-demo-stat-val" style="color:#f59e0b">14 mo</div>
          <div class="v2-demo-stat-lbl">Break-Even</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:16px">
        <span class="v2-badge green">✓ GO</span>
        <span style="font-size:12px;color:var(--v2-t2)">Strong demand · underserved walkable zones · favorable permit timeline</span>
      </div>
      <button class="v2-btn primary" style="width:100%;justify-content:center" onclick="v2StartDemo()">⚡ Load This Demo</button>
    </div>
  `;
}

function v2StartDemo() {
  // Pre-fill wizard with demo data
  V2.wizard.data = {
    industry: 'coffee_shop',
    zip: '78701',
    budget: '350000',
    capacity: '60',
    radius: '25',
    experience: 'some',
    goal: 'open',
  };
  // Activate demo mode in v1
  demoMode = true;
  const demoBtn = document.getElementById('demoBtn');
  if (demoBtn) {
    demoBtn.style.background = 'var(--amber-dim)';
  }
  v2Toast('⚡ Demo mode activated — no API key required');
  v2LaunchPipeline();
}
