# core-llm-rules

Shared AI assistant rules for Cursor and Claude Code. When installed, this package generates rule files for both tools using [rulesync](https://github.com/dyoshikawa/rulesync).

## Requirements

- Node.js 22+

## Installation

Install directly from GitHub:

```bash
npm install github:nicasio/core-llm-rules
```

Or with a specific branch/tag:

```bash
npm install github:nicasio/core-llm-rules#main
```

On install, the package will automatically:
1. Generate rules using rulesync (within the package)
2. Copy `.cursor/rules/` to your project (Cursor rules)
3. Copy `.claude/` to your project (Claude Code rules including `CLAUDE.md`)

## Adding a New Rule (for contributors)

Rules are stored in `.rulesync/rules/` as Markdown files with YAML frontmatter.

### 1. Create a new rule file

Create a new `.md` file in `.rulesync/rules/`:

```bash
touch .rulesync/rules/my-new-rule.md
```

### 2. Add frontmatter and content

```markdown
---
root: false
targets: ["cursor", "claudecode"]
description: "Brief description of what this rule does"
globs: ["**/*.ts", "**/*.tsx"]  # Optional: file patterns to match
cursor:
  alwaysApply: false  # true = always active, false = only when globs match
  description: "Description shown in Cursor"
  globs: ["**/*.ts"]  # Optional: Cursor-specific globs
---

# Rule Title

Your rule content goes here. Use Markdown formatting.

## Guidelines

- Guideline 1
- Guideline 2

## Examples

### Good

```typescript
// Good example
```

### Bad

```typescript
// Bad example
```
```

### 3. Frontmatter Options

| Option | Type | Description |
|--------|------|-------------|
| `root` | boolean | `true` for overview files (generates CLAUDE.md), `false` for detailed rules |
| `targets` | array | Tools to generate for: `["cursor", "claudecode"]` or `["*"]` for all |
| `description` | string | Brief description of the rule |
| `globs` | array | File patterns when this rule applies (e.g., `["**/*.test.ts"]`) |
| `cursor.alwaysApply` | boolean | `true` = always active in Cursor, `false` = only when globs match |
| `cursor.description` | string | Cursor-specific description |
| `cursor.globs` | array | Cursor-specific file patterns |

### 4. Rule Types

**Always-apply rules** (active for all files):
```yaml
---
root: false
targets: ["cursor", "claudecode"]
description: "Code style guidelines"
globs: ["**/*.js", "**/*.ts"]
cursor:
  alwaysApply: true
---
```

**Glob-specific rules** (active only for matching files):
```yaml
---
root: false
targets: ["cursor", "claudecode"]
description: "Unit testing conventions"
globs: ["**/*.test.ts", "**/*.spec.ts"]
cursor:
  alwaysApply: false
  globs: ["**/*.test.ts", "**/*.spec.ts"]
---
```

**On-demand rules** (manually referenced):
```yaml
---
root: false
targets: ["cursor", "claudecode"]
description: "PR creation checklist"
cursor:
  alwaysApply: false
---
```

### 5. Regenerate rules

After adding or modifying rules, regenerate the output files:

```bash
npx rulesync generate --targets cursor,claudecode --features rules
```

Or use the package script:

```bash
npx generate-llm-rules
```

## Included Rules

### Always Applied
- **overview** - Core principles and guidelines
- **js-style-guide** - JavaScript/TypeScript code style
- **environment-variables** - Environment variable access patterns
- **immutability-objects** - Object immutability patterns
- **logging-guidelines** - Logger utility usage
- **use-utility-checks** - Utility check function usage

### Glob-Specific
- **unit-test** - Unit testing conventions (`*.test.ts`, `*.spec.ts`)
- **seo-guidelines** - SEO guidelines (`*.tsx`, `*.jsx`)
- **html-accessibility** - Accessibility checklist (`*.tsx`, `*.jsx`, `*.html`)
- **utility-checks-testing** - Utility function testing patterns
- **utility-checks-functions** - Utility checks functions guide
- **atomic-design-component-creation** - Component creation guidelines

### On-Demand
- **code-review** - Code review checklist
- **github-pr-creation** - GitHub PR creation rules
- **shape-up-to-linear-conversion** - Notion to Linear conversion
- **single-ticket-creation** - Linear ticket creation rules

## Generated Files

The package generates:

```
your-project/
├── .cursor/
│   └── rules/
│       ├── overview.mdc
│       ├── js-style-guide.mdc
│       └── ... (other .mdc files)
└── .claude/
    ├── CLAUDE.md
    └── rules/
        ├── js-style-guide.md
        └── ... (other .md files)
```

## Updating

To update to the latest version from GitHub:

```bash
npm update core-llm-rules
```

Or reinstall:

```bash
npm install github:nicasio/core-llm-rules
```

## Validation

Rules are validated against a JSON schema to ensure correct frontmatter format.

### Run validation locally

```bash
npm run validate:rules
```

This checks:
- Valid YAML frontmatter syntax
- Required fields (`targets`, `description`)
- Valid target values
- Correct types for all fields

### JSON Schema

The schema is defined in `rule-schema.json` and validates:

```json
{
  "required": ["targets", "description"],
  "properties": {
    "root": { "type": "boolean" },
    "targets": { "type": "array", "items": { "enum": ["*", "cursor", "claudecode", ...] } },
    "description": { "type": "string" },
    "globs": { "type": "array" },
    "cursor": { "alwaysApply": "boolean", "description": "string", "globs": "array" }
  }
}
```

## CI/CD

### Rule Validation (GitHub Action)

The `validate-rules.yml` workflow runs on every push/PR that modifies rules:
- Validates all rule files against the JSON schema
- Runs `rulesync generate` to ensure rules compile
- Checks if generated files are in sync with source

### Slack Notifications

The `notify-slack.yml` workflow sends a Slack message when rules change on `main`:

**Example notification:**
```
*LLM Rules Updated* 🤖

✨ *New rules:* my-new-rule
✏️ *Modified:* js-style-guide
🗑️ *Removed:* deprecated-rule

View commit
```

#### Setup Slack Webhook

1. Go to your repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `SLACK_WEBHOOK_URL`
4. Value: Your Slack incoming webhook URL

#### Get a Slack Webhook URL

1. Go to [Slack API Apps](https://api.slack.com/apps)
2. Create a new app → **From scratch**
3. Select your workspace
4. Go to **Incoming Webhooks** → Enable
5. Click **Add New Webhook to Workspace**
6. Select the channel to post notifications
7. Copy the webhook URL

## Resources

- [rulesync documentation](https://github.com/dyoshikawa/rulesync)
- [rulesync config schema](https://raw.githubusercontent.com/dyoshikawa/rulesync/refs/heads/main/config-schema.json)
