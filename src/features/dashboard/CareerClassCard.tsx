import {
  Sprout, Map, Zap, Star, Trophy, Crown, Lock,
  Sword, Shield, Wand2, Code2, Database, Globe,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const careerStages = [
  { title: "Aprendiz",    subtitle: "Nível 1–3",   icon: Sprout, done: true },
  { title: "Explorador",  subtitle: "Nível 4–6",   icon: Map,    done: true },
  { title: "Desenvolvedor", subtitle: "Nível 7–9", icon: Zap,    current: true },
  { title: "Especialista", subtitle: "Nível 10–13", icon: Star,  locked: true },
  { title: "Mestre",      subtitle: "Nível 14–17",  icon: Trophy, locked: true },
  { title: "Lenda",       subtitle: "Nível 18+",    icon: Crown,  locked: true },
];

const classes = [
  { name: "Frontend Mage",    icon: Wand2,    color: "text-sky",     bg: "bg-sky/10 border-sky/25",     active: true,  desc: "Encanta interfaces" },
  { name: "Backend Knight",   icon: Shield,   color: "text-blue",    bg: "bg-blue/10 border-blue/25",   active: false, desc: "Forja servidores" },
  { name: "Full-Stack Ranger", icon: Sword,   color: "text-emerald", bg: "bg-emerald/10 border-emerald/25", active: false, desc: "Percorre toda a stack" },
];

const questlines = [
  { name: "React Avançado",   missions: 8, done: 3, active: true },
  { name: "TypeScript Mestre", missions: 5, done: 2, active: false },
  { name: "DevOps Iniciante", missions: 6, done: 0, active: false },
];

export function CareerClassCard() {
  return (
    <Card className="p-5">
      {/* Header */}
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
          Classe &amp; Jornada de Carreira
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Column 1: Classe */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-dim mb-3">
            Sua Classe
          </p>
          <div className="space-y-2">
            {classes.map((cls) => {
              const Icon = cls.icon;
              return (
                <div
                  key={cls.name}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all",
                    cls.active
                      ? "bg-sky/5 border-sky/30"
                      : "bg-surface-overlay border-border opacity-60 cursor-not-allowed"
                  )}
                >
                  <div className={cn("w-7 h-7 rounded-lg border flex items-center justify-center shrink-0", cls.bg)}>
                    <Icon size={13} className={cls.color} />
                  </div>
                  <div className="min-w-0">
                    <p className={cn("text-xs font-bold truncate", cls.active ? "text-text" : "text-text-dim")}>
                      {cls.name}
                    </p>
                    <p className="text-[10px] text-text-dim">{cls.desc}</p>
                  </div>
                  {cls.active && (
                    <span className="ml-auto text-[9px] font-bold bg-sky/10 text-sky border border-sky/20 rounded-full px-1.5 py-0.5 shrink-0">
                      ativa
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Questlines */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-dim mb-3">
            Questlines
          </p>
          <div className="space-y-2">
            {questlines.map((q) => {
              const pct = Math.round((q.done / q.missions) * 100);
              return (
                <div
                  key={q.name}
                  className={cn(
                    "px-3 py-2.5 rounded-xl border",
                    q.active ? "bg-amber/5 border-amber/25" : "bg-surface-overlay border-border"
                  )}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <p className={cn("text-xs font-semibold", q.active ? "text-amber" : "text-text-muted")}>
                      {q.name}
                    </p>
                    <span className="text-[10px] text-text-dim">{q.done}/{q.missions}</span>
                  </div>
                  <div className="h-1 bg-surface rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full", q.active ? "bg-amber" : "bg-border-strong")}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 3: Career Journey */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-dim mb-3">
            Jornada
          </p>
          <div className="relative">
            <div className="absolute left-[14px] top-3 bottom-3 w-px bg-border" />
            <div className="space-y-2">
              {careerStages.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="flex items-center gap-2.5 relative">
                    <div
                      className={cn(
                        "relative w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 z-10",
                        step.current
                          ? "bg-amber/10 border-amber/30"
                          : step.done
                            ? "bg-emerald/10 border-emerald/30"
                            : "bg-surface border-border"
                      )}
                    >
                      {step.locked ? (
                        <Lock size={11} className="text-text-dim" />
                      ) : (
                        <Icon
                          size={12}
                          className={cn(
                            step.current ? "text-amber" : step.done ? "text-emerald" : "text-text-dim"
                          )}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-xs font-semibold",
                        step.current ? "text-amber" : step.done ? "text-text" : "text-text-dim"
                      )}>
                        {step.title}
                      </p>
                      <p className="text-[10px] text-text-dim">{step.subtitle}</p>
                    </div>
                    {step.current && (
                      <ChevronRight size={12} className="text-amber shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <p className="text-[11px] text-text-muted">
          Próxima classe:{" "}
          <span className="text-text font-semibold">Especialista</span>
          {" "}— Nível 10
        </p>
        <p className="text-[11px] text-text-muted">
          Questline ativa:{" "}
          <span className="text-amber font-semibold">React Avançado</span>
        </p>
      </div>
    </Card>
  );
}
