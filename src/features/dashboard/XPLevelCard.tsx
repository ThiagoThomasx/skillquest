"use client";

import { Trophy } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatXP } from "@/utils/format";

interface XPLevelCardProps {
  level: number;
  xp: number;
  xpToNextLevel: number;
  xpPerLevel: number;
}

export function XPLevelCard({ level, xp, xpToNextLevel, xpPerLevel }: XPLevelCardProps) {
  return (
    <Card variant="violet" className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-text-muted">Nível atual</p>
          <p className="text-3xl font-bold text-text mt-0.5">Nível {level}</p>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-violet/20 border border-violet-border flex items-center justify-center">
          <Trophy size={24} className="text-violet" />
        </div>
      </div>
      <ProgressBar value={xp} max={xp + xpToNextLevel} variant="violet" />
      <div className="flex justify-between mt-2">
        <span className="text-xs text-text-muted">{formatXP(xp)} XP</span>
        <span className="text-xs text-text-muted">{formatXP(xp + xpToNextLevel)} XP</span>
      </div>
    </Card>
  );
}
