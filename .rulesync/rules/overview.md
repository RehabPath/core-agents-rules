---
root: true
targets: ["cursor", "claudecode"]
description: "Core LLM rules for AI assistants - JavaScript/TypeScript development standards"
globs: ["**/*"]
cursor:
  alwaysApply: true
  description: "Core LLM rules for AI assistants"
---

# Core LLM Rules

This repository contains shared AI assistant rules for Cursor and Claude Code to ensure consistent code quality and development standards.

## Key Principles

1. **Immutability**: Always return new objects instead of mutating existing ones
2. **Type Safety**: Use utility check functions from `src/utils/checks.util.ts`
3. **Environment Variables**: Never use `process.env` directly - use the centralized env module
4. **Logging**: Always use the `logger` utility for consistent logging
5. **Functional Programming**: Prefer pure functions, array methods, and avoid side effects

## Code Style

- Use `const` over `let` when possible
- Prefer arrow functions for callbacks
- Use `===` instead of `==`
- Avoid `else` statements when possible
- Use domain use cases for accessing domain objects

## Testing

- Test files should end with `.test.ts`
- Use `describe` and `it` for meaningful test structure
- Only mock network requests, not constants
- Include comprehensive negative test cases

## SEO & Accessibility

- Use `SeoLink` component instead of raw `<a>` elements
- Ensure proper heading hierarchy (single `<h1>`, no skipped levels)
- All images need descriptive `alt` attributes
- Use semantic HTML elements (`<button>`, `<a>`, `<input>`)

## React/Component Guidelines

- Keep components inline unless reused 2+ times
- Extract only for server/client boundaries or complex logic
- Follow Atomic Design hierarchy (atoms → molecules → organisms)
- Prefer Server Components in Next.js 14+
