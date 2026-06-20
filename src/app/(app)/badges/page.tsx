import { Card } from "@/components/ui/Card";
import { Badge as BadgeChip } from "@/components/ui/Badge";
import { Shield, Star, Zap, Flame, Trophy, Lock } from "lucide-react";

const badges = [
  { id: 1, title: "Primeiro Passo", description: "Completou sua primeira missão", icon: Star, color: "text-gold", bg: "bg-gold/10 border-gold-border", earned: true, date: "12 Jun" },
  { id: 2, title: "Sequência de Fogo", description: "7 dias consecutivos de estudo", icon: Flame, color: "text-rose", bg: "bg-rose/10 border-rose-muted", earned: true, date: "18 Jun" },
  { id: 3, title: "Mago do TypeScript", description: "Completou a trilha TypeScript", icon: Zap, color: "text-violet", bg: "bg-violet/10 border-violet-border", earned: true, date: "15 Jun" },
  { id: 4, title: "Campeão Frontend", description: "Completou a trilha Frontend", icon: Trophy, color: "text-emerald", bg: "bg-emerald/10 border-emerald/20", earned: false, date: null },
  { id: 5, title: "Escudo de Aço", description: "Zero erros em 10 missões seguidas", icon: Shield, color: "text-text-muted", bg: "bg-surface-overlay border-border", earned: false, date: null },
  { id: 6, title: "Lendário", description: "Alcance o nível 20", icon: Star, color: "text-text-muted", bg: "bg-surface-overlay border-border", earned: false, date: null },
];

export default function BadgesPage() {
  const earned = badges.filter((b) => b.earned);
  const locked = badges.filter((b) => !b.earned);

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-text">Insígnias</h2>
        <p className="text-text-muted mt-1">{earned.length} conquistadas · {locked.length} bloqueadas</p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Conquistadas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {earned.map((b) => {
            const Icon = b.icon;
            return (
              <Card key={b.id} hoverable className="p-5 flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${b.bg}`}>
                  <Icon size={22} className={b.color} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-text">{b.title}</p>
                  <p className="text-xs text-text-muted mt-0.5">{b.description}</p>
                  <BadgeChip variant="emerald" className="mt-2">{b.date}</BadgeChip>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Bloqueadas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {locked.map((b) => {
            const Icon = b.icon;
            return (
              <Card key={b.id} className="p-5 flex items-start gap-4 opacity-50">
                <div className="w-12 h-12 rounded-2xl border border-border bg-surface-overlay flex items-center justify-center shrink-0 relative">
                  <Icon size={22} className="text-text-dim" />
                  <Lock size={10} className="text-text-dim absolute bottom-1 right-1" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-text">{b.title}</p>
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
