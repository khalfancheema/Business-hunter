function setDot(n,state){
  const dot=$('dot-'+n);
  const timerEl=$('timer-'+n);
  if(dot){dot.className='agent-dot '+state;}
  const card=$('card-'+n);
  if(card){card.className='agent-card '+state;}
  const rerunBtn=$('rerun-'+n);
  if(rerunBtn){rerunBtn.style.display=(state==='done'||state==='error')?'inline-flex':'none';}
  if(state==='running'){
    dotTimers[n]=Date.now();
    if(dotIntervals[n]) clearInterval(dotIntervals[n]);
    dotIntervals[n]=setInterval(()=>{
      if(timerEl){const s=((Date.now()-dotTimers[n])/1000).toFixed(0);timerEl.textContent=s+'s';}
    },1000);
  } else {
    if(dotIntervals[n]){clearInterval(dotIntervals[n]);delete dotIntervals[n];}
    if(timerEl&&dotTimers[n]){
      const elapsed=((Date.now()-dotTimers[n])/1000).toFixed(1);
      timerEl.textContent=(state==='done'?'✓ ':'✗ ')+elapsed+'s';
    }
  }
}
function showOut(id){const el=$('out-'+id);if(el)el.className='agent-out show'}
function setProgress(p,t){const f=$('progressFill');if(f)f.style.width=p+'%';const x=$('progressText');if(x)x.textContent=t}
function showErr(m){const e=$('errorBanner');if(!e)return;e.textContent=m;e.className='error-banner show'}
function hideErr(){const e=$('errorBanner');if(e)e.className='error-banner'}

function tab(aid, tid) {
  const out=$('out-'+aid);
  out.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  out.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  const btn=out.querySelector(`[onclick="tab('${aid}','${tid}')"]`);
  const pnl=$(aid+'-'+tid);
  if(btn) btn.classList.add('active');
  if(pnl) pnl.classList.add('active');
}

function parseJSON(text) {
  if (!text) return null;
  // 1. Try ```json fenced block
  const fenced = text.match(/```json\s*([\s\S]*?)```/);
  if (fenced) { try { return JSON.parse(fenced[1].trim()); } catch {} }
  // 2. Try any ``` fenced block
  const anyFenced = text.match(/```\s*([\s\S]*?)```/);
  if (anyFenced) { try { return JSON.parse(anyFenced[1].trim()); } catch {} }
  // 3. Try raw text directly
  try { return JSON.parse(text.trim()); } catch {}
  // 4. Extract largest { } block (handles prose before/after JSON from web search)
  const braceStart = text.indexOf('{');
  const braceEnd = text.lastIndexOf('}');
  if (braceStart !== -1 && braceEnd > braceStart) {
    try { return JSON.parse(text.slice(braceStart, braceEnd + 1)); } catch {}
  }
  // 5. Strip common Claude preamble phrases then retry
  const stripped = text.replace(/^[\s\S]*?(Here is|Here's|Based on|The following)[^\{]{0,120}/i,'').trim();
  const s2 = stripped.indexOf('{'), s3 = stripped.lastIndexOf('}');
  if (s2 !== -1 && s3 > s2) { try { return JSON.parse(stripped.slice(s2, s3+1)); } catch {} }
  return null;
}

function killChart(id){if(charts[id]){try{charts[id].destroy()}catch(e){}delete charts[id]}}

let _demoCJKey = null;
function _setDemoKey(k) { _demoCJKey = k; }

function _bhWalkJSON(value, visit, path='') {
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    value.forEach((v, i) => _bhWalkJSON(v, visit, `${path}[${i}]`));
    return;
  }
  visit(value, path);
  Object.keys(value).forEach(k => _bhWalkJSON(value[k], visit, path ? `${path}.${k}` : k));
}

function _bhAssessOutputQuality(data, opts={}) {
  const stats = {
    numeric_fields: 0,
    source_fields: 0,
    url_fields: 0,
    fake_url_fields: 0,
    fake_phone_fields: 0,
    placeholder_strings: 0,
    empty_source_fields: 0,
    arrays_with_source: 0,
    arrays_without_source: 0,
  };
  const warnings = [];
  const isSourceKey = k => /(^|_)(source|sources|citation|citations|data_sources|data_sources_used|reasoning_sources|website|url|apply_url)$/i.test(k);
  const isUrlKey = k => /url|website|portal/i.test(k);
  const isPhoneKey = k => /phone|tel/i.test(k);

  _bhWalkJSON(data, (obj, path) => {
    const keys = Object.keys(obj);
    const hasSource = keys.some(k => isSourceKey(k) && obj[k]);
    const numericCount = keys.filter(k => typeof obj[k] === 'number' && Number.isFinite(obj[k])).length;
    if (numericCount) stats.numeric_fields += numericCount;
    keys.forEach(k => {
      const v = obj[k];
      if (isSourceKey(k)) {
        stats.source_fields++;
        if (v === null || v === '' || v === 'N/A' || v === 'Information not available') stats.empty_source_fields++;
      }
      if (typeof v === 'string') {
        if (/^(unknown|tbd|to be determined|sample|placeholder)$/i.test(v.trim())) stats.placeholder_strings++;
        if (isUrlKey(k)) {
          stats.url_fields++;
          if (/example\.com|localhost|fake|placeholder|your-?url|maps\.google\.com\/\?q=\.\.\./i.test(v)) stats.fake_url_fields++;
        }
        if (isPhoneKey(k) && /555-?0|000-?000|123-?456|xxx/i.test(v)) stats.fake_phone_fields++;
      }
    });
    if (path && /\[\d+\]$/.test(path)) {
      if (hasSource) stats.arrays_with_source++;
      else if (numericCount >= 2) stats.arrays_without_source++;
    }
  });

  if (stats.numeric_fields >= 8 && stats.source_fields < 2) warnings.push('Numeric-heavy output has too few source/citation fields.');
  if (stats.arrays_without_source >= 3) warnings.push('Several numeric array rows do not carry row-level sources.');
  if (stats.empty_source_fields) warnings.push(`${stats.empty_source_fields} source field(s) are empty or unavailable.`);
  if (stats.fake_url_fields) warnings.push(`${stats.fake_url_fields} URL field(s) look placeholder/fake.`);
  if (stats.fake_phone_fields) warnings.push(`${stats.fake_phone_fields} phone field(s) look placeholder/fake.`);
  if (stats.placeholder_strings >= 3) warnings.push('Multiple placeholder strings remain in the output.');

  return {
    checked_at: new Date().toISOString(),
    web_search: !!opts.webSearch,
    risk: warnings.length >= 3 ? 'high' : warnings.length ? 'medium' : 'low',
    warnings,
    stats,
  };
}

function _bhAttachOutputQuality(data, opts={}) {
  if (!data || typeof data !== 'object') return data;
  const quality = _bhAssessOutputQuality(data, opts);
  try {
    Object.defineProperty(data, '_quality', { value: quality, enumerable: false, configurable: true });
  } catch {
    data._quality = quality;
  }
  if (quality.risk !== 'low') {
    console.warn('[OutputQuality]', quality.risk, quality.warnings.join(' | '), quality.stats);
  }
  return _bhAttachSchemaValidation(data, opts);
}

const _BH_AGENT_REQUIRED_KEYS = {
  1:['summary','cities'],
  2:['summary','cities','overall_opportunity_score'],
  3:['summary','locations'],
  4:['summary'],
  5:['summary','requirements','total_timeline_months'],
  6:['summary','cities'],
  7:['summary','scenarios'],
  8:['verdict','assessment','success_factors','risks'],
  9:['executive_summary','company_overview'],
  10:['phases','total_duration_months'],
  11:['summary'],
  12:['summary','total_potential_funding'],
  13:['summary','competitor_profiles'],
  14:['summary'],
  15:['summary','overall_pass_rate'],
  16:['summary'],
  17:['summary','data_sources'],
};

const _BH_AGENT_ARRAY_KEYS = {
  1:['cities'],
  2:['cities'],
  3:['locations'],
  5:['requirements'],
  6:['cities'],
  7:['scenarios'],
  8:['success_factors','risks'],
  10:['phases'],
  13:['competitor_profiles'],
  17:['data_sources'],
};

const _BH_PRODUCTION_ACCURACY_TARGET = 95;
const _BH_REVIEW_ACCURACY_FLOOR = 85;

function _bhHasNearbySource(obj) {
  if (!obj || typeof obj !== 'object') return false;
  return Object.keys(obj).some(k => /source|citation|url|retrieved|verified/i.test(k) && obj[k]);
}

function _bhFieldEvidence(obj, fieldKey, path) {
  if (!obj || typeof obj !== 'object') return {};
  const maps = obj.sources_by_field || obj.evidence_by_field || obj.citations_by_field || null;
  const fieldMap = maps && typeof maps === 'object'
    ? (maps[fieldKey] || maps[path] || maps[String(fieldKey || '').toLowerCase()] || null)
    : null;
  if (fieldMap && typeof fieldMap === 'object') {
    return {
      source: fieldMap.source || fieldMap.source_name || fieldMap.citation || fieldMap.agency_name || null,
      source_url: fieldMap.source_url || fieldMap.url || fieldMap.link || fieldMap.citation_url || null,
      retrieved_at: fieldMap.retrieved_at || fieldMap.checked_at || fieldMap.last_updated || fieldMap.as_of || null,
      source_field: fieldMap.source_field || fieldMap.table || fieldMap.dataset_field || fieldMap.verification_method || null,
      confidence: fieldMap.confidence ?? fieldMap.reliability ?? null,
      verification_method: fieldMap.verification_method || 'field_map',
      evidence_scope: 'field',
    };
  }
  return {
    source: obj.source || obj.source_name || obj.citation || obj.agency_name || null,
    source_url: obj.source_url || obj.url || obj.link || obj.citation_url || null,
    retrieved_at: obj.retrieved_at || obj.checked_at || obj.last_updated || obj.as_of || null,
    source_field: obj.source_field || obj.table || obj.dataset_field || obj.verification_method || null,
    confidence: obj.confidence ?? obj.reliability ?? null,
    verification_method: obj.verification_method || null,
    evidence_scope: 'row',
  };
}

function _bhHasFieldEvidence(obj, fieldKey, path) {
  const ev = _bhFieldEvidence(obj, fieldKey, path);
  return !!(ev.source && (ev.source_url || ev.source_field || ev.retrieved_at || ev.verification_method));
}

function _bhClaimCriticality(field) {
  const f = String(field || '');
  if (/revenue|rent|capital|funding|loan|amount|tuition|price|fee|cost|capacity|slots|beds|count|competitor|timeline|weeks|months/i.test(f)) return 'high';
  if (/income|wage|salary|rate|pct|percent|score|sqft|population|employees/i.test(f)) return 'medium';
  return 'low';
}

function _bhRequiredEvidenceFields() {
  return {
    A3: [/overall_score/i, /est_monthly_rent_range|rent/i, /competitors_within_2mi|competitor/i, /timeline_months/i],
    A4: [/monthly_rent/i, /sqft/i, /source|url/i],
    A5: [/cost_usd|fee/i, /timeline_weeks|timeline/i, /agency_name|source/i],
    A6: [/total_licensed_estimated|competitor|count/i, /source/i],
    A10:[/cost|budget|weeks|months|timeline/i],
    A12:[/amount|funding|deadline|eligibility|url/i],
    A16:[/asking_price|monthly_rent|revenue|timeline|cost/i],
    A17:[/source|url|data_used/i],
  };
}

function _bhAgentRequiredFieldCoverage(ledger, agent) {
  const rules = _bhRequiredEvidenceFields()[agent] || [];
  return rules.map(rule => {
    const rows = (ledger || []).filter(r => r.agent === agent && r.type !== 'verifier_check' && rule.test(String(r.field || '')));
    const validRows = rows.filter(r => r.source_validated !== false && r.source_supports_claim !== false && r.source);
    return { agent, rule: String(rule), rows: rows.length, valid_rows: validRows.length, covered: validRows.length > 0 };
  });
}

function _bhCollectCitationIssues(data, agentNum) {
  const issues = [];
  const visit = (node, path, parent) => {
    if (node == null) return;
    if (Array.isArray(node)) {
      node.slice(0, 25).forEach((v, i) => visit(v, `${path}[${i}]`, node));
      return;
    }
    if (typeof node !== 'object') return;
    Object.entries(node).forEach(([k, v]) => {
      const here = path ? `${path}.${k}` : k;
      if (typeof v === 'number' && isFinite(v) && Math.abs(v) > 0) {
        const critical = /cost|price|rate|tuition|revenue|income|rent|count|capacity|score|pct|percent|weeks|months|fee|amount|salary|wage|rating|sqft|slots|beds|employees|population/i.test(k);
        if (critical && !_bhHasFieldEvidence(node, k, here)) {
          issues.push(`Numeric claim ${here} lacks field-level source evidence.`);
        }
      }
      if (typeof v === 'string' && /https?:\/\/(example\.com|localhost|test\.com)|555[-.\s]?01/i.test(v)) {
        issues.push(`Placeholder or fake contact/URL detected at ${here}.`);
      }
      visit(v, here, node);
    });
  };
  visit(data, `A${agentNum}`, null);
  return [...new Set(issues)].slice(0, 12);
}

function _bhSourceQuality(row) {
  const url = row && (row.source_url || row.url);
  const source = String((row && row.source) || '');
  let host = '';
  let validUrl = false;
  try {
    if (url) {
      if (/^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(String(url)) && !/^https?:\/\//i.test(String(url))) {
        return {
          valid_url: false,
          host: '',
          source_tier: 'unclassified',
          is_authoritative: false,
          is_estimated: /estimate|proxy|derived|model|ai|unknown|n\/a/i.test(source + ' ' + (row?.verification_method || '')),
        };
      }
      const base = (typeof window !== 'undefined' && window.location && window.location.href) ? window.location.href : 'https://example.invalid';
      const u = new URL(url, base);
      validUrl = ['http:', 'https:'].includes(u.protocol) && !/example\.com|localhost|test\.com/i.test(u.hostname);
      host = u.hostname.replace(/^www\./, '');
    }
  } catch {}
  const authoritative = /\.(gov|edu)$/i.test(host) || /census|bls|hud|sba|fema|epa|usda|cms|fred|bea|hrsa|noaa|nces|cdc|eia|dol/i.test(source + ' ' + host);
  const marketplace = /loopnet|crexi|bizbuysell|google|yelp|winnie|care\.com|facebook/i.test(source + ' ' + host);
  const estimated = /estimate|proxy|derived|model|ai|unknown|n\/a/i.test(source + ' ' + (row?.verification_method || ''));
  return {
    valid_url: validUrl || !url ? true : false,
    host,
    source_tier: authoritative ? 'authoritative' : marketplace ? 'marketplace' : estimated ? 'estimated' : 'unclassified',
    is_authoritative: authoritative,
    is_estimated: estimated,
  };
}

function _bhValidateEvidenceSource(row) {
  const q = _bhSourceQuality(row);
  const f = _bhSourceFreshness(row);
  const source = String(row?.source || '');
  const field = String(row?.field || '');
  const url = row?.source_url || row?.url || '';
  const needsUrl = !row?.source_field && !row?.verification_method;
  const issues = [];
  if (!source || /unknown|n\/a|not available|ai|model/i.test(source)) issues.push('missing_or_model_source');
  if (url && !q.valid_url) issues.push('invalid_url');
  if (needsUrl && !url) issues.push('missing_url_or_source_field');
  if (q.source_tier === 'unclassified' && /rent|tuition|revenue|cost|wage|count|score|capacity|fee|amount/i.test(field)) issues.push('unclassified_critical_source');
  if (f.stale) issues.push('stale_source');
  const valueText = row?.value ?? row?.ai_value ?? row?.verified_value ?? '';
  const supportText = String(row?.source_excerpt || row?.source_title || row?.source_field || row?.verification_method || row?.source || '');
  const supportsClaim = valueText === '' || valueText == null || String(valueText).length > 20
    ? !!supportText
    : supportText.includes(String(valueText)) || !!row?.source_field || /verified_exact_or_rate|field_map/i.test(String(row?.verification_method || ''));
  if (!supportsClaim) issues.push('source_does_not_support_claim_value');
  return {
    ...q,
    ...f,
    source_validation_method: 'deterministic_host_field_freshness_policy',
    source_validated: issues.length === 0,
    source_supports_claim: supportsClaim,
    claim_criticality: _bhClaimCriticality(field),
    source_validation_issues: issues,
  };
}

async function _bhValidateEvidenceUrls(limit=40) {
  const ledger = _bhBuildEvidenceLedger();
  const targets = ledger.filter(r => r.source_url && r.valid_url !== false).slice(0, limit);
  const results = [];
  for (const row of targets) {
    const out = { url: row.source_url, agent: row.agent, field: row.field, ok:false };
    try {
      const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timer = ctrl ? setTimeout(() => ctrl.abort(), 7000) : null;
      let res = await fetch(row.source_url, { method:'HEAD', signal: ctrl?.signal });
      if (!res.ok || res.status === 405) res = await fetch(row.source_url, { method:'GET', signal: ctrl?.signal });
      if (timer) clearTimeout(timer);
      out.status = res.status;
      out.final_url = res.url || row.source_url;
      out.content_type = res.headers?.get ? res.headers.get('content-type') : null;
      out.ok = res.ok;
      row.url_reachable = res.ok;
      row.url_status = res.status;
      row.final_url = out.final_url;
      row.content_type = out.content_type;
      if (!res.ok) row.source_validated = false;
    } catch(e) {
      out.error = e.message;
      row.url_reachable = false;
      row.source_validated = false;
    }
    results.push(out);
  }
  R.evidence_url_checks = results;
  return results;
}

function _bhSourceFreshness(row) {
  const s = String(row?.retrieved_at || row?.last_updated || '');
  const years = [...s.matchAll(/\b(20\d{2})\b/g)].map(m => Number(m[1]));
  const year = years.length ? Math.max(...years) : null;
  const current = new Date().getFullYear();
  return { year, stale: year ? (current - year > 3) : false, missing: !s };
}

function _bhExtractClaimLedger(data, agentNum) {
  const rows = [];
  const visit = (node, path, parent) => {
    if (node == null) return;
    if (Array.isArray(node)) return node.slice(0, 40).forEach((v, i) => visit(v, `${path}[${i}]`, node));
    if (typeof node !== 'object') return;
    Object.entries(node).forEach(([k, v]) => {
      const here = path ? `${path}.${k}` : k;
      const critical = /cost|price|rate|tuition|revenue|income|rent|count|capacity|score|pct|percent|weeks|months|fee|amount|salary|wage|rating|sqft|slots|beds|employees|population/i.test(k);
      if (typeof v === 'number' && isFinite(v) && Math.abs(v) > 0 && critical) {
        const ev = _bhHasFieldEvidence(node, k, here) ? _bhFieldEvidence(node, k, here) : {};
        const row = {
          type: 'agent_claim',
          agent: 'A' + Number(agentNum),
          field: here,
          value: v,
          source: ev.source || null,
          source_url: ev.source_url || null,
          retrieved_at: ev.retrieved_at || null,
          source_field: ev.source_field || null,
          confidence: ev.confidence ?? null,
          verification_method: ev.verification_method || (ev.source ? 'declared_source' : 'missing'),
          evidence_scope: ev.evidence_scope || 'missing',
        };
        Object.assign(row, _bhValidateEvidenceSource(row));
        rows.push(row);
      }
      visit(v, here, node);
    });
  };
  visit(data, `A${agentNum}`, null);
  return rows.slice(0, 120);
}

function _bhValidateAgentSchema(agentNum, data) {
  const issues = [];
  const n = Number(agentNum);
  if (!n || !data || typeof data !== 'object') {
    return { ok: false, issues: ['Output is missing or is not a JSON object.'] };
  }
  (_BH_AGENT_REQUIRED_KEYS[n] || []).forEach(k => {
    const v = data[k];
    if (v === undefined || v === null || v === '') issues.push(`Missing required field: ${k}`);
    if (Array.isArray(v) && v.length === 0) issues.push(`Empty required array: ${k}`);
  });
  (_BH_AGENT_ARRAY_KEYS[n] || []).forEach(k => {
    if (data[k] !== undefined && !Array.isArray(data[k])) issues.push(`Field must be an array: ${k}`);
  });
  _bhCollectCitationIssues(data, n).forEach(i => issues.push(i));
  if (data._is_fallback) issues.push('Fallback output was used; this is not production-grade evidence.');
  return { ok: issues.length === 0, issues: [...new Set(issues)], checked_at: new Date().toISOString() };
}

function _bhAttachSchemaValidation(data, opts={}) {
  if (!data || typeof data !== 'object' || !opts.agentNum) return data;
  const schema = _bhValidateAgentSchema(opts.agentNum, data);
  const claims = _bhExtractClaimLedger(data, opts.agentNum);
  try {
    Object.defineProperty(data, '_schema', { value: schema, enumerable: false, configurable: true });
    Object.defineProperty(data, '_claim_ledger', { value: claims, enumerable: false, configurable: true });
  } catch {
    data._schema = schema;
    data._claim_ledger = claims;
  }
  if (!schema.ok) console.warn('[AgentSchema]', `A${opts.agentNum}`, schema.issues.join(' | '));
  return data;
}

function _bhFeedbackStoreKey() {
  let ind = 'business';
  try { ind = industryKey ? industryKey() : ind; } catch {}
  return 'bh_agent_learning_v1:' + ind;
}

function _bhLoadPersistentLearning() {
  try {
    const raw = localStorage.getItem(_bhFeedbackStoreKey());
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.slice(0, 30) : [];
  } catch { return []; }
}

function _bhSavePersistentLearning(items) {
  try {
    localStorage.setItem(_bhFeedbackStoreKey(), JSON.stringify((items || []).slice(0, 30)));
  } catch {}
}

function _bhAgentData(agentNum) {
  try { return R && R['a' + agentNum]; } catch { return null; }
}

function _bhCollectAgentFeedback(agentNum, data) {
  const issues = [];
  const actions = [];
  const schema = _bhValidateAgentSchema(agentNum, data);
  if (data && typeof data === 'object') {
    try {
      Object.defineProperty(data, '_schema', { value: schema, enumerable: false, configurable: true });
    } catch {
      data._schema = schema;
    }
  }
  if (!schema.ok) {
    schema.issues.forEach(i => issues.push(i));
    actions.push(`Re-run Agent ${agentNum} with its required JSON schema before trusting downstream recommendations.`);
  }
  const required = _BH_AGENT_REQUIRED_KEYS[agentNum] || [];
  required.forEach(k => {
    const v = data && data[k];
    if (v === undefined || v === null || v === '') {
      issues.push(`Missing required field: ${k}`);
      actions.push(`Downstream agents must treat Agent ${agentNum}.${k} as unavailable unless verified from real data.`);
    } else if (Array.isArray(v) && v.length === 0) {
      issues.push(`Empty required array: ${k}`);
      actions.push(`Do not infer values for Agent ${agentNum}.${k}; request/source specific rows before using it.`);
    }
  });
  const q = data && data._quality;
  if (q && q.risk !== 'low') {
    (q.warnings || []).forEach(w => issues.push(w));
    actions.push(`When using Agent ${agentNum} output, preserve sourced values and replace weak/placeholder claims with null/N/A.`);
  }
  if (data && typeof data === 'object') {
    const sourceish = JSON.stringify(data).match(/source|citation|data_sources|url/gi);
    const numberish = JSON.stringify(data).match(/[-]?\d+(\.\d+)?/g);
    if ((numberish || []).length >= 12 && (sourceish || []).length < 3) {
      issues.push('Output contains many numeric claims but sparse source markers.');
      actions.push(`Require source labels for numeric claims copied from Agent ${agentNum}.`);
    }
  }
  return { issues: [...new Set(issues)], actions: [...new Set(actions)] };
}

function _bhRecordAgentFeedback(agentNum, data) {
  if (!agentNum || !data || typeof data !== 'object') return null;
  if (!R.agent_feedback) R.agent_feedback = { items: [], by_agent: {}, persistent_lessons: _bhLoadPersistentLearning() };
  const fb = _bhCollectAgentFeedback(agentNum, data);
  const item = {
    agent: Number(agentNum),
    checked_at: new Date().toISOString(),
    status: fb.issues.length ? 'needs_attention' : 'ok',
    issues: fb.issues,
    actions: fb.actions,
    quality: data._quality || null,
  };
  R.agent_feedback.by_agent[String(agentNum)] = item;
  R.agent_feedback.items = Object.values(R.agent_feedback.by_agent).sort((a,b) => a.agent - b.agent);
  if (fb.issues.length) {
    const lessons = _bhLoadPersistentLearning();
    const lesson = {
      agent: Number(agentNum),
      industry: (typeof industryKey === 'function' ? industryKey() : 'business'),
      lesson: fb.actions[0] || fb.issues[0],
      issue: fb.issues[0],
      seen_at: item.checked_at,
    };
    const deduped = [lesson, ...lessons.filter(l => !(l.agent === lesson.agent && l.issue === lesson.issue))];
    _bhSavePersistentLearning(deduped);
    R.agent_feedback.persistent_lessons = deduped.slice(0, 30);
  }
  return item;
}

function _bhRecordAccuracyFeedback(checks) {
  if (!Array.isArray(checks) || !checks.length) return [];
  if (!R.agent_feedback) R.agent_feedback = { items: [], by_agent: {}, persistent_lessons: _bhLoadPersistentLearning() };
  const poor = checks.filter(c => {
    const m = (c.agent || '').match(/^A(\d+)/);
    return m && c.acc != null && !isNaN(c.acc) && c.acc < (_BH_PRODUCTION_ACCURACY_TARGET / 100);
  });
  if (!poor.length) return [];
  const byAgent = {};
  poor.forEach(c => {
    const agent = parseInt((c.agent || '').replace(/^A/i, ''), 10);
    if (!agent) return;
    if (!byAgent[agent]) byAgent[agent] = [];
    byAgent[agent].push(c);
  });
  const lessons = _bhLoadPersistentLearning();
  const created = [];
  Object.entries(byAgent).forEach(([agent, rows]) => {
    const n = Number(agent);
    const issues = rows.slice(0, 5).map(c =>
      `Accuracy check below target for ${c.field}: AI=${c.aiFmt || c.ai}, verified=${c.realFmt || c.real}, match=${Math.round(c.acc * 100)}% (${c.source || 'source unknown'}).`
    );
    const actions = rows.slice(0, 5).map(c =>
      `For Agent ${n} ${c.field}, use the verified ${c.source || 'source'} value when available; otherwise return null/N/A instead of estimating.`
    );
    const existing = R.agent_feedback.by_agent[String(n)] || {
      agent: n,
      checked_at: new Date().toISOString(),
      status: 'ok',
      issues: [],
      actions: [],
      quality: null,
    };
    const item = {
      ...existing,
      checked_at: new Date().toISOString(),
      status: 'needs_attention',
      issues: [...new Set([...(existing.issues || []), ...issues])],
      actions: [...new Set([...(existing.actions || []), ...actions])],
      accuracy_checks: rows.map(c => ({
        field: c.field,
        ai: c.ai,
        real: c.real,
        aiFmt: c.aiFmt,
        realFmt: c.realFmt,
        match_pct: Math.round(c.acc * 100),
        source: c.source,
        match_type: c.match_type,
      })),
    };
    R.agent_feedback.by_agent[String(n)] = item;
    created.push(item);
    rows.slice(0, 3).forEach(c => {
      const issue = `A${n} ${c.field} accuracy ${Math.round(c.acc * 100)}% vs ${c.source || 'verified source'}`;
      lessons.unshift({
        agent: n,
        industry: (typeof industryKey === 'function' ? industryKey() : 'business'),
        lesson: `Use verified ${c.source || 'source'} data for ${c.field}; do not estimate when the value is missing.`,
        issue,
        seen_at: item.checked_at,
      });
    });
  });
  const deduped = [];
  const seen = new Set();
  lessons.forEach(l => {
    const key = `${l.agent}|${l.issue}`;
    if (seen.has(key)) return;
    seen.add(key);
    deduped.push(l);
  });
  _bhSavePersistentLearning(deduped);
  R.agent_feedback.items = Object.values(R.agent_feedback.by_agent).sort((a,b) => a.agent - b.agent);
  R.agent_feedback.persistent_lessons = deduped.slice(0, 30);
  return created;
}

function _bhRecordAllAgentFeedback() {
  for (let i = 1; i <= 17; i++) {
    const d = _bhAgentData(i);
    if (d && typeof d === 'object') _bhRecordAgentFeedback(i, d);
  }
}

function _bhFirstNumber() {
  for (const v of arguments) {
    const n = Number(v);
    if (isFinite(n)) return n;
  }
  return null;
}

function _bhClampScore(n) {
  n = Number(n);
  if (!isFinite(n)) return null;
  return Math.max(0, Math.min(100, n));
}

function _bhComputeProductionScorecard() {
  if (typeof R !== 'object' || !R) return null;
  const location = Array.isArray(R.a3?.locations) ? R.a3.locations[0] : null;
  const scenario = Array.isArray(R.a7?.scenarios) ? (R.a7.scenarios.find(s => /base/i.test(s.name || s.label || '')) || R.a7.scenarios[0]) : null;
  const riskRows = Array.isArray(R.a8?.risks) ? R.a8.risks : [];
  const key = typeof industryKey === 'function' ? industryKey() : 'business';
  const profiles = {
    daycare: { market_demand:0.26, competition:0.16, compliance:0.20, real_estate:0.12, capital:0.18, execution_risk:0.08, min_go:78 },
    gas_station: { market_demand:0.18, competition:0.18, compliance:0.18, real_estate:0.20, capital:0.18, execution_risk:0.08, min_go:78 },
    laundromat: { market_demand:0.22, competition:0.16, compliance:0.10, real_estate:0.18, capital:0.24, execution_risk:0.10, min_go:74 },
    car_wash: { market_demand:0.20, competition:0.16, compliance:0.16, real_estate:0.22, capital:0.18, execution_risk:0.08, min_go:76 },
    restaurant: { market_demand:0.20, competition:0.22, compliance:0.10, real_estate:0.20, capital:0.20, execution_risk:0.08, min_go:76 },
    gym: { market_demand:0.22, competition:0.20, compliance:0.08, real_estate:0.18, capital:0.22, execution_risk:0.10, min_go:75 },
    indoor_play: { market_demand:0.22, competition:0.14, compliance:0.18, real_estate:0.18, capital:0.18, execution_risk:0.10, min_go:77 },
    dry_cleaning: { market_demand:0.18, competition:0.18, compliance:0.20, real_estate:0.16, capital:0.18, execution_risk:0.10, min_go:76 },
    senior_care: { market_demand:0.22, competition:0.12, compliance:0.22, real_estate:0.14, capital:0.20, execution_risk:0.10, min_go:80 },
    tutoring: { market_demand:0.28, competition:0.18, compliance:0.08, real_estate:0.10, capital:0.24, execution_risk:0.12, min_go:74 },
    urgent_care: { market_demand:0.22, competition:0.14, compliance:0.18, real_estate:0.12, capital:0.22, execution_risk:0.14, min_go:80 },
    coffee_shop: { market_demand:0.22, competition:0.24, compliance:0.08, real_estate:0.18, capital:0.20, execution_risk:0.08, min_go:75 },
    barbershop: { market_demand:0.24, competition:0.20, compliance:0.08, real_estate:0.12, capital:0.24, execution_risk:0.12, min_go:73 },
    coworking: { market_demand:0.20, competition:0.16, compliance:0.06, real_estate:0.28, capital:0.20, execution_risk:0.10, min_go:76 },
    medical_practice: { market_demand:0.22, competition:0.14, compliance:0.20, real_estate:0.12, capital:0.20, execution_risk:0.12, min_go:80 },
    optometry: { market_demand:0.22, competition:0.16, compliance:0.16, real_estate:0.12, capital:0.22, execution_risk:0.12, min_go:78 },
  };
  const profile = profiles[key] || { market_demand:0.24, competition:0.16, compliance:0.14, real_estate:0.14, capital:0.22, execution_risk:0.10, min_go:75 };
  const scores = {
    market_demand: _bhClampScore(_bhFirstNumber(R.a2?.overall_opportunity_score, location?.scores?.demand, location?.overall_score)),
    competition: _bhClampScore(_bhFirstNumber(location?.scores?.competition, R.a6?.competitive_intensity_score != null ? 100 - Number(R.a6.competitive_intensity_score) * 10 : null)),
    compliance: _bhClampScore(_bhFirstNumber(location?.scores?.regulatory, R.a5?.total_timeline_months ? 100 - Number(R.a5.total_timeline_months) * 3 : null)),
    real_estate: _bhClampScore(_bhFirstNumber(location?.scores?.real_estate, location?.overall_score)),
    capital: _bhClampScore(_bhFirstNumber(scenario?.monthly_net != null && scenario?.monthly_revenue ? Number(scenario.monthly_net) / Number(scenario.monthly_revenue) * 100 + 50 : null, scenario?.roi_3yr)),
    execution_risk: _bhClampScore(100 - Math.min(60, riskRows.filter(r => /high|critical/i.test(r.severity || '')).length * 20 + riskRows.filter(r => /medium/i.test(r.severity || '')).length * 8)),
  };
  const weights = profile;
  const parts = Object.entries(scores).filter(([,v]) => v != null);
  const weightSum = parts.reduce((s,[k]) => s + weights[k], 0);
  const overall = weightSum ? Math.round(parts.reduce((s,[k,v]) => s + v * weights[k], 0) / weightSum) : null;
  const recommendation = overall == null ? 'Needs Review' : overall >= profile.min_go ? 'Go' : overall >= 60 ? 'Cautious Go' : 'No Go';
  const scorecard = { overall, recommendation, scores, weights, min_go: profile.min_go, industry:key, generated_at: new Date().toISOString(), method:'deterministic_weighted_evidence_v2_industry_profile' };
  R.production_scorecard = scorecard;
  return scorecard;
}

function _bhBuildEvidenceLedger() {
  if (typeof R !== 'object' || !R) return [];
  const rows = [];
  for (let n = 1; n <= 17; n++) {
    const d = _bhAgentData(n);
    const claims = Array.isArray(d?._claim_ledger) ? d._claim_ledger : (d && typeof d === 'object' ? _bhExtractClaimLedger(d, n) : []);
    claims.forEach(c => rows.push(c));
  }
  (R.accuracy?.checks || []).forEach(c => {
    const row = {
      type: 'verifier_check',
      agent: c.agent || 'Data',
      field: c.field,
      ai_value: c.ai,
      verified_value: c.real,
      match_pct: c.acc == null ? null : Math.round(c.acc * 100),
      source: c.source || null,
      match_type: c.match_type || null,
      verification_method: c.match_type === 'exact' || c.match_type === 'tolerance_rate' ? 'verified_exact_or_rate' : c.match_type || null,
    };
    Object.assign(row, _bhValidateEvidenceSource(row));
    rows.push(row);
  });
  (R.a17?.data_sources || []).forEach(s => {
    const row = {
      type: 'declared_source',
      agent: s.agent || null,
      field: s.data_used || s.category || null,
      source: s.source || null,
      source_url: s.url || null,
      reliability: s.reliability || null,
      last_updated: s.last_updated || null,
      retrieved_at: s.last_updated || null,
      verification_method: 'declared_source',
    };
    Object.assign(row, _bhValidateEvidenceSource(row));
    rows.push(row);
  });
  R.evidence_ledger = rows;
  return rows;
}

function _bhProductionBlockers() {
  const blockers = [];
  const warnings = [];
  const fallbackAgents = [];
  for (let i = 1; i <= 17; i++) {
    const d = _bhAgentData(i);
    if (d && typeof d === 'object' && d._is_fallback) fallbackAgents.push(i);
  }
  if (fallbackAgents.length) blockers.push(`Fallback agent output used: A${fallbackAgents.join(', A')}.`);

  const feedback = (R.agent_feedback?.items || []).filter(i => i.status !== 'ok');
  if (feedback.length) blockers.push(`${feedback.length} agent feedback item(s) need correction before production use.`);

  const score = R.accuracy?.score;
  const exactVerifiedScore = R.accuracy?.score_exact_verified ?? R.accuracy?.score_strict;
  if (score !== undefined && score !== null && Number(score) < _BH_PRODUCTION_ACCURACY_TARGET) {
    blockers.push(`Accuracy verifier score ${Math.round(Number(score))}% is below the ${_BH_PRODUCTION_ACCURACY_TARGET}-100% production target.`);
    if (Number(score) >= _BH_REVIEW_ACCURACY_FLOOR) warnings.push(`Accuracy score is review-grade but not production-ready: ${Math.round(Number(score))}%.`);
  }
  if (exactVerifiedScore !== undefined && exactVerifiedScore !== null && Number(exactVerifiedScore) < _BH_PRODUCTION_ACCURACY_TARGET) {
    blockers.push(`Exact verified score ${Math.round(Number(exactVerifiedScore))}% is below the ${_BH_PRODUCTION_ACCURACY_TARGET}-100% production target.`);
  }
  const hasRealData = R.real && typeof R.real === 'object' && Object.keys(R.real).length > 0;
  const missingRequired = (R.real?._source_status?.required_missing || []);
  if (missingRequired.length) blockers.push(`Required real-data source(s) missing for production accuracy: ${missingRequired.join(', ')}.`);
  if (hasRealData && (score === undefined || score === null)) blockers.push('Accuracy verifier did not produce a score despite available real data.');
  if (!hasRealData && (R.a1 || R.a2) && (score === undefined || score === null)) warnings.push('No verified real-data score was available for this run.');
  const buckets = R.accuracy?.buckets || {};
  if (hasRealData && (buckets.exact || 0) < 5) blockers.push(`Accuracy verifier has only ${buckets.exact || 0} exact-match checks; production requires at least 5.`);
  const checkedAgents = Array.isArray(R.accuracy?.agents_checked) ? R.accuracy.agents_checked : [];
  const missingCritical = ['A1','A2','A4','A6','A7'].filter(a => !checkedAgents.includes(a));
  if (hasRealData && missingCritical.length) blockers.push(`Accuracy verifier did not cover critical agent(s): ${missingCritical.join(', ')}.`);
  const missingSourceCoverage = R.accuracy?.source_coverage_missing || [];
  if (hasRealData && missingSourceCoverage.length) blockers.push(`Accuracy verifier source coverage missing for critical agent(s): ${missingSourceCoverage.join(', ')}.`);

  const unsourced = Array.isArray(R.a17?.unable_to_source) ? R.a17.unable_to_source.length : 0;
  if (unsourced) blockers.push(`${unsourced} claim(s) remain unsourced in Agent 17.`);
  const ledger = _bhBuildEvidenceLedger();
  if (hasRealData && ledger.length < 10) blockers.push(`Evidence ledger has only ${ledger.length} row(s); production requires at least 10 verifier/source entries.`);
  const badUrls = ledger.filter(r => r.source_url && r.valid_url === false);
  if (badUrls.length) blockers.push(`${badUrls.length} evidence source URL(s) are invalid or placeholder URLs.`);
  const unreachableUrls = (R.evidence_url_checks || []).filter(r => r.ok === false);
  if (unreachableUrls.length) blockers.push(`${unreachableUrls.length} evidence source URL(s) failed live reachability validation.`);
  const invalidSources = ledger.filter(r => r.type !== 'verifier_check' && r.source_validated === false);
  if (invalidSources.length) blockers.push(`${invalidSources.length} evidence source row(s) failed deterministic source validation.`);
  const unsupportedSources = ledger.filter(r => r.type !== 'verifier_check' && r.source_supports_claim === false);
  if (unsupportedSources.length) blockers.push(`${unsupportedSources.length} evidence source row(s) do not support their claim value.`);
  const staleSources = ledger.filter(r => r.type !== 'verifier_check' && r.stale);
  if (staleSources.length) warnings.push(`${staleSources.length} evidence source row(s) appear older than 3 years.`);
  const estimatedClaims = ledger.filter(r => r.type === 'agent_claim' && (r.is_estimated || !r.source));
  if (estimatedClaims.length) blockers.push(`${estimatedClaims.length} recommendation-critical claim(s) lack verified field-level evidence.`);
  const coverageRows = Object.keys(_bhRequiredEvidenceFields()).flatMap(agent => _bhAgentRequiredFieldCoverage(ledger, agent));
  const criticalCoverage = [...new Set(coverageRows.filter(r => !r.covered).map(r => r.agent))];
  if (hasRealData && criticalCoverage.length) blockers.push(`Evidence ledger lacks deterministic source-backed rows for critical agent(s): ${criticalCoverage.join(', ')}.`);
  const highCriticalFailures = ledger.filter(r => r.claim_criticality === 'high' && (r.source_validated === false || r.source_supports_claim === false || !r.source));
  if (highCriticalFailures.length) blockers.push(`${highCriticalFailures.length} high-criticality claim(s) failed evidence validation.`);
  R.evidence_field_coverage = coverageRows;

  const scorecard = _bhComputeProductionScorecard();
  if (!scorecard || scorecard.overall == null) blockers.push('Deterministic production scorecard could not be computed from verified agent evidence.');
  const modelVerdict = String(R.a8?.verdict || '');
  if (scorecard?.recommendation && modelVerdict && !/needs review/i.test(modelVerdict)) {
    const modelGo = /go|recommend|approved|yes/i.test(modelVerdict) && !/no go/i.test(modelVerdict);
    const cardGo = /go/i.test(scorecard.recommendation) && !/no go/i.test(scorecard.recommendation);
    if (modelGo !== cardGo) blockers.push(`Final verdict (${modelVerdict}) conflicts with deterministic scorecard (${scorecard.recommendation}, ${scorecard.overall}/100).`);
  }

  return { blockers, warnings, fallbackAgents, feedbackCount: feedback.length, unsourcedClaims: unsourced };
}

function _bhRenderProductionSafetyBanner(status) {
  if (typeof document === 'undefined') return;
  const anchor = $('realDataStatus') || $('finalBox') || $('orchStatus');
  if (!anchor) return;
  const old = document.getElementById('productionSafetyStatus');
  if (old) old.remove();
  if (!status || status.ready) return;
  const esc = typeof _esc === 'function' ? _esc : v => String(v ?? '');
  const div = document.createElement('div');
  div.id = 'productionSafetyStatus';
  div.style.cssText = 'margin:10px 0;padding:12px 14px;border-radius:8px;border:1px solid rgba(245,158,11,.55);background:rgba(245,158,11,.12);color:var(--text);font-size:12px;line-height:1.55';
  div.innerHTML = `<strong style="color:var(--amber)">Production review required.</strong><br>${status.blockers.slice(0, 4).map(esc).join('<br>')}`;
  anchor.parentElement ? anchor.parentElement.insertBefore(div, anchor.nextSibling) : anchor.appendChild(div);
}

function _bhApplyProductionSafetyGate() {
  if (typeof R !== 'object' || !R) return null;
  const result = _bhProductionBlockers();
  const ready = result.blockers.length === 0;
  const status = {
    ready,
    status: ready ? 'ready' : 'needs_review',
    checked_at: new Date().toISOString(),
    blockers: result.blockers,
    warnings: result.warnings,
    target_accuracy: '95-100%',
    fallback_agents: result.fallbackAgents,
    feedback_items_needing_attention: result.feedbackCount,
    unsourced_claims: result.unsourcedClaims,
  };
  R.production_status = status;
  if (!ready && R.a8 && typeof R.a8 === 'object') {
    const verdict = String(R.a8.verdict || '');
    if (/^(go|strong go|recommend|yes|approved)/i.test(verdict)) R.a8.verdict = 'Needs Review';
    const note = `Production safety gate: ${status.blockers.join(' ')}`;
    R.a8.verdict_rationale = R.a8.verdict_rationale ? `${R.a8.verdict_rationale}\n\n${note}` : note;
  }
  _bhRenderProductionSafetyBanner(status);
  return status;
}

function _bhBuildAgentFeedbackContext() {
  const live = R.agent_feedback?.items || [];
  const persistent = _bhLoadPersistentLearning();
  const rows = [];
  live.filter(i => i.status !== 'ok').slice(-8).forEach(i => {
    rows.push(`A${i.agent}: ${i.issues.slice(0,2).join('; ')} | Required response: ${i.actions.slice(0,2).join(' ')}`);
  });
  persistent.slice(0, 6).forEach(l => {
    rows.push(`Prior lesson A${l.agent}: ${l.lesson}`);
  });
  if (!rows.length) return '';
  return `\n\nCROSS-AGENT FEEDBACK / SELF-LEARNING MEMORY:\n${rows.map(r => '- ' + r).join('\n')}\nApply these corrections. Do not repeat known weak claims. If upstream data is missing or weak, return null/N/A and explain the limitation in notes or sources.`;
}

function _bhBuildAgentRepairContext(agentNum) {
  const fb = R.agent_feedback?.by_agent?.[String(agentNum)];
  if (!fb || fb.status === 'ok') return '';
  const checks = (fb.accuracy_checks || []).slice(0, 6).map(c =>
    `- ${c.field}: replace AI value ${c.aiFmt || c.ai} with verified ${c.realFmt || c.real} from ${c.source || 'verified source'}; previous match ${c.match_pct}%.`
  );
  const issues = (fb.issues || []).slice(0, 6).map(i => `- ${i}`);
  const actions = (fb.actions || []).slice(0, 6).map(a => `- ${a}`);
  return `\n\nACCURACY REPAIR REQUIRED FOR AGENT ${agentNum}:\n${[...checks, ...issues, ...actions].join('\n')}\nReturn corrected JSON only. Preserve valid sourced fields. Replace unverifiable values with null/N/A.`;
}

function _bhBuildEvidencePack(maxChars) {
  maxChars = maxChars || 12000;
  const lines = [];
  const add = line => {
    if (!line) return;
    const next = lines.concat(line).join('\n');
    if (next.length <= maxChars) lines.push(line);
  };
  add('VERIFIED EVIDENCE PACK - prioritize these rows over prose context.');
  (R.accuracy?.checks || [])
    .filter(c => c.match_type === 'exact' || c.match_type === 'tolerance_rate')
    .slice(0, 24)
    .forEach(c => add(`CHECK ${c.agent} ${c.field}: AI=${c.aiFmt || c.ai}; VERIFIED=${c.realFmt || c.real}; SOURCE=${c.source}; MATCH=${Math.round((c.acc || 0) * 100)}%; TYPE=${c.match_type}`));
  const feedback = R.agent_feedback?.items || [];
  feedback.filter(i => i.status !== 'ok').slice(0, 12).forEach(i => add(`FEEDBACK A${i.agent}: ${(i.issues || []).slice(0, 2).join('; ')} | ${(i.actions || []).slice(0, 2).join(' ')}`));
  _bhBuildEvidenceLedger().filter(r => r.type === 'agent_claim' && r.source).slice(0, 30).forEach(r => {
    add(`CLAIM ${r.agent} ${r.field}: ${r.value} | ${r.source || 'no source'} | ${r.source_url || r.source_field || 'no URL/field'} | ${r.retrieved_at || 'no date'}`);
  });
  return lines.join('\n');
}

function _bhWithAgentFeedback(user, opts={}) {
  if (opts.skipFeedback) return user;
  const ctx = _bhBuildAgentFeedbackContext();
  const repair = opts.agentNum ? _bhBuildAgentRepairContext(opts.agentNum) : '';
  return user + (ctx || '') + (repair || '');
}

function _bhDependencyFallbacks(deps) {
  if (demoMode) return [];
  return (deps || []).filter(n => {
    const d = _bhAgentData(n);
    return d && typeof d === 'object' && d._is_fallback;
  });
}

function _bhAssertNoFallbackDeps(agentNum, deps) {
  const failed = _bhDependencyFallbacks(deps);
  if (failed.length) {
    throw new Error(`Agent ${agentNum} blocked: upstream fallback output from A${failed.join(', A')} must be repaired before downstream analysis.`);
  }
}

function _bhAccuracyRepairAgents() {
  const items = R.agent_feedback?.items || [];
  const agents = [];
  items.forEach(i => {
    if (i.status !== 'ok' && i.agent && !agents.includes(i.agent)) agents.push(i.agent);
  });
  if (Array.isArray(R.accuracy?.checks)) {
    R.accuracy.checks.forEach(c => {
      const m = (c.agent || '').match(/^A(\d+)/);
      if (m && c.acc != null && c.acc < (_BH_PRODUCTION_ACCURACY_TARGET / 100)) {
        const n = parseInt(m[1], 10);
        if (!agents.includes(n)) agents.push(n);
      }
    });
  }
  return agents.filter(n => n >= 1 && n <= 17);
}

// Retry an agent call up to 2 times if JSON parse fails
// opts.webSearch = true enables Anthropic web_search tool for this call
async function claudeJSON(system, user, opts={}) {
  if (demoMode) {
    await new Promise(r => setTimeout(r, 400));
    // NEW: Try dedicated demo data first (deterministic, richly-shaped)
    if (typeof getDemoData === 'function' && typeof _demoCJKey !== 'undefined' && _demoCJKey !== null) {
      const d = getDemoData(_demoCJKey);
      if (d) { _demoCJKey = null; return _bhAttachOutputQuality(d, { ...opts, demo:true }); }
    }
    // Fallback: parse template from prompt (legacy)
    const marker = user.search(/Return ONLY[:\s]/i);
    const src    = marker >= 0 ? user.slice(marker) : user;
    const d = parseJSON(src);
    if (d) return _bhAttachOutputQuality(d, { ...opts, demo:true });
    return {};
  }
  if(!demoMode) {
    const cacheUser = _bhWithAgentFeedback(user, opts);
    const cached = getCache(system, cacheUser, opts);
    if(cached) { console.log('Cache hit'); return _bhAttachOutputQuality(cached, { ...opts, cached:true }); }
  }
  const strictSystem = system + `

CRITICAL — JSON FORMAT: Your ENTIRE response must be a single valid JSON object. Start with { and end with }. No text before or after. No markdown. No explanation. Just JSON.

CRITICAL — DATA INTEGRITY (strictly enforced):
- NEVER fabricate, invent, or estimate specific data that you cannot verify from a real source.
- This includes: business names, addresses, phone numbers, email addresses, URLs, prices, statistics, ratings, counts, percentages, permit costs, agency names, or any numeric value.
- If a specific piece of information is not available or cannot be verified, use EXACTLY:
    • null          — for any numeric field (costs, ratings, counts, percentages, scores)
    • "N/A"         — for short string fields (phone, email, form names, URLs you cannot verify)
    • "Information not available" — for longer descriptive string fields
- Do NOT substitute a plausible-sounding made-up value. Do NOT use 0 when the real value is unknown. Do NOT generate fake phone numbers, fake URLs, fake business names, fake addresses, or fake statistics.
- If you found real data from a search, state the source. If you could not find it, return null/"N/A".
- It is far better to return null than to return fabricated data.

CRITICAL — CROSS-AGENT CONSISTENCY:
- When upstream agent context is provided (e.g. demographics, gap analysis, site selection), USE those numbers exactly. Do not re-estimate or contradict them.
- Example: if upstream says median household income is $112,400, your downstream pricing and revenue projections must be consistent with that income level — do not silently assume a different income tier.
- If you reference an upstream value, state which agent it came from (e.g. "per Agent 1 demographics: median income $112,400").

CRITICAL — NUMERIC PRECISION:
- Round all currency to whole dollars (no cents). $1,234.56 → 1235.
- Round percentages to one decimal place max.
- Round large counts (population, sqft) to nearest 100.
- Integer fields like counts and units must be integers, not floats.
- Do NOT pad numbers with .00 or fake precision.

CRITICAL - SOURCE COVERAGE:
- For every numeric claim in an array row, include a nearby source/source_url/citation field when the schema provides one.
- If the schema lacks a source field, put the source name in the nearest summary, notes, or data_sources field.
- Every recommendation-critical value should be emitted as or accompanied by: value, source_name/source, source_url/citation, retrieved_at/last_updated, confidence, and verification_method when the schema has room for it.
- Field-level evidence is required for recommendation-critical numbers: rent, tuition/prices, revenue, cost, wages, counts, scores, percentages, capacity, timeline, fees, and funding amounts.
- Add a root-level sources_by_field object when possible. Keys must match critical field names or paths; values must include source, source_url or source_field, retrieved_at, and verification_method.
- Prefer official .gov/.edu/API data. Marketplace/search sources are acceptable only for listings, reviews, or pricing and must be labeled as marketplace evidence.
- Never output placeholder URLs, "example.com", fake phone numbers, or sample addresses. Use "N/A" instead.`;
  for (let attempt = 1; attempt <= 3; attempt++) {
    // Bail immediately if pipeline was stopped
    if (window._v2AbortCtrl?.signal?.aborted || window.stopRequested) throw new Error('Pipeline stopped');
    if (attempt > 1) {
      // Abort-aware retry delay — resolves immediately if stop is clicked
      await new Promise(resolve => {
        const t = setTimeout(resolve, attempt * 1500);
        const sig = window._v2AbortCtrl?.signal;
        if (sig) sig.addEventListener('abort', () => { clearTimeout(t); resolve(); }, { once: true });
      });
    }
    if (window._v2AbortCtrl?.signal?.aborted || window.stopRequested) throw new Error('Pipeline stopped');
    try {
      const activeUser = _bhWithAgentFeedback(user, opts) + (attempt > 1 ? '\n\nRemember: respond with ONLY the JSON object, nothing else. If the previous attempt failed schema validation, include every required field and use [] only when the source truly has no rows.' : '');
      const raw = await claude(strictSystem, activeUser, opts);
      const d = parseJSON(raw);
      if (d) {
        const checked = _bhAttachOutputQuality(d, opts);
        if (opts.agentNum) {
          const schema = checked._schema || _bhValidateAgentSchema(opts.agentNum, checked);
          if (!schema.ok && attempt < 3) {
            console.warn(`Attempt ${attempt} schema fail.`, schema.issues.join(' | '));
            continue;
          }
        }
        setCache(system, _bhWithAgentFeedback(user, opts), checked, opts);
        return checked;
      }
      console.warn(`Attempt ${attempt} parse fail. Raw:`, (raw||'').substring(0, 200));
    } catch(e) {
      if (attempt === 3) throw e;
      console.warn(`Attempt ${attempt} API error:`, e.message);
    }
  }
  return null;
}

// opts.webSearch = true → enable Anthropic web_search tool (Anthropic provider only)
function _bhShouldUseLLMProxy() {
  if (typeof window === 'undefined') return false;
  if (typeof window.USE_LLM_PROXY === 'boolean') return window.USE_LLM_PROXY;
  const loc = window.location || {};
  if (loc.protocol === 'file:') return false;
  const p = provider();
  if (p === 'openai_compat' && /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])/i.test(customUrl())) return false;
  return true;
}

function _bhAllowDirectLLMKeys() {
  if (typeof window === 'undefined') return false;
  if (window.ALLOW_CLIENT_LLM_KEYS === true || window.BH_ALLOW_CLIENT_LLM_KEYS === true) return true;
  const loc = window.location || {};
  if (loc.protocol === 'file:') return true;
  const p = provider();
  return p === 'openai_compat' && /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])/i.test(customUrl());
}

async function _bhLLMProxy(system, user, opts={}) {
  const signal = window._v2AbortCtrl?.signal;
  const fetchOpts = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: provider(),
      model: model(),
      system,
      user,
      opts: {
        webSearch: opts.webSearch === true,
        webSearchMaxUses: opts.webSearchMaxUses,
      },
    }),
  };
  if (signal && !signal.aborted) fetchOpts.signal = signal;
  const proxyUrl = window.LLM_PROXY_URL || '/api/llm';
  const res = await fetch(proxyUrl, fetchOpts);
  const d = await res.json().catch(() => ({}));
  if (!res.ok || d.error) throw new Error(d.error || 'HTTP ' + res.status);
  const stop = d.stop;
  if (stop === 'max_tokens' || stop === 'MAX_TOKENS' || stop === 'length') throw new Error('Response truncated at max_tokens');
  return d.text || '';
}

async function claude(system, user, opts={}) {
  const k=key();
  if (_bhShouldUseLLMProxy()) {
    try {
      return await _bhLLMProxy(system, user, opts);
    } catch(e) {
      if (!k) throw e;
      if (!_bhAllowDirectLLMKeys()) throw e;
      console.warn('[LLMProxy] falling back to direct provider call:', e.message);
    }
  }
  if(!k || !_bhAllowDirectLLMKeys()) throw new Error('No API key. Configure server-side /api/llm env vars or enable local-development client keys.');
  const p = PROVIDERS[provider()]||PROVIDERS.anthropic;
  const url = p.url_custom ? customUrl() : (typeof p.url==='function' ? p.url(k) : p.url);
  const headers = p.headers(k);
  const body = p.buildBody(system, user, model(), opts);
  // Use v2 abort controller if present (allows stop button to cancel mid-flight)
  const signal = window._v2AbortCtrl?.signal;
  const fetchOpts = { method:'POST', headers, body:JSON.stringify(body) };
  if (signal && !signal.aborted) fetchOpts.signal = signal;
  const res=await fetch(url, fetchOpts);
  if(!res.ok){const e=await res.json().catch(()=>({}));throw new Error(e.error?.message||'HTTP '+res.status)}
  const d=await res.json();
  if(d.error) throw new Error(d.error.message);
  const stop = p.extractStop(d);
  if(stop==='max_tokens'||stop==='MAX_TOKENS'||stop==='length') throw new Error('Response truncated at max_tokens');
  return p.extractText(d);
}

function onProviderChange() {
  const p = provider();
  const customRow = $('customUrlRow');
  if(customRow) customRow.style.display = p==='openai_compat'?'block':'none';
  const pObj = PROVIDERS[p]||PROVIDERS.anthropic;
  const mi = $('modelInput');
  if(mi) mi.placeholder = pObj.model_default;
  const guidance = $('apiKeyGuidance');
  if(guidance) guidance.style.display = p==='anthropic' ? 'block' : 'none';
}

// ── CONTEXT EXTRACTOR ──────────────────────────────────────
function ctx(jsonStr, fields, maxLen) {
  try {
    const d = typeof jsonStr==='string' ? JSON.parse(jsonStr) : jsonStr;
    if(!d) return (jsonStr||'').substring(0, maxLen||600);
    const out = {};
    fields.forEach(f => { if(d[f]!==undefined) out[f]=d[f]; });
    const s = JSON.stringify(out);
    return maxLen ? s.substring(0, maxLen) : s;
  } catch(e) { return (jsonStr||'').substring(0, maxLen||600); }
}

// ── FALLBACK DATA ───────────────────────────────────────────
