---
name: add-utility-check
description: Add a new type-guard utility function to checks.util.ts with a full test suite. Use when asked to add a new type check or validation helper.
---

# Add Utility Check

## Purpose

Add a new utility type-guard function to `src/utils/checks.util.ts` and write comprehensive tests in `src/utils/checks.util.test.ts` following the project's testing conventions.

## When To Use

Use this skill when asked to:

- Add a new `is*` check function
- Add a validation helper to the utility checks file
- Extend `checks.util.ts` with a new type guard

## Required Workflow

### Step 1: Review existing checks

Read `src/utils/checks.util.ts` to understand what already exists before adding anything. The function may already be there under a different name.

### Step 2: Name the function

Follow these conventions:

- Pattern: `is{Condition}` — e.g., `isBlank`, `isNonEmptyString`, `isValidId`
- Prefer widely recognized terms: `isBlank` not `isNilOrEmptyString`
- Keep it concise and unambiguous

### Step 3: Implement the function

Rules:

- Use TypeScript type guards: `(value: unknown): value is Type`
- Keep functions pure — no side effects
- Build on existing utility functions rather than repeating logic

```ts
// Simple type guard
export const isString = (value: unknown): value is string =>
  typeof value === "string";

// Compound type guard — builds on simpler ones
export const isNonEmptyString = (value: unknown): value is string =>
  isString(value) && value.length > 0;

// Nil-aware guard
export const isBlank = (value?: unknown): value is null | undefined | "" =>
  isNil(value) || isEmptyString(value);
```

Place the new function in the appropriate section of `checks.util.ts`, grouped with related checks.

### Step 4: Write the tests

Add tests to `src/utils/checks.util.test.ts`.

Use this structure for every new function:

```ts
describe("functionName", () => {
  describe("given [condition that should return true]", () => {
    it("should return true", () => {
      expect(functionName(value)).toBe(true);
    });
  });

  describe("given [condition that should return false]", () => {
    it("should return false", () => {
      expect(functionName(value)).toBe(false);
    });
  });
});
```

**Required coverage for every new check:**

| Category         | Examples to test                                          |
| ---------------- | --------------------------------------------------------- |
| Positive cases   | Values that should return `true`                          |
| Negative cases   | Values that should return `false`                         |
| Null / undefined | `null`, `undefined`                                       |
| Empty values     | `''`, `[]`, `{}`                                          |
| Whitespace       | `' '`, `'\t'`, `'\n'`                                     |
| Type boundaries  | `0`, `false`, `NaN`, `Infinity`                           |
| Wrong types      | string when expecting number, object when expecting array |

**Example — complete test for `isBlank`:**

```ts
describe("isBlank", () => {
  describe("given null or undefined values", () => {
    it("should return true", () => {
      expect(isBlank(null)).toBe(true);
      expect(isBlank(undefined)).toBe(true);
      expect(isBlank()).toBe(true);
    });
  });

  describe("given empty or whitespace strings", () => {
    it("should return true", () => {
      expect(isBlank("")).toBe(true);
      expect(isBlank(" ")).toBe(true);
      expect(isBlank("\t")).toBe(true);
    });
  });

  describe("given non-empty values", () => {
    it("should return false", () => {
      expect(isBlank("hello")).toBe(false);
      expect(isBlank(0)).toBe(false);
      expect(isBlank(false)).toBe(false);
    });
  });
});
```

### Step 5: Run tests

```bash
yarn test src/utils/checks.util.test.ts
```

All tests must pass before considering the task done.

### Step 6: Update imports at call sites

If the caller already has an import from `@/utils/checks.util`, add the new function to their import list:

```ts
import { isNil, isNonEmptyString, isNewFunction } from "@/utils/checks.util";
```
