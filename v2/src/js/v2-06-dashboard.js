// ── V2 DASHBOARD ──────────────────────────────────────────────────────────
function v2RenderDashboard(run) {
  const wrap = document.getElementById('v2-dash-wrap');
  if (!wrap) return;

  const score   = run.score || v2CalcScore();
  const verdict = v2ScoreVerdict(score);
  const kpis    = v2GetKPIs();
  const ind     = V2_INDUSTRIES.find(i=>i.val===run.industry)||{emoji:'🏢',label:'Business'};
  const circ    = 2 * Math.PI * 54;
  const offset  = circ * (1 - score / 100);
  const ringColor = score >= 70 ? '#22c55e' : score >= 45 ? '#f59e0b' : '#ef4444';

  const ring = `
    <svg width="130" height="130" viewBox="0 0 130 130" style="display:block">
      <circle class="v2-score-ring-bg" cx="65" cy="65" r="54"/>
      <circle class="v2-score-ring-fill" cx="65" cy="65" r="54"
        stroke="${ringColor}" stroke-dasharray="${circ.toFixed(1)}" stroke-dashoffset="${offset.toFixed(1)}"
        style="transform:rotate(-90deg);transform-origin:center"/>
    </svg>
    <div class="v2-score-num">
      <span class="big" style="color:${ringColor}">${score}</span>
      <span class="small">/100</span>
    </div>`;

  wrap.innerHTML = `
    <div class="v2-dash-header">
      <div>
        <div class="v2-dash-title">${ind.emoji} ${ind.label} Analysis</div>
        <div class="v2-dash-meta">ZIP ${run.zip} · ${run.radius} mi radius · $${parseInt(run.budget||0).toLocaleString()} budget · ${new Date(run.ts||Date.now()).toLocaleDateString()}</div>
      </div>
      <div class="v2-dash-actions">
        <button class="v2-btn ghost sm" onclick="v2ShowExecution()">🗓 Execution Plan</button>
        <button class="v2-btn ghost sm" onclick="v2ShowInvestor()">📑 Investor Pack</button>
        <button class="v2-btn ghost sm" onclick="v2GoTo('traditional')">🔬 Traditional View</button>
        <button class="v2-btn primary sm" onclick="v2SaveCurrentRun()">💾 Save</button>
      </div>
    </div>

    <div class="v2-verdict-banner ${verdict.colorClass}">
      <div class="v2-verdict-icon">${verdict.icon}</div>
      <div class="v2-verdict-text">
        <h3>${verdict.title}</h3>
        <p>${verdict.summary}</p>
      </div>
      <div class="v2-verdict-cta">
        <span class="v2-badge ${verdict.colorClass==='go'?'green':verdict.colorClass==='caution'?'amber':'red'}" style="font-size:13px;padding:6px 14px">${verdict.label}</span>
      </div>
    </div>

    <div class="v2-metrics-row">
      <div class="v2-card glow v2-score-card">
        <div class="v2-score-ring-wrap">${ring}</div>
        <div class="v2-score-verdict" style="color:${ringColor}">${verdict.title}</div>
        <div class="v2-score-reason">Gap · Financials · Compliance · Competition</div>
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
          ${!kpis.length?'<div style="color:var(--v2-t3);font-size:13px;padding:12px">Run the pipeline to see metrics</div>':''}
        </div>
      </div>
    </div>

    <div class="v2-dash-tabs" id="v2-dash-tabs">
      <div class="v2-dash-tab active" onclick="v2DashTab('executive',this)">📋 Executive</div>
      <div class="v2-dash-tab" onclick="v2DashTab('financials',this)">💰 Financials</div>
      <div class="v2-dash-tab" onclick="v2DashTab('market',this)">🗺️ Market</div>
      <div class="v2-dash-tab" onclick="v2DashTab('competition',this)">🔍 Competition</div>
      <div class="v2-dash-tab" onclick="v2DashTab('risks',this)">⚠️ Risks</div>
      <div class="v2-dash-tab" onclick="v2DashTab('plan',this)">✅ Action Plan</div>
      <div class="v2-dash-tab" onclick="v2DashTab('grants',this)">💵 Grants</div>
      <div class="v2-dash-tab" onclick="v2DashTab('agents',this)">🤖 All Agents</div>
    </div>

    <div class="v2-dash-panel active" id="v2-panel-executive">${v2RenderExecutive()}</div>
    <div class="v2-dash-panel" id="v2-panel-financials">${v2RenderFinancials()}</div>
    <div class="v2-dash-panel" id="v2-panel-market">${v2RenderMarket()}</div>
    <div class="v2-dash-panel" id="v2-panel-competition">${v2RenderCompetition()}</div>
    <div class="v2-dash-panel" id="v2-panel-risks">${v2RenderRisks()}</div>
    <div class="v2-dash-panel" id="v2-panel-plan">${v2RenderActionPlan()}</div>
    <div class="v2-dash-panel" id="v2-panel-grants">${v2RenderGrants()}</div>
    <div class="v2-dash-panel" id="v2-panel-agents">${v2RenderAgents()}</div>
  `;
}

// ── TAB SWITCHING ─────────────────────────────────────────────────────────
function v2DashTab(id, el) {
  document.querySelectorAll('#v2-dash-tabs .v2-dash-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.v2-dash-panel').forEach(p => p.classList.remove('active'));
  if (el) el.classList.add('active');
  const panel = document.getElementById(`v2-panel-${id}`);
  if (panel) panel.classList.add('active');
}

// ── EXECUTIVE SUMMARY ─────────────────────────────────────────────────────
function v2RenderExecutive() {
  const a = v2GetAssessment();
  const insights = v2GetInsights();

  if (!a) return `
    <div class="v2-empty-panel">
      <div style="font-size:40px;margin-bottom:12px">📋</div>
      <div style="font-size:16px;font-weight:700;margin-bottom:8px">No executive summary yet</div>
      <div class="v2-prose">Run the full pipeline to generate the AI executive analysis.</div>
    </div>`;

  const sf = a.successFactors;

  return `
    ${a.rationale ? `
    <div class="v2-exec-verdict-box">
      <div class="v2-exec-verdict-label">AI Verdict Rationale</div>
      <div class="v2-exec-verdict-text">${a.rationale}</div>
    </div>` : ''}

    ${a.assessment ? `
    <div class="v2-exec-section">
      <div class="v2-exec-section-title">📊 Overall Assessment</div>
      <div class="v2-prose">${a.assessment}</div>
    </div>` : ''}

    ${sf.length ? `
    <div class="v2-exec-section">
      <div class="v2-exec-section-title">✅ Success Factors</div>
      <div class="v2-sf-grid">
        ${sf.map((f,i)=>`
          <div class="v2-sf-item">
            <div class="v2-sf-num">${i+1}</div>
            <div class="v2-sf-text">${typeof f==='string'?f:(f.factor||f.title||f.name||String(f))}</div>
          </div>`).join('')}
      </div>
    </div>` : ''}

    ${insights.length ? `
    <div class="v2-exec-section">
      <div class="v2-exec-section-title">💡 Market Intelligence Highlights</div>
      <div class="v2-insights">
        ${insights.map(i=>`
          <div class="v2-insight">
            <div class="v2-insight-ico">${i.ico}</div>
            <div>
              <div class="v2-insight-title">${i.title}</div>
              <div class="v2-insight-body">${i.body}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>` : ''}
  `;
}

// ── FINANCIALS ────────────────────────────────────────────────────────────
function v2RenderFinancials() {
  const f = v2GetFinancialsDetail();

  if (!f) return `<div class="v2-empty-panel"><div style="font-size:40px;margin-bottom:12px">💰</div><div style="font-size:16px;font-weight:700;margin-bottom:8px">No financial data yet</div><div class="v2-prose">Run Agent 7 to generate financial models.</div></div>`;

  const fmtUSD = v => v ? `$${Number(v).toLocaleString()}` : '—';

  return `
    <div class="v2-fin-summary">
      <div class="v2-fin-stat">
        <div class="v2-fin-stat-val">${fmtUSD(f.startup)}</div>
        <div class="v2-fin-stat-lbl">Total Startup Cost</div>
      </div>
      <div class="v2-fin-stat">
        <div class="v2-fin-stat-val">${fmtUSD(f.monthly_expenses)}</div>
        <div class="v2-fin-stat-lbl">Monthly Fixed Costs</div>
      </div>
      <div class="v2-fin-stat">
        <div class="v2-fin-stat-val">${f.scenarios.length || 3}</div>
        <div class="v2-fin-stat-lbl">Scenarios Modeled</div>
      </div>
    </div>

    ${f.scenarios.length ? `
    <div class="v2-exec-section">
      <div class="v2-exec-section-title">📊 3-Scenario Financial Model</div>
      <div class="v2-table-wrap">
        <table class="v2-table">
          <thead><tr>
            <th>Scenario</th><th>Occupancy</th><th>Monthly Revenue</th>
            <th>Monthly Net</th><th>Break-Even</th><th>3yr ROI</th>
          </tr></thead>
          <tbody>
            ${f.scenarios.map(s => {
              const net = s.monthly_net || 0;
              const color = net > 0 ? 'var(--v2-green)' : 'var(--v2-red)';
              return `<tr>
                <td><strong>${s.name||'Scenario'}</strong></td>
                <td>${s.occupancy_rate||s.occupancy||'—'}${typeof (s.occupancy_rate||s.occupancy)==='number'?'%':''}</td>
                <td>${fmtUSD(s.monthly_revenue)}</td>
                <td style="color:${color};font-weight:700">${fmtUSD(s.monthly_net)}</td>
                <td>${s.breakeven_months ? s.breakeven_months+' mo' : '—'}</td>
                <td>${s.roi_3yr!=null ? (s.roi_3yr>0?'+':'')+s.roi_3yr+'%' : '—'}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>` : ''}

    ${f.startup_breakdown.length ? `
    <div class="v2-exec-section">
      <div class="v2-exec-section-title">💸 Startup Cost Breakdown</div>
      <div class="v2-cost-grid">
        ${f.startup_breakdown.map(item=>`
          <div class="v2-cost-item">
            <div class="v2-cost-name">${typeof item==='string'?item:(item.item||item.category||item.name||'')}</div>
            <div class="v2-cost-val">${typeof item==='object'?fmtUSD(item.cost||item.amount||item.value||0):'—'}</div>
          </div>`).join('')}
      </div>
    </div>` : ''}

    ${f.funding.length ? `
    <div class="v2-exec-section">
      <div class="v2-exec-section-title">🏦 Recommended Funding Sources</div>
      <div class="v2-insights">
        ${f.funding.map(s=>`
          <div class="v2-insight">
            <div class="v2-insight-ico">🏦</div>
            <div>
              <div class="v2-insight-title">${typeof s==='string'?s:(s.source||s.name||s.type||'')}</div>
              <div class="v2-insight-body">${typeof s==='object'?(s.amount?'Amount: '+fmtUSD(s.amount)+' · ':'')+( s.notes||s.description||s.terms||''):''}
              </div>
            </div>
          </div>`).join('')}
      </div>
    </div>` : ''}

    ${f.assumptions.length ? `
    <div class="v2-exec-section">
      <div class="v2-exec-section-title">📌 Key Assumptions</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${f.assumptions.map(a=>`
          <div class="v2-assumption">
            <span class="v2-assumption-dot">→</span>
            <span>${typeof a==='string'?a:(a.assumption||a.text||a.note||'')}</span>
          </div>`).join('')}
      </div>
    </div>` : ''}
  `;
}

// ── MARKET ────────────────────────────────────────────────────────────────
function v2RenderMarket() {
  const { gap, sites, realEstate } = v2GetMarketData();

  if (!gap && !sites.length) return `<div class="v2-empty-panel"><div style="font-size:40px;margin-bottom:12px">🗺️</div><div style="font-size:16px;font-weight:700;margin-bottom:8px">No market data yet</div><div class="v2-prose">Run Agents 2, 3, and 4 for gap analysis, site scoring, and real estate.</div></div>`;

  return `
    ${gap ? `
    <div class="v2-exec-section">
      <div class="v2-exec-section-title">📊 Demand Gap Analysis by City</div>
      ${gap.summary ? `<div class="v2-prose" style="margin-bottom:16px">${gap.summary}</div>` : ''}
      <div class="v2-table-wrap">
        <table class="v2-table">
          <thead><tr>
            <th>City</th><th>Population</th><th>Existing Supply</th>
            <th>Estimated Demand</th><th>Gap Score</th><th>Verdict</th>
          </tr></thead>
          <tbody>
            ${gap.cities.map(c => {
              const gs = c.gap_score || 0;
              const vColor = gs >= 7 ? 'var(--v2-green)' : gs >= 4 ? 'var(--v2-amber)' : 'var(--v2-red)';
              const vLabel = gs >= 7 ? '🟢 High Opportunity' : gs >= 4 ? '🟡 Moderate' : '🔴 Saturated';
              return `<tr>
                <td><strong>${c.city||c.name||'—'}</strong></td>
                <td>${c.population ? Number(c.population).toLocaleString() : '—'}</td>
                <td>${c.existing_supply || c.competitor_count || '—'}</td>
                <td>${c.estimated_demand || c.demand_units || '—'}</td>
                <td><span style="font-weight:800;color:${vColor}">${gs}/10</span></td>
                <td><span style="font-size:12px;color:${vColor}">${vLabel}</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>` : ''}

    ${sites.length ? `
    <div class="v2-exec-section">
      <div class="v2-exec-section-title">📍 Top Site Rankings</div>
      <div class="v2-site-grid">
        ${sites.map((s,i)=>`
          <div class="v2-site-card">
            <div class="v2-site-rank">#${i+1}</div>
            <div class="v2-site-info">
              <div class="v2-site-name">${s.address||s.location||s.site||s.name||'Site '+(i+1)}</div>
              <div class="v2-site-city">${s.city||s.area||''}</div>
              <div class="v2-site-meta">
                ${s.rent_monthly||s.monthly_rent ? '💰 $'+Number(s.rent_monthly||s.monthly_rent).toLocaleString()+'/mo · ' : ''}
                ${s.sq_ft||s.sqft ? '📐 '+(s.sq_ft||s.sqft).toLocaleString()+' sq ft · ' : ''}
                ${s.score || s.site_score ? '⭐ Score: '+(s.score||s.site_score)+'/10' : ''}
              </div>
              ${s.pros||s.advantages ? `<div class="v2-prose" style="font-size:12px;margin-top:6px">${_truncate(s.pros||s.advantages||'',120)}</div>` : ''}
            </div>
          </div>`).join('')}
      </div>
    </div>` : ''}

    ${realEstate.length ? `
    <div class="v2-exec-section">
      <div class="v2-exec-section-title">🏢 Live Real Estate Listings</div>
      <div class="v2-table-wrap">
        <table class="v2-table">
          <thead><tr><th>Address</th><th>City</th><th>Sq Ft</th><th>Monthly Rent</th><th>Notes</th></tr></thead>
          <tbody>
            ${realEstate.map(p=>`<tr>
              <td>${p.address||p.location||'—'}</td>
              <td>${p.city||'—'}</td>
              <td>${p.sq_ft ? Number(p.sq_ft).toLocaleString() : '—'}</td>
              <td>${p.monthly_rent||p.rent ? '$'+Number(p.monthly_rent||p.rent).toLocaleString() : '—'}</td>
              <td><span class="v2-prose" style="font-size:12px">${_truncate(p.notes||p.description||'',80)}</span></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>` : ''}
  `;
}

// ── COMPETITION ───────────────────────────────────────────────────────────
function v2RenderCompetition() {
  const { comp6, comp13 } = v2GetCompetitorData();

  if (!comp6 && !comp13) return `<div class="v2-empty-panel"><div style="font-size:40px;margin-bottom:12px">🔍</div><div style="font-size:16px;font-weight:700;margin-bottom:8px">No competitive data yet</div><div class="v2-prose">Run Agents 6 and 13 for competitive intelligence.</div></div>`;

  return `
    ${comp6 ? `
    <div class="v2-exec-section">
      <div class="v2-exec-section-title">🗺️ Competitive Landscape by City</div>
      ${comp6.summary ? `<div class="v2-prose" style="margin-bottom:16px">${comp6.summary}</div>` : ''}
      ${comp6.cities.length ? `
      <div class="v2-table-wrap">
        <table class="v2-table">
          <thead><tr><th>City</th><th>Competitors</th><th>Avg Rating</th><th>Density</th></tr></thead>
          <tbody>
            ${comp6.cities.map(c=>`<tr>
              <td><strong>${c.city||c.name||'—'}</strong></td>
              <td>${c.competitor_count||c.total_competitors||'—'}</td>
              <td>${c.avg_rating ? '⭐ '+c.avg_rating : '—'}</td>
              <td>${c.density||c.market_density||'—'}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>` : ''}
    </div>` : ''}

    ${comp13 ? `
    ${comp13.pain_points.length ? `
    <div class="v2-exec-section">
      <div class="v2-exec-section-title">😤 Competitor Pain Points (Your Opportunity)</div>
      <div class="v2-sf-grid">
        ${comp13.pain_points.map((p,i)=>`
          <div class="v2-sf-item" style="border-color:rgba(239,68,68,.2)">
            <div class="v2-sf-num" style="background:rgba(239,68,68,.15);color:var(--v2-red)">${i+1}</div>
            <div class="v2-sf-text">${typeof p==='string'?p:(p.pain||p.issue||p.problem||String(p))}</div>
          </div>`).join('')}
      </div>
    </div>` : ''}

    ${comp13.differentiators.length ? `
    <div class="v2-exec-section">
      <div class="v2-exec-section-title">⭐ Your Competitive Differentiators</div>
      <div class="v2-sf-grid">
        ${comp13.differentiators.map((d,i)=>`
          <div class="v2-sf-item" style="border-color:rgba(34,197,94,.2)">
            <div class="v2-sf-num" style="background:rgba(34,197,94,.15);color:var(--v2-green)">${i+1}</div>
            <div class="v2-sf-text">${typeof d==='string'?d:(d.advantage||d.differentiator||String(d))}</div>
          </div>`).join('')}
      </div>
    </div>` : ''}` : ''}
  `;
}

// ── RISKS ─────────────────────────────────────────────────────────────────
function v2RenderRisks() {
  const risks = v2GetRisks();
  if (!risks.length) return `<div class="v2-empty-panel"><div style="font-size:40px;margin-bottom:12px">⚠️</div><div style="font-size:16px;font-weight:700;margin-bottom:8px">No risk analysis yet</div><div class="v2-prose">Run Agent 8 (Executive Summary) to generate risk matrix.</div></div>`;

  return `
    <div class="v2-risk-grid">
      ${risks.map(r=>`
        <div class="v2-risk-item">
          <div class="v2-risk-header">
            <span class="v2-risk-badge ${(r.severity||'medium').toLowerCase()}">${(r.severity||'MEDIUM').toUpperCase()}</span>
            <span class="v2-risk-title">${r.title}</span>
          </div>
          ${r.desc?`<div class="v2-risk-desc"><strong>Mitigation:</strong> ${r.desc}</div>`:''}
        </div>`).join('')}
    </div>`;
}

// ── ACTION PLAN ───────────────────────────────────────────────────────────
function v2RenderActionPlan() {
  const { steps, phases } = v2GetActionPlan();
  const defaultSteps = [
    { title:'Secure Funding',        desc:'Apply for SBA 7(a) loan and present your investor deck. See Investor Pack above.' },
    { title:'Lock In Your Location', desc:'Contact the top-ranked sites from Agent 3. Use the Market tab to compare.' },
    { title:'File for Permits',      desc:'Begin the licensing process immediately — permits are your critical path.' },
    { title:'Build Your Team',       desc:'Start recruiting key hires. Your project plan has the full hiring roadmap.' },
    { title:'Pre-Launch Marketing',  desc:'Build your waitlist 3–4 months before opening. Use competitor pain points.' },
    { title:'Track Progress',        desc:'Save this analysis and re-run in 60 days to check market conditions.' },
  ];
  const displaySteps = steps.length ? steps : defaultSteps;

  return `
    <div class="v2-exec-section">
      <div class="v2-exec-section-title">${steps.length?'🤖 AI-Generated Next Steps':'✅ Recommended Next Steps'}</div>
      <div class="v2-insights">
        ${displaySteps.map((s,i)=>`
          <div class="v2-insight">
            <div class="v2-sf-num" style="flex-shrink:0;align-self:flex-start">${i+1}</div>
            <div>
              ${typeof s==='string'
                ? `<div class="v2-insight-body">${s}</div>`
                : `<div class="v2-insight-title">${s.title||s.step||s.action||''}</div>
                   <div class="v2-insight-body">${s.desc||s.description||s.detail||''}</div>`}
            </div>
          </div>`).join('')}
      </div>
    </div>

    ${phases.length ? `
    <div class="v2-exec-section" style="margin-top:24px">
      <div class="v2-exec-section-title">🗓 52-Week Execution Timeline</div>
      <div class="v2-timeline">
        ${phases.map((ph,i)=>`
          <div class="v2-timeline-item">
            <div class="v2-timeline-left">
              <div class="v2-timeline-dot ${i===0?'current':''}"></div>
              ${i<phases.length-1?'<div class="v2-timeline-line"></div>':''}
            </div>
            <div class="v2-timeline-content">
              <div class="v2-timeline-phase">${ph.phase||ph.period||'Phase '+(i+1)}</div>
              <div class="v2-timeline-title">${ph.name||ph.title||ph.milestone||'Milestone'}</div>
              ${_toArr(ph.tasks||ph.items||ph.deliverables||[]).length?
                `<div class="v2-timeline-items">${_toArr(ph.tasks||ph.items||ph.deliverables||[]).slice(0,4).map(t=>
                  `<div class="v2-timeline-task">${typeof t==='string'?t:(t.task||t.name||t.item||'')}</div>`
                ).join('')}</div>`:''}
            </div>
          </div>`).join('')}
      </div>
    </div>` : `
    <div class="v2-exec-section" style="margin-top:24px">
      <div class="v2-exec-section-title">🗓 Standard 52-Week Launch Timeline</div>
      <div class="v2-timeline">
        ${[
          {phase:'Weeks 1–4',   name:'Planning & Finance',     tasks:['Finalize business plan','Apply for SBA 7(a) loan','Engage attorney & accountant','Form LLC / corporate entity']},
          {phase:'Weeks 5–12',  name:'Location & Permits',     tasks:['Sign lease on top-ranked site','Submit permit applications','Begin build-out design','Hire contractor']},
          {phase:'Weeks 13–24', name:'Build-Out & Setup',      tasks:['Complete construction & renovation','Install equipment & technology','Recruit core team','Set up POS, software, insurance']},
          {phase:'Weeks 25–36', name:'Pre-Launch & Marketing', tasks:['Staff training program','Build waitlist & social presence','Grand opening event planning','Soft launch']},
          {phase:'Weeks 37–52', name:'Launch & Optimize',      tasks:['Grand opening','Weekly KPI reviews','Customer acquisition campaigns','Scale toward break-even']},
        ].map((ph,i)=>`
          <div class="v2-timeline-item">
            <div class="v2-timeline-left">
              <div class="v2-timeline-dot ${i===0?'current':''}"></div>
              ${i<4?'<div class="v2-timeline-line"></div>':''}
            </div>
            <div class="v2-timeline-content">
              <div class="v2-timeline-phase">${ph.phase}</div>
              <div class="v2-timeline-title">${ph.name}</div>
              <div class="v2-timeline-items">${ph.tasks.map(t=>`<div class="v2-timeline-task">${t}</div>`).join('')}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>`}
  `;
}

// ── GRANTS ────────────────────────────────────────────────────────────────
function v2RenderGrants() {
  const grants = v2GetGrantsDetail();
  const sum = typeof R !== 'undefined' && R.a12?.summary;

  if (!grants.length && !sum) return `<div class="v2-empty-panel"><div style="font-size:40px;margin-bottom:12px">💵</div><div style="font-size:16px;font-weight:700;margin-bottom:8px">No grants data yet</div><div class="v2-prose">Run Agent 12 to search federal, state, and local grant programs.</div></div>`;

  return `
    ${sum ? `<div class="v2-exec-section"><div class="v2-exec-section-title">💵 Grant Overview</div><div class="v2-prose">${sum}</div></div>` : ''}
    ${grants.length ? `
    <div class="v2-exec-section">
      <div class="v2-exec-section-title">📋 Available Grant Programs</div>
      <div class="v2-table-wrap">
        <table class="v2-table">
          <thead><tr><th>Program</th><th>Type</th><th>Estimated Award</th><th>Deadline</th><th>Probability</th><th>Action Required</th></tr></thead>
          <tbody>
            ${grants.map(g=>`<tr>
              <td><strong>${g.name}</strong></td>
              <td><span class="v2-badge blue">${g.type}</span></td>
              <td>${g.amount||'—'}</td>
              <td>${g.deadline||'Rolling'}</td>
              <td>${g.probability ? `<span class="v2-badge ${g.probability.toLowerCase().includes('high')?'green':g.probability.toLowerCase().includes('low')?'red':'amber'}">${g.probability}</span>` : '—'}</td>
              <td><span class="v2-prose" style="font-size:12px">${_truncate(g.eligibility,100)}</span></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>` : ''}
  `;
}

// ── ALL AGENTS ────────────────────────────────────────────────────────────
function v2RenderAgents() {
  return `
    <div class="v2-agents-grid">
      ${V2_AGENTS.map(a => {
        const row     = document.getElementById(`v2-ar-${a.id}`);
        const isDone  = row?.classList.contains('done');
        const isError = row?.classList.contains('error');
        const isRun   = row?.classList.contains('running');
        const st      = isDone ? 'done' : isError ? 'error' : isRun ? 'running' : 'idle';
        const stColor = st==='done' ? 'var(--v2-green)' : st==='error' ? 'var(--v2-red)' : st==='running' ? 'var(--v2-a1)' : 'var(--v2-t3)';
        const stLabel = st==='done' ? '✓ Complete' : st==='error' ? '✗ Error' : st==='running' ? '⟳ Running' : '— Idle';
        const summary = v2GetAgentSummary(a.id);
        const timerEl = document.getElementById(`v2-at-${a.id}`);
        const elapsed = timerEl?.textContent || '';
        return `
          <div class="v2-agent-card ${st}" onclick="v2OpenAgentDetail(${a.id})" title="Click to view ${a.name} output">
            <div class="v2-agent-card-head">
              <span class="v2-agent-card-ico">${a.ico}</span>
              <div style="flex:1">
                <div class="v2-agent-card-name">${a.name}</div>
                <div class="v2-agent-card-num">Agent ${a.id}</div>
              </div>
              <div class="v2-agent-card-status" style="color:${stColor}">
                <span style="display:block;font-size:11px;font-weight:700">${stLabel}</span>
                ${elapsed?`<span style="display:block;font-size:10px;color:var(--v2-t3)">${elapsed}</span>`:''}
              </div>
            </div>
            ${summary?`<div class="v2-agent-card-summary">${summary}</div>`:''}
            ${isDone?`<div class="v2-agent-card-cta">View Output →</div>`:''}
          </div>`;
      }).join('')}
    </div>
    <div style="margin-top:16px;text-align:center">
      <button class="v2-btn ghost sm" onclick="v2GoTo('traditional')">🔬 Open Traditional View — See All Raw Agent Outputs</button>
    </div>`;
}

// ── AGENT DETAIL ──────────────────────────────────────────────────────────
function v2OpenAgentDetail(id) {
  if (typeof openAgentModal === 'function') {
    openAgentModal(id);
  } else {
    v2GoTo('traditional');
  }
}

// ── SAVE RUN ──────────────────────────────────────────────────────────────
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
    score, verdict: verdict.colorClass, label: verdict.label,
    indLabel: ind.label, indEmoji: ind.emoji,
  };
  const idx = V2.portfolio.findIndex(p => p.id === entry.id);
  if (idx >= 0) V2.portfolio[idx] = entry; else V2.portfolio.unshift(entry);
  if (V2.portfolio.length > 20) V2.portfolio = V2.portfolio.slice(0, 20);
  v2SavePortfolio();
  v2Toast('✓ Saved to portfolio');
}
