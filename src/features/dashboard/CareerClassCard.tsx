import { Sprout, Map, Zap, Star, Trophy, Crown, Lock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const steps = [
  { title: "Iniciante", subtitle: "Nível 1–3", icon: Sprout, done: true },
  { title: "Explorador", subtitle: "Nível 4–6", icon: Map, done: true },
  { title: "Desenvolvedor", subtitle: "Nível 7–9", icon: Zap, current: true },
  { title: "Especialista", subtitle: "Nível 10–13", icon: Star, locked: true },
  { title: "Mestre", subtitle: "Nível 14–17", icon: Trophy, locked: true },
  { title: "Lenda", subtitle: "Nível 18+", icon: Crown, locked: true },
];

export function CareerClassCard() {
  return (
    <Card className="p-5">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
          Classe e Carreira
        </p>
        <p className="text-sm font-semibold text-text mt-0.5">Trilha Frontend Developer</p>
      </div>

      <div className="relative">
        {/* Connecting line */}
        <div className="absolute left-[18px] top-4 bottom-4 w-px bg-border" />

        <div className="space-y-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="flex items-center gap-3 relative">
                {/* Step icon */}
                <div
                  className={cn(
                    "relative w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 z-10",
                    step.current
                      ? "bg-amber/10 border-amber/30"
                      : step.done
                        ? "bg-emerald/10 border-emerald/30"
                        : "bg-surface border-border"
                  )}
                >
                  {step.locked ? (
                    <Lock size={13} className="text-text-dim" />
                  ) : (
                    <Icon
                      size={14}
                      className={cn(
                        step.current ? "text-amber" : step.done ? "text-emerald" : "text-text-dim"
                      )}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        step.current
                          ? "text-amber"
                          : step.done
                            ? "text-text"
                            : "text-text-dim"
                      )}
                    >
                      {step.title}
                    </p>
                    {step.current && (
                      <span className="text-[10px] font-semibold bg-amber/10 text-amber border border-amber/20 rounded-full px-2 py-0.5">
                        atual
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-text-muted">{step.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-[11px] text-text-muted">
          Próxima classe:{" "}
          <span className="text-text font-semibold">Especialista</span>
          {" "}— Nível 10
        </p>
      </div>
    </Card>
  );
}
