import { z } from "zod";
import { useProgressStore } from "./progress-store";
import { useMissionsStore } from "./missions-store";
import { useBadgesStore } from "./badges-store";
import { useStreakStore } from "./streak-store";
import { useActivityStore } from "./activity-store";
import { useUIStore } from "./useUIStore";
import { useQuestlinesStore } from "./questlines-store";
import { useDailyQuestStore } from "./daily-quest-store";
import { useStudySessionStore } from "./study-session-store";
import { useWeeklyGoalStore } from "./weekly-goal-store";
import { usePortfolioStore } from "./portfolio-store";

interface SkillQuestBackup {
  version: string;
  exportedAt: string;
  progress: ReturnType<typeof useProgressStore.getState>;
  missions: ReturnType<typeof useMissionsStore.getState>;
  questlines: ReturnType<typeof useQuestlinesStore.getState>;
  badges: ReturnType<typeof useBadgesStore.getState>;
  streak: ReturnType<typeof useStreakStore.getState>;
  activity: ReturnType<typeof useActivityStore.getState>;
  dailyQuest: ReturnType<typeof useDailyQuestStore.getState>;
  studySessions: { sessions: ReturnType<typeof useStudySessionStore.getState>["sessions"] };
  weeklyGoals: ReturnType<typeof useWeeklyGoalStore.getState>;
  portfolio: { projects: ReturnType<typeof usePortfolioStore.getState>["projects"] };
  ui: { theme: string };
}

export function exportBackup(): void {
  const backup: SkillQuestBackup = {
    version: "3.0",
    exportedAt: new Date().toISOString(),
    progress: useProgressStore.getState(),
    missions: useMissionsStore.getState(),
    questlines: useQuestlinesStore.getState(),
    badges: useBadgesStore.getState(),
    streak: useStreakStore.getState(),
    activity: useActivityStore.getState(),
    dailyQuest: useDailyQuestStore.getState(),
    studySessions: { sessions: useStudySessionStore.getState().sessions },
    weeklyGoals: useWeeklyGoalStore.getState(),
    portfolio: { projects: usePortfolioStore.getState().projects },
    ui: { theme: useUIStore.getState().theme },
  };

  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `skillquest-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

const BackupHeaderSchema = z.object({
  version: z.string(),
  exportedAt: z.string(),
  progress: z.object({
    totalXP: z.number(),
    currentLevel: z.number(),
    xpInCurrentLevel: z.number(),
    xpRequiredForCurrentLevel: z.number(),
    levelProgress: z.number(),
    username: z.string(),
    joinedAt: z.string(),
  }),
  missions: z.object({
    missions: z.array(z.record(z.string(), z.unknown())),
  }),
  badges: z.object({
    earned: z.array(z.object({
      id: z.string(),
      earned: z.boolean(),
      earnedAt: z.string().nullable(),
    })),
  }),
  streak: z.object({
    currentStreak: z.number(),
    bestStreak: z.number(),
    lastActivityDate: z.string().nullable(),
  }),
  activity: z.object({
    events: z.array(z.record(z.string(), z.unknown())),
  }),
});

export function importBackup(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const raw = JSON.parse(e.target?.result as string);
        const result = BackupHeaderSchema.safeParse(raw);
        if (!result.success) {
          throw new Error("Arquivo de backup inválido ou de versão incompatível.");
        }
        const backup = raw as SkillQuestBackup;

        const p = backup.progress;
        useProgressStore.setState({
          totalXP: p.totalXP,
          currentLevel: p.currentLevel,
          xpInCurrentLevel: p.xpInCurrentLevel,
          xpRequiredForCurrentLevel: p.xpRequiredForCurrentLevel,
          levelProgress: p.levelProgress,
          username: p.username,
          joinedAt: p.joinedAt,
          pendingLevelUp: false,
          levelUpData: null,
        });

        useMissionsStore.setState({ missions: backup.missions.missions });

        if (backup.questlines?.questlines) {
          useQuestlinesStore.setState({ questlines: backup.questlines.questlines });
        }

        useBadgesStore.setState({ earned: backup.badges.earned });
        useStreakStore.setState({
          currentStreak: backup.streak.currentStreak,
          bestStreak: backup.streak.bestStreak,
          lastActivityDate: backup.streak.lastActivityDate,
        });
        useActivityStore.setState({ events: backup.activity.events });

        // v3.0+ fields
        if (backup.dailyQuest) {
          useDailyQuestStore.setState({
            dailyQuestId: backup.dailyQuest.dailyQuestId,
            generatedAt: backup.dailyQuest.generatedAt,
            completedToday: backup.dailyQuest.completedToday,
            skippedToday: backup.dailyQuest.skippedToday,
            focusMinutes: backup.dailyQuest.focusMinutes,
            dailyGoal: backup.dailyQuest.dailyGoal,
            dailyNotes: backup.dailyQuest.dailyNotes,
          });
        }

        if (backup.studySessions?.sessions) {
          useStudySessionStore.setState({ sessions: backup.studySessions.sessions });
        }

        if (backup.weeklyGoals) {
          useWeeklyGoalStore.setState({
            missionsGoal: backup.weeklyGoals.missionsGoal,
            minutesGoal: backup.weeklyGoals.minutesGoal,
            xpGoal: backup.weeklyGoals.xpGoal,
          });
        }

        if (backup.portfolio?.projects) {
          usePortfolioStore.setState({ projects: backup.portfolio.projects });
        }

        if (backup.ui?.theme) {
          useUIStore.getState().setTheme(backup.ui.theme as "modern" | "pixel-quest" | "fantasy-rpg");
        }

        resolve();
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Erro ao ler o arquivo."));
    reader.readAsText(file);
  });
}

export function resetJourney(): void {
  useProgressStore.getState().clearAll();
  useMissionsStore.getState().clearAll();
  useQuestlinesStore.getState().clearAll();
  useBadgesStore.getState().clearAll();
  useStreakStore.getState().clearAll();
  useActivityStore.getState().clearAll();
  useDailyQuestStore.getState().clearAll();
  useStudySessionStore.getState().clearAll();
  useWeeklyGoalStore.getState().clearAll();
  usePortfolioStore.getState().clearAll();
}
