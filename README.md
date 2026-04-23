# Recovery Tessl Rules Workspace

This repository is the source of truth for shared Tessl rules in the `recovery` workspace.

## What lives here

- `tiles/style-and-conventions`: cross-project coding standards (safe for backend and frontend).
- `tiles/ui`: frontend-only rules (do not install in backend-only repos).
- `tiles/testing`: test-writing and test-structure guidance.
- `tiles/architecture`: layering and architectural boundaries.
- `tiles/workflow`: PR, ticket, review, and process rules.
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
- It publishes only tiles changed in that push.
- It uses `--bump patch` so repeated publishes do not fail on existing versions.

Required repository secret:

- `TESSL_API_KEY`: Tessl API key for a service account/user with publish permission in workspace `recovery`.

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
