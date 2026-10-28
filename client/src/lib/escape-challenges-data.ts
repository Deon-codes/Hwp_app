import type { LucideIcon } from "lucide-react";
import {
  Award,
  BookOpen,
  BookmarkCheck,
  Coffee,
  Compass,
  Flower2,
  Headphones,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import type { IllustrationTone } from "./escape-data";

export type ChallengeCategory = "Exploration" | "Mindfulness" | "Social" | "Wellbeing";
export type ChallengeCadence = "one-time" | "weekly" | "repeatable";
export type ChallengeDifficulty = "Easy" | "Medium" | "Hard";

export type ChallengeBadge = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  iconName: string;
  tone: IllustrationTone;
  points: number;
};

export type ChallengeDefinition = {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  cadence: ChallengeCadence;
  difficulty: ChallengeDifficulty;
  targetCount: number;
  unitLabel: string;
  points: number;
  badge: ChallengeBadge;
  criteriaDescription: string;
  icon: LucideIcon;
};

export const CHALLENGE_CATEGORIES: ChallengeCategory[] = [
  "Exploration",
  "Mindfulness",
  "Social",
  "Wellbeing",
];

export const badgesCatalog: ChallengeBadge[] = [
  {
    id: "badge-explorer-scout",
    name: "Explorer Scout",
    description: "Discovered 3 unique campus hideaways through Break Finder",
    icon: Compass,
    iconName: "Compass",
    tone: "blue",
    points: 150,
  },
  {
    id: "badge-zen-master",
    name: "Zen Master",
    description: "Completed a screen-free 15-minute digital detox pause",
    icon: Headphones,
    iconName: "Headphones",
    tone: "lavender",
    points: 100,
  },
  {
    id: "badge-study-squad",
    name: "Study Squad",
    description: "Powered through a focused study session together with a classmate",
    icon: Users,
    iconName: "Users",
    tone: "yellow",
    points: 120,
  },
  {
    id: "badge-green-thumb",
    name: "Green Thumb",
    description: "Stepped outside to recharge in a green campus space",
    icon: Flower2,
    iconName: "Flower2",
    tone: "mint",
    points: 80,
  },
  {
    id: "badge-chai-connoisseur",
    name: "Chai Connoisseur",
    description: "Took a proper pause for chai and campus stories with a friend",
    icon: Coffee,
    iconName: "Coffee",
    tone: "coral",
    points: 90,
  },
  {
    id: "badge-pocket-curator",
    name: "Pocket Curator",
    description: "Assembled a trusty stash of 3 saved break spots and activities",
    icon: BookmarkCheck,
    iconName: "BookmarkCheck",
    tone: "paper",
    points: 100,
  },
];

export const challengesList: ChallengeDefinition[] = [
  {
    id: "campus-explorer",
    title: "Campus Explorer",
    description: "Discover 3 new campus spots.",
    category: "Exploration",
    cadence: "one-time",
    difficulty: "Easy",
    targetCount: 3,
    unitLabel: "spots discovered",
    points: 150,
    criteriaDescription: "Browse or view details for 3 distinct campus places in Discover or Break Finder.",
    icon: Compass,
    badge: badgesCatalog[0],
  },
  {
    id: "digital-detox",
    title: "Digital Detox",
    description: "Take a screen-free 15-minute break.",
    category: "Mindfulness",
    cadence: "repeatable",
    difficulty: "Medium",
    targetCount: 15,
    unitLabel: "min break",
    points: 100,
    criteriaDescription: "Start the 15-minute detox timer and step away from your screen until the time finishes.",
    icon: Headphones,
    badge: badgesCatalog[1],
  },
  {
    id: "study-buddy",
    title: "Study Buddy",
    description: "Complete a study session with a friend.",
    category: "Social",
    cadence: "weekly",
    difficulty: "Medium",
    targetCount: 1,
    unitLabel: "study session",
    points: 120,
    criteriaDescription: "Record a completed study session with an accepted demo friend or complete a study plan.",
    icon: BookOpen,
    badge: badgesCatalog[2],
  },
  {
    id: "green-escape",
    title: "Green Escape",
    description: "Explore a green space at least once this week.",
    category: "Wellbeing",
    cadence: "weekly",
    difficulty: "Easy",
    targetCount: 1,
    unitLabel: "green space visit",
    points: 80,
    criteriaDescription: "Explore a campus green spot such as the Garden courtyard or Garden reset.",
    icon: Flower2,
    badge: badgesCatalog[3],
  },
  {
    id: "chai-committee",
    title: "Chai Committee",
    description: "Take a tea or snack break with a friend.",
    category: "Social",
    cadence: "repeatable",
    difficulty: "Easy",
    targetCount: 1,
    unitLabel: "snack/chai break",
    points: 90,
    criteriaDescription: "Plan or record a chai or snack pause with an accepted classmate.",
    icon: Coffee,
    badge: badgesCatalog[4],
  },
  {
    id: "curious-wanderer",
    title: "Curious Wanderer",
    description: "Bookmark 3 favorite spots or activities for your breaks.",
    category: "Exploration",
    cadence: "one-time",
    difficulty: "Easy",
    targetCount: 3,
    unitLabel: "saved items",
    points: 100,
    criteriaDescription: "Save 3 spots or activities to your Saved collection for quick access.",
    icon: BookmarkCheck,
    badge: badgesCatalog[5],
  },
];

export const challengeById = new Map<string, ChallengeDefinition>(
  challengesList.map((challenge) => [challenge.id, challenge]),
);

export const badgeById = new Map<string, ChallengeBadge>(
  badgesCatalog.map((badge) => [badge.id, badge]),
);

/**
 * Known green space IDs from activities and places data.
 */
export const GREEN_SPACE_ITEM_IDS = new Set<string>([
  "place-garden", // Garden courtyard (Category: Green space)
  "garden-reset", // Garden reset (Category: Outside, tags: greenery, sunshine)
]);

/**
 * Checks whether an item ID is a green-space spot or activity.
 */
export function isGreenSpaceItem(itemId: string): boolean {
  if (GREEN_SPACE_ITEM_IDS.has(itemId)) return true;
  return false;
}

/**
 * Known study IDs from activities and places data.
 */
export const STUDY_ITEM_IDS = new Set<string>([
  "place-study-lounge",
  "place-library",
  "library-recharge",
]);

export function isStudyItem(itemId: string): boolean {
  return STUDY_ITEM_IDS.has(itemId);
}
