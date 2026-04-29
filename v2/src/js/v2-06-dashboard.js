// ── V2 DASHBOARD ──────────────────────────────────────────────────────────
function v2RenderDashboard(run) {
  const wrap = document.getElementById('v2-dash-wrap');
  if (!wrap) return;

  const score   = run.score || v2CalcScore();
  const verdict = v2ScoreVerdict(score);
  const kpis    = v2GetKPIs();
  const risks   = v2GetRisks();
  const insights= v2GetInsights();

  const ind  = V2_INDUSTRIES.find(i=>i.val===run.industry)||{emoji:'🏢',label:'Business'};
  const circ = 2 * Math.PI * 58;
  const offset = circ * (1 - score / 100);
  const ringColor = score >= 70 ? '#22c55e' : score >= 45 ? '#f59e0b' : '#ef4444';

  // Score ring SVG
  const ring = `
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle class="v2-score-ring-bg" cx="70" cy="70" r="58" />
      <circle class="v2-score-ring-fill" cx="70" cy="70" r="58"
        stroke="${ringColor}"
        stroke-dasharray="${circ.toFixed(1)}"
        stroke-dashoffset="${offset.toFixed(1)}"
        style="transform:rotate(-90deg);transform-origin:center"
      />
    </svg>
    <div class="v2-score-num">
      <span class="big" style="color:${ringColor}">${score}</span>
      <span class="small">/100</span>
    </div>
  `;

  wrap.innerHTML = `
    <!-- Header -->
    <div class="v2-dash-header">
      <div>
        <div class="v2-dash-title">${ind.emoji} ${ind.label} Analysis</div>
        <div class="v2-dash-meta">ZIP ${run.zip} · ${run.radius} mi radius · $${parseInt(run.budget).toLocaleString()} budget · ${new Date(run.ts||Date.now()).toLocaleDateString()}</div>
      </div>
      <div class="v2-dash-actions">
        <button class="v2-btn ghost sm" onclick="v2ShowDetail()">📊 Full Analysis</button>
        <button class="v2-btn ghost sm" onclick="v2ShowExecution()">🗓 Execution Plan</button>
        <button class="v2-btn sm" onclick="v2ShowInvestor()">📑 Investor Package</button>
        <button class="v2-btn primary sm" onclick="v2SaveCurrentRun()">💾 Save to Portfolio</button>
      </div>
    </div>

    <!-- Verdict banner -->
    <div class="v2-verdict-banner ${verdict.colorClass}">
      <div class="v2-verdict-icon">${verdict.icon}</div>
      <div class="v2-verdict-text">
        <h3>${verdict.title}</h3>
        <p>${verdict.summary}</p>
      </div>
      <div class="v2-verdict-cta">
        <span class="v2-badge ${verdict.colorClass === 'go' ? 'green' : verdict.colorClass === 'caution' ? 'amber' : 'red'}" style="font-size:13px;padding:6px 14px">${verdict.label}</span>
      </div>
    </div>

    <!-- Score + KPIs -->
    <div class="v2-metrics-row">
      <div class="v2-card glow v2-score-card">
        <div class="v2-score-ring-wrap">${ring}</div>
        <div class="v2-score-verdict" style="color:${ringColor}">${verdict.title}</div>
        <div class="v2-score-reason">Based on gap analysis, financials, compliance, and competitive landscape</div>
      </div>
      <div class="v2-card" style="padding:20px">
        <div class="v2-label" style="margin-bottom:14px">Key Metrics</div>
        <div class="v2-kpi-grid">
          ${kpis.map(k=>`
            <div class="v2-kpi">
              <div class="v2-kpi-ico">${k.ico}</div>
              <div class="v2-kpi-val">${k.val}</div>
              <div class="v2-kpi-lbl">${k.lbl}</div>
            </div>`).join('')}
          ${kpis.length === 0 ? '<div style="color:var(--v2-t3);font-size:13px;padding:12px">Run the pipeline to see metrics</div>' : ''}
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="v2-dash-tabs">
      <div class="v2-dash-tab active" onclick="v2DashTab('insights',this)">💡 Insights</div>
      <div class="v2-dash-tab" onclick="v2DashTab('risks',this)">⚠ Risks</div>
      <div class="v2-dash-tab" onclick="v2DashTab('nextsteps',this)">✅ Next Steps</div>
      <div class="v2-dash-tab" onclick="v2DashTab('agents',this)">📊 All Agents</div>
    </div>

    <!-- Insights panel -->
    <div class="v2-dash-panel active" id="v2-panel-insights">
      ${insights.length ? `<div class="v2-insights">${insights.map(i=>`
        <div class="v2-insight">
          <div class="v2-insight-ico">${i.ico}</div>
          <div>
            <div class="v2-insight-title">${i.title}</div>
            <div class="v2-insight-body">${i.body}</div>
          </div>
        </div>`).join('')}</div>`
      : '<div class="v2-prose" style="padding:20px">Complete the pipeline to see AI insights.</div>'}
    </div>

    <!-- Risks panel -->
    <div class="v2-dash-panel" id="v2-panel-risks">
      ${risks.length ? `<div class="v2-risk-grid">${risks.map(r=>`
        <div class="v2-risk-item">
          <div class="v2-risk-header">
            <span class="v2-risk-badge ${r.severity}">${r.severity.toUpperCase()}</span>
            <span class="v2-risk-title">${r.title}</span>
          </div>
          <div class="v2-risk-desc">${r.desc||'Identified by executive summary agent'}</div>
        </div>`).join('')}</div>`
      : `<div class="v2-risk-grid">
          <div class="v2-risk-item"><div class="v2-risk-header"><span class="v2-risk-badge medium">MEDIUM</span><span class="v2-risk-title">Market saturation risk</span></div><div class="v2-risk-desc">Complete the pipeline to see AI-generated risk analysis.</div></div>
        </div>`}
    </div>

    <!-- Next steps panel -->
    <div class="v2-dash-panel" id="v2-panel-nextsteps">
      ${v2RenderNextSteps()}
    </div>

    <!-- All agents panel -->
    <div class="v2-dash-panel" id="v2-panel-agents">
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px">
        ${V2_AGENTS.map(a=>{
          const row = document.getElementById(`v2-ar-${a.id}`);
          const isDone  = row?.classList.contains('done');
          const isError = row?.classList.contains('error');
          const st = isDone ? 'done' : isError ? 'error' : 'idle';
          const stColor = st==='done' ? 'var(--v2-green)' : st==='error' ? 'var(--v2-red)' : 'var(--v2-t3)';
          const stLabel = st==='done' ? '✓ Done' : st==='error' ? '✗ Error' : '— Not run';
          return `<div class="v2-kpi" style="display:flex;align-items:center;gap:10px;padding:14px;cursor:pointer" onclick="v2ShowDetail()">
            <span style="font-size:20px">${a.ico}</span>
            <div style="flex:1">
              <div style="font-size:13px;font-weight:600">${a.name}</div>
              <div style="font-size:11px;color:${stColor};margin-top:2px">${stLabel}</div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>
  `;
}

function v2DashTab(id, el) {
  document.querySelectorAll('.v2-dash-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.v2-dash-panel').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  const panel = document.getElementById(`v2-panel-${id}`);
  if (panel) panel.classList.add('active');
}

function v2RenderNextSteps() {
  const steps = [
    { ico:'🔑', title:'Secure Your Funding',      desc:'Apply for an SBA 7(a) loan and present your investor deck. The full business plan is ready in the Analysis view.' },
    { ico:'📍', title:'Lock In Your Location',     desc:'Contact the top-ranked sites from Agent 3. Use the market map to compare neighborhoods before signing.' },
    { ico:'⚖️',  title:'File for Permits',         desc:'Begin the licensing process immediately — permit timelines are your critical path. See compliance checklist.' },
    { ico:'👥', title:'Build Your Team',           desc:'Start recruiting key hires now. Your project plan (Agent 10) has the full hiring roadmap and timeline.' },
    { ico:'📣', title:'Pre-Launch Marketing',      desc:'Build your waitlist and brand presence 3–4 months before opening. Use the differentiation plan from Agent 13.' },
    { ico:'📊', title:'Track Your Progress',       desc:'Save this analysis to your portfolio and re-run it in 60 days to check if market conditions have changed.' },
  ];
  return `<div class="v2-insights">${steps.map(s=>`
    <div class="v2-insight">
      <div class="v2-insight-ico">${s.ico}</div>
      <div>
        <div class="v2-insight-title">${s.title}</div>
        <div class="v2-insight-body">${s.desc}</div>
      </div>
    </div>`).join('')}</div>`;
}

function v2SaveCurrentRun() {
  if (!V2.run) { v2Toast('No analysis to save yet'); return; }
  const ind = V2_INDUSTRIES.find(i=>i.val===V2.run.industry)||{emoji:'🏢',label:'Business'};
  const score = V2.run.score || v2CalcScore();
  const verdict = v2ScoreVerdict(score);
  const entry = {
    id: V2.run.id || Date.now(),
    ts: V2.run.ts || new Date().toISOString(),
    industry: V2.run.industry,
    zip: V2.run.zip,
    budget: V2.run.budget,
    capacity: V2.run.capacity,
    score,
    verdict: verdict.colorClass,
    label: verdict.label,
    indLabel: ind.label,
    indEmoji: ind.emoji,
  };
  // Upsert by id
  const idx = V2.portfolio.findIndex(p => p.id === entry.id);
  if (idx >= 0) V2.portfolio[idx] = entry; else V2.portfolio.unshift(entry);
  if (V2.portfolio.length > 20) V2.portfolio = V2.portfolio.slice(0, 20);
  v2SavePortfolio();
  v2Toast('✓ Saved to portfolio');
}
