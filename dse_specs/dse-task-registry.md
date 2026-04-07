# DSE Task Registry — Descriptive Customer Intelligence

## Purpose

This registry defines the typed domain model that grounds the Plan Agent's plan generation. It replaces unconstrained LLM generation with structural composition: the Plan Agent selects and parameterizes task types from this registry, connects them according to declared composition rules, and instantiates playbook templates into subgraphs that form the executable DAG.

The registry covers **descriptive analytics for customer intelligence** — what happened, why it happened, and what it was worth. This corresponds to three analytical frames:

| Frame | Question | Playbook Family |
|-------|----------|-----------------|
| **What happened** | Characterize behavior, measure outcomes, detect patterns | EDA, Interval Analysis, Signal Processing |
| **Why it happened** | Identify drivers, validate hypotheses, isolate effects | Hypothesis Validation, Sampling, EDA |
| **What it was worth** | Quantify impact, attribute value, measure ROI | Outcome ROI, Stickiness ROI |

---

## Architecture: Tools → Playbooks → DAG

Three layers compose the planning structure. Each layer has a distinct role and none can substitute for another.

```
┌─────────────────────────────────────────────────────────────────┐
│  DAG (Plan Artifact)                                            │
│  The instantiated plan. One or more playbook subgraphs wired    │
│  together with scope-specific parameterization. This is the     │
│  execution contract consumed by Phase 2.                        │
├─────────────────────────────────────────────────────────────────┤
│  Playbooks                                                      │
│  Reusable subgraph templates. Each defines an arrangement of    │
│  task nodes for a type of analytical work — sequence,           │
│  branching, convergence, exit conditions. Parameterized by      │
│  scope at instantiation time.                                   │
├─────────────────────────────────────────────────────────────────┤
│  Task Nodes                                                     │
│  Atomic units of work in the DAG. Each references a tool type   │
│  from the taxonomy. Typed inputs and outputs. Stateless.        │
├─────────────────────────────────────────────────────────────────┤
│  Tools                                                          │
│  Single capabilities. "Compute retention curve." "Run           │
│  chi-square test." "Build feature set." Atomic, typed,          │
│  registered in the tool taxonomy.                               │
└─────────────────────────────────────────────────────────────────┘
```

**Playbooks are subgraph templates, not steps in the DAG and not markdown documents.** A playbook declares: here are the task nodes you need, here's how they connect, here's where fan-out happens, here's the exit condition for exploratory loops. The Plan Agent instantiates the template, parameterizes it with scope specifics, and wires it into the larger DAG.

---

## Layer 1: Data Types

Data types define what flows between task nodes. They form the edges of the DAG. Each type has a schema that downstream tasks can validate against.

```
DataType Registry {

  raw_dataset: {
    description:  "Unprocessed table or query result from source systems"
    schema: {
      source:        string          // table name, query, or connection ref
      row_count:     int | null      // if known
      columns:       ColumnDef[]     // name, inferred type
      freshness:     datetime        // when last updated
    }
    produced_by:   ["data_extraction"]
    consumed_by:   ["schema_profiling", "quality_assessment"]
  }

  profiled_dataset: {
    description:  "Dataset with schema, quality metrics, and distributions characterized"
    schema: {
      source_ref:    string          // back-ref to raw_dataset
      column_profiles: ColumnProfile[] {
        name:          string
        dtype:         string
        null_rate:     float
        cardinality:   int
        distribution:  DistributionSummary
        anomalies:     AnomalyFlag[]
      }
      quality_score:   float         // composite quality metric
      join_keys:       JoinKey[]     // identified keys for linking
      temporal_grain:  string | null // detected time granularity
    }
    produced_by:   ["schema_profiling", "quality_assessment"]
    consumed_by:   ["cohort_extraction", "join_resolution", "temporal_alignment"]
  }

  cohort: {
    description:  "Filtered population matching scope criteria with behavioral features"
    schema: {
      population_def:  PopulationDef  // from scope artifact
      entity_count:    int
      entity_id_col:   string
      feature_columns: string[]
      timeframe:       TimeframeDef
      filters_applied: FilterCriteria[]
    }
    produced_by:   ["cohort_extraction"]
    consumed_by:   ["feature_engineering", "metric_computation",
                    "distribution_analysis", "segmentation_probe",
                    "sampling"]
  }

  feature_set: {
    description:  "Engineered variables derived from cohort, ready for analysis or modeling"
    schema: {
      cohort_ref:      string        // back-ref to source cohort
      features:        FeatureDef[] {
        name:          string
        dtype:         string
        derivation:    string        // how it was computed
        category:      enum ["behavioral", "temporal", "demographic",
                             "transactional", "engagement", "derived"]
      }
      temporal_features: TemporalFeature[] {
        name:          string
        window:        string        // e.g., "90d", "12m"
        aggregation:   string        // recency, frequency, monetary, velocity
      }
    }
    produced_by:   ["feature_engineering", "temporal_feature_generation"]
    consumed_by:   ["metric_computation", "correlation_analysis",
                    "hypothesis_test", "segmentation_probe",
                    "model_fitting", "interval_analysis"]
  }

  metric_result: {
    description:  "Computed metric — scalar, time series, or distribution"
    schema: {
      metric_def:      MetricDef     // from scope artifact
      result_type:     enum ["scalar", "series", "distribution"]
      value:           any           // number, array, or distribution object
      confidence:      ConfidenceInterval | null
      granularity:     string | null // if series: daily, weekly, monthly
      segments:        SegmentBreakdown[] | null  // if segmented
    }
    produced_by:   ["metric_computation", "aggregation"]
    consumed_by:   ["statistical_comparison", "trend_detection",
                    "interval_analysis", "finding_assembly",
                    "roi_computation"]
  }

  comparison_result: {
    description:  "Two or more metric results with statistical test outcomes"
    schema: {
      populations:     string[]      // labels for compared groups
      metric_values:   MetricResult[]
      test_type:       string        // t-test, chi-square, mann-whitney, etc.
      test_statistic:  float
      p_value:         float
      effect_size:     EffectSize {
        measure:       string        // Cohen's d, odds ratio, lift, etc.
        value:         float
        interpretation: string       // small, medium, large
      }
      confidence_interval: ConfidenceInterval
      significant:     boolean
      direction:       string        // "A > B", "A < B", "no difference"
    }
    produced_by:   ["statistical_comparison"]
    consumed_by:   ["hypothesis_assessment", "finding_assembly",
                    "roi_computation"]
  }

  hypothesis_result: {
    description:  "Tested hypothesis with evidence chain, confidence, and direction"
    schema: {
      hypothesis_id:   string
      statement:       string        // natural language hypothesis
      status:          enum ["supported", "refuted", "inconclusive"]
      evidence:        Evidence[] {
        source_task:   string        // task_id that produced this evidence
        finding:       string        // what was found
        strength:      enum ["strong", "moderate", "weak"]
      }
      confidence:      float
      caveats:         string[]
    }
    produced_by:   ["hypothesis_assessment"]
    consumed_by:   ["finding_assembly", "hypothesis_refinement"]
  }

  interval_result: {
    description:  "Time-partitioned analysis showing behavioral changes across intervals"
    schema: {
      intervals:       IntervalDef[] {
        label:         string        // "0-30 days", "31-60 days", etc.
        start:         date
        end:           date
      }
      metrics_by_interval: map<string, MetricResult[]>
      transitions:     TransitionMatrix | null  // state changes between intervals
      velocity:        VelocityMeasure[] | null // rate of change across intervals
      inflection_points: InflectionPoint[]      // where behavior shifts
    }
    produced_by:   ["interval_analysis"]
    consumed_by:   ["trend_detection", "signal_detection",
                    "finding_assembly", "roi_computation"]
  }

  signal_result: {
    description:  "Detected patterns, regime changes, or behavioral signals in time series"
    schema: {
      signal_type:     enum ["trend", "seasonality", "regime_change",
                             "anomaly", "acceleration", "deceleration"]
      detected_at:     date | date_range
      magnitude:       float
      confidence:      float
      context:         string        // what this signal means for the business question
      supporting_data: MetricResult | IntervalResult
    }
    produced_by:   ["signal_detection", "trend_detection", "anomaly_detection"]
    consumed_by:   ["hypothesis_generation", "finding_assembly"]
  }

  roi_result: {
    description:  "Quantified business value — attributed impact, cost, return"
    schema: {
      roi_type:        enum ["outcome_roi", "stickiness_roi",
                             "intervention_roi", "segment_roi"]
      population:      string
      timeframe:       TimeframeDef
      investment:      MonetaryValue | null    // cost side
      return_value:    MonetaryValue           // value side
      roi_ratio:       float | null
      incremental_value: MonetaryValue | null  // vs. baseline
      attribution:     AttributionMethod       // how value was assigned
      confidence:      ConfidenceInterval
    }
    produced_by:   ["roi_computation"]
    consumed_by:   ["finding_assembly", "narrative_generation"]
  }

  sample_set: {
    description:  "Statistically valid sample drawn from a cohort for analysis"
    schema: {
      source_cohort:   string        // back-ref to cohort
      sampling_method: enum ["simple_random", "stratified", "systematic",
                             "cluster", "matched"]
      sample_size:     int
      strata:          StrataDef[] | null
      power_analysis:  PowerAnalysis | null {
        target_effect:  float
        alpha:          float
        power:          float
        required_n:     int
      }
      representativeness: RepCheck   // how well sample represents population
    }
    produced_by:   ["sampling"]
    consumed_by:   ["metric_computation", "statistical_comparison",
                    "hypothesis_test", "feature_engineering"]
  }

  finding_set: {
    description:  "Collection of validated findings ready for synthesis"
    schema: {
      findings:        Finding[] {
        finding_id:    string
        statement:     string        // plain language finding
        evidence_type: enum ["statistical", "observational",
                             "modeled", "comparative"]
        strength:      enum ["definitive", "strong", "moderate",
                             "suggestive", "inconclusive"]
        source_tasks:  string[]      // task_ids that produced evidence
        business_relevance: string   // why this matters for the scope's question
      }
      coverage:        float         // what % of scope questions are addressed
      gaps:            string[]      // what remains unanswered
    }
    produced_by:   ["finding_assembly"]
    consumed_by:   ["narrative_generation", "recommendation_generation"]
  }

  narrative: {
    description:  "Synthesized story connecting findings to the business question"
    schema: {
      summary:         string        // executive summary
      story_arc:       StorySection[] {
        section:       string        // heading
        content:       string        // narrative text
        findings_ref:  string[]      // finding_ids supporting this section
        visuals_ref:   string[]      // chart/table references
      }
      recommendations: Recommendation[]
      caveats:         string[]
      scope_ref:       string        // back-ref to scope artifact
    }
    produced_by:   ["narrative_generation"]
    consumed_by:   ["delivery_formatting"]
  }
}
```

---

## Layer 2: Task Types

Each task type is a registered class with declared inputs, outputs, composition rules, and CGF alignment. The Plan Agent selects from this registry — it cannot invent task types that aren't registered.

### Ingestion Tasks

```
data_extraction {
  id:              "data_extraction"
  category:        "ingestion"
  description:     "Access and load raw data from source systems"
  requires:        []                    // entry point — no data prerequisites
  produces:        ["raw_dataset"]
  tool_types:      ["query_executor", "api_connector", "file_reader"]
  supports_loop:   false
  exit_conditions: ["data_loaded"]
  cgf_stages:      ["all"]              // universal prerequisite
  estimated_cost:  "low"
}

schema_profiling {
  id:              "schema_profiling"
  category:        "ingestion"
  description:     "Detect types, keys, relationships, grain, and temporal structure"
  requires:        ["raw_dataset"]
  produces:        ["profiled_dataset"]
  tool_types:      ["schema_inference", "type_detector", "grain_detector"]
  supports_loop:   false
  exit_conditions: ["profile_complete"]
  cgf_stages:      ["all"]
  estimated_cost:  "low"
}

quality_assessment {
  id:              "quality_assessment"
  category:        "ingestion"
  description:     "Assess nulls, cardinality, distributions, anomalies, duplicates"
  requires:        ["raw_dataset"]
  produces:        ["profiled_dataset"]   // enriches the profile
  tool_types:      ["quality_profiler", "anomaly_flagger", "duplicate_detector"]
  supports_loop:   false
  exit_conditions: ["quality_scored"]
  cgf_stages:      ["all"]
  estimated_cost:  "low"
}

join_resolution {
  id:              "join_resolution"
  category:        "ingestion"
  description:     "Identify linkable keys across datasets and validate join integrity"
  requires:        ["profiled_dataset"]   // needs at least 2
  produces:        ["profiled_dataset"]   // enriched with join metadata
  tool_types:      ["join_discovery", "key_validator", "cardinality_checker"]
  supports_loop:   false
  exit_conditions: ["joins_validated"]
  cgf_stages:      ["all"]
  estimated_cost:  "low"
}

temporal_alignment {
  id:              "temporal_alignment"
  category:        "ingestion"
  description:     "Align datasets on time dimensions, resolve grain mismatches"
  requires:        ["profiled_dataset"]
  produces:        ["profiled_dataset"]   // temporally aligned
  tool_types:      ["temporal_aligner", "grain_resolver", "calendar_mapper"]
  supports_loop:   false
  exit_conditions: ["alignment_complete"]
  cgf_stages:      ["all"]
  estimated_cost:  "low"
}
```

### Population Tasks

```
cohort_extraction {
  id:              "cohort_extraction"
  category:        "population"
  description:     "Pull population matching scope criteria with entity-level features"
  requires:        ["profiled_dataset"]
  produces:        ["cohort"]
  tool_types:      ["cohort_builder", "filter_engine", "entity_resolver"]
  supports_loop:   false
  exit_conditions: ["cohort_built"]
  cgf_stages:      ["all"]
  estimated_cost:  "medium"
  fan_out_trigger: "scope.comparison != null"   // if comparing, extract multiple cohorts
}

sampling {
  id:              "sampling"
  category:        "population"
  description:     "Draw statistically valid sample from cohort"
  requires:        ["cohort"]
  produces:        ["sample_set"]
  tool_types:      ["sampler", "power_calculator", "stratifier"]
  supports_loop:   false
  exit_conditions: ["sample_validated"]
  cgf_stages:      ["all"]
  estimated_cost:  "low"
  notes:           "Required when cohort is too large for full analysis or
                    when matched sampling is needed for comparison validity"
}
```

### Transformation Tasks

```
feature_engineering {
  id:              "feature_engineering"
  category:        "transformation"
  description:     "Derive behavioral, temporal, and transactional features from cohort"
  requires:        ["cohort"]
  produces:        ["feature_set"]
  tool_types:      ["feature_builder", "temporal_feature_gen",
                    "behavioral_encoder", "aggregator"]
  supports_loop:   true                  // may iterate as hypotheses suggest new features
  exit_conditions: ["feature_set_stable", "budget_exhausted"]
  cgf_stages:      ["all"]
  estimated_cost:  "medium"
}

metric_computation {
  id:              "metric_computation"
  category:        "transformation"
  description:     "Compute scope-defined metrics at required granularity"
  requires:        ["cohort", "feature_set"]
  produces:        ["metric_result"]
  tool_types:      ["metric_calculator", "aggregator", "window_function"]
  supports_loop:   false
  exit_conditions: ["metrics_computed"]
  cgf_stages:      ["all"]
  estimated_cost:  "medium"
  fan_out_trigger: "scope.metrics.length > 1"  // parallel computation for multiple metrics
}
```

### Exploration Tasks

```
distribution_analysis {
  id:              "distribution_analysis"
  category:        "exploration"
  description:     "Characterize variable distributions, identify shape, spread, outliers"
  requires:        ["cohort", "feature_set"]
  produces:        ["metric_result"]     // distribution-type metric results
  tool_types:      ["distribution_analyzer", "outlier_detector", "shape_classifier"]
  supports_loop:   true                  // may explore multiple variables
  exit_conditions: ["distributions_characterized", "budget_exhausted"]
  cgf_stages:      ["all"]
  estimated_cost:  "low"
}

correlation_analysis {
  id:              "correlation_analysis"
  category:        "exploration"
  description:     "Identify pairwise and multivariate relationships between features"
  requires:        ["feature_set"]
  produces:        ["metric_result"]     // correlation matrices, top pairs
  tool_types:      ["correlation_mapper", "mutual_info_calculator",
                    "multivariate_scanner"]
  supports_loop:   false
  exit_conditions: ["correlations_mapped"]
  cgf_stages:      ["all"]
  estimated_cost:  "medium"
}

trend_detection {
  id:              "trend_detection"
  category:        "exploration"
  description:     "Identify directional changes, momentum, and trajectory in time series"
  requires:        ["metric_result"]     // time series type
  produces:        ["signal_result"]
  tool_types:      ["trend_analyzer", "momentum_detector",
                    "change_point_detector"]
  supports_loop:   false
  exit_conditions: ["trends_detected"]
  cgf_stages:      ["at_risk", "reactivated", "new_customer"]
  estimated_cost:  "medium"
}

anomaly_detection {
  id:              "anomaly_detection"
  category:        "exploration"
  description:     "Detect outliers, regime changes, and breaks in expected patterns"
  requires:        ["metric_result"]
  produces:        ["signal_result"]
  tool_types:      ["anomaly_detector", "regime_detector", "break_detector"]
  supports_loop:   false
  exit_conditions: ["anomalies_flagged"]
  cgf_stages:      ["all"]
  estimated_cost:  "medium"
}

segmentation_probe {
  id:              "segmentation_probe"
  category:        "exploration"
  description:     "Discover natural sub-populations through clustering or decision boundaries"
  requires:        ["cohort", "feature_set"]
  produces:        ["cohort"]            // produces sub-cohorts
  tool_types:      ["clusterer", "decision_tree_splitter",
                    "segment_profiler"]
  supports_loop:   true                  // iterate on segment definitions
  exit_conditions: ["segments_stable", "budget_exhausted"]
  cgf_stages:      ["medium_engaged", "low_engaged", "new_customer"]
  estimated_cost:  "high"
  fan_out_trigger: "always"              // discovered segments fan out for profiling
}

hypothesis_generation {
  id:              "hypothesis_generation"
  category:        "exploration"
  description:     "Propose testable hypotheses from observed patterns and domain knowledge"
  requires:        ["metric_result", "signal_result"]  // at least one
  produces:        ["hypothesis_result"]  // status = "proposed"
  tool_types:      ["hypothesis_generator", "pattern_interpreter"]
  supports_loop:   true                  // generate multiple hypotheses
  exit_conditions: ["hypotheses_generated", "budget_exhausted"]
  cgf_stages:      ["all"]
  estimated_cost:  "medium"
}
```

### Analysis Tasks

```
interval_analysis {
  id:              "interval_analysis"
  category:        "analysis"
  description:     "Partition behavior across time intervals to reveal lifecycle dynamics"
  requires:        ["cohort", "feature_set", "metric_result"]
  produces:        ["interval_result"]
  tool_types:      ["interval_partitioner", "transition_matrix_builder",
                    "velocity_calculator", "inflection_detector"]
  supports_loop:   true                  // may test different interval definitions
  exit_conditions: ["intervals_characterized", "budget_exhausted"]
  cgf_stages:      ["new_customer", "reactivated", "at_risk"]
  estimated_cost:  "high"
  notes:           "Core to understanding lifecycle trajectories. Answers 'when does
                    behavior change?' by slicing the customer timeline into meaningful
                    windows and measuring transitions between states."
}

signal_detection {
  id:              "signal_detection"
  category:        "analysis"
  description:     "Process behavioral time series to extract actionable signals from noise"
  requires:        ["metric_result", "interval_result"]
  produces:        ["signal_result"]
  tool_types:      ["signal_processor", "noise_filter", "frequency_analyzer",
                    "leading_indicator_detector"]
  supports_loop:   true                  // iterate on signal definitions
  exit_conditions: ["signals_validated", "budget_exhausted"]
  cgf_stages:      ["at_risk", "reactivated", "medium_engaged"]
  estimated_cost:  "high"
  notes:           "Separates meaningful behavioral patterns from noise. Identifies
                    leading indicators (signals that precede an outcome) vs. lagging
                    indicators (signals that reflect an outcome already underway)."
}

statistical_comparison {
  id:              "statistical_comparison"
  category:        "analysis"
  description:     "Compare metric results across populations or time periods with rigor"
  requires:        ["metric_result"]     // at least 2 metric results
  produces:        ["comparison_result"]
  tool_types:      ["comparison_test", "effect_size_estimator",
                    "multiple_testing_corrector", "confidence_interval_builder"]
  supports_loop:   false
  exit_conditions: ["comparison_complete"]
  cgf_stages:      ["all"]
  estimated_cost:  "medium"
  join_trigger:    "fan_out_group"       // joins parallel metric computations
}

hypothesis_test {
  id:              "hypothesis_test"
  category:        "analysis"
  description:     "Evaluate a proposed hypothesis against data with statistical evidence"
  requires:        ["hypothesis_result", "feature_set", "metric_result"]
  produces:        ["hypothesis_result"]  // status updated to supported/refuted/inconclusive
  tool_types:      ["hypothesis_evaluator", "evidence_assembler",
                    "confound_checker"]
  supports_loop:   true                  // test multiple hypotheses in sequence
  exit_conditions: ["hypothesis_stable", "confidence_threshold",
                    "budget_exhausted"]
  cgf_stages:      ["all"]
  estimated_cost:  "high"
}

hypothesis_assessment {
  id:              "hypothesis_assessment"
  category:        "analysis"
  description:     "Synthesize evidence across multiple tested hypotheses into conclusions"
  requires:        ["hypothesis_result", "comparison_result"]
  produces:        ["hypothesis_result"]  // final consolidated assessment
  tool_types:      ["evidence_synthesizer", "conclusion_validator",
                    "alternative_explanation_checker"]
  supports_loop:   false
  exit_conditions: ["assessment_complete"]
  cgf_stages:      ["all"]
  estimated_cost:  "medium"
  join_trigger:    "hypothesis_fan_out"  // joins parallel hypothesis tests
}
```

### Valuation Tasks

```
roi_computation {
  id:              "roi_computation"
  category:        "valuation"
  description:     "Quantify business value — cost, return, incremental impact"
  requires:        ["metric_result", "comparison_result"]  // at least one
  produces:        ["roi_result"]
  tool_types:      ["value_calculator", "attribution_engine",
                    "incremental_estimator", "cost_modeler"]
  supports_loop:   false
  exit_conditions: ["roi_computed"]
  cgf_stages:      ["reactivated", "new_customer", "at_risk",
                    "medium_engaged"]
  estimated_cost:  "medium"
  notes:           "Translates analytical findings into business value.
                    Requires clear attribution methodology — the tool must
                    declare how value is assigned (direct, modeled, proxy)."
}
```

### Synthesis Tasks

```
finding_assembly {
  id:              "finding_assembly"
  category:        "synthesis"
  description:     "Collect and validate findings from analysis tasks into a coherent set"
  requires:        ["hypothesis_result | comparison_result | interval_result |
                     signal_result | roi_result"]  // at least one
  produces:        ["finding_set"]
  tool_types:      ["finding_collector", "evidence_ranker",
                    "coverage_checker", "contradiction_detector"]
  supports_loop:   false
  exit_conditions: ["coverage_complete"]
  cgf_stages:      ["all"]
  estimated_cost:  "medium"
  join_trigger:    "all_analysis_branches"  // joins all analysis fan-outs
}

narrative_generation {
  id:              "narrative_generation"
  category:        "synthesis"
  description:     "Connect findings into a stakeholder-ready story"
  requires:        ["finding_set"]
  produces:        ["narrative"]
  tool_types:      ["narrative_builder", "visualization_builder",
                    "recommendation_engine"]
  supports_loop:   false
  exit_conditions: ["narrative_complete"]
  cgf_stages:      ["all"]
  estimated_cost:  "medium"
}
```

---

## Layer 3: Composition Rules

These rules constrain how task nodes connect in the DAG. The Plan Agent validates every proposed connection against these rules before producing the Plan Artifact.

### Data Flow Rules

```
CompositionRules.data_flow {

  rule: "A task node can only start if ALL its required data types are
         available from upstream task outputs."

  validation:
    for each task_node in dag:
      for each required_type in task_node.requires:
        assert exists upstream_node where:
          required_type in upstream_node.produces
          AND path_exists(upstream_node → task_node)

  rule: "A task node's output type must match at least one downstream
         node's required input type, unless it is a terminal node."

  validation:
    for each non_terminal task_node in dag:
      assert exists downstream_node where:
        any(task_node.produces) in downstream_node.requires
}
```

### Ordering Rules

```
CompositionRules.ordering {

  hard_precedence: [
    data_extraction          → schema_profiling
    schema_profiling         → quality_assessment
    quality_assessment       → cohort_extraction
    cohort_extraction        → feature_engineering
    cohort_extraction        → metric_computation
    feature_engineering      → metric_computation
    metric_computation       → statistical_comparison
    metric_computation       → interval_analysis
    hypothesis_generation    → hypothesis_test
    hypothesis_test          → hypothesis_assessment
    finding_assembly         → narrative_generation
  ]

  soft_precedence: [
    // Recommended but not required
    distribution_analysis    → hypothesis_generation
    correlation_analysis     → hypothesis_generation
    interval_analysis        → signal_detection
    signal_detection         → hypothesis_generation
  ]

  prohibited_sequences: [
    // These connections are never valid
    narrative_generation     → any_analysis_task
    finding_assembly         → any_exploration_task
    roi_computation          → cohort_extraction
    statistical_comparison   → feature_engineering
  ]
}
```

### Fan-Out Rules

```
CompositionRules.fan_out {

  rule: "When the scope defines multiple populations (comparison), cohort
         extraction MUST fan out into parallel branches."

  trigger:    scope.comparison != null
  source:     cohort_extraction
  branches:   one per population defined in scope
  behavior:   each branch produces an independent cohort
  join_at:    statistical_comparison

  rule: "When the scope defines multiple metrics, metric computation
         MUST fan out into parallel branches."

  trigger:    scope.metrics.length > 1
  source:     metric_computation
  branches:   one per metric defined in scope
  behavior:   each branch produces an independent metric_result
  join_at:    finding_assembly (or statistical_comparison if comparing)

  rule: "When segmentation_probe discovers sub-populations, downstream
         analysis MUST fan out per segment."

  trigger:    segmentation_probe.output.segments > 1
  source:     segmentation_probe
  branches:   one per discovered segment
  behavior:   each branch runs the analysis subgraph independently
  join_at:    finding_assembly

  rule: "When hypothesis_generation produces multiple hypotheses,
         hypothesis testing SHOULD fan out in parallel."

  trigger:    hypothesis_generation.output.count > 1
  source:     hypothesis_generation
  branches:   one per hypothesis (up to budget limit)
  behavior:   each branch tests independently
  join_at:    hypothesis_assessment
}
```

### Loop Rules

```
CompositionRules.loops {

  rule: "While-loop tasks must declare an exit condition and a budget."

  validation:
    for each task_node where task_type.supports_loop == true:
      assert task_node.exit_condition != null
      assert task_node.exploration_budget != null
      assert task_node.exploration_budget <= budget_allocator.max_iterations

  rule: "While-loop task outputs must feed into a non-loop downstream task."

  validation:
    for each loop_task in dag:
      assert exists downstream where:
        downstream.task_type.supports_loop == false

  rule: "A while-loop cannot trigger a fan-out. Fan-out decisions are
         made from converged loop outputs only."

  validation:
    for each loop_task in dag:
      assert loop_task.fan_out_group == null
}
```

### Completeness Rules

```
CompositionRules.completeness {

  rule: "Every plan must have at least one path from an ingestion task
         to a synthesis task."

  validation:
    assert path_exists(
      any node where node.category == "ingestion",
      any node where node.category == "synthesis"
    )

  rule: "Every plan must terminate in either finding_assembly or
         narrative_generation."

  validation:
    assert exists terminal_node where:
      terminal_node.task_type in ["finding_assembly", "narrative_generation"]
      AND terminal_node.downstream == []

  rule: "No orphan nodes. Every node must be reachable from the DAG root
         and must reach the DAG terminal."

  validation:
    for each node in dag:
      assert reachable_from_root(node)
      assert reaches_terminal(node)
}
```

---

## Layer 4: Playbook Templates

Each playbook is a subgraph template that the Plan Agent instantiates against a specific scope. Playbooks declare their trigger conditions (when to use them), their task node sequence, their fan-out/join points, and their parameterization interface.

### Playbook: Exploratory Data Analysis (EDA)

```
PlaybookTemplate {
  id:              "eda"
  name:            "Exploratory Data Analysis"
  description:     "Characterize a population's behavioral patterns through iterative
                    exploration. Produces a set of findings and hypotheses about what's
                    happening in the data."
  analytical_frame: "what_happened"

  trigger_conditions: {
    analytical_pattern:  ["profile", "segment"]
    always_included:     true     // EDA is a prerequisite for most other playbooks
  }

  parameters: {
    population:      from scope.definition.population
    metrics:         from scope.definition.metric
    timeframe:       from scope.definition.timeframe
    exploration_budget: from budget_allocator
  }

  subgraph: {
    nodes: [
      { id: "eda_1", task_type: "data_extraction" }
      { id: "eda_2", task_type: "schema_profiling", depends_on: ["eda_1"] }
      { id: "eda_3", task_type: "quality_assessment", depends_on: ["eda_1"] }
      { id: "eda_4", task_type: "cohort_extraction", depends_on: ["eda_2", "eda_3"] }
      { id: "eda_5", task_type: "feature_engineering", depends_on: ["eda_4"],
        loop: true, exit: "feature_set_stable" }
      { id: "eda_6", task_type: "distribution_analysis", depends_on: ["eda_5"],
        loop: true, exit: "distributions_characterized" }
      { id: "eda_7", task_type: "correlation_analysis", depends_on: ["eda_5"] }
      { id: "eda_8", task_type: "hypothesis_generation",
        depends_on: ["eda_6", "eda_7"],
        loop: true, exit: "hypotheses_generated" }
    ]
    fan_out_points: []       // EDA is typically single-stream
    terminal_outputs: ["feature_set", "metric_result", "hypothesis_result"]
  }

  exit_condition: "hypotheses_generated AND distributions_characterized"
}
```

### Playbook: Outcome ROI

```
PlaybookTemplate {
  id:              "outcome_roi"
  name:            "Outcome ROI Analysis"
  description:     "Quantify the business value of an observed outcome by measuring
                    the metric impact, attributing causation where possible, and
                    translating to monetary terms."
  analytical_frame: "what_it_was_worth"

  trigger_conditions: {
    analytical_pattern:  ["compare", "explain"]
    scope_requires:      "business_context.decision contains 'value' OR 'roi' OR 'worth' OR 'impact'"
  }

  parameters: {
    population:       from scope.definition.population
    outcome_metric:   from scope.definition.metric
    comparison:       from scope.definition.comparison
    timeframe:        from scope.definition.timeframe
    cost_inputs:      from scope.definition.constraints   // if available
  }

  subgraph: {
    nodes: [
      { id: "oroi_1", task_type: "cohort_extraction",
        fan_out: "comparison_populations" }
      // ── fan-out: one branch per population ──
      { id: "oroi_2a", task_type: "feature_engineering",
        depends_on: ["oroi_1"], branch: "population_a" }
      { id: "oroi_2b", task_type: "feature_engineering",
        depends_on: ["oroi_1"], branch: "population_b" }
      { id: "oroi_3a", task_type: "metric_computation",
        depends_on: ["oroi_2a"], branch: "population_a" }
      { id: "oroi_3b", task_type: "metric_computation",
        depends_on: ["oroi_2b"], branch: "population_b" }
      // ── join: compare populations ──
      { id: "oroi_4", task_type: "statistical_comparison",
        depends_on: ["oroi_3a", "oroi_3b"], join: "comparison_populations" }
      { id: "oroi_5", task_type: "roi_computation",
        depends_on: ["oroi_4"] }
      { id: "oroi_6", task_type: "finding_assembly",
        depends_on: ["oroi_4", "oroi_5"] }
    ]
    fan_out_points: [
      { group: "comparison_populations", source: "oroi_1",
        branches: ["population_a", "population_b"], join: "oroi_4" }
    ]
    terminal_outputs: ["comparison_result", "roi_result", "finding_set"]
  }

  prerequisites: ["eda"]   // EDA playbook should run first
  exit_condition: "roi_computed AND comparison_complete"
}
```

### Playbook: Stickiness ROI

```
PlaybookTemplate {
  id:              "stickiness_roi"
  name:            "Stickiness ROI Analysis"
  description:     "Measure the retention dynamics and lifetime value trajectory
                    of a population, quantifying how 'sticky' customers are and
                    what that stickiness is worth over time."
  analytical_frame: "what_it_was_worth"

  trigger_conditions: {
    analytical_pattern:  ["profile", "compare", "predict"]
    scope_requires:      "metric.name contains 'retention' OR 'repeat' OR
                          'lifetime' OR 'stickiness' OR 'loyalty'"
  }

  parameters: {
    population:       from scope.definition.population
    retention_metric: from scope.definition.metric
    timeframe:        from scope.definition.timeframe
    intervals:        derived ["0-30d", "31-60d", "61-90d", "91-180d", "181-365d"]
    comparison:       from scope.definition.comparison   // optional
  }

  subgraph: {
    nodes: [
      { id: "sroi_1", task_type: "cohort_extraction" }
      { id: "sroi_2", task_type: "feature_engineering", depends_on: ["sroi_1"] }
      { id: "sroi_3", task_type: "metric_computation", depends_on: ["sroi_2"],
        config: { metrics: ["retention_rate", "repeat_rate", "spend_velocity",
                             "order_frequency", "aov_trajectory"] } }
      { id: "sroi_4", task_type: "interval_analysis", depends_on: ["sroi_3"],
        loop: true, exit: "intervals_characterized" }
      { id: "sroi_5", task_type: "trend_detection", depends_on: ["sroi_4"] }
      { id: "sroi_6", task_type: "signal_detection", depends_on: ["sroi_4", "sroi_5"],
        loop: true, exit: "signals_validated" }
      { id: "sroi_7", task_type: "roi_computation",
        depends_on: ["sroi_3", "sroi_4"],
        config: { roi_type: "stickiness_roi" } }
      { id: "sroi_8", task_type: "finding_assembly",
        depends_on: ["sroi_5", "sroi_6", "sroi_7"] }
    ]
    fan_out_points: []   // single-stream unless comparison scope triggers fan-out
    terminal_outputs: ["interval_result", "signal_result", "roi_result", "finding_set"]
  }

  prerequisites: ["eda"]
  exit_condition: "intervals_characterized AND roi_computed"

  comparison_variant: {
    // When scope includes a comparison, the subgraph wraps in a fan-out
    trigger:   "scope.comparison != null"
    behavior:  "Duplicate sroi_1 through sroi_6 per population,
                join at sroi_7 with comparative roi_computation,
                add statistical_comparison node before finding_assembly"
  }
}
```

### Playbook: Interval Analysis

```
PlaybookTemplate {
  id:              "interval_analysis_playbook"
  name:            "Interval Analysis"
  description:     "Partition the customer lifecycle into time windows and measure
                    behavioral transitions, velocity changes, and inflection points
                    across those windows."
  analytical_frame: "what_happened"

  trigger_conditions: {
    analytical_pattern:  ["profile", "explain"]
    scope_requires:      "timeframe.granularity != null AND
                          (question contains 'over time' OR 'trajectory' OR
                           'lifecycle' OR 'journey' OR 'progression')"
  }

  parameters: {
    population:       from scope.definition.population
    metrics:          from scope.definition.metric
    timeframe:        from scope.definition.timeframe
    interval_defs:    derived from timeframe   // auto-generate sensible windows
  }

  subgraph: {
    nodes: [
      { id: "ia_1", task_type: "cohort_extraction" }
      { id: "ia_2", task_type: "feature_engineering", depends_on: ["ia_1"],
        config: { feature_category: "temporal" } }
      { id: "ia_3", task_type: "metric_computation", depends_on: ["ia_2"],
        fan_out: "per_interval" }
      // ── fan-out: one branch per time interval ──
      { id: "ia_4", task_type: "interval_analysis",
        depends_on: ["ia_3"], join: "per_interval",
        loop: true, exit: "intervals_characterized" }
      { id: "ia_5", task_type: "trend_detection", depends_on: ["ia_4"] }
      { id: "ia_6", task_type: "signal_detection", depends_on: ["ia_4", "ia_5"],
        loop: true, exit: "signals_validated" }
      { id: "ia_7", task_type: "hypothesis_generation",
        depends_on: ["ia_5", "ia_6"],
        loop: true, exit: "hypotheses_generated" }
      { id: "ia_8", task_type: "finding_assembly",
        depends_on: ["ia_4", "ia_5", "ia_6", "ia_7"] }
    ]
    fan_out_points: [
      { group: "per_interval", source: "ia_3",
        branches: "dynamic — one per interval_def", join: "ia_4" }
    ]
    terminal_outputs: ["interval_result", "signal_result",
                       "hypothesis_result", "finding_set"]
  }

  prerequisites: ["eda"]
  exit_condition: "intervals_characterized AND signals_validated"
}
```

### Playbook: Signal Processing

```
PlaybookTemplate {
  id:              "signal_processing"
  name:            "Behavioral Signal Processing"
  description:     "Extract meaningful behavioral signals from noisy customer data.
                    Identifies leading indicators, regime changes, and actionable
                    patterns that distinguish signal from noise."
  analytical_frame: "what_happened"

  trigger_conditions: {
    analytical_pattern:  ["explain", "predict"]
    scope_requires:      "question contains 'signal' OR 'indicator' OR 'early warning'
                          OR 'pattern' OR 'leading' OR metric.type == 'time_series'"
  }

  subgraph: {
    nodes: [
      { id: "sp_1", task_type: "cohort_extraction" }
      { id: "sp_2", task_type: "feature_engineering", depends_on: ["sp_1"],
        config: { feature_category: "temporal", windows: ["7d", "14d", "30d",
                  "60d", "90d"] } }
      { id: "sp_3", task_type: "metric_computation", depends_on: ["sp_2"],
        config: { result_type: "series" } }
      { id: "sp_4", task_type: "trend_detection", depends_on: ["sp_3"] }
      { id: "sp_5", task_type: "anomaly_detection", depends_on: ["sp_3"] }
      { id: "sp_6", task_type: "signal_detection",
        depends_on: ["sp_3", "sp_4", "sp_5"],
        loop: true, exit: "signals_validated" }
      { id: "sp_7", task_type: "hypothesis_generation",
        depends_on: ["sp_4", "sp_5", "sp_6"],
        loop: true, exit: "hypotheses_generated" }
      { id: "sp_8", task_type: "finding_assembly",
        depends_on: ["sp_6", "sp_7"] }
    ]
    fan_out_points: []
    terminal_outputs: ["signal_result", "hypothesis_result", "finding_set"]
  }

  prerequisites: ["eda"]
  exit_condition: "signals_validated"
}
```

### Playbook: Hypothesis Validation

```
PlaybookTemplate {
  id:              "hypothesis_validation"
  name:            "Hypothesis Validation"
  description:     "Systematically test proposed hypotheses about customer behavior
                    using statistical evidence. Takes hypotheses from exploration
                    and produces validated conclusions."
  analytical_frame: "why_it_happened"

  trigger_conditions: {
    analytical_pattern:  ["explain", "compare"]
    scope_requires:      "question contains 'why' OR 'driver' OR 'cause' OR
                          'explain' OR 'because'"
  }

  subgraph: {
    nodes: [
      { id: "hv_1", task_type: "hypothesis_generation",
        config: { source: "upstream_eda OR scope.hypotheses" } }
      { id: "hv_2", task_type: "sampling", depends_on: [],
        config: { method: "stratified", purpose: "hypothesis_testing" } }
      { id: "hv_3", task_type: "feature_engineering", depends_on: ["hv_2"],
        config: { driven_by: "hypotheses" } }
      { id: "hv_4", task_type: "hypothesis_test",
        depends_on: ["hv_1", "hv_3"],
        fan_out: "per_hypothesis",
        loop: true, exit: "hypothesis_stable" }
      // ── fan-out: one branch per hypothesis ──
      { id: "hv_5", task_type: "hypothesis_assessment",
        depends_on: ["hv_4"], join: "per_hypothesis" }
      { id: "hv_6", task_type: "finding_assembly",
        depends_on: ["hv_5"] }
    ]
    fan_out_points: [
      { group: "per_hypothesis", source: "hv_1",
        branches: "dynamic — one per generated hypothesis", join: "hv_5" }
    ]
    terminal_outputs: ["hypothesis_result", "finding_set"]
  }

  prerequisites: ["eda"]
  exit_condition: "all_hypotheses_assessed"
}
```

### Playbook: Sampling

```
PlaybookTemplate {
  id:              "sampling_playbook"
  name:            "Statistical Sampling"
  description:     "Draw and validate a statistically representative sample from
                    a population. Used when full-population analysis is impractical
                    or when matched comparison groups are needed."
  analytical_frame: "methodology"    // supporting playbook, not standalone

  trigger_conditions: {
    population_size:   "> threshold (configurable, default 1M)"
    OR comparison_type: "matched"
    OR downstream_requires: "sample_set"
  }

  subgraph: {
    nodes: [
      { id: "smp_1", task_type: "cohort_extraction" }
      { id: "smp_2", task_type: "distribution_analysis", depends_on: ["smp_1"],
        config: { purpose: "stratification_planning" } }
      { id: "smp_3", task_type: "sampling", depends_on: ["smp_1", "smp_2"],
        config: { method: "from scope or auto-select",
                  power_analysis: true } }
    ]
    terminal_outputs: ["sample_set"]
  }

  exit_condition: "sample_validated AND representativeness_confirmed"
  notes: "This playbook is typically composed INTO other playbooks rather
          than run standalone. The Plan Agent inserts it when a downstream
          playbook's cohort exceeds the size threshold."
}
```

---

## Playbook Composition

The Plan Agent's primary job is composing playbook instantiations into a complete DAG. Composition follows these rules:

### Composition Patterns

```
PlaybookComposition {

  sequential: {
    description: "One playbook's terminal outputs feed into another's inputs"
    example:     "EDA → Hypothesis Validation"
    mechanism:   "EDA produces hypothesis_result with status='proposed',
                  Hypothesis Validation consumes it"
    wiring:      "Plan Agent connects EDA terminal to HV entry,
                  mapping output types to input requirements"
  }

  parallel: {
    description: "Multiple playbook instances run simultaneously on different populations"
    example:     "Stickiness ROI (new customers) || Stickiness ROI (reactivated)"
    mechanism:   "Same playbook template, different parameterization"
    wiring:      "Plan Agent fans out at cohort_extraction,
                  instantiates playbook per population,
                  joins at finding_assembly"
  }

  nested: {
    description: "One playbook is inserted as a sub-step within another"
    example:     "Sampling playbook inserted into Hypothesis Validation when
                  population is too large"
    mechanism:   "Plan Agent detects trigger condition (population > threshold),
                  inserts sampling subgraph before hypothesis testing nodes"
    wiring:      "sampling terminal (sample_set) replaces cohort input
                  for downstream nodes"
  }

  chained: {
    description: "Playbooks run in sequence where the second depends on
                  specific findings from the first"
    example:     "Signal Processing → Outcome ROI (triggered by discovered signals)"
    mechanism:   "Finding gate: if Signal Processing finds significant leading
                  indicators, trigger Outcome ROI to quantify their value"
    wiring:      "finding_gate edge from SP finding_assembly to OROI entry"
  }
}
```

### Composition Validation

```
CompositionValidation {

  rule: "All playbook instantiations must share a common EDA base unless
         the scope explicitly exempts EDA (rare — only for follow-up analyses
         where EDA was already done)."

  rule: "Fan-out playbook instances must share identical task type sequences.
         You cannot fan out into structurally different playbooks for
         different populations."

  rule: "Every playbook instantiation must connect to the final
         finding_assembly node. No playbook output can be orphaned."

  rule: "Nested playbooks inherit the parent playbook's budget allocation.
         They do not get independent budgets."

  rule: "The total DAG must pass all Layer 3 composition rules after
         playbook composition is complete."
}
```

---

## Plan Agent Workflow (Updated)

With the registry in place, the Plan Agent's generation process becomes:

```
Scope Artifact
      │
      ▼
1. Match scope against playbook trigger conditions
   → Select primary playbook(s)
   → Identify prerequisite playbooks (e.g., EDA)
      │
      ▼
2. Instantiate playbook subgraphs
   → Parameterize with scope specifics
   → Apply fan-out rules if scope has comparisons or multiple metrics
      │
      ▼
3. Compose playbook subgraphs into unified DAG
   → Wire terminal outputs to downstream inputs
   → Insert nested playbooks where trigger conditions are met
   → Add finding gates for conditional chaining
      │
      ▼
4. Validate against composition rules
   → Data flow validity
   → Ordering constraints
   → Fan-out/join integrity
   → Completeness (ingestion → synthesis path)
   → No orphans
      │
      ▼
5. Allocate budgets per node
   → Apply cost-reward model per task category
   → Set exit conditions for loop tasks
   → Flag tool gaps
      │
      ▼
6. Format three-view Plan Artifact
   → Stakeholder view (linearized)
   → Agent view (DAG with full metadata)
   → Trace view (empty, ready for Phase 2)
      │
      ▼
Plan Artifact
```

The LLM's role shrinks to: **select the right playbooks for this scope, parameterize them correctly, and handle any novel task nodes that don't fit existing templates.** The structural validity is guaranteed by the registry and composition rules, not by the model's judgment.
