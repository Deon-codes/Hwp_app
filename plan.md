# ESCAPE implementation plan

## Scope

Build the requested ESCAPE campus break discovery app as a static, client-side React/TypeScript experience with exactly four primary views: Discover, Break Finder, Saved, and Profile. Keep the demonstration self-contained with structured local data and browser persistence; do not add authentication, paid APIs, a database, live messaging, GPS, or real-time availability.

## Implementation approach

- Use one shared `EscapeState` provider in the frontend to own navigation, discovery preferences, bookmarks, profile preferences, current availability, invitations, and break plans.
- Persist bookmarks and user-editable preferences in `localStorage` with guarded JSON parsing and sensible demo defaults.
- Keep the application on a single shell route with in-app navigation so details, invitations, and plan creation remain contextual sheets instead of extra top-level destinations.
- Store all activities and campus places as typed demo records. Derive recommendations deterministically by mood, maximum budget, duration, social preference, then sort by fit score and expose a useful sort control.
- Use `lucide-react` for consistent iconography and small inline SVG/CSS illustrations for the hero, mood tiles, activity/place art, and avatars; avoid external asset dependencies and random emoji as primary UI.
- Use CSS design tokens in `index.css` for the warm paper canvas, pastel palette, ink outlines, hard shadows, responsive grid, tactile button states, page transitions, and reduced-motion behavior.
- Use `manus-routes.json` with the four supported app destinations (`/`, `/find`, `/saved`, `/profile`) and keep the browser URL synchronized with the selected primary view through lightweight `history.pushState` handling.

## Design direction

### Alternate style tails

- 0.06 — editorial campus zine with hand-cut paper geometry.
- 0.04 — soft sticker-book wellness planner.
- 0.08 — cheerful neo-brutalist indie lifestyle app.

### Chosen style: cheerful neo-brutalist indie lifestyle app

- **Design Movement:** Friendly neo-brutalism softened by editorial campus-zine composition.
- **Core Principles:** bold ink structure, pastel emotional signals, fast tactile interactions, generous readable rhythm.
- **Color Philosophy:** warm paper makes the app feel approachable; one dominant pastel accent communicates the current section or mood while ink-black structure keeps the playful palette legible.
- **Layout Paradigm:** art-directed split compositions and offset blocks rather than centered SaaS panels; content flows from an editorial hero into card grids and contextual sheets.
- **Signature Elements:** pill-shaped mood chips, hard-offset ink shadows, and small “paper sticker” badges/doodles around the hero and section headers.
- **Interaction Philosophy:** every choice should feel like picking a sticker or pressing a physical button; selected states are visibly structural, not color-only.
- **Animation:** 180–260ms lift/press transitions, gentle card stagger, short page fade/slide, and brief bookmark success motion; all disabled for reduced-motion.
- **Typography System:** Space Grotesk for expressive headings and wordmark, DM Sans for controls/body; responsive clamp sizing with readable line-height and sentence-case copy.
- **Brand Essence:** a tiny campus break companion for students who want a better moment between commitments; warm, curious, unhurried.
- **Brand Voice:** lowercase-led, specific, friendly microcopy. Examples: “okay, what’s the vibe?” and “good things happen between lectures.”
- **Wordmark & Logo:** custom-feeling ESCAPE wordmark with a small offset sun/arrow mark, rendered as bold text plus an ink-outlined sticker mark rather than a generic logo image.
- **Signature Brand Color:** butter yellow `#FFE66D`, used for primary actions and the sun mark.

## Project structure

- `client/src/App.tsx`: app shell, route/view synchronization, shared provider, contextual sheet orchestration.
- `client/src/lib/escape-data.ts`: typed structured demo moods, activities, places, and friends.
- `client/src/lib/escape-state.tsx`: shared state, derived filtering, local persistence, and action APIs.
- `client/src/pages/Home.tsx`: Discover view and recommendation interaction.
- `client/src/pages/Find.tsx`: Break Finder tabs, spots/people, invite and plan entry points.
- `client/src/pages/Saved.tsx`: shared bookmark collection and empty state.
- `client/src/pages/Profile.tsx`: editable demo profile/preferences and availability controls.
- `client/src/components/escape/`: reusable header, bottom navigation, illustrations, cards, sheets, controls, and toast-style feedback.
- `client/src/index.css`: design tokens, responsive layout, neo-brutalist components, animations, accessibility, reduced motion.
- `public/manus-routes.json`: declared top-level app destinations.
- `app.config.ts`: project logo metadata literal.

## Delivery workflow

Implement in the existing starter, run TypeScript diagnostics and the static build, start the configured port 3000 dev service, verify the route manifest and rendered app, inspect desktop/mobile screenshots, then fix confirmed issues before committing the complete change to the canonical project branch.
