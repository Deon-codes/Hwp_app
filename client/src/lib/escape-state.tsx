import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  activities,
  activityById,
  type Activity,
  type AvailabilityWindow,
  type FinderTab,
  type Friend,
  type Mood,
  placeById,
  type Place,
} from "./escape-data";
import {
  acceptFriendRequest as acceptFriendRequestLogic,
  cancelPlan as cancelPlanLogic,
  createPlan as createPlanLogic,
  getAvailabilityView,
  getAcceptedFriends,
  getAvailableFriends,
  getFriendViews,
  getNextPlan,
  getPlanBuckets,
  initialsFromName,
  normalizeState,
  rejectFriendRequest as rejectFriendRequestLogic,
  removeFriend as removeFriendLogic,
  respondToPlan as respondToPlanLogic,
  sendFriendRequest as sendFriendRequestLogic,
  setAvailability as setAvailabilityLogic,
  setAvailabilityWindow as setAvailabilityWindowLogic,
  toggleSavedId,
  updatePlan as updatePlanLogic,
  updateProfileFields,
  validatePlanDraft,
  withdrawFriendRequest as withdrawFriendRequestLogic,
  type AvailabilityView,
  type DiscoveryPreferences,
  type EscapeState,
  type Plan,
  type PlanBuckets,
  type PlanDraft,
  type PlanTab,
  type PlanDraftErrors,
  type PlanResult,
  type ProfileState,
  type SortMode,
  type View,
} from "./escape-logic";
import { loadEscapeState, saveEscapeState, STORAGE_KEY, type StorageLike } from "./escape-storage";

export type { AvailabilityView, DetailItem, Plan, PlanBuckets, PlanDraft, ProfileState, View } from "./escape-logic";
export type RouteView = View | "notfound";

export type PlannerState = {
  item: Activity | Place;
  friendIds: string[];
  plan: Plan | null;
};

type Toast = { id: number; message: string; tone: "success" | "info" | "error" };

type EscapeContextValue = {
  view: RouteView;
  setView: (view: View) => void;
  prefs: DiscoveryPreferences;
  setMood: (mood: Mood) => void;
  setDuration: (duration: DiscoveryPreferences["duration"]) => void;
  setBudget: (budget: DiscoveryPreferences["budget"]) => void;
  setCompany: (company: DiscoveryPreferences["company"]) => void;
  finderTab: FinderTab;
  setFinderTab: (tab: FinderTab) => void;
  sortMode: SortMode;
  setSortMode: (mode: SortMode) => void;
  savedIds: string[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
  profile: ProfileState;
  updateProfile: (patch: Partial<ProfileState>) => boolean;
  availability: AvailabilityView;
  setAvailability: (availability: ProfileState["availability"]) => void;
  setAvailabilityWindow: (window: AvailabilityWindow) => void;
  toggleShareAvailability: () => void;
  toggleShareProfile: () => void;
  friends: Friend[];
  availableFriends: Friend[];
  acceptedFriends: Friend[];
  incomingRequests: Friend[];
  outgoingRequests: Friend[];
  sendFriendRequest: (friendId: string) => void;
  acceptFriendRequest: (friendId: string) => void;
  rejectFriendRequest: (friendId: string) => void;
  withdrawFriendRequest: (friendId: string) => void;
  removeFriend: (friendId: string) => void;
  inviteFriend: (friendId: string) => void;
  plans: Plan[];
  planBuckets: PlanBuckets;
  nextPlan: Plan | null;
  pendingInviteCount: number;
  createPlan: (draft: PlanDraft) => PlanResult;
  savePlanEdits: (planId: string, draft: PlanDraft) => PlanResult;
  cancelPlan: (planId: string) => void;
  respondToPlan: (planId: string, response: "accepted" | "declined") => void;
  validatePlan: (draft: PlanDraft, editingPlanId?: string) => PlanDraftErrors;
  detailItem: Activity | Place | null;
  openDetails: (item: Activity | Place) => void;
  closeDetails: () => void;
  planner: PlannerState | null;
  openPlanner: (item: Activity | Place, friendIds?: string[]) => void;
  openPlanEditor: (plan: Plan) => void;
  closePlanner: () => void;
  plansOpen: boolean;
  plansTab: PlanTab;
  setPlansTab: (tab: PlanTab) => void;
  openPlans: (tab?: PlanTab) => void;
  closePlans: () => void;
  toast: Toast | null;
  showToast: (message: string, tone?: Toast["tone"]) => void;
  clearToast: () => void;
  jumpToRecommendations: () => void;
  jumpToPreferences: () => void;
  openPeople: () => void;
  openSpots: () => void;
};

const EscapeContext = createContext<EscapeContextValue | null>(null);

const routeFromPath = (path: string): RouteView => {
  const normalized = path.replace(/\/+$/, "") || "/";
  if (normalized === "/") return "discover";
  if (normalized === "/find") return "find";
  if (normalized === "/saved") return "saved";
  if (normalized === "/profile") return "profile";
  return "notfound";
};

const pathForView = (view: View) => (view === "discover" ? "/" : `/${view}`);

const titleForView = (view: RouteView) =>
  view === "find"
    ? "Break Finder · ESCAPE"
    : view === "saved"
      ? "Saved · ESCAPE"
      : view === "profile"
        ? "Profile · ESCAPE"
        : view === "notfound"
          ? "Not found · ESCAPE"
          : "Discover · ESCAPE";

function getStorage(): StorageLike | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function defaultActivityFor(friend: Friend): Activity {
  const byMood = activities.find((activity) => activity.moods.includes(friend.mood));
  return byMood ?? activities[0];
}

export function EscapeProvider({ children }: { children: React.ReactNode }) {
  const storage = useMemo(getStorage, []);
  const initial = useMemo(() => loadEscapeState(storage, Date.now()), [storage]);
  const [state, setStateRaw] = useState<EscapeState>(initial.state);
  // State also lives in a ref so two actions fired in the same tick (for
  // example toggling two profile switches quickly) build on each other instead
  // of both reading a stale render snapshot and dropping one another.
  const stateRef = useRef(state);
  const setState = useCallback((next: EscapeState | ((current: EscapeState) => EscapeState)) => {
    const value = typeof next === "function" ? next(stateRef.current) : next;
    stateRef.current = value;
    setStateRaw(value);
  }, []);
  const [clock, setClock] = useState(() => Date.now());
  const [view, setViewState] = useState<RouteView>(() =>
    typeof window === "undefined" ? "discover" : routeFromPath(window.location.pathname),
  );
  const [detailItem, setDetailItem] = useState<Activity | Place | null>(null);
  const [planner, setPlanner] = useState<PlannerState | null>(null);
  const [plansOpen, setPlansOpen] = useState(false);
  const [plansTab, setPlansTab] = useState<PlanTab>("upcoming");
  const [toast, setToast] = useState<Toast | null>(null);
  const saveFailureShown = useRef(false);
  const skipNextStorageWrite = useRef(false);
  const lastPlanSignature = useRef<{ signature: string; at: number } | null>(null);
  const initialMessageShown = useRef(false);

  const showToast = useCallback((message: string, tone: Toast["tone"] = "success") => {
    setToast({ id: Date.now() + Math.random(), message, tone });
  }, []);

  // Restore any migration/reset notice once, after first paint.
  useEffect(() => {
    if (initialMessageShown.current) return;
    initialMessageShown.current = true;
    if (initial.message) showToast(initial.message, initial.warning === "reset" ? "error" : "info");
  }, [initial.message, initial.warning, showToast]);

  // Keep route state in sync with browser history and direct navigation.
  useEffect(() => {
    const onPopState = () => {
      setViewState(routeFromPath(window.location.pathname));
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    document.title = titleForView(view);
  }, [view]);

  // Persist every meaningful state change. Writes that merely mirror another
  // tab's storage event are skipped, so two tabs cannot echo each other forever.
  useEffect(() => {
    if (skipNextStorageWrite.current) {
      skipNextStorageWrite.current = false;
      return;
    }
    const result = saveEscapeState(storage, state);
    if (!result.ok && !saveFailureShown.current) {
      saveFailureShown.current = true;
      showToast(
        storage
          ? "ESCAPE couldn't save this change. Your tab may be out of storage or in a restricted mode."
          : "This browser blocks local storage, so changes last for this session only.",
        "error",
      );
    }
  }, [state, storage, showToast]);

  // Pick up changes made in another tab.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try {
        const parsed: unknown = JSON.parse(event.newValue);
        const incoming = normalizeState(parsed, Date.now());
        if (JSON.stringify(incoming) === JSON.stringify(stateRef.current)) return;
        skipNextStorageWrite.current = true;
        setState(incoming);
      } catch {
        // Ignore malformed writes from other tabs.
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // A lightweight clock keeps availability countdowns and plan statuses honest
  // without polling or any server calls.
  useEffect(() => {
    const timer = window.setInterval(() => setClock(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const availability = useMemo(() => getAvailabilityView(state.profile, clock), [state.profile, clock]);

  // When a visibility window lapses, move the profile back to hidden so what is
  // stored matches what friends are allowed to see.
  useEffect(() => {
    if (!availability.expired) return;
    setState((current) =>
      getAvailabilityView(current.profile, clock).expired
        ? setAvailabilityLogic(current, "hidden", clock)
        : current,
    );
  }, [availability.expired, clock]);

  const friends = useMemo(() => getFriendViews(state, clock), [state, clock]);
  const availableFriends = useMemo(() => getAvailableFriends(state, clock), [state, clock]);
  const acceptedFriends = useMemo(() => getAcceptedFriends(state, clock), [state, clock]);
  const incomingRequests = useMemo(
    () => friends.filter((friend) => friend.relationship === "incoming"),
    [friends],
  );
  const outgoingRequests = useMemo(
    () => friends.filter((friend) => friend.relationship === "outgoing"),
    [friends],
  );
  const planBuckets = useMemo(() => getPlanBuckets(state, clock), [state, clock]);
  const nextPlan = useMemo(() => getNextPlan(state, clock), [state, clock]);

  const setView = (nextView: View) => {
    setViewState(nextView);
    const path = pathForView(nextView);
    if (window.location.pathname !== path) window.history.pushState({}, "", path);
    setDetailItem(null);
    setPlanner(null);
    setPlansOpen(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const setPrefsPatch = (patch: Partial<DiscoveryPreferences>, message?: string) => {
    setState((current) => ({
      ...current,
      prefs: { ...current.prefs, ...patch },
      updatedAt: Date.now(),
    }));
    if (message) showToast(message, "info");
  };

  const updateProfile = (patch: Partial<ProfileState>): boolean => {
    const nextPatch = { ...patch };
    if (patch.name !== undefined) {
      const trimmed = patch.name.trim().slice(0, 40);
      nextPatch.name = trimmed;
      nextPatch.avatar = initialsFromName(trimmed);
    }
    const result = updateProfileFields(stateRef.current, nextPatch, Date.now());
    if (result.error) {
      showToast(result.error, "error");
      return false;
    }
    setState(result.state);
    return true;
  };

  const setAvailability = (nextAvailability: ProfileState["availability"]) => {
    const nextState = setAvailabilityLogic(stateRef.current, nextAvailability, Date.now());
    setState(nextState);
    setClock(Date.now());
    const nextView = getAvailabilityView(nextState.profile, Date.now());
    showToast(
      nextAvailability === "available"
        ? nextState.profile.shareAvailability
          ? `you're visible for a break · ${nextView.label}`
          : "you're available, but availability sharing is off"
        : nextAvailability === "busy"
          ? "got it — focus time protected"
          : "you're hidden until you say otherwise",
      "info",
    );
  };

  const setAvailabilityWindow = (window: AvailabilityWindow) => {
    const current = stateRef.current;
    setState(setAvailabilityWindowLogic(current, window, Date.now()));
    setClock(Date.now());
    showToast(
      window == null && current.profile.availability === "available"
        ? "your availability will stay on until you change it"
        : "availability window updated",
      "info",
    );
  };

  const toggleShareAvailability = () => {
    updateProfile({ shareAvailability: !stateRef.current.profile.shareAvailability });
  };

  const toggleShareProfile = () => {
    updateProfile({ shareProfile: !stateRef.current.profile.shareProfile });
  };

  const toggleSaved = (id: string) => {
    const current = stateRef.current;
    const wasSaved = current.savedIds.includes(id);
    setState({
      ...current,
      savedIds: toggleSavedId(current.savedIds, id),
      updatedAt: Date.now(),
    });
    showToast(wasSaved ? "removed from your little collection" : "saved for a later little escape");
  };

  const runFriendAction = (
    action: (current: EscapeState, friendId: string, now: number) => { state: EscapeState; error: string | null },
    friendId: string,
    success: string,
  ) => {
    const result = action(stateRef.current, friendId, Date.now());
    if (result.error) {
      showToast(result.error, "error");
      return;
    }
    setState(result.state);
    showToast(success);
  };

  const sendFriendRequest = (friendId: string) => {
    runFriendAction(sendFriendRequestLogic, friendId, "friend request sent");
  };
  const acceptFriendRequest = (friendId: string) => {
    runFriendAction(acceptFriendRequestLogic, friendId, "you're connected — say hi when you're free");
  };
  const rejectFriendRequest = (friendId: string) => {
    runFriendAction(rejectFriendRequestLogic, friendId, "request declined");
  };
  const withdrawFriendRequest = (friendId: string) => {
    runFriendAction(withdrawFriendRequestLogic, friendId, "request withdrawn");
  };
  const removeFriend = (friendId: string) => {
    runFriendAction(removeFriendLogic, friendId, "removed from your people");
  };

  const inviteFriend = (friendId: string) => {
    const friend = friends.find((entry) => entry.id === friendId);
    if (!friend) {
      showToast("That classmate isn't in your directory.", "error");
      return;
    }
    if (friend.relationship !== "friends") {
      showToast("Accept a friend request before planning a break together.", "error");
      return;
    }
    setPlanner({ item: defaultActivityFor(friend), friendIds: [friend.id], plan: null });
  };

  const openPlanner = (item: Activity | Place, friendIds: string[] = []) => {
    setDetailItem(null);
    setPlanner({ item, friendIds, plan: null });
  };

  const openPlanEditor = (plan: Plan) => {
    const item = activityById.get(plan.itemId) ?? placeById.get(plan.itemId);
    if (!item) {
      showToast("That plan's place is no longer in the catalog.", "error");
      return;
    }
    setPlanner({ item, friendIds: plan.invitees.map((invitee) => invitee.friendId), plan });
  };

  const createPlan = (draft: PlanDraft): PlanResult => {
    const now = Date.now();
    const signature = JSON.stringify(draft);
    if (
      lastPlanSignature.current &&
      lastPlanSignature.current.signature === signature &&
      now - lastPlanSignature.current.at < 2500
    ) {
      return { state: stateRef.current, error: "That plan is already saved.", plan: null };
    }
    const result = createPlanLogic(stateRef.current, draft, now);
    if (result.error) {
      showToast(result.error, "error");
      return result;
    }
    lastPlanSignature.current = { signature, at: now };
    setState(result.state);
    setPlanner(null);
    showToast("break plan saved — find it on your dashboard");
    return result;
  };

  const savePlanEdits = (planId: string, draft: PlanDraft): PlanResult => {
    const result = updatePlanLogic(stateRef.current, planId, draft, Date.now());
    if (result.error) {
      showToast(result.error, "error");
      return result;
    }
    setState(result.state);
    setPlanner(null);
    showToast("plan updated");
    return result;
  };

  const cancelPlan = (planId: string) => {
    const result = cancelPlanLogic(stateRef.current, planId, Date.now());
    if (result.error) {
      showToast(result.error, "error");
      return;
    }
    setState(result.state);
    showToast("plan cancelled — your calendar has room again", "info");
  };

  const respondToPlan = (planId: string, response: "accepted" | "declined") => {
    const result = respondToPlanLogic(stateRef.current, planId, response, Date.now());
    if (result.error) {
      showToast(result.error, "error");
      return;
    }
    setState(result.state);
    showToast(response === "accepted" ? "you're in — see you there" : "invitation declined", "info");
  };

  const openDetails = (item: Activity | Place) => setDetailItem(item);

  const jumpToRecommendations = () => {
    setView("discover");
    window.setTimeout(
      () => document.getElementById("recommendations")?.scrollIntoView({ behavior: "smooth", block: "start" }),
      60,
    );
  };

  const jumpToPreferences = () => {
    if (view !== "discover") {
      setView("discover");
      window.setTimeout(
        () => document.getElementById("preferences")?.scrollIntoView({ behavior: "smooth", block: "start" }),
        80,
      );
      return;
    }
    document.getElementById("preferences")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openPeople = () => {
    setView("find");
    setState((current) => ({ ...current, finderTab: "people", updatedAt: Date.now() }));
  };

  const openSpots = () => {
    setView("find");
    setState((current) => ({ ...current, finderTab: "spots", updatedAt: Date.now() }));
  };

  const contextValue: EscapeContextValue = {
    view,
    setView,
    prefs: state.prefs,
    setMood: (mood) => setPrefsPatch({ mood }),
    setDuration: (duration) => setPrefsPatch({ duration }),
    setBudget: (budget) => setPrefsPatch({ budget }),
    setCompany: (company) => setPrefsPatch({ company }),
    finderTab: state.finderTab,
    setFinderTab: (tab) => setState((current) => ({ ...current, finderTab: tab, updatedAt: Date.now() })),
    sortMode: state.sortMode,
    setSortMode: (mode) => setState((current) => ({ ...current, sortMode: mode, updatedAt: Date.now() })),
    savedIds: state.savedIds,
    isSaved: (id) => state.savedIds.includes(id),
    toggleSaved,
    profile: state.profile,
    updateProfile,
    availability,
    setAvailability,
    setAvailabilityWindow,
    toggleShareAvailability,
    toggleShareProfile,
    friends,
    availableFriends,
    acceptedFriends,
    incomingRequests,
    outgoingRequests,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    withdrawFriendRequest,
    removeFriend,
    inviteFriend,
    plans: state.plans,
    planBuckets,
    nextPlan,
    pendingInviteCount: planBuckets.invites.length,
    createPlan,
    savePlanEdits,
    cancelPlan,
    respondToPlan,
    validatePlan: (draft, editingPlanId) => validatePlanDraft(draft, state, Date.now(), editingPlanId),
    detailItem,
    openDetails,
    closeDetails: () => setDetailItem(null),
    planner,
    openPlanner,
    openPlanEditor,
    closePlanner: () => setPlanner(null),
    plansOpen,
    plansTab,
    setPlansTab,
    openPlans: (tab: PlanTab = "upcoming") => {
      setPlansTab(tab);
      setPlansOpen(true);
    },
    closePlans: () => setPlansOpen(false),
    toast,
    showToast,
    clearToast: () => setToast(null),
    jumpToRecommendations,
    jumpToPreferences,
    openPeople,
    openSpots,
  };

  return <EscapeContext.Provider value={contextValue}>{children}</EscapeContext.Provider>;
}

export function useEscape() {
  const context = useContext(EscapeContext);
  if (!context) throw new Error("useEscape must be used inside EscapeProvider");
  return context;
}

export function getSavedItems(ids: string[]) {
  return ids
    .map((id) => activityById.get(id) ?? placeById.get(id))
    .filter((item): item is Activity | Place => Boolean(item));
}

export { activities, activityById, placeById };
export type { FinderTab, Friend };
