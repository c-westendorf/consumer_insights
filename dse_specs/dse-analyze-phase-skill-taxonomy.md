# DSE Analyze Phase Plugin — Skill Taxonomy Master Plan

## Context

The DSE (Data Scientist Engine) automates the customer insights cycle from scoped business
question through analysis to stakeholder delivery. The **Define Phase** plugin (scope-agent,
plan-agent, 8 define skills) is already structured. Now we need to build the **Analyze Phase**
plugin: ~24 skills that execute the analytical work planned by the Define Phase.

**Why this plan exists:** We have ~5 existing skills (data-cleaning, data-quality-assurance,
eda-comprehensive, feature-engineering, sampling) built in traditional Claude Code format
without DSE governance. We have ~20 new skills to create. And we have 7 playbooks that need
to become SKILL.md files. This document organizes all of them into a coherent taxonomy,
defines each skill (what it IS and IS NOT), maps their dependencies, and sequences the build.

**Governance standard:** Every skill follows BLUEPRINT.md (8 principles, 17-item checklist),
uses DSE frontmatter (`inputs`, `outputs`, `can_follow`, `can_precede`, `supports_loop`,
`exit_conditions`), and produces terminal artifacts with the universal 5-field envelope
(`schema_version`, `skill_name`, `timestamp`, `record_count`, `artifact_id`).

**Format:** All skills are SKILL.md files — including the 8 advanced analytical skills that
were originally conceived as playbooks. The playbook subgraph templates remain in the
Define Phase plugin for the plan-agent's use; the Analyze Phase skills are the executable
units that do the actual work.

---

## Taxonomy Overview

25 skills organized into 6 functional groups. Skills within a group share data-flow
adjacency — a skill's `can_follow`/`can_precede` declarations create the DAG edges.

```
┌──────────────────────────────────────────────────────────────────────────┐
│                       DSE ANALYZE PHASE PLUGIN (25 skills)              │
│                                                                         │
│  Group 1: Data Ingestion (4)       Group 2: Population & Sampling (2)   │
│  ┌──────────────────────────┐      ┌──────────────────────┐             │
│  │ data-retrieval           │─────▶│ cohort-extraction    │             │
│  │ schema-profiling         │      │ population-sampling  │             │
│  │ data-quality-assessment  │      └──────────┬───────────┘             │
│  │ data-remediation         │                 │                         │
│  └──────────────────────────┘                 │                         │
│                                               ▼                         │
│  Group 3: Transformation & Context (6)                                  │
│  ┌─────────────────────────────────────────────────────┐                │
│  │ feature-engineering    │  exploratory-analysis       │                │
│  │ metric-computation     │  behavioral-impact-estimat  │                │
│  │ maturity-state-classif │  business-context-layer     │                │
│  └────────────────────────┴────────────┬───────────────┘                │
│                                        │                                │
│  Group 4: Statistical Analysis (3)     ▼    Group 5: Advanced (8)       │
│  ┌──────────────────────────┐   ┌─────────────────────────────────┐     │
│  │ statistical-comparison   │   │ cohort-behavior-analysis        │     │
│  │ hypothesis-validation    │   │ stickiness-interval-analysis    │     │
│  │ retention-curve-analysis │   │ engagement-decay-analysis       │     │
│  └──────────────────────────┘   │ reactivation-behavior-analysis  │     │
│                                 │ latent-factor-modeling           │     │
│  Group 6: Synthesis (4)         │ value-decomposition-analysis    │     │
│  ┌──────────────────────────┐   │ leading-indicator-development   │     │
│  │ roi-computation          │   │ causal-linkage-analysis         │     │
│  │ finding-assembly         │   └─────────────────────────────────┘     │
│  │ narrative-generation     │                                           │
│  │ notify-schedule          │                                           │
│  └──────────────────────────┘                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Group 1 — Data Ingestion & Quality (4 skills)

### 1.1 `data-retrieval`
**Status:** NEW — no existing skill
**IS:** Multi-cloud data connector that authenticates, connects, and extracts raw datasets
from Snowflake and BigQuery. Handles connection pooling, schema-aware query generation,
and returns a raw_dataset artifact with provenance metadata (source, query, row count,
extraction timestamp).
**IS NOT:** A query optimizer, a data transformation layer, or a caching system. Does not
clean, filter, or reshape data — just retrieves it faithfully.

| Field | Value |
|---|---|
| inputs | `scope_artifact`, `plan_artifact` (task node specifying what to extract) |
| outputs | `raw_dataset` |
| can_follow | `[plan-formatting]` (Define Phase handoff) |
| can_precede | `[schema-profiling, data-quality-assessment]` |
| supports_loop | `false` |

### 1.2 `schema-profiling`
**Status:** NEW — no existing skill
**IS:** Automated schema inspector that catalogs column types, primary/foreign keys, join
relationships, temporal grains, cardinality distributions, and nullability patterns. Produces
a `profiled_schema` artifact that downstream skills use to make informed decisions about
joins, aggregations, and type handling.
**IS NOT:** A data quality checker (that's `data-quality-assessment`). Does not make judgments
about data fitness — only describes what's there structurally.

| Field | Value |
|---|---|
| inputs | `raw_dataset` |
| outputs | `profiled_schema` |
| can_follow | `[data-retrieval]` |
| can_precede | `[data-quality-assessment, cohort-extraction, feature-engineering]` |
| supports_loop | `false` |

### 1.3 `data-quality-assessment`
**Status:** REFACTOR from existing `data-quality-assurance` (526 lines, no DSE frontmatter)
**IS:** Diagnostic gate that scores data across four dimensions — completeness (null rates,
coverage gaps), consistency (referential integrity, cross-field logic), freshness (staleness,
temporal gaps), and distributional anomalies (outlier rates, unexpected cardinality shifts).
Produces a `quality_report` artifact with per-dimension scores, a composite fitness score,
and a remediation manifest listing every flagged issue with its severity (blocking vs
advisory). **Blocks the pipeline** if any blocking issue exists or composite score falls
below configurable threshold — this is the first hard gate in the DAG.
**IS NOT:** A remediation tool — does not clean, impute, or transform data. The quality
report's remediation manifest tells `data-remediation` WHAT to fix; this skill only
diagnoses. Does not profile schema structure (that's `schema-profiling`). Does not assess
business meaning of fields (that's `business-context-layer`).

| Field | Value |
|---|---|
| inputs | `raw_dataset`, `profiled_schema` |
| outputs | `quality_report` (includes remediation_manifest) |
| can_follow | `[schema-profiling]` |
| can_precede | `[data-remediation, cohort-extraction]` |
| supports_loop | `false` |

**Refactor notes:** Existing `data-quality-assurance` has good content (scale-aware branching,
checkpoint validation). Needs: DSE frontmatter, terminal artifact envelope, typed
inputs/outputs, precondition/postcondition contracts, explicit HALT conditions for blocking
quality failures. Remediation logic currently embedded in this skill should be extracted to
`data-remediation`.

### 1.4 `data-remediation`
**Status:** NEW — content extracted from existing `data-cleaning` (559 lines) and
`missing-data-imputation` (541 lines)
**IS:** Targeted data repair skill that consumes a `quality_report` with its remediation
manifest and applies appropriate fixes: type coercion, deduplication, outlier treatment
(capping, winsorizing, or removal based on domain rules), and missing data imputation.
For imputation, classifies missingness mechanism (MCAR/MAR/MNAR) and selects strategy
accordingly — mean/median for MCAR on continuous variables, multiple imputation or
regression imputation for MAR, domain-informed constants or model-based approaches for
MNAR. Produces a `remediated_dataset` artifact with a change log documenting every
modification and its justification.
**IS NOT:** A diagnostic tool (that's `data-quality-assessment`). Does not decide WHETHER
data has problems — only applies fixes prescribed by the quality report. Does not make
judgment calls about data fitness — if the quality report says proceed, this skill executes
the prescribed remediation. Not a feature engineer — fixes raw data problems, doesn't
create analytical variables.

**Why this is a separate skill:** Imputation strategy selection (MCAR vs MAR vs MNAR) is a
non-trivial statistical decision with measurable impact on downstream analysis validity.
Folding it into a "gate" skill would create a 1000+ line monolith violating BLUEPRINT
Principle 1 (Single Job). The diagnostic decision ("is this data fit?") and the treatment
decision ("how should we fix it?") require different expertise and have different failure
modes.

| Field | Value |
|---|---|
| inputs | `raw_dataset`, `quality_report` |
| outputs | `remediated_dataset` |
| can_follow | `[data-quality-assessment]` |
| can_precede | `[cohort-extraction, feature-engineering, exploratory-analysis]` |
| supports_loop | `true` |
| exit_conditions | `["all blocking issues resolved", "remediation budget exhausted — escalate to analyst"]` |

---

## Group 2 — Population & Sampling (2 skills)

### 2.1 `cohort-extraction`
**Status:** NEW — no existing skill (spec lists as `cohort-extraction`)
**IS:** Population definition engine that applies scope criteria (lifecycle stage, behavioral
filters, temporal boundaries) to a quality-validated dataset and produces a labeled cohort.
For compare patterns, produces both target and reference cohorts. Validates that extracted
populations meet minimum size requirements for statistical validity.
**IS NOT:** A sampling tool (that's `population-sampling`). Does not reduce population size
for efficiency — extracts the full qualifying population. Does not compute metrics or features.

| Field | Value |
|---|---|
| inputs | `raw_dataset`, `quality_report`, `scope_artifact` |
| outputs | `cohort` |
| can_follow | `[data-quality-assessment]` |
| can_precede | `[population-sampling, feature-engineering, metric-computation]` |
| supports_loop | `false` |

### 2.2 `population-sampling`
**Status:** REFACTOR from existing `sampling` (already has DSE frontmatter — closest to compliant)
**IS:** Efficiency layer that creates representative subsets when full-population analysis is
impractical. Supports stratified, temporal, and matched sampling strategies. Creates temp
tables for downstream consumption. Validates that sample preserves distributional properties
of the full cohort.
**IS NOT:** A cohort definer (that's `cohort-extraction`). Does not decide WHO is in the
population — only creates efficient subsets of an already-defined cohort.

| Field | Value |
|---|---|
| inputs | `cohort`, `scope_artifact` |
| outputs | `sample_set` |
| can_follow | `[cohort-extraction]` |
| can_precede | `[feature-engineering, metric-computation, exploratory-analysis]` |
| supports_loop | `false` |

**Refactor notes:** Existing `sampling` already has DSE frontmatter (`inputs`, `outputs`,
`can_follow`, `can_precede`, `supports_loop`). Rename to `population-sampling` for
consistency. Verify terminal artifact envelope, pre-merge checklist compliance.

---

## Group 3 — Transformation & Context (6 skills)

### 3.1 `feature-engineering`
**Status:** REFACTOR from existing `feature-engineering` (581 lines, no DSE frontmatter)
**IS:** Variable construction and preliminary selection engine. Two-phase job: (1) **construct**
behavioral features (purchase frequency, recency, monetary aggregations, engagement scores,
spend velocity, inter-purchase intervals), temporal features (cyclical encoding, time-since
calculations, rolling windows), and transactional features (basket composition, category
breadth, channel mix); (2) **filter** the candidate set using univariate methods (variance
threshold, SULOV for multicollinearity) and lightweight filter-based selection (mutual
information, MRMR) to remove redundant or zero-variance features. Produces a typed
`feature_set` artifact with feature metadata (name, type, derivation logic, null rate,
selection rationale for removed candidates).

**Why selection is included here:** In practice, feature construction without basic filtering
produces feature sets with hundreds of columns, many redundant or zero-variance. Passing
all of them downstream wastes compute and degrades signal-to-noise. Univariate/filter methods
(variance threshold, SULOV, MRMR) are construction-adjacent — they don't require knowledge
of the analytical target. Wrapper/embedded methods (forward selection, L1 regularization,
SHAP importance) that DO depend on the analytical goal remain in downstream analysis skills.

**IS NOT:** A model-aware feature selector — does not use wrapper methods, embedded methods,
or any technique that requires a target variable or model. That happens inside
`leading-indicator-development` or analysis skills that evaluate features against outcomes.
Not an EDA tool — does not explore distributions or generate hypotheses.

| Field | Value |
|---|---|
| inputs | `cohort` or `sample_set`, `profiled_schema` |
| outputs | `feature_set` |
| can_follow | `[cohort-extraction, population-sampling, data-remediation]` |
| can_precede | `[exploratory-analysis, metric-computation, maturity-state-classification]` |
| supports_loop | `false` |

**Refactor notes:** Existing skill already contains SULOV, MRMR, target encoding, cyclical
encoding, and scale-aware branching — all of which map to the construction + filter phases
above. Needs: DSE frontmatter, terminal artifact envelope, typed interfaces, precondition
contracts, and explicit boundary marker separating "filter selection" (stays here) from
"model-aware selection" (downstream).

### 3.2 `metric-computation`
**Status:** NEW — no existing skill
**IS:** Business metric computation engine that calculates the specific metrics defined in
`scope_artifact` across the target population. Supports a full aggregation vocabulary:
simple (count, sum, average, median), distributional (percentiles, IQR, variance),
proportional (rates, ratios, shares), weighted (weighted mean, index values), time-windowed
(rolling averages, cumulative sums, period-over-period deltas), and cohort-indexed
(days-since-event windows, e.g., "revenue within 90 days of reactivation"). Produces a
`metric_result` artifact with point estimates, confidence intervals (bootstrapped where
appropriate), computation metadata, and grain specification (at what level the metric is
computed — customer, transaction, period).
**IS NOT:** A statistical comparison tool (that's `statistical-comparison`). Computes metric
VALUES for one or more populations — does not test whether differences between populations
are statistically significant. Not a feature engineer — computes final business-facing
metrics, not input variables for modeling. Not an aggregation optimizer — delegates query
efficiency to the data retrieval layer.

| Field | Value |
|---|---|
| inputs | `cohort` or `sample_set`, `feature_set`, `scope_artifact` |
| outputs | `metric_result` |
| can_follow | `[feature-engineering, cohort-extraction]` |
| can_precede | `[statistical-comparison, exploratory-analysis, roi-computation]` |
| supports_loop | `false` |

### 3.3 `exploratory-analysis`
**Status:** REFACTOR from existing `eda-comprehensive` (520 lines, no DSE frontmatter)
**IS:** Distribution, correlation, and anomaly scanner that examines feature_set and
metric_result to surface patterns, outliers, and hypotheses. Produces visualizations and
a structured `hypothesis_set` artifact — ranked candidate hypotheses for downstream
validation. This is where "what's interesting?" gets answered.
**IS NOT:** A hypothesis tester (that's `hypothesis-validation`). Does not confirm or reject
hypotheses — generates them. Not a data quality tool — assumes data has already passed
quality gates.

| Field | Value |
|---|---|
| inputs | `feature_set`, `metric_result`, `quality_report` |
| outputs | `hypothesis_set` |
| can_follow | `[feature-engineering, metric-computation]` |
| can_precede | `[hypothesis-validation, statistical-comparison]` |
| supports_loop | `true` |
| exit_conditions | `["≥3 hypotheses ranked by observed effect size (≥ small per Cohen's conventions)", "exploration budget exhausted"]` |

**Refactor notes:** Existing `eda-comprehensive` is the largest refactor — 520 lines of
detailed workflow. Rename to `exploratory-analysis`. Add DSE frontmatter, loop support
(EDA is inherently iterative), and structured hypothesis output. Hypothesis ranking must
use observable signal strength (effect size, variance explained, or information gain) —
not subjective "interestingness" — to prevent the skill from exiting on trivially obvious
patterns.

### 3.4 `behavioral-impact-estimation`
**Status:** NEW — no existing skill
**IS:** Observed-difference estimator that quantifies the revenue and engagement gap between
customers who exhibit a specific behavior and those who don't: second purchase within 30
days, cross-category expansion, digital adoption, subscription upgrade. For each behavior,
computes the **observed** revenue/engagement difference (not causal lift) using matched
comparison where possible (propensity-score stratification for bias reduction) and flags
the estimate's confidence level. Produces a `behavioral_impact` artifact with point
estimates, confidence intervals, bias-reduction method used, and an explicit "causal
confidence" label: `observational` (no matching), `adjusted` (matched/stratified), or
`quasi-experimental` (requires `causal-linkage-analysis` to upgrade).
**IS NOT:** A causal inference tool — does not claim incremental or causal impact. Uses
"observed difference" and "adjusted difference," never "incremental lift," because true
incrementality requires experimental or quasi-experimental design (that's
`causal-linkage-analysis`). Not a general metric computation tool (that's
`metric-computation`). Specifically focused on behavior → outcome linkages with explicit
bias-reduction, not arbitrary metric calculation.

| Field | Value |
|---|---|
| inputs | `cohort`, `feature_set`, `metric_result` |
| outputs | `behavioral_impact` |
| can_follow | `[metric-computation, feature-engineering]` |
| can_precede | `[roi-computation, causal-linkage-analysis, finding-assembly]` |
| supports_loop | `false` |

### 3.5 `maturity-state-classification`
**Status:** NEW — no existing skill
**IS:** CGF lifecycle stage classifier that assigns customers to lifecycle states (acquisition,
new_customer, low_engaged, medium_engaged, high_engaged, reactivated, at_risk, lapsed)
using recency, frequency, monetary value, and transition velocity. Computes two layers:
(1) **state assignment** — current lifecycle stage based on lagging behavioral indicators
(observed RFM thresholds); (2) **trajectory annotation** — directional velocity (improving,
stable, declining) computed from state transition history over a lookback window. Trajectory
is descriptive (observed direction of change), not predictive (does not forecast probability
of future state transition). Produces a `maturity_classification` artifact with state labels,
trajectory annotations, and the feature values that drove each assignment.
**IS NOT:** A generic clustering tool — uses the CGF-defined lifecycle taxonomy with explicit
thresholds, not unsupervised segment discovery. Not a churn prediction model — trajectory
annotations describe observed direction of travel, not predicted future states. Not a
recommendation engine — classifies, doesn't prescribe interventions.

| Field | Value |
|---|---|
| inputs | `cohort`, `feature_set` |
| outputs | `maturity_classification` |
| can_follow | `[feature-engineering]` |
| can_precede | `[retention-stickiness-analysis, exploratory-analysis, finding-assembly]` |
| supports_loop | `false` |

### 3.6 `business-context-layer`
**Status:** NEW — no existing skill
**IS:** Ontology and semantic layer that maps data fields to business concepts, maintains
versioned definitions (what "active customer" means this quarter vs last), tracks data
lineage, and provides the shared vocabulary that other skills reference. Produces a
`context_map` artifact consumed by interpretation-heavy downstream skills.
**IS NOT:** A data catalog or schema profiler (that's `schema-profiling`). Operates at the
semantic level — what fields MEAN in business terms, not what TYPE they are technically.
Not a knowledge graph — a lightweight mapping layer.

| Field | Value |
|---|---|
| inputs | `profiled_schema`, `scope_artifact` |
| outputs | `context_map` |
| can_follow | `[schema-profiling]` |
| can_precede | `[exploratory-analysis, narrative-generation, finding-assembly]` |
| supports_loop | `false` |

---

## Group 4 — Statistical Analysis (3 skills)

### 4.1 `statistical-comparison`
**Status:** NEW — no existing skill
**IS:** Population comparison engine that selects appropriate statistical tests based on data
characteristics. **Pairwise tests** (two-group): t-test / Welch's t (normal, equal/unequal
variance), Mann-Whitney U (non-normal continuous), chi-squared / Fisher's exact (categorical),
KS-test (distributional shape). **Multi-group tests** (3+ populations, e.g., comparing across
all 8 CGF lifecycle stages): ANOVA / Welch's ANOVA (normal), Kruskal-Wallis (non-normal),
with post-hoc pairwise tests (Tukey HSD, Dunn's test) when omnibus test is significant.
**Multiple comparison corrections** applied whenever >1 comparison is tested simultaneously:
Benjamini-Hochberg FDR (default for exploratory), Bonferroni (when family-wise error rate
control is required, e.g., regulatory or executive claims). Reports effect sizes (Cohen's d,
Cramér's V, eta-squared for multi-group), confidence intervals, raw and adjusted p-values.
Produces a `comparison_result` artifact.
**IS NOT:** A hypothesis validator (that's `hypothesis-validation`). Compares populations on
specified metrics — does not assess whether a hypothesis EXPLAINS the difference, only whether
the difference exists and its magnitude. Not an exploratory tool — requires specific
comparison dimensions from scope/plan. Not a causal inference tool — significant differences
are not causal claims.

| Field | Value |
|---|---|
| inputs | `cohort` (target + reference), `metric_result`, `feature_set` |
| outputs | `comparison_result` |
| can_follow | `[metric-computation, exploratory-analysis]` |
| can_precede | `[hypothesis-validation, roi-computation, finding-assembly]` |
| supports_loop | `false` |

### 4.2 `hypothesis-validation`
**Status:** NEW — no existing skill
**IS:** Systematic **associative** hypothesis tester that takes candidate hypotheses from
`exploratory-analysis` or analyst input and evaluates whether the proposed association holds
in the data. For each hypothesis: (1) operationalizes it into testable statistical claims,
(2) identifies known confounders and applies stratification or regression adjustment to
assess robustness, (3) runs appropriate statistical tests, (4) assesses alternative
explanations (could the same data support a competing hypothesis?), and (5) produces
explicit conclusions: `supported` (association holds after adjustment), `not supported`
(no significant association), or `inconclusive` (signal present but confounding not
adequately controlled) with evidence strength ratings. Produces a `hypothesis_result`
artifact.

**The boundary with `causal-linkage-analysis`:** This skill tests the question "does X
co-occur with Y, even after adjusting for known confounders?" — an associative claim.
`causal-linkage-analysis` tests the interventional question "does CHANGING X cause Y to
change?" using quasi-experimental methods (DiD, PSM, IV, RDD) that require specific
data structures (panel data, natural experiments, instrumental variables). If
hypothesis-validation finds a robust association but the scope requires a causal claim,
it flags this as "requires causal-linkage-analysis upgrade" in its output.

**IS NOT:** A hypothesis generator (that's `exploratory-analysis`). Does not discover
patterns — validates specific proposed explanations. Not a causal inference tool — tests
and adjusts ASSOCIATIVE claims, not interventional claims. The confounder adjustment here
is for robustness-checking the association, not for estimating causal effects.

| Field | Value |
|---|---|
| inputs | `hypothesis_set`, `feature_set`, `metric_result` |
| outputs | `hypothesis_result` |
| can_follow | `[exploratory-analysis, statistical-comparison]` |
| can_precede | `[finding-assembly, causal-linkage-analysis]` |
| supports_loop | `true` |
| exit_conditions | `["all hypotheses tested", "validation budget exhausted"]` |

### 4.3 `retention-curve-analysis`
**Status:** NEW — no existing skill
**IS:** Cohort retention curve builder that computes standard retention metrics: period-over-
period repeat rates (what % of Month 1 customers return in Month 2, 3, ...N), spend
trajectory curves (average spend by tenure month), and survival-style engagement curves
(Kaplan-Meier or discrete hazard). Operates at the **cohort-aggregate level** — produces
curves and rates for defined populations, not individual-level scores. Identifies where
retention curves inflect (the "critical drop-off period") and flags cohorts with
statistically worse retention than baseline. Produces a `retention_curve` artifact.

**The boundary with `stickiness-interval-analysis` (Group 5):** This skill computes
**aggregate cohort curves** — "what does retention look like for this population?" It's a
Group 4 foundation skill that produces standard retention reporting. `stickiness-interval-
analysis` operates at the **individual customer level**, analyzing the temporal micro-
patterns BETWEEN events (inter-purchase intervals, visit cadence, engagement rhythm) and
computing individual stickiness scores. Think of it as: this skill produces the retention
CHART; stickiness-interval produces the individual-level SCORES that explain why the chart
looks the way it does.

**IS NOT:** An individual-level scoring tool (that's `stickiness-interval-analysis`). Not a
churn prediction model — describes observed curves, doesn't predict individual churn risk.
Not a general time-series decomposition tool.

| Field | Value |
|---|---|
| inputs | `cohort`, `metric_result`, `maturity_classification` |
| outputs | `retention_curve` |
| can_follow | `[metric-computation, maturity-state-classification]` |
| can_precede | `[stickiness-interval-analysis, roi-computation, finding-assembly]` |
| supports_loop | `false` |

---

## Group 5 — Advanced Analytical Skills (8 skills)

These are the complex, multi-step analytical workflows that were originally conceived as
playbooks. Each is now a SKILL.md that orchestrates a specific analytical frame end-to-end,
consuming outputs from Group 1–4 foundation skills and producing rich analytical artifacts.

### 5.1 `cohort-behavior-analysis`
**Status:** NEW
**IS:** End-to-end behavioral profiling of a defined cohort: data retrieval → EDA →
behavioral segmentation → pattern identification → statistical validation → conclusion.
Answers "what does this population do?" by discovering and validating behavioral patterns
within a cohort. Produces a `behavioral_profile` artifact with validated segments and
their distinguishing behaviors.
**IS NOT:** A comparison tool (doesn't compare cohorts — profiles one). Not a clustering
algorithm — uses CGF-informed behavioral dimensions, not unsupervised feature discovery.
Not a prediction model — describes observed behavior, doesn't predict future behavior.

| Field | Value |
|---|---|
| inputs | `cohort`, `feature_set`, `quality_report` |
| outputs | `behavioral_profile` |
| can_follow | `[feature-engineering, data-quality-assessment]` |
| can_precede | `[finding-assembly, statistical-comparison]` |
| supports_loop | `true` |
| exit_conditions | `["≥2 validated behavioral segments identified", "exploration budget exhausted"]` |

### 5.2 `stickiness-interval-analysis`
**Status:** NEW
**IS:** Time-between-event pattern analyzer: data retrieval → EDA → time-series feature
engineering → interval pattern analysis → stickiness scoring → statistical validation →
conclusion. Measures HOW customers engage over time — purchase intervals, engagement
cadence, visit frequency trajectories. Produces `interval_result` with stickiness scores
and trajectory classifications.
**IS NOT:** A cohort-level retention curve builder (that's `retention-curve-analysis`, which
produces aggregate repeat rates and survival curves). This skill operates at the
**individual customer level**, computing per-customer stickiness scores based on temporal
micro-patterns between events. Consumes retention curves as context but produces individual
scores, not aggregate charts. Not a churn predictor — scores current behavioral rhythm,
doesn't forecast future attrition.

| Field | Value |
|---|---|
| inputs | `cohort`, `feature_set`, `metric_result` |
| outputs | `interval_result`, `signal_result` |
| can_follow | `[feature-engineering, metric-computation]` |
| can_precede | `[finding-assembly, roi-computation]` |
| supports_loop | `true` |
| exit_conditions | `["interval patterns validated", "stickiness scores computed for all cohort segments"]` |

### 5.3 `engagement-decay-analysis`
**Status:** NEW
**IS:** Disengagement trajectory mapper: data retrieval → EDA → engagement trajectory mapping
→ decay point identification → leading indicator extraction → conclusion. Uses a **13-week
non-engagement threshold** scored at the **week level**. Identifies WHERE in the engagement
lifecycle customers begin to disengage, and extracts early-warning behavioral signals.
Produces a `decay_profile` artifact.
**IS NOT:** A churn prediction model (predicts WHEN, this explains WHERE the decay happens
and what precedes it). Not a retention tool — focused specifically on the decay trajectory,
not on measuring who stayed. Not a general time-series decomposition.

| Field | Value |
|---|---|
| inputs | `cohort`, `feature_set`, `maturity_classification` |
| outputs | `decay_profile`, `signal_result` |
| can_follow | `[maturity-state-classification, feature-engineering]` |
| can_precede | `[leading-indicator-development, finding-assembly]` |
| supports_loop | `true` |
| exit_conditions | `["decay inflection points identified", "leading indicators extracted"]` |

### 5.4 `reactivation-behavior-analysis`
**Status:** NEW
**IS:** Post-reactivation behavior profiler: data retrieval → EDA → reactivation trigger
identification → post-reactivation behavior profiling → value recovery assessment →
conclusion. Uses a **52-week churn threshold** to define reactivation. Identifies what
triggered the return, how post-reactivation behavior differs from pre-lapse behavior,
and whether value recovery is sustainable. Produces a `reactivation_profile` artifact.
**IS NOT:** A reactivation campaign tool (doesn't design interventions). Not a general
cohort profiler — specifically scoped to the reactivation lifecycle transition. Does not
predict who WILL reactivate — analyzes those who already did.

| Field | Value |
|---|---|
| inputs | `cohort`, `feature_set`, `metric_result` |
| outputs | `reactivation_profile` |
| can_follow | `[feature-engineering, metric-computation]` |
| can_precede | `[finding-assembly, roi-computation]` |
| supports_loop | `true` |
| exit_conditions | `["reactivation triggers identified", "value recovery trajectory assessed"]` |

### 5.5 `latent-factor-modeling`
**Status:** NEW
**IS:** Behavioral dimension discovery engine using psychometric methods: data retrieval →
EDA → feature engineering → factor/component extraction → rotation and interpretation →
comparable clustering → dimension label assignment → validation → conclusion. Selects
between **factor analysis** (when the goal is discovering latent constructs — "what
underlying behavioral dimensions explain the observed feature correlations?") and **PCA**
(when the goal is variance-maximizing dimensionality reduction for downstream modeling)
based on the analytical goal stated in scope. When FA is selected, validates factor
structure via: scree plot / parallel analysis for factor count, KMO and Bartlett's test
for factorability, rotation selection (varimax for orthogonal, promax for correlated
factors), and cross-validation of loadings on held-out data. Produces a `factor_model`
artifact with factor loadings, cluster assignments, interpretive labels, and model fit
statistics (CFI, RMSEA, SRMR for confirmatory validation).
**IS NOT:** A generic clustering tool (K-means, DBSCAN) — uses factor-analytic/psychometric
frame specifically, with clustering as a secondary step after dimension extraction. Not a
causal attribution model — "attribution" here means "assigning behavioral dimension labels,"
not marketing or causal attribution. Not a supervised classification model — discovers
latent structure, doesn't predict pre-defined labels.

| Field | Value |
|---|---|
| inputs | `cohort`, `feature_set` |
| outputs | `factor_model` |
| can_follow | `[feature-engineering]` |
| can_precede | `[finding-assembly, value-decomposition-analysis]` |
| supports_loop | `true` |
| exit_conditions | `["factor structure validated (fit indices acceptable)", "dimension labels assigned and reviewed"]` |

### 5.6 `value-decomposition-analysis`
**Status:** NEW
**IS:** Growth/shrinkage qualifier that decomposes changes in customer value into component
parts: data retrieval → EDA → decomposition by segment → depth dimension → value change
calculation → growth/shrinking attribution → conclusion. Answers "is growth coming from more
customers, more transactions per customer, or higher value per transaction?" Produces a
`value_decomposition` artifact.
**IS NOT:** A revenue forecasting tool. Not an ROI calculator (that's `roi-computation`).
Decomposes observed changes — doesn't project future changes. Not a general variance
analysis — specifically structured around the accounts × volume × value decomposition frame.

| Field | Value |
|---|---|
| inputs | `cohort`, `metric_result`, `comparison_result` |
| outputs | `value_decomposition` |
| can_follow | `[metric-computation, statistical-comparison]` |
| can_precede | `[finding-assembly, roi-computation]` |
| supports_loop | `false` |

### 5.7 `leading-indicator-development`
**Status:** NEW
**IS:** Predictive signal discoverer: data retrieval → EDA → feature engineering → predictive
feature selection → validation against outcomes → indicator scoring → conclusion. Identifies
behavioral signals that precede important outcomes (churn, upgrade, reactivation). Validates
predictive power against known outcomes. Produces a `signal_result` artifact with scored
leading indicators.
**IS NOT:** A full prediction model (discovers indicators, doesn't build a deployed model).
Not a causal analysis tool — identifies predictive ASSOCIATION, doesn't establish causation.
Not a feature engineering tool — consumes features and evaluates their predictive power.

| Field | Value |
|---|---|
| inputs | `feature_set`, `metric_result`, `cohort` |
| outputs | `signal_result` |
| can_follow | `[feature-engineering, metric-computation, engagement-decay-analysis]` |
| can_precede | `[finding-assembly, hypothesis-validation]` |
| supports_loop | `true` |
| exit_conditions | `["≥3 validated leading indicators", "exploration budget exhausted"]` |

### 5.8 `causal-linkage-analysis`
**Status:** NEW
**IS:** Causal inference engine: data retrieval → EDA → confounder identification → causal
method selection (diff-in-diff, propensity score matching, instrumental variables,
regression discontinuity) → analysis execution → robustness checks → conclusion.
Establishes or tests behavior→outcome causal relationships. Produces a `causal_result`
artifact with method justification, effect estimates, and robustness assessment.
**IS NOT:** A correlation tool (that's `statistical-comparison`). Not a hypothesis generator
— tests specific causal claims. Requires strong prior hypotheses and comparison structure
from scope. The highest-complexity skill in the taxonomy — should be flagged for human
review in plan generation.

| Field | Value |
|---|---|
| inputs | `cohort`, `feature_set`, `hypothesis_result`, `comparison_result` |
| outputs | `causal_result` |
| can_follow | `[hypothesis-validation, statistical-comparison]` |
| can_precede | `[finding-assembly, roi-computation]` |
| supports_loop | `true` |
| exit_conditions | `["causal estimate stable across robustness checks", "analysis budget exhausted"]` |

---

## Group 6 — Synthesis & Delivery (4 skills)

### 6.1 `roi-computation`
**Status:** NEW — no existing skill
**IS:** Impact monetizer that takes comparison results, behavioral impact assessments, causal
estimates, and interval results and translates them into dollar values. Computes monetary
impact using the upstream skill's `causal_confidence` label to qualify the estimate:
`observational` estimates get a "directional" qualifier, `adjusted` estimates get a
"estimated" qualifier, `quasi-experimental` or `causal` estimates get an "attributed"
qualifier. Produces an `roi_result` artifact with revenue impact, cost per outcome, ROI
ratios, and the confidence qualifier so stakeholders know how much weight to put on the
numbers.
**IS NOT:** A financial forecasting tool. Not a full business case builder — computes the
numbers, doesn't write the narrative. Does not independently validate statistical
significance — trusts upstream validation and inherits confidence labels. Does not inflate
observational associations into causal claims.

| Field | Value |
|---|---|
| inputs | `comparison_result` or `behavioral_impact` or `interval_result`, `metric_result` |
| outputs | `roi_result` |
| can_follow | `[statistical-comparison, behavioral-impact-estimation, retention-curve-analysis, causal-linkage-analysis]` |
| can_precede | `[finding-assembly]` |
| supports_loop | `false` |

### 6.2 `finding-assembly`
**Status:** NEW — no existing skill
**IS:** Evidence collector that gathers outputs from all upstream analytical skills, ranks
findings by evidence strength, checks for contradictions between findings, assesses coverage
(did we answer what the scope asked?), and produces a prioritized `finding_set` artifact.
The quality gate before narrative generation.
**IS NOT:** A narrative writer (that's `narrative-generation`). Does not interpret findings
for a business audience — assembles and quality-checks the raw analytical outputs. Not a
visualization tool.

| Field | Value |
|---|---|
| inputs | `hypothesis_result`, `comparison_result`, `roi_result`, `signal_result`, `behavioral_impact` (any combination) |
| outputs | `finding_set` |
| can_follow | `[any Group 4 or Group 5 skill]` |
| can_precede | `[narrative-generation]` |
| supports_loop | `false` |

### 6.3 `narrative-generation`
**Status:** NEW — no existing skill
**IS:** Stakeholder communication generator that takes a prioritized finding_set and produces
an executive summary, supporting evidence narrative, visualization specifications, and
actionable recommendations. Adapts tone and depth to the stated business_context from scope.
Produces a `narrative` artifact (markdown + visualization specs).
**IS NOT:** A data visualization renderer (produces specifications, not images). Not a
finding discoverer — takes pre-assembled, pre-ranked findings and translates them for a
business audience. Not an automated decision-maker — makes recommendations, doesn't
execute decisions.

| Field | Value |
|---|---|
| inputs | `finding_set`, `scope_artifact`, `context_map` |
| outputs | `narrative` |
| can_follow | `[finding-assembly]` |
| can_precede | `[notify-schedule]` |
| supports_loop | `true` |
| exit_conditions | `["narrative covers all scope requirements", "stakeholder review complete"]` |

### 6.4 `notify-schedule`
**Status:** NEW — no existing skill
**IS:** MCP-integrated delivery skill that sends completed narratives and findings via email,
Teams, or Slack, and sets up recurring delivery schedules (daily, weekly, monthly cadence).
Handles template-based formatting per channel. Produces a `delivery_record` artifact.
**IS NOT:** A narrative writer (that's `narrative-generation`). Does not transform content —
delivers it through configured channels. Not a monitoring or alerting system — delivers
scheduled outputs, doesn't watch for real-time events.

| Field | Value |
|---|---|
| inputs | `narrative`, `scope_artifact` |
| outputs | `delivery_record` |
| can_follow | `[narrative-generation]` |
| can_precede | `[]` (terminal skill) |
| supports_loop | `false` |

---

## Existing Skills — Refactor Status

| Existing Skill | Target Name | Lines | DSE Frontmatter | Refactor Work |
|---|---|---|---|---|
| `sampling` | `population-sampling` | ~300 | ✅ Yes | Rename, verify envelope/checklist |
| `data-quality-assurance` | `data-quality-assessment` | 526 | ❌ No | Add frontmatter, typed I/O, HALT gates, strip remediation logic |
| `data-cleaning` | **EXTRACT into `data-remediation`** | 559 | ❌ No | Cleaning procedures become remediation skill steps |
| `missing-data-imputation` | **EXTRACT into `data-remediation`** | 541 | ❌ No | Imputation strategies + MCAR/MAR/MNAR classification become remediation skill |
| `eda-comprehensive` | `exploratory-analysis` | 520 | ❌ No | Add frontmatter, loop support, hypothesis output with effect-size ranking |
| `feature-engineering` | `feature-engineering` | 581 | ❌ No | Add frontmatter, typed I/O, artifact envelope, clarify filter vs model-aware selection boundary |

**Rationale for separation (assessment vs remediation):** The original plan merged
cleaning/imputation into quality-assessment, but lead DS review identified this as
methodologically unsound. Imputation strategy selection (MCAR/MAR/MNAR classification)
is a non-trivial statistical decision — choosing mean imputation when data is MNAR biases
all downstream analysis. This decision deserves its own skill with its own preconditions,
variance surface, and testable exit conditions. Quality assessment's job is to diagnose
and gate; remediation's job is to treat. Different failure modes, different expertise,
different tests. Total skill count increases from 24 to 25.

---

## Dependency Graph

```
                          plan_artifact
                               │
                               ▼
                        data-retrieval
                               │
                               ▼
                        schema-profiling ──────────────▶ business-context-layer
                               │                                │
                               ▼                                │
                     data-quality-assessment                    │
                               │                                │
                          ┌────┴────┐                           │
                          ▼         ▼                           │
                   data-remediation  │ (if no issues,           │
                          │         │  skip to cohort)          │
                          ▼         ▼                           │
                     cohort-extraction                          │
                          │    │                                │
                          │    ▼                                │
                          │  population-sampling                │
                          │    │                                │
                          ▼    ▼                                │
                     feature-engineering ◀──────────────────────┘
                          │         │
               ┌──────────┤         ├──────────────────┐
               ▼          ▼         ▼                  ▼
        metric-computation  maturity-state-class  exploratory-analysis
               │                │                      │
          ┌────┤    ┌───────────┤            ┌─────────┤
          │    │    ▼           ▼            ▼         ▼
          │    │  retention-  engagement-  hypothesis-  behavioral-
          │    │  curve       decay        validation   impact-est
          │    │    │           │                │
          │    │    ▼           ▼                ▼
          │    │  stickiness- leading-      causal-linkage
          │    │  interval    indicator-dev      │
          │    │                                 │
          ▼    ▼                ▼                ▼
       statistical-    value-decomposition      │
       comparison           │                   │
          │                 │                   │
          ▼                 ▼                   │
       roi-computation ◀────┴───────────────────┘
               │
               ▼
        finding-assembly
               │
               ▼
       narrative-generation
               │
               ▼
        notify-schedule
```

**Fan-out points:** After `feature-engineering` (4 parallel branches: metric-computation,
maturity-state-classification, exploratory-analysis, plus any Group 5 skills).
After `cohort-extraction` (sampling and feature-engineering can run in parallel).
After `data-quality-assessment` (remediation branch only if issues found; clean data
skips directly to cohort-extraction).

**Join points:** `finding-assembly` (waits for all analytical branches).
`roi-computation` (waits for comparison/behavioral/interval/causal results).

**Conditional edge:** `data-quality-assessment` → `data-remediation` fires only when
quality_report contains blocking or remediable issues. If data passes quality gate
cleanly, the DAG skips directly to `cohort-extraction`.

---

## Phased Build Sequence

### Phase 0 — Shared Infrastructure (Week 1)
**Goal:** Establish the foundation all skills depend on.

| # | Task | Notes |
|---|---|---|
| 0.1 | Populate `_shared-references/` stubs with real content | `skill-registry.md`, `data-type-registry.md`, `composition-rules.md` are currently stubs pointing to spec |
| 0.2 | Create `data-type-registry.md` with all Analyze Phase types | `raw_dataset`, `profiled_schema`, `quality_report`, `cohort`, `sample_set`, `feature_set`, `metric_result`, `hypothesis_set`, `comparison_result`, `interval_result`, `signal_result`, `behavioral_impact`, `maturity_classification`, `roi_result`, `finding_set`, `narrative`, `delivery_record`, `context_map`, `decay_profile`, `reactivation_profile`, `attribution_model`, `value_decomposition`, `causal_result`, `behavioral_profile`, `hypothesis_result` |
| 0.3 | Update `skill-registry.md` with all 24 Analyze Phase skills | Name, category, inputs, outputs for each |
| 0.4 | Update `composition-rules.md` with Analyze Phase DAG rules | Fan-out, join, loop semantics |

### Phase 1 — Data Pipeline Foundation (Weeks 2–3)
**Goal:** Build the skills that every analytical workflow depends on.

| # | Skill | Status | Depends On |
|---|---|---|---|
| 1.1 | `data-retrieval` | NEW | Phase 0 complete |
| 1.2 | `schema-profiling` | NEW | 1.1 |
| 1.3 | `data-quality-assessment` | REFACTOR (from data-quality-assurance, strip remediation logic) | 1.2 |
| 1.4 | `data-remediation` | NEW (content from data-cleaning + missing-data-imputation) | 1.3 |
| 1.5 | `cohort-extraction` | NEW | 1.3 or 1.4 (conditional) |
| 1.6 | `population-sampling` | REFACTOR (rename + verify) | 1.5 |

**Test checkpoint:** Run `dse-skill-tester` on each skill. All 6 must pass pre-merge checklist
before proceeding to Phase 2. Pipeline integration test: feed synthetic scope_artifact through
1.1 → 1.2 → 1.3 → 1.4 → 1.5 → 1.6, including the conditional skip path (1.3 → 1.5 when
data passes quality gate). Verify artifact handoff at each step, including the remediation
manifest → remediated_dataset chain.

### Phase 2 — Transformation & Context Layer (Weeks 4–5)
**Goal:** Build the skills that prepare data for analysis.

| # | Skill | Status | Depends On |
|---|---|---|---|
| 2.1 | `feature-engineering` | REFACTOR | Phase 1 complete |
| 2.2 | `metric-computation` | NEW | 2.1 |
| 2.3 | `exploratory-analysis` | REFACTOR (rename + add loop support) | 2.1, 2.2 |
| 2.4 | `business-context-layer` | NEW | 1.2 (schema-profiling) |
| 2.5 | `maturity-state-classification` | NEW | 2.1 |
| 2.6 | `behavioral-validation` | NEW | 2.1, 2.2 |

**Test checkpoint:** Pipeline test: scope_artifact → Phase 1 pipeline → feature-engineering →
metric-computation → exploratory-analysis. Verify hypothesis_set artifact is well-formed.

### Phase 3 — Statistical Analysis (Weeks 6–7)
**Goal:** Build the skills that validate and compare.

| # | Skill | Status | Depends On |
|---|---|---|---|
| 3.1 | `statistical-comparison` | NEW | Phase 2 complete |
| 3.2 | `hypothesis-validation` | NEW | 2.3 (exploratory-analysis) |
| 3.3 | `retention-curve-analysis` | NEW | 2.2 (metric-computation), 2.5 (maturity-state-classification) |

**Test checkpoint:** Full compare-pattern pipeline: scope (compare pattern) → Phase 1 →
Phase 2 → statistical-comparison → hypothesis-validation. Verify comparison_result and
hypothesis_result artifacts. For retention-curve-analysis: verify that Kaplan-Meier curves
and repeat rate calculations produce valid retention_curve artifacts.

### Phase 4 — Advanced Analytical Skills (Weeks 8–11)
**Goal:** Build the complex multi-step analytical workflows. These are the highest-value,
highest-complexity skills. Build in dependency order within the phase.

| # | Skill | Status | Depends On | Complexity |
|---|---|---|---|---|
| 4.1 | `cohort-behavior-analysis` | NEW | Phase 2 | High |
| 4.2 | `stickiness-interval-analysis` | NEW | Phase 2 | High |
| 4.3 | `engagement-decay-analysis` | NEW | 2.5 (maturity) | High |
| 4.4 | `reactivation-behavior-analysis` | NEW | Phase 2 | High |
| 4.5 | `value-decomposition-analysis` | NEW | 3.1 (comparison) | Medium |
| 4.6 | `leading-indicator-development` | NEW | 4.3 or Phase 2 | High |
| 4.7 | `latent-factor-modeling` | NEW | Phase 2 | Very High |
| 4.8 | `causal-linkage-analysis` | NEW | 3.2 (hypothesis) | Very High |

**Build order within Phase 4:** Start with 4.1 and 4.5 (lower dependency count), then
4.2–4.4 (parallel), then 4.6–4.8 (highest complexity, most dependencies).

**Test checkpoint:** Each skill tested individually with `dse-skill-tester`. At least one
end-to-end pipeline test per analytical pattern (profile, compare, explain, predict, segment).

### Phase 5 — Synthesis & Delivery (Weeks 12–13)
**Goal:** Build the output skills that package analytical results for stakeholders.

| # | Skill | Status | Depends On |
|---|---|---|---|
| 5.1 | `roi-computation` | NEW | Phase 3, Phase 4 |
| 5.2 | `finding-assembly` | NEW | Any Group 4/5 skill |
| 5.3 | `narrative-generation` | NEW | 5.2 |
| 5.4 | `notify-schedule` | NEW | 5.3 |

**Test checkpoint:** Full pipeline: scope → plan → Phase 1–4 → finding-assembly →
narrative-generation → notify-schedule. This is the first true end-to-end test.

### Phase 6 — Integration & Hardening (Weeks 14–15)
**Goal:** Full plugin integration, cross-skill DAG testing, playbook template validation.

| # | Task |
|---|---|
| 6.1 | Run all 7 playbook templates as complete DAGs through the skill pipeline |
| 6.2 | Run `dse-skill-tester` on all 24 skills — full assessment reports |
| 6.3 | Run 17-item pre-merge checklist on all 24 skills |
| 6.4 | Update shared references (skill-registry, data-type-registry) to reflect final state |
| 6.5 | Plugin packaging: verify `plugin.json` manifest, auto-discovery, command routing |
| 6.6 | Cross-team pilot with 2–3 real analytical questions end-to-end |

---

## Files to Create/Modify

**New skill SKILL.md files (20):**
- `skills/data-retrieval/SKILL.md`
- `skills/schema-profiling/SKILL.md`
- `skills/data-remediation/SKILL.md`
- `skills/cohort-extraction/SKILL.md`
- `skills/metric-computation/SKILL.md`
- `skills/behavioral-impact-estimation/SKILL.md`
- `skills/maturity-state-classification/SKILL.md`
- `skills/business-context-layer/SKILL.md`
- `skills/statistical-comparison/SKILL.md`
- `skills/hypothesis-validation/SKILL.md`
- `skills/retention-curve-analysis/SKILL.md`
- `skills/cohort-behavior-analysis/SKILL.md`
- `skills/stickiness-interval-analysis/SKILL.md`
- `skills/engagement-decay-analysis/SKILL.md`
- `skills/reactivation-behavior-analysis/SKILL.md`
- `skills/latent-factor-modeling/SKILL.md`
- `skills/value-decomposition-analysis/SKILL.md`
- `skills/leading-indicator-development/SKILL.md`
- `skills/causal-linkage-analysis/SKILL.md`
- `skills/roi-computation/SKILL.md`
- `skills/finding-assembly/SKILL.md`
- `skills/narrative-generation/SKILL.md`
- `skills/notify-schedule/SKILL.md`

**Refactored skill SKILL.md files (4):**
- `skills/data-quality-assessment/SKILL.md` (from data-quality-assurance; strip remediation logic)
- `skills/exploratory-analysis/SKILL.md` (from eda-comprehensive; add loop support + hypothesis output)
- `skills/feature-engineering/SKILL.md` (existing; add DSE frontmatter, clarify filter/model-aware boundary)
- `skills/population-sampling/SKILL.md` (from sampling; rename + verify)

**Shared references to populate:**
- `skills/_shared-references/skill-registry.md`
- `skills/_shared-references/data-type-registry.md`
- `skills/_shared-references/composition-rules.md`

**Existing skills to archive after extraction:**
- `skills/data-cleaning/` → cleaning procedures extracted into `data-remediation`
- `skills/missing-data-imputation/` → imputation strategies extracted into `data-remediation`
- `skills/data-quality-assurance/` → replaced by `data-quality-assessment`
- `skills/eda-comprehensive/` → replaced by `exploratory-analysis`
- `skills/sampling/` → replaced by `population-sampling`

---

## Verification

1. **Per-skill:** Run `dse-skill-tester` on each skill → assessment report with verdict
2. **Per-phase:** Pipeline integration test with synthetic artifacts flowing through the phase
3. **Cross-phase:** End-to-end pipeline test for each analytical pattern (profile, compare, explain, predict, segment)
4. **Plugin-level:** `plugin.json` manifest validation, auto-discovery test, command routing
5. **Governance:** 17-item pre-merge checklist on all 25 skills
6. **Final:** Cross-team pilot with real analytical questions through the full Define → Analyze pipeline

---

## Lead DS Review — Changes Log

The following changes were made after critical review for data science methodological rigor:

### 1. Separated `data-remediation` from `data-quality-assessment` (+1 skill, 24→25)
**Problem:** Original plan merged data-cleaning and missing-data-imputation into
quality-assessment. But MCAR/MAR/MNAR determination for imputation strategy is a non-trivial
statistical decision (choosing mean imputation when data is MNAR biases all downstream
analysis). Diagnosis and treatment are methodologically distinct — different expertise,
different failure modes, different tests.
**Fix:** `data-quality-assessment` is the diagnostic gate (scores data, flags issues, produces
remediation manifest). `data-remediation` is the treatment skill (applies prescribed fixes,
selects imputation strategy based on missingness mechanism, logs all changes).

### 2. Renamed `behavioral-validation` → `behavioral-impact-estimation`
**Problem:** "Incremental revenue" implies causal attribution, but the IS NOT section
disclaimed causation. "Validation" in DS means checking correctness, not estimating impact.
The term "incremental" means "would not have happened without" — a causal claim you can't
make from observational data alone.
**Fix:** Renamed skill, replaced "incremental" with "observed difference" and "adjusted
difference," added explicit `causal_confidence` labels (`observational`, `adjusted`,
`quasi-experimental`) so downstream consumers know the evidence strength.

### 3. Renamed `retention-stickiness-analysis` → `retention-curve-analysis` and clarified boundary with `stickiness-interval-analysis`
**Problem:** Both skills analyzed "retention and stickiness" — an analyst couldn't determine
which to invoke. Both produced `interval_result`.
**Fix:** Drew a hard methodological boundary. `retention-curve-analysis` operates at the
**cohort-aggregate level** (repeat rate curves, Kaplan-Meier survival curves — the
"retention chart"). `stickiness-interval-analysis` operates at the **individual customer
level** (inter-event intervals, per-customer stickiness scores — explaining WHY the chart
looks that way). Different output types: `retention_curve` vs `interval_result`.

### 4. Resolved `feature-engineering` selection boundary contradiction
**Problem:** IS NOT said "not a feature selector" but existing skill contains SULOV and MRMR
which ARE selection methods.
**Fix:** Explicitly included univariate/filter-based selection (variance threshold, SULOV,
MRMR) as part of feature-engineering's job — these are construction-adjacent and don't
require knowledge of analytical target. Drew the boundary at model-aware methods (wrapper,
embedded, SHAP) which DO require a target variable and belong in downstream analysis skills.

### 5. Fixed `maturity-state-classification` leading indicator contradiction
**Problem:** Claimed to compute "leading indicators (predicted trajectory)" but IS NOT said
"doesn't forecast future state." Transition velocity IS a leading indicator — this was
internally contradictory.
**Fix:** Replaced "leading indicators" with "trajectory annotation" — directional velocity
(improving, stable, declining) computed from observed state transition history. Explicitly
noted this is descriptive (observed direction of change), not predictive (forecasted
probability of future transition).

### 6. Added multi-group and multiple comparison rigor to `statistical-comparison`
**Problem:** Only listed pairwise tests. Real CVS analyses compare across 8 CGF lifecycle
stages simultaneously — pairwise-only testing is inadequate and risks inflated Type I error.
**Fix:** Added ANOVA/Welch's ANOVA, Kruskal-Wallis for multi-group omnibus tests, Tukey HSD
and Dunn's for post-hoc comparisons, and mandatory multiple comparison corrections
(Benjamini-Hochberg FDR default, Bonferroni for family-wise error control).

### 7. Clarified `hypothesis-validation` vs `causal-linkage-analysis` boundary
**Problem:** "Controls for known confounders" IS a step in causal inference — the boundary
was blurry.
**Fix:** hypothesis-validation tests **associative** claims ("does X co-occur with Y after
adjusting for Z?"). causal-linkage tests **interventional** claims ("does CHANGING X cause
Y to change?") requiring quasi-experimental methods with specific data structures. If
hypothesis-validation finds a robust association but scope needs causation, it flags
"requires causal-linkage upgrade."

### 8. Renamed `scale-attribution-modeling` → `latent-factor-modeling`
**Problem:** "Attribution" in DS/marketing means campaign or channel attribution. "Scale" is
ambiguous. The name misrepresented the skill's actual work (factor analysis / latent
construct discovery).
**Fix:** Renamed to `latent-factor-modeling`. Also fixed the blanket "factor analysis
preferred over PCA" — both have their place. FA when discovering latent constructs
(interpretation goal); PCA when maximizing variance explained (dimensionality reduction
goal). Skill now selects method based on analytical goal stated in scope. Added model fit
validation criteria (CFI, RMSEA, SRMR).

### 9. Tightened `exploratory-analysis` exit conditions
**Problem:** "≥3 ranked hypotheses" didn't specify ranking criteria. Could exit on 3
trivially obvious patterns.
**Fix:** Exit condition now requires hypotheses ranked by **observed effect size** (≥ small
per Cohen's conventions). Prevents the skill from satisfying the exit condition with
tautological findings like "customers who buy more spend more."

### 10. Expanded `metric-computation` aggregation vocabulary
**Problem:** Listed only "proportion, average, count, sum, rate" — too narrow for real DS
work.
**Fix:** Added: distributional (percentiles, IQR, variance), weighted (weighted mean, index
values), time-windowed (rolling averages, cumulative sums, period-over-period deltas), and
cohort-indexed (days-since-event windows). Also added grain specification (customer,
transaction, period level) to the output artifact.
