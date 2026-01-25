---
root: false
targets: ["cursor", "claudecode"]
description: "Notion pitch to Linear project conversion"
cursor:
  alwaysApply: false
  description: "Notion pitch to Linear project conversion"
---

# Shape UP Pitch to Linear Conversion Rules

## Overview

This document defines the standardized process for converting Shape UP pitches from Notion into Linear projects with proper slice organization and sub-task breakdown.

### Linear Structure

- **Project**: Overall pitch converted to project
- **Slice Issues**: 2-3 parent issues representing vertical slices
- **Sub-tasks**: Concrete actionable tasks under each slice
- **State**: Start in Backlog

## Step-by-Step Conversion Process

### Step 1: Fetch Notion Pitch

Use `mcp_Notion_notion-fetch` with the pitch URL to retrieve:

- Problem statement
- Proposed solutions (prioritized)
- Appetite/timeline
- Success metrics
- Example pages
- Rabbit holes (risks)
- No-gos (out of scope)

### Step 2: Create Linear Project

**Title Format**: Use exact pitch name from Notion

**Description Template**:

```markdown
# [Pitch Name]

**Shape UP Pitch**: [Link to Notion]

## Background Context

[Summary of why this matters now, recent changes, or context]

**Example Pages:**

- [List relevant pages/URLs]

## Problem Statement

[What user problem are we solving? Why does it matter?]

**Missing/Broken:**

- [Specific issues]
- [Pain points]

## Solution Overview

[High-level approach to solving the problem]

[Numbered list of main features/improvements]:

1. **[Feature 1]** - [Brief description]
2. **[Feature 2]** - [Brief description]
3. **[Feature 3]** - [Brief description]

## User Story

As a [user type], I can [capability], so that [benefit].

## Appetite

**[X weeks]**

## Success Metrics

- [Measurable outcome 1]
- [Measurable outcome 2]

## Departments Affected

- [Department 1] - [Why/how]
- [Department 2] - [Why/how]

## Important Considerations

**Rabbit Holes:**

- [Risk or unknown that needs attention]

**No-Gos:**

- [What's explicitly out of scope]
```

### Step 3: Identify Slices

**Analyze the pitch to determine 2-3 slices**

#### Slice Selection Criteria

**Slice 1 - Core Value (MOST CRITICAL)**:

- Solves the PRIMARY user pain point
- Can ship independently and deliver value
- Provides measurable user improvement
- Ideally simple to implement (high impact/effort ratio)
- No complex dependencies

**Slice 2 - Supporting Value**:

- Enhances Slice 1
- Provides navigation, discovery, or context
- Makes the experience more complete
- Can ship after Slice 1

**Slice 3 - Optimization**:

- Revenue generation
- Performance improvements
- Polish and refinement
- Can ship last

### Step 4: Create Slice Issues in Linear

**Title Format**: Descriptive: "Slice 1: Quality Results"

### Step 5: Create Sub-Tasks

**Title Format**: `[Type]: [Specific Action]`

Types:

- **Investigate**: Research, discovery, evaluation
- **Implement**: Code changes, configuration, feature addition
- **Test**: Verification, QA, validation
- **Design**: Architecture, query design, system design

## Writing Guidelines

### Problem Statements

- **Start with user impact**: "Users see low-quality centers first"
- **Explain business impact**: "Results in poor treatment connections"
- **Be specific**: Not "experience is bad" but "centers sorted by distance only"
- **Keep concise**: 1-3 sentences

### Solution Descriptions

- **Action-oriented**: "Add aroundPrecision to Algolia config"
- **Explain mechanism**: "This enables quality-based sorting within radius"
- **Link to outcome**: "High-quality centers appear first"
- **Be concrete**: Not "improve quality" but "sort by Score/AdRank"

## Common Patterns

### Typical Slice Breakdown

**Pattern 1: UX → Content → Revenue**

- Slice 1: Core UX fix (quality, usability)
- Slice 2: Content and navigation
- Slice 3: Revenue and optimization

**Pattern 2: Happy Path → Edge Cases → Polish**

- Slice 1: Main user flow working
- Slice 2: Handle edge cases and errors
- Slice 3: Performance and polish

**Pattern 3: Foundation → Features → Enhancement**

- Slice 1: Core infrastructure/data
- Slice 2: User-facing features
- Slice 3: Additional functionality
