# Mobile Insurance Filter Picker for Browse Pages

## Problem/Feature Description

Right now on mobile, the insurance filter is only accessible via the scrollable filter chip bar at the top of the browse feed. Users have to scroll horizontally to find it, tap it, and navigate a full filter panel just to toggle their insurance on/off. It's friction-heavy for one of the most important filters we have.

We want to test a more prominent, always-visible insurance widget on mobile that sits directly in the feed — below the filter bar. The idea is a card that shows the user's currently selected insurance and a toggle switch they can flip on and off without opening the full filter modal. If they haven't selected an insurance yet, tapping the card opens the insurance selector.

This should be behind a feature flag so we can roll it out gradually and measure impact. The flag should use the user's existing Segment identity for targeting. When a user is in the flag group, the old insurance chip in the filter bar should be hidden on mobile to avoid showing it twice.

## Expected Behavior

- On mobile viewports, users enrolled in the flag see an insurance picker card appearing below the filter bar on location and taxonomy browse pages
- The card shows a toggle switch: off state prompts the user to select an insurance, on state shows the selected insurance name and lets them disable it
- Toggling the switch off removes the insurance filter from the results, but the selection is remembered — re-toggling it on restores the previous insurance without requiring the user to re-select
- Tapping the card when no insurance is selected opens the existing insurance filter selector in the filter bar
- The existing insurance chip in the filter bar is hidden on mobile when the new picker is active (to avoid duplication)
- Analytics events fire for: viewing the picker, opening it, toggling it, and applying an insurance selection

## Acceptance Criteria

- The feature is controlled by a Vercel feature flag; users without the flag see no change
- Pages that use static/ISR rendering remain static — the flag must not be evaluated during server rendering in a way that opts pages into dynamic rendering
- The last-selected insurance persists across toggle cycles within a session
- Flag exposure is tracked so we can measure A/B results in analytics
