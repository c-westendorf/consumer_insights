# DSE Define Phase Plugin — Development Setup Guide

How to set up your local environment to develop, test, and release the DSE Define Phase plugin using VS Code + Claude Code.

---

## Table of Contents

1. [Repository Structure](#repository-structure)
2. [First-Time Setup](#first-time-setup)
3. [Development Workflow](#development-workflow)
4. [Testing Hooks, Skills, and Agents](#testing-hooks-skills-and-agents)
5. [Branching Strategy](#branching-strategy)
6. [Release Process](#release-process)
7. [VS Code Configuration](#vs-code-configuration)
8. [Troubleshooting](#troubleshooting)

---

## Repository Structure

The plugin lives inside the `consumer_insights` repo. This is the canonical source — everything ships from here.

```
consumer_insights/                          ← Git repo root
├── .claude/                                ← Project-level Claude Code config (gitignored)
│   ├── settings.local.json                 ← Your local permissions (gitignored)
│   ├── skills/                             ← Legacy skill copies (being phased out)
│   └── hooks/                              ← Empty — hooks live in the plugin now
│
├── .gitignore                              ← Must allow plugin files through
│
├── dse_specs/                              ← All DSE specifications and the plugin
│   ├── dse-define-phase-spec-local-agent.md
│   ├── dse-30-60-90-roadmap.md
│   ├── dse-plugin-install-guide.md
│   ├── dse-plugin-development-guide.md     ← This file
│   │
│   └── dse-define-phase-plugin-ref/        ← THE PLUGIN (this is what gets distributed)
│       ├── .claude-plugin/
│       │   └── plugin.json                 ← Plugin identity manifest
│       ├── agents/
│       │   ├── scope-agent.md
│       │   └── plan-agent.md
│       ├── skills/                         ← 41 skills + 13 shared references
│       │   ├── _shared-references/
│       │   ├── intent-classification/
│       │   ├── scope-extraction/
│       │   ├── eda-comprehensive/
│       │   └── ...
│       ├── commands/
│       │   ├── scope.md
│       │   ├── plan.md
│       │   └── dse-status.md
│       ├── playbooks/
│       │   ├── eda/
│       │   ├── outcome-roi/
│       │   └── ...
│       ├── hooks/
│       │   ├── hooks.json                  ← Hook definitions (auto-loaded)
│       │   ├── scripts/                    ← Hook implementation scripts
│       │   └── README.md
│       ├── schemas/
│       │   ├── scope_artifact.schema.json
│       │   ├── plan_artifact.schema.json
│       │   ├── decision_log.schema.json
│       │   └── decision_log_artifact.schema.json
│       └── README.md
│
├── skill-blueprint/                        ← Skill design principles
└── README.md
```

### Key Distinction: `.claude/` vs Plugin Directory

| Directory | Purpose | Gitignored? | Distributed? |
|-----------|---------|-------------|--------------|
| `.claude/` | Your local Claude Code project config (permissions, local settings) | Yes | No |
| `dse_specs/dse-define-phase-plugin-ref/` | The plugin source — everything that ships | No | Yes |

**Rule:** All new skills, hooks, agents, and schemas go into the plugin directory. The `.claude/skills/` directory contains legacy copies that will be deprecated once the plugin is the primary distribution mechanism.

---

## First-Time Setup

### 1. Clone the Repo

```bash
git clone https://github.com/c-westendorf/consumer_insights.git
cd consumer_insights
```

### 2. Install Prerequisites

```bash
# macOS
brew install jq python3

# Python schema validation (optional but recommended)
pip install jsonschema
```

### 3. Create Your Local Settings

Create `.claude/settings.local.json` (gitignored — stays on your machine):

```json
{
  "permissions": {
    "allow": [
      "Bash(ls:*)",
      "Bash(find:*)",
      "Bash(grep:*)",
      "Bash(cat:*)",
      "Bash(head:*)",
      "Bash(wc:*)",
      "Bash(python3:*)"
    ]
  }
}
```

### 4. Verify Hook Scripts Are Executable

```bash
chmod +x dse_specs/dse-define-phase-plugin-ref/hooks/scripts/*.sh
```

### 5. Open in VS Code

```bash
code .
```

Install the [Claude Code VS Code extension](https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code) if you haven't already.

---

## Development Workflow

### Starting a Development Session

Launch Claude Code with the plugin loaded from your local source:

```bash
# From the repo root
claude --plugin-dir ./dse_specs/dse-define-phase-plugin-ref
```

Or from the VS Code terminal: open the Claude Code panel, then use the command palette or terminal to start with the plugin flag.

This loads your plugin **from disk** without installing it. Every change you make to files in the plugin directory is picked up on reload.

### The Edit → Reload → Test Loop

```
1. Edit a file (skill, hook, agent, schema)
     ↓
2. In Claude Code, run: /reload-plugins
     ↓
3. Test the change (invoke the skill, trigger the hook, etc.)
     ↓
4. If it works → commit
   If not → go back to step 1
```

**`/reload-plugins`** reloads all plugin components without restarting the session:
- Skills (SKILL.md files)
- Agents (agent .md files)
- Hooks (hooks.json + scripts)
- Commands (command .md files)

### Validating the Plugin

Before committing, validate the plugin structure:

```
/plugin validate
```

This checks:
- `plugin.json` syntax and required fields
- Skill/agent/command frontmatter validity
- `hooks.json` syntax
- Script file permissions

### Verifying Hooks

Run `/hooks` to see all loaded hooks grouped by event type. You should see entries under `PreToolUse`, `PostToolUse`, and `Stop` with descriptions matching your hook definitions.

---

## Testing Hooks, Skills, and Agents

### Testing PreToolUse Hooks

| Hook | How to Trigger | Expected Result |
|------|---------------|-----------------|
| **Artifact guard** | Try to edit an `*_artifact.json` file that contains `"approved_at"` | Write blocked, stderr shows "Cannot modify an approved artifact" |
| **SQL interceptor** | Run a Bash command containing `DROP TABLE` | Command blocked, `audit/query_log.jsonl` created |
| **Decision log gate** | Try to invoke `/plan` without a `decision_log.json` | Agent blocked, stderr shows "No decision_log.json found" |
| **Strategic compact** | Run 40+ tool calls in a session | Warning suggests `/compact` |

**Testing the SQL interceptor manually:**

```bash
# Create a test input
echo '{"session_id":"test","cwd":"/tmp","hook_event_name":"PreToolUse","tool_name":"Bash","tool_input":{"command":"DROP TABLE customers"}}' | bash dse_specs/dse-define-phase-plugin-ref/hooks/scripts/sql-interceptor.sh
echo "Exit code: $?"
# Expected: stderr shows BLOCKED, exit code 2
```

```bash
# Test with a safe command
echo '{"session_id":"test","cwd":"/tmp","hook_event_name":"PreToolUse","tool_name":"Bash","tool_input":{"command":"SELECT * FROM customers LIMIT 10"}}' | bash dse_specs/dse-define-phase-plugin-ref/hooks/scripts/sql-interceptor.sh
echo "Exit code: $?"
# Expected: exit code 0, query logged to /tmp/audit/query_log.jsonl
```

### Testing PostToolUse Hooks

| Hook | How to Trigger | Expected Result |
|------|---------------|-----------------|
| **Artifact schema validator** | Write a `scope_artifact.json` with missing required fields | Warning in stderr about schema validation failure |

### Testing Stop Hooks

| Hook | How to Trigger | Expected Result |
|------|---------------|-----------------|
| **Decision reminder** | Create a `scope_session.json` with `"status": "disambiguating"` and no `decision_log.json`, then let Claude respond | Context injection reminding agent to log decisions |

### Testing Skills

Invoke skills by their namespaced name:

```
/dse-define-phase:intent-classification
/dse-define-phase:scope-extraction
/dse-define-phase:eda-comprehensive
```

Or use the slash commands that activate agents:

```
/scope Are reactivated customers sticking around?
/plan
/dse-status
```

### Testing Agents

The scope-agent and plan-agent activate via their `/scope` and `/plan` commands. To test the full flow:

1. Run `/scope "Are reactivated customers sticking?"` — walk through disambiguation
2. Verify `scope_session.json` is created and updated
3. Verify `decision_log.json` is created with ≥1 entry
4. Approve the scope → verify `scope_artifact.json` has `approved_at`
5. Run `/plan` → verify plan-agent activates (decision log gate should pass)
6. Verify `plan_artifact.json` is created with both views
7. Run `/dse-status` → verify it shows all three artifacts

---

## Branching Strategy

### Branch Model: Trunk-Based with Short-Lived Feature Branches

```
main (protected)
  │
  ├── feat/decision-log-analytics     ← feature: new capability
  ├── fix/artifact-guard-symlink      ← fix: bug in existing code
  ├── chore/update-cgf-taxonomy       ← chore: content updates
  └── release/v0.2.0                  ← release: version prep
```

### Branch Naming Convention

```
{type}/{short-description}
```

| Type | When to Use | Example |
|------|-------------|---------|
| `feat/` | New skill, hook, agent, playbook, or command | `feat/phi-scanning-hook` |
| `fix/` | Bug fix in existing component | `fix/decision-gate-false-positive` |
| `chore/` | Content updates, dependency changes, docs | `chore/expand-cgf-reactivated-stage` |
| `refactor/` | Restructuring without behavior change | `refactor/consolidate-shared-refs` |
| `release/` | Version release preparation | `release/v0.2.0` |

### Rules

1. **`main` is always deployable.** Every commit on `main` is a valid plugin state that could be installed by an analyst.

2. **Feature branches are short-lived.** Target 1–3 days. If a feature takes longer, break it into smaller branches.

3. **One branch per logical change.** Don't mix a new skill with a hook fix in the same branch.

4. **Branches are deleted after merge.** No long-lived branches except `main`.

### Workflow: Feature Branch

```bash
# 1. Create branch from main
git checkout main
git pull origin main
git checkout -b feat/phi-scanning-hook

# 2. Develop (edit → /reload-plugins → test loop)
#    Make commits as you go — small, atomic commits

# 3. Test the full plugin
claude --plugin-dir ./dse_specs/dse-define-phase-plugin-ref
# Run /plugin validate
# Test affected hooks/skills/agents

# 4. Push and create PR
git push -u origin feat/phi-scanning-hook
gh pr create --title "Add PHI scanning PostToolUse hook" --body "..."

# 5. After review and merge, clean up
git checkout main
git pull origin main
git branch -d feat/phi-scanning-hook
```

### Workflow: Bug Fix

Same as feature, but use `fix/` prefix and include the failure scenario in the PR description:

```bash
git checkout -b fix/artifact-guard-relative-path
# Fix the bug
# Add a test case (manual test script or test fixture)
# Commit, push, PR
```

### Workflow: Content Update (CGF Taxonomy, Shared References)

Content changes (updating `cgf-taxonomy.md`, adding metrics to `skill-registry.md`) follow the same branch model but use `chore/`:

```bash
git checkout -b chore/codify-at-risk-lifecycle-stage
# Edit skills/_shared-references/cgf-taxonomy.md
# Commit, push, PR
```

### Workflow: Release

Releases bundle multiple feature/fix branches into a versioned release:

```bash
# 1. Create release branch
git checkout -b release/v0.2.0

# 2. Update version and changelog
#    - Bump version in plugin.json (if version field exists)
#    - Update CHANGELOG.md
#    - Run /plugin validate

# 3. Merge to main
git checkout main
git merge release/v0.2.0
git tag v0.2.0

# 4. Push with tags
git push origin main --tags
```

---

## Release Process

### Versioning (Semver)

```
v{MAJOR}.{MINOR}.{PATCH}

MAJOR: Breaking changes (skill interface change, artifact schema change)
MINOR: New capabilities (new skill, new hook, new playbook)
PATCH: Bug fixes, content updates, documentation
```

### Pre-Release Checklist

Before merging to `main` for a release:

- [ ] `/plugin validate` passes
- [ ] All hook scripts are executable (`chmod +x hooks/scripts/*.sh`)
- [ ] All modified skills pass the blueprint checklist (`/dse-define-phase:dse-skill-tester`)
- [ ] Hooks tested manually (each hook triggered and verified)
- [ ] `/scope` → `/plan` → `/dse-status` flow works end-to-end
- [ ] `decision_log.json` is created during scoping
- [ ] Artifact immutability hook blocks writes to approved artifacts
- [ ] SQL interceptor blocks destructive DDL/DML
- [ ] No secrets, credentials, or PII in any committed file
- [ ] README.md reflects current plugin state
- [ ] CHANGELOG.md updated with version entry

### Publishing to Enterprise Marketplace

```bash
# After release tag is on main:
# 1. Update marketplace.json in the cvs-enterprise-plugins repo
# 2. Point to the tagged release
# 3. Colleagues install with:
claude plugin install dse-define-phase
```

Until the marketplace is set up, colleagues install from the repo directly:

```bash
# Clone the repo
git clone https://github.com/c-westendorf/consumer_insights.git

# Load the plugin
claude --plugin-dir ./consumer_insights/dse_specs/dse-define-phase-plugin-ref
```

---

## VS Code Configuration

### Recommended Extensions

| Extension | Why |
|-----------|-----|
| **Claude Code** (`anthropic.claude-code`) | Required — Claude Code in VS Code |
| **JSON Schema Validator** | Validates artifact schemas as you edit them |
| **Markdown Preview Enhanced** | Preview skill and agent .md files |
| **ShellCheck** (`timonwong.shellcheck`) | Lint hook shell scripts |

### Workspace Settings

Create `.vscode/settings.json` in the repo root (commit this for team consistency):

```json
{
  "files.associations": {
    "SKILL.md": "markdown",
    "PLAYBOOK.md": "markdown",
    "*.schema.json": "json"
  },
  "editor.formatOnSave": true,
  "json.schemas": [
    {
      "fileMatch": ["**/scope_artifact.json"],
      "url": "./dse_specs/dse-define-phase-plugin-ref/schemas/scope_artifact.schema.json"
    },
    {
      "fileMatch": ["**/plan_artifact.json"],
      "url": "./dse_specs/dse-define-phase-plugin-ref/schemas/plan_artifact.schema.json"
    },
    {
      "fileMatch": ["**/decision_log.json"],
      "url": "./dse_specs/dse-define-phase-plugin-ref/schemas/decision_log_artifact.schema.json"
    },
    {
      "fileMatch": ["**/hooks.json"],
      "url": "https://json.schemastore.org/claude-code-settings.json"
    }
  ],
  "shellcheck.enable": true,
  "shellcheck.run": "onSave"
}
```

### Launch Configuration

Create `.vscode/launch.json` for quick plugin testing:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Claude Code + DSE Plugin",
      "type": "node-terminal",
      "request": "launch",
      "command": "claude --plugin-dir ./dse_specs/dse-define-phase-plugin-ref",
      "cwd": "${workspaceFolder}"
    }
  ]
}
```

### Tasks for Common Operations

Create `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Validate Plugin",
      "type": "shell",
      "command": "echo 'Run /plugin validate inside Claude Code'",
      "problemMatcher": []
    },
    {
      "label": "Make Hook Scripts Executable",
      "type": "shell",
      "command": "chmod +x dse_specs/dse-define-phase-plugin-ref/hooks/scripts/*.sh",
      "problemMatcher": []
    },
    {
      "label": "Test SQL Interceptor Hook",
      "type": "shell",
      "command": "echo '{\"session_id\":\"test\",\"cwd\":\"/tmp\",\"tool_name\":\"Bash\",\"tool_input\":{\"command\":\"DROP TABLE test\"}}' | bash dse_specs/dse-define-phase-plugin-ref/hooks/scripts/sql-interceptor.sh; echo \"Exit: $?\"",
      "problemMatcher": []
    },
    {
      "label": "Test Artifact Guard Hook",
      "type": "shell",
      "command": "echo '{\"session_id\":\"test\",\"cwd\":\"/tmp\",\"tool_name\":\"Write\",\"tool_input\":{\"file_path\":\"/tmp/test_artifact.json\"}}' | bash dse_specs/dse-define-phase-plugin-ref/hooks/scripts/artifact-guard.sh; echo \"Exit: $?\"",
      "problemMatcher": []
    }
  ]
}
```

---

## Troubleshooting

### Plugin Not Loading

```
Symptom: /scope, /plan, /dse-status commands not available
```

1. Verify you started with `--plugin-dir`:
   ```bash
   claude --plugin-dir ./dse_specs/dse-define-phase-plugin-ref
   ```
2. Check that `.claude-plugin/plugin.json` exists and is valid JSON
3. Run `/plugin validate` for detailed errors

### Hooks Not Firing

```
Symptom: Destructive SQL not blocked, approved artifacts overwritable
```

1. Run `/hooks` — verify hooks appear under the correct event type
2. Check that hook scripts are executable:
   ```bash
   ls -la dse_specs/dse-define-phase-plugin-ref/hooks/scripts/*.sh
   ```
3. Test the hook script directly by piping JSON to it (see Testing section)
4. Check that `jq` is installed: `jq --version`

### Skills Not Discovered

```
Symptom: /dse-define-phase:skill-name returns "skill not found"
```

1. Verify the skill directory contains a `SKILL.md` file (not `skill.md`)
2. Check that SKILL.md has valid YAML frontmatter with `name` and `description`
3. Run `/reload-plugins` after adding new skills

### Changes Not Reflecting

```
Symptom: Edited a skill/hook but behavior hasn't changed
```

1. Run `/reload-plugins` — this is required after every edit
2. If `/reload-plugins` doesn't help, restart the Claude Code session:
   ```bash
   # Exit current session, then:
   claude --plugin-dir ./dse_specs/dse-define-phase-plugin-ref
   ```

### Hook Script Errors

```
Symptom: "PreToolUse hook error: ..." in transcript
```

1. The hook script exited with a non-zero code other than 2. Test it manually:
   ```bash
   echo '{"tool_name":"Bash","tool_input":{"command":"ls"}}' | bash hooks/scripts/sql-interceptor.sh
   echo $?  # Should be 0
   ```
2. Common causes:
   - `jq: command not found` → install jq
   - `python3: command not found` → install python3
   - Permission denied → `chmod +x` the script
   - Syntax error in bash → run `bash -n script.sh` to check

### Git: Accidentally Committed .claude/ Files

The `.gitignore` should prevent this, but if it happens:

```bash
# Remove from git tracking without deleting local files
git rm -r --cached .claude/
git commit -m "Remove .claude/ from tracking"
```
