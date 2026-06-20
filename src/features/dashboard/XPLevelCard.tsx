"use client";

import { TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatXP } from "@/utils/format";

interface XPLevelCardProps {
  level: number;
  xp: number;
  xpToNextLevel: number;
  xpPerLevel: number;
}

export function XPLevelCard({ level, xp, xpToNextLevel }: XPLevelCardProps) {
  return (
    <Card variant="blue" className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-text-muted">Nível atual</p>
          <p className="text-3xl font-bold text-text mt-0.5">Nível {level}</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-blue/20 border border-blue-border flex items-center justify-center">
          <TrendingUp size={20} className="text-blue" />
        </div>
      </div>
      <ProgressBar value={xp} max={xp + xpToNextLevel} variant="blue" />
      <div className="flex justify-between mt-2">
        <span className="text-xs text-text-muted">{formatXP(xp)} XP</span>
        <span className="text-xs text-text-muted">{formatXP(xp + xpToNextLevel)} XP</span>
      </div>
    </Card>
  );
}
