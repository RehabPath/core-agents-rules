---
description: Icon component pattern — no withIcon HOC, props accepted directly
globs: **/icons/**/*.tsx, **/Icon*.tsx
alwaysApply: false
---

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
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
  "2xl": "w-12 h-12",
};
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
