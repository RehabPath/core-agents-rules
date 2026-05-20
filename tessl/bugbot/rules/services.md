# Services Layer — Bugbot Rules

These rules apply when PR changes include files inside `src/services/`.

The services layer wraps external third-party APIs and integrations (geolocation, search, analytics, email). It abstracts external complexity but must not contain business logic, UI, or persistence.

## No React Components or JSX

Flag any `.tsx` files, JSX syntax, or React component definitions inside `src/services/`.

- React providers and context components belong in `src/components/organisms/`.
- Services contain only client logic, types, and configuration.

```ts
// Bad — in services/segment/SegmentProvider.tsx
export function SegmentProvider({ children }) {
  return <>{children}</> // React component — wrong location
}

// Good — provider lives in components/organisms/
// Import from components, not from services
import { AnalyticsProvider } from '@/components/organisms/AnalyticsProvider/AnalyticsProvider'
```

## No Domain Imports

Flag imports from `src/domain/` inside `src/services/`.

- Services must not depend on domain types or use-case functions.
- Services define their own request/response types in `{service}/{service}.ts`.

```ts
// Bad
import type { Center } from '@/domain/center/center' // wrong — services don't import from domain

// Good
import type { GeolocationResult } from './geolocation'
```

## No Persistence Logic

Flag database queries, data storage, or state management inside `src/services/`.

- Data storage belongs in `src/persistence/`.

## No Business Logic

Flag domain rules, validations, or calculations (e.g., filtering centers by distance, scoring results) inside `src/services/`.

- Business logic belongs in `src/domain/use-cases/`.

## No Component Re-exports

Flag any `index.ts` in a service directory that re-exports a component from `src/components/`.

- Import components directly from their source in `src/components/`.

```ts
// Bad — in services/segment/index.ts
export { AnalyticsProvider } from '@/components/organisms/AnalyticsProvider'

// Good — import directly from components
import { AnalyticsProvider } from '@/components/organisms/AnalyticsProvider/AnalyticsProvider'
```

## Required File Structure

Each service directory must follow this structure:

```
services/
└── {serviceName}/
    ├── {serviceName}.ts  # type definitions and interfaces
    ├── const.ts          # configuration, endpoints, environment variable references
    └── client.ts         # service client implementation
    └── utils.ts          # optional helper functions
```

- Flag services that define all types, config, and client logic in a single file.
- Service directory names must be lowercase singular (e.g., `geolocation`, `search`, `analytics`).

## Environment Variables in const.ts

Flag `process.env` accessed directly inside `client.ts` or `utils.ts`.

- Environment variable references in services must go through `src/lib/env.ts` (`clientEnv`, `serverEnv`).
- Configuration belongs in the service's `const.ts`, using values from `env.ts`.
