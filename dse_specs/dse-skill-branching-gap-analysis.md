# Skill Branching & Warm-Path Engagement — Gap Analysis

**Status:** Draft for discussion
**Scope:** Consumer Intelligence Plugin, Phase 0 (Governed Analysis Cycle)
**Related:** `dse-define-phase-plugin-ref/`, Phase 0 artifact model

---

## 1. Problem

Phase 0 ships a governed analysis cycle entered through slash commands. The entry path is well-defined: the user invokes `/scope`, the scope-agent clarifies intent, the plan-agent builds a plan, the plan runs, artifacts are written, results are delivered.

**What is not defined is what happens next.**

When the user responds to a delivered result with a follow-up — *"now decompose that by tenure bucket,"* *"okay but why,"* *"great, show me the segment breakdown"* — the plugin has no defined behavior. Every follow-up looks like a cold start to the skills, even though the thread holds everything the user and the plugin just built together.

The result is that warm follow-ups pay the same friction tax as cold questions. That is the gap.

---

## 2. Current State

Phase 0 treats the slash command as the **only** entry point. Skills activate on command invocation. Once a result is delivered, the skills go quiet until the user invokes another command. The host conversation (Claude Code or Cowork) carries the thread, but the skills do not read it on re-entry, and there is no affordance for the user to say *"continue from where we just were."*

The conversation is warm. The plugin behaves as if it is cold.

---

## 3. Gap

Three related deficiencies:

1. **No warm-path affordance.** The plugin offers no way to branch off a just-delivered result without restarting from scratch.
2. **No branch taxonomy.** Even if an affordance existed, there is no shared language for what a follow-up *is* — refinement, extension, decomposition, fork, or genuinely new question — and therefore no way for a skill to behave differently for each.
3. **No lineage model in the artifact layer.** Today every artifact stands alone. Nothing connects a second scope to the first one it branched from, which means governance cannot tell a branch from a duplicate and the audit trail loses the narrative of how a user got from question to insight.

All three are invisible in happy-path demos and painful in real usage.

---

## 4. What we could do

Five options, ordered from least to most invasive.

### Option A — Do nothing; rely on the host

Treat host conversation memory as sufficient. The user asks follow-ups in plain language, Claude answers from context, and the plugin only re-engages when the user explicitly invokes a slash command again.

**Pros**
- Zero plugin changes.
- No new surface area.
- The host is already solving thread memory well.

**Cons**
- Follow-ups that need fresh compute (new SQL, new chart, new decomposition) fall outside the governance envelope entirely — answers come from Claude's recollection of earlier narrative, not from audited re-execution.
- Decision log and audit trail silently stop mid-conversation.
- Governance and insight diverge: the deeper the thread, the less of it is governed.
- The plugin's value proposition erodes with every warm turn.

### Option B — Add explicit warm-path slash commands

Introduce new commands for branching: something like a "refine," "extend," or "continue" command the user invokes to signal *"this is a follow-up, not a new question."*

**Pros**
- Explicit user intent; no classification ambiguity.
- Skills know exactly when they're on the warm path.
- Fits the existing command-driven mental model.

**Cons**
- More commands for the user to learn and remember.
- Friction moves from the skills to the user's working memory — they now have to decide which command fits which follow-up.
- Users who forget the warm command will default back to the cold path and the problem reappears.
- Command proliferation is a warning sign; the plugin begins to feel like a CLI, not an assistant.

### Option C — Skill-side context detection

Keep the existing slash commands, but change skill behavior on entry: when a skill activates, it checks whether a recent artifact from the same session exists and, if so, offers a branch affordance ("I see we just answered X — do you want to refine, extend, or start fresh?") before falling through to cold behavior.

**Pros**
- No new commands; the user keeps the mental model they already have.
- The plugin carries the burden of recognizing warm vs. cold, which is where the burden belongs.
- The affordance is a single confirming turn — low friction, high clarity.
- Naturally composable with future proactive surfaces: the same detection logic that powers warm branching also powers "here's what I think you'll ask next."

**Cons**
- Requires skills to read conversation context on entry, which adds a responsibility they don't have today.
- Classification is imperfect; sometimes the skill will propose the wrong branch type and the user has to correct it.
- Introduces a new failure mode (wrong-branch proposal) that did not exist before.

### Option D — Agent-side silent branching

Same as Option C, but the agent classifies and branches without asking. The user asks a follow-up in plain language; the plugin decides what kind of branch it is and executes.

**Pros**
- Lowest possible friction — zero extra turns on the warm path.
- Feels the most like a human analyst.

**Cons**
- Silent wrong-branching is a governance disaster: a user thinks they asked one question and the plugin answered a different one, with an audit trail that looks correct.
- Undermines the entire premise of the Define phase, which exists specifically to force intent to the surface before compute runs.
- Hard to recover from: by the time the user notices, artifacts have already been written.

### Option E — Full session modeling inside the plugin

Build a plugin-side session store that tracks every scope, plan, and decision as a linked graph, independent of the host conversation.

**Pros**
- Plugin owns its own memory; works identically across hosts.
- Enables cross-session analytics (what do users actually ask? how do investigations branch?).
- Future-proofs Phase 3 proactive briefings, which need durable state anyway.

**Cons**
- Duplicates what the host already gives for free.
- Creates a second source of truth that can drift from the actual chat.
- Significant build cost for a problem the host largely solves.
- Wrong shape for Phase 0 — this is a Phase 3 concern masquerading as a Phase 0 fix.

---

## 5. Cross-cutting changes any non-trivial option requires

Regardless of which option we pick (other than A), three things need to change in the Phase 0 model:

1. **Artifact lineage.** Some way for a branched artifact to reference its parent, so governance and audit can tell a continuation from a duplicate. This is the smallest concrete change and unlocks everything downstream.
2. **Decision-log amendment semantics.** Today the decision log treats every entry as net-new. Branching means some entries are amendments to prior decisions, not new decisions, and the gate that enforces "at least one logged decision" needs to understand that distinction.
3. **Skill entry behavior.** Whichever option we pick, at least one skill needs to read conversation context on entry rather than starting from a blank slate. This is a new responsibility and needs to be designed deliberately — what the skill reads, how much it reads, how it handles ambiguity.

Options B, C, and D all need these three. Option E needs them plus a session store. Option A needs none of them but pays for it in governance drift.

---

## 6. Recommendation

**Option C — skill-side context detection with a one-turn confirmation — is the right direction for Phase 0.**

Reasoning:

- It preserves the host's natural ownership of the conversation. We don't rebuild what Claude Code and Cowork already do.
- It keeps the user's mental model simple. No new commands, no new vocabulary.
- The one-turn confirmation is the minimum viable governance surface for branching — enough friction to force intent to the surface, little enough to feel like a conversation rather than a form.
- The cross-cutting changes it requires (artifact lineage, decision-log amendments, skill entry behavior) are exactly the changes Phase 1 and Phase 2 need anyway. We are not building throwaway scaffolding.
- It fails gracefully: if context detection misfires, the user gets a wrong branch proposal and says "no, new question" — one wasted turn, no wasted compute, no corrupted audit trail.

**What we explicitly reject:**

- Option A, because it hollows out the governance story the plugin exists to tell.
- Option D, because silent branching and the Define phase are philosophically incompatible.
- Option E, because it is a Phase 3 problem and solving it now would delay Phase 0 without improving Phase 0.

**What we defer:**

- Option B (warm-path commands) is not wrong, it is just a user-facing fallback. If Option C's context detection proves unreliable in practice, a manual override command becomes a cheap escape hatch. We should keep the door open but not build it now.

---

## 7. Open questions

- **How aggressive should branch detection be?** A conservative skill proposes a branch only when the prior artifact is obviously the same shape; an aggressive skill proposes one whenever any prior artifact exists. The conservative version misses real warm paths; the aggressive version cries wolf. We need a default posture.
- **What happens when the user is wrong?** If the user accepts a branch proposal that turns out to be the wrong branch type, how does the plugin recover? Is there a "back out" affordance, or do they just run a new `/scope`?
- **How does branching interact with multi-user Cowork threads?** If two people are in the same Cowork session and one of them branches off a scope the other one authored, what does the decision log say? Whose intent is being captured?
- **Does this design need a test harness?** Branching behavior is hard to unit-test because it depends on conversation state. We may need a scenario-based test format specifically for warm-path flows.
- **How does this interact with the artifact immutability guarantee?** Today artifacts are immutable once approved. Branching does not violate that — each branch is a new artifact — but the governance story needs to be told clearly so "lineage" does not get misread as "mutation."

---

## 8. Next steps if we proceed

1. Socialize this document and converge on the recommendation (or pick a different one).
2. Draft the lineage model abstractly — no schema yet, just the relationships it needs to capture.
3. Draft the skill entry-behavior contract — what a skill is expected to read from the thread, and what it is expected to do with it.
4. Identify the first skill to retrofit as a branching pilot and design its warm-path behavior end to end.
5. Re-evaluate after the pilot before retrofitting the rest.
