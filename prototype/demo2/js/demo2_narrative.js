// InsightOS Demo2 — Narrative Generators (Expanded)
// Includes: confidence badge, signal strip, financial narrative, reconciliation table,
//           story card (with subsegment table + forward projection), leading indicators,
//           decision brief, and monthly/quarterly narrative helpers.

// ── Helpers ───────────────────────────────────────────────────────────────
function fmtDollar(mm) {
  const sign = mm > 0 ? '+' : '';
  return `${sign}$${Math.abs(mm).toFixed(1)}mm`;
}
function fmtPP(pp) {
  const sign = pp > 0 ? '+' : '';
  return `${sign}${(pp * 100).toFixed(1)} pp`;
}
function fmtPct(v) {
  const sign = v > 0 ? '+' : '';
  return `${sign}${(v * 100).toFixed(1)}%`;
}
function sentClass(v) { return v > 0 ? 'positive' : v < 0 ? 'negative' : 'neutral'; }

// ── Confidence Badge (expandable with coverage pyramid + reliability note) ──
function renderConfidenceBadge(data) {
  const lvl = data.confidenceLevel.toLowerCase();
  const pct = Math.round(data.coverage.permissioned * 100);
  const rx  = Math.round(data.coverage.rxLinkage * 100);
  const ex  = data.confidenceExplainer;

  // Coverage pyramid rows
  const pyramidRows = ex.pyramid.map(row => {
    const barPct = Math.round(row.pct * 100);
    const isBlind = row.pct === 0.42; // inferred row
    return `
      <div class="cp-row">
        <div class="cp-tier">${row.tier}</div>
        <div class="cp-bar-track">
          <div class="cp-bar" style="width:${barPct}%;background:${isBlind ? '#DDE1E7' : row.color};"></div>
        </div>
        <div class="cp-pct" style="color:${isBlind ? '#767676' : row.color};">${barPct}%</div>
        <div class="cp-desc">${row.desc}</div>
      </div>`;
  }).join('');

  // Threshold legend
  const threshRows = Object.entries(ex.thresholds).map(([k, v]) => {
    const cls = k === 'high' ? '#1B5E20' : k === 'medium' ? '#7B5800' : '#B71C1C';
    return `<div style="font-size:0.76rem;margin-bottom:5px;"><strong style="color:${cls};">${k.charAt(0).toUpperCase()+k.slice(1)}:</strong> ${v}</div>`;
  }).join('');

  return `
    <div class="confidence-container">
      <div class="confidence-summary" onclick="toggleConfidencePanel(this)" role="button" aria-expanded="false">
        <span class="confidence-badge ${lvl}">
          <span class="cb-dot"></span>${data.confidenceLevel} Confidence
        </span>
        <div class="confidence-detail">${pct}% known identity &middot; ${rx}% Rx-linked &nbsp;<span class="cp-expand-hint">&#9660; what does this mean?</span></div>
      </div>
      <div class="confidence-panel">
        <div class="cp-section">
          <div class="cp-label">Data coverage pyramid &mdash; who we can see and how</div>
          ${pyramidRows}
        </div>
        <div class="cp-section cp-reliability">
          ${ex.reliabilityNote}
        </div>
        <div class="cp-section" style="margin-bottom:0;">
          <div class="cp-label">Confidence thresholds</div>
          ${threshRows}
        </div>
      </div>
    </div>`;
}

// ── Signal Strip ─────────────────────────────────────────────────────────
function renderSignalStrip(data) {
  const ss = data.signalStrip;
  const redCount  = ss.signals.filter(s => s.status === 'red').length;
  const amberCount= ss.signals.filter(s => s.status === 'amber').length;

  const signalRows = ss.signals.map(s => {
    const arrow = s.direction === 'down' ? '&darr;' : '&uarr;';
    const dotCls = s.status === 'red' ? 'sig-red' : s.status === 'amber' ? 'sig-amber' : 'sig-green';
    return `
      <tr>
        <td><span class="sig-dot ${dotCls}"></span></td>
        <td style="font-weight:600;font-size:0.86rem;">${s.label}</td>
        <td style="text-align:center;font-size:1rem;color:${s.status === 'red' ? '#CC0000' : '#E87722'};">${arrow}</td>
        <td style="font-size:0.82rem;color:#767676;">${s.detail}</td>
      </tr>`;
  }).join('');

  return `
    <div class="signal-strip ${ss.overallStatus.toLowerCase()}" id="signal-strip"
         onclick="toggleSignalStrip(this)" role="button" aria-expanded="false">
      <div class="ss-summary">
        <span class="ss-icon">&#9888;</span>
        <span class="ss-text">
          <strong>${redCount} signal${redCount !== 1 ? 's' : ''} deteriorating</strong>,
          ${amberCount} watchful &mdash; <em>${ss.affectedCell}</em>
        </span>
        <span class="ss-toggle">Expand &nbsp;<span class="toggle-arrow">&#9660;</span></span>
      </div>
      <div class="ss-body" style="display:none;margin-top:12px;">
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr>
              <th style="width:20px;"></th>
              <th style="text-align:left;font-size:0.74rem;color:#767676;padding:4px 8px;text-transform:uppercase;">Signal</th>
              <th style="font-size:0.74rem;color:#767676;padding:4px 8px;text-transform:uppercase;">Dir</th>
              <th style="text-align:left;font-size:0.74rem;color:#767676;padding:4px 8px;text-transform:uppercase;">Detail</th>
            </tr>
          </thead>
          <tbody>${signalRows}</tbody>
        </table>
        <a href="#leading-indicators-section" style="display:inline-block;margin-top:10px;font-size:0.82rem;color:#0033A0;font-weight:600;">
          View full leading indicator diagnostics &rarr;
        </a>
      </div>
    </div>`;
}

// ── Weekly Narrative (with $ context) ────────────────────────────────────
function generateWeeklyNarrative(data) {
  const t   = data.topline;
  const r   = data.reconciliation;
  const neg = data.marketCells.find(c => c.waterfallContribution < 0);
  const pos = data.marketCells.find(c => c.waterfallContribution > 0);
  const leadWeeks = data.leadingIndicators.find(li => li.strength === 'Strong')?.leadWeeks || 2;

  const bullets = [
    `Retail value declined <strong>${fmtDollar(t.retailDollarMM)} (${fmtPct(t.retailWoW)} WoW)</strong>, concentrated in <strong>${neg ? neg.label : '—'}</strong> <em>(${fmtDollar(neg?.financialImpact?.dollarMM || 0)} drag)</em> partially offset by <strong>${pos ? pos.label : '—'}</strong> <em>(${fmtDollar(pos?.financialImpact?.dollarMM || 0)})</em>.`,
    `<strong>Frequency</strong> is the primary driver <em>(${fmtDollar(r.frequency.dollarMM)})</em>; basket is partially offsetting <em>(${fmtDollar(r.basket.dollarMM)})</em>. Frequency decline is <strong>accelerating week-over-week</strong>.`,
    `Two leading signals turned negative in <strong>${neg ? neg.label : '—'}</strong>: <strong>Planning intent</strong> and <strong>Rx-attach rate</strong>. Both carry <strong>${leadWeeks}-week lead times</strong> &mdash; this week&rsquo;s softness was telegraphed in last week&rsquo;s behavioral data.`
  ];

  return `<ul class="narrative-list">${bullets.map(b => `<li>${b}</li>`).join('')}</ul>`;
}

// ── Monthly Narrative ─────────────────────────────────────────────────────
function generateMonthlyNarrative(data) {
  return `<ul class="narrative-list">${data.monthlyNarrativeBullets.map(b => `<li>${b}</li>`).join('')}</ul>`;
}

// ── Quarterly Narrative ───────────────────────────────────────────────────
function generateQuarterlyNarrative(data) {
  return `<ul class="narrative-list">${data.quarterly.narrativeBullets.map(b => `<li>${b}</li>`).join('')}</ul>`;
}

// ── Reconciliation Table (with $ Impact + trend arrow) ───────────────────
function renderReconciliationTable(data) {
  const r = data.reconciliation;
  const maxAbs = Math.max(...Object.values(r).map(v => Math.abs(v.pp)));
  const barMax = 130; // px

  const trendArrow = (dir) => {
    if (dir === 'worsening') return `<span style="color:#CC0000;font-size:1rem;">&#8679;</span>`;
    if (dir === 'improving') return `<span style="color:#00A650;font-size:1rem;">&#8681;</span>`;
    return `<span style="color:#767676;">&#8594;</span>`;
  };

  const rows = [
    { label: 'Active base (shoppers)',    key: 'activeBase' },
    { label: 'Frequency (trips/shopper)', key: 'frequency'  },
    { label: 'Basket / Margin',           key: 'basket'     },
    { label: 'Promo / Cost',              key: 'promoCost'  },
    { label: '<strong>Total</strong>',    key: 'total'      }
  ];

  const rowsHtml = rows.map(({ label, key }) => {
    const d    = r[key];
    const pp   = d.pp;
    const cls  = pp > 0 ? 'positive' : pp < 0 ? 'negative' : 'neutral';
    const barW = Math.round((Math.abs(pp) / maxAbs) * barMax);
    const isTotal = key === 'total';
    return `
      <tr${isTotal ? ' class="recon-total-row"' : ''}>
        <td>${label}</td>
        <td class="recon-bar-cell">
          <span class="recon-bar ${cls}" style="width:${barW}px"></span>
        </td>
        <td class="pp-value ${cls}" style="white-space:nowrap;">${fmtPP(pp)}</td>
        <td class="pp-value ${cls}" style="white-space:nowrap;font-size:0.88rem;">${fmtDollar(d.dollarMM)}</td>
        <td style="text-align:center;">${trendArrow(d.trendDir)}</td>
      </tr>`;
  }).join('');

  return `
    <table class="reconciliation-table">
      <thead>
        <tr>
          <th>Driver component</th>
          <th>Contribution</th>
          <th>&Delta; pp</th>
          <th>$ Impact</th>
          <th>Trend</th>
        </tr>
      </thead>
      <tbody>${rowsHtml}</tbody>
    </table>
    <p style="font-size:0.76rem;color:#767676;margin-top:8px;">
      &Delta; Retail Value = &Delta; Active Base + &Delta; Frequency + &Delta; Basket/Margin &minus; &Delta; Promo/Cost
      &nbsp;&bull;&nbsp; Trend arrow = direction vs. prior week
    </p>`;
}

// ── Story Card (with subsegment table, forward projection, Decision Brief) ─
function renderStoryCard(cell) {
  const sc = cell.storyCard;
  const maxAbs = Math.max(Math.abs(sc.mixEffect.pp), Math.abs(sc.performanceEffect.pp));
  const mixW  = Math.round((Math.abs(sc.mixEffect.pp)  / maxAbs) * 100);
  const perfW = Math.round((Math.abs(sc.performanceEffect.pp) / maxAbs) * 100);

  const effectRow = (label, effect, isPerf) => {
    const ppCls = effect.pp > 0 ? 'positive' : 'negative';
    const barCls = effect.pp > 0 ? 'positive' : 'negative';
    const barW  = isPerf ? perfW : mixW;
    return `
      <div class="effect-row${isPerf ? ' perf-row' : ''}">
        <div class="effect-label">${label}</div>
        <div class="effect-bar-track">
          <div class="effect-bar ${barCls}" style="width:${barW}%"></div>
        </div>
        <div class="effect-pp ${ppCls}" style="white-space:nowrap;">${fmtPP(effect.pp)}</div>
        <div class="effect-dollar ${ppCls}" style="white-space:nowrap;font-size:0.82rem;">${fmtDollar(effect.dollarMM)}</div>
        <div class="effect-desc">${effect.description}</div>
      </div>`;
  };

  // Subsegment table
  const subRows = sc.subsegmentBreakdown.map(s => {
    const wowCls    = sentClass(s.wowPct);
    const dollarCls = sentClass(s.dollarMM);
    // Share of cell and enterprise columns
    const cellSharePct = s.shareOfCell !== undefined
      ? Math.round(Math.abs(s.shareOfCell) * 100)
      : null;
    const entSharePct  = s.shareOfEnterprise !== undefined
      ? Math.round(Math.abs(s.shareOfEnterprise) * 100)
      : null;
    const cellShareCls = (s.shareOfCell || 0) < 0 ? 'negative' : 'positive';
    const entShareCls  = (s.shareOfEnterprise || 0) < 0 ? 'negative' : 'positive';
    return `
      <tr>
        <td>${s.label}</td>
        <td style="text-align:right;">${s.custK}K</td>
        <td class="${wowCls}" style="text-align:right;">${fmtPct(s.wowPct)}</td>
        <td class="${dollarCls}" style="text-align:right;font-weight:600;">${fmtDollar(s.dollarMM)}</td>
        <td class="${cellShareCls}" style="text-align:right;font-size:0.82rem;">${cellSharePct !== null ? cellSharePct + '%' : '—'}</td>
        <td class="${entShareCls}"  style="text-align:right;font-size:0.82rem;">${entSharePct  !== null ? entSharePct  + '%' : '—'}</td>
        <td><span class="bo-cls-badge bo-${s.boCls.toLowerCase().replace('-','').replace(' ','')}">${s.boCls}</span></td>
      </tr>`;
  }).join('');

  return `
    <div class="story-card" id="story-card">
      <div class="story-card-header">
        <span>${cell.label}: Mix vs. Performance Split</span>
        <span style="font-weight:400;font-size:0.85rem;">Total: <strong>${fmtPP(sc.totalContribution)}</strong> &nbsp; <strong>${fmtDollar(cell.financialImpact.dollarMM)}</strong></span>
      </div>
      <div class="story-card-body">
        ${effectRow('Mix effect', sc.mixEffect, false)}
        ${effectRow('Performance effect', sc.performanceEffect, true)}

        <!-- Subsegment breakdown -->
        <div style="padding:16px 20px;border-top:1px solid var(--ios-border);">
          <div style="font-size:0.8rem;font-weight:700;text-transform:uppercase;color:#767676;margin-bottom:10px;">
            Customer type breakdown &mdash; ${cell.label}
          </div>
          <table class="subsegment-table">
            <thead>
              <tr>
                <th style="text-align:left;">Customer type</th>
                <th style="text-align:right;">Customers</th>
                <th style="text-align:right;">WoW%</th>
                <th style="text-align:right;">$ Impact</th>
                <th style="text-align:right;">% of cell</th>
                <th style="text-align:right;">% of enterprise</th>
                <th>B&O class</th>
              </tr>
            </thead>
            <tbody>${subRows}</tbody>
          </table>
        </div>

        <!-- Forward projection -->
        <div class="forward-projection">
          <span class="fp-icon">&#8594;</span>
          <span>${sc.forwardProjection}</span>
        </div>

        <!-- Decision Brief -->
        ${renderDecisionBrief(sc.decisionBrief)}
      </div>
    </div>`;
}

// ── Decision Brief (collapsed card) ──────────────────────────────────────
function renderDecisionBrief(db) {
  const sigCls = db.signal.toLowerCase();
  const sigIcon = db.signal === 'Escalate' ? '&#8679;' : db.signal === 'Monitor' ? '&#9679;' : '&#10003;';
  const optionsHtml = db.options.map((o, i) =>
    `<li><strong>Option ${i+1}:</strong> ${o}</li>`).join('');

  return `
    <div class="decision-brief">
      <div class="db-header expandable-toggle" onclick="toggleDB(this)">
        <span class="db-signal ${sigCls}">${sigIcon} ${db.signal}</span>
        <span class="db-title">Decision Brief &mdash; <span style="font-weight:700;">${db.stakes.split('.')[0]}</span></span>
        <span class="toggle-arrow" style="margin-left:auto;">&#9660;</span>
      </div>
      <div class="db-body expandable-body">
        <div class="db-grid">
          <div class="db-row"><span class="db-label">Situation</span><span>${db.situation}</span></div>
          <div class="db-row"><span class="db-label">Stakes</span><span style="font-weight:600;">${db.stakes}</span></div>
          <div class="db-row"><span class="db-label">Options</span><ul class="db-options">${optionsHtml}</ul></div>
          <div class="db-row"><span class="db-label">Recommended</span><span>${db.recommended}</span></div>
        </div>
      </div>
    </div>`;
}

// ── Leading Indicators Panel ──────────────────────────────────────────────
function renderLeadingIndicatorsPanel(data) {
  const rows = data.leadingIndicators.map(li => {
    const dirIcon = li.direction === 'down'
      ? '<span class="direction-icon down">&darr;</span>'
      : '<span class="direction-icon up">&uarr;</span>';
    const strBadge = `<span class="strength-badge ${li.strength.toLowerCase()}">${li.strength}</span>`;
    return `
      <tr>
        <td>${li.signal}</td>
        <td style="text-align:center">${dirIcon}</td>
        <td style="text-align:center;white-space:nowrap;">${li.leadWeeks}w prior</td>
        <td>${strBadge}</td>
        <td style="white-space:nowrap;">${li.stabilityWindow}</td>
      </tr>`;
  }).join('');

  return `
    <table class="li-table">
      <thead>
        <tr>
          <th>Leading Signal</th>
          <th style="text-align:center;">Direction</th>
          <th style="text-align:center;">Lead Time</th>
          <th>Strength</th>
          <th>Stability Window</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="li-narrative">${data.leadingIndicatorsNarrative}</div>`;
}

// ── Signal Recurrence Panel (quarterly, with magnitude column) ────────────
function renderSignalRecurrence(containerId, data) {
  const sr = data.quarterly.signalRecurrence;

  const signals = [
    { label: 'Planning intent &darr;', fired: sr.planningIntentFired, magnitude: sr.planningIntentMagnitude },
    { label: 'Rx-attach &darr;',       fired: sr.rxAttachFired,       magnitude: sr.rxAttachMagnitude       },
    { label: 'Decline followed',       fired: sr.declineFollowed,     magnitude: sr.declineMagnitude        }
  ];

  let html = `<div class="signal-recurrence">`;
  // Quarter label headers
  html += `<div class="sr-row"><div class="sr-label-cell"></div>`;
  sr.quarters.forEach(q => { html += `<div class="sr-quarter-cell"><div class="q-label">${q}</div></div>`; });
  html += `</div>`;

  signals.forEach(sig => {
    html += `<div class="sr-row"><div class="sr-label-cell">${sig.label}</div>`;
    sig.fired.forEach((fired, i) => {
      const mag = sig.magnitude ? sig.magnitude[i] : null;
      if (fired) {
        html += `<div class="sr-quarter-cell"><div class="sr-dot fired" title="${sr.quarters[i]}: ${mag||''}">&#10003;</div>${mag ? `<div class="sr-mag">${mag}</div>` : ''}</div>`;
      } else {
        html += `<div class="sr-quarter-cell"><div class="sr-dot missed" title="${sr.quarters[i]}: not observed">&mdash;</div></div>`;
      }
    });
    html += `</div>`;
  });

  html += `<p class="sr-note">${sr.note}</p></div>`;
  document.getElementById(containerId).innerHTML = html;
}

// ── Age Band Strip (appended inside enterprise snapshot) ──────────────────
function renderAgeBandStrip(data) {
  const bands = data.demographics.enterprise.bands;
  const neSkew = data.demographics.cellAgeSkew.ne_urban;
  const entMedian = data.demographics.enterprise.medianAgeCurrent;
  const entMedian2035 = data.demographics.enterprise.medianAge2035;

  const segments = bands.map(b =>
    `<div class="ab-segment" style="flex:${b.pct};background:${b.color};" title="${b.gen} ${Math.round(b.pct*100)}%">
      ${b.pct >= 0.18 ? Math.round(b.pct*100)+'%' : ''}
    </div>`
  ).join('');

  const legend = bands.map(b =>
    `<div class="ab-leg-item">
      <span class="ab-leg-dot" style="background:${b.color};"></span>
      <span><strong>${b.gen}</strong> ${Math.round(b.pct*100)}% &middot; ${b.healthcarePhase}</span>
    </div>`
  ).join('');

  return `
    <div class="age-band-strip">
      <div class="ab-label">&#128101; Customer base age profile &mdash; ${data.reportWeek}</div>
      <div class="ab-bar-row">${segments}</div>
      <div class="ab-legend">${legend}</div>
      <div class="ab-callout">
        <strong>NE&mdash;Urban skews older</strong>: median age ${neSkew.medianAge} vs. enterprise ${entMedian}
        &nbsp;&bull;&nbsp; <strong>Boomers ${Math.round(neSkew.boomersPlus*100)}%</strong> of NE&mdash;Urban (vs. enterprise 24%)
        &nbsp;&bull;&nbsp; <strong>Boomer peak spend: NOW</strong> (2024&ndash;2028)
        &nbsp;&bull;&nbsp; Enterprise median drifts to ${entMedian2035} by 2035 if Gen Z acquisition flat
      </div>
    </div>`;
}

// ── Generational B&O Breakdown (monthly) ─────────────────────────────────
function renderGenerationalBOBreakdown(data) {
  const gbo = data.demographics.genBoBreakdown;
  const bands = data.demographics.enterprise.bands;

  const rows = gbo.labels.map((gen, i) => {
    const highPct  = Math.round(gbo.high[i]      * 100);
    const medPct   = Math.round(gbo.medium[i]    * 100);
    const lowPct   = Math.round(gbo.low[i]       * 100);
    const uePct    = Math.round(gbo.unengaged[i] * 100);
    const color    = bands[i]?.color || '#767676';
    const isAnchor = gen === 'Boomer' || gen === 'Silent';
    const isGap    = gen === 'Gen Z';
    const rowCls   = isAnchor ? 'gen-anchor' : isGap ? 'gen-gap' : '';

    // Mini bars
    const bar = (pct, clr) =>
      `<span class="gen-bo-bar" style="width:${pct*2}px;background:${clr};margin-right:3px;" title="${pct}%"></span>`;

    return `
      <tr class="${rowCls}">
        <td><span style="display:inline-flex;align-items:center;gap:6px;">
          <span style="width:10px;height:10px;border-radius:50%;background:${color};display:inline-block;flex-shrink:0;"></span>
          <strong>${gen}</strong> <span style="font-size:0.75rem;color:#767676;">${bands[i]?.years||''}</span>
        </span></td>
        <td style="text-align:right;font-weight:700;color:#1B5E20;">${highPct}%
          <br>${bar(highPct,'#1B5E20')}</td>
        <td style="text-align:right;font-weight:700;color:#0033A0;">${medPct}%
          <br>${bar(medPct,'#0033A0')}</td>
        <td style="text-align:right;font-weight:600;color:#7B3800;">${lowPct}%</td>
        <td style="text-align:right;font-weight:600;color:#767676;">${uePct}%
          ${isGap ? '<span style="font-size:0.7rem;color:#CC0000;">&nbsp;&#9650; gap</span>' : ''}
        </td>
        <td style="font-size:0.75rem;color:#767676;">${bands[i]?.boSkew||''}</td>
      </tr>`;
  }).join('');

  return `
    <div style="margin-top:20px;">
      <div style="font-size:0.9rem;font-weight:700;color:#0033A0;margin-bottom:6px;padding-bottom:8px;border-bottom:1px solid #DDE1E7;">
        Generational B&O Tier Distribution &mdash; who anchors revenue today, who is the structural gap
      </div>
      <div class="bluf-headline" style="font-size:0.87rem;margin-bottom:12px;">
        Boomers are the current revenue anchor (38% High B&O) but peak spend is <strong>NOW</strong> and declining post-2028.
        Gen Z skews 35% Un-engaged &mdash; a structural acquisition gap that compounds as the Boomer cohort decelerates.
        Millennial conversion to High B&O is the primary 10-year CLV growth lever.
      </div>
      <table class="gen-bo-table">
        <thead>
          <tr>
            <th style="text-align:left;">Generation</th>
            <th style="text-align:right;">High B&O</th>
            <th style="text-align:right;">Medium B&O</th>
            <th style="text-align:right;">Low B&O</th>
            <th style="text-align:right;">Un-engaged</th>
            <th>B&O skew</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="font-size:0.76rem;color:#767676;margin-top:10px;">
        Row highlight: <span style="background:#E3ECFF;padding:1px 6px;border-radius:3px;">Blue = revenue anchor (Boomer/Silent)</span>
        &nbsp; <span style="background:#FFEBEE;padding:1px 6px;border-radius:3px;">Red = acquisition gap (Gen Z)</span>
      </p>
    </div>`;
}

// ── Cohort Aging Narrative Panel (quarterly) ──────────────────────────────
function renderCohortAgingNarrative(data) {
  const cp = data.demographics.clvProjection;
  return `
    <div class="forward-projection" style="margin:16px 0 0 0;">
      <span class="fp-icon">&#8594;</span>
      <span>${cp.note}</span>
    </div>`;
}

// ── Enterprise Snapshot Card (Section 0) ──────────────────────────────────
function renderEnterpriseSnapshot(data) {
  const e = data.enterprise;
  const retailDelta  = e.retailValueMM - e.retailValuePriorMM;
  const tripsDelta   = e.tripsM        - e.tripsPriorM;
  const shoppersDelta= e.shoppersM     - e.shoppersPriorM;

  function kpiTile(value, delta, prior, label) {
    const cls = delta < 0 ? 'negative' : delta > 0 ? 'positive' : 'neutral';
    const sign = delta > 0 ? '+' : '';
    return `
      <div class="es-kpi">
        <div class="es-value">${value}</div>
        <div class="es-delta ${cls}">${sign}${delta} WoW</div>
        <div class="es-prior">Prior: ${prior}</div>
        <div class="es-label-small">${label}</div>
      </div>`;
  }

  const retailVal    = `$${e.retailValueMM.toFixed(1)}mm`;
  const retailPrior  = `$${e.retailValuePriorMM.toFixed(1)}mm`;
  const retailD      = `$${Math.abs(retailDelta).toFixed(1)}mm (${(retailDelta/e.retailValuePriorMM*100).toFixed(1)}%)`;
  const retailDSign  = retailDelta < 0 ? '\u2212' : '+';

  const tripsVal     = `${e.tripsM.toFixed(2)}M`;
  const tripsPrior   = `${e.tripsPriorM.toFixed(2)}M`;
  const tripsD       = `${(tripsDelta*1000).toFixed(0)}K`;
  const tripsDSign   = tripsDelta < 0 ? '\u2212' : '+';

  const shopVal      = `${e.shoppersM.toFixed(2)}M`;
  const shopPrior    = `${e.shoppersPriorM.toFixed(2)}M`;
  const shopD        = shoppersDelta === 0 ? 'Flat' : `${Math.abs(shoppersDelta*1000).toFixed(0)}K`;

  const retailDeltaCls  = retailDelta  < 0 ? 'negative' : 'positive';
  const tripsDeltaCls   = tripsDelta   < 0 ? 'negative' : 'positive';
  const shoppersDeltaCls= shoppersDelta< 0 ? 'negative' : shoppersDelta > 0 ? 'positive' : 'neutral';

  return `
    <div class="enterprise-snapshot">
      <div class="es-header-row">
        <span class="es-label">&#9632; Enterprise &nbsp;&mdash;&nbsp; ${data.reportWeek}</span>
        <span class="es-scope">${e.activeMarkets} active markets &nbsp;&bull;&nbsp; all regions</span>
      </div>
      <div class="es-kpi-row">
        <div class="es-kpi">
          <div class="es-value">${retailVal}</div>
          <div class="es-delta ${retailDeltaCls}">${retailDelta < 0 ? '\u2212' : '+'}${retailD.replace('-','')}</div>
          <div class="es-prior">Prior: ${retailPrior}</div>
          <div class="es-label-small">Total Retail Value</div>
        </div>
        <div class="es-kpi">
          <div class="es-value">${tripsVal}</div>
          <div class="es-delta ${tripsDeltaCls}">${tripsDelta < 0 ? '\u2212' : '+'}${Math.abs(Math.round(tripsDelta*1000))}K trips WoW</div>
          <div class="es-prior">Prior: ${tripsPrior}</div>
          <div class="es-label-small">Total Trips</div>
        </div>
        <div class="es-kpi">
          <div class="es-value">${shopVal}</div>
          <div class="es-delta ${shoppersDeltaCls}">${shoppersDelta === 0 ? 'Flat WoW' : (shoppersDelta > 0 ? '+' : '\u2212') + Math.abs(Math.round(shoppersDelta*1000)) + 'K shoppers'}</div>
          <div class="es-prior">Prior: ${shopPrior}</div>
          <div class="es-label-small">Total Shoppers</div>
        </div>
        <div class="es-kpi">
          <div class="es-value">${e.activeMarkets}</div>
          <div class="es-delta neutral">Region &times; Density</div>
          <div class="es-prior">NE \u00b7 Sunbelt</div>
          <div class="es-label-small">Active Markets</div>
        </div>
      </div>
      ${data.demographics ? renderAgeBandStrip(data) : ''}
    </div>`;
}

// ── BLUF Headline ─────────────────────────────────────────────────────────
function renderBLUF(text) {
  return `<div class="bluf-headline">${text}</div>`;
}

// ── Hierarchy Sidebar ─────────────────────────────────────────────────────
function renderHierarchySidebar(data) {
  const e = data.enterprise;
  const retailDelta = e.retailValueMM - e.retailValuePriorMM;
  const sign = retailDelta < 0 ? '\u2212' : '+';
  const pct  = Math.abs((retailDelta / e.retailValuePriorMM) * 100).toFixed(1);

  const cellNodes = data.marketCells.map(c => {
    const d     = c.financialImpact.dollarMM;
    const dSign = d < 0 ? '\u2212' : '+';
    const dCls  = d < 0 ? 'negative' : d > 0 ? 'positive' : 'neutral';
    const sharePct = c.shareOfEnterprise ? Math.round(Math.abs(c.shareOfEnterprise.enterpriseRetailPct) * 100) : 0;
    return `
      <div class="hp-node cell" id="hp-cell-${c.id}" onclick="openStoryCardById('${c.id}')">
        <span class="hp-cell-name">${c.label}</span>
        <span class="hp-value">
          <span class="${dCls}">${dSign}$${Math.abs(d).toFixed(1)}mm</span>
          &nbsp;&bull;&nbsp; ${sharePct}% of enterprise
        </span>
      </div>`;
  }).join('');

  return `
    <div class="hierarchy-panel" id="hierarchy-panel">
      <div class="hp-title">&#9654; Drill hierarchy</div>
      <div class="hp-node enterprise">
        <span>&#9632; Enterprise</span>
        <span class="hp-value">$${e.retailValueMM.toFixed(1)}mm total &nbsp;&bull;&nbsp; ${sign}${pct}% WoW</span>
      </div>
      <div id="hp-cells">${cellNodes}</div>
      <div id="hp-subsegments"></div>
    </div>`;
}

function updateHierarchySidebar(cell) {
  // Highlight selected cell
  document.querySelectorAll('.hp-node.cell').forEach(el => el.classList.remove('active'));
  const activeEl = document.getElementById('hp-cell-' + cell.id);
  if (activeEl) activeEl.classList.add('active');

  // Render subsegments
  const sc  = cell.storyCard;
  const totalAbs = Math.abs(sc.totalContribution);
  const rows = sc.subsegmentBreakdown.map(s => {
    const d      = s.dollarMM;
    const dSign  = d < 0 ? '\u2212' : '+';
    const dCls   = d < 0 ? 'negative' : 'positive';
    const cellPct = s.shareOfCell !== undefined
      ? Math.round(Math.abs(s.shareOfCell) * 100) + '% of cell'
      : '';
    return `
      <div class="hp-node subsegment">
        <span class="hp-seg-name">${s.label}</span>
        <span class="hp-value">
          <span class="${dCls} hp-share">${dSign}$${Math.abs(d).toFixed(1)}mm</span>
          ${cellPct ? '&nbsp;<span class="hp-share ' + dCls + '">(' + cellPct + ')</span>' : ''}
        </span>
      </div>`;
  }).join('');

  const container = document.getElementById('hp-subsegments');
  if (container) container.innerHTML = rows;
}

// ── Monthly Enterprise Composition Strip ──────────────────────────────────
function renderCompositionStrip(data) {
  const bc = data.enterprise.boComposition;
  const items = [
    { label: 'High',        color: '#1B5E20', bg: '#E8F5E9', k: bc.high.k,       pct: Math.round(bc.high.pct * 100)       },
    { label: 'Medium',      color: '#0033A0', bg: '#E3ECFF', k: bc.medium.k,     pct: Math.round(bc.medium.pct * 100)     },
    { label: 'Low',         color: '#7B3800', bg: '#FFF3E0', k: bc.low.k,        pct: Math.round(bc.low.pct * 100)        },
    { label: 'Un-engaged',  color: '#767676', bg: '#F5F5F5', k: bc.unengaged.k,  pct: Math.round(bc.unengaged.pct * 100)  }
  ];

  const itemsHtml = items.map(it => `
    <span class="cs-item">
      <span class="cs-dot" style="background:${it.color};"></span>
      <strong>${it.label}</strong> ${it.pct}% (${it.k}K)
    </span>`).join('<span style="color:#DDE1E7;margin:0 4px;">|</span>');

  return `
    <div class="context-strip">
      <span class="cs-label">${bc.totalCustomersK.toLocaleString()}K retail-loyal customers:</span>
      ${itemsHtml}
    </div>`;
}

// ── Quarterly Enterprise CLV Strip ────────────────────────────────────────
function renderCLVStrip(data) {
  const e   = data.enterprise;
  const gapPp = Math.round((e.retentionTarget - e.currentRetention) * 100);
  return `
    <div class="context-strip">
      <span class="cs-label">Enterprise CLV context:</span>
      <span class="cs-item"><strong>CLV pool:</strong> $${e.clvPoolMM}mm</span>
      <span style="color:#DDE1E7;margin:0 4px;">|</span>
      <span class="cs-item"><strong>Blended retention:</strong> ${Math.round(e.currentRetention * 100)}%</span>
      <span style="color:#DDE1E7;margin:0 4px;">|</span>
      <span class="cs-item"><strong>Target:</strong> ${Math.round(e.retentionTarget * 100)}%</span>
      <span style="color:#DDE1E7;margin:0 4px;">|</span>
      <span class="cs-item negative"><strong>Gap: \u2212${gapPp}pp</strong></span>
      <span style="color:#DDE1E7;margin:0 4px;">|</span>
      <span class="cs-item"><strong>NE\u2014Urban at-risk CLV:</strong> <span class="negative">$${e.atRiskClvMM}mm</span></span>
    </div>`;
}

// ── JS toggle helpers (global) ────────────────────────────────────────────
function toggleConfidencePanel(summaryEl) {
  const panel = summaryEl.nextElementSibling;
  const hint  = summaryEl.querySelector('.cp-expand-hint');
  const open  = panel.classList.contains('open');
  panel.classList.toggle('open', !open);
  if (hint) hint.innerHTML = open ? '&#9660; what does this mean?' : '&#9650; collapse';
  summaryEl.setAttribute('aria-expanded', String(!open));
}

function toggleSignalStrip(el) {
  const body  = el.querySelector('.ss-body');
  const arrow = el.querySelector('.toggle-arrow');
  const open  = body.style.display !== 'none';
  body.style.display  = open ? 'none' : 'block';
  arrow.style.transform = open ? '' : 'rotate(180deg)';
}

function toggleDB(headerEl) {
  const body  = headerEl.nextElementSibling;
  const arrow = headerEl.querySelector('.toggle-arrow');
  const open  = body.classList.contains('open');
  body.classList.toggle('open', !open);
  arrow.style.transform = open ? '' : 'rotate(180deg)';
}
