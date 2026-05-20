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
