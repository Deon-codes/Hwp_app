import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  activities,
  activityById,
  type Activity,
  type Availability,
  type BreakDuration,
  type Budget,
  type Company,
  friends,
  type FinderTab,
  type Mood,
  placeById,
  places,
} from "./escape-data";

export type View = "discover" | "find" | "saved" | "profile";
export type SortMode = "best" | "shortest" | "lowest";
export type DetailItem = Activity | (typeof places)[number];

export type ProfileState = {
  name: string;
  avatar: string;
  preferredMoods: Mood[];
  defaultDuration: BreakDuration;
  defaultBudget: Budget;
  company: Company;
  availability: Availability;
};

export type DiscoveryPreferences = {
  mood: Mood;
  duration: BreakDuration;
  budget: Budget;
  company: Company;
};

export type PlanState = {
  itemId: string;
  itemName: string;
  duration: BreakDuration;
  budget: Budget;
  friendIds: string[];
  createdAt: string;
};

type Toast = { id: number; message: string; tone: "success" | "info" };

type EscapeContextValue = {
  view: View;
  setView: (view: View) => void;
  prefs: DiscoveryPreferences;
  setMood: (mood: Mood) => void;
  setDuration: (duration: BreakDuration) => void;
  setBudget: (budget: Budget) => void;
  setCompany: (company: Company) => void;
  sortMode: SortMode;
  setSortMode: (mode: SortMode) => void;
  recommendations: Activity[];
  savedIds: string[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
  profile: ProfileState;
  updateProfile: (patch: Partial<ProfileState>) => void;
  setAvailability: (availability: Availability) => void;
  finderTab: FinderTab;
  setFinderTab: (tab: FinderTab) => void;
  invitedIds: string[];
  friends: typeof friends;
  inviteFriend: (friendId: string) => void;
  detailItem: DetailItem | null;
  openDetails: (item: DetailItem) => void;
  closeDetails: () => void;
  planItem: DetailItem | null;
  openPlanner: (item: DetailItem) => void;
  closePlanner: () => void;
  createPlan: (plan: Omit<PlanState, "createdAt">) => void;
  latestPlan: PlanState | null;
  toast: Toast | null;
  showToast: (message: string, tone?: Toast["tone"]) => void;
  clearToast: () => void;
  jumpToRecommendations: () => void;
};

const STORAGE_KEY = "escape-demo-state-v1";

const defaultProfile: ProfileState = {
  name: "Maya",
  avatar: "MS",
  preferredMoods: ["Social", "Chill"],
  defaultDuration: 15,
  defaultBudget: 50,
  company: "either",
  availability: "available",
};

const defaultPrefs: DiscoveryPreferences = {
  mood: "Chill",
  duration: 15,
  budget: 50,
  company: "either",
};

const viewFromPath = (path: string): View => {
  if (path === "/find") return "find";
  if (path === "/saved") return "saved";
  if (path === "/profile") return "profile";
  return "discover";
};

function readStored() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function maxDurationFor(duration: BreakDuration) {
  return duration;
}

function isCompanyMatch(social: Activity["social"], company: Company) {
  if (company === "either") return true;
  if (company === "solo") return social === "solo" || social === "both";
  return social === "friends" || social === "both";
}

export function EscapeProvider({ children }: { children: React.ReactNode }) {
  const stored = useMemo(readStored, []);
  const [view, setViewState] = useState<View>(() => viewFromPath(window.location.pathname));
  const [prefs, setPrefs] = useState<DiscoveryPreferences>(() => ({ ...defaultPrefs, ...stored?.prefs }));
  const [sortMode, setSortMode] = useState<SortMode>(() => stored?.sortMode ?? "best");
  const [savedIds, setSavedIds] = useState<string[]>(() => stored?.savedIds ?? []);
  const [profile, setProfile] = useState<ProfileState>(() => ({ ...defaultProfile, ...stored?.profile }));
  const [finderTab, setFinderTab] = useState<FinderTab>(() => stored?.finderTab ?? "spots");
  const [invitedIds, setInvitedIds] = useState<string[]>(() => stored?.invitedIds ?? []);
  const [latestPlan, setLatestPlan] = useState<PlanState | null>(() => stored?.latestPlan ?? null);
  const [detailItem, setDetailItem] = useState<DetailItem | null>(null);
  const [planItem, setPlanItem] = useState<DetailItem | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    const onPopState = () => setViewState(viewFromPath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ prefs, sortMode, savedIds, profile, finderTab, invitedIds, latestPlan }),
    );
  }, [prefs, sortMode, savedIds, profile, finderTab, invitedIds, latestPlan]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const setView = (nextView: View) => {
    setViewState(nextView);
    const path = nextView === "discover" ? "/" : `/${nextView === "find" ? "find" : nextView}`;
    if (window.location.pathname !== path) window.history.pushState({}, "", path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const recommendations = useMemo(() => {
    const filtered = activities.filter((activity) => {
      const moodMatch = activity.moods.includes(prefs.mood);
      const budgetMatch = activity.price <= prefs.budget;
      const durationMatch = activity.durationMin <= maxDurationFor(prefs.duration);
      const companyMatch = isCompanyMatch(activity.social, prefs.company);
      return moodMatch && budgetMatch && durationMatch && companyMatch;
    });

    return [...filtered].sort((a, b) => {
      if (sortMode === "shortest") return a.durationMin - b.durationMin || a.walkMin - b.walkMin;
      if (sortMode === "lowest") return a.price - b.price || a.durationMin - b.durationMin;
      const score = (activity: Activity) => {
        const moodScore = activity.moods.includes(prefs.mood) ? 3 : 0;
        const companyScore = activity.social === prefs.company || activity.social === "both" ? 2 : 0;
        const timeScore = activity.durationMin === prefs.duration ? 1 : 0;
        return moodScore + companyScore + timeScore;
      };
      return score(b) - score(a);
    });
  }, [prefs, sortMode]);

  const updateProfile = (patch: Partial<ProfileState>) => {
    setProfile((current) => ({ ...current, ...patch }));
  };

  const showToast = (message: string, tone: Toast["tone"] = "success") => {
    setToast({ id: Date.now(), message, tone });
  };

  const toggleSaved = (id: string) => {
    setSavedIds((current) => {
      const next = current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id];
      showToast(current.includes(id) ? "removed from your little collection" : "saved for a later little escape");
      return next;
    });
  };

  const inviteFriend = (friendId: string) => {
    setInvitedIds((current) => (current.includes(friendId) ? current : [...current, friendId]));
    showToast("invite sent! now we wait for the chai committee.");
  };

  const createPlan = (plan: Omit<PlanState, "createdAt">) => {
    setLatestPlan({ ...plan, createdAt: new Date().toISOString() });
    setPlanItem(null);
    showToast("break plans: looking good.");
  };

  const jumpToRecommendations = () => {
    setView("discover");
    window.setTimeout(() => document.getElementById("recommendations")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };

  const contextValue: EscapeContextValue = {
    view,
    setView,
    prefs,
    setMood: (mood) => setPrefs((current) => ({ ...current, mood })),
    setDuration: (duration) => setPrefs((current) => ({ ...current, duration })),
    setBudget: (budget) => setPrefs((current) => ({ ...current, budget })),
    setCompany: (company) => setPrefs((current) => ({ ...current, company })),
    sortMode,
    setSortMode,
    recommendations,
    savedIds,
    isSaved: (id) => savedIds.includes(id),
    toggleSaved,
    profile,
    updateProfile,
    setAvailability: (availability) => {
      updateProfile({ availability });
      showToast(availability === "available" ? "you’re visible for a little break" : availability === "busy" ? "got it — focus time protected" : "you’re hidden until you say otherwise", "info");
    },
    finderTab,
    setFinderTab,
    invitedIds,
    friends,
    inviteFriend,
    detailItem,
    openDetails: setDetailItem,
    closeDetails: () => setDetailItem(null),
    planItem,
    openPlanner: setPlanItem,
    closePlanner: () => setPlanItem(null),
    createPlan,
    latestPlan,
    toast,
    showToast,
    clearToast: () => setToast(null),
    jumpToRecommendations,
  };

  return <EscapeContext.Provider value={contextValue}>{children}</EscapeContext.Provider>;
}

const EscapeContext = createContext<EscapeContextValue | null>(null);

export function useEscape() {
  const context = useContext(EscapeContext);
  if (!context) throw new Error("useEscape must be used inside EscapeProvider");
  return context;
}

export function getSavedItems(ids: string[]) {
  return ids.map((id) => activityById.get(id) ?? placeById.get(id)).filter(Boolean) as DetailItem[];
}

export { friends, places };
