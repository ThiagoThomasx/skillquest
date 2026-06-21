import { StoredMission } from "@/stores/missions-store";
import { Questline } from "@/stores/questlines-store";

export interface DailyQuest {
  missionId: string;
  questlineId: string | null;
  moduleId: string | null;
  reason: string;
  estimatedTime: number;
  xpReward: number;
  priority: number;
}

function buildResult(
  mission: StoredMission,
  questlineId: string | null,
  moduleId: string | null,
  reason: string,
  priority: number
): DailyQuest {
  return {
    missionId: mission.id,
    questlineId,
    moduleId,
    reason,
    estimatedTime: mission.estimatedMinutes,
    xpReward: mission.isDaily ? mission.xpReward * 2 : mission.xpReward,
    priority,
  };
}

export function getDailyQuest(
  missions: StoredMission[],
  questlines: Questline[]
): DailyQuest | null {
  // Priority 1: mission already in progress (active)
  const active = missions.find((m) => m.status === "active");
  if (active) {
    const ql = questlines.find((q) =>
      q.modules.some((mod) => mod.missionIds.includes(active.id))
    );
    const mod = ql?.modules.find((m) => m.missionIds.includes(active.id));
    return buildResult(active, ql?.id ?? null, mod?.id ?? null, "Missão em andamento", 1);
  }

  // Priority 2: next available mission in active questline
  const activeQuestline = questlines.find((q) => q.status === "active");
  if (activeQuestline) {
    const sortedMods = [...activeQuestline.modules].sort((a, b) => a.order - b.order);
    for (const mod of sortedMods) {
      for (const missionId of mod.missionIds) {
        const m = missions.find((m) => m.id === missionId && m.status === "available");
        if (m) return buildResult(m, activeQuestline.id, mod.id, "Próxima missão da questline ativa", 2);
      }
    }
  }

  // Priority 3: module close to completion (unlock next module)
  if (activeQuestline) {
    let bestModuleId: string | null = null;
    let bestMission: StoredMission | null = null;
    let bestCompletion = 0;
    for (const mod of activeQuestline.modules) {
      if (mod.missionIds.length === 0) continue;
      const completedCount = mod.missionIds.filter(
        (mid) => missions.find((m) => m.id === mid)?.status === "completed"
      ).length;
      const completion = completedCount / mod.missionIds.length;
      if (completion > 0 && completion < 1 && completion > bestCompletion) {
        const nextId = mod.missionIds.find(
          (mid) => missions.find((m) => m.id === mid)?.status === "available"
        );
        const next = nextId ? missions.find((m) => m.id === nextId) : null;
        if (next) {
          bestCompletion = completion;
          bestMission = next;
          bestModuleId = mod.id;
        }
      }
    }
    if (bestMission && bestModuleId) {
      return buildResult(bestMission, activeQuestline.id, bestModuleId, "Quase lá! Finalize o módulo", 3);
    }
  }

  // Priority 4: boss battle available
  const bossQuestline = questlines.find((q) => q.bossBattle.status === "available");
  if (bossQuestline) {
    const bossMission = missions.find((m) => m.isBoss && m.status === "available");
    if (bossMission) return buildResult(bossMission, bossQuestline.id, null, "Boss Battle disponível!", 4);
  }

  // Priority 5: shortest available mission
  const available = missions.filter((m) => m.status === "available");
  if (available.length > 0) {
    const shortest = [...available].sort((a, b) => a.estimatedMinutes - b.estimatedMinutes)[0];
    return buildResult(shortest, null, null, "Missão mais rápida disponível", 5);
  }

  // Priority 6: highest XP non-completed
  const nonCompleted = missions.filter((m) => m.status !== "completed");
  if (nonCompleted.length > 0) {
    const mostXP = [...nonCompleted].sort((a, b) => b.xpReward - a.xpReward)[0];
    return buildResult(mostXP, null, null, "Maior recompensa disponível", 6);
  }

  return null;
}
