---
description: Rules for using the core-components shared library — what to import from the library vs local equivalents
alwaysApply: true
---

# Core Components Library Usage

The core-components library (`@rehabpath/core-components`) is an internal shared library (published to GitHub Packages) providing UI components, utilities, and design tokens. It is built on Tailwind CSS v4, shadcn/ui (New York style), and Radix UI.

## What the library exports

### Components

- `Button` / `ButtonProps` — primary interactive element with variant + size system
- `SeoLink` / `SeoLinkProps` — Next.js-aware link with SEO rel/target handling
- `Input` / `InputProps` — form input with size variants
- `Textarea` / `TextareaProps` — form textarea with size variants
- `InputGroup` — compound input composition (with `InputGroupAddon`, `InputGroupButton`, `InputGroupText`, `InputGroupInput`, `InputGroupTextarea`)

### Utilities

- `cn` — class name merger (clsx + tailwind-merge)
- Type check functions: `isNull`, `isUndefined`, `isNil`, `isBlank`, `isString`, `isNonEmptyString`, `isEmptyString`, `isNumber`, `isFiniteNumber`, `isBoolean`, `isObject`, `isNonEmptyObject`, `isEmptyArray`, `isNonEmptyArray`, `isFunction`, `isValidId`
- URL/link helpers: `isExternalLink`, `getSafeUrl`, `isInternalPath`, `getRel`

### Variant functions (CVA)

- `buttonVariants`, `inputVariants`, `textareaVariants`, `inputGroupAddonVariants`, `inputGroupButtonVariants`

---

## Import rules

### ✅ Always import `Button` from the library

There is no local Button wrapper. Always use the library directly:

```typescript
import { Button } from "@rehabpath/core-components";
import type { ButtonProps } from "@rehabpath/core-components";
```

### ✅ Prefer library `Input`, `Textarea`, and `InputGroup` for forms

These are not yet widely adopted but should be used for new form inputs:

```typescript
import { Input, Textarea, InputGroup } from "@rehabpath/core-components";
```

### ❌ Do NOT import `SeoLink` from the library

Use the local atom, which adds `data-text` support and browse-page `rel` logic:

```typescript
// Bad
import { SeoLink } from "@rehabpath/core-components";

// Good
import { SeoLink } from "@/components/atoms/SeoLink/SeoLink";
```

### ❌ Do NOT import `cn` from the library

Use the local utility (already established across the codebase):

```typescript
// Bad
import { cn } from "@rehabpath/core-components";

// Good
import { cn } from "@/utils/shadcnUtils";
```

### ❌ Do NOT import check utilities from the library

Use the local version — it has more functions (`isArrayWithLessThanNValues`, `isError`, `isReactComponent`, `isEnumValue`, `isKeyOfObject`, `arrayIncludes`):

```typescript
// Bad
import { isNil, isNonEmptyString } from "@rehabpath/core-components";

// Good
import { isNil, isNonEmptyString } from "@/utils/checks.util";
```

### ❌ Do NOT import URL utilities from the library

Use the local versions in `@/utils/seo.util`:

```typescript
// Bad
import { isExternalLink, getSafeUrl } from "@rehabpath/core-components";

// Good
import { isExternalLink, getSafeUrl } from "@/utils/seo.util";
```

---

## Button API reference

```typescript
<Button
  variant="default | destructive | outline | secondary | ghost | link"
  size="default | sm | lg | icon-xxs | icon-xs | icon-sm | icon-default | icon-lg"
  href="/path"              // renders as <a> when provided
  target="_blank"
  rel="noopener noreferrer"
  forceTrackingExternal     // omits noopener/noreferrer for tracking links
  forceFollowExternal       // omits nofollow for external links
  asChild                   // renders children as root element (Radix Slot)
  ariaLabel="label"
  onClick={handleClick}
>
  Label
</Button>
```

- When `href` is passed, renders as `<a>` (no `as` prop needed)
- Use `asChild` to wrap non-button elements (e.g., a `Link` component) while keeping button styles
- Use icon size variants (`icon-xs`, `icon-sm`, etc.) for square icon-only buttons

---

## Theme / CSS tokens

The library ships design tokens via a CSS import that is already configured in `src/app/globals.css`:

```css
@import "@rehabpath/core-components/theme.css";
```

Do **not** duplicate design tokens locally that are already provided by the library theme.
