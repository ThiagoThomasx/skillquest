"use client";

import { useState, useMemo } from "react";
import {
  Search, Plus, BookOpen, Tag, Pencil, Trash2, X, Check,
  Calendar, Map, Layers, Target, Filter,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useNotesStore, type LearningNote, type NoteFormData } from "@/stores/notes-store";
import { useQuestlinesStore } from "@/stores/questlines-store";
import { cn } from "@/lib/utils";

// ── helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function parseTags(raw: string): string[] {
  return raw
    .split(/[,\s]+/)
    .map((t) => t.replace(/^#/, "").trim())
    .filter(Boolean);
}

// ── NoteModal ─────────────────────────────────────────────────────────────────

type NoteModalProps = {
  initial?: LearningNote | null;
  paths: string[];
  onSave: (data: NoteFormData) => void;
  onClose: () => void;
};

function NoteModal({ initial, paths, onSave, onClose }: NoteModalProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [pathTitle, setPathTitle] = useState(initial?.pathTitle ?? "");
  const [moduleTitle, setModuleTitle] = useState(initial?.moduleTitle ?? "");
  const [missionTitle, setMissionTitle] = useState(initial?.missionTitle ?? "");
  const [tagsRaw, setTagsRaw] = useState(initial?.tags.join(", ") ?? "");
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!title.trim()) {
      setError("Título é obrigatório.");
      return;
    }
    if (!content.trim()) {
      setError("Conteúdo é obrigatório.");
      return;
    }
    onSave({
      title: title.trim(),
      content: content.trim(),
      pathTitle: pathTitle.trim(),
      moduleTitle: moduleTitle.trim(),
      missionTitle: missionTitle.trim(),
      tags: parseTags(tagsRaw),
      sessionId: initial?.sessionId,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-lg bg-surface border border-border-strong rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-blue" />
            <h2 className="text-base font-bold text-text">
              {initial ? "Editar nota" : "Nova nota"}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-raised text-text-muted">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5 block">
              Título *
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Como funciona o useEffect..."
              className="w-full bg-surface-raised border border-border rounded-xl px-3 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-blue/50 focus:ring-1 focus:ring-blue/20"
            />
          </div>

          {/* Content */}
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5 block">
              Conteúdo *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="O que você aprendeu? Escreva conceitos, exemplos, insights..."
              rows={6}
              className="w-full bg-surface-raised border border-border rounded-xl px-3 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-blue/50 focus:ring-1 focus:ring-blue/20 resize-none"
            />
          </div>

          {/* Context row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5 block">
                Trilha
              </label>
              <input
                value={pathTitle}
                onChange={(e) => setPathTitle(e.target.value)}
                list="paths-list"
                placeholder="Frontend..."
                className="w-full bg-surface-raised border border-border rounded-xl px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-blue/50 focus:ring-1 focus:ring-blue/20"
              />
              <datalist id="paths-list">
                {paths.map((p) => <option key={p} value={p} />)}
              </datalist>
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5 block">
                Módulo
              </label>
              <input
                value={moduleTitle}
                onChange={(e) => setModuleTitle(e.target.value)}
                placeholder="Fundamentos..."
                className="w-full bg-surface-raised border border-border rounded-xl px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-blue/50 focus:ring-1 focus:ring-blue/20"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5 block">
                Missão
              </label>
              <input
                value={missionTitle}
                onChange={(e) => setMissionTitle(e.target.value)}
                placeholder="Componentes React..."
                className="w-full bg-surface-raised border border-border rounded-xl px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-blue/50 focus:ring-1 focus:ring-blue/20"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5 block">
              Tags <span className="normal-case font-normal">(separadas por vírgula)</span>
            </label>
            <input
              value={tagsRaw}
              onChange={(e) => setTagsRaw(e.target.value)}
              placeholder="react, hooks, useEffect, estado"
              className="w-full bg-surface-raised border border-border rounded-xl px-3 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-blue/50 focus:ring-1 focus:ring-blue/20"
            />
          </div>

          {error && (
            <p className="text-xs text-rose font-medium">{error}</p>
          )}
        </div>

        <div className="flex gap-3 p-5 pt-0">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" className="flex-1" onClick={handleSubmit}>
            <Check size={14} />
            {initial ? "Salvar alterações" : "Criar nota"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── NoteCard ──────────────────────────────────────────────────────────────────

type NoteCardProps = {
  note: LearningNote;
  onEdit: () => void;
  onDelete: () => void;
};

function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const [expanded, setExpanded] = useState(false);
  const preview = note.content.slice(0, 160);
  const hasMore = note.content.length > 160;

  return (
    <Card className="p-4 hover:border-blue/30 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-sm font-bold text-text leading-snug flex-1">{note.title}</h3>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg hover:bg-surface-raised text-text-muted hover:text-blue transition-colors"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg hover:bg-surface-raised text-text-muted hover:text-rose transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <p className="text-xs text-text-muted leading-relaxed mb-3 whitespace-pre-wrap">
        {expanded ? note.content : preview}
        {hasMore && !expanded && "…"}
      </p>

      {hasMore && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-[11px] text-blue hover:underline mb-3"
        >
          {expanded ? "Ver menos" : "Ver mais"}
        </button>
      )}

      {/* Context pills */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {note.pathTitle && (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-blue bg-blue/10 border border-blue/20 rounded-full px-2 py-0.5">
            <Map size={9} />
            {note.pathTitle}
          </span>
        )}
        {note.moduleTitle && (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-violet bg-violet/10 border border-violet/20 rounded-full px-2 py-0.5">
            <Layers size={9} />
            {note.moduleTitle}
          </span>
        )}
        {note.missionTitle && (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber bg-amber/10 border border-amber/20 rounded-full px-2 py-0.5">
            <Target size={9} />
            {note.missionTitle}
          </span>
        )}
      </div>

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] text-text-muted bg-surface-raised border border-border rounded-full px-2 py-0.5"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-1 mt-1">
        <Calendar size={10} className="text-text-muted" />
        <span className="text-[10px] text-text-muted">{formatDate(note.createdAt)}</span>
      </div>
    </Card>
  );
}

// ── DeleteConfirm ─────────────────────────────────────────────────────────────

function DeleteConfirm({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="w-full max-w-sm p-6 border-rose/30">
        <div className="flex items-center gap-3 mb-3">
          <Trash2 size={18} className="text-rose" />
          <h3 className="text-base font-bold text-text">Excluir nota?</h3>
        </div>
        <p className="text-sm text-text-muted mb-5">Esta ação não pode ser desfeita.</p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel}>Cancelar</Button>
          <Button variant="danger" className="flex-1" onClick={onConfirm}>Excluir</Button>
        </div>
      </Card>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function KnowledgePage() {
  const { notes, addNote, updateNote, deleteNote } = useNotesStore();
  const { questlines } = useQuestlinesStore();

  const [query, setQuery] = useState("");
  const [filterPath, setFilterPath] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState<LearningNote | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const paths = useMemo(
    () => Array.from(new Set(questlines.map((q) => q.title).filter(Boolean))),
    [questlines]
  );

  const allTags = useMemo(() => {
    const set = new Set<string>();
    notes.forEach((n) => n.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [notes]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return notes.filter((n) => {
      const matchSearch =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q)) ||
        n.pathTitle.toLowerCase().includes(q) ||
        n.missionTitle.toLowerCase().includes(q);

      const matchPath = !filterPath || n.pathTitle === filterPath;
      const matchTag = !filterTag || n.tags.includes(filterTag);

      return matchSearch && matchPath && matchTag;
    });
  }, [notes, query, filterPath, filterTag]);

  function handleSave(data: NoteFormData) {
    if (editingNote) {
      updateNote(editingNote.id, data);
    } else {
      addNote(data);
    }
    setShowModal(false);
    setEditingNote(null);
  }

  function handleEdit(note: LearningNote) {
    setEditingNote(note);
    setShowModal(true);
  }

  function handleDelete() {
    if (deletingId) deleteNote(deletingId);
    setDeletingId(null);
  }

  const hasFilters = !!query || !!filterPath || !!filterTag;

  return (
    <div className="flex flex-col gap-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-text">Base de Conhecimento</h1>
          <p className="text-sm text-text-muted mt-0.5">
            {notes.length} {notes.length === 1 ? "nota" : "notas"} salvas
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => { setEditingNote(null); setShowModal(true); }}
        >
          <Plus size={14} />
          Nova nota
        </Button>
      </div>

      {/* Search + Filters */}
      <Card className="p-4 flex flex-col gap-3">
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título, conteúdo, tag..."
            className="w-full pl-9 pr-3 py-2.5 bg-surface-raised border border-border rounded-xl text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-blue/50 focus:ring-1 focus:ring-blue/20"
          />
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-2 items-center">
          <Filter size={12} className="text-text-muted" />

          {/* Path filter */}
          <select
            value={filterPath}
            onChange={(e) => setFilterPath(e.target.value)}
            className="bg-surface-raised border border-border rounded-lg px-2.5 py-1.5 text-xs text-text focus:outline-none focus:border-blue/50"
          >
            <option value="">Todas as trilhas</option>
            {paths.map((p) => <option key={p} value={p}>{p}</option>)}
            {/* paths from notes that may not be in questlines */}
            {Array.from(new Set(notes.map((n) => n.pathTitle).filter((p) => p && !paths.includes(p)))).map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          {/* Tag filter */}
          {allTags.length > 0 && (
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="bg-surface-raised border border-border rounded-lg px-2.5 py-1.5 text-xs text-text focus:outline-none focus:border-blue/50"
            >
              <option value="">Todas as tags</option>
              {allTags.map((t) => <option key={t} value={t}>#{t}</option>)}
            </select>
          )}

          {hasFilters && (
            <button
              onClick={() => { setQuery(""); setFilterPath(""); setFilterTag(""); }}
              className="text-xs text-rose hover:underline flex items-center gap-1"
            >
              <X size={10} /> Limpar filtros
            </button>
          )}
        </div>
      </Card>

      {/* Notes list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue/10 border border-blue/20 flex items-center justify-center">
            <BookOpen size={24} className="text-blue" />
          </div>
          {notes.length === 0 ? (
            <>
              <p className="text-sm font-semibold text-text">Nenhuma nota ainda</p>
              <p className="text-xs text-text-muted max-w-xs">
                Salve aprendizados durante ou após uma sessão de estudo, ou crie uma nota manual.
              </p>
              <Button variant="primary" size="sm" onClick={() => { setEditingNote(null); setShowModal(true); }}>
                <Plus size={13} /> Criar primeira nota
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-text">Nenhum resultado</p>
              <p className="text-xs text-text-muted">Tente outros termos ou limpe os filtros.</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={() => handleEdit(note)}
              onDelete={() => setDeletingId(note.id)}
            />
          ))}
        </div>
      )}

      {/* Tag cloud */}
      {allTags.length > 0 && !hasFilters && (
        <div className="flex flex-wrap gap-2 pt-2">
          <span className="text-xs text-text-muted flex items-center gap-1">
            <Tag size={11} /> Tags:
          </span>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className="text-xs text-text-muted bg-surface-raised border border-border rounded-full px-2.5 py-1 hover:border-blue/40 hover:text-blue transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <NoteModal
          initial={editingNote}
          paths={paths}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingNote(null); }}
        />
      )}
      {deletingId && (
        <DeleteConfirm onConfirm={handleDelete} onCancel={() => setDeletingId(null)} />
      )}
    </div>
  );
}
