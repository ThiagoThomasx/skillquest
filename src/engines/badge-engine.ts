export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  howToUnlock: string;
  icon: string; // lucide icon name
  rarity: "common" | "rare" | "epic" | "legendary";
  xpReward: number;
  category: string;
  check: (ctx: BadgeContext) => boolean;
}

export interface BadgeContext {
  completedMissionIds: string[];
  totalMissionsCompleted: number;
  currentStreak: number;
  bestStreak: number;
  level: number;
  totalXP: number;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: "first-mission",
    title: "Primeira Missão",
    description: "Completou sua primeira missão.",
    howToUnlock: "Complete qualquer missão.",
    icon: "Star",
    rarity: "common",
    xpReward: 50,
    category: "Progressão",
    check: (ctx) => ctx.totalMissionsCompleted >= 1,
  },
  {
    id: "streak-3",
    title: "Sequência de Fogo",
    description: "Manteve 3 dias consecutivos de estudo.",
    howToUnlock: "Estude por 3 dias seguidos.",
    icon: "Flame",
    rarity: "common",
    xpReward: 75,
    category: "Dedicação",
    check: (ctx) => ctx.bestStreak >= 3,
  },
  {
    id: "streak-7",
    title: "Semana Dedicada",
    description: "Manteve 7 dias consecutivos de estudo.",
    howToUnlock: "Estude por 7 dias seguidos.",
    icon: "Flame",
    rarity: "rare",
    xpReward: 150,
    category: "Dedicação",
    check: (ctx) => ctx.bestStreak >= 7,
  },
  {
    id: "streak-30",
    title: "Mês de Ferro",
    description: "30 dias consecutivos de dedicação.",
    howToUnlock: "Mantenha a sequência por 30 dias.",
    icon: "Shield",
    rarity: "epic",
    xpReward: 500,
    category: "Dedicação",
    check: (ctx) => ctx.bestStreak >= 30,
  },
  {
    id: "explorer",
    title: "Explorador",
    description: "Concluiu 10 missões.",
    howToUnlock: "Complete 10 missões.",
    icon: "MapPin",
    rarity: "rare",
    xpReward: 200,
    category: "Progressão",
    check: (ctx) => ctx.totalMissionsCompleted >= 10,
  },
  {
    id: "quest-master",
    title: "Quest Master",
    description: "Concluiu 25 missões.",
    howToUnlock: "Complete 25 missões.",
    icon: "Trophy",
    rarity: "epic",
    xpReward: 500,
    category: "Progressão",
    check: (ctx) => ctx.totalMissionsCompleted >= 25,
  },
  {
    id: "legend",
    title: "Lenda Viva",
    description: "Alcançou o nível 20.",
    howToUnlock: "Alcance o nível 20.",
    icon: "Crown",
    rarity: "legendary",
    xpReward: 1000,
    category: "Progressão",
    check: (ctx) => ctx.level >= 20,
  },
  {
    id: "hook-master",
    title: "Hook Master",
    description: "Concluiu React Hooks na Prática.",
    howToUnlock: "Complete a missão React Hooks na Prática.",
    icon: "Zap",
    rarity: "rare",
    xpReward: 150,
    category: "Frontend",
    check: (ctx) => ctx.completedMissionIds.includes("mission-hooks"),
  },
  {
    id: "ts-expert",
    title: "TypeScript Expert",
    description: "Concluiu Tipagem Avançada TypeScript.",
    howToUnlock: "Complete a missão Tipagem Avançada TypeScript.",
    icon: "Code",
    rarity: "epic",
    xpReward: 300,
    category: "Frontend",
    check: (ctx) => ctx.completedMissionIds.includes("mission-ts"),
  },
  {
    id: "api-slayer",
    title: "API Slayer",
    description: "Derrotou o Boss Arquimago das APIs.",
    howToUnlock: "Complete o Boss Battle.",
    icon: "Sword",
    rarity: "legendary",
    xpReward: 750,
    category: "Boss",
    check: (ctx) => ctx.completedMissionIds.includes("mission-boss"),
  },
];

export function evaluateBadges(ctx: BadgeContext, alreadyEarned: string[]): string[] {
  return BADGE_DEFINITIONS
    .filter((b) => !alreadyEarned.includes(b.id) && b.check(ctx))
    .map((b) => b.id);
}
