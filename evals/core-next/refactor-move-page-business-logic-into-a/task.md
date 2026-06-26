# Refactor: Move Page Business Logic into Application Layer Modules

## Problem

Our Next.js page components have grown very fat. Files like `src/app/location/[slug]/page.tsx` have 200+ lines of business logic inline — they import directly from persistence, set up their own `cache()` wrappers, compute breadcrumbs, assemble feed data, build SEO metadata, and decide which department footer to show, all in the page file itself.

This makes these pages hard to test and hard to understand. When you open `app/location/[slug]/page.tsx`, you can't tell at a glance what it renders — it's buried under walls of data assembly code. It also means `generateMetadata` and the page component separately fetch (and cache) the same data, which is fragile.

We already have a clean pattern for this in the codebase. Look at `src/application/center/getCenterProfilePageData.ts` — the center profile pages delegate all their data fetching and assembly to a dedicated use case function in the `application/` layer. The page itself just calls `getCenterProfilePageData()`, handles `notFound()`, and renders. That's the pattern we want everywhere.

## Expected Behavior

The following pages should be cleaned up to follow this pattern:

- **Location landing pages** (`src/app/location/[slug]/page.tsx` and `src/app/location/[slug]/[term]/page.tsx`) — currently the most complex; 200+ lines of inline logic including location feed assembly, breadcrumbs, hero props, and SEO metadata
- **Taxonomy term pages** — currently all 11 variants (activities, amenities, approach, care, etc.) share a file at `src/app/(taxonomy)/taxonomyTermPage.tsx`, but that file lives in `app/` and contains business logic that belongs in `application/`. It should move to the application layer.
- **Content pages** (partners, podcasts) — both have 80–130 lines of inline metadata/schema construction in the page file
- **Other pages** that import directly from `@/persistence/*` and do more than simple fetch-and-render (author, brand, landing, resources pages)

After the refactoring, each affected page should be a short file that:

1. Imports a `get{FeatureName}PageData` function from `src/application/...`
2. Calls it with the slug
3. Calls `notFound()` if it returns null/undefined
4. Passes the returned view model to template/component imports

`generateMetadata` in each page should similarly delegate to a single application-layer function — it should not re-implement metadata logic or create its own cache wrappers.

## Acceptance Criteria

- Page files no longer contain inline persistence imports for data fetching (with the exception of simple single-fetch composition-root pages that do no logic)
- Application layer modules for each affected page live under `src/application/` in an appropriate subdomain folder
- The taxonomy term pages continue to share a single shared implementation, not one module per taxonomy type
- Existing functionality is preserved — same pages render with the same content and metadata
