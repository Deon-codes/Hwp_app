import type { LucideIcon } from "lucide-react";
import {
  Apple,
  BookOpen,
  Camera,
  Coffee,
  Compass,
  Dumbbell,
  Flower2,
  Gamepad2,
  Headphones,
  MapPin,
  Sparkles,
  Sun,
  Users,
  Utensils,
} from "lucide-react";

export type Mood = "Chill" | "Hungry" | "Social" | "Explore" | "Play" | "Focus";
export type Company = "solo" | "friends" | "either";
export type Budget = 0 | 50 | 100 | 200;
export type BreakDuration = 10 | 15 | 30 | 45 | 60;
export type Availability = "available" | "busy" | "hidden";
export type FinderTab = "spots" | "people";
export type AvailabilityWindow = 30 | 60 | 120 | null;

export type IllustrationTone = "yellow" | "mint" | "coral" | "lavender" | "blue" | "paper";

export type Activity = {
  id: string;
  name: string;
  description: string;
  category: string;
  moods: Mood[];
  price: number;
  durationMin: number;
  walkMin: number;
  social: "solo" | "friends" | "both";
  icon: LucideIcon;
  tone: IllustrationTone;
  tags: string[];
  matchLine: string;
};

export type Place = {
  id: string;
  name: string;
  description: string;
  category: string;
  moods: Mood[];
  price: number;
  durationMin: number;
  walkMin: number;
  icon: LucideIcon;
  tone: IllustrationTone;
  tags: string[];
  addressHint: string;
  /** Only filled when the project has reliable opening-hours data. */
  openHours?: string;
  /** Only filled when the project has a reliable map destination. */
  mapUrl?: string;
  matchLine: string;
};

export type FriendRelationship = "friends" | "incoming" | "outgoing" | "none";

/**
 * A demo classmate. These records are fictional seed data, not registered
 * accounts. The state layer adds the current user's relationship and the
 * presence values that classmates have chosen to share.
 */
export type Friend = {
  id: string;
  name: string;
  initials: string;
  status: string;
  mood: Mood;
  tone: IllustrationTone;
  available: boolean;
  interests: Mood[];
  bio: string;
  expiresAt: number | null;
  relationship: FriendRelationship;
};

export type DemoFriend = {
  id: string;
  name: string;
  initials: string;
  tone: IllustrationTone;
  defaultStatus: string;
  defaultMood: Mood;
  defaultAvailable: boolean;
  defaultWindowMin: number | null;
  interests: Mood[];
  bio: string;
  seedRelationship: Exclude<FriendRelationship, "none"> | "none";
};

export const DEMO_DIRECTORY_LABEL =
  "Fictional demo classmates — not real registered accounts. Availability is simulated and never shared outside this browser.";

export const moods: Array<{
  name: Mood;
  description: string;
  icon: LucideIcon;
  tone: IllustrationTone;
  sticker: string;
}> = [
  { name: "Chill", description: "brain needs a breather", icon: Headphones, tone: "lavender", sticker: "slow down" },
  { name: "Hungry", description: "something yummy, please", icon: Coffee, tone: "coral", sticker: "snack o'clock" },
  { name: "Social", description: "people time!", icon: Users, tone: "mint", sticker: "come along" },
  { name: "Explore", description: "let's wander", icon: Compass, tone: "blue", sticker: "new route" },
  { name: "Play", description: "a little friendly chaos", icon: Gamepad2, tone: "yellow", sticker: "tiny chaos" },
  { name: "Focus", description: "quiet corner, please", icon: BookOpen, tone: "paper", sticker: "soft focus" },
];

export const activities: Activity[] = [
  {
    id: "chai-catch-up",
    name: "Chai and catch-up",
    description: "A warm cup, a low-stakes debrief, and a few minutes that feel like yours.",
    category: "Food & friends",
    moods: ["Social", "Hungry", "Chill"],
    price: 30,
    durationMin: 15,
    walkMin: 3,
    social: "friends",
    icon: Coffee,
    tone: "coral",
    tags: ["chai", "chat", "feel-good"],
    matchLine: "Fits your time and budget, with just enough people time before class.",
  },
  {
    id: "garden-reset",
    name: "Garden reset",
    description: "Take the long way through the campus garden and let your brain change channels.",
    category: "Outside",
    moods: ["Chill", "Explore", "Focus"],
    price: 0,
    durationMin: 15,
    walkMin: 5,
    social: "both",
    icon: Flower2,
    tone: "mint",
    tags: ["sunshine", "greenery", "reset", "walk"],
    matchLine: "A free little breathing room moment that fits between lectures.",
  },
  {
    id: "canteen-snack",
    name: "Canteen snack",
    description: "Pick one crunchy, flaky or sweet thing. No overthinking required.",
    category: "Food",
    moods: ["Hungry", "Social", "Play"],
    price: 45,
    durationMin: 10,
    walkMin: 4,
    social: "both",
    icon: Utensils,
    tone: "yellow",
    tags: ["quick bite", "canteen", "under 50", "samosa"],
    matchLine: "The speedy, under-₹50 answer to a very real snack situation.",
  },
  {
    id: "table-tennis",
    name: "Table tennis",
    description: "A quick rally, a little friendly chaos, and a reset disguised as a game.",
    category: "Play",
    moods: ["Play", "Social", "Explore"],
    price: 0,
    durationMin: 30,
    walkMin: 7,
    social: "friends",
    icon: Dumbbell,
    tone: "yellow",
    tags: ["rally", "friendly", "energy", "sport"],
    matchLine: "Good for a group break when you want to come back brighter.",
  },
  {
    id: "quiet-courtyard",
    name: "Quiet courtyard",
    description: "Find a sunny step, put your phone down, and do absolutely one thing less.",
    category: "Outside",
    moods: ["Chill", "Focus", "Explore"],
    price: 0,
    durationMin: 10,
    walkMin: 2,
    social: "solo",
    icon: Sun,
    tone: "blue",
    tags: ["quiet", "sun", "solo"],
    matchLine: "A tiny pause with zero spend and almost no walking required.",
  },
  {
    id: "library-recharge",
    name: "Library recharge corner",
    description: "A soft chair, a few quiet pages, and a brain that gets to unclench.",
    category: "Quiet time",
    moods: ["Focus", "Chill"],
    price: 0,
    durationMin: 30,
    walkMin: 6,
    social: "solo",
    icon: BookOpen,
    tone: "paper",
    tags: ["quiet", "books", "recharge", "study"],
    matchLine: "A calm corner for focus mode without the pressure to perform.",
  },
  {
    id: "group-snack-stop",
    name: "Group snack stop",
    description: "Round up the usual suspects for one shared plate and a very short story swap.",
    category: "Food & friends",
    moods: ["Social", "Hungry"],
    price: 85,
    durationMin: 30,
    walkMin: 5,
    social: "friends",
    icon: Apple,
    tone: "coral",
    tags: ["shareable", "friends", "snacks"],
    matchLine: "Best when your break needs a table, a laugh, and a little more time.",
  },
  {
    id: "photo-walk",
    name: "Campus photography walk",
    description: "Spot one good shadow, one weird sign, and one corner you have never noticed.",
    category: "Wander",
    moods: ["Explore", "Play", "Chill"],
    price: 0,
    durationMin: 45,
    walkMin: 8,
    social: "both",
    icon: Camera,
    tone: "blue",
    tags: ["wander", "camera roll", "curious"],
    matchLine: "A small adventure that turns the usual route into something new.",
  },
  {
    id: "sunset-sketch",
    name: "Ten-minute rooftop sketch",
    description: "One page, one skyline, zero pressure to make it good.",
    category: "Wander",
    moods: ["Chill", "Explore", "Focus"],
    price: 0,
    durationMin: 10,
    walkMin: 6,
    social: "solo",
    icon: Sparkles,
    tone: "lavender",
    tags: ["art", "rooftop", "quiet", "sunset"],
    matchLine: "A tiny creative reset when you want your brain somewhere else for a minute.",
  },
  {
    id: "board-game-corner",
    name: "Board game corner",
    description: "One quick round of something silly with whoever is already around.",
    category: "Play",
    moods: ["Play", "Social"],
    price: 0,
    durationMin: 30,
    walkMin: 4,
    social: "friends",
    icon: Gamepad2,
    tone: "mint",
    tags: ["games", "friends", "indoor"],
    matchLine: "Low-effort company that still feels like a proper break.",
  },
];

export const places: Place[] = [
  {
    id: "place-canteen",
    name: "Campus canteen",
    description: "The familiar, lively spot for a quick plate, shared fries, or an easy meet-up.",
    category: "Food hall",
    moods: ["Hungry", "Social", "Play"],
    price: 45,
    durationMin: 20,
    walkMin: 4,
    icon: Utensils,
    tone: "yellow",
    tags: ["quick bite", "lively", "under 50", "food"],
    addressHint: "near the east lecture lawn",
    matchLine: "Bright, familiar, and close enough for a snack before your next thing.",
  },
  {
    id: "place-chai-stall",
    name: "Chai & snack stall",
    description: "Steam, spicy biscuits, and a standing-around spot that always seems to find a friend.",
    category: "Snack stop",
    moods: ["Social", "Hungry", "Chill"],
    price: 30,
    durationMin: 15,
    walkMin: 3,
    icon: Coffee,
    tone: "coral",
    tags: ["chai", "catch-up", "favourite", "tea"],
    addressHint: "under the old banyan tree",
    matchLine: "Made for a quick catch-up, with plenty of chai committee energy.",
  },
  {
    id: "place-garden",
    name: "Garden courtyard",
    description: "A patch of shade, a few benches, and enough green to make the day feel wider.",
    category: "Green space",
    moods: ["Chill", "Explore", "Focus"],
    price: 0,
    durationMin: 20,
    walkMin: 5,
    icon: Flower2,
    tone: "mint",
    tags: ["greenery", "sunshine", "slow", "park"],
    addressHint: "behind the arts block",
    matchLine: "Your cue to go touch some grass, gently.",
  },
  {
    id: "place-sports",
    name: "Sports area",
    description: "Open courts and a little room to move when sitting still has stopped helping.",
    category: "Move & play",
    moods: ["Play", "Social", "Explore"],
    price: 0,
    durationMin: 30,
    walkMin: 7,
    icon: Dumbbell,
    tone: "yellow",
    tags: ["rally", "move", "friendly", "recreation"],
    addressHint: "past the student centre",
    matchLine: "A good fit for friendly chaos and a little extra energy.",
  },
  {
    id: "place-hangout",
    name: "Student hangout",
    description: "Low tables, charging points, and the happy hum of people taking five together.",
    category: "Social spot",
    moods: ["Social", "Chill", "Hungry"],
    price: 50,
    durationMin: 30,
    walkMin: 6,
    icon: Users,
    tone: "lavender",
    tags: ["people watch", "tables", "easy meet"],
    addressHint: "inside the student centre",
    matchLine: "A soft landing when you want company without a formal plan.",
  },
  {
    id: "place-library",
    name: "Library recharge corner",
    description: "Quiet nooks, filtered light, and a no-questions-asked reset for your attention.",
    category: "Quiet corner",
    moods: ["Focus", "Chill"],
    price: 0,
    durationMin: 30,
    walkMin: 6,
    icon: BookOpen,
    tone: "paper",
    tags: ["quiet", "read", "reset", "study"],
    addressHint: "second floor, west wing",
    matchLine: "The calmest place on the list for a quiet corner kind of day.",
  },
  {
    id: "place-cafe",
    name: "Corner café",
    description: "A small coffee counter with window seats, a chalkboard menu and a decent playlist.",
    category: "Café",
    moods: ["Chill", "Social", "Hungry"],
    price: 60,
    durationMin: 25,
    walkMin: 4,
    icon: Coffee,
    tone: "lavender",
    tags: ["coffee", "window seat", "catch-up"],
    addressHint: "ground floor of the arts block",
    matchLine: "A proper coffee break when the canteen feels a little too loud.",
  },
  {
    id: "place-study-lounge",
    name: "Study lounge",
    description: "Long tables, plug points and a shared agreement about quiet voices.",
    category: "Study space",
    moods: ["Focus", "Chill"],
    price: 0,
    durationMin: 45,
    walkMin: 5,
    icon: BookOpen,
    tone: "blue",
    tags: ["study", "plug points", "quiet", "wifi"],
    addressHint: "first floor of the library annex",
    matchLine: "Built for a focused half hour without disappearing for the afternoon.",
  },
  {
    id: "place-amphitheatre",
    name: "Open-air amphitheatre",
    description: "Wide steps, a bit of shade and space for an impromptu group hangout.",
    category: "Social spot",
    moods: ["Social", "Explore", "Play"],
    price: 0,
    durationMin: 30,
    walkMin: 8,
    icon: Users,
    tone: "mint",
    tags: ["outdoor", "group", "music", "hangout"],
    addressHint: "between the design block and the sports field",
    matchLine: "A good group base when the plan is simply to be outside together.",
  },
];

export const demoFriends: DemoFriend[] = [
  {
    id: "friend-aisha",
    name: "Aisha",
    initials: "AS",
    tone: "coral",
    defaultStatus: "free for chai",
    defaultMood: "Social",
    defaultAvailable: true,
    defaultWindowMin: 60,
    interests: ["Social", "Hungry"],
    bio: "Chai loyalist. Will always pick the table near the window.",
    seedRelationship: "friends",
  },
  {
    id: "friend-rohan",
    name: "Rohan",
    initials: "RK",
    tone: "blue",
    defaultStatus: "up for a walk",
    defaultMood: "Explore",
    defaultAvailable: true,
    defaultWindowMin: 45,
    interests: ["Explore", "Chill"],
    bio: "Takes the long route on purpose. Knows where the good shade is.",
    seedRelationship: "friends",
  },
  {
    id: "friend-meera",
    name: "Meera",
    initials: "MP",
    tone: "yellow",
    defaultStatus: "down for snacks",
    defaultMood: "Hungry",
    defaultAvailable: true,
    defaultWindowMin: 30,
    interests: ["Hungry", "Social"],
    bio: "Snack scout. Has strong opinions about the canteen's best item.",
    seedRelationship: "friends",
  },
  {
    id: "friend-dev",
    name: "Dev",
    initials: "DV",
    tone: "lavender",
    defaultStatus: "quiet break today",
    defaultMood: "Chill",
    defaultAvailable: true,
    defaultWindowMin: 60,
    interests: ["Chill", "Focus"],
    bio: "Usually found in a quiet corner with headphones on.",
    seedRelationship: "incoming",
  },
  {
    id: "friend-sana",
    name: "Sana",
    initials: "SN",
    tone: "mint",
    defaultStatus: "five-minute sunshine",
    defaultMood: "Chill",
    defaultAvailable: false,
    defaultWindowMin: null,
    interests: ["Chill", "Focus"],
    bio: "Believes in short walks and long lunches.",
    seedRelationship: "outgoing",
  },
  {
    id: "friend-ian",
    name: "Ian",
    initials: "IN",
    tone: "paper",
    defaultStatus: "in focus mode",
    defaultMood: "Focus",
    defaultAvailable: false,
    defaultWindowMin: null,
    interests: ["Focus", "Play"],
    bio: "Library regular. Occasionally persuaded into table tennis.",
    seedRelationship: "none",
  },
  {
    id: "friend-priya",
    name: "Priya",
    initials: "PR",
    tone: "blue",
    defaultStatus: "wandering after class",
    defaultMood: "Explore",
    defaultAvailable: true,
    defaultWindowMin: 90,
    interests: ["Explore", "Social"],
    bio: "Camera roll full of campus corners nobody else noticed.",
    seedRelationship: "none",
  },
  {
    id: "friend-kabir",
    name: "Kabir",
    initials: "KB",
    tone: "coral",
    defaultStatus: "up for a quick game",
    defaultMood: "Play",
    defaultAvailable: true,
    defaultWindowMin: null,
    interests: ["Play", "Social"],
    bio: "Always carrying a badminton racket for some reason.",
    seedRelationship: "none",
  },
];

export const activityById = new Map(activities.map((activity) => [activity.id, activity]));
export const placeById = new Map(places.map((place) => [place.id, place]));
export const friendById = new Map(demoFriends.map((friend) => [friend.id, friend]));

export const spotCategories = Array.from(new Set(places.map((place) => place.category)));
export const activityCategories = Array.from(new Set(activities.map((activity) => activity.category)));

export function formatPrice(price: number) {
  return price === 0 ? "Free" : `₹${price} est.`;
}

export function formatDuration(duration: number) {
  return `${duration} min`;
}

export function getBudgetLabel(budget: Budget) {
  if (budget === 0) return "Free";
  return `Under ₹${budget}`;
}

export function formatPlanDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

export const categoryIcon = {
  "Food & friends": Coffee,
  Food: Utensils,
  Outside: Sun,
  Play: Gamepad2,
  "Quiet time": Headphones,
  Wander: Camera,
};

export const smallMapPins = [
  { label: "chai", left: "22%", top: "46%", tone: "coral" as IllustrationTone },
  { label: "garden", left: "66%", top: "29%", tone: "mint" as IllustrationTone },
  { label: "library", left: "71%", top: "71%", tone: "paper" as IllustrationTone },
  { label: "sports", left: "35%", top: "73%", tone: "yellow" as IllustrationTone },
];

export { MapPin };
