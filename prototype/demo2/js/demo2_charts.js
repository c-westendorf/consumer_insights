// InsightOS Demo2 — Chart Renderers (Extended)
// All 4 market cells clickable; B&O revenue-weighted color; cohort projection annotation.

// ── Market Cell Waterfall (all cells clickable) ───────────────────────────
function renderMarketCellWaterfall(containerId, data, onCellClick) {
  const cells   = data.marketCells;
  const x       = ['Prior Week', ...cells.map(c => c.label), 'Current Week'];
  const y       = [100, ...cells.map(c => c.waterfallContribution), null];
  const measure = ['absolute', ...cells.map(() => 'relative'), 'total'];

  const cellText = cells.map(c => {
    const pp  = c.waterfallContribution;
    const sign = pp > 0 ? '+' : '';
    const dollar = c.financialImpact?.dollarMM ?? 0;
    const dsign  = dollar > 0 ? '+' : '';
    return `${sign}${pp.toFixed(1)} pp<br>${dsign}$${Math.abs(dollar).toFixed(1)}mm`;
  });

  const trace = {
    type: 'waterfall',
    x,
    y,
    measure,
    textposition: 'outside',
    text: ['Baseline', ...cellText, '\u22120.8% WoW'],
    connector: { line: { color: '#DDE1E7', width: 1 } },
    increasing: { marker: { color: '#00A650' } },
    decreasing: { marker: { color: '#CC0000' } },
    totals:     { marker: { color: '#0033A0' } },
    hovertemplate: '%{x}<br>%{text}<extra></extra>'
  };

  const layout = {
    title: { text: 'Market Cell Contribution to \u0394 Retail Value WoW', font: { size: 14, color: '#1A1A2E' } },
    xaxis: { tickangle: -15, tickfont: { size: 12 } },
    yaxis: { title: 'Index / pp contribution', tickfont: { size: 11 } },
    margin: { t: 54, b: 60, l: 60, r: 30 },
    height: 360,
    plot_bgcolor: '#F5F7FA',
    paper_bgcolor: '#FFFFFF',
    font: { family: 'Open Sans, Helvetica Neue, Arial, sans-serif' },
    annotations: [{
      x: 'Northeast \u2014 Urban',
      y: -1.3,
      xref: 'x', yref: 'y',
      text: '\u21d3 Click for story card',
      showarrow: true, arrowhead: 2, arrowsize: 0.8,
      ax: 0, ay: 40,
      font: { size: 10, color: '#0033A0' },
      bgcolor: '#E8EEFF', bordercolor: '#0033A0', borderwidth: 1, borderpad: 3
    }]
  };

  Plotly.newPlot(containerId, [trace], layout, { responsive: true, displayModeBar: false });

  document.getElementById(containerId).on('plotly_click', function (eventData) {
    const clickedLabel = eventData.points[0].x;
    const cell = data.marketCells.find(c => c.label === clickedLabel);
    if (cell && onCellClick) onCellClick(cell);
  });
}

// ── Cohort Decay (with projection annotation + target reference line) ──────
function renderCohortDecayChart(containerId, data) {
  const qData = data.quarterly.cohortDecay;
  const target = Math.round(qData.targetRetention * 100);
  const proj   = Math.round(qData.neUrbanProjectedQ4 * 100);

  const sunbelt = {
    x: qData.quarters,
    y: qData.sunbeltRetention.map(v => Math.round(v * 100)),
    type: 'scatter', mode: 'lines+markers',
    name: 'Sunbelt \u2014 Suburban',
    line: { color: '#00A650', width: 3 },
    marker: { size: 9 },
    hovertemplate: '%{x}: %{y}%<extra>Sunbelt\u2014Suburban</extra>'
  };

  const neUrban = {
    x: qData.quarters,
    y: qData.neUrbanRetention.map(v => Math.round(v * 100)),
    type: 'scatter', mode: 'lines+markers',
    name: 'Northeast \u2014 Urban',
    line: { color: '#CC0000', width: 3, dash: 'dot' },
    marker: { size: 9 },
    hovertemplate: '%{x}: %{y}%<extra>NE\u2014Urban</extra>'
  };

  // Dashed target reference line (shape)
  const layout = {
    title: { text: 'New \u2192 Repeat Retention Rate by Market', font: { size: 14, color: '#1A1A2E' } },
    xaxis: { title: 'Quarter', tickfont: { size: 11 } },
    yaxis: { title: 'Retention Rate (%)', range: [30, 70], ticksuffix: '%', tickfont: { size: 11 } },
    legend: { orientation: 'h', y: -0.28 },
    margin: { t: 54, b: 80, l: 60, r: 30 },
    height: 340,
    plot_bgcolor: '#F5F7FA',
    paper_bgcolor: '#FFFFFF',
    font: { family: 'Open Sans, Helvetica Neue, Arial, sans-serif' },
    shapes: [{
      type: 'line',
      x0: 0, x1: 1, xref: 'paper',
      y0: target, y1: target, yref: 'y',
      line: { color: '#0033A0', width: 1.5, dash: 'dashdot' }
    }],
    annotations: [
      {
        x: 'Q1 2025', y: target + 1.5,
        xref: 'x', yref: 'y',
        text: `Target: ${target}%`,
        showarrow: false,
        font: { size: 10, color: '#0033A0' }
      },
      {
        x: 'Q1 2025', y: Math.round(qData.neUrbanRetention[3] * 100) - 4,
        xref: 'x', yref: 'y',
        text: `\u21d2 Projected ${proj}% by Q4 2025`,
        showarrow: true, arrowhead: 2, arrowsize: 0.8,
        ax: 60, ay: 30,
        font: { size: 10, color: '#CC0000' },
        bgcolor: '#FFEBEE', bordercolor: '#CC0000', borderwidth: 1, borderpad: 3
      }
    ]
  };

  Plotly.newPlot(containerId, [sunbelt, neUrban], layout, { responsive: true, displayModeBar: false });
}

// ── Decay Trend Sparkline (in modal) ──────────────────────────────────────
function renderDecayTrendChart(containerId, diagData) {
  const trace = {
    x: diagData.weekLabels,
    y: diagData.trend.map(v => Math.round(v * 100)),
    type: 'scatter', mode: 'lines+markers',
    line: { color: '#CC0000', width: 2.5 },
    marker: { size: 8 },
    fill: 'tozeroy', fillcolor: 'rgba(204,0,0,0.07)',
    hovertemplate: '%{x}: %{y}%<extra></extra>'
  };

  const layout = {
    title: { text: `${diagData.label}: 4-week trend`, font: { size: 12 } },
    xaxis: { tickfont: { size: 11 } },
    yaxis: { ticksuffix: '%', range: [0, Math.max(...diagData.trend) * 130], tickfont: { size: 11 } },
    margin: { t: 36, b: 36, l: 44, r: 20 },
    height: 180,
    paper_bgcolor: '#FFFFFF',
    plot_bgcolor: '#F5F7FA'
  };

  Plotly.newPlot(containerId, [trace], layout, { responsive: true, displayModeBar: false });
}

// ── 10-Year Cohort CLV Aging Projection (quarterly) ───────────────────────
function renderCohortAgingChart(containerId, data) {
  const cp    = data.demographics.clvProjection;
  const years = cp.years.map(String);

  // Total CLV line (sum of all cohorts)
  const totals = cp.years.map((_, i) =>
    cp.boomer[i] + cp.genX[i] + cp.millennial[i] + cp.genZ[i]);

  const makeTrace = (name, y, color, dash) => ({
    x: years, y,
    type: 'scatter', mode: 'lines+markers',
    name,
    line: { color, width: 2.5, dash: dash || 'solid' },
    marker: { size: 8 },
    hovertemplate: `%{x}: $%{y}mm<extra>${name}</extra>`
  });

  const traces = [
    makeTrace('Boomer',          cp.boomer,     '#E87722', 'dot'),
    makeTrace('Gen X',           cp.genX,       '#00A650'),
    makeTrace('Millennial',      cp.millennial, '#0033A0'),
    makeTrace('Gen Z',           cp.genZ,       '#9C27B0', 'dash'),
    {
      x: years, y: totals,
      type: 'scatter', mode: 'lines',
      name: 'Total CLV pool',
      line: { color: '#1A1A2E', width: 3, dash: 'dashdot' },
      hovertemplate: 'Total %{x}: $%{y}mm<extra>Total</extra>'
    }
  ];

  // Annotation at peak total
  const peakIdx  = totals.indexOf(Math.max(...totals));
  const peakYear = years[peakIdx];
  const peakVal  = totals[peakIdx];

  const layout = {
    title: { text: 'CLV Pool by Generation \u2014 2025\u20132035 Projection', font: { size: 14, color: '#1A1A2E' } },
    xaxis: { title: 'Year', tickfont: { size: 11 } },
    yaxis: { title: 'CLV Pool ($mm)', tickprefix: '$', ticksuffix: 'mm', tickfont: { size: 11 } },
    legend: { orientation: 'h', y: -0.28 },
    margin: { t: 54, b: 80, l: 70, r: 30 },
    height: 360,
    plot_bgcolor: '#F5F7FA',
    paper_bgcolor: '#FFFFFF',
    font: { family: 'Open Sans, Helvetica Neue, Arial, sans-serif' },
    annotations: [
      {
        x: peakYear, y: peakVal + 30,
        xref: 'x', yref: 'y',
        text: `\u25b2 Total CLV peak: $${peakVal}mm (~${peakYear})`,
        showarrow: true, arrowhead: 2, arrowsize: 0.8,
        ax: 40, ay: -30,
        font: { size: 10, color: '#1A1A2E' },
        bgcolor: '#F5F7FA', bordercolor: '#1A1A2E', borderwidth: 1, borderpad: 3
      },
      {
        x: '2031', y: cp.boomer[3] - 60,
        xref: 'x', yref: 'y',
        text: 'Boomer deceleration\naccelerates post-2031',
        showarrow: true, arrowhead: 2, arrowsize: 0.8,
        ax: -60, ay: 20,
        font: { size: 9, color: '#E87722' },
        bgcolor: '#FFF3E0', bordercolor: '#E87722', borderwidth: 1, borderpad: 3
      },
      {
        x: '2033', y: cp.millennial[4] + 40,
        xref: 'x', yref: 'y',
        text: 'Millennial + Gen Z\nreplacement window',
        showarrow: true, arrowhead: 2, arrowsize: 0.8,
        ax: 50, ay: -20,
        font: { size: 9, color: '#0033A0' },
        bgcolor: '#E3ECFF', bordercolor: '#0033A0', borderwidth: 1, borderpad: 3
      }
    ]
  };

  Plotly.newPlot(containerId, traces, layout, { responsive: true, displayModeBar: false });
}
