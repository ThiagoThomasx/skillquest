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
import { useNotesStore } from "./notes-store";
import { useReviewStore } from "./review-store";
import { useResourcesStore } from "./resources-store";
import { useProjectsStore } from "./projects-store";

export const BACKUP_VERSION = "4.0";

export interface BackupSummary {
  version: string;
  exportedAt: string;
  counts: {
    missions: number;
    questlines: number;
    sessions: number;
    notes: number;
    reviews: number;
    resources: number;
    projects: number;
    portfolioProjects: number;
    badges: number;
    activityEvents: number;
  };
}

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
  notes: { notes: ReturnType<typeof useNotesStore.getState>["notes"] };
  reviews: { reviews: ReturnType<typeof useReviewStore.getState>["reviews"] };
  resources: { resources: ReturnType<typeof useResourcesStore.getState>["resources"] };
  studyProjects: { projects: ReturnType<typeof useProjectsStore.getState>["projects"] };
  ui: { theme: string };
}

export function exportBackup(): void {
  const backup: SkillQuestBackup = {
    version: BACKUP_VERSION,
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
    notes: { notes: useNotesStore.getState().notes },
    reviews: { reviews: useReviewStore.getState().reviews },
    resources: { resources: useResourcesStore.getState().resources },
    studyProjects: { projects: useProjectsStore.getState().projects },
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

export function parseBackupSummary(file: File): Promise<BackupSummary> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const raw = JSON.parse(e.target?.result as string);
        const result = BackupHeaderSchema.safeParse(raw);
        if (!result.success) {
          throw new Error("Arquivo de backup inválido ou de versão incompatível.");
        }
        const b = raw as SkillQuestBackup;
        resolve({
          version: b.version,
          exportedAt: b.exportedAt,
          counts: {
            missions: b.missions?.missions?.length ?? 0,
            questlines: b.questlines?.questlines?.length ?? 0,
            sessions: b.studySessions?.sessions?.length ?? 0,
            notes: b.notes?.notes?.length ?? 0,
            reviews: b.reviews?.reviews?.length ?? 0,
            resources: b.resources?.resources?.length ?? 0,
            projects: b.studyProjects?.projects?.length ?? 0,
            portfolioProjects: b.portfolio?.projects?.length ?? 0,
            badges: b.badges?.earned?.length ?? 0,
            activityEvents: b.activity?.events?.length ?? 0,
          },
        });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Erro ao ler o arquivo."));
    reader.readAsText(file);
  });
}

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

        if (backup.notes?.notes) {
          useNotesStore.setState({ notes: backup.notes.notes });
        }

        if (backup.reviews?.reviews) {
          useReviewStore.setState({ reviews: backup.reviews.reviews });
        }

        if (backup.resources?.resources) {
          useResourcesStore.setState({ resources: backup.resources.resources });
        }

        if (backup.studyProjects?.projects) {
          useProjectsStore.setState({ projects: backup.studyProjects.projects });
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
  useNotesStore.getState().clearAll();
  useReviewStore.getState().clearAll();
  useResourcesStore.getState().clearAll();
  useProjectsStore.getState().clearAll();
}
