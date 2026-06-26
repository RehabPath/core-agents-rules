# Enforce Application Layer for Complex Page Data Fetching

## Problem

Several of our Next.js page files have grown complex over time. They directly call multiple persistence functions, compute SEO metadata inline, assemble feeds, and perform data transformations — all within the `app/` route files themselves. This makes the pages hard to test in isolation and violates the clean architecture layering rules we document in `src/app/README.md`.

The README draws a clear line: a page is a "composition root" (and may touch persistence directly) only when it does nothing more than fetch a single DTO and hand it to a component. The moment it combines data from multiple sources, computes metadata, or branches on fetched values, that logic belongs in the `application/` layer instead.

## Expected Behavior

After the refactor, each affected page file should be thin — it resolves the route params, calls an application layer function to get all the data it needs, calls `notFound()` if that function returns null, and renders. The data fetching, caching, SEO computation, and orchestration live in `application/{feature}/get{Feature}PageData.ts`.

The architecture `src/app/README.md` and the existing use cases already in `application/` show the pattern to follow.

A few concrete examples of pages that need this treatment:

- `src/app/author/[slug]/page.tsx` — currently fetches from persistence directly and builds SEO metadata inline
- `src/app/brands/[slug]/page.tsx` — same issue; also has inline no-index logic based on center count
- `src/app/location/[slug]/page.tsx` — calls several persistence functions and orchestrates feed assembly inline
- All 11 taxonomy pages under `src/app/(taxonomy)/` — they currently share a `taxonomyTermPage.tsx` helper that lives in `app/` but imports directly from `@/persistence/*`, which is explicitly not allowed for non-route files

## Acceptance Criteria

- Each complex page delegates all data fetching and transformation to a corresponding `application/{feature}/` use case
- Both `generateMetadata` and the default page export go through the same use case (no duplicate fetches)
- `notFound()` is called when the use case indicates the resource doesn't exist
- Any non-route shared files currently in `app/` that import from `@/persistence/*` are moved to their appropriate layer
