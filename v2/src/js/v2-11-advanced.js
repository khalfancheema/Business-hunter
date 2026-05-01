// ── V2 ADVANCED FEATURES (v2.2) ───────────────────────────────────────────
// F1:  Conversational chat memory (multi-turn history)
// F2:  Proactive AI follow-ups after pipeline complete
// F3:  Streaming agent output (SSE streaming for Anthropic / OpenAI)
// F4:  Live data refresh per-agent
// F5:  Inline R data editor
// F6:  Wizard draft auto-save / restore
// F7:  Portfolio tags & notes
// F8:  Multi-ZIP side-by-side modal
// F9:  Formatted PDF export (new window, print-ready)
// F10: Slide deck export (12-slide HTML pitch deck)
// F11: Agent confidence scores
// F12: ZIP autocomplete (city/state lookup)

// ── F1 + F3: CONVERSATIONAL CHAT MEMORY + STREAMING ──────────────────────
let _v2ChatHistory = [];

function v2ClearChatHistory() { _v2ChatHistory = []; }

// Override v2SendChatQuestion to record history
function v2SendChatQuestion() {
  const inp = document.getElementById('v2-chat-input');
  if (!inp) return;
  const q = inp.value.trim();
  if (!q) return;
  inp.value = '';
  v2ChatMsg('user', q);
  _v2ChatHistory.push({ role: 'user', content: q });
  v2AnswerQuestion(q);
}

// Override _v2AiAnswer with streaming + memory version
async function _v2AiAnswer(question, R_data) {
  const apiKey  = localStorage.getItem('v2_apikey') || '';
  const provider = V2.selectedProvider || 'anthropic';
  if (!apiKey) { v2AnswerQuestionOffline(question, R_data); return; }

  // Insert streaming placeholder bubble
  const msgs   = document.getElementById('v2-chat-msgs');
  const bubble = document.createElement('div');
  bubble.className = 'v2-msg ai';
  bubble.innerHTML = `<div class="v2-msg-avatar">🤖</div><div class="v2-msg-bubble v2-streaming">⏳ Thinking…</div>`;
  if (msgs) { msgs.appendChild(bubble); msgs.scrollTop = msgs.scrollHeight; }
  const bubbleText = bubble.querySelector('.v2-msg-bubble');

  const snapshot = _v2BuildDataSnapshot(R_data);
  const sys = `You are AI Answers for Business Hunter, an AI startup analysis tool.
Answer in 2-5 sentences. Use conversation history for follow-ups.
Cite specific numbers. Use HTML: <strong> for emphasis, <br> for line breaks.
If data is missing, say so briefly and suggest what to run.`;

  // Build messages array with history (last 10 turns)
  const historySlice = _v2ChatHistory.slice(-10);

  try {
    if (provider === 'anthropic') {
      await _v2StreamAnthropic(apiKey, sys, historySlice, bubbleText);
    } else if (provider === 'openai' || provider === 'openai_compat') {
      await _v2StreamOpenAI(apiKey, sys, historySlice, bubbleText);
    } else {
      // Gemini — non-streaming fallback with history context
      await _v2GeminiFallback(apiKey, sys, historySlice, bubbleText);
    }
    // Record AI response in history
    _v2ChatHistory.push({ role: 'assistant', content: bubbleText?.innerHTML || '' });
    bubbleText?.classList.remove('v2-streaming');
  } catch(e) {
    if (bubbleText) { bubbleText.innerHTML = `⚠️ ${e.message || 'Connection error. Check your API key.'}`; }
    bubbleText?.classList.remove('v2-streaming');
  }
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}

function _v2BuildDataSnapshot(R_data) {
  return JSON.stringify({
    verdict:            R_data.a8?.verdict,
    rationale:          R_data.a8?.verdict_rationale,
    score:              v2CalcScore(),
    top_city:           (R_data.a2?.cities||[]).sort((a,b)=>(b.gap_score||0)-(a.gap_score||0))[0],
    financials_base:    R_data.a7?.scenarios?.[1] || {},
    risks:              (R_data.a8?.risks||[]).slice(0,5),
    next_steps:         (R_data.a8?.next_steps||[]).slice(0,5),
    competition:        R_data.a6?.summary,
    compliance:         R_data.a5?.summary,
    grants:             R_data.a12?.summary,
    startup_cost:       R_data.a7?.total_startup_cost,
    demographics:       R_data.a1?.summary,
    industry:           V2.wizard?.data?.industry,
    zip:                V2.wizard?.data?.zip,
    budget:             V2.wizard?.data?.budget,
  }, null, 2).slice(0, 3500);
}

async function _v2StreamAnthropic(apiKey, sys, messages, bubbleEl) {
  const model = localStorage.getItem('v2_model') || 'claude-sonnet-4-6';
  const res   = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({ model, max_tokens: 600, system: sys, messages, stream: true }),
  });
  if (!res.ok) throw new Error(`Anthropic API ${res.status}: check your key`);

  const reader  = res.body.getReader();
  const decoder = new TextDecoder();
  let full = '';
  if (bubbleEl) bubbleEl.innerHTML = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    for (const line of decoder.decode(value).split('\n')) {
      if (!line.startsWith('data: ')) continue;
      const raw = line.slice(6).trim();
      if (!raw || raw === '[DONE]') continue;
      try {
        const p = JSON.parse(raw);
        if (p.type === 'content_block_delta' && p.delta?.text) {
          full += p.delta.text;
          if (bubbleEl) {
            bubbleEl.innerHTML = full;
            bubbleEl.closest('.v2-chat-msgs')?.scrollTo(0, 9999);
          }
        }
      } catch {}
    }
  }
}

async function _v2StreamOpenAI(apiKey, sys, messages, bubbleEl) {
  const customUrl = localStorage.getItem('v2_custom_url') || 'https://api.openai.com/v1/chat/completions';
  const model     = localStorage.getItem('v2_model') || 'gpt-4o';
  const allMsgs   = [{ role: 'system', content: sys }, ...messages];
  const res       = await fetch(customUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ model, max_tokens: 600, messages: allMsgs, stream: true }),
  });
  if (!res.ok) throw new Error(`OpenAI API ${res.status}: check your key`);

  const reader  = res.body.getReader();
  const decoder = new TextDecoder();
  let full = '';
  if (bubbleEl) bubbleEl.innerHTML = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    for (const line of decoder.decode(value).split('\n')) {
      if (!line.startsWith('data: ')) continue;
      const raw = line.slice(6).trim();
      if (!raw || raw === '[DONE]') continue;
      try {
        const p = JSON.parse(raw);
        const text = p.choices?.[0]?.delta?.content;
        if (text) {
          full += text;
          if (bubbleEl) bubbleEl.innerHTML = full;
        }
      } catch {}
    }
  }
}

async function _v2GeminiFallback(apiKey, sys, messages, bubbleEl) {
  const model   = localStorage.getItem('v2_model') || 'gemini-1.5-pro';
  const history = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: sys }] },
        contents: history,
        generationConfig: { maxOutputTokens: 600 },
      }),
    },
  );
  if (!res.ok) throw new Error(`Gemini API ${res.status}`);
  const d = await res.json();
  const text = d.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
  if (bubbleEl) bubbleEl.innerHTML = text;
}

// Offline fallback (no API key) — keyword-based, unchanged from v2-04-copilot.js
function v2AnswerQuestionOffline(q, R_data) {
  const lower = q.toLowerCase();
  let answer  = '';
  if (lower.includes('best city') || lower.includes('top city')) {
    const top = (R_data.a2?.cities||[]).sort((a,b)=>(b.gap_score||0)-(a.gap_score||0))[0];
    answer = top ? `<strong>${top.city}</strong> scores highest with gap ${top.gap_score}/10. ${top.rationale||''}` : 'Run the pipeline to identify top cities.';
  } else if (lower.includes('financ') || lower.includes('revenue')) {
    const base = (R_data.a7?.scenarios||[]).find(s=>(s.name||'').toLowerCase().includes('base'))||R_data.a7?.scenarios?.[1]||{};
    answer = base.monthly_revenue
      ? `Base: $${(base.monthly_revenue/1000).toFixed(0)}K/mo revenue · $${(base.monthly_net/1000).toFixed(0)}K net · break-even month ${base.breakeven_months}`
      : 'Run Agent 7 for financial projections.';
  } else if (lower.includes('risk')) {
    const risks = (R_data.a8?.risks||[]).slice(0,3);
    answer = risks.length ? `<strong>Top risks:</strong><br>${risks.map(r=>`• ${typeof r==='string'?r:(r.risk||r.title||r)}`).join('<br>')}` : 'Run the pipeline to see risk analysis.';
  } else if (lower.includes('score') || lower.includes('viability')) {
    const score = v2CalcScore(); const v = v2ScoreVerdict(score);
    answer = `<strong>Viability Score: ${score}/100</strong> — ${v.title}<br>${v.summary}`;
  } else if (lower.includes('grant') || lower.includes('funding')) {
    const grants = (R_data.a12?.grants||[]).slice(0,3);
    answer = grants.length ? `<strong>Funding options:</strong><br>${grants.map(g=>`• ${g.name||g.program}: ${g.amount||'see report'}`).join('<br>')}` : R_data.a12?.summary || 'Run Agent 12 for grant opportunities.';
  } else {
    answer = `I can answer questions about your analysis. Try:<br>• "What's the best city?"<br>• "Explain the financials"<br>• "What are the biggest risks?"<br>• "What funding is available?"`;
  }
  setTimeout(() => v2ChatMsg('ai', answer), 300);
}

// ── F2: PROACTIVE AI FOLLOW-UPS ───────────────────────────────────────────
function v2ShowProactiveFollowUps() {
  const R_data = typeof R !== 'undefined' ? R : {};
  const d      = V2.wizard?.data || {};
  const questions = [];

  // Context-aware questions based on actual analysis data
  const topCity = (R_data.a2?.cities||[]).sort((a,b)=>(b.gap_score||0)-(a.gap_score||0))[0];
  if (topCity) questions.push(`Why does ${topCity.city} score highest? What's driving the gap?`);

  const base = (R_data.a7?.scenarios||[]).find(s=>(s.name||'').toLowerCase().includes('base'))||R_data.a7?.scenarios?.[1]||{};
  if (base.breakeven_months) questions.push(`Break-even is month ${base.breakeven_months} — what's the most sensitive assumption?`);

  const verdict = R_data.a8?.verdict || '';
  if (verdict) questions.push(`You got a ${verdict} verdict. What would flip it to a stronger GO?`);

  const topRisk = R_data.a8?.risks?.[0];
  if (topRisk) {
    const riskText = typeof topRisk === 'string' ? topRisk : (topRisk.risk || topRisk.title || '');
    if (riskText) questions.push(`How do I mitigate the top risk: "${riskText.slice(0,60)}…"?`);
  }

  const radius = d.radius || '40';
  if (parseInt(radius) > 25) questions.push(`You searched a ${radius}-mile radius. Should we narrow to the top ZIP for a sharper site search?`);

  const finalQs = questions.slice(0, 3);
  if (!finalQs.length) return;

  setTimeout(() => {
    v2ChatMsg('ai', `💡 <strong>Suggested follow-ups:</strong><br>
      <div class="v2-chat-suggestions">
        ${finalQs.map(q => `<button class="v2-chat-suggestion" onclick="v2ChatFromSuggestion(this)">${q}</button>`).join('')}
      </div>`);
  }, 2500);
}

function v2ChatFromSuggestion(btn) {
  const q   = btn?.textContent || btn;
  const inp = document.getElementById('v2-chat-input');
  if (inp) inp.value = typeof q === 'string' ? q : q;
  // Disable the suggestions row so it's clear we're processing
  btn?.closest?.('.v2-chat-suggestions')?.querySelectorAll('button').forEach(b => b.disabled = true);
  v2SendChatQuestion();
}

// ── F6: WIZARD DRAFT AUTO-SAVE ────────────────────────────────────────────
const V2_DRAFT_KEY = 'v2_wizard_draft';

function v2SaveWizardDraft() {
  const data = V2.wizard?.data;
  if (!data || !data.industry) return;
  localStorage.setItem(V2_DRAFT_KEY, JSON.stringify(data));
}

function v2ClearWizardDraft() {
  localStorage.removeItem(V2_DRAFT_KEY);
}

function v2CheckWizardDraft() {
  try {
    const raw = localStorage.getItem(V2_DRAFT_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (!data.industry) return;
    const ind = V2_INDUSTRIES.find(i => i.val === data.industry);
    const banner = document.getElementById('v2-draft-banner');
    if (!banner) return;
    banner.innerHTML = `
      <span>${ind?.emoji || '🏢'} <strong>Resume analysis?</strong> You were setting up a ${ind?.label || data.industry} in ZIP ${data.zip || '—'}.</span>
      <div style="display:flex;gap:8px;flex-shrink:0">
        <button class="v2-btn primary sm" onclick="v2RestoreWizardDraft()">Resume →</button>
        <button class="v2-btn ghost sm" onclick="v2DismissWizardDraft()">Dismiss</button>
      </div>`;
    banner.style.display = 'flex';
  } catch {}
}

function v2RestoreWizardDraft() {
  try {
    const data = JSON.parse(localStorage.getItem(V2_DRAFT_KEY) || '{}');
    V2.wizard.data = data;
    V2.wizard.step = 0;
    const banner = document.getElementById('v2-draft-banner');
    if (banner) banner.style.display = 'none';
    v2GoTo('wizard');
    v2WizRenderStepsBar();
    v2WizRenderStep();
    v2Toast('↩ Draft restored');
  } catch {}
}

function v2DismissWizardDraft() {
  v2ClearWizardDraft();
  const banner = document.getElementById('v2-draft-banner');
  if (banner) banner.style.display = 'none';
}

// ── F7: PORTFOLIO TAGS & NOTES ────────────────────────────────────────────
const V2_PORT_TAGS = [
  { id: 'serious',      label: '⭐ Serious',      color: 'rgba(34,197,94,.15)',  text: 'var(--v2-green)' },
  { id: 'backup',       label: '📌 Backup',       color: 'rgba(59,130,246,.15)', text: 'var(--v2-blue)'  },
  { id: 'investigating',label: '🔍 Investigating', color: 'rgba(245,158,11,.15)', text: 'var(--v2-amber)' },
  { id: 'vetoed',       label: '🚫 Vetoed',        color: 'rgba(239,68,68,.15)',  text: 'var(--v2-red)'   },
  { id: 'funded',       label: '💰 Funded',        color: 'rgba(139,92,246,.15)', text: 'var(--v2-a2)'    },
];

function v2PortCycleTag(id) {
  const entry = V2.portfolio.find(r => String(r.id) === String(id));
  if (!entry) return;
  const tagIds  = V2_PORT_TAGS.map(t => t.id);
  const cur     = tagIds.indexOf(entry.tag || '');
  entry.tag     = cur >= tagIds.length - 1 ? '' : tagIds[cur + 1];
  v2SavePortfolio();
  v2RenderPortfolio();
}

function v2PortStartNote(id) {
  const entry = V2.portfolio.find(r => String(r.id) === String(id));
  if (!entry) return;
  const noteEl = document.getElementById(`v2-port-note-${id}`);
  if (!noteEl) return;
  noteEl.innerHTML = `
    <input class="v2-port-note-input" id="v2-port-note-inp-${id}"
      value="${(entry.note||'').replace(/"/g,'&quot;')}"
      placeholder="Add a note…" maxlength="120"
      onkeydown="if(event.key==='Enter')v2PortSaveNote('${id}');if(event.key==='Escape')v2RenderPortfolio()" />
    <button class="v2-btn ghost sm" style="font-size:11px" onclick="v2PortSaveNote('${id}')">Save</button>`;
  document.getElementById(`v2-port-note-inp-${id}`)?.focus();
}

function v2PortSaveNote(id) {
  const entry = V2.portfolio.find(r => String(r.id) === String(id));
  if (!entry) return;
  entry.note = document.getElementById(`v2-port-note-inp-${id}`)?.value.trim() || '';
  v2SavePortfolio();
  v2RenderPortfolio();
}

// ── F8: MULTI-ZIP SIDE-BY-SIDE ────────────────────────────────────────────
function v2ShowZIPCompare() {
  const modal = document.getElementById('v2-zipcompare-modal');
  if (!modal) return;
  const curZip = V2.wizard?.data?.zip || V2.run?.zip || '';
  const ind    = V2_INDUSTRIES.find(i => i.val === (V2.wizard?.data?.industry || V2.run?.industry)) || { emoji:'🏢', label:'Business' };

  document.getElementById('v2-zipcompare-content').innerHTML = `
    <div class="v2-modal-header">
      <div class="v2-modal-title">📊 Multi-ZIP Comparison</div>
      <button class="v2-modal-close" onclick="v2CloseZIPCompare()">✕</button>
    </div>
    <div style="font-size:13px;color:var(--v2-t2);margin-bottom:20px">
      Compare ${ind.emoji} ${ind.label} metrics across two ZIP codes.
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">
      <div class="v2-field" style="margin:0">
        <label>ZIP A (current)</label>
        <input class="v2-input" id="v2-zcmp-a" value="${curZip}" placeholder="ZIP code" maxlength="5" />
      </div>
      <div class="v2-field" style="margin:0">
        <label>ZIP B</label>
        <input class="v2-input" id="v2-zcmp-b" placeholder="e.g. 30024" maxlength="5" oninput="v2ZIPComparePreview(this.value,'b')" />
        <div id="v2-zcmp-b-city" style="font-size:11px;color:var(--v2-t3);margin-top:4px"></div>
      </div>
    </div>
    <div id="v2-zcmp-result"></div>
    <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:16px">
      <button class="v2-btn ghost" onclick="v2CloseZIPCompare()">Cancel</button>
      <button class="v2-btn primary" onclick="v2RunZIPCompare()">Compare ZIPs →</button>
    </div>`;
  modal.classList.add('open');
}

function v2CloseZIPCompare() {
  document.getElementById('v2-zipcompare-modal')?.classList.remove('open');
}

async function v2ZIPComparePreview(zip, slot) {
  if (zip.length !== 5) return;
  const el = document.getElementById(`v2-zcmp-${slot}-city`);
  if (!el) return;
  el.textContent = '⏳ Looking up…';
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
    if (!res.ok) { el.textContent = 'ZIP not found'; return; }
    const d = await res.json();
    el.textContent = `📍 ${d.places[0]['place name']}, ${d.places[0]['state abbreviation']}`;
  } catch { el.textContent = ''; }
}

function v2RunZIPCompare() {
  const zipA = document.getElementById('v2-zcmp-a')?.value.trim();
  const zipB = document.getElementById('v2-zcmp-b')?.value.trim();
  if (!zipA || !zipB || !/^\d{5}$/.test(zipA) || !/^\d{5}$/.test(zipB)) {
    v2Toast('Enter valid 5-digit ZIP codes for both'); return;
  }

  const R_data = typeof R !== 'undefined' ? R : {};
  const cities = R_data.a2?.cities || [];

  const matchA = cities.find(c => (c.zip||'') === zipA || (c.city||'').toLowerCase().includes(zipA));
  const matchB = cities.find(c => (c.zip||'') === zipB);

  // Also check portfolio for a run with ZIP B
  const portB = V2.portfolio.find(r => r.zip === zipB);

  const resultEl = document.getElementById('v2-zcmp-result');
  if (!resultEl) return;

  const kpis = [
    { label: 'Gap Score',    a: matchA?.gap_score != null ? `${matchA.gap_score}/10` : '—', b: matchB?.gap_score != null ? `${matchB.gap_score}/10` : portB ? `${portB.score}/100 overall` : '—' },
    { label: 'Population',   a: matchA?.population ? Number(matchA.population).toLocaleString() : '—', b: matchB?.population ? Number(matchB.population).toLocaleString() : '—' },
    { label: 'Competitors',  a: matchA?.existing_supply ?? matchA?.competitor_count ?? '—', b: matchB?.existing_supply ?? matchB?.competitor_count ?? '—' },
    { label: 'Est. Demand',  a: matchA?.estimated_demand ?? '—', b: matchB?.estimated_demand ?? '—' },
  ];

  resultEl.innerHTML = `
    <div class="v2-cmp-table-wrap">
      <table class="v2-table">
        <thead><tr><th>Metric</th><th>ZIP ${zipA}</th><th>ZIP ${zipB}</th></tr></thead>
        <tbody>
          ${kpis.map(k => `<tr><td class="v2-cmp-label">${k.label}</td><td class="v2-cmp-val">${k.a}</td><td class="v2-cmp-val">${k.b}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
    ${!matchA && !matchB ? `<div style="font-size:12px;color:var(--v2-t3);margin-top:10px">
      ⚠️ No gap analysis data found for these ZIPs. Run the full pipeline to populate city-level data.
    </div>` : ''}
    ${portB ? `<div style="font-size:12px;color:var(--v2-t2);margin-top:10px">
      📁 Found a portfolio entry for ZIP ${zipB}: ${portB.indEmoji} ${portB.indLabel} — Score ${portB.score}/100
    </div>` : `<div style="font-size:12px;color:var(--v2-t3);margin-top:10px">
      💡 No saved analysis for ZIP ${zipB}. Run a new analysis there for full comparison.
      <button class="v2-btn ghost sm" style="margin-left:8px" onclick="v2CloseZIPCompare();v2GoTo('wizard')">Run ZIP ${zipB} →</button>
    </div>`}`;
}

// ── F9: FORMATTED PDF EXPORT ──────────────────────────────────────────────
function v2GeneratePDFReport() {
  const R_data   = typeof R !== 'undefined' ? R : {};
  const run      = V2.run || {};
  const ind      = V2_INDUSTRIES.find(i => i.val === (run.industry || V2.wizard?.data?.industry)) || { emoji:'🏢', label:'Business' };
  const score    = run.score || v2CalcScore();
  const verdict  = v2ScoreVerdict(score);
  const date     = new Date(run.ts || Date.now()).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
  const ringColor = score >= 70 ? '#22c55e' : score >= 45 ? '#f59e0b' : '#ef4444';
  const circ     = 2 * Math.PI * 54;
  const offset   = (circ * (1 - score / 100)).toFixed(1);

  const base = (R_data.a7?.scenarios||[]).find(s=>(s.name||'').toLowerCase().includes('base'))||R_data.a7?.scenarios?.[1]||{};
  const topCity = (R_data.a2?.cities||[]).sort((a,b)=>(b.gap_score||0)-(a.gap_score||0))[0];
  const risks   = (R_data.a8?.risks||[]).slice(0,5);
  const steps   = (R_data.a8?.next_steps||[]).slice(0,6);

  const fmt = v => v ? `$${Number(v).toLocaleString()}` : '—';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>${ind.emoji} ${ind.label} — Business Viability Report</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', -apple-system, sans-serif; background: #fff; color: #0f172a; font-size: 14px; line-height: 1.6; }
  .page { max-width: 800px; margin: 0 auto; padding: 40px 48px; }
  h1 { font-size: 28px; font-weight: 900; letter-spacing: -.03em; margin-bottom: 4px; }
  h2 { font-size: 16px; font-weight: 700; margin: 28px 0 10px; padding-bottom: 6px; border-bottom: 2px solid #e2e8f0; }
  h3 { font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
  .cover { display: flex; align-items: center; gap: 40px; padding: 40px 0 32px; border-bottom: 2px solid #e2e8f0; margin-bottom: 32px; }
  .score-ring { flex-shrink: 0; }
  .meta { color: #475569; font-size: 13px; }
  .meta strong { color: #0f172a; }
  .verdict { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 999px; font-size: 13px; font-weight: 700; margin-top: 10px; background: ${score>=70?'#dcfce7':score>=45?'#fef3c7':'#fee2e2'}; color: ${ringColor}; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 10px; }
  th { padding: 8px 12px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; background: #f8fafc; color: #64748b; border-bottom: 2px solid #e2e8f0; }
  td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; }
  .green { color: #16a34a; font-weight: 700; }
  .red   { color: #dc2626; font-weight: 700; }
  .amber { color: #d97706; font-weight: 700; }
  .kpi-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin: 16px 0; }
  .kpi { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; text-align: center; }
  .kpi-val { font-size: 22px; font-weight: 800; letter-spacing: -.02em; }
  .kpi-lbl { font-size: 11px; color: #64748b; margin-top: 3px; }
  ul { padding-left: 18px; margin-top: 8px; }
  li { margin-bottom: 5px; color: #334155; }
  .risk { display: flex; gap: 10px; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
  .risk-badge { font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 4px; flex-shrink: 0; text-transform: uppercase; }
  .risk-badge.high { background: #fee2e2; color: #dc2626; }
  .risk-badge.medium { background: #fef3c7; color: #d97706; }
  .risk-badge.low { background: #dcfce7; color: #16a34a; }
  footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; }
  @media print { @page { margin: 0.5in; } button { display: none !important; } }
  .print-btn { position: fixed; bottom: 20px; right: 20px; padding: 10px 20px; background: #6366f1; color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; }
</style>
</head>
<body>
<div class="page">
  <div class="cover">
    <div class="score-ring">
      <svg width="110" height="110" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r="54" fill="none" stroke="#e2e8f0" stroke-width="10"/>
        <circle cx="65" cy="65" r="54" fill="none" stroke="${ringColor}" stroke-width="10"
          stroke-dasharray="${circ.toFixed(1)}" stroke-dashoffset="${offset}"
          stroke-linecap="round"
          style="transform:rotate(-90deg);transform-origin:center"/>
        <text x="65" y="60" text-anchor="middle" font-size="26" font-weight="900" fill="${ringColor}">${score}</text>
        <text x="65" y="76" text-anchor="middle" font-size="11" fill="#94a3b8">/100</text>
      </svg>
    </div>
    <div>
      <div style="font-size:13px;color:#94a3b8;margin-bottom:4px">Business Viability Report</div>
      <h1>${ind.emoji} ${ind.label}</h1>
      <div class="meta">ZIP <strong>${run.zip || V2.wizard?.data?.zip || '—'}</strong> · Radius <strong>${run.radius || V2.wizard?.data?.radius || '—'} mi</strong> · Budget <strong>${fmt(run.budget || V2.wizard?.data?.budget)}</strong></div>
      <div class="meta">Generated <strong>${date}</strong></div>
      <div class="verdict">${score >= 70 ? '✅ GO' : score >= 45 ? '⚠️ CAUTION' : '🚫 NO-GO'} — ${verdict.title}</div>
    </div>
  </div>

  ${R_data.a8?.verdict_rationale ? `
  <h2>Executive Summary</h2>
  <p style="color:#334155">${R_data.a8.verdict_rationale}</p>` : ''}

  <div class="kpi-row">
    <div class="kpi"><div class="kpi-val" style="color:${ringColor}">${score}</div><div class="kpi-lbl">Viability Score</div></div>
    <div class="kpi"><div class="kpi-val">${fmt(base.monthly_revenue||0).replace('$','$').replace(/(\d)K/,'$1K') || '—'}</div><div class="kpi-lbl">Base Revenue/mo</div></div>
    <div class="kpi"><div class="kpi-val">${base.breakeven_months ? base.breakeven_months + ' mo' : '—'}</div><div class="kpi-lbl">Break-Even</div></div>
    <div class="kpi"><div class="kpi-val">${topCity?.city?.split(',')[0] || '—'}</div><div class="kpi-lbl">Top Market</div></div>
  </div>

  ${R_data.a7?.scenarios?.length ? `
  <h2>Financial Projections</h2>
  <table>
    <thead><tr><th>Scenario</th><th>Monthly Revenue</th><th>Monthly Net</th><th>Break-Even</th><th>3yr ROI</th></tr></thead>
    <tbody>
      ${R_data.a7.scenarios.map(s => {
        const net = s.monthly_net || 0;
        return `<tr>
          <td><strong>${s.name||'Scenario'}</strong></td>
          <td>${fmt(s.monthly_revenue)}</td>
          <td class="${net>0?'green':'red'}">${fmt(s.monthly_net)}</td>
          <td>${s.breakeven_months ? s.breakeven_months+' months' : '—'}</td>
          <td>${s.roi_3yr != null ? (s.roi_3yr>0?'+':'') + s.roi_3yr + '%' : '—'}</td>
        </tr>`;
      }).join('')}
    </tbody>
  </table>` : ''}

  ${risks.length ? `
  <h2>Risk Matrix</h2>
  ${risks.map(r => {
    const sev = (typeof r === 'object' ? r.severity : 'Medium') || 'Medium';
    const title = typeof r === 'string' ? r : (r.risk || r.title || '');
    const mit   = typeof r === 'object' ? (r.mitigation || r.desc || '') : '';
    return `<div class="risk">
      <span class="risk-badge ${sev.toLowerCase()}">${sev}</span>
      <div><strong>${title}</strong>${mit ? `<br><span style="color:#64748b;font-size:12px">${mit}</span>` : ''}</div>
    </div>`;
  }).join('')}` : ''}

  ${steps.length ? `
  <h2>Recommended Next Steps</h2>
  <ol>
    ${steps.map(s => `<li>${typeof s === 'string' ? s : (s.step || s.title || s.action || '')}</li>`).join('')}
  </ol>` : ''}

  <footer>
    <span>Generated by Business Hunter · AI-Powered Business Analysis</span>
    <span>${date}</span>
  </footer>
</div>
<button class="print-btn" onclick="window.print()">🖨 Save as PDF</button>
</body>
</html>`;

  const w = window.open('', '_blank');
  if (w) { w.document.write(html); w.document.close(); }
  else v2Toast('Pop-ups blocked — allow pop-ups for PDF export');
}

// ── F10: SLIDE DECK EXPORT ────────────────────────────────────────────────
function v2ExportSlides() {
  const R_data  = typeof R !== 'undefined' ? R : {};
  const run     = V2.run || {};
  const ind     = V2_INDUSTRIES.find(i => i.val === (run.industry || V2.wizard?.data?.industry)) || { emoji:'🏢', label:'Business' };
  const score   = run.score || v2CalcScore();
  const verdict = v2ScoreVerdict(score);
  const date    = new Date(run.ts || Date.now()).toLocaleDateString('en-US', { month:'short', year:'numeric' });
  const ringColor = score >= 70 ? '#22c55e' : score >= 45 ? '#f59e0b' : '#ef4444';
  const fmt = v => v ? `$${Number(v).toLocaleString()}` : '—';

  const base    = (R_data.a7?.scenarios||[]).find(s=>(s.name||'').toLowerCase().includes('base'))||R_data.a7?.scenarios?.[1]||{};
  const topCity = (R_data.a2?.cities||[]).sort((a,b)=>(b.gap_score||0)-(a.gap_score||0))[0];
  const risks   = (R_data.a8?.risks||[]).slice(0,4);
  const steps   = (R_data.a8?.next_steps||[]).slice(0,5);
  const grants  = (R_data.a12?.grants||[]).slice(0,3);

  const slides = [
    // Slide 1: Cover
    `<div class="slide cover-slide">
      <div class="slide-num">1 / 12</div>
      <div class="cover-score" style="color:${ringColor}">${score}</div>
      <div class="cover-score-lbl">/ 100 Viability</div>
      <h1>${ind.emoji}<br>${ind.label}</h1>
      <div class="cover-meta">ZIP ${run.zip||V2.wizard?.data?.zip||'—'} · Budget ${fmt(run.budget||V2.wizard?.data?.budget)} · ${date}</div>
      <div class="verdict-chip" style="background:${score>=70?'rgba(34,197,94,.2)':score>=45?'rgba(245,158,11,.2)':'rgba(239,68,68,.2)'};color:${ringColor}">
        ${score>=70?'✅ GO':score>=45?'⚠️ CAUTION':'🚫 NO-GO'} — ${verdict.title}
      </div>
      <div class="slide-brand">Business Hunter · AI Analysis</div>
    </div>`,

    // Slide 2: Executive Summary
    `<div class="slide">
      <div class="slide-num">2 / 12</div>
      <h2>Executive Summary</h2>
      <div class="slide-body">
        ${R_data.a8?.verdict_rationale || R_data.a8?.assessment || '<p style="color:#64748b">Run Agent 8 for executive summary.</p>'}
      </div>
    </div>`,

    // Slide 3: Market Opportunity
    `<div class="slide">
      <div class="slide-num">3 / 12</div>
      <h2>📊 Market Opportunity</h2>
      <div class="slide-body">
        ${topCity ? `<div class="highlight-box">
          <div class="highlight-num">${topCity.gap_score || '—'}/10</div>
          <div class="highlight-lbl">Gap Score — ${topCity.city || 'Top Market'}</div>
        </div>` : ''}
        ${R_data.a2?.summary || '<p>Run Agent 2 for gap analysis.</p>'}
      </div>
    </div>`,

    // Slide 4: Demographics
    `<div class="slide">
      <div class="slide-num">4 / 12</div>
      <h2>👥 Demographics Overview</h2>
      <div class="slide-body">${R_data.a1?.summary || '<p>Run Agent 1 for demographic analysis.</p>'}</div>
    </div>`,

    // Slide 5: Financial Projections
    `<div class="slide">
      <div class="slide-num">5 / 12</div>
      <h2>💰 Financial Projections</h2>
      <div class="fin-kpis">
        ${[
          { label:'Base Revenue/mo', val: fmt(base.monthly_revenue) },
          { label:'Base Net/mo',     val: fmt(base.monthly_net), color: (base.monthly_net||0)>0?'#22c55e':'#ef4444' },
          { label:'Break-Even',      val: base.breakeven_months ? base.breakeven_months+' mo' : '—' },
          { label:'3-Year ROI',      val: base.roi_3yr != null ? (base.roi_3yr>0?'+':'')+base.roi_3yr+'%' : '—' },
        ].map(k => `<div class="fin-kpi"><div class="fin-val" ${k.color?`style="color:${k.color}"`:''}>${k.val}</div><div class="fin-lbl">${k.label}</div></div>`).join('')}
      </div>
      <div style="font-size:12px;color:#64748b;margin-top:12px">${R_data.a7?.summary || ''}</div>
    </div>`,

    // Slide 6: Startup Costs
    `<div class="slide">
      <div class="slide-num">6 / 12</div>
      <h2>💸 Startup Cost Breakdown</h2>
      <div style="font-size:22px;font-weight:900;color:#6366f1;margin-bottom:8px">${fmt(R_data.a7?.total_startup_cost)}</div>
      <div style="font-size:12px;color:#64748b;margin-bottom:16px">Total estimated startup investment</div>
      <div class="cost-grid">
        ${(R_data.a7?.startup_breakdown||[]).slice(0,6).map(item =>
          `<div class="cost-item">
            <span>${typeof item==='string'?item:(item.item||item.category||'')}</span>
            <strong>${typeof item==='object'?fmt(item.cost||item.amount||0):'—'}</strong>
          </div>`).join('') || '<p style="color:#64748b">Run Agent 7 for cost breakdown.</p>'}
      </div>
    </div>`,

    // Slide 7: Competitive Landscape
    `<div class="slide">
      <div class="slide-num">7 / 12</div>
      <h2>🔍 Competitive Landscape</h2>
      <div class="slide-body">
        ${R_data.a6?.summary || '<p>Run Agent 6 for competitive analysis.</p>'}
        ${(R_data.a13?.differentiators||[]).slice(0,3).length ? `
        <div style="margin-top:14px"><strong style="font-size:12px;color:#6366f1">YOUR DIFFERENTIATORS</strong>
          <ul>${(R_data.a13.differentiators||[]).slice(0,3).map(d=>`<li>${typeof d==='string'?d:(d.advantage||d.differentiator||'')}</li>`).join('')}</ul>
        </div>` : ''}
      </div>
    </div>`,

    // Slide 8: Compliance & Timeline
    `<div class="slide">
      <div class="slide-num">8 / 12</div>
      <h2>⚖️ Compliance & Permits</h2>
      <div class="slide-body">
        ${R_data.a5?.summary || '<p>Run Agent 5 for compliance analysis.</p>'}
        ${R_data.a5?.total_timeline_months ? `<div class="highlight-box" style="margin-top:12px"><div class="highlight-num">${R_data.a5.total_timeline_months} mo</div><div class="highlight-lbl">Est. licensing timeline</div></div>` : ''}
      </div>
    </div>`,

    // Slide 9: Site Selection
    `<div class="slide">
      <div class="slide-num">9 / 12</div>
      <h2>📍 Site Selection</h2>
      <div class="slide-body">
        ${(R_data.a3?.sites||[]).slice(0,3).map((s,i) => `
          <div class="site-row">
            <span class="site-num">#${i+1}</span>
            <div><strong>${s.address||s.location||s.name||'Site '+(i+1)}</strong>
              <span style="color:#64748b"> · ${s.city||''}</span>
              <div style="font-size:11px;color:#94a3b8">${s.rent_monthly?`$${Number(s.rent_monthly).toLocaleString()}/mo`:''}${s.sq_ft?` · ${Number(s.sq_ft).toLocaleString()} sqft`:''}</div>
            </div>
          </div>`).join('') || '<p style="color:#64748b">Run Agent 3 for site analysis.</p>'}
      </div>
    </div>`,

    // Slide 10: Grants & Funding
    `<div class="slide">
      <div class="slide-num">10 / 12</div>
      <h2>💵 Grants & Funding</h2>
      <div class="slide-body">
        ${R_data.a12?.summary ? `<p>${R_data.a12.summary}</p>` : ''}
        ${grants.length ? `<ul>${grants.map(g=>`<li><strong>${g.name||g.program}</strong> — ${g.amount||'See report'}</li>`).join('')}</ul>` : '<p style="color:#64748b">Run Agent 12 for grant opportunities.</p>'}
      </div>
    </div>`,

    // Slide 11: Risk Matrix
    `<div class="slide">
      <div class="slide-num">11 / 12</div>
      <h2>⚠️ Key Risks</h2>
      <div class="risk-list">
        ${risks.map(r => {
          const sev = (typeof r === 'object' ? r.severity : 'Medium') || 'Medium';
          const title = typeof r === 'string' ? r : (r.risk || r.title || '');
          return `<div class="risk-row">
            <span class="sev-chip ${sev.toLowerCase()}">${sev.toUpperCase()}</span>
            <span>${title}</span>
          </div>`;
        }).join('') || '<p style="color:#64748b">Run Agent 8 for risk analysis.</p>'}
      </div>
    </div>`,

    // Slide 12: Next Steps
    `<div class="slide">
      <div class="slide-num">12 / 12</div>
      <h2>✅ Recommended Next Steps</h2>
      <ol class="steps-list">
        ${steps.map(s => `<li>${typeof s === 'string' ? s : (s.step || s.title || s.action || '')}</li>`).join('') || '<li>Complete the full pipeline to generate next steps.</li>'}
      </ol>
      <div class="slide-brand" style="margin-top:auto">Business Hunter · businesshunter.ai</div>
    </div>`,
  ];

  const css = `
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Inter',-apple-system,sans-serif;background:#0d0d1a;color:#f1f5f9;overflow:hidden}
    .deck{width:100vw;height:100vh;display:flex;flex-direction:column}
    .nav{display:flex;align-items:center;justify-content:space-between;padding:12px 24px;background:rgba(255,255,255,.05);border-bottom:1px solid rgba(255,255,255,.08);flex-shrink:0}
    .nav-btns{display:flex;gap:10px}
    .nav-btn{padding:7px 16px;border-radius:7px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.08);color:#f1f5f9;font-size:13px;font-weight:600;cursor:pointer}
    .nav-btn:hover{background:rgba(255,255,255,.15)}
    .nav-title{font-size:14px;font-weight:700;background:linear-gradient(135deg,#6366f1,#ec4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
    .slide-wrap{flex:1;overflow:hidden;position:relative}
    .slide{display:none;position:absolute;inset:0;padding:48px 64px;flex-direction:column;overflow:hidden}
    .slide.active{display:flex}
    .slide-num{position:absolute;top:20px;right:24px;font-size:11px;color:rgba(255,255,255,.3);font-weight:600}
    h1{font-size:36px;font-weight:900;letter-spacing:-.03em;margin-bottom:12px;line-height:1.2}
    h2{font-size:22px;font-weight:800;letter-spacing:-.02em;margin-bottom:16px;background:linear-gradient(135deg,#6366f1,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
    .cover-slide{align-items:flex-start;justify-content:center;gap:6px}
    .cover-score{font-size:64px;font-weight:900;letter-spacing:-.04em;line-height:1}
    .cover-score-lbl{font-size:14px;color:#64748b;font-weight:600;margin-bottom:12px}
    .cover-meta{font-size:13px;color:#64748b;margin-bottom:12px}
    .verdict-chip{display:inline-flex;padding:7px 16px;border-radius:999px;font-size:14px;font-weight:700;margin-top:4px}
    .slide-brand{font-size:11px;color:rgba(255,255,255,.2);margin-top:auto;padding-top:16px}
    .slide-body{font-size:13px;color:#94a3b8;line-height:1.65;flex:1;overflow:hidden}
    .slide-body strong{color:#f1f5f9}
    .highlight-box{display:inline-flex;flex-direction:column;align-items:center;background:rgba(99,102,241,.15);border:1px solid rgba(99,102,241,.3);border-radius:12px;padding:14px 20px;margin:0 12px 12px 0}
    .highlight-num{font-size:28px;font-weight:900;color:#6366f1}
    .highlight-lbl{font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.06em}
    .fin-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:16px}
    .fin-kpi{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:14px;text-align:center}
    .fin-val{font-size:20px;font-weight:800;letter-spacing:-.02em;color:#f1f5f9}
    .fin-lbl{font-size:10px;color:#64748b;margin-top:4px;text-transform:uppercase;letter-spacing:.05em}
    .cost-grid{display:flex;flex-direction:column;gap:6px}
    .cost-item{display:flex;justify-content:space-between;padding:8px 12px;background:rgba(255,255,255,.04);border-radius:7px;font-size:13px}
    .site-row{display:flex;align-items:flex-start;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.06)}
    .site-num{font-size:20px;font-weight:900;color:#6366f1;flex-shrink:0;width:28px}
    .risk-list{display:flex;flex-direction:column;gap:10px}
    .risk-row{display:flex;align-items:center;gap:12px;font-size:13px;color:#94a3b8}
    .sev-chip{font-size:10px;font-weight:700;padding:3px 8px;border-radius:4px;flex-shrink:0}
    .sev-chip.high{background:rgba(239,68,68,.2);color:#ef4444}
    .sev-chip.medium{background:rgba(245,158,11,.2);color:#f59e0b}
    .sev-chip.low{background:rgba(34,197,94,.2);color:#22c55e}
    .steps-list{padding-left:20px;display:flex;flex-direction:column;gap:10px;font-size:14px;color:#94a3b8;margin-top:8px}
    .steps-list li::marker{color:#6366f1;font-weight:700}
    ul{padding-left:18px;color:#94a3b8;font-size:13px;display:flex;flex-direction:column;gap:6px;margin-top:8px}
    p{font-size:13px;color:#94a3b8;line-height:1.65}
    @media print{body{background:#fff;color:#0f172a}.nav{display:none}.slide{display:flex!important;position:static;page-break-after:always;background:#fff;height:100vh}.slide-num{color:#94a3b8}h2{-webkit-text-fill-color:#6366f1}p,li{color:#334155}.fin-val,.cover-score{color:#0f172a}.highlight-num{color:#6366f1}.fin-kpi,.highlight-box,.cost-item{background:#f8fafc;border-color:#e2e8f0}.risk-row{color:#334155}}`;

  let currentSlide = 0;
  const w = window.open('', '_blank');
  if (!w) { v2Toast('Pop-ups blocked — allow pop-ups for slides export'); return; }

  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"/>
    <title>${ind.emoji} ${ind.label} — Pitch Deck</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
    <style>${css}</style></head>
    <body>
    <div class="deck">
      <div class="nav">
        <div class="nav-title">${ind.emoji} ${ind.label} — Pitch Deck</div>
        <div class="nav-btns">
          <button class="nav-btn" onclick="prevSlide()">← Prev</button>
          <button class="nav-btn" id="slide-counter">1 / 12</button>
          <button class="nav-btn" onclick="nextSlide()">Next →</button>
          <button class="nav-btn" onclick="window.print()">🖨 Print All</button>
        </div>
      </div>
      <div class="slide-wrap">
        ${slides.map((s,i) => s.replace('class="slide', `class="slide${i===0?' active':''}`)).join('\n')}
      </div>
    </div>
    <script>
      let cur = 0;
      const count = ${slides.length};
      function show(n) {
        document.querySelectorAll('.slide').forEach((s,i) => s.classList.toggle('active', i===n));
        document.getElementById('slide-counter').textContent = (n+1)+' / '+count;
        cur = n;
      }
      function nextSlide() { show(Math.min(cur+1, count-1)); }
      function prevSlide() { show(Math.max(cur-1, 0)); }
      document.addEventListener('keydown', e => {
        if (e.key==='ArrowRight'||e.key==='ArrowDown') nextSlide();
        if (e.key==='ArrowLeft'||e.key==='ArrowUp') prevSlide();
      });
    <\/script>
    </body></html>`);
  w.document.close();
}

// ── F11: AGENT CONFIDENCE SCORES ──────────────────────────────────────────
function v2GetAgentConfidence(id) {
  const R_data = typeof R !== 'undefined' ? R : {};
  const data   = R_data['a' + id];
  if (!data) return null;

  // Demo mode — all data is synthetic
  if (typeof demoMode !== 'undefined' && demoMode) {
    return { pct: 100, label: 'Demo', color: 'var(--v2-blue)', badge: 'blue' };
  }

  const keys = Object.keys(data).filter(k => data[k] !== null && data[k] !== undefined);
  if (!keys.length) return { pct: 0, label: 'Empty', color: 'var(--v2-red)', badge: 'red' };

  // Heuristic: completeness of expected fields
  let pct = 40;
  if (data.summary || data.verdict || data.cities || data.scenarios || data.grants) pct += 25;
  if (keys.length > 4) pct += 15;
  if (data.sources || data.citations || data.data_sources) pct += 10;
  if (data.live || data.real_time || data.timestamp) pct += 10;
  pct = Math.min(pct, 95); // never 100% since we can't fully verify

  const label = pct >= 80 ? 'High' : pct >= 55 ? 'Medium' : 'Low';
  const color  = pct >= 80 ? 'var(--v2-green)' : pct >= 55 ? 'var(--v2-amber)' : 'var(--v2-red)';
  const badge  = pct >= 80 ? 'green' : pct >= 55 ? 'amber' : 'red';
  return { pct, label, color, badge };
}

// ── F12: ZIP AUTOCOMPLETE ─────────────────────────────────────────────────
let _v2ZipLookupTimer = null;

async function v2LookupZIP(zip) {
  const el = document.getElementById('wiz-zip-preview');
  if (!el) return;
  if (!/^\d{5}$/.test(zip)) { el.textContent = ''; return; }

  clearTimeout(_v2ZipLookupTimer);
  el.textContent = '⏳ Looking up…';
  _v2ZipLookupTimer = setTimeout(async () => {
    try {
      const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
      if (!res.ok) { el.textContent = '⚠️ ZIP not found'; return; }
      const d    = await res.json();
      const city = d.places[0]['place name'];
      const st   = d.places[0]['state abbreviation'];
      el.textContent = `📍 ${city}, ${st}`;
      el.style.color = 'var(--v2-green)';
    } catch { el.textContent = ''; }
  }, 400);
}

// ── F4: LIVE DATA REFRESH PER-AGENT ──────────────────────────────────────
function v2RefreshAgentData(id) {
  if (typeof reRunAgent === 'function') {
    reRunAgent(id);
    v2Toast(`🔄 Refreshing ${V2_AGENTS.find(a=>a.id===id)?.name || 'Agent '+id}…`);
  } else {
    v2Toast('Live refresh not available in demo mode');
  }
}

// ── F5: INLINE R DATA EDITOR ──────────────────────────────────────────────
function v2ShowREditor() {
  const modal = document.getElementById('v2-reditor-modal');
  if (!modal) return;
  const R_data = typeof R !== 'undefined' ? R : {};

  const base     = (R_data.a7?.scenarios||[]).find(s=>(s.name||'').toLowerCase().includes('base'))||R_data.a7?.scenarios?.[1]||{};
  const topCity  = (R_data.a2?.cities||[]).sort((a,b)=>(b.gap_score||0)-(a.gap_score||0))[0];
  const currentScore = v2CalcScore();

  document.getElementById('v2-reditor-content').innerHTML = `
    <div class="v2-modal-header">
      <div>
        <div class="v2-modal-title">🔧 Edit Key Analysis Data</div>
        <div style="font-size:12px;color:var(--v2-t3);margin-top:3px">Correct AI mistakes. Changes update the viability score live.</div>
      </div>
      <button class="v2-modal-close" onclick="v2CloseREditor()">✕</button>
    </div>
    <div class="v2-re-fields">
      <div class="v2-field">
        <label>Gap Score — ${topCity?.city || 'Top City'} (0–10)</label>
        <input class="v2-input" id="re-gap" type="number" min="0" max="10" step="0.1"
          value="${topCity?.gap_score ?? ''}" placeholder="e.g. 7.5" />
        <div style="font-size:11px;color:var(--v2-t3);margin-top:4px">Current: ${topCity?.gap_score ?? '—'} · Drives 25% of score</div>
      </div>
      <div class="v2-field">
        <label>Base Monthly Revenue ($)</label>
        <input class="v2-input" id="re-rev" type="number" min="0"
          value="${base.monthly_revenue || ''}" placeholder="e.g. 85000" />
      </div>
      <div class="v2-field">
        <label>Base Monthly Net Profit ($)</label>
        <input class="v2-input" id="re-net" type="number"
          value="${base.monthly_net || ''}" placeholder="e.g. 33000" />
      </div>
      <div class="v2-field">
        <label>Break-Even (months)</label>
        <input class="v2-input" id="re-be" type="number" min="1"
          value="${base.breakeven_months || ''}" placeholder="e.g. 16" />
      </div>
      <div class="v2-field">
        <label>AI Verdict</label>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
          ${['go','caution','no-go'].map(v => {
            const cur = (R_data.a8?.verdict || '').toLowerCase();
            return `<div class="v2-choose-item${cur.includes(v)?' selected':''}" onclick="this.parentElement.querySelectorAll('.v2-choose-item').forEach(el=>el.classList.remove('selected'));this.classList.add('selected');this.dataset.val='${v}'" data-tag="re-verdict" data-val="${v}" style="justify-content:center">
              <span class="lbl">${v.toUpperCase()}</span>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:20px;align-items:center">
      <span style="font-size:12px;color:var(--v2-t3)">Current score: <strong>${currentScore}/100</strong></span>
      <button class="v2-btn ghost" onclick="v2CloseREditor()">Cancel</button>
      <button class="v2-btn primary" onclick="v2SaveREdits()">Apply Changes</button>
    </div>`;
  modal.classList.add('open');
}

function v2CloseREditor() {
  document.getElementById('v2-reditor-modal')?.classList.remove('open');
}

function v2SaveREdits() {
  const R_data = typeof R !== 'undefined' ? R : {};

  const gapVal = parseFloat(document.getElementById('re-gap')?.value);
  const revVal = parseInt(document.getElementById('re-rev')?.value);
  const netVal = parseInt(document.getElementById('re-net')?.value);
  const beVal  = parseInt(document.getElementById('re-be')?.value);
  const verdEl = document.querySelector('[data-tag="re-verdict"].selected');

  // Apply to R object
  if (!isNaN(gapVal) && R_data.a2?.cities?.length) {
    const top = [...R_data.a2.cities].sort((a,b)=>(b.gap_score||0)-(a.gap_score||0))[0];
    if (top) top.gap_score = gapVal;
  }
  const base = (R_data.a7?.scenarios||[]).find(s=>(s.name||'').toLowerCase().includes('base'))||R_data.a7?.scenarios?.[1];
  if (base) {
    if (!isNaN(revVal)) base.monthly_revenue = revVal;
    if (!isNaN(netVal)) base.monthly_net     = netVal;
    if (!isNaN(beVal))  base.breakeven_months = beVal;
  }
  if (verdEl && R_data.a8) {
    R_data.a8.verdict = verdEl.dataset.val;
  }

  v2CloseREditor();
  // Re-render dashboard
  if (V2.run) v2RenderDashboard(V2.run);
  v2Toast('✓ Data updated · Score recalculated');
}

// ── INIT ──────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  // Check for wizard draft when on landing page
  setTimeout(v2CheckWizardDraft, 1000);
});
