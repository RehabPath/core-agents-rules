---
alwaysApply: true
---

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
if (typeof value === "string") {
}
if (typeof value === "number") {
}
if (typeof value === "boolean") {
}
if (typeof value === "object" && value !== null && !Array.isArray(value)) {
}

// Don't manually check arrays
if (Array.isArray(value)) {
}
if (Array.isArray(value) && value.length === 0) {
}
if (Array.isArray(value) && value.length > 0) {
}

// Don't manually check strings
if (value === "") {
}
if (value.trim() === "") {
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
    return null;
  }
  // ...
}

// Bad - manual type checking
function validateInput(input: unknown) {
  if (typeof input !== "string" || input.trim() === "") {
    throw new Error("Invalid input");
  }
  // ...
}

// Bad - manual array checking
function processItems(items: unknown) {
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }
  // ...
}
```

### ✅ Good: Using Utility Functions

```typescript
// Good - using utility functions
function processUser(user: unknown) {
  if (isNil(user)) {
    return null;
  }
  // TypeScript now knows user is not null/undefined
}

// Good - using utility functions with composition
function validateInput(input: unknown) {
  if (!isNonEmptyString(input)) {
    throw new Error("Invalid input");
  }
  // TypeScript now knows input is a non-empty string
}

// Good - using utility functions
function processItems(items: unknown) {
  if (isEmptyArray(items)) {
    return [];
  }
  // TypeScript knows items is an empty array

  if (isNonEmptyArray(items)) {
    return items.map(/* ... */);
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
