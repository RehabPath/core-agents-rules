# Lib Layer — Bugbot Rules

These rules apply when PR changes include files inside `src/lib/`.

The lib layer provides configured, ready-to-use SDK clients and service initializations. Its sole responsibility is setting up and exporting clients — nothing more.

## SDK Initialization Only

Flag anything beyond client configuration and SDK initialization inside `src/lib/`.

- Flag data-fetching functions (e.g., `getLandingPage`, `fetchCenters`, `getUser`). They belong in `src/persistence/`.
- The pattern to follow: define the client in `lib/`, use it in `persistence/`.

```ts
// Bad — data fetching in lib/
export const fetchLandingPage = async (slug: string) => {
  return sanityClient.fetch(query, { slug }) // data access — wrong location
}

// Good — client config only
export const sanityClient = createClient({
  projectId: clientEnv.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: clientEnv.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: !IS_DEVELOPMENT
})
```

## No Business Logic

Flag domain calculations, business rules, or derived-value functions inside `src/lib/`.

- Business logic belongs in `src/domain/use-cases/`.

## No UI Components

Flag JSX syntax, `.tsx` files, or React component definitions inside `src/lib/`.

- UI components belong in `src/components/`.

## No API Route Handlers

Flag request/response handling (reading `req.body`, returning `NextResponse`) inside `src/lib/`.

- API route handlers belong in `src/app/api/`.

## Use env.ts for Configuration

Flag `process.env` accessed directly in lib files other than `src/lib/env.ts`.

- All environment variable access must go through `clientEnv`, `serverEnv`, or `IS_DEVELOPMENT` from `src/lib/env.ts`.

```ts
// Bad
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID // wrong
})

// Good
import { clientEnv, IS_DEVELOPMENT } from '@/lib/env'

export const sanityClient = createClient({
  projectId: clientEnv.NEXT_PUBLIC_SANITY_PROJECT_ID
})
```

## Singleton Pattern for Database Clients

Flag database clients (Prisma, Redis) instantiated without a singleton guard in Next.js.

- Next.js hot-reloading creates new module instances on each reload, causing connection pool exhaustion.
- Use the `globalThis` singleton pattern for stateful clients.

```ts
// Good — singleton guard for Prisma
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma ?? createPrismaClient()
if (IS_DEVELOPMENT) globalForPrisma.prisma = prisma
```
