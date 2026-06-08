// ══════════════════════════════════════════════════════════
// _nv — "null-safe value" display helper
// Use everywhere a value from agent JSON is rendered.
// Returns fallback (default "N/A") when value is:
//   null, undefined, 0 (for numbers), empty string,
//   "N/A", "Information not available", "n/a"
// Pass a formatter function for numbers, e.g.:
//   _nv(c.median_hh_income, v => '$' + (v/1000).toFixed(0) + 'k')
// ══════════════════════════════════════════════════════════
function _esc(val) {
  if (val === null || val === undefined) return '';
  return String(val)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function _safeUrl(url) {
  if (!url) return '';
  try {
    const u = new URL(String(url), window.location.origin);
    if (!['http:', 'https:', 'mailto:'].includes(u.protocol)) return '';
    return _esc(u.href);
  } catch {
    return '';
  }
}

function _safeHtml(text) {
  const raw = _esc(text);
  return raw
    .replace(/&lt;br\s*\/?&gt;/gi, '<br>')
    .replace(/&lt;strong&gt;([\s\S]*?)&lt;\/strong&gt;/gi, '<strong>$1</strong>')
    .replace(/&lt;b&gt;([\s\S]*?)&lt;\/b&gt;/gi, '<strong>$1</strong>')
    .replace(/&lt;em&gt;([\s\S]*?)&lt;\/em&gt;/gi, '<em>$1</em>');
}

function _nv(val, formatter, fallback) {
  if (fallback === undefined) fallback = 'N/A';
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'string') {
    const t = val.trim().toLowerCase();
    if (t === '' || t === 'n/a' || t === 'information not available' || t === 'not available' || t === 'unknown') return fallback;
    return formatter ? formatter(val) : _esc(val);
  }
  if (typeof val === 'number') {
    if (!isFinite(val)) return fallback;
    // Only treat 0 as N/A when explicitly checking — caller passes formatter for numerics
    return formatter ? formatter(val) : String(val);
  }
  return formatter ? formatter(val) : _esc(val);
}

// _toArr — safely coerce any value to an array.
// Handles: null/undefined → [], plain object → Object.values(), string → [],
// already an array → as-is. Prevents "forEach/filter is not a function" when
// the AI returns an object instead of an array.
function _toArr(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'object') return Object.values(val);
  return [];
}

// _nvNum — like _nv but treats 0 as missing (use for counts/prices where 0 means "not found")
function _nvNum(val, formatter, fallback) {
  if (fallback === undefined) fallback = 'N/A';
  if (val === null || val === undefined || val === 0) return fallback;
  return _nv(val, formatter, fallback);
}

function renderHmap(containerId, cities, dims, onCellClick) {
  if(!cities||!cities.length){$(containerId).innerHTML='';return;}
  const maxes=dims.map(dim=>Math.max(...cities.map(c=>c[dim.key]||0)));
  let html=`<div class="hmap-col-row">`;
  cities.forEach(c=>html+=`<div class="hmap-col">${_esc((c.name||c.city||'').split(' ')[0])}</div>`);
  html+=`</div><div class="hmap">`;
  dims.forEach((dim,di)=>{
    html+=`<div class="hmap-row"><div class="hmap-lbl">${_esc(dim.label)}</div>`;
    cities.forEach(c=>{
      const cityRaw=String(c.name||c.city||'');
      const cityName=cityRaw.replace(/\\/g,'\\\\').replace(/'/g,'\\x27').replace(/\n/g,' ');
      const val=c[dim.key]||0;
      const pct=maxes[di]>0?val/maxes[di]:0;
      const lvl=Math.min(5,Math.round(pct*5));
      const rawDisp=dim.fmt?dim.fmt(val):val;
      const disp=_esc(rawDisp);
      const title=_esc(`${cityRaw}: ${rawDisp}`);
      const dimKey=String(dim.key||'').replace(/'/g,'\\x27');
      const dimLabel=String(dim.label||'').replace(/'/g,'\\x27');
      if(onCellClick){
        html+=`<div class="hmap-cell h${lvl} clickable" onclick="${onCellClick}('${cityName}','${dimKey}','${dimLabel}',${Number(val)||0})" title="${title} - click for details">${disp}</div>`;
      } else {
        html+=`<div class="hmap-cell h${lvl}" title="${title}">${disp}</div>`;
      }
    });
    html+=`</div>`;
  });
  html+=`</div>`;
  $(containerId).innerHTML=html;
}

// ══════════════════════════════════════════════════════════
// AGENT 1 — Demographics (Census / ACS / GIS)
// ══════════════════════════════════════════════════════════
