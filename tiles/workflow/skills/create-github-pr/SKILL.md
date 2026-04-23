---
name: create-github-pr
description: Create GitHub pull requests using the project standard title and body format. Use when asked to open a PR, prepare a PR description, or update PR metadata and ensure ticket-first naming.
---

# Create GitHub PR

## Purpose

Create PRs that consistently follow team conventions for:

- PR title format
- PR body structure
- missing-ticket fallback behavior

## When To Use

Use this skill when the user asks to:

- create a pull request
- draft or improve a PR title
- draft or improve a PR body
- align an existing PR to team PR standards

## Required Workflow

1. Use GitHub CLI (`gh`) for PR creation and PR metadata updates.
2. If `gh` is unavailable, provide clear installation steps before continuing.
3. Validate both title and body before creating/updating the PR.

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

## No Ticket Available

If no ticket exists:

1. Continue following PR quality guidelines for title/body.
2. Tell the user explicitly that a ticket should exist for the PR.
3. Recommend creating a ticket and then updating the PR title to `[TICKET-ID] ...`.

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

## PR Creation Command Pattern

Use a heredoc body with `gh pr create`:

```bash
gh pr create --title "[TICKET-ID] One-line summary" --body "$(cat <<'EOF'
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

## Quality Checklist

- Title matches `[TICKET-ID] One-line summary`
- Body follows all required sections
- File list reflects actual modified files
- User is warned if ticket is missing
