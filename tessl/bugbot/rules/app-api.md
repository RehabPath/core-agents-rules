# API Routes — Bugbot Rules

These rules apply when PR changes include files inside `src/app/api/`.

API route handlers are thin coordinators: authenticate → validate → call persistence/domain → respond. They must not contain business logic, Prisma queries, or raw HTTP response construction.

## routeHandler() Wrapper Required

Flag any API route that exports a raw `async function` instead of using `routeHandler()`.

Every handler must use `routeHandler()` from `@/lib/routeHandler`:

```ts
// Bad — raw async export
export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // ...
}

// Good — routeHandler wraps auth, validation, and error mapping
import { routeHandler } from '@/lib/routeHandler'
import { successResponse } from '@/lib/apiResponse'

export const GET = routeHandler({
  handler: async ({ auth }) => {
    const posts = await findPostsByUserId(auth!.userId)
    return successResponse(posts)
  }
})
```

## No Prisma in Route Files

Flag direct Prisma client usage inside `src/app/api/` route files.

- All Prisma queries belong in `src/persistence/{entity}/{entity}.persistence.ts`.
- Route handlers call persistence functions, not Prisma directly.

```ts
// Bad — Prisma in route handler
import { prisma } from '@/lib/prisma.client'
export const GET = routeHandler({
  handler: async ({ auth }) => {
    const posts = await prisma.post.findMany({
      where: { userId: auth!.userId }
    }) // Wrong
    return successResponse(posts)
  }
})

// Good — persistence function in route handler
import { findPostsByUserId } from '@/persistence/posts/posts.persistence'
export const GET = routeHandler({
  handler: async ({ auth }) => {
    const posts = await findPostsByUserId(auth!.userId)
    return successResponse(posts)
  }
})
```

## Response Helpers Required

Flag `NextResponse.json(...)` called directly in route handlers. Use the response helpers from `@/lib/apiResponse` instead.

```ts
// Bad — raw NextResponse
return NextResponse.json({ error: 'Not found' }, { status: 404 })
return NextResponse.json({ data: post }, { status: 200 })

// Good — response helpers
import {
  successResponse,
  notFound,
  unauthorized,
  forbidden
} from '@/lib/apiResponse'
return successResponse(post)
return notFound('Post not found')
return unauthorized()
return forbidden()
```

Available helpers: `successResponse`, `errorResponse`, `notFound`, `unauthorized`, `forbidden`, `serverError`, `validationError`.

### Exception: VerifyTx API routes

The following routes use `NextResponse.json()` directly because their response shapes are defined by the VerifyTx integration contract and do not fit the `{ data, error }` envelope:

- `src/app/api/verifyBenefits/verifytx/onboard/check/route.ts`
- `src/app/api/verifyBenefits/verifytx/onboard/route.ts`
- `src/app/api/verifyBenefits/verifytx/payers/route.ts`
- `src/app/api/verifyBenefits/verifytx/oauth/authorize/route.ts`
- `src/app/api/verifyBenefits/verifytx/oauth/setup/route.ts`
- `src/app/api/verifyBenefits/verifytx/oauth/callback/route.ts`

## Ownership Checks

Flag resource routes (`GET /[id]`, `PATCH /[id]`, `DELETE /[id]`) that read or mutate a resource without calling `assertOwner`.

- Always call `assertOwner(auth!, resource.userId)` before returning or mutating a resource.
- Always check `if (denied) return denied` immediately after.

```ts
// Bad — no ownership check
export const DELETE = routeHandler({
  handler: async ({ params }) => {
    const post = await findPostOrThrow(params.id)
    await deletePost(params.id) // anyone can delete any post!
    return successResponse({ deleted: true })
  }
})

// Good — ownership enforced
import { assertOwner } from '@/lib/policy'
export const DELETE = routeHandler({
  handler: async ({ params, auth }) => {
    const post = await findPostOrThrow(params.id)
    const denied = assertOwner(auth!, post.userId)
    if (denied) return denied
    await deletePost(params.id)
    return successResponse({ deleted: true })
  }
})
```

## Public Routes Must Be Explicit

Flag route handlers that should be public but don't have `protected: false`.

- Auth is **on by default** in `routeHandler()`.
- Public endpoints must explicitly opt out: `protected: false`.

```ts
// Bad — omitting protected means auth is required, which may be wrong for a public route
export const GET = routeHandler({
  handler: async () => {
    const centers = await findFeaturedCenters()
    return successResponse(centers)
  }
})

// Good — explicit public declaration
export const GET = routeHandler({
  protected: false,
  handler: async () => {
    const centers = await findFeaturedCenters()
    return successResponse(centers)
  }
})
```

## Body Validation via bodySchema

Flag route handlers that call `req.json()` or `req.body` directly. Use the `bodySchema` option with a Zod schema instead.

```ts
// Bad — manual body parsing
export const POST = routeHandler({
  handler: async ({ req }) => {
    const body = await req.json() // no validation
    await createPost(body)
    return successResponse(body, 201)
  }
})

// Good — Zod validation via bodySchema
import { createPostDto } from '@/persistence/posts/posts.dto'
export const POST = routeHandler({
  bodySchema: createPostDto,
  handler: async ({ body, auth }) => {
    const post = await createPost(auth!.userId, body) // body is fully typed and validated
    return successResponse(post, 201)
  }
})
```

## Domain Errors — Do Not Catch in Handlers

Flag `try/catch` blocks inside `routeHandler` handlers that catch `NotFoundError`, `ValidationError`, or `ForbiddenError`.

- These domain errors are thrown by persistence and domain use-case functions.
- `routeHandler` catches them automatically and maps them to the correct HTTP response.
- Route handlers must not catch domain errors themselves — it creates inconsistent error handling.

```ts
// Bad — handler catches domain errors
export const GET = routeHandler({
  handler: async ({ params }) => {
    try {
      const post = await findPostOrThrow(params.id)
      return successResponse(post)
    } catch (error) {
      return notFound() // redundant — routeHandler already handles NotFoundError
    }
  }
})

// Good — let domain errors propagate to routeHandler
export const GET = routeHandler({
  handler: async ({ params }) => {
    const post = await findPostOrThrow(params.id) // throws NotFoundError if missing
    return successResponse(post)
  }
})
```

## No HTTP Concepts Outside api/ and lib/

Flag `NextResponse`, `NextRequest`, or HTTP status codes used in `src/domain/`, `src/persistence/`, or `src/application/`.

- HTTP concerns belong exclusively in `src/app/api/` route files and `src/lib/` helpers.
- Domain and persistence layers throw typed errors (`NotFoundError`, `ValidationError`, `ForbiddenError`) — they never return HTTP responses.
