# Recovery Tessl Rules Workspace

This repository is the source of truth for shared Tessl rules in the `recovery` workspace.

## What lives here

- `tiles/style-and-conventions`: cross-project coding standards (safe for backend and frontend).
- `tiles/ui`: frontend-only rules (do not install in backend-only repos).
- `tiles/testing`: test-writing and test-structure guidance.
- `tiles/architecture`: layering and architectural boundaries.
- `tiles/workflow`: PR, ticket, review, and process rules plus reusable workflow skills.
- `tessl.json`: local tile dependencies wired with `file:` sources.

## Rule placement policy

When adding a new rule, place it in exactly one tile:

- Use `style-and-conventions` for language and code quality conventions.
- Use `ui` for accessibility, design, icons, animation, and SEO.
- Use `testing` for unit/integration test behavior and test patterns.
- Use `architecture` for boundaries, layering, imports, API design, and module contracts.
- Use `workflow` for delivery process, PR flow, bug handling, and ticketing.

If a rule might apply to backend-only projects, it should not go in `ui`.

## How to add a new rule

1. Pick the target tile from the policy above.
2. Create a new markdown rule file under that tile's `rules/` directory.
3. Add the rule entry to that tile's `tile.json` under `rules`.
4. Keep guidance concise and actionable (agents front-load these tokens).
5. Avoid links that point outside the tile path. If referencing another tile rule, use text references like:
   - `Follow the unit-test rule from recovery/testing`
6. Validate the tile and repo:
   - `tessl tile lint tiles/<tile-name>`
   - `tessl install`
7. Publish the updated tile version when ready.

## Rule file template

Use this template for new files in `tiles/<tile>/rules/*.md`:

```md
---
description: One-line rule purpose
alwaysApply: false
globs:
  - **/*.ts
---

# Rule Name

## Intent

- Explain why the rule exists.

## Requirements

- List concrete do/don't instructions.

## Examples

- Add short good/bad examples when useful.
```

Notes:

- `alwaysApply: true` only for highly reusable, low-noise rules.
- Prefer `globs` for targeted and context-specific rules.

## Validate before publishing

Run all tile validations:

```bash
tessl tile lint tiles/style-and-conventions
tessl tile lint tiles/ui
tessl tile lint tiles/testing
tessl tile lint tiles/architecture
tessl tile lint tiles/workflow
```

Then confirm dependencies resolve:

```bash
tessl install
```

## Publish flow

Publish only the tile(s) that changed:

```bash
tessl tile publish tiles/style-and-conventions
tessl tile publish tiles/ui
tessl tile publish tiles/testing
tessl tile publish tiles/architecture
tessl tile publish tiles/workflow
```

If publish fails with a permission error, request publisher-or-higher access in workspace `recovery`.

## Publish only after PR merge

This repo is configured to publish tiles from GitHub Actions using `.github/workflows/publish-tiles.yml`.

- It runs on `push` to `main` (plus manual `workflow_dispatch`).
- It installs the Tessl CLI via [`tesslio/setup-tessl@v2`](https://github.com/tesslio/setup-tessl).
- It lints and publishes only tiles changed in that push.
- It uses `--bump patch` so repeated publishes do not fail on existing versions.

Required repository secret:

- `TESSL_TOKEN`: Tessl API token for a service account/user with publish permission in workspace `recovery`. Create it in the [Tessl Web UI](https://tessl.io) workspace settings, then add it under GitHub **Settings → Secrets and variables → Actions**. If this repo still has `TESSL_API_KEY` from the older workflow, create `TESSL_TOKEN` with the same value before merging.

To enforce review before publishing:

1. Enable branch protection for `main`.
2. Require pull requests and required approvals.
3. Restrict direct pushes to `main`.
4. Mark `Validate Tiles` workflow as a required status check.

## Consumer installation guidance

Example backend-only install set:

- `recovery/style-and-conventions`
- `recovery/testing`
- `recovery/architecture`
- `recovery/workflow`

Add `recovery/ui` only for frontend projects.

## Migration note for Cursor rules

- Keep `.cursor/mcp.json` if you need MCP server wiring.
- Legacy `.cursor/rules` can be removed once all repos consume Tessl tiles successfully.

---

## Adding or editing a rule

1. Edit the relevant file in `tessl/<tile>/rules/` (one file per original rule)
2. Bump the version in `tessl/<tile>/tile.json` (patch for content tweaks, minor for new rules)
3. Open a PR — CI lints on the PR and auto-publishes on merge to `main`
4. Consuming repos run `tessl update` to pull the new version

---

## CI / CD

| Workflow             | Trigger                            | Action                                      |
| -------------------- | ---------------------------------- | ------------------------------------------- |
| `validate-tiles.yml` | PR touching `tessl/**`             | `tessl tile lint` all tiles                 |
| `publish-tiles.yml`  | Push to `main` touching `tessl/**` | Lints then publishes only the changed tiles |
| `notify-slack.yml`   | Push to `main` touching `tessl/**` | Posts changed tile names to Slack           |

The `publish-tiles.yml` workflow requires a Tessl API key as a GitHub Actions secret ([docs](https://docs.tessl.io/distribute/review-and-publish-with-github-actions.md)):

1. Create a key at [tessl.io/account/api-keys](https://tessl.io/account/api-keys) (or `tessl api-key create` with the CLI).
2. Add **Settings → Secrets and variables → Actions → New repository secret** named **`TESSL_TOKEN`** (preferred; matches [setup-tessl](https://github.com/tesslio/setup-tessl)). The workflow also accepts an existing **`TESSL_API_KEY`** secret.

The workflow uses [`tesslio/setup-tessl@v2`](https://github.com/tesslio/setup-tessl) to install the CLI and authenticate later steps — do not rely on passing `TESSL_API_KEY` as a step `env` alone; the CLI reads **`TESSL_TOKEN`**.

---

## Tile structure reference

Each tile has one file per rule — this lets the agent load only the steering rules it needs:

```
tessl/
└── <tile-name>/
    ├── tile.json
    └── rules/
        ├── <rule-1>.md     ← plain Markdown, no YAML frontmatter
        ├── <rule-2>.md
        └── <rule-n>.md
```

`tile.json` shape:

```json
{
  "name": "recovery/<tile-name>",
  "version": "1.0.0",
  "summary": "What this tile covers",
  "private": true,
  "steering": {
    "<rule-1>": { "rules": "rules/<rule-1>.md" },
    "<rule-2>": { "rules": "rules/<rule-2>.md" }
  }
}
```

Each key in `steering` becomes a named context block injected by the MCP server. Keeping rules in separate files makes diffs cleaner and lets tiles grow without one massive file becoming hard to review.
