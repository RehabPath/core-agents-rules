# Commit Analysis for `RehabPath/core-next`

## Scope

- Target scenarios: 4-5 for first full run
- Scan source: latest 200 non-merge commits via GitHub API
- Selection goal: prioritize commits with multi-file, cross-layer, non-trivial implementation work

## Scan Results

### Shortlisted for deep review

- `ea20c52` - refactor: update imports and data fetching methods across various pages to align with new application structure
- `1133308` - refactor: streamline data fetching and update imports in content and location modules to enhance structure and maintainability
- `25823c5` - feat: load insurance filter list from Term DB for infeed picker
- `51174bb` - refactor: rename AlgoliaHit consumers to FeedCenter across components, application, persistence
- `9eddaf4` - refactor(feed): delete Algolia.model.ts and legacy shim files; rewire consumers to domain/feed
- `04df5af` - feat(feed): merge search/score/feed constants into domain/feed/const.ts
- `5ca91cf` - refactor(feed): move utils/search into domain/feed/use-cases (2e)
- `d7ff52d` - refactor(feed): move domain/score/ into domain/feed/use-cases (2c)

### Skipped by hard gates

- **< 3 source files changed:** `4954266`, `2baaaa5`, `b0c778f`, `e714403`, `0457fc9`, `ae69e69`, `5132342`, `07da3f3`, `86175a5`, `c170ebc`
- **< 50 changed lines:** `b04850f`, `61584dc`, `eaeedff`, `6a3c26a`, `2509d3b`, `d8fa688`, `0092012`, `09bed5c`, plus many small logging/copy/style fixes
- **docs/config-only or mostly docs/chore:** commits like `d88eade`, `44bfaf0`, `c107ba6`, and similar metadata-only edits

### Soft-skipped

- Narrow fixes and one-method patches (e.g. widget visibility, carousel caps, import cleanups)
- Commits where test/docs dominate and source deltas are minimal

## Deep-Read Assessment (7 complexity signals)

Signals:

1. New abstractions
2. Cross-cutting scope
3. Wiring and registration
4. Non-obvious control flow
5. Domain-specific logic
6. Interdependent changes
7. No single-point solution

### `25823c5` (score: **6/7**) - **Accept**

- Hits: 1,2,3,5,6,7
- Adds insurance-title retrieval flow from persistence to API route and UI filter integration.
- Introduces/coordinated domain use-cases and parsers with persistence constants plus consumer updates.
- Multiple layers must move together for behavior to work.

### `ea20c52` (score: **6/7**) - **Accept**

- Hits: 1,2,3,4,6,7
- Broad refactor over app routes, application data loaders, and templates with coordinated fetch-path shifts.
- Requires understanding how page-level loaders and template dependencies compose.
- Not solvable in one file; integration correctness depends on several modules.

### `1133308` (score: **5/7**) - **Accept**

- Hits: 2,3,4,6,7
- Large content/location data-fetching refactor touching route, application services, and tests.
- Emphasis is restructuring and flow correctness rather than net-new domain entities.

### `51174bb` (score: **5/7**) - **Accept**

- Hits: 1,2,3,6,7
- Cross-cutting feed model rename (`AlgoliaHit` -> `FeedCenter`) across components, application, and persistence.
- Requires careful multi-layer consistency to avoid type/runtime breakages.

### `9eddaf4` (score: **4/7**) - **Borderline**

- Hits: 2,3,6,7
- Deletes shims and rewires consumers to new domain feed surface.
- Some work is structural cleanup; still useful as a harder fallback scenario.

### `04df5af` (score: **4/7**) - **Borderline**

- Hits: 1,2,6,7
- Consolidates constants into bounded context.
- Substantial movement, but may skew toward mechanical merge/repoint work.

### `5ca91cf` (score: **3/7**) - **Reject**

- Hits: 2,6,7
- Large file movement with comparatively low semantic change density.
- Risk of generating a mostly mechanical scenario.

### `d7ff52d` (score: **3/7**) - **Reject**

- Hits: 2,6,7
- Primarily relocation/restructure commit with low net logic delta.

## Recommended First-Run Commits

Use these for scenario generation (top 4 + 1 fallback):

1. `25823c5` (6/7)
2. `ea20c52` (6/7)
3. `1133308` (5/7)
4. `51174bb` (5/7)
5. `9eddaf4` (4/7, fallback if you want a fifth)
