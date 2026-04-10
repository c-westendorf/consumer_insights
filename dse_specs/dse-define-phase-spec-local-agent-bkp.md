# Data Scientist Engine — Define Phase Specification (Local Agent)

## Product Vision

The Data Scientist Engine (DSE) is a system that automates the customer insights cycle — from scoped business task through analysis to stakeholder delivery. The system is governed by the Customer Growth Framework (CGF), which serves as both a behavioral taxonomy for customer lifecycle analysis and a scope template that constrains the agent's action space to domain-relevant work.

The DSE matures in three infrastructure stages:

| Stage | Infrastructure | Execution Model |
|-------|---------------|-----------------|
| **Stage 1: Skills Pipeline** | SKILL.md files, manual sequencing | Human follows documented procedures, decides everything |
| **Stage 2: Local Agent** | agent.md files coordinating skills | Agent proposes, human approves each step |
| **Stage 3: Cloud Harness** | Typed tool registry, DAG orchestration | Harness executes approved plan autonomously |

This specification targets **Stage 2: Local Agent** — the proof that an agent living in a `.claude/` directory can take a business question and, through structured conversation and skill coordination, produce a project plan that a principal data scientist would approve.

### Why Stage 2 (Not Stage 3)

Stage 3 (cloud harness) requires typed tool registrations, runtime agent lifecycle management, and DAG orchestration infrastructure that doesn't exist yet. Stage 2 proves the same intellectual capability — scope a question, plan the work — using infrastructure that exists today: Claude Code, agent.md files, and skills.

If Stage 2 works, the upgrade to Stage 3 is a packaging exercise. The agent.md becomes a harness registration. The skills become typed tools. The plan manifest becomes a Plan Artifact with DAG semantics. The analytical logic doesn't change — only the execution infrastructure.

Stage 2 proves three things:

1. An agent can disambiguate a business question into a precise analytical scope through structured interaction.
2. An agent can decompose that scope into an ordered, dependency-aware project plan.
3. Two agents can coordinate through artifacts without shared state, with human approval at the handoff.

---

## Architecture Overview

The Define phase operates as two coordinating local agents, each defined by an agent.md file in the project's `.claude/` directory. The human approves every transition.

```
┌─────────────────────────────────────────────────────────┐
│  Claude Code Interface                                  │
│  Human data scientist or business stakeholder           │
│  initiates work, reviews outputs, approves transitions  │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│  .claude/ Directory                                     │
│  Agent definitions, skill references, shared context    │
├─────────────────┬───────────────────────────────────────┤
│  scope-agent.md │  plan-agent.md                        │
│  (interactive)  │  (generative)                         │
│  Uses 4 skills  │  Uses 4 skills                        │
└─────────────────┴───────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│  Skills Directory                                       │
│  ~/.claude/skills/ or project-local skills/             │
│  Each skill: SKILL.md + references/ + scripts/          │
└─────────────────────────────────────────────────────────┘
```

### Control Flow

```
Business Question (natural language)
        │
        ▼
┌──────────────────┐
│  scope-agent.md  │◄──── User interaction loop
│                  │      Human approves each step
└────────┬─────────┘
         │
         ▼
   scope_artifact.json ← validated, human-approved, immutable
         │
         ▼
   *** Human reviews scope, approves handoff ***
         │
         ▼
┌──────────────────┐
│  plan-agent.md   │◄──── CGF taxonomy, skill registry
│                  │
└────────┬─────────┘
         │
         ▼
   plan_artifact.json ← ordered tasks, skill refs, execution guidance
         │
         ▼
   *** Human reviews plan, approves for execution ***
         │
         ▼
   Handoff to Phase 2 (Analyze)
```

**Critical boundary:** The Scope Agent and Plan Agent are separate agent.md files with no shared state. The scope_artifact.json is the sole interface between them. The human explicitly approves the handoff. This prevents scope creep from leaking into planning and ensures the plan is always traceable to an approved scope.

**Human-in-the-loop at every transition:** Unlike the cloud harness (Stage 3) where the system executes an approved plan autonomously, at Stage 2 the human reviews and approves at three checkpoints: (1) scope completion, (2) handoff from scope to plan agent, and (3) plan approval.

---

## Component 1: Scope Agent

### Agent Definition

```markdown
# .claude/scope-agent.md
---
name: scope-agent
role: Transform a business question into a precise, validated scope
skills:
  - intent-classification
  - scope-extraction
  - completeness-validation
  - scope-formatting
reads:
  - cgf-taxonomy.md           # CGF lifecycle stages and analytical patterns
  - scope_session.json        # conversation state (created during session)
writes:
  - scope_session.json        # updated after each turn
  - scope_artifact.json       # final output, once approved
hands_off_to:
  - plan-agent                # after human approves the scope
triggers:
  - "new business question"
  - "scope a project"
  - "what should we analyze"
---

## Behavior

You are the Scope Agent. Your job is to take a loosely stated business
question and turn it into a precise, complete specification that a
Plan Agent can consume.

You work through four steps, in order:
1. Classify the intent against CGF taxonomy (which lifecycle stage,
   which analytical pattern)
2. Extract what you can from the question (population, metric,
   timeframe, comparison, business context)
3. Ask the user about what's missing — one question at a time
4. Present the completed scope for user approval

## Rules

- Never decide HOW the work will be done — only WHAT the work is
- Never assess data availability — that's the Plan Agent's job
- Ask one disambiguation question at a time, not a list
- If you can't classify the intent after 3 attempts, say so and
  ask the user to rephrase
- Maximum 10 disambiguation turns before escalating
- Always present the final scope for explicit user approval
- Once the user approves, write scope_artifact.json and stop

## Boundaries

- You CANNOT access: data catalog, raw data, skill registry,
  playbook definitions
- You CAN access: user conversation, CGF taxonomy, your own
  session state
- You CANNOT modify scope_artifact.json after user approval
```

### Purpose

Transform a loosely stated business question into a validated, complete scope_artifact.json through structured interaction with the user.

### Responsibilities (Isolated)

- Intent classification of the incoming business question
- Interactive disambiguation when the scope is underspecified
- Validation that the scope is complete and actionable
- Production of the scope_artifact.json

### Explicitly NOT Responsible For

- Deciding how the work will be done (that's the Plan Agent)
- Assessing data availability (that's the Plan Agent's concern)
- Skill selection or playbook matching
- Any analytical work

### Interaction Model

The Scope Agent operates in a conversational loop with human approval:

```
User provides business question
        │
        ▼
┌─ Intent Classification ─────────────────────────────┐
│  Run intent-classification skill against CGF:        │
│  - Which customer lifecycle stage?                   │
│  - Which analytical pattern? (profile, compare,      │
│    predict, explain, segment)                        │
│  - Is this a new analysis or iteration on prior?     │
│  Present classification to user for confirmation.    │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌─ Scope Extraction ──────────────────────────────────┐
│  Run scope-extraction skill to parse structured      │
│  fields from the question and conversation.          │
│  Populate: population, metric, timeframe,            │
│  comparison, business_context, constraints.          │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌─ Completeness Check ────────────────────────────────┐
│  Run completeness-validation skill.                  │
│  Evaluate scope against required fields for the      │
│  identified analytical pattern.                      │
│  If incomplete → generate targeted question.         │
│  If complete → proceed to formatting.                │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
       ┌───────┴────────┐
       │  Incomplete?    │──── Yes ──→ Ask user (one question)
       └───────┬────────┘              │
               │ No                    │
               │         ◄─────────────┘
               ▼
┌─ Formatting & Approval ─────────────────────────────┐
│  Run scope-formatting skill.                         │
│  Present human-readable scope summary to user.       │
│  User approves → write scope_artifact.json.          │
│  User revises → re-enter disambiguation loop.        │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
         scope_artifact.json (immutable once approved)
```

### Conversation State

The Scope Agent maintains state in a JSON file that persists across turns:

```json
// scope_session.json
{
  "session_id": "uuid",
  "status": "classifying | disambiguating | validating | approved",
  "intent": {
    "lifecycle_stage": "reactivated",
    "analytical_pattern": "compare",
    "confidence": 0.85,
    "ambiguities": []
  },
  "partial_scope": {
    "population": { "description": "Reactivated low-engaged customers", "criteria": [] },
    "metric": null,
    "timeframe": null,
    "comparison": null,
    "business_context": null,
    "constraints": []
  },
  "questions_asked": [],
  "responses": [],
  "attempt_count": 2,
  "max_attempts": 10
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
- Max attempts reached without convergence (failure — agent says so and asks user to complete manually)
- User explicitly abandons (cancellation)

---

## Component 2: Scope Agent Skills

Each skill is a SKILL.md file in the skills directory. Skills are self-contained, portable, and follow the blueprint format. They include DSE-compatible declarations in their frontmatter for future Stage 3 compatibility.

### Skill 2.1: Intent Classification

```markdown
# skills/intent-classification/SKILL.md
---
name: intent-classification
description: Classify a business question against the CGF taxonomy
  to identify the customer lifecycle stage and analytical pattern.
  Use when a new business question arrives and needs to be mapped
  to the CGF framework before scoping can begin.

# DSE-Compatible Declarations
inputs:
  - type: raw_question
    description: "User's business question as natural language"
outputs:
  - type: intent_classification
    description: "Lifecycle stage, analytical pattern, confidence, ambiguities"
can_follow: []
can_precede: [scope-extraction]
supports_loop: false
exit_conditions: [classification_complete]
---

## Workflow

### Step 1 — Parse the Question
Read the business question. Identify key entities: customer segments
mentioned, metrics referenced, time periods, comparison language
("vs", "compared to", "difference between").

### Step 2 — Map to CGF Lifecycle Stage
Match against CGF stages:
- acquisition, new_customer, low_engaged, medium_engaged,
  high_engaged, reactivated, at_risk, lapsed

If multiple stages are plausible, note all candidates with reasoning.

### Step 3 — Identify Analytical Pattern
Classify the question type:
- profile: "characterize", "describe", "what does X look like"
- compare: "difference", "vs", "compared to", "better/worse"
- predict: "will", "likely", "forecast", "probability"
- explain: "why", "drivers", "cause", "because"
- segment: "groups", "clusters", "types of", "segments"

### Step 4 — Assess Confidence
Rate confidence 0-1 based on:
- Single clear stage match → 0.8+
- Ambiguous between 2 stages → 0.5-0.7
- No clear match → below 0.3

### Checkpoint
- [ ] Lifecycle stage identified (or ambiguity flagged)
- [ ] Analytical pattern identified
- [ ] Confidence scored
- [ ] If confidence < 0.3 → HALT, ask user to rephrase

### Terminal Artifact
Return intent classification to the Scope Agent session state.
Do NOT write a standalone manifest — this feeds the session, not the pipeline.
```

### Skill 2.2: Scope Extraction

```markdown
# skills/scope-extraction/SKILL.md
---
name: scope-extraction
description: Extract structured scope fields from a business question
  and conversation context. Populates population, metric, timeframe,
  comparison, business context, and constraints. Use after intent
  classification to build the structured scope.

inputs:
  - type: raw_question
  - type: intent_classification
  - type: conversation_context
outputs:
  - type: partial_scope
can_follow: [intent-classification]
can_precede: [completeness-validation]
supports_loop: true
exit_conditions: [all_extractable_fields_populated]
---

## Workflow

### Step 1 — Extract Population
Look for: customer segment language, filter criteria, lifecycle
stage references. Parse into structured PopulationDef.

### Step 2 — Extract Metric
Look for: what's being measured, how it's aggregated, what "success"
means. Parse into MetricDef with name, definition, aggregation.

### Step 3 — Extract Timeframe
Look for: date references, "last N months", "since", "between",
granularity hints ("daily", "weekly", "monthly"). Parse into
TimeframeDef.

### Step 4 — Extract Comparison (if applicable)
Look for: "vs", "compared to", reference populations or periods.
Parse into ComparisonDef with type and reference.

### Step 5 — Extract Business Context
Look for: what decision this informs, who the stakeholder is, what
action would be taken based on findings.

### Step 6 — Extract Constraints
Look for: exclusions, caveats, known limitations, data restrictions.

### Checkpoint
- [ ] Each field either populated or explicitly marked null
- [ ] No contradictions between extracted fields
- [ ] Tentative extractions flagged for validation
```

### Skill 2.3: Completeness Validation

```markdown
# skills/completeness-validation/SKILL.md
---
name: completeness-validation
description: Evaluate whether a partial scope meets the minimum
  requirements for plan generation. Generates targeted disambiguation
  questions for missing or ambiguous fields. Use after scope extraction
  to determine if the scope is complete or needs more user input.

inputs:
  - type: partial_scope
  - type: intent_classification
outputs:
  - type: completeness_assessment
can_follow: [scope-extraction]
can_precede: [scope-formatting]
supports_loop: false
exit_conditions: [assessment_complete]
---

## Workflow

### Step 1 — Check Required Fields by Pattern

| Pattern | Required Fields |
|---------|----------------|
| profile | population, metric, timeframe |
| compare | population, metric, timeframe, comparison |
| predict | population, metric, timeframe, prediction_horizon |
| explain | population, metric, timeframe, outcome_variable |
| segment | population, timeframe, segmentation_basis |

### Step 2 — Identify Gaps
For each missing required field, generate:
- Field name
- Importance: required / recommended / optional
- Why it matters for this specific analytical pattern
- A natural language question to ask the user

### Step 3 — Check for Warnings
Flag non-blocking issues:
- Very broad timeframe (> 2 years without justification)
- Population likely too small for statistical validity
- Metric definition is ambiguous

### Checkpoint
- [ ] All required fields assessed
- [ ] Missing fields have suggested questions
- [ ] Warnings documented
- [ ] If all required fields populated → mark is_complete: true
```

### Skill 2.4: Scope Formatting

```markdown
# skills/scope-formatting/SKILL.md
---
name: scope-formatting
description: Render a validated, complete scope into the final
  scope_artifact.json format for user approval and Plan Agent
  consumption. Use when completeness validation passes.

inputs:
  - type: partial_scope (complete)
  - type: intent_classification
  - type: session_metadata
outputs:
  - type: scope_artifact
can_follow: [completeness-validation]
can_precede: []
supports_loop: false
exit_conditions: [artifact_written]
---

## Workflow

### Step 1 — Assemble Scope Artifact
Combine all extracted fields into the scope_artifact.json schema.

### Step 2 — Generate Human-Readable Summary
Write a 3-5 sentence natural language summary of the scope that a
non-technical stakeholder could review and confirm.

Format: "We will analyze [population] by measuring [metric] over
[timeframe], comparing against [comparison], to inform [decision]."

### Step 3 — Present for Approval
Show the human-readable summary AND the structured scope to the user.
Wait for explicit approval ("yes", "approved", "looks good").

### Step 4 — Write Artifact
On approval, write scope_artifact.json. Mark as immutable.
On revision request, return to completeness validation with the
user's feedback.

### Checkpoint
- [ ] All required fields present in artifact
- [ ] Human-readable summary generated
- [ ] User has explicitly approved
- [ ] scope_artifact.json written
```

---

## Component 3: Plan Agent

### Agent Definition

```markdown
# .claude/plan-agent.md
---
name: plan-agent
role: Consume a validated scope and produce a project plan
skills:
  - task-decomposition
  - dependency-resolution
  - budget-allocation
  - plan-formatting
reads:
  - scope_artifact.json        # input from Scope Agent
  - cgf-taxonomy.md            # CGF lifecycle stages and patterns
  - skill-registry.md          # known skills and their capabilities
  - playbook-registry.md       # known analytical playbook patterns
writes:
  - plan_artifact.json         # final output
triggers:
  - "scope approved, ready to plan"
  - "create a plan from this scope"
---

## Behavior

You are the Plan Agent. You receive a human-approved scope_artifact.json
and produce a plan_artifact.json — an ordered, dependency-aware project
plan that a data scientist (or future agent) would follow to execute
the analysis.

You work through four steps, in order:
1. Decompose the scope into discrete analytical tasks
2. Resolve dependencies between tasks (what depends on what,
   what can run in parallel)
3. Allocate exploration budgets and define exit conditions
   for iterative tasks
4. Format the plan in two views: stakeholder (numbered steps)
   and execution (task nodes with dependencies and skill references)

## Rules

- Never interact with the user — work exclusively from the
  approved scope_artifact.json
- Never modify the scope — if the scope seems insufficient,
  flag it in plan metadata, don't change it
- Reference skill TYPES from the registry, not specific tool
  implementations
- If a task requires a skill that doesn't exist in the registry,
  flag it as a gap in plan metadata
- Maximum 50 task nodes per plan (guard against over-decomposition)

## Boundaries

- You CANNOT access: user conversation, raw data, scope session state
- You CAN access: scope_artifact.json, CGF taxonomy, skill registry,
  playbook registry
- You CANNOT modify scope_artifact.json
```

### Purpose

Consume a validated scope_artifact.json and produce a plan_artifact.json — an ordered, dependency-aware project plan that serves as the execution guide for Phase 2.

### Responsibilities (Isolated)

- Decompose the scope into discrete analytical tasks
- Assess data availability and flag gaps
- Assign skill references and capability requirements per task
- Define ordering, dependencies, and fan-out points
- Allocate exploration budgets per iterative task
- Produce the plan in stakeholder and execution views

### Explicitly NOT Responsible For

- Interacting with the user (scope is already approved)
- Modifying the scope
- Executing any analytical work
- Building or selecting specific tools (it references skill types)

### Generation Process

```
scope_artifact.json
      │
      ▼
┌─ Task Decomposition ────────────────────────────────┐
│  Run task-decomposition skill.                       │
│  Map scope to CGF task templates.                    │
│  Identify required analytical operations.            │
│  Produce atomic task nodes.                          │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌─ Dependency Resolution ─────────────────────────────┐
│  Run dependency-resolution skill.                    │
│  Determine data flow between tasks.                  │
│  Identify parallelizable branches (fan-out).         │
│  Define ordering and join points.                    │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌─ Budget Allocation ─────────────────────────────────┐
│  Run budget-allocation skill.                        │
│  Assign exploration budgets per iterative task.      │
│  Define exit/convergence conditions.                 │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌─ Plan Formatting ───────────────────────────────────┐
│  Run plan-formatting skill.                          │
│  Produce stakeholder view (numbered steps).          │
│  Produce execution view (task nodes + dependencies). │
│  Validate plan completeness.                         │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
   *** Human reviews plan, approves for execution ***
               │
               ▼
         plan_artifact.json
```

---

## Component 4: Plan Agent Skills

### Skill 4.1: Task Decomposition

```markdown
# skills/task-decomposition/SKILL.md
---
name: task-decomposition
description: Break a scope artifact into atomic analytical task nodes
  by matching against CGF task templates and the skill registry.

inputs:
  - type: scope_artifact
  - type: cgf_task_templates
  - type: skill_registry
outputs:
  - type: task_node_list
can_follow: []
can_precede: [dependency-resolution]
supports_loop: false
exit_conditions: [decomposition_complete]
---

## Workflow

### Step 1 — Match Scope to CGF Templates
Read the scope's lifecycle stage and analytical pattern.
Select the matching CGF task template as a starting point.

### Step 2 — Generate Task Nodes
For each step in the template, produce a task node:
- task_id: unique identifier
- task_type: ingestion | profiling | exploration | hypothesis_test |
  modeling | synthesis | validation
- description: human-readable description
- skill_ref: matching skill from the registry, or null if novel
- input_requirements: what data this task needs
- estimated_complexity: low | medium | high

### Step 3 — Handle Novel Tasks
If the scope requires work that doesn't match any template:
- Generate a novel task node with clear description
- Flag requires_human_review: true
- Note the gap in task metadata

### Checkpoint
- [ ] All scope requirements covered by at least one task
- [ ] Each task has a clear description and type
- [ ] Novel tasks flagged for review
- [ ] Skill gaps documented
```

### Skill 4.2: Dependency Resolution

```markdown
# skills/dependency-resolution/SKILL.md
---
name: dependency-resolution
description: Organize task nodes into a dependency-aware ordered
  list with fan-out points and join semantics. Identifies which
  tasks must run sequentially and which can run in parallel.

inputs:
  - type: task_node_list
outputs:
  - type: ordered_task_plan
can_follow: [task-decomposition]
can_precede: [budget-allocation]
supports_loop: false
exit_conditions: [dependencies_resolved]
---

## Workflow

### Step 1 — Identify Data Flow Dependencies
For each task, determine which upstream tasks produce the data it needs.
A task cannot start until all its data dependencies are satisfied.

### Step 2 — Identify Parallelizable Work
When the scope defines multiple populations (comparison), flag
cohort extraction as a fan-out point — both populations can be
extracted simultaneously.

When multiple metrics are defined, flag metric computation as
a fan-out point.

### Step 3 — Identify Join Points
Where parallel branches reconverge (e.g., statistical comparison
needs both cohort results), mark the join point.

### Step 4 — Validate Ordering
Check for:
- Circular dependencies → reject with error
- Orphan tasks with no path to synthesis → warn
- Missing data flows → flag gap

### Checkpoint
- [ ] Every task has defined predecessors (or is an entry point)
- [ ] Fan-out and join points identified
- [ ] No circular dependencies
- [ ] No orphan tasks
```

### Skill 4.3: Budget Allocation

```markdown
# skills/budget-allocation/SKILL.md
---
name: budget-allocation
description: Assign exploration budgets and exit conditions to
  iterative tasks. Non-iterative tasks get a fixed budget of 1.
  Iterative tasks (exploration, hypothesis testing) get a defined
  maximum iteration count and convergence criteria.

inputs:
  - type: ordered_task_plan
outputs:
  - type: budgeted_task_plan
can_follow: [dependency-resolution]
can_precede: [plan-formatting]
supports_loop: false
exit_conditions: [budgets_allocated]
---

## Workflow

### Step 1 — Classify Task Iteration Type
For each task, determine if it is iterative (while-loop) or
one-shot:
- Iterative: exploration, hypothesis_test, feature_engineering
- One-shot: ingestion, profiling, synthesis, validation

### Step 2 — Assign Exit Conditions
For each iterative task, assign an exit condition:
- hypothesis_stable: conclusion unchanged for N steps
- confidence_threshold: statistical confidence met
- performance_plateau: model improvement below threshold
- coverage_complete: all required elements addressed
- budget_exhausted: hard stop (always present as fallback)

### Step 3 — Assign Budgets
Per task category defaults:
- Exploration: max 5 iterations
- Hypothesis testing: max 3 iterations per hypothesis
- Feature engineering: max 3 iterations
- Override with scope-specific budgets if defined

### Step 4 — Assign Priority
- critical: on the critical path, cannot be dropped
- standard: required but not on critical path
- optional: adds value but can be deferred

### Checkpoint
- [ ] Every iterative task has an exit condition
- [ ] Every iterative task has a max iteration budget
- [ ] Critical path tasks identified
```

### Skill 4.4: Plan Formatting

```markdown
# skills/plan-formatting/SKILL.md
---
name: plan-formatting
description: Render the budgeted task plan into the final
  plan_artifact.json with two views — stakeholder (numbered steps
  in plain language) and execution (task nodes with dependencies,
  skill references, and budgets).

inputs:
  - type: budgeted_task_plan
  - type: scope_artifact
outputs:
  - type: plan_artifact
can_follow: [budget-allocation]
can_precede: []
supports_loop: false
exit_conditions: [artifact_written]
---

## Workflow

### Step 1 — Generate Stakeholder View
Create a numbered, linear summary of the plan in plain language.
Each step includes:
- Step number
- Description (what's being done)
- Rationale (why this step matters for the business question)

For parallel branches, group them under a single numbered step
with sub-items: "3a. Extract new customer cohort / 3b. Extract
reactivated customer cohort (parallel)"

### Step 2 — Generate Execution View
Produce the structured task list with:
- Task nodes with dependencies (depends_on: [task_ids])
- Fan-out and join point annotations
- Skill references per task
- Budget and exit conditions per iterative task
- Entry conditions per task

### Step 3 — Generate Metadata
Compute plan metadata:
- Total task count
- Critical path length (longest dependency chain)
- Fan-out count (number of parallel branch points)
- Skill gaps (tasks needing skills not in registry)
- Estimated complexity: low / medium / high / very_high

### Step 4 — Validate Completeness
Assert:
- Every scope requirement is addressed by at least one task
- There is a path from an ingestion task to a synthesis task
- No orphan tasks
- Stakeholder view can be linearized

### Checkpoint
- [ ] Stakeholder view is clear, numbered, readable
- [ ] Execution view has all task nodes with dependencies
- [ ] Metadata computed
- [ ] Completeness validation passes
- [ ] plan_artifact.json written
```

---

## Artifact Schemas

### Scope Artifact

The scope_artifact.json is the immutable contract between the Scope Agent and the Plan Agent. Once approved by the user, it does not change.

```json
{
  "artifact_type": "scope",
  "version": "1.0.0",
  "scope_id": "uuid",
  "created_at": "2025-06-15T10:30:00Z",
  "approved_by": "user_name",
  "approved_at": "2025-06-15T10:35:00Z",

  "intent": {
    "lifecycle_stage": "reactivated",
    "analytical_pattern": "compare"
  },

  "definition": {
    "population": {
      "description": "Reactivated low-engaged customers who returned in Q1 2025",
      "criteria": [
        { "field": "lifecycle_stage", "op": "eq", "value": "reactivated_low_engaged" },
        { "field": "reactivation_date", "op": "between", "value": ["2025-01-01", "2025-03-31"] }
      ],
      "estimated_size": "~15,000 customers"
    },
    "metric": {
      "name": "90-day repeat purchase rate",
      "definition": "% of customers with 2+ purchases within 90 days of reactivation",
      "aggregation": "rate"
    },
    "timeframe": {
      "start": "2025-01-01",
      "end": "2025-06-30",
      "granularity": "monthly",
      "lookback": "12 months for behavioral features"
    },
    "comparison": {
      "type": "vs_population",
      "reference": "Continuously active medium-engaged customers in same period"
    },
    "business_context": {
      "question": "Are reactivated customers sticking around or churning again?",
      "decision": "Whether to increase reactivation campaign budget for Q3",
      "stakeholder": "VP of Customer Growth"
    },
    "constraints": [
      "Exclude customers reactivated via deep discount (>50% off)",
      "Focus on organic and email-driven reactivations only"
    ]
  },

  "metadata": {
    "session_id": "uuid",
    "disambiguation_turns": 4,
    "classification_confidence": 0.87
  }
}
```

### Plan Artifact

The plan_artifact.json is the execution guide consumed by Phase 2. It contains two views: stakeholder and execution.

```json
{
  "artifact_type": "plan",
  "version": "1.0.0",
  "plan_id": "uuid",
  "scope_id": "uuid (back-reference)",
  "created_at": "2025-06-15T10:40:00Z",

  "stakeholder_view": {
    "summary": "We will compare the retention behavior of reactivated customers against continuously active customers to determine if reactivation campaigns are producing durable value.",
    "steps": [
      { "step": 1, "description": "Connect to customer data warehouse and profile available tables", "rationale": "Need to confirm data availability and quality before analysis" },
      { "step": 2, "description": "Extract two cohorts: (a) reactivated low-engaged Q1 2025, (b) continuously active medium-engaged same period", "rationale": "These are the populations we're comparing" },
      { "step": 3, "description": "Engineer behavioral features: recency, frequency, monetary, engagement velocity", "rationale": "Need consistent features across both populations for fair comparison" },
      { "step": 4, "description": "Compute 90-day repeat purchase rate and supporting metrics for both cohorts", "rationale": "This is the primary metric the VP needs to make the budget decision" },
      { "step": 5, "description": "Run statistical comparison with effect size estimation", "rationale": "Need to know if the difference is real and how large it is" },
      { "step": 6, "description": "Analyze retention trajectory across 30/60/90-day intervals", "rationale": "Need to see when drop-off happens, not just whether it does" },
      { "step": 7, "description": "Quantify the ROI difference between reactivated and active customers", "rationale": "Translates the behavioral findings into the dollar terms the VP needs" },
      { "step": 8, "description": "Assemble findings and generate recommendations", "rationale": "Synthesize everything into a recommendation on Q3 budget" }
    ]
  },

  "execution_view": {
    "tasks": [
      {
        "task_id": "t1",
        "task_type": "ingestion",
        "description": "Data extraction and schema profiling",
        "skill_ref": "multi-cloud-data-connector",
        "depends_on": [],
        "fan_out_group": null,
        "priority": "critical",
        "budget": { "max_iterations": 1, "exit_condition": "data_loaded" }
      },
      {
        "task_id": "t2a",
        "task_type": "population",
        "description": "Extract reactivated low-engaged cohort",
        "skill_ref": "cohort-builder",
        "depends_on": ["t1"],
        "fan_out_group": "comparison_populations",
        "priority": "critical",
        "budget": { "max_iterations": 1, "exit_condition": "cohort_built" }
      },
      {
        "task_id": "t2b",
        "task_type": "population",
        "description": "Extract continuously active medium-engaged cohort",
        "skill_ref": "cohort-builder",
        "depends_on": ["t1"],
        "fan_out_group": "comparison_populations",
        "priority": "critical",
        "budget": { "max_iterations": 1, "exit_condition": "cohort_built" }
      },
      {
        "task_id": "t3",
        "task_type": "transformation",
        "description": "Feature engineering for both cohorts",
        "skill_ref": "feature-engineering",
        "depends_on": ["t2a", "t2b"],
        "join_point": "comparison_populations",
        "priority": "critical",
        "budget": { "max_iterations": 3, "exit_condition": "feature_set_stable" }
      },
      {
        "task_id": "t4",
        "task_type": "transformation",
        "description": "Compute primary and supporting metrics",
        "skill_ref": "metric-computation",
        "depends_on": ["t3"],
        "priority": "critical",
        "budget": { "max_iterations": 1, "exit_condition": "metrics_computed" }
      },
      {
        "task_id": "t5",
        "task_type": "analysis",
        "description": "Statistical comparison with effect size",
        "skill_ref": "statistical-comparison",
        "depends_on": ["t4"],
        "priority": "critical",
        "budget": { "max_iterations": 1, "exit_condition": "comparison_complete" }
      },
      {
        "task_id": "t6",
        "task_type": "analysis",
        "description": "Interval analysis across 30/60/90-day windows",
        "skill_ref": "retention-stickiness-analysis",
        "depends_on": ["t4"],
        "priority": "standard",
        "budget": { "max_iterations": 3, "exit_condition": "intervals_characterized" }
      },
      {
        "task_id": "t7",
        "task_type": "valuation",
        "description": "ROI computation — reactivated vs active customer value",
        "skill_ref": "roi-computation",
        "depends_on": ["t5", "t6"],
        "priority": "critical",
        "budget": { "max_iterations": 1, "exit_condition": "roi_computed" }
      },
      {
        "task_id": "t8",
        "task_type": "synthesis",
        "description": "Finding assembly and narrative generation",
        "skill_ref": "finding-assembly",
        "depends_on": ["t5", "t6", "t7"],
        "priority": "critical",
        "budget": { "max_iterations": 1, "exit_condition": "narrative_complete" }
      }
    ],
    "fan_out_points": [
      {
        "group_id": "comparison_populations",
        "source_task": "t1",
        "branches": ["t2a", "t2b"],
        "join_task": "t3"
      }
    ]
  },

  "metadata": {
    "total_tasks": 9,
    "critical_path_length": 7,
    "fan_out_count": 1,
    "estimated_complexity": "medium",
    "skill_gaps": [],
    "requires_human_review": false
  }
}
```

---

## Skill Registry

The skill registry is a markdown file that the Plan Agent reads to match tasks to available skills. It serves the same role as the Tool Taxonomy in Stage 3 but uses skill references instead of typed tool registrations.

```markdown
# skill-registry.md

## Ingestion Skills
| Skill | Job | Inputs | Outputs |
|-------|-----|--------|---------|
| multi-cloud-data-connector | Connect to Snowflake/BigQuery/Azure, extract data | connection_config | raw_dataset |
| schema-profiling | Detect types, keys, relationships, grain | raw_dataset | profiled_dataset |
| data-quality-assessment | PASS/FAIL quality gate | raw_dataset | quality_report |

## Population Skills
| Skill | Job | Inputs | Outputs |
|-------|-----|--------|---------|
| cohort-builder | Extract population matching CGF criteria | profiled_dataset, scope_criteria | cohort |

## Transformation Skills
| Skill | Job | Inputs | Outputs |
|-------|-----|--------|---------|
| feature-engineering | Derive behavioral/temporal/transactional features | cohort | feature_set |
| metric-computation | Compute scope-defined metrics at required granularity | cohort, feature_set | metric_result |

## Exploration Skills
| Skill | Job | Inputs | Outputs |
|-------|-----|--------|---------|
| eda-comprehensive | Characterize distributions, correlations, anomalies | cohort, feature_set | eda_findings |
| behavioral-profiling | Characterize behavioral patterns across lifecycle | cohort, feature_set | behavioral_profile |
| engagement-state-classification | Assign CGF lifecycle stage per customer | cohort, feature_set | engagement_state |

## Analysis Skills
| Skill | Job | Inputs | Outputs |
|-------|-----|--------|---------|
| statistical-comparison | Compare populations with tests and effect sizes | metric_result[] | comparison_result |
| hypothesis-validation | Test hypotheses with statistical evidence | hypothesis_result, feature_set | hypothesis_result |
| retention-stickiness-analysis | Measure retention dynamics across intervals | cohort, metric_result | interval_result, stickiness_metrics |
| behavior-valuation | Quantify incremental revenue of specific behaviors | behavioral_profile, metric_result | behavior_value |

## Valuation Skills
| Skill | Job | Inputs | Outputs |
|-------|-----|--------|---------|
| roi-computation | Quantify business value with attribution | metric_result, comparison_result | roi_result |

## Synthesis Skills
| Skill | Job | Inputs | Outputs |
|-------|-----|--------|---------|
| finding-assembly | Collect, rank, and validate findings | any analysis output | finding_set |
| narrative-generation | Connect findings into stakeholder-ready story | finding_set | narrative |
```

---

## Agent Coordination

### Handoff Protocol

The two agents coordinate through artifacts, not direct communication. The human mediates every transition.

```
1. User activates scope-agent.md with a business question
2. Scope Agent runs skills, interacts with user, produces scope_artifact.json
3. Scope Agent announces: "Scope complete. Ready for planning."
4. *** Human reviews scope_artifact.json, approves handoff ***
5. User activates plan-agent.md
6. Plan Agent reads scope_artifact.json, runs skills, produces plan_artifact.json
7. Plan Agent announces: "Plan complete. Ready for review."
8. *** Human reviews plan_artifact.json, approves for execution ***
9. Handoff to Phase 2
```

### Permission Boundaries

| Agent | Can Read | Can Write | Cannot Access |
|-------|----------|-----------|---------------|
| scope-agent.md | User input, CGF taxonomy, conversation history | scope_session.json, scope_artifact.json | Data catalog, raw data, skill registry, playbook registry |
| plan-agent.md | scope_artifact.json, CGF taxonomy, skill registry, playbook registry | plan_artifact.json | User conversation, raw data, scope_session.json |

**Rationale:** The Scope Agent has no awareness of data availability or skills — it works purely at the business question level. The Plan Agent has no access to the user conversation — it works purely from the approved scope. This prevents scope drift during planning and planning concerns from contaminating scope definition.

### Failure Handling

| Failure Type | Agent | Response |
|-------------|-------|----------|
| Intent classification low confidence | Scope Agent | Ask user for clarification, do not guess |
| Disambiguation loop exceeds 10 turns | Scope Agent | Surface partial scope, ask user to complete manually |
| Scope Artifact validation fails | Scope Agent | Return to disambiguation with specific missing fields |
| No skill matches a required task | Plan Agent | Flag skill gap in plan metadata, describe what capability is needed |
| Circular dependency detected | Plan Agent | Log the cycle, attempt alternative decomposition, tell user if unresolvable |
| Budget insufficient for critical path | Plan Agent | Warn in plan metadata, suggest scope reduction, do not silently drop tasks |

---

## CGF Alignment

The Customer Growth Framework constrains both agents to customer lifecycle analysis and provides the taxonomy against which intents are classified, scopes are validated, and plans are decomposed.

### CGF as Scope Template

Each CGF lifecycle stage implies a default analytical frame:

| Lifecycle Stage | Default Population | Typical Metrics | Common Patterns |
|----------------|-------------------|-----------------|-----------------|
| New Customer | First purchase within timeframe | Conversion rate, first-order AOV, 30/60/90-day repeat rate | Profile, Compare vs. prior cohorts |
| Low-Engaged | Below engagement threshold | Visit frequency, spend velocity, engagement score | Profile, Explain drivers of low engagement |
| Reactivated | Returned after dormancy | Reactivation rate, post-return retention, spend recovery | Compare vs. continuously active, Predict sustainability |
| Medium-Engaged | Mid-tier engagement | Upgrade probability, wallet share, response to intervention | Segment by growth potential, Predict upgrade likelihood |
| At-Risk | Declining engagement signals | Churn probability, recency decay, intervention response | Predict churn, Explain risk drivers |

### CGF as Plan Template

Each analytical pattern has a standard task decomposition that the Plan Agent uses as a starting point:

**Profile:** Cohort extraction → Metric computation → Distribution characterization → Benchmark comparison (if defined) → Finding synthesis

**Compare:** Cohort extraction [fan-out: both populations] → Metric computation [parallel] → Statistical comparison [join] → Effect size estimation → Finding synthesis

**Explain:** Cohort extraction → Feature engineering → Hypothesis generation → Hypothesis testing [fan-out per hypothesis] → Assessment [join] → Finding synthesis

**Predict:** Cohort extraction → Feature engineering → Target definition → Train/validation split → Model fitting [while-loop: iterate to plateau] → Validation → Interpretation → Finding synthesis

These templates are composable. A scope that combines "compare AND predict" generates a plan that composes both templates with appropriate fan-out and join points.

---

## Success Criteria

Phase 1 (Stage 2) is successful when:

1. **Scope fidelity:** A principal data scientist reviews the scope_artifact.json and confirms it accurately captures the analytical intent of the original business question, with no material ambiguity remaining.

2. **Plan quality:** A principal data scientist reviews the plan_artifact.json (stakeholder view) and would approve it as the project plan — meaning the decomposition is correct, the ordering is right, the fan-out makes sense, and nothing critical is missing.

3. **Plan executability:** The plan_artifact.json (execution view) contains sufficient structure — task nodes, dependencies, skill references, budget allocations — that a human data scientist or Phase 2 agent could follow it and begin work without needing to fill structural gaps.

4. **Isolation integrity:** The Scope Agent and Plan Agent operate independently. No scope decisions leak into planning. No planning concerns influence scope. The scope_artifact.json is the sole interface.

5. **Convergence:** The Scope Agent resolves ambiguity in a reasonable number of turns (target: median 3–5 turns) without frustrating the user or producing an incomplete scope.

6. **Human approval is meaningful:** The human reviews and approves at each transition, and the artifacts contain enough information for the human to make an informed approval decision. The human is never rubber-stamping.

---

## Upgrade Path to Stage 3

Everything built at Stage 2 maps directly to Stage 3 infrastructure:

| Stage 2 (Local Agent) | Stage 3 (Cloud Harness) | Change Required |
|------------------------|------------------------|-----------------|
| scope-agent.md | AgentRegistration for scope_agent | Add typed input/output schemas, retry policy, timeout |
| plan-agent.md | AgentRegistration for plan_agent | Add typed input/output schemas, retry policy, timeout |
| SKILL.md with DSE frontmatter | ToolRegistration with typed interface | Formalize input/output types, add failure mode declarations |
| scope_artifact.json | ScopeArtifact (same schema) | No change — schema is already Stage 3 compatible |
| plan_artifact.json | PlanArtifact with DAG semantics | Add edge types, entry conditions, trace view |
| skill-registry.md | ToolTaxonomy (typed registry) | Formalize into typed data structure |
| Human approves each transition | Human approves scope + plan, harness executes | Remove human from per-step execution, retain at scope/plan gates |
| Sequential execution | DAG execution with fan-out | Harness manages parallelism that was documented but not executed |

The analytical logic doesn't change. The artifacts are upward-compatible. The upgrade is a packaging exercise.

---

## Phase 2 Preview: What This Enables

The plan_artifact.json produced by Phase 1 becomes the execution guide for Phase 2. Phase 2 will introduce:

- **Skill execution agents:** Local agents that follow the plan, running skills in the specified order with human approval at checkpoints.
- **Starter toolkit:** The 16 MVP skills covering data retrieval through delivery.
- **Manifest chain:** Each skill produces a manifest that the next skill consumes, creating a traceable execution record.
- **Skill evolution:** As agents encounter gaps, new skills get built and added to the registry.

At Stage 2, Phase 2 execution is still human-approved at each step. At Stage 3, it becomes harness-orchestrated with human oversight at gates. The plan_artifact.json works for both.
