"use client";

import { useProgressStore } from "@/stores/progress-store";
import { getCareerStage } from "@/engines/career-engine";
import { Zap, TrendingUp, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function LevelUpModal() {
  const { pendingLevelUp, levelUpData, currentLevel, dismissLevelUp } = useProgressStore();

  if (!pendingLevelUp || !levelUpData) return null;

  const career = getCareerStage(levelUpData.newLevel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={dismissLevelUp}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm rounded-2xl border border-amber/30 bg-surface-raised shadow-[0_0_60px_rgba(245,158,11,0.15)] overflow-hidden">
        {/* Top glow bar */}
        <div className="h-1 w-full bg-gradient-to-r from-amber via-yellow-300 to-amber" />

        {/* Close */}
        <button
          onClick={dismissLevelUp}
          className="absolute top-4 right-4 text-text-muted hover:text-text transition-colors"
        >
          <X size={16} />
        </button>

        <div className="p-8 text-center">
          {/* Icon */}
          <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-amber/10 border-2 border-amber/40 flex items-center justify-center">
            <TrendingUp size={36} className="text-amber" />
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-amber mb-2">
            Level Up!
          </p>

          <h2 className="text-5xl font-black text-text mb-1">
            Nível {levelUpData.newLevel}
          </h2>

          <p className="text-sm text-text-muted mb-1">{career.title}</p>
          <p className="text-xs text-text-dim mb-6">{career.description}</p>

          <div className="flex items-center justify-center gap-1 mb-8 text-sm font-semibold text-amber">
            <Zap size={14} />
            <span>+{levelUpData.xpGained} XP ganhos</span>
          </div>

          <Button variant="amber" className="w-full" onClick={dismissLevelUp}>
            Continuar jornada
          </Button>
        </div>
      </div>
    </div>
  );
}
