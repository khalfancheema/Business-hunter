// ── V2 COPILOT ────────────────────────────────────────────────────────────
const V2_COPILOT_MSGS = {
  1:  'Researching demographics, income, and population data for your target area…',
  2:  'Analyzing supply vs demand gap. How many similar businesses already exist?',
  3:  'Scoring the top site locations by foot traffic, demographics, and rent…',
  4:  'Pulling live real estate listings from LoopNet, Crexi, and BizBuySell…',
  5:  'Checking licensing requirements, zoning, and permit timelines…',
  6:  'Mapping the competitive landscape — who are you up against?',
  7:  'Building your financial model: 3 scenarios, P&L projections, and break-even…',
  8:  'Writing your executive summary and Go/No-Go verdict…',
  9:  'Drafting the full SBA 7(a) business plan and investor deck…',
  10: 'Creating your 18-month project plan with Gantt chart and risk register…',
  11: 'Generating interactive market map with gap scores and competitor pins…',
  12: 'Searching federal, state, and local grants for this industry…',
  13: 'Deep-diving competitor reviews and pain points to build your advantage…',
  14: 'Running code review across the pipeline output for accuracy…',
  15: 'Running QA validation and pipeline health check…',
  16: 'Analyzing build vs buy options for your market…',
  17: 'Auditing all data sources and citations for integrity…',
};

const V2_DONE_MSGS = [
  'Analysis complete. Your Business Viability Score is ready.',
  'All 17 agents finished. Here\'s what the AI found.',
  'Research done. Time to make your decision.',
];

function v2InitCopilotSidebar() {
  const list = document.getElementById('v2-agent-list');
  if (!list) return;
  list.innerHTML = V2_AGENTS.map(a => `
    <div class="v2-agent-row" id="v2-ar-${a.id}">
      <div class="v2-agent-status" id="v2-as-${a.id}"></div>
      <span class="v2-agent-name">${a.ico} ${a.name}</span>
      <span class="v2-agent-time" id="v2-at-${a.id}"></span>
    </div>
  `).join('');
}

function v2ChatMsg(role, html) {
  const msgs = document.getElementById('v2-chat-msgs');
  if (!msgs) return;
  const isAi = role === 'ai';
  const div = document.createElement('div');
  div.className = `v2-msg ${role}`;
  div.innerHTML = `
    <div class="v2-msg-avatar">${isAi ? '🤖' : '👤'}</div>
    <div class="v2-msg-bubble">${html}</div>
  `;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

// Hook into v1 setDot() to drive v2 copilot UI
const _v1SetDot = typeof setDot !== 'undefined' ? setDot : null;
// We override after v1 loads via the v2 init
function v2HookPipeline() {
  // Patch setDot to also update v2 sidebar
  const origSetDot = window.setDot;
  window.setDot = function(n, state) {
    if (typeof origSetDot === 'function') origSetDot(n, state);
    v2UpdateAgentRow(n, state);
  };

  // Patch setProgress to update v2 progress bar
  const origSetProgress = window.setProgress;
  window.setProgress = function(p, t) {
    if (typeof origSetProgress === 'function') origSetProgress(p, t);
    const fill = document.getElementById('v2-progress-fill');
    const lbl  = document.getElementById('v2-progress-label');
    if (fill) fill.style.width = p + '%';
    if (lbl)  lbl.textContent = t || '';
  };

  // Patch showOut to intercept agent completion
  const origShowOut = window.showOut;
  window.showOut = function(id) {
    if (typeof origShowOut === 'function') origShowOut(id);
    v2OnAgentComplete(id);
  };
}

function v2UpdateAgentRow(n, state) {
  const row = document.getElementById(`v2-ar-${n}`);
  const dot = document.getElementById(`v2-as-${n}`);
  const time = document.getElementById(`v2-at-${n}`);
  if (!row) return;
  row.className = `v2-agent-row ${state}`;
  if (dot) {
    dot.className = `v2-agent-status ${state}`;
  }
  if (state === 'running') {
    const msg = V2_COPILOT_MSGS[n];
    if (msg) v2ChatMsg('ai', `<strong>Agent ${n}:</strong> ${msg}`);
  }
}

function v2OnAgentComplete(id) {
  const time = document.getElementById(`v2-at-${id}`);
  const timerEl = document.getElementById(`timer-${id}`);
  if (time && timerEl) time.textContent = timerEl.textContent;

  // Check if all agents done
  const allDone = V2_AGENTS.every(a => {
    const row = document.getElementById(`v2-ar-${a.id}`);
    return row && (row.classList.contains('done') || row.classList.contains('error'));
  });
  if (allDone) v2PipelineComplete();
}

function v2PipelineComplete() {
  const msg = V2_DONE_MSGS[Math.floor(Math.random() * V2_DONE_MSGS.length)];
  const score = v2CalcScore();
  const verdict = v2ScoreVerdict(score);
  v2ChatMsg('ai', `
    ✅ <strong>${msg}</strong><br><br>
    <span style="font-size:18px;font-weight:800;color:${verdict.color}">${score}/100</span>
    <span class="v2-badge ${verdict.badge}" style="margin-left:8px">${verdict.label}</span><br><br>
    ${verdict.summary}<br><br>
    <button class="v2-btn primary sm" onclick="v2GoToDashboard()" style="margin-top:8px">View Dashboard →</button>
  `);

  // Auto-navigate after 2s
  setTimeout(() => v2GoToDashboard(), 2500);
}

function v2GoToDashboard() {
  // Capture current run
  V2.run = {
    id: Date.now(),
    ts: new Date().toISOString(),
    industry: V2.wizard.data.industry || document.getElementById('industrySelect')?.value || 'daycare',
    zip: document.getElementById('zip')?.value || '30097',
    budget: document.getElementById('budget')?.value || '600000',
    capacity: document.getElementById('capacity')?.value || '75',
    radius: document.getElementById('radius')?.value || '40',
    score: v2CalcScore(),
    R: typeof R !== 'undefined' ? JSON.parse(JSON.stringify(R)) : {},
  };
  v2GoTo('dashboard');
  v2RenderDashboard(V2.run);
}

// Called on DOMContentLoaded after all JS loaded
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(v2HookPipeline, 100);
});
