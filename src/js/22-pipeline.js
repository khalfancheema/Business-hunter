async function runPipeline() {
  if(running) return;
  if(!demoMode && !key()) { showErr('Please enter your Anthropic API key.'); return; }
  hideErr(); running=true; stopRequested=false;
  $('runBtn').disabled=true;
  $('stopBtn').style.display='inline-flex';
  $('resetBtn').style.display='none';
  $('orchStatus').textContent='orchestrating…';
  $('finalBox').className='final-box';

  const fb = k => JSON.stringify(window['getFallback'+k]());
  try {
    setProgress(2,'Pre-flight — Code Review · QA Testing…');
    try { await runAgent14(R); } catch(e) { console.error('Agent 14 failed:',e.message); }
    if(stopRequested){showErr('Pipeline stopped by user.');return;}
    try { await runAgent15(R); } catch(e) { console.error('Agent 15 failed:',e.message); }
    if(stopRequested){showErr('Pipeline stopped by user.');return;}

    setProgress(4,'Phase 1 — Demographics · Compliance · Competitive Intel (parallel)…');
    const [res1,res5,res6]=await Promise.allSettled([runAgent1(),runAgent5(),runAgent6()]);
    const r1=res1.status==='fulfilled'?res1.value:fb(1);
    const r5=res5.status==='fulfilled'?res5.value:fb(5);
    const r6=res6.status==='fulfilled'?res6.value:fb(6);
    if(res1.status==='rejected') console.error('Agent 1 failed:',res1.reason?.message);
    if(res5.status==='rejected') console.error('Agent 5 failed:',res5.reason?.message);
    if(res6.status==='rejected') console.error('Agent 6 failed:',res6.reason?.message);
    if(stopRequested){showErr('Pipeline stopped by user.');return;}

    setProgress(16,'Phase 2 — Gap Analysis…');
    let r2=fb(2);
    try { r2=await runAgent2(r1,r5,r6); } catch(e) { console.error('Agent 2 failed:',e.message); }
    if(stopRequested){showErr('Pipeline stopped by user.');return;}

    setProgress(26,'Phase 3 — Site Selection…');
    let r3=fb(3);
    try { r3=await runAgent3(r1,r2,r5); } catch(e) { console.error('Agent 3 failed:',e.message); }
    if(stopRequested){showErr('Pipeline stopped by user.');return;}

    setProgress(36,'Phase 4 — Real Estate then Financial Model…');
    let r4=fb(4);
    try { r4=await runAgent4(r3,r5); } catch(e) { console.error('Agent 4 failed:',e.message); }
    if(stopRequested){showErr('Pipeline stopped by user.');return;}
    let r7=fb(7);
    try { r7=await runAgent7(r3,r4,r5); } catch(e) { console.error('Agent 7 failed:',e.message); }
    if(stopRequested){showErr('Pipeline stopped by user.');return;}

    setProgress(48,'Phase 5 — Executive Summary…');
    let r8=fb(8);
    try { r8=await runAgent8(r1,r2,r3,r4,r5,r6,r7); } catch(e) { console.error('Agent 8 failed:',e.message); }
    if(stopRequested){showErr('Pipeline stopped by user.');return;}

    setProgress(56,'Phase 6 — Business Plan · SBA Package · Investor Deck…');
    let r9=fb(9);
    try { r9=await runAgent9(r1,r2,r3,r4,r5,r6,r7,r8); } catch(e) { console.error('Agent 9 failed:',e.message); }
    if(stopRequested){showErr('Pipeline stopped by user.');return;}

    setProgress(64,'Phase 7 — Project Execution Plan · Gantt · Risk Register…');
    try { await runAgent10(r3,r4,r5,r7,r9); } catch(e) { console.error('Agent 10 failed:',e.message); }
    if(stopRequested){showErr('Pipeline stopped by user.');return;}

    setProgress(72,'Phase 8 — Market Map · Grants · Competitor Analysis (parallel)…');
    await Promise.allSettled([
      runAgent11(r1,r2,r4),
      runAgent12(r3,r5),
      runAgent13(r6)
    ]);
    if(stopRequested){showErr('Pipeline stopped by user.');return;}

    setProgress(100,'Complete — all 15 agents finished');
    $('orchStatus').textContent='done';
  } catch(e) {
    $('orchStatus').textContent='error';
    showErr('Pipeline error: '+e.message+'\n\nTip: Make sure your API key is correct and has credits.');
    setProgress(0,'Pipeline failed — see error above');
  } finally {
    running=false;
    $('runBtn').disabled=false;
    $('resetBtn').style.display='';
    $('stopBtn').style.display='none';
    $('stopBtn').disabled=false;
    $('stopBtn').textContent='⬛ Stop';
  }
}

async function reRunAgent(n) {
  if(running) return;
  const btn=$('rerun-'+n);
  if(btn) btn.style.display='none';
  running=true;
  try {
    const s = k => JSON.stringify(R['a'+k]||{});
    if(n===1)      { const r=await runAgent1();  R.a1=JSON.parse(r||'{}'); }
    else if(n===2) { await runAgent2(s(1),s(5),s(6)); }
    else if(n===3) { await runAgent3(s(1),s(2),s(5)); }
    else if(n===4) { await runAgent4(s(3),s(5)); }
    else if(n===5) { await runAgent5(); }
    else if(n===6) { await runAgent6(); }
    else if(n===7) { await runAgent7(s(3),s(4),s(5)); }
    else if(n===8) { await runAgent8(s(1),s(2),s(3),s(4),s(5),s(6),s(7)); }
    else if(n===9) { await runAgent9(s(1),s(2),s(3),s(4),s(5),s(6),s(7),s(8)); }
    else if(n===10){ await runAgent10(s(3),s(4),s(5),s(7),s(9)); }
    else if(n===11){ await runAgent11(s(1),s(2),s(4)); }
    else if(n===12){ await runAgent12(s(3),s(5)); }
    else if(n===13){ await runAgent13(s(6)); }
    else if(n===14){ await runAgent14(R); }
    else if(n===15){ await runAgent15(R); }
  } catch(e) {
    console.error('Re-run agent '+n+' failed:',e.message);
  } finally {
    running=false;
  }
}

function exportResults() {
  if(!Object.keys(R).length) { showErr('No results to export yet — run the pipeline first.'); return; }
  const blob = new Blob([JSON.stringify(R, null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `pipeline-results-${zip()}-${Date.now()}.json`;
  a.click();
}

function printReport() {
  if(!Object.keys(R).length) { showErr('No results to print yet — run the pipeline first.'); return; }
  const w = window.open('', '_blank');
  const sections = [];
  if(R.a8) sections.push(`<h2>Executive Summary</h2><p><strong>${R.a8.verdict||''}</strong> — ${R.a8.verdict_rationale||''}</p><p>${R.a8.assessment||''}</p>`);
  if(R.a1) sections.push(`<h2>Demographics</h2><p>${R.a1.summary||''}</p>`);
  if(R.a2) sections.push(`<h2>Gap Analysis</h2><p>${R.a2.summary||''}</p>`);
  if(R.a3) sections.push(`<h2>Top Locations</h2>${(R.a3.locations||[]).slice(0,3).map(l=>`<p><strong>${l.city}</strong> (#${l.rank}, score ${l.overall_score}): ${l.submarket||''}</p>`).join('')}`);
  if(R.a7) sections.push(`<h2>Financial Summary</h2><p>${R.a7.summary||''}</p>`);
  if(R.a9) { const es=(R.a9.executive_summary||{}); sections.push(`<h2>Business Plan</h2><p>${es.concept||''}</p><p>${es.opportunity||''}</p>`); }
  if(R.a8 && R.a8.next_steps) sections.push(`<h2>Next Steps</h2><ol>${(R.a8.next_steps||[]).map(s=>`<li>${s}</li>`).join('')}</ol>`);
  w.document.write(`<!DOCTYPE html><html><head><title>Pipeline Report — ZIP ${zip()}</title><style>body{font-family:sans-serif;max-width:900px;margin:2rem auto;padding:0 1rem;color:#222}h1{border-bottom:2px solid #333;padding-bottom:8px}h2{margin-top:2rem;color:#444;border-bottom:1px solid #ddd;padding-bottom:4px}p{line-height:1.7;margin:8px 0}ol{line-height:1.8}@media print{body{margin:0}}</style></head><body><h1>Business Planning Report — ZIP ${zip()}</h1><p style="color:#888;font-size:13px">Generated ${new Date().toLocaleString()} · ${Object.keys(R).length} agents completed</p>${sections.join('')}</body></html>`);
  w.document.close();
  w.print();
}

function resetAll() {
  ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15'].forEach(id=>{
    const dot=$('dot-'+id), card=$('card-'+id), out=$('out-'+id);
    if(dot) dot.className='agent-dot';
    if(card) card.className='agent-card';
    if(out) out.className='agent-out';
  });
  // Clear rendered HTML in all output panels
  const clearIds=['1-s-t','1-h-c','1-t-c','2-s-t','2-h-c','2-r-c','3-s-t','3-r-c','3-t-c',
    '4-s-t','4-l-c','4-t-c','5-s-t','5-t-c','6-s-t','6-t-c','7-s-t','7-sc-c','7-t-c',
    '8-s-t','9-ov-c','9-mkt-c','9-fin-c','9-ops-c','9-sba-c','9-inv-c',
    '10-gantt-c','10-mile-c','10-budget-c','10-risk-c','10-team-c','10-check-c',
    '11-map-c','11-leg-c','11-dir-c','12-sum-t','12-caps-c','12-usda-c','12-local-c','12-tbl-c',
    '13-sum-t','13-comp-c','13-pain-c','13-diff-c','13-msg-c',
    '14-sum-t','14-issues-c','14-perf-c','14-cost-c','14-fixes-c',
    '15-sum-t','15-tests-c','15-data-c','15-ux-c','15-score-c'];
  clearIds.forEach(id=>{const el=$(id);if(el)el.innerHTML='';});
  Object.keys(charts).forEach(k=>{try{charts[k].destroy()}catch{}});
  charts={};
  $('finalBox').className='final-box';
  $('progressFill').style.width='0%';
  $('progressText').textContent='Enter your API key and click Run';
  $('orchStatus').textContent='idle';
  $('resetBtn').style.display='none';
  hideErr(); R={};
}

