import type { FinderTab } from "./escape-data";
import {
  ESCAPE_STATE_VERSION,
  createDefaultState,
  normalizeState,
  type DiscoveryPreferences,
  type EscapeState,
  type ProfileState,
  type SortMode,
} from "./escape-logic";

export const STORAGE_KEY = "escape-state-v2";
export const LEGACY_STORAGE_KEY = "escape-demo-state-v1";
export const STORAGE_BACKUP_KEY = "escape-state-v2-corrupt-backup";

export type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem?: (key: string) => void;
};

export type StorageWarning = "reset" | "migrated" | "unavailable" | "version" | null;

export type LoadResult = {
  state: EscapeState;
  warning: StorageWarning;
  message: string | null;
};

export type SaveResult = {
  ok: boolean;
  error: string | null;
};

type LegacyState = {
  prefs?: Partial<DiscoveryPreferences>;
  sortMode?: SortMode;
  savedIds?: unknown;
  profile?: Partial<ProfileState>;
  finderTab?: FinderTab;
  invitedIds?: unknown;
  latestPlan?: unknown;
};

/**
 * Loads the app state from a web storage implementation.
 *
 * The function never throws: corrupt JSON is moved to a backup key and a fresh
 * state is returned with a warning, and blocked storage (private browsing,
 * embedded webviews) falls back to an in-memory state for the session.
 */
export function loadEscapeState(storage: StorageLike | null | undefined, now = Date.now()): LoadResult {
  if (!storage) {
    return {
      state: createDefaultState(now),
      warning: "unavailable",
      message: "This browser won't let ESCAPE save data. Changes will disappear when the tab closes.",
    };
  }

  let raw: string | null = null;
  try {
    raw = storage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      const version =
        parsed && typeof parsed === "object" && "version" in parsed
          ? (parsed as { version?: unknown }).version
          : null;
      const state = normalizeState(parsed, now);
      return {
        state,
        warning: version === ESCAPE_STATE_VERSION ? null : "version",
        message:
          version === ESCAPE_STATE_VERSION
            ? null
            : "ESCAPE updated your saved data to the latest format.",
      };
    }

    const legacyRaw = storage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw) as LegacyState;
      const migrated = migrateLegacyState(legacy, now);
      saveEscapeState(storage, migrated);
      return {
        state: migrated,
        warning: "migrated",
        message: "Your saved places and preferences were moved to the new storage format.",
      };
    }
  } catch {
    if (typeof raw === "string") {
      try {
        storage.setItem(STORAGE_BACKUP_KEY, raw);
      } catch {
        // A backup is best-effort; a full or blocked store can still fail here.
      }
    }
    return {
      state: createDefaultState(now),
      warning: "reset",
      message: "Saved data couldn't be read, so ESCAPE started fresh. Your old data was backed up when possible.",
    };
  }

  return { state: createDefaultState(now), warning: null, message: null };
}

export function migrateLegacyState(legacy: LegacyState, now = Date.now()): EscapeState {
  const base = createDefaultState(now);
  const profile: ProfileState = {
    ...base.profile,
    ...(legacy.profile && typeof legacy.profile === "object" ? legacy.profile : {}),
    availabilityUntil:
      legacy.profile?.availability === "available" ? now + 60 * 60_000 : base.profile.availabilityUntil,
    availabilityWindowMin: 60,
    shareAvailability: true,
    shareProfile: true,
  };
  return normalizeState(
    {
      ...base,
      version: ESCAPE_STATE_VERSION,
      profile,
      prefs: { ...base.prefs, ...(legacy.prefs ?? {}) },
      sortMode: legacy.sortMode ?? base.sortMode,
      savedIds: legacy.savedIds ?? [],
      finderTab: legacy.finderTab ?? base.finderTab,
      // The legacy "invitedIds" array represented a toast-only demo action.
      // It is intentionally not converted into fake friend requests or plans.
      updatedAt: now,
    },
    now,
  );
}

export function saveEscapeState(storage: StorageLike | null | undefined, state: EscapeState): SaveResult {
  if (!storage) return { ok: false, error: "Storage is unavailable in this browser." };
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify({ ...state, version: ESCAPE_STATE_VERSION }));
    return { ok: true, error: null };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Couldn't save your changes.",
    };
  }
}

export function clearEscapeState(storage: StorageLike | null | undefined): void {
  if (!storage) return;
  try {
    storage.removeItem?.(STORAGE_KEY);
    storage.removeItem?.(LEGACY_STORAGE_KEY);
  } catch {
    // Clearing is best-effort.
  }
}
