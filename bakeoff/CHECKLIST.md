# Agent rules bake-off: APM vs Tessl

## Branches

| Repo | Branch | What's on it |
|---|---|---|
| core-agents-rules | `bakeoff-sample` | The same sample in both formats: `bakeoff/apm/` and `bakeoff/tessl/` |
| core-next | `bakeoff/apm` | Sample installed with APM 0.35.0 and committed, plus the `applyTo: "**"` and `opencode.json` workarounds |
| core-next | `bakeoff/tessl` | Sample installed with Tessl CLI 0.118.1 (`file:` source) and committed |

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
| 1a. Cursor: glob rules keep their globs | ✅ verified: `globs:` written correctly | ❌ verified: every `.mdc` gets a new `alwaysApply: true` header, and the original `globs:` becomes body text, so unit-test and dependency-placement become Always. `applyTo:` in the source gives the same result. **Manual:** Cursor → Settings → Rules, confirm `tessl__rule__…unit-test` shows Always |
| 1b. Cursor: always-on rules stay Always | ❌ verified: `alwaysApply: true` is dropped, so they become "Apply Intelligently". With `applyTo: "**"` APM writes `globs: **` (Apply to Specific Files, not Always). **Manual:** Cursor → Settings → Rules on `bakeoff/apm`, check the mode shown for immutability and logging, then in a chat with no files attached ask whether a logging rule is in context | ✅ verified in the files (`alwaysApply: true` is the first frontmatter). **Manual:** confirm Cursor shows Always for immutability and logging |
| 2a. Claude Code: rules load natively | ✅ verified: written to `.claude/rules/`. With `applyTo: "**"` (`paths: ["**"]`) both rules were still in context at session start (headless) | ⚠️ verified (headless): loaded through an `@import` chain. Tessl appends `@AGENTS.md` to CLAUDE.md, AGENTS.md imports `.tessl/RULES.md`, and that file imports each rule. Side effect: all of AGENTS.md now loads too |
| 2b. Claude Code: path scoping works | ✅ verified (headless): the unit-test rule loaded only after a test file was read | ❌ verified (headless): unit-test and dependency-placement are in context at session start, with frontmatter stripped |
| 2c. Claude Code: on-demand rule stays on demand | ⚠️ code-review becomes always loaded (about 50 lines) | ❌ code-review always loaded. All 5 rules (about 490 lines, 309 of them unit-test) load in every session |
| 3. OpenCode gets the rules and the skill | ⚠️ skill yes (`.agents/skills/`). Rules: `opencode.json` with `"instructions": [".claude/rules/*.md"]` now committed. It loads every rule unscoped. **Manual:** start OpenCode on `bakeoff/apm` and ask question 1 | ⚠️ Tessl has no OpenCode agent. Skill: symlink in `.agents/skills/`. Rules: only the `@.tessl/RULES.md` line in AGENTS.md, which OpenCode likely doesn't expand. **Manual:** start OpenCode on `bakeoff/tessl` and ask question 1 |
| 4. Bots need no install step | ✅ everything is committed; Bugbot not tested | ✅ `mode: vendored`, everything committed, nothing gitignored. ⚠️ The skill arrives as 3 symlinks (`.claude/`, `.cursor/`, `.agents/skills/tessl__create-github-pr` → `.tessl/plugins/…`), which break on Windows clones without `core.symlinks`. **Manual:** PowerShell user clones the branch and opens `.claude/skills/tessl__create-github-pr/SKILL.md`. Bugbot not tested |
| 5. Local rules coexist | ✅ APM only touches files listed in its lockfile | ✅ prefixes its files `tessl__rule__…` and leaves local `.mdc` files alone. It does edit CLAUDE.md, AGENTS.md and `.cursor/mcp.json`, and adds `.mcp.json` |
| Pinned version | ✅ lockfile pins the exact commit SHA | ❌ for the source that works: a `file:` source records no version or SHA, and the path (`../core-agents-rules-bakeoff`) only exists on one machine. A GitHub source pins the SHA but drops the rules (see below). A registry publish would give semver (not tested) |
| Drift check in CI | ✅ verified: `apm audit --ci` fails on a local edit; `apm install` restores the file. Needed `.prettierignore` for APM output, or the pre-commit hook causes drift | ❌ no audit command. `tessl outdated` ignored local edits. `tessl install` restores them, so `tessl install && git diff --exit-code` could work, but it needs a Tessl login in CI (not tested). Prettier rewrites `.tessl/` too (`*what*` → `_what_`) |
| Login or account needed | No | Yes, for `init` and `install`. Not for teammates who only clone. The `tessl mcp start` server added to `.mcp.json` needs the `tessl` CLI on PATH; it starts without a login (verified) |
| Evals | No | Yes (not tested) |

Tessl notes (CLI 0.118.1):
- The GitHub URL install from `BAKEOFF.md` is blocked by Tessl's install policy ("Install request did not list any skills").
  `--skill create-github-pr` gets past it, but a GitHub source ignores `.tessl-plugin/plugin.json` and builds a skills-only plugin, so no rules arrive.
  The only way to get the rules was `install file:../core-agents-rules-bakeoff/bakeoff/tessl`.
- `init` linked core-next to an existing Tessl project `recovery/core-next`.
- The skill appears once in Claude Code, as `tessl__create-github-pr`. **Manual:** check how many times Cursor lists it, since the same symlinked skill sits in `.cursor/skills/`, `.claude/skills/` and `.agents/skills/`.

Other APM notes:
- The skill is written twice, to `.claude/skills/` and `.agents/skills/`. Our AGENTS.md says to keep one copy. Check whether Cursor lists it twice.
- `applyTo: "**"` for 1b: tested, see the scorecard. Cursor gets `globs: **`, not `alwaysApply: true`.
- `opencode.json` for OpenCode: committed on `bakeoff/apm`, not yet checked in an OpenCode session.

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
