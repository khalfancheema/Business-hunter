// /api/llm - server-side LLM proxy for production deployments.
// Keeps provider API keys in Vercel/server environment variables instead of
// exposing them to browser JavaScript.
//
// Frontend POST shape:
//   { provider, model, system, user, opts }
//
// Supported env vars:
//   ANTHROPIC_API_KEY, OPENAI_API_KEY, GEMINI_API_KEY, DEEPSEEK_API_KEY
//   OPENAI_COMPAT_API_KEY, OPENAI_COMPAT_URL

const PROVIDERS = {
  anthropic: {
    env: 'ANTHROPIC_API_KEY',
    url: 'https://api.anthropic.com/v1/messages',
    defaultModel: 'claude-sonnet-4-6',
    headers: key => ({
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    }),
    body: ({ model, system, user, opts = {} }) => {
      const body = {
        model,
        max_tokens: 8192,
        system,
        messages: [{ role: 'user', content: user }],
      };
      if (opts.webSearch) {
        body.tools = [{
          type: 'web_search_20250305',
          name: 'web_search',
          max_uses: Math.min(Number(opts.webSearchMaxUses) || 5, 10),
        }];
      }
      return body;
    },
    extractText: data => (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n'),
    extractStop: data => data.stop_reason,
  },
  openai: {
    env: 'OPENAI_API_KEY',
    url: 'https://api.openai.com/v1/chat/completions',
    defaultModel: 'gpt-4o',
    headers: key => ({ Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' }),
    body: ({ model, system, user }) => ({
      model,
      max_tokens: 8192,
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    }),
    extractText: data => data.choices?.[0]?.message?.content || '',
    extractStop: data => data.choices?.[0]?.finish_reason,
  },
  deepseek: {
    env: 'DEEPSEEK_API_KEY',
    url: 'https://api.deepseek.com/chat/completions',
    defaultModel: 'deepseek-chat',
    headers: key => ({ Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' }),
    body: ({ model, system, user }) => ({
      model,
      max_tokens: 8192,
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    }),
    extractText: data => data.choices?.[0]?.message?.content || '',
    extractStop: data => data.choices?.[0]?.finish_reason,
  },
  gemini: {
    env: 'GEMINI_API_KEY',
    defaultModel: 'gemini-1.5-pro',
    url: key => `https://generativelanguage.googleapis.com/v1beta/models/:model:generateContent?key=${encodeURIComponent(key)}`,
    headers: () => ({ 'Content-Type': 'application/json' }),
    body: ({ system, user }) => ({
      contents: [{ parts: [{ text: system + '\n\n' + user }] }],
      generationConfig: { maxOutputTokens: 8192 },
    }),
    extractText: data => data.candidates?.[0]?.content?.parts?.[0]?.text || '',
    extractStop: data => data.candidates?.[0]?.finishReason,
  },
  openai_compat: {
    env: 'OPENAI_COMPAT_API_KEY',
    urlEnv: 'OPENAI_COMPAT_URL',
    defaultModel: 'llama3',
    headers: key => ({ Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' }),
    body: ({ model, system, user }) => ({
      model,
      max_tokens: 8192,
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    }),
    extractText: data => data.choices?.[0]?.message?.content || '',
    extractStop: data => data.choices?.[0]?.finish_reason,
  },
};

function webSearchUnsupportedNotice(providerKey) {
  const label = providerKey === 'openai' ? 'OpenAI'
    : providerKey === 'gemini' ? 'Google Gemini'
    : providerKey === 'deepseek' ? 'DeepSeek'
    : providerKey === 'openai_compat' ? 'OpenAI-compatible'
    : providerKey;
  return `

CRITICAL - WEB SEARCH UNAVAILABLE:
- This request asked for live web search, but the active provider (${label}) does not expose a web-search tool in this app.
- Do not claim that you searched the web, checked live sources, browsed, or verified current pages.
- Use only the verified REAL DATA CONTEXT supplied in the prompt and any upstream agent context.
- For any current fact, source, citation, business listing, price, rate, count, or URL that is not present in the supplied context, return null/"N/A"/"Information not available" per the schema.
- Lower your confidence when a requested value depends on live search that is unavailable.`;
}

function corsHeaders(req) {
  const allowed = (process.env.ALLOWED_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
  const origin = req.headers.origin || '';
  const host = req.headers['x-forwarded-host'] || req.headers.host || '';
  const sameOrigin = !origin || origin === `https://${host}` || origin === `http://${host}`;
  const allow = allowed.length ? allowed.includes(origin) || allowed.includes('*') : sameOrigin;
  const fallbackOrigin = host ? `https://${host}` : 'null';
  return {
    'Access-Control-Allow-Origin': allow ? origin || fallbackOrigin : 'null',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '600',
    Vary: 'Origin',
  };
}

function safeOpts(opts = {}) {
  return {
    webSearch: opts.webSearch === true,
    webSearchMaxUses: Math.min(Number(opts.webSearchMaxUses) || 5, 10),
  };
}

export default async function handler(req, res) {
  const cors = corsHeaders(req);
  for (const [k, v] of Object.entries(cors)) res.setHeader(k, v);

  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'POST only' }); return; }

  let payload;
  try { payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; }
  catch { res.status(400).json({ error: 'invalid JSON body' }); return; }

  const provider = payload?.provider || 'anthropic';
  const cfg = PROVIDERS[provider];
  if (!cfg) {
    res.status(400).json({ error: 'unknown provider: ' + provider, available: Object.keys(PROVIDERS) });
    return;
  }

  const system = String(payload?.system || '');
  const user = String(payload?.user || '');
  const model = String(payload?.model || cfg.defaultModel);
  if (!system || !user) { res.status(400).json({ error: 'system and user are required' }); return; }

  const key = process.env[cfg.env];
  if (!key) { res.status(503).json({ error: `server missing ${cfg.env} env var` }); return; }

  let url = typeof cfg.url === 'function' ? cfg.url(key) : cfg.url;
  if (provider === 'gemini') url = url.replace(':model', encodeURIComponent(model));
  if (provider === 'openai_compat') {
    url = process.env[cfg.urlEnv];
    if (!url || !/^https?:\/\//i.test(url)) {
      res.status(503).json({ error: `server missing valid ${cfg.urlEnv} env var` });
      return;
    }
  }

  const opts = safeOpts(payload?.opts);
  const guardedSystem = opts.webSearch && provider !== 'anthropic'
    ? system + webSearchUnsupportedNotice(provider)
    : system;
  const body = cfg.body({ model, system: guardedSystem, user, opts });
  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers: cfg.headers(key),
      body: JSON.stringify(body),
    });
    const data = await upstream.json().catch(async () => ({ error: { message: await upstream.text() } }));
    if (!upstream.ok || data.error) {
      res.status(upstream.status || 502).json({ error: data.error?.message || 'upstream LLM error' });
      return;
    }
    const stop = cfg.extractStop(data);
    res.status(200).json({ text: cfg.extractText(data), stop });
  } catch (e) {
    res.status(502).json({ error: 'upstream LLM fetch failed: ' + (e.message || String(e)) });
  }
}
