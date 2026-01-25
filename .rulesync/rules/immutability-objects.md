---
root: false
targets: ["cursor", "claudecode"]
description: "Object immutability patterns"
globs: ["**/*.js", "**/*.ts", "**/*.jsx", "**/*.tsx"]
cursor:
  alwaysApply: true
  description: "Object immutability patterns"
---

# Immutability Rule for Objects

Whenever you need to add or update properties on an object (for example, as in `shouldAddGooglePhotosToCenter`), always return a new object instead of mutating the original. Use object spread or similar techniques to ensure immutability throughout the codebase.
