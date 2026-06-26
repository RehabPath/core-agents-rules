# Consolidate Feed Domain: Replace Legacy AlgoliaHit Type and Deprecated Import Paths

## Problem / Feature Description

Our codebase grew up tightly coupled to Algolia's naming conventions — the type representing a treatment center in search results was called `AlgoliaHit`, and related types and constants were scattered across `src/types/models/Algolia.model.ts`, `src/domain/search/`, and `src/domain/score/`. Over time we started consolidating these under `src/domain/feed/`, and we left behind a handful of deprecated shim files that re-export everything to keep the old import paths working during the transition.

The shims are now just noise. Every consumer has the domain equivalents available, but nothing has cleaned up the stragglers. The old `AlgoliaHit` name also leaks a vendor detail into components and application code that shouldn't care which search provider we're using.

## Expected Behavior

After the cleanup:

- The type `FeedCenter` (from `@/domain/feed/feed`) is used consistently throughout the app wherever a center returned from the feed/search layer is referenced. No code outside the feed domain boundary needs to know about the Algolia-specific raw hit shape.
- All constants previously imported from `@/domain/search/constants`, `@/domain/score/const`, or `@/domain/feed/constants` are imported directly from `@/domain/feed/const`.
- All types previously imported from `@/types/models/Algolia.model` (such as `SearchState`, `CustomSearchState`, `FacetList`, `InstantSearch`, `ValueState`) are imported from `@/domain/feed/feed`.
- The deprecated shim files are deleted rather than left as dead code.

## Acceptance Criteria

- No file outside `src/domain/feed/` imports from `@/types/models/Algolia.model`, `@/domain/search/types`, `@/domain/search/constants`, `@/domain/score/const`, or `@/domain/feed/constants`.
- The type `AlgoliaHit` no longer appears as a named type in component, application, or persistence code.
- The existing functionality is not changed — this is a pure refactor with no behavior changes.
