# Code Review Rules (Bugbot)

These rules apply to all code review, regardless of which layer was changed. Layer-specific rules follow below.

---

## Global Rules
# Recovery.com — Global Bugbot Rules

These rules apply to every PR, regardless of which layer was changed. Layer-specific rules are in nested `.cursor/BUGBOT.md` files under each `src/` subdirectory.

## Environment Variables

Never use `process.env` directly outside of `src/lib/env.ts`.

- Flag any `process.env.*` access in files other than `src/lib/env.ts`.
- Use `clientEnv` for `NEXT_PUBLIC_*` variables, `serverEnv` for server-only variables, and `IS_DEVELOPMENT` for dev mode checks — all from `@/lib/env`.

```ts
// Bad
const key = process.env.NEXT_PUBLIC_API_KEY

// Good
import { clientEnv } from '@/lib/env'
const key = clientEnv.NEXT_PUBLIC_API_KEY
```

## Hardcoded Secrets

Flag any hardcoded API keys, tokens, passwords, or credentials in source code. All secrets must come from environment variables via `src/lib/env.ts`.

## Logging

Never use `console.log`, `console.warn`, or `console.error`.

- Flag any `console.*` calls.
- Use `logger` from `src/utils/logger/index.ts` instead.
- `logger.error` is reserved for fatal errors only. Use `logger.warn` or `logger.info` for non-fatal issues.

```ts
// Bad
console.log('debug info')

// Good
import { logger } from '@/utils/logger'
logger.info({ message: 'debug info', data: { key: 'value' } })
```

## Error Handling

Never allow empty `catch` blocks.

- Flag `catch` blocks with no action.
- If a `catch` block exists, it must do at least one of:
  - handle/recover from the error,
  - re-throw the error,
  - log with `logger.warn` (or `logger.error` for fatal failures).
- If execution continues after a caught error, prefer `logger.warn` with contextual `message`, `data`, and `error`.
- Do not require `try/catch` where framework-level handling is intentional (for example, `routeHandler` domain error mapping in `src/app/api/`).

```ts
// Bad
try {
  await syncCenterData(centerId)
} catch (error) {}

// Good
try {
  await syncCenterData(centerId)
} catch (error) {
  logger.warn({
    message: 'Failed to sync center data; continuing request',
    data: { centerId },
    error
  })
}
```

## Barrel Files

`index.ts` files may only contain `export type` statements.

- Flag any `index.ts` that exports a function, constant, component, hook, or any runtime value.
- Flag any `export *` usage anywhere — always use named exports.
- Flag re-exports across unrelated modules (e.g., a service re-exporting a component).

```ts
// Bad — index.ts with runtime export
export { useSegment } from './useSegment'

// Good — type-only barrel
export type { Center } from './center'

// Good — import directly from source
import { useSegment } from '@/services/segment/useSegment'
```

## Immutability

Never mutate objects or arrays. Always return new values.

- Flag direct property assignment on existing objects: `obj.prop = value`.
- Flag `Array.prototype.push/pop/splice/sort` called on existing arrays.
- Use spread or array methods: `{ ...obj, prop: value }`, `[...arr, item]`, `.map()`, `.filter()`.

## Manual Type Checks

Always use utility functions from `src/utils/checks.util.ts` instead of manual type checking.

Flag these patterns and suggest the utility equivalent:

| Manual check                                 | Use instead               |
| -------------------------------------------- | ------------------------- |
| `value === null`                             | `isNull(value)`           |
| `value === undefined`                        | `isUndefined(value)`      |
| `value === null \|\| value === undefined`    | `isNil(value)`            |
| `typeof value === 'string'`                  | `isString(value)`         |
| `typeof value === 'number'`                  | `isNumber(value)`         |
| `typeof value === 'boolean'`                 | `isBoolean(value)`        |
| `Array.isArray(value) && value.length === 0` | `isEmptyArray(value)`     |
| `Array.isArray(value) && value.length > 0`   | `isNonEmptyArray(value)`  |
| `value === ''` or `value.trim() === ''`      | `isEmptyString(value)`    |
| non-empty string check                       | `isNonEmptyString(value)` |

## Variables

- Flag `let` declarations where `const` could be used instead.
- Flag `var` — always use `const` or `let`.

## Control Flow

- Flag `==` and `!=` — always use `===` and `!==`.
- Flag `else` blocks that follow a `return` or `throw` statement — they are redundant and add nesting.
- Flag chains of `if/else if` with 3+ branches — prefer `switch`.
- Flag nested ternary expressions (`condA ? (condB ? x : y) : z` or equivalent multi-level ternaries).
- Prefer `if` statements, guard clauses, or a small helper function when ternary logic has more than one condition.

## File Naming

- Component files and component directories must use **PascalCase** (e.g., `Button.tsx`, `CenterCard/`).
- All other files and directories must use **camelCase** (e.g., `getCenterProfileSlug.ts`, `useIsMobile.ts`, `checks.util.ts`).
- Test files inherit the source file's casing with a `.test.ts` or `.test.tsx` suffix.
- Flag any component file not in PascalCase and any non-component file not in camelCase.

## Missing Tests

Flag new source files added to `src/domain/`, `src/application/`, or `src/persistence/` that have no co-located `.test.ts` or `.spec.ts` file.

## Dependency Placement

Flag packages placed in the wrong section of `package.json`.

- Packages needed to **build or run** the app go in `dependencies`: React, Next.js, Tailwind CSS, PostCSS plugins, Prisma client, database drivers, Zod, styled-components.
- Packages used **only** for local dev, testing, or tooling go in `devDependencies`: `@types/*`, ESLint, Prettier, Jest, Testing Library, Husky, Prisma CLI, shadcn.
- Flag Tailwind or its plugins in `devDependencies` — they are consumed during `next build` and must be in `dependencies`.

Quick check: "Is this package needed when running `pnpm install --prod && pnpm build && pnpm start`?"

- Yes → `dependencies`
- No → `devDependencies`

---

## Layer: app/ (Pages, Metadata, SSR)
# App Router Layer — Bugbot Rules

These rules apply when PR changes include files inside `src/app/`.

This is the Next.js App Router layer — it defines routes, pages, layouts, and API handlers. Pages should be Server Components by default, fetching data server-side for SEO and performance.

## SEO: Required Metadata on Every Page

Flag new `page.tsx` files that do not export a `metadata` object or a `generateMetadata` function.

Every public-facing page must include metadata for SEO:

```ts
// Good — static metadata
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title | Recovery.com',
  description: 'Page description between 150–160 characters.'
}

// Good — dynamic metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // fetch data and return metadata
}
```

## SEO: Canonical URLs

Flag pages that don't set a canonical URL in their metadata.

- Always use `getCanonical()` from `@/application/seo/getCanonicalForPath`.
- Canonical URLs must be absolute (include protocol and domain).
- Never use relative URLs as canonical links.

```ts
import { getCanonical } from '@/application/seo/getCanonicalForPath'

const canonical = getCanonical('/condition/alcohol/')
// Returns: "https://recovery.com/condition/alcohol/"
```

## SEO: Meta Title and Description Lengths

- Flag meta titles exceeding **60 characters**.
- Flag meta descriptions shorter than **150 characters** or longer than **160 characters**.
- Use `generatePageTitle` and `generatePageDescription` from `src/application/seo/` for dynamic pages.

## SEO: Robots Meta Tag

Flag `noindex` or `nofollow` in robots meta tags unless the page is explicitly non-public (login, admin, staging, search results).

## SEO: Heading Hierarchy

- Flag pages with zero `<h1>` tags.
- Flag pages with more than one `<h1>` tag.
- Heading levels must not skip (e.g., `<h1>` → `<h3>` with no `<h2>` is invalid).

## SEO: Image Alt Text

Flag `<img>` tags or Next.js `<Image>` components without a descriptive `alt` attribute.

## SEO: Anchor vs Button Semantics

- Flag `<button>` elements used for navigation (linking to another page). Use `<a>` instead.
- Flag `<a>` elements without an `href`. Use `<button>` for actions (modals, form submission).

## SEO: External Links

Flag `<a target="_blank">` missing `rel="noopener noreferrer nofollow"`.

```tsx
// Bad
<a href="https://external.com" target="_blank">Link</a>

// Good
<a href="https://external.com" target="_blank" rel="noopener noreferrer nofollow">Link</a>
```

## SEO: Server-Rendered Content

Flag SEO-critical content (links, headings, main body text) fetched inside `useEffect` or any client-side hook.

- Content must be server-rendered to be visible to crawlers.
- Use Server Components and fetch data at the page level.

## Data Deduplication

Flag the same data-fetching function called in both `generateMetadata` and the page component without deduplication.

- Use native `fetch` (automatically deduplicated by Next.js) wherever possible.
- Use `React.cache()` for non-fetch data sources (Prisma, Sanity client, Algolia SDK).

```ts
// Bad — duplicate fetches
export async function generateMetadata({ params }) {
  const data = await fetchData(params.slug) // call #1
}
export default async function Page({ params }) {
  const data = await fetchData(params.slug) // call #2 — duplicate!
}

// Good — native fetch deduplicates automatically
async function fetchData(slug: string) {
  return fetch(`https://api.recovery.com/data/${slug}`).then((r) => r.json())
}
```

## Async Waterfall

Flag sequential `await` calls for independent async operations in the same function.

- Use `Promise.all()` for independent concurrent fetches.

```ts
// Bad
const location = await getLocation(slug)
const centers = await getCenters(slug)

// Good
const [location, centers] = await Promise.all([
  getLocation(slug),
  getCenters(slug)
])
```

## Unnecessary 'use client'

Flag `'use client'` directives on components or pages that don't require client-side features (no `useState`, `useEffect`, browser APIs, or event handler props that require interactivity).

- Prefer Server Components — they improve performance and SEO.

## Layouts in Components

Flag layout templates or page-wrapping components created under `src/components/` that should be `layout.tsx` files in the App Router.

- Route layouts belong in `src/app/**/layout.tsx`.

## API Routes

Flag API route handlers in `src/app/api/` that:

- Accept user input without validation (use Zod or similar).
- Return sensitive data without authentication checks.
- Use `process.env` directly instead of `src/lib/env.ts`.

See `src/app/api/.cursor/BUGBOT.md` for detailed API route design rules.

## SEO: SeoLink Component

Flag raw `<a>` tags used for internal or external navigation. Use the `SeoLink` component instead — it automatically handles `rel` attributes correctly for all link types.

```tsx
// Bad — raw anchor tag
<a href="/condition/alcohol/">Alcohol Treatment Centers</a>
<a href="https://external.com" target="_blank">External Site</a>

// Good — SeoLink handles rel automatically
<SeoLink url="/condition/alcohol/">Alcohol Treatment Centers</SeoLink>
<SeoLink url="https://external.com">External Site</SeoLink>
// External links get rel="noopener noreferrer nofollow" automatically
```

## SEO: Browse Page Links

Flag anchor tags or `SeoLink` components pointing to `/browse` paths.

- Browse pages must not be discoverable by search engines.
- Use `<button>` with `onClick` for browse page navigation.

```tsx
// Bad
<SeoLink url="/browse/centers">Browse Centers</SeoLink>
<a href="/browse/centers">Browse Centers</a>

// Good
<button onClick={() => navigate('/browse/centers')}>Browse Centers</button>
```

## SEO: Schema Markup

Flag new content-type pages (`page.tsx`) that don't include JSON-LD Schema markup.

- Use `MedicalOrganization` for treatment centers.
- Use `Article` for blog posts and news.
- Use `FAQPage` for FAQ sections.
- Use fully qualified URLs (absolute) for `url` and `image` properties.

```tsx
// Good
import { JsonLdSchema } from '@/components/atoms/JsonLdSchema'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalOrganization',
  name: center.name,
  url: `https://recovery.com${getCenterProfileSlug(center)}`
}

return <JsonLdSchema data={schema} />
```

## Accessibility

Flag accessibility violations in page and component files:

- **Semantic HTML**: Flag `<div onClick>` or `<span onClick>` without an ARIA role. Use `<button>` for actions and `<a>` for links.
- **Image alt text**: Flag `<img>` or `<Image>` without an `alt` attribute. Use descriptive text; use `alt=""` for decorative images.
- **Form labels**: Flag `<input>` without a corresponding `<label for>` or wrapper `<label>`. Placeholder text alone is not a label.
- **Focus indicators**: Flag `outline: none` or `outline: 0` CSS without a custom focus style alternative.
- **tabindex**: Flag positive `tabindex` values (e.g., `tabindex="2"`). Only `0` and `-1` are acceptable.
- **aria-hidden on interactive elements**: Flag `aria-hidden="true"` on `<button>`, `<a>`, or `<input>`.
- **Icon-only buttons**: Flag `<button>` containing only an icon with no accessible text. Add `aria-label` or visually hidden text.
- **Live regions**: Flag dynamic content updates (loading states, error messages) that don't use `aria-live="polite"` or `aria-live="assertive"`.
- **Reduced motion**: Flag CSS animations without a `@media (prefers-reduced-motion: reduce)` override.

---

## Layer: app/api/ (Route Handlers)
# API Routes — Bugbot Rules

These rules apply when PR changes include files inside `src/app/api/`.

API route handlers are thin coordinators: authenticate → validate → call persistence/domain → respond. They must not contain business logic, Prisma queries, or raw HTTP response construction.

## routeHandler() Wrapper Required

Flag any API route that exports a raw `async function` instead of using `routeHandler()`.

Every handler must use `routeHandler()` from `@/lib/routeHandler`:

```ts
// Bad — raw async export
export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // ...
}

// Good — routeHandler wraps auth, validation, and error mapping
import { routeHandler } from '@/lib/routeHandler'
import { successResponse } from '@/lib/apiResponse'

export const GET = routeHandler({
  handler: async ({ auth }) => {
    const posts = await findPostsByUserId(auth!.userId)
    return successResponse(posts)
  }
})
```

## No Prisma in Route Files

Flag direct Prisma client usage inside `src/app/api/` route files.

- All Prisma queries belong in `src/persistence/{entity}/{entity}.persistence.ts`.
- Route handlers call persistence functions, not Prisma directly.

```ts
// Bad — Prisma in route handler
import { prisma } from '@/lib/prisma.client'
export const GET = routeHandler({
  handler: async ({ auth }) => {
    const posts = await prisma.post.findMany({
      where: { userId: auth!.userId }
    }) // Wrong
    return successResponse(posts)
  }
})

// Good — persistence function in route handler
import { findPostsByUserId } from '@/persistence/posts/posts.persistence'
export const GET = routeHandler({
  handler: async ({ auth }) => {
    const posts = await findPostsByUserId(auth!.userId)
    return successResponse(posts)
  }
})
```

## Response Helpers Required

Flag `NextResponse.json(...)` called directly in route handlers. Use the response helpers from `@/lib/apiResponse` instead.

```ts
// Bad — raw NextResponse
return NextResponse.json({ error: 'Not found' }, { status: 404 })
return NextResponse.json({ data: post }, { status: 200 })

// Good — response helpers
import {
  successResponse,
  notFound,
  unauthorized,
  forbidden
} from '@/lib/apiResponse'
return successResponse(post)
return notFound('Post not found')
return unauthorized()
return forbidden()
```

Available helpers: `successResponse`, `errorResponse`, `notFound`, `unauthorized`, `forbidden`, `serverError`, `validationError`.

### Exception: VerifyTx API routes

The following routes use `NextResponse.json()` directly because their response shapes are defined by the VerifyTx integration contract and do not fit the `{ data, error }` envelope:

- `src/app/api/verifyBenefits/verifytx/onboard/check/route.ts`
- `src/app/api/verifyBenefits/verifytx/onboard/route.ts`
- `src/app/api/verifyBenefits/verifytx/payers/route.ts`
- `src/app/api/verifyBenefits/verifytx/oauth/authorize/route.ts`
- `src/app/api/verifyBenefits/verifytx/oauth/setup/route.ts`
- `src/app/api/verifyBenefits/verifytx/oauth/callback/route.ts`

## Ownership Checks

Flag resource routes (`GET /[id]`, `PATCH /[id]`, `DELETE /[id]`) that read or mutate a resource without calling `assertOwner`.

- Always call `assertOwner(auth!, resource.userId)` before returning or mutating a resource.
- Always check `if (denied) return denied` immediately after.

```ts
// Bad — no ownership check
export const DELETE = routeHandler({
  handler: async ({ params }) => {
    const post = await findPostOrThrow(params.id)
    await deletePost(params.id) // anyone can delete any post!
    return successResponse({ deleted: true })
  }
})

// Good — ownership enforced
import { assertOwner } from '@/lib/policy'
export const DELETE = routeHandler({
  handler: async ({ params, auth }) => {
    const post = await findPostOrThrow(params.id)
    const denied = assertOwner(auth!, post.userId)
    if (denied) return denied
    await deletePost(params.id)
    return successResponse({ deleted: true })
  }
})
```

## Public Routes Must Be Explicit

Flag route handlers that should be public but don't have `protected: false`.

- Auth is **on by default** in `routeHandler()`.
- Public endpoints must explicitly opt out: `protected: false`.

```ts
// Bad — omitting protected means auth is required, which may be wrong for a public route
export const GET = routeHandler({
  handler: async () => {
    const centers = await findFeaturedCenters()
    return successResponse(centers)
  }
})

// Good — explicit public declaration
export const GET = routeHandler({
  protected: false,
  handler: async () => {
    const centers = await findFeaturedCenters()
    return successResponse(centers)
  }
})
```

## Body Validation via bodySchema

Flag route handlers that call `req.json()` or `req.body` directly. Use the `bodySchema` option with a Zod schema instead.

```ts
// Bad — manual body parsing
export const POST = routeHandler({
  handler: async ({ req }) => {
    const body = await req.json() // no validation
    await createPost(body)
    return successResponse(body, 201)
  }
})

// Good — Zod validation via bodySchema
import { createPostDto } from '@/persistence/posts/posts.dto'
export const POST = routeHandler({
  bodySchema: createPostDto,
  handler: async ({ body, auth }) => {
    const post = await createPost(auth!.userId, body) // body is fully typed and validated
    return successResponse(post, 201)
  }
})
```

## Domain Errors — Do Not Catch in Handlers

Flag `try/catch` blocks inside `routeHandler` handlers that catch `NotFoundError`, `ValidationError`, or `ForbiddenError`.

- These domain errors are thrown by persistence and domain use-case functions.
- `routeHandler` catches them automatically and maps them to the correct HTTP response.
- Route handlers must not catch domain errors themselves — it creates inconsistent error handling.

```ts
// Bad — handler catches domain errors
export const GET = routeHandler({
  handler: async ({ params }) => {
    try {
      const post = await findPostOrThrow(params.id)
      return successResponse(post)
    } catch (error) {
      return notFound() // redundant — routeHandler already handles NotFoundError
    }
  }
})

// Good — let domain errors propagate to routeHandler
export const GET = routeHandler({
  handler: async ({ params }) => {
    const post = await findPostOrThrow(params.id) // throws NotFoundError if missing
    return successResponse(post)
  }
})
```

## No HTTP Concepts Outside api/ and lib/

Flag `NextResponse`, `NextRequest`, or HTTP status codes used in `src/domain/`, `src/persistence/`, or `src/application/`.

- HTTP concerns belong exclusively in `src/app/api/` route files and `src/lib/` helpers.
- Domain and persistence layers throw typed errors (`NotFoundError`, `ValidationError`, `ForbiddenError`) — they never return HTTP responses.

---

## Layer: application/ (Orchestration)
# Application Layer — Bugbot Rules

These rules apply when PR changes include files inside `src/application/`.

The application layer orchestrates domain use cases and coordinates cross-domain workflows. It sits between the presentation layer (`src/app/`) and the domain layer (`src/domain/`). It must not contain core business rules or raw data access.

## No Core Domain Logic

Flag pure business rules placed in `src/application/` that belong in `src/domain/use-cases/`.

- Flag single-responsibility business operations (slug generation, validation, distance calculations, score derivations).
- Application use cases must _coordinate_ domain use cases, not _replace_ them.

```ts
// Bad — core domain logic in application layer
// application/center/getCenterSlug.ts
export function getCenterSlug(center: Center): string {
  return `/p/${center.slug}/` // domain logic — belongs in domain/center/use-cases/
}

// Good — orchestrating domain use cases
// application/breadcrumbs/computeBreadcrumbs.ts
import { getCenterProfileUrl } from '@/application/center/getCenterProfileUrl'
import { getLocationSlug } from '@/domain/location/use-cases/getLocationSlug'
```

## No Raw Data Access

Flag direct database or API calls inside `src/application/`.

- Flag `fetch(` called directly on internal APIs (use persistence functions instead).
- Flag `prisma.`, `sanityClient.`, or any database client usage.
- Data access belongs in `src/persistence/`.

## No UI Components

Flag JSX syntax, `.tsx` files, or React component definitions inside `src/application/`.

- UI components belong in `src/components/`.

## No External Service Calls

Flag direct third-party API calls (Algolia, Google Maps, Stripe, email providers) inside `src/application/`.

- External integrations belong in `src/services/`.

## Use SEO Helpers for Metadata

Flag page metadata generated by hand (manual string concatenation for titles/descriptions) in `src/app/` without using the application SEO utilities.

Use the established SEO utilities from `src/application/seo/`:

- `generatePageTitle` — for dynamic page titles
- `generatePageDescription` — for dynamic page descriptions
- `generateMetadata` — to produce Next.js `Metadata` objects
- `generateSocialTags` — for Open Graph and Twitter Card tags
- `getCanonical` (from `getCanonicalForPath`) — for canonical URLs

## Test Coverage

Flag new application use-case files without a co-located `.spec.ts` or `.test.ts` test file.

- Every file in `src/application/` must have a corresponding test file.

## File Structure

Application use cases must follow this structure:

```
application/
└── {feature}/
    ├── {useCaseName}.ts       # orchestration logic
    └── {useCaseName}.spec.ts  # tests
```

- Flag directories that mix unrelated features.
- Feature directory names must be lowercase camelCase (e.g., `breadcrumbs`, `search`, `navigation`).
- Use case files must be camelCase verbs (e.g., `computeBreadcrumbs.ts`, `performAdvancedSearch.ts`).

## Domain vs Application Layer — Quick Decision Guide

Use this to decide whether logic belongs in `src/domain/` or `src/application/`:

| Question                                 | Answer YES →   |
| ---------------------------------------- | -------------- |
| Pure function with no side effects?      | `domain/`      |
| Involves only one domain entity/concept? | `domain/`      |
| Needs to load or persist data?           | `application/` |
| Crosses multiple domain concepts?        | `application/` |
| Answers "what the business IS"?          | `domain/`      |
| Answers "how/when we USE the rules"?     | `application/` |

Flag code in `src/application/` that should be in `src/domain/`:

- A function that takes a single entity and returns a derived value (slug, label, boolean flag) with no I/O.
- A validation function that checks a business rule against a single entity.

Flag code that should NOT be in `src/domain/`:

- A function that imports from multiple domain directories.
- A function that calls persistence functions to load or save data.
- A function that builds a result by coordinating several domain use cases.

```ts
// Bad — pure single-entity function mistakenly placed in application/
// application/center/getCenterSlug.ts
export function getCenterSlug(center: Center): string {
  return `/p/${center.slug}/` // no I/O, single entity → belongs in domain/
}

// Good — application coordinates, domain decides
// application/breadcrumbs/computeBreadcrumbs.ts
import { getCenterProfileSlug } from '@/domain/center/use-cases/getCenterProfileSlug'
import { getTaxonomySlug } from '@/domain/taxonomy/use-cases/getTaxonomySlug'
import { getLocationBySlug } from '@/persistence/location/location.persistence'

export async function computeBreadcrumbs(params) {
  const location = await getLocationBySlug(params.locationSlug) // I/O → application
  return [
    { label: 'Home', href: '/' },
    { label: location.name, href: getLocationSlug(location) }, // domain
    { label: params.center.name, href: getCenterProfileUrl(params.center) } // application
  ]
}
```

---

## Layer: components/ (UI Components)
# Components Layer — Bugbot Rules

These rules apply when PR changes include files inside `src/components/`.

Components are organized using Atomic Design: `atoms/` → `molecules/` → `organisms/`. All components must be reusable — page-specific, non-reusable components belong in `src/app/`.

## Atomic Design Placement

Flag components placed at the wrong atomic level:

- **Atoms** (`atoms/`): Basic, indivisible UI elements (Button, Input, Icon, Badge). Flag atoms that import or compose molecules or organisms.
- **Molecules** (`molecules/`): Combinations of 2–3 atoms serving a single purpose (SearchBar, FormField, NavLink). Flag molecules that compose organisms or contain full page sections.
- **Organisms** (`organisms/`): Complex sections composed of molecules and atoms (Header, CenterCard, FilterSidebar). Flag organisms placed inside `atoms/` or `molecules/`.

## No Data Fetching

Flag data-fetching logic inside `src/components/`.

- Flag `fetch(`, `axios.`, direct persistence imports, or `async` Server Component functions.
- Flag `useEffect` used to fetch data — SEO-critical content must be server-rendered.
- Data fetching belongs in Server Components in `src/app/` or in `src/persistence/`.

```ts
// Bad
export function CenterCard() {
  const [data, setData] = useState(null)
  useEffect(() => {
    fetch('/api/centers').then(r => r.json()).then(setData)
  }, [])
}

// Good — receive data as props from a server component
export function CenterCard({ center }: { center: Center }) {
  return <div>{center.name}</div>
}
```

## No Business Logic

Flag domain calculations or business rule functions defined inside `src/components/`.

- Flag functions that derive domain values (slug generation, distance calculations, score computations).
- Business logic belongs in `src/domain/use-cases/`.
- Components may call domain use-case functions but must not contain the logic themselves.

## No Page Layouts

Flag layout templates or page-structure components created inside `src/components/`.

- Route layouts belong in `src/app/**/layout.tsx` following Next.js App Router conventions.
- Flag any component named `*Layout`, `*Template`, or `*PageWrapper` inside `src/components/`.

## React Providers Belong in Organisms

Flag React context providers or components with `Provider` in the name placed in `atoms/` or `molecules/`.

- Providers (e.g., `AnalyticsProvider`, `ThemeProvider`) are complex components and belong in `organisms/`.

## No Service Re-exports or Cross-Module Coupling

Flag components that re-export anything from `src/services/`.

- Import provider components directly from `src/components/`, never re-export them from service modules.

```ts
// Bad — in services/segment/index.ts
export { AnalyticsProvider } from '@/components/organisms/AnalyticsProvider'

// Good — import directly
import { AnalyticsProvider } from '@/components/organisms/AnalyticsProvider/AnalyticsProvider'
```

## Functional Components Only

Flag class-based React components. Always use functional components with hooks.

## TypeScript Props

Flag components without explicit TypeScript prop types.

- Define a `type {ComponentName}Props` for every component.
- Flag `props: any` or untyped props.

## Component Directory Structure

Every extracted component must live in a **self-named folder** with its test file. Standalone `.tsx` files without a folder are not allowed.

```
// Good — self-named folder
atoms/Button/
  Button.tsx
  Button.test.tsx

molecules/SearchBar/
  SearchBar.tsx
  SearchBar.test.tsx

organisms/TopNav/
  TopNav.tsx
  TopNav.test.tsx

// Bad — standalone file (must have a folder)
atoms/Button.tsx
organisms/CenterCard.tsx
```

Rules by level:

- **Atoms and molecules**: self-named folder + component file + test file only. No sub-folders.
- **Organisms**: self-named folder + test + sub-folders allowed for complex organisms.

Flag any component file that exists as a standalone `.tsx` without a matching folder.

## Component Extraction Decision Tree

Only extract a component from a page if at least one of these is true:

1. **Reusability**: used in 2+ places (or will be imminently).
2. **Server/Client boundary**: needs `'use client'` inside a Server Component page.
3. **Complexity**: the section has complex logic worth testing independently.
4. **File size**: the page exceeds 500 lines and is hard to navigate.

Flag components that appear to be extracted for page-specific, single-use sections with no props — this is over-engineering (YAGNI).

Red flags:

- Component name includes the page name (e.g., `CareersHero`, `AboutHeader`).
- Component has no props (too specific to be reusable).
- Component is only used in one place and does not require `'use client'`.

## Icon Components

Flag icon components that use the `withIcon` HOC pattern. Icons must accept props directly.

- Allowed props: `size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'`, `className?: string`.
- Flag `customCss` prop usage — use `className` instead.
- Flag `withIcon(IconBase)` wrapping — icons must be self-contained components.

```tsx
// Bad
const IconPhoneBase = ({ className }) => <svg className={className} />
export const IconPhone = withIcon(IconPhoneBase)

// Bad — legacy prop
<IconPhone customCss="size-4" />

// Good
export const IconPhone = ({ size = 'md', className }) => (
  <svg className={`shrink-0 ${className ?? sizeClassName[size]}`} aria-hidden="true" role="img" />
)
```

## Accessibility

Flag accessibility violations in component files:

- **Semantic HTML**: Flag `<div onClick>` or `<span onClick>` without `role="button"` and `tabIndex={0}`. Always prefer `<button>` for actions and `<a>` for links.
- **Form labels**: Flag `<input>` without a corresponding `<label for>` or wrapper `<label>`. Placeholder text alone is not sufficient.
- **Focus indicators**: Flag `outline: none` or `outline: 0` CSS without a replacement focus style.
- **tabindex**: Flag positive `tabindex` values (e.g., `tabindex="2"`). Only `0` and `-1` are acceptable.
- **aria-hidden on interactive elements**: Flag `aria-hidden="true"` on `<button>`, `<a>`, or `<input>`.
- **Icon-only buttons**: Flag `<button>` containing only an icon image with no visible or accessible text. Add `aria-label` or visually hidden text.
- **Color as sole indicator**: Flag error or status states conveyed only by color with no text or icon alternative.

---

## Layer: domain/ (Business Logic)
# Domain Layer — Bugbot Rules

These rules apply when PR changes include files inside `src/domain/`.

The domain layer contains core business logic and domain models. It must be fully independent of all outer layers (persistence, services, UI, framework).

## No Data Access

Flag any data-fetching calls inside `src/domain/`.

- Flag `fetch(`, `axios.`, `sanityClient.`, `prisma.`, or any database/HTTP client usage.
- Data access belongs in `src/persistence/`.

```ts
// Bad — in src/domain/center/use-cases/fetchCenters.ts
export async function fetchCenters() {
  const response = await fetch('/api/centers') // Wrong — belongs in persistence/
}

// Good — data access in persistence, domain stays pure
import type { Center } from '../center'
export function getCenterProfileSlug(center: Center): string {
  return `/p/${center.slug}/`
}
```

## No UI or JSX

Flag JSX syntax or React component definitions inside `src/domain/`.

- Flag any `.tsx` extension or `import React` / `import { ... } from 'react'` for rendering in domain files.
- Components belong in `src/components/`.

## No External Service Calls

Flag imports from `src/services/` or direct third-party SDK calls (Algolia, Google Maps, etc.) inside `src/domain/`.

## Use Domain Use-Case Functions

Flag constructing domain-derived values inline instead of using use-case functions.

- Flag template literals or string concatenation that build slugs, URLs, or derived values from domain objects directly.
- Example: flag `` `/p/${center.slug}` `` and suggest `getCenterProfileSlug(center)` from `src/domain/center/use-cases/getCenterProfileSlug`.

## Use-Case File Structure

- Each file in a `use-cases/` directory must export exactly **one** named function.
- Flag files that export multiple functions — split them into separate files.
- Flag use-case files that contain side effects (network calls, mutations, logging to external systems).

## Pure Functions

Use-case functions must be pure and deterministic.

- Given the same inputs, they must always return the same output.
- Flag use cases that read from or write to external state (global variables, module-level mutable state, external APIs).

## Domain Type Definitions

- Types and interfaces for domain entities belong in `{domain}/{domain}.ts` (e.g., `center/center.ts`).
- Flag domain entity type definitions placed inside `use-cases/` files — types belong in the top-level domain file.
- Flag database-specific field names (e.g., `_id`, `created_at`) in domain types — use domain terminology.

## No Generic Utilities

Flag utility functions (date formatting, string helpers, number formatting) defined inside `src/domain/`.

- Generic utilities belong in `src/utils/`.
- Domain-specific constants belong in `{domain}/const.ts`.

## Directory Naming

- Domain directories must be lowercase and singular (e.g., `center`, `location`, `taxonomy`).
- Flag PascalCase or plural domain directory names.

## Domain vs Application Layer

Flag logic placed in `src/domain/` that belongs in `src/application/` instead.

A function belongs in the **domain** layer if ALL of these are true:

1. It involves only **one** domain entity/concept.
2. It is a **pure function** — no side effects, no I/O.
3. It does not need to load or persist data.
4. It answers "what the business IS" not "how we USE the rules."

Flag domain functions that:

- Import from multiple different domain directories (cross-domain logic belongs in `src/application/`).
- Call persistence functions or load data from external sources.
- Orchestrate a workflow across more than one domain entity.

```ts
// Bad — cross-domain logic in domain layer
// domain/center/use-cases/getFeaturedCentersRelatedToLocation.ts
import { fetchFeaturedCenters } from '@/persistence/center/center.persistence' // Wrong!
export async function getFeaturedCentersRelatedToLocation({ center }) {
  return fetchFeaturedCenters({ location }) // persistence call — belongs in application/
}

// Good — pure, single-entity domain function
// domain/center/use-cases/getCenterProfileSlug.ts
export function getCenterProfileSlug(center: Center): string {
  return `/p/${center.slug}/`
}
```

---

## Layer: lib/ (SDK Initialization)
# Lib Layer — Bugbot Rules

These rules apply when PR changes include files inside `src/lib/`.

The lib layer provides configured, ready-to-use SDK clients and service initializations. Its sole responsibility is setting up and exporting clients — nothing more.

## SDK Initialization Only

Flag anything beyond client configuration and SDK initialization inside `src/lib/`.

- Flag data-fetching functions (e.g., `getLandingPage`, `fetchCenters`, `getUser`). They belong in `src/persistence/`.
- The pattern to follow: define the client in `lib/`, use it in `persistence/`.

```ts
// Bad — data fetching in lib/
export const fetchLandingPage = async (slug: string) => {
  return sanityClient.fetch(query, { slug }) // data access — wrong location
}

// Good — client config only
export const sanityClient = createClient({
  projectId: clientEnv.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: clientEnv.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: !IS_DEVELOPMENT
})
```

## No Business Logic

Flag domain calculations, business rules, or derived-value functions inside `src/lib/`.

- Business logic belongs in `src/domain/use-cases/`.

## No UI Components

Flag JSX syntax, `.tsx` files, or React component definitions inside `src/lib/`.

- UI components belong in `src/components/`.

## No API Route Handlers

Flag request/response handling (reading `req.body`, returning `NextResponse`) inside `src/lib/`.

- API route handlers belong in `src/app/api/`.

## Use env.ts for Configuration

Flag `process.env` accessed directly in lib files other than `src/lib/env.ts`.

- All environment variable access must go through `clientEnv`, `serverEnv`, or `IS_DEVELOPMENT` from `src/lib/env.ts`.

```ts
// Bad
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID // wrong
})

// Good
import { clientEnv, IS_DEVELOPMENT } from '@/lib/env'

export const sanityClient = createClient({
  projectId: clientEnv.NEXT_PUBLIC_SANITY_PROJECT_ID
})
```

## Singleton Pattern for Database Clients

Flag database clients (Prisma, Redis) instantiated without a singleton guard in Next.js.

- Next.js hot-reloading creates new module instances on each reload, causing connection pool exhaustion.
- Use the `globalThis` singleton pattern for stateful clients.

```ts
// Good — singleton guard for Prisma
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma ?? createPrismaClient()
if (IS_DEVELOPMENT) globalForPrisma.prisma = prisma
```

---

## Layer: persistence/ (Data Access)
# Persistence Layer — Bugbot Rules

These rules apply when PR changes include files inside `src/persistence/`.

The persistence layer handles all data access and storage. It isolates data access from business logic and provides clean interfaces to the rest of the application.

## No Business Logic

Flag domain calculations, business rules, or derived-value functions inside `src/persistence/`.

- Flag functions like `calculateScore`, `shouldShowDistanceLabel`, or any function that applies a business rule.
- Business logic belongs in `src/domain/use-cases/`.

```ts
// Bad — in persistence
export function calculateCenterScore(center: Center) {
  return center.reviews * center.rating // domain logic — wrong location
}

// Good — data access only
export const getCenterBySlug = async (
  slug: string
): Promise<CenterDto | null> => {
  return sanityClient.fetch(query, { slug })
}
```

## No UI Components

Flag JSX syntax, `.tsx` files, or React component definitions inside `src/persistence/`.

- UI components belong in `src/components/`.

## Required DTO Files

Every entity with a `.persistence.ts` file must have a corresponding `.dto.ts` file.

- Flag `.persistence.ts` files without a matching `.dto.ts` in the same directory.
- DTOs must match the exact shape of the external API response (Sanity, Prisma, REST API, etc.).
- Flag domain entity types (e.g., `type Center`) defined inside `.dto.ts` or `.persistence.ts` files — domain types belong in `src/domain/{entity}/{entity}.ts`.

## File Naming Conventions

Flag files that do not follow the naming convention:

- Data access files must end in `.persistence.ts`
- DTO files must end in `.dto.ts`
- Test files must end in `.persistence.spec.ts` or `.persistence.test.ts`

```
// Good
center.persistence.ts
center.dto.ts
center.persistence.spec.ts

// Bad
centerRepository.ts       // wrong suffix
center.types.ts           // DTOs should use .dto.ts
centerTests.ts            // wrong naming
```

## No Domain Entity Definitions

Flag type definitions for domain entities (e.g., `type Center`, `interface Location`) in persistence files.

- Domain types belong in `src/domain/{entity}/{entity}.ts`.
- Persistence files may define DTO types that match the external API shape, but must not redefine domain models.

## Error Handling

Flag persistence functions that let network or API errors propagate without any handling or logging.

- Persistence functions should handle errors gracefully and use `logger` from `src/utils/logger/index.ts` for non-fatal failures.

## No Cross-Entity Imports in DTOs

Flag `.dto.ts` files that import from other domain or persistence modules to compose their shape.

- DTOs must represent the raw external API response exactly as returned — no transformation logic inside DTOs.

---

## Layer: services/ (External Integrations)
# Services Layer — Bugbot Rules

These rules apply when PR changes include files inside `src/services/`.

The services layer wraps external third-party APIs and integrations (geolocation, search, analytics, email). It abstracts external complexity but must not contain business logic, UI, or persistence.

## No React Components or JSX

Flag any `.tsx` files, JSX syntax, or React component definitions inside `src/services/`.

- React providers and context components belong in `src/components/organisms/`.
- Services contain only client logic, types, and configuration.

```ts
// Bad — in services/segment/SegmentProvider.tsx
export function SegmentProvider({ children }) {
  return <>{children}</> // React component — wrong location
}

// Good — provider lives in components/organisms/
// Import from components, not from services
import { AnalyticsProvider } from '@/components/organisms/AnalyticsProvider/AnalyticsProvider'
```

## No Domain Imports

Flag imports from `src/domain/` inside `src/services/`.

- Services must not depend on domain types or use-case functions.
- Services define their own request/response types in `{service}/{service}.ts`.

```ts
// Bad
import type { Center } from '@/domain/center/center' // wrong — services don't import from domain

// Good
import type { GeolocationResult } from './geolocation'
```

## No Persistence Logic

Flag database queries, data storage, or state management inside `src/services/`.

- Data storage belongs in `src/persistence/`.

## No Business Logic

Flag domain rules, validations, or calculations (e.g., filtering centers by distance, scoring results) inside `src/services/`.

- Business logic belongs in `src/domain/use-cases/`.

## No Component Re-exports

Flag any `index.ts` in a service directory that re-exports a component from `src/components/`.

- Import components directly from their source in `src/components/`.

```ts
// Bad — in services/segment/index.ts
export { AnalyticsProvider } from '@/components/organisms/AnalyticsProvider'

// Good — import directly from components
import { AnalyticsProvider } from '@/components/organisms/AnalyticsProvider/AnalyticsProvider'
```

## Required File Structure

Each service directory must follow this structure:

```
services/
└── {serviceName}/
    ├── {serviceName}.ts  # type definitions and interfaces
    ├── const.ts          # configuration, endpoints, environment variable references
    └── client.ts         # service client implementation
    └── utils.ts          # optional helper functions
```

- Flag services that define all types, config, and client logic in a single file.
- Service directory names must be lowercase singular (e.g., `geolocation`, `search`, `analytics`).

## Environment Variables in const.ts

Flag `process.env` accessed directly inside `client.ts` or `utils.ts`.

- Environment variable references in services must go through `src/lib/env.ts` (`clientEnv`, `serverEnv`).
- Configuration belongs in the service's `const.ts`, using values from `env.ts`.
