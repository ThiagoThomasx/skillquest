"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Search, Filter, Crown, BookOpen, Target, Clock, Zap,
  ArrowRight, CheckCircle, Sparkles, Flame, Star, Shield,
  ChevronDown, X,
} from "lucide-react";
import {
  QUESTLINE_TEMPLATES,
  instantiateTemplate,
  type QuestlineTemplate,
} from "@/data/questline-templates";
import { useQuestlinesStore } from "@/stores/questlines-store";
import { useMissionsStore } from "@/stores/missions-store";
import type { QuestlineDifficulty } from "@/stores/questlines-store";

// ── Constants ─────────────────────────────────────────────────────────────────

const DIFFICULTY_BADGE: Record<QuestlineDifficulty, "blue" | "amber" | "rose" | "sky"> = {
  beginner: "blue",
  intermediate: "amber",
  advanced: "rose",
  expert: "sky",
};

const DIFFICULTY_LABEL: Record<QuestlineDifficulty, string> = {
  beginner: "Iniciante",
  intermediate: "Intermediário",
  advanced: "Avançado",
  expert: "Expert",
};

const DIFFICULTY_ICON: Record<QuestlineDifficulty, string> = {
  beginner: "★☆☆☆",
  intermediate: "★★☆☆",
  advanced: "★★★☆",
  expert: "★★★★",
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Frontend: Sparkles,
  Segurança: Shield,
  Programação: Zap,
  "Cloud & DevOps": Crown,
  Dados: Star,
  "RH & Recrutamento": Flame,
};

const ALL_CATEGORIES = Array.from(new Set(QUESTLINE_TEMPLATES.map((t) => t.category)));
const ALL_DIFFICULTIES: QuestlineDifficulty[] = ["beginner", "intermediate", "advanced", "expert"];

// ── Template Card ─────────────────────────────────────────────────────────────

function ExploreCard({ tpl }: { tpl: QuestlineTemplate }) {
  const { addQuestline } = useQuestlinesStore();
  const { addMission } = useMissionsStore();
  const { questlines } = useQuestlinesStore();
  const [installing, setInstalling] = useState(false);

  const alreadyInstalled = questlines.some(
    (q) => q.title === tpl.title && q.status !== "archived"
  );

  const totalMissions = tpl.modules.reduce((sum, m) => sum + m.missions.length, 0);
  const totalXP = tpl.modules.reduce(
    (sum, m) => sum + m.missions.reduce((s, ms) => s + ms.xpReward, 0),
    tpl.bossXP
  );
  const totalChecklist = tpl.modules.reduce(
    (sum, m) => sum + m.missions.reduce((s, ms) => s + (ms.checklist?.length ?? 0), 0),
    0
  );

  const CategoryIcon = CATEGORY_ICONS[tpl.category] ?? BookOpen;

  function handleInstall() {
    if (alreadyInstalled || installing) return;
    setInstalling(true);
    const { questline, missions } = instantiateTemplate(tpl);
    missions.forEach((m) => addMission(m));
    addQuestline({
      title: questline.title,
      description: questline.description,
      category: questline.category,
      className: questline.className,
      difficulty: questline.difficulty,
      estimatedHours: questline.estimatedHours,
      status: "active",
      modules: questline.modules,
      bossBattle: questline.bossBattle,
    });
  }

  return (
    <Card hoverable className="flex flex-col overflow-hidden group transition-all duration-200 hover:border-blue/30">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-blue/10 border border-blue/20 flex items-center justify-center shrink-0 group-hover:bg-blue/15 transition-colors">
          <CategoryIcon size={18} className="text-blue" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Badge variant={DIFFICULTY_BADGE[tpl.difficulty]}>
              {DIFFICULTY_LABEL[tpl.difficulty]}
            </Badge>
            {tpl.featured && (
              <Badge variant="amber">
                <Star size={9} className="mr-0.5" />
                {tpl.highlight ?? "Destaque"}
              </Badge>
            )}
          </div>
          <h3 className="font-bold text-text text-base leading-tight">{tpl.title}</h3>
          <p className="text-xs text-blue font-medium mt-0.5">{tpl.className}</p>
        </div>
      </div>

      <CardContent className="pt-0 flex flex-col flex-1 px-5 pb-5">
        <p className="text-xs text-text-muted leading-relaxed mb-4 line-clamp-2">
          {tpl.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {tpl.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-surface-raised border border-border text-text-muted"
            >
              {tag}
            </span>
          ))}
          {tpl.tags.length > 4 && (
            <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-surface-raised border border-border text-text-dim">
              +{tpl.tags.length - 4}
            </span>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { icon: BookOpen, label: "Módulos", value: String(tpl.modules.length), color: "text-sky" },
            { icon: Target, label: "Missões", value: String(totalMissions), color: "text-blue" },
            { icon: Clock, label: "Horas", value: `${tpl.estimatedHours}h`, color: "text-text-muted" },
            { icon: Zap, label: "XP Total", value: String(totalXP), color: "text-amber" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div
              key={label}
              className="flex items-center gap-2 p-2 rounded-lg bg-surface-raised border border-border"
            >
              <Icon size={12} className={color} />
              <div>
                <p className="text-[9px] text-text-dim uppercase tracking-wide leading-none">{label}</p>
                <p className={`text-xs font-bold ${color} leading-tight mt-0.5`}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Checklist count */}
        {totalChecklist > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-emerald mb-4">
            <CheckCircle size={11} />
            <span>{totalChecklist} itens de checklist inclusos</span>
          </div>
        )}

        {/* Difficulty stars */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] text-text-dim uppercase tracking-wider">Dificuldade</span>
          <span className="text-amber text-xs tracking-widest">{DIFFICULTY_ICON[tpl.difficulty]}</span>
        </div>

        {/* Action */}
        <div className="mt-auto">
          <Button
            variant={alreadyInstalled ? "secondary" : "primary"}
            size="sm"
            className="w-full"
            disabled={alreadyInstalled || installing}
            onClick={handleInstall}
          >
            {alreadyInstalled ? (
              <><CheckCircle size={13} /> Instalada</>
            ) : (
              <>Instalar Trilha <ArrowRight size={13} /></>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuestlineDifficulty | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    return QUESTLINE_TEMPLATES.filter((tpl) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        tpl.title.toLowerCase().includes(q) ||
        tpl.description.toLowerCase().includes(q) ||
        tpl.tags.some((t) => t.toLowerCase().includes(q)) ||
        tpl.className.toLowerCase().includes(q);
      const matchesCategory = !selectedCategory || tpl.category === selectedCategory;
      const matchesDifficulty = !selectedDifficulty || tpl.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [search, selectedCategory, selectedDifficulty]);

  const hasFilters = selectedCategory !== null || selectedDifficulty !== null;

  function clearFilters() {
    setSelectedCategory(null);
    setSelectedDifficulty(null);
  }

  const totalMissionsAll = QUESTLINE_TEMPLATES.reduce(
    (sum, t) => sum + t.modules.reduce((s, m) => s + m.missions.length, 0),
    0
  );

  return (
    <div className="space-y-6 max-w-6xl">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-blue/20 bg-gradient-to-br from-blue/10 via-surface to-surface-raised p-6">
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 text-blue text-xs font-semibold uppercase tracking-widest mb-2">
            <Crown size={13} /> Content Pack
          </div>
          <h1 className="text-3xl font-bold text-text mb-1">Explorar Trilhas</h1>
          <p className="text-text-muted text-sm mb-5">
            Escolha sua carreira tech e comece imediatamente. Trilhas completas com módulos, missões, checklists e boss battles.
          </p>
          <div className="flex flex-wrap gap-5 text-xs text-text-muted">
            <span className="flex items-center gap-1.5">
              <BookOpen size={12} className="text-blue" />
              <strong className="text-text">{QUESTLINE_TEMPLATES.length}</strong> trilhas disponíveis
            </span>
            <span className="flex items-center gap-1.5">
              <Target size={12} className="text-emerald" />
              <strong className="text-text">{totalMissionsAll}</strong> missões prontas
            </span>
            <span className="flex items-center gap-1.5">
              <Zap size={12} className="text-amber" />
              Conteúdo local, sem conta
            </span>
          </div>
        </div>
      </div>

      {/* ── Search & Filters ──────────────────────────────────────────────── */}
      <div className="space-y-3">
        {/* Search bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, tecnologia ou classe..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-surface-raised text-sm text-text placeholder:text-text-dim focus:outline-none focus:ring-1 focus:ring-blue focus:border-blue"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text"
              >
                <X size={13} />
              </button>
            )}
          </div>
          <Button
            variant={filtersOpen || hasFilters ? "primary" : "secondary"}
            size="sm"
            onClick={() => setFiltersOpen((v) => !v)}
          >
            <Filter size={13} />
            Filtros
            {hasFilters && (
              <span className="ml-1 bg-white/20 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {(selectedCategory ? 1 : 0) + (selectedDifficulty ? 1 : 0)}
              </span>
            )}
            <ChevronDown size={12} className={`ml-1 transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
          </Button>
        </div>

        {/* Filter panel */}
        {filtersOpen && (
          <div className="p-4 rounded-xl border border-border bg-surface-raised space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category filter */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-2">Categoria</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                      className={`px-2.5 py-1 text-xs rounded-lg border font-medium transition-colors ${
                        selectedCategory === cat
                          ? "bg-blue text-white border-blue"
                          : "bg-surface border-border text-text-muted hover:text-text"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty filter */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-2">Dificuldade</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_DIFFICULTIES.map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? null : diff)}
                      className={`px-2.5 py-1 text-xs rounded-lg border font-medium transition-colors ${
                        selectedDifficulty === diff
                          ? "bg-blue text-white border-blue"
                          : "bg-surface border-border text-text-muted hover:text-text"
                      }`}
                    >
                      {DIFFICULTY_LABEL[diff]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-xs text-rose hover:text-rose/80 font-medium transition-colors"
              >
                <X size={11} /> Limpar filtros
              </button>
            )}
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-text-muted">
            {filtered.length === QUESTLINE_TEMPLATES.length
              ? `${filtered.length} trilhas disponíveis`
              : `${filtered.length} de ${QUESTLINE_TEMPLATES.length} trilhas`}
          </p>
          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-blue hover:underline">
              Ver todas
            </button>
          )}
        </div>
      </div>

      {/* ── Featured banner ───────────────────────────────────────────────── */}
      {!search && !hasFilters && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-amber/20 bg-amber/5">
          <Sparkles size={16} className="text-amber shrink-0" />
          <div>
            <p className="text-sm font-semibold text-text">Trilhas prontas para uso imediato</p>
            <p className="text-xs text-text-muted">
              Instale qualquer trilha e comece agora. Módulos, missões, checklists e boss battles já configurados.
            </p>
          </div>
        </div>
      )}

      {/* ── Grid ──────────────────────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((tpl) => (
            <ExploreCard key={tpl.templateId} tpl={tpl} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Search size={36} className="text-text-dim mx-auto mb-3" />
          <p className="text-sm font-semibold text-text">Nenhuma trilha encontrada</p>
          <p className="text-xs text-text-muted mt-1 mb-4">
            Tente outros termos ou{" "}
            <button
              onClick={() => { setSearch(""); clearFilters(); }}
              className="text-blue hover:underline"
            >
              limpe os filtros
            </button>
            .
          </p>
        </div>
      )}
    </div>
  );
}
