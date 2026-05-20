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
