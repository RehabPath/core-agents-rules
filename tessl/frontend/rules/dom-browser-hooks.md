# DOM / Browser-API Hooks

Before writing inline `window`, `document`, `IntersectionObserver`, `ResizeObserver`,
`matchMedia`, or scroll/resize `addEventListener` logic inside a component or a new hook,
**check this catalog and reuse an existing hook.** All live in `src/hooks/` and are `'use client'`,
SSR-safe primitives. If nothing fits, add a new hook in `src/hooks/` (with a co-located test where
practical) and add a row here so the next person — or agent — can find it.

## Reusable primitives (reach for these)

| Hook                      | Signature                                                                | Browser API                                                   | Use when                                                                                                                                         |
| ------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `useIsMobile`             | `useIsMobile(): boolean`                                                 | `matchMedia('(max-width: 767px)')` via `useSyncExternalStore` | You need "is the viewport mobile-width" (SSR-safe).                                                                                              |
| `useIsXlOrAbove`          | `useIsXlOrAbove(): boolean`                                              | `matchMedia` Tailwind `xl:` (1280px)                          | Gating behavior on the desktop (`xl`) breakpoint.                                                                                                |
| `useIsScrolledPast`       | `useIsScrolledPast(threshold: number): boolean`                          | `window.scrollY` + passive `scroll` listener                  | Reveal/hide UI after the page scrolls past N pixels.                                                                                             |
| `useIsElementVisible`     | `useIsElementVisible(selector: string): boolean`                         | `IntersectionObserver`                                        | React to an element entering/leaving the viewport — including elements outside your component tree (e.g. the layout `<footer>`). Selector-based. |
| `useStickyObserver`       | `useStickyObserver(): { sentinelRef, stickyRef }`                        | `IntersectionObserver` (sentinel)                             | Detect when a `position: sticky` element becomes "stuck". Toggles an `is-sticky` class directly (no React state / re-render).                    |
| `useMeasure`              | `useMeasure<T extends HTMLElement>(): readonly [ref, { width, height }]` | `ResizeObserver`                                              | Reactively measure an element's box size. Attach the returned `ref`.                                                                             |
| `useVisualViewportCenter` | `useVisualViewportCenter(): number \| undefined`                         | `window.visualViewport`                                       | Keep a fixed element centered in the visible area above the mobile virtual keyboard.                                                             |

## Feature-specific DOM hooks (NOT general-purpose)

These also touch the DOM/browser but are tied to a specific feature — do **not** reuse them as
primitives:

- `useInsurancePickerInViewportSegment` — `IntersectionObserver` that fires a Segment
  "Insurance Filter Viewed" event once; insurance-picker only.
- `useWebsiteClickTracking` — outbound-link click handlers + analytics for center profiles.
- `useShareList`, `useFavoriteCenter`, `useProAuthHandlers` — feature flows that touch browser
  APIs (share/clipboard, persisted favorites, auth popups).

## Notes

- Guard "element not found" with `isNull` from `@/utils/checks.util`, not a manual `!el` check
  (see the `use-utility-checks` rule in `recovery/code-standards`).
- IntersectionObserver/ResizeObserver are no-op-mocked globally in `jest.setup.ts`, so these
  hooks render safely under test; install a controllable mock locally when asserting observer
  behavior (see `src/hooks/useIsElementVisible.test.ts`).
