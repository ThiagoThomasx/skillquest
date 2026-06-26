"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Folder,
  FolderOpen,
  GitBranch,
  ExternalLink,
  Trash2,
  Edit3,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronRight,
  Circle,
  BookOpen,
  Zap,
  Pause,
  CheckCircle,
  Lightbulb,
  Calendar,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useProjectsStore } from "@/stores/projects-store";
import type { StudyProject, ProjectStatus, ProjectDifficulty, ProjectFormData } from "@/stores/projects-store";
import { useQuestlinesStore } from "@/stores/questlines-store";

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  ideia: { label: "Ideia", color: "text-text-muted", icon: Lightbulb },
  planejado: { label: "Planejado", color: "text-blue", icon: Circle },
  em_andamento: { label: "Em Andamento", color: "text-amber", icon: Zap },
  concluido: { label: "Concluído", color: "text-emerald", icon: CheckCircle },
  pausado: { label: "Pausado", color: "text-rose", icon: Pause },
};

const DIFFICULTY_CONFIG: Record<ProjectDifficulty, { label: string; variant: "default" | "blue" | "amber" | "emerald" | "rose" | "sky" }> = {
  iniciante: { label: "Iniciante", variant: "emerald" },
  intermediario: { label: "Intermediário", variant: "amber" },
  avancado: { label: "Avançado", variant: "rose" },
  expert: { label: "Expert", variant: "sky" },
};

const ALL_STATUSES: ProjectStatus[] = ["ideia", "planejado", "em_andamento", "concluido", "pausado"];
const ALL_DIFFICULTIES: ProjectDifficulty[] = ["iniciante", "intermediario", "avancado", "expert"];

function taskProgress(project: StudyProject): number {
  if (project.tasks.length === 0) return 0;
  return Math.round((project.tasks.filter((t) => t.done).length / project.tasks.length) * 100);
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

// ── Project Form Dialog ───────────────────────────────────────────────────────

interface ProjectFormProps {
  initial?: StudyProject | null;
  onSave: (data: ProjectFormData) => void;
  onClose: () => void;
}

function ProjectFormDialog({ initial, onSave, onClose }: ProjectFormProps) {
  const { questlines } = useQuestlinesStore();

  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [questlineId, setQuestlineId] = useState(initial?.questlineId ?? "");
  const [moduleId, setModuleId] = useState(initial?.moduleId ?? "");
  const [status, setStatus] = useState<ProjectStatus>(initial?.status ?? "ideia");
  const [difficulty, setDifficulty] = useState<ProjectDifficulty>(initial?.difficulty ?? "iniciante");
  const [githubUrl, setGithubUrl] = useState(initial?.githubUrl ?? "");
  const [deployUrl, setDeployUrl] = useState(initial?.deployUrl ?? "");
  const [learnings, setLearnings] = useState(initial?.learnings ?? "");
  const [startedAt, setStartedAt] = useState(initial?.startedAt ? initial.startedAt.slice(0, 10) : "");
  const [completedAt, setCompletedAt] = useState(initial?.completedAt ? initial.completedAt.slice(0, 10) : "");

  const selectedQuestline = questlines.find((q) => q.id === questlineId);
  const modules = selectedQuestline?.modules ?? [];

  const questlineTitle = selectedQuestline?.title ?? "";
  const selectedModule = modules.find((m) => m.id === moduleId);
  const moduleTitle = selectedModule?.title ?? "";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      description: description.trim(),
      questlineId,
      questlineTitle,
      moduleId,
      moduleTitle,
      status,
      difficulty,
      tasks: initial?.tasks ?? [],
      githubUrl: githubUrl.trim(),
      deployUrl: deployUrl.trim(),
      learnings: learnings.trim(),
      startedAt: startedAt ? new Date(startedAt).toISOString() : null,
      completedAt: completedAt ? new Date(completedAt).toISOString() : null,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-text">
            {initial ? "Editar Projeto" : "Novo Projeto"}
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-text">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Nome *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: ToDo App com React"
              className="w-full px-3 py-2 text-sm bg-surface-raised border border-border rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-blue"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="O que você vai construir?"
              rows={3}
              className="w-full px-3 py-2 text-sm bg-surface-raised border border-border rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-blue resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Trilha</label>
              <select
                value={questlineId}
                onChange={(e) => { setQuestlineId(e.target.value); setModuleId(""); }}
                className="w-full px-3 py-2 text-sm bg-surface-raised border border-border rounded-lg text-text focus:outline-none focus:ring-1 focus:ring-blue"
              >
                <option value="">Nenhuma</option>
                {questlines.map((q) => (
                  <option key={q.id} value={q.id}>{q.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Módulo</label>
              <select
                value={moduleId}
                onChange={(e) => setModuleId(e.target.value)}
                disabled={!questlineId}
                className="w-full px-3 py-2 text-sm bg-surface-raised border border-border rounded-lg text-text focus:outline-none focus:ring-1 focus:ring-blue disabled:opacity-40"
              >
                <option value="">Nenhum</option>
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full px-3 py-2 text-sm bg-surface-raised border border-border rounded-lg text-text focus:outline-none focus:ring-1 focus:ring-blue"
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Dificuldade</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as ProjectDifficulty)}
                className="w-full px-3 py-2 text-sm bg-surface-raised border border-border rounded-lg text-text focus:outline-none focus:ring-1 focus:ring-blue"
              >
                {ALL_DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>{DIFFICULTY_CONFIG[d].label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">GitHub URL</label>
            <input
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/..."
              type="url"
              className="w-full px-3 py-2 text-sm bg-surface-raised border border-border rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Deploy URL</label>
            <input
              value={deployUrl}
              onChange={(e) => setDeployUrl(e.target.value)}
              placeholder="https://meu-projeto.vercel.app"
              type="url"
              className="w-full px-3 py-2 text-sm bg-surface-raised border border-border rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-blue"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Início</label>
              <input
                value={startedAt}
                onChange={(e) => setStartedAt(e.target.value)}
                type="date"
                className="w-full px-3 py-2 text-sm bg-surface-raised border border-border rounded-lg text-text focus:outline-none focus:ring-1 focus:ring-blue"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Conclusão</label>
              <input
                value={completedAt}
                onChange={(e) => setCompletedAt(e.target.value)}
                type="date"
                className="w-full px-3 py-2 text-sm bg-surface-raised border border-border rounded-lg text-text focus:outline-none focus:ring-1 focus:ring-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Aprendizados</label>
            <textarea
              value={learnings}
              onChange={(e) => setLearnings(e.target.value)}
              placeholder="O que você aprendeu ou espera aprender com este projeto?"
              rows={3}
              className="w-full px-3 py-2 text-sm bg-surface-raised border border-border rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-blue resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" type="button" onClick={onClose}>Cancelar</Button>
            <Button size="sm" type="submit">Salvar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Project Card ──────────────────────────────────────────────────────────────

interface ProjectCardProps {
  project: StudyProject;
  onEdit: (p: StudyProject) => void;
  onDelete: (id: string) => void;
}

function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const { toggleTask, addTask, deleteTask } = useProjectsStore();
  const [expanded, setExpanded] = useState(false);
  const [newTask, setNewTask] = useState("");

  const progress = taskProgress(project);
  const StatusIcon = STATUS_CONFIG[project.status].icon;

  function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTask.trim()) return;
    addTask(project.id, newTask.trim());
    setNewTask("");
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            {expanded
              ? <FolderOpen size={18} className="text-blue" />
              : <Folder size={18} className="text-text-muted" />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-sm font-semibold text-text text-left hover:text-blue transition-colors"
              >
                {project.name}
              </button>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onEdit(project)}
                  className="p-1 text-text-muted hover:text-blue transition-colors"
                >
                  <Edit3 size={13} />
                </button>
                <button
                  onClick={() => onDelete(project.id)}
                  className="p-1 text-text-muted hover:text-rose transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <span className={`flex items-center gap-1 text-xs font-medium ${STATUS_CONFIG[project.status].color}`}>
                <StatusIcon size={11} />
                {STATUS_CONFIG[project.status].label}
              </span>
              <Badge variant={DIFFICULTY_CONFIG[project.difficulty].variant} className="text-[10px] px-1.5 py-0">
                {DIFFICULTY_CONFIG[project.difficulty].label}
              </Badge>
              {project.questlineTitle && (
                <span className="flex items-center gap-1 text-[10px] text-text-muted">
                  <BookOpen size={10} />
                  {project.questlineTitle}
                  {project.moduleTitle && <> · {project.moduleTitle}</>}
                </span>
              )}
            </div>

            {/* Links */}
            {(project.githubUrl || project.deployUrl) && (
              <div className="flex gap-2 mt-2">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] text-text-muted hover:text-blue transition-colors"
                  >
                    <GitBranch size={11} />
                    GitHub
                  </a>
                )}
                {project.deployUrl && (
                  <a
                    href={project.deployUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] text-text-muted hover:text-emerald transition-colors"
                  >
                    <ExternalLink size={11} />
                    Deploy
                  </a>
                )}
              </div>
            )}

            {/* Task progress */}
            {project.tasks.length > 0 && (
              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-text-muted mb-1">
                  <span>Checklist</span>
                  <span>{project.tasks.filter((t) => t.done).length}/{project.tasks.length}</span>
                </div>
                <ProgressBar value={progress} max={100} size="xs" />
              </div>
            )}
          </div>
        </div>

        {/* Expanded section */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-border space-y-4">
            {project.description && (
              <p className="text-xs text-text-muted">{project.description}</p>
            )}

            {/* Dates */}
            <div className="flex gap-4 text-[11px] text-text-muted">
              <span className="flex items-center gap-1"><Calendar size={10} /> Início: {formatDate(project.startedAt)}</span>
              <span className="flex items-center gap-1"><Calendar size={10} /> Fim: {formatDate(project.completedAt)}</span>
            </div>

            {/* Checklist */}
            <div>
              <p className="text-xs font-medium text-text mb-2">Checklist de tarefas</p>
              <div className="space-y-1">
                {project.tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-2 group">
                    <button
                      onClick={() => toggleTask(project.id, task.id)}
                      className="text-text-muted hover:text-blue transition-colors shrink-0"
                    >
                      {task.done
                        ? <CheckSquare size={14} className="text-emerald" />
                        : <Square size={14} />}
                    </button>
                    <span className={`text-xs flex-1 ${task.done ? "line-through text-text-muted" : "text-text"}`}>
                      {task.title}
                    </span>
                    <button
                      onClick={() => deleteTask(project.id, task.id)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-text-muted hover:text-rose transition-all"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddTask} className="flex gap-2 mt-2">
                <input
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Nova tarefa..."
                  className="flex-1 px-2 py-1.5 text-xs bg-surface-raised border border-border rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-blue"
                />
                <Button size="sm" type="submit" className="text-xs px-2 py-1.5">
                  <Plus size={12} />
                </Button>
              </form>
            </div>

            {/* Learnings */}
            {project.learnings && (
              <div>
                <p className="text-xs font-medium text-text mb-1">Aprendizados</p>
                <p className="text-xs text-text-muted whitespace-pre-wrap">{project.learnings}</p>
              </div>
            )}
          </div>
        )}

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 mt-3 text-[10px] text-text-muted hover:text-text transition-colors"
        >
          {expanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
          {expanded ? "Recolher" : "Ver detalhes"}
        </button>
      </CardContent>
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const STATUS_FILTER_OPTIONS: Array<{ value: ProjectStatus | "all"; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "em_andamento", label: "Em Andamento" },
  { value: "planejado", label: "Planejados" },
  { value: "ideia", label: "Ideias" },
  { value: "concluido", label: "Concluídos" },
  { value: "pausado", label: "Pausados" },
];

export default function ProjectsPage() {
  const { projects, addProject, updateProject, deleteProject } = useProjectsStore();
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<StudyProject | null>(null);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return projects;
    return projects.filter((p) => p.status === statusFilter);
  }, [projects, statusFilter]);

  const counts = useMemo(() => {
    const total = projects.length;
    const done = projects.filter((p) => p.status === "concluido").length;
    const inProgress = projects.filter((p) => p.status === "em_andamento").length;
    return { total, done, inProgress };
  }, [projects]);

  function handleSave(data: ProjectFormData) {
    if (editing) {
      updateProject(editing.id, data);
    } else {
      addProject(data);
    }
    setShowForm(false);
    setEditing(null);
  }

  function handleEdit(p: StudyProject) {
    setEditing(p);
    setShowForm(true);
  }

  function handleDelete(id: string) {
    if (confirm("Excluir este projeto?")) deleteProject(id);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-text">Projetos Práticos</h1>
            <p className="text-sm text-text-muted mt-0.5">Transforme seu aprendizado em entregáveis reais</p>
          </div>
          <Button size="sm" onClick={() => { setEditing(null); setShowForm(true); }}>
            <Plus size={14} className="mr-1" />
            Novo Projeto
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total", value: counts.total, color: "text-text" },
            { label: "Em Andamento", value: counts.inProgress, color: "text-amber" },
            { label: "Concluídos", value: counts.done, color: "text-emerald" },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-3 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[11px] text-text-muted mt-0.5">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                statusFilter === opt.value
                  ? "bg-blue text-white"
                  : "bg-surface-raised text-text-muted hover:text-text border border-border"
              }`}
            >
              {opt.label}
              {opt.value !== "all" && (
                <span className="ml-1 opacity-60">
                  ({projects.filter((p) => p.status === opt.value).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Project list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Folder size={40} className="text-text-muted mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium text-text-muted">
              {statusFilter === "all" ? "Nenhum projeto ainda" : "Nenhum projeto nesta categoria"}
            </p>
            {statusFilter === "all" && (
              <p className="text-xs text-text-muted mt-1">
                Crie seu primeiro projeto e comece a construir!
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Form dialog */}
      {showForm && (
        <ProjectFormDialog
          initial={editing}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}
