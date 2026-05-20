# core-llm-rules

Shared AI assistant rules for Cursor and Claude Code, distributed as [Tessl](https://tessl.io) tiles.

Rules are delivered at runtime via the Tessl MCP server — no files are copied to consuming projects.

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

## Installing in a project

```bash
# 1. Set up Tessl (one-time per project)
tessl init

# 2. Install tiles
tessl install recovery/code-standards
tessl install recovery/architecture
tessl install recovery/frontend
tessl install recovery/seo
tessl install recovery/testing
tessl install recovery/workflows
tessl install recovery/bugbot
```

`tessl init` creates `tessl.json` and configures the MCP server for Claude Code, Cursor, or whichever agent is detected. After that, agents receive rules automatically at startup.

## Updating to the latest version

```bash
tessl update
```

## Adding or editing a rule

1. Edit the relevant `tessl/<tile>/rules/<tile>.md` file
2. Bump the version in `tessl/<tile>/tile.json` (semver — patch for content tweaks, minor for new sections)
3. Open a PR — CI will lint the tile on the PR and publish automatically on merge to `main`

## CI / CD

| Workflow | Trigger | Action |
|----------|---------|--------|
| `validate-tiles.yml` | PR touching `tessl/**` | `tessl tile lint` all tiles |
| `publish-tiles.yml` | Push to `main` touching `tessl/**` | `tessl tile publish` all tiles |
| `notify-slack.yml` | Push to `main` touching `tessl/**` | Posts changed tile names to Slack |

The `publish-tiles.yml` workflow requires a `TESSL_API_KEY` secret. Generate one with:

```bash
tessl api-key create
```

Then add it to the repo: **Settings → Secrets and variables → Actions → New repository secret** → `TESSL_API_KEY`.

## Tile structure

```
tessl/
└── <tile-name>/
    ├── tile.json       ← name, version, summary, steering config
    └── rules/
        └── <tile-name>.md  ← plain Markdown, no YAML frontmatter
```
