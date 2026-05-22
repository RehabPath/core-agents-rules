---
name: add-icon
description: Create a new icon component from an SVG with correct props, viewBox, size map, and Lucide stroke handling. Use when asked to add a new icon to the codebase.
---

# Add Icon

## Purpose

Turn an SVG into a properly structured icon component that follows the project's icon pattern — no HOCs, correct size prop, valid viewBox, and correct Lucide stroke handling when applicable.

## When To Use

Use this skill when asked to:

- Add a new icon to the codebase
- Create an icon component from an SVG asset
- Migrate an icon that uses `withIcon` or `customCss`

## Required Workflow

### Step 1: Get the SVG

Ask the user to provide the SVG markup, or confirm the file path if it exists in the repo.

**Before using any SVG, verify:**

- It has a `viewBox` attribute — if missing, the icon will render incorrectly
- It does not have hardcoded `width` and `height` attributes on the `<svg>` root that would override component sizing

If `viewBox` is missing, inspect the SVG's intended dimensions from the design tool or source and add `viewBox="0 0 [width] [height]"` manually.

### Step 2: Determine icon placement

Icons live in `src/components/atoms/icons/`. Name the file `Icon[Name].tsx`, e.g., `IconStar.tsx`.

### Step 3: Write the component

Use this exact pattern — no `withIcon` HOC, props accepted directly:

```tsx
import { FC } from "react";

const sizeClassName = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
  "2xl": "w-12 h-12",
};

interface Icon[Name]Props {
  size?: keyof typeof sizeClassName;
  className?: string;
}

export const Icon[Name]: FC<Icon[Name]Props> = ({ size = "md", className }) => (
  <svg
    className={`shrink-0 ${className ?? sizeClassName[size]}`}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    aria-hidden="true"
    role="img"
  >
    {/* SVG path(s) here */}
  </svg>
);
```

Key rules:

- `shrink-0` is always applied via the class string — never omit it
- `className` overrides the size-based class when provided
- `colorStopOffset?: number` may be added to the interface **only** if the icon uses a gradient
- Do **not** add `customCss` — it is not allowed

### Step 4: Handle Lucide icons specially

If the icon comes from Lucide (uses `viewBox="0 0 24 24"` and renders smaller than 24px), strokes will appear thinner than designed because they scale with the viewBox.

**Always apply both CSS properties on child elements:**

```tsx
// When using a Lucide component
<ChevronDown className="size-4 [&_*]:[stroke-width:1.25px] [&_*]:[vector-effect:non-scaling-stroke]" />
```

- `stroke-width` must use **px units** — not unitless SVG values
- `vector-effect: non-scaling-stroke` keeps strokes at true screen pixels
- `[&_*]` targets all child SVG elements (`path`, `line`, `circle`, etc.)

**Do not:**

```tsx
// Bad — unitless, still scales with viewBox
<ChevronDown strokeWidth={1.25} />

// Bad — only on the svg root, children won't inherit
<ChevronDown className="[stroke-width:1.25px]" />
```

### Step 5: Verify the output

Check:

- `viewBox` is present and correct
- No `width`/`height` attributes on the `<svg>` root
- `shrink-0` is in the className string
- `withIcon` is not imported or used
- `customCss` prop is not present
- Component is exported as a named export from its own file

### Step 6: Usage examples for the caller

After creating the component, show the user how to use it:

```tsx
// Size preset
<Icon[Name] size="lg" />

// Custom class (overrides size preset)
<Icon[Name] className="size-4 text-gray-1100" />
```
