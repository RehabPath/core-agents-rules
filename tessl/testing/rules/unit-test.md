
# Unit tests

Unit tests are the smallest tests to write. They test a specific piece of the code such as a function. Write as many unit tests as needed to make sure the happy path is covered and some edge cases are covered also.

## Standards

### “describe” and “it”

- Tests should be meaningful.
- Use describe to name the function or object under test that you are about to test.
- Use a nested describe to explain what makes a test unique such as explaining what the arguments are going to be.
- Use it to explain what the test expects.

Example:

```jsx
describe('capitalize', () => {
  describe('given a non empty string', () => {
    it('should produce a capitalized string from the string argument', () => {
      expect(capitalize('some string')).toEqual('SOME STRING')
    })
  })
})
```

The above could be read as “capitalize, given a non empty string, should produce a capitalized string from the string argument.”

### “expect”

- Use expect to assert the result of the test.
- Use a nested expect to assert the result of the test.

Example:

```jsx
expect(capitalize('some string')).toEqual('SOME STRING')
```

### “beforeEach” and “afterEach”

- Use beforeEach to run code before each test.
- Use afterEach to run code after each test.

Example:

```jsx
beforeEach(() => {
  mockAxios.reset()
})
```

## Mocking in Tests

When writing or updating tests, only mock network requests (such as those made with `axios` or `fetch`). Do not mock or spy on constants or other static values. Use the real values from the constants module in your test logic and data.

## Test Organization

### Unifying Similar Test Cases

Group related test cases under unified describe blocks to reduce duplication:

```ts
// Good - unified similar cases
describe('given serverData has non-object error', () => {
  it('should return false when error is null', () => {
    /* test */
  })
  it('should return false when error is a string', () => {
    /* test */
  })
})

// Avoid - separate describes for similar cases
describe('given serverData has error as null', () => {
  /* test */
})
describe('given serverData has error as string', () => {
  /* test */
})
```

### Comprehensive Coverage Strategy

Cover these key scenarios for validation functions:

1. **Nil cases**: null and undefined inputs
2. **Error object cases**: when error is an object
3. **Non-error cases**: null, string, undefined error values
4. **Valid data cases**: proper data without errors
5. **Negative cases**: invalid inputs, edge cases, and error conditions

### Negative Test Cases

Always include comprehensive negative test cases to ensure functions handle invalid inputs gracefully. Group negative tests into logical describe blocks.

#### Categories of Negative Tests

**1. Invalid Numeric Values**

Test how functions handle problematic numeric inputs:

```ts
describe('negative test cases with invalid review counts', () => {
  it('should return false when count is negative', () => {
    const result = validateCount(-5)
    expect(result).toBe(false)
  })

  it('should return false when count is very large negative number', () => {
    const result = validateCount(-999999)
    expect(result).toBe(false)
  })

  it('should return false when both values are negative', () => {
    const result = validateCounts(-10, -5)
    expect(result).toBe(false)
  })
})
```

**2. Invalid Data Types**

Test how functions handle wrong data types:

```ts
describe('negative test cases with invalid data types', () => {
  it('should return false when value is NaN', () => {
    const result = validateNumber(NaN)
    expect(result).toBe(false)
  })

  it('should return false when value is Infinity', () => {
    const result = validateNumber(Infinity)
    expect(result).toBe(false)
  })

  it('should return false when value is -Infinity', () => {
    const result = validateNumber(-Infinity)
    expect(result).toBe(false)
  })

  it('should return false when value is a string', () => {
    const result = validateNumber('5' as unknown as number)
    expect(result).toBe(false)
  })

  it('should return false when value is an object', () => {
    const result = validateNumber({ count: 5 } as unknown as number)
    expect(result).toBe(false)
  })

  it('should return false when value is an array', () => {
    const result = validateNumber([10] as unknown as number)
    expect(result).toBe(false)
  })

  it('should return false when value is a boolean', () => {
    const result = validateNumber(true as unknown as number)
    expect(result).toBe(false)
  })
})
```

**3. Boundary Conditions**

Test behavior at threshold boundaries:

```ts
describe('negative test cases with boundary conditions', () => {
  it('should return false when value is exactly one below threshold', () => {
    const result = validateThreshold(9) // threshold is 10
    expect(result).toBe(false)
  })

  it('should return true when value is exactly at threshold', () => {
    const result = validateThreshold(10)
    expect(result).toBe(true)
  })

  it('should return false when combined values fail threshold', () => {
    const result = validateCombined(0, 9) // needs 10
    expect(result).toBe(false)
  })
})
```

#### Negative Test Best Practices

1. **Group related negative tests together**

   ```ts
   // Good - grouped by category
   describe('negative test cases with invalid review counts', () => {
     // All invalid count tests here
   })

   describe('negative test cases with invalid data types', () => {
     // All invalid type tests here
   })
   ```

2. **Test both directions of combined conditions**

   ```ts
   // Test when first value is invalid
   it('should fail when first value is negative', () => {
     validateCombined(-5, 10)
   })

   // Test when second value is invalid
   it('should fail when second value is negative', () => {
     validateCombined(10, -5)
   })

   // Test when both are invalid
   it('should fail when both values are negative', () => {
     validateCombined(-5, -10)
   })
   ```

3. **Include descriptive test names**

   ```ts
   // Good - clearly states what is being tested
   it('should return false when native reviews count is negative and third-party < 10', () => {
     // test
   })

   // Bad - vague description
   it('should return false for bad input', () => {
     // test
   })
   ```

4. **Mock all function calls appropriately**

   ```ts
   // When function calls isNumber() multiple times, mock each call
   mockIsNumber.mockReturnValueOnce(true) // for first check
   mockIsNumber.mockReturnValueOnce(true) // for second check
   mockIsNumber.mockReturnValueOnce(false) // for third check
   ```

#### Required Negative Test Coverage

For any validation or checking function, include tests for:

- ✅ Negative numbers
- ✅ Zero (when invalid)
- ✅ NaN
- ✅ Infinity and -Infinity
- ✅ Wrong data types (string, object, array, boolean)
- ✅ Null and undefined
- ✅ Boundary conditions (one above/below thresholds)
- ✅ Combined invalid conditions

## Type Safety in Tests

### Helper Functions for Mock Data

Create reusable helper functions for consistent test data:

```ts
// Helper functions for mock data
const createMockCenter = () => ({
  id: 1,
  title: 'Test Center',
  slug: 'test-center'
})
```

### Proper Type Assertions

Use safe TypeScript patterns for test data. When testing invalid data types in negative tests, always use `unknown` for type safety:

```ts
// Good - use unknown first for complex type assertions
const serverData = {
  /* mock data */
} as unknown as GetProviderTypeServerData

// Good - use unknown when testing invalid types in negative tests
const invalidValue = '5' as unknown as number

// Bad - avoid direct any casting
const mockData = rawData as any // Avoid this
```

## Test File Naming

Test files should end with .test.ts.

### Test File Structure

Test files should be named like the file they are testing, with .test.ts appended.

Example:

```jsx
// src/components/Button.ts
// src/components/Button.test.ts
```

After writing tests, always run `pnpm test` to ensure the tests are passing.
