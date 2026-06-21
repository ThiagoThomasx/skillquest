"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Map, Lock, CheckCircle, Zap, Star, Skull, ChevronRight, Swords,
  Crown, Sparkles, Trophy, ArrowRight, Flame, Plus, Pencil, Trash2,
  Copy, Archive, Target, BookOpen, Clock, Package, Shield, ChevronDown,
} from "lucide-react";
import {
  useQuestlinesStore,
  type Questline,
  type QuestlineModule,
  type QuestlineDifficulty,
  type QuestlineStatus,
  type BossBattleStatus,
} from "@/stores/questlines-store";
import { useMissionsStore, type StoredMission } from "@/stores/missions-store";
import {
  calculateQuestlineProgress,
  calculateQuestlineEarnedXP,
  calculateQuestlineTotalXP,
  calculateModuleProgress,
  isModuleCompleted,
  countQuestlineMissions,
} from "@/utils/questline-engine";
import { QUESTLINE_TEMPLATES, instantiateTemplate } from "@/data/questline-templates";

// ── Constants ─────────────────────────────────────────────────────────────────

const DIFFICULTY_OPTIONS: { value: QuestlineDifficulty; label: string }[] = [
  { value: "beginner", label: "Iniciante" },
  { value: "intermediate", label: "Intermediário" },
  { value: "advanced", label: "Avançado" },
  { value: "expert", label: "Expert" },
];

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

const CATEGORY_OPTIONS = ["Frontend", "Backend", "Segurança", "Cloud & DevOps", "Dados", "Mobile", "Programação", "RH & Recrutamento", "Outro"];
const CLASS_OPTIONS = ["Frontend Mage", "Backend Wizard", "Cyber Guardian", "Cloud Architect", "Data Sage", "Script Wizard", "Talent Hunter", "Full-Stack Paladin"];

// ── Form types ─────────────────────────────────────────────────────────────────

interface QuestlineFormData {
  title: string;
  description: string;
  category: string;
  className: string;
  difficulty: QuestlineDifficulty;
  estimatedHours: number;
  bossTitle: string;
  bossDescription: string;
  bossXP: number;
}

const emptyQuestlineForm = (): QuestlineFormData => ({
  title: "",
  description: "",
  category: "Frontend",
  className: "Frontend Mage",
  difficulty: "intermediate",
  estimatedHours: 10,
  bossTitle: "",
  bossDescription: "",
  bossXP: 500,
});

interface ModuleFormData {
  title: string;
  description: string;
  order: number;
  xpReward: number;
}

const emptyModuleForm = (nextOrder: number): ModuleFormData => ({
  title: "",
  description: "",
  order: nextOrder,
  xpReward: 50,
});

interface MissionFormData {
  title: string;
  description: string;
  category: StoredMission["category"];
  difficulty: StoredMission["difficulty"];
  xpReward: number;
  estimatedMinutes: number;
  objectivesText: string;
  rewardsText: string;
}

const emptyMissionForm = (): MissionFormData => ({
  title: "",
  description: "",
  category: "Main Quest",
  difficulty: "medium",
  xpReward: 100,
  estimatedMinutes: 30,
  objectivesText: "",
  rewardsText: "",
});

// ── Sub-components ────────────────────────────────────────────────────────────

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full px-3 py-2 rounded-lg border border-border bg-surface-raised text-sm text-text placeholder:text-text-dim focus:outline-none focus:ring-1 focus:ring-blue focus:border-blue ${className}`}
      {...props}
    />
  );
}

function Textarea({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={3}
      className={`w-full px-3 py-2 rounded-lg border border-border bg-surface-raised text-sm text-text placeholder:text-text-dim focus:outline-none focus:ring-1 focus:ring-blue focus:border-blue resize-none ${className}`}
      {...props}
    />
  );
}

function Select({ className = "", ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`w-full px-3 py-2 rounded-lg border border-border bg-surface-raised text-sm text-text focus:outline-none focus:ring-1 focus:ring-blue focus:border-blue ${className}`}
      {...props}
    />
  );
}

// ── Questline Dialog ──────────────────────────────────────────────────────────

function QuestlineDialog({
  open,
  onClose,
  existing,
}: {
  open: boolean;
  onClose: () => void;
  existing?: Questline | null;
}) {
  const { addQuestline, updateQuestline } = useQuestlinesStore();
  const [form, setForm] = useState<QuestlineFormData>(
    existing
      ? {
          title: existing.title,
          description: existing.description,
          category: existing.category,
          className: existing.className,
          difficulty: existing.difficulty,
          estimatedHours: existing.estimatedHours,
          bossTitle: existing.bossBattle.title,
          bossDescription: existing.bossBattle.description,
          bossXP: existing.bossBattle.xpReward,
        }
      : emptyQuestlineForm()
  );
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!form.title.trim()) { setError("Título é obrigatório."); return; }
    if (!form.bossTitle.trim()) { setError("Título do Boss Battle é obrigatório."); return; }

    if (existing) {
      updateQuestline(existing.id, {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        className: form.className,
        difficulty: form.difficulty,
        estimatedHours: Math.max(1, form.estimatedHours),
      });
    } else {
      addQuestline({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        className: form.className,
        difficulty: form.difficulty,
        estimatedHours: Math.max(1, form.estimatedHours),
        status: "available",
        modules: [],
        bossBattle: {
          id: "boss-" + Math.random().toString(36).slice(2, 8),
          title: form.bossTitle.trim(),
          description: form.bossDescription.trim(),
          xpReward: Math.max(100, form.bossXP),
          status: "locked" as BossBattleStatus,
          requirements: ["Completar todos os módulos"],
          completedAt: null,
        },
      });
    }
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-surface border-border max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-text">{existing ? "Editar Questline" : "Nova Questline"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <FormField label="Título *">
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex: React Avançado" />
          </FormField>
          <FormField label="Descrição">
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descreva o objetivo desta trilha..." />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Categoria">
              <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </FormField>
            <FormField label="Classe">
              <Select value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })}>
                {CLASS_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Dificuldade">
              <Select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value as QuestlineDifficulty })}>
                {DIFFICULTY_OPTIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
              </Select>
            </FormField>
            <FormField label="Horas Estimadas">
              <Input type="number" value={form.estimatedHours} min={1} onChange={(e) => setForm({ ...form, estimatedHours: Number(e.target.value) })} />
            </FormField>
          </div>

          {!existing && (
            <div className="pt-3 border-t border-border space-y-3">
              <p className="text-xs font-semibold text-amber uppercase tracking-wide flex items-center gap-1.5">
                <Skull size={12} /> Boss Battle
              </p>
              <FormField label="Título do Boss *">
                <Input value={form.bossTitle} onChange={(e) => setForm({ ...form, bossTitle: e.target.value })} placeholder="Ex: O Arquimago das APIs" />
              </FormField>
              <FormField label="Descrição do Boss">
                <Textarea value={form.bossDescription} onChange={(e) => setForm({ ...form, bossDescription: e.target.value })} placeholder="O desafio final da trilha..." />
              </FormField>
              <FormField label="XP Recompensa">
                <Input type="number" value={form.bossXP} min={100} step={50} onChange={(e) => setForm({ ...form, bossXP: Number(e.target.value) })} />
              </FormField>
            </div>
          )}

          {error && <p className="text-xs text-rose font-medium">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            {existing ? "Salvar Alterações" : "Criar Questline"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Module Dialog ─────────────────────────────────────────────────────────────

function ModuleDialog({
  open,
  onClose,
  questlineId,
  existing,
  nextOrder,
}: {
  open: boolean;
  onClose: () => void;
  questlineId: string;
  existing?: QuestlineModule | null;
  nextOrder: number;
}) {
  const { addModule, updateModule } = useQuestlinesStore();
  const [form, setForm] = useState<ModuleFormData>(
    existing
      ? { title: existing.title, description: existing.description, order: existing.order, xpReward: existing.xpReward }
      : emptyModuleForm(nextOrder)
  );
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!form.title.trim()) { setError("Título é obrigatório."); return; }
    if (existing) {
      updateModule(questlineId, existing.id, {
        title: form.title.trim(),
        description: form.description.trim(),
        order: form.order,
        xpReward: Math.max(0, form.xpReward),
      });
    } else {
      addModule(questlineId, {
        title: form.title.trim(),
        description: form.description.trim(),
        order: form.order,
        xpReward: Math.max(0, form.xpReward),
        status: "available",
        missionIds: [],
      });
    }
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-surface border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-text">{existing ? "Editar Módulo" : "Novo Módulo"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <FormField label="Título *">
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex: Hooks Avançados" />
          </FormField>
          <FormField label="Descrição">
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Sobre este módulo..." />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Ordem">
              <Input type="number" value={form.order} min={1} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            </FormField>
            <FormField label="XP Bônus Módulo">
              <Input type="number" value={form.xpReward} min={0} step={25} onChange={(e) => setForm({ ...form, xpReward: Number(e.target.value) })} />
            </FormField>
          </div>
          {error && <p className="text-xs text-rose font-medium">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            {existing ? "Salvar" : "Criar Módulo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Mission Dialog ─────────────────────────────────────────────────────────────

function MissionDialog({
  open,
  onClose,
  questlineId,
  moduleId,
  questlineTitle,
}: {
  open: boolean;
  onClose: () => void;
  questlineId: string;
  moduleId: string;
  questlineTitle: string;
}) {
  const { addMission } = useMissionsStore();
  const { addMissionToModule } = useQuestlinesStore();
  const [form, setForm] = useState<MissionFormData>(emptyMissionForm());
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!form.title.trim()) { setError("Título é obrigatório."); return; }
    const missionId = "m-" + Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
    const objectives = form.objectivesText.split("\n").map((s) => s.trim()).filter(Boolean);
    const rewards = form.rewardsText.split("\n").map((s) => s.trim()).filter(Boolean);
    addMission({
      id: missionId,
      title: form.title.trim(),
      description: form.description.trim(),
      pathId: questlineId,
      pathTitle: questlineTitle,
      category: form.category,
      xpReward: Math.max(10, form.xpReward),
      estimatedMinutes: Math.max(5, form.estimatedMinutes),
      difficulty: form.difficulty,
      status: "available",
      progress: 0,
      objectives: objectives.length ? objectives : ["Completar a missão"],
      rewards: rewards.length ? rewards : [`${form.xpReward} XP`],
      isMainQuest: form.category === "Main Quest",
      isDaily: form.category === "Daily",
      isBoss: form.category === "Boss Quest",
      createdAt: new Date().toISOString(),
      completedAt: null,
    });
    addMissionToModule(questlineId, moduleId, missionId);
    setForm(emptyMissionForm());
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-surface border-border max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-text">Nova Missão</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <FormField label="Título *">
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex: useState na Prática" />
          </FormField>
          <FormField label="Descrição">
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="O que o jogador vai aprender..." />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Categoria">
              <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as StoredMission["category"] })}>
                <option value="Main Quest">Main Quest</option>
                <option value="Side Quest">Side Quest</option>
                <option value="Daily">Daily</option>
                <option value="Boss Quest">Boss Quest</option>
              </Select>
            </FormField>
            <FormField label="Dificuldade">
              <Select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value as StoredMission["difficulty"] })}>
                <option value="easy">Fácil</option>
                <option value="medium">Médio</option>
                <option value="hard">Difícil</option>
                <option value="legendary">Lendário</option>
              </Select>
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="XP Recompensa">
              <Input type="number" value={form.xpReward} min={10} step={25} onChange={(e) => setForm({ ...form, xpReward: Number(e.target.value) })} />
            </FormField>
            <FormField label="Tempo Estimado (min)">
              <Input type="number" value={form.estimatedMinutes} min={5} step={5} onChange={(e) => setForm({ ...form, estimatedMinutes: Number(e.target.value) })} />
            </FormField>
          </div>
          <FormField label="Objetivos (um por linha)">
            <Textarea value={form.objectivesText} onChange={(e) => setForm({ ...form, objectivesText: e.target.value })} placeholder={"Criar componente\nUsar useState\nTestar no browser"} />
          </FormField>
          <FormField label="Recompensas (um por linha)">
            <Textarea rows={2} value={form.rewardsText} onChange={(e) => setForm({ ...form, rewardsText: e.target.value })} placeholder={`${form.xpReward} XP\nBadge: Especialista`} />
          </FormField>
          {error && <p className="text-xs text-rose font-medium">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>Criar Missão</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Delete Confirm Dialog ──────────────────────────────────────────────────────

function DeleteDialog({
  open,
  onClose,
  title,
  description,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-surface border-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-text">{title}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-text-muted">{description}</p>
        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={onClose}>Cancelar</Button>
          <Button variant="secondary" size="sm" className="text-rose border-rose/30 hover:bg-rose/10" onClick={() => { onConfirm(); onClose(); }}>
            <Trash2 size={13} /> Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Module Card ───────────────────────────────────────────────────────────────

function ModuleRow({
  mod,
  questlineId,
  questlineTitle,
  allMissions,
  onEdit,
  onDelete,
}: {
  mod: QuestlineModule;
  questlineId: string;
  questlineTitle: string;
  allMissions: StoredMission[];
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [missionDialogOpen, setMissionDialogOpen] = useState(false);
  const { removeMissionFromModule } = useQuestlinesStore();
  const { deleteMission } = useMissionsStore();

  const progress = calculateModuleProgress(mod, allMissions);
  const completed = isModuleCompleted(mod, allMissions);
  const modMissions = mod.missionIds
    .map((id) => allMissions.find((m) => m.id === id))
    .filter((m): m is StoredMission => m !== undefined);

  return (
    <div className={`rounded-lg border transition-all ${completed ? "border-emerald/20 bg-emerald/[0.02]" : "border-border bg-surface-overlay"}`}>
      <div className="flex items-center gap-3 p-3">
        <div className={`w-7 h-7 rounded flex items-center justify-center text-xs font-bold shrink-0 ${
          completed ? "bg-emerald/20 text-emerald" : "bg-surface-raised text-text-dim"
        }`}>
          {completed ? "✓" : mod.order}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-text truncate">{mod.title}</p>
            {completed && <Badge variant="emerald">Concluído</Badge>}
          </div>
          <div className="flex items-center gap-3 text-xs text-text-muted mt-0.5">
            <span className="flex items-center gap-1"><Target size={10} />{mod.missionIds.length} missões</span>
            <span className="flex items-center gap-1"><Zap size={10} className="text-amber" />{progress}%</span>
          </div>
        </div>
        {mod.missionIds.length > 0 && (
          <div className="w-20">
            <ProgressBar value={progress} variant={completed ? "emerald" : "blue"} size="xs" />
          </div>
        )}
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={onEdit} className="w-7 h-7 rounded flex items-center justify-center text-text-dim hover:text-blue hover:bg-blue/10 transition-colors">
            <Pencil size={12} />
          </button>
          <button onClick={onDelete} className="w-7 h-7 rounded flex items-center justify-center text-text-dim hover:text-rose hover:bg-rose/10 transition-colors">
            <Trash2 size={12} />
          </button>
          <button onClick={() => setExpanded(!expanded)} className="w-7 h-7 rounded flex items-center justify-center text-text-dim hover:text-text transition-colors">
            <ChevronDown size={12} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 space-y-1.5 border-t border-border pt-2">
          {modMissions.length === 0 ? (
            <p className="text-xs text-text-dim italic">Nenhuma missão neste módulo.</p>
          ) : (
            modMissions.map((m) => (
              <div key={m.id} className="flex items-center gap-2 px-2 py-1.5 rounded bg-surface-raised">
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  m.status === "completed" ? "bg-emerald" : m.status === "active" ? "bg-blue" : "bg-text-dim"
                }`} />
                <p className="flex-1 text-xs text-text truncate">{m.title}</p>
                <span className="text-[10px] text-amber font-medium">{m.xpReward} XP</span>
                <button
                  onClick={() => {
                    removeMissionFromModule(questlineId, mod.id, m.id);
                    deleteMission(m.id);
                  }}
                  className="w-5 h-5 rounded flex items-center justify-center text-text-dim hover:text-rose transition-colors"
                >
                  <Trash2 size={10} />
                </button>
              </div>
            ))
          )}
          <button
            onClick={() => setMissionDialogOpen(true)}
            className="flex items-center gap-1.5 text-xs text-blue hover:text-blue/80 font-medium mt-1 transition-colors"
          >
            <Plus size={12} /> Nova Missão
          </button>
        </div>
      )}

      <MissionDialog
        open={missionDialogOpen}
        onClose={() => setMissionDialogOpen(false)}
        questlineId={questlineId}
        moduleId={mod.id}
        questlineTitle={questlineTitle}
      />
    </div>
  );
}

// ── Questline Card ─────────────────────────────────────────────────────────────

function QuestlineCard({
  q,
  allMissions,
  onEdit,
  onDelete,
  onArchive,
  onDuplicate,
}: {
  q: Questline;
  allMissions: StoredMission[];
  onEdit: () => void;
  onDelete: () => void;
  onArchive: () => void;
  onDuplicate: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<QuestlineModule | null>(null);
  const [deletingModule, setDeletingModule] = useState<string | null>(null);
  const [bossConfirmOpen, setBossConfirmOpen] = useState(false);

  const { deleteModule, completeBossBattle } = useQuestlinesStore();

  const progress = calculateQuestlineProgress(q, allMissions);
  const earnedXP = calculateQuestlineEarnedXP(q, allMissions);
  const totalXP = calculateQuestlineTotalXP(q, allMissions);
  const totalMissions = countQuestlineMissions(q);

  const isActive = q.status === "active";
  const isCompleted = q.status === "completed";
  const isArchived = q.status === "archived";
  const bossAvailable = q.bossBattle.status === "available";
  const bossCompleted = q.bossBattle.status === "completed";

  const statusVariant = isCompleted ? "emerald" : isActive ? "blue" : isArchived ? "default" : "default";
  const statusLabel = isCompleted ? "Concluída" : isActive ? "Ativa" : isArchived ? "Arquivada" : "Disponível";

  const sortedModules = [...q.modules].sort((a, b) => a.order - b.order);

  return (
    <Card className={`overflow-hidden transition-all ${
      isActive ? "border-blue/20 ring-1 ring-blue/5" :
      isCompleted ? "border-emerald/20" :
      isArchived ? "opacity-60" : ""
    }`}>
      <CardHeader>
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 ${
            isCompleted ? "bg-emerald/10 border-emerald-border" :
            isArchived ? "bg-surface-overlay border-border" :
            "bg-blue/10 border-blue-border"
          }`}>
            {isCompleted ? <CheckCircle size={18} className="text-emerald" /> :
             isArchived ? <Archive size={18} className="text-text-dim" /> :
             <Sparkles size={18} className="text-blue" />}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-bold text-text">{q.title}</h3>
                  {isActive && <Flame size={12} className="text-amber shrink-0" />}
                </div>
                <p className="text-xs text-text-muted leading-relaxed line-clamp-2">{q.description}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={statusVariant}>{statusLabel}</Badge>
                <Badge variant={DIFFICULTY_BADGE[q.difficulty]}>{DIFFICULTY_LABEL[q.difficulty]}</Badge>
              </div>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-text-muted">
              <span className="flex items-center gap-1"><Shield size={10} />{q.className}</span>
              <span className="flex items-center gap-1"><BookOpen size={10} />{totalMissions} missões</span>
              <span className="flex items-center gap-1"><Clock size={10} />{q.estimatedHours}h</span>
              <span className="flex items-center gap-1 text-amber font-medium">
                <Zap size={10} className="text-amber" />{earnedXP}/{totalXP} XP
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Progress */}
        {totalMissions > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-text-muted">
              <span>Progresso</span>
              <span className={isCompleted ? "text-emerald font-medium" : ""}>{progress}%</span>
            </div>
            <ProgressBar value={progress} variant={isCompleted ? "emerald" : "blue"} size="sm" />
          </div>
        )}

        {/* Boss Battle */}
        <div className={`flex items-center justify-between p-2.5 rounded-lg border ${
          bossCompleted ? "bg-emerald/5 border-emerald/20" :
          bossAvailable ? "bg-amber/5 border-amber/30" :
          "bg-surface-overlay border-border"
        }`}>
          <div className="flex items-center gap-2">
            <Skull size={13} className={bossCompleted ? "text-emerald" : bossAvailable ? "text-amber" : "text-text-dim"} />
            <div>
              <p className="text-xs font-medium text-text">{q.bossBattle.title}</p>
              <p className="text-[10px] text-amber">+{q.bossBattle.xpReward} XP</p>
            </div>
          </div>
          {bossCompleted ? (
            <Badge variant="emerald">Derrotado!</Badge>
          ) : bossAvailable ? (
            <Button variant="amber" size="sm" onClick={() => setBossConfirmOpen(true)}>
              <Swords size={12} /> Batalhar!
            </Button>
          ) : (
            <Badge variant="default">Bloqueado</Badge>
          )}
        </div>

        {/* Modules section */}
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors w-full py-1"
          >
            <Map size={11} />
            {expanded ? "Ocultar" : "Ver"} módulos ({q.modules.length})
            <ChevronRight size={11} className={`ml-auto transition-transform ${expanded ? "rotate-90" : ""}`} />
          </button>

          {expanded && (
            <div className="space-y-2 pt-2">
              {sortedModules.map((mod) => (
                <ModuleRow
                  key={mod.id}
                  mod={mod}
                  questlineId={q.id}
                  questlineTitle={q.title}
                  allMissions={allMissions}
                  onEdit={() => setEditingModule(mod)}
                  onDelete={() => setDeletingModule(mod.id)}
                />
              ))}
              <button
                onClick={() => setModuleDialogOpen(true)}
                className="flex items-center gap-1.5 text-xs text-blue hover:text-blue/80 font-medium py-1 transition-colors"
              >
                <Plus size={12} /> Adicionar Módulo
              </button>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-1 border-t border-border flex-wrap">
          <Button variant="ghost" size="sm" onClick={onEdit}><Pencil size={12} />Editar</Button>
          <Button variant="ghost" size="sm" onClick={onDuplicate}><Copy size={12} />Duplicar</Button>
          {!isArchived && (
            <Button variant="ghost" size="sm" onClick={onArchive}><Archive size={12} />Arquivar</Button>
          )}
          <Button variant="ghost" size="sm" className="text-rose hover:bg-rose/10 ml-auto" onClick={onDelete}>
            <Trash2 size={12} />Excluir
          </Button>
        </div>
      </CardContent>

      {/* Nested dialogs */}
      <ModuleDialog
        open={moduleDialogOpen || !!editingModule}
        onClose={() => { setModuleDialogOpen(false); setEditingModule(null); }}
        questlineId={q.id}
        existing={editingModule}
        nextOrder={q.modules.length + 1}
      />
      <DeleteDialog
        open={!!deletingModule}
        onClose={() => setDeletingModule(null)}
        title="Excluir módulo?"
        description="O módulo e todas as suas missões serão removidos permanentemente."
        onConfirm={() => {
          if (deletingModule) {
            const mod = q.modules.find((m) => m.id === deletingModule);
            if (mod) {
              const { deleteMission } = useMissionsStore.getState();
              mod.missionIds.forEach((mid) => deleteMission(mid));
            }
            deleteModule(q.id, deletingModule);
          }
        }}
      />
      <Dialog open={bossConfirmOpen} onOpenChange={(v) => !v && setBossConfirmOpen(false)}>
        <DialogContent className="bg-surface border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-text flex items-center gap-2">
              <Swords size={16} className="text-amber" /> Boss Battle!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-text">{q.bossBattle.title}</p>
            <p className="text-xs text-text-muted">{q.bossBattle.description}</p>
            <div className="flex items-center gap-1 text-amber text-sm font-bold">
              <Zap size={14} /> +{q.bossBattle.xpReward} XP de recompensa
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setBossConfirmOpen(false)}>Cancelar</Button>
            <Button variant="amber" size="sm" onClick={() => { completeBossBattle(q.id); setBossConfirmOpen(false); }}>
              <Trophy size={13} /> Concluir Boss Battle!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// ── Template Card ──────────────────────────────────────────────────────────────

function TemplateCard({ tpl }: { tpl: typeof QUESTLINE_TEMPLATES[0] }) {
  const { addQuestline } = useQuestlinesStore();
  const { addMission } = useMissionsStore();
  const [used, setUsed] = useState(false);

  const totalMissions = tpl.modules.reduce((sum, m) => sum + m.missions.length, 0);
  const totalXP = tpl.modules.reduce((sum, m) => sum + m.missions.reduce((s, ms) => s + ms.xpReward, 0), tpl.bossXP);

  function handleUse() {
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
    setUsed(true);
  }

  return (
    <Card hoverable className="flex flex-col">
      <CardContent className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <Badge variant={DIFFICULTY_BADGE[tpl.difficulty]} className="mb-2">{DIFFICULTY_LABEL[tpl.difficulty]}</Badge>
            <h3 className="font-bold text-text text-sm">{tpl.title}</h3>
            <p className="text-xs text-text-muted mt-1 line-clamp-2">{tpl.description}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue/10 border border-blue-border flex items-center justify-center shrink-0">
            <Crown size={16} className="text-blue" />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {tpl.tags.map((tag) => (
            <Badge key={tag} variant="default">{tag}</Badge>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs text-text-muted mb-4">
          <span className="flex items-center gap-1"><BookOpen size={10} />{tpl.modules.length} módulos</span>
          <span className="flex items-center gap-1"><Target size={10} />{totalMissions} missões</span>
          <span className="flex items-center gap-1 text-amber font-medium"><Zap size={10} className="text-amber" />{totalXP} XP</span>
          <span className="flex items-center gap-1"><Clock size={10} />{tpl.estimatedHours}h</span>
        </div>

        <div className="mt-auto">
          <Button
            variant={used ? "secondary" : "primary"}
            size="sm"
            className="w-full"
            disabled={used}
            onClick={handleUse}
          >
            {used ? (
              <><CheckCircle size={13} /> Adicionada!</>
            ) : (
              <>Usar Template <ArrowRight size={13} /></>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function PathsPage() {
  const { questlines, deleteQuestline, archiveQuestline, duplicateQuestline } = useQuestlinesStore();
  const { missions } = useMissionsStore();

  const [activeTab, setActiveTab] = useState<"trilhas" | "templates">("trilhas");
  const [createOpen, setCreateOpen] = useState(false);
  const [editingQuestline, setEditingQuestline] = useState<Questline | null>(null);
  const [deletingQuestline, setDeletingQuestline] = useState<string | null>(null);

  const active = questlines.filter((q) => q.status === "active");
  const available = questlines.filter((q) => q.status === "available");
  const completed = questlines.filter((q) => q.status === "completed");
  const archived = questlines.filter((q) => q.status === "archived");

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-blue/20 bg-gradient-to-br from-blue/10 via-surface to-surface-raised p-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-blue text-xs font-semibold uppercase tracking-widest mb-2">
              <Map size={13} /> Mapa de Aventuras
            </div>
            <h1 className="text-3xl font-bold text-text mb-1">Questlines</h1>
            <p className="text-text-muted text-sm">Crie e gerencie suas jornadas de aprendizado.</p>
            <div className="flex flex-wrap gap-4 mt-4 text-xs text-text-muted">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue" />{active.length} ativa{active.length !== 1 ? "s" : ""}</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald" />{completed.length} concluída{completed.length !== 1 ? "s" : ""}</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-border-strong" />{available.length} disponível{available.length !== 1 ? "is" : ""}</span>
            </div>
          </div>
          <Button variant="primary" size="sm" onClick={() => setCreateOpen(true)}>
            <Plus size={14} /> Nova Trilha
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface-raised border border-border rounded-xl w-fit">
        {(["trilhas", "templates"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab ? "bg-blue text-white" : "text-text-muted hover:text-text"
            }`}
          >
            {tab === "trilhas" ? "Minhas Trilhas" : "Templates"}
          </button>
        ))}
      </div>

      {/* ── Minhas Trilhas tab ──────────────────────────────────────────────── */}
      {activeTab === "trilhas" && (
        <div className="space-y-8">
          {questlines.length === 0 ? (
            <div className="text-center py-16">
              <Package size={36} className="text-text-dim mx-auto mb-3" />
              <p className="text-sm font-semibold text-text">Nenhuma trilha ainda</p>
              <p className="text-xs text-text-muted mt-1 mb-4">Crie sua primeira trilha ou use um template.</p>
              <div className="flex items-center justify-center gap-3">
                <Button variant="primary" size="sm" onClick={() => setCreateOpen(true)}>
                  <Plus size={13} /> Nova Trilha
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setActiveTab("templates")}>
                  Ver Templates
                </Button>
              </div>
            </div>
          ) : (
            <>
              {active.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Swords size={14} className="text-amber" />
                    <h2 className="text-xs font-bold text-text uppercase tracking-widest">Ativa</h2>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {active.map((q) => (
                      <QuestlineCard
                        key={q.id}
                        q={q}
                        allMissions={missions}
                        onEdit={() => setEditingQuestline(q)}
                        onDelete={() => setDeletingQuestline(q.id)}
                        onArchive={() => archiveQuestline(q.id)}
                        onDuplicate={() => duplicateQuestline(q.id)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {available.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Star size={14} className="text-text-muted" />
                    <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest">Disponíveis</h2>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {available.map((q) => (
                      <QuestlineCard
                        key={q.id}
                        q={q}
                        allMissions={missions}
                        onEdit={() => setEditingQuestline(q)}
                        onDelete={() => setDeletingQuestline(q.id)}
                        onArchive={() => archiveQuestline(q.id)}
                        onDuplicate={() => duplicateQuestline(q.id)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {completed.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Trophy size={14} className="text-emerald" />
                    <h2 className="text-xs font-bold text-emerald uppercase tracking-widest">Concluídas</h2>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {completed.map((q) => (
                      <QuestlineCard
                        key={q.id}
                        q={q}
                        allMissions={missions}
                        onEdit={() => setEditingQuestline(q)}
                        onDelete={() => setDeletingQuestline(q.id)}
                        onArchive={() => archiveQuestline(q.id)}
                        onDuplicate={() => duplicateQuestline(q.id)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {archived.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Archive size={14} className="text-text-dim" />
                    <h2 className="text-xs font-bold text-text-dim uppercase tracking-widest">Arquivadas</h2>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {archived.map((q) => (
                      <QuestlineCard
                        key={q.id}
                        q={q}
                        allMissions={missions}
                        onEdit={() => setEditingQuestline(q)}
                        onDelete={() => setDeletingQuestline(q.id)}
                        onArchive={() => archiveQuestline(q.id)}
                        onDuplicate={() => duplicateQuestline(q.id)}
                      />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Templates tab ───────────────────────────────────────────────────── */}
      {activeTab === "templates" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-amber/20 bg-amber/5 flex items-center gap-3">
            <Sparkles size={16} className="text-amber shrink-0" />
            <div>
              <p className="text-sm font-semibold text-text">Templates prontos para usar</p>
              <p className="text-xs text-text-muted">Clique em "Usar Template" para adicionar à sua lista de trilhas com todos os módulos e missões pré-configurados.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUESTLINE_TEMPLATES.map((tpl) => (
              <TemplateCard key={tpl.templateId} tpl={tpl} />
            ))}
          </div>
        </div>
      )}

      {/* Global Dialogs */}
      <QuestlineDialog
        open={createOpen || !!editingQuestline}
        onClose={() => { setCreateOpen(false); setEditingQuestline(null); }}
        existing={editingQuestline}
      />
      <DeleteDialog
        open={!!deletingQuestline}
        onClose={() => setDeletingQuestline(null)}
        title="Excluir questline?"
        description="Esta trilha e todos os seus módulos serão excluídos permanentemente. As missões vinculadas serão removidas do seu progresso."
        onConfirm={() => {
          if (deletingQuestline) {
            const q = questlines.find((ql) => ql.id === deletingQuestline);
            if (q) {
              const { deleteMission } = useMissionsStore.getState();
              q.modules.forEach((mod) => mod.missionIds.forEach((mid) => deleteMission(mid)));
            }
            deleteQuestline(deletingQuestline);
          }
        }}
      />
    </div>
  );
}
