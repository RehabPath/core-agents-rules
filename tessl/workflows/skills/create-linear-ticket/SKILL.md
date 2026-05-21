---
name: create-linear-ticket
description: Create a single Linear ticket with proper title format, codebase research, and implementation details. Use when asked to create a ticket, file an issue, or capture a task in Linear.
---

# Create Linear Ticket

## Purpose

Create well-structured Linear tickets that include codebase context, so engineers can start work immediately without additional investigation.

## When To Use

Use this skill when the user asks to:

- Create a ticket in Linear
- File an issue or task
- Capture a bug, feature, or improvement in Linear

## Required Workflow

### Step 1: Understand the request

Clarify with the user if needed:

- What needs to be done and why
- Whether this is UI work, backend work, or both
- Any known files, endpoints, or areas of the codebase involved

### Step 2: Research the codebase

Before creating the ticket, search the codebase for:

- **Existing patterns**: Similar implementations to follow
- **Files to modify**: Specific paths that will likely change
- **Utilities and hooks**: Existing helpers that should be reused
- **TypeScript types**: Interfaces that may need updates
- **Test files**: Related tests to understand testing expectations

Include findings in the ticket under an "Implementation Details" section.

### Step 3: Build the ticket

**Title format:**

```
[UI | Backend]: [Short action or outcome]
```

**Body format:**

```markdown
## Overview

Brief summary of what needs to be done and why.

## Implementation Details

### Files to modify

- `path/to/file.ts` - Description of changes

### Existing patterns to follow

Reference existing code, hooks, or utilities that should be used.

## 🔍 QA & Testing notes

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

Skip any section where the information is not available.

### Step 4: Create via Linear MCP

Use the Linear MCP server (`mcp_Linear_save_issue`) to create the ticket.

- State: **Shaping** or **Backlog**
- Team: as specified by the user, or ask if unclear

### Step 5: Summarize

After creation, provide:

- A summary of what the ticket covers
- A direct link to the ticket
- A prompt for the user to review and adjust it
