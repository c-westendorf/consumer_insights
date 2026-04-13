# Data Scientist Engine — Cowork Plugin

---

## Product Specification

### What This Product Is

The Data Scientist Engine is a plugin for Claude Cowork that gives business teams
a proactive, always-on analyst. Instead of requesting analysis and waiting for data
science to deliver it, teams open Claude and find relevant customer insights already
waiting for them — scoped to their segments, timed to their decision rhythm, and
trustworthy because every insight follows a governed, auditable methodology.

The product exists to solve one problem: **the time between "something changed in
our customer base" and "the team is aligned on what to do about it" is too long.**
Today that gap is filled with requests, queue times, methodology debates, and
socialization. This product compresses that gap by automating the scoping, analysis,
and delivery of customer insights so teams can go straight to scenario planning and
risk assessment.

### What This Product Is Not

**It is not a BI dashboard or reporting tool.** Dashboards show you what happened.
This product tells you what changed, why it matters for your segment, and what levers
you have. The difference is the engine selects the right analytical approach
automatically — the user doesn't choose a chart or write a query.

**It is not a replacement for data scientists.** The engine runs analyses that data
scientists have designed and approved. It does not invent methodology. It does not
make strategic recommendations. It produces governed, auditable reads that data
scientists would recognize as sound work — just faster. Data scientists maintain the
playbooks, review what the engine learns, and decide what gets promoted.

**It is not a self-governing AI system.** The engine can learn to be more relevant
over time — leading with the metrics you care about, adjusting when it runs to match
when you actually work. But it cannot change how an analysis is done without human
review. Every improvement to methodology goes through the data science org. The
engine proposes. Humans promote.

**It is not a general-purpose AI assistant.** The engine is scoped to customer growth
analytics within the Customer Growth Framework. It does not answer arbitrary questions,
write emails, or manage calendars. It does one thing — customer insight delivery — and
it does it proactively, on schedule, and to a governed standard.

### Why It Works This Way

Three design principles drive every decision in this product:

**Trust on arrival.** If people don't trust the insight, speed doesn't matter. They'll
just debate faster. Every analysis the engine produces carries an audit trail: what
was asked (scope), how it was done (playbook), what choices were made (decision log),
and what it means (conclusion). Teams skip the methodology debate because the
methodology is transparent and governed.

**Speed through anticipation, not automation.** The engine doesn't just run faster.
It runs before you ask. By knowing what segments you own, when you make decisions,
and what thresholds matter, the engine pre-computes insights so they're ready when
you arrive. The goal is that the conversation starts with "here's what you need to
know" instead of "what do you want to know?"

**Learning without losing control.** The engine gets better over time, but only in
controlled ways. It learns to personalize what it shows you and when. It captures
deviations from standard playbooks that worked well. But it never modifies the
governed methodology on its own. The data science org reviews what the engine
learned across all teams quarterly, promotes the best patterns, and ships them as
updates. This is how the engine matures without creating ungoverned drift.

---

### Core Capabilities

These are the product's capabilities described as trackable features. Each capability
maps to work that can be scoped, built, and verified independently. The naming
convention is designed for use in JIRA or any project tracker.

---

#### Capability 1: Governed Analysis Cycle

**What it does:** Runs a complete customer analysis — from scoping the question to
producing a conclusion — using pre-approved methodology. The engine selects the right
analytical approach (called a "playbook") based on the segment and the signal that
triggered the analysis. Every run produces a structured output with a full audit trail.

**Why it matters:** This is what makes the engine trustworthy. Anyone receiving an
insight can see exactly how it was produced. No black boxes.

**What a user experiences:** They either receive a completed analysis as part of
their briefing, or they type `/insights` and the engine walks through the cycle
interactively — scoping the question, running the analysis, and delivering results.

Trackable features:

| Feature ID | Feature Name | Description |
|---|---|---|
| GAC-1 | Scope Template (CGF) | The standard framework that defines what gets analyzed — which customer segment, what time window, what business question, and what success looks like. This is the starting point for every analysis the engine runs. |
| GAC-2 | Playbook Library | The collection of approved analytical approaches the engine can use. Each playbook defines a specific type of analysis (e.g., engagement profiling, churn risk assessment). Data science writes and maintains these. |
| GAC-3 | Playbook Selection | The engine's ability to match the right playbook to the right situation. At launch this is rule-based (signal X triggers playbook Y). Over time it improves based on which pairings produce the best results. |
| GAC-4 | Evaluation Gate | The engine's self-check at the end of every analysis. Before delivering results, it verifies completeness, confidence, and quality against defined criteria. If it doesn't pass, the engine flags the issue instead of delivering a bad read. |
| GAC-5 | Audit Trail | The set of documents produced with every analysis: what was asked (scope), how it was done (playbook), what choices were made (decision log), and what it means (conclusion). This is what makes the output trustworthy. |
| GAC-6 | Interactive Analysis Command | The `/insights` command that lets a user manually trigger a full analysis cycle and interact with the engine as it scopes and runs. |

---

#### Capability 2: User Awareness

**What it does:** The engine knows who each user is, what customer segments they own,
what metrics matter to them, and at what altitude they make decisions (campaign-level
vs. strategy-level vs. operational). This is configured once at setup and refined
over time as the engine observes how the user actually engages.

**Why it matters:** Without this, every user gets the same generic output. With it,
a marketing manager sees campaign-actionable insights about their segments, while a
VP sees a strategic roll-up — from the same underlying data.

**What a user experiences:** During a 30-minute onboarding, their segments, metrics,
thresholds, and review cadence are configured. From then on, everything the engine
produces is scoped to their world. Over time, the engine notices they always drill
into cost metrics and starts leading with those.

Trackable features:

| Feature ID | Feature Name | Description |
|---|---|---|
| UA-1 | User Profile Configuration | The onboarding setup where a user's segment ownership, primary metrics, decision altitude, and preferred depth are defined. This is the foundation that scopes all engine output to the right person. |
| UA-2 | Threshold Configuration | Setting the specific metric boundaries that matter to each user — e.g., "alert me when 30-day retention drops below 42%." These thresholds drive what the engine monitors and when it flags something as urgent. |
| UA-3 | Decision Cadence Setup | Configuring when the user makes decisions — weekly reviews on Mondays, monthly planning on last Friday, quarterly reviews on request. The engine aligns its analysis schedule to this rhythm. |
| UA-4 | Behavioral Observation Log | The engine silently records which briefing sections the user opens, skips, drills into, and what they ask for manually. This is not user-facing — it's the raw data the engine uses to improve relevance over time. |
| UA-5 | Preference Learning | The engine uses behavioral observations to adjust what it shows first, how much depth it presents by default, and which metrics it leads with. This changes content ranking, never analytical methodology. |
| UA-6 | Configuration Command | The `/configure` command that lets a user view and adjust their profile, segments, thresholds, and cadence at any time. |

---

#### Capability 3: Schedule Intelligence

**What it does:** The engine decides what to compute and when, using three inputs:
the user's decision rhythm (weekly review, monthly planning), metric thresholds that
are checked daily, and the user's actual calendar (pre-meeting preparation). Analysis
runs in advance so results are ready before the user needs them.

**Why it matters:** This is what makes the engine proactive rather than reactive. The
user doesn't request a Monday briefing — it's already there. They don't ask for a
pre-QBR analysis — the engine saw the meeting on the calendar and pre-computed it.

**What a user experiences:** They open Claude on Monday morning and their weekly
briefing is ready. Before a business review, they find a comprehensive analysis
already prepared. If a critical threshold is breached overnight, they see an urgent
flag when they arrive.

Trackable features:

| Feature ID | Feature Name | Description |
|---|---|---|
| SI-1 | Cadence-Based Scheduling | Automated analysis runs aligned to the user's decision rhythm. Weekly scans produce a lightweight briefing. Monthly runs produce a deeper analysis with trend context. These run on schedule without the user asking. |
| SI-2 | Threshold Monitoring | A daily scan that checks each user's configured thresholds against current data. When a metric breaches a high-severity threshold, the engine queues a targeted analysis immediately. Medium-severity breaches get flagged in the next regular briefing. |
| SI-3 | Near-Threshold Warnings | When a metric is approaching a threshold (within 10%) but hasn't breached yet, the engine adds a "watch" note to the briefing. Early signal before it becomes urgent. |
| SI-4 | Calendar-Aware Pre-Computation | The engine reads the user's calendar. When it sees a business review, QBR, or strategy meeting, it automatically runs a comprehensive analysis 24 hours before the event and prepares an executive-altitude briefing. |
| SI-5 | Timing Adaptation | Over time, the engine learns when the user actually opens Claude (maybe Tuesday at 9:30, not Monday at 8:00) and shifts computation so the briefing is fresh when they arrive, not stale. |
| SI-6 | Cloud vs. Local Orchestration | Analysis-heavy work runs as cloud scheduled tasks overnight (no dependency on the user's laptop being open). Results are written to shared storage. The local Cowork session picks up results and assembles the briefing on session start. |

---

#### Capability 4: Proactive Briefing

**What it does:** When a user opens Claude, the engine assembles a briefing from
pre-computed results. The briefing has three layers: a headline (what matters right
now), context (supporting analysis and trends), and scenario inputs (levers and
projected outcomes). The user never faces a blank prompt.

**Why it matters:** This is the product experience that delivers decision velocity.
The user doesn't start from "what should I look at?" — they start from "here's what
changed and here's what you can do about it." This gets teams in front of insights
instead of behind them.

**What a user experiences:** They open Claude and see: "Your reactivated segment's
30-day retention dropped 4 points. I ran the engagement profiling playbook. Here's
the read. Two things look actionable." If nothing is urgent, they see a steady-state
summary with their next scheduled deep-dive date. They never see a blank screen.

Trackable features:

| Feature ID | Feature Name | Description |
|---|---|---|
| PB-1 | Session Start Assembly | The logic that runs when a user opens their Cowork project. It checks for pre-computed results, threshold alerts, and pending items, then assembles them into a coherent briefing ordered by priority. |
| PB-2 | Headline Layer | The top-line summary that is always shown — the one or two things that matter most right now. Designed to be understood in under 30 seconds. |
| PB-3 | Context Layer | The supporting analysis behind the headline — trend lines, comparisons, methodology notes. Available on demand but not forced on the user. Respects the user's preferred depth setting. |
| PB-4 | Scenario Layer | Forward-looking decision inputs: which levers matter, what the projected range of outcomes is, and what trade-offs exist. This turns a backward-looking insight into a decision surface. (Deferred — requires stakeholder input.) |
| PB-5 | Steady State Summary | What the user sees when nothing is breached and no analysis is pending. Confirms all segments are within thresholds, shows the next scheduled deep-dive, and offers to explore something specific. |
| PB-6 | Error and Data Quality Transparency | When the engine couldn't complete an analysis due to data issues, it says so clearly — what went wrong, what it could still compute, and what's flagged for review. No silent failures. |
| PB-7 | Briefing Command | The `/briefing` command that lets a user regenerate or refresh their briefing on demand, pulling from the latest available data or triggering a fresh run. |

---

#### Capability 5: Self-Learning Capture

**What it does:** When the engine runs an analysis that deviates from the standard
playbook — a different metric worked better, a threshold needed adjustment, a user
kept asking for something the engine couldn't do — it writes a structured record
called a "proposal." These proposals accumulate per project and become the raw
material for the data science org's quarterly review.

**Why it matters:** This is how the engine improves without losing governance. It
doesn't change its own methodology. It captures evidence of what might need to change,
and humans decide whether to promote those changes. Over time, every promoted
improvement makes the engine faster and more relevant for everyone.

**What a user experiences:** Mostly invisible. The engine captures proposals silently
in the background. Users can type `/status` to see what the engine has been learning
and `/propose` to manually flag something. The real audience for proposals is the
data science org during quarterly review.

Trackable features:

| Feature ID | Feature Name | Description |
|---|---|---|
| SLC-1 | Deviation Detection | The engine's ability to recognize when a run diverged from the standard playbook — e.g., a different metric was more predictive, or a different threshold produced more actionable results. |
| SLC-2 | Gap Detection | The engine's ability to recognize when a user asks for something no playbook covers. These "scope gaps" signal that the playbook library may need to grow. |
| SLC-3 | Proposal Log Format | The structured record written for each deviation or gap: what changed, why, whether it passed the quality gate, how often it's recurred, and whether the user engaged with the result. |
| SLC-4 | Recurrence Tracking | The engine tracks how many times the same deviation or gap appears. A pattern that shows up once is noise. A pattern that shows up five times across three projects is a signal worth promoting. |
| SLC-5 | Status Command | The `/status` command that shows the user what the engine has been doing — recent runs, active monitors, proposal count, and confidence scores on playbook-to-trigger mappings. |
| SLC-6 | Manual Proposal Command | The `/propose` command that lets a user explicitly flag a playbook variation or gap for the learning log, with their own annotation on why it mattered. |

---

#### Capability 6: Governed Maturation

**What it does:** The data science org reviews proposals from all active projects
on a quarterly cycle. High-signal patterns get promoted into the core playbook
library. Thresholds that consistently need adjustment get refined in the defaults.
Scope gaps that recur across teams become new playbooks. Updates ship as a plugin
version bump through the enterprise marketplace.

**Why it matters:** This is what makes the system self-improving at an organizational
level without becoming ungoverned. Individual teams benefit from patterns discovered
anywhere in the org, but only after human review. The engine compounds in value
over time because each quarterly cycle makes it faster and more relevant.

**What a user experiences:** Periodically, their plugin updates. When it does,
the engine may handle a new type of analysis it couldn't before, or its default
thresholds may better match their context out of the box. The user's existing
configuration is preserved — updates extend the engine's capabilities, they don't
reset the user's setup.

Trackable features:

| Feature ID | Feature Name | Description |
|---|---|---|
| GM-1 | Cross-Project Proposal Aggregation | The ability for the DS org to pull proposal logs from all active projects into a single review surface. Patterns that recur across teams are the highest-signal candidates for promotion. |
| GM-2 | Promotion Triage Rubric | The criteria for deciding what to promote: recurrence count, quality gate pass rate, user engagement rate, and cross-project presence. Clear, repeatable, not subjective. |
| GM-3 | Playbook Version Control | Playbooks are versioned. When a promoted change is merged, the playbook increments. Projects can see which version they're running and what changed. |
| GM-4 | Plugin Release Pipeline | The process for packaging updated playbooks, thresholds, and new capabilities into a plugin version bump and pushing it through the enterprise marketplace. |
| GM-5 | Backward-Compatible Updates | Plugin updates extend capabilities without resetting user configurations, behavioral logs, or project context. The user's existing setup is preserved. |
| GM-6 | Deprecation and Pruning | When a playbook or heuristic is no longer useful, the DS org removes it from the core library. Pruning keeps the engine lean and prevents accumulation of stale methodology. |

---

### Feature Phasing — What Ships When

#### Phase 1: Foundation (Month 1–2, Pre-Enterprise Launch)

The engine runs a governed analysis cycle, knows who the user is, and operates
on a basic schedule. Users can trigger analysis manually and receive results
that are trustworthy and auditable. The proactive briefing exists but is simple.
Self-learning captures data but doesn't act on it yet.

| Feature ID | Feature Name | Phase 1 Scope |
|---|---|---|
| GAC-1 | Scope Template (CGF) | Full — ships as the core governance artifact |
| GAC-2 | Playbook Library | 2 playbooks: engagement profiling + churn risk |
| GAC-3 | Playbook Selection | Rule-based mapping only (signal X → playbook Y) |
| GAC-4 | Evaluation Gate | Full — quality checks run on every analysis |
| GAC-5 | Audit Trail | Full — scope, playbook, decision log, conclusion |
| GAC-6 | Interactive Analysis Command | Full — `/insights` works end to end |
| UA-1 | User Profile Configuration | Full — onboarding flow with `/configure` |
| UA-2 | Threshold Configuration | Full — per-segment, per-metric thresholds |
| UA-3 | Decision Cadence Setup | Full — weekly/monthly/quarterly rhythm |
| UA-4 | Behavioral Observation Log | Write-only — captures data, no action taken |
| UA-5 | Preference Learning | Not started — deferred to Phase 2 |
| UA-6 | Configuration Command | Full — `/configure` command |
| SI-1 | Cadence-Based Scheduling | Weekly + monthly scheduled tasks configured |
| SI-2 | Threshold Monitoring | Daily scan via cloud scheduled task |
| SI-3 | Near-Threshold Warnings | Full — watch notes in briefings |
| SI-4 | Calendar-Aware Pre-Computation | Not started — requires calendar connector |
| SI-5 | Timing Adaptation | Not started — deferred to Phase 2 |
| SI-6 | Cloud vs. Local Orchestration | Basic — cloud runs analysis, local reads results |
| PB-1 | Session Start Assembly | Basic — checks for results and assembles briefing |
| PB-2 | Headline Layer | Full — always shown |
| PB-3 | Context Layer | Basic — available but not personalized to depth preference |
| PB-4 | Scenario Layer | Not started — requires stakeholder input |
| PB-5 | Steady State Summary | Full |
| PB-6 | Error and Data Quality Transparency | Full |
| PB-7 | Briefing Command | Full — `/briefing` command |
| SLC-1 | Deviation Detection | Full — engine logs when it diverges from playbook |
| SLC-2 | Gap Detection | Full — unmatched manual queries logged |
| SLC-3 | Proposal Log Format | Full — structured YAML format |
| SLC-4 | Recurrence Tracking | Full — counter increments on repeat patterns |
| SLC-5 | Status Command | Full — `/status` command |
| SLC-6 | Manual Proposal Command | Full — `/propose` command |
| GM-1 through GM-6 | All Governed Maturation | Not started — first review at Month 3 |

#### Phase 2: Intelligence (Month 3–6, Post-Launch Iteration)

The engine starts acting on what it captured. Briefings personalize to the user's
actual behavior. Playbook selection improves based on accumulated evidence.
Calendar integration makes pre-meeting preparation automatic. The DS org runs the
first quarterly review and promotes high-signal patterns.

| Feature ID | Feature Name | Phase 2 Scope |
|---|---|---|
| GAC-2 | Playbook Library | Expand to 4+ playbooks based on usage patterns |
| GAC-3 | Playbook Selection | Confidence-weighted selection based on run history |
| UA-5 | Preference Learning | Active — engine adjusts content ranking and depth |
| SI-4 | Calendar-Aware Pre-Computation | Full — reads calendar, pre-computes before meetings |
| SI-5 | Timing Adaptation | Active — shifts computation to match user's real schedule |
| PB-3 | Context Layer | Personalized — depth adjusts to user behavior |
| PB-4 | Scenario Layer | Design started — stakeholder input incorporated |
| GM-1 | Cross-Project Proposal Aggregation | First quarterly review completed |
| GM-2 | Promotion Triage Rubric | Rubric applied to real proposals |
| GM-3 | Playbook Version Control | First promoted changes versioned and shipped |
| GM-4 | Plugin Release Pipeline | First plugin update pushed via enterprise marketplace |

#### Phase 3: Scale (Month 6–12, Organizational Expansion)

The engine runs across 10+ projects. Cross-team patterns emerge. The quarterly
review cycle is established and producing compounding value. Scenario layer is
designed with stakeholder input and operational. Behavioral adaptation is mature
enough that the engine feels like a personalized analyst for each user.

| Feature ID | Feature Name | Phase 3 Scope |
|---|---|---|
| GAC-2 | Playbook Library | 8+ playbooks covering full customer lifecycle |
| PB-4 | Scenario Layer | Full — levers, ranges, trade-offs in briefings |
| GM-5 | Backward-Compatible Updates | Proven across multiple plugin update cycles |
| GM-6 | Deprecation and Pruning | First playbook or heuristic retired from core |

---

### What Success Looks Like

At Phase 1 completion, the engine should be able to pass this test:

> A marketing manager opens Claude on Monday morning. Without typing anything,
> they see a briefing that tells them their reactivated segment's retention
> dropped below their threshold over the weekend. The briefing includes the
> analysis that explains why, produced by a governed playbook with a full
> audit trail. The manager reads it in two minutes and goes directly into
> planning their response. No request was filed. No data scientist was
> pulled off other work. No methodology was debated.

At Phase 3 completion, the engine should be able to pass this test:

> Three teams open Claude on the same morning. Each sees a briefing scoped
> to their segments, tuned to their metrics, and timed to their rhythm.
> A pattern discovered by one team six months ago — that reactivated customers
> respond differently to engagement scoring — is now part of the core playbook
> and benefits all three teams automatically. The data science org spent one
> day last quarter reviewing proposals and promoting the best ones. The engine
> is measurably faster at producing trusted reads than it was at launch, and
> no one had to rebuild anything.

---

## Technical Architecture

_Everything below this line describes how the capabilities above are implemented._
_The product spec above is the "what and why." The architecture below is the "how."_

---

## 1. Plugin Package Structure

The plugin ships as a single Cowork plugin installed via the enterprise private marketplace.
It bundles three layers: **skills** (what it can do), **commands** (how users invoke it),
and **context files** (what it knows about the user, the domain, and itself).

---

### Skills (Analytical Capabilities)

Each skill is a reusable instruction set the engine uses to execute a step in the
Define → Analyze → Deliver cycle.

```
/skills
  cgf-scoping.md          # The Customer Growth Framework scope template
                           # Governs what gets analyzed — segment, timeframe,
                           # business question, success criteria
                           # This is the "constitution" — never self-modified

  playbook-engagement.md   # Engagement profiling playbook
  playbook-churn-risk.md   # Churn risk assessment playbook
  playbook-reactivation.md # Reactivation effectiveness playbook
  playbook-lifecycle.md    # Lifecycle stage transition playbook
                           # (add more as the governed library grows)

  feature-engineering.md   # Governed feature engineering patterns
                           # (e.g., BG/NBD-inspired features, survival features,
                           # EBM ensemble-inspired features)

  evaluation-gate.md       # How the engine evaluates its own output
                           # Quality criteria, completeness checks,
                           # confidence thresholds

  proposal-capture.md      # Instructions for how the engine logs deviations
                           # from playbooks — the self-learning capture format

  briefing-assembly.md     # How to assemble a user-facing briefing
                           # from raw analysis into headline / context / scenario layers
```

### Commands (User-Facing Entry Points)

```
/insights       # Full cycle: scope → analyze → deliver
                # Engine selects playbook based on trigger or user request
                # Produces a conclusion artifact with audit trail

/scope          # Just the Define phase — run CGF scoping interactively
                # Useful when a user wants to define a new analysis manually

/briefing       # Generate/regenerate the current briefing from latest data
                # Pulls from most recent scheduled run or triggers a fresh one

/status         # Show what the engine has been doing — recent runs,
                # active monitors, pending proposals, confidence scores

/propose        # User manually flags something for the learning log
                # "This playbook variation worked well, capture it"

/configure      # Adjust user config — segments, thresholds, cadence, altitude
```

---

## 2. User Awareness Model

The engine needs to know three things about each user: **who they are**,
**what they care about**, and **how they work**. This is stored in context files
within each Cowork project.

### user-config.yaml (Set at onboarding, ~30 min setup)

```yaml
user:
  name: "Maria Chen"
  role: "Senior Marketing Manager, Retention"
  decision_altitude: "campaign"       # campaign | strategy | operational
  
segments_owned:
  - segment: "reactivated_customers"
    primary_metrics:
      - "30d_retention_rate"
      - "reactivation_cost_efficiency"
      - "second_purchase_rate"
    thresholds:
      - metric: "30d_retention_rate"
        direction: "below"
        value: 0.42
        severity: "high"
      - metric: "reactivation_cost_efficiency"
        direction: "above"
        value: 35.00
        severity: "medium"

  - segment: "low_engaged_customers"
    primary_metrics:
      - "engagement_score_trend"
      - "days_since_last_activity"
    thresholds:
      - metric: "engagement_score_trend"
        direction: "below"
        value: -0.15
        severity: "high"

decision_cadence:
  weekly_review: "monday"
  monthly_planning: "last_friday"
  quarterly_review: "manual"          # triggered, not scheduled

preferred_depth: "headline_first"     # headline_first | full_detail | executive_only
```

### user-behavior.yaml (Accumulated by the engine over time)

```yaml
# This file is WRITTEN by the engine, not configured by the user.
# It captures engagement patterns to improve relevance ranking.

engagement_log:
  last_updated: "2026-04-11"
  
  briefing_interactions:
    - date: "2026-04-07"
      sections_opened: ["headline", "context"]
      sections_skipped: ["scenario"]
      time_spent_seconds: 145
      drilled_into: ["reactivation_cost_efficiency"]
      ignored: ["engagement_score_trend"]
    
    - date: "2026-03-31"
      sections_opened: ["headline"]
      sections_skipped: ["context", "scenario"]
      time_spent_seconds: 40
      drilled_into: []
      follow_up_query: "break down cost by channel"

  manual_queries:
    # Things the user asked for that the engine DIDN'T anticipate
    - date: "2026-04-03"
      query: "compare reactivated vs new customer LTV at 90 days"
      matched_playbook: null
      resolution: "ad_hoc_analysis"
      # SIGNAL: user wants cross-segment comparison the engine doesn't offer yet

  derived_preferences:
    leads_with: "cost_metrics"               # learned from drill-down patterns
    typical_session_day: "tuesday"            # learned: user actually engages Tue not Mon
    typical_session_time: "09:30"
    avg_depth: "headline_plus_one_drill"
    never_engages_with: ["raw_feature_tables"]
    frequently_requests: ["channel_breakdowns", "ltv_comparisons"]
```

---

## 3. Schedule Intelligence — What Runs When and Why

The engine doesn't just run on a dumb timer. It uses three schedule sources
to decide what to compute and when.

### Schedule Source 1: Decision Calendar (deterministic)

Derived from `user-config.yaml` cadence + actual calendar integration.

```
RULE: weekly_review = monday
  → Scheduled task: Sunday 11pm (cloud) or Monday 6am (local)
  → Runs: threshold check on all owned segments
  → Produces: weekly briefing with week-over-week deltas
  → Playbook: lightweight scan — thresholds + trend direction only

RULE: monthly_planning = last_friday
  → Scheduled task: Thursday evening
  → Runs: full playbook cycle on owned segments  
  → Produces: monthly briefing with cohort analysis, trend context,
              and scenario inputs (levers + ranges)
  → Playbook: full engagement or lifecycle playbook depending on segment

RULE: calendar_event contains "QBR" or "business review" or "strategy"
  → Scheduled task: 24 hours before event
  → Runs: comprehensive multi-segment analysis
  → Produces: executive-altitude briefing regardless of user's default depth
  → Playbook: all relevant playbooks, cross-segment synthesis
```

### Schedule Source 2: Threshold Monitors (event-driven)

Derived from `user-config.yaml` thresholds. These run on a fixed scan cadence
(daily via cloud scheduled task) but only produce output when a threshold is breached.

```
DAILY SCAN (cloud scheduled task, runs overnight):
  For each segment in user.segments_owned:
    For each threshold in segment.thresholds:
      Pull current metric value from data source
      Compare to threshold
      
      IF breached AND severity = "high":
        → Immediately queue a targeted analysis
        → Select playbook matched to the metric type
        → Write result to project working files
        → User sees it as an URGENT item in next briefing
        → Push notification via Dispatch if mobile paired
      
      IF breached AND severity = "medium":
        → Flag in next scheduled briefing
        → No immediate analysis — wait for the regular cadence
      
      IF approaching threshold (within 10%):
        → Add "watch" note to briefing — "approaching threshold, not yet breached"
```

### Schedule Source 3: Behavioral Adaptation (learned)

Derived from `user-behavior.yaml`. Adjusts timing and content, not methodology.

```
ADAPTATION: session_timing
  IF user consistently opens Claude on Tuesday at 9:30am (not Monday):
    → Shift weekly briefing computation to Monday night / Tuesday 6am
    → Monday scheduled task becomes a lightweight pre-scan
    → Tuesday task becomes the full briefing assembly
  
  WHY: briefing is fresh when user actually arrives, not 24h stale

ADAPTATION: content_ranking
  IF user consistently drills into cost_metrics and skips engagement_trends:
    → Lead briefing with cost metrics in headline layer
    → Move engagement trends to context layer (still present, not leading)
  
  WHY: user sees what matters to them first, reduces time to decision

ADAPTATION: depth_calibration
  IF user avg session time < 60 seconds:
    → Compress briefing to headline-only by default
    → Add "expand" affordance rather than full context upfront
  
  IF user avg session time > 300 seconds:
    → Include context layer by default
    → Pre-compute one scenario variant for the leading metric

ADAPTATION: gap_detection
  IF user has made 3+ manual queries on a topic the engine doesn't cover:
    → Write a PROPOSAL to the learning log:
      "User repeatedly asks for cross-segment LTV comparisons.
       No playbook covers this. Recommend adding to core playbook library."
    → Surface in quarterly DS org review
    → Meanwhile, cache the ad-hoc approach that worked for this user
      in their project context so the engine can repeat it next time
```

---

## 4. Proactive Session Assembly — What the User Sees on Open

When the user opens Claude Desktop and enters their Cowork project,
the engine assembles a briefing from pre-computed results.

### Assembly Logic

```
ON SESSION START:
  
  1. CHECK for pre-computed results in project working files
     - Cloud scheduled task outputs (overnight analysis)
     - Threshold breach alerts
     - Pending proposals / learning log entries
  
  2. RANK content using user behavior model
     - Lead with metrics user typically engages with
     - Prioritize by: threshold breach (high) > scheduled insight >
       behavioral suggestion > watch items
  
  3. ASSEMBLE briefing frame

     HEADLINE LAYER (always shown):
       "Your reactivated segment's 30-day retention dropped to 0.39
        (threshold: 0.42). Cost per reactivation rose 12% WoW.
        Two things look actionable."
     
     CONTEXT LAYER (shown based on user depth preference):
       "The retention drop is concentrated in customers reactivated
        via the email-only campaign (0.31) vs. multi-touch (0.48).
        This divergence started 3 weeks ago and is widening.
        See the engagement profiling playbook run for details."
       
       [Link to full analysis artifact with audit trail]
       [Week-over-week trend chart]
       [Playbook methodology note — one line, expandable]
     
     SCENARIO LAYER (shown if user typically engages at depth):
       "If the email-only retention continues declining at current rate,
        reactivation cost efficiency breaches the medium threshold ($35)
        within 2 weeks. Shifting 30% of email budget to multi-touch
        would cost ~$X but historical data suggests retention recovery
        to 0.44 within one cycle."
       
       [Lever: email vs multi-touch budget split]
       [Range: projected retention at 0/15/30/50% reallocation]
  
  4. WAIT for user interaction
     - Log which sections they open/skip
     - Log any follow-up queries
     - Update user-behavior.yaml after session ends
```

### The "No Blank Prompt" Contract

The engine's core promise: **the user never starts from zero.**

```
IF pre-computed results exist:
  → Show briefing frame immediately

IF no threshold breaches AND no scheduled run pending:
  → Show a "steady state" summary:
    "All monitored segments within thresholds.
     Next scheduled deep-dive: Friday (monthly planning).
     Last notable shift: [date] — [one-line summary]."
  → Offer: "Want to explore something specific?"

IF this is the user's first session (post-onboarding):
  → Run an initial baseline analysis on all owned segments
  → Frame it as: "Here's your starting picture. I'll track
    changes from this baseline going forward."
  → Use this run to calibrate initial thresholds if defaults
    seem misaligned with actual data ranges

IF the engine encountered an error or data quality issue:
  → Surface it transparently:
    "I couldn't complete the reactivation analysis overnight —
     the engagement_score field had 40% nulls in yesterday's pull.
     Here's what I could compute from the available data.
     Flagging data quality for review."
```

---

## 5. Self-Learning Capture — The Proposal Format

When the engine deviates from a governed playbook or detects a gap,
it writes a structured proposal to the project's learning log.

### proposal-log.yaml (per project, append-only)

```yaml
proposals:
  - id: "P-2026-04-07-001"
    type: "playbook_variation"
    trigger: "scheduled_weekly_briefing"
    playbook_base: "playbook-engagement.md"
    deviation: |
      Standard playbook uses engagement_score as primary metric.
      This run found that days_since_last_activity was more predictive
      of 30d retention for the reactivated segment specifically.
      Substituted as leading indicator in analysis.
    quality_gate_passed: true
    conclusion_confidence: 0.82
    recurrence_count: 3                     # seen this pattern 3 times now
    user_engaged: true                      # user drilled into this result
    recommendation: "Consider adding segment-conditional metric selection
                     to engagement playbook — reactivated customers may
                     warrant different leading indicators"

  - id: "P-2026-04-03-002"
    type: "scope_gap"
    trigger: "manual_user_query"
    user_query: "compare reactivated vs new customer LTV at 90 days"
    matched_playbook: null
    resolution: "ad_hoc_cross_segment_comparison"
    quality_gate_passed: true
    conclusion_confidence: 0.71
    recurrence_count: 1
    user_engaged: true
    recommendation: "No playbook for cross-segment LTV comparison.
                     User found this valuable. Consider adding to
                     core playbook library."

  - id: "P-2026-03-28-003"
    type: "heuristic_refinement"  
    trigger: "scheduled_monthly_planning"
    playbook_base: "playbook-churn-risk.md"
    deviation: |
      Default churn threshold (0.65 probability) flagged 35% of segment
      as at-risk, which is too broad for campaign-altitude decisions.
      Tightened to 0.78 for this user's context — produced a more
      actionable 12% at-risk group.
    quality_gate_passed: true
    conclusion_confidence: 0.88
    recurrence_count: 5
    user_engaged: true
    recommendation: "Churn threshold may need to be decision-altitude-aware.
                     Campaign-level users need tighter thresholds than
                     strategy-level users for actionable outputs."
```

---

## 6. Quarterly Review Surface for DS Org

The DS org pulls proposal-log.yaml from all active projects
and triages using this rubric:

```
HIGH PRIORITY — promote to core:
  recurrence_count >= 3
  AND quality_gate_passed = true (all occurrences)
  AND user_engaged = true (majority of occurrences)
  AND appears across 2+ projects (cross-team signal)

INVESTIGATE — may indicate methodology gap:
  type = "scope_gap"
  AND recurrence_count >= 2
  AND user_engaged = true
  → The engine is being asked for something it can't do yet

REFINE — adjust governed defaults:
  type = "heuristic_refinement"
  AND same parameter adjusted across 3+ projects
  → The default may be wrong for a common use case

IGNORE — local noise:
  recurrence_count = 1
  OR user_engaged = false
  OR quality_gate_passed = false
  → One-off or low-quality — don't propagate

OUTPUT of quarterly review:
  → Updated playbook skills (new version of .md files)
  → Updated default thresholds in CGF template
  → New playbooks if scope gaps warrant them
  → Plugin version bump → pushed to enterprise marketplace
  → All projects receive updates on next plugin sync
```

---

## 7. Two-Month Build Sequence

### Month 1: Governance + User Model

Week 1-2:
  - CGF scoping skill (cgf-scoping.md)
  - User config schema (user-config.yaml)
  - Onboarding command (/configure)
  - Project template with folder structure

Week 3-4:
  - Core playbooks (start with 2: engagement + churn risk)
  - Evaluation gate skill (evaluation-gate.md)
  - Proposal capture format (proposal-log.yaml schema)
  - /insights command — full manual cycle working end to end

### Month 2: Schedule Intelligence + Proactive Layer

Week 5-6:
  - Scheduled task templates (weekly scan, monthly deep-dive)
  - Threshold monitor logic (daily cloud scan)
  - Briefing assembly skill (briefing-assembly.md)
  - /briefing and /status commands

Week 7-8:
  - Behavioral logging (user-behavior.yaml — write path only)
  - Session start assembly logic (the "no blank prompt" contract)
  - Calendar integration for pre-meeting triggers
  - Plugin packaging + enterprise marketplace submission

### What is explicitly NOT in the two-month build:
  - Behavioral adaptation (engine adjusting based on user-behavior.yaml)
  - Cross-project learning aggregation
  - Scenario layer in briefings
  - Automated promotion pipeline
  
  These all require real usage data to design well.
  Ship the capture. Build the intelligence in Month 3-6.
```
