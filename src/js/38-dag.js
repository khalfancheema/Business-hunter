// ══════════════════════════════════════════════════════════
// 38-dag.js — Agent Dependency Graph
//
// Renders a live SVG DAG showing which agents feed which.
// Nodes are colored by runtime status (idle/running/done/error).
// Updates automatically as the pipeline runs.
// ══════════════════════════════════════════════════════════

// Agent node definitions
const DAG_NODES = [
  { id:1,  label:'Demographics',  phase:1, col:0, row:0 },
  { id:5,  label:'Compliance',    phase:1, col:1, row:0 },
  { id:6,  label:'Competitive',   phase:1, col:2, row:0 },
  { id:2,  label:'Gap Analysis',  phase:2, col:1, row:1 },
  { id:3,  label:'Site Select',   phase:3, col:1, row:2 },
  { id:4,  label:'Real Estate',   phase:4, col:1, row:3 },
  { id:7,  label:'Financials',    phase:5, col:1, row:4 },
  { id:8,  label:'Executive',     phase:6, col:1, row:5 },
  { id:9,  label:'Biz Plan',      phase:7, col:0, row:6 },
  { id:10, label:'Project Plan',  phase:8, col:1, row:6 },
  { id:11, label:'Market Map',    phase:9, col:0, row:7 },
  { id:12, label:'Grants',        phase:9, col:1, row:7 },
  { id:13, label:'Competitor+',   phase:9, col:2, row:7 },
  { id:16, label:'Build vs Buy',  phase:9, col:3, row:7 },
  { id:14, label:'Code Review',   phase:11, col:0, row:8 },
  { id:15, label:'QA Testing',    phase:11, col:2, row:8 },
  { id:17, label:'Sources',       phase:12, col:1, row:9 },
];

// Dependency edges: [from, to]
const DAG_EDGES = [
  [1,2],[5,2],[6,2],
  [1,3],[2,3],[5,3],
  [3,4],[5,4],
  [3,7],[4,7],[5,7],
  [1,8],[2,8],[3,8],[4,8],[5,8],[6,8],[7,8],
  [3,9],[7,9],[8,9],
  [3,10],[4,10],[5,10],[7,10],[9,10],
  [1,11],[2,11],[4,11],
  [3,12],[5,12],
  [6,13],
  [3,16],[4,16],[7,16],[8,16],
  [1,14],[2,14],[3,14],[4,14],[5,14],[6,14],[7,14],[8,14],[9,14],[10,14],[11,14],[12,14],[13,14],[16,14],
  [1,15],[2,15],[3,15],[4,15],[5,15],[6,15],[7,15],[8,15],[9,15],[10,15],[11,15],[12,15],[13,15],[16,15],
  [1,17],[2,17],[3,17],[4,17],[5,17],[6,17],[7,17],[8,17],[9,17],[10,17],[11,17],[12,17],[13,17],[14,17],[15,17],[16,17],
];

function _dagNodeStatus(id) {
  const dot = $('dot-' + id);
  if (!dot) return 'idle';
  if (dot.classList.contains('running')) return 'running';
  if (dot.classList.contains('done'))    return 'done';
  if (dot.classList.contains('error'))   return 'error';
  return 'idle';
}

function _dagNodeColor(status) {
  return {
    idle:    { fill:'#1e2026', stroke:'#363a44', text:'#4a4d56' },
    running: { fill:'#1a3a5c', stroke:'#4a9eff', text:'#4a9eff' },
    done:    { fill:'#0f3d28', stroke:'#3dd68c', text:'#3dd68c' },
    error:   { fill:'#3d1a1a', stroke:'#ff5f5f', text:'#ff5f5f' },
  }[status] || { fill:'#1e2026', stroke:'#363a44', text:'#4a4d56' };
}

function renderDag() {
  const container = $('dagContainer');
  if (!container) return;

  const NW = 90, NH = 28, HGAP = 16, VGAP = 20;
  const COLS = 4, ROWS = 10;
  const W = COLS * (NW + HGAP) + 40;
  const H = ROWS * (NH + VGAP) + 40;

  // Position nodes on grid
  const pos = {};
  DAG_NODES.forEach(n => {
    pos[n.id] = {
      x: 20 + n.col * (NW + HGAP),
      y: 20 + n.row * (NH + VGAP),
    };
  });

  // Build edges SVG
  let edgeSvg = '';
  DAG_EDGES.forEach(([from, to]) => {
    const f = pos[from], t = pos[to];
    if (!f || !t) return;
    const fx = f.x + NW / 2, fy = f.y + NH;
    const tx = t.x + NW / 2, ty = t.y;
    const mid = (fy + ty) / 2;
    const toStatus = _dagNodeStatus(to);
    const fromStatus = _dagNodeStatus(from);
    const active = fromStatus === 'done' || fromStatus === 'running';
    const color = active ? (toStatus === 'done' ? '#3dd68c44' : '#4a9eff33') : '#363a4466';
    edgeSvg += `<path d="M${fx},${fy} C${fx},${mid} ${tx},${mid} ${tx},${ty}" fill="none" stroke="${color}" stroke-width="1.5"/>`;
  });

  // Build nodes SVG
  let nodeSvg = '';
  DAG_NODES.forEach(n => {
    const { x, y } = pos[n.id];
    const status = _dagNodeStatus(n.id);
    const c = _dagNodeColor(status);
    const pulse = status === 'running' ? `<animate attributeName="stroke-opacity" values="1;0.4;1" dur="1.2s" repeatCount="indefinite"/>` : '';
    nodeSvg += `
    <g class="dag-node" onclick="reRunAgent(${n.id})" style="cursor:pointer" title="Agent ${n.id}: ${n.label}">
      <rect x="${x}" y="${y}" width="${NW}" height="${NH}" rx="5" fill="${c.fill}" stroke="${c.stroke}" stroke-width="1.5">${pulse}</rect>
      <text x="${x + NW/2}" y="${y + 10}" text-anchor="middle" fill="${c.text}" font-size="9" font-family="Syne,sans-serif" font-weight="700">${n.id}. ${n.label}</text>
      <text x="${x + NW/2}" y="${y + 20}" text-anchor="middle" fill="${c.text}" font-size="8" font-family="Instrument Sans,sans-serif" opacity="0.7">Ph${n.phase} · ${status}</text>
    </g>`;
  });

  container.innerHTML = `
  <svg width="100%" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="max-width:${W}px">
    <defs>
      <marker id="dag-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M0,0 L0,6 L6,3 z" fill="#4a4d56"/>
      </marker>
    </defs>
    ${edgeSvg}
    ${nodeSvg}
  </svg>`;
}

// Auto-refresh DAG while pipeline is running
let _dagInterval = null;
function startDagRefresh() {
  if (_dagInterval) return;
  _dagInterval = setInterval(() => {
    const dagEl = $('dagContainer');
    if (dagEl && dagEl.closest('.agent-out.show, #dagPanel')) renderDag();
  }, 800);
}
function stopDagRefresh() {
  if (_dagInterval) { clearInterval(_dagInterval); _dagInterval = null; }
}

function toggleDagPanel() {
  const panel = $('dagPanel');
  const btn   = $('dagPanelBtn');
  if (!panel) return;
  const isOpen = panel.style.display !== 'none';
  panel.style.display = isOpen ? 'none' : 'block';
  if (btn) btn.textContent = isOpen ? '🔗 Pipeline Graph' : '🔗 Pipeline Graph ▲';
  if (!isOpen) { renderDag(); startDagRefresh(); }
  else stopDagRefresh();
}

// Hook into pipeline start/stop to auto-refresh DAG
document.addEventListener('DOMContentLoaded', () => {
  const _origRP = window.runPipeline;
  if (_origRP) {
    window.runPipeline = async function() {
      startDagRefresh();
      try { return await _origRP.apply(this, arguments); }
      finally { setTimeout(stopDagRefresh, 3000); }
    };
  }
});
