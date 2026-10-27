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
  matchLine: string;
};

export type Friend = {
  id: string;
  name: string;
  initials: string;
  status: string;
  mood: Mood;
  tone: IllustrationTone;
  available: boolean;
};

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
    tags: ["sunshine", "greenery", "reset"],
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
    tags: ["quick bite", "canteen", "under 50"],
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
    tags: ["rally", "friendly", "energy"],
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
    tags: ["quiet", "books", "recharge"],
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
    tags: ["quick bite", "lively", "under 50"],
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
    tags: ["chai", "catch-up", "favourite"],
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
    tags: ["greenery", "sunshine", "slow"],
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
    tags: ["rally", "move", "friendly"],
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
    tags: ["quiet", "read", "reset"],
    addressHint: "second floor, west wing",
    matchLine: "The calmest place on the list for a quiet corner kind of day.",
  },
];

export const friends: Friend[] = [
  { id: "friend-aisha", name: "Aisha", initials: "AS", status: "free for chai", mood: "Social", tone: "coral", available: true },
  { id: "friend-rohan", name: "Rohan", initials: "RK", status: "up for a walk", mood: "Explore", tone: "blue", available: true },
  { id: "friend-meera", name: "Meera", initials: "MP", status: "down for snacks", mood: "Hungry", tone: "yellow", available: true },
  { id: "friend-dev", name: "Dev", initials: "DV", status: "quiet break today", mood: "Chill", tone: "lavender", available: true },
  { id: "friend-sana", name: "Sana", initials: "SN", status: "five-minute sunshine", mood: "Chill", tone: "mint", available: false },
  { id: "friend-ian", name: "Ian", initials: "IN", status: "in focus mode", mood: "Focus", tone: "paper", available: false },
];

export const activityById = new Map(activities.map((activity) => [activity.id, activity]));
export const placeById = new Map(places.map((place) => [place.id, place]));

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
