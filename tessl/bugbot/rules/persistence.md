# Persistence Layer — Bugbot Rules

These rules apply when PR changes include files inside `src/persistence/`.

The persistence layer handles all data access and storage. It isolates data access from business logic and provides clean interfaces to the rest of the application.

## No Business Logic

Flag domain calculations, business rules, or derived-value functions inside `src/persistence/`.

- Flag functions like `calculateScore`, `shouldShowDistanceLabel`, or any function that applies a business rule.
- Business logic belongs in `src/domain/use-cases/`.

```ts
// Bad — in persistence
export function calculateCenterScore(center: Center) {
  return center.reviews * center.rating // domain logic — wrong location
}

// Good — data access only
export const getCenterBySlug = async (
  slug: string
): Promise<CenterDto | null> => {
  return sanityClient.fetch(query, { slug })
}
```

## No UI Components

Flag JSX syntax, `.tsx` files, or React component definitions inside `src/persistence/`.

- UI components belong in `src/components/`.

## Required DTO Files

Every entity with a `.persistence.ts` file must have a corresponding `.dto.ts` file.

- Flag `.persistence.ts` files without a matching `.dto.ts` in the same directory.
- DTOs must match the exact shape of the external API response (Sanity, Prisma, REST API, etc.).
- Flag domain entity types (e.g., `type Center`) defined inside `.dto.ts` or `.persistence.ts` files — domain types belong in `src/domain/{entity}/{entity}.ts`.

## File Naming Conventions

Flag files that do not follow the naming convention:

- Data access files must end in `.persistence.ts`
- DTO files must end in `.dto.ts`
- Test files must end in `.persistence.spec.ts` or `.persistence.test.ts`

```
// Good
center.persistence.ts
center.dto.ts
center.persistence.spec.ts

// Bad
centerRepository.ts       // wrong suffix
center.types.ts           // DTOs should use .dto.ts
centerTests.ts            // wrong naming
```

## No Domain Entity Definitions

Flag type definitions for domain entities (e.g., `type Center`, `interface Location`) in persistence files.

- Domain types belong in `src/domain/{entity}/{entity}.ts`.
- Persistence files may define DTO types that match the external API shape, but must not redefine domain models.

## Error Handling

Flag persistence functions that let network or API errors propagate without any handling or logging.

- Persistence functions should handle errors gracefully and use `logger` from `src/utils/logger/index.ts` for non-fatal failures.

## No Cross-Entity Imports in DTOs

Flag `.dto.ts` files that import from other domain or persistence modules to compose their shape.

- DTOs must represent the raw external API response exactly as returned — no transformation logic inside DTOs.
