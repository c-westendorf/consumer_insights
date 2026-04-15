# Consumer Intelligence Plugin — 30-Day Proof of Concept

**Status:** Draft
**Scope:** Phase 0 Define phase, Stage 2 Local Agent, Claude Code surface only
**Companion docs:** `dse-skill-branching-gap-analysis.md`, `dse-skill-branching-enhancement-plan.md`, `dse-define-phase-spec-local-agent.md`

---

## 1. Purpose

Prove — in 30 days, with weekly check-ins — that the Consumer Intelligence Plugin's skill harness works for users who did not build it, on the machines they actually use, against the data they actually need. The POC is not a feature build. It is a distribution and credibility test of what already exists.

The governed analysis cycle, the two-agent architecture, the artifact model, and the six hooks are all already in the plugin reference. The POC asks a different question: **can someone other than the author install it, run it, and trust the output?**

Warm-path branching (the enhancement plan in `dse-skill-branching-enhancement-plan.md`) is explicitly *not* built during the POC. If the POC fails, branching is irrelevant. If the POC succeeds, branching becomes the Phase 0.1 follow-up.

## 2. What the POC must prove

Five claims, each with a concrete demonstration:

1. **The plugin installs cleanly on both Mac and Windows** — fresh-machine install, no hand-patching, no "works on my laptop."
2. **A naive user can complete the governed cycle end-to-end** — `/scope` → clarification → approval → `/plan` → approval → execution → delivered result — without the author over their shoulder.
3. **Two real metric pulls land in week 1** — one consumer insights pull, one CRM pull, executed by members of the development team who did not write the skills.
4. **The audit trail is legible to a governance reviewer who has never seen the plugin** — scope artifact, plan artifact, decision log, and query log tell a coherent story cold.
5. **The hooks catch at least one real violation** — not a scripted demo. A real attempt to mutate an approved artifact or skip the decision log, blocked cleanly, with a message the user understands.

If any of these five cannot be demonstrated at the end of week 4, the POC has not succeeded — regardless of how the individual pieces feel.

## 3. Non-goals

- **No MCP governance gateway build.** The gateway is Stage 2 of the maturity path in §4a — acknowledged as inevitable for enterprise rollout beyond Claude Code, but scoping it is a Wave 4 output, not a Wave 1–3 deliverable. Reasoning for the staging is captured in §4a.
- **No web or Cowork surfaces.** Claude Code only. Hook-dependent governance is the whole value proposition being tested; running it where hooks do not exist invalidates the test.
- **No warm-path branching.** Cold entry only. Branching is the next initiative, not this one.
- **No Phase 2 execution changes.** Whatever plan-agent produces is consumed by whatever exists today.
- **No multi-user Cowork sessions.** Single-user Claude Code only.
- **No new skills or playbooks.** The POC tests the existing harness. Adding surface area mid-test invalidates the test.

## 4. The four waves

### Wave 1 — Week 1: Dev-team distribution and two real metric pulls

**Goal:** Prove cross-platform install and execute two production-shaped metric pulls from the development team — not from the plugin's author.

**Who:** 2–4 members of the development team. At least one Mac user and at least one Windows user. The plugin author is available but does not drive either session.

**What lands:**

- Fresh-machine install of the plugin on at least one Mac and at least one Windows machine. "Fresh" means a machine where the plugin has never been installed before and where the user follows only the written install instructions.
- One **consumer insights metric pull** run end-to-end through the governed cycle: `/scope` → clarification → approval → `/plan` → approval → query → delivered metric. The question, the scope, the plan, and the result live in the project directory as artifacts.
- One **CRM metric pull** run end-to-end the same way, ideally by a different dev-team member than the consumer insights pull.
- A written install log from the Windows user noting every point where the instructions were ambiguous, incomplete, or wrong — this is the most important artifact week 1 produces.

**What gets inspected at the week 1 check-in:**

- Did both operating systems install without hand-patching? If Windows required manual intervention, that is the top-priority fix for week 2.
- Did the two metric pulls actually reach approved artifacts, or did they get stuck somewhere in the loop? Where?
- Where did each user stop and ask the author for help? Those are the friction points to collapse before naive users touch it.
- What hooks fired? What did they block? Was anything surprising?

**Why the aggressive shape:** if the plugin cannot survive contact with its own development team in week 1, pushing it to naive users in week 2 is a waste of their time and ours. The dev team is the easiest possible audience. Failing with them is diagnostic.

### Wave 2 — Week 2: Naive user pilots

**Goal:** Put the plugin in front of 3–5 users outside the development team and watch what breaks.

**Who:** 3–5 pilot users. The mix matters more than the number: at least one who is comfortable with Claude Code and at least one who is not, at least one Mac and at least one Windows, at least one asking a consumer insights question and at least one asking a CRM question. Each pilot runs one real question they brought themselves — not a scripted demo.

**What lands:**

- Each pilot completes (or explicitly fails to complete) the governed cycle on their own question.
- Every pilot session produces either a full artifact chain (scope → plan → result → audit) or a written account of exactly where it broke.
- The dev-team Wave 1 install fixes are in place; Wave 2 is the first real test of the fresh install instructions.
- At least one pilot answer is consumed downstream — shared, screenshotted, pasted into a deck, anything — so we see whether the delivered result is actually useful, not just technically correct.

**What gets inspected at the week 2 check-in:**

- How many pilots finished? How many got stuck, and where?
- Did the clarification loop feel like a conversation or a form?
- Did any pilot try to do a follow-up ("now show me X") and pay the cold-restart friction tax the enhancement plan exists to fix? These moments are the evidence that warm-path branching is worth building next.
- Did any pilot misunderstand what the plugin was doing — believing it had executed something it had not, or vice versa? Trust failures are more serious than friction failures.

### Wave 3 — Week 3: Governance credibility and the stretch question

**Goal:** Show that the audit trail is trustworthy to someone who did not build the plugin, and show that the harness handles at least one investigation-shaped question, not just metric pulls.

**What lands:**

- **Governance walk-through.** A non-pilot reviewer — someone who has seen neither the plugin nor the pilot sessions — cold-reads the audit trail from one Wave 1 or Wave 2 session and reconstructs what happened, what was decided, and why. Their reconstruction is written down and compared against what actually happened. Gaps are the governance gaps.
- **One stretch question.** A pilot user runs a question that is not a metric pull — something hypothesis-shaped or investigation-shaped (e.g., "why did this move," "what explains the gap between these two cohorts"). This tests whether the plan-agent composes a plan richer than a single query, and whether the harness handles a multi-step analytical flow.
- **One deliberate violation.** The dev team attempts — on purpose, in a dedicated session — to mutate an approved artifact and to skip the decision log. The hooks must block both cleanly, with messages a user can understand and recover from. Screenshots of the block messages are part of the deliverable.

**What gets inspected at the week 3 check-in:**

- Could the cold reviewer tell the story from the audit trail alone? If not, what was missing — narrative, lineage, timestamps, decision rationale?
- Did the stretch question reach a plan the plan-agent was comfortable producing, or did it fall out to cold clarification? (Either answer is informative; silent failure is not.)
- Did both violations get blocked? Were the block messages useful, or did they read as stack traces?

### Wave 4 — Week 4: Decision and scoping the next thing

**Goal:** Write down what the POC proved and what it did not, and produce the scoping outline for the MCP governance gateway that unlocks non-Claude-Code surfaces.

**What lands:**

- **POC decision memo.** Two to three pages. Went/did-not-go against each of the five claims in §2. Explicit about what worked, what did not, and what the friction cost is for users who got through.
- **Friction backlog.** Every unresolved rough edge from Waves 1–3, ranked by how many pilots it hit. Becomes the first Phase 0.1 sprint input.
- **MCP governance gateway scoping outline.** Not a build. A document that answers: what would a governance gateway need to enforce to get the same guarantees the hooks give on Claude Code? What is the smallest useful first version? What is the build cost, in rough shape, and who needs to own it?
- **Go / no-go on the branching enhancement plan.** If the POC succeeded, branching becomes the next initiative. If the POC surfaced deeper friction, branching waits behind the deeper fix.

## 4a. Governance maturity path and the MCP choice

The POC runs on Claude Code because Claude Code is the only surface where hooks exist. Hooks are the mechanism enforcing the three Phase 0 guarantees — artifact immutability, decision-log presence before plan activation, and SQL interception with audit logging. Remove hooks and the governance story collapses to trust-me-bro.

This creates a forced sequencing decision: we cannot ship to Cowork or Claude web on day one, because neither surface runs PreToolUse/PostToolUse/Stop hooks. The question is not *whether* to solve this, it is *when* and *how*.

**What we chose: a three-stage maturity path, with the POC deliberately pinned to Stage 1.**

### Stage 1 — Hook-enforced governance on Claude Code (the POC)

- **Surface:** Claude Code only, single-user, local install.
- **Enforcement:** The six existing hooks (`artifact-guard`, `sql-interceptor`, `decision-log-gate`, `strategic-compact`, `artifact-schema-validator`, `decision-reminder`).
- **Distribution:** Plugin zip + written install instructions, Mac and Windows.
- **Why this is Stage 1:** It is the only stage where governance is already built. No new infrastructure, no new services, no new review cycles. If we cannot make Stage 1 work with users other than the author, no downstream stage is worth scoping.
- **What it cannot do:** Cowork. Claude web. Multi-user threads. Any surface without hooks.

### Stage 2 — MCP governance gateway (Phase 0.2, out of POC scope)

- **Surface:** Claude Cowork and Claude web, in addition to Claude Code.
- **Enforcement:** An MCP server that mediates the same guarantees hooks enforce today — artifact immutability, decision-log presence, SQL audit — but does so at the tool-call boundary instead of at the Claude Code process boundary. Any surface that speaks MCP can enforce the same rules.
- **Why a gateway, not a re-implementation per surface:** Re-implementing governance per surface (one for Cowork, one for web, one for whatever comes next) creates N divergent governance stories and N things that can drift. A single MCP server is one source of truth that every surface connects to.
- **Why it is not in the POC:** The gateway is a real build. It needs a host, an auth story, a deployment path, an on-call owner, and a review cycle with security and platform teams. None of those exist today. A 30-day window cannot produce it, and pretending otherwise would crowd out the thing the POC actually needs to prove.
- **What the POC produces *for* Stage 2:** the Wave 4 scoping outline — what the gateway has to enforce, what the smallest useful first version looks like, and who needs to own it. This is the input to the Phase 0.2 initiative, not a deliverable of it.

### Stage 3 — Multi-user Cowork and cross-surface threads (Phase 0.3+, explicitly deferred)

- **Surface:** Shared Cowork sessions with multiple humans, cross-surface threads (Cowork → web → Code on the same investigation).
- **Enforcement:** Stage 2's gateway plus lineage semantics that handle multi-author decision logs and cross-surface artifact chains.
- **Why it is Stage 3:** It depends on Stage 2 (the gateway) and on the warm-path branching enhancement (`dse-skill-branching-enhancement-plan.md`) landing first. Multi-user threads without branching is a degraded experience; multi-user threads without a gateway is ungoverned.
- **Not on any roadmap this document authorizes.** Called out here only so the maturity path is visible end-to-end.

### Options considered and rejected

We did not arrive at "hooks now, MCP gateway next, multi-user later" by default. Three alternatives were weighed:

1. **Self-enforcement inside skills (web-compatible, no hooks).** The skills themselves check the rules and refuse to proceed. **Rejected** because a user can edit the skill, bypass the check, or instruct the agent to skip it — self-enforcement is a convention, not a control. For an enterprise audit story, conventions are not enough.
2. **Build the MCP gateway first, skip the hook-based POC.** Start directly at Stage 2. **Rejected** because the gateway is a multi-month enterprise build (hosting, auth, platform review) and we need evidence the harness is worth that investment before asking for it. The hook-based POC is the cheapest possible way to produce that evidence.
3. **Advisory-only governance on web (log but do not block).** Let web users run the skills, record what they did, no enforcement. **Rejected** because the value proposition is *governed* analysis, not *observed* analysis. If the plugin cannot block a violation, the audit trail is a description of what happened, not a guarantee of what did not.

The chosen path — hook-enforced POC on Claude Code, then gateway, then multi-user — is the only path that (a) produces enforceable guarantees from day one, (b) proves value before asking for infrastructure investment, and (c) does not require us to re-implement governance every time a new surface appears.

### What this means for the POC specifically

- The POC is deliberately **Claude Code only**. This is not a limitation we are working around — it is the surface on which the governance model is enforceable today.
- The POC **does not validate the MCP gateway design**. It validates the harness that the gateway will eventually need to front. These are different questions and should not be conflated in the decision memo.
- The Wave 4 gateway scoping outline is a **POC deliverable**, not a POC goal. It exists so that if the POC succeeds, Phase 0.2 can start without a cold-start planning cycle.
- If stakeholders push to include Cowork or web in the POC window, the answer is "that is Stage 2, and Stage 2 depends on Stage 1 succeeding first." The sequencing is not negotiable without abandoning the governance guarantees the plugin exists to provide.

## 5. Weekly rhythm

Every week in Waves 1–3 runs on the same four-beat cadence. This is the part that makes the POC legible from the outside.

- **Monday — Lock the version.** The plugin version pilots and dev-team members are using this week is frozen Monday morning. No patches land mid-week except for hard blockers. This is the rule that keeps the friction log meaningful — if the plugin is changing under pilots, their feedback is unattributable.
- **Wednesday — Async friction intake.** Every user running sessions that week drops their rough edges, confusions, and outright blockers into a single shared doc. Async, low-friction, no meeting required. The rule is write it down while it is fresh, not at the end of the week when it is forgotten.
- **Thursday — Targeted fixes.** The dev team works the intake doc. Fixes land in a branch for next Monday's lock. Anything too big for this week is triaged to the friction backlog.
- **Friday — Check-in.** 30 minutes. Three questions: what happened this week, what are we fixing next week, what did we learn that changes the plan. The weekly check-in is the contract with stakeholders — if it is missed, confidence in the POC erodes faster than the POC itself does.

## 6. Pre-POC checklist

Seven items. None of them can be skipped.

1. **Fresh-machine install instructions, written.** Step-by-step, tested on a machine where the plugin has never been installed.
2. **Windows install validated.** Tested on a machine running Windows, by someone who is not the plugin author, following only the written instructions.
3. **Mac install validated.** Same test, same rules, on Mac.
4. **Hook scripts reviewed for portability.** Every `hooks/scripts/*.sh` audited for Git Bash compatibility, LF line endings (via `.gitattributes`), and path separators. Windows is the gating case — if a hook only runs on Mac, it does not ship.
5. **Two candidate metric questions drafted.** One consumer insights, one CRM. Real questions from real stakeholders, not benchmark questions.
6. **Three to five pilot candidates identified.** Mix of OS and Claude Code comfort level. Time-boxed ask: one 30-minute session per pilot during week 2.
7. **Friction intake doc stood up.** Empty is fine. Existing and accessible before Monday of Wave 1 is not optional.

## 7. Windows-specific risks

Windows is the POC's single largest execution risk. The plugin reference uses `bash "${CLAUDE_PLUGIN_ROOT}/hooks/scripts/*.sh"` for every hook, which means hooks depend on Git Bash being present and correctly installed for the user running Claude Code. Three risks worth calling out explicitly:

- **Git Bash availability.** If the user does not have Git Bash, the hooks silently fail or error in ways that are hard to diagnose. The install instructions must require Git Bash and test for its presence up front.
- **Line endings.** Any hook script checked in with CRLF line endings will fail on bash with cryptic errors. A `.gitattributes` file forcing LF on `*.sh` is a pre-POC requirement, not a nice-to-have.
- **Path separators.** Any hook that builds paths by string concatenation instead of using bash-portable path handling will break on Windows. Audit every script in `hooks/scripts/` for this before Wave 1.

## 8. Risks beyond Windows

- **Dev team runs out of patience.** Wave 1 depends on dev-team members who have other jobs. Mitigation: the two metric questions are real questions they would have asked anyway, so the time is not purely overhead.
- **Naive users cannot reach a question worth asking.** If pilots cannot articulate a question the plugin can govern, the friction is upstream of the plugin. Mitigation: pair each pilot with a brief question-shaping conversation before their session, with the author explicitly not driving.
- **The governance walk-through reveals the audit trail is not actually legible.** This is the most expensive possible week 3 outcome. Mitigation: do a dry-run of the walk-through at the end of week 2, with a dev-team member acting as the cold reader, and fix whatever the dry-run exposes before the real walk-through.
- **Warm-path friction dominates pilot feedback.** Every pilot wants to ask a follow-up and cannot. Mitigation: this is not a risk to the POC — it is the evidence that unlocks the branching enhancement plan. Log it precisely; do not try to fix it in-POC.
- **Hook blocks look like errors, not governance.** Pilots read a block as "the plugin broke" rather than "the plugin caught something." Mitigation: review every hook's user-facing message as part of the pre-POC checklist; rewrite any that read as tracebacks.

## 9. Acceptance criteria

The POC is successful when all of the following are true at the end of week 4:

- The plugin installs cleanly on both Mac and Windows from the written instructions, tested by someone other than the author.
- At least two metric pulls (one consumer insights, one CRM) completed through the governed cycle in week 1, driven by dev-team members who did not author the plugin.
- At least three naive users completed the governed cycle on their own questions in week 2, and at least one of their delivered results was consumed downstream.
- At least one stretch (investigation-shaped) question was attempted in week 3, and the outcome — success or graceful failure — is documented.
- A cold reviewer reconstructed a session from the audit trail alone in week 3, and the gaps between their reconstruction and ground truth are written down.
- At least one deliberate violation of the governance model was caught by a hook cleanly, with a block message the user understood.
- The friction backlog is populated and ranked; the week 4 decision memo exists and is explicit about what the POC proved.
- The MCP governance gateway scoping outline exists as a readable document, even in rough form.

## 10. What the POC produces

Artifacts to expect by end of week 4:

- A reproducible install path for Mac and Windows, validated by non-authors.
- Two to four Wave 1 artifact chains (scope / plan / query log / result) from dev-team metric pulls.
- Three to five Wave 2 artifact chains from pilot user sessions.
- One Wave 3 artifact chain from the stretch question, plus one Wave 3 "violation" session showing hooks catching governance breaks.
- A governance walk-through document: the cold reviewer's reconstruction alongside the actual session, with gaps annotated.
- A friction backlog ranked by pilot hit rate.
- The POC decision memo (§4, Wave 4).
- The MCP governance gateway scoping outline (§4, Wave 4).

## 11. Sequencing out of the POC

The POC does not stand alone. It is the gate that unlocks the next two initiatives:

- **Warm-path branching** (per `dse-skill-branching-enhancement-plan.md`) is the expected Phase 0.1 follow-up. The POC surfaces whether warm-path friction dominates pilot feedback, which is the evidence the enhancement plan needs to justify its scope.
- **MCP governance gateway** is Stage 2 of the governance maturity path (§4a) — the enterprise-distribution unlock for non-Claude-Code surfaces. The POC does not build it; the POC's Wave 4 scoping outline is the input to that build. Multi-user Cowork is Stage 3 and depends on both the gateway and warm-path branching landing first.

These two follow-ups are independent of one another. Branching can begin before the gateway is built, because Claude Code already provides hook-based governance. The gateway can begin before branching is built, because branching is a skill-level concern and the gateway is a surface-level concern.

## 12. Open questions

- **Who owns the friction intake doc?** Needs a named owner before Wave 1. The doc is useless if nobody reads it on Thursdays.
- **What counts as a "consumer insights pull" vs. a "CRM pull"?** Needs a one-line working definition per data source before Wave 1 so the two metric questions aren't arguing over taxonomy.
- **How is the cold governance reviewer selected?** They need to be credible to the stakeholders who will read the decision memo, but they cannot have seen the pilot sessions.
- **What is the fallback if Windows install cannot be made to work in week 1?** Does the POC continue Mac-only, or does the POC pause until Windows is unblocked? This needs to be decided before Wave 1, not in the middle of it.
- **Who is the decision-memo audience?** DS leadership, plugin stakeholders, both? The audience shapes how the week 4 memo is framed.

## 13. Relationship to the other documents

Three documents form a sequence:

1. **`dse-skill-branching-gap-analysis.md`** — frames the warm-path engagement gap and recommends Option C (skill-side context detection).
2. **`dse-skill-branching-enhancement-plan.md`** — describes the work to implement Option C across six streams in three waves.
3. **`dse-plugin-poc-plan-30day.md`** (this document) — proves the existing harness works with users other than its author, before the branching enhancement is built on top of it.

The branching enhancement is gated on the POC. Building branching on top of a harness that has not proven it can be distributed is an expensive mistake. Running the POC first is the cheap way to find out.
