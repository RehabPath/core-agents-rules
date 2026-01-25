---
root: false
targets: ["cursor", "claudecode"]
description: "Atomic Design component creation guidelines"
globs: ["**/components/**/*.tsx", "**/components/**/*.jsx"]
cursor:
  alwaysApply: false
  description: "Atomic Design component creation guidelines"
---

# Atomic Design Component Creation Guidelines

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

### Extract to Component (Only When Necessary)

#### Example 1: Server/Client Boundary

```tsx
// GOOD: Extract because of 'use client' requirement
// File: components/molecules/ScrollToButton.tsx
'use client'
export const ScrollToButton = ({ targetId, children }) => {
  const handleClick = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })
  }
  return <Button onClick={handleClick}>{children}</Button>
}

// File: app/careers/page.tsx (Server Component)
export default function CareersPage() {
  return (
    <div>
      <ScrollToButton targetId="openings">See Positions</ScrollToButton>
      {/* Can't inline because page is Server Component */}
    </div>
  )
}
```

#### Example 2: Genuine Reusability

```tsx
// GOOD: Used in multiple pages
// File: components/organisms/Paylocity/Paylocity.tsx
export const Paylocity = async () => {
  const { jobs } = await fetchPaylocityJobs()
  return <JobsList jobs={jobs} />
}

// Used in: /careers, /about, /jobs
```

## Atomic Design Hierarchy

### Atoms (Basic Building Blocks)

**What belongs:**

- Basic HTML elements with styling
- No composition, single responsibility
- Highly reusable

**Examples:**

- `Button`, `Input`, `Icon`, `Badge`, `Spinner`

**When to create:**

- Used 2+ times across different contexts
- Generic enough for multiple use cases

### Molecules (Simple Combinations)

**What belongs:**

- Combines 2-3 atoms
- Single, focused purpose
- Still fairly generic

**Examples:**

- `SearchBar` (Input + Button)
- `FormField` (Label + Input + Error)
- `ScrollToButton` (Button + scroll logic)

**When to create:**

- Combination is reused 2+ times
- Needs client-side interactivity in Server Component
- Clear single responsibility

### Organisms (Complex Sections)

**What belongs:**

- Complex UI combining molecules + atoms
- Feature-complete sections
- React providers and context components
- May contain presentation logic

**Examples:**

- `Header`, `Footer`, `Paylocity`, `AnalyticsProvider`

**When to create:**

- Reused across multiple pages
- Self-contained feature with complexity
- React provider/context wrapper

## Server Components vs Client Components

### Prefer Server Components

Server Components are the default in Next.js 14+. Only use `'use client'` when necessary.

**Extract to separate file when:**

```tsx
// Server Component page
export default function Page() {
  return (
    <div>
      {/* Need client interactivity - must extract */}
      <ScrollToButton /> {/* 'use client' in separate file */}
      {/* Server Component - can inline or extract */}
      <Paylocity /> {/* async Server Component */}
    </div>
  )
}
```

**Keep inline when:**

```tsx
// Server Component page
export default function Page() {
  return (
    <div>
      {/* Static content - keep inline */}
      <div className="hero">
        <h1>Welcome</h1>
        <p>Description</p>
      </div>
    </div>
  )
}
```

## File Organization

### When Component IS Extracted

Follow this structure:

```
components/
├── atoms/
│   └── Button.tsx              # Single file for simple atoms
├── molecules/
│   └── ScrollToButton.tsx      # Single file for simple molecules
└── organisms/
    └── Paylocity/              # Directory for complex organisms
        ├── Paylocity.tsx       # Main component
        ├── JobCard.tsx         # Sub-component
        ├── JobsList.tsx        # Sub-component
        ├── EmptyState.tsx      # State component
        ├── ErrorState.tsx      # State component
        └── index.ts            # Public exports
```

**When to use directory:**

- Organism with multiple sub-components
- Has internal components not used elsewhere
- Benefits from co-location

**When to use single file:**

- Simple atom or molecule
- No sub-components
- Self-contained in one file

## Red Flags: Over-Engineering

### Warning Signs

**You're over-engineering if:**

1. Creating components for single-use page sections
2. File names include page names (`CareersHero`, `AboutHeader`)
3. Creating component for every `<div>` section
4. "Just in case we need it later" (YAGNI violation)
5. Component has no props (too specific)

**Examples of over-engineering:**

```tsx
// BAD: Unnecessary extraction
components/organisms/CareersPage/
├── CareersHero.tsx           # Only used once
├── CareersBenefits.tsx       # Only used once
├── CareersValues.tsx         # Only used once
├── CareersAbout.tsx          # Only used once
└── CareersOpenings.tsx       # Only used once

// GOOD: Keep in page
app/(marketing)/careers/page.tsx  # All sections inline
```
