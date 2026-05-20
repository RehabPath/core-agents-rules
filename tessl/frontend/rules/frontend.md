## Animation Guidelines

# Animation Guidelines

Animation should be invisible. When done right, users don't notice animation — they notice the interface feels *good*. The moment someone says "nice animation," you've probably overdone it.

## The 40 Rules of Tasteful Animation

### Timing & Duration

1. **Micro-interactions: 150-250ms.** Hovers, button presses, toggles.
2. **Standard transitions: 200-350ms.** Modals, panels, content appearing.
3. **Complex orchestrations: 400-600ms total.** Page transitions, multi-step reveals. Never longer.
4. **Exit animations should be faster than entrances.** Enter at 300ms, exit at 200ms.
5. **Stagger delays: 30-60ms between items.** Longer staggers (100ms+) feel like a slideshow.
6. **Never animate for more than 1 second total.**

### Easing & Physics

7. **Default to ease-out for entrances.** Elements arriving should decelerate naturally.
8. **Use ease-in for exits.** Elements leaving should accelerate away.
9. **Use ease-in-out sparingly.** Only for elements moving from A to B while staying on screen.
10. **Never use linear easing for UI.** Linear is for progress bars and looping background animations only.
11. **Prefer spring physics for organic motion.** Use `spring(1, 80, 10)` in Motion or CSS `linear()` approximations.
12. **Match easing to physical metaphor.** Dropping? Ease-in with bounce. Rising? Ease-out. Sliding? Ease-in-out.
13. **Consistent easing across related elements.** Modal and backdrop must use the same curve.

### What to Animate

14. **Animate transform and opacity only (when possible).** These are GPU-accelerated.
15. **Never animate width, height, top, left, margin, or padding.** Use `transform: scale()` or `translate()` instead.
16. **Animate from a definite state to a definite state.** Never animate to/from `auto`.
17. **Scale from center for growth, from origin for menus.** Dropdowns scale from their trigger.
18. **Opacity changes should accompany movement.** Don't just fade — fade AND move: `opacity: 0` + `translateY(8px)` to `opacity: 1` + `translateY(0)`.
19. **Keep movement distances small.** 4-16px for micro-interactions. 20-40px for larger reveals.

### Interaction States

20. **Hover: instant on, 150ms off.** Respond immediately; ease out when leaving.
21. **Active/pressed: scale(0.97-0.98).** Never go below 0.95.
22. **Focus: never animate the focus ring itself.** Focus indicators are for accessibility.
23. **Disabled elements: no animation.**
24. **Loading states: subtle pulse or skeleton shimmer.** Not spinners unless absolutely necessary.

### Entrance & Exit Patterns

25. **Fade + rise for content appearing.** `opacity: 0, y: 8` to `opacity: 1, y: 0`.
26. **Fade + sink for content disappearing.** Exit down for natural gravity.
27. **Scale for emphasis, translate for navigation.**
28. **Modals: scale(0.96) + opacity, not scale(0).** Starting from nothing looks cheap.
29. **Toasts: slide from edge + fade.** Come from where they'll return to.
30. **Menus: transform-origin at trigger, scale + opacity.**

### Orchestration & Staggering

31. **Lead with the most important element.**
32. **Background elements animate first, foreground last.** Backdrop, then container, then content, then actions.
33. **Use stagger for related items only.** A list of cards? Stagger. Unrelated elements? Animate together.
34. **Keep stagger groups small (3-7 items).**
35. **Exit in reverse order or all-at-once.**

### Performance & Accessibility

36. **Always respect `prefers-reduced-motion`.** Wrap motion in `@media (prefers-reduced-motion: no-preference)` or check in JS.
37. **Use `will-change` only when needed, remove after.** Never leave it on permanently.
38. **Avoid animating during scroll.** Use Intersection Observer sparingly.
39. **Test on low-end devices.**
40. **Don't animate layout on mobile.** Keep it to transforms and opacity.

## CSS Patterns

### Standard Transition

```css
.element {
  transition: transform 200ms ease-out, opacity 200ms ease-out;
}
```

### Fade + Rise Entrance

```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.entering { animation: fadeInUp 250ms ease-out forwards; }
```

### Spring-like Easing Variables

```css
:root {
  --spring-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --spring-smooth: cubic-bezier(0.22, 1, 0.36, 1);
  --spring-snappy: cubic-bezier(0.16, 1, 0.3, 1);
}
```

### Stagger Pattern

```css
.item { animation: fadeInUp 200ms ease-out backwards; }
.item:nth-child(1) { animation-delay: 0ms; }
.item:nth-child(2) { animation-delay: 40ms; }
.item:nth-child(3) { animation-delay: 80ms; }
.item:nth-child(4) { animation-delay: 120ms; }
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Motion (Framer Motion) Patterns

### Fade + Rise

```tsx
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 4 }}
  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
/>
```

### Spring Physics

```tsx
<motion.div
  animate={{ scale: 1 }}
  whileTap={{ scale: 0.97 }}
  transition={{ type: "spring", stiffness: 400, damping: 25 }}
/>
```

### Stagger Children

```tsx
<motion.ul
  initial="hidden"
  animate="visible"
  variants={{
    visible: { transition: { staggerChildren: 0.04 } },
  }}
>
  {items.map(item => (
    <motion.li
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0 },
      }}
    />
  ))}
</motion.ul>
```

### AnimatePresence

```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={currentView}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.15 }}
  />
</AnimatePresence>
```

## Common Mistakes

- **Bouncy everything.** Bounce is for celebration only, not menus.
- **Slow fades.** If opacity takes more than 200ms, it feels like lag.
- **scale(0) to scale(1).** Start at 0.95+ instead.
- **Inconsistent directions.** If modals enter from bottom, they exit to bottom.
- **Animating on mount unconditionally.** First page load? Maybe. Every re-render? No.
- **Forgetting exit animations.** Things snapping away is jarring.
- **Too many things moving at once.** One focal animation, everything else is secondary or static.

## When NOT to Animate

- Form validation errors (use color/icon changes instead)
- Critical error states (don't delay bad news)
- Content the user is actively reading
- High-frequency updates (live data, timers)
- Anything the user will see hundreds of times per session

---

## Design Conventions

# Team Conventions

## CSS Color Variables in `src/global.css`

When adding new color tokens, follow this two-step pattern:

1. **Define in `:root`** (and `.dark` if needed) using `theme()`:

```css
--muted-foreground-light: theme('colors.gray.700');
```

2. **Expose to Tailwind** via `@theme inline` with `--color-` prefix:

```css
--color-muted-foreground-light: var(--muted-foreground-light);
```

Do **not** extend `tailwind.config.*` for color variables—the `global.css` pattern is sufficient.

## Linting & Formatting

- Fix lint/Prettier errors only in files related to the task—no drive-by fixes.
- Before finishing, ensure no ESLint or Prettier errors in changed code.

## Tailwind Usage

- Prefer the closest utility class over arbitrary values.
- Avoid `mt-[13px]`-style values unless explicitly requested or no utility exists.

## Components & Styling

- Use existing shared components (design system / UI library) whenever possible.
- Do not use inline styles unless explicitly requested.

## Consistency with Existing Patterns

- Check how patterns are implemented elsewhere before introducing new ones.
- If uncertain, ask before inventing a new pattern.

## Figma Handoff (MCP)

When a Figma link is provided:

1. Use the Figma MCP server to extract implementation details.
2. Map styles, variables, spacing, and layout to existing codebase/component equivalents before introducing anything new.

---

## HTML Accessibility

### Keyboard navigation & focus

- Ensure all interactive elements use semantic HTML (`<button>`, `<a href>`, `<input>`), not `<div>` or `<span>`.

  ```html
  <!-- Correct -->
  <button onclick="handleClick()">Click me</button>

  <!-- Incorrect -->
  <div onclick="handleClick()">Click me</div>
  <!-- Missing role="button" and tabindex="0" -->
  ```

- Verify tabindex is only used when necessary and not set to a positive number (tabindex="1" is an anti-pattern).
  ```html
  <!-- Incorrect -->
  <button tabindex="5">Bad Example</button>
  <!-- Avoid positive tabindex -->
  ```
- Ensure elements that should not receive focus do not have tabindex="0".
- Check that focus indicators are not removed via `outline: none;` without an alternative.

  ```css
  /* Incorrect */
  button {
    outline: none;
  }

  /* Correct */
  button:focus {
    outline: 2px solid blue;
  }
  ```

### Semantic HTML & ARIA

- Ensure `<button>` is used instead of `<div>` with onClick.

  ```html
  <!-- Correct -->
  <button>Submit</button>

  <!-- Incorrect -->
  <div onclick="handleClick()">Submit</div>
  ```

- Ensure every image has an alt attribute (or `alt=""` if decorative).

  ```html
  <!-- Correct -->
  <img
    src="chart.png"
    alt="Sales growth chart from 2020 to 2023"
  />

  <!-- Incorrect -->
  <img src="chart.png" />
  ```

- Ensure `<h1>`–`<h6>` headings are used in a logical order and not skipped.
  ```html
  <!-- Incorrect: Skipping levels -->
  <h1>Main Heading</h1>
  <h3>Subheading</h3>
  <!-- Should be <h2> -->
  ```
- Verify elements with interactivity (e.g., `<div>` or `<span>` with onClick) have appropriate ARIA roles or are replaced with semantic elements.
- Check that `aria-hidden="true"` is not used on interactive elements.
  ```html
  <!-- Incorrect -->
  <button aria-hidden="true">Submit</button>
  <!-- Will be ignored by screen readers -->
  ```

### Color & contrast

- Verify interactive elements have distinct hover and focus styles beyond just color.
- Ensure that color is not the sole indicator of meaning—check for text labels or icon alternatives.

  ```html
  <!-- Incorrect -->
  <p style="color: red;">Error</p>

  <!-- Correct -->
  <p><strong>Error:</strong> Invalid input</p>
  ```

### Forms & inputs

- Check that every `<input>` has a corresponding `<label>` with a `for` attribute or is wrapped in `<label>`.

  ```html
  <!-- Correct -->
  <label for="email">Email</label>
  <input
    id="email"
    type="email"
  />

  <!-- Incorrect -->
  <input
    type="email"
    placeholder="Email"
  />
  ```

- Ensure required fields have `aria-required="true"` or the `required` attribute.
- Verify error messages use `aria-live="assertive"` or `aria-describedby`.
  ```html
  <span
    id="error-message"
    aria-live="assertive"
    >Invalid email</span
  >
  <input
    type="email"
    aria-describedby="error-message"
  />
  ```
- Ensure placeholder text is not the only label for an input.

### Responsive & scalable text

- Ensure rem or em units are used for font sizes instead of fixed px values.

  ```css
  /* Correct */
  body {
    font-size: 1rem;
  }

  /* Incorrect */
  body {
    font-size: 14px;
  }
  ```

- Check that max-width and flex-wrap prevent content from breaking at different screen sizes.
- Verify that elements do not rely on absolute positioning (position: absolute) in a way that breaks layouts when zoomed.

### Motion & animations

- Ensure animations can be disabled using `@media (prefers-reduced-motion: reduce)`.
  ```css
  @media (prefers-reduced-motion: reduce) {
    .animated {
      animation: none;
    }
  }
  ```
- Check that animations do not flash more than three times per second.
- Ensure auto-playing content (videos, carousels) provides a pause/stop button.
  ```html
  <button onclick="pauseVideo()">Pause</button>
  ```

### Screen reader & assistive tech support

- Ensure live content updates use `aria-live="polite"` or `aria-live="assertive"`.
  ```html
  <div
    id="status-message"
    aria-live="polite"
  >
    Loading...
  </div>
  ```
- Check that all icon-only buttons have an accessible label (`aria-label`, `aria-labelledby`, or hidden text).

  ```html
  <!-- Incorrect -->
  <button><img src="icon.png" /></button>

  <!-- Correct -->
  <button aria-label="Search">
    <img
      src="search-icon.png"
      alt=""
    />
  </button>
  ```

---

## Icon Components

# Icon Components

Icon components must **NOT** use the `withIcon` HOC. Each icon accepts props directly.

## Props

- `size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'` — defaults to `'md'`
- `className?: string` — overrides size-based Tailwind class; `shrink-0` is always applied
- `colorStopOffset?: number` — only for gradient icons; omit from interfaces that don't use it

The legacy `customCss` prop is **not allowed** — use `className` instead.

## Size map

```ts
const sizeClassName = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  '2xl': 'w-12 h-12'
}
```

## Pattern

```tsx
// Bad: uses withIcon HOC
const IconPhoneBase: FC<{ className: string }> = ({ className }) => (
  <svg className={className} .../>
)
export const IconPhone = withIcon(IconPhoneBase)

// Good: accepts props directly
interface IconPhoneProps {
  size?: keyof typeof sizeClassName
  className?: string
}

export const IconPhone: FC<IconPhoneProps> = ({ size = 'md', className }) => (
  <svg
    className={`shrink-0 ${className ?? sizeClassName[size]}`}
    aria-hidden="true"
    role="img"
    ...
  />
)
```

## Usage

```tsx
// Size preset
<IconPhone size="lg" />

// Custom class (overrides size)
<IconPhone className="size-4 text-gray-1100" />

// Bad: customCss is not allowed
<IconPhone customCss="size-4" />
```

---

## Icon SVG Guidelines

# Icon SVG Guidelines

## viewBox

Every custom SVG icon **must** include a valid `viewBox` attribute. Without it the browser falls back to the SVG's intrinsic `width`/`height` (or a default 300 × 150), which causes icons to render too large, get cropped, or overflow their container.

### Rules

- Every custom SVG icon must include a valid `viewBox`.
- Never use a custom SVG icon without a `viewBox`.
- Verify exported SVGs before implementation; do not assume design-tool exports are safe by default.
- Size custom SVG icons through the component or wrapper, not the asset's intrinsic dimensions.
- If an icon renders too large, cropped, or outside its container, inspect the `viewBox` first.

### Bad

```tsx
// Missing viewBox — size is unpredictable, may overflow container
export const IconStar: FC<IconStarProps> = ({ size = 'md', className }) => (
  <svg
    className={`shrink-0 ${className ?? sizeClassName[size]}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    aria-hidden="true"
    role="img"
  >
    <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
  </svg>
)

// Intrinsic dimensions baked into the SVG — ignores component sizing
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <path d="..." />
</svg>
```

### Good

```tsx
// viewBox present, sized via component props
export const IconStar: FC<IconStarProps> = ({ size = 'md', className }) => (
  <svg
    className={`shrink-0 ${className ?? sizeClassName[size]}`}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    aria-hidden="true"
    role="img"
  >
    <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
  </svg>
)
```

## Stroke Width

Lucide icons use `viewBox="0 0 24 24"` but render at smaller sizes (e.g., 16px). The viewBox-to-pixel transformation scales strokes proportionally:

> `rendered_stroke = stroke-width × (rendered_size / 24)`

A `stroke-width: 1.5` at 16px renders as `1.5 × (16/24) ≈ 1px` on screen — thinner than intended.

### The Fix

Always apply **both** CSS properties together:

1. `stroke-width` in **px units** — absolute CSS pixels, not SVG user units
2. `vector-effect: non-scaling-stroke` on child elements (`path`, `line`, etc.) — keeps the stroke at true screen pixels regardless of viewBox scaling

### Tailwind Pattern

Apply arbitrary-value classes directly on the Lucide component (or a parent wrapper):

```tsx
<ChevronDown className="size-4 [&_*]:[stroke-width:1.25px] [&_*]:[vector-effect:non-scaling-stroke]" />
```

`[&_*]` targets all SVG child elements so both properties reach `<path>`, `<line>`, and `<circle>` elements inside the icon.

### Bad

```tsx
// Unitless stroke-width — still scales with viewBox
<ChevronDown strokeWidth={1.25} />

// px on the <svg> root only — child paths may not inherit
<ChevronDown className="[stroke-width:1.25px]" />
```

### Good

```tsx
// Both rules on child elements — stroke renders at exactly 1.25px
<ChevronDown className="size-4 [&_*]:[stroke-width:1.25px] [&_*]:[vector-effect:non-scaling-stroke]" />

// Same pattern from a parent wrapper
<button className="[&_svg_*]:[stroke-width:1.5px] [&_svg_*]:[vector-effect:non-scaling-stroke]">
  <ChevronDown className="size-4" />
</button>
```

---

## Core Components Library Usage

# Core Components Library (`@rehabpath/core-components`)

`@rehabpath/core-components` is an internal shared library (published to GitHub Packages) providing UI components, utilities, and design tokens. It is built on Tailwind CSS v4, shadcn/ui (New York style), and Radix UI.

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
import { Button } from '@rehabpath/core-components'
import type { ButtonProps } from '@rehabpath/core-components'
```

### ✅ Prefer library `Input`, `Textarea`, and `InputGroup` for forms

These are not yet widely adopted but should be used for new form inputs:

```typescript
import { Input, Textarea, InputGroup } from '@rehabpath/core-components'
```

### ❌ Do NOT import `SeoLink` from the library

Use the local atom, which adds `data-text` support and browse-page `rel` logic:

```typescript
// Bad
import { SeoLink } from '@rehabpath/core-components'

// Good
import { SeoLink } from '@/components/atoms/SeoLink/SeoLink'
```

### ❌ Do NOT import `cn` from the library

Use the local utility (already established across the codebase):

```typescript
// Bad
import { cn } from '@rehabpath/core-components'

// Good
import { cn } from '@/utils/shadcnUtils'
```

### ❌ Do NOT import check utilities from the library

Use the local version — it has more functions (`isArrayWithLessThanNValues`, `isError`, `isReactComponent`, `isEnumValue`, `isKeyOfObject`, `arrayIncludes`):

```typescript
// Bad
import { isNil, isNonEmptyString } from '@rehabpath/core-components'

// Good
import { isNil, isNonEmptyString } from '@/utils/checks.util'
```

### ❌ Do NOT import URL utilities from the library

Use the local versions in `@/utils/seo.util`:

```typescript
// Bad
import { isExternalLink, getSafeUrl } from '@rehabpath/core-components'

// Good
import { isExternalLink, getSafeUrl } from '@/utils/seo.util'
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
@import '@rehabpath/core-components/theme.css';
```

Do **not** duplicate design tokens locally that are already provided by the library theme.
