---
name: create-github-pr
description: Create GitHub pull requests using the project standard title and body format, open them as draft, and hand the Linear ticket off to QA or Tech Review. Use when asked to open a PR, prepare a PR description, update PR metadata, mark a draft PR ready for review, hand a PR off to a reviewer, or when QA has passed on a draft PR. Covers both developer-driven sessions and PRs Claude authors on its own (Claude Tag, unattended agents).
---

# Create GitHub PR

## Purpose

Create PRs that consistently follow team conventions for:

- PR title format
- PR body structure
- missing-ticket fallback behavior
- draft-first creation and the QA / review decision
- keeping the Linear ticket (state, assignee, `dev-*` label) in sync with the PR

## When To Use

Use this skill when the user asks to:

- create a pull request
- draft or improve a PR title
- draft or improve a PR body
- align an existing PR to team PR standards
- mark a draft PR ready for review, or report that QA passed (jump to [Step 5](#step-5-pick-the-reviewer))

## Step 0: Identify the Mode

| Mode                 | When                                                                                                  | Who answers questions              |
| -------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------- |
| **Developer-driven** | A developer is in the session (Cursor, Claude Code driven by a human)                                 | The developer, in the session      |
| **Claude-authored**  | Claude opened the work on its own: Claude Tag in Slack (e.g. a #tech-requests fix), unattended agents | The requester, in the Slack thread |

Whenever Claude writes the commits or the PR (either mode), end commit messages and the PR body with the attribution lines the harness specifies (e.g. `Co-Authored-By: Claude …` trailer and `🤖 Generated with [Claude Code](https://claude.com/claude-code)`).

**Never proceed on an unanswered question.** If a question times out or goes unanswered, leave the PR as draft and the ticket where it is, and say so. Decision-shaped calls (QA vs review, who reviews) belong to a person.

## Step 1: Resolve the Linear Ticket

1. Take the ticket ID from the branch name (Linear branch names look like `nicasio/soft-4836-short-title`; match `[A-Za-z]+-\d+` and uppercase it) or from the conversation. Otherwise ask.
2. Confirm the ticket exists with the Linear MCP `get_issue`. Note its current state, assignee and labels; later steps need them.

If no ticket exists:

- **Developer-driven:** offer to create one (see `.cursor/rules/single-ticket-creation.mdc`). If the developer declines, continue following the PR quality guidelines for title/body, tell them explicitly that a ticket should exist for the PR, and recommend updating the PR title to `[TICKET-ID] ...` once it does.
- **Claude-authored:** a ticket is **required**. Create one (or ask the requester which ticket to use) before opening the PR.

## Step 2: Pre-Flight

1. **Branch from `staging`** — never from `main`. Before creating a feature branch, run `git checkout staging && git pull origin staging`. PRs target `staging` as the base branch.
   - **Stacked PRs are the exception.** When the work builds on an unmerged PR, branch from that parent branch and pass it as `--base`. Each PR then reviews only its own diff. Retarget a stacked PR down to the next base as its parent merges, and keep the stack in sync with one `git rebase --update-refs` plus one atomic push — a sibling's base never moves on its own.
2. Use GitHub CLI (`gh`) for PR creation and PR metadata updates. If `gh` is unavailable, provide clear installation steps before continuing.
3. Run `pnpm lint` and `pnpm test`, and fix failures before opening the PR.
4. **Run an AI review before creating or updating the PR.** In Claude Code use `/code-review`; in Cursor use the code-reviewer subagent. Resolve any findings before opening or re-requesting human review. This catches obvious issues first and respects reviewers' time.
5. **Check PR size.** The cap measures **source** lines only — tests, docs, SVGs, lockfiles and generated files don't count. `<base>` is `staging`, or the parent branch for a stacked PR.

   ```bash
   # Source lines — this is what the 400 cap measures
   git diff --stat origin/<base>...HEAD -- . \
     ':(exclude)*.test.ts' ':(exclude)*.test.tsx' \
     ':(exclude)*.spec.ts' ':(exclude)*.spec.tsx' \
     ':(exclude)**/__tests__/**' ':(exclude)**/__mocks__/**' \
     ':(exclude)*.mock.ts' ':(exclude)*.md' ':(exclude)*.svg' \
     ':(exclude)jest.setup.*' ':(exclude)pnpm-lock.yaml'

   # Full diff, for context
   git diff --stat origin/<base>...HEAD
   ```

   Report both numbers ("source X lines, tests and docs Y lines"). Warn and suggest splitting into stacked PRs only when the **source** number reaches 400. Aim for ~100 source lines. Justify exceptions in the PR description.

6. Validate both title and body (see [PR Title Standard](#pr-title-standard) and [PR Body Template](#pr-body-template)).

## Step 3: Create the PR as Draft

**Always open the PR as a draft**, targeting `staging` (or the parent branch for a stacked PR). Use a heredoc body with `gh pr create`:

```bash
gh pr create --draft --base staging --title "[TICKET-ID] One-line summary" --body "$(cat <<'EOF'
## Linear Ticket

🔗 [TICKET-ID]

## Summary

[Brief description of what was changed and why]

## Changes Made

- [Change 1]

## Benefits

✅ [Benefit 1]

## Files Changed

- [file/path/1]
EOF
)"
```

The ticket ID in the branch name and title is what links the PR to the Linear ticket through the Linear GitHub integration.

## Step 4: Ask — Ready for Review, or QA First?

Ask the developer (developer-driven) or the requester in the Slack thread (Claude-authored):

> Is [TICKET-ID] ready for review, or does it need QA first?

- **QA first:**
  1. Leave the PR as draft.
  2. Move the Linear ticket to **QA** (`save_issue` with `state: "QA"`). Leave the assignee unchanged.
  3. Tell the developer to come back to this skill ("QA passed, mark it ready") once QA passes. That re-entry starts at Step 5.
- **Ready for review:** continue to Step 5.

## Step 5: Pick the Reviewer

- **Developer-driven:** ask who the reviewer is. Offer the code owner found with the criteria below as the suggested default, but the developer decides.
- **Claude-authored:** The reviewer is **the owner of the changed code**: the most recent substantive author of the lines and files the PR touches. Exclude the PR author, Claude and bots. If two people are equally likely, or the owner has left the team (inactive in Linear), ask in the thread instead of guessing.

Finding the code owner:

```bash
# Files the PR touches (<base> is staging, or the parent branch for a stacked PR)
git diff --name-only origin/<base>...HEAD

# Who last changed each file on staging (merge subjects carry the PR number)
git log origin/staging -n 10 --format='%an <%ae> %s' -- <file>

# Who wrote the specific lines being changed
git blame -w -L <start>,<end> origin/staging -- <file>
```

Resolve the reviewer's identities (no hard-coded roster):

- **Linear user:** Linear MCP `list_users` with the reviewer's name or email.
- **GitHub login:** `gh api "repos/RehabPath/core-next/commits?author=<email>&per_page=1" --jq '.[0].author.login'`

## Step 6: Hand Off for Review

Do all of these together, without asking again:

1. Mark the PR ready: `gh pr ready <number>`
2. Request the reviewer on GitHub: `gh pr edit <number> --add-reviewer <github-login>`
3. Update the Linear ticket with one `save_issue` call:
   - `state: "Tech Review"`
   - `assignee`: the reviewer. The Linear assignee is whoever has the next action; the `dev-*` label keeps authorship.
   - `addLabels`: the developer label (below)

Developer label (the `dev-assign` label group is single-select, one `dev-*` per ticket):

- **Developer-driven:** `dev-{first name}` of the developer driving the session (e.g. `dev-nicasio`). Check that it exists with `list_issue_labels` (team `Core`, `includeGroups: true`, children of `dev-assign`). If there is no exact match (e.g. `dev-nico` vs `dev-nicasio`), ask; never create a new one.
- **Claude-authored:** `dev-claude`.
- If the ticket already carries a **different** `dev-*` label, ask before replacing it.

Finally, confirm the PR appears on the Linear ticket (the integration attaches it). If it doesn't, add it with `save_issue` `links`.

## Step 7: Claude-Authored Extras

When the PR is Claude-authored, also:

1. Watch CI until it finishes: `gh pr checks <number> --watch`. Fix failures you caused; report ones you can't fix (e.g. infra, flaky tests) instead of hiding them.
2. Post a short summary in the Slack thread: PR link, Vercel preview URL, draft/ready state, reviewer (and why, e.g. "owns this file per recent PR history"), CI status, and anything that couldn't be verified.

## PR Title Standard

Use this exact format:

```text
[TICKET-ID] One-line summary
```

### Title Rules

- Start with the ticket ID in square brackets.
- Keep the summary concise and outcome-focused.
- Do not use vague summaries like "fixes" or "updates stuff".

### Valid Examples

- `[COO-1532] Remove Ads disclaimer for Nearby and Similar Centers`
- `[SUP-1598] Resolve center phone numbers via hasTrackingNumber rule`
- `[SOFT-3566] Add facility to VOB submissions`
- `[SUP-1757] Extract SearchStateContext to replace prop drilling`

## PR Body Template

Use this structure:

```markdown
## Linear Ticket

🔗 [TICKET-ID]

## Summary

[Brief description of what was changed and why]

## Changes Made

- [Change 1]
- [Change 2]
- [Change 3]

## Benefits

✅ [Benefit 1]
✅ [Benefit 2]
✅ [Benefit 3]

## Files Changed

- [file/path/1]
- [file/path/2]
```

## Author Checklist

### Before opening the PR

- PR is under 400 source lines — tests, docs and SVGs excluded (or the exception is justified in the description)
- Linked to a ticket that has an Overview and QA & Testing notes (if no ticket exists, warn the user and recommend creating one)
- Ticket ID is in the PR title
- Description explains the _why_
- Tests included for the change (when applicable — config-only or docs-only PRs may have no test target)
- Ran an AI review and resolved its findings
- Branch was created from `staging`, or from the parent branch for a stacked PR (never from `main`)
- PR targets that same base branch
- PR is opened as a draft

### After opening the PR

- Asked whether the ticket is ready for review or needs QA first
- QA first: PR still draft, ticket in **QA**, assignee unchanged
- Ready: PR marked ready, reviewer requested on GitHub, ticket in **Tech Review**, assigned to the reviewer, `dev-*` label added
- Automated review comments resolved
