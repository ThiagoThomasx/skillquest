// ── Domain entities ──────────────────────────────────────────────────────────

export type UserId = string;
export type MissionId = string;
export type PathId = string;
export type BadgeId = string;

export interface User {
  id: UserId;
  name: string;
  email: string;
  avatarUrl?: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  joinedAt: Date;
}

export type MissionStatus = "available" | "active" | "completed" | "locked";
export type Difficulty = "easy" | "medium" | "hard";

export interface Mission {
  id: MissionId;
  title: string;
  description: string;
  pathId: PathId;
  pathTitle: string;
  xpReward: number;
  estimatedMinutes: number;
  difficulty: Difficulty;
  status: MissionStatus;
  progress: number; // 0–100
  completedAt?: Date;
}

export type PathStatus = "available" | "active" | "completed" | "locked";

export interface LearningPath {
  id: PathId;
  title: string;
  description: string;
  totalMissions: number;
  completedMissions: number;
  xpReward: number;
  status: PathStatus;
  tags: string[];
  progress: number; // 0–100
}

export type BadgeRarity = "common" | "rare" | "epic" | "legendary";

export interface Badge {
  id: BadgeId;
  title: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;
  xpReward: number;
  earned: boolean;
  earnedAt?: Date;
}

export interface ActivityEntry {
  id: string;
  type: "mission_completed" | "badge_earned" | "level_up" | "streak";
  title: string;
  xpGained: number;
  timestamp: Date;
}

// ── UI state types ────────────────────────────────────────────────────────────

export type Theme = "dark" | "system";
export type Language = "pt-BR" | "en-US";

export interface UserSettings {
  theme: Theme;
  language: Language;
  dailyReminderEnabled: boolean;
  dailyReminderTime: string; // "HH:MM"
  achievementNotifications: boolean;
  newsletterEnabled: boolean;
}
