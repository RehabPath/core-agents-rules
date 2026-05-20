
# Team Conventions

## CSS Color Variables in `src/global.css`

When adding new color tokens, follow this two-step pattern:

1. **Define in `:root`** (and `.dark` if needed) using `theme()`:

```css
--muted-foreground-light: theme('colors.gray.700');
```

2. **Expose to Tailwind** via `@theme inline` with `--color-` prefix:

```css
--color-muted-foreground-light: var(--muted-foreground-light);
```

Do **not** extend `tailwind.config.*` for color variables—the `global.css` pattern is sufficient.

## Linting & Formatting

- Fix lint/Prettier errors only in files related to the task—no drive-by fixes.
- Before finishing, ensure no ESLint or Prettier errors in changed code.

## Tailwind Usage

- Prefer the closest utility class over arbitrary values.
- Avoid `mt-[13px]`-style values unless explicitly requested or no utility exists.

## Components & Styling

- Use existing shared components (design system / UI library) whenever possible.
- Do not use inline styles unless explicitly requested.

## Consistency with Existing Patterns

- Check how patterns are implemented elsewhere before introducing new ones.
- If uncertain, ask before inventing a new pattern.

## Figma Handoff (MCP)

When a Figma link is provided:

1. Use the Figma MCP server to extract implementation details.
2. Map styles, variables, spacing, and layout to existing codebase/component equivalents before introducing anything new.
