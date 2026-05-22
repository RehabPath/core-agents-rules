---
name: debug-and-fix
description: Test-driven bug fixing — write a failing test first, identify root cause, implement the minimal fix, verify. Use when working on a bug ticket or unexpected behavior.
---

# Debug and Fix

## Purpose

Fix bugs correctly using a test-driven workflow: reproduce the bug as a failing test before touching any production code, then make the minimal change to pass it.

## When To Use

Use this skill when:

- Working on a Linear ticket labeled "Bug"
- The user reports unexpected or broken behavior
- A regression has been introduced

## Required Workflow

### Step 1: Confirm it is a bug

Before starting, verify:

- Linear ticket has the "Bug" label, OR
- Ticket description describes unexpected behavior or a regression, OR
- User explicitly states they are working on a bug

If unclear, ask the user: "Is this a bug (unexpected behavior) or a feature request?"

### Step 2: Write a failing test first

**Do not touch production code yet.**

1. Locate or create the test file co-located with the buggy module (e.g., `foo.test.ts` next to `foo.ts`)
2. Write a test case that exactly reproduces the bug
3. Use **real failing data** from the ticket — specific IDs, coordinates, inputs, strings — not placeholder values
4. Run the test and confirm it **fails** with output that matches the bug description

Follow the unit-test patterns from the testing tile:

- `describe` → function under test
- Nested `describe` → the failing condition
- `it` → what should happen (but currently does not)

```ts
describe("parseCoordinates", () => {
  describe("given a UK coordinate with a small decimal longitude", () => {
    it("should return the correct decimal value", () => {
      // Real data from ticket: lat 51.5181891, lng -0.1468136
      expect(parseCoordinates("51.5181891,-0.1468136")).toEqual({
        lat: 51.5181891,
        lng: -0.1468136,
      });
    });
  });
});
```

### Step 3: Identify the root cause

With the failing test output in hand:

1. Read the actual vs. expected values from the test failure
2. Trace the data flow — follow the input through each function until the value diverges
3. Identify the exact line or condition that produces the wrong result
4. Note the root cause clearly (you will reference it in the fix or commit message)

### Step 4: Implement the minimal fix

- Change **only** what is needed to make the test pass
- Do not refactor unrelated code or improve surrounding style
- Follow existing patterns and conventions in the file
- If the fix involves non-obvious logic, add a short inline comment explaining why

### Step 5: Verify

1. Run the new test — it must pass
2. Run the full test suite for the affected module — no regressions
3. Check for lint errors
4. If the bug is visible in the UI, verify the fix visually in a browser

## Anti-Patterns

- Do not fix the code before writing a failing test
- Do not write tests after the fix is already in place
- Do not use made-up test data instead of actual failing values from the ticket
- Do not make unrelated changes while fixing the bug
- Do not skip regression testing on related tests
