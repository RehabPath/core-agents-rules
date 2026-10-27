# Agent rules bake-off: APM vs Tessl

## Branches

| Repo | Branch | What's on it |
|---|---|---|
| core-agents-rules | `bakeoff-sample` | The same sample in both formats: `bakeoff/apm/` and `bakeoff/tessl/` |
| core-next | `bakeoff/apm` | Sample installed with APM 0.35.0 and committed |
| core-next | `bakeoff/tessl` | Sample rules removed; you run the Tessl install (steps in `BAKEOFF.md`) |

The sample is 5 rules and 1 skill, picked to cover every Cursor rule mode:

| Rule | Mode in core-next today |
|---|---|
| immutability-objects | Always |
| logging-guidelines | Always |
| unit-test | Glob `**/*.test.ts, **/*.test.tsx` |
| dependency-placement | Glob `package.json` |
| code-review | On demand (description only) |

The skill is `create-github-pr`. Repo-specific rules such as `feed-ad-placement` stay as local files on both branches.

## Scorecard

Results marked "verified" were checked by running the tool. Fill in the Tessl column after your install.

| Check | APM | Tessl |
|---|---|---|
| 1a. Cursor: glob rules keep their globs | ✅ verified: `globs:` written correctly | |
| 1b. Cursor: always-on rules stay Always | ❌ verified: `alwaysApply: true` is dropped, so they become "Apply Intelligently" | |
| 2a. Claude Code: rules load natively | ✅ verified: written to `.claude/rules/` | |
| 2b. Claude Code: path scoping works | ✅ verified (headless): the unit-test rule loaded only after a test file was read | |
| 2c. Claude Code: on-demand rule stays on demand | ⚠️ code-review becomes always loaded (about 50 lines) | |
| 3. OpenCode gets the rules and the skill | ⚠️ skill yes (`.agents/skills/`); rules no, because APM won't overwrite our hand-written AGENTS.md | |
| 4. Bots need no install step | ✅ everything is committed; Bugbot not tested | |
| 5. Local rules coexist | ✅ APM only touches files listed in its lockfile | |
| Pinned version | ✅ lockfile pins the exact commit SHA | |
| Drift check in CI | ✅ verified: `apm audit --ci` fails on a local edit; `apm install` restores the file | |
| Login or account needed | No | Yes |
| Evals | No | Yes |

Other APM notes:
- The skill is written twice, to `.claude/skills/` and `.agents/skills/`. Our AGENTS.md says to keep one copy. Check whether Cursor lists it twice.
- The 1b gap might be fixed by giving always-on rules `applyTo: "**"`. I haven't tested that.
- For OpenCode, the likely fix is an `opencode.json` whose `instructions` point at `.claude/rules/*.md`. I haven't tested that either.

## How to test locally

Run each test on both branches, with a fresh session each time, from the repo root.

**Claude Code**
1. Ask: *"Without reading any files, list the rules from `.claude/rules` or `.tessl` that are in your context right now."*
   Expect immutability and logging to be listed, and unit-test and dependency-placement not to be. Our CLAUDE.md tells Claude to read `.cursor/rules`, so the "without reading files" part matters.
2. Ask: *"Read the first 5 lines of `src/utils/checks.util.test.ts`, then tell me whether a unit-test rule is in your context."* Expect yes.
3. Ask: *"Read package.json, then tell me whether there's a rule about dependencies vs devDependencies."* Expect yes.
4. Type `/create-github-pr` (don't send it). Expect the skill to appear once.

**Cursor**: open Settings → Rules. Immutability and logging should show **Always**, and unit-test should show its glob. Also check that `create-github-pr` is listed only once.

**OpenCode** (whoever uses it): start it on each branch and ask question 1.

**Bots** (optional): open a draft PR from each branch that touches a test file. Check that Bugbot and `claude[bot]` cite the rules.

## How to decide

- If Tessl passes 1b, 2b and 4, its evals make it the winner.
- If Tessl fails 1b, 2b or 4, go with APM. Fix 1b and OpenCode with the two workarounds above, and add evals separately (promptfoo or `tessl eval run`).

## Cleanup

Delete the branches `bakeoff/apm` and `bakeoff/tessl` in core-next, and `bakeoff-sample` and `bakeoff/shared-sample` in core-agents-rules. The last one is a leftover duplicate whose delete was blocked from my side.
