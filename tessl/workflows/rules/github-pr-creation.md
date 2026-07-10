# GitHub PR Creation Rules

## Overview

This document provides rules for creating a GitHub PR, including the required title format and PR description template.

## Rules

1. **Always branch from `staging`** — never from `main`. Run `git checkout staging && git pull origin staging` before creating any feature branch. PRs must target `staging` as the base branch.
2. Always use the GitHub CLI to create the PR.
3. If the CLI is not available, provide step-by-step to install it.
4. Always use the required PR title format: `[TICKET-ID] One-line summary`.
5. Always follow the PR Description Template below for the PR body.
6. If no ticket exists, still follow these guidelines and explicitly tell the user a ticket should be created for the PR.

## PR Title Format

Use the following required title format for all PRs:

```text
[TICKET-ID] One-line summary
```

### Title Guidelines

- Start with the ticket ID in square brackets (for example, `[COO-1532]`).
- Follow with a concise one-line summary of what was delivered.
- Keep the summary specific and outcome-focused.

### Valid Title Examples

- `[COO-1532] Remove Ads disclaimer for Nearby and Similar Centers`
- `[SUP-1598] Resolve center phone numbers via hasTrackingNumber rule`
- `[SOFT-3566] Add facility to VOB submissions`
- `[SUP-1757] Extract SearchStateContext to replace prop drilling`

### No Ticket Available

If a ticket is not available:

- Follow the PR title/body quality guidelines anyway.
- Tell the user that a ticket should exist for the PR.
- Recommend creating a ticket and updating the PR title to the required `[TICKET-ID] ...` format once available.

## PR Description Template

Use the following template structure for all PR descriptions, replacing the placeholders with the actual values:

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

### Template Guidelines

- **Title**: Use `[TICKET-ID] One-line summary` and keep it clear, concise, and outcome-focused
- **Linear Ticket**: Always include the ticket ID with a link emoji (🔗)
- **Summary**: Provide a concise overview of the changes and their purpose
- **Changes Made**: List specific technical changes in bullet points
- **Benefits**: Use checkmark emoji (✅) for each benefit, focusing on value delivered
- **Files Changed**: List all modified files with their full paths

### Example

```markdown
## Linear Ticket

🔗 COO-1306

## Summary

Updated MultiLocationMap component to use domain getter functions instead of direct property access. This improves consistency, type safety, and maintainability across the codebase.

## Changes Made

- Added domain imports: getSlug, getTitle, getAddress, getCenterProfileSlug
- Updated Center interface to match domain function requirements
- Replaced direct property access (center.slug, center.title, center.address) with domain getters
- Improved URL generation using getCenterProfileSlug for proper provider type handling

## Benefits

✅ Consistency with codebase domain-driven design patterns
✅ Better type safety and null/undefined handling
✅ Proper URL formatting based on provider type (e.g., /residential/slug/ vs /detox/slug/)
✅ Centralized business logic in domain layer

## Files Changed

- src/components/organisms/BrandProfileIntro/MultiLocationMap.tsx
```
