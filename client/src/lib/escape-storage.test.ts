import { describe, expect, it } from "vitest";
import { createDefaultState, type EscapeState } from "./escape-logic";
import {
  LEGACY_STORAGE_KEY,
  STORAGE_BACKUP_KEY,
  STORAGE_KEY,
  loadEscapeState,
  migrateLegacyState,
  saveEscapeState,
  type StorageLike,
} from "./escape-storage";

const NOW = new Date(2026, 9, 27, 12, 0, 0).getTime();

class MemoryStorage implements StorageLike {
  values = new Map<string, string>();
  failOnSet = new Set<string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    if (this.failOnSet.has(key)) throw new Error("QuotaExceededError");
    this.values.set(key, value);
  }

  removeItem(key: string) {
    this.values.delete(key);
  }
}

describe("state persistence", () => {
  it("round-trips saved places, profile, connections, availability and plans", () => {
    const state: EscapeState = {
      ...createDefaultState(NOW),
      savedIds: ["chai-catch-up", "place-garden"],
      profile: { ...createDefaultState(NOW).profile, name: "Maya Sharma", preferredMoods: ["Chill"] },
      plans: [
        ...createDefaultState(NOW).plans,
        {
          id: "plan-test",
          itemId: "place-garden",
          itemName: "Garden courtyard",
          itemKind: "place",
          date: "2026-10-30",
          startTime: "15:30",
          durationMin: 30,
          budget: 0,
          notes: "meet by the gate",
          ownerId: "me",
          ownerName: "Maya Sharma",
          invitees: [{ friendId: "friend-aisha", name: "Aisha", status: "accepted", respondedAt: NOW }],
          myStatus: "accepted",
          createdAt: NOW,
          updatedAt: NOW,
          cancelledAt: null,
        },
      ],
    };
    const storage = new MemoryStorage();
    const saved = saveEscapeState(storage, state);
    expect(saved.ok).toBe(true);

    const loaded = loadEscapeState(storage, NOW + 60_000);
    expect(loaded.warning).toBeNull();
    expect(loaded.state.savedIds).toEqual(["chai-catch-up", "place-garden"]);
    expect(loaded.state.profile.name).toBe("Maya Sharma");
    expect(loaded.state.plans.some((plan) => plan.id === "plan-test")).toBe(true);
    expect(loaded.state.connections.some((connection) => connection.friendId === "friend-aisha")).toBe(true);
  });

  it("recovers from corrupt JSON, backs it up and keeps the app usable", () => {
    const storage = new MemoryStorage();
    storage.setItem(STORAGE_KEY, "{ definitely not json");
    const loaded = loadEscapeState(storage, NOW);
    expect(loaded.warning).toBe("reset");
    expect(loaded.state.version).toBe(2);
    expect(loaded.state.plans.length).toBeGreaterThan(0);
    expect(storage.getItem(STORAGE_BACKUP_KEY)).toBe("{ definitely not json");
  });

  it("migrates the previous demo storage format without losing saved places or preferences", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      LEGACY_STORAGE_KEY,
      JSON.stringify({
        prefs: { mood: "Social", duration: 30, budget: 100, company: "friends" },
        sortMode: "lowest",
        savedIds: ["chai-catch-up", "deleted-place"],
        profile: { name: "Maya", preferredMoods: ["Social", "Chill"], defaultDuration: 30 },
        finderTab: "people",
        invitedIds: ["friend-aisha"],
        latestPlan: { itemId: "chai-catch-up" },
      }),
    );
    const loaded = loadEscapeState(storage, NOW);
    expect(loaded.warning).toBe("migrated");
    expect(loaded.state.savedIds).toEqual(["chai-catch-up"]);
    expect(loaded.state.prefs).toMatchObject({ mood: "Social", duration: 30, budget: 100, company: "friends" });
    expect(loaded.state.sortMode).toBe("lowest");
    expect(loaded.state.finderTab).toBe("people");
    expect(loaded.state.profile.name).toBe("Maya");
    expect(storage.getItem(STORAGE_KEY)).toBeTruthy();
  });

  it("does not turn legacy invite toasts into fake requests or plans", () => {
    const migrated = migrateLegacyState({ invitedIds: ["friend-aisha"], latestPlan: { itemId: "chai-catch-up" } }, NOW);
    expect(migrated.plans.every((plan) => plan.id !== "chai-catch-up")).toBe(true);
    expect(migrated.connections.some((connection) => connection.status === "outgoing" && connection.friendId === "friend-aisha")).toBe(false);
  });

  it("reports unavailable storage but still returns a working in-memory state", () => {
    const loaded = loadEscapeState(null, NOW);
    expect(loaded.warning).toBe("unavailable");
    expect(loaded.message).toMatch(/won't let ESCAPE save/i);
    expect(loaded.state.profile.name).toBe("Maya");
    expect(saveEscapeState(null, loaded.state).ok).toBe(false);
  });

  it("reports a failed save without throwing", () => {
    const storage = new MemoryStorage();
    storage.failOnSet.add(STORAGE_KEY);
    const result = saveEscapeState(storage, createDefaultState(NOW));
    expect(result.ok).toBe(false);
    expect(result.error).toContain("QuotaExceededError");
  });

  it("normalises a missing or older version rather than crashing", () => {
    const storage = new MemoryStorage();
    const original = createDefaultState(NOW) as unknown as Record<string, unknown>;
    storage.setItem(STORAGE_KEY, JSON.stringify({ ...original, version: 1 }));
    const loaded = loadEscapeState(storage, NOW);
    expect(loaded.warning).toBe("version");
    expect(loaded.state.version).toBe(2);
    expect(loaded.state.profile.name).toBe("Maya");
  });
});
