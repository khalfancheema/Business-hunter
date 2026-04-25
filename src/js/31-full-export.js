// ══════════════════════════════════════════════════════════
// 31-full-export.js — Full Pipeline PDF / Print Report
// Opens a new window with all 17 agents in a print-ready
// paginated HTML document. Charts are captured as PNG images.
// ══════════════════════════════════════════════════════════

const _FULL_EXPORT_LABELS = {
  1:  'Demographics',
  2:  'Gap Analysis',
  3:  'Site Selection',
  4:  'Real Estate Search',
  5:  'Compliance & Regulatory',
  6:  'Competitive Intelligence',
  7:  'Financial Feasibility',
  8:  'Executive Summary',
  9:  'Business Plan',
  10: 'Project Plan',
  11: 'Market Map & Opportunities',
  12: 'Grants & Funding',
  13: 'Competitive Strategy',
  14: 'Code Review',
  15: 'QA & Testing',
  16: 'Build vs Buy Analysis',
  17: 'Sources & Citations',
};

function fullPipelineExport() {
  if (!Object.keys(R).length) {
    showErr('No results to export yet — run the pipeline first.');
    return;
  }

  // Capture all chart canvases as base64 images BEFORE opening new window
  const chartImgs = {};
  document.querySelectorAll('canvas').forEach(c => {
    try { chartImgs[c.id] = c.toDataURL('image/png'); } catch(e) {}
  });

  const w = window.open('', '_blank');
  if (!w) { showErr('Pop-up blocked — please allow pop-ups for this page and try again.'); return; }

  const ind   = industry();
  const zipV  = zip();
  const now   = new Date().toLocaleString();
  const p     = R.userProfile || {};
  const agentCount = Object.keys(R).filter(k => k.startsWith('a') && !isNaN(k.slice(1))).length;

  // ── Cover page ────────────────────────────────────────────
  const coverHtml = `
  <div class="fp-cover pba">
    <div class="fp-cover-logo">Business Planning Agent System · 17-Agent AI Pipeline</div>
    <div class="fp-cover-icon">${ind.emoji || '🏢'}</div>
    <h1 class="fp-cover-title">${ind.label}</h1>
    <div class="fp-cover-sub">Business Feasibility &amp; Planning Report</div>
    <div class="fp-cover-zip">ZIP Code Area: <strong>${zipV}</strong></div>
    ${p.name  ? `<div class="fp-cover-biz">${p.name}</div>` : ''}
    ${p.owner ? `<div class="fp-cover-owner">Prepared for: ${p.owner}</div>` : ''}
    ${p.location ? `<div class="fp-cover-detail">Location: ${p.location}</div>` : ''}
    ${p.opening  ? `<div class="fp-cover-detail">Target Opening: ${new Date(p.opening+'-01').toLocaleDateString('en-US',{month:'long',year:'numeric'})}</div>` : ''}
    <div class="fp-cover-meta">
      <span>Generated: ${now}</span>
      <span>${agentCount} of 17 agents completed</span>
    </div>
  </div>`;

  // ── Table of contents ─────────────────────────────────────
  const tocRows = Object.entries(_FULL_EXPORT_LABELS)
    .map(([n, label]) => {
      const hasData = !!R['a' + n];
      return `<tr class="${hasData?'toc-done':'toc-skip'}">
        <td class="toc-n">${n}</td>
        <td>${label}</td>
        <td class="toc-s">${hasData ? '✓' : '—'}</td>
      </tr>`;
    }).join('');

  const tocHtml = `
  <div class="fp-toc pba">
    <h2>Table of Contents</h2>
    <table class="toc-tbl">
      <thead><tr><th>#</th><th>Section</th><th>Status</th></tr></thead>
      <tbody>${tocRows}</tbody>
    </table>
  </div>`;

  // ── Agent sections ────────────────────────────────────────
  // Executive summary goes first after TOC
  const agentOrder = [8, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  const sections = [];

  agentOrder.forEach(n => {
    const outEl = $('out-' + n);
    if (!outEl || !outEl.innerHTML.trim()) return;

    // Swap canvas elements → captured PNG images
    let content = outEl.innerHTML;
    content = content.replace(/<canvas([^>]*)id="([^"]*)"([^>]*)><\/canvas>/g, (match, pre, cid, post) => {
      if (chartImgs[cid]) {
        return `<img src="${chartImgs[cid]}" class="fp-chart-img" alt="Chart ${cid}" />`;
      }
      return `<div class="fp-chart-missing">Chart not available (re-run agent to regenerate)</div>`;
    });

    // Strip export dropdown menus and drill-down overlays from content
    content = content.replace(/<div class="export-dropdown[^"]*"[^>]*>[\s\S]*?<\/div>/g, '');

    const label = _FULL_EXPORT_LABELS[n] || ('Agent ' + n);
    sections.push(`
  <div class="fp-section pba">
    <h2 class="fp-section-h"><span class="fp-num">${n}</span> ${label}</h2>
    <div class="fp-agent-body">${content}</div>
  </div>`);
  });

  // ── Print styles ──────────────────────────────────────────
  const printCSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --ink:#1a1a2e; --ink2:#444; --muted:#777; --faint:#aaa;
    --blue:#2563eb; --green:#16a34a; --red:#dc2626; --amber:#d97706;
    --bg:#fff; --surface:#f8f9fa; --border:#e0e3e8;
  }
  body{font-family:'Segoe UI',Arial,sans-serif;background:var(--bg);color:var(--ink);font-size:12px;line-height:1.65;padding:0}
  h1,h2,h3,h4{font-family:'Segoe UI Semibold',Arial,sans-serif;color:var(--ink)}
  a{color:var(--blue);word-break:break-all}

  /* Print layout */
  @page{size:A4;margin:18mm 16mm}
  @media print{
    .no-print{display:none!important}
    .pba{page-break-after:always}
    body{font-size:11px}
    .fp-cover{min-height:auto;padding:60px 40px}
  }

  /* Cover */
  .fp-cover{min-height:92vh;display:flex;flex-direction:column;align-items:center;justify-content:center;
    background:linear-gradient(150deg,#0f172a 0%,#1e3a5f 100%);color:#fff;border-radius:16px;
    padding:80px 48px;text-align:center;margin:24px 0 32px}
  .fp-cover-logo{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#94a3b8;margin-bottom:28px}
  .fp-cover-icon{font-size:56px;margin-bottom:16px}
  .fp-cover-title{font-size:38px;font-weight:700;color:#60a5fa;margin:0 0 8px}
  .fp-cover-sub{font-size:16px;color:#cbd5e1;margin-bottom:24px}
  .fp-cover-zip{font-size:15px;color:#94a3b8}
  .fp-cover-biz{font-size:22px;font-weight:600;color:#4ade80;margin-top:20px}
  .fp-cover-owner{font-size:13px;color:#94a3b8;margin-top:6px}
  .fp-cover-detail{font-size:12px;color:#94a3b8;margin-top:4px}
  .fp-cover-meta{display:flex;gap:32px;justify-content:center;margin-top:36px;font-size:11px;color:#64748b}

  /* TOC */
  .fp-toc{padding:32px 0}
  .fp-toc h2{font-size:20px;margin-bottom:16px;padding-bottom:8px;border-bottom:2px solid var(--border)}
  .toc-tbl{width:100%;border-collapse:collapse}
  .toc-tbl th{text-align:left;padding:7px 10px;border-bottom:2px solid var(--border);font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}
  .toc-tbl td{padding:7px 10px;border-bottom:1px solid var(--border)}
  .toc-n{font-weight:700;color:var(--blue);width:36px}
  .toc-s{width:56px}
  .toc-done .toc-s{color:var(--green)}
  .toc-skip{color:var(--faint)}

  /* Section */
  .fp-section{padding:28px 0}
  .fp-section-h{font-size:20px;font-weight:700;display:flex;align-items:center;gap:12px;
    border-bottom:2px solid var(--border);padding-bottom:10px;margin-bottom:18px;color:var(--ink)}
  .fp-num{width:30px;height:30px;background:var(--blue);color:#fff;border-radius:50%;
    display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0}
  .fp-agent-body{color:var(--ink2)}
  .fp-chart-img{max-width:100%;height:auto;border-radius:6px;margin:8px 0;border:1px solid var(--border)}
  .fp-chart-missing{background:var(--surface);border:1px dashed var(--border);border-radius:6px;
    padding:10px 14px;font-size:11px;color:var(--muted);margin:8px 0;font-style:italic}

  /* Tables inside agent bodies */
  .fp-agent-body table{width:100%;border-collapse:collapse;font-size:11px;margin:10px 0}
  .fp-agent-body th{background:var(--surface);padding:5px 8px;text-align:left;border-bottom:2px solid var(--border);font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}
  .fp-agent-body td{padding:5px 8px;border-bottom:1px solid var(--border)}
  .fp-agent-body tr:hover td{background:#f5f7fa}

  /* Cards / panels reset for print */
  .fp-agent-body .agent-out,.fp-agent-body .agent-card{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:10px}
  .fp-agent-body .tabs{display:none}
  .fp-agent-body .panel,.fp-agent-body .panel.active{display:block!important}
  .fp-agent-body .raw-data-wrap{display:none}
  .fp-agent-body .rerun-btn,.fp-agent-body .raw-toggle,.fp-agent-body .export-menu-wrap{display:none}

  /* Badges */
  .fp-agent-body .badge,.fp-agent-body .b-green{background:#dcfce7;color:#166534;border-radius:4px;padding:1px 5px;font-size:10px;font-weight:600}
  .fp-agent-body .b-red{background:#fee2e2;color:#991b1b;border-radius:4px;padding:1px 5px;font-size:10px;font-weight:600}
  .fp-agent-body .b-amber{background:#fef3c7;color:#92400e;border-radius:4px;padding:1px 5px;font-size:10px;font-weight:600}
  .fp-agent-body .b-blue{background:#dbeafe;color:#1e40af;border-radius:4px;padding:1px 5px;font-size:10px;font-weight:600}

  /* Prose */
  .fp-agent-body .prose{white-space:pre-wrap;font-size:12px;line-height:1.75;color:var(--ink2)}

  /* Print action bar */
  .fp-bar{position:sticky;top:0;background:#fff;border-bottom:1px solid var(--border);
    padding:10px 24px;display:flex;gap:10px;align-items:center;z-index:100;box-shadow:0 1px 6px rgba(0,0,0,.06)}
  .fp-bar button{padding:8px 18px;border:none;border-radius:6px;cursor:pointer;font-size:13px;font-weight:600;font-family:inherit}
  .fp-btn-print{background:#2563eb;color:#fff}
  .fp-btn-print:hover{background:#1d4ed8}
  .fp-btn-close{background:#f1f5f9;color:#334155}
  .fp-bar-title{margin-left:12px;font-size:13px;color:var(--muted)}

  /* Page wrap */
  .fp-page{max-width:900px;margin:0 auto;padding:0 24px 40px}
  `;

  const fullDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Business Plan — ${ind.label} — ZIP ${zipV}</title>
  <style>${printCSS}</style>
</head>
<body>
  <div class="fp-bar no-print">
    <button class="fp-btn-print" onclick="window.print()">🖨 Print / Save as PDF</button>
    <button class="fp-btn-close" onclick="window.close()">✕ Close</button>
    <span class="fp-bar-title">${ind.label} · ZIP ${zipV} · ${agentCount} agents · ${now}</span>
  </div>
  <div class="fp-page">
    ${coverHtml}
    ${tocHtml}
    ${sections.join('\n')}
  </div>
</body>
</html>`;

  w.document.write(fullDoc);
  w.document.close();
}
