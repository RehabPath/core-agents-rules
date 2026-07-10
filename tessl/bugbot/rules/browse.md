# Browse Page — Bugbot Rules

These rules apply when PR changes include files inside `src/components/organisms/Browse/`.

## Filter Panels: Taxonomy vs External-Search Filters

Flag changes to `shouldShowFilterSearchInput` or `FilterPanelProps` that remove or bypass the `alwaysShowSearch` option.

There are two kinds of filter panels in the Browse page, and they have fundamentally different item population strategies:

- **Taxonomy filters** (condition, care, insurance): Items come from a fixed facet list. Hiding the search input when there is only one item is correct — there is nothing to search for.
- **External-search filters** (Change Location): Items start as just the current location. New items appear only when the user types a query and Google autocomplete returns results. The search input must always be visible, otherwise the user cannot discover or change to other locations.

Any filter whose items are populated by an external search API (not a static facet list) must set `alwaysShowSearch: true` in its shared filter props. Removing this flag will hide the search input on pages where the initial item list has a single entry, silently breaking the filter.

```ts
// ChangeLocationDropdown — alwaysShowSearch is required
const sharedFilterProps = {
  searchable: true,
  alwaysShowSearch: true, // Do not remove — location items come from Google autocomplete
  // ...
};
```
