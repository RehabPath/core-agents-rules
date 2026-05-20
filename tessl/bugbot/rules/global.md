# Recovery.com — Global Bugbot Rules

These rules apply to every PR, regardless of which layer was changed. Layer-specific rules are in nested `.cursor/BUGBOT.md` files under each `src/` subdirectory.

## Environment Variables

Never use `process.env` directly outside of `src/lib/env.ts`.

- Flag any `process.env.*` access in files other than `src/lib/env.ts`.
- Use `clientEnv` for `NEXT_PUBLIC_*` variables, `serverEnv` for server-only variables, and `IS_DEVELOPMENT` for dev mode checks — all from `@/lib/env`.

```ts
// Bad
const key = process.env.NEXT_PUBLIC_API_KEY

// Good
import { clientEnv } from '@/lib/env'
const key = clientEnv.NEXT_PUBLIC_API_KEY
```

## Hardcoded Secrets

Flag any hardcoded API keys, tokens, passwords, or credentials in source code. All secrets must come from environment variables via `src/lib/env.ts`.

## Logging

Never use `console.log`, `console.warn`, or `console.error`.

- Flag any `console.*` calls.
- Use `logger` from `src/utils/logger/index.ts` instead.
- `logger.error` is reserved for fatal errors only. Use `logger.warn` or `logger.info` for non-fatal issues.

```ts
// Bad
console.log('debug info')

// Good
import { logger } from '@/utils/logger'
logger.info({ message: 'debug info', data: { key: 'value' } })
```

## Error Handling

Never allow empty `catch` blocks.

- Flag `catch` blocks with no action.
- If a `catch` block exists, it must do at least one of:
  - handle/recover from the error,
  - re-throw the error,
  - log with `logger.warn` (or `logger.error` for fatal failures).
- If execution continues after a caught error, prefer `logger.warn` with contextual `message`, `data`, and `error`.
- Do not require `try/catch` where framework-level handling is intentional (for example, `routeHandler` domain error mapping in `src/app/api/`).

```ts
// Bad
try {
  await syncCenterData(centerId)
} catch (error) {}

// Good
try {
  await syncCenterData(centerId)
} catch (error) {
  logger.warn({
    message: 'Failed to sync center data; continuing request',
    data: { centerId },
    error
  })
}
```

## Barrel Files

`index.ts` files may only contain `export type` statements.

- Flag any `index.ts` that exports a function, constant, component, hook, or any runtime value.
- Flag any `export *` usage anywhere — always use named exports.
- Flag re-exports across unrelated modules (e.g., a service re-exporting a component).

```ts
// Bad — index.ts with runtime export
export { useSegment } from './useSegment'

// Good — type-only barrel
export type { Center } from './center'

// Good — import directly from source
import { useSegment } from '@/services/segment/useSegment'
```

## Immutability

Never mutate objects or arrays. Always return new values.

- Flag direct property assignment on existing objects: `obj.prop = value`.
- Flag `Array.prototype.push/pop/splice/sort` called on existing arrays.
- Use spread or array methods: `{ ...obj, prop: value }`, `[...arr, item]`, `.map()`, `.filter()`.

## Manual Type Checks

Always use utility functions from `src/utils/checks.util.ts` instead of manual type checking.

Flag these patterns and suggest the utility equivalent:

| Manual check                                 | Use instead               |
| -------------------------------------------- | ------------------------- |
| `value === null`                             | `isNull(value)`           |
| `value === undefined`                        | `isUndefined(value)`      |
| `value === null \|\| value === undefined`    | `isNil(value)`            |
| `typeof value === 'string'`                  | `isString(value)`         |
| `typeof value === 'number'`                  | `isNumber(value)`         |
| `typeof value === 'boolean'`                 | `isBoolean(value)`        |
| `Array.isArray(value) && value.length === 0` | `isEmptyArray(value)`     |
| `Array.isArray(value) && value.length > 0`   | `isNonEmptyArray(value)`  |
| `value === ''` or `value.trim() === ''`      | `isEmptyString(value)`    |
| non-empty string check                       | `isNonEmptyString(value)` |

## Variables

- Flag `let` declarations where `const` could be used instead.
- Flag `var` — always use `const` or `let`.

## Control Flow

- Flag `==` and `!=` — always use `===` and `!==`.
- Flag `else` blocks that follow a `return` or `throw` statement — they are redundant and add nesting.
- Flag chains of `if/else if` with 3+ branches — prefer `switch`.
- Flag nested ternary expressions (`condA ? (condB ? x : y) : z` or equivalent multi-level ternaries).
- Prefer `if` statements, guard clauses, or a small helper function when ternary logic has more than one condition.

## File Naming

- Component files and component directories must use **PascalCase** (e.g., `Button.tsx`, `CenterCard/`).
- All other files and directories must use **camelCase** (e.g., `getCenterProfileSlug.ts`, `useIsMobile.ts`, `checks.util.ts`).
- Test files inherit the source file's casing with a `.test.ts` or `.test.tsx` suffix.
- Flag any component file not in PascalCase and any non-component file not in camelCase.

## Missing Tests

Flag new source files added to `src/domain/`, `src/application/`, or `src/persistence/` that have no co-located `.test.ts` or `.spec.ts` file.

## Dependency Placement

Flag packages placed in the wrong section of `package.json`.

- Packages needed to **build or run** the app go in `dependencies`: React, Next.js, Tailwind CSS, PostCSS plugins, Prisma client, database drivers, Zod, styled-components.
- Packages used **only** for local dev, testing, or tooling go in `devDependencies`: `@types/*`, ESLint, Prettier, Jest, Testing Library, Husky, Prisma CLI, shadcn.
- Flag Tailwind or its plugins in `devDependencies` — they are consumed during `next build` and must be in `dependencies`.

Quick check: "Is this package needed when running `pnpm install --prod && pnpm build && pnpm start`?"

- Yes → `dependencies`
- No → `devDependencies`
