
# Atomic Design Component Guidelines

## Core Principle: KISS (Keep It Simple, Stupid)

**Default behavior: Keep components inline in pages unless there's a clear reason to extract.**

Avoid premature abstraction. Only extract components when there's genuine benefit.

## Decision Tree: Should I Create a Component?

### Keep Inline (Default)

Extract to a separate component file **ONLY IF** at least one of these is true:

1. **Reusability**: Used in 2+ places (or will be soon)
2. **Server/Client Boundary**: Need `'use client'` in a Server Component page
3. **Complexity**: Section has complex logic worth testing separately
4. **File Size**: Page exceeds 500+ lines AND is hard to navigate

```tsx
// Good: Keep inline (page-specific, not reused)
export default function CareersPage() {
  return (
    <div>
      <div className="bg-seafoam-100">
        <h1>Join Recovery.com</h1>
      </div>
      <div>
        <h2>Benefits</h2>
      </div>
      <div>
        <h2>Our Values</h2>
      </div>
    </div>
  )
}

// Bad: Over-engineering page-specific content
import { CareersHero } from '@/components/organisms/CareersHero/CareersHero'
import { CareersBenefits } from '@/components/organisms/CareersBenefits/CareersBenefits'
```

### Extract to Component (Only When Necessary)

**Server/Client Boundary:**

```tsx
// Good: Extract because of 'use client' requirement
// File: components/molecules/ScrollToButton/ScrollToButton.tsx
'use client'
export const ScrollToButton = ({ targetId, children }) => {
  const handleClick = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })
  }
  return <Button onClick={handleClick}>{children}</Button>
}
```

**Genuine Reusability:**

```tsx
// Good: Used in multiple pages
// File: components/organisms/Paylocity/Paylocity.tsx
export const Paylocity = async () => {
  const { jobs } = await fetchPaylocityJobs()
  return <JobsList jobs={jobs} />
}
```

## Atomic Design Hierarchy

### Atoms (Basic Building Blocks)

- Basic HTML elements with styling
- No composition, single responsibility
- Highly reusable
- Examples: `Button`, `Input`, `Icon`, `Badge`, `Spinner`

```tsx
// Good: Reusable atom
export const Button = ({ children, onClick, variant }) => (
  <button
    className={buttonVariants({ variant })}
    onClick={onClick}
  >
    {children}
  </button>
)

// Bad: Too specific for an atom
export const SubmitContactFormButton = () => (
  <button>Submit Contact Form</button>
)
```

### Molecules (Simple Combinations)

- Combines 2-3 atoms
- Single, focused purpose
- Still fairly generic
- Examples: `SearchBar` (Input + Button), `FormField` (Label + Input + Error)

```tsx
// Good: Reusable molecule
export const ScrollToButton = ({ targetId, children }) => {
  const handleClick = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })
  }
  return <Button onClick={handleClick}>{children}</Button>
}

// Bad: Page-specific, should be inline
export const CareersPageScrollButton = () => (
  <Button onClick={() => scrollToOpenings()}>See Positions</Button>
)
```

### Organisms (Complex Sections)

- Complex UI combining molecules + atoms
- Feature-complete sections
- React providers and context components
- Examples: `Header`, `Footer`, `Paylocity`, `AnalyticsProvider`

```tsx
// Good: Reusable organism
export const Paylocity = async () => {
  const { jobs, error } = await fetchPaylocityJobs()
  if (error) return <ErrorState />
  if (isEmptyArray(jobs)) return <EmptyState />
  return <JobsList jobs={jobs} />
}

// Bad: Page-specific section, should be inline
export const CareersBenefitsSection = () => (
  <div>
    <h2>Benefits</h2>
    <ul>
      <li>401k</li>
      <li>Health Insurance</li>
    </ul>
  </div>
)
```

## Server Components vs Client Components

Server Components are the default in Next.js. Only use `'use client'` when necessary.

**Extract** when client interactivity is needed in a Server Component page.
**Keep inline** when content is static and page-specific.

## File Structure

### Core Convention

Every extracted component lives in a **self-named folder** with its test file. No standalone component files -- every component gets a folder because it should have a test.

### Atoms & Molecules

Self-named folder with the component file and its test. No sub-folders, no sub-components.

```
atoms/Button/
├── Button.tsx
└── Button.test.tsx

molecules/StarRatings/
├── StarRatings.tsx
└── StarRatings.test.tsx
```

### Simple Organisms

Same self-named folder pattern:

```
organisms/Footer/
├── Footer.tsx
└── Footer.test.tsx
```

### Complex Organisms (Feature Folder)

Organisms **may** include sub-components, sub-folders, variations, and shared internals when complexity warrants it. This is the only level where sub-folders are allowed.

```
organisms/TopNav/
├── TopNav.tsx                  ← public entry point
├── TopNav.test.tsx
├── LandingPageTopNav.tsx       ← variation
├── shared/                     ← internal helpers
│   ├── HiddenSSR.tsx
│   └── RecoveryComLogoLinked.tsx
├── DesktopNav/
│   ├── DesktopNav.tsx
│   ├── menus/
│   │   ├── TreatmentMegaMenu.tsx
│   │   └── LocationMegaMenu.tsx
│   └── panels/
│       ├── TreatmentPanel.tsx
│       └── LocationPanel.tsx
└── MobileNav/
    ├── MobileNav.tsx
    └── pages/
        ├── TreatmentMenu.tsx
        └── LocationMenu.tsx
```

### Structure Summary

| Level    | Structure                       | Sub-folders allowed |
| -------- | ------------------------------- | ------------------- |
| Atom     | Self-named folder + test        | No                  |
| Molecule | Self-named folder + test        | No                  |
| Organism | Self-named folder + test + subs | Yes                 |

### Imports

Always import directly from the source file. No barrel files with runtime exports (enforced by the `barrel-files` rule in `recovery/code-standards`).

Library components from `@rehabpath/core-components` are imported directly from the package — that is not a barrel file. See the `core-components` rule in `recovery/frontend` for which components live in the library vs locally.

```ts
// Good — local component
import { TopNav } from '@/components/organisms/TopNav/TopNav'
import { DesktopNav } from '@/components/organisms/TopNav/DesktopNav/DesktopNav'

// Good — library component (Button lives in @rehabpath/core-components, not locally)
import { Button } from '@rehabpath/core-components'

// Bad — local barrel file
import { TopNav } from '@/components/organisms/TopNav'
```

## Red Flags: Over-Engineering

**You're over-engineering if:**

1. Creating components for single-use page sections
2. File names include page names (`CareersHero`, `AboutHeader`)
3. Creating a component for every `<div>` section
4. "Just in case we need it later" (YAGNI violation)
5. Component has no props (too specific)

## Migration

When touching an existing component that is a standalone file (e.g., `organisms/Footer.tsx`):

1. Create the self-named folder: `organisms/Footer/`
2. Move the component into it: `organisms/Footer/Footer.tsx`
3. Add a test file: `organisms/Footer/Footer.test.tsx`
4. Update all imports to point to the new path
5. Remove any barrel `index.ts` that re-exports runtime code
