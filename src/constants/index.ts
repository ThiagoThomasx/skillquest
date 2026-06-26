// ── Routes ───────────────────────────────────────────────────────────────────

export const ROUTES = {
  DASHBOARD: "/dashboard",
  PATHS: "/paths",
  MISSIONS: "/missions",
  BADGES: "/badges",
  PROFILE: "/profile",
  SETTINGS: "/settings",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

// ── XP & Leveling ────────────────────────────────────────────────────────────

export const XP_PER_LEVEL = 3_000;

export const DIFFICULTY_XP: Record<string, number> = {
  easy: 100,
  medium: 175,
  hard: 250,
};

export const STREAK_BONUS_MULTIPLIER = 1.5;
export const DAILY_MISSION_BONUS_MULTIPLIER = 2;

// ── Badge rarities ────────────────────────────────────────────────────────────

export const BADGE_RARITY_LABEL: Record<string, string> = {
  common: "Comum",
  rare: "Raro",
  epic: "Épico",
  legendary: "Lendário",
};

export const BADGE_RARITY_COLOR: Record<string, string> = {
  common: "text-text-muted",
  rare: "text-sky",
  epic: "text-amber",
  legendary: "text-rose",
};

// ── Difficulty labels ────────────────────────────────────────────────────────

export const DIFFICULTY_LABEL: Record<string, string> = {
  easy: "Fácil",
  medium: "Médio",
  hard: "Difícil",
  legendary: "Lendário",
};

// ── Pagination ───────────────────────────────────────────────────────────────

export const DEFAULT_PAGE_SIZE = 10;

// ── Animation durations (ms) ─────────────────────────────────────────────────

export const ANIMATION = {
  FAST: 150,
  DEFAULT: 250,
  SLOW: 400,
  XP_COUNT: 1_200,
} as const;
