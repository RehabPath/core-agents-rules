# Environment Variables

Never use `process.env` directly in the codebase.

Use the centralized environment module at `src/lib/env.ts` instead.

## Accessing Environment Variables

### Client Environment Variables (NEXT*PUBLIC*\*)

Use `clientEnv` for browser-accessible variables:

```ts
import { clientEnv } from "@/lib/env";

const apiKey = clientEnv.NEXT_PUBLIC_ALGOLIA_API_KEY;
const segmentKey = clientEnv.NEXT_SEGMENT_KEY;
```

### Server Environment Variables

Use `serverEnv` for server-only variables (API routes, server components):

```ts
import { serverEnv } from "@/lib/env";

const databaseUrl = serverEnv.DATABASE_URL;
const sentryDsn = serverEnv.SENTRY_DSN;
```

### Environment Detection

Environment detection derives **solely from `VERCEL_ENV`** — never read
`process.env.NODE_ENV` (it is `production` on every deployed target, so it
cannot distinguish preview/staging from production). There are three tiers:

- **production** — the live recovery.com deploy (`VERCEL_ENV='production'`).
- **preview** — preview AND staging deploys (Vercel reports our staging custom
  environment as `VERCEL_ENV='preview'`).
- **development** — local dev and jest (`VERCEL_ENV` unset → normalized to
  `development`).

Four flags expose this. Import the server flags from `@/lib/env.server` and the
client flags from `@/lib/env.client` (both expose the same names):

```ts
import {
  APP_ENV,
  IS_PRODUCTION,
  IS_PREVIEW,
  IS_DEVELOPMENT,
} from "@/lib/env.server";

if (IS_DEVELOPMENT) {
  logger.debug({ message: "Debug info" });
}

// APP_ENV is the 'production' | 'preview' | 'development' value itself, e.g.
// used as the Sentry `environment` tag.
```

## Adding New Environment Variables

1. Add the variable to the appropriate schema in `src/lib/env.ts`:

```ts
// For client variables (NEXT_PUBLIC_*)
const clientSchema = z.object({
  // ... existing variables
  NEXT_PUBLIC_NEW_VARIABLE: z.string().optional(),
});

// For server variables
const serverSchema = z.object({
  // ... existing variables
  NEW_SERVER_VARIABLE: z.string().optional(),
});
```

2. Add the variable to the validation function:

```ts
// In validateClientEnv()
const parsed = clientSchema.safeParse({
  // ... existing variables
  NEXT_PUBLIC_NEW_VARIABLE: process.env.NEXT_PUBLIC_NEW_VARIABLE,
});
```

3. Use the variable via `clientEnv` or `serverEnv`

## Bad vs Good Examples

### ❌ Bad: Direct process.env access

```ts
// Don't do this - triggers ESLint error
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
const isDev = process.env.NODE_ENV === "development";
```

### ✅ Good: Using env module

```ts
import { clientEnv, IS_DEVELOPMENT } from "@/lib/env";

const apiKey = clientEnv.NEXT_PUBLIC_API_KEY;
const isDev = IS_DEVELOPMENT;
```

## Benefits

- **Type Safety**: All variables are validated with Zod schemas
- **Runtime Validation**: Missing required variables fail fast at startup
- **Centralized Configuration**: Single source of truth for all environment variables
- **IDE Support**: Full autocomplete and type checking
