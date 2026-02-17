// InsightOS Demo2 — Expanded Spec-Aligned Dataset
// Full per-cell story cards, financial translations, B&O diagnostics, signal strip

const DEMO2_DATA = {

  reportWeek:      'Week of Feb 10\u201316, 2025',
  reportPriorWeek: 'Week of Feb 3\u20139, 2025',

  // ── Enterprise Absolute Totals ────────────────────────────────────────
  enterprise: {
    retailValueMM:      248.5,
    retailValuePriorMM: 250.6,
    tripsM:             4.82,
    tripsPriorM:        4.88,
    shoppersM:          1.94,
    shoppersPriorM:     1.94,
    activeMarkets:      4,
    // B&O composition (monthly context)
    boComposition: {
      totalCustomersK: 1930,
      high:       { k: 420, pct: 0.218 },
      medium:     { k: 680, pct: 0.352 },
      low:        { k: 520, pct: 0.269 },
      unengaged:  { k: 310, pct: 0.161 }
    },
    // CLV context (quarterly)
    clvPoolMM:        820,
    retentionTarget:  0.55,
    currentRetention: 0.51,
    atRiskClvMM:      28
  },

  // ── BLUF Headlines (one per cadence) ─────────────────────────────────
  bluf: {
    weekly:    'Retail value declined $2.1mm (\u22120.8% WoW) driven by NE\u2014Urban frequency softness entering a 3rd consecutive week; leading signals confirm structural, not cyclical, deterioration.',
    monthly:   'B&O tier churn is accelerating: Medium\u2192Low transitions rose +4pp to 21%, representing $4.1mm in at-risk revenue; High\u2192Un-engaged lapse doubled to 4% ($3.5mm), requiring immediate win-back decisions.',
    quarterly: 'NE\u2014Urban retention is diverging from Sunbelt at 5pp/quarter and has now triggered the same signal pattern in 3 of 4 quarters; structural reallocation is warranted at the portfolio level.'
  },

  // ── Coverage & Confidence ─────────────────────────────────────────────
  coverage: { permissioned: 0.58, rxLinkage: 0.44, tokenizedRepeatability: 0.35 },
  confidenceLevel: 'Medium',

  // ── Confidence Explainer (popover content) ────────────────────────────
  confidenceExplainer: {
    pyramid: [
      { tier: 'Known identity',   pct: 0.58, color: '#0033A0',
        desc: 'Loyalty ID, Rx ID, or explicit consent match \u2014 transactions attributed to a named individual' },
      { tier: 'Rx-linked',        pct: 0.44, color: '#00A650',
        desc: 'Subset of known identity where pharmacy records are connected \u2014 enables PCW (Pharmacy + Retail) behavior tracking' },
      { tier: 'Tokenized repeat', pct: 0.35, color: '#E87722',
        desc: 'Repeat visits identifiable via anonymous token \u2014 behavioral patterns without identity linkage' },
      { tier: 'Inferred / blind', pct: 0.42, color: '#DDE1E7',
        desc: 'Remaining basket \u2014 directionally consistent with identified population but statistically extrapolated; not used for individual targeting' }
    ],
    reliabilityNote: 'Insights covering the 58% known-identity population are high-confidence and individually attributable. The remaining 42% are directionally extrapolated from identified cohort behavior. Treat aggregate trends as fully reliable; individual-level attribution as indicative only.',
    thresholds: {
      high:   '\u226560% permissioned + stable Rx linkage \u2014 individual-level attribution viable; use for precision targeting',
      medium: '40\u201360% or linkage volatility \u2014 segment-level insights reliable; individual extrapolation warrants caution',
      low:    '<40% or large reconciliation gaps \u2014 directional only; do not use for individual targeting or media activation'
    }
  },

  // ── Demographics ──────────────────────────────────────────────────────
  demographics: {
    enterprise: {
      bands: [
        { gen: 'Gen Z',      years: '1997\u20132012', pct: 0.12, color: '#9C27B0',
          boSkew: 'Low / Un-engaged', healthcarePhase: 'Entry / preventive',           peakSpendYear: '2040+' },
        { gen: 'Millennial', years: '1981\u20131996', pct: 0.31, color: '#0033A0',
          boSkew: 'Medium',           healthcarePhase: 'Family formation / Rx onset',   peakSpendYear: '2035' },
        { gen: 'Gen X',      years: '1965\u20131980', pct: 0.28, color: '#00A650',
          boSkew: 'High / Medium',    healthcarePhase: 'Peak earning / chronic Rx',     peakSpendYear: '2028' },
        { gen: 'Boomer',     years: '1946\u20131964', pct: 0.24, color: '#E87722',
          boSkew: 'High PCW',         healthcarePhase: 'Active healthcare consumer NOW', peakSpendYear: 'NOW' },
        { gen: 'Silent',     years: '1928\u20131945', pct: 0.05, color: '#CC0000',
          boSkew: 'High PCW',         healthcarePhase: 'High-frequency Rx',             peakSpendYear: 'Peak past' }
      ],
      medianAgeCurrent: 42,
      medianAge2035:    47,
      note: 'Boomer cohort is at peak healthcare spend NOW (2024\u20132028). Millennial cohort entering family-formation health phase 2025\u20132035. Without Gen Z acquisition investment, median customer age drifts to 47 by 2035 \u2014 compressing the addressable lifetime value window.'
    },
    cellAgeSkew: {
      ne_urban:    { medianAge: 46, ageIndex: 1.10, boomersPlus: 0.31, millennialShare: 0.27 },
      ne_suburban: { medianAge: 43, ageIndex: 1.02, boomersPlus: 0.26, millennialShare: 0.30 },
      sb_suburban: { medianAge: 39, ageIndex: 0.93, boomersPlus: 0.22, millennialShare: 0.36 },
      sb_rural:    { medianAge: 44, ageIndex: 1.05, boomersPlus: 0.28, millennialShare: 0.28 }
    },
    genBoBreakdown: {
      labels:    ['Gen Z', 'Millennial', 'Gen X', 'Boomer', 'Silent'],
      high:      [0.05, 0.18, 0.28, 0.38, 0.42],
      medium:    [0.22, 0.38, 0.36, 0.28, 0.24],
      low:       [0.38, 0.28, 0.22, 0.20, 0.20],
      unengaged: [0.35, 0.16, 0.14, 0.14, 0.14]
    },
    clvProjection: {
      years:      [2025, 2027, 2029, 2031, 2033, 2035],
      boomer:     [ 820,  760,  690,  590,  470,  340],
      genX:       [ 640,  680,  720,  740,  730,  700],
      millennial: [ 320,  390,  470,  560,  640,  710],
      genZ:       [  80,  130,  200,  290,  390,  490],
      note: 'Without Gen Z conversion investment, total CLV pool peaks 2028\u20132031 then contracts as the Boomer cohort decelerates. Millennial + Gen Z pipeline must exceed $580mm by 2031 to sustain the current CLV pool. Current NE\u2014Urban retention trajectory accelerates the contraction timeline by approximately 18 months.'
    }
  },

  // ── Weekly Topline ────────────────────────────────────────────────────
  topline: {
    retailWoW:      -0.008,
    retailDollarMM: -2.1,
    tripsWoW:       -0.012,
    shoppersWoW:    +0.001
  },

  // ── Signal Strip (always visible on weekly page) ──────────────────────
  signalStrip: {
    overallStatus: 'Deteriorating',
    affectedCell:  'Northeast \u2014 Urban',
    signals: [
      { label: 'Planning intent',  status: 'red',   direction: 'down', detail: '\u22128% WoW \u00b7 2-week lead' },
      { label: 'Coupon clipping',  status: 'amber', direction: 'down', detail: '\u22124% WoW \u00b7 1-week lead' },
      { label: 'Rx-attach rate',   status: 'red',   direction: 'down', detail: '\u22126% WoW \u00b7 2-week lead' },
      { label: 'OOS proxy',        status: 'amber', direction: 'up',   detail: '+5% WoW \u00b7 watch'           }
    ]
  },

  // ── Reconciliation: Driver Component Decomposition ────────────────────
  reconciliation: {
    activeBase: { pp: -0.002, dollarMM: -0.5, weeklyTrend: [-0.001, -0.001, -0.002, -0.002], trendDir: 'stable'    },
    frequency:  { pp: -0.009, dollarMM: -2.3, weeklyTrend: [-0.004, -0.006, -0.007, -0.009], trendDir: 'worsening' },
    basket:     { pp: +0.005, dollarMM: +1.2, weeklyTrend: [+0.003, +0.004, +0.004, +0.005], trendDir: 'improving' },
    promoCost:  { pp: -0.002, dollarMM: -0.5, weeklyTrend: [-0.002, -0.002, -0.002, -0.002], trendDir: 'stable'    },
    total:      { pp: -0.008, dollarMM: -2.1, weeklyTrend: [-0.004, -0.005, -0.007, -0.008], trendDir: 'worsening' }
  },

  // ── Market Cells: Region x Density (all 4 with full story cards) ──────
  marketCells: [
    {
      id: 'ne_urban',
      label: 'Northeast \u2014 Urban',
      retailWoW: -0.022, tripsWoW: -0.035, shoppersWoW: -0.010,
      waterfallContribution: -1.3,
      financialImpact: { dollarMM: -3.2, vsLastWeek: -0.4 },
      shareOfEnterprise: { grossHeadwindPct: 1.00, netDeclinePct: 1.52, enterpriseRetailPct: 0.31 },
      storyCard: {
        totalContribution: -1.3,
        mixEffect:         { pp: -0.4, dollarMM: -0.9, description: 'fewer Established High B&O shoppers present in the cell' },
        performanceEffect: { pp: -0.9, dollarMM: -2.3, description: 'Established Medium B&O shopped less \u2014 trip frequency declined' },
        affectedSegment:   'Established / Medium B&O / PCW + Retail-only',
        subsegmentBreakdown: [
          { label: 'PCW (Rx+Retail)',         custK: 210, wowPct: -0.028, dollarMM: -1.8, boCls: 'Medium',     shareOfCell: 0.56, shareOfEnterprise: 0.86 },
          { label: 'Retail-only loyalty',      custK: 165, wowPct: -0.019, dollarMM: -0.9, boCls: 'Medium',     shareOfCell: 0.28, shareOfEnterprise: 0.43 },
          { label: 'Rx-only loyalty',          custK:  88, wowPct: -0.004, dollarMM: -0.3, boCls: 'Low',        shareOfCell: 0.09, shareOfEnterprise: 0.14 },
          { label: 'Non-loyalty retail token', custK:  43, wowPct: +0.010, dollarMM: +0.3, boCls: 'Low',        shareOfCell:-0.09, shareOfEnterprise:-0.14 }
        ],
        forwardProjection: 'At current trajectory, NE\u2014Urban loses an additional <strong>$4.2mm by week 4</strong> unless frequency is recovered.',
        decisionBrief: {
          situation:   'Frequency-led decline in Established Medium B&O; mix shift accelerating. Three consecutive weeks of worsening trend.',
          stakes:      '$3.2mm WoW impact. $4.2mm additional at risk over next 4 weeks if unaddressed.',
          options: [
            'Rx-attach trial campaign \u2014 2-week lead time to recover signal',
            'Planning-intent promotional push (search + list + locator reactivation)',
            'Accept and monitor \u2014 assess whether macro or promo-calendar effect resolves naturally'
          ],
          recommended: 'Options 1 + 2 in parallel. Decision window: act within <strong>2 weeks</strong> to intercept frequency before repeat ordering pauses.',
          signal: 'Escalate'
        }
      }
    },
    {
      id: 'ne_suburban',
      label: 'Northeast \u2014 Suburban',
      retailWoW: -0.004, tripsWoW: -0.008, shoppersWoW: +0.001,
      waterfallContribution: -0.2,
      financialImpact: { dollarMM: -0.5, vsLastWeek: +0.1 },
      shareOfEnterprise: { grossHeadwindPct: 0.16, netDeclinePct: 0.24, enterpriseRetailPct: 0.24 },
      storyCard: {
        totalContribution: -0.2,
        mixEffect:         { pp: +0.1, dollarMM: +0.2, description: 'stable tier composition; slight mix improvement' },
        performanceEffect: { pp: -0.3, dollarMM: -0.7, description: 'slight basket compression in Low B&O; PCW holding' },
        affectedSegment:   'Low B&O / Retail-only loyalty',
        subsegmentBreakdown: [
          { label: 'PCW (Rx+Retail)',         custK: 190, wowPct: +0.002, dollarMM: +0.1, boCls: 'High' },
          { label: 'Retail-only loyalty',      custK: 145, wowPct: -0.006, dollarMM: -0.5, boCls: 'Low'  },
          { label: 'Rx-only loyalty',          custK:  72, wowPct: -0.001, dollarMM: -0.1, boCls: 'Low'  },
          { label: 'Non-loyalty retail token', custK:  38, wowPct: +0.004, dollarMM: +0.1, boCls: 'Low'  }
        ],
        forwardProjection: 'NE\u2014Suburban is stable. Watch Low B&O basket compression for 2 more weeks before action.',
        decisionBrief: {
          situation:   'Minor basket compression in Low B&O; PCW and High B&O holding steady.',
          stakes:      '$0.5mm WoW. Low urgency; not accelerating.',
          options: [
            'Monitor Low B&O basket for 2 more weeks',
            'Run basket-building bundle test in Low B&O cohort'
          ],
          recommended: 'Monitor. No escalation warranted this week.',
          signal: 'Monitor'
        }
      }
    },
    {
      id: 'sb_suburban',
      label: 'Sunbelt \u2014 Suburban',
      retailWoW: +0.019, tripsWoW: +0.012, shoppersWoW: +0.008,
      waterfallContribution: +0.7,
      financialImpact: { dollarMM: +1.7, vsLastWeek: +0.3 },
      shareOfEnterprise: { grossHeadwindPct: 0.00, netDeclinePct: -0.81, enterpriseRetailPct: 0.28 },
      storyCard: {
        totalContribution: +0.7,
        mixEffect:         { pp: +0.3, dollarMM: +0.7, description: 'Retail-only loyalty converting L\u2192M B&O, improving mix' },
        performanceEffect: { pp: +0.4, dollarMM: +1.0, description: 'Medium B&O trip frequency increasing; PCW basket expanding' },
        affectedSegment:   'Medium B&O / Retail-only loyalty (converting)',
        subsegmentBreakdown: [
          { label: 'PCW (Rx+Retail)',         custK: 165, wowPct: +0.008, dollarMM: +0.5, boCls: 'High'   },
          { label: 'Retail-only loyalty',      custK: 200, wowPct: +0.022, dollarMM: +0.9, boCls: 'Medium' },
          { label: 'Rx-only loyalty',          custK:  55, wowPct: +0.015, dollarMM: +0.2, boCls: 'Low'    },
          { label: 'Non-loyalty retail token', custK:  60, wowPct: +0.010, dollarMM: +0.1, boCls: 'Low'    }
        ],
        forwardProjection: 'Sunbelt\u2014Suburban is on track to add <strong>$6\u20138mm in Q1</strong> if L\u2192M B&O conversion sustains at current rate.',
        decisionBrief: {
          situation:   'Strong L\u2192M B&O conversion driving both mix improvement and performance lift. Third consecutive week of positive momentum.',
          stakes:      '+$1.7mm WoW. Scalable opportunity if playbook is replicable.',
          options: [
            'Accelerate L\u2192M conversion with targeted incentive (Retail-only loyalty cohort)',
            'Replicate Sunbelt\u2014Suburban playbook in NE\u2014Suburban (similar demographic profile)',
            'Maintain current investment and monitor sustainability'
          ],
          recommended: 'Scale playbook to NE\u2014Suburban in parallel with NE\u2014Urban frequency recovery program.',
          signal: 'Accept'
        }
      }
    },
    {
      id: 'sb_rural',
      label: 'Sunbelt \u2014 Rural',
      retailWoW: +0.003, tripsWoW: -0.002, shoppersWoW: +0.004,
      waterfallContribution: 0.0,
      financialImpact: { dollarMM: 0.0, vsLastWeek: -0.1 },
      shareOfEnterprise: { grossHeadwindPct: 0.00, netDeclinePct: 0.00, enterpriseRetailPct: 0.17 },
      storyCard: {
        totalContribution: 0.0,
        mixEffect:         { pp: +0.2, dollarMM: +0.3, description: 'more shoppers entering the cell (new customer acquisition)' },
        performanceEffect: { pp: -0.2, dollarMM: -0.3, description: 'per-shopper spend flat; trip compression offsetting shopper growth' },
        affectedSegment:   'Un-engaged / Non-loyalty retail token',
        subsegmentBreakdown: [
          { label: 'PCW (Rx+Retail)',         custK:  90, wowPct: +0.005, dollarMM: +0.1, boCls: 'Medium'     },
          { label: 'Retail-only loyalty',      custK:  80, wowPct: +0.002, dollarMM: +0.1, boCls: 'Low'        },
          { label: 'Rx-only loyalty',          custK:  35, wowPct: -0.003, dollarMM: -0.1, boCls: 'Low'        },
          { label: 'Non-loyalty retail token', custK:  55, wowPct: -0.008, dollarMM: -0.1, boCls: 'Un-engaged' }
        ],
        forwardProjection: 'Sunbelt\u2014Rural is net-flat. Watch non-loyalty token trip compression \u2014 could indicate format saturation or competitive entry.',
        decisionBrief: {
          situation:   'Net-zero: shopper growth offset by trip compression. Non-loyalty token cohort showing early softness.',
          stakes:      'Near-zero net impact now. Watch for token churn signal escalation in weeks 2\u20133.',
          options: [
            'Monitor non-loyalty token trip frequency for 2 weeks',
            'Test format refresh or assortment extension in 2 rural pilot stores'
          ],
          recommended: 'Monitor. Low priority relative to NE\u2014Urban escalation.',
          signal: 'Monitor'
        }
      }
    }
  ],

  // ── Leading Indicators (shared) ────────────────────────────────────────
  leadingIndicators: [
    { signal: 'Planning intent index (search + list + locator)', direction: 'down', leadWeeks: 2, strength: 'Strong', stabilityWindow: '3\u20135 weeks' },
    { signal: 'Coupon clipping rate',                             direction: 'down', leadWeeks: 1, strength: 'Medium', stabilityWindow: '2\u20134 weeks' },
    { signal: 'Rx-attached trip rate',                            direction: 'down', leadWeeks: 2, strength: 'Strong', stabilityWindow: '4\u20136 weeks' },
    { signal: 'OOS exposure proxy',                               direction: 'up',   leadWeeks: 1, strength: 'Medium', stabilityWindow: '1\u20133 weeks' }
  ],
  leadingIndicatorsNarrative: 'The decline is consistent with a planning-intent drop preceding frequency softness; Rx-attach weakening suggests integrated value risk beyond a single week.',

  // ── Monthly: B&O Migration ────────────────────────────────────────────
  boMigration: {
    segment: 'Retail-only loyalty',
    labels:  ['High', 'Medium', 'Low', 'Un-engaged'],
    matrix: [
      [0.72, 0.18, 0.06, 0.04],
      [0.09, 0.61, 0.21, 0.09],
      [0.02, 0.15, 0.54, 0.29],
      [0.01, 0.04, 0.12, 0.83]
    ],
    customerCountK:  [420, 680, 520, 310],
    revenueImpactMM: [
      [null,  -1.2, -2.8, -3.5],
      [+1.1,  null, -4.1, -6.2],
      [+0.6,  +1.8,  null, -1.9],
      [+0.2,  +0.9,  +0.3,  null]
    ],
    transitionDiagnostics: {
      'High_Medium': { label:'High \u2192 Medium', trend:[0.14,0.15,0.17,0.18], weekLabels:['W-3','W-2','W-1','Now'],
        signals:[{signal:'Basket compression',dir:'down',strength:'Medium'}],
        narrative:'High B&O customers reducing basket size; primarily Health & Beauty.',
        decisionBrief:{signal:'Monitor',stakes:'$1.2mm WoW.',recommended:'Watch basket composition; consider H&B bundle if trend continues 2 more weeks.'} },
      'High_Low':    { label:'High \u2192 Low',    trend:[0.04,0.05,0.05,0.06], weekLabels:['W-3','W-2','W-1','Now'],
        signals:[{signal:'Rx-attach rate',dir:'down',strength:'Strong'}],
        narrative:'Rx-detachment emerging in High B&O; monitor pharmacy fill rate.',
        decisionBrief:{signal:'Monitor',stakes:'$2.8mm WoW.',recommended:'Rx-attach win-back if fill rate drops below threshold in 2 weeks.'} },
      'High_Un':     { label:'High \u2192 Un-engaged', trend:[0.02,0.02,0.03,0.04], weekLabels:['W-3','W-2','W-1','Now'],
        signals:[{signal:'Planning intent',dir:'down',strength:'Strong'}],
        narrative:'High B&O lapse accelerating from 2% to 4% in 4 weeks. Immediate win-back window is now.',
        decisionBrief:{signal:'Escalate',stakes:'$3.5mm WoW. Accelerating.',recommended:'Immediate high-value win-back campaign. Decision window: this week.'} },
      'Medium_High': { label:'Medium \u2192 High',  trend:[0.11,0.10,0.10,0.09], weekLabels:['W-3','W-2','W-1','Now'],
        signals:[{signal:'Coupon clipping',dir:'up',strength:'Medium'}],
        narrative:'Upgrade pipeline thinning (11\u21929%). Coupon response still positive.',
        decisionBrief:{signal:'Monitor',stakes:'+$1.1mm WoW (upgrade value).',recommended:'Maintain coupon investment in Medium tier to protect upgrade pipeline.'} },
      'Medium_Low':  { label:'Medium \u2192 Low',   trend:[0.17,0.18,0.19,0.21], weekLabels:['W-3','W-2','W-1','Now'],
        signals:[{signal:'Planning intent',dir:'down',strength:'Strong'},{signal:'Rx-attach rate',dir:'down',strength:'Strong'}],
        narrative:'Medium B&O \u2192 Low transitions accelerating (+4pp over 4 weeks). Planning intent and Rx-attach deteriorate 2 weeks prior. Largest single revenue risk in the matrix.',
        decisionBrief:{signal:'Escalate',stakes:'$4.1mm WoW. Most critical transition.',recommended:'Rx-attach + planning-intent intervention in parallel. Act within 2 weeks.'} },
      'Medium_Un':   { label:'Medium \u2192 Un-engaged', trend:[0.06,0.07,0.08,0.09], weekLabels:['W-3','W-2','W-1','Now'],
        signals:[{signal:'OOS proxy',dir:'up',strength:'Medium'}],
        narrative:'OOS exposure rising \u2014 may be accelerating lapse in Medium B&O. Check in-stock rates in core SKUs.',
        decisionBrief:{signal:'Monitor',stakes:'$6.2mm WoW (large volume, lower urgency rate).',recommended:'Investigate OOS root cause before committing to win-back spend.'} },
      'Low_High':    { label:'Low \u2192 High',    trend:[0.01,0.02,0.02,0.02], weekLabels:['W-3','W-2','W-1','Now'],
        signals:[],
        narrative:'Rare upgrade (2%). Driven by seasonal or promotional response.',
        decisionBrief:{signal:'Accept',stakes:'+$0.6mm WoW.',recommended:'No action. Monitor for promotional lift attribution.'} },
      'Low_Medium':  { label:'Low \u2192 Medium', trend:[0.13,0.14,0.14,0.15], weekLabels:['W-3','W-2','W-1','Now'],
        signals:[{signal:'Coupon clipping',dir:'up',strength:'Medium'}],
        narrative:'Low B&O upgrade pipeline healthy (13\u219215%). Coupon-led conversion working. Most replicable growth lever.',
        decisionBrief:{signal:'Accept',stakes:'+$1.8mm WoW.',recommended:'Scale coupon-led L\u2192M conversion playbook to NE\u2014Suburban.'} },
      'Low_Un':      { label:'Low \u2192 Un-engaged', trend:[0.25,0.26,0.27,0.29], weekLabels:['W-3','W-2','W-1','Now'],
        signals:[{signal:'Planning intent',dir:'down',strength:'Strong'}],
        narrative:'Largest absolute volume transition (29% of Low tier). Planning intent deterioration leading.',
        decisionBrief:{signal:'Monitor',stakes:'$1.9mm WoW.',recommended:'Low-cost re-engagement (email/app) before higher-value intervention.'} },
      'Un_High':     { label:'Un-engaged \u2192 High',   trend:[0.01,0.01,0.01,0.01], weekLabels:['W-3','W-2','W-1','Now'],
        signals:[], narrative:'Rare reactivation (1%). Driven by Rx fill resumption.',
        decisionBrief:{signal:'Accept',stakes:'+$0.2mm WoW.',recommended:'Monitor Rx reactivation; no marketing investment warranted.'} },
      'Un_Medium':   { label:'Un-engaged \u2192 Medium', trend:[0.03,0.04,0.04,0.04], weekLabels:['W-3','W-2','W-1','Now'],
        signals:[{signal:'Coupon clipping',dir:'up',strength:'Medium'}],
        narrative:'Un-engaged\u2192Medium stable at 4%. Coupon-led reactivation working at modest scale.',
        decisionBrief:{signal:'Accept',stakes:'+$0.9mm WoW.',recommended:'Maintain reactivation coupon cadence; evaluate CAC vs LTV before scaling.'} },
      'Un_Low':      { label:'Un-engaged \u2192 Low',    trend:[0.10,0.11,0.11,0.12], weekLabels:['W-3','W-2','W-1','Now'],
        signals:[], narrative:'Typical re-entry pattern after lapse. Stable.',
        decisionBrief:{signal:'Accept',stakes:'+$0.3mm WoW.',recommended:'No action. Natural re-entry; focus retention on new Medium tier entrants.'} }
    }
  },

  monthlyNarrativeBullets: [
    'B&O downgrade transitions in <strong>Northeast\u2014Urban</strong> drove <strong>\u2212$4.1mm</strong> in Medium\u2192Low churn; upgrade pipeline (Medium\u2192High) thinning to 9% from 11% over the month.',
    '<strong>Sunbelt\u2014Suburban</strong> Low\u2192Medium conversions added <strong>+$1.8mm</strong>; coupon-led upgrade is the most replicable growth lever across markets.',
    'High\u2192Un-engaged lapse rate doubled from 2% to 4% over 4 weeks \u2014 <strong>$3.5mm at risk</strong>; requires immediate win-back decision this week.'
  ],

  // ── Quarterly ─────────────────────────────────────────────────────────
  quarterly: {
    narrativeBullets: [
      'Northeast\u2014Urban frequency softness is <strong>persistent and recurring</strong>: planning intent and Rx-attach signals preceded declines in <strong>3 of the last 4 quarters</strong>.',
      'Sunbelt\u2014Suburban retention is <strong>structurally improving</strong> (+7pp new\u2192repeat over 4 quarters); gap vs. NE\u2014Urban widens to <strong>21pp by Q4 2025</strong> at current trajectory.',
      'Structural risk: if NE\u2014Urban retention continues its trajectory, total at-risk customer lifetime value reaches <strong>$28mm annualized</strong>.'
    ],
    decisionBrief: {
      situation:   'NE\u2014Urban is a persistent structural risk, not a cyclical blip. 3 of 4 quarters show the same signal-to-decline pattern. Retention diverging from Sunbelt at 5pp/quarter.',
      stakes:      '$28mm annualized CLV at risk if NE\u2014Urban trajectory continues. Sunbelt\u2014Suburban represents $6\u20138mm incremental Q1 opportunity.',
      options: [
        'Quarterly investment in NE\u2014Urban frequency recovery (Rx-attach + planning-intent programs)',
        'Reallocate investment from NE\u2014Urban (structural headwind) to Sunbelt\u2014Suburban (structural tailwind)',
        'Hybrid: protect High B&O NE\u2014Urban; grow Medium B&O Sunbelt; accept Low B&O NE\u2014Urban churn'
      ],
      recommended: 'Option 3 (hybrid). Protect highest-value cohort, scale Sunbelt growth, accept managed churn in lower tiers.',
      signal: 'Escalate'
    },
    signalRecurrence: {
      quarters: ['Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025'],
      planningIntentFired:     [true,  false, true,  true],
      planningIntentMagnitude: ['\u22126%', null, '\u22127%', '\u22128%'],
      rxAttachFired:           [true,  false, true,  true],
      rxAttachMagnitude:       ['\u22125%', null, '\u22125%', '\u22126%'],
      declineFollowed:         [true,  false, true,  true],
      declineMagnitude:        ['\u22120.6%', null, '\u22120.7%', '\u22120.8%'],
      note: 'Planning intent and Rx-attach preceded NE\u2014Urban declines in 3 of 4 quarters. Q3 2024 absence correlated with no decline \u2014 signals have high specificity.'
    },
    cohortDecay: {
      quarters: ['Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025'],
      sunbeltRetention:     [0.52, 0.55, 0.57, 0.59],
      neUrbanRetention:     [0.51, 0.49, 0.46, 0.44],
      targetRetention:      0.55,
      neUrbanProjectedQ4:   0.38
    }
  },

  // ── Chat: 4 enriched prompts ───────────────────────────────────────────
  chatScript: [
    {
      id: 'prompt1',
      userText: 'How is the business performing this week?',
      answer: 'Retail value is down <strong>$2.1mm (\u22120.8% WoW)</strong>, driven mainly by <strong>trip frequency softness</strong> in <strong>Northeast\u2014Urban</strong>.',
      evidence: 'NE\u2014Urban contributes <strong>$3.2mm of the drag</strong>; Sunbelt\u2014Suburban offsets with <strong>+$1.7mm</strong>. Frequency: <strong>\u2212$2.3mm</strong>; basket partial offset: <strong>+$1.2mm</strong>.',
      confidence: 'Medium', confidenceDetail: '58% permissioned coverage \u00b7 44% Rx linkage',
      nextClicks: [
        { label: 'Reconciliation panel',   anchor: 'reconciliation'        },
        { label: 'Market cell waterfall',  anchor: 'waterfall'             },
        { label: 'NE\u2014Urban story card', anchor: 'story-card-section'  }
      ]
    },
    {
      id: 'prompt2',
      userText: 'Is this a blip or momentum?',
      answer: '<strong>Momentum:</strong> frequency decline has worsened for <strong>3 consecutive weeks</strong>; leading signals turned negative 2 weeks ago.',
      evidence: 'Planning intent fell <strong>\u22128% WoW</strong> 2 weeks before trips dropped. Frequency contribution: <strong>\u22120.4pp \u2192 \u22120.6pp \u2192 \u22120.7pp \u2192 \u22120.9pp</strong> over 4 weeks.',
      confidence: 'Medium', confidenceDetail: '58% permissioned coverage \u00b7 44% Rx linkage',
      nextClicks: [
        { label: 'Reconciliation trend',         anchor: 'reconciliation'           },
        { label: 'Signal strip',                 anchor: 'signal-strip'             },
        { label: 'Compare NE vs Sunbelt',        anchor: 'waterfall'                }
      ]
    },
    {
      id: 'prompt3',
      userText: 'Who is driving the decline?',
      answer: '<strong>Established Medium B&O in NE\u2014Urban</strong> \u2014 specifically PCW and Retail-only loyalty. Sunbelt\u2014Suburban partially offsets.',
      evidence: 'Mix effect: <strong>\u2212$0.9mm</strong>. Performance effect: <strong>\u2212$2.3mm</strong>. PCW alone: <strong>\u2212$1.8mm</strong>; Retail-only loyalty: <strong>\u2212$0.9mm</strong>.',
      confidence: 'Medium', confidenceDetail: '58% permissioned coverage \u00b7 44% Rx linkage',
      nextClicks: [
        { label: 'Mix vs. performance story card', anchor: 'story-card-section'     },
        { label: 'Subsegment breakdown',           anchor: 'story-card-section'     },
        { label: 'B&O migration matrix',           anchor: 'bo-migration'           }
      ]
    },
    {
      id: 'prompt4',
      userText: 'What behaviors are changing that matter most for trips?',
      answer: 'Planning behaviors (search/list/locator), Rx-attached trips, and coupon clipping are the <strong>3 strongest leading signals</strong> for trip frequency declines.',
      evidence: 'Planning intent \u2193 Strong (3\u20135 wk) \u00b7 Rx-attach \u2193 Strong (4\u20136 wk) \u00b7 Coupon clipping \u2193 Medium (2\u20134 wk). All three fired 2 weeks ago.',
      confidence: 'Medium', confidenceDetail: '58% permissioned coverage \u00b7 44% Rx linkage',
      nextClicks: [
        { label: 'Leading indicator table',       anchor: 'leading-indicators-section' },
        { label: 'Signal strip (live status)',    anchor: 'signal-strip'               },
        { label: 'Decision brief',                anchor: 'story-card-section'         }
      ]
    }
  ]
};
