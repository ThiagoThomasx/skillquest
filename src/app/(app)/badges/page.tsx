import { Card } from "@/components/ui/Card";
import { Badge as BadgeChip } from "@/components/ui/Badge";
import { Star, Zap, Flame, Trophy, Lock, Award } from "lucide-react";

const badges = [
  { id: 1, title: "Primeiro Passo", description: "Completou sua primeira missão", icon: Star, color: "text-amber", bg: "bg-amber/10 border-amber-border", earned: true, date: "12 Jun" },
  { id: 2, title: "Sequência de Fogo", description: "7 dias consecutivos de estudo", icon: Flame, color: "text-rose", bg: "bg-rose/10 border-rose-border", earned: true, date: "18 Jun" },
  { id: 3, title: "TypeScript Expert", description: "Completou a trilha TypeScript", icon: Zap, color: "text-blue", bg: "bg-blue/10 border-blue-border", earned: true, date: "15 Jun" },
  { id: 4, title: "Campeão Frontend", description: "Completou a trilha Frontend", icon: Trophy, color: "text-emerald", bg: "bg-emerald/10 border-emerald-border", earned: false, date: null },
  { id: 5, title: "Precisão Perfeita", description: "Zero erros em 10 missões seguidas", icon: Award, color: "text-text-muted", bg: "bg-surface-overlay border-border", earned: false, date: null },
  { id: 6, title: "Lendário", description: "Alcance o nível 20", icon: Star, color: "text-text-muted", bg: "bg-surface-overlay border-border", earned: false, date: null },
];

export default function BadgesPage() {
  const earned = badges.filter((b) => b.earned);
  const locked = badges.filter((b) => !b.earned);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-semibold text-text">Conquistas</h2>
        <p className="text-sm text-text-muted mt-0.5">{earned.length} conquistadas · {locked.length} bloqueadas</p>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">Conquistadas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {earned.map((b) => {
            const Icon = b.icon;
            return (
              <Card key={b.id} hoverable className="p-4 flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${b.bg}`}>
                  <Icon size={18} className={b.color} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-text text-sm">{b.title}</p>
                  <p className="text-xs text-text-muted mt-0.5">{b.description}</p>
                  <BadgeChip variant="emerald" className="mt-2">{b.date}</BadgeChip>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">Bloqueadas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {locked.map((b) => {
            const Icon = b.icon;
            return (
              <Card key={b.id} className="p-4 flex items-start gap-3 opacity-40">
                <div className="w-10 h-10 rounded-xl border border-border bg-surface-overlay flex items-center justify-center shrink-0 relative">
                  <Icon size={18} className="text-text-dim" />
                  <Lock size={9} className="text-text-dim absolute bottom-1 right-1" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-text text-sm">{b.title}</p>
                  <p className="text-xs text-text-muted mt-0.5">{b.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
