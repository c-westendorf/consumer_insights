# UX/UI Implementation Plan: Alex's Feedback

## Overview

Two UX improvements requested by Alex (VP Enterprise Retail persona) plus structural cleanup of spec documents.

**Feedback 1 — Stronger Editorial Opinion:**
Product should surface "here are the 1-3 stories worth your attention this week" with editorial judgment, not 3 equal questions.

**Feedback 2 — Governed Analysis Session + Assignment:**
Analysts need governed data layer (tool outputs, lineage), not Alex's chat thread. Plus ability to assign findings with notifications.

**Structural Cleanup:**
Both spec documents have appended changelog-style addendums that must be integrated inline, then converted to concise changelogs.

---

## Files to Modify

| File | Path | Purpose |
|------|------|---------|
| Design System | `neural_desgin_specs/design-system.html` | Atomic design system (Atoms → Molecules → Organisms → Pages) |
| Interaction Spec | `neural_desgin_specs/interaction-spec.html` | Interaction patterns and UX specifications |
| Prototype | `neural_desgin_specs/prototype.html` | Working HTML/CSS/JS prototype |

---

## Key Concepts

- **Alex**: VP of Enterprise Retail who uses this governed weekly insights product every Monday morning
- **Fiscal Week (FW)**: Session model — each Monday starts a new fiscal week session
- **MECE**: Mutually Exclusive, Collectively Exhaustive decompositions
- **Analyst Brief**: Prose summary document for analyst handoff (already exists)
- **Governed Analysis Session**: NEW — data layer showing tool outputs, lineage (to be added)
- **Load-bearing context**: Prior week info appears ONLY when it affects current findings (pattern persisting, hypothesis confirmed/refuted, escalation threshold)

---

## TODO List

Execute in order. Each TODO is atomic and can be completed independently within its phase.

---

### PHASE 1: Structural Cleanup — Integrate Existing Addendums

#### TODO 1.1: Integrate design-system.html Addendum Inline

**File**: `neural_desgin_specs/design-system.html`

**Current state**: "Addendum · v1.1 Updates" exists at lines 1212-1609

**Action**: Move each component to its proper Level section, then DELETE the addendum:

| Component in Addendum | Move To Section |
|-----------------------|-----------------|
| A: Mode Shift Atom | Level 1 Atoms (~line 400) |
| B: MECE Smart Highlighting | Level 2 Molecules (~line 700), update existing `mol-mece-row` |
| C: Return Flow Organism | Level 3 Organisms (~line 900) |
| D: Nav Mood Variants | Level 2 Molecules, update existing `mol-nav-item` |
| E: Analyst Brief Page | Level 5 Pages (create section if needed) |
| F: Session Components | Split appropriately: atoms→L1, molecules→L2, organisms→L3 |

**Verification**: Search for "Addendum" — should find 0 results after completion.

---

#### TODO 1.2: Integrate interaction-spec.html Part V Inline

**File**: `neural_desgin_specs/interaction-spec.html`

**Current state**: "PART V · UX ENHANCEMENT SPECIFICATIONS" exists at lines 1657-2142

**Action**: Move each fix to its proper Part section, then DELETE Part V:

| Fix in Part V | Move To Section |
|---------------|-----------------|
| 01: Mode Shift Visualization | Part II Entry Modes (~line 1100) |
| 02: MECE Smart Highlighting | Part III Response Anatomy |
| 03: Return Flow Ceremony | Part III Sidecar/Analysis View |
| 04: Navigation Mood Variants | Part II Navigation Model (~line 1210) |
| 05: Thread Continuity | Part II or Part III (thread management) |
| 06: Fiscal Week Session | Part III Session Architecture |
| 07: Analyst Handoff | Part III Delegation section |

**Verification**: Search for "PART V" — should find 0 results after completion.

---

#### TODO 1.3: Add Concise Changelogs to Both Files

**After completing TODO 1.1 and 1.2**, add changelog sections.

**design-system.html** — add at end of document:
```html
<section class="changelog">
  <h2>Changelog</h2>
  <ul>
    <li><strong>v1.1</strong>: Added mode shift atom, MECE smart highlighting, return flow ceremony, nav mood variants, analyst brief page, fiscal week session components</li>
  </ul>
</section>
```

**interaction-spec.html** — add at end of document:
```html
<section class="changelog">
  <h2>Changelog</h2>
  <ul>
    <li><strong>v1.1</strong>: Mode shift visualization, MECE smart highlighting, return flow ceremony</li>
    <li><strong>v1.2</strong>: Navigation mood variants, thread continuity rules</li>
    <li><strong>v1.3</strong>: Fiscal week session persistence, analyst handoff layer</li>
  </ul>
</section>
```

---

### PHASE 2: Story-Led Editorial Opinion

#### TODO 2.1: Update Entry Mode 01 Specification

**File**: `neural_desgin_specs/interaction-spec.html`

**Location**: Entry Mode 01 section (~lines 1097-1119)

**Current text**: "The product surfaces the most signal-bearing finding of the week first... here's what I would lead with if I were briefing you."

**Replace with this content**:
```
The product has already run the Monday diagnostic across all standard enterprise
questions before Alex arrives. Rather than presenting these as equal starting points,
the product leads with its editorial judgment: "Here are the 1-3 stories worth your
attention this week."

Story-led structure:
─────────────────────
• Lead insight(s): The 1-3 findings the product judges most consequential,
  with brief explanation of why these lead
• Standard enterprise questions (Q1-Q3) remain available as functional
  access points, but are visually secondary
• The distinction: "Here's what I found worth leading with" vs "Here are your options"

Editorial criteria for lead stories:
• Magnitude of change (absolute impact)
• Deviation from expected pattern
• Strategic relevance to stated goals
• Time-sensitivity (requires action this week)
```

---

#### TODO 2.2: Update Prototype Cold Open

**File**: `neural_desgin_specs/prototype.html`

**Location**: Cold open section (~lines 401-430)

**Current structure**: "Where would you like to start?" with 3 equal suggested questions

**Replace with story-led structure**:

```html
<!-- Story leads - PRIMARY -->
<div class="story-leads">
  <p class="cold-open-text">Here's what I found worth leading with this week.</p>

  <div class="story-lead-card lead-primary">
    <span class="lead-badge">Lead Story</span>
    <h3 class="lead-headline">PCW customer growth accelerating beyond target</h3>
    <p class="lead-why">Why this leads: +45K customers represents 3x normal weekly acquisition, driven by pharmacy attachment campaigns.</p>
    <button class="lead-action">Explore this finding →</button>
  </div>

  <div class="story-lead-card lead-secondary">
    <span class="lead-badge">Also Notable</span>
    <h3 class="lead-headline">Retail-only churn requires attention</h3>
    <p class="lead-why">Why this leads: -8K customers marks third consecutive week of acceleration.</p>
    <button class="lead-action">Explore this finding →</button>
  </div>
</div>

<!-- Divider -->
<div class="diagnostic-divider">
  <span>Standard diagnostic access</span>
</div>

<!-- Standard questions - SECONDARY (visually de-emphasized) -->
<div class="standard-questions secondary">
  <p class="section-label">Or start from a standard question:</p>
  <button class="question-btn secondary">What needs my attention?</button>
  <button class="question-btn secondary">Where is the biggest opportunity?</button>
  <button class="question-btn secondary">What's changing?</button>
</div>
```

**Add CSS** for visual hierarchy:
```css
.story-leads { margin-bottom: 2rem; }
.story-lead-card { padding: 1.5rem; border-left: 4px solid var(--accent); margin-bottom: 1rem; }
.lead-primary { border-left-color: var(--primary); background: var(--surface-elevated); }
.lead-secondary { border-left-color: var(--secondary); }
.lead-badge { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
.lead-headline { font-size: 1.25rem; font-weight: 600; margin: 0.5rem 0; }
.lead-why { font-size: 0.9rem; color: var(--text-secondary); }
.diagnostic-divider { text-align: center; margin: 2rem 0; color: var(--text-muted); }
.standard-questions.secondary { opacity: 0.7; }
.question-btn.secondary { background: transparent; border: 1px solid var(--border); }
```

---

#### TODO 2.3: Ensure Load-Bearing Prior Week Context Rules

**File**: `neural_desgin_specs/interaction-spec.html`

**Context**: When integrating Fix 06 (Fiscal Week Session) in TODO 1.2, ensure these rules are explicitly stated:

```
Prior Week Context Rules
────────────────────────
Prior week context appears ONLY when load-bearing:
• Pattern persisting: "This is the third consecutive week of..."
• Hypothesis confirmed/refuted: "Last week you asked whether X — the data now shows..."
• Escalation threshold crossed: "The trend you flagged has now exceeded the threshold..."

Integration approach:
• Context woven into finding prose, NOT as separate opening element
• No "Last week recap" section — context earns its place by relevance

Session restore (returning mid-week):
• Brief orientation only: "You're back in FW10 — you left off looking at [context]"
• NOT a summary of prior week
• NOT a replay of previous session
```

---

### PHASE 3: Governed Analysis Session + Assignment

#### TODO 3.1: Add Governed Analysis Session Specification

**File**: `neural_desgin_specs/interaction-spec.html`

**Location**: Inline with Analyst Handoff section (Part III, after integrating Fix 07)

**Add this specification**:

```
Governed Analysis Session
─────────────────────────
Distinct from Analyst Brief. The Analyst Brief is prose summary for context;
the Governed Analysis Session is the underlying data layer that produced findings.

Purpose: Give analysts the governed data they need without access to Alex's
investigation thread or chat history.

Contents:
• Tool call outputs with parameters used
• Data lineage: source tables, joins, filters applied
• MECE decompositions with full numerical data (not just summary)
• Confidence levels per data point
• Metric definitions referenced

Properties:
• Shareable via immutable link
• Read-only (analysts cannot modify)
• Timestamped to finding generation

Access:
• "Open Governed Analysis Session →" link appears in Analyst Brief
• Also accessible from response footer: "View data lineage"
```

---

#### TODO 3.2: Add Assignment Interaction Specification

**File**: `neural_desgin_specs/interaction-spec.html`

**Location**: Same section as TODO 3.1 (Part III, Analyst Handoff)

**Add this specification**:

```
Assignment Interaction
──────────────────────
Any response can be assigned to an analyst for follow-up investigation.

Trigger: "Assign to..." action in response navigation block

Flow:
1. Click "Assign to..." → dropdown with analyst list appears
2. Select analyst → assignment created
3. Notification sent to analyst containing:
   • Finding summary (from Analyst Brief)
   • Link to Governed Analysis Session
   • Assignment context from Alex (optional note)
4. Assignment badge appears in response footer

States:
• Assigned — waiting for analyst action
• In Progress — analyst has opened
• Completed — analyst marked done
• Returned — analyst returned with questions

Badge displays: "[State] · Assigned to [Name] · [Timestamp]"
```

---

#### TODO 3.3: Add Assignment Components to Design System

**File**: `neural_desgin_specs/design-system.html`

**Add to Level 1 Atoms section**:

```html
<div class="atom" id="atom-assignment-tag">
  <h4>atom-assignment-tag</h4>
  <p>Status indicator for analyst assignments</p>

  <div class="example-states">
    <span class="assignment-tag assigned">Assigned</span>
    <span class="assignment-tag in-progress">In Progress</span>
    <span class="assignment-tag completed">Completed</span>
    <span class="assignment-tag returned">Returned</span>
  </div>

  <h5>CSS</h5>
  <pre>
.assignment-tag {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.assignment-tag.assigned { background: var(--status-pending); }
.assignment-tag.in-progress { background: var(--status-active); }
.assignment-tag.completed { background: var(--status-success); }
.assignment-tag.returned { background: var(--status-warning); }
  </pre>
</div>
```

**Add to Level 2 Molecules section**:

```html
<div class="molecule" id="mol-assignment-dropdown">
  <h4>mol-assignment-dropdown</h4>
  <p>Analyst selection dropdown for task assignment</p>

  <div class="example">
    <div class="assignment-dropdown">
      <input type="text" placeholder="Search analysts..." class="assign-search">
      <ul class="analyst-list">
        <li class="analyst-option">Sarah Chen <span class="role">Senior Analyst</span></li>
        <li class="analyst-option">Marcus Johnson <span class="role">Data Scientist</span></li>
        <li class="analyst-option">Emily Rodriguez <span class="role">Analytics Lead</span></li>
      </ul>
    </div>
  </div>

  <h5>Behavior</h5>
  <ul>
    <li>Search filters list as user types</li>
    <li>Click analyst to select and close</li>
    <li>Escape key closes without selection</li>
    <li>Shows recent assignees first</li>
  </ul>
</div>

<div class="molecule" id="mol-data-lineage-panel">
  <h4>mol-data-lineage-panel</h4>
  <p>Collapsible panel showing data source lineage for a finding</p>

  <div class="example">
    <div class="lineage-panel">
      <div class="lineage-header">Data Lineage</div>
      <div class="lineage-tree">
        <div class="lineage-node source">fact_customer_weekly</div>
        <div class="lineage-connector">↓ JOIN ON customer_id</div>
        <div class="lineage-node source">dim_segment</div>
        <div class="lineage-connector">↓ WHERE fiscal_week = 'FW10'</div>
        <div class="lineage-node output">segment_performance_yoy</div>
      </div>
    </div>
  </div>
</div>
```

**Add to Level 3 Organisms section**:

```html
<div class="organism" id="org-governed-session">
  <h4>org-governed-session</h4>
  <p>Full data layer view for analyst handoff — extends Analyst Brief with technical detail</p>

  <h5>Composition</h5>
  <ul>
    <li>mol-data-lineage-panel (for each data source)</li>
    <li>Tool call output cards (query, parameters, results)</li>
    <li>MECE breakdown tables (full numerical data)</li>
    <li>Confidence indicators per metric</li>
    <li>Metric definition tooltips</li>
  </ul>

  <h5>Layout</h5>
  <pre>
┌─────────────────────────────────────────────┐
│ Governed Analysis Session          [Copy Link] [Close] │
├─────────────────────────────────────────────┤
│ Finding: PCW customer growth accelerating   │
│ Generated: FW10 · Mon 9:41am               │
├─────────────────────────────────────────────┤
│ ▼ Data Lineage                              │
│   [mol-data-lineage-panel]                  │
├─────────────────────────────────────────────┤
│ ▼ Tool Outputs                              │
│   Query: SELECT segment, COUNT(*)...        │
│   Parameters: { fiscal_week: 'FW10', ... }  │
│   Rows returned: 847                        │
├─────────────────────────────────────────────┤
│ ▼ MECE Decomposition                        │
│   [Full breakdown table with all numbers]   │
├─────────────────────────────────────────────┤
│ ▼ Confidence & Definitions                  │
│   Customer count: High (direct measurement) │
│   Growth rate: High (YoY comparison)        │
│   Attribution: Medium (modeled)             │
└─────────────────────────────────────────────┘
  </pre>
</div>
```

---

#### TODO 3.4: Add Assignment UI to Prototype

**File**: `neural_desgin_specs/prototype.html`

**Location**: Response navigation block (where "Share this finding" etc. appear)

**Add HTML**:

```html
<!-- In response footer/navigation area -->
<div class="response-actions">
  <!-- Existing actions... -->

  <button class="action-btn assign-btn" onclick="openAssignDropdown(this)">
    <span class="icon">👤</span> Assign to...
  </button>

  <div class="assign-dropdown hidden" id="assignDropdown">
    <input type="text" placeholder="Search analysts..." class="assign-search" oninput="filterAnalysts(this.value)">
    <ul class="analyst-list">
      <li class="analyst-option" onclick="assignTo('Sarah Chen', this)">
        <span class="name">Sarah Chen</span>
        <span class="role">Senior Analyst</span>
      </li>
      <li class="analyst-option" onclick="assignTo('Marcus Johnson', this)">
        <span class="name">Marcus Johnson</span>
        <span class="role">Data Scientist</span>
      </li>
      <li class="analyst-option" onclick="assignTo('Emily Rodriguez', this)">
        <span class="name">Emily Rodriguez</span>
        <span class="role">Analytics Lead</span>
      </li>
    </ul>
  </div>
</div>

<!-- Assignment badge (appears after assignment) -->
<div class="assignment-badge hidden" id="assignmentBadge">
  <span class="assignment-tag assigned">Assigned</span>
  <span class="assignment-detail">to <strong id="assigneeName"></strong></span>
  <span class="assignment-time" id="assignmentTime"></span>
</div>
```

**Add JavaScript**:

```javascript
function openAssignDropdown(btn) {
  const dropdown = btn.nextElementSibling;
  dropdown.classList.toggle('hidden');
  if (!dropdown.classList.contains('hidden')) {
    dropdown.querySelector('.assign-search').focus();
  }
}

function filterAnalysts(query) {
  const options = document.querySelectorAll('.analyst-option');
  const q = query.toLowerCase();
  options.forEach(opt => {
    const name = opt.querySelector('.name').textContent.toLowerCase();
    opt.style.display = name.includes(q) ? 'flex' : 'none';
  });
}

function assignTo(analyst, element) {
  // Close dropdown
  element.closest('.assign-dropdown').classList.add('hidden');

  // Show badge
  const badge = document.getElementById('assignmentBadge');
  document.getElementById('assigneeName').textContent = analyst;
  document.getElementById('assignmentTime').textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  badge.classList.remove('hidden');

  // Update button state
  const btn = document.querySelector('.assign-btn');
  btn.innerHTML = '<span class="icon">✓</span> Assigned';
  btn.disabled = true;

  // In production: send notification to analyst
  console.log(`Assignment created: ${analyst} notified with Governed Analysis Session link`);
}

// Close dropdown on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('.assign-btn') && !e.target.closest('.assign-dropdown')) {
    document.querySelectorAll('.assign-dropdown').forEach(d => d.classList.add('hidden'));
  }
});

// Close dropdown on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.assign-dropdown').forEach(d => d.classList.add('hidden'));
  }
});
```

---

#### TODO 3.5: Add Governed Session Overlay to Prototype

**File**: `neural_desgin_specs/prototype.html`

**Location**: After Analyst Brief overlay (~lines 703-778)

**Add HTML**:

```html
<!-- Governed Analysis Session Overlay -->
<div class="overlay-backdrop hidden" id="governedSessionBackdrop" onclick="closeGovernedSession()"></div>
<div class="overlay governed-session hidden" id="governedSession">
  <div class="overlay-header">
    <h2>Governed Analysis Session</h2>
    <div class="overlay-actions">
      <button class="btn-secondary" onclick="copySessionLink()">Copy Link</button>
      <button class="btn-close" onclick="closeGovernedSession()">×</button>
    </div>
  </div>

  <div class="overlay-meta">
    <span class="finding-title">Finding: PCW customer growth accelerating beyond target</span>
    <span class="finding-timestamp">Generated: FW10 · Mon 9:41am</span>
  </div>

  <div class="overlay-body">
    <section class="session-section collapsible open">
      <h3 class="section-header" onclick="toggleSection(this)">
        <span class="collapse-icon">▼</span> Data Lineage
      </h3>
      <div class="section-content">
        <div class="lineage-tree">
          <div class="lineage-node">
            <span class="node-type">Source</span>
            <span class="node-name">fact_customer_weekly</span>
          </div>
          <div class="lineage-connector">
            <span class="connector-label">JOIN ON customer_id</span>
          </div>
          <div class="lineage-node">
            <span class="node-type">Source</span>
            <span class="node-name">dim_segment</span>
          </div>
          <div class="lineage-connector">
            <span class="connector-label">WHERE fiscal_week = 'FW10' AND customer_type = 'PCW'</span>
          </div>
          <div class="lineage-node output">
            <span class="node-type">Output</span>
            <span class="node-name">segment_performance_yoy</span>
          </div>
        </div>
      </div>
    </section>

    <section class="session-section collapsible">
      <h3 class="section-header" onclick="toggleSection(this)">
        <span class="collapse-icon">▶</span> Tool Outputs
      </h3>
      <div class="section-content hidden">
        <div class="tool-output">
          <div class="tool-name">segment_performance_query</div>
          <pre class="tool-query">SELECT
  segment_name,
  COUNT(DISTINCT customer_id) as customer_count,
  SUM(total_value) as total_value,
  AVG(trips_per_customer) as avg_trips
FROM fact_customer_weekly fcw
JOIN dim_segment ds ON fcw.segment_id = ds.segment_id
WHERE fiscal_week = 'FW10'
GROUP BY segment_name</pre>
          <div class="tool-params">
            <span class="param">fiscal_week: 'FW10'</span>
            <span class="param">comparison_period: 'YoY'</span>
          </div>
          <div class="tool-result">Rows returned: 847 · Execution: 1.2s</div>
        </div>
      </div>
    </section>

    <section class="session-section collapsible">
      <h3 class="section-header" onclick="toggleSection(this)">
        <span class="collapse-icon">▶</span> MECE Decomposition
      </h3>
      <div class="section-content hidden">
        <table class="mece-table">
          <thead>
            <tr>
              <th>Segment</th>
              <th>Customers</th>
              <th>Δ YoY</th>
              <th>% of Total Δ</th>
              <th>Value Impact</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>PCW - Active</td>
              <td>892,450</td>
              <td class="positive">+45,230</td>
              <td>62.3%</td>
              <td class="positive">+$15.2M</td>
            </tr>
            <tr>
              <td>PCW - New</td>
              <td>124,800</td>
              <td class="positive">+12,400</td>
              <td>17.1%</td>
              <td class="positive">+$3.8M</td>
            </tr>
            <tr>
              <td>PCW - Reactivated</td>
              <td>67,200</td>
              <td class="positive">+8,900</td>
              <td>12.3%</td>
              <td class="positive">+$2.1M</td>
            </tr>
            <tr>
              <td>Retail-only - Churned</td>
              <td>—</td>
              <td class="negative">-8,100</td>
              <td>-11.2%</td>
              <td class="negative">-$3.0M</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="session-section collapsible">
      <h3 class="section-header" onclick="toggleSection(this)">
        <span class="collapse-icon">▶</span> Confidence & Definitions
      </h3>
      <div class="section-content hidden">
        <div class="confidence-list">
          <div class="confidence-item">
            <span class="metric-name">Customer count</span>
            <span class="confidence-level high">High</span>
            <span class="confidence-note">Direct measurement from loyalty data</span>
          </div>
          <div class="confidence-item">
            <span class="metric-name">YoY growth rate</span>
            <span class="confidence-level high">High</span>
            <span class="confidence-note">Same-period comparison, seasonality controlled</span>
          </div>
          <div class="confidence-item">
            <span class="metric-name">Value attribution</span>
            <span class="confidence-level medium">Medium</span>
            <span class="confidence-note">Modeled based on segment averages</span>
          </div>
        </div>

        <h4>Metric Definitions</h4>
        <dl class="definitions-list">
          <dt>PCW Customer</dt>
          <dd>Customer with both pharmacy fill and retail purchase within rolling 52 weeks</dd>
          <dt>Active</dt>
          <dd>Transaction within past 90 days</dd>
          <dt>Value Impact</dt>
          <dd>Δ Customers × Average Value per Customer for segment</dd>
        </dl>
      </div>
    </section>
  </div>
</div>
```

**Add JavaScript**:

```javascript
function openGovernedSession() {
  document.getElementById('governedSessionBackdrop').classList.remove('hidden');
  document.getElementById('governedSession').classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Prevent background scroll
}

function closeGovernedSession() {
  document.getElementById('governedSessionBackdrop').classList.add('hidden');
  document.getElementById('governedSession').classList.add('hidden');
  document.body.style.overflow = ''; // Restore scroll
}

function toggleSection(header) {
  const section = header.closest('.session-section');
  const content = section.querySelector('.section-content');
  const icon = header.querySelector('.collapse-icon');

  content.classList.toggle('hidden');
  section.classList.toggle('open');
  icon.textContent = content.classList.contains('hidden') ? '▶' : '▼';
}

function copySessionLink() {
  const link = window.location.href + '#governed-session-fw10-pcw-growth';
  navigator.clipboard.writeText(link).then(() => {
    const btn = document.querySelector('.governed-session .btn-secondary');
    const originalText = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = originalText, 2000);
  });
}
```

**Add link in Analyst Brief overlay** (modify existing):

```html
<!-- Inside the existing Analyst Brief overlay, add this link -->
<div class="analyst-brief-footer">
  <a href="#" class="governed-session-link" onclick="closeAnalystBrief(); openGovernedSession(); return false;">
    Open Governed Analysis Session →
  </a>
  <p class="link-description">View tool outputs, data lineage, and full MECE breakdown</p>
</div>
```

---

## Verification Checklist

After completing all TODOs, verify:

### Phase 1 Verification
- [ ] `design-system.html`: Search for "Addendum" returns 0 results
- [ ] `design-system.html`: All 6 component updates (A-F) now exist in their proper Level sections
- [ ] `design-system.html`: Concise changelog exists at end of document
- [ ] `interaction-spec.html`: Search for "PART V" returns 0 results
- [ ] `interaction-spec.html`: All 7 fixes now exist in Parts II/III inline
- [ ] `interaction-spec.html`: Concise changelog exists at end of document

### Phase 2 Verification
- [ ] `prototype.html`: Cold open shows "Here's what I found worth leading with this week."
- [ ] `prototype.html`: 1-2 story lead cards appear with "Lead Story" / "Also Notable" badges
- [ ] `prototype.html`: Each lead card has "Why this leads" explanation
- [ ] `prototype.html`: Standard 3 questions appear below divider, visually secondary
- [ ] `interaction-spec.html`: Entry Mode 01 describes story-led structure

### Phase 3 Verification
- [ ] `prototype.html`: "Assign to..." button visible in response navigation
- [ ] `prototype.html`: Clicking "Assign to..." opens dropdown with analyst list
- [ ] `prototype.html`: Selecting analyst shows assignment badge with name and timestamp
- [ ] `prototype.html`: Analyst Brief contains "Open Governed Analysis Session →" link
- [ ] `prototype.html`: Clicking link opens Governed Session overlay
- [ ] `prototype.html`: Governed Session shows: Data Lineage, Tool Outputs, MECE Decomposition, Confidence
- [ ] `prototype.html`: "Copy Link" button in Governed Session copies shareable link
- [ ] `design-system.html`: `atom-assignment-tag` exists in Level 1
- [ ] `design-system.html`: `mol-assignment-dropdown` exists in Level 2
- [ ] `design-system.html`: `mol-data-lineage-panel` exists in Level 2
- [ ] `design-system.html`: `org-governed-session` exists in Level 3
- [ ] `interaction-spec.html`: Governed Analysis Session specification exists in Part III
- [ ] `interaction-spec.html`: Assignment Interaction specification exists in Part III

---

## Execution Notes for New Agent

1. **Work through TODOs in order** — Phase 1 must complete before Phases 2/3
2. **When moving addendum content**: Preserve HTML structure, class names, and formatting
3. **Match existing code style** in each file (indentation, naming conventions)
4. **Test prototype in browser** after each phase to verify functionality
5. **Use Read tool first** before any Edit operations
6. **Line numbers are approximate** — search for the section headers to find exact locations
