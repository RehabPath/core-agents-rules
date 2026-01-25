---
root: false
targets: ["cursor", "claudecode"]
description: "JavaScript/TypeScript code style guidelines"
globs: ["**/*.js", "**/*.ts", "**/*.jsx", "**/*.tsx"]
cursor:
  alwaysApply: true
  description: "JavaScript/TypeScript code style guidelines"
---

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
- Don't rely on hoisting for variables.

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

For testing specificaitons follow unit-test.mdc
