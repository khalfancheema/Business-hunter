/**
 * SVG Market Map builder for the daycare agent system.
 * Renders an interactive SVG map of the Atlanta metro area
 * with color-coded city pins based on gap scores.
 *
 * No tile service required — coordinates are projected onto
 * a static SVG viewport using a simple linear lat/lng projection.
 */

// Viewport bounds for the Atlanta metro area SVG
const BOUNDS = {
  latMin: 33.80, latMax: 34.35,
  lngMin: -84.55, lngMax: -83.60,
  svgW: 800, svgH: 520,
};

/** Convert lat/lng to SVG x/y coordinates */
export function project(lat, lng) {
  const x = ((lng - BOUNDS.lngMin) / (BOUNDS.lngMax - BOUNDS.lngMin)) * BOUNDS.svgW;
  const y = ((BOUNDS.latMax - lat) / (BOUNDS.latMax - BOUNDS.latMin)) * BOUNDS.svgH;
  return { x: Math.round(x), y: Math.round(y) };
}

/** Map gap score (0–10) to a fill color */
export function gapColor(score) {
  if (score >= 9) return '#3dd68c'; // Critical Opportunity — green
  if (score >= 7) return '#f5a623'; // High Opportunity — amber
  if (score >= 5) return '#4a9eff'; // Moderate — blue
  if (score >= 3) return '#a78bfa'; // Low — purple
  return '#ff5f5f';                  // Saturated/Avoid — red
}

/** Map gap score to a label */
export function gapLabel(score) {
  if (score >= 9) return 'Critical Opportunity';
  if (score >= 7) return 'High Opportunity';
  if (score >= 5) return 'Moderate';
  if (score >= 3) return 'Low Opportunity';
  return 'Saturated — Avoid';
}

/** Map gap score to radius (scales with unserved children count) */
export function pinRadius(unservedChildren, base = 18) {
  return Math.min(36, base + Math.sqrt(unservedChildren / 20));
}

/**
 * Build the full SVG map HTML string.
 * @param {object} data - Agent 11 JSON output
 * @param {string} mode - 'gap' | 'demand' | 'competitors'
 * @returns {string} - Full SVG element as a string
 */
export function buildMapSVG(data, mode = 'gap') {
  const { cities = [], center, real_estate_pins = [] } = data;

  const getScore = (city) => {
    if (mode === 'demand') return city.demand_score;
    if (mode === 'competitors') return Math.max(0, 10 - city.competitor_count);
    return city.gap_score;
  };

  const getColor = (city) => {
    if (mode === 'competitors') {
      const s = Math.max(0, 10 - city.competitor_count);
      return gapColor(s);
    }
    return gapColor(getScore(city));
  };

  let svg = `<svg viewBox="0 0 ${BOUNDS.svgW} ${BOUNDS.svgH}"
    xmlns="http://www.w3.org/2000/svg"
    style="width:100%;height:100%;display:block;background:#1e2026;border-radius:10px">
    <defs>
      <filter id="shadow">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.5)"/>
      </filter>
    </defs>`;

  // Draw 40-mile radius circle from center
  if (center) {
    const cp = project(center.lat, center.lng);
    const latMile = (40 / 69);
    const radiusPx = (latMile / (BOUNDS.latMax - BOUNDS.latMin)) * BOUNDS.svgH;
    svg += `<circle cx="${cp.x}" cy="${cp.y}" r="${Math.round(radiusPx)}"
      fill="none" stroke="#363a44" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.7"/>`;
  }

  // Draw real estate pins
  real_estate_pins.forEach((pin) => {
    const { x, y } = project(pin.lat, pin.lng);
    svg += `
      <a href="${pin.url}" target="_blank">
        <rect x="${x - 10}" y="${y - 10}" width="20" height="20" rx="4"
          fill="#25282f" stroke="#4a9eff" stroke-width="1.5"
          filter="url(#shadow)" opacity="0.9"/>
        <text x="${x}" y="${y + 4}" text-anchor="middle"
          font-size="11" fill="#4a9eff">🏢</text>
      </a>`;
  });

  // Draw city pins
  cities.forEach((city) => {
    const { x, y } = project(city.lat, city.lng);
    const color = getColor(city);
    const r = pinRadius(city.unserved_children || 200);
    const score = getScore(city);
    const label = mode === 'gap' ? `Gap: ${city.gap_score}/10`
      : mode === 'demand' ? `Demand: ${city.demand_score}/10`
      : `Competitors: ${city.competitor_count}`;

    svg += `
      <g class="city-pin" data-city="${city.name}" style="cursor:pointer">
        <circle cx="${x}" cy="${y}" r="${r}"
          fill="${color}" opacity="0.25" filter="url(#shadow)"/>
        <circle cx="${x}" cy="${y}" r="${Math.round(r * 0.65)}"
          fill="${color}" opacity="0.85"/>
        <text x="${x}" y="${y + 4}" text-anchor="middle"
          font-size="${Math.min(13, r * 0.7)}" font-weight="700"
          font-family="Syne,sans-serif" fill="#000">${score}</text>
        <text x="${x}" y="${y + r + 14}" text-anchor="middle"
          font-size="10" font-weight="600"
          font-family="Syne,sans-serif" fill="#f0f0ee">${city.name}</text>
        <text x="${x}" y="${y + r + 24}" text-anchor="middle"
          font-size="9" font-family="Instrument Sans,sans-serif"
          fill="#8a8d96">${city.county} Co.</text>
      </g>`;
  });

  // Draw center marker
  if (center) {
    const cp = project(center.lat, center.lng);
    svg += `
      <circle cx="${cp.x}" cy="${cp.y}" r="6"
        fill="#4a9eff" stroke="#fff" stroke-width="2"/>
      <text x="${cp.x}" y="${cp.y + 18}" text-anchor="middle"
        font-size="9" font-family="Syne,sans-serif" fill="#4a9eff">
        ${center.label}
      </text>`;
  }

  svg += '</svg>';
  return svg;
}

/**
 * Build the legend HTML for the map.
 * @returns {string} HTML string
 */
export function buildLegendHTML() {
  const items = [
    { color: '#3dd68c', label: 'Critical Opportunity (9–10)' },
    { color: '#f5a623', label: 'High Opportunity (7–8)' },
    { color: '#4a9eff', label: 'Moderate (5–6)' },
    { color: '#a78bfa', label: 'Low Opportunity (3–4)' },
    { color: '#ff5f5f', label: 'Saturated — Avoid (0–2)' },
    { color: '#4a9eff', label: '🏢 Real Estate Pin', border: true },
  ];

  return `<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:10px;align-items:center">
    ${items.map(i => `
      <div style="display:flex;align-items:center;gap:6px;font-size:11px;
        color:#8a8d96;font-family:'Syne',sans-serif">
        <div style="width:12px;height:12px;border-radius:50%;
          background:${i.color};flex-shrink:0;
          ${i.border ? 'border:1.5px solid #4a9eff' : ''}"></div>
        ${i.label}
      </div>`).join('')}
  </div>`;
}
