"use client";

import { useEffect } from "react";
import { useMissionsStore } from "@/stores/missions-store";
import { useQuestlinesStore } from "@/stores/questlines-store";

export function StoreSync() {
  const missionKey = useMissionsStore((s) =>
    s.missions.map((m) => m.id + m.status).join(",")
  );
  const recalculateAll = useQuestlinesStore((s) => s.recalculateAll);

  useEffect(() => {
    recalculateAll();
  }, [missionKey, recalculateAll]);

  return null;
}
