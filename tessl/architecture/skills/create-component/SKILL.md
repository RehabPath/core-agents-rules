---
name: create-component
description: Scaffold a new atomic design component with correct file structure, test file, and placement decision. Use when asked to create a new React component.
---

# Create Component

## Purpose

Create components that follow atomic design hierarchy, live in the correct directory, and come with a test file from day one.

## When To Use

Use this skill when asked to:

- Create a new React component
- Extract an inline section into a reusable component
- Add a new atom, molecule, or organism

## Required Workflow

### Step 1: Decide whether to extract at all

Before creating anything, apply this decision tree:

Extract to a separate component file **only if at least one** of these is true:

1. **Reusability** — used in 2+ places (or will be soon)
2. **Server/Client boundary** — needs `'use client'` inside a Server Component page
3. **Complexity** — has logic complex enough to warrant isolated testing
4. **File size** — the page exceeds ~500 lines and is hard to navigate

If none of these apply, keep it inline. Tell the user why.

### Step 2: Determine the atomic level

| Level        | Description                                                             | Examples                                             |
| ------------ | ----------------------------------------------------------------------- | ---------------------------------------------------- |
| **Atom**     | Basic HTML element with styling. No composition, single responsibility. | `Button`, `Input`, `Icon`, `Badge`                   |
| **Molecule** | Combines 2–3 atoms for a single focused purpose. Still generic.         | `SearchBar`, `FormField`, `ScrollToButton`           |
| **Organism** | Complex section combining molecules and atoms. Feature-complete.        | `Header`, `Footer`, `Paylocity`, `AnalyticsProvider` |

Red flags for the wrong level:

- Name includes a page name → too specific, keep inline (`CareersHero`, `AboutHeader`)
- No props → too specific
- Built for one place with no realistic reuse

### Step 3: Create the file structure

Every component lives in a **self-named folder**. No standalone component files.

**Atoms and molecules** — self-named folder, component file, and test file only:

```
src/components/atoms/Badge/
├── Badge.tsx
└── Badge.test.tsx

src/components/molecules/SearchBar/
├── SearchBar.tsx
└── SearchBar.test.tsx
```

**Simple organisms** — same pattern:

```
src/components/organisms/Footer/
├── Footer.tsx
└── Footer.test.tsx
```

**Complex organisms** — may include sub-components and sub-folders:

```
src/components/organisms/TopNav/
├── TopNav.tsx          ← public entry point
├── TopNav.test.tsx
├── DesktopNav/
│   └── DesktopNav.tsx
└── MobileNav/
    └── MobileNav.tsx
```

Sub-folders are **only** allowed at organism level.

### Step 4: Write the component

Follow these conventions:

- Use functional components
- Default to Server Component (no `'use client'` unless needed)
- Add `'use client'` only when the component requires browser APIs or event handlers
- Name the file and export identically: `Badge.tsx` exports `export const Badge`
- File naming: PascalCase for component files and folders

**Import pattern** — always import directly from source, never from barrel files:

```ts
// Good
import { Button } from "@/components/atoms/Button/Button";

// Bad — barrel import
import { Button } from "@/components/atoms/Button";
```

### Step 5: Write the test file

Create `ComponentName.test.tsx` in the same folder.

Minimum structure:

```tsx
import { render, screen } from "@testing-library/react";
import { ComponentName } from "./ComponentName";

describe("ComponentName", () => {
  describe("given [default / happy path condition]", () => {
    it("should render [expected output]", () => {
      render(<ComponentName />);
      expect(screen.getByText("...")).toBeInTheDocument();
    });
  });
});
```

Follow the unit-test patterns: `describe` → component, nested `describe` → condition, `it` → expected behavior.

### Step 6: Update imports at the call site

Update all places that use the component to import directly from the new source path:

```ts
import { Badge } from "@/components/atoms/Badge/Badge";
```

Never add a runtime export to an `index.ts` barrel file.
