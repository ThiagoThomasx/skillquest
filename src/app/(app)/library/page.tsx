"use client";

import { useState, useMemo } from "react";
import {
  Library,
  Plus,
  Search,
  ExternalLink,
  Pencil,
  Trash2,
  BookOpen,
  Video,
  FileText,
  Book,
  FileCode,
  Wrench,
  Package,
  X,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useResourcesStore,
  type Resource,
  type ResourceType,
  type ResourceStatus,
  type ResourcePriority,
} from "@/stores/resources-store";
import { useQuestlinesStore } from "@/stores/questlines-store";
import { cn } from "@/lib/utils";

// ── Label maps ────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<ResourceType, string> = {
  curso: "Curso",
  video: "Vídeo",
  artigo: "Artigo",
  livro: "Livro",
  documentacao: "Documentação",
  ferramenta: "Ferramenta",
  outro: "Outro",
};

const TYPE_ICONS: Record<ResourceType, React.ElementType> = {
  curso: BookOpen,
  video: Video,
  artigo: FileText,
  livro: Book,
  documentacao: FileCode,
  ferramenta: Wrench,
  outro: Package,
};

const TYPE_COLORS: Record<ResourceType, string> = {
  curso: "text-blue bg-blue/10 border-blue/20",
  video: "text-rose bg-rose/10 border-rose/20",
  artigo: "text-amber bg-amber/10 border-amber/20",
  livro: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  documentacao: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  ferramenta: "text-sky-400 bg-sky-400/10 border-sky-400/20",
  outro: "text-text-muted bg-surface-raised border-border",
};

const STATUS_LABELS: Record<ResourceStatus, string> = {
  quero_estudar: "Quero estudar",
  estudando: "Estudando",
  concluido: "Concluído",
  arquivado: "Arquivado",
};

const STATUS_COLORS: Record<ResourceStatus, string> = {
  quero_estudar: "bg-blue/10 text-blue border-blue/20",
  estudando: "bg-amber/10 text-amber border-amber/20",
  concluido: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  arquivado: "bg-surface-raised text-text-muted border-border",
};

const PRIORITY_LABELS: Record<ResourcePriority, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};

const PRIORITY_COLORS: Record<ResourcePriority, string> = {
  baixa: "text-text-muted",
  media: "text-amber",
  alta: "text-rose",
};

// ── Empty form ────────────────────────────────────────────────────────────────

const EMPTY_FORM: Omit<Resource, "id" | "createdAt" | "updatedAt"> = {
  title: "",
  type: "artigo",
  url: "",
  questlineId: "",
  moduleId: "",
  status: "quero_estudar",
  priority: "media",
  notes: "",
};

// ── Resource Card ─────────────────────────────────────────────────────────────

function ResourceCard({
  resource,
  questlineName,
  moduleName,
  onEdit,
  onDelete,
  onStatusChange,
}: {
  resource: Resource;
  questlineName: string;
  moduleName: string;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (s: ResourceStatus) => void;
}) {
  const TypeIcon = TYPE_ICONS[resource.type];

  return (
    <Card className="group hover:border-blue/30 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn("w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 mt-0.5", TYPE_COLORS[resource.type])}>
            <TypeIcon size={15} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text truncate">{resource.title}</p>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded border", TYPE_COLORS[resource.type])}>
                    {TYPE_LABELS[resource.type]}
                  </span>
                  <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded border", STATUS_COLORS[resource.status])}>
                    {STATUS_LABELS[resource.status]}
                  </span>
                  <span className={cn("text-[10px] font-medium", PRIORITY_COLORS[resource.priority])}>
                    ↑ {PRIORITY_LABELS[resource.priority]}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                {resource.url && (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded hover:bg-surface-raised text-text-muted hover:text-text transition-colors"
                  >
                    <ExternalLink size={13} />
                  </a>
                )}
                <button
                  onClick={onEdit}
                  className="p-1.5 rounded hover:bg-surface-raised text-text-muted hover:text-text transition-colors"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={onDelete}
                  className="p-1.5 rounded hover:bg-rose/10 text-text-muted hover:text-rose transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            {(questlineName || moduleName) && (
              <p className="text-[11px] text-text-muted mt-1.5 truncate">
                {questlineName && <span className="text-blue/80">{questlineName}</span>}
                {questlineName && moduleName && <span> › </span>}
                {moduleName && <span>{moduleName}</span>}
              </p>
            )}

            {resource.notes && (
              <p className="text-[11px] text-text-muted mt-1.5 line-clamp-2">{resource.notes}</p>
            )}

            {/* Quick status change */}
            <div className="flex gap-1 mt-2.5 flex-wrap">
              {(["quero_estudar", "estudando", "concluido", "arquivado"] as ResourceStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => onStatusChange(s)}
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded border transition-colors",
                    resource.status === s
                      ? STATUS_COLORS[s]
                      : "border-transparent text-text-muted hover:border-border hover:text-text"
                  )}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Resource Form Modal ────────────────────────────────────────────────────────

function ResourceFormModal({
  open,
  onClose,
  initial,
  questlines,
}: {
  open: boolean;
  onClose: () => void;
  initial: { id?: string; data: Omit<Resource, "id" | "createdAt" | "updatedAt"> };
  questlines: { id: string; title: string; modules: { id: string; title: string }[] }[];
}) {
  const { addResource, updateResource } = useResourcesStore();
  const [form, setForm] = useState(initial.data);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const selectedQuestline = questlines.find((q) => q.id === form.questlineId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (initial.id) {
      updateResource(initial.id, form);
    } else {
      addResource(form);
    }
    onClose();
  }

  // Reset when modal opens with new data
  useState(() => { setForm(initial.data); });

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial.id ? "Editar recurso" : "Novo recurso"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="res-title">Título *</Label>
            <Input
              id="res-title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Nome do material"
              required
            />
          </div>

          {/* Type + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <Select value={form.type} onValueChange={(v) => set("type", v as ResourceType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(TYPE_LABELS) as ResourceType[]).map((t) => (
                    <SelectItem key={t} value={t}>{TYPE_LABELS[t]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Prioridade</Label>
              <Select value={form.priority} onValueChange={(v) => set("priority", v as ResourcePriority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* URL */}
          <div className="space-y-1.5">
            <Label htmlFor="res-url">Link</Label>
            <Input
              id="res-url"
              type="url"
              value={form.url}
              onChange={(e) => set("url", e.target.value)}
              placeholder="https://..."
            />
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set("status", v as ResourceStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(STATUS_LABELS) as ResourceStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Questline */}
          <div className="space-y-1.5">
            <Label>Trilha relacionada</Label>
            <Select
              value={form.questlineId || "__none__"}
              onValueChange={(v) => {
                set("questlineId", v === "__none__" ? "" : v);
                set("moduleId", "");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Nenhuma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Nenhuma</SelectItem>
                {questlines.map((q) => (
                  <SelectItem key={q.id} value={q.id}>{q.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Module (only if questline selected) */}
          {selectedQuestline && selectedQuestline.modules.length > 0 && (
            <div className="space-y-1.5">
              <Label>Módulo relacionado</Label>
              <Select
                value={form.moduleId || "__none__"}
                onValueChange={(v) => set("moduleId", v === "__none__" ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Nenhum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Nenhum</SelectItem>
                  {selectedQuestline.modules.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="res-notes">Notas</Label>
            <Textarea
              id="res-notes"
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Observações sobre o material..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button type="submit">{initial.id ? "Salvar" : "Adicionar"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LibraryPage() {
  const { resources, deleteResource, updateResource } = useResourcesStore();
  const { questlines } = useQuestlinesStore();

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<ResourceType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<ResourceStatus | "all">("all");
  const [filterQuestline, setFilterQuestline] = useState<string>("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<{
    id?: string;
    data: Omit<Resource, "id" | "createdAt" | "updatedAt">;
  }>({ data: EMPTY_FORM });

  function openAdd() {
    setEditing({ data: { ...EMPTY_FORM } });
    setModalOpen(true);
  }

  function openEdit(r: Resource) {
    const { id, createdAt, updatedAt, ...data } = r;
    setEditing({ id, data });
    setModalOpen(true);
  }

  const questlineOptions = useMemo(
    () => questlines.map((q) => ({ id: q.id, title: q.title, modules: q.modules })),
    [questlines]
  );

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      if (filterType !== "all" && r.type !== filterType) return false;
      if (filterStatus !== "all" && r.status !== filterStatus) return false;
      if (filterQuestline !== "all" && r.questlineId !== filterQuestline) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!r.title.toLowerCase().includes(q) && !r.notes.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [resources, filterType, filterStatus, filterQuestline, search]);

  const hasFilters = filterType !== "all" || filterStatus !== "all" || filterQuestline !== "all" || search !== "";

  function getQuestlineName(id: string) {
    return questlines.find((q) => q.id === id)?.title ?? "";
  }

  function getModuleName(questlineId: string, moduleId: string) {
    const ql = questlines.find((q) => q.id === questlineId);
    return ql?.modules.find((m) => m.id === moduleId)?.title ?? "";
  }

  // Group by status for summary chips
  const counts = useMemo(() => {
    const c = { quero_estudar: 0, estudando: 0, concluido: 0, arquivado: 0 } as Record<ResourceStatus, number>;
    resources.forEach((r) => c[r.status]++);
    return c;
  }, [resources]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 border-b border-border bg-surface px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue/10 border border-blue/20 flex items-center justify-center">
              <Library size={16} className="text-blue" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text">Biblioteca</h1>
              <p className="text-xs text-text-muted">{resources.length} {resources.length === 1 ? "recurso" : "recursos"} salvos</p>
            </div>
          </div>
          <Button onClick={openAdd} size="sm">
            <Plus size={14} className="mr-1.5" />
            Novo recurso
          </Button>
        </div>

        {/* Summary chips */}
        {resources.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {(Object.entries(counts) as [ResourceStatus, number][]).map(([s, n]) => (
              n > 0 && (
                <button
                  key={s}
                  onClick={() => setFilterStatus(filterStatus === s ? "all" : s)}
                  className={cn(
                    "text-[11px] px-2 py-0.5 rounded-full border transition-colors",
                    filterStatus === s ? STATUS_COLORS[s] : "border-border text-text-muted hover:text-text"
                  )}
                >
                  {STATUS_LABELS[s]} · {n}
                </button>
              )
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="shrink-0 border-b border-border bg-surface px-6 py-3 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar recursos..."
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-surface-raised border border-border rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:border-blue/50"
          />
        </div>

        <Select value={filterType} onValueChange={(v) => setFilterType(v as ResourceType | "all")}>
          <SelectTrigger className="w-36 h-8 text-xs">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            {(Object.keys(TYPE_LABELS) as ResourceType[]).map((t) => (
              <SelectItem key={t} value={t}>{TYPE_LABELS[t]}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as ResourceStatus | "all")}>
          <SelectTrigger className="w-40 h-8 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {(Object.keys(STATUS_LABELS) as ResourceStatus[]).map((s) => (
              <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterQuestline} onValueChange={setFilterQuestline}>
          <SelectTrigger className="w-44 h-8 text-xs">
            <SelectValue placeholder="Trilha" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as trilhas</SelectItem>
            {questlines.map((q) => (
              <SelectItem key={q.id} value={q.id}>{q.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <button
            onClick={() => { setSearch(""); setFilterType("all"); setFilterStatus("all"); setFilterQuestline("all"); }}
            className="flex items-center gap-1 text-[11px] text-text-muted hover:text-text transition-colors"
          >
            <X size={12} />
            Limpar
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {resources.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue/10 border border-blue/20 flex items-center justify-center mb-4">
              <Library size={22} className="text-blue" />
            </div>
            <p className="text-sm font-semibold text-text mb-1">Sua biblioteca está vazia</p>
            <p className="text-xs text-text-muted mb-4 max-w-xs">
              Salve cursos, artigos, vídeos e qualquer material de estudo para encontrar depois.
            </p>
            <Button size="sm" onClick={openAdd}>
              <Plus size={14} className="mr-1.5" />
              Adicionar primeiro recurso
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <Filter size={20} className="text-text-muted mb-3" />
            <p className="text-sm text-text-muted">Nenhum recurso corresponde aos filtros</p>
            <button
              onClick={() => { setSearch(""); setFilterType("all"); setFilterStatus("all"); setFilterQuestline("all"); }}
              className="text-xs text-blue mt-2 hover:underline"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((r) => (
              <ResourceCard
                key={r.id}
                resource={r}
                questlineName={getQuestlineName(r.questlineId)}
                moduleName={getModuleName(r.questlineId, r.moduleId)}
                onEdit={() => openEdit(r)}
                onDelete={() => deleteResource(r.id)}
                onStatusChange={(s) => updateResource(r.id, { status: s })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <ResourceFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={editing}
        questlines={questlineOptions}
      />
    </div>
  );
}
