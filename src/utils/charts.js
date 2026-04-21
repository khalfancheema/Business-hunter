/**
 * Chart.js rendering helpers for the daycare agent system.
 * All charts use the dark theme CSS variables defined in main.css.
 *
 * Requires Chart.js 4.4.1+ loaded globally via CDN:
 * https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js
 */

const COLORS = {
  blue:   'rgba(74,158,255,0.7)',
  green:  'rgba(61,214,140,0.7)',
  amber:  'rgba(245,166,35,0.7)',
  red:    'rgba(255,95,95,0.7)',
  purple: 'rgba(167,139,250,0.7)',
  teal:   'rgba(45,212,191,0.7)',
};

const BORDER_COLORS = {
  blue:   '#4a9eff',
  green:  '#3dd68c',
  amber:  '#f5a623',
  red:    '#ff5f5f',
  purple: '#a78bfa',
  teal:   '#2dd4bf',
};

const AXIS_OPTS = {
  ticks: { color: '#8a8d96' },
  grid:  { color: '#2a2d35' },
};

/** Destroy a chart instance if it exists */
export function killChart(charts, id) {
  if (charts[id]) {
    try { charts[id].destroy(); } catch {}
    delete charts[id];
  }
}

/** Render a grouped bar chart */
export function barChart(ctx, labels, datasets, opts = {}) {
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: datasets.map((ds, i) => ({
        backgroundColor: Object.values(COLORS)[i % 6],
        borderWidth: 0,
        borderRadius: 4,
        ...ds,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#8a8d96', font: { size: 11 } } },
        ...opts.plugins,
      },
      scales: {
        x: { ...AXIS_OPTS, ticks: { ...AXIS_OPTS.ticks, font: { size: 9 } } },
        y: { ...AXIS_OPTS },
        ...opts.scales,
      },
      ...opts,
    },
  });
}

/** Render a horizontal bar chart */
export function horizontalBarChart(ctx, labels, data, opts = {}) {
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: Object.values(COLORS),
        borderWidth: 0,
        borderRadius: 4,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, ...opts.plugins },
      scales: {
        x: { ...AXIS_OPTS },
        y: { ...AXIS_OPTS, ticks: { ...AXIS_OPTS.ticks, font: { size: 10 } } },
      },
      ...opts,
    },
  });
}

/** Render a line chart (good for P&L projections) */
export function lineChart(ctx, labels, datasets, opts = {}) {
  const colorKeys = Object.keys(BORDER_COLORS);
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: datasets.map((ds, i) => ({
        borderColor: BORDER_COLORS[colorKeys[i % colorKeys.length]],
        backgroundColor: `${BORDER_COLORS[colorKeys[i % colorKeys.length]]}18`,
        tension: 0.4,
        fill: false,
        pointRadius: 3,
        borderWidth: 2,
        ...ds,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#8a8d96', font: { size: 11 } } },
        ...opts.plugins,
      },
      scales: {
        x: { ...AXIS_OPTS, ticks: { ...AXIS_OPTS.ticks, font: { size: 9 } } },
        y: { ...AXIS_OPTS },
        ...opts.scales,
      },
      ...opts,
    },
  });
}

/** Render a doughnut / pie chart */
export function doughnutChart(ctx, labels, data, opts = {}) {
  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: Object.values(COLORS).map(c => c.replace('0.7', '0.85')),
        borderColor: '#16181c',
        borderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { color: '#8a8d96', font: { size: 11 }, padding: 12 },
        },
        ...opts.plugins,
      },
      ...opts,
    },
  });
}

/** Render a radar chart (good for multi-dimension scoring) */
export function radarChart(ctx, labels, datasets, opts = {}) {
  const colorKeys = Object.keys(BORDER_COLORS);
  return new Chart(ctx, {
    type: 'radar',
    data: {
      labels,
      datasets: datasets.map((ds, i) => ({
        borderColor: BORDER_COLORS[colorKeys[i % colorKeys.length]],
        backgroundColor: `${BORDER_COLORS[colorKeys[i % colorKeys.length]]}14`,
        borderWidth: 2,
        pointRadius: 3,
        ...ds,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#8a8d96', font: { size: 11 } } },
        ...opts.plugins,
      },
      scales: {
        r: {
          ticks: { color: '#8a8d96', backdropColor: 'transparent' },
          grid: { color: '#2a2d35' },
          pointLabels: { color: '#8a8d96', font: { size: 10 } },
          min: 60, max: 100,
          ...opts.rScale,
        },
      },
      ...opts,
    },
  });
}
