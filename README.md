# ESCAPE — a campus break companion

ESCAPE is a React + TypeScript app for finding a small break between classes: discover a spot or activity, save it, see which friends are around, and turn it into a plan.

This build runs on the repository's existing Vite + Express shell, but all product data (profile, saved places, friends/requests, availability, and plans) is stored **locally in the browser**. No account, database, or external service is required for the working app.

## What works

### Discover / dashboard
- A dashboard with available break time, budget, friends currently sharing availability, the next plan, and pending invitations.
- Mood, time, budget, and company preferences with live recommendations.
- Search activities by name, description, tags, or mood; filter by category and walking distance; sort by best fit, shortest, or cheapest.
- Every recommendation shows a brief, data-backed reason including price, mood, travel/walk time, and a "tight fit with the walk" warning.
- Suggested campus spots for the current mood and budget.
- Empty states suggest loosening filters rather than showing unsuitable results.

### Break Finder
- Nine illustrative campus places across food, café, green space, study, quiet, social, and recreation categories (including the original six).
- Search spots, filter by category, price, available time, and walking distance, and sort by best fit, closest, cheapest, or quickest.
- Detail sheet with description, illustrative address, price/duration/walk estimates, moods, save, and plan actions.
- Missing opening hours and maps are shown as not available rather than invented.
- The "Your People" tab has availability controls, available friends, incoming/outgoing requests, a searchable demo directory, and friend discovery.

### Friends and availability
- Friend requests support send, accept, reject, withdraw, and remove.
- Availability supports Available / Busy / Hidden, a sharing toggle, and configurable expiry windows (30 min, 1 hr, 2 hrs, or until changed).
- Availability expires automatically; expired friends and profile availability disappear from "available now".
- Only accepted friends' availability is shown. Non-friends see only the labelled public demo profile interests.
- Actions that would mutate another person's availability do not exist.

### Plans and invitations
- Create a plan from any activity or spot with date, start time, duration, budget, notes, and accepted friends.
- Plans validate required fields, date/time validity, future start times, duration/budget ranges, note length, duplicate invitees, accepted-friend eligibility, and overlapping plans.
- Invitee responses are tracked as pending / accepted / declined.
- The current user can accept or decline a seeded incoming invitation; demo classmates automatically accept or decline plans created here based on their simulated availability (clearly labelled in the UI).
- Plan creators can edit or cancel upcoming plans; cancelled and past plans live in the history tab.
- Upcoming plans appear in the dashboard, the invitation banner opens the pending invites directly, and all views read from one shared state.

### Saved
- Save/unsave activities and places from cards or the detail sheet.
- Saved items persist across refresh and navigation in `localStorage`.
- The Saved page has a useful empty state and a link back to Discover.
- Unknown/deleted saved IDs are filtered out on load.

### Profile
- Editable display name with inline validation; avatar initials and colour; preferred moods/interests; default break length, budget, and company; profile visibility; availability sharing.
- Changes persist and immediately affect PlanSheet defaults, recommendation ordering, dashboard previews, and profile stats.
- Name and interests are validated; at least one interest must remain.

### Navigation and reliability
- Four primary routes: `/`, `/find`, `/saved`, `/profile`. Direct navigation and refresh work through the existing Express/Vite fallback.
- Unknown routes render an in-app 404 with a working way back.
- Browser back/forward keeps the route in sync.
- State is versioned (`escape-state-v2`), migrated from the previous demo key, synced across tabs, and repaired when partially corrupt.
- Storage failures (quota/private browsing) produce a visible message instead of a silent data loss.
- Rapid actions are applied through a synchronous state ref so two quick updates do not overwrite each other.

## Prototype limits (important)

- **No authentication or server-side multi-user persistence is active.** This checkout contains the template's Manus OAuth + MySQL scaffolding, but no `DATABASE_URL` or Manus credentials are configured, and the template router has no feature endpoints. The app therefore uses a clearly separated local data layer instead of inventing a fake production backend.
- **Demo classmates are fictional seed data, not registered accounts.** The directory, requests, availability, and auto-responses are labelled as demo behaviour. They demonstrate and test the complete state machine locally; they do not contact real people.
- **Notification, messaging, live location, live opening hours, live ratings, and live venue availability are not implemented or faked.**
- Invitations created in this local build are answered automatically by the seeded classmates so the invited/accepted/declined states can be exercised. The current user can accept or decline an incoming seeded invitation, which exercises the real invitee transition.
- Saved items are associated with the single local profile. Per-account association requires the real auth/database work described below.

## Run on Windows

Prerequisites: Node.js 20+ and npm, opened in the project root.

### 1. Install

```powershell
npm install
```

### 2. Run the app (frontend + Express/Vite shell)

```powershell
$env:PORT=3000
npm run dev
```

Open **http://localhost:3000/**. The core app does not need a database, OAuth keys, or external services.

> If PowerShell already has an empty/invalid `PORT`, setting it explicitly as above avoids the server rejecting it. `npm run dev` also works without the line when `PORT` is unset/valid.

### 3. Optional: static frontend only

Useful if you only need the UI. API routes and future auth are not available in this mode.

```powershell
npx vite --host 0.0.0.0 --port 3000 --strictPort
```

Open **http://localhost:3000/**.

### 4. Checks, tests, and production build

```powershell
npm run check
npm test
npm run build
```

Run the built app:

```powershell
$env:PORT=3000
npm start
```

`npm start` serves `dist/public` from the compiled Express server. Run `npm run build` first.

### Environment variables

The current local-first app needs **no environment variables**. Only `PORT` is read by the server.

The existing (unused for product features) server scaffolding reads these for platform/OAuth/database work:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | MySQL connection for Drizzle |
| `MANUS_PROJECT_ID` | OAuth application id |
| `MANUS_JWT_SECRET` | session signing secret |
| `MANUS_OAUTH_API_URL` | OAuth server base URL |
| `MANUS_API_URL` / `MANUS_API_KEY` | optional Manus platform services |

`npm run db:push` requires `DATABASE_URL`; it applies the existing schema, which only contains the `users` table. No feature migrations were added because the local data layer does not use MySQL.

## Data storage and multi-user path

- Storage key: `escape-state-v2` (legacy key `escape-demo-state-v1` is migrated automatically).
- Resetting the demo: clear this site's browser storage in DevTools → Application → Local Storage, or clear site data.
- The pure domain logic lives in `client/src/lib/escape-logic.ts`; persistence/migration lives in `client/src/lib/escape-storage.ts`; React wiring lives in `client/src/lib/escape-state.tsx`.
- To make this genuinely multi-user:
  1. Configure the existing Manus OAuth flow (`MANUS_*` variables) and MySQL (`DATABASE_URL`).
  2. Add Drizzle tables for profiles/preferences, saved places, friendships/requests, availability (including expiry), plans, and plan invitees.
  3. Add `protectedProcedure` tRPC routers that derive the user from `ctx.user` and enforce ownership/membership on every read and mutation.
  4. Replace the local-directory adapter with authenticated user search and real invitee responses; keep the current UI contract.
  5. Add server-side validation and authorization tests before switching the client from the local layer.

Until then, the local layer is the deliberate, testable stand-in and the UI says so.

## Tests

The Vitest suite covers:

- place/activity search, category/price/duration/walk/company filtering, sorting, and empty results;
- recommendation eligibility, budget/time/mood constraints, travel-time explanations, and profile-interest reasons;
- saved add/remove and missing-item filtering;
- profile validation and safe updates;
- availability sharing, configurable expiry, expiry-derived visibility, and friend-presence expiry;
- friend request send/accept/reject/withdraw/remove transitions and duplicate guards;
- plan validation (dates, times, duration, budget, notes, invitees, conflicts), creation, editing, cancellation, accept/decline, overlap prevention, duplicate prevention, and status buckets;
- storage round-trip, legacy migration, corrupt-data recovery, unavailable storage, save failure, and state normalisation.

Run:

```powershell
npm test
```
