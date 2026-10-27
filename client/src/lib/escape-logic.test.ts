import { describe, expect, it } from "vitest";
import { demoFriends, placeById } from "./escape-data";
import {
  acceptFriendRequest,
  cancelPlan,
  createDefaultState,
  createPlan,
  effectivePresence,
  filterActivities,
  filterPlaces,
  formatRemaining,
  getAvailabilityView,
  getAvailableFriends,
  getFriendViews,
  getPlanBuckets,
  getPlanTiming,
  getNextPlan,
  normalizeState,
  recommendActivities,
  recommendPlaces,
  rejectFriendRequest,
  removeFriend,
  resolveSavedItems,
  respondToPlan,
  sendFriendRequest,
  setAvailability,
  setAvailabilityWindow,
  toggleSavedId,
  updatePlan,
  updateProfileFields,
  validatePlanDraft,
  validateProfile,
  withdrawFriendRequest,
  type EscapeState,
  type PlanDraft,
  type ProfileState,
} from "./escape-logic";

const NOW = new Date(2026, 9, 27, 12, 0, 0).getTime();

function dateOffset(days: number): string {
  const date = new Date(NOW);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function validDraft(overrides: Partial<PlanDraft> = {}): PlanDraft {
  return {
    itemId: "chai-catch-up",
    date: dateOffset(2),
    startTime: "11:00",
    durationMin: 30,
    budget: 50,
    notes: "Meet by the notice board.",
    friendIds: ["friend-aisha"],
    ...overrides,
  };
}

function withProfile(state: EscapeState, patch: Partial<ProfileState>): EscapeState {
  return { ...state, profile: { ...state.profile, ...patch } };
}

describe("place and activity discovery", () => {
  it("searches places by name, description, tags and mood", () => {
    expect(filterPlaces({ query: "chai" }).map((place) => place.id)).toContain("place-chai-stall");
    expect(filterPlaces({ query: "plug points" }).map((place) => place.id)).toContain("place-study-lounge");
    expect(filterPlaces({ query: "focus" }).some((place) => place.moods.includes("Focus"))).toBe(true);
    expect(filterPlaces({ query: "definitely-not-a-place" })).toEqual([]);
  });

  it("filters places by category, budget, duration and walking distance", () => {
    const cafes = filterPlaces({ category: "Café" });
    expect(cafes.map((place) => place.id)).toEqual(["place-cafe"]);

    const free = filterPlaces({ maxPrice: 0 });
    expect(free.every((place) => place.price === 0)).toBe(true);

    const shortAndClose = filterPlaces({ maxDuration: 15, maxWalk: 5 });
    expect(shortAndClose.every((place) => place.durationMin <= 15 && place.walkMin <= 5)).toBe(true);
    expect(shortAndClose.length).toBeGreaterThan(0);
  });

  it("sorts places by closest, cheapest and quickest", () => {
    const closest = filterPlaces({ sort: "closest" });
    for (let index = 1; index < closest.length; index += 1) {
      expect(closest[index].walkMin).toBeGreaterThanOrEqual(closest[index - 1].walkMin);
    }
    const cheapest = filterPlaces({ sort: "cheapest" });
    for (let index = 1; index < cheapest.length; index += 1) {
      expect(cheapest[index].price).toBeGreaterThanOrEqual(cheapest[index - 1].price);
    }
    const quickest = filterPlaces({ sort: "quickest" });
    for (let index = 1; index < quickest.length; index += 1) {
      expect(quickest[index].durationMin).toBeGreaterThanOrEqual(quickest[index - 1].durationMin);
    }
  });

  it("filters activities by company and category", () => {
    const solo = filterActivities({ company: "solo" });
    expect(solo.every((activity) => activity.social !== "friends")).toBe(true);
    const friends = filterActivities({ company: "friends" });
    expect(friends.every((activity) => activity.social !== "solo")).toBe(true);
    expect(filterActivities({ category: "Play" }).every((activity) => activity.category === "Play")).toBe(true);
    expect(filterActivities({ query: "quiet", maxWalk: 5 }).map((activity) => activity.id)).toContain("quiet-courtyard");
  });
});

describe("break recommendations", () => {
  it("respects mood, budget, available time and company", () => {
    const prefs = { mood: "Chill" as const, duration: 30 as const, budget: 50 as const, company: "either" as const };
    const results = recommendActivities(prefs, {}, ["Social", "Chill"]);
    expect(results.length).toBeGreaterThan(0);
    for (const { item } of results) {
      expect(item.moods).toContain("Chill");
      expect(item.price).toBeLessThanOrEqual(50);
      expect(item.durationMin).toBeLessThanOrEqual(30);
    }
    expect(results.every(({ reason }) => reason.includes("walk each way"))).toBe(true);
  });

  it("explains price, mood, travel time and profile interests", () => {
    const prefs = { mood: "Chill" as const, duration: 15 as const, budget: 50 as const, company: "either" as const };
    const chai = recommendActivities(prefs, { query: "chai" }, ["Social"]).find(({ item }) => item.id === "chai-catch-up");
    expect(chai).toBeTruthy();
    expect(chai!.reason).toContain("chill mood");
    expect(chai!.reason).toContain("₹30");
    expect(chai!.reason).toContain("3 min walk each way");
    expect(chai!.reason).toContain("social interests");
    expect(chai!.tightFit).toBe(true);
  });

  it("filters by search text and returns an honest empty result", () => {
    const prefs = { mood: "Chill" as const, duration: 60 as const, budget: 200 as const, company: "either" as const };
    expect(recommendActivities(prefs, { query: "garden" }).map(({ item }) => item.id)).toEqual(["garden-reset"]);
    expect(recommendActivities({ ...prefs, mood: "Play", duration: 10, budget: 0 })).toEqual([]);
  });

  it("does not recommend over-budget or over-time options", () => {
    const prefs = { mood: "Hungry" as const, duration: 10 as const, budget: 50 as const, company: "either" as const };
    const results = recommendActivities(prefs);
    expect(results.map(({ item }) => item.id)).toEqual(["canteen-snack"]);
  });

  it("suggests places that fit the budget", () => {
    const prefs = { mood: "Chill" as const, duration: 30 as const, budget: 0 as const, company: "either" as const };
    const results = recommendPlaces(prefs, 3);
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((place) => place.price === 0)).toBe(true);
  });
});

describe("saved items", () => {
  it("adds and removes an item without duplicates", () => {
    const first = toggleSavedId([], "chai-catch-up");
    expect(first).toEqual(["chai-catch-up"]);
    expect(toggleSavedId(first, "chai-catch-up")).toEqual([]);
    expect(toggleSavedId(["chai-catch-up"], "garden-reset")).toEqual(["chai-catch-up", "garden-reset"]);
  });

  it("ignores deleted or unknown saved records", () => {
    expect(resolveSavedItems(["chai-catch-up", "missing-item", "place-garden"]).map((item) => item.id)).toEqual([
      "chai-catch-up",
      "place-garden",
    ]);
    expect(placeById.get("place-garden")?.name).toBe("Garden courtyard");
  });
});

describe("availability and expiry", () => {
  it("shows shared availability with a countdown", () => {
    const state = createDefaultState(NOW);
    const view = getAvailabilityView(state.profile, NOW);
    expect(view.status).toBe("available");
    expect(view.shared).toBe(true);
    expect(view.expired).toBe(false);
    expect(view.remainingMs).toBe(60 * 60_000);
    expect(view.label).toBe("visible to friends");
  });

  it("expires availability instead of leaving it visible", () => {
    const state = withProfile(createDefaultState(NOW), { availabilityUntil: NOW - 1 });
    const view = getAvailabilityView(state.profile, NOW);
    expect(view.status).toBe("hidden");
    expect(view.expired).toBe(true);
    expect(view.shared).toBe(false);
    expect(view.remainingMs).toBeNull();
  });

  it("does not share availability when the visibility toggle is off", () => {
    const state = withProfile(createDefaultState(NOW), { shareAvailability: false });
    const view = getAvailabilityView(state.profile, NOW);
    expect(view.shared).toBe(false);
    expect(view.label).toBe("not sharing availability");
  });

  it("sets a configurable window and clears it when busy", () => {
    const start = createDefaultState(NOW);
    const available = setAvailabilityWindow(start, 30, NOW);
    expect(available.profile.availabilityWindowMin).toBe(30);
    expect(available.profile.availabilityUntil).toBe(NOW + 30 * 60_000);
    const busy = setAvailability(available, "busy", NOW);
    expect(busy.profile.availability).toBe("busy");
    expect(busy.profile.availabilityUntil).toBeNull();
    const headed = setAvailabilityWindow(busy, 60, NOW);
    expect(headed.profile.availabilityUntil).toBeNull();
    const noExpiry = setAvailabilityWindow(available, null, NOW);
    expect(noExpiry.profile.availabilityUntil).toBeNull();
  });

  it("expires simulated friend presence and formats remaining time", () => {
    const presence = { friendId: "friend-aisha", available: true, status: "free for chai", mood: "Social" as const, expiresAt: NOW - 1 };
    expect(effectivePresence(presence, NOW).available).toBe(false);
    expect(effectivePresence(presence, NOW).status).toBe("not sharing right now");
    expect(formatRemaining(30_000)).toBe("1 min left");
    expect(formatRemaining(3_600_000)).toBe("1 hr left");
    expect(formatRemaining(5_400_000)).toBe("1 hr 30 min left");
    expect(formatRemaining(null)).toBe("until you change it");
  });
});

describe("friends and requests", () => {
  it("only exposes shared availability to accepted friends", () => {
    const state = createDefaultState(NOW);
    const views = getFriendViews(state, NOW);
    const aisha = views.find((friend) => friend.id === "friend-aisha")!;
    const ian = views.find((friend) => friend.id === "friend-ian")!;
    expect(aisha.relationship).toBe("friends");
    expect(aisha.available).toBe(true);
    expect(ian.relationship).toBe("none");
    expect(ian.available).toBe(false);
    expect(ian.status).toBe("not connected yet");
    expect(getAvailableFriends(state, NOW).map((friend) => friend.id)).not.toContain("friend-ian");
    expect(demoFriends.find((friend) => friend.id === "friend-aisha")?.seedRelationship).toBe("friends");
  });

  it("sends, rejects and withdraws requests without duplicate transitions", () => {
    const start = createDefaultState(NOW);
    const sent = sendFriendRequest(start, "friend-ian", NOW);
    expect(sent.error).toBeNull();
    expect(sent.state.connections.find((connection) => connection.friendId === "friend-ian")?.status).toBe("outgoing");
    expect(sendFriendRequest(sent.state, "friend-ian", NOW).error).toContain("already waiting");

    const rejected = rejectFriendRequest(start, "friend-dev", NOW);
    expect(rejected.error).toBeNull();
    expect(rejected.state.connections.some((connection) => connection.friendId === "friend-dev")).toBe(false);
    expect(rejectFriendRequest(rejected.state, "friend-dev", NOW).error).toContain("no incoming");

    const withdrawn = withdrawFriendRequest(start, "friend-sana", NOW);
    expect(withdrawn.error).toBeNull();
    expect(withdrawn.state.connections.some((connection) => connection.friendId === "friend-sana")).toBe(false);
    expect(withdrawFriendRequest(withdrawn.state, "friend-sana", NOW).error).toContain("no sent request");
  });

  it("accepts an incoming request and makes shared availability visible", () => {
    const start = createDefaultState(NOW);
    const accepted = acceptFriendRequest(start, "friend-dev", NOW);
    expect(accepted.error).toBeNull();
    expect(accepted.state.connections.find((connection) => connection.friendId === "friend-dev")?.status).toBe("friends");
    expect(getAvailableFriends(accepted.state, NOW).map((friend) => friend.id)).toContain("friend-dev");
    expect(acceptFriendRequest(accepted.state, "friend-dev", NOW).error).toContain("no incoming");
    expect(sendFriendRequest(accepted.state, "friend-dev", NOW).error).toContain("already connected");
  });

  it("removes a friend and rejects removing a non-friend", () => {
    const start = createDefaultState(NOW);
    const removed = removeFriend(start, "friend-aisha", NOW);
    expect(removed.error).toBeNull();
    expect(getFriendViews(removed.state, NOW).find((friend) => friend.id === "friend-aisha")?.relationship).toBe("none");
    expect(removeFriend(start, "friend-ian", NOW).error).toContain("isn't in your friends list");
  });
});

describe("plan validation and life cycle", () => {
  it("validates required fields, dates, durations, budgets, notes and invitees", () => {
    const state = createDefaultState(NOW);
    expect(validatePlanDraft(validDraft(), state, NOW)).toEqual({});
    expect(validatePlanDraft(validDraft({ itemId: "missing" }), state, NOW).item).toBeTruthy();
    expect(validatePlanDraft(validDraft({ date: "not-a-date" }), state, NOW).date).toBeTruthy();
    expect(validatePlanDraft(validDraft({ date: dateOffset(-1) }), state, NOW).date).toBeTruthy();
    expect(validatePlanDraft(validDraft({ startTime: "25:99" }), state, NOW).startTime).toBeTruthy();
    expect(validatePlanDraft(validDraft({ durationMin: 4 }), state, NOW).duration).toBeTruthy();
    expect(validatePlanDraft(validDraft({ budget: -1 }), state, NOW).budget).toBeTruthy();
    expect(validatePlanDraft(validDraft({ notes: "x".repeat(281) }), state, NOW).notes).toBeTruthy();
    expect(validatePlanDraft(validDraft({ friendIds: ["friend-aisha", "friend-aisha"] }), state, NOW).invitees).toBeTruthy();
    expect(validatePlanDraft(validDraft({ friendIds: ["friend-ian"] }), state, NOW).invitees).toBeTruthy();
  });

  it("rejects overlapping plans", () => {
    const state = createDefaultState(NOW);
    const tomorrow = dateOffset(1);
    const errors = validatePlanDraft(validDraft({ date: tomorrow, startTime: "16:00", durationMin: 30 }), state, NOW);
    expect(errors.conflict).toContain("overlaps");
  });

  it("creates a valid plan with automatic demo invitee responses", () => {
    const state = createDefaultState(NOW);
    const result = createPlan(state, validDraft({ friendIds: ["friend-aisha", "friend-rohan"] }), NOW);
    expect(result.error).toBeNull();
    expect(result.plan).not.toBeNull();
    expect(result.plan!.ownerId).toBe("me");
    expect(result.plan!.myStatus).toBe("accepted");
    expect(result.plan!.invitees.map((invitee) => invitee.status)).toEqual(["accepted", "accepted"]);
    expect(result.state.plans.some((plan) => plan.id === result.plan!.id)).toBe(true);

    const duplicate = createPlan(result.state, validDraft({ friendIds: ["friend-aisha", "friend-rohan"] }), NOW + 500);
    expect(duplicate.plan).toBeNull();
    expect(duplicate.error).toContain("overlaps");
  });

  it("accepts and declines incoming invitations exactly once", () => {
    const state = createDefaultState(NOW);
    const invite = state.plans.find((plan) => plan.id === "seed-plan-aisha-chai")!;
    const accepted = respondToPlan(state, invite.id, "accepted", NOW);
    expect(accepted.error).toBeNull();
    expect(accepted.plan!.myStatus).toBe("accepted");
    expect(getPlanBuckets(accepted.state, NOW).upcoming.map((plan) => plan.id)).toContain(invite.id);
    expect(getNextPlan(accepted.state, NOW)?.id).toBe(invite.id);
    expect(respondToPlan(accepted.state, invite.id, "declined", NOW).error).toContain("already accepted");
    expect(respondToPlan(state, "seed-plan-evening-walk", "accepted", NOW).error).toContain("You created this plan");

    const pastInviteState: EscapeState = {
      ...state,
      plans: state.plans.map((plan) =>
        plan.id === "seed-plan-evening-walk" ? { ...plan, ownerId: "friend-aisha", myStatus: "pending" } : plan,
      ),
    };
    expect(respondToPlan(pastInviteState, "seed-plan-evening-walk", "accepted", NOW).error).toContain("already passed");

    const declined = respondToPlan(state, invite.id, "declined", NOW);
    expect(declined.error).toBeNull();
    expect(declined.plan!.myStatus).toBe("declined");
    expect(getPlanBuckets(declined.state, NOW).history.map((plan) => plan.id)).toContain(invite.id);
  });

  it("lets the creator edit and cancel only their own upcoming plans", () => {
    const state = createDefaultState(NOW);
    const created = createPlan(state, validDraft(), NOW);
    const planId = created.plan!.id;
    const edited = updatePlan(created.state, planId, validDraft({ notes: "Bring the good biscuits." }), NOW);
    expect(edited.error).toBeNull();
    expect(edited.plan!.notes).toBe("Bring the good biscuits.");
    expect(edited.plan!.invitees[0].status).toBe("accepted");

    const incomingId = "seed-plan-aisha-chai";
    expect(updatePlan(created.state, incomingId, validDraft(), NOW).error).toContain("Only the plan creator");
    expect(cancelPlan(created.state, incomingId, NOW).error).toContain("Only the plan creator");

    const cancelled = cancelPlan(edited.state, planId, NOW);
    expect(cancelled.error).toBeNull();
    expect(cancelled.plan!.cancelledAt).toBe(NOW);
    expect(getPlanTiming(cancelled.plan!, NOW).status).toBe("cancelled");
    expect(cancelPlan(cancelled.state, planId, NOW).error).toContain("already cancelled");
    expect(getPlanBuckets(cancelled.state, NOW).history.map((plan) => plan.id)).toContain(planId);
    expect(getPlanBuckets(cancelled.state, NOW).upcoming.map((plan) => plan.id)).not.toContain(planId);
  });

  it("classifies upcoming, invite, past and cancelled plans", () => {
    const state = createDefaultState(NOW);
    const buckets = getPlanBuckets(state, NOW);
    expect(buckets.invites.map((plan) => plan.id)).toEqual(["seed-plan-aisha-chai"]);
    expect(buckets.upcoming).toEqual([]);
    expect(buckets.history.map((plan) => plan.id)).toContain("seed-plan-evening-walk");
    expect(getNextPlan(state, NOW)).toBeNull();

    const created = createPlan(state, validDraft({ date: dateOffset(3), startTime: "13:00" }), NOW);
    expect(getPlanBuckets(created.state, NOW).upcoming).toHaveLength(1);
    expect(getNextPlan(created.state, NOW)?.id).toBe(created.plan!.id);
  });

  it("blocks past plans from being edited or cancelled", () => {
    const state = createDefaultState(NOW);
    const pastId = "seed-plan-evening-walk";
    expect(updatePlan(state, pastId, validDraft(), NOW).error).toContain("Past plans");
    expect(cancelPlan(state, pastId, NOW).error).toContain("Past plans");
  });
});

describe("profile validation", () => {
  it("accepts a complete profile", () => {
    expect(validateProfile(createDefaultState(NOW).profile)).toEqual({});
  });

  it("rejects invalid names, empty interests and invalid defaults", () => {
    const base = createDefaultState(NOW).profile;
    expect(validateProfile({ ...base, name: "A" }).name).toBeTruthy();
    expect(validateProfile({ ...base, name: "x".repeat(41) }).name).toBeTruthy();
    expect(validateProfile({ ...base, preferredMoods: [] }).preferredMoods).toBeTruthy();
    expect(validateProfile({ ...base, preferredMoods: ["Chill", "Chill"] }).preferredMoods).toBeTruthy();
    expect(validateProfile({ ...base, defaultDuration: 12 as never }).defaultDuration).toBeTruthy();
    expect(validateProfile({ ...base, defaultBudget: 75 as never }).defaultBudget).toBeTruthy();
  });

  it("applies valid profile changes and leaves state untouched on errors", () => {
    const state = createDefaultState(NOW);
    const ok = updateProfileFields(state, { name: "  Maya Sharma  " }, NOW);
    expect(ok.error).toBeNull();
    expect(ok.state.profile.name).toBe("Maya Sharma");
    const bad = updateProfileFields(state, { name: "A" }, NOW);
    expect(bad.error).toBeTruthy();
    expect(bad.state.profile.name).toBe(state.profile.name);
  });
});

describe("storage normalisation", () => {
  it("repairs unknown saved ids and malformed plans", () => {
    const state = createDefaultState(NOW);
    const normalized = normalizeState(
      {
        ...state,
        savedIds: ["chai-catch-up", "missing"],
        plans: [
          state.plans[0],
          { id: "broken" },
          { ...state.plans[1], durationMin: 999 },
        ],
      },
      NOW,
    );
    expect(normalized.savedIds).toEqual(["chai-catch-up"]);
    expect(normalized.plans.some((plan) => plan.id === "broken")).toBe(false);
    expect(normalized.plans.some((plan) => plan.id === state.plans[1].id)).toBe(false);
  });
});
