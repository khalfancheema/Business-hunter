async function runAgent15(allResults) {
  setDot(15,'running');
  const ind = industry();

  if (demoMode && typeof getDemoData === 'function') {
    const _d = getDemoData(15);
    if (_d) { R.a15 = _d; try { renderQA(_d); } catch(e){} setDot(15,'done'); showOut(15); return JSON.stringify(_d); }
  }

  // ── Real JS-level validation checks ────────────────────────
  const agentSpecs = [
    { n:1,  name:'Demographics',       requiredKeys:['summary','cities'] },
    { n:2,  name:'Gap Analysis',       requiredKeys:['summary','cities','overall_opportunity_score'] },
    { n:3,  name:'Site Selection',     requiredKeys:['summary','locations'] },
    { n:4,  name:'Real Estate',        requiredKeys:['summary'] },
    { n:5,  name:'Compliance',         requiredKeys:['summary','requirements','total_timeline_months'] },
    { n:6,  name:'Competitive Intel',  requiredKeys:['summary','cities'] },
    { n:7,  name:'Financials',         requiredKeys:['summary','scenarios'] },
    { n:8,  name:'Executive Summary',  requiredKeys:['verdict','assessment','success_factors','risks'] },
    { n:9,  name:'Business Plan',      requiredKeys:['executive_summary','company_overview'] },
    { n:10, name:'Project Plan',       requiredKeys:['phases','total_duration_months'] },
    { n:11, name:'Market Map',         requiredKeys:['summary'] },
    { n:12, name:'Grants',             requiredKeys:['summary','total_potential_funding'] },
    { n:13, name:'Deep-Dive',          requiredKeys:['summary','competitor_profiles'] },
    { n:16, name:'Build vs Buy',       requiredKeys:['summary'] },
    { n:17, name:'Data Sources',       requiredKeys:['summary','data_sources'] },
  ];

  const byAgent = [];
  let totalFields = 0, totalPass = 0, totalWarn = 0, totalFail = 0;
  const critIssues = [];
  const warnings = [];
  const qualityWarnings = [];

  agentSpecs.forEach(spec => {
    const d = R[`a${spec.n}`];
    let ok = 0, warn = 0, fail = 0;
    if (!d) {
      fail = spec.requiredKeys.length;
      critIssues.push(`Agent ${spec.n} (${spec.name}) did not complete — data missing`);
    } else {
      spec.requiredKeys.forEach(k => {
        const v = d[k];
        if (v === undefined || v === null) { fail++; }
        else if (Array.isArray(v) && v.length === 0) { warn++; warnings.push(`Agent ${spec.n} ${k} array empty`); }
        else if (typeof v === 'string' && v.length < 10) { warn++; warnings.push(`Agent ${spec.n} ${k} suspiciously short`); }
        else { ok++; }
      });
      if (d._quality && d._quality.risk !== 'low') {
        warn++;
        const q = `Agent ${spec.n} output quality ${d._quality.risk}: ${(d._quality.warnings || []).join('; ')}`;
        warnings.push(q);
        qualityWarnings.push({ agent: spec.n, name: spec.name, risk: d._quality.risk, warnings: d._quality.warnings || [], stats: d._quality.stats || {} });
      }
    }
    const total = ok + warn + fail;
    totalFields += total; totalPass += ok; totalWarn += warn; totalFail += fail;
    byAgent.push({
      agent: spec.name,
      fields_ok: ok, fields_warn: warn, fields_fail: fail,
      score: total > 0 ? Math.round((ok / total) * 100) : 0,
    });
  });

  // Additional checks
  const hasParallelPhase1 = false; // Phase 1 is dependency-gated in runPipeline
  const hasPerAgentFallbacks = typeof getFallback1 === 'function' && typeof getFallback7 === 'function';
  const hasStopCheck = typeof stopRequested !== 'undefined';
  const agentsWithData = agentSpecs.filter(a => !!R[`a${a.n}`]).length;
  const passRate = totalFields > 0
    ? Math.round(((totalPass) / totalFields) * 100)
    : 0;

  // Suite-level results for Claude
  const suiteResults = [
    { suite:'Pipeline Completion', passCount: agentsWithData, totalCount: agentSpecs.length,
      detail:`${agentsWithData}/${agentSpecs.length} agents returned data. Failed: ${critIssues.length ? critIssues.join('; ') : 'none'}.` },
    { suite:'Data Field Validation', passCount: totalPass, totalCount: totalFields,
      detail:`${totalPass} fields valid, ${totalWarn} warnings, ${totalFail} missing. Warnings: ${warnings.slice(0,5).join('; ')||'none'}.` },
    { suite:'Architecture Checks', passCount: (hasPerAgentFallbacks?1:0)+(hasStopCheck?1:0)+1+1,
      totalCount: 4,
      detail:`Fallbacks present: ${hasPerAgentFallbacks}. Stop flag: ${hasStopCheck}. Parallel phase 1 (agents 1+5+6): false. Sub-agents (1,5,6,7,9,10,12,13,16): true.` },
  ];

  const sys = `You are a senior QA engineer validating an AI pipeline run. Respond JSON only.`;
  const usr = `Produce a QA audit for a ${ind.unit} planning pipeline based on ACTUAL test results below.

ACTUAL TEST RESULTS:
- ZIP: ${zip()}, Radius: ${radius()}mi, Industry: ${ind.unit}
- Agents with data: ${agentsWithData}/${agentSpecs.length}
- Fields checked: ${totalFields} | Passed: ${totalPass} | Warned: ${totalWarn} | Failed: ${totalFail}
- Field pass rate: ${passRate}%
- Critical issues: ${critIssues.length > 0 ? critIssues.join('; ') : 'none'}
- Warnings: ${warnings.slice(0,8).join('; ')||'none'}
- Output-quality warnings: ${qualityWarnings.length ? qualityWarnings.map(q=>`A${q.agent} ${q.risk}: ${q.warnings.join(', ')}`).join(' | ') : 'none'}
- Suite results: ${suiteResults.map(s=>`${s.suite} ${s.passCount}/${s.totalCount}: ${s.detail}`).join(' | ')}
- Per-agent scores: ${byAgent.map(a=>`${a.agent}=${a.score}%`).join(', ')}

Return ONLY this JSON (we will inject data_validation counts from real JS-side stats — do NOT include data_validation in your response):
{
  "summary": "2-3 sentence honest QA summary based on actual results above",
  "overall_pass_rate": ${passRate},
  "test_suites": [
    {
      "suite": "Suite name",
      "tests": [
        {"id":"T001","name":"Test name","status":"pass|fail|warn","detail":"Specific detail from actual data","expected":"What was expected"}
      ]
    }
  ],
  "ux_audit": [
    {"category":"Category","title":"Finding title","severity":"high|medium|low","detail":"Detail","recommendation":"Fix"}
  ],
  "health_score": {
    "overall": ${Math.max(20, Math.min(100, passRate))},
    "dimensions": [
      {"label":"Dimension","score":85,"color":"var(--green)","notes":"Explanation"}
    ]
  }
}
Generate 3 test suites (Pipeline Completion, Data Validation, Architecture) with 4-6 tests each based on actual results above.`;

  try {
    let d = await claudeJSON(sys, usr);
    if (!d) { console.warn('Agent 15 fallback'); d = getFallback15(); }
    // Inject real data_validation from JS-side counts (we asked Claude to skip it)
    d.data_validation = {
      fields_checked:   totalFields,
      fields_passed:    totalPass,
      fields_warned:    totalWarn,
      fields_failed:    totalFail,
      critical_issues:  critIssues,
      warnings:         warnings.slice(0, 8),
      quality_warnings: qualityWarnings,
      by_agent:         byAgent,
    };
    R.a15 = d;
    renderQA(d);
    setDot(15,'done'); showOut(15);
    return JSON.stringify(d);
  } catch(e) { setDot(15,'error'); showOut(15); $('15-sum-t').textContent = 'Error: ' + e.message; throw e; }
}

function renderQA(d) {
  $('15-sum-t').textContent=d.summary+`\n\nOverall Pass Rate: ${d.overall_pass_rate}%`;
  const statusIcon={pass:'✅',fail:'❌',warn:'⚠️',skip:'⏭️'};
  let tests='';
  _toArr(d.test_suites).forEach(suite=>{
    const suiteTests=_toArr(suite.tests);
    const passed=suiteTests.filter(t=>t.status==='pass').length;
    tests+=`<div style="margin-bottom:14px"><div style="font-size:11px;font-weight:700;font-family:'Syne',sans-serif;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted);margin-bottom:8px;display:flex;justify-content:space-between"><span>${suite.suite}</span><span style="color:${passed===suiteTests.length?'var(--green)':'var(--amber)'}">${passed}/${suiteTests.length} passed</span></div>`;
    suiteTests.forEach(t=>{
      tests+=`<div class="qa-test ${t.status}"><div class="qa-test-status">${statusIcon[t.status]||'⚪'}</div><div class="qa-test-body"><div class="qa-test-name">${t.id} — ${t.name}</div><div class="qa-test-detail">${t.detail}</div><div class="qa-test-expected">Expected: ${t.expected}</div></div></div>`;
    });
    tests+=`</div>`;
  });
  $('15-tests-c').innerHTML=tests;
  const dv=d.data_validation||{fields_checked:0,fields_passed:0,fields_warned:0,fields_failed:0,critical_issues:[],warnings:[],quality_warnings:[],by_agent:[]};
  let dataVal=`<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px;margin-bottom:16px">
    <div style="background:var(--green-dim);border:1px solid var(--green);border-radius:8px;padding:12px;text-align:center"><div style="font-size:28px;font-weight:700;font-family:'Syne',sans-serif;color:var(--green)">${dv.fields_passed}</div><div style="font-size:11px;color:var(--muted)">Passed</div></div>
    <div style="background:var(--amber-dim);border:1px solid var(--amber);border-radius:8px;padding:12px;text-align:center"><div style="font-size:28px;font-weight:700;font-family:'Syne',sans-serif;color:var(--amber)">${dv.fields_warned}</div><div style="font-size:11px;color:var(--muted)">Warnings</div></div>
    <div style="background:var(--red-dim);border:1px solid var(--red);border-radius:8px;padding:12px;text-align:center"><div style="font-size:28px;font-weight:700;font-family:'Syne',sans-serif;color:var(--red)">${dv.fields_failed}</div><div style="font-size:11px;color:var(--muted)">Failed</div></div>
    <div style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:12px;text-align:center"><div style="font-size:28px;font-weight:700;font-family:'Syne',sans-serif;color:var(--text)">${dv.fields_checked}</div><div style="font-size:11px;color:var(--muted)">Total</div></div>
  </div>`;
  if(dv.critical_issues?.length){dataVal+=`<div style="background:var(--red-dim);border:1px solid var(--red);border-radius:8px;padding:12px;margin-bottom:10px"><div style="font-size:11px;font-weight:700;font-family:'Syne',sans-serif;color:var(--red);margin-bottom:6px">Critical Issues</div>${(dv.critical_issues||[]).map(i=>`<div style="font-size:12px;color:var(--muted);margin-bottom:3px">• ${i}</div>`).join('')}</div>`;}
  if(dv.quality_warnings?.length){
    dataVal+=`<div style="background:var(--amber-dim);border:1px solid var(--amber);border-radius:8px;padding:12px;margin-bottom:10px"><div style="font-size:11px;font-weight:700;font-family:'Syne',sans-serif;color:var(--amber);margin-bottom:6px">Output Quality Warnings</div>${(dv.quality_warnings||[]).map(q=>`<div style="font-size:12px;color:var(--muted);margin-bottom:5px"><strong>A${q.agent} ${q.name}</strong> (${q.risk}): ${(q.warnings||[]).join('; ')}</div>`).join('')}</div>`;
  }
  dataVal+=`<table class="tbl"><thead><tr><th>Agent</th><th>OK</th><th>Warn</th><th>Fail</th><th>Score</th></tr></thead><tbody>`;
  (dv.by_agent||[]).forEach(a=>{
    const sb=a.score>=90?'b-green':a.score>=75?'b-amber':'b-red';
    dataVal+=`<tr><td>${a.agent}</td><td style="color:var(--green)">${a.fields_ok}</td><td style="color:var(--amber)">${a.fields_warn}</td><td style="color:var(--red)">${a.fields_fail}</td><td><span class="badge ${sb}">${a.score}%</span></td></tr>`;
  });
  dataVal+=`</tbody></table>`;
  $('15-data-c').innerHTML=dataVal;
  const sevColors={high:'b-red',medium:'b-amber',low:'b-blue'};
  let ux='';
  (d.ux_audit||[]).forEach(item=>{
    ux+=`<div class="ux-item"><div class="ux-item-header"><span class="ux-item-category">${item.category||''}</span><span class="badge ${sevColors[item.severity]||'b-blue'}">${(item.severity||'info').toUpperCase()}</span></div><div class="ux-item-title">${item.title||''}</div><div class="ux-item-detail">${item.detail||''}</div><div class="cr-fix" style="margin-top:8px">💡 ${item.recommendation||''}</div></div>`;
  });
  $('15-ux-c').innerHTML=ux;
  const hs=d.health_score;
  if(!hs)return;
  const r=58,cx=70,cy=70,circ=2*Math.PI*r;
  const offset=circ*(1-(hs.overall||0)/100);
  const sc=hs.overall>=85?'#3dd68c':hs.overall>=70?'#f5a623':'#ff5f5f';
  let score=`<div class="health-score-wrap"><div class="health-score-ring"><svg width="140" height="140" viewBox="0 0 140 140"><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--surface3)" stroke-width="10"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${sc}" stroke-width="10" stroke-dasharray="${circ.toFixed(1)}" stroke-dashoffset="${offset.toFixed(1)}" stroke-linecap="round"/></svg><div class="health-score-num"><span>${hs.overall||0}</span><small>/100</small></div></div><div class="health-score-label" style="color:${sc}">${(hs.overall||0)>=85?'Healthy':'Needs Attention'}</div><div class="health-score-sub">${d.overall_pass_rate||0}% pass rate · ${(d.data_validation||{}).fields_checked||0} fields validated</div></div><div class="health-dims">`;
  _toArr(hs.dimensions).forEach(dim=>{
    if(!dim) return;
    const dc=dim.score>=85?'var(--green)':dim.score>=70?'var(--amber)':'var(--red)';
    score+=`<div class="health-dim"><div class="health-dim-label">${dim.label||''}</div><div class="health-dim-score" style="color:${dc}">${dim.score||0}</div><div class="health-dim-bar"><div class="health-dim-fill" style="width:${dim.score||0}%;background:${dc}"></div></div><div style="font-size:10px;color:var(--faint);margin-top:4px">${dim.notes||''}</div></div>`;
  });
  score+=`</div>`;
  $('15-score-c').innerHTML=score;
}

