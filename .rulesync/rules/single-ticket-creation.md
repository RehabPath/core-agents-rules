---
root: false
targets: ["cursor", "claudecode"]
description: "Single Linear ticket creation rules"
cursor:
  alwaysApply: false
  description: "Single Linear ticket creation rules"
---

# Single Linear Ticket Creation Rules

## Overview

This document provides rules for creating a single Linear ticket.

## Rules

1. Always use the Linear MCP server to create the ticket.
2. Always search the codebase for related code before creating a ticket. Include relevant file paths, existing patterns, utilities, or hooks that should be used or modified in the implementation details.
3. Always create the ticket in Shaping status or backlog status.
4. If you cant find the information you need, skip the section of the template that is not applicable.
5. After Ticket Creation, provide the following information:

- Provide a summary of the ticket.
- Provide a link to the ticket.
- Tell the user to review the ticket.

## Codebase Research

Before creating a ticket, search for:

- **Existing patterns**: Find similar implementations in the codebase to follow
- **Related files**: Identify files that will need to be modified
- **Utilities and hooks**: Find existing utilities, hooks, or helpers that should be reused
- **Types and interfaces**: Locate relevant TypeScript types that may need updates
- **Test patterns**: Find related test files to understand testing expectations

Include these findings in the ticket body under an "Implementation Details" section with:

- File paths to modify
- Existing patterns or utilities to follow/reuse
- Code examples when helpful

## Title Format

```
[UI | Backend]: [Short action or outcome]
```

## Body Format

```
## Overview

Brief summary of what needs to be done and why.

## Implementation Details

### Files to modify
- `path/to/file.ts` - Description of changes

### Existing patterns to follow
Reference existing code, hooks, or utilities that should be used.

## QA & Testing notes

### Manual testing steps
- Step 1
- Step 2

### Expected behavior/edge cases
- Edge case 1
- Edge case 2

### Page types to check
Profile, Term, Location, Facet, Browse, Blog (as applicable)

## Related Links

(Figma, pitch doc, Slack thread)
```

If you cant find the information you need, skip the section of the template that is not applicable.
