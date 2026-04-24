function renderHmap(containerId, cities, dims) {
  if(!cities||!cities.length){$(containerId).innerHTML='';return;}
  const maxes=dims.map(dim=>Math.max(...cities.map(c=>c[dim.key]||0)));
  let html=`<div class="hmap-col-row">`;
  cities.forEach(c=>html+=`<div class="hmap-col">${(c.name||'').split(' ')[0]}</div>`);
  html+=`</div><div class="hmap">`;
  dims.forEach((dim,di)=>{
    html+=`<div class="hmap-row"><div class="hmap-lbl">${dim.label}</div>`;
    cities.forEach(c=>{
      const val=c[dim.key]||0;
      const pct=maxes[di]>0?val/maxes[di]:0;
      const lvl=Math.min(5,Math.round(pct*5));
      const disp=dim.fmt?dim.fmt(val):val;
      html+=`<div class="hmap-cell h${lvl}" title="${c.name}: ${disp}">${disp}</div>`;
    });
    html+=`</div>`;
  });
  html+=`</div>`;
  $(containerId).innerHTML=html;
}

// ══════════════════════════════════════════════════════════
// AGENT 1 — Demographics (Census / ACS / GIS)
// ══════════════════════════════════════════════════════════
