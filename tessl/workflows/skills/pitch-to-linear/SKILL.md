---
name: pitch-to-linear
description: Convert a Shape Up pitch from Notion into a Linear project with slices and sub-tasks. Use when given a Notion pitch URL and asked to set up the Linear project.
---

# Pitch to Linear

## Purpose

Convert a Shape Up pitch into a structured Linear project: one project, 2–3 vertical slices, and concrete sub-tasks per slice — all in Backlog state.

## When To Use

Use this skill when the user provides a Notion pitch URL and asks to:

- Set up the Linear project for a pitch
- Convert a Shape Up doc to Linear
- Break a pitch into slices and tickets

## Required Workflow

### Step 1: Fetch the Notion pitch

Use the Notion MCP (`mcp_Notion_notion-fetch`) with the pitch URL to retrieve:

- Problem statement
- Proposed solutions
- Appetite / timeline
- Success metrics
- Example pages / URLs
- Rabbit holes (risks)
- No-gos (out of scope)

### Step 2: Create the Linear project

Use `mcp_Linear_save_project`.

**Title**: exact pitch name from Notion

**Description template:**

```markdown
# [Pitch Name]

**Shape UP Pitch**: [Notion URL]

## Background Context

[Why this matters now, recent changes, or relevant context]

**Example Pages:**

- [List relevant pages/URLs]

## Problem Statement

[What user problem are we solving? Why does it matter?]

**Missing/Broken:**

- [Specific issues or pain points]

## Solution Overview

[High-level approach]

1. **[Feature 1]** - [Brief description]
2. **[Feature 2]** - [Brief description]

## User Story

As a [user type], I can [capability], so that [benefit].

## Appetite

**[X weeks]**

## Success Metrics

- [Measurable outcome 1]
- [Measurable outcome 2]

## Departments Affected

- [Department] - [Why/how]

## Important Considerations

**Rabbit Holes:**

- [Risk or unknown]

**No-Gos:**

- [Explicitly out of scope]
```

**Settings**: Team = Core (or as specified), State = Backlog.

### Step 3: Identify 2–3 slices

Analyze the pitch to determine vertical slices. Each slice delivers user value independently.

**Slice 1 — Core Value (most critical)**:

- Solves the primary user pain point
- Ships independently with measurable impact
- No complex dependencies on other slices

**Slice 2 — Supporting Value**:

- Enhances or completes Slice 1
- Adds navigation, discovery, or context

**Slice 3 — Optimization** (if needed):

- Revenue, performance, or polish
- Can ship last

Common patterns:

- UX → Content → Revenue
- Happy Path → Edge Cases → Polish
- Foundation → Features → Enhancement

### Step 4: Create slice issues

For each slice, use `mcp_Linear_save_issue` with `parentId` set to the project.

**Title**: `Slice [N]: [Short label]`

**Description template:**

```markdown
[Brief context: what this slice delivers and how it fits the broader project.]

## Goals

**What value does this slice deliver?**

- [User outcome]

**What does "done" look like?**

- [Completion criteria]

## Technical Scope & Boundaries

**Approach:**

- [Key technical direction or files involved]

**Assumptions:**

- [What we're assuming]

**NOT included in this slice:**

- [Explicitly deferred]
```

**Settings**:

- State: Backlog
- Priority: Slice 1 = High/Urgent, Slice 2–3 = Medium
- Link to parent project
- Team: same as project

### Step 5: Create sub-tasks

For each feature within a slice, create sub-tasks using `mcp_Linear_save_issue` with `parentId` set to the slice issue (not the project).

**Title format**: `[Type]: [Specific Action]`

Types: `Investigate` | `Implement` | `Test` | `Design`

**Implementation/Investigation template:**

```markdown
## Description

[Context: why this work exists and what problem it solves]

## Details

**File**: `path/to/file.ts`

- [Specific action]
- [Technical guidance]

## Acceptance Criteria

- [Success criterion 1]
- [Success criterion 2]
```

**Test task template:**

```markdown
## Description

[What is being tested and why]

## Test Pages

- [Page/URL]

## QA Instructions

1. [Step-by-step procedure]
2. [What to verify]

## Expected Result

- [What should happen]
- [Success criteria]
```

**Sub-task targets per slice:**

- 2–4 Investigate tasks (understand before building)
- 3–6 Implement tasks (actual work)
- Each task completable in 1–2 days

### Step 6: (Optional) Enhance with codebase context

If codebase access is available, search for related implementations and add to sub-task descriptions:

- Specific file paths and line numbers
- Current implementation notes
- Root cause analysis
- Code patterns to follow

### Step 7: Validate before finishing

Run through this checklist:

**Project:**

- [ ] Title matches pitch name exactly
- [ ] All description sections present
- [ ] Notion URL linked
- [ ] State = Backlog

**Slices:**

- [ ] Slice 1 solves the most painful problem and ships independently
- [ ] Slices ordered: Core Value → Supporting → Optimization
- [ ] Each slice organized by user value, not technical layer
- [ ] Each slice explicitly states what is NOT included

**Sub-tasks:**

- [ ] All are actual Linear sub-tasks with `parentId` (not description checklists)
- [ ] Each scoped to 1–2 days max
- [ ] Implementation tasks have specific file paths
- [ ] Test tasks have QA instructions and expected results
- [ ] Every feature in each slice description has corresponding sub-tasks
