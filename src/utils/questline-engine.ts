import type { Questline, QuestlineModule } from "@/stores/questlines-store";
import type { StoredMission } from "@/stores/missions-store";

export function getModuleMissions(mod: QuestlineModule, allMissions: StoredMission[]): StoredMission[] {
  return mod.missionIds
    .map((id) => allMissions.find((m) => m.id === id))
    .filter((m): m is StoredMission => m !== undefined);
}

export function calculateModuleProgress(mod: QuestlineModule, allMissions: StoredMission[]): number {
  if (mod.missionIds.length === 0) return 0;
  const missions = getModuleMissions(mod, allMissions);
  const completed = missions.filter((m) => m.status === "completed").length;
  return Math.round((completed / mod.missionIds.length) * 100);
}

export function isModuleCompleted(mod: QuestlineModule, allMissions: StoredMission[]): boolean {
  if (mod.missionIds.length === 0) return false;
  return mod.missionIds.every((id) => allMissions.find((m) => m.id === id)?.status === "completed");
}

export function calculateQuestlineProgress(questline: Questline, allMissions: StoredMission[]): number {
  if (questline.modules.length === 0) return 0;
  const totalMissions = questline.modules.reduce((sum, m) => sum + m.missionIds.length, 0);
  if (totalMissions === 0) return 0;
  const completedMissions = questline.modules.reduce(
    (sum, mod) => sum + getModuleMissions(mod, allMissions).filter((m) => m.status === "completed").length,
    0
  );
  return Math.round((completedMissions / totalMissions) * 100);
}

export function calculateQuestlineEarnedXP(questline: Questline, allMissions: StoredMission[]): number {
  return questline.modules.reduce(
    (sum, mod) =>
      sum +
      getModuleMissions(mod, allMissions)
        .filter((m) => m.status === "completed")
        .reduce((s, m) => s + m.xpReward, 0),
    0
  );
}

export function calculateQuestlineTotalXP(questline: Questline, allMissions: StoredMission[]): number {
  const missionXP = questline.modules.reduce(
    (sum, mod) => sum + getModuleMissions(mod, allMissions).reduce((s, m) => s + m.xpReward, 0),
    0
  );
  return missionXP + questline.bossBattle.xpReward;
}

export function isQuestlineCompleted(questline: Questline, allMissions: StoredMission[]): boolean {
  return (
    questline.modules.length > 0 &&
    questline.modules.every((mod) => isModuleCompleted(mod, allMissions))
  );
}

export function canUnlockBossBattle(questline: Questline, allMissions: StoredMission[]): boolean {
  return isQuestlineCompleted(questline, allMissions) && questline.bossBattle.status !== "completed";
}

export function getNextModule(questline: Questline, allMissions: StoredMission[]): QuestlineModule | null {
  return (
    [...questline.modules]
      .sort((a, b) => a.order - b.order)
      .find((mod) => !isModuleCompleted(mod, allMissions)) ?? null
  );
}

export function countQuestlineMissions(questline: Questline): number {
  return questline.modules.reduce((sum, m) => sum + m.missionIds.length, 0);
}

export function countCompletedMissions(questline: Questline, allMissions: StoredMission[]): number {
  return questline.modules.reduce(
    (sum, mod) => sum + getModuleMissions(mod, allMissions).filter((m) => m.status === "completed").length,
    0
  );
}

export function calculateRemainingMinutes(questline: Questline, allMissions: StoredMission[]): number {
  return questline.modules.reduce(
    (sum, mod) =>
      sum + getModuleMissions(mod, allMissions)
        .filter((m) => m.status !== "completed")
        .reduce((s, m) => s + m.estimatedMinutes, 0),
    0
  );
}

export function getNextMission(questline: Questline, allMissions: StoredMission[]): StoredMission | null {
  const nextMod = getNextModule(questline, allMissions);
  if (!nextMod) return null;
  const modMissions = getModuleMissions(nextMod, allMissions);
  return (
    modMissions.find((m) => m.status === "active") ??
    modMissions.find((m) => m.status === "available") ??
    modMissions.find((m) => m.status !== "completed") ??
    null
  );
}

export function countModulesCompleted(questline: Questline, allMissions: StoredMission[]): number {
  return questline.modules.filter((mod) => isModuleCompleted(mod, allMissions)).length;
}
