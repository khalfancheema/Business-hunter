// ══════════════════════════════════════════════════════════
// _nv — "null-safe value" display helper
// Use everywhere a value from agent JSON is rendered.
// Returns fallback (default "N/A") when value is:
//   null, undefined, 0 (for numbers), empty string,
//   "N/A", "Information not available", "n/a"
// Pass a formatter function for numbers, e.g.:
//   _nv(c.median_hh_income, v => '$' + (v/1000).toFixed(0) + 'k')
// ══════════════════════════════════════════════════════════
function _nv(val, formatter, fallback) {
  if (fallback === undefined) fallback = 'N/A';
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'string') {
    const t = val.trim().toLowerCase();
    if (t === '' || t === 'n/a' || t === 'information not available' || t === 'not available' || t === 'unknown') return fallback;
    return formatter ? formatter(val) : val;
  }
  if (typeof val === 'number') {
    if (!isFinite(val)) return fallback;
    // Only treat 0 as N/A when explicitly checking — caller passes formatter for numerics
    return formatter ? formatter(val) : String(val);
  }
  return formatter ? formatter(val) : String(val);
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
  cities.forEach(c=>html+=`<div class="hmap-col">${(c.name||c.city||'').split(' ')[0]}</div>`);
  html+=`</div><div class="hmap">`;
  dims.forEach((dim,di)=>{
    html+=`<div class="hmap-row"><div class="hmap-lbl">${dim.label}</div>`;
    cities.forEach(c=>{
      const cityName=(c.name||c.city||'').replace(/'/g,'\\x27');
      const val=c[dim.key]||0;
      const pct=maxes[di]>0?val/maxes[di]:0;
      const lvl=Math.min(5,Math.round(pct*5));
      const disp=dim.fmt?dim.fmt(val):val;
      if(onCellClick){
        html+=`<div class="hmap-cell h${lvl} clickable" onclick="${onCellClick}('${cityName}','${dim.key}','${dim.label}',${val})" title="${c.name||c.city}: ${disp} — click for details">${disp}</div>`;
      } else {
        html+=`<div class="hmap-cell h${lvl}" title="${c.name||c.city}: ${disp}">${disp}</div>`;
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
