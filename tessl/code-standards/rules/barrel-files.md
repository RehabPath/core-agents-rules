
# Barrel Files

## Convention

Barrel files (`index.ts` re-exports) are **only allowed for type-only exports**. Everything else must be imported directly from the source file.

### Why

- Types are erased at compile time -- no runtime or bundle impact.
- All other re-exports can defeat tree-shaking, pulling unnecessary code into bundles.
- In Next.js App Router, barrel files that mix server/client concerns blur the boundary and cause bundling issues.
- Direct imports make dependency tracing explicit.

### The rule

- **Allowed:** `index.ts` files that contain **only** `export type` statements.
- **Not allowed:** `index.ts` files that re-export functions, constants, components, hooks, or anything with runtime presence.
- **Never** use `export *` -- always use named exports.
- **Never** re-export from unrelated modules (e.g., services re-exporting components).

## Examples

### Type-only barrel file (allowed)

```ts
// types/models/index.ts
export type { Center } from './center'
export type { Location } from './location'
```

### Component barrel file (not allowed)

```ts
// Bad: components/organisms/TopNav/index.ts
export { TopNav } from './TopNav'
export type { TopNavProps } from './TopNav'

// Good: import component directly
import { TopNav } from '@/components/organisms/TopNav/TopNav'
```

### Persistence barrel file (not allowed)

```ts
// Bad: persistence/department/index.ts
export { fetchDepartments } from './department.persistence'

// Good: import directly
import { fetchDepartments } from '@/persistence/department/department.persistence'
```

### Service barrel file (not allowed)

```ts
// Bad: services/segment/index.ts
export { useSegment } from './useSegment'
export { analytics } from './client'

// Good: import directly from source
import { useSegment } from '@/services/segment/useSegment'
import { analytics } from '@/services/segment/client'
```

### Cross-module re-export (never allowed)

```ts
// Bad: services/segment/index.ts
export { AnalyticsProvider } from '@/components/organisms/AnalyticsProvider'
```

### Wildcard re-export (never allowed)

```ts
// Bad
export * from './use-cases/shouldHideCallButton'

// Good: use named imports directly from the source file
import type { ShouldHideCallButton } from './use-cases/shouldHideCallButton'
```
