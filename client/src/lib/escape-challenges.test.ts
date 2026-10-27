import { describe, expect, it } from "vitest";
import { placeById, demoFriends } from "./escape-data";
import {
  badgesCatalog,
  challengesList,
  challengeById,
  badgeById,
} from "./escape-challenges-data";
import {
  cancelDetoxTimer,
  checkCuriousWanderer,
  claimDetoxTimer,
  createDefaultChallengesState,
  createDefaultState,
  getChallengeProgress,
  getChallengesSummary,
  normalizeChallenges,
  normalizeState,
  recordChaiSession,
  recordGreenEscape,
  recordPlaceDiscovery,
  recordStudySession,
  startDetoxTimer,
  type EscapeState,
} from "./escape-logic";
import {
  loadEscapeState,
  saveEscapeState,
  type StorageLike,
} from "./escape-storage";

const NOW = new Date(2026, 9, 27, 12, 0, 0).getTime();

class MemoryStorage implements StorageLike {
  values = new Map<string, string>();
  getItem(key: string) {
    return this.values.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
  removeItem(key: string) {
    this.values.delete(key);
  }
}

describe("ESCAPE Challenges: State and Normalization", () => {
  it("initializes challenges state with default values", () => {
    const defaultChallenges = createDefaultChallengesState(NOW);
    expect(defaultChallenges.points).toBe(0);
    expect(defaultChallenges.discoveredPlaceIds).toEqual([]);
    expect(defaultChallenges.completedChallengeIds).toEqual([]);
    expect(defaultChallenges.earnedBadgeIds).toEqual([]);
    expect(defaultChallenges.activeDetoxTimer).toBeNull();
    expect(defaultChallenges.completedStudySessions).toEqual([]);
    expect(defaultChallenges.completedGreenEscapes).toEqual([]);
  });

  it("handles null, undefined and malformed stored challenge data safely", () => {
    const normalizedNull = normalizeChallenges(null, NOW);
    expect(normalizedNull.points).toBe(0);
    expect(normalizedNull.discoveredPlaceIds).toEqual([]);

    const malformed = {
      points: "not-a-number",
      discoveredPlaceIds: ["invalid-spot", 123, null, "place-canteen"],
      completedChallengeIds: ["non-existent-challenge", "campus-explorer"],
      activeDetoxTimer: { startedAt: -100, durationSeconds: "invalid" },
      completedStudySessions: [null, { id: 123 }, { id: "valid-1", friendId: "friend-aisha", completedAt: NOW }],
    };

    const normalized = normalizeChallenges(malformed, NOW);
    expect(normalized.points).toBe(0);
    expect(normalized.discoveredPlaceIds).toEqual(["place-canteen"]);
    expect(normalized.completedChallengeIds).toEqual(["campus-explorer"]);
    expect(normalized.activeDetoxTimer).toBeNull();
    expect(normalized.completedStudySessions.length).toBe(1);
    expect(normalized.completedStudySessions[0]?.id).toBe("valid-1");
  });
});

describe("ESCAPE Challenges: Campus Explorer & Unique-Place Counting", () => {
  it("tracks unique places discovered and ignores invalid places", () => {
    const state = createDefaultState(NOW);
    const resultInvalid = recordPlaceDiscovery(state, "fake-place-999", NOW);
    expect(resultInvalid.isNewDiscovery).toBe(false);
    expect(resultInvalid.state.challenges.discoveredPlaceIds).toEqual([]);

    const result1 = recordPlaceDiscovery(state, "place-canteen", NOW);
    expect(result1.isNewDiscovery).toBe(true);
    expect(result1.state.challenges.discoveredPlaceIds).toEqual(["place-canteen"]);
  });

  it("counts only unique places, never repeated views of the same place", () => {
    const state = createDefaultState(NOW);
    const step1 = recordPlaceDiscovery(state, "place-canteen", NOW);
    expect(step1.isNewDiscovery).toBe(true);
    expect(step1.state.challenges.discoveredPlaceIds.length).toBe(1);

    // View canteen again
    const step2 = recordPlaceDiscovery(step1.state, "place-canteen", NOW + 1000);
    expect(step2.isNewDiscovery).toBe(false);
    expect(step2.state.challenges.discoveredPlaceIds.length).toBe(1);
    expect(step2.awarded).toBe(false);
  });

  it("completes Campus Explorer only when 3 distinct places are discovered", () => {
    let state = createDefaultState(NOW);

    // 1st place
    const step1 = recordPlaceDiscovery(state, "place-canteen", NOW);
    expect(step1.challengeCompleted).toBeUndefined();
    expect(step1.state.challenges.points).toBe(0);

    // 2nd place
    const step2 = recordPlaceDiscovery(step1.state, "place-garden", NOW + 1000);
    expect(step2.challengeCompleted).toBeUndefined();
    expect(step2.state.challenges.points).toBe(0);

    // 3rd distinct place completes challenge and awards badge & points
    const step3 = recordPlaceDiscovery(step2.state, "place-chai-stall", NOW + 2000);
    expect(step3.awarded).toBe(true);
    expect(step3.challengeCompleted).toBe("campus-explorer");
    expect(step3.badgeEarned).toBe("badge-explorer-scout");
    expect(step3.pointsEarned).toBe(150);
    expect(step3.state.challenges.points).toBe(150);
    expect(step3.state.challenges.completedChallengeIds).toContain("campus-explorer");
    expect(step3.state.challenges.earnedBadgeIds).toContain("badge-explorer-scout");

    // 4th distinct place adds to discovered places but does not re-award
    const step4 = recordPlaceDiscovery(step3.state, "place-sports", NOW + 3000);
    expect(step4.isNewDiscovery).toBe(true);
    expect(step4.awarded).toBe(false);
    expect(step4.state.challenges.points).toBe(150);
  });
});

describe("ESCAPE Challenges: Digital Detox Timer", () => {
  it("starts a 15-minute timer and preserves startedAt", () => {
    const state = createDefaultState(NOW);
    const start = startDetoxTimer(state, 15 * 60, NOW);
    expect(start.error).toBeNull();
    expect(start.state.challenges.activeDetoxTimer).toEqual({
      startedAt: NOW,
      durationSeconds: 900,
    });
  });

  it("prevents restarting timer while an active timer is running", () => {
    const state = createDefaultState(NOW);
    const start1 = startDetoxTimer(state, 15 * 60, NOW);
    const start2 = startDetoxTimer(start1.state, 15 * 60, NOW + 60_000);
    expect(start2.error).not.toBeNull();
    expect(start2.error).toContain("already counting down");
  });

  it("rejects completion before 15 minutes have elapsed", () => {
    const state = createDefaultState(NOW);
    const started = startDetoxTimer(state, 15 * 60, NOW);

    // Try claiming after only 5 minutes (300 seconds)
    const earlyClaim = claimDetoxTimer(started.state, NOW + 5 * 60_000);
    expect(earlyClaim.error).not.toBeNull();
    expect(earlyClaim.error).toContain("remaining");
    expect(earlyClaim.pointsEarned).toBeUndefined();
  });

  it("awards completion only after full timer has finished", () => {
    const state = createDefaultState(NOW);
    const started = startDetoxTimer(state, 15 * 60, NOW);

    // Exact 15 minutes elapsed
    const completionTime = NOW + 15 * 60_000;
    const claim = claimDetoxTimer(started.state, completionTime);
    expect(claim.error).toBeNull();
    expect(claim.pointsEarned).toBe(100);
    expect(claim.badgeEarned).toBe("badge-zen-master");
    expect(claim.state.challenges.points).toBe(100);
    expect(claim.state.challenges.completedChallengeIds).toContain("digital-detox");
    expect(claim.state.challenges.earnedBadgeIds).toContain("badge-zen-master");
    expect(claim.state.challenges.activeDetoxTimer).toBeNull();
    expect(claim.state.challenges.completedDetoxSessions.length).toBe(1);
  });

  it("prevents rapid duplicate rewards on multiple quick claim clicks", () => {
    const state = createDefaultState(NOW);
    const started = startDetoxTimer(state, 15 * 60, NOW);
    const claim1 = claimDetoxTimer(started.state, NOW + 15 * 60_000);
    expect(claim1.error).toBeNull();

    // Trying to claim again 500ms later
    const claim2 = claimDetoxTimer(claim1.state, NOW + 15 * 60_000 + 500);
    expect(claim2.error).not.toBeNull();
    expect(claim2.error).toContain("No active detox timer");
  });

  it("cancelling detox timer resets it without awarding points", () => {
    const state = createDefaultState(NOW);
    const started = startDetoxTimer(state, 15 * 60, NOW);
    const cancelled = cancelDetoxTimer(started.state, NOW + 60_000);
    expect(cancelled.challenges.activeDetoxTimer).toBeNull();
    expect(cancelled.challenges.points).toBe(0);
  });
});

describe("ESCAPE Challenges: Study Buddy", () => {
  it("records a study session with an accepted demo friend and awards points and badge", () => {
    const state = createDefaultState(NOW);
    const result = recordStudySession(state, { friendId: "friend-aisha", note: "Studied economics" }, NOW);
    expect(result.error).toBeNull();
    expect(result.pointsEarned).toBe(120);
    expect(result.badgeEarned).toBe("badge-study-squad");
    expect(result.state.challenges.points).toBe(120);
    expect(result.state.challenges.completedChallengeIds).toContain("study-buddy");
    expect(result.state.challenges.earnedBadgeIds).toContain("badge-study-squad");
    expect(result.state.challenges.completedStudySessions.length).toBe(1);
  });

  it("prevents accidental duplicate rewards for the same study plan", () => {
    const state = createDefaultState(NOW);
    const first = recordStudySession(state, { planId: "plan-library-1" }, NOW);
    expect(first.error).toBeNull();

    const second = recordStudySession(first.state, { planId: "plan-library-1" }, NOW + 3000);
    expect(second.error).not.toBeNull();
    expect(second.error).toContain("already been recorded");
  });

  it("rejects non-existent friend IDs", () => {
    const state = createDefaultState(NOW);
    const result = recordStudySession(state, { friendId: "not-a-friend" }, NOW);
    expect(result.error).not.toBeNull();
    expect(result.error).toContain("Classmate not found");
  });
});

describe("ESCAPE Challenges: Green Escape", () => {
  it("rejects non-green space items", () => {
    const state = createDefaultState(NOW);
    const result = recordGreenEscape(state, "place-cafe", NOW);
    expect(result.error).not.toBeNull();
    expect(result.error).toContain("doesn't qualify");
  });

  it("records a qualifying green space visit and awards points and badge", () => {
    const state = createDefaultState(NOW);
    const result = recordGreenEscape(state, "place-garden", NOW);
    expect(result.error).toBeNull();
    expect(result.pointsEarned).toBe(80);
    expect(result.badgeEarned).toBe("badge-green-thumb");
    expect(result.state.challenges.points).toBe(80);
    expect(result.state.challenges.completedChallengeIds).toContain("green-escape");
    expect(result.state.challenges.earnedBadgeIds).toContain("badge-green-thumb");
  });

  it("prevents rapid duplicate rewards on the same green space", () => {
    const state = createDefaultState(NOW);
    const first = recordGreenEscape(state, "place-garden", NOW);
    expect(first.error).toBeNull();

    const second = recordGreenEscape(first.state, "place-garden", NOW + 500);
    expect(second.error).not.toBeNull();
  });
});

describe("ESCAPE Challenges: Curious Wanderer & Chai Committee", () => {
  it("awards Curious Wanderer when 3 items are saved", () => {
    const state: EscapeState = {
      ...createDefaultState(NOW),
      savedIds: ["chai-catch-up", "place-garden", "place-canteen"],
    };
    const result = checkCuriousWanderer(state, NOW);
    expect(result.pointsEarned).toBe(100);
    expect(result.badgeEarned).toBe("badge-pocket-curator");
    expect(result.state.challenges.points).toBe(100);
    expect(result.state.challenges.completedChallengeIds).toContain("curious-wanderer");
  });

  it("records a chai session and awards Chai Connoisseur badge", () => {
    const state = createDefaultState(NOW);
    const result = recordChaiSession(state, { friendId: "friend-rohan" }, NOW);
    expect(result.error).toBeNull();
    expect(result.pointsEarned).toBe(90);
    expect(result.badgeEarned).toBe("badge-chai-connoisseur");
    expect(result.state.challenges.points).toBe(90);
    expect(result.state.challenges.completedChallengeIds).toContain("chai-committee");
  });
});

describe("ESCAPE Challenges: Progress & Summary", () => {
  it("computes accurate progress indicators for all challenge types", () => {
    let state = createDefaultState(NOW);
    state = recordPlaceDiscovery(state, "place-canteen", NOW).state;

    const explorerProgress = getChallengeProgress(state, "campus-explorer", NOW);
    expect(explorerProgress.current).toBe(1);
    expect(explorerProgress.target).toBe(3);
    expect(explorerProgress.percentage).toBe(33);
    expect(explorerProgress.isCompleted).toBe(false);
    expect(explorerProgress.label).toBe("1/3 spots discovered");

    const summary = getChallengesSummary(state, NOW);
    expect(summary.totalPoints).toBe(0);
    expect(summary.completedCount).toBe(0);
    expect(summary.totalChallenges).toBe(challengesList.length);
    expect(summary.earnedBadgesCount).toBe(0);
    expect(summary.totalBadges).toBe(badgesCatalog.length);
  });
});

describe("ESCAPE Challenges: Persistence Round-Trip", () => {
  it("persists challenge state, survives loads, and retains timer and points", () => {
    const storage = new MemoryStorage();
    let state = createDefaultState(NOW);

    // Discover 2 places and start a detox timer
    state = recordPlaceDiscovery(state, "place-canteen", NOW).state;
    state = recordPlaceDiscovery(state, "place-garden", NOW + 1000).state;
    state = startDetoxTimer(state, 15 * 60, NOW + 2000).state;

    const saveResult = saveEscapeState(storage, state);
    expect(saveResult.ok).toBe(true);

    const loadResult = loadEscapeState(storage, NOW + 5000);
    expect(loadResult.warning).toBeNull();
    expect(loadResult.state.challenges.discoveredPlaceIds).toEqual(["place-canteen", "place-garden"]);
    expect(loadResult.state.challenges.activeDetoxTimer).toEqual({
      startedAt: NOW + 2000,
      durationSeconds: 900,
    });
  });

  it("handles older stored data lacking challenges field gracefully without breaking", () => {
    const storage = new MemoryStorage();
    // Simulate stored data from before challenges was added
    const olderState = {
      version: 2,
      profile: createDefaultState(NOW).profile,
      prefs: createDefaultState(NOW).prefs,
      sortMode: "best",
      savedIds: ["chai-catch-up"],
      finderTab: "spots",
      connections: [],
      presence: [],
      plans: [],
      createdAt: NOW,
      updatedAt: NOW,
    };
    storage.setItem("escape-state-v2", JSON.stringify(olderState));

    const loaded = loadEscapeState(storage, NOW);
    expect(loaded.warning).toBeNull();
    expect(loaded.state.challenges).toBeDefined();
    expect(loaded.state.challenges.points).toBe(0);
    expect(loaded.state.challenges.discoveredPlaceIds).toEqual([]);
    expect(loaded.state.savedIds).toEqual(["chai-catch-up"]);
  });
});
