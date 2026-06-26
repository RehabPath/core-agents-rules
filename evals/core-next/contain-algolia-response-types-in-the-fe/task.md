# Contain Algolia Response Types in the Feed Domain

## Problem Description

Right now, the raw type returned by Algolia's search API bleeds into multiple layers of our codebase. When the Algolia response shape changes — a field gets renamed, a new field is added — we end up chasing down updates across components, persistence, and domain layers.

We've already renamed the consumers to use our domain type `FeedCenter` (from `@/domain/feed/feed`), but there's no actual translation boundary: the raw Algolia hit is just cast directly to `FeedCenter`. There's no single place that owns the mapping between what Algolia sends us and what our domain actually works with.

## Expected Behavior

There should be a dedicated mapper in the `domain/feed` layer that translates a raw Algolia hit into a `FeedCenter`. The raw Algolia hit shape should be defined privately in that one location — not exported, not used anywhere else. Every other part of the codebase receives a `FeedCenter` and has no idea what Algolia's response contract looks like.

When the Algolia API changes, a developer should only need to touch this one file.

## Acceptance Criteria

- A mapper function exists in the feed domain's use-cases that accepts a raw Algolia hit and returns a `FeedCenter`
- The raw Algolia hit type is local to that file — not exported or referenced outside the feed domain boundary
- The `FeedCenter` type (from `@/domain/feed/feed`) is the return type
- The rest of the codebase continues to work with `FeedCenter` exclusively
