// ══════════════════════════════════════════════════════════════
// V2 AI Answers Widget — floating Q&A
// Bug #3 fix: z-index 400 (CSS) — below wizard overlay z-index 900
// ══════════════════════════════════════════════════════════════

var aiWidgetOpen = false;
var aiMessages = [];
var aiThinking = false;

function v2ToggleAiWidget() {
  aiWidgetOpen = !aiWidgetOpen;
  var panel = document.getElementById('aiWidgetPanel');
  var btn = document.getElementById('aiWidgetBtn');
  if (panel) panel.classList.toggle('open', aiWidgetOpen);
  if (btn) btn.textContent = aiWidgetOpen ? '✕ Close' : '✨ AI Answers';
  if (aiWidgetOpen && !aiMessages.length) {
    aiMessages.push({ role: 'assistant', text: 'Hi! I can answer questions about your analysis results, industry benchmarks, or help interpret agent outputs. What would you like to know?' });
    v2RenderAiMessages();
    setTimeout(function() {
      var inp = document.getElementById('aiWidgetInput');
      if (inp) inp.focus();
    }, 100);
  }
}

function v2RenderAiMessages() {
  var container = document.getElementById('aiWidgetMessages');
  if (!container) return;
  container.innerHTML = aiMessages.map(function(m) {
    return '<div class="ai-msg ' + m.role + '">' + m.text + '</div>';
  }).join('');
  container.scrollTop = container.scrollHeight;
}

function v2AiSend() {
  if (aiThinking) return;
  var inp = document.getElementById('aiWidgetInput');
  if (!inp) return;
  var q = inp.value.trim();
  if (!q) return;
  inp.value = '';

  aiMessages.push({ role: 'user', text: q });
  v2RenderAiMessages();

  // If no API key or no results, give a helpful fallback
  var k = typeof key === 'function' ? key() : '';
  if (!k && !demoMode) {
    aiMessages.push({ role: 'assistant', text: 'Please enter your API key first (via the 🔑 API Key button), or enable Demo Mode to use AI Answers.' });
    v2RenderAiMessages();
    return;
  }

  aiThinking = true;
  var sendBtn = document.getElementById('aiWidgetSend');
  if (sendBtn) sendBtn.disabled = true;

  aiMessages.push({ role: 'assistant', text: '⋯' });
  v2RenderAiMessages();

  // Build context summary from R
  var ctx = '';
  if (Object.keys(R).length) {
    var a8 = R.a8 || {};
    var a3 = R.a3 || {};
    var a7 = R.a7 || {};
    var parts = [];
    if (a8.verdict) parts.push('Verdict: ' + a8.verdict);
    if (a8.assessment) parts.push('Assessment: ' + a8.assessment.slice(0, 400));
    var locs = a3.locations || a3.sites || [];
    if (locs.length) parts.push('Top location: ' + (locs[0].city || locs[0].name || ''));
    if (a7.summary) parts.push('Financials: ' + a7.summary.slice(0, 300));
    ctx = parts.join('\n');
  }

  var system = 'You are an AI business analyst assistant embedded in Business Hunter, a market viability analysis tool. Answer questions concisely and helpfully based on the analysis context provided. If no context is available, answer from general business knowledge. Keep responses under 200 words.';
  var user = (ctx ? 'Analysis context:\n' + ctx + '\n\nUser question: ' : '') + q;

  var provider = (typeof PROVIDERS !== 'undefined') ? (PROVIDERS[(typeof getCurrentProvider === 'function' ? getCurrentProvider() : 'anthropic')] || PROVIDERS.anthropic) : null;

  if (!provider || demoMode) {
    // Demo fallback answer
    setTimeout(function() {
      aiMessages[aiMessages.length - 1] = { role: 'assistant', text: v2AiDemoAnswer(q) };
      v2RenderAiMessages();
      aiThinking = false;
      if (sendBtn) sendBtn.disabled = false;
    }, 800);
    return;
  }

  var body = provider.buildBody(system, user, '');
  fetch(provider.url, { method: 'POST', headers: provider.headers(k), body: JSON.stringify(body) })
    .then(function(r) { return r.json(); })
    .then(function(d) {
      var text = provider.extractText(d) || 'Sorry, I couldn\'t generate a response.';
      aiMessages[aiMessages.length - 1] = { role: 'assistant', text: text };
      v2RenderAiMessages();
    })
    .catch(function() {
      aiMessages[aiMessages.length - 1] = { role: 'assistant', text: 'Sorry, there was an error reaching the AI. Check your API key and try again.' };
      v2RenderAiMessages();
    })
    .finally(function() {
      aiThinking = false;
      if (sendBtn) sendBtn.disabled = false;
    });
}

function v2AiDemoAnswer(q) {
  q = q.toLowerCase();
  if (q.includes('verdict') || q.includes('go')) return 'The demo analysis returns a GO verdict with a score of 82.7/100, indicating strong market viability for a daycare in the Gwinnett County area.';
  if (q.includes('budget') || q.includes('cost')) return 'The standard $600K budget covers buildout, equipment, working capital for 6 months, and DECAL licensing costs. The base-case model projects break-even at month 17.';
  if (q.includes('city') || q.includes('location')) return 'Top cities ranked by opportunity score: 1. Suwanee (score 88), 2. Sugar Hill (84), 3. Duluth (79). Suwanee shows the strongest demand-supply gap with 420 unserved children.';
  if (q.includes('revenue') || q.includes('income')) return 'Base-case Year 1 annual revenue: $1.24M. Revenue streams include tuition by age group (infant/toddler/pre-K), USDA CACFP meal reimbursements (~$45K/year), and GA CAPS subsidy income.';
  if (q.includes('competitor') || q.includes('competition')) return 'The area has 8 Primrose Schools, 3 KinderCare, and ~22 independent centers within 40 miles. Gap analysis identifies 6 cities where supply falls short of demand by 30%+ based on working-parent ratios.';
  return 'That\'s a great question about your business analysis! In demo mode I\'m using pre-loaded data. Enter a real API key and run the full pipeline for analysis tailored to your specific ZIP code and parameters.';
}

// Allow Enter key to send
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && document.activeElement && document.activeElement.id === 'aiWidgetInput') {
    v2AiSend();
  }
});
