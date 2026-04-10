# DSE Define Phase — 30/60/90 Day De-Risking Roadmap

## Purpose

This document is the incremental shipping plan for the DSE Define Phase plugin. The [specification](dse-define-phase-spec-local-agent.md) defines *what* the system is. This document defines *how we prove it works, make it real, and make it enterprise-ready* in 90 days — with explicit validation gates that prevent us from building on unproven foundations.

**The core bet:** An AI agent can reliably transform a loosely stated business question into a verifiable, dependency-aware analytical plan — and that plan can drive real analysis against a Snowflake data lake in a HIPAA-regulated enterprise environment.

Each 30-day phase de-risks a specific layer of that bet.

---

## Completed Work (as of 2026-04-10)

The following deliverables have been built and are in the plugin at `dse_specs/dse-define-phase-plugin-ref/`:

### Schemas (WS1 + WS4 — partial)
- [x] `schemas/decision_log.schema.json` — Full decision entry schema with `minItems: 3` on options, pros/cons, rationale, institutional knowledge links (`prior_decisions_referenced`), searchable tags
- [x] `schemas/decision_log_artifact.schema.json` — Wrapper schema for the decision log file with metadata (total_decisions, phases_with_decisions, most_common_tags)
- [x] `schemas/scope_artifact.schema.json` — Full schema replacing stub (intent, definition with population/metric/timeframe/comparison/business_context/constraints, metadata)
- [x] `schemas/plan_artifact.schema.json` — Full schema replacing stub (stakeholder_view, execution_view with tasks/fan_out_points, metadata with skill_gaps/scope_warnings)

### Hooks (WS3 — complete)
- [x] `hooks/hooks.json` — Correct Claude Code format with three PreToolUse hooks
- [x] `hooks/scripts/artifact-guard.sh` — Blocks writes to approved artifacts (checks `approved_at`)
- [x] `hooks/scripts/sql-interceptor.sh` — Logs all Bash commands to `audit/query_log.jsonl`, blocks destructive DDL/DML
- [x] `hooks/scripts/decision-log-gate.sh` — Blocks plan-agent without decision log entries

### Agent Updates (WS4 — complete)
- [x] `agents/scope-agent.md` — Decision logging rules added (when to log, how to log, institutional knowledge surfacing, decision_log.json artifact)
- [x] `agents/plan-agent.md` — Decision log precondition added (3-check gate), planning decision logging rules (playbook selection, task decomposition, budget allocation)
- [x] `commands/dse-status.md` — Updated to display decision log status (count, breakdown by phase, last decision summary)

### Skill Migration
- [x] 26 Analyze Phase skills migrated from `.claude/skills/` to plugin-ref (behavioral-impact-estimation through value-decomposition-analysis)
- [x] Plugin now contains 41 total skill directories + 13 shared references
- [x] `README.md` updated with full plugin documentation, hook reference, recommended permissions

### What Remains for Phase 1
- [ ] CGF taxonomy expansion (WS1 — CVS-specific lifecycle definitions, metric registry)
- [ ] Behavioral insight schema (WS1 — `behavioral-insight-schema.json` with CVS-specific fields)
- [ ] Data connector setup (WS2 — requires Data Engineering partner)
- [ ] End-to-end validation (WS5 — requires real data + CGF content)

---

## What You Need That Doesn't Exist Yet

Before the phase breakdown, here is the honest inventory of what must be built, configured, or partnered on — organized by who owns it.

### You Own (Consumer Insights Team)

| Gap | Why It Matters | Phase |
|-----|---------------|-------|
| **Customer Growth Framework (CGF) codification** | The CGF is the analytical backbone — lifecycle stages, behavioral patterns, metric definitions. It exists as tribal knowledge. It must become a machine-readable taxonomy that grounds every skill. | 0–30 |
| **Behavioral insight schema** | Skills produce typed outputs (metric_result, signal_result, etc.) but the *business semantics* of those outputs for CVS aren't defined. What does a "reactivated" customer mean in ExtraCare terms? What's the canonical retention metric? | 0–30 |
| ~~**Decision artifact & decision log**~~ | ~~No mechanism for capturing analytical decisions.~~ **DONE** — Schema, agent integration, hook enforcement, and `/dse-status` display all implemented. | ~~0–30~~ |
| **Presentation layer with CVS brand standards** | Narrative and visualization skills need CVS color palettes, terminology, chart standards, executive summary templates. | 31–60 |
| **Real data end-to-end validation** | The plugin has never run against actual CVS data. Until it produces a verifiable analysis from a real business question, it's unproven. | 0–30 |
| ~~**PreToolUse hooks (foundation)**~~ | ~~No governance hooks exist.~~ **DONE** — Three PreToolUse hooks implemented (artifact-guard, sql-interceptor, decision-log-gate) in correct Claude Code format with executable scripts. PostToolUse hooks (PHI scanning, cost tracking) remain for Phase 2. | ~~0–30~~ |

### You Need Partners For (Data Engineering, InfoSec, Platform)

| Gap | Owner | Why It Matters | Phase |
|-----|-------|---------------|-------|
| **Snowflake connector configuration** | Data Engineering | The plugin generates SQL. Someone must configure: which warehouse, which role, connection pooling, query timeout policies. | 0–30 |
| **RBAC role mapping** | Data Engineering + InfoSec | The agent must inherit the *user's* Snowflake role, not a shared service account. Role hierarchy must map to data access tiers. | 31–60 |
| **Data catalog integration** | Data Engineering | The agent needs to discover what tables/views exist, their schemas, their business definitions. Without this, skills can't self-navigate a star schema. Options: Snowflake native catalog, Alation, Collibra, or a lightweight registry. | 31–60 |
| **Knowledge layer / semantic layer** | Data Engineering + Analytics Engineering | Business definitions, metric logic, entity relationships, data lineage. Options: dbt semantic layer, Snowflake Cortex, AtScale, or a custom reference doc set. | 31–60 |
| **Secrets management** | Platform / InfoSec | Snowflake credentials must flow through Vault, AWS Secrets Manager, or equivalent. No hardcoded credentials. No `.env` files in repos. | 0–30 |
| **PHI/HIPAA data classification** | InfoSec + Compliance | Which columns contain PHI? Dynamic masking policies in Snowflake. Audit requirements for any system that touches member data. | 31–60 |
| **Network policies** | Platform | Snowflake network policies, VPN requirements, allow-listing for Claude Code sessions. | 31–60 |
| **Claude Enterprise deployment** | Platform / AI Engineering | Claude Enterprise tenant configuration, user provisioning, API key management, usage quotas. | 0–30 |

### What You Didn't Ask About But Must Be True

| Gap | Why | Phase |
|-----|-----|-------|
| **PHI in query results** | CVS data contains member health information. If the agent queries a table with PHI columns, the raw results flow into Claude's context. PostToolUse hooks must scan and redact *before* the agent processes results. This is a legal requirement, not a nice-to-have. | 31–60 |
| **Cost/rate controls** | Each agent session consumes Claude API tokens. At enterprise scale (50+ analysts), uncontrolled usage creates budget risk. Token budgets per session, concurrency limits, and cost dashboards are needed. | 31–60 |
| **Evaluation framework** | How do you know the agent produced the *right* scope or the *right* plan? You need ground-truth test cases where a human expert has independently scoped and planned the same question, and you compare agent output against it. | 0–30 |
| **CI/CD for the plugin** | The plugin will evolve. Skills will be updated. You need: automated skill tests (using dse-skill-tester), version bumps (semver), CHANGELOG generation, and marketplace publishing. | 61–90 |
| **Change management** | Analysts are accustomed to manual analysis. Adopting an agent-assisted workflow requires training, documentation, feedback mechanisms, and a champion network. | 61–90 |
| **Observability** | When an agent session fails or produces bad output, you need to diagnose why. Session logs, skill execution traces, Snowflake query logs, and token usage — all correlated by session ID. | 61–90 |

---

## Phase 1: Day 0–30 — Prove It Works

### Goal

**One vertical slice, fully validated.** Pick one CGF analytical pattern (recommend: `compare` pattern on `reactivated` lifecycle stage), one real Snowflake dataset, and prove the agent can go from business question through scope → plan → analyze → present with verifiable, correct output.

If this phase fails, you've spent 30 days — not 90 — discovering that the architecture doesn't hold.

### Workstreams

#### WS1: CGF Foundation (Week 1–2)

Codify the Customer Growth Framework into machine-readable form.

| Deliverable | Description |
|-------------|-------------|
| `cgf-taxonomy.md` (updated) | Expand existing taxonomy with CVS-specific lifecycle stage definitions, behavioral signals per stage, canonical metrics per stage. Every stage needs: definition, entry criteria, exit criteria, primary metrics, common analytical questions. |
| `cgf-metric-registry.md` | Canonical metric definitions: name, SQL logic, grain, dimensions, source tables. Start with 10–15 metrics that cover the `reactivated` + `compare` pattern. |
| `behavioral-insight-schema.json` | JSON Schema for typed analytical outputs. Define what a `metric_result`, `comparison_result`, `finding_set` look like with CVS-specific fields (e.g., `extracare_card_holder`, `store_format`, `channel`). |
| `decision-log-schema.json` | Schema for decision artifacts. Each entry: decision_id, question, options (min 3), each option with description/pros/cons/estimated_effort, selected_option, rationale, decided_by, timestamp. |

#### WS2: Data Connector — Mock to Real (Week 1–3)

| Deliverable | Description |
|-------------|-------------|
| Snowflake connection config | Work with Data Engineering to configure: warehouse, default role, connection parameters. Document in a `data-connector-config.md`. |
| Secrets integration | Snowflake credentials stored in approved secrets manager. Claude Code session retrieves credentials at runtime — no hardcoded values. |
| Star schema navigator reference | Document the relevant star schema for the vertical slice: fact tables, dimension tables, join paths, grain. This becomes a skill reference that the data-extraction and schema-profiling skills consume. |
| Mock-to-real swap test | Run the same scope → plan flow against (a) synthetic data and (b) real Snowflake data. Compare outputs. Document gaps. |

#### WS3: Core Hooks (Week 2–3) — COMPLETE

> **Status: DONE.** All three hooks implemented in correct Claude Code format. See `hooks/hooks.json` and `hooks/scripts/`.

Build the foundation governance hooks in `hooks/hooks.json`.

| Hook | Type | Behavior | Status |
|------|------|----------|--------|
| **artifact-guard** | `PreToolUse` on `Write\|Edit` | Reads `tool_input.file_path` from stdin JSON. Checks if target `*_artifact.json` file already contains `approved_at`. Blocks with `exit 2` if immutable. | **DONE** |
| **sql-interceptor** | `PreToolUse` on `Bash` | Reads `tool_input.command` from stdin JSON. Logs to `audit/query_log.jsonl`. Blocks destructive DDL/DML (DROP, DELETE, TRUNCATE, ALTER, INSERT, UPDATE, CREATE) with `exit 2`. | **DONE** |
| **decision-log-gate** | `PreToolUse` on `Agent` | Reads agent invocation from stdin JSON. If plan-agent, checks `decision_log.json` exists with ≥1 entry. Blocks with `exit 2` if missing. | **DONE** |

```json
// hooks/hooks.json — Correct Claude Code format
// Key format rules:
//   - Event names (PreToolUse) are top-level keys, NOT items in an array
//   - Matchers are pipe-separated strings ("Write|Edit"), NOT objects
//   - Hook scripts read JSON from stdin (use jq), NOT environment variables
//   - Exit 2 = block, Exit 0 = allow (NOT exit 1)
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.../hooks/scripts/artifact-guard.sh"
          }
        ]
      },
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.../hooks/scripts/sql-interceptor.sh"
          }
        ]
      },
      {
        "matcher": "Agent",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.../hooks/scripts/decision-log-gate.sh"
          }
        ]
      }
    ]
  }
}
```

#### WS4: Decision Log System (Week 2–3) — COMPLETE

> **Status: DONE.** Schema, agent integration, hook enforcement, and status display all implemented.

| Deliverable | Description | Status |
|-------------|-------------|--------|
| `decision_log.json` schema | `schemas/decision_log.schema.json` + `schemas/decision_log_artifact.schema.json` — full JSON Schemas with `minItems: 3` on options, pros/cons, institutional knowledge links. | **DONE** |
| Decision log skill integration | scope-agent.md and plan-agent.md updated with decision logging rules: when to log, how to present options, rationale capture, institutional knowledge surfacing from prior sessions. | **DONE** |
| Decision log viewer | `/dse-status` command updated to display decision count, phase breakdown, last decision summary. | **DONE** |
| Decision log enforcement | `hooks/scripts/decision-log-gate.sh` blocks plan-agent if no decisions logged. | **DONE** |

**Decision Log Entry Schema:**

```json
{
  "decision_id": "uuid",
  "phase": "scope | plan | analyze",
  "context": "What analytical question triggered this decision",
  "timestamp": "ISO-8601",
  "decided_by": "user | agent-recommended",
  "options": [
    {
      "id": "A",
      "description": "Compare reactivated vs. never-lapsed using 90-day retention",
      "pros": ["Standard metric", "Comparable to industry benchmarks"],
      "cons": ["May miss early churn signals"],
      "estimated_effort": "low"
    },
    {
      "id": "B",
      "description": "Compare using 30/60/90 day retention curves",
      "pros": ["Captures trajectory", "Shows when drop-off occurs"],
      "cons": ["Higher complexity", "Requires more data points"],
      "estimated_effort": "medium"
    },
    {
      "id": "C",
      "description": "Compare using value-weighted retention (revenue per retained customer)",
      "pros": ["Directly ties to business value"],
      "cons": ["Requires revenue data join", "Metric definition debate"],
      "estimated_effort": "high"
    }
  ],
  "selected": "B",
  "rationale": "Stakeholder wants to understand when in the journey reactivated customers drop off, not just whether they retain. 30/60/90 curve tells a richer story.",
  "informs_downstream": ["plan_artifact.json — task node T3 uses interval_analysis playbook"]
}
```

**Institutional knowledge feedback loop:** Over time, the accumulated decision log becomes training data for the agent. When a similar question arises (same lifecycle stage + analytical pattern), the agent surfaces prior decisions: "In a similar reactivated/compare analysis last quarter, the team chose 30/60/90 retention curves because [rationale]. Would you like to use the same approach?"

#### WS5: End-to-End Validation (Week 3–4)

| Test | Description | Success Criteria |
|------|-------------|-----------------|
| **Scope accuracy test** | Present 5 real business questions from past analyses. Run scope-agent. Compare scope_artifact.json against what a human expert would have scoped. | ≥4/5 scopes match expert judgment on lifecycle stage, analytical pattern, and required fields. |
| **Plan fidelity test** | Feed the 5 scope artifacts to plan-agent. Compare generated plans against what a human would have planned. | Plans select the correct playbooks, task ordering matches expert expectation, no missing critical tasks. |
| **Data connector test** | Run data-extraction skill against real Snowflake tables. | Query executes, returns data, respects RBAC, audit log captures the query. |
| **Hook enforcement test** | Attempt to overwrite an approved scope. Attempt a DROP TABLE. Attempt to skip decision logging. | All three blocked. Audit log shows the block. |
| **Full vertical slice** | One question → scope → plan → analyze (EDA + one analytical playbook) → present. | End-to-end completion with human reviewing output at each gate. Output is factually verifiable against the data. |

### Validation Gate — Exit Day 30

You may NOT proceed to Phase 2 unless ALL of the following are true:

- [ ] CGF taxonomy codified with ≥1 lifecycle stage fully defined (definitions, metrics, entry/exit criteria)
- [ ] Behavioral insight schema defined for ≥3 output types (metric_result, comparison_result, finding_set)
- [x] Decision log schema implemented and integrated into scope-agent flow *(done: schemas, agent rules, hook enforcement, status display)*
- [ ] Snowflake connection works with user-role credentials (not service account)
- [x] PreToolUse hooks operational: SQL interception, artifact immutability, decision log gate *(done: 3 hooks in correct Claude Code format with executable scripts)*
- [x] Scope and plan artifact schemas fully defined *(done: replaced stubs with complete JSON Schemas)*
- [x] All 41 skills consolidated in plugin directory *(done: 26 Analyze Phase skills migrated)*
- [ ] ≥1 full vertical slice completed: question → scope → plan → analyze → present against real data
- [ ] Scope accuracy: ≥4/5 expert-judged test cases pass
- [ ] All queries logged to audit trail

### Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Data Engineering team unavailable for Snowflake connector | Blocks all real data tests | Start with read-only access to a sandbox schema. Escalate to leadership if blocked >1 week. |
| CGF definitions contested by stakeholders | Delays taxonomy codification | Start with one stage (reactivated) and get sign-off. Don't try to codify all 8 stages in Day 0–30. |
| Claude Enterprise tenant not provisioned | Blocks everything | This is a Day 0 dependency. If not available, the entire timeline shifts. Escalate immediately. |
| Agent produces incorrect scopes | Undermines the core bet | This is what the validation tests are for. If <3/5 pass, the skill prompts need rework before proceeding. |

---

## Phase 2: Day 31–60 — Make It Real

### Goal

**Expand from one vertical slice to full CGF coverage, with compliance hooks and real analyst validation.** Phase 1 proved the architecture works for one pattern. Phase 2 proves it works for the full analytical surface area, with the governance layers that enterprise requires.

### Workstreams

#### WS6: Full CGF Codification (Week 5–6)

| Deliverable | Description |
|-------------|-------------|
| All 8 lifecycle stages defined | acquisition, new_customer, low_engaged, medium_engaged, high_engaged, reactivated, at_risk, lapsed — each with: definition, entry/exit criteria, canonical metrics, common questions, behavioral signals. |
| All 5 analytical patterns documented | profile, compare, predict, explain, segment — each with: required scope fields, typical playbook selections, example questions, expected output types. |
| CGF cross-reference matrix | Stage x Pattern matrix showing which combinations are valid, which are common, and which require special handling. |

#### WS7: Knowledge Layer (Week 5–7)

Decide build vs. connect. Two options:

**Option A — Lightweight (recommended for Day 31–60):**
Build a `knowledge/` directory in the plugin with curated reference docs:
- `semantic-definitions.md` — business term → SQL column mapping
- `entity-relationships.md` — how customers, transactions, stores, products relate in the star schema
- `data-lineage.md` — source system → staging → mart lineage for key tables
- `metric-logic.md` — canonical metric SQL with dimensional breakdowns

**Option B — Integrated (target for Day 61–90):**
Connect to enterprise semantic layer (dbt, Snowflake Cortex, AtScale, Collibra). Agent queries the semantic layer API at runtime instead of reading static docs.

**Decision required:** This is itself a decision log entry. Document pros/cons of both, choose for Phase 2, plan integration for Phase 3.

#### WS8: Compliance Hooks (Week 5–7)

| Hook | Type | Behavior |
|------|------|----------|
| **phi-scanner** | `PostToolUse` | Fires after any tool call that returns data (Bash, Read). Scans output for PHI patterns: SSN (XXX-XX-XXXX), member IDs (configurable regex), DOB, email, phone, address. On match: redact the values in the result, log the detection event, optionally halt and warn the user. |
| **cost-tracker** | `PostToolUse` | Fires after every tool call. Logs estimated token usage to `audit/token_usage.jsonl`. Warns at 80% of session budget. Hard-stops at 100%. Session budget configured in plugin settings. |
| **rbac-enforcer** | `PreToolUse` | Fires before Snowflake queries. Extracts target schema/table from the SQL. Checks against a role-permission mapping. Blocks queries to schemas the user's role doesn't permit. |
| **schema-validator** | `PreToolUse` | Fires before any write to artifact files. Validates the JSON content against the corresponding schema in `schemas/`. Blocks malformed artifacts. |

#### WS9: Presentation Layer — CVS Brand Standards (Week 6–8)

| Deliverable | Description |
|-------------|-------------|
| `references/cvs-brand-guide.md` | Color palette (CVS red, grays, accent colors), typography standards, chart style guidelines, executive summary template structure. |
| narrative-generation skill update | Integrate brand vocabulary, approved terminology, stakeholder-appropriate language tiers (executive summary vs. technical appendix). |
| Visualization templates | Standard chart configurations for the most common output types: retention curves, comparison bar charts, segment profiles, trend lines. |

#### WS10: Command Playbooks (Week 7–8)

| Deliverable | Description |
|-------------|-------------|
| `/playbook` command | New command in `commands/playbook.md`. Syntax: `/playbook {name}`. Requires `scope_artifact.json` to exist. Reads the selected PLAYBOOK.md, parameterizes from scope, generates a focused plan_artifact.json. |
| Playbook parameter validation | Each PLAYBOOK.md updated with explicit parameter requirements. The `/playbook` command validates scope_artifact has the required fields before instantiation. |
| Playbook composition | Support for multi-playbook plans: `/playbook eda + outcome-roi` composes two playbooks with dependency resolution. |

#### WS11: Expanded Validation & UAT (Week 7–8)

| Test | Description | Success Criteria |
|------|-------------|-----------------|
| **All-pattern coverage** | Run scope-agent with questions covering all 5 analytical patterns x ≥3 lifecycle stages. | Correct classification in ≥80% of cases. |
| **Playbook selection accuracy** | Verify plan-agent selects the correct playbook(s) for each scope pattern. | 100% correct on the standard cases (some edge cases acceptable). |
| **PHI hook test** | Deliberately query a table with PHI columns. | Hook detects, redacts, and logs. No PHI reaches the agent's context. |
| **RBAC enforcement test** | User with restricted role attempts to query a privileged schema. | Query blocked. Audit log shows the block with user and attempted schema. |
| **Real analyst UAT** | 3–5 analysts (not the builder) use the plugin for a real business question they care about. | Analysts can complete a scope + plan workflow. Collect feedback on: accuracy, usability, friction points, missing features. |

### Validation Gate — Exit Day 60

- [ ] All 8 CGF lifecycle stages codified and reviewed by subject matter experts
- [ ] Knowledge layer (Option A or B) operational — agent can resolve business terms to SQL
- [ ] PHI scanning hook operational and tested against known PHI patterns
- [ ] RBAC enforcement hook operational with ≥2 role tiers tested
- [ ] Cost tracking hook logging token usage per session
- [ ] CVS brand standards integrated into narrative-generation skill
- [ ] `/playbook` command operational for ≥3 playbooks
- [ ] ≥3 analysts completed UAT with documented feedback
- [ ] Decision log has ≥10 entries from real analytical sessions
- [ ] All compliance hooks have automated test cases

### Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Knowledge layer is a rabbit hole | Delays everything by trying to build a full semantic layer | Timebox to Option A (static reference docs). Defer API integration to Phase 3. |
| PHI patterns are complex and evolving | False positives disrupt workflow; false negatives create compliance exposure | Start with high-confidence patterns (SSN, member ID format). Maintain a false-positive log. Tune iteratively. |
| Analysts reject the workflow | Product doesn't meet user needs | UAT is in this phase, not Phase 3, specifically so you can course-correct. Treat analyst feedback as blocking. |
| RBAC mapping is complex | Many roles, many schemas, hard to maintain | Start with 2–3 roles that cover 80% of analysts. Build a role-mapping config file, not hardcoded logic. |

---

## Phase 3: Day 61–90 — Make It Enterprise

### Goal

**Production-grade governance, automated quality, cross-team distribution.** Phase 2 proved the plugin works for real analysts. Phase 3 makes it sustainable: auditable, testable, distributable, and self-improving.

### Workstreams

#### WS12: Full Audit Trail (Week 9–10)

| Deliverable | Description |
|-------------|-------------|
| Unified audit log | Every tool call logged with: `user_id`, `session_id`, `timestamp`, `tool_name`, `input_summary`, `result_hash`, `duration_ms`, `token_estimate`. Format: JSONL appended to `audit/session_{id}.jsonl`. |
| Audit log shipper | Script or hook that ships audit logs to enterprise log aggregator (Splunk, DataDog, CloudWatch — whatever CVS uses). |
| Audit dashboard | Summary view: sessions per day, queries per session, tokens consumed, hook blocks triggered, PHI detection events. |
| Retention policy | Audit logs retained for N days per compliance requirements. Automated cleanup. |

#### WS13: Hook Testing Framework (Week 9–10)

| Deliverable | Description |
|-------------|-------------|
| Hook test harness | Automated tests for each hook: provide a mock tool call, verify the hook produces the expected response (allow/block/warn). |
| Hook regression suite | Run on every plugin version bump. Prevents regressions in governance enforcement. |
| Hook configuration docs | Guide for other teams building plugins: how to define hooks, recommended patterns, testing approach. Added to the enterprise plugin standard. |

#### WS14: CI/CD & Marketplace (Week 10–11)

| Deliverable | Description |
|-------------|-------------|
| Plugin test suite | `dse-skill-tester` runs against all 8 Define Phase skills + all hooks. Pass/fail gate for releases. |
| Semantic versioning | `CHANGELOG.md` maintained. Version bumps follow semver. Breaking changes in major versions only. |
| Marketplace listing | `marketplace.json` updated. Plugin published to `cvs-enterprise-plugins` repo. Installation tested on a clean machine. |
| Release process doc | How to cut a release: run tests → bump version → update changelog → publish to marketplace. |

#### WS15: Institutional Knowledge & Self-Improvement (Week 10–12)

| Deliverable | Description |
|-------------|-------------|
| Decision log analytics | Aggregate decision logs across sessions. Identify: most common decisions, patterns in stakeholder preferences, frequently rejected options. |
| Agent learning integration | When decision log shows a consistent pattern (same decision made 3+ times for similar scopes), the agent surfaces this as a recommendation: "Based on 4 prior analyses with this pattern, the team typically chooses [X]. Would you like to use this approach?" |
| Feedback capture hook | After each session, prompt user for 1–5 rating and optional comment. Store in `feedback/session_{id}.json`. |
| Quarterly review process | Documented process: review decision logs, feedback, audit data. Update CGF taxonomy, skill prompts, and playbook triggers based on findings. |

#### WS16: Cross-Team Onboarding (Week 11–12)

| Deliverable | Description |
|-------------|-------------|
| Installation guide | Step-by-step: prerequisites, marketplace setup, first run, troubleshooting. |
| Analyst training deck | 30-minute walkthrough: what the plugin does, how to use `/scope` and `/plan`, how decisions are logged, what to do when the agent is wrong. |
| Champion network | Identify 1–2 analysts per team who will be early adopters and local support. |
| Feedback channel | Slack channel or Teams channel for plugin users to report issues, share tips, request features. |

#### WS17: Playbook Maturity (Week 11–12)

| Deliverable | Description |
|-------------|-------------|
| Standalone playbook evaluation | Based on UAT feedback from Phase 2, decide whether to add `--no-scope` mode. If yes: implement with auto-generated minimal scope record for audit trail. |
| Playbook coverage report | Which CGF stage x pattern combinations have playbook coverage? Where are gaps? Prioritize Phase 4 playbook development. |
| Playbook performance metrics | For each playbook: average execution time, average token cost, analyst satisfaction score. Use to prioritize optimization. |

### Validation Gate — Exit Day 90

- [ ] Full audit trail operational and shipping to enterprise log aggregator
- [ ] All hooks have automated regression tests — passing on current version
- [ ] Plugin listed in enterprise marketplace and installable by any Claude Enterprise user
- [ ] ≥10 analysts across ≥2 teams have used the plugin for real work
- [ ] Decision log contains ≥25 entries with institutional knowledge patterns identified
- [ ] CI/CD pipeline: code change → tests → version bump → marketplace publish — fully automated
- [ ] Analyst satisfaction: ≥3.5/5 average rating from feedback captures
- [ ] Zero unresolved PHI exposure incidents
- [ ] Hook configuration documentation reviewed and approved for enterprise plugin standard
- [ ] Quarterly review process documented and first review scheduled

### Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Cross-team adoption is slow | Plugin doesn't get enough usage to validate enterprise readiness | Focus on 2 teams, not all teams. Quality of adoption > breadth. |
| Audit log volume overwhelms storage | Cost and performance issues | Structured JSONL with configurable verbosity levels. Log summaries, not full query results. |
| Institutional knowledge creates bias | Agent over-indexes on past decisions, suppressing novel approaches | Recommendations are surfaced as suggestions, never auto-applied. Decision log entries always require ≥3 new options. |
| Plugin versioning breaks existing workflows | Users on older versions break when skills change | Semver strictly enforced. Breaking changes only in major versions. Migration guides for major bumps. |

---

## Enterprise Infrastructure Requirements

> **"What needs to be true for these tools to function with a Snowflake data lake, star schema, enterprise compliance, and RBAC?"**

### Snowflake Configuration

| Requirement | Detail | Owner | Phase |
|-------------|--------|-------|-------|
| **Dedicated warehouse** | A Snowflake virtual warehouse sized for interactive queries (X-Small or Small). Auto-suspend enabled. Separate from ETL workloads. | Data Engineering | 0–30 |
| **Read-only role** | A Snowflake role with `SELECT` on analytical schemas, no DDL/DML. This is the default agent role. | Data Engineering | 0–30 |
| **Role hierarchy** | At least 2 tiers: `DSE_ANALYST` (standard schemas) and `DSE_ANALYST_PHI` (schemas with member-level data, requires additional access approval). | Data Engineering + InfoSec | 31–60 |
| **Dynamic data masking** | Snowflake masking policies on PHI columns (SSN, DOB, address, etc.). The `DSE_ANALYST` role sees masked values. `DSE_ANALYST_PHI` sees unmasked with audit. | Data Engineering + InfoSec | 31–60 |
| **Network policy** | Snowflake network policy that allows connections from Claude Code's execution environment. May require IP allow-listing or private link configuration. | Platform | 31–60 |
| **Query tagging** | All queries from Claude Code tagged with `application=dse_plugin`, `user={analyst_id}`, `session={session_id}` via Snowflake session parameters. Enables query attribution in Snowflake query history. | Data Engineering | 0–30 |
| **Resource monitor** | Snowflake resource monitor on the DSE warehouse with credit limits per day/week. Prevents runaway queries from consuming credits. | Data Engineering | 31–60 |

### Star Schema Navigation

| Requirement | Detail |
|-------------|--------|
| **Schema documentation** | For each analytical schema: fact tables (grain, measures), dimension tables (attributes, hierarchies), join paths (keys, cardinality). Published as a reference doc or accessible via data catalog API. |
| **Naming conventions** | Consistent table/column naming that the agent can reason about. If naming is inconsistent, a mapping layer is needed. |
| **Common join patterns** | Documented: "To get customer transactions with demographics, join `fact_transactions` to `dim_customer` on `customer_key`." The agent needs these patterns as reference context. |
| **Grain awareness** | The agent must know the grain of each fact table to avoid inadvertent fan-out. This is a skill-level concern — data-extraction and schema-profiling skills must check grain before joining. |

### Security & Compliance

| Requirement | Detail | Owner | Phase |
|-------------|--------|-------|-------|
| **Credential management** | Snowflake username/password or key-pair authentication. Credentials stored in enterprise secrets manager (Vault, AWS Secrets Manager). Retrieved at session start, never persisted. | InfoSec + Platform | 0–30 |
| **Session-level auth** | Each Claude Code session authenticates as the individual analyst. No shared service accounts for analytical queries. | Platform | 0–30 |
| **PHI access audit** | Every query against PHI-containing tables logged with analyst identity. Reviewable by compliance team. | InfoSec | 31–60 |
| **Data retention** | Query results in Claude's context are ephemeral (session-scoped). Artifacts written to project directory follow project retention policies. Audit logs follow compliance retention requirements. | InfoSec + Compliance | 61–90 |
| **Incident response** | Documented procedure: if PHI is detected in agent output, how is it reported? Who is notified? What is the remediation process? | InfoSec + Compliance | 61–90 |

### Claude Enterprise

| Requirement | Detail | Owner | Phase |
|-------------|--------|-------|-------|
| **Tenant provisioned** | Claude Enterprise tenant active with user provisioning via SSO/SAML. | AI Engineering | 0–30 |
| **Plugin support** | Claude Enterprise supports plugin installation from enterprise marketplace. | AI Engineering | 0–30 |
| **Usage quotas** | Per-user or per-team token budgets configurable at the tenant level. | AI Engineering | 31–60 |
| **Data residency** | Confirm that Claude API data handling meets CVS data residency and processing requirements. | Legal + AI Engineering | 0–30 |

---

## Dependency Timeline

```
Week:  1    2    3    4    5    6    7    8    9    10   11   12
       ├────────────────────┤────────────────────┤────────────────────┤
       Phase 1: Prove It     Phase 2: Make It     Phase 3: Enterprise
                              Real

CGF    ██████████                                     
       codify 1 stage        ████████████████████
                              codify all 8 stages

Data   ░░░░██████████                              
       connector setup       ████████████                              
                              RBAC + catalog       

Hooks  ░░░░░░██████████      ████████████████████  ████████████████████
       foundation hooks       compliance hooks      audit + testing

Know-                        ████████████████████  ░░░░░░████████████
ledge                         static reference       API integration
                              docs (Option A)        eval (Option B)

Brand                        ░░░░░░░░████████████                     
                              CVS standards          

Valid- ░░░░░░░░░░██████████  ░░░░░░░░░░██████████                     
ation  vertical slice         UAT with analysts    

Decis- ░░░░░░██████████████  accumulation →→→→→→→  ████████████████████
ion    schema + integration                         analytics + learning
Log

CI/CD                                              ████████████████████
                                                    pipeline + marketplace

Onbrd                                              ░░░░░░████████████
                                                    training + rollout

██ = active build    ░░ = dependency wait / partner coordination
```

---

## Decision Log for This Roadmap

This roadmap itself should be the first entry in the project's decision log. Key decisions to document:

| Decision | Options to Evaluate |
|----------|-------------------|
| Which CGF stage for the vertical slice? | reactivated (recommended), at_risk, new_customer |
| Which analytical pattern for the vertical slice? | compare (recommended), profile, explain |
| Knowledge layer: build vs. connect? | Option A: static reference docs (recommended for Phase 2), Option B: API integration (Phase 3) |
| PHI handling: redact-and-continue vs. halt? | Redact-and-continue (recommended), halt-and-warn, configurable per sensitivity level |
| Playbook invocation: embedded-only vs. command playbooks? | Embedded Phase 1, Command Phase 2 (recommended), Standalone Phase 3 (evaluate) |
| Audit log destination? | Local JSONL (Phase 1), enterprise log aggregator (Phase 3) — need to decide which: Splunk, DataDog, CloudWatch |

Each of these should be logged as a formal decision artifact using the decision log schema before implementation begins.

---

## Success Metrics

| Metric | Day 30 Target | Day 60 Target | Day 90 Target |
|--------|--------------|--------------|--------------|
| Scope accuracy (vs. expert) | ≥80% (4/5) | ≥85% (17/20) | ≥90% |
| Plan playbook selection accuracy | ≥80% | ≥90% | ≥95% |
| Analysts actively using plugin | 1 (you) | 3–5 (UAT group) | ≥10 across ≥2 teams |
| Decision log entries | ≥5 | ≥15 | ≥25 |
| Hook coverage (% of risk vectors) | 3 core hooks | 7 hooks (+ compliance) | All hooks + regression tests |
| Mean time to scope (minutes) | Baseline established | 20% faster than manual | 30% faster than manual |
| PHI exposure incidents | N/A (no PHI access) | 0 | 0 |
| Plugin versions released | v0.1.0 | v0.5.0 | v1.0.0 |
