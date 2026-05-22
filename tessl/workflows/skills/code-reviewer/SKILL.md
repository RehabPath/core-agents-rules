---
name: code-reviewer
description: Expert code reviewer for this codebase. Proactively reviews code against all project rules and guidelines including JS style, barrel files, utility checks, immutability, env variables, logging, domain use cases, SEO, and Next.js/React performance. Use immediately after writing or modifying any code.
---

# Code Reviewer

## Purpose

Perform a thorough review of recent code changes and provide structured, actionable feedback organized by severity.

## When To Use

Use this skill immediately after writing or modifying any code, or when the user asks for a code review.

## Review Workflow

1. Run `git diff HEAD` to see all unstaged changes
2. Run `git diff --cached` to see staged changes
3. Run `git status` to identify new untracked files and read them if relevant
4. Review each changed file against all rules below
5. Output structured feedback organized by severity

## Rules to Enforce

### JS / Code Style

- Prefer `const` over `let`. Extract logic to functions to avoid mutation.
- Use array methods (`.map()`, `.filter()`, `.reduce()`) over manual loops.
- Avoid `else` — refactor branches to reduce nesting. Use early returns.
- Use `switch` for multiple conditions rather than chains of `if/else if`.
- Use `===` and `!==` instead of `==` and `!=`.
- Use single quotes `'` unless using template literals.
- Always use braces `{}` for multi-line statements.
- Use function declarations for named functions; arrow functions for short callbacks.
- Avoid function expressions (`const foo = function() {}`).
- File naming: component files and directories use PascalCase (`Button.tsx`, `CenterCard/`); all other files and directories use camelCase (`getCenterProfileSlug.ts`, `useIsMobile.ts`).

### Barrel Files

- `index.ts` files are **only** allowed to contain `export type` statements.
- Never re-export functions, constants, components, hooks, or any runtime value from an `index.ts`.
- Never use `export *` — always use named exports.
- Never re-export across unrelated modules (e.g., a service re-exporting a component).

```ts
// Bad
export { useSegment } from "./useSegment";

// Good — import directly from source
import { useSegment } from "@/services/segment/useSegment";

// OK — type-only barrel
export type { Center } from "./center";
```

### Utility Check Functions

Always use the utility functions from `src/utils/checks.util.ts` instead of manual type checking:

| Instead of                                                  | Use                       |
| ----------------------------------------------------------- | ------------------------- |
| `value === null`                                            | `isNull(value)`           |
| `value === undefined`                                       | `isUndefined(value)`      |
| `value === null \|\| value === undefined`                   | `isNil(value)`            |
| `value === null \|\| value === undefined \|\| value === ''` | `isBlank(value)`          |
| `typeof value === 'string'`                                 | `isString(value)`         |
| `typeof value === 'number'`                                 | `isNumber(value)`         |
| `typeof value === 'boolean'`                                | `isBoolean(value)`        |
| `Array.isArray(value) && value.length === 0`                | `isEmptyArray(value)`     |
| `Array.isArray(value) && value.length > 0`                  | `isNonEmptyArray(value)`  |
| `value === ''` or `value.trim() === ''`                     | `isEmptyString(value)`    |
| non-empty string check                                      | `isNonEmptyString(value)` |

### Immutability

Never mutate objects or arrays. Always return new values using spread or array methods:

```ts
// Bad
obj.newProp = value;

// Good
const updatedObj = { ...obj, newProp: value };
```

### Environment Variables

Never use `process.env` directly. Use the centralized env module:

```ts
// Bad
const key = process.env.NEXT_PUBLIC_API_KEY

// Good
import { clientEnv } from '@/lib/env'
const key = clientEnv.NEXT_PUBLIC_API_KEY

// Good (server-only)
import { serverEnv } from '@/lib/env'
const dbUrl = serverEnv.DATABASE_URL

// Good (dev mode check)
import { IS_DEVELOPMENT } from '@/lib/env'
if (IS_DEVELOPMENT) { ... }
```

### Logging

Always use `logger` from `src/utils/logger/index.ts`:

```ts
logger.info({ message: "...", data: { key: "value" } });
logger.warn({ message: "...", error: err });
logger.error({ message: "...", error: err }); // Only for fatal errors
```

- `logger.error` is reserved for fatal errors where the process fails to produce a result.
- Use `logger.warn` or `logger.info` for non-fatal issues.
- Never use `console.log`, `console.warn`, or `console.error`.

### Domain Use Cases

Access domain objects through use-case functions, never directly:

```ts
// Bad
const slug = `/p/${center.slug}`;

// Good
const slug = getCenterProfileSlug(center);
```

Domain entities live in `src/domain/{entity}/use-cases/`. Use them everywhere data needs to be derived from a domain object.

### Code Quality & Security

- No hardcoded secrets, API keys, or credentials.
- Proper input validation on all API routes.
- New features must include tests. Test files end with `.test.ts` or `.test.tsx`, co-located with the source file.
- Tests follow the structure: `describe('function') > describe('given condition') > it('should...')`
- Only mock network requests (axios, fetch), not constants or static values.
- Include negative/edge-case test scenarios.

### SEO

- Every public-facing page needs a canonical URL (absolute URL with protocol and domain).
- Meta titles under 60 characters; meta descriptions 150–160 characters.
- Do not add `noindex`/`nofollow` robots meta unless explicitly justified.
- Do not add `nofollow` on internal links.
- External links with `target="_blank"` must include `rel="noopener noreferrer nofollow"`.
- All images need descriptive `alt` attributes.
- One `<h1>` per page; heading hierarchy must not skip levels.
- SEO-critical content (especially links) must be server-rendered, not fetched in `useEffect`.
- Use `<a>` tags for navigation, `<button>` for actions.

### Next.js / React Performance

Key rules to check for (ordered by impact):

**CRITICAL — Waterfalls**

- Use `Promise.all()` for independent async operations instead of sequential `await`.
- Move `await` into branches where it is actually used, not unconditionally at the top.
- Use `Suspense` boundaries to stream content and avoid blocking renders.

**CRITICAL — Bundle Size**

- Import directly from source files; never import from barrel files.
- Use `next/dynamic` for heavy components that are not needed on initial load.
- Load analytics/logging libraries after hydration, not eagerly.

**HIGH — Server Performance**

- Use `React.cache()` for per-request deduplication in Server Components.
- Restructure components so independent data fetches run in parallel.
- Use `after()` for non-blocking post-response operations.

**MEDIUM — Re-renders**

- Hoist static JSX and non-primitive default props outside components.
- Use primitive values as `useEffect` dependencies, not objects/arrays.
- Use `startTransition` for non-urgent state updates.
- Use `useRef` for transient, frequently changing values that don't need re-renders.

**MEDIUM — Rendering**

- Use `content-visibility` for long lists or off-screen content.
- Use ternary (`condition ? A : B`) for conditional rendering, not `&&`.
- Prefer `useTransition` over boolean loading state for async interactions.

## Output Format

Organize all findings into three severity levels:

### Critical — must fix before merging

Issues that introduce bugs, security vulnerabilities, broken functionality, or violate non-negotiable rules (e.g., `process.env` usage, mutating state, exposed secrets).

### Warning — should fix

Issues that violate project conventions, reduce maintainability, or create performance regressions (e.g., missing utility checks, barrel file runtime exports, missing tests).

### Suggestion — consider improving

Style improvements, minor performance wins, or readability enhancements that are not strictly required.

---

For each finding, include:

1. **File and line reference**
2. **Rule violated** (cite the specific rule name)
3. **Concrete fix** with a corrected code snippet

If no issues are found in a category, skip it. If the diff is clean across all rules, say so explicitly.
