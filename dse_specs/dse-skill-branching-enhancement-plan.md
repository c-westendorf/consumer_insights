# Warm-Path Skill Branching — Feature Enhancement Plan

**Status:** Draft
**Scope:** Consumer Intelligence Plugin — Phase 0 (Define phase, Stage 2 Local Agent)
**Companion doc:** `dse-skill-branching-gap-analysis.md` (gap analysis and direction decision)
**References:** `dse-define-phase-spec-local-agent.md` (plugin vision), `dse-task-registry.md` (typed task model)

---

## 1. Context

The gap analysis established that Phase 0 treats the slash command as the only entry point to the governed analysis cycle. Warm follow-ups — refinements, extensions, decompositions of a just-delivered result — fall outside the cycle and pay the full cold-start clarification tax. The recommended direction is **Option C: skill-side context detection with a one-turn confirmation**, which keeps the host conversation as the session surface and places branching intelligence in the plugin's skills and agents.

This enhancement plan describes the work required to implement Option C inside the existing Phase 0 architecture without breaking the guarantees it currently provides: strict agent isolation, artifact immutability, human-in-the-loop approval at every transition, and artifact-only inter-agent communication.

## 2. Alignment with vision

The plugin vision defines a two-agent system (scope-agent, plan-agent) that communicates exclusively through artifacts written to the user's project directory. The vision already includes a transient `scope_session.json` file owned by the scope-agent as conversation state that persists across turns within a single scoping interaction.

**Three vision-level constraints this plan preserves absolutely:**

1. **Agent isolation.** The scope-agent cannot read plan artifacts; the plan-agent cannot read scope session state. Branching does not relax this boundary — each agent discovers prior work only through artifacts it is already permitted to read.
2. **Artifact immutability.** Approved artifacts are never mutated. Every branch produces a new artifact with a lineage reference to its parent. Governance gates that enforce immutability remain in force.
3. **Human-in-the-loop at every transition.** Branching introduces new transitions; each one gains an explicit approval checkpoint. The plan never adds implicit state changes.

**Two vision-level elements this plan extends:**

1. **`scope_session.json`** already exists as transient scope-agent state. It is the natural home for lineage tracking *within* a session, because extending it neither creates a new artifact type nor crosses any agent boundary.
2. **The playbook instantiation model** from the task registry already supports parameterized composition. Branching is a new parameterization mode — one that reads a prior playbook instantiation and produces a related-but-distinct subgraph — not a new layer in the hierarchy.

The rest is additive: a small number of new skills, targeted updates to the two existing agents, and a handful of hook refinements to match.

## 3. Goals and non-goals

**Goals**

- Warm follow-ups enter the governed cycle through the same slash commands as cold questions, but with a branch affordance that skips redundant clarification.
- The plugin can distinguish four branch types (refine / extend / decompose / new) and behave appropriately for each.
- Every branch is traceable to its parent artifact through a lineage reference, and every lineage chain is reconstructable from the project directory alone.
- The audit trail and decision log remain coherent across warm paths: a governance reviewer can see not just each decision but how decisions relate to one another across a thread.

**Non-goals**

- **No plugin-side session store.** We do not build durable cross-session memory. The host conversation remains the session boundary.
- **No automatic branching.** The plugin proposes; the user confirms. Silent classification is out of scope.
- **No new slash commands.** The existing command surface (`/scope`, `/plan`, `/dse-status`) does not grow.
- **No changes to Phase 2 execution semantics.** Branching is a Define-phase concern. Phase 2 consumes plans identically regardless of whether they are cold-authored or branched.
- **No cross-user branching.** Multi-user Cowork branching is deferred to a later phase and tracked as an open question.

## 4. Approach summary

Skill-side context detection means: when an agent activates, it inspects what already exists in the project directory and, if it finds recent related artifacts, offers a branch affordance before falling through to cold behavior. The user's single confirming turn chooses the branch type; the agent proceeds under the governance rules that already exist for that type.

The approach has three moving parts:

1. **Lineage** — the data model that connects a branched artifact to its parent.
2. **Detection** — the agent behavior that finds prior artifacts and decides when to offer a branch.
3. **Branch execution** — the skill behavior that turns a confirmed branch into a new (or amended) artifact without reopening settled questions.

All three exist inside the Define-phase plugin. None requires changes to the host conversation, the plugin distribution mechanism, or the Phase 2 contract.

## 5. Work streams

Six work streams, sized for parallel design but sequential implementation where noted. Each stream describes what changes, why it is necessary, and what it depends on — without prescribing schemas, file contents, or code.

### Stream 1 — Lineage model (foundation)

Extend the existing transient session artifact owned by the scope-agent so that it records an ordered history of branches within a session, and extend the durable scope and plan artifacts so that each one carries a reference to its parent (if any) and a branch type classification.

**Why this is the foundation:** every other stream depends on the ability to point from a new artifact back to a prior one. Without lineage, "branch" is indistinguishable from "duplicate."

**What needs to be true when this stream lands:**

- A governance reviewer looking at any artifact can follow the lineage chain to the original cold-entry scope that started the thread.
- The transient session file captures the in-session branch graph; the durable artifacts capture the cross-artifact relationships.
- Lineage is additive — it does not change how existing cold-entry artifacts are written or interpreted.

**Depends on:** nothing. This is the first work.

### Stream 2 — Branch taxonomy specification

Define the four branch types (refine / extend / decompose / new) precisely enough that a skill can classify a follow-up against them and a human can validate the classification. The specification must cover: what each type preserves from the parent, what each type is permitted to change, which agent owns the branch, and what artifact each type produces.

**Why this is separate:** the taxonomy is a shared-reference concern, used by both agents and by the decision-log amendment logic. Designing it once and writing it down prevents drift.

**What needs to be true:**

- Every follow-up the plugin encounters can be classified under exactly one branch type (with "new" as the fallback).
- The specification is concrete enough that two reviewers reading the same follow-up would agree on its type.
- The taxonomy lives in the plugin's shared-reference directory and is readable by both agents.

**Depends on:** Stream 1 (lineage model shapes what "preserves from parent" means).

### Stream 3 — Scope-agent entry behavior

Modify the scope-agent so that on invocation it reads the session file and recent scope artifacts from the project directory, classifies whether the incoming request is a warm follow-up, and — if so — offers a branch affordance to the user before entering the cold clarification loop.

**Why this is where detection lives:** the scope-agent owns the session file. It is the only agent that can see the full in-session branch graph, and it is the agent the user reaches first through `/scope`.

**What needs to be true:**

- If no prior scope exists in the project directory, behavior is identical to today.
- If a prior scope exists and the agent classifies the request as warm, the agent asks a single question naming the parent scope and proposing a branch type.
- On user confirmation, the agent takes the branch path; on rejection, it falls through to cold clarification.
- The classification logic is auditable — the agent records what it saw and why it proposed what it proposed.

**Depends on:** Streams 1 and 2.

### Stream 4 — Plan-agent entry behavior and plan extension

Modify the plan-agent so that when invoked against a scope artifact that carries a lineage reference, it reads the parent plan artifact and produces an *extended* plan rather than a fresh one. Extension reuses the playbook instantiations from the parent where valid and appends new task nodes where the branch requires them.

**Why this is a separate stream:** the plan-agent is isolated from the scope session by design. Its only input is the scope artifact, which means lineage has to propagate through the scope artifact itself — the plan-agent never touches the session file. This stream is also where the task registry interaction lives: plan extension is a new mode of playbook composition, not a new playbook.

**What needs to be true:**

- When a scope artifact has no lineage reference, the plan-agent behaves exactly as today.
- When a scope artifact has a lineage reference, the plan-agent reads the parent plan and produces a plan that declares which parent task nodes it reuses and which are new.
- Plan extension respects the existing composition rules from the task registry — no invalid wirings, no duplicate work, no broken dependencies.
- The human approval checkpoint for the plan remains in place and the approval surface clearly distinguishes extended plans from cold plans.

**Depends on:** Streams 1, 2, and the task registry's composition rules (no changes expected to the registry itself).

### Stream 5 — Decision-log amendment semantics

The decision log currently treats every entry as a net-new decision. Branching introduces the concept of *amendments* — entries that modify or extend a prior decision rather than establishing a new one. This stream specifies what an amendment is, how it is recorded, and how governance gates (particularly the decision-log-gate hook) interpret amendments versus new entries.

**Why this is a separate stream:** amendment semantics touch both the artifact schema and the hook that enforces decision-log presence before plan-agent activation. Getting the semantics wrong either blocks valid branches or allows unloggable ones.

**What needs to be true:**

- An amendment is visibly different from a new decision in the log and references the decision it amends.
- The decision-log-gate accepts a session with amendments as satisfying its "at least one logged decision" requirement, provided the amended decision is still present in the chain.
- The decision log as a whole remains immutable-append-only — amendments are new entries, not mutations of existing ones.

**Depends on:** Stream 1 (lineage), Stream 2 (branch taxonomy — some branch types require amendments, others require new decisions).

### Stream 6 — Hook updates

Two existing hooks need targeted updates:

- **artifact-guard** currently blocks writes to approved artifacts. It must continue to do so, but must distinguish a branch (new artifact with a parent reference) from an attempted mutation (write to the same path as an approved artifact). The governance rule is unchanged — immutability still holds — but the enforcement needs to read lineage to recognize branches as legitimate.
- **decision-log-gate** needs the amendment-awareness from Stream 5 so that branches which produce amendments rather than fresh decisions still pass the gate.

A third hook may need refinement depending on how Stream 3's entry behavior interacts with the strategic-compact suggestions during long warm-path sessions, but this is minor and can be evaluated after Stream 3 lands.

**What needs to be true:**

- No existing Phase 0 cold-entry behavior regresses. Every hook still blocks what it blocks today, for the same reasons.
- Branches pass hook enforcement cleanly when they are legitimate and fail cleanly when they are not.
- Hook failure messages are specific enough that a user can tell whether their request was rejected for a governance reason or a branching-classification reason.

**Depends on:** Streams 1, 2, and 5.

## 6. Sequencing

The six streams form a dependency graph that collapses to three waves:

**Wave 1 — Foundation.** Stream 1 (lineage model) and Stream 2 (branch taxonomy). Both are design work with minimal implementation; they can run in parallel and must land before any runtime behavior changes.

**Wave 2 — Agent behavior.** Stream 3 (scope-agent entry) and Stream 4 (plan-agent entry + plan extension). These are the bulk of the implementation work. They can run in parallel once Wave 1 is stable, and they can be tested independently against the two agents.

**Wave 3 — Governance alignment.** Stream 5 (decision-log amendments) and Stream 6 (hook updates). These land after Wave 2 and close the governance gap — without them, Wave 2 works but produces audit trails that governance cannot interpret correctly.

The plan is explicitly not one-wave-at-a-time release. Each wave should be testable and reviewable on its own, with the full feature behind a feature flag until Wave 3 closes the loop.

## 7. Acceptance criteria

The enhancement is complete when all of the following are true:

- A user can ask a cold question, get a delivered result, and ask a follow-up in the same conversation without restating prior context, and the plugin answers the follow-up through the governed cycle (not by recalling prior narrative).
- Every warm follow-up produces a lineage-linked artifact chain visible in the project directory, traceable from any branch back to its cold entry.
- A governance reviewer reading the decision log of a warm-path session can tell what was decided new, what was amended, and in what order.
- Cold-entry behavior for a question with no prior artifacts in the project directory is identical to today's Phase 0 behavior — no regression, no new prompts, no added friction.
- The two hooks affected (artifact-guard, decision-log-gate) reject the same illegitimate writes they reject today and accept the legitimate branches introduced by this feature.
- The plan-agent still cannot read the scope session file; the scope-agent still cannot read plan artifacts. Agent isolation is unchanged.
- The playbook registry and task registry do not require new entries — branching is new parameterization of existing playbooks, not new playbooks.

## 8. Risks and mitigations

**Risk: the branch-type classifier is unreliable and cries wolf.**
The scope-agent proposes branches that the user rejects more often than they accept, adding friction instead of removing it. Mitigation: the classifier starts conservative (only propose branches when the prior artifact is obviously related) and loosens based on observed acceptance rates. Start with high precision, not high recall.

**Risk: lineage introduces a hidden second source of truth.**
If the transient session file and the durable artifacts disagree about lineage, governance becomes ambiguous. Mitigation: the durable artifacts are authoritative. The session file is a cache and a discovery aid; if the two disagree, the durable artifact wins and the session file is rebuilt.

**Risk: plan extension violates task registry composition rules.**
A plan-extension mode that reuses parent task nodes could wire them into configurations the task registry's composition rules forbid. Mitigation: plan extension must re-run the same validation the cold plan path runs. No shortcuts. If the extended plan fails validation, the plan-agent falls back to cold plan generation.

**Risk: amendment semantics in the decision log are subtly wrong.**
If an amendment is silently accepted as a new decision, governance reviewers will not see that a prior decision changed. If a new decision is silently classified as an amendment, the log loses resolution. Mitigation: amendment classification is explicit and reviewed at approval time, not inferred from context alone.

**Risk: the user confirms a branch type that turns out to be wrong.**
The user accepts a "refine" proposal when they actually meant "fork." Mitigation: every branch type is reversible at the approval checkpoint — the user can back out before artifacts are written. Once artifacts are written, the user runs a new cold `/scope`, which is always available.

**Risk: feature creep.**
The work required to make branching feel natural invites adjacent scope ("while we're in here, let's also..."). Mitigation: the acceptance criteria in §7 are the stop line. Anything not in that list is deferred to a follow-up initiative.

## 9. Open questions

- **Conservative vs. aggressive branch detection.** Where should the default posture sit, and what observable signal moves it?
- **Reversibility after artifact write.** Is there a "back out of the last branch" affordance, or does the user always recover by starting a new cold entry?
- **Multi-user Cowork threads.** If two users share a Cowork session, whose context does the scope-agent read? Whose decisions does the amendment log reflect?
- **Interaction with strategic-compact.** If a warm path runs long enough to trigger strategic-compact, what survives the compaction — the lineage references, the narrative summary, or both?
- **Playbook parameterization for extension mode.** Do any existing playbooks have instantiation parameters that conflict with plan extension (for example, playbooks that assume a clean cohort)? This needs a walk-through before Wave 2 begins.
- **Test scaffolding.** Branching behavior is hard to unit-test. Do we need a new scenario-based test format that captures full warm-path flows, or can existing skill tests be extended?

## 10. Out of scope (explicit)

The following are related but deliberately excluded from this enhancement:

- Plugin-side durable session storage (Option E from the gap analysis).
- New warm-path slash commands (Option B from the gap analysis).
- Silent agent-side branching without user confirmation (Option D from the gap analysis).
- Changes to the Phase 2 execution contract or the task registry's data-type definitions.
- Changes to the CGF taxonomy or the scope artifact's top-level structure beyond adding the lineage reference.
- Proactive briefing behavior, scheduled intelligence, or pre-scoped user memory — these are Phase 1 and Phase 3 concerns and share no implementation with this enhancement.

## 11. Next steps

1. Review this plan and the gap analysis together; converge on whether the wave structure and the non-goals list are correct.
2. Pick Wave 1 owners and set a deadline for the lineage model and branch taxonomy specifications.
3. Stand up the feature flag that Wave 2 will develop behind.
4. Schedule a design walk-through of the existing playbook templates to surface any that resist plan extension — the output of that walk-through is an input to Stream 4.
5. Revisit the open questions in §9 before Wave 2 begins; any that remain unanswered at that point become explicit risks carried into implementation.
