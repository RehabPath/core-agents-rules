# shared-sample (bake-off only)

Same 5 rules + 1 skill packaged twice, to compare APM and Tessl on core-next.

| Rule | Cursor mode in core-next today |
|---|---|
| immutability-objects | always |
| logging-guidelines | always |
| unit-test | glob `**/*.test.ts,**/*.test.tsx` |
| dependency-placement | glob `package.json` |
| code-review | on demand (description only) |

Skill: `create-github-pr`.

- APM format (in `apm/`): `apm.yml` + `.apm/instructions/*.instructions.md` + `.apm/skills/`
- Tessl format (in `tessl/`): `.tessl-plugin/plugin.json` + `rules/*.md` + `skills/`

Not for merge. Delete after the bake-off.
