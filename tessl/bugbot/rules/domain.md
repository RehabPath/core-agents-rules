# Domain Layer — Bugbot Rules

These rules apply when PR changes include files inside `src/domain/`.

The domain layer contains core business logic and domain models. It must be fully independent of all outer layers (persistence, services, UI, framework).

## No Data Access

Flag any data-fetching calls inside `src/domain/`.

- Flag `fetch(`, `axios.`, `sanityClient.`, `prisma.`, or any database/HTTP client usage.
- Data access belongs in `src/persistence/`.

```ts
// Bad — in src/domain/center/use-cases/fetchCenters.ts
export async function fetchCenters() {
  const response = await fetch('/api/centers') // Wrong — belongs in persistence/
}

// Good — data access in persistence, domain stays pure
import type { Center } from '../center'
export function getCenterProfileSlug(center: Center): string {
  return `/p/${center.slug}/`
}
```

## No UI or JSX

Flag JSX syntax or React component definitions inside `src/domain/`.

- Flag any `.tsx` extension or `import React` / `import { ... } from 'react'` for rendering in domain files.
- Components belong in `src/components/`.

## No External Service Calls

Flag imports from `src/services/` or direct third-party SDK calls (Algolia, Google Maps, etc.) inside `src/domain/`.

## Use Domain Use-Case Functions

Flag constructing domain-derived values inline instead of using use-case functions.

- Flag template literals or string concatenation that build slugs, URLs, or derived values from domain objects directly.
- Example: flag `` `/p/${center.slug}` `` and suggest `getCenterProfileSlug(center)` from `src/domain/center/use-cases/getCenterProfileSlug`.

## Use-Case File Structure

- Each file in a `use-cases/` directory must export exactly **one** named function.
- Flag files that export multiple functions — split them into separate files.
- Flag use-case files that contain side effects (network calls, mutations, logging to external systems).

## Pure Functions

Use-case functions must be pure and deterministic.

- Given the same inputs, they must always return the same output.
- Flag use cases that read from or write to external state (global variables, module-level mutable state, external APIs).

## Domain Type Definitions

- Types and interfaces for domain entities belong in `{domain}/{domain}.ts` (e.g., `center/center.ts`).
- Flag domain entity type definitions placed inside `use-cases/` files — types belong in the top-level domain file.
- Flag database-specific field names (e.g., `_id`, `created_at`) in domain types — use domain terminology.

## No Generic Utilities

Flag utility functions (date formatting, string helpers, number formatting) defined inside `src/domain/`.

- Generic utilities belong in `src/utils/`.
- Domain-specific constants belong in `{domain}/const.ts`.

## Directory Naming

- Domain directories must be lowercase and singular (e.g., `center`, `location`, `taxonomy`).
- Flag PascalCase or plural domain directory names.

## Domain vs Application Layer

Flag logic placed in `src/domain/` that belongs in `src/application/` instead.

A function belongs in the **domain** layer if ALL of these are true:

1. It involves only **one** domain entity/concept.
2. It is a **pure function** — no side effects, no I/O.
3. It does not need to load or persist data.
4. It answers "what the business IS" not "how we USE the rules."

Flag domain functions that:

- Import from multiple different domain directories (cross-domain logic belongs in `src/application/`).
- Call persistence functions or load data from external sources.
- Orchestrate a workflow across more than one domain entity.

```ts
// Bad — cross-domain logic in domain layer
// domain/center/use-cases/getFeaturedCentersRelatedToLocation.ts
import { fetchFeaturedCenters } from '@/persistence/center/center.persistence' // Wrong!
export async function getFeaturedCentersRelatedToLocation({ center }) {
  return fetchFeaturedCenters({ location }) // persistence call — belongs in application/
}

// Good — pure, single-entity domain function
// domain/center/use-cases/getCenterProfileSlug.ts
export function getCenterProfileSlug(center: Center): string {
  return `/p/${center.slug}/`
}
```
