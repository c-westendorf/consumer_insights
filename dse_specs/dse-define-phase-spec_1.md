# Data Scientist Engine — Define Phase Specification

## Product Vision

The Data Scientist Engine (DSE) is a self-tooling agentic system that automates the full customer insights cycle — from scoped business task through analysis to stakeholder delivery. The system is governed by the Customer Growth Framework (CGF), which serves as both a behavioral taxonomy for customer lifecycle analysis and a scope template that constrains the agent's action space to domain-relevant work.

The DSE is designed in three phases, each building on the last:

| Phase | Scope | Outcome |
|-------|-------|---------|
| **Phase 1: Define** | Scope + Plan | A conversational interface that produces a principal-approved data science project plan from a business question |
| **Phase 2: Analyze** | Toolkit + Orchestration | An agent harness that executes the plan using self-evolving playbooks and tools |
| **Phase 3: Deliver** | Synthesis + Artifacts | A delivery system that produces stakeholder-ready findings, narratives, and recommendations |

This specification covers **Phase 1: Define** — the atomic proof that the system can take a loosely stated business question and, through structured conversation, produce a plan that a principal data scientist would approve as the project plan.

### Why This Phase First

If the plan is wrong, everything downstream is wasted compute. The Define phase is the highest-leverage intervention point in the data science workflow. A well-scoped, well-planned project rarely fails in execution. A poorly scoped one rarely succeeds regardless of execution quality.

Phase 1 proves two things:

1. An agent can disambiguate a business question into a precise analytical scope through structured interaction.
2. An agent can decompose that scope into a dependency-aware execution plan that accounts for fan-out, convergence, and resource allocation.

If both hold, the plan artifact becomes the execution contract that Phase 2 agents consume.

---

## Architecture Overview

The Define phase operates within a three-layer harness architecture:

```
┌─────────────────────────────────────────────────────────┐
│  UI Layer                                               │
│  Conversational interface for business stakeholder      │
│  or data scientist initiating work                      │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│  Harness Layer                                          │
│  Agent lifecycle, state management, tool routing,       │
│  permissions, failure handling, resource governance     │
├─────────────────┬───────────────────────────────────────┤
│  Scope Agent    │  Plan Agent                           │
│  (interactive)  │  (generative)                         │
└─────────────────┴───────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│  Model Layer                                            │
│  LLM inference for intent classification,               │
│  disambiguation, plan generation                        │
└─────────────────────────────────────────────────────────┘
```

### Control Flow

```
Business Question (natural language)
        │
        ▼
┌──────────────────┐
│   Scope Agent    │◄──── User interaction loop
│                  │      (disambiguation, validation)
└────────┬─────────┘
         │
         ▼
   Scope Artifact ← validated, complete, immutable once approved
         │
         ▼
┌──────────────────┐
│   Plan Agent     │◄──── CGF taxonomy, tool/playbook registry
│                  │
└────────┬─────────┘
         │
         ▼
   Plan Artifact  ← DAG of tasks, three views, execution contract
         │
         ▼
   Handoff to Phase 2 (Analyze)
```

**Critical boundary:** The Scope Agent and Plan Agent are separate agents with no shared state. The Scope Artifact is the sole interface between them. This prevents scope creep from leaking into planning and ensures the plan is always traceable to an approved scope.

---

## Component 1: Scope Agent

### Purpose

Transform a loosely stated business question into a validated, complete Scope Artifact through structured interaction with the user.

### Responsibilities (Isolated)

- Intent classification of the incoming business question
- Interactive disambiguation when the scope is underspecified
- Validation that the scope is complete and actionable
- Production of the Scope Artifact

### Explicitly NOT Responsible For

- Deciding how the work will be done (that's the Plan Agent)
- Assessing data availability (that's the Plan Agent's concern during plan generation)
- Tool selection or playbook matching
- Any analytical work

### Interaction Model

The Scope Agent operates in a conversational loop:

```
User provides business question
        │
        ▼
┌─ Intent Classification ─────────────────────────────┐
│  Classify the question against CGF taxonomy:         │
│  - Which customer lifecycle stage?                   │
│  - Which analytical pattern? (profile, compare,      │
│    predict, explain, segment)                        │
│  - Is this a new analysis or iteration on prior?     │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌─ Completeness Check ────────────────────────────────┐
│  Evaluate scope against required fields.             │
│  Identify missing or ambiguous elements.             │
│  If incomplete → generate targeted questions.        │
│  If complete → proceed to validation.                │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
       ┌───────┴────────┐
       │  Incomplete?    │──── Yes ──→ Ask user (one question at a time)
       └───────┬────────┘              │
               │ No                    │
               │         ◄─────────────┘
               ▼
┌─ Validation ────────────────────────────────────────┐
│  Present completed scope to user for approval.       │
│  User approves → freeze Scope Artifact.              │
│  User revises → re-enter disambiguation loop.        │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
         Scope Artifact (immutable)
```

### Conversation State Management

The Scope Agent maintains a session state object throughout the interaction:

```
ScopeSession {
  session_id:        string
  status:            "classifying" | "disambiguating" | "validating" | "approved"
  intent:            IntentClassification | null
  partial_scope:     PartialScope
  questions_asked:   Question[]
  responses:         Response[]
  current_question:  Question | null
  attempt_count:     int          // guards against infinite loops
  max_attempts:      int          // default: 10
}
```

**State transitions:**

- `classifying → disambiguating`: intent classified, missing fields identified
- `disambiguating → disambiguating`: user responds, new gaps identified
- `disambiguating → validating`: all required fields populated
- `validating → approved`: user confirms
- `validating → disambiguating`: user requests changes

**Termination conditions:**

- User approves the scope (success)
- Max attempts reached without convergence (failure — escalate to human)
- User explicitly abandons (cancellation)

---

## Component 2: Scope Agent Tools

Each tool is a discrete, typed interface registered with the harness. Tools have no awareness of each other and no shared state.

### Tool 2.1: Intent Classifier

**Purpose:** Classify a business question against the CGF taxonomy to identify the lifecycle stage and analytical pattern.

```
IntentClassifierTool {
  name:         "intent_classifier"
  description:  "Classifies a business question against CGF lifecycle
                 stages and analytical patterns"

  input: {
    raw_question:     string    // the user's original question
    conversation_context: string[]  // prior exchanges, if any
  }

  output: {
    lifecycle_stage:  enum [
      "acquisition", "new_customer", "low_engaged",
      "medium_engaged", "high_engaged", "reactivated",
      "at_risk", "lapsed"
    ]
    analytical_pattern: enum [
      "profile",     // characterize a population
      "compare",     // contrast populations or time periods
      "predict",     // forecast behavior or outcome
      "explain",     // identify drivers of an outcome
      "segment"      // discover sub-populations
    ]
    confidence:       float (0-1)
    ambiguities:      string[]   // identified ambiguities in the question
  }

  failure_modes:
    - Question doesn't map to any CGF stage → return confidence < 0.3,
      flag for user clarification
    - Multiple stages plausible → return top candidate + ambiguities
}
```

### Tool 2.2: Scope Extractor

**Purpose:** Parse structured scope fields from natural language, populating as many fields as possible from the input.

```
ScopeExtractorTool {
  name:         "scope_extractor"
  description:  "Extracts structured scope fields from natural language
                 business questions and conversation context"

  input: {
    raw_question:          string
    intent_classification: IntentClassification
    prior_extractions:     PartialScope | null  // accumulated from prior turns
    user_responses:        Response[]            // answers to disambiguation questions
  }

  output: {
    partial_scope: PartialScope {
      population:      PopulationDef | null
      metric:          MetricDef | null
      timeframe:       TimeframeDef | null
      comparison:      ComparisonDef | null
      business_context: string | null     // what decision does this inform?
      constraints:     string[] | null    // known limitations or exclusions
    }
    extracted_fields:  string[]    // which fields were populated this pass
    missing_fields:    string[]    // which required fields remain empty
  }

  failure_modes:
    - Contradictory extractions from conversation → flag conflict,
      ask user to resolve
    - Field extracted with low confidence → mark as tentative,
      include in validation
}
```

### Tool 2.3: Completeness Validator

**Purpose:** Evaluate whether a partial scope meets the minimum requirements for plan generation.

```
CompletenessValidatorTool {
  name:         "completeness_validator"
  description:  "Validates a partial scope against completeness rules
                 and generates targeted disambiguation questions"

  input: {
    partial_scope:       PartialScope
    analytical_pattern:  enum   // from intent classification
  }

  output: {
    is_complete:     boolean
    missing_fields:  MissingField[] {
      field_name:    string
      importance:    "required" | "recommended" | "optional"
      reason:        string       // why this field matters for this pattern
      suggested_question: string  // natural language question to ask user
    }
    warnings:        string[]     // non-blocking issues (e.g., very broad timeframe)
  }

  rules:
    - "profile" requires: population, metric, timeframe
    - "compare" requires: population, metric, timeframe, comparison
    - "predict" requires: population, metric, timeframe, prediction_horizon
    - "explain" requires: population, metric, timeframe, outcome_variable
    - "segment" requires: population, timeframe, segmentation_basis

  failure_modes:
    - Analytical pattern not set → reject, require intent classification first
}
```

### Tool 2.4: Scope Formatter

**Purpose:** Render the validated scope as the final Scope Artifact for user approval and downstream consumption.

```
ScopeFormatterTool {
  name:         "scope_formatter"
  description:  "Renders a complete scope into the Scope Artifact format
                 for user approval and Plan Agent consumption"

  input: {
    complete_scope:       PartialScope  // all required fields populated
    intent_classification: IntentClassification
    session_metadata: {
      session_id:    string
      turns_taken:   int
      timestamp:     datetime
    }
  }

  output: {
    scope_artifact: ScopeArtifact   // see Artifact Schema below
    human_readable: string          // natural language summary for user review
  }

  failure_modes:
    - Incomplete scope passed in → reject, return to validator
}
```

---

## Component 3: Plan Agent

### Purpose

Consume a validated Scope Artifact and produce a Plan Artifact — a dependency-aware DAG of analytical tasks that serves as the execution contract for Phase 2.

### Responsibilities (Isolated)

- Decompose the scope into discrete analytical tasks
- Assess data availability and flag gaps
- Assign playbook references and tool requirements per task
- Define entry conditions, exit conditions, and fan-out rules
- Allocate exploration budgets per task
- Produce the Plan Artifact in three views (stakeholder, agent, trace)

### Explicitly NOT Responsible For

- Interacting with the user (scope is already approved)
- Modifying the scope
- Executing any analytical work
- Building or selecting specific tools (it references tool *types* from the taxonomy)

### Generation Process

```
Scope Artifact
      │
      ▼
┌─ Task Decomposition ────────────────────────────────┐
│  Map scope to CGF task templates.                    │
│  Identify required analytical operations.            │
│  Decompose into atomic task nodes.                   │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌─ Dependency Resolution ─────────────────────────────┐
│  Determine data flow between tasks.                  │
│  Identify parallelizable branches (fan-out points).  │
│  Define join points where branches reconverge.       │
│  Set entry conditions per task node.                 │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌─ Budget Allocation ─────────────────────────────────┐
│  Assign exploration budgets per task based on        │
│  analytical pattern and phase-specific cost-reward.  │
│  Define exit/convergence conditions per task.        │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌─ Plan Formatting ───────────────────────────────────┐
│  Produce three-view Plan Artifact.                   │
│  Validate plan completeness and consistency.         │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
         Plan Artifact
```

---

## Component 4: Plan Agent Tools

### Tool 4.1: Task Decomposer

**Purpose:** Break a scope into atomic analytical task nodes using CGF task templates.

```
TaskDecomposerTool {
  name:         "task_decomposer"
  description:  "Decomposes a Scope Artifact into atomic task nodes
                 by matching against CGF task templates"

  input: {
    scope_artifact:    ScopeArtifact
    task_templates:    TaskTemplate[]    // from CGF template registry
    tool_taxonomy:     ToolTaxonomy      // available tool categories
    playbook_registry: PlaybookRef[]     // known playbook patterns
  }

  output: {
    task_nodes: TaskNode[] {
      task_id:           string
      task_type:         enum ["ingestion", "profiling", "exploration",
                               "hypothesis_test", "modeling",
                               "synthesis", "validation"]
      description:       string          // human-readable task description
      playbook_ref:      string | null   // known playbook, or null if novel
      tool_types_needed: string[]        // taxonomy references, not specific tools
      input_requirements: DataRequirement[]
      estimated_complexity: enum ["low", "medium", "high"]
    }
  }

  failure_modes:
    - Scope doesn't match any task template → generate novel decomposition,
      flag for human review
    - Tool taxonomy has no coverage for a required operation →
      flag as tool-creation prerequisite in the plan
}
```

### Tool 4.2: Dependency Resolver

**Purpose:** Organize task nodes into a dependency-aware DAG with fan-out and join semantics.

```
DependencyResolverTool {
  name:         "dependency_resolver"
  description:  "Resolves dependencies between task nodes and produces
                 a DAG with fan-out/join points and entry conditions"

  input: {
    task_nodes:    TaskNode[]
  }

  output: {
    dag: PlanDAG {
      nodes:       DAGNode[] {
        task_id:           string
        task_node:         TaskNode      // reference to decomposed task
        depends_on:        string[]      // task_ids that must complete first
        entry_conditions:  EntryCondition[] {
          type:     enum ["data_ready", "finding_gate", "task_complete"]
          source_task_id:  string | null
          condition:       string        // evaluable condition expression
        }
        fan_out_group:     string | null // group ID for parallel branches
        join_point:        string | null // task_id where this branch reconverges
      }
      edges:       DAGEdge[] {
        from_task:   string
        to_task:     string
        edge_type:   enum ["data_flow", "finding_gate", "sequence"]
      }
      fan_out_points: FanOutPoint[] {
        group_id:    string
        source_task: string     // task that triggers the fan-out
        branches:    string[]   // task_ids that run in parallel
        join_task:   string     // task where branches reconverge
      }
    }
  }

  failure_modes:
    - Circular dependency detected → reject, return error with cycle path
    - Orphan task (no path to a join/terminal) → warn, likely a decomposition error
}
```

### Tool 4.3: Budget Allocator

**Purpose:** Assign exploration budgets and convergence criteria to each task node based on its type and the phase-specific cost-reward model.

```
BudgetAllocatorTool {
  name:         "budget_allocator"
  description:  "Assigns exploration budgets and exit conditions per task
                 node based on task type and cost-reward model"

  input: {
    dag:             PlanDAG
    cost_reward_model: CostRewardConfig {
      phase_weights: {
        ingestion:    { cost_per_step: float, penalty_for_error: float }
        exploration:  { cost_per_step: float, info_value_threshold: float }
        modeling:     { cost_per_step: float, perf_delta_threshold: float }
        synthesis:    { cost_per_step: float, coverage_threshold: float }
      }
      total_budget:   float    // overall project budget (abstract units)
    }
  }

  output: {
    allocated_dag: AllocatedDAG {
      nodes: AllocatedDAGNode[] {
        task_id:              string
        exploration_budget:   int       // max iterations for while-loop tasks
        exit_condition:       ExitCondition {
          type:    enum [
            "hypothesis_stable",      // conclusion unchanged for N steps
            "confidence_threshold",   // statistical confidence met
            "performance_plateau",    // model improvement below threshold
            "coverage_complete",      // all required elements addressed
            "budget_exhausted"        // hard stop
          ]
          parameters:  map<string, any>  // type-specific thresholds
        }
        priority:             enum ["critical", "standard", "optional"]
      }
    }
  }

  failure_modes:
    - Total budget insufficient for critical-path tasks → warn,
      suggest scope reduction
    - No exit condition definable for a task type → default to
      budget_exhausted with conservative limit
}
```

### Tool 4.4: Plan Formatter

**Purpose:** Render the allocated DAG into the three-view Plan Artifact.

```
PlanFormatterTool {
  name:         "plan_formatter"
  description:  "Renders an allocated DAG into the three-view Plan Artifact
                 format for stakeholder review and agent execution"

  input: {
    allocated_dag:   AllocatedDAG
    scope_artifact:  ScopeArtifact
  }

  output: {
    plan_artifact: PlanArtifact {

      stakeholder_view: {
        // Linear, numbered, natural language.
        // Maps to business logic, not execution logic.
        summary:     string
        steps:       NumberedStep[] {
          step_number:   int
          description:   string
          rationale:     string    // why this step matters for the business question
        }
      }

      agent_view: {
        // The executable DAG. This is what the harness consumes.
        dag:             AllocatedDAG
        playbook_refs:   map<string, PlaybookRef>
        tool_type_refs:  map<string, ToolTaxonomyNode>
        data_requirements: DataRequirement[]
      }

      trace_view: {
        // Initially empty. Populated during Phase 2 execution.
        // Included in the artifact schema so the structure is
        // defined at plan time, not retrofitted during execution.
        task_traces: map<string, TaskTrace> {
          // task_id → trace
          status:          "pending"
          playbook_used:   null
          tools_invoked:   []
          findings:        []
          iterations:      0
          termination_reason: null
        }
      }
    }
  }

  failure_modes:
    - DAG is internally inconsistent → reject, return to dependency resolver
    - Stakeholder view can't be linearized (complex DAG) →
      group parallel steps under a single numbered step with sub-items
}
```

---

## Artifact Schemas

### Scope Artifact

The Scope Artifact is the immutable contract between the Scope Agent and the Plan Agent. Once approved by the user, it does not change.

```
ScopeArtifact {
  artifact_type:    "scope"
  version:          string             // semver
  scope_id:         string             // unique identifier
  created_at:       datetime
  approved_by:      string             // user identifier
  approved_at:      datetime

  intent: {
    lifecycle_stage:     string         // from CGF taxonomy
    analytical_pattern:  string         // profile | compare | predict | explain | segment
  }

  definition: {
    population: {
      description:     string          // natural language
      criteria:        FilterCriteria[] // structured filters
      estimated_size:  string | null    // if known
    }

    metric: {
      name:            string
      definition:      string          // precise mathematical/business definition
      aggregation:     string          // sum, mean, median, distribution, etc.
    }

    timeframe: {
      start:           date
      end:             date
      granularity:     string          // daily, weekly, monthly
      lookback:        string | null   // for behavioral features
    }

    comparison:        ComparisonDef | null {
      type:            enum ["vs_population", "vs_period", "vs_benchmark"]
      reference:       string          // what we're comparing against
    }

    business_context: {
      question:        string          // the original question, preserved
      decision:        string          // what decision this analysis informs
      stakeholder:     string          // who consumes the output
    }

    constraints:       string[]        // known limitations, exclusions, caveats
  }

  metadata: {
    session_id:        string
    disambiguation_turns: int
    classification_confidence: float
  }
}
```

### Plan Artifact

The Plan Artifact is the execution contract consumed by Phase 2. It contains three views as defined in Tool 4.4 output.

```
PlanArtifact {
  artifact_type:     "plan"
  version:           string
  plan_id:           string
  scope_id:          string            // back-reference to source scope
  created_at:        datetime

  stakeholder_view:  StakeholderView   // see Tool 4.4
  agent_view:        AgentView         // see Tool 4.4
  trace_view:        TraceView         // see Tool 4.4

  metadata: {
    total_tasks:       int
    critical_path_length: int          // longest dependency chain
    fan_out_count:     int             // number of parallel branch points
    total_budget:      float
    estimated_complexity: enum ["low", "medium", "high", "very_high"]
    tool_gaps:         string[]        // tool types needed but not in registry
    playbook_gaps:     string[]        // task types with no known playbook
  }
}
```

---

## Tool Taxonomy (CGF-Aligned)

The tool taxonomy defines the categories of tools the system can reference, build, and evolve. It is organized by data science function and aligned to CGF phases.

```
ToolTaxonomy {

  ingestion: {
    description: "Tools for accessing, loading, and connecting to data"
    nodes: [
      "schema_inference"       // detect types, keys, relationships
      "quality_profiling"      // nulls, cardinality, distributions, anomalies
      "join_discovery"         // identify linkable keys across tables
      "temporal_alignment"     // align datasets on time dimensions
      "cohort_extraction"      // pull populations matching scope criteria
    ]
  }

  transformation: {
    description: "Tools for reshaping and preparing data for analysis"
    nodes: [
      "feature_engineering"    // derive new variables from raw data
      "aggregation"            // group-by, rollup, windowed computations
      "normalization"          // scaling, standardization, encoding
      "temporal_feature_gen"   // recency, frequency, tenure, velocity
      "missing_value_handler"  // imputation, exclusion, flagging
    ]
  }

  exploration: {
    description: "Tools for discovering patterns and generating hypotheses"
    nodes: [
      "distribution_analysis"  // characterize variable distributions
      "correlation_mapping"    // pairwise and multivariate relationships
      "anomaly_detection"      // outliers, regime changes, breaks
      "segmentation_probe"     // clustering, decision boundaries
      "hypothesis_generator"   // propose testable hypotheses from patterns
    ]
  }

  statistical_testing: {
    description: "Tools for evaluating hypotheses with statistical rigor"
    nodes: [
      "comparison_test"        // t-test, chi-square, mann-whitney, etc.
      "effect_size_estimation" // Cohen's d, odds ratio, lift
      "multiple_testing_correction" // Bonferroni, FDR, etc.
      "confidence_interval"    // construct and report CIs
    ]
  }

  modeling: {
    description: "Tools for fitting, validating, and interpreting models"
    nodes: [
      "model_fitting"          // train models (EBM, regression, survival, etc.)
      "validation"             // cross-validation, holdout, temporal split
      "calibration"            // probability calibration, adjustment factors
      "interpretation"         // feature importance, partial dependence, SHAP
      "performance_evaluation" // metrics computation, threshold analysis
    ]
  }

  delivery: {
    description: "Tools for synthesizing and presenting findings"
    nodes: [
      "finding_summarizer"     // condense analytical findings into statements
      "visualization_builder"  // charts, tables, dashboards
      "narrative_generator"    // connect findings into a coherent story
      "recommendation_engine"  // translate findings into actionable next steps
    ]
  }
}
```

---

## Harness Integration

### Agent Registration

Both agents register with the harness as typed agent definitions:

```
AgentRegistration {
  agent_id:        string
  agent_type:      "scope_agent" | "plan_agent"
  tools:           ToolRef[]              // tools this agent is permitted to use
  state_schema:    JSONSchema             // shape of the agent's session state
  input_schema:    JSONSchema             // what the agent accepts
  output_schema:   JSONSchema             // what the agent produces (artifact type)
  max_turns:       int                    // hard limit on interaction cycles
  timeout:         duration               // max wall-clock time
  retry_policy: {
    max_retries:   int
    backoff:       enum ["linear", "exponential"]
    retriable_errors: string[]            // error types that warrant retry
  }
}
```

### Permission Boundaries

| Agent | Can Read | Can Write | Cannot Access |
|-------|----------|-----------|---------------|
| Scope Agent | User input, CGF taxonomy, conversation history | Scope session state, Scope Artifact | Data catalog, raw data, tool registry, playbook registry |
| Plan Agent | Scope Artifact, CGF taxonomy, tool taxonomy, playbook registry, data catalog metadata | Plan Artifact | User conversation, raw data, Scope session state |

**Rationale:** The Scope Agent has no awareness of data availability or tooling — it works purely at the business question level. The Plan Agent has no access to the user conversation — it works purely from the approved scope. This prevents scope drift during planning and planning concerns from contaminating scope definition.

### Failure Handling

| Failure Type | Agent | Response |
|-------------|-------|----------|
| Intent classification low confidence | Scope Agent | Ask user for clarification, do not guess |
| Disambiguation loop exceeds max_turns | Scope Agent | Surface partial scope, ask user to complete manually, escalate |
| Scope Artifact validation fails | Scope Agent | Return to disambiguation with specific missing fields |
| No task template matches scope | Plan Agent | Generate novel decomposition, flag `requires_human_review: true` on plan |
| Circular dependency in DAG | Plan Agent | Log error, attempt alternative decomposition, fail if unresolvable |
| Budget insufficient for critical path | Plan Agent | Warn in plan metadata, suggest scope reduction, do not silently drop tasks |
| Tool taxonomy gap | Plan Agent | Include in plan metadata `tool_gaps[]`, mark affected tasks as `blocked_pending_tooling` |

### Resource Governance

```
ResourceLimits {
  scope_agent: {
    max_llm_calls_per_session:  20     // intent + extraction + validation + formatting
    max_session_duration:       30min
    max_disambiguation_turns:   10
  }

  plan_agent: {
    max_llm_calls_per_plan:     15     // decomposition + dependency + budget + formatting
    max_plan_generation_time:   5min
    max_task_nodes_per_plan:    50     // guard against over-decomposition
  }
}
```

---

## CGF Alignment

The Customer Growth Framework is the domain backbone of the Define phase. It constrains the agent's action space to customer lifecycle analysis and provides the taxonomy against which intents are classified, scopes are validated, and plans are decomposed.

### CGF as Scope Template

Each CGF lifecycle stage implies a default analytical frame:

| Lifecycle Stage | Default Population | Typical Metrics | Common Patterns |
|----------------|-------------------|-----------------|-----------------|
| New Customer | First purchase within timeframe | Conversion rate, first-order AOV, 30/60/90-day repeat rate | Profile, Compare vs. prior cohorts |
| Low-Engaged | Below engagement threshold | Visit frequency, spend velocity, engagement score | Profile, Explain drivers of low engagement |
| Reactivated Low-Engaged | Returned after dormancy | Reactivation rate, post-return retention, spend recovery | Compare vs. continuously active, Predict sustainability |
| Medium-Engaged | Mid-tier engagement | Upgrade probability, wallet share, response to intervention | Segment by growth potential, Predict upgrade likelihood |
| At-Risk | Declining engagement signals | Churn probability, recency decay, intervention response | Predict churn, Explain risk drivers |

The Scope Agent uses these defaults as *starting points* for disambiguation — not as rigid templates. If a user's question doesn't fit a default, the agent adapts.

### CGF as Plan Template

Each analytical pattern has a standard task decomposition template that the Plan Agent uses as a starting point:

**Profile pattern:**
```
1. Cohort extraction
2. Metric computation
3. Distribution characterization
4. Benchmark comparison (if comparison defined)
5. Finding synthesis
```

**Compare pattern:**
```
1. Cohort extraction (population A)
2. Cohort extraction (population B / reference period)
   [fan-out: parallel extraction]
3. Metric computation (both cohorts)
   [fan-out: parallel computation]
4. Statistical comparison
   [join: merge cohort metrics]
5. Effect size estimation
6. Finding synthesis
```

**Predict pattern:**
```
1. Cohort extraction
2. Feature engineering
3. Target variable definition
4. Train/validation split
5. Model fitting
   [while-loop: iterate until performance plateau]
6. Model validation
7. Interpretation
8. Finding synthesis
```

These templates are composable. A scope that combines "compare new vs. reactivated customers AND predict retention for each" generates a plan that composes the Compare and Predict templates with appropriate fan-out and join points.

---

## Success Criteria

Phase 1 is successful when:

1. **Scope fidelity:** A principal data scientist reviews the Scope Artifact and confirms it accurately captures the analytical intent of the original business question, with no material ambiguity remaining.

2. **Plan quality:** A principal data scientist reviews the Plan Artifact (stakeholder view) and would approve it as the project plan — meaning the decomposition is correct, the dependencies are right, the fan-out makes sense, and nothing critical is missing.

3. **Plan executability:** The Plan Artifact (agent view) contains sufficient structure — task nodes, entry/exit conditions, playbook references, budget allocations — that a Phase 2 harness could consume it and begin orchestrating work without human intervention to fill structural gaps.

4. **Isolation integrity:** The Scope Agent and Plan Agent operate independently. No scope decisions leak into planning. No planning concerns influence scope. The Scope Artifact is the sole interface.

5. **Convergence:** The Scope Agent resolves ambiguity in a reasonable number of turns (target: median 3–5 turns) without frustrating the user or producing an incomplete scope.

---

## Phase 2 Preview: What This Enables

The Plan Artifact produced by Phase 1 becomes the execution contract for Phase 2. Phase 2 will introduce:

- **Agent Harness:** Orchestrates multiple analyzing agents against the Plan DAG — managing fan-out, join points, while-loops, and budget enforcement.
- **Starter Toolkit:** The minimum viable set of tools (aligned to the taxonomy above) that agents use to execute task nodes.
- **Playbook Engine:** Executes and evolves playbooks as agents encounter new task patterns and build new tools.
- **Self-Tooling Loop:** When an agent hits a capability gap (tool type needed but not in registry), it branches into a tool-creation subtask, builds the tool, registers it, and resumes the playbook.
- **Cost-Reward Governance:** Phase-specific cost-reward functions that govern explore/exploit decisions within while-loop tasks.

Phase 1 defines the *what* and *how* of the work. Phase 2 provides the *capability* to execute it. Phase 3 synthesizes the results into stakeholder delivery. The CGF governs all three.
