---
root: false
targets: ["cursor", "claudecode"]
description: "GitHub PR creation rules"
cursor:
  alwaysApply: false
  description: "GitHub PR creation rules"
---

# GitHub PR Creation Rules

## Overview

This document provides rules for creating a GitHub PR, including the required description template.

## Rules

1. Always use the GitHub CLI to create the PR.
2. If the CLI is not available, provide step-by-step to install it.
3. Always follow the PR Description Template below for the PR body.

## PR Description Template

Use the following template structure for all PR descriptions, replacing the placeholders with the actual values:

```markdown
## Linear Ticket

[TICKET-ID]

## Summary

[Brief description of what was changed and why]

## Changes Made

- [Change 1]
- [Change 2]
- [Change 3]

## Benefits

- [Benefit 1]
- [Benefit 2]
- [Benefit 3]

## Files Changed

- [file/path/1]
- [file/path/2]
```

### Template Guidelines

- **Linear Ticket**: Always include the ticket ID with a link emoji
- **Summary**: Provide a concise overview of the changes and their purpose
- **Changes Made**: List specific technical changes in bullet points
- **Benefits**: Use checkmark emoji for each benefit, focusing on value delivered
- **Files Changed**: List all modified files with their full paths

### Example

```markdown
## Linear Ticket

COO-1306

## Summary

Updated MultiLocationMap component to use domain getter functions instead of direct property access. This improves consistency, type safety, and maintainability across the codebase.

## Changes Made

- Added domain imports: getSlug, getTitle, getAddress, getCenterProfileSlug
- Updated Center interface to match domain function requirements
- Replaced direct property access (center.slug, center.title, center.address) with domain getters
- Improved URL generation using getCenterProfileSlug for proper provider type handling

## Benefits

- Consistency with codebase domain-driven design patterns
- Better type safety and null/undefined handling
- Proper URL formatting based on provider type (e.g., /residential/slug/ vs /detox/slug/)
- Centralized business logic in domain layer

## Files Changed

- src/components/organisms/BrandProfileIntro/MultiLocationMap.tsx
```
