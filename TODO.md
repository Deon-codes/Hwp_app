# ESCAPE delivery outcomes

## Discover combines the hero, mood selection, preferences, and recommendations
- The main entry view is Discover and includes the ESCAPE wordmark, desktop navigation, avatar/profile shortcut, compact editorial hero, headline `your break deserves better.`, supporting copy, CTA `find my escape ↗`, and caption `good things happen between lectures.`
- The view provides six keyboard-accessible selectable mood cards: Chill — `brain needs a breather`; Hungry — `something yummy, please`; Social — `people time!`; Explore — `let's wander`; Play — `a little friendly chaos`; Focus — `quiet corner, please`.
- The view provides selectable time options 10, 15, 30, 45, 60 minutes; budget options Free, Under ₹50, Under ₹100, Under ₹200; and company options Solo, With friends, Either, with visible defaults and state that persists while navigating.
- `show me the good stuff →` updates recommendations within Discover without redirecting to another primary page.

## Structured deterministic recommendation filtering works
- At least eight typed activities include unique ID, name, description, category, suitable moods, indicative price, estimated duration, walking time, social suitability, visual treatment, and tags.
- Recommendations include Chai and catch-up, Campus garden walk, Canteen snack, Table tennis, Quiet courtyard, Library recharge corner, Group snack stop, and Campus photography walk (or equivalent structured entries).
- Results respect selected mood, maximum budget, time available, and company preference using actual data; changing preferences updates the results and result count.
- Recommendation cards show visual, name, cost, duration, walking estimate, mood tags, a concise match reason, bookmark action, details action, and a meaningful empty state when no items match. Demo estimates are labeled as illustrative.
- A useful sort/filter affordance and an easy way to change preferences are present.

## Break Finder covers spots, people, invitations, and planning contextually
- Break Finder is one of the four main destinations and has clear tabs `Spots | Your People` with a persistent selected state.
- Spots includes the six campus location types from the request and exposes name, category, price, walking time, suggested duration, moods, visual, bookmark, details, and `Let's go!`/`Plan this break` actions, plus useful filters.
- Spots do not claim live GPS, occupancy, open status, or actual distances; campus geography and estimates are clearly illustrative.
- Your People includes six fictional students with names, avatars/initials, friendly statuses, optional mood/activity preferences, and voluntary availability states.
- Current-user availability supports Available for a break, Busy, and Hidden; the state persists and is readable without color. The UI explains voluntary visibility, no precise live location, and no private information.
- Invite to break records a local demo invitation and shows clear feedback such as `invite sent! now we wait for the chai committee.` without pretending to send real messages or notifications.
- Place details are contextual and include image, description, cost, duration, walking estimate, suitable moods, available demo friends, save, and `Let's go!` actions.
- Break planning allows selected place, duration, budget, and optional friends, then shows a confirmation summary with the selected information or `Your break is planned` when no specific time was selected.

## Saved is shared and persistent
- Saved is a dedicated primary destination with headline `your little collection.` and shared bookmark cards showing visual, price, duration, category/mood tags, details, and remove actions.
- Saved state is consistent with Discover and Break Finder and survives refresh where practical through local persistence.
- Empty state reads `nothing saved yet. let's find your next little escape.` and includes a primary action returning to Discover.

## Profile updates shared preferences and availability
- Profile is a lightweight demo-data page with editable display name, avatar, preferred moods, default duration, default budget, preferred company, availability visibility, and clear availability controls.
- Profile changes are reflected across the rest of the app; no sign-up/authentication is required.

## Responsive, accessible, expressive application shell
- Desktop uses a max-width approximately 1200px editorial layout with horizontal top navigation, spacious composition, responsive mood grids and activity grids.
- Mobile uses a safe-area-aware fixed bottom navigation with exactly Discover, Find, Saved, Profile; primary content is single-column, mood cards use two columns where possible, controls stack or scroll, and no horizontal overflow occurs.
- Neo-brutalist language is consistent: warm paper canvas, bold ink outlines, pastel accents, hard offset shadows, tactile buttons, expressive typography, cohesive illustrations, and restrained 150–300ms motion.
- Keyboard navigation, visible focus, readable contrast, descriptive labels, selected/disabled states, reduced-motion support, and touch-friendly targets are implemented.
- `manus-routes.json` declares the four supported destinations and is served as static JSON.

## Runnable build evidence
- The static dev server listens on the configured port, the TypeScript check/build succeeds, and the final app has been inspected at desktop, tablet, and mobile widths.
- Visible interactive controls are wired to state; no dead navigation, fake filtering, placeholder links, or color-only interactions remain.
- The complete journey works: Social + 15 minutes + Under ₹50 + With friends → filtered recommendations → chai details → save → plan → Break Finder people → invite → Saved → availability change → consistent Discover state.
