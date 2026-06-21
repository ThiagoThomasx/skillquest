"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PortfolioProjectCard } from "@/components/portfolio/PortfolioProjectCard";
import { ProjectDetailModal } from "@/components/portfolio/ProjectDetailModal";
import {
  Briefcase, Plus, CheckCircle2, Rocket, Layers,
  Code2, X, Lightbulb,
} from "lucide-react";
import { usePortfolioStore, type PortfolioProject, type PortfolioStatus } from "@/stores/portfolio-store";
import { generateReadmeDraft, generateLinkedInDraft } from "@/utils/portfolio-generators";

// ── Filter ────────────────────────────────────────────────────────────────────

type Filter = "all" | PortfolioStatus;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all",        label: "Todos" },
  { value: "in_progress", label: "Em andamento" },
  { value: "completed",  label: "Concluídos" },
  { value: "published",  label: "Publicados" },
];

// ── New Project Form ──────────────────────────────────────────────────────────

function NewProjectForm({ onSave, onCancel }: { onSave: (data: Partial<PortfolioProject>) => void; onCancel: () => void }) {
  const [title, setTitle]   = useState("");
  const [desc, setDesc]     = useState("");
  const [category, setCat]  = useState("");

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim(), description: desc.trim(), category: category.trim() });
  };

  return (
    <Card className="p-4 border-blue/30 bg-blue/5">
      <p className="text-xs font-semibold text-text mb-3">Novo projeto</p>
      <div className="space-y-2">
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título do projeto *"
          className="w-full text-sm bg-surface border border-border rounded-lg px-3 py-2 text-text focus:outline-none focus:border-blue placeholder:text-text-muted"
        />
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Descrição breve"
          className="w-full text-xs bg-surface border border-border rounded-lg px-3 py-2 text-text focus:outline-none focus:border-blue placeholder:text-text-muted"
        />
        <input
          value={category}
          onChange={(e) => setCat(e.target.value)}
          placeholder="Categoria (ex: Frontend, Backend, Cybersecurity…)"
          className="w-full text-xs bg-surface border border-border rounded-lg px-3 py-2 text-text focus:outline-none focus:border-blue placeholder:text-text-muted"
        />
        <div className="flex gap-2 pt-1">
          <Button size="sm" onClick={handleSave} disabled={!title.trim()}>Criar</Button>
          <Button size="sm" variant="ghost" onClick={onCancel}>
            <X size={13} />
          </Button>
        </div>
      </div>
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PortfolioPage() {
  const { projects, addProject, deleteProject } = usePortfolioStore();
  const [filter, setFilter]           = useState<Filter>("all");
  const [selectedProject, setSelected] = useState<PortfolioProject | null>(null);
  const [showNewForm, setShowNewForm]  = useState(false);

  const filtered = filter === "all"
    ? projects
    : projects.filter((p) => p.status === filter);

  const stats = {
    total:     projects.length,
    completed: projects.filter((p) => p.status === "completed" || p.status === "published").length,
    published: projects.filter((p) => p.status === "published").length,
    skills:    Array.from(new Set(projects.flatMap((p) => p.skills))).length,
  };

  const handleCreate = (data: Partial<PortfolioProject>) => {
    const now = new Date().toISOString();
    const base: Omit<PortfolioProject, "id" | "createdAt" | "updatedAt"> = {
      title:         data.title ?? "",
      description:   data.description ?? "",
      category:      data.category ?? "",
      sourceType:    "custom",
      sourceId:      "custom",
      status:        "idea",
      difficulty:    "medium",
      skills:        [],
      deliverables:  [],
      repositoryUrl: "",
      liveUrl:       "",
      notes:         "",
      readmeDraft:   "",
      linkedinDraft: "",
      completedAt:   null,
    };
    base.readmeDraft   = generateReadmeDraft({ ...base, id: "", createdAt: now, updatedAt: now });
    base.linkedinDraft = generateLinkedInDraft({ ...base, id: "", createdAt: now, updatedAt: now });
    addProject(base);
    setShowNewForm(false);
  };

  const handleOpen = (p: PortfolioProject) => {
    setSelected(p);
  };

  const handleDelete = (id: string) => {
    deleteProject(id);
    setSelected(null);
  };

  // Sync selected project with store (after edits)
  const selectedFromStore = selectedProject
    ? projects.find((p) => p.id === selectedProject.id) ?? null
    : null;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-6xl mx-auto">
      {/* Hero */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-blue/10 border border-blue/20 flex items-center justify-center">
              <Briefcase size={15} className="text-blue" />
            </div>
            <h1 className="text-xl font-bold text-text">Portfolio Builder</h1>
          </div>
          <p className="text-sm text-text-muted">
            Transforme missões, módulos e Boss Battles em evidências reais de aprendizado.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setShowNewForm(true)}
          className="flex items-center gap-1.5 shrink-0"
        >
          <Plus size={14} />
          Novo projeto
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Projetos criados",     value: stats.total,     icon: Layers,       color: "text-blue" },
          { label: "Concluídos",           value: stats.completed, icon: CheckCircle2, color: "text-emerald" },
          { label: "Publicados",           value: stats.published, icon: Rocket,       color: "text-sky" },
          { label: "Skills demonstradas",  value: stats.skills,    icon: Code2,        color: "text-amber" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="p-4 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-xl bg-current/10 flex items-center justify-center ${color}`} style={{ backgroundColor: "color-mix(in srgb, currentColor 10%, transparent)" }}>
              <Icon size={16} className={color} />
            </div>
            <div>
              <p className="text-xl font-bold text-text">{value}</p>
              <p className="text-[10px] text-text-muted">{label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* New project form */}
      {showNewForm && (
        <NewProjectForm onSave={handleCreate} onCancel={() => setShowNewForm(false)} />
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
              filter === value
                ? "bg-blue/10 border-blue/30 text-blue"
                : "bg-surface-raised border-border text-text-muted hover:text-text"
            }`}
          >
            {label}
            {value !== "all" && (
              <span className="ml-1.5 opacity-60">
                {projects.filter((p) => p.status === value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Grid or Empty */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-raised border border-border flex items-center justify-center mb-4">
            <Lightbulb size={28} className="text-text-muted" />
          </div>
          <h2 className="text-base font-semibold text-text mb-1">
            {filter === "all" ? "Nenhum projeto ainda" : "Nenhum projeto neste filtro"}
          </h2>
          <p className="text-sm text-text-muted max-w-xs mb-4">
            {filter === "all"
              ? "Crie seu primeiro projeto ou conclua um Boss Battle para adicionar evidências ao seu portfólio."
              : "Mude o filtro ou crie novos projetos para preencher esta categoria."}
          </p>
          {filter === "all" && (
            <Button size="sm" onClick={() => setShowNewForm(true)} className="flex items-center gap-1.5">
              <Plus size={13} />
              Criar primeiro projeto
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <PortfolioProjectCard key={p.id} project={p} onOpen={handleOpen} />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <ProjectDetailModal
        project={selectedFromStore}
        onClose={() => setSelected(null)}
        onDelete={handleDelete}
      />
    </div>
  );
}
