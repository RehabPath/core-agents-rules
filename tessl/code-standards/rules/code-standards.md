## JavaScript / TypeScript Style Guide

## General Principles

- Write code that is easy to read and understand for your future self and others.
- Code should read as closely as possible to natural English.
- Minimize cognitive load: make intent and logic clear.

## Functional Programming

- Favor first-class and higher-order functions.
- Prefer immutability: do not mutate variables or data structures.
- Minimize side effects: functions should avoid changing external state when possible.

### First-class and Higher-order Functions

- Functions can be passed as arguments, returned, and assigned to variables.
- Example:
  ```js
  const getGreetingMessageFor = (getPersonName) => `Hi ${getPersonName()}!`
  const getFullName = (firstName, lastName) =>
    [firstName, lastName].filter(Boolean).join(' ')
  const johnSnow = () => getFullName('John', 'Snow')
  alert(getGreetingMessageFor(johnSnow))
  ```

### Immutability

- Do not change the value of a variable after assignment. Create new variables for new values.

### Side Effects

- Minimize side effects. Prefer pure functions that do not alter external state.

## Domain Specific

### Domain use cases

- When accessing domain objects, use domain use cases to get the data.

```ts
// bad
const centerProfileSlug = `/p/${center.slug}`

// good
const centerProfileSlug = getCenterProfileSlug(center)
```

### Iterators and generators

- Prefer array methods like `.map()` and `.filter()`.
- Avoid manual loops when not necessary.

#### For

- If you need to use a `for` loop, avoid using `break` and `continue`. Use `while` loops instead.

## Control statements

### Control statements

- Prefer `switch` for multiple conditions.

```js
// Good
switch (color) {
  case 'red':
    console.log('Stop')
    break
  case 'green':
    console.log('Go')
    break
  default:
    console.log('Wait')
}
```

### Else

- Avoid `else` statements when possible. Refactor code to reduce branches and improve clarity.
- Example:

  ```js
  // Bad
  let feedZoneId
  if (isMidFeedAd) {
    feedZoneId = ZoneIds.InFeed
  } else {
    feedZoneId = zoneId
  }

  // Good
  let feedZoneId = zoneId
  if (isMidFeedAd) {
    feedZoneId = ZoneIds.InFeed
  }
  // Even better (extract to function and use const):
  const feedZoneId = getFeedZoneId(zoneId, isMidFeedAd, ZoneIds.InFeed)
  function getFeedZoneId(zoneId, isMidFeedAd, inFeedZoneId) {
    return isMidFeedAd ? inFeedZoneId : zoneId
  }
  ```

### Ternary operators

- Avoid nested ternary expressions. They are hard to read and increase cognitive load.
- Use `if` statements, guard clauses, or small helper functions instead.

```js
// Bad
const target =
  isPremium
    ? isUS
      ? '/condition/depression/'
      : `/${citySlug}/depression/`
    : '/condition/drug-addiction/'

// Good
function getTargetUrl({ isPremium, isUS, citySlug }) {
  if (!isPremium) {
    return '/condition/drug-addiction/'
  }

  if (isUS) {
    return '/condition/depression/'
  }

  return `/${citySlug}/depression/`
}
```

### Comparison operators & equality

- Use `===` and `!==` instead of `==` and `!=`.

```js
// Good
if (a === b) {
}

// Bad
if (a == b) {
}
```

## Error handling

### Try/catch

- Never leave a `catch` block empty.
- Every `catch` block must do at least one of the following:
  - Handle/recover from the error.
  - Re-throw the error.
  - Log the error with `logger.warn` when there is no recovery action and execution can continue.
- Include enough context in the log message/data so the failure can be investigated.

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

## Strings

- Use single quotes `'` unless using template literals.
- Avoid unnecessary string concatenation.

```js
// Good
const message = 'Hello, world!'
const greeting = `Hello, ${name}`

// Bad
const message = 'Hello, world!'
const greeting = 'Hello, ' + name
```

## Functions

- Use function declarations for named functions.
- Use arrow functions for short callbacks.
- Avoid function expressions unless necessary.

```js
// Good
function getUser(id) {
  return database.findUser(id)
}

const square = (x) => x * x

// Bad
const getUser = function (id) {
  return database.findUser(id)
}
```

### Arrow functions

- Use arrow functions for concise syntax.
- Avoid unnecessary arrow functions.

```js
// Good
const add = (a, b) => a + b

// Bad
const add = function (a, b) {
  return a + b
}
```

### Hoisting

- Be aware that function declarations are hoisted.
- Don’t rely on hoisting for variables.

## Variables and Constants

### Let

- Avoid `let` (mutable variables) when possible. Prefer `const` for immutability and predictability.
- Extract logic to functions to avoid mutation and improve testability.

### Variable Placement and Organization

- Declare variables at the top of the scope.
- Group related variables.

```js
// Good
let firstName, lastName
const age = 30

// Bad
const age = 30
let firstName
```

### Properties

- Use dot notation when possible.
- Avoid bracket notation unless necessary.

```js
// Good
console.log(user.name)

// Bad
console.log(user['name'])
```

### Blocks

- Always use braces `{}` for multi-line statements.

```js
// Good
if (isValid) {
  saveData()
}

// Bad
if (isValid) saveData()
```

### Type casting & coercion

- Use `Number()`, `String()` instead of implicit conversions.

```js
// Good
const num = Number('123')
```

### Naming conventions

- Use camelCase for variables, PascalCase for classes, and UPPER_CASE for constants.

```js
// Good
const userName = 'Alice'
class UserProfile {}
const MAX_USERS = 100
```

### File Naming

- **Component files**: Use PascalCase (e.g., `Button.tsx`, `CenterCard.tsx`, `ScrollToButton.tsx`)
- **All other files**: Use camelCase (e.g., `checks.util.ts`, `getCenterProfileSlug.ts`, `useIsMobile.ts`)
- **Domain model files**: `{domain}.model.ts` (e.g., `center.model.ts`, `feed.model.ts`)
- **Test files**: Inherit the source file's casing with `.test.ts` or `.test.tsx` suffix (e.g., `Button.test.tsx`, `getCenterProfileSlug.test.ts`)
- **Cursor rules**: Use kebab-case (e.g., `js-style-guide.mdc`)

```
// Good
components/atoms/Button.tsx
components/organisms/BrandProfileIntro/BrandProfileIntro.tsx
domain/center/use-cases/getCenterProfileSlug.ts
utils/checks.util.ts
hooks/useIsMobile.ts
components/atoms/Button.test.tsx
domain/center/use-cases/getCenterProfileSlug.test.ts
.cursor/rules/js-style-guide.mdc

// Bad
components/atoms/button.tsx                        // should be PascalCase
domain/center/use-cases/GetCenterProfileSlug.ts    // should be camelCase
utils/Checks.util.ts                               // should be camelCase
.cursor/rules/BuyMeAPony.mdc                      // should be kebab-case
```

### Directory Naming

- **Component directories**: Use PascalCase (e.g., `BrandProfileIntro/`, `TopNav/`, `CenterCardSlider/`)
- **Non-component directories**: Use camelCase (e.g., `browseBy/`). Domain use-case folders use kebab-case: `use-cases/`.

```
// Good
components/organisms/BrandProfileIntro/
components/molecules/CenterCardSlider/
application/browseBy/
domain/center/use-cases/

// Bad
components/organisms/brandProfileIntro/    // should be PascalCase
application/BrowseBy/                      // should be camelCase
```

### Barrel Files

Barrel files (`index.ts` re-exports) are **only allowed for type-only exports**. All runtime exports must be imported directly from their source file.

For barrel files specifications follow the Barrel Files section in the `recovery/code-standards` tile

### Accessors

- Use `get` and `set` for encapsulation.

```js
// Good
class User {
  constructor(name) {
    this._name = name
  }
  get name() {
    return this._name
  }
}
```

### Events

- Use event delegation when possible.

```js
// Good
document.addEventListener('click', (event) => {
  if (event.target.matches('.button')) {
    console.log('Button clicked!')
  }
})
```

## Array Methods

- Prefer array methods (`map`, `filter`, `reduce`, `forEach`) over manual loops and conditionals.

### forEach

- Use only for iteration with side effects. Do not return values from `forEach`.

### map

- Use to transform arrays. Do not use for side effects or looping only.
- Do not mutate the original array.

### reduce

- Use to combine an array into a single value.

### filter

- Use to create a new array of items that pass a test.
- Example:
  ```js
  const correctMessage = `hello ${[lastName, firstName]
    .filter(Boolean)
    .join(', ')}!`
  ```

### find

- Use with care; may return `undefined`. Avoid defensive chaining with `?.` by using `filter` and `reduce` when possible.
- Example:

  ```js
  // Bad: may throw error if not found
  const watermelon = fruits.find((fruit) => fruit === 'watermelon')
  console.log(watermelon.length) // error!

  // Good: safe, returns 0 if not found
  const watermelonLength = fruits
    .filter((fruit) => fruit === 'watermelon')
    .reduce((_, fruit) => fruit.length, 0)
  ```

## Testing

For testing specifications follow the Unit Testing section in the `recovery/testing` tile

---

## Utility Check Functions — Usage

# Use Utility Checks Rule

## Overview

Always use utility check functions from `src/utils/checks.util.ts` instead of manual type checking. This ensures consistency, readability, and proper TypeScript type guarding throughout the codebase.

## Available Utility Check Functions

### Nullish Value Checks

- `isNull(value)` - checks if value is `null`
- `isUndefined(value)` - checks if value is `undefined`
- `isNil(value)` - checks if value is `null` or `undefined`
- `isBlank(value)` - checks if value is `null`, `undefined`, or empty string

### Type Checks

- `isString(value)` - checks if value is a string
- `isNumber(value)` - checks if value is a number
- `isBoolean(value)` - checks if value is a boolean
- `isObject(value)` - checks if value is a non-null object (not array)

### String Checks

- `isEmptyString(value)` - checks if value is an empty or whitespace-only string
- `isNonEmptyString(value)` - checks if value is a non-empty string (after trimming)

### Array Checks

- `isEmptyArray(value)` - checks if value is an empty array
- `isNonEmptyArray(value)` - checks if value is an array with items
- `isArrayWithLessThanNValues(n)` - higher-order function for length checks

### Object Checks

- `isNonEmptyObject(value)` - checks if value is an object with properties

## Enforcement Rules

### ❌ Bad: Manual Type Checking

```typescript
// Don't manually check for null/undefined
if (value === null) {
}
if (value === undefined) {
}
if (value == null) {
}
if (value == undefined) {
}
if (!value) {
} // Too broad, catches falsy values

// Don't manually check types
if (typeof value === 'string') {
}
if (typeof value === 'number') {
}
if (typeof value === 'boolean') {
}
if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
}

// Don't manually check arrays
if (Array.isArray(value)) {
}
if (Array.isArray(value) && value.length === 0) {
}
if (Array.isArray(value) && value.length > 0) {
}

// Don't manually check strings
if (value === '') {
}
if (value.trim() === '') {
}
if (value.length === 0) {
}
```

### ✅ Good: Using Utility Functions

```typescript
// Use utility functions for null/undefined checks
if (isNull(value)) {
}
if (isUndefined(value)) {
}
if (isNil(value)) {
}
if (isBlank(value)) {
} // null, undefined, or empty string

// Use utility functions for type checks
if (isString(value)) {
}
if (isNumber(value)) {
}
if (isBoolean(value)) {
}
if (isObject(value)) {
}

// Use utility functions for array checks
if (isEmptyArray(value)) {
}
if (isNonEmptyArray(value)) {
}
if (isArrayWithLessThanNValues(5)(value)) {
}

// Use utility functions for string checks
if (isEmptyString(value)) {
}
if (isNonEmptyString(value)) {
}

// Use utility functions for object checks
if (isNonEmptyObject(value)) {
}
```

## Benefits

### Type Safety

- All utility functions are TypeScript type guards
- Provide proper type narrowing in conditional blocks
- Prevent runtime type errors

### Consistency

- Standardized approach across the codebase
- Easier to maintain and refactor
- Consistent behavior for edge cases

### Readability

- Self-documenting code
- Clear intent from function names
- Reduced cognitive load

### Composition

- Functions can be easily combined
- Build complex checks from simple ones
- Promote functional programming patterns

## Examples in Context

### ❌ Bad: Manual Checking

```typescript
// Bad - manual nullish checking
function processUser(user: unknown) {
  if (user === null || user === undefined) {
    return null
  }
  // ...
}

// Bad - manual type checking
function validateInput(input: unknown) {
  if (typeof input !== 'string' || input.trim() === '') {
    throw new Error('Invalid input')
  }
  // ...
}

// Bad - manual array checking
function processItems(items: unknown) {
  if (!Array.isArray(items) || items.length === 0) {
    return []
  }
  // ...
}
```

### ✅ Good: Using Utility Functions

```typescript
// Good - using utility functions
function processUser(user: unknown) {
  if (isNil(user)) {
    return null
  }
  // TypeScript now knows user is not null/undefined
}

// Good - using utility functions with composition
function validateInput(input: unknown) {
  if (!isNonEmptyString(input)) {
    throw new Error('Invalid input')
  }
  // TypeScript now knows input is a non-empty string
}

// Good - using utility functions
function processItems(items: unknown) {
  if (isEmptyArray(items)) {
    return []
  }
  // TypeScript knows items is an empty array

  if (isNonEmptyArray(items)) {
    return items.map(/* ... */)
  }
  // TypeScript knows items is a non-empty array
}
```

## Exceptions

### Rare cases where manual checking is acceptable:

1. **Performance-critical code** where micro-optimizations matter
2. **Complex type checking** not covered by existing utilities (create new utility instead)
3. **Third-party library integration** with specific type requirements

### When creating new utilities:

- Follow the patterns in `src/utils/checks.util.ts`
- Add comprehensive tests
- Use TypeScript type guards
- Follow the naming convention: `is{Condition}`

## Integration with ESLint

Consider adding ESLint rules to enforce this pattern:

- Detect manual `typeof` checks that have utility equivalents
- Detect manual null/undefined checks
- Suggest utility function replacements

## Migration Strategy

When refactoring existing code:

1. Identify manual type checking patterns
2. Replace with appropriate utility functions
3. Ensure tests still pass
4. Verify TypeScript type narrowing works correctly

This rule ensures our codebase maintains consistency and leverages the full benefits of our utility check functions.

# Use Utility Checks Rule

## Overview

Always use utility check functions from `src/utils/checks.util.ts` instead of manual type checking. This ensures consistency, readability, and proper TypeScript type guarding throughout the codebase.

## Available Utility Check Functions

### Nullish Value Checks

- `isNull(value)` - checks if value is `null`
- `isUndefined(value)` - checks if value is `undefined`
- `isNil(value)` - checks if value is `null` or `undefined`
- `isBlank(value)` - checks if value is `null`, `undefined`, or empty string

### Type Checks

- `isString(value)` - checks if value is a string
- `isNumber(value)` - checks if value is a number
- `isBoolean(value)` - checks if value is a boolean
- `isObject(value)` - checks if value is a non-null object (not array)

### String Checks

- `isEmptyString(value)` - checks if value is an empty or whitespace-only string
- `isNonEmptyString(value)` - checks if value is a non-empty string (after trimming)

### Array Checks

- `isEmptyArray(value)` - checks if value is an empty array
- `isNonEmptyArray(value)` - checks if value is an array with items
- `isArrayWithLessThanNValues(n)` - higher-order function for length checks

### Object Checks

- `isNonEmptyObject(value)` - checks if value is an object with properties

## Enforcement Rules

### ❌ Bad: Manual Type Checking

```typescript
// Don't manually check for null/undefined
if (value === null) {
}
if (value === undefined) {
}
if (value == null) {
}
if (value == undefined) {
}
if (!value) {
} // Too broad, catches falsy values

// Don't manually check types
if (typeof value === 'string') {
}
if (typeof value === 'number') {
}
if (typeof value === 'boolean') {
}
if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
}

// Don't manually check arrays
if (Array.isArray(value)) {
}
if (Array.isArray(value) && value.length === 0) {
}
if (Array.isArray(value) && value.length > 0) {
}

// Don't manually check strings
if (value === '') {
}
if (value.trim() === '') {
}
if (value.length === 0) {
}
```

### ✅ Good: Using Utility Functions

```typescript
// Use utility functions for null/undefined checks
if (isNull(value)) {
}
if (isUndefined(value)) {
}
if (isNil(value)) {
}
if (isBlank(value)) {
} // null, undefined, or empty string

// Use utility functions for type checks
if (isString(value)) {
}
if (isNumber(value)) {
}
if (isBoolean(value)) {
}
if (isObject(value)) {
}

// Use utility functions for array checks
if (isEmptyArray(value)) {
}
if (isNonEmptyArray(value)) {
}
if (isArrayWithLessThanNValues(5)(value)) {
}

// Use utility functions for string checks
if (isEmptyString(value)) {
}
if (isNonEmptyString(value)) {
}

// Use utility functions for object checks
if (isNonEmptyObject(value)) {
}
```

## Benefits

### Type Safety

- All utility functions are TypeScript type guards
- Provide proper type narrowing in conditional blocks
- Prevent runtime type errors

### Consistency

- Standardized approach across the codebase
- Easier to maintain and refactor
- Consistent behavior for edge cases

### Readability

- Self-documenting code
- Clear intent from function names
- Reduced cognitive load

### Composition

- Functions can be easily combined
- Build complex checks from simple ones
- Promote functional programming patterns

## Examples in Context

### ❌ Bad: Manual Checking

```typescript
// Bad - manual nullish checking
function processUser(user: unknown) {
  if (user === null || user === undefined) {
    return null
  }
  // ...
}

// Bad - manual type checking
function validateInput(input: unknown) {
  if (typeof input !== 'string' || input.trim() === '') {
    throw new Error('Invalid input')
  }
  // ...
}

// Bad - manual array checking
function processItems(items: unknown) {
  if (!Array.isArray(items) || items.length === 0) {
    return []
  }
  // ...
}
```

### ✅ Good: Using Utility Functions

```typescript
// Good - using utility functions
function processUser(user: unknown) {
  if (isNil(user)) {
    return null
  }
  // TypeScript now knows user is not null/undefined
}

// Good - using utility functions with composition
function validateInput(input: unknown) {
  if (!isNonEmptyString(input)) {
    throw new Error('Invalid input')
  }
  // TypeScript now knows input is a non-empty string
}

// Good - using utility functions
function processItems(items: unknown) {
  if (isEmptyArray(items)) {
    return []
  }
  // TypeScript knows items is an empty array

  if (isNonEmptyArray(items)) {
    return items.map(/* ... */)
  }
  // TypeScript knows items is a non-empty array
}
```

## Exceptions

### Rare cases where manual checking is acceptable:

1. **Performance-critical code** where micro-optimizations matter
2. **Complex type checking** not covered by existing utilities (create new utility instead)
3. **Third-party library integration** with specific type requirements

### When creating new utilities:

- Follow the patterns in `src/utils/checks.util.ts`
- Add comprehensive tests
- Use TypeScript type guards
- Follow the naming convention: `is{Condition}`

## Integration with ESLint

Consider adding ESLint rules to enforce this pattern:

- Detect manual `typeof` checks that have utility equivalents
- Detect manual null/undefined checks
- Suggest utility function replacements

## Migration Strategy

When refactoring existing code:

1. Identify manual type checking patterns
2. Replace with appropriate utility functions
3. Ensure tests still pass
4. Verify TypeScript type narrowing works correctly

This rule ensures our codebase maintains consistency and leverages the full benefits of our utility check functions.

---

## Utility Check Functions — Reference

# Utility Checks Functions Guide

## Naming Conventions

### Type Checking Functions

- Use clear, concise names that follow established conventions
- Prefer widely recognized terms over verbose descriptions
- Examples:
  - `isBlank` instead of `isNilOrEmptyString` (follows Ruby/Rails convention)
  - `isEmpty` instead of `isEmptyValue`
  - `isPresent` instead of `isNonEmptyValue`

### Function Patterns

- All type checking functions should follow the pattern: `is{Condition}`
- Use TypeScript type guards: `(value: unknown): value is Type`
- Keep functions pure - no side effects

## Implementation Standards

### Type Guards

```typescript
// Good - specific type guard
export const isString = (value: unknown): value is string =>
  typeof value === 'string'

// Good - compound type guard
export const isBlank = (value: unknown): value is null | undefined | '' =>
  isNil(value) || isEmptyString(value)
```

### Function Composition

- Build complex checks from simpler ones
- Reuse existing utility functions
- Example: `isBlank` uses `isNil` and `isEmptyString`

## Testing Requirements

Every utility function must have comprehensive tests covering:

- Happy path cases
- Edge cases
- Type boundaries
- Invalid inputs

Follow the established the Unit Testing section in the `recovery/testing` tile patterns for test structure.

---

## Immutability

# Immutability Rule for Objects

Whenever you need to add or update properties on an object (for example, as in `shouldAddGooglePhotosToCenter`), always return a new object instead of mutating the original. Use object spread or similar techniques to ensure immutability throughout the codebase.

---

## Logging Guidelines

Always use the `logger` utility function to log messages.
The logger utility function is defined in `src/utils/logger/index.ts`.

```ts
logger.info({
  message: 'This is an info message',
  data: {
    key: 'value'
  }
  error: new Error('This is an error')
})
logger.warn({
  message: 'This is a warning message',
  data: {
    key: 'value'
  }
  error: new Error('This is an error')
})
logger.error({
  message: 'This is an error message',
  data: {
    key: 'value'
  }
  error: new Error('This is an error')
})
```

Use error logs only for fatal errors — cases where the process terminates or fails to produce a result.

If the issue is non-fatal (the program continues running but may produce unexpected results), log it as a warning or info, depending on severity.

This helps keep logs actionable and reduces noise when debugging production issues.

Use the `message` parameter to log the message you want to log.

Use the `error` parameter to log the error you want to log.

Use the `data` parameter to log the data you want to log.

The `no-console` ESLint rule is set to `error`. Any `console.log`, `console.warn`, or `console.error` call will fail lint. Always use `logger` instead.

---

## Barrel Files

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
