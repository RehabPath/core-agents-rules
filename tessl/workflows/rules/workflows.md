## Bug Workflow

# Bug Workflow

This rule applies when working on bug tickets. A ticket is considered a bug when:

- The Linear ticket has the "Bug" label
- The ticket description indicates unexpected behavior or regression
- The user explicitly states they are working on a bug

## Workflow Steps

### 1. Bug Identification

Before starting work, confirm the issue is a bug:

- Check if the Linear ticket is labeled as "Bug"
- Review the ticket description for bug indicators (unexpected behavior, regression, wrong output)
- If unclear, ask the user to clarify whether this is a bug or a feature request

### 2. Reproduction First (Test-Driven)

**Always write a failing test BEFORE attempting to fix the bug.**

1. Create a test case that reproduces the exact bug scenario
2. Use actual failing data from the ticket (specific IDs, coordinates, inputs, etc.)
3. Run the test to confirm it fails as expected
4. The failing test output should match the bug description

For test writing standards, follow the Unit Testing section in the `recovery/testing` tile.

### 3. Root Cause Analysis

After confirming the test fails:

1. Analyze the test output to understand the actual vs expected behavior
2. Trace the data flow through the code to identify where the issue occurs
3. Document the root cause in the fix (via comments or commit message)

### 4. Fix Implementation

When implementing the fix:

- Make the **minimal change** required to make the test pass
- Avoid over-engineering or unrelated refactoring
- Follow existing code patterns and style guidelines
- Add comments explaining the fix if the logic is non-obvious

### 5. Verification

After implementing the fix:

1. Run the new test to confirm it passes
2. Run related tests to check for regressions
3. Check for linting errors with `read_lints`
4. If the bug involves UI, verify visually using browser tools

## Anti-Patterns to Avoid

- ❌ Fixing the bug without a test first
- ❌ Writing tests after the fix is implemented
- ❌ Using placeholder data instead of actual failing data from the ticket
- ❌ Making unrelated changes while fixing the bug
- ❌ Skipping regression testing

## Example Workflow

For a bug like "UK map pin showing in Canada instead of London":

1. **Identify**: Ticket has "Bug" label, describes wrong map pin location
2. **Reproduce**: Write test with actual UK coordinates from ticket (lat: 51.5181891, lng: -0.1468136)
3. **Analyze**: Test fails showing coordinates parsed incorrectly (-0.1468136 becomes -1468136)
4. **Fix**: Update parsing function to correctly handle small decimal values
5. **Verify**: New test passes, existing coordinate tests still pass, no lint errors

---

## Code Review

## Code Quality Standards

1. **Linking to Center Profiles**: When creating a link to a center profile, use the getCenterProfileSlug function in "/src/domain/center/center.ts"
2. **Ghost API**: Never expose the Ghost API key in the frontend; use the backend to fetch data
3. **File Naming**: Component files and directories use PascalCase, all other files and directories use camelCase

## Testing Requirements

1. **Test Coverage**: New features should include appropriate tests
2. **Test File Naming**: Test files should end with .test.ts
3. **Test Quality**: Tests should be meaningful and cover edge cases

## Security & Performance

1. **Security**: No hardcoded secrets, proper input validation
2. **Performance**: No obvious performance regressions
3. **Dependencies**: New dependencies should be justified and secure

## React/Frontend Specific

1. **Component Structure**: Prefer functional components over class components
2. **CSS Classes**: Use Tailwind with proper classname order
3. **State Management**: Proper use of React hooks and state management

## Search Engine Optimization (SEO)

1. **Canonical URLs**: Every public-facing page should have a canonical URL to prevent duplicate content issues. Always use an absolute URL that includes the protocol and domain (e.g., https://example.com/page/). Internal-only pages, like admin or login pages, should not have a canonical URL.
2. **Meta Tags**: All new pages or templates should include dynamic and descriptive meta titles and descriptions. The meta title should be under 60 characters, and the meta description should be between 150-160 characters.
3. **Robots Meta Tag**: The <meta name="robots" content="..."> tag should be carefully considered. It should not be used with a noindex or nofollow value unless there is an explicit reason (e.g., a login page, search results page, or staging environment).
4. **Internal Links**: Don't use the nofollow attribute on internal links, as this prevents search engines from crawling your site effectively.
5. **External Links**: When linking to an external site with target="\_blank", include rel="noopener noreferrer nofollow" for security and to avoid passing link equity. Use rel="sponsored" for paid or advertising links.
6. **Image Alt Text**: All images should have a descriptive alt attribute that accurately describes the image's content. This is crucial for accessibility and image search ranking.
7. **Heading Structure**: Use a logical heading hierarchy to structure content. Each page should have one and only one <h1> tag, followed by <h2>, <h3>, and so on. Never skip a heading level.
8. **Schema Markup**: New content types (e.g., articles, products, events) should include appropriate JSON-LD Schema markup to provide context to search engines. For example, use MedicalOrganization for treatment centers, Article for blog posts, or FAQPage for FAQ sections. Properties like url and image should use fully qualified URLs (absolute URLs) to be most effective.
9. **Server-Side Rendering (SSR)**: Ensure that all SEO-critical content, especially links, is available at build time, not fetched on the client-side after the page loads. This means avoiding data fetching within useEffect hooks. Instead, use Gatsby's Page queries, Static queries, or getServerData for data fetching that happens on the server, making the content visible to search engine crawlers.
10. **Button vs. Anchor Semantics**: Use <a> tags for navigation, as search engines can follow these links. Use <button> tags for actions, such as submitting a form or opening a modal. Search engines cannot follow buttons. For links with dynamic content, use an <a> tag if the total number of items is above a certain threshold (e.g., 20 insurance centers, 10 locations). If below this threshold, a <span> or a button is acceptable.

---

## GitHub PR Creation

# GitHub PR Creation Rules

## Overview

This document provides rules for creating a GitHub PR, including the required title format and PR description template.

## Rules

1. Always use the GitHub CLI to create the PR.
2. If the CLI is not available, provide step-by-step to install it.
3. Always use the required PR title format: `[TICKET-ID] One-line summary`.
4. Always follow the PR Description Template below for the PR body.
5. If no ticket exists, still follow these guidelines and explicitly tell the user a ticket should be created for the PR.

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

---

## Shape Up to Linear Conversion

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

**Project Settings**:

- Team: Core (or as specified)
- State: Backlog
- Include all context from pitch

### Step 3: Identify Slices

**Analyze the pitch to determine 2-3 slices**

#### Slice Selection Criteria

**Slice 1 - Core Value (MOST CRITICAL)**:

- ✅ Solves the PRIMARY user pain point
- ✅ Can ship independently and deliver value
- ✅ Provides measurable user improvement
- ✅ Ideally simple to implement (high impact/effort ratio)
- ✅ No complex dependencies

**Questions to identify Slice 1**:

- What hurts users MOST right now?
- What's the simplest thing that would make a real difference?
- What delivers value even if nothing else ships?
- What can we validate success on immediately?

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

#### Example: Zero Result Page Parity

**Analysis**:

- Core pain: Users see low-quality centers sorted by distance only
- Core fix: Sort by quality + show featured centers at top
- Supporting: Navigation to other locations, content discovery
- Optimization: Ads for revenue, SSR for performance

**Result**:

- Slice 1: Radius precision + Featured carousel
- Slice 2: Top Treatment Locations + Explore Block
- Slice 3: MidFeed Ads + SSR

### Step 4: Create Slice Issues in Linear

**For each slice, create a parent issue**

**Title Format**:

- Descriptive: "Slice 1: Quality Results"

**Description Template**:

```markdown
Briefly describe what this slice is, what problem it solves, and where it fits in the broader pitch or project. Mention the project name if applicable.

Example: This slice delivers the core functionality for [feature], allowing users to [main outcome]. It's part of the [Project Name] and represents one of several vertical slices.

## Goals

**What specific value does this slice deliver?**

- [Value delivered to users]
- [Outcome or capability enabled]

**What does "done" look like for this slice?**

- [Specific completion criteria]
- [Shippable outcome]

Example: User can see high-quality treatment centers sorted by quality instead of distance on zero-result pages.

## Technical Scope & Boundaries

**Architectural approach:**

- [Key technical approach or pattern]
- [Files/components to modify]

**Assumptions or constraints:**

- [What we're assuming is true]
- [Constraints we're working within]

**What is NOT included in this slice:**

- [Explicitly out of scope]
- [Deferred to other slices]
```

**Slice Settings**:

- State: Backlog
- Priority:
  - Slice 1: High (2) or Urgent (1)
  - Slice 2: Medium (3)
  - Slice 3: Medium (3) or Low (4)
- Project: Link to parent project
- Team: Same as project

**Keep it Simple**:

- No detailed technical analysis in slice description
- Just problem → solution

### Step 5: Create Sub-Tasks

**For each feature in the slice, create sub-tasks**

**Title Format**: `[Type]: [Specific Action]`

Types:

- **Investigate**: Research, discovery, evaluation
- **Implement**: Code changes, configuration, feature addition
- **Test**: Verification, QA, validation
- **Design**: Architecture, query design, system design

**Description Templates**:

**For Implementation/Investigation Tasks**:

```markdown
## Description

[Context: Why this work is needed and what problem it solves]

[Problem statement if applicable]

## Details

**File/Component**: [Specific path]

[Specific actions to take]:

- [Action 1]
- [Action 2]

[Technical guidance or code snippets if helpful]

## Acceptance Criteria

- [Success criterion 1]
- [Success criterion 2]
- [Success criterion 3]
```

**For Test Tasks**:

```markdown
## Description

[What is being tested and why]

## Test Pages

- [Page/URL 1]
- [Page/URL 2]

## QA Instructions

1. [Step-by-step procedure]
2. [How to verify]
3. [What to check]

## Expected Result

- [What should happen]
- [Success criteria]
- [How to validate]
```

**Sub-Task Settings**:

- State: Backlog
- Team: Same as parent
- Parent: Link to slice issue (not project)
- Keep descriptions focused and actionable

**Sub-Task Breakdown Guidelines**:

- 2-4 Investigate tasks per slice (understand before building)
- 3-6 Implement tasks per slice (actual work)
- Each task completable in 1-2 days
- Tasks should be independent where possible

### Step 6: Analyze Codebase

**When to do this**: If you have access to the codebase and time

**Process**:

1. Search for related implementations using `codebase_search`
2. Find relevant files and components
3. Understand current patterns
4. Add technical findings to sub-task descriptions:
   - Specific file paths
   - Line numbers for key code
   - Explanation of current implementation
   - Guidance for changes needed

**What to add**:

- Root cause analysis
- Files to modify
- Code patterns to follow
- Integration points
- Test coverage considerations

**Example Enhancement**:

```markdown
## Technical Details

**Current Implementation** (`src/path/to/file.ts`, lines X-Y):
[Code reference or explanation]

**Root Cause**:
[Why the problem exists]

**Solution**:
[What needs to change]

**Files to Modify**:

1. `src/path/file1.ts` - [What to change]
2. `src/path/file2.ts` - [What to change]
```

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

### What's Included Lists

- Use bullet points with issue identifiers
- Keep descriptions short (one line each)
- Format: `* SOFT-XXXX: [Feature name] - [Brief what]`
- Example: `* SOFT-1984: Radius precision search - Sort by quality within radius`

### Sub-Task Descriptions

- **Context first**: Why this task exists
- **Action second**: What to do
- **Guidance third**: How to do it (technical details)
- **Validation last**: How to verify (QA instructions)

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

### Typical Sub-Task Flow

**Per Feature**:

1. Investigate: Understand current state (1-2 tasks)
2. Investigate: Check data/dependencies (1-2 tasks)
3. Implement: Make the changes (2-4 tasks)
4. Test: Verify functionality (1-2 tasks)
5. Test: Edge cases and regression (1-2 tasks)

## Examples from Zero Result Page Parity

### Slice 1 Example

**Title**: "Slice 1: Quality Results"

**Description**:

```markdown
This slice delivers the core functionality for quality-based center sorting on zero-result pages, allowing users to see high-quality treatment centers first instead of just the closest ones. It's part of the Zero Result Page Parity project and represents the most critical vertical slice for improving user experience.

## Goals

**What specific value does this slice deliver?**

- Users see high-quality treatment centers first within a 10-mile radius
- Premium destination centers are showcased at the top of the feed
- Users have immediate access to quality treatment options

**What does "done" look like for this slice?**

- Zero-result pages sort centers by quality/score, not just distance
- Featured Carousel displays at top of feed with 3+ premium centers
- User can see and click on quality options immediately upon page load
- Behavior matches main result pages (madison, waukesha)

## Technical Scope & Boundaries

**Architectural approach:**

- Add aroundPrecision parameter to Algolia configuration
- Add Featured block entry to ZERO_LOCATION_LAYOUT feed config
- Leverage existing scoring and carousel rendering logic

**Assumptions or constraints:**

- Featured centers must have minimum 3 centers to display
- Location data includes geolocation information
- Existing scoring algorithm (getScore) works correctly

**What is NOT included in this slice:**

- Server-side rendering (deferred to Slice 3)
- MidFeed advertising (deferred to Slice 3)
- Navigation blocks like Top Treatment Locations (in Slice 2)
- Explore/discovery blocks (in Slice 2)
```

### Sub-Task Example (Implement)

**Title**: "Implement: Add aroundPrecision to createNearbyCenterConfig"

**Description**:

````markdown
## Description

The nearby feed currently sorts centers by distance only because the Algolia configuration is missing the aroundPrecision parameter. This causes low-quality centers to appear first if they're closer to the search location.

We need to enable radius precision behavior so Algolia finds all centers within the radius and then sorts by relevance/quality rather than just proximity.

## Details

**File**: `src/domain/feed/use-cases/createNearbyCentersConfig.ts`

Add the aroundPrecision parameter to the Algolia search configuration:

```typescript
algoliaSearchConfig.set(
  'aroundPrecision',
  getCenterSearchRadiusByLocationTypeInMeters(locationType)
)
```
````

Set it equal to aroundRadius value to enable radius precision behavior.

## Acceptance Criteria

- aroundPrecision parameter added to Algolia config
- Value set equal to aroundRadius (same meters value)
- High-quality centers appear first within the search radius
- Results are sorted by score/ranking, not just distance
- Behavior matches main result pages

````

### Sub-Task Example (Test)

**Title**: "Test: Verify quality centers appear first"

**Description**:

```markdown
## Description

Validate that after implementing radius precision search, high-quality treatment centers appear at the top of the nearby feed on zero-result pages, rather than just the closest centers.

## Test Pages

- harvest-alabama
- sturbridge-massachusetts
- roberts-wisconsin
- madison (comparison - high-result page)

## QA Instructions

1. Navigate to test page (e.g., /harvest-alabama/)
2. Review the first 5 centers in the nearby feed
3. Check each center's quality indicators (sponsor tier, reviews, score)
4. Compare with /madison/ (high-result page) to verify similar quality sorting
5. Verify results are NOT in pure distance order

## Expected Result

- First 5 centers should be high-quality (sponsor tier 1-2, good reviews)
- Results should NOT be in pure distance order
- Quality distribution should match main result pages
- Low-quality centers should appear further down the list
````

### Sub-Task Example (Real-World Implementation)

**Title**: "Implement: Replace hardcoded medication data with DB values"

**Description**:

```markdown
## Description

The initial import of medications and center medications included only availability information. We now pull complete centerMedication data but currently use it only to check availability. The rest of the medication info displayed in the UI remains hardcoded.

With the MAT expansion and edit functionality added, replace all hardcoded medication data with values from the database.

## Details

**Component**: `src/components/molecules/Mat/Mat.tsx`

- Remove all hardcoded medication data
- Use the fields from centerMedication for display

## Acceptance Criteria

- UI displays medication data dynamically from the DB
- No hardcoded medication information remains
- Edit functionality continues to work as expected
```

## Key Differences from Standard Task Creation

### Slices vs Features

- **Features**: Technical components or changes (what to build)
- **Slices**: User value delivery (what users get)
- Features are grouped into slices by shared user value
- One slice can contain multiple features that together solve a user problem

### Sub-Tasks vs Checklists

- **Don't**: Put task checklists in issue descriptions
- **Do**: Create actual Linear sub-tasks with parentId
- **Why**: Sub-tasks can be assigned, tracked, and updated independently
- **Format**: Each checklist item becomes a separate sub-task

### Problem-First Approach

- Every slice and sub-task starts with the problem/context
- Explains WHY before explaining WHAT
- Connects technical work to user value
- Makes priorities and trade-offs clear

## Final Validation Checklist

Use this checklist to verify all conversion work is complete and high-quality. Go through each item sequentially after finishing the conversion.

### Project Level

- [ ] Project title matches pitch name exactly
- [ ] Description includes all required sections (Background Context, Problem Statement, Solution Overview, User Story, Appetite, Success Metrics, Departments Affected, Important Considerations)
- [ ] Notion pitch URL is linked in description
- [ ] Success metrics are clearly defined and measurable
- [ ] Appetite (timeline) is stated
- [ ] Test/example pages are listed
- [ ] Project state is set to Backlog
- [ ] Project is assigned to correct team

### Slice Structure and Ordering

- [ ] Slice 1 solves the MOST PAINFUL user problem (not setup/infrastructure work)
- [ ] Slice 1 can ship independently and deliver measurable value
- [ ] Slice 1 has no complex dependencies on other slices
- [ ] Slices are ordered by priority: Core Value → Supporting Value → Optimization
- [ ] Each slice is independently shippable
- [ ] Slices are organized by USER VALUE, not technical layers (not "frontend slice" or "backend slice")
- [ ] Slices do NOT have heavy dependencies on each other
- [ ] Each slice has 2-3 features (not too many, not too few)

### Slice Description Quality

- [ ] Each slice description starts with problem statement and context
- [ ] Slice descriptions are simple and user-focused (no detailed technical architecture)
- [ ] Each slice has clear "Goals" section with specific value delivered
- [ ] Each slice has clear "What does done look like" criteria
- [ ] Each slice has "Technical Scope & Boundaries" section
- [ ] Each slice explicitly states what is NOT included
- [ ] Slice state is set to Backlog
- [ ] Slice priority is appropriate (Slice 1: High/Urgent, Slice 2-3: Medium/Low)
- [ ] Slice is linked to parent project
- [ ] Slice is assigned to correct team

### Sub-Task Structure

- [ ] Each slice has 2-4 Investigate tasks (understand before building)
- [ ] Each slice has 3-6 Implement tasks (actual work)
- [ ] Investigation tasks are spread across relevant slices (not all in Slice 1)
- [ ] Sub-tasks are ACTUAL Linear sub-tasks with parentId set (not checklists in descriptions)
- [ ] Each sub-task is scoped to 1-2 days maximum (not weeks)
- [ ] Sub-tasks are independent where possible
- [ ] Tasks follow proper categorization: Investigate, Implement, Test, or Design

### Sub-Task Description Quality

- [ ] Each sub-task has clear problem context (not just "do X")
- [ ] Sub-task titles follow format: [Type]: [Specific Action]
- [ ] Sub-task titles are specific (e.g., "Add aroundPrecision to createNearbyCenterConfig", not "Fix the issue")
- [ ] Implementation tasks have technical guidance with specific file paths
- [ ] Implementation tasks reference specific files and line numbers where helpful
- [ ] Test tasks include step-by-step QA instructions
- [ ] Test tasks list specific test pages/URLs
- [ ] Test tasks have clear "Expected Result" section
- [ ] Each sub-task has "Acceptance Criteria" section
- [ ] Sub-task descriptions explain WHY before WHAT

### Relationships and Linkage

- [ ] All sub-tasks are properly linked to their parent slice (parentId set)
- [ ] No sub-tasks are linked directly to the project (should link to slice)
- [ ] All slices are linked to the parent project
- [ ] Team assignments are consistent (project → slices → sub-tasks)

### Completeness Check

- [ ] Every feature mentioned in slice description has corresponding sub-tasks
- [ ] No orphaned tasks exist (all tasks belong to a slice)
- [ ] All technical files mentioned in pitch have corresponding investigate/implement tasks
- [ ] Edge cases and error handling are covered in sub-tasks
- [ ] Regression testing is included for affected functionality

### Anti-Pattern Verification

- [ ] NO slice is purely "setup" or "foundation" work
- [ ] NO slice descriptions contain detailed technical analysis
- [ ] NO sub-tasks take more than 3 days to complete
- [ ] NO vague sub-tasks exist (all are specific and actionable)
- [ ] NO checklists exist inside issue descriptions (all are sub-tasks)
- [ ] NO slices are organized by technical layer
- [ ] NO test tasks exist without QA instructions

## Workflow Summary

```
1. Fetch Notion pitch
   ↓
2. Create Linear project (comprehensive description)
   ↓
3. Analyze pitch → identify 2-3 slices
   ↓
4. Create Slice 1 issue (core value)
   ↓
5. Create sub-tasks for Slice 1
   ↓
6. Create Slice 2 issue (supporting)
   ↓
7. Create sub-tasks for Slice 2
   ↓
8. Create Slice 3 issue (if needed)
   ↓
9. Create sub-tasks for Slice 3
   ↓
10. (Optional) Analyze codebase and enhance sub-tasks
```

---

## Single Ticket Creation

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

If you cant find the information you need, skip the section of the template that is not applicable.
