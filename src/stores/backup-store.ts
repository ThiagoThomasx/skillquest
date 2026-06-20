import { useProgressStore } from "./progress-store";
import { useMissionsStore } from "./missions-store";
import { useBadgesStore } from "./badges-store";
import { useStreakStore } from "./streak-store";
import { useActivityStore } from "./activity-store";
import { useUIStore } from "./useUIStore";
import { useQuestlinesStore } from "./questlines-store";

interface SkillQuestBackup {
  version: string;
  exportedAt: string;
  progress: ReturnType<typeof useProgressStore.getState>;
  missions: ReturnType<typeof useMissionsStore.getState>;
  questlines: ReturnType<typeof useQuestlinesStore.getState>;
  badges: ReturnType<typeof useBadgesStore.getState>;
  streak: ReturnType<typeof useStreakStore.getState>;
  activity: ReturnType<typeof useActivityStore.getState>;
  ui: { theme: string };
}

export function exportBackup(): void {
  const backup: SkillQuestBackup = {
    version: "2.0",
    exportedAt: new Date().toISOString(),
    progress: useProgressStore.getState(),
    missions: useMissionsStore.getState(),
    questlines: useQuestlinesStore.getState(),
    badges: useBadgesStore.getState(),
    streak: useStreakStore.getState(),
    activity: useActivityStore.getState(),
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

export function importBackup(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backup: SkillQuestBackup = JSON.parse(e.target?.result as string);
        if (!backup.version || !backup.exportedAt) {
          throw new Error("Arquivo de backup inválido.");
        }

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

        // Migrate: restore questlines if v2.0+, else keep current
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
}
