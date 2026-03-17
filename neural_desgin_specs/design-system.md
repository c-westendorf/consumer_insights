# Insight Product — Atomic Design System
## Engineering Handoff Specification v1.0

**Companion documents:** Interaction Spec v1.1 · VP User Persona v1.1 · Prototype v3  
**Methodology:** Atomic Design (Brad Frost)  
**Stack:** Vanilla HTML/CSS/JS · Plotly 2.27.0 · Google Fonts (Playfair Display, DM Sans, DM Mono)

---

## Table of Contents

1. [Atoms](#atoms)
   - 1.1 [Color Tokens](#11-color-tokens)
   - 1.2 [Typography](#12-typography)
   - 1.3 [Spacing Scale](#13-spacing-scale)
   - 1.4 [Signal Atoms](#14-signal-atoms)
   - 1.5 [Pillar Tags](#15-pillar-tags)
   - 1.6 [Tier Tags](#16-tier-tags)
   - 1.7 [Confidence Indicators](#17-confidence-indicators)
2. [Molecules](#molecules)
   - 2.1 [Governed Stat Pair](#21-governed-stat-pair)
   - 2.2 [Variance Context Row](#22-variance-context-row)
   - 2.3 [MECE Segment Row](#23-mece-segment-row)
   - 2.4 [Comparative Triple](#24-comparative-triple)
   - 2.5 [Navigation Prose Items](#25-navigation-prose-items)
   - 2.6 [Suggestion Item](#26-suggestion-item)
   - 2.7 [Breadcrumb Event Row](#27-breadcrumb-event-row)
3. [Organisms](#organisms)
   - 3.1 [Governed Metric Card](#31-governed-metric-card)
   - 3.2 [Response Organism](#32-response-organism)
   - 3.3 [Breadcrumb Trail](#33-breadcrumb-trail)
4. [Templates](#templates)
   - 4.1 [Thread Template](#41-thread-template)
   - 4.2 [Sidecar Template](#42-sidecar-template)
   - 4.3 [Analysis View Template](#43-analysis-view-template)
   - 4.4 [Cold Open Template](#44-cold-open-template)
5. [Pages](#pages)
   - 5.1 [Cold Open Entry State](#51-cold-open-entry-state)
   - 5.2 [Email Entry State](#52-email-entry-state)
6. [Interaction Contracts](#interaction-contracts)
7. [Semantic Rules](#semantic-rules)

---

## Atoms

Atoms are the smallest indivisible UI elements. Each atom carries both visual and semantic meaning. Visual specification alone is insufficient — every atom definition includes its semantic contract.

---

### 1.1 Color Tokens

All colors are defined as CSS custom properties on `:root`. Components must reference semantic aliases, never raw hex values.

```css
:root {
  /* ── BASE PALETTE ── */
  --color-ink:        #0f0e0c;   /* Primary text, topbar bg, response avatar */
  --color-paper:      #f5f2ed;   /* App background */
  --color-cream:      #ede9e1;   /* Secondary surface, stat cells, bc header */
  --color-rule:       #d4cfc5;   /* All borders and dividers */
  --color-ink-mid:    #4a4640;   /* Secondary text, prose body */
  --color-ink-light:  #8a8480;   /* Tertiary text, labels, metadata */

  /* ── SIGNAL PALETTE ── */
  --color-accent:      #c84b2f;  /* Adverse metric signal, Pillar 4 */
  --color-accent-soft: #f0e0db;  /* Adverse bg, hover states */
  --color-teal:        #1a5c5a;  /* Entity signal, Pillar 2 */
  --color-teal-soft:   #d4e8e7;  /* Entity bg, active states */
  --color-gold:        #b8860b;  /* Tension signal, Pillar 3, warnings */
  --color-gold-soft:   #f5edd0;  /* Tension bg, analysis offer */
  --color-sage:        #5b8a6e;  /* Positive signal, Pillar 1 */
  --color-sage-soft:   #deeee6;  /* Positive bg, stable states */

  /* ── SEMANTIC ALIASES ── */
  /* Always use aliases in components, never raw --color-* values */
  --signal-metric:        var(--color-accent);
  --signal-metric-bg:     var(--color-accent-soft);
  --signal-entity:        var(--color-teal);
  --signal-entity-bg:     var(--color-teal-soft);
  --signal-tension:       var(--color-gold);
  --signal-tension-bg:    var(--color-gold-soft);
  --signal-positive:      var(--color-sage);
  --signal-positive-bg:   var(--color-sage-soft);

  --pillar-1: var(--color-sage);   --pillar-1-bg: var(--color-sage-soft);
  --pillar-2: var(--color-teal);   --pillar-2-bg: var(--color-teal-soft);
  --pillar-3: var(--color-gold);   --pillar-3-bg: var(--color-gold-soft);
  --pillar-4: var(--color-accent); --pillar-4-bg: var(--color-accent-soft);

  --tier-tactical-bg:  var(--color-accent-soft);
  --tier-strategic-bg: var(--color-gold-soft);
  --tier-capital-bg:   var(--color-teal-soft);
}
```

---

### 1.2 Typography

Three typefaces. Each carries a distinct semantic role. Never substitute.

```css
/* ── FONT IMPORT ── */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

/* ── FAMILY ASSIGNMENTS ── */
/* Playfair Display — display/editorial */
/* Use: response titles, section headers, large numeric values, document headings */
font-family: 'Playfair Display', serif;

/* DM Sans — body/prose */
/* Use: all narrative prose, response body text, governed definitions, UI body copy */
font-family: 'DM Sans', sans-serif;

/* DM Mono — labels/metadata */
/* Use: labels, metadata, tags, tokens, timestamps, section labels, all UI chrome */
font-family: 'DM Mono', monospace;

/* ── TYPE SCALE ── */
:root {
  --text-xs:   9px;   /* DM Mono labels, uppercase with letter-spacing: 0.15em */
  --text-sm:   11px;  /* Secondary body, governed definitions */
  --text-base: 13px;  /* Primary prose, navigation items */
  --text-md:   14px;  /* Response body prose */
  --text-lg:   16px;  /* Large stat values (secondary) */
  --text-xl:   18px;  /* Response titles */
  --text-2xl:  22px;  /* Section titles */
  --text-3xl:  28px;  /* Document section titles */
  --text-4xl:  36px;  /* Document cover titles */
}

/* ── LINE HEIGHTS ── */
/* Prose body: 1.85 */
/* Secondary prose: 1.75 */
/* UI labels: 1.0 */
/* Titles: 1.1–1.25 */
/* Definitions: 1.65 */
```

---

### 1.3 Spacing Scale

```css
:root {
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* ── RADII ── */
  --radius-sm:   2px;   /* Tags, cells, most UI elements */
  --radius-md:   4px;   /* Suggestion items, input field */
  --radius-full: 9999px; /* Avatars, dots */

  /* ── TRANSITIONS ── */
  --transition-fast:  all 0.12s ease;           /* Hover states */
  --transition-slide: all 0.32s cubic-bezier(0.4,0,0.2,1); /* Panel slides */
  --transition-fade:  opacity 0.35s ease, transform 0.35s ease; /* Response appear */
}
```

---

### 1.4 Signal Atoms

#### Metric Signal — Range Bar

**Semantic contract:** Encodes variance position relative to historical normal range. Communicates signal severity before any tap. Never used for decoration.

```css
/* Container — inline, attached directly after metric value */
.signal-metric {
  cursor: pointer;
  font-weight: 500;
  color: var(--color-ink);
  padding: 0 1px;
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);
}
.signal-metric:hover { background: var(--signal-metric-bg); }

/* Range bar — 5 segments */
.range-bar {
  display: inline-flex;
  align-items: center;
  gap: 1.5px;
  vertical-align: middle;
  margin-left: 3px;
  position: relative;
  top: -1px;
}
.range-bar span {
  display: inline-block;
  width: 3px;
  height: 9px;
  border-radius: 1px;
  background: var(--color-rule); /* inactive */
}
.range-bar span.active     { background: var(--color-accent); } /* adverse */
.range-bar span.active.up  { background: var(--color-sage);   } /* positive */
.range-bar span.active.warn{ background: var(--color-gold);   } /* boundary */
```

**Encoding rules:**
- 0 active segments = within normal range (no signal, still tappable)
- 1 active segment = approaching boundary
- 2 active segments = outside normal range (standard signal)
- 3+ active segments = significantly outside range (strong signal)
- Adverse fills from center rightward
- Positive fills from center leftward

**On tap:** Opens sidecar with `org-governed-card` (metric variant)

---

#### Entity Signal — Underline

**Semantic contract:** Signals "this term has a governed definition and current performance state." Does not encode direction or urgency — only presence of a body.

```css
.signal-entity {
  cursor: pointer;
  color: var(--signal-entity);
  font-weight: 500;
  border-bottom: 1.5px solid var(--signal-entity);
  padding-bottom: 1px;
  border-radius: 2px 2px 0 0;
  transition: var(--transition-fast);
}
.signal-entity:hover { background: var(--signal-entity-bg); }
```

**Use on:** Lifecycle segments · shopper types · urban density classifications · regions · named cohorts  
**Never use on:** Metrics (use range bar) · pillar names (use pillar tag) · tier names (use tier tag)  
**On tap:** Opens sidecar with `org-governed-card` (entity variant)

---

#### Tension Signal — Highlight Bracket

**Semantic contract:** Marks a relationship between two diverging metrics. Not a value, not a direction — a relationship. Must always span both terms. Gold is used because tension ≠ adverse.

```css
.signal-tension {
  cursor: pointer;
  background: var(--signal-tension-bg);
  border-bottom: 2px solid var(--signal-tension);
  padding: 1px 5px;
  border-radius: 3px 3px 0 0;
  font-weight: 500;
  transition: var(--transition-fast);
}
.signal-tension:hover { background: #ffe9a0; }
```

**Separator:** Use `↔` character between the two diverging terms  
**Rule:** Must span both terms in a single element. Never apply to a single term.  
**On tap:** Opens sidecar with `org-governed-card` (tension variant)

---

### 1.5 Pillar Tags

```css
.pillar-tag {
  display: inline-block;
  font-family: 'DM Mono', monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: var(--radius-sm);
  vertical-align: middle;
}
.pillar-1 { background: var(--pillar-1-bg); color: var(--pillar-1); }
.pillar-2 { background: var(--pillar-2-bg); color: var(--pillar-2); }
.pillar-3 { background: var(--pillar-3-bg); color: var(--pillar-3); }
.pillar-4 { background: var(--pillar-4-bg); color: var(--pillar-4); }
```

**Labels:**
- `.pillar-1` → "Pillar 1 · Grow"
- `.pillar-2` → "Pillar 2 · Retention"
- `.pillar-3` → "Pillar 3 · Frequency"
- `.pillar-4` → "Pillar 4 · Value"

**Rule:** Every major response finding must carry at least one pillar tag. Never omit.

---

### 1.6 Tier Tags

```css
.tier-tag {
  display: inline-block;
  font-family: 'DM Mono', monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: var(--radius-sm);
  vertical-align: middle;
}
.tier-tactical  { background: var(--tier-tactical-bg);  color: var(--color-accent); }
.tier-strategic { background: var(--tier-strategic-bg); color: var(--color-gold); }
.tier-capital   { background: var(--tier-capital-bg);   color: var(--color-teal); }
```

**Rule:** Every Layer 5 implication must include at least one tier tag. A finding that spans tiers shows multiple tags inline.

---

### 1.7 Confidence Indicators

```css
.confidence {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: 'DM Mono', monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.confidence-dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
}
.conf-governed  { color: var(--color-sage);   } .conf-governed  .confidence-dot { background: var(--color-sage);   }
.conf-estimated { color: var(--color-gold);   } .conf-estimated .confidence-dot { background: var(--color-gold);   }
.conf-flagged   { color: var(--color-accent); } .conf-flagged   .confidence-dot { background: var(--color-accent); }
```

**States:** Governed · Estimated · Flagged  
**Placement:** Sidecar header · Analysis view header. Never inline in prose.  
**Semantic contract:** Governed = forwardable. Estimated = verify before forwarding. Flagged = do not forward.

---

## Molecules

Molecules are simple functional units built from two or more atoms. Single clear purpose. Not used as standalone elements.

---

### 2.1 Governed Stat Pair

**Rule:** Absolute is always left. Relative is always right. Never render one cell alone.

```css
.stat-pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: var(--color-rule); /* shows as cell divider */
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-sm);
  overflow: hidden;
}
.stat-cell {
  background: white;
  padding: var(--space-3);
}
.stat-label {
  font-family: 'DM Mono', monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-ink-light);
  margin-bottom: var(--space-1);
}
.stat-value {
  font-family: 'Playfair Display', serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.1;
  margin-bottom: 2px;
}
.stat-value.neg { color: var(--color-accent); }
.stat-value.pos { color: var(--color-sage);   }
.stat-value.neu { color: var(--color-ink-mid);}
.stat-sub {
  font-size: var(--text-xs);
  color: var(--color-ink-light);
  line-height: 1.4;
}
```

**Left cell:** Absolute volume (trips, customers, revenue equivalent)  
**Right cell:** Relative change (WoW percentage)  
**Sub-label:** Always include revenue equivalent in absolute cell (e.g. "~$3.1M at $26.20 avg basket")

---

### 2.2 Variance Context Row

```css
.variance-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--color-cream);
  border-radius: var(--radius-sm);
}
.variance-bars {
  display: flex;
  gap: 2px;
  align-items: center;
  flex-shrink: 0;
}
.variance-bar-seg {
  display: inline-block;
  width: 5px;
  height: 14px;
  border-radius: 1px;
  background: var(--color-rule);
}
.variance-bar-seg.active     { background: var(--color-accent); }
.variance-bar-seg.active-up  { background: var(--color-sage);   }
.variance-bar-seg.active-warn{ background: var(--color-gold);   }
.variance-text {
  font-size: var(--text-sm);
  color: var(--color-ink-mid);
  line-height: 1.55;
  flex: 1;
}
.variance-text strong { color: var(--color-ink); font-weight: 500; }
```

**Text format:** `"Nx outside normal variance. Normal range ±Y%. [Context sentence.]"`  
**Placement:** Always follows stat-pair in governed card. Never appears alone.

---

### 2.3 MECE Segment Row

**Rule:** All segments in the complete MECE set must be present. No truncation.

```css
.mece-row {
  display: flex;
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-sm);
  overflow: hidden;
}
.mece-seg {
  flex: 1;
  padding: var(--space-2) var(--space-2);
  font-size: var(--text-xs);
  color: var(--color-ink-light);
  background: white;
  text-align: center;
  border-right: 1px solid var(--color-rule);
}
.mece-seg:last-child { border-right: none; }
.mece-seg.focus   { background: var(--signal-metric-bg); color: var(--signal-metric);   font-weight: 500; }
.mece-seg.focus-up{ background: var(--signal-positive-bg);color: var(--signal-positive);font-weight: 500; }
.mece-seg.neutral { background: var(--color-cream); color: var(--color-ink-mid); }
.mece-seg-label { font-family: 'DM Mono', monospace; font-size: 8px; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 2px; }
.mece-seg-value { font-size: 12px; font-weight: 500; }
```

**Arrow indicator:** Append ` ←` to focused segment label  
**MECE sets defined:**
- Shopper type: Front-Store-Only · Rx-Attached · PCW
- Loyalty: Member · Non-Member
- Urban density: Urban · Suburban · Rural
- Lifecycle: New · Active · Deepening · Late-Active · Churned · Non-member
- Regions: 9 enterprise regions (all shown)

---

### 2.4 Comparative Triple

**Rule:** Always WoW · MoM · YoY in that order. Never reorder.

```css
.comp-triple {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--space-2);
}
.comp-cell {
  background: var(--color-cream);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  text-align: center;
}
.comp-label {
  font-family: 'DM Mono', monospace;
  font-size: 8px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-ink-light);
  margin-bottom: 2px;
}
.comp-value {
  font-size: 14px;
  font-weight: 500;
  font-family: 'Playfair Display', serif;
}
.comp-value.neg { color: var(--color-accent); }
.comp-value.pos { color: var(--color-sage);   }
```

---

### 2.5 Navigation Prose Items

**Rule:** Always exactly two items per response — one primary, one secondary. Always in italic prose. Never button labels.

```css
.nav-item {
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-sm);
  font-size: var(--text-base);
  font-style: italic;
  line-height: 1.6;
  cursor: pointer;
  border: 1px solid transparent;
  transition: var(--transition-fast);
}
.nav-primary {
  background: var(--signal-entity-bg);
  color: var(--signal-entity);
  border-color: #b0d4d2;
}
.nav-primary:hover { background: #bddcda; }
.nav-secondary {
  background: var(--signal-tension-bg);
  color: #7a5c00;
  border-color: #e0cc80;
}
.nav-secondary:hover { background: #ffe9a0; }
```

**Quality test:** Would a brilliant analyst say this in a meeting room? If it sounds like a button label, rewrite it.

---

### 2.6 Suggestion Item

```css
.suggestion-item {
  padding: var(--space-3) var(--space-5);
  background: white;
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  color: var(--color-ink-mid);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  line-height: 1.4;
  cursor: pointer;
  transition: var(--transition-fast);
}
.suggestion-item:hover {
  border-color: var(--signal-entity);
  background: var(--signal-entity-bg);
  color: var(--signal-entity);
}
.suggestion-num {
  font-family: 'DM Mono', monospace;
  font-size: var(--text-xs);
  color: var(--color-rule);
  flex-shrink: 0;
  width: 14px;
}
.suggestion-arrow { margin-left: auto; color: var(--color-rule); font-size: 11px; flex-shrink: 0; }
```

**Rule:** Max 3 suggestions. Always framed as a question. Generated from current week's governed signal — not static.

---

### 2.7 Breadcrumb Event Row

```css
.bc-row {
  display: grid;
  grid-template-columns: 60px 180px 1fr;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-4);
  border-bottom: 1px solid var(--color-cream);
  align-items: start;
}
.bc-row:last-child { border-bottom: none; }
.bc-time   { font-family: 'DM Mono', monospace; font-size: var(--text-xs); color: var(--color-rule); }
.bc-name   { font-size: var(--text-sm); font-weight: 500; color: var(--color-ink); }
.bc-action { font-size: var(--text-sm); color: var(--color-ink-light); line-height: 1.4; }
```

**Action text patterns:**
- Metric tap: `"Metric tap · [metric name] · sidecar updated"`
- Entity tap: `"Entity tap · segment profile opened · sidecar updated"`
- Tension tap: `"Tension tap · divergence view opened · analysis offered"`
- Analysis entry: `"Analysis view opened · [question context] · [timestamp]"`
- Analysis exit: `"Exited analysis view · [duration]"`

---

## Organisms

---

### 3.1 Governed Metric Card

The sidecar's primary organism. Renders for all three signal types with variant assembly.

**Assembly order — strict, never reorder:**

| # | Section | Always? | Notes |
|---|---------|---------|-------|
| 1 | Type badge | ✓ | Sets frame. Metric / Entity / Tension. |
| 2 | Governed definition | ✓ | Population + calculation + time window. One paragraph. |
| 3 | Stat pair | ✓ | Absolute + relative. Revenue equiv. in sub. |
| 4 | Variance context row | ✓ | Visual bar + plain-language interpretation. |
| 5 | MECE segment row | ✓ | Full decomposition. All segments present. |
| 6 | Comparative triple | ✓ | WoW / MoM / YoY. |
| 7 | Chart (Plotly) | Conditional | 12-week sparkline. Omit for simple entity profiles. |
| 8 | Analysis offer | Conditional | Only when deeper exploration is warranted. |

**Badge CSS:**
```css
.gc-badge { display: inline-block; font-family: 'DM Mono', monospace; font-size: var(--text-xs); letter-spacing: 0.1em; text-transform: uppercase; padding: 2px 8px; border-radius: var(--radius-sm); margin-bottom: var(--space-3); }
.gc-badge-metric  { background: var(--signal-metric-bg);  color: var(--signal-metric);  }
.gc-badge-entity  { background: var(--signal-entity-bg);  color: var(--signal-entity);  }
.gc-badge-tension { background: var(--signal-tension-bg); color: var(--signal-tension); }
```

**Definition CSS:**
```css
.gc-definition {
  background: var(--color-cream);
  border-left: 2px solid var(--color-rule);
  padding: var(--space-2) var(--space-3);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  font-size: var(--text-sm);
  color: var(--color-ink-mid);
  line-height: 1.65;
  margin-bottom: var(--space-3);
}
```

**Variant differences:**
- **Metric card:** All 8 sections. Chart = 12-week sparkline with variance band.
- **Entity card:** Sections 1–6. Chart optional (lifecycle bar chart). No variance row if no weekly metric.
- **Tension card:** Sections 1–6 (stat pair = two cells, one per diverging metric). Chart = 12-week dual-line divergence. Analysis offer always present.

**Plotly chart configuration:**
```javascript
// Common config for all sidecar charts
const plotlyConfig = { displayModeBar: false, responsive: true };
const plotlyLayout = {
  margin: { t: 4, r: 10, b: 28, l: 34 },
  paper_bgcolor: 'transparent',
  plot_bgcolor: 'transparent',
  height: 150,
  showlegend: false,
  xaxis: { tickfont: { size: 8, family: 'DM Mono', color: '#8a8480' }, tickangle: -30, gridcolor: 'rgba(0,0,0,0.04)' },
  yaxis: { tickfont: { size: 8, family: 'DM Mono', color: '#8a8480' }, ticksuffix: '%', gridcolor: 'rgba(0,0,0,0.04)' }
};
```

---

### 3.2 Response Organism

**Structure:**

```
┌─────────────────────────────────────────────────────────┐
│ HEADER: Avatar · Label · Time                           │
├─────────────────────────────────────────────────────────┤
│ BODY:                                                   │
│  [Modal offer — conditional, only when agent            │
│   acknowledges sidecar activity]                        │
│                                                         │
│  Title — Playfair 18px weight 600                       │
│  (Finding: declarative · Tension: uses tension-mark)    │
│                                                         │
│  Prose — DM Sans 13.5px, line-height 1.85               │
│  (Contains inline: signal-metric, signal-entity,        │
│   signal-tension, pillar-tag, tier-tag atoms)           │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ NAV BLOCK: Label · nav-primary · nav-secondary          │
└─────────────────────────────────────────────────────────┘
```

**Header CSS:**
```css
.response-header {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-rule);
  background: var(--color-cream);
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.response-avatar {
  width: 26px; height: 26px;
  border-radius: var(--radius-full);
  background: var(--color-ink);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', serif;
  font-size: 11px; color: var(--color-paper); font-style: italic;
  flex-shrink: 0;
}
```

**Entry animation:**
```css
.response {
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.response.visible {
  opacity: 1;
  transform: translateY(0);
}
```
Trigger `.visible` class after response is inserted into DOM.

**Modal offer CSS:**
```css
.modal-offer {
  background: var(--color-cream);
  border: 1px solid var(--color-rule);
  border-left: 3px solid var(--signal-tension);
  padding: var(--space-3) var(--space-4);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  margin-bottom: var(--space-3);
  font-size: var(--text-base);
  color: var(--color-ink-mid);
  font-style: italic;
  line-height: 1.6;
}
.modal-offer strong { font-style: normal; color: var(--color-ink); font-weight: 500; }
```

---

### 3.3 Breadcrumb Trail

```css
.bc-trail {
  display: none; /* hidden until first sidecar tap from anchored response */
  margin: var(--space-3) 0 var(--space-6) 36px; /* left-aligned with response body */
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: white;
}
.bc-trail.visible { display: block; }
.bc-header {
  padding: var(--space-2) var(--space-4);
  display: flex; align-items: center; gap: var(--space-2);
  cursor: pointer;
  background: var(--color-cream);
  transition: var(--transition-fast);
}
.bc-header:hover { background: var(--color-cream); filter: brightness(0.97); }
.bc-toggle { font-family: 'DM Mono', monospace; font-size: var(--text-xs); color: var(--color-rule); transition: transform 0.2s; }
.bc-trail.expanded .bc-toggle { transform: rotate(180deg); }
.bc-events { display: none; border-top: 1px solid var(--color-rule); }
.bc-trail.expanded .bc-events { display: block; }
```

**JavaScript — append event:**
```javascript
function appendBreadcrumb(trailId, eventData) {
  const { time, name, action } = eventData;
  const trail = document.getElementById(trailId);
  const eventsContainer = trail.querySelector('.bc-events');
  
  // Show trail if hidden
  trail.classList.add('visible');
  
  // Update summary text
  const count = trail.querySelectorAll('.bc-row').length + 1;
  trail.querySelector('.bc-summary').textContent = 
    `${count} item${count > 1 ? 's' : ''} investigated · ${name}`;
  
  // Append event row
  const row = document.createElement('div');
  row.className = 'bc-row';
  row.innerHTML = `
    <span class="bc-time">${time}</span>
    <span class="bc-name">${name}</span>
    <span class="bc-action">${action}</span>
  `;
  eventsContainer.appendChild(row);
}
```

---

## Templates

---

### 4.1 Thread Template

```css
/* Shell */
.app { display: flex; flex: 1; overflow: hidden; position: relative; }
.convo-shell { display: flex; flex: 1; height: 100%; overflow: hidden; position: relative; }

/* Thread */
.thread {
  flex: 1;
  overflow-y: auto;
  padding: 28px 0 96px; /* 96px bottom clears reply bar */
  min-width: 0;
}
.thread-inner {
  max-width: 700px;
  margin: 0 auto;
  padding: 0 28px;
}

/* Reply bar */
.reply-bar {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  background: var(--color-paper);
  border-top: 1px solid var(--color-rule);
  padding: var(--space-3) 28px;
  z-index: 50;
  transition: right var(--transition-slide);
}
.reply-bar.sidecar-open { right: var(--sc-w, 380px); }

/* Scrollbar */
.thread::-webkit-scrollbar { width: 3px; }
.thread::-webkit-scrollbar-thumb { background: var(--color-rule); border-radius: 2px; }
```

---

### 4.2 Sidecar Template

```css
:root { --sc-w: 380px; }

.sidecar {
  width: var(--sc-w);
  background: white;
  border-left: 1px solid var(--color-rule);
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform var(--transition-slide);
  position: absolute;
  right: 0; top: 0; bottom: 0;
  z-index: 100;
}
.sidecar.open { transform: translateX(0); }

.sidecar-header {
  padding: var(--space-4) var(--space-4);
  border-bottom: 1px solid var(--color-rule);
  background: var(--color-cream);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-2);
  flex-shrink: 0;
}
.sidecar-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-4);
}
```

**JavaScript — open/close:**
```javascript
function openSidecar(contentKey) {
  const sidecar = document.getElementById('sidecar');
  const replyBar = document.getElementById('reply-bar');
  
  // Render content
  renderSidecarContent(contentKey);
  
  // Open panel
  sidecar.classList.add('open');
  replyBar.classList.add('sidecar-open');
  
  // Append breadcrumb
  appendBreadcrumb(getActiveBreadcrumbTrail(), buildBCEvent(contentKey));
}

function closeSidecar() {
  document.getElementById('sidecar').classList.remove('open');
  document.getElementById('reply-bar').classList.remove('sidecar-open');
}
```

**Content update:** On every tap, call `renderSidecarContent(key)` — full innerHTML replace, no animation. Sidecar has no history; it always shows the most recently tapped element.

---

### 4.3 Analysis View Template

```css
.analysis-view {
  position: absolute;
  inset: 0;
  background: var(--color-paper);
  z-index: 200;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform var(--transition-slide);
}
.analysis-view.open { transform: translateX(0); }

/* Top bar */
.av-topbar {
  background: var(--color-ink);
  padding: 0 var(--space-6);
  height: 50px;
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-shrink: 0;
}

/* Body */
.av-body { display: flex; flex: 1; overflow: hidden; }

/* Enterprise anchor panel */
.av-anchor {
  width: 210px;
  border-right: 1px solid var(--color-rule);
  overflow-y: auto;
  padding: var(--space-5) var(--space-4);
  flex-shrink: 0;
  background: white;
}

/* Main analysis panel */
.av-main {
  flex: 1;
  overflow-y: auto;
  padding: 22px 26px 80px; /* 80px clears return bar */
}

/* Return bar */
.av-return-bar {
  position: fixed;
  bottom: 0;
  left: 210px; /* clears anchor panel */
  right: 0;
  background: var(--color-ink);
  padding: var(--space-4) var(--space-6);
  display: flex;
  align-items: center;
  gap: var(--space-4);
  z-index: 10;
}
```

**Analysis view content sections:**
1. Question title (Playfair 21px)
2. Question sub-label (DM Mono, entry mode + decision mode)
3. Absolute context banner (dark bg, 4-cell grid: total volume, WoW absolute, revenue equiv., addressable)
4. MECE decomposition grid (all segments, top-border color-coded)
5. Chart section label + Plotly chart
6. Governed interpretation block (teal left-border)
7. Return bar (always visible, fixed)

**MECE cell top-border encoding:**
```css
.mece-cell { border-top: 3px solid var(--color-rule); }  /* default */
.mece-cell.signal  { border-top-color: var(--color-accent); }  /* declining */
.mece-cell.stable  { border-top-color: var(--color-sage);   }  /* growing */
.mece-cell.warn    { border-top-color: var(--color-gold);   }  /* warning */
.mece-cell.flat    { border-top-color: var(--color-rule);   }  /* flat */
```

**Return action:**
```javascript
function returnFromAnalysis() {
  const findingSummary = buildFindingSummary(currentAnalysisMode);
  closeAnalysisView();
  
  // Append finding as user message
  appendUserMessage(findingSummary);
  
  // Trigger agent response with reintegration offer
  triggerAgentResponse('reintegration');
}
```

---

### 4.4 Cold Open Template

```css
.cold-open {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: var(--space-10);
  gap: 0;
}
/* All child elements max-width: 600px */
/* Greeting: Playfair 30px */
/* Sub: DM Sans 13px --color-ink-light */
/* Week badge: DM Mono --text-xs, --color-cream bg, border */
/* Suggestion label: DM Mono --text-xs, uppercase */
/* Suggestions: flex column, gap 7px, max-width 600px */
/* Input wrap: flex, white bg, border, border-radius 6px */
```

**View transition (cold open → convo):**
```javascript
function transitionToConvo() {
  document.getElementById('view-cold').classList.add('hidden');
  document.getElementById('view-convo').classList.remove('hidden');
  showTypingIndicator();
  setTimeout(() => {
    hideTypingIndicator();
    renderResponse(1);
  }, 1200 + Math.random() * 400); // 1.2–1.6s
}
```

---

## Pages

---

### 5.1 Cold Open Entry State

**Template:** `tmpl-cold-open`  
**Context:** Alex opens the product independently — no email deep link  
**Trust state:** Neutral. No governed data visible yet.

**Specifications:**
- Greeting: `"Good morning, [Name]."` — name in italic `--color-ink-light`
- Sub-label: `"Week [N] data is governed and ready. Where would you like to start?"`
- Week badge: Full date + week number (`"Monday · March 10, 2025 · Week 10 of 52"`)
- Suggestions: 3 items, generated from current week's top signal dimensions
- Input placeholder: `"Or ask your own question, or state a hypothesis to test…"`

**On any interaction:** Transition to convo shell with typing indicator, then Response 1 animates in.

---

### 5.2 Email Entry State

**Template:** `tmpl-thread` (with pre-loaded response)  
**Context:** Alex tapped a deep link from the Monday push summary email  
**Trust state:** Primed. Alex has read the push and chosen to investigate.

**Key difference from cold open:**
- Response 1 renders **without typing indicator** — it was "already there"
- Breadcrumb trail initializes empty and visible immediately
- Reply bar immediately available
- No cold-open view is shown

**Pre-load behavior:**
```javascript
function emailEntry() {
  showConvoView();
  // No typing indicator — response appears immediately
  const r1 = document.getElementById('response-1');
  r1.style.display = 'block';
  setTimeout(() => r1.classList.add('visible'), 80);
  showBreadcrumbTrail('bc1', empty=true);
}
```

---

## Interaction Contracts

### Sidecar

| Event | Trigger | Result |
|-------|---------|--------|
| Open | Tap any signal atom | Slide in (translateX 0), reply bar shifts right |
| Update | Tap any signal atom while open | Full content replace, no animation |
| Close | Tap ✕ button | Slide out (translateX 100%), reply bar resets |
| Breadcrumb | Every tap | Append bc-row to anchored trail |

### Analysis View

| Event | Trigger | Result |
|-------|---------|--------|
| Open | Nav prose CTA or sidecar analysis offer | Full overlay slides in from right |
| Close (back) | Tap "← Return" | Overlay slides out, thread intact |
| Close (return) | Tap "Return with this finding" | Finding appended as user message, agent responds |
| Breadcrumb | Entry + exit | Two events logged with timestamps |

### Response Flow

| Event | Trigger | Result |
|-------|---------|--------|
| Nav primary tap | Click primary nav item | User message appears, typing indicator, response animates in |
| Nav secondary tap | Click secondary nav item | Same as primary — different content |
| Modal offer | Agent reads bc trail pattern | Appears above response title, italic, gold left-border |

---

## Semantic Rules

The following rules are non-negotiable. They define what makes this a governed insight product rather than a dashboard.

1. **Every metric in prose carries a range bar.** No exceptions. A number without a range bar is uncontextualized and cannot be evaluated without additional cognitive effort.

2. **Every entity in prose carries an underline.** A term without an underline is not a governed entity — it is narrative decoration.

3. **Tensions must span both terms.** A tension highlight on a single term is meaningless. The relationship is the finding.

4. **Every response carries at least one pillar tag.** A response without pillar attribution requires translation work from the VP. The product must own that work.

5. **Every Layer 5 implication carries at least one tier tag.** A finding without a tier classification cannot be prioritized.

6. **The sidecar always shows the complete MECE set.** Partial decompositions break the completeness guarantee and undermine trust.

7. **Absolute + relative always appear together.** A percentage alone is not a governed metric. The absolute volume and revenue equivalent are required context.

8. **The governed definition always precedes the numbers.** The population statement is the contract. Numbers without a definition are claims, not governed answers.

9. **Navigation prose is always plain language.** If it sounds like a button label, it is not navigation prose.

10. **Analysis view is always entered deliberately.** It must never be triggered automatically or without explicit user action.

---

*Insight Product · Atomic Design System · Engineering Handoff v1.0*  
*Companion: Interaction Spec v1.1 · VP User Persona v1.1 · Prototype v3*
