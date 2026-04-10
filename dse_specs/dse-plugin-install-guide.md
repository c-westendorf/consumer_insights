# DSE Define Phase Plugin — Installation & Setup Guide

A step-by-step guide for analysts and data scientists to install and configure the DSE Define Phase plugin for Claude Code. No command-line expertise required beyond copy-pasting the commands below.

---

## Prerequisites

Before you begin, confirm:

1. **Claude Code is installed** — You should be able to type `claude` in your terminal and see the Claude Code interface. If not, ask your manager or the AI Engineering team for access.

2. **You have a terminal app** — On Mac, open Terminal (search "Terminal" in Spotlight). On Windows, use PowerShell.

3. **These tools are installed** (ask your IT team if unsure):
   - `jq` — check by typing `jq --version` in terminal
   - `python3` — check by typing `python3 --version` in terminal

   If missing:
   ```bash
   # macOS (with Homebrew)
   brew install jq python3

   # If you don't have Homebrew
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   brew install jq python3
   ```

4. **Optional but recommended** — Install the `jsonschema` Python package for full artifact validation:
   ```bash
   pip install jsonschema
   ```

---

## Step 1: Install the Plugin

Open your terminal and run:

```bash
claude plugin install dse-define-phase
```

If the plugin is not yet in the marketplace, install from the local directory:

```bash
claude plugin install /path/to/dse_specs/dse-define-phase-plugin-ref
```

You should see a confirmation message. The plugin's commands (`/scope`, `/plan`, `/dse-status`) are now available in any Claude Code session.

---

## Step 2: Configure Permissions (Recommended)

The plugin works best when certain safe operations don't require manual approval each time. Create or edit the file `.claude/settings.local.json` in your project directory:

**Where to create it:** In the root of whatever project folder you're analyzing. For example, if you're working in `~/Documents/q3-retention-analysis/`, create the file at `~/Documents/q3-retention-analysis/.claude/settings.local.json`.

```json
{
  "permissions": {
    "allow": [
      "Bash(ls:*)",
      "Bash(find:*)",
      "Bash(grep:*)",
      "Bash(cat:*)",
      "Bash(head:*)",
      "Bash(wc:*)"
    ]
  }
}
```

This allows the agent to run basic read-only commands without asking you each time. It cannot modify or delete anything with these permissions.

> **Note:** This file is gitignored by default — it stays on your machine and is not shared with colleagues.

---

## Step 3: Verify Installation

Open Claude Code in your project directory and run:

```
/dse-status
```

You should see:

```
DSE Define Phase Status
=======================

Scope Session:  NOT STARTED
Scope Artifact: NOT STARTED
Plan Artifact:  NOT STARTED
Decision Log:   No decisions logged yet
```

If you see this, the plugin is working correctly.

---

## Step 4: Test the Hooks

The plugin includes governance hooks that protect your work. To verify they're loaded, type `/hooks` in Claude Code. You should see entries under `PreToolUse`, `PostToolUse`, and `Stop` with descriptions mentioning "artifact immutability", "SQL interception", "decision log gate", etc.

---

## How to Use the Plugin

### Starting a New Analysis

1. **Scope your question:**
   ```
   /scope Are reactivated customers sticking around or churning again?
   ```

   The scope agent will:
   - Classify your question against the Customer Growth Framework
   - Ask you clarifying questions (one at a time)
   - Present options at each decision point (you'll see at least 3 options with pros/cons)
   - Present the final scope for your approval

2. **Review and approve the scope** — Read the summary carefully. Say "approved" if it looks right, or ask for changes.

3. **Generate a plan:**
   ```
   /plan
   ```

   The plan agent will:
   - Read your approved scope
   - Break it into ordered analytical tasks
   - Show you a progress tracker (todo list) as it works
   - Present both a plain-English summary and a technical execution plan
   - Ask for your approval before saving

4. **Check status anytime:**
   ```
   /dse-status
   ```

### What the Hooks Do for You

You don't need to think about hooks — they run automatically. Here's what they protect:

| What's Protected | How |
|-----------------|-----|
| **Your approved scope** | Once you approve a scope, it's locked. Nobody (including the agent) can change it. |
| **Your data** | The agent cannot run DROP, DELETE, or other destructive SQL commands. All queries are logged. |
| **Decision quality** | The agent must present at least 3 options with pros/cons at each decision point. No plan can be generated without documented decisions. |
| **Your context window** | The plugin suggests when to compact your session to prevent losing important context. |
| **Artifact quality** | After writing scope or plan files, they're automatically validated against the expected structure. |

### Understanding the Decision Log

During scoping, the agent will present choices like:

> **Decision: Which retention metric should we use?**
>
> **Option A:** 90-day repeat purchase rate
> - Pros: Standard metric, comparable to benchmarks
> - Cons: May miss early churn signals
>
> **Option B:** 30/60/90-day retention curves
> - Pros: Shows trajectory, captures when drop-off occurs
> - Cons: Higher complexity, more data needed
>
> **Option C:** Value-weighted retention (revenue per retained customer)
> - Pros: Directly ties to business value
> - Cons: Requires revenue data, metric definition debate
>
> Which would you prefer?

Your choice is logged. Over time, these decisions build institutional knowledge — the next analyst who asks a similar question will see what your team decided before.

---

## Troubleshooting

### "No approved scope found"
You need to run `/scope` first and approve a scope before running `/plan`.

### "No decision_log.json found"
The scope agent needs to log at least one decision during scoping. If this happens, re-run `/scope` and make sure you go through the full disambiguation process.

### Hook not appearing in `/hooks`
- Check that the plugin is installed: `claude plugin list`
- Restart your Claude Code session
- Verify `hooks/hooks.json` exists in the plugin directory

### "jq: command not found"
Install jq: `brew install jq` (Mac) or `apt-get install jq` (Linux)

### Schema validation warnings
If you see "install jsonschema for full validation", run:
```bash
pip install jsonschema
```
This is optional — artifacts will still work without it, but you'll get better error messages with it installed.

---

## File Reference

After using the plugin, your project directory will contain:

| File | What It Is | Created By |
|------|-----------|------------|
| `scope_session.json` | Temporary state during scoping (can be deleted) | `/scope` |
| `scope_artifact.json` | Your approved analytical scope (do not edit) | `/scope` |
| `plan_artifact.json` | Your approved project plan (do not edit) | `/plan` |
| `decision_log.json` | All analytical decisions with options and rationale | Both agents |
| `audit/query_log.jsonl` | Log of all commands run (for compliance) | Automatic |
| `.dse_tool_count` | Tool call counter for compact suggestions (can be deleted) | Automatic |

---

## Getting Help

- **Plugin issues:** Post in the #dse-plugin Slack channel
- **Claude Code issues:** Post in the #claude-enterprise Slack channel
- **Data access issues:** Contact your data engineering partner
