# core-llm-rules

Shared AI assistant rules for Cursor and Claude Code, distributed as [Tessl](https://tessl.io) tiles.

Rules are delivered at runtime via the Tessl MCP server — no files are copied to consuming projects on install.

## Tiles

| Tile | Contents |
|------|----------|
| `recovery/code-standards` | JS/TS style, utility check functions, immutability, logging, barrel files |
| `recovery/architecture` | API design, domain vs application layer, atomic design, dependency placement, env vars |
| `recovery/frontend` | Animation, design conventions, accessibility, icon components, SVG guidelines, core-components |
| `recovery/seo` | Canonical URLs, meta tags, social metadata, link semantics, schema markup, SSR |
| `recovery/testing` | Unit test structure, mocking strategy, negative test cases, utility testing patterns |
| `recovery/workflows` | Bug workflow, code review, PR creation, Shape Up → Linear, ticket creation |
| `recovery/bugbot` | Code review enforcement rules (global + per architecture layer) |

All tiles are private to the `recovery` workspace.

---

## Using in another project

### Prerequisites

- [Tessl CLI](https://tessl.io) installed (`curl -fsSL https://get.tessl.io | sh`)
- Authenticated: `tessl login`
- Member of the `recovery` workspace

### Setup (one-time per project)

```bash
# Auto-detects your agent (Claude Code, Cursor, etc.)
tessl init

# Or explicitly target Claude Code / Cursor
tessl init --agent claude-code
tessl init --agent cursor
```

This creates two files:
- **`tessl.json`** — dependency manifest (like `package.json` for rules)
- **`.mcp.json`** (Claude Code) or **`.cursor/mcp.json`** (Cursor) — wires the Tessl MCP server to your agent

Both files should be **committed to the repo** so teammates automatically get the MCP connection.

### Install tiles

```bash
tessl install recovery/code-standards
tessl install recovery/architecture
tessl install recovery/frontend
tessl install recovery/seo
tessl install recovery/testing
tessl install recovery/workflows
tessl install recovery/bugbot
```

This downloads the rule files into `.tessl/tiles/` and updates `.tessl/RULES.md` (the index the MCP server reads). Restart your agent after installing.

Install only what's relevant — a backend-only service doesn't need `recovery/frontend` or `recovery/seo`.

### What gets committed vs ignored

| Path | Commit? | Why |
|------|---------|-----|
| `tessl.json` | Yes | Dependency manifest — teammates run `tessl install` to sync |
| `.mcp.json` / `.cursor/mcp.json` | Yes | Wires MCP for everyone on the team |
| `.tessl/RULES.md` | Yes | Rule index read by the MCP server at runtime |
| `.tessl/tiles/` | No | Downloaded cache — add to `.gitignore` |

Add to `.gitignore`:
```
.tessl/tiles/
```

### Keeping rules up to date

```bash
tessl update          # update all tiles to latest versions
tessl outdated        # check what's behind
```

---

## How Tessl rules interact with CLAUDE.md

They are **complementary, not competing**. Both are loaded when Claude Code starts in a project.

| | CLAUDE.md | Tessl tiles |
|---|---|---|
| **Scope** | This repo only | Shared across all repos |
| **Content** | Build commands, tech stack, repo-specific architecture, project context | Team coding standards, patterns, conventions |
| **Delivery** | Claude Code reads the file directly | Tessl MCP server injects rules at agent startup |
| **Updates** | Edit in the repo | Edit here, CI publishes, all repos run `tessl update` |

### Recommended pattern

Keep `CLAUDE.md` lean — project-specific things only:

```markdown
## Build Commands
pnpm dev / pnpm test / pnpm lint

## Tech Stack
Next.js App Router, TypeScript, Prisma, Sanity, Algolia

## Coding standards
Delivered via Tessl tiles (recovery/code-standards, recovery/architecture, etc.).
Run `tessl list` to see installed tiles.
```

Move anything that applies across multiple projects (type-checking conventions, logging rules, test structure, PR format) into a tile here instead of duplicating it in every project's `CLAUDE.md`.

### What Claude Code sees at startup

When both are in place, Claude Code receives:
1. `CLAUDE.md` — project-specific instructions, loaded as file context
2. Tessl steering rules — injected via MCP, one block per installed tile

The agent treats them as additive. If the same topic appears in both, deduplicate by removing it from `CLAUDE.md` and letting the tile be the single source of truth.

---

## Adding or editing a rule

1. Edit `tessl/<tile>/rules/<tile>.md`
2. Bump the version in `tessl/<tile>/tile.json` (patch for content tweaks, minor for new sections)
3. Open a PR — CI lints on the PR and auto-publishes on merge to `main`
4. Consuming repos run `tessl update` to pull the new version

---

## CI / CD

| Workflow | Trigger | Action |
|----------|---------|--------|
| `validate-tiles.yml` | PR touching `tessl/**` | `tessl tile lint` all tiles |
| `publish-tiles.yml` | Push to `main` touching `tessl/**` | `tessl tile publish --bump patch` all tiles |
| `notify-slack.yml` | Push to `main` touching `tessl/**` | Posts changed tile names to Slack |

The `publish-tiles.yml` workflow requires a `TESSL_API_KEY` secret:

```bash
tessl api-key create
```

**Settings > Secrets and variables > Actions > New repository secret > `TESSL_API_KEY`**

---

## Tile structure reference

```
tessl/
└── <tile-name>/
    ├── tile.json           ← name, version, summary, steering config
    └── rules/
        └── <tile-name>.md  ← plain Markdown, no YAML frontmatter
```

`tile.json` shape:
```json
{
  "name": "recovery/<tile-name>",
  "version": "1.0.0",
  "summary": "What this tile covers",
  "private": true,
  "steering": {
    "<tile-name>": {
      "rules": "rules/<tile-name>.md"
    }
  }
}
```
