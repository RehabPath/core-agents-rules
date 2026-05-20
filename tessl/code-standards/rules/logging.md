
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

The `no-console` ESLint rule is set to `error`. Any `console.log`, `console.warn`, or `console.error` call will fail lint. Always use `logger` instead.
