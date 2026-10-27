import {
  activities,
  activityById,
  demoFriends,
  friendById,
  type Activity,
  type Availability,
  type AvailabilityWindow,
  type BreakDuration,
  type Budget,
  type Company,
  type DemoFriend,
  type FinderTab,
  type Friend,
  type FriendRelationship,
  type Mood,
  type Place,
  placeById,
  places,
} from "./escape-data";
import {
  badgesCatalog,
  challengeById,
  challengesList,
  isGreenSpaceItem,
  isStudyItem,
  type ChallengeBadge,
  type ChallengeCadence,
  type ChallengeCategory,
  type ChallengeDefinition,
} from "./escape-challenges-data";

export type View = "discover" | "find" | "saved" | "profile" | "challenges";
export type SortMode = "best" | "shortest" | "lowest";
export type CatalogSort = "best" | "closest" | "cheapest" | "quickest";
export type DetailItem = Activity | Place;

export const ESCAPE_STATE_VERSION = 2;
export const ALLOWED_DURATIONS = [10, 15, 30, 45, 60] as const;
export const ALLOWED_BUDGETS = [0, 50, 100, 200] as const;
export const ALLOWED_AVAILABILITY_WINDOWS = [30, 60, 120, null] as const;
export const MAX_PLAN_NOTES = 280;
export const MAX_PLAN_FRIENDS = 8;

export type ProfileState = {
  name: string;
  avatar: string;
  avatarTone: "yellow" | "mint" | "coral" | "lavender" | "blue" | "paper";
  preferredMoods: Mood[];
  defaultDuration: BreakDuration;
  defaultBudget: Budget;
  company: Company;
  availability: Availability;
  availabilityUntil: number | null;
  availabilityWindowMin: AvailabilityWindow;
  shareAvailability: boolean;
  shareProfile: boolean;
};

export type DiscoveryPreferences = {
  mood: Mood;
  duration: BreakDuration;
  budget: Budget;
  company: Company;
};

export type FriendPresence = {
  friendId: string;
  available: boolean;
  status: string;
  mood: Mood;
  expiresAt: number | null;
};

export type Connection = {
  friendId: string;
  status: Exclude<FriendRelationship, "none">;
  since: number;
};

export type PlanInviteStatus = "pending" | "accepted" | "declined";
export type PlanMyStatus = "pending" | "accepted" | "declined";
export type PlanTimingStatus = "upcoming" | "past" | "cancelled";
export type PlanTab = "upcoming" | "invites" | "history";

export type PlanInvitee = {
  friendId: string;
  name: string;
  status: PlanInviteStatus;
  respondedAt: number | null;
};

export type Plan = {
  id: string;
  itemId: string;
  itemName: string;
  itemKind: "activity" | "place";
  date: string;
  startTime: string;
  durationMin: number;
  budget: number;
  notes: string;
  ownerId: "me" | string;
  ownerName: string;
  invitees: PlanInvitee[];
  myStatus: PlanMyStatus;
  createdAt: number;
  updatedAt: number;
  cancelledAt: number | null;
};

export type PlanDraft = {
  itemId: string;
  date: string;
  startTime: string;
  durationMin: number;
  budget: number;
  notes: string;
  friendIds: string[];
};

export type PlanTiming = {
  startsAt: number;
  endsAt: number;
  happeningNow: boolean;
  status: PlanTimingStatus;
};

export type ActiveDetoxTimer = {
  startedAt: number;
  durationSeconds: number;
};

export type CompletedStudyRecord = {
  id: string;
  friendId?: string;
  planId?: string;
  note?: string;
  completedAt: number;
};

export type CompletedGreenRecord = {
  id: string;
  itemId: string;
  completedAt: number;
};

export type CompletedDetoxRecord = {
  id: string;
  completedAt: number;
  durationMinutes: number;
};

export type CompletedChaiRecord = {
  id: string;
  friendId?: string;
  planId?: string;
  completedAt: number;
};

export type ChallengesState = {
  discoveredPlaceIds: string[];
  completedChallengeIds: string[];
  repeatableCompletions: Record<string, number>;
  activeDetoxTimer: ActiveDetoxTimer | null;
  completedStudySessions: CompletedStudyRecord[];
  completedGreenEscapes: CompletedGreenRecord[];
  completedDetoxSessions: CompletedDetoxRecord[];
  completedChaiSessions: CompletedChaiRecord[];
  earnedBadgeIds: string[];
  points: number;
  lastAwardedAt: Record<string, number>;
};

export type EscapeState = {
  version: typeof ESCAPE_STATE_VERSION;
  profile: ProfileState;
  prefs: DiscoveryPreferences;
  sortMode: SortMode;
  savedIds: string[];
  finderTab: FinderTab;
  connections: Connection[];
  presence: FriendPresence[];
  plans: Plan[];
  challenges: ChallengesState;
  createdAt: number;
  updatedAt: number;
};

export type AvailabilityView = {
  status: Availability;
  expired: boolean;
  shared: boolean;
  remainingMs: number | null;
  label: string;
};

export type ProfileErrors = Partial<
  Record<
    | "name"
    | "preferredMoods"
    | "defaultDuration"
    | "defaultBudget"
    | "company"
    | "availability"
    | "availabilityWindowMin",
    string
  >
>;

export type PlanDraftErrors = Partial<
  Record<"item" | "date" | "startTime" | "duration" | "budget" | "notes" | "invitees" | "conflict", string>
>;

export type StateResult = {
  state: EscapeState;
  error: string | null;
};

export type PlanResult = StateResult & {
  plan: Plan | null;
};

export const defaultProfile: ProfileState = {
  name: "Maya",
  avatar: "MS",
  avatarTone: "lavender",
  preferredMoods: ["Social", "Chill"],
  defaultDuration: 15,
  defaultBudget: 50,
  company: "either",
  availability: "available",
  availabilityUntil: null,
  availabilityWindowMin: 60,
  shareAvailability: true,
  shareProfile: true,
};

export const defaultPrefs: DiscoveryPreferences = {
  mood: "Chill",
  duration: 15,
  budget: 50,
  company: "either",
};

export function isMood(value: unknown): value is Mood {
  return ["Chill", "Hungry", "Social", "Explore", "Play", "Focus"].includes(value as Mood);
}

export function isBreakDuration(value: unknown): value is BreakDuration {
  return (ALLOWED_DURATIONS as readonly number[]).includes(value as number);
}

export function isBudget(value: unknown): value is Budget {
  return (ALLOWED_BUDGETS as readonly number[]).includes(value as number);
}

export function isCompany(value: unknown): value is Company {
  return value === "solo" || value === "friends" || value === "either";
}

export function isAvailability(value: unknown): value is Availability {
  return value === "available" || value === "busy" || value === "hidden";
}

export function isAvailabilityWindow(value: unknown): value is AvailabilityWindow {
  return value === 30 || value === 60 || value === 120 || value === null;
}

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function toTimeKey(date: Date): string {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

/** Returns the next quarter-hour. Early-morning rollovers land on a sensible break time. */
export function nextPlanSlot(now: number): { date: string; startTime: string } {
  const date = new Date(now + 15 * 60_000);
  date.setSeconds(0, 0);
  const minutes = Math.ceil(date.getMinutes() / 15) * 15;
  date.setMinutes(minutes);
  if (date.getHours() < 7) {
    if (date.getHours() === 0 && date.getMinutes() < 15) {
      date.setHours(10, 0, 0, 0);
    }
  }
  return { date: toDateKey(date), startTime: toTimeKey(date) };
}

export function parsePlanStart(date: string, startTime: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(startTime)) return null;
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = startTime.split(":").map(Number);
  const parsed = new Date(year, month - 1, day, hour, minute, 0, 0);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day ||
    parsed.getHours() !== hour ||
    parsed.getMinutes() !== minute
  ) {
    return null;
  }
  return parsed.getTime();
}

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function seedPresence(now: number): FriendPresence[] {
  return demoFriends.map((friend) => ({
    friendId: friend.id,
    available: friend.defaultAvailable,
    status: friend.defaultAvailable ? friend.defaultStatus : "not sharing right now",
    mood: friend.defaultMood,
    expiresAt:
      friend.defaultAvailable && friend.defaultWindowMin != null
        ? now + friend.defaultWindowMin * 60_000
        : null,
  }));
}

function seedConnections(now: number): Connection[] {
  return demoFriends
    .filter((friend) => friend.seedRelationship !== "none")
    .map((friend) => ({
      friendId: friend.id,
      status: friend.seedRelationship as Exclude<FriendRelationship, "none">,
      since: now,
    }));
}

function seedIncomingPlan(now: number): Plan {
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return {
    id: "seed-plan-aisha-chai",
    itemId: "chai-catch-up",
    itemName: "Chai and catch-up",
    itemKind: "activity",
    date: toDateKey(tomorrow),
    startTime: "16:00",
    durationMin: 30,
    budget: 50,
    notes: "Post-lecture debrief? No agenda, just chai.",
    ownerId: "friend-aisha",
    ownerName: "Aisha",
    invitees: [
      { friendId: "friend-rohan", name: "Rohan", status: "accepted", respondedAt: now },
    ],
    myStatus: "pending",
    createdAt: now,
    updatedAt: now,
    cancelledAt: null,
  };
}

function seedPastPlan(now: number): Plan {
  const earlier = new Date(now);
  earlier.setDate(earlier.getDate() - 2);
  return {
    id: "seed-plan-evening-walk",
    itemId: "place-garden",
    itemName: "Garden courtyard",
    itemKind: "place",
    date: toDateKey(earlier),
    startTime: "17:00",
    durationMin: 30,
    budget: 0,
    notes: "Found the quiet bench behind the arts block.",
    ownerId: "me",
    ownerName: defaultProfile.name,
    invitees: [
      { friendId: "friend-aisha", name: "Aisha", status: "accepted", respondedAt: now },
    ],
    myStatus: "accepted",
    createdAt: earlier.getTime(),
    updatedAt: earlier.getTime(),
    cancelledAt: null,
  };
}

export function createDefaultChallengesState(now = Date.now()): ChallengesState {
  return {
    discoveredPlaceIds: [],
    completedChallengeIds: [],
    repeatableCompletions: {},
    activeDetoxTimer: null,
    completedStudySessions: [],
    completedGreenEscapes: [],
    completedDetoxSessions: [],
    completedChaiSessions: [],
    earnedBadgeIds: [],
    points: 0,
    lastAwardedAt: {},
  };
}

export function createDefaultState(now = Date.now()): EscapeState {
  return {
    version: ESCAPE_STATE_VERSION,
    profile: { ...defaultProfile, availabilityUntil: now + 60 * 60_000 },
    prefs: { ...defaultPrefs },
    sortMode: "best",
    savedIds: [],
    finderTab: "spots",
    connections: seedConnections(now),
    presence: seedPresence(now),
    plans: [seedIncomingPlan(now), seedPastPlan(now)],
    challenges: createDefaultChallengesState(now),
    createdAt: now,
    updatedAt: now,
  };
}

function safeArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function normalizeMoodList(value: unknown): Mood[] {
  const seen = new Set<Mood>();
  for (const mood of safeArray(value)) {
    if (isMood(mood) && !seen.has(mood)) seen.add(mood);
  }
  return Array.from(seen);
}

function normalizeProfile(raw: unknown, base: ProfileState, now: number): ProfileState {
  if (!raw || typeof raw !== "object") return base;
  const value = raw as Partial<Record<keyof ProfileState, unknown>>;
  const name = typeof value.name === "string" && value.name.trim().length >= 2 ? value.name.trim().slice(0, 40) : base.name;
  const preferredMoods = normalizeMoodList(value.preferredMoods);
  return {
    name,
    avatar: typeof value.avatar === "string" && value.avatar.trim() ? value.avatar.trim().slice(0, 3) : initialsFromName(name),
    avatarTone:
      value.avatarTone === "yellow" ||
      value.avatarTone === "mint" ||
      value.avatarTone === "coral" ||
      value.avatarTone === "lavender" ||
      value.avatarTone === "blue" ||
      value.avatarTone === "paper"
        ? value.avatarTone
        : base.avatarTone,
    preferredMoods: preferredMoods.length ? preferredMoods : base.preferredMoods,
    defaultDuration: isBreakDuration(value.defaultDuration) ? value.defaultDuration : base.defaultDuration,
    defaultBudget: isBudget(value.defaultBudget) ? value.defaultBudget : base.defaultBudget,
    company: isCompany(value.company) ? value.company : base.company,
    availability: isAvailability(value.availability) ? value.availability : base.availability,
    availabilityUntil:
      typeof value.availabilityUntil === "number" && value.availabilityUntil > now - 24 * 60 * 60_000
        ? value.availabilityUntil
        : value.availabilityUntil === null
          ? null
          : base.availabilityUntil,
    availabilityWindowMin: isAvailabilityWindow(value.availabilityWindowMin)
      ? value.availabilityWindowMin
      : base.availabilityWindowMin,
    shareAvailability: typeof value.shareAvailability === "boolean" ? value.shareAvailability : base.shareAvailability,
    shareProfile: typeof value.shareProfile === "boolean" ? value.shareProfile : base.shareProfile,
  };
}

function normalizePlan(raw: unknown, now: number): Plan | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Partial<Record<keyof Plan, unknown>>;
  if (
    typeof value.id !== "string" ||
    typeof value.itemId !== "string" ||
    typeof value.itemName !== "string" ||
    (value.itemKind !== "activity" && value.itemKind !== "place") ||
    typeof value.date !== "string" ||
    typeof value.startTime !== "string" ||
    typeof value.ownerId !== "string" ||
    parsePlanStart(value.date, value.startTime) === null
  ) {
    return null;
  }
  const durationMin = Number(value.durationMin);
  const budget = Number(value.budget);
  if (!Number.isFinite(durationMin) || durationMin < 5 || durationMin > 240) return null;
  if (!Number.isFinite(budget) || budget < 0 || budget > 10_000) return null;
  const invitees = safeArray(value.invitees)
    .map((entry): PlanInvitee | null => {
      if (!entry || typeof entry !== "object") return null;
      const invitee = entry as Partial<PlanInvitee>;
      if (
        typeof invitee.friendId !== "string" ||
        !friendById.has(invitee.friendId) ||
        (invitee.status !== "pending" && invitee.status !== "accepted" && invitee.status !== "declined")
      ) {
        return null;
      }
      return {
        friendId: invitee.friendId,
        name: friendById.get(invitee.friendId)!.name,
        status: invitee.status,
        respondedAt: typeof invitee.respondedAt === "number" ? invitee.respondedAt : null,
      };
    })
    .filter((entry): entry is PlanInvitee => Boolean(entry));
  const dedupedInvitees = Array.from(new Map(invitees.map((entry) => [entry.friendId, entry])).values()).slice(0, MAX_PLAN_FRIENDS);
  const myStatus =
    value.myStatus === "accepted" || value.myStatus === "declined" || value.myStatus === "pending"
      ? value.myStatus
      : "pending";
  return {
    id: value.id,
    itemId: value.itemId,
    itemName: value.itemName.slice(0, 80),
    itemKind: value.itemKind,
    date: value.date,
    startTime: value.startTime,
    durationMin,
    budget,
    notes: typeof value.notes === "string" ? value.notes.slice(0, MAX_PLAN_NOTES) : "",
    ownerId: value.ownerId,
    ownerName: typeof value.ownerName === "string" ? value.ownerName : "Someone",
    invitees: dedupedInvitees,
    myStatus,
    createdAt: typeof value.createdAt === "number" ? value.createdAt : now,
    updatedAt: typeof value.updatedAt === "number" ? value.updatedAt : now,
    cancelledAt: typeof value.cancelledAt === "number" ? value.cancelledAt : null,
  };
}

export function normalizeChallenges(raw: unknown, now = Date.now()): ChallengesState {
  const base = createDefaultChallengesState(now);
  if (!raw || typeof raw !== "object") return base;
  const value = raw as Partial<Record<keyof ChallengesState, unknown>>;

  const discoveredPlaceIds = safeArray(value.discoveredPlaceIds)
    .filter((id): id is string => typeof id === "string" && placeById.has(id));

  const completedChallengeIds = safeArray(value.completedChallengeIds)
    .filter((id): id is string => typeof id === "string" && challengeById.has(id));

  const earnedBadgeIds = safeArray(value.earnedBadgeIds)
    .filter((id): id is string => typeof id === "string" && badgesCatalog.some((b) => b.id === id));

  const repeatableCompletions: Record<string, number> = {};
  if (value.repeatableCompletions && typeof value.repeatableCompletions === "object") {
    for (const [key, count] of Object.entries(value.repeatableCompletions)) {
      if (typeof count === "number" && Number.isFinite(count) && count >= 0) {
        repeatableCompletions[key] = Math.floor(count);
      }
    }
  }

  let activeDetoxTimer: ActiveDetoxTimer | null = null;
  if (value.activeDetoxTimer && typeof value.activeDetoxTimer === "object") {
    const timer = value.activeDetoxTimer as Partial<ActiveDetoxTimer>;
    const startedAt = Number(timer.startedAt);
    const durationSeconds = Number(timer.durationSeconds);
    if (
      Number.isFinite(startedAt) &&
      startedAt > 0 &&
      startedAt <= now + 60_000 &&
      Number.isFinite(durationSeconds) &&
      durationSeconds >= 5 &&
      durationSeconds <= 7200
    ) {
      activeDetoxTimer = { startedAt, durationSeconds };
    }
  }

  const completedStudySessions = safeArray(value.completedStudySessions)
    .map((entry): CompletedStudyRecord | null => {
      if (!entry || typeof entry !== "object") return null;
      const rec = entry as Partial<CompletedStudyRecord>;
      if (typeof rec.id !== "string") return null;
      return {
        id: rec.id,
        friendId: typeof rec.friendId === "string" ? rec.friendId : undefined,
        planId: typeof rec.planId === "string" ? rec.planId : undefined,
        note: typeof rec.note === "string" ? rec.note.slice(0, 140) : undefined,
        completedAt: typeof rec.completedAt === "number" ? rec.completedAt : now,
      };
    })
    .filter((entry): entry is CompletedStudyRecord => Boolean(entry));

  const completedGreenEscapes = safeArray(value.completedGreenEscapes)
    .map((entry): CompletedGreenRecord | null => {
      if (!entry || typeof entry !== "object") return null;
      const rec = entry as Partial<CompletedGreenRecord>;
      if (typeof rec.id !== "string" || typeof rec.itemId !== "string") return null;
      return {
        id: rec.id,
        itemId: rec.itemId,
        completedAt: typeof rec.completedAt === "number" ? rec.completedAt : now,
      };
    })
    .filter((entry): entry is CompletedGreenRecord => Boolean(entry));

  const completedDetoxSessions = safeArray(value.completedDetoxSessions)
    .map((entry): CompletedDetoxRecord | null => {
      if (!entry || typeof entry !== "object") return null;
      const rec = entry as Partial<CompletedDetoxRecord>;
      if (typeof rec.id !== "string") return null;
      return {
        id: rec.id,
        completedAt: typeof rec.completedAt === "number" ? rec.completedAt : now,
        durationMinutes: typeof rec.durationMinutes === "number" ? rec.durationMinutes : 15,
      };
    })
    .filter((entry): entry is CompletedDetoxRecord => Boolean(entry));

  const completedChaiSessions = safeArray(value.completedChaiSessions)
    .map((entry): CompletedChaiRecord | null => {
      if (!entry || typeof entry !== "object") return null;
      const rec = entry as Partial<CompletedChaiRecord>;
      if (typeof rec.id !== "string") return null;
      return {
        id: rec.id,
        friendId: typeof rec.friendId === "string" ? rec.friendId : undefined,
        planId: typeof rec.planId === "string" ? rec.planId : undefined,
        completedAt: typeof rec.completedAt === "number" ? rec.completedAt : now,
      };
    })
    .filter((entry): entry is CompletedChaiRecord => Boolean(entry));

  const rawPoints = Number(value.points);
  const points = Number.isFinite(rawPoints) && rawPoints >= 0 ? Math.floor(rawPoints) : 0;

  const lastAwardedAt: Record<string, number> = {};
  if (value.lastAwardedAt && typeof value.lastAwardedAt === "object") {
    for (const [key, ts] of Object.entries(value.lastAwardedAt)) {
      if (typeof ts === "number" && Number.isFinite(ts)) {
        lastAwardedAt[key] = ts;
      }
    }
  }

  return {
    discoveredPlaceIds: Array.from(new Set(discoveredPlaceIds)),
    completedChallengeIds: Array.from(new Set(completedChallengeIds)),
    repeatableCompletions,
    activeDetoxTimer,
    completedStudySessions,
    completedGreenEscapes,
    completedDetoxSessions,
    completedChaiSessions,
    earnedBadgeIds: Array.from(new Set(earnedBadgeIds)),
    points,
    lastAwardedAt,
  };
}

/** Repairs partially-written, older, or hand-edited stored state. */
export function normalizeState(raw: unknown, now = Date.now()): EscapeState {
  const base = createDefaultState(now);
  if (!raw || typeof raw !== "object") return base;
  const value = raw as Partial<Record<keyof EscapeState, unknown>>;
  const connections = safeArray(value.connections)
    .map((entry): Connection | null => {
      if (!entry || typeof entry !== "object") return null;
      const connection = entry as Partial<Connection>;
      if (
        typeof connection.friendId !== "string" ||
        !friendById.has(connection.friendId) ||
        (connection.status !== "friends" && connection.status !== "incoming" && connection.status !== "outgoing")
      ) {
        return null;
      }
      return {
        friendId: connection.friendId,
        status: connection.status,
        since: typeof connection.since === "number" ? connection.since : now,
      };
    })
    .filter((entry): entry is Connection => Boolean(entry));
  const presence = demoFriends.map((friend) => {
    const stored = safeArray(value.presence).find(
      (entry) => entry && typeof entry === "object" && (entry as FriendPresence).friendId === friend.id,
    ) as FriendPresence | undefined;
    return {
      friendId: friend.id,
      available: typeof stored?.available === "boolean" ? stored.available : friend.defaultAvailable,
      status:
        typeof stored?.status === "string" && stored.status.trim()
          ? stored.status.slice(0, 80)
          : friend.defaultAvailable
            ? friend.defaultStatus
            : "not sharing right now",
      mood: isMood(stored?.mood) ? stored.mood : friend.defaultMood,
      expiresAt: typeof stored?.expiresAt === "number" ? stored.expiresAt : null,
    };
  });
  const plans = safeArray(value.plans)
    .map((plan) => normalizePlan(plan, now))
    .filter((plan): plan is Plan => Boolean(plan));
  const savedIds = safeArray(value.savedIds)
    .filter((id): id is string => typeof id === "string" && (activityById.has(id) || placeById.has(id)));
  const prefsRaw = value.prefs && typeof value.prefs === "object" ? (value.prefs as Partial<DiscoveryPreferences>) : {};
  const prefs: DiscoveryPreferences = {
    mood: isMood(prefsRaw.mood) ? prefsRaw.mood : base.prefs.mood,
    duration: isBreakDuration(prefsRaw.duration) ? prefsRaw.duration : base.prefs.duration,
    budget: isBudget(prefsRaw.budget) ? prefsRaw.budget : base.prefs.budget,
    company: isCompany(prefsRaw.company) ? prefsRaw.company : base.prefs.company,
  };
  return {
    version: ESCAPE_STATE_VERSION,
    profile: normalizeProfile(value.profile, base.profile, now),
    prefs,
    sortMode: value.sortMode === "shortest" || value.sortMode === "lowest" || value.sortMode === "best" ? value.sortMode : "best",
    savedIds: Array.from(new Set(savedIds)),
    finderTab: value.finderTab === "people" || value.finderTab === "spots" ? value.finderTab : "spots",
    connections,
    presence,
    plans,
    challenges: normalizeChallenges(value.challenges, now),
    createdAt: typeof value.createdAt === "number" ? value.createdAt : now,
    updatedAt: typeof value.updatedAt === "number" ? value.updatedAt : now,
  };
}

function touch(state: EscapeState, now: number, patch: Partial<EscapeState>): EscapeState {
  return { ...state, ...patch, version: ESCAPE_STATE_VERSION, updatedAt: now };
}

/* ------------------------------------------------------------------ */
/* Search, filters and recommendations                                 */
/* ------------------------------------------------------------------ */

export type CatalogFilters = {
  query?: string;
  category?: string | "all";
  maxPrice?: number | null;
  maxDuration?: number | null;
  maxWalk?: number | null;
  moods?: Mood[];
  company?: Company | null;
  sort?: CatalogSort;
};

function queryTokens(query: string | undefined): string[] {
  return (query ?? "")
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export function matchesSearch(item: Activity | Place, query: string | undefined): boolean {
  const tokens = queryTokens(query);
  if (tokens.length === 0) return true;
  const haystack = `${item.name} ${item.category} ${item.description} ${item.tags.join(" ")} ${item.moods.join(" ")}`.toLowerCase();
  return tokens.every((token) => haystack.includes(token));
}

function sharedItemScore(item: Activity | Place, filters: CatalogFilters): number {
  let score = 0;
  if (filters.moods?.length) {
    const overlap = item.moods.filter((mood) => filters.moods!.includes(mood)).length;
    score += overlap * 3;
  }
  if (filters.maxPrice != null && item.price <= filters.maxPrice) score += 2;
  if (filters.maxDuration != null && item.durationMin <= filters.maxDuration) score += 2;
  if (filters.maxWalk != null && item.walkMin <= filters.maxWalk) score += 2;
  return score;
}

function sortCatalog<T extends Activity | Place>(items: T[], filters: CatalogFilters): T[] {
  const sort = filters.sort ?? "best";
  return [...items].sort((a, b) => {
    if (sort === "closest") return a.walkMin - b.walkMin || a.durationMin - b.durationMin || a.name.localeCompare(b.name);
    if (sort === "cheapest") return a.price - b.price || a.walkMin - b.walkMin || a.name.localeCompare(b.name);
    if (sort === "quickest") return a.durationMin - b.durationMin || a.walkMin - b.walkMin || a.name.localeCompare(b.name);
    const scoreDiff = sharedItemScore(b, filters) - sharedItemScore(a, filters);
    if (scoreDiff !== 0) return scoreDiff;
    return a.walkMin - b.walkMin || a.price - b.price || a.name.localeCompare(b.name);
  });
}

export function filterPlaces(filters: CatalogFilters = {}): Place[] {
  const results = places.filter((place) => {
    if (!matchesSearch(place, filters.query)) return false;
    if (filters.category && filters.category !== "all" && place.category !== filters.category) return false;
    if (filters.maxPrice != null && place.price > filters.maxPrice) return false;
    if (filters.maxDuration != null && place.durationMin > filters.maxDuration) return false;
    if (filters.maxWalk != null && place.walkMin > filters.maxWalk) return false;
    if (filters.moods?.length && !place.moods.some((mood) => filters.moods!.includes(mood))) return false;
    return true;
  });
  return sortCatalog(results, filters);
}

export function filterActivities(filters: CatalogFilters = {}): Activity[] {
  const results = activities.filter((activity) => {
    if (!matchesSearch(activity, filters.query)) return false;
    if (filters.category && filters.category !== "all" && activity.category !== filters.category) return false;
    if (filters.maxPrice != null && activity.price > filters.maxPrice) return false;
    if (filters.maxDuration != null && activity.durationMin > filters.maxDuration) return false;
    if (filters.maxWalk != null && activity.walkMin > filters.maxWalk) return false;
    if (filters.moods?.length && !activity.moods.some((mood) => filters.moods!.includes(mood))) return false;
    if (filters.company && filters.company !== "either") {
      if (filters.company === "solo" && activity.social === "friends") return false;
      if (filters.company === "friends" && activity.social === "solo") return false;
    }
    return true;
  });
  return sortCatalog(results, filters);
}

export type Recommendation = {
  item: Activity;
  reason: string;
  travelMin: number;
  tightFit: boolean;
  score: number;
};

function pricePhrase(price: number, budget: number): string {
  if (price === 0) return "free";
  if (price <= budget) return `₹${price} inside your ₹${budget} ceiling`;
  return `₹${price}, a little over budget`;
}

export function recommendationReason(activity: Activity, prefs: DiscoveryPreferences, interests: Mood[] = []): string {
  const parts: string[] = [];
  parts.push(`matches your ${prefs.mood.toLowerCase()} mood`);
  parts.push(pricePhrase(activity.price, prefs.budget));
  parts.push(`${activity.walkMin} min walk each way`);
  if (activity.durationMin + activity.walkMin * 2 > prefs.duration) {
    parts.push("a little tight with the walk");
  } else {
    parts.push(`fits the ${prefs.duration} min`);
  }
  const sharedInterest = interests.find((mood) => mood !== prefs.mood && activity.moods.includes(mood));
  if (sharedInterest) parts.push(`one of your ${sharedInterest.toLowerCase()} interests`);
  return parts.join(" · ");
}

export function recommendActivities(
  prefs: DiscoveryPreferences,
  filters: CatalogFilters = {},
  profileInterests: Mood[] = [],
): Recommendation[] {
  const candidates = filterActivities({
    ...filters,
    moods: [prefs.mood],
    maxPrice: prefs.budget,
    maxDuration: prefs.duration,
    company: prefs.company,
    sort: undefined,
  });
  const recommendations = candidates.map((item) => {
    const travelMin = item.walkMin * 2;
    const tightFit = item.durationMin + travelMin > prefs.duration;
    const interestScore = profileInterests.filter((mood) => item.moods.includes(mood)).length;
    const companyScore = item.social === prefs.company || item.social === "both" ? 2 : 0;
    const timeScore = item.durationMin === prefs.duration ? 1 : 0;
    return {
      item,
      reason: recommendationReason(item, prefs, profileInterests),
      travelMin,
      tightFit,
      score: 5 + interestScore * 2 + companyScore + timeScore - (tightFit ? 1 : 0),
    };
  });
  if (prefs.company === "either") {
    return recommendations.sort((a, b) => b.score - a.score || a.item.walkMin - b.item.walkMin);
  }
  return recommendations.sort((a, b) => b.score - a.score || a.item.walkMin - b.item.walkMin);
}

export function recommendPlaces(prefs: DiscoveryPreferences, limit = 3): Place[] {
  return [...places]
    .filter((place) => place.price <= prefs.budget)
    .sort((a, b) => {
      const aScore = (a.moods.includes(prefs.mood) ? 3 : 0) + (a.durationMin <= prefs.duration ? 2 : 0) - a.walkMin / 10;
      const bScore = (b.moods.includes(prefs.mood) ? 3 : 0) + (b.durationMin <= prefs.duration ? 2 : 0) - b.walkMin / 10;
      return bScore - aScore || a.name.localeCompare(b.name);
    })
    .slice(0, limit);
}

/* ------------------------------------------------------------------ */
/* Saved items                                                         */
/* ------------------------------------------------------------------ */

export function toggleSavedId(ids: string[], itemId: string): string[] {
  return ids.includes(itemId) ? ids.filter((id) => id !== itemId) : [...ids, itemId];
}

export function resolveSavedItems(ids: string[]): DetailItem[] {
  return ids
    .map((id) => activityById.get(id) ?? placeById.get(id))
    .filter((item): item is DetailItem => Boolean(item));
}

/* ------------------------------------------------------------------ */
/* Availability                                                        */
/* ------------------------------------------------------------------ */

export function getAvailabilityView(profile: ProfileState, now = Date.now()): AvailabilityView {
  const expired =
    profile.availability === "available" &&
    profile.availabilityUntil != null &&
    profile.availabilityUntil <= now;
  const status: Availability = expired ? "hidden" : profile.availability;
  const shared = profile.shareAvailability && status === "available";
  const remainingMs =
    status === "available" && profile.availabilityUntil != null
      ? Math.max(0, profile.availabilityUntil - now)
      : null;
  const label = expired
    ? "availability expired"
    : !profile.shareAvailability
      ? "not sharing availability"
      : status === "available"
        ? "visible to friends"
        : status === "busy"
          ? "marked busy"
          : "hidden from friends";
  return { status, expired, shared, remainingMs, label };
}

export function setAvailability(state: EscapeState, availability: Availability, now = Date.now()): EscapeState {
  const windowMinutes = state.profile.availabilityWindowMin;
  const availabilityUntil =
    availability === "available" && windowMinutes != null ? now + windowMinutes * 60_000 : null;
  return touch(state, now, {
    profile: { ...state.profile, availability, availabilityUntil },
  });
}

export function setAvailabilityWindow(
  state: EscapeState,
  windowMinutes: AvailabilityWindow,
  now = Date.now(),
): EscapeState {
  const availabilityUntil =
    state.profile.availability === "available" && windowMinutes != null
      ? now + windowMinutes * 60_000
      : null;
  return touch(state, now, {
    profile: {
      ...state.profile,
      availabilityWindowMin: windowMinutes,
      availabilityUntil,
    },
  });
}

export function formatRemaining(ms: number | null): string {
  if (ms == null) return "until you change it";
  const minutes = Math.max(1, Math.ceil(ms / 60_000));
  if (minutes < 60) return `${minutes} min left`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} hr ${rest} min left` : `${hours} hr left`;
}

export function effectivePresence(presence: FriendPresence, now = Date.now()): FriendPresence {
  if (presence.available && presence.expiresAt != null && presence.expiresAt <= now) {
    return {
      ...presence,
      available: false,
      status: "not sharing right now",
      expiresAt: null,
    };
  }
  return presence;
}

/* ------------------------------------------------------------------ */
/* Friends and requests                                                */
/* ------------------------------------------------------------------ */

export function getFriendViews(state: EscapeState, now = Date.now()): Friend[] {
  const connections = new Map(state.connections.map((connection) => [connection.friendId, connection]));
  const presence = new Map(state.presence.map((entry) => [entry.friendId, effectivePresence(entry, now)]));
  return demoFriends.map((friend: DemoFriend) => {
    const connection = connections.get(friend.id);
    const relationship: FriendRelationship = connection?.status ?? "none";
    const current = presence.get(friend.id);
    const canSeePresence = relationship === "friends";
    return {
      id: friend.id,
      name: friend.name,
      initials: friend.initials,
      tone: friend.tone,
      status: canSeePresence ? (current?.status ?? "not sharing right now") : "not connected yet",
      mood: current?.mood ?? friend.defaultMood,
      available: canSeePresence ? Boolean(current?.available) : false,
      interests: friend.interests,
      bio: friend.bio,
      expiresAt: canSeePresence ? (current?.expiresAt ?? null) : null,
      relationship,
    };
  });
}

export function getAvailableFriends(state: EscapeState, now = Date.now()): Friend[] {
  return getFriendViews(state, now).filter((friend) => friend.relationship === "friends" && friend.available);
}

export function getAcceptedFriends(state: EscapeState, now = Date.now()): Friend[] {
  return getFriendViews(state, now).filter((friend) => friend.relationship === "friends");
}

export function getFriendRequestCounts(state: EscapeState) {
  return {
    incoming: state.connections.filter((connection) => connection.status === "incoming").length,
    outgoing: state.connections.filter((connection) => connection.status === "outgoing").length,
  };
}

function connectionError(action: string, relationship: FriendRelationship): string | null {
  if (relationship === "friends") return `You're already connected — ${action} isn't needed.`;
  if (relationship === "incoming") return "They already sent you a request. Accept or decline it instead.";
  if (relationship === "outgoing") return "Your request is already waiting for a reply.";
  return null;
}

export function sendFriendRequest(state: EscapeState, friendId: string, now = Date.now()): StateResult {
  if (!friendById.has(friendId)) return { state, error: "That classmate is not in the demo directory." };
  const existing = state.connections.find((connection) => connection.friendId === friendId);
  const error = connectionError("sending another request", existing?.status ?? "none");
  if (error) return { state, error };
  return {
    state: touch(state, now, {
      connections: [...state.connections, { friendId, status: "outgoing", since: now }],
    }),
    error: null,
  };
}

export function acceptFriendRequest(state: EscapeState, friendId: string, now = Date.now()): StateResult {
  const existing = state.connections.find((connection) => connection.friendId === friendId);
  if (!existing || existing.status !== "incoming") {
    return { state, error: "There's no incoming request from that classmate." };
  }
  return {
    state: touch(state, now, {
      connections: state.connections.map((connection) =>
        connection.friendId === friendId ? { ...connection, status: "friends", since: now } : connection,
      ),
    }),
    error: null,
  };
}

export function rejectFriendRequest(state: EscapeState, friendId: string, now = Date.now()): StateResult {
  const existing = state.connections.find((connection) => connection.friendId === friendId);
  if (!existing || existing.status !== "incoming") {
    return { state, error: "There's no incoming request to decline." };
  }
  return {
    state: touch(state, now, {
      connections: state.connections.filter((connection) => connection.friendId !== friendId),
    }),
    error: null,
  };
}

export function withdrawFriendRequest(state: EscapeState, friendId: string, now = Date.now()): StateResult {
  const existing = state.connections.find((connection) => connection.friendId === friendId);
  if (!existing || existing.status !== "outgoing") {
    return { state, error: "There's no sent request to withdraw." };
  }
  return {
    state: touch(state, now, {
      connections: state.connections.filter((connection) => connection.friendId !== friendId),
    }),
    error: null,
  };
}

export function removeFriend(state: EscapeState, friendId: string, now = Date.now()): StateResult {
  const existing = state.connections.find((connection) => connection.friendId === friendId);
  if (!existing || existing.status !== "friends") {
    return { state, error: "That classmate isn't in your friends list." };
  }
  return {
    state: touch(state, now, {
      connections: state.connections.filter((connection) => connection.friendId !== friendId),
    }),
    error: null,
  };
}

export function isAcceptedFriend(state: EscapeState, friendId: string): boolean {
  return state.connections.some((connection) => connection.friendId === friendId && connection.status === "friends");
}

/* ------------------------------------------------------------------ */
/* Plans                                                               */
/* ------------------------------------------------------------------ */

export function getPlanTiming(plan: Plan, now = Date.now()): PlanTiming {
  const startsAt = parsePlanStart(plan.date, plan.startTime) ?? now;
  const endsAt = startsAt + plan.durationMin * 60_000;
  if (plan.cancelledAt != null) {
    return { startsAt, endsAt, happeningNow: false, status: "cancelled" };
  }
  if (endsAt <= now) {
    return { startsAt, endsAt, happeningNow: false, status: "past" };
  }
  return {
    startsAt,
    endsAt,
    happeningNow: startsAt <= now && now < endsAt,
    status: "upcoming",
  };
}

function isActivePlan(plan: Plan): boolean {
  return plan.cancelledAt == null && plan.myStatus !== "declined";
}

function planConflicts(
  state: EscapeState,
  startsAt: number,
  durationMin: number,
  editingPlanId: string | undefined,
  now: number,
): Plan | null {
  const end = startsAt + durationMin * 60_000;
  for (const plan of state.plans) {
    if (plan.id === editingPlanId) continue;
    if (!isActivePlan(plan)) continue;
    const timing = getPlanTiming(plan, now);
    if (timing.status !== "upcoming") continue;
    if (startsAt < timing.endsAt && end > timing.startsAt) return plan;
  }
  return null;
}

export function validatePlanDraft(
  draft: PlanDraft,
  state: EscapeState,
  now = Date.now(),
  editingPlanId?: string,
): PlanDraftErrors {
  const errors: PlanDraftErrors = {};
  const activity = activityById.get(draft.itemId);
  const place = placeById.get(draft.itemId);
  if (!activity && !place) errors.item = "Pick a saved place or activity for this plan.";

  const startsAt = parsePlanStart(draft.date, draft.startTime);
  if (!draft.date) errors.date = "Choose a date.";
  else if (startsAt == null) errors.date = "Use a valid date.";
  else if (startsAt < now - 60_000) errors.date = "Choose a time in the future.";

  if (!draft.startTime) errors.startTime = "Choose a start time.";
  else if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(draft.startTime)) errors.startTime = "Use a valid 24-hour time.";

  if (!Number.isInteger(draft.durationMin) || draft.durationMin < 5 || draft.durationMin > 240) {
    errors.duration = "Duration must be between 5 and 240 minutes.";
  }
  if (!Number.isFinite(draft.budget) || draft.budget < 0 || draft.budget > 10_000) {
    errors.budget = "Use a budget between ₹0 and ₹10,000.";
  }
  if (draft.notes.trim().length > MAX_PLAN_NOTES) {
    errors.notes = `Notes must be ${MAX_PLAN_NOTES} characters or fewer.`;
  }
  const uniqueFriends = new Set(draft.friendIds);
  if (uniqueFriends.size !== draft.friendIds.length) {
    errors.invitees = "Each friend can only be invited once.";
  } else if (draft.friendIds.length > MAX_PLAN_FRIENDS) {
    errors.invitees = `Invite up to ${MAX_PLAN_FRIENDS} friends.`;
  } else if (draft.friendIds.some((friendId) => !isAcceptedFriend(state, friendId))) {
    errors.invitees = "Only accepted friends can be invited.";
  }

  if (startsAt != null && !errors.duration) {
    const conflict = planConflicts(state, startsAt, draft.durationMin, editingPlanId, now);
    if (conflict) errors.conflict = `That overlaps with "${conflict.itemName}". Pick another time.`;
  }
  return errors;
}

function autoInvitees(state: EscapeState, friendIds: string[], now: number): PlanInvitee[] {
  const presence = new Map(state.presence.map((entry) => [entry.friendId, effectivePresence(entry, now)]));
  return Array.from(new Set(friendIds)).map((friendId) => {
    const friend = friendById.get(friendId)!;
    return {
      friendId,
      name: friend.name,
      status: presence.get(friendId)?.available ? "accepted" : "declined",
      respondedAt: now,
    };
  });
}

function itemKindFor(itemId: string): "activity" | "place" | null {
  if (activityById.has(itemId)) return "activity";
  if (placeById.has(itemId)) return "place";
  return null;
}

function makePlanId(now: number): string {
  const random = Math.random().toString(36).slice(2, 8);
  return `plan-${now.toString(36)}-${random}`;
}

export function createPlan(state: EscapeState, draft: PlanDraft, now = Date.now()): PlanResult {
  const errors = validatePlanDraft(draft, state, now);
  if (Object.keys(errors).length > 0) {
    return { state, error: Object.values(errors)[0] ?? "That plan isn't valid yet.", plan: null };
  }
  const itemId = draft.itemId;
  const kind = itemKindFor(itemId);
  if (!kind) return { state, error: "Pick a saved place or activity for this plan.", plan: null };
  const item = activityById.get(itemId) ?? placeById.get(itemId)!;
  const plan: Plan = {
    id: makePlanId(now),
    itemId,
    itemName: item.name,
    itemKind: kind,
    date: draft.date,
    startTime: draft.startTime,
    durationMin: draft.durationMin,
    budget: draft.budget,
    notes: draft.notes.trim(),
    ownerId: "me",
    ownerName: state.profile.name,
    invitees: autoInvitees(state, draft.friendIds, now),
    myStatus: "accepted",
    createdAt: now,
    updatedAt: now,
    cancelledAt: null,
  };
  return {
    state: touch(state, now, { plans: [plan, ...state.plans] }),
    error: null,
    plan,
  };
}

export function updatePlan(
  state: EscapeState,
  planId: string,
  draft: PlanDraft,
  now = Date.now(),
): PlanResult {
  const existing = state.plans.find((plan) => plan.id === planId);
  if (!existing) return { state, error: "That plan no longer exists.", plan: null };
  if (existing.ownerId !== "me") return { state, error: "Only the plan creator can edit it.", plan: null };
  const timing = getPlanTiming(existing, now);
  if (timing.status === "cancelled") return { state, error: "Cancelled plans can't be edited.", plan: null };
  if (timing.status === "past") return { state, error: "Past plans can't be edited.", plan: null };
  const errors = validatePlanDraft(draft, state, now, planId);
  if (Object.keys(errors).length > 0) {
    return { state, error: Object.values(errors)[0] ?? "That plan isn't valid yet.", plan: null };
  }
  const kind = itemKindFor(draft.itemId);
  if (!kind) return { state, error: "Pick a saved place or activity for this plan.", plan: null };
  const item = activityById.get(draft.itemId) ?? placeById.get(draft.itemId)!;
  const updated: Plan = {
    ...existing,
    itemId: draft.itemId,
    itemName: item.name,
    itemKind: kind,
    date: draft.date,
    startTime: draft.startTime,
    durationMin: draft.durationMin,
    budget: draft.budget,
    notes: draft.notes.trim(),
    invitees: Array.from(new Set(draft.friendIds)).map((friendId) => {
      const prior = existing.invitees.find((invitee) => invitee.friendId === friendId);
      if (prior) return prior;
      const friend = friendById.get(friendId)!;
      const available = state.presence
        .map((entry) => effectivePresence(entry, now))
        .some((entry) => entry.friendId === friendId && entry.available);
      return {
        friendId,
        name: friend.name,
        status: available ? "accepted" : "declined",
        respondedAt: now,
      };
    }),
    updatedAt: now,
  };
  return {
    state: touch(state, now, {
      plans: state.plans.map((plan) => (plan.id === planId ? updated : plan)),
    }),
    error: null,
    plan: updated,
  };
}

export function cancelPlan(state: EscapeState, planId: string, now = Date.now()): PlanResult {
  const existing = state.plans.find((plan) => plan.id === planId);
  if (!existing) return { state, error: "That plan no longer exists.", plan: null };
  if (existing.ownerId !== "me") return { state, error: "Only the plan creator can cancel it.", plan: null };
  const timing = getPlanTiming(existing, now);
  if (timing.status === "cancelled") return { state, error: "That plan is already cancelled.", plan: null };
  if (timing.status === "past") return { state, error: "Past plans can't be cancelled.", plan: null };
  const cancelled: Plan = { ...existing, cancelledAt: now, updatedAt: now };
  return {
    state: touch(state, now, {
      plans: state.plans.map((plan) => (plan.id === planId ? cancelled : plan)),
    }),
    error: null,
    plan: cancelled,
  };
}

export function respondToPlan(
  state: EscapeState,
  planId: string,
  response: "accepted" | "declined",
  now = Date.now(),
): PlanResult {
  const existing = state.plans.find((plan) => plan.id === planId);
  if (!existing) return { state, error: "That invitation no longer exists.", plan: null };
  if (existing.ownerId === "me") return { state, error: "You created this plan.", plan: null };
  const timing = getPlanTiming(existing, now);
  if (timing.status === "cancelled") return { state, error: "That plan was cancelled.", plan: null };
  if (timing.status === "past") return { state, error: "That invitation has already passed.", plan: null };
  if (existing.myStatus !== "pending") {
    return { state, error: `You already ${existing.myStatus} this invitation.`, plan: null };
  }
  const updated: Plan = { ...existing, myStatus: response, updatedAt: now };
  return {
    state: touch(state, now, {
      plans: state.plans.map((plan) => (plan.id === planId ? updated : plan)),
    }),
    error: null,
    plan: updated,
  };
}

export type PlanBuckets = {
  upcoming: Plan[];
  invites: Plan[];
  history: Plan[];
};

export function getPlanBuckets(state: EscapeState, now = Date.now()): PlanBuckets {
  const decorated = state.plans.map((plan) => ({ plan, timing: getPlanTiming(plan, now) }));
  const upcoming = decorated
    .filter(({ plan, timing }) => {
      if (timing.status !== "upcoming") return false;
      if (plan.ownerId === "me") return true;
      return plan.myStatus === "accepted";
    })
    .sort((a, b) => a.timing.startsAt - b.timing.startsAt)
    .map(({ plan }) => plan);
  const invites = decorated
    .filter(({ plan, timing }) => plan.ownerId !== "me" && plan.myStatus === "pending" && timing.status === "upcoming")
    .sort((a, b) => a.timing.startsAt - b.timing.startsAt)
    .map(({ plan }) => plan);
  const history = decorated
    .filter(({ plan, timing }) => {
      if (timing.status === "past" || timing.status === "cancelled") return true;
      return plan.ownerId !== "me" && plan.myStatus === "declined";
    })
    .sort((a, b) => b.timing.startsAt - a.timing.startsAt)
    .map(({ plan }) => plan);
  return { upcoming, invites, history };
}

export function getNextPlan(state: EscapeState, now = Date.now()): Plan | null {
  return getPlanBuckets(state, now).upcoming[0] ?? null;
}

export function countAcceptedInvitees(plan: Plan): number {
  return plan.invitees.filter((invitee) => invitee.status === "accepted").length;
}

export function describePlanStatus(plan: Plan, now = Date.now()): string {
  const timing = getPlanTiming(plan, now);
  if (timing.status === "cancelled") return "cancelled";
  if (timing.happeningNow) return "happening now";
  if (timing.status === "past") return "past";
  if (plan.ownerId !== "me") {
    if (plan.myStatus === "pending") return "waiting for your reply";
    if (plan.myStatus === "accepted") return "you're going";
    return "you declined";
  }
  const accepted = countAcceptedInvitees(plan);
  return accepted > 0 ? `${accepted} friend${accepted === 1 ? "" : "s"} in` : "just you so far";
}

/* ------------------------------------------------------------------ */
/* Profile validation                                                  */
/* ------------------------------------------------------------------ */

export function validateProfile(profile: ProfileState): ProfileErrors {
  const errors: ProfileErrors = {};
  const name = profile.name.trim();
  if (name.length < 2) errors.name = "Display name needs at least 2 characters.";
  else if (name.length > 40) errors.name = "Display name must be 40 characters or fewer.";
  if (!profile.preferredMoods.length) errors.preferredMoods = "Pick at least one interest.";
  else if (profile.preferredMoods.length > 6) errors.preferredMoods = "Pick up to six interests.";
  if (new Set(profile.preferredMoods).size !== profile.preferredMoods.length) {
    errors.preferredMoods = "Each interest can only be picked once.";
  }
  if (!isBreakDuration(profile.defaultDuration)) errors.defaultDuration = "Choose a valid default break length.";
  if (!isBudget(profile.defaultBudget)) errors.defaultBudget = "Choose a valid default budget.";
  if (!isCompany(profile.company)) errors.company = "Choose a valid company preference.";
  if (!isAvailability(profile.availability)) errors.availability = "Choose a valid availability state.";
  if (!isAvailabilityWindow(profile.availabilityWindowMin)) {
    errors.availabilityWindowMin = "Choose a valid availability window.";
  }
  return errors;
}

export function updateProfileFields(
  state: EscapeState,
  patch: Partial<ProfileState>,
  now = Date.now(),
): StateResult {
  const nextProfile = { ...state.profile, ...patch };
  if (typeof nextProfile.name === "string") nextProfile.name = nextProfile.name.trim();
  const errors = validateProfile(nextProfile);
  if (Object.keys(errors).length > 0) {
    return { state, error: Object.values(errors)[0] ?? "That profile change isn't valid." };
  }
  return {
    state: touch(state, now, { profile: nextProfile }),
    error: null,
  };
}

/* ------------------------------------------------------------------ */
/* Challenges & Gamification Logic                                    */
/* ------------------------------------------------------------------ */

export type PlaceDiscoveryResult = {
  state: EscapeState;
  isNewDiscovery: boolean;
  awarded: boolean;
  challengeCompleted?: string;
  badgeEarned?: string;
  pointsEarned?: number;
};

export function recordPlaceDiscovery(
  state: EscapeState,
  placeId: string,
  now = Date.now(),
): PlaceDiscoveryResult {
  if (!placeById.has(placeId)) {
    return { state, isNewDiscovery: false, awarded: false };
  }

  const existing = state.challenges.discoveredPlaceIds;
  const isNewDiscovery = !existing.includes(placeId);
  if (!isNewDiscovery) {
    return { state, isNewDiscovery: false, awarded: false };
  }

  const nextDiscovered = [...existing, placeId];
  let pointsEarned = 0;
  let challengeCompleted: string | undefined;
  let badgeEarned: string | undefined;

  const completed = [...state.challenges.completedChallengeIds];
  const badges = [...state.challenges.earnedBadgeIds];
  const lastAwardedAt = { ...state.challenges.lastAwardedAt };

  // Check Campus Explorer challenge (requires 3 distinct places)
  if (nextDiscovered.length >= 3 && !completed.includes("campus-explorer")) {
    completed.push("campus-explorer");
    pointsEarned += 150;
    challengeCompleted = "campus-explorer";
    lastAwardedAt["campus-explorer"] = now;
    if (!badges.includes("badge-explorer-scout")) {
      badges.push("badge-explorer-scout");
      badgeEarned = "badge-explorer-scout";
    }
  }

  const nextChallenges: ChallengesState = {
    ...state.challenges,
    discoveredPlaceIds: nextDiscovered,
    completedChallengeIds: completed,
    earnedBadgeIds: badges,
    points: state.challenges.points + pointsEarned,
    lastAwardedAt,
  };

  return {
    state: touch(state, now, { challenges: nextChallenges }),
    isNewDiscovery: true,
    awarded: pointsEarned > 0,
    challengeCompleted,
    badgeEarned,
    pointsEarned: pointsEarned > 0 ? pointsEarned : undefined,
  };
}

export function startDetoxTimer(
  state: EscapeState,
  durationSeconds = 15 * 60,
  now = Date.now(),
): { state: EscapeState; error: string | null } {
  const currentTimer = state.challenges.activeDetoxTimer;
  if (currentTimer) {
    const finishesAt = currentTimer.startedAt + currentTimer.durationSeconds * 1000;
    if (now < finishesAt) {
      return { state, error: "A digital detox timer is already counting down." };
    }
  }

  const nextChallenges: ChallengesState = {
    ...state.challenges,
    activeDetoxTimer: {
      startedAt: now,
      durationSeconds,
    },
  };

  return {
    state: touch(state, now, { challenges: nextChallenges }),
    error: null,
  };
}

export function cancelDetoxTimer(state: EscapeState, now = Date.now()): EscapeState {
  if (!state.challenges.activeDetoxTimer) return state;
  return touch(state, now, {
    challenges: {
      ...state.challenges,
      activeDetoxTimer: null,
    },
  });
}

export type ClaimDetoxResult = {
  state: EscapeState;
  error: string | null;
  pointsEarned?: number;
  badgeEarned?: string;
};

export function claimDetoxTimer(state: EscapeState, now = Date.now()): ClaimDetoxResult {
  const timer = state.challenges.activeDetoxTimer;
  if (!timer) {
    return { state, error: "No active detox timer to complete." };
  }

  const finishesAt = timer.startedAt + timer.durationSeconds * 1000;
  if (now < finishesAt) {
    const remainingSeconds = Math.ceil((finishesAt - now) / 1000);
    const min = Math.ceil(remainingSeconds / 60);
    return { state, error: `Timer not finished yet (${min} min remaining). Step away from screens!` };
  }

  // Prevent accidental rapid duplicate claim
  const lastClaimed = state.challenges.lastAwardedAt["digital-detox"] || 0;
  if (now - lastClaimed < 2000) {
    return { state, error: "Detox reward was just claimed." };
  }

  const pointsEarned = 100;
  const badges = [...state.challenges.earnedBadgeIds];
  let badgeEarned: string | undefined;
  if (!badges.includes("badge-zen-master")) {
    badges.push("badge-zen-master");
    badgeEarned = "badge-zen-master";
  }

  const completed = state.challenges.completedChallengeIds.includes("digital-detox")
    ? state.challenges.completedChallengeIds
    : [...state.challenges.completedChallengeIds, "digital-detox"];

  const repeatableCompletions = {
    ...state.challenges.repeatableCompletions,
    "digital-detox": (state.challenges.repeatableCompletions["digital-detox"] || 0) + 1,
  };

  const sessionRecord: CompletedDetoxRecord = {
    id: `detox-${now}`,
    completedAt: now,
    durationMinutes: Math.round(timer.durationSeconds / 60),
  };

  const nextChallenges: ChallengesState = {
    ...state.challenges,
    activeDetoxTimer: null,
    completedDetoxSessions: [sessionRecord, ...state.challenges.completedDetoxSessions],
    completedChallengeIds: completed,
    repeatableCompletions,
    earnedBadgeIds: badges,
    points: state.challenges.points + pointsEarned,
    lastAwardedAt: {
      ...state.challenges.lastAwardedAt,
      "digital-detox": now,
    },
  };

  return {
    state: touch(state, now, { challenges: nextChallenges }),
    error: null,
    pointsEarned,
    badgeEarned,
  };
}

export type StudySessionResult = {
  state: EscapeState;
  error: string | null;
  pointsEarned?: number;
  badgeEarned?: string;
};

export function recordStudySession(
  state: EscapeState,
  params: { friendId?: string; planId?: string; note?: string },
  now = Date.now(),
): StudySessionResult {
  if (!params.friendId && !params.planId) {
    return { state, error: "Choose a classmate or existing plan to record your study session." };
  }

  // Duplicate plan prevention
  if (params.planId) {
    const existing = state.challenges.completedStudySessions.some((s) => s.planId === params.planId);
    if (existing) {
      return { state, error: "This study plan has already been recorded for a challenge reward." };
    }
  }

  // Demo friend check
  if (params.friendId) {
    if (!friendById.has(params.friendId)) {
      return { state, error: "Classmate not found in directory." };
    }
    // Prevent rapid duplicate recording with the same friend within 10 seconds
    const recent = state.challenges.completedStudySessions.find(
      (s) => s.friendId === params.friendId && now - s.completedAt < 10_000,
    );
    if (recent) {
      return { state, error: "A study session with this friend was recorded a moment ago." };
    }
  }

  // Debounce duplicate claim
  const lastClaimed = state.challenges.lastAwardedAt["study-buddy"] || 0;
  if (now - lastClaimed < 1500) {
    return { state, error: "Reward recently claimed." };
  }

  const recordId = params.planId
    ? `study-plan-${params.planId}`
    : `study-${params.friendId}-${now}`;

  const record: CompletedStudyRecord = {
    id: recordId,
    friendId: params.friendId,
    planId: params.planId,
    note: params.note?.trim() || undefined,
    completedAt: now,
  };

  const isFirstCompletion = !state.challenges.completedChallengeIds.includes("study-buddy");
  const pointsEarned = 120;
  const badges = [...state.challenges.earnedBadgeIds];
  let badgeEarned: string | undefined;

  if (!badges.includes("badge-study-squad")) {
    badges.push("badge-study-squad");
    badgeEarned = "badge-study-squad";
  }

  const completed = isFirstCompletion
    ? [...state.challenges.completedChallengeIds, "study-buddy"]
    : state.challenges.completedChallengeIds;

  const repeatableCompletions = {
    ...state.challenges.repeatableCompletions,
    "study-buddy": (state.challenges.repeatableCompletions["study-buddy"] || 0) + 1,
  };

  const nextChallenges: ChallengesState = {
    ...state.challenges,
    completedStudySessions: [record, ...state.challenges.completedStudySessions],
    completedChallengeIds: completed,
    repeatableCompletions,
    earnedBadgeIds: badges,
    points: state.challenges.points + pointsEarned,
    lastAwardedAt: {
      ...state.challenges.lastAwardedAt,
      "study-buddy": now,
    },
  };

  return {
    state: touch(state, now, { challenges: nextChallenges }),
    error: null,
    pointsEarned,
    badgeEarned,
  };
}

export type GreenEscapeResult = {
  state: EscapeState;
  error: string | null;
  pointsEarned?: number;
  badgeEarned?: string;
};

export function recordGreenEscape(
  state: EscapeState,
  itemId: string,
  now = Date.now(),
): GreenEscapeResult {
  const isQualifying =
    isGreenSpaceItem(itemId) ||
    (placeById.has(itemId) && placeById.get(itemId)?.category === "Green space") ||
    (activityById.has(itemId) && activityById.get(itemId)?.tags.includes("greenery"));

  if (!isQualifying) {
    return { state, error: "That spot or activity doesn't qualify as a green space." };
  }

  // Count distinct qualifying activities or valid recorded completions
  const alreadyVisitedThisItem = state.challenges.completedGreenEscapes.some((g) => g.itemId === itemId);
  if (alreadyVisitedThisItem) {
    // If already visited this exact item, prevent immediate duplicate within 30 minutes
    const recent = state.challenges.completedGreenEscapes.find(
      (g) => g.itemId === itemId && now - g.completedAt < 30 * 60_000,
    );
    if (recent) {
      return { state, error: "This green space visit was recently recorded." };
    }
  }

  // Debounce
  const lastClaimed = state.challenges.lastAwardedAt["green-escape"] || 0;
  if (now - lastClaimed < 1500) {
    return { state, error: "Reward recently claimed." };
  }

  const record: CompletedGreenRecord = {
    id: `green-${itemId}-${now}`,
    itemId,
    completedAt: now,
  };

  const isFirstCompletion = !state.challenges.completedChallengeIds.includes("green-escape");
  const pointsEarned = 80;
  const badges = [...state.challenges.earnedBadgeIds];
  let badgeEarned: string | undefined;

  if (!badges.includes("badge-green-thumb")) {
    badges.push("badge-green-thumb");
    badgeEarned = "badge-green-thumb";
  }

  const completed = isFirstCompletion
    ? [...state.challenges.completedChallengeIds, "green-escape"]
    : state.challenges.completedChallengeIds;

  const repeatableCompletions = {
    ...state.challenges.repeatableCompletions,
    "green-escape": (state.challenges.repeatableCompletions["green-escape"] || 0) + 1,
  };

  const nextChallenges: ChallengesState = {
    ...state.challenges,
    completedGreenEscapes: [record, ...state.challenges.completedGreenEscapes],
    completedChallengeIds: completed,
    repeatableCompletions,
    earnedBadgeIds: badges,
    points: state.challenges.points + pointsEarned,
    lastAwardedAt: {
      ...state.challenges.lastAwardedAt,
      "green-escape": now,
    },
  };

  return {
    state: touch(state, now, { challenges: nextChallenges }),
    error: null,
    pointsEarned,
    badgeEarned,
  };
}

export function recordChaiSession(
  state: EscapeState,
  params: { friendId?: string; planId?: string },
  now = Date.now(),
): { state: EscapeState; error: string | null; pointsEarned?: number; badgeEarned?: string } {
  if (params.friendId && !friendById.has(params.friendId)) {
    return { state, error: "Friend not found." };
  }
  const lastClaimed = state.challenges.lastAwardedAt["chai-committee"] || 0;
  if (now - lastClaimed < 1500) {
    return { state, error: "Reward recently claimed." };
  }

  const record: CompletedChaiRecord = {
    id: `chai-${params.friendId ?? "plan"}-${now}`,
    friendId: params.friendId,
    planId: params.planId,
    completedAt: now,
  };

  const pointsEarned = 90;
  const badges = [...state.challenges.earnedBadgeIds];
  let badgeEarned: string | undefined;
  if (!badges.includes("badge-chai-connoisseur")) {
    badges.push("badge-chai-connoisseur");
    badgeEarned = "badge-chai-connoisseur";
  }

  const completed = state.challenges.completedChallengeIds.includes("chai-committee")
    ? state.challenges.completedChallengeIds
    : [...state.challenges.completedChallengeIds, "chai-committee"];

  const nextChallenges: ChallengesState = {
    ...state.challenges,
    completedChaiSessions: [record, ...state.challenges.completedChaiSessions],
    completedChallengeIds: completed,
    earnedBadgeIds: badges,
    points: state.challenges.points + pointsEarned,
    lastAwardedAt: {
      ...state.challenges.lastAwardedAt,
      "chai-committee": now,
    },
  };

  return {
    state: touch(state, now, { challenges: nextChallenges }),
    error: null,
    pointsEarned,
    badgeEarned,
  };
}

export function checkCuriousWanderer(
  state: EscapeState,
  now = Date.now(),
): { state: EscapeState; pointsEarned?: number; badgeEarned?: string } {
  if (state.savedIds.length >= 3 && !state.challenges.completedChallengeIds.includes("curious-wanderer")) {
    const pointsEarned = 100;
    const badges = [...state.challenges.earnedBadgeIds];
    let badgeEarned: string | undefined;
    if (!badges.includes("badge-pocket-curator")) {
      badges.push("badge-pocket-curator");
      badgeEarned = "badge-pocket-curator";
    }

    const nextChallenges: ChallengesState = {
      ...state.challenges,
      completedChallengeIds: [...state.challenges.completedChallengeIds, "curious-wanderer"],
      earnedBadgeIds: badges,
      points: state.challenges.points + pointsEarned,
      lastAwardedAt: {
        ...state.challenges.lastAwardedAt,
        "curious-wanderer": now,
      },
    };

    return {
      state: touch(state, now, { challenges: nextChallenges }),
      pointsEarned,
      badgeEarned,
    };
  }
  return { state };
}

export type ChallengeProgress = {
  current: number;
  target: number;
  percentage: number;
  isCompleted: boolean;
  isReadyToClaim: boolean;
  label: string;
  timerRemainingSeconds?: number;
};

export function getChallengeProgress(
  state: EscapeState,
  challengeId: string,
  now = Date.now(),
): ChallengeProgress {
  const isCompleted = state.challenges.completedChallengeIds.includes(challengeId);

  switch (challengeId) {
    case "campus-explorer": {
      const current = Math.min(state.challenges.discoveredPlaceIds.length, 3);
      return {
        current,
        target: 3,
        percentage: Math.round((current / 3) * 100),
        isCompleted,
        isReadyToClaim: current >= 3 && !isCompleted,
        label: `${current}/3 spots discovered`,
      };
    }
    case "digital-detox": {
      const timer = state.challenges.activeDetoxTimer;
      if (timer) {
        const finishesAt = timer.startedAt + timer.durationSeconds * 1000;
        const remainingSeconds = Math.max(0, Math.ceil((finishesAt - now) / 1000));
        const elapsedSeconds = timer.durationSeconds - remainingSeconds;
        const current = Math.floor(elapsedSeconds / 60);
        const percentage = Math.min(100, Math.round((elapsedSeconds / timer.durationSeconds) * 100));
        const isReadyToClaim = remainingSeconds <= 0;
        return {
          current,
          target: 15,
          percentage,
          isCompleted: false,
          isReadyToClaim,
          timerRemainingSeconds: remainingSeconds,
          label: isReadyToClaim
            ? "15/15 min · Ready to claim!"
            : `${Math.floor(remainingSeconds / 60)}:${String(remainingSeconds % 60).padStart(2, "0")} remaining`,
        };
      }
      const count = state.challenges.completedDetoxSessions.length;
      return {
        current: isCompleted ? 15 : 0,
        target: 15,
        percentage: isCompleted ? 100 : 0,
        isCompleted,
        isReadyToClaim: false,
        label: isCompleted
          ? `${count} break${count === 1 ? "" : "s"} completed`
          : "0/15 min timer",
      };
    }
    case "study-buddy": {
      const current = Math.min(state.challenges.completedStudySessions.length, 1);
      return {
        current,
        target: 1,
        percentage: current >= 1 ? 100 : 0,
        isCompleted,
        isReadyToClaim: current >= 1 && !isCompleted,
        label: `${current}/1 study session`,
      };
    }
    case "green-escape": {
      const current = Math.min(state.challenges.completedGreenEscapes.length, 1);
      return {
        current,
        target: 1,
        percentage: current >= 1 ? 100 : 0,
        isCompleted,
        isReadyToClaim: current >= 1 && !isCompleted,
        label: `${current}/1 green space visited`,
      };
    }
    case "chai-committee": {
      const current = Math.min(state.challenges.completedChaiSessions.length, 1);
      return {
        current,
        target: 1,
        percentage: current >= 1 ? 100 : 0,
        isCompleted,
        isReadyToClaim: current >= 1 && !isCompleted,
        label: `${current}/1 chai/snack break`,
      };
    }
    case "curious-wanderer": {
      const current = Math.min(state.savedIds.length, 3);
      return {
        current,
        target: 3,
        percentage: Math.round((current / 3) * 100),
        isCompleted,
        isReadyToClaim: current >= 3 && !isCompleted,
        label: `${current}/3 saved items`,
      };
    }
    default:
      return {
        current: isCompleted ? 1 : 0,
        target: 1,
        percentage: isCompleted ? 100 : 0,
        isCompleted,
        isReadyToClaim: false,
        label: isCompleted ? "Completed" : "Not started",
      };
  }
}

export type ChallengesSummary = {
  totalPoints: number;
  completedCount: number;
  totalChallenges: number;
  earnedBadgesCount: number;
  totalBadges: number;
  activeTimerRemainingSeconds?: number;
};

export function getChallengesSummary(state: EscapeState, now = Date.now()): ChallengesSummary {
  const timer = state.challenges.activeDetoxTimer;
  let activeTimerRemainingSeconds: number | undefined;
  if (timer) {
    const finishesAt = timer.startedAt + timer.durationSeconds * 1000;
    activeTimerRemainingSeconds = Math.max(0, Math.ceil((finishesAt - now) / 1000));
  }
  return {
    totalPoints: state.challenges.points,
    completedCount: state.challenges.completedChallengeIds.length,
    totalChallenges: challengesList.length,
    earnedBadgesCount: state.challenges.earnedBadgeIds.length,
    totalBadges: badgesCatalog.length,
    activeTimerRemainingSeconds,
  };
}
