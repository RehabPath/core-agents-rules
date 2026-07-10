# @rehabpath/core-components Usage

`@rehabpath/core-components` is an internal shared library (published to GitHub Packages) providing UI components, utilities, and design tokens. It is built on Tailwind CSS v4, shadcn/ui (New York style), and Radix UI.

> **Source of truth:** the authoritative export list is `core-components/src/index.ts`. If this rule and that file disagree, the file wins — update this rule to match.

## Guiding principle

Prefer library components/utilities **when there is no local equivalent**. When a local equivalent exists, it is usually there because it diverges from the library version (extra SEO logic, more type guards, different markup). In that case keep using the local one — do not blindly swap it for the library version, because the behavior may differ.

---

## What the library exports

### Components

- `Button` / `ButtonProps` — primary interactive element with variant + size system
- `Input` / `InputProps` — form input with size variants
- `Textarea` / `TextareaProps` — form textarea with size variants
- `InputGroup` — compound input composition (`InputGroupAddon`, `InputGroupButton`, `InputGroupText`, `InputGroupInput`, `InputGroupTextarea`)
- `Alert` / `AlertProps` (+ `AlertTitle`, `AlertDescription`) — status/callout banner with `default | destructive | warning | info | success` variants
- `OptimizedImage` / `OptimizedImageProps` — `next/image` wrapper with automatic Sanity/Cloudinary loaders
- `Toaster`, `toast` (+ `CustomToast`, `ToastImage`, `ToastAction`) — Sonner-based toast system
- `Popover` / `PopoverProps` — desktop hover/click popover (popper-based)
- `BottomSheet` / `BottomSheetProps` — mobile bottom-sheet dialog
- `ResponsivePopover` / `ResponsivePopoverProps` — `Popover` on desktop + `BottomSheet` on mobile
- `LinkButton` / `LinkButtonProps` — text link styled as a button
- `SeoLink` / `SeoLinkProps` — Next.js-aware link with SEO rel/target handling

### Hooks

- `useIsMobile` — SSR-safe mobile-viewport check

### Utilities

- `cn` — class name merger (clsx + tailwind-merge)
- Type check functions: `isNull`, `isUndefined`, `isNil`, `isBlank`, `isString`, `isNonEmptyString`, `isEmptyString`, `isNumber`, `isFiniteNumber`, `isBoolean`, `isObject`, `isNonEmptyObject`, `isEmptyArray`, `isNonEmptyArray`, `isFunction`, `isValidId`
- URL/link helpers: `isExternalLink`, `getSafeUrl`, `isInternalPath`, `getRel`
- Image URL helpers: `getOptimizedSanityUrl`, `getOptimizedCloudinaryUrl`
- Lucide stroke classes: `LUCIDE_STROKE_SM_CLASS`, `LUCIDE_STROKE_MD_CLASS`, `LUCIDE_STROKE_SM_TO_MD_LG`, `LUCIDE_STROKE_SM_TO_MD_MD`

### Variant functions (CVA)

- `buttonVariants`, `inputVariants`, `textareaVariants`, `alertVariants`, `inputGroupVariants`

---

## Import decision table

| Export                                                                   | Import from library or use local?                                                                                                                               |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`, `buttonVariants`                                               | ✅ Library (no local wrapper)                                                                                                                                   |
| `Input`, `Textarea`, `InputGroup` (+ subcomponents)                      | ✅ Library — prefer for new form inputs                                                                                                                         |
| `Alert` (+ `AlertTitle`, `AlertDescription`)                             | ✅ Library (no local equivalent)                                                                                                                                |
| `Toaster`, `toast` (+ `CustomToast`, `ToastImage`, `ToastAction`)        | ✅ Library (no local equivalent)                                                                                                                                |
| `ResponsivePopover`                                                      | ✅ Library (local version was removed)                                                                                                                          |
| `SeoLink`                                                                | ❌ Local — `@/components/atoms/SeoLink/SeoLink` (adds `data-text` + browse-page `rel` logic)                                                                    |
| `Popover`                                                                | ❌ Local — `@/components/atoms/Popover/Popover` (local version still canonical)                                                                                 |
| `BottomSheet`                                                            | ❌ Local — `@/components/molecules/BottomSheet/BottomSheet`                                                                                                     |
| `LinkButton`                                                             | ❌ Local — `@/components/atoms/LinkButton/LinkButton` (local wraps anchors in `<object>` to keep them uncrawlable; library version does not)                    |
| `OptimizedImage`                                                         | ❌ Local — `@/components/atoms/OptimizedImage/OptimizedImage` (local version is tested + widely used)                                                           |
| `cn`                                                                     | ❌ Local — `@/utils/shadcnUtils`                                                                                                                                |
| Check utilities (`isNil`, `isString`, …)                                 | ❌ Local — `@/utils/checks.util` (more functions: `isArrayWithLessThanNValues`, `isError`, `isReactComponent`, `isEnumValue`, `isKeyOfObject`, `arrayIncludes`) |
| URL utilities (`isExternalLink`, `getSafeUrl`, …)                        | ❌ Local — `@/utils/seo.util`                                                                                                                                   |
| Image URL helpers (`getOptimizedSanityUrl`, `getOptimizedCloudinaryUrl`) | ❌ Local — use the existing `@/utils` helpers                                                                                                                   |
| Lucide stroke classes (`LUCIDE_STROKE_*`)                                | ❌ Local — `@/utils/lucideIconStrokeClass`                                                                                                                      |
| `useIsMobile`                                                            | ❌ Local — `@/hooks/useIsMobile` (see the `dom-browser-hooks` rule in `recovery/frontend`)                                                                      |

> Some components (`Popover`, `BottomSheet`, `LinkButton`, `OptimizedImage`) exist in **both** the library and locally. Migration to the library is done case-by-case, only after confirming the library version matches local behavior (as was done for `ResponsivePopover`). Until a local version is removed, keep importing it locally.

### Examples

```typescript
// ✅ Library components
import {
  Button,
  Input,
  Alert,
  ResponsivePopover,
  toast,
} from "@rehabpath/core-components";
import type { ButtonProps } from "@rehabpath/core-components";

// ❌ Bad — these have canonical local versions
import {
  SeoLink,
  cn,
  isNil,
  Popover,
  LinkButton,
} from "@rehabpath/core-components";

// ✅ Good — use the local equivalents
import { SeoLink } from "@/components/atoms/SeoLink/SeoLink";
import { cn } from "@/utils/shadcnUtils";
import { isNil, isNonEmptyString } from "@/utils/checks.util";
import { Popover } from "@/components/atoms/Popover/Popover";
import { LinkButton } from "@/components/atoms/LinkButton/LinkButton";
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
