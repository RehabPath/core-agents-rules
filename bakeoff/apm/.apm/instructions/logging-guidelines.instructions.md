---
description: "Use the logger utility; logger.error is for fatal errors only"
---

Always use the `logger` utility function to log messages.
The logger utility function is defined in `src/utils/logger/index.ts`.

```ts
logger.info({
  message: 'This is an info message',
  data: {
    key: 'value'
  }
  error: new Error('This is an error')
})
logger.warn({
  message: 'This is a warning message',
  data: {
    key: 'value'
  }
  error: new Error('This is an error')
})
logger.error({
  message: 'This is an error message',
  data: {
    key: 'value'
  }
  error: new Error('This is an error')
})
```

Use error logs only for fatal errors — cases where the process terminates or fails to produce a result.

If the issue is non-fatal (the program continues running but may produce unexpected results), log it as a warning or info, depending on severity.

This helps keep logs actionable and reduces noise when debugging production issues.

Use the `message` parameter to log the message you want to log.

Use the `error` parameter to log the error you want to log.

Use the `data` parameter to log the data you want to log.

## Errors from outside requests

Pass the error a `catch` received to `logger` as it is, whether it is an `Error`, a string or anything else. Do not wrap it, rebuild it or turn it into a string first.

An axios error carries the request it made: the body, the headers and the full URL, which can hold personal details, API keys and URL keys. The logger rebuilds it with only its message, code, method, status, the URL without its query and its cause (cleaned the same way) before the console or Sentry sees it, so it is safe to pass as it is. The same applies to an error that copies an axios request `config` onto a plain `Error`, as node-mailjet does, and to an axios error nested as another error's `cause`.

Never copy a request's body, headers or full URL into `data` yourself. The logger cannot clean what you put there.

```ts
// Bad
logger.warn({ message: 'Lead submission failed', data: { payload, url } })

// Good
logger.warn({ message: 'Lead submission failed', data: { slug }, error })
```

The `no-console` ESLint rule is set to `error`. Any `console.log`, `console.warn`, or `console.error` call will fail lint. Always use `logger` instead.
