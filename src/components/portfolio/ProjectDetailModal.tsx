"use client";

import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  GitBranch, Globe, Copy, Check, Edit2, Save, X,
  Sword, Target, Layers, Plus, Trash2, CheckSquare,
  FileText, Share2, Tag, ExternalLink,
} from "lucide-react";
import { usePortfolioStore, type PortfolioProject, type PortfolioStatus } from "@/stores/portfolio-store";
import { generateReadmeDraft, generateLinkedInDraft, ALL_SKILLS } from "@/utils/portfolio-generators";

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: PortfolioStatus; label: string }[] = [
  { value: "idea",        label: "Ideia" },
  { value: "in_progress", label: "Em andamento" },
  { value: "completed",   label: "Concluído" },
  { value: "published",   label: "Publicado" },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Button variant="ghost" size="sm" onClick={handle} className="flex items-center gap-1.5 text-xs">
      {copied ? <Check size={12} className="text-emerald" /> : <Copy size={12} />}
      {copied ? "Copiado!" : "Copiar"}
    </Button>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  project: PortfolioProject | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

export function ProjectDetailModal({ project, onClose, onDelete }: Props) {
  const { updateProject } = usePortfolioStore();
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "readme" | "linkedin">("details");
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Edit state mirrors
  const [title, setTitle]         = useState(project?.title ?? "");
  const [description, setDesc]    = useState(project?.description ?? "");
  const [notes, setNotes]         = useState(project?.notes ?? "");
  const [repoUrl, setRepoUrl]     = useState(project?.repositoryUrl ?? "");
  const [liveUrl, setLiveUrl]     = useState(project?.liveUrl ?? "");
  const [status, setStatus]       = useState<PortfolioStatus>(project?.status ?? "idea");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills]       = useState<string[]>(project?.skills ?? []);

  if (!project) return null;

  const readme   = generateReadmeDraft({ ...project, skills, notes, repositoryUrl: repoUrl, liveUrl });
  const linkedin = generateLinkedInDraft({ ...project, skills, notes, repositoryUrl: repoUrl, liveUrl });

  const startEdit = () => {
    setTitle(project.title);
    setDesc(project.description);
    setNotes(project.notes);
    setRepoUrl(project.repositoryUrl);
    setLiveUrl(project.liveUrl);
    setStatus(project.status);
    setSkills([...project.skills]);
    setEditing(true);
  };

  const saveEdit = () => {
    updateProject(project.id, {
      title, description, notes, repositoryUrl: repoUrl,
      liveUrl, status, skills,
      readmeDraft: generateReadmeDraft({ ...project, title, description, skills, notes, repositoryUrl: repoUrl, liveUrl }),
      linkedinDraft: generateLinkedInDraft({ ...project, title, description, skills, notes, repositoryUrl: repoUrl, liveUrl }),
      completedAt: status === "completed" && !project.completedAt ? new Date().toISOString() : project.completedAt,
    });
    setEditing(false);
  };

  const addSkill = (s: string) => {
    const trimmed = s.trim();
    if (trimmed && !skills.includes(trimmed)) setSkills([...skills, trimmed]);
    setSkillInput("");
  };

  const removeSkill = (s: string) => setSkills(skills.filter((sk) => sk !== s));

  const sourceLabel = project.sourceType === "boss_battle" ? "Boss Battle"
    : project.sourceType === "module" ? "Módulo"
    : project.sourceType === "mission" ? "Missão"
    : "Personalizado";

  const SourceIcon = project.sourceType === "boss_battle" ? Sword
    : project.sourceType === "module" ? Layers
    : project.sourceType === "mission" ? Target
    : Plus;

  const tabs = [
    { key: "details" as const, label: "Detalhes", icon: Tag },
    { key: "readme"  as const, label: "README",   icon: FileText },
    { key: "linkedin" as const, label: "LinkedIn", icon: Share2 },
  ];

  return (
    <Dialog open={!!project} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {editing ? (
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-base font-semibold bg-surface-raised border border-border rounded-lg px-3 py-1.5 text-text focus:outline-none focus:border-blue"
                />
              ) : (
                <DialogTitle className="text-base font-semibold text-text leading-snug">
                  {project.title}
                </DialogTitle>
              )}
              <div className="flex items-center gap-2 mt-1.5">
                <SourceIcon size={11} className="text-text-muted" />
                <span className="text-[11px] text-text-muted">{sourceLabel}</span>
                {project.category && (
                  <>
                    <span className="text-text-muted/40">·</span>
                    <span className="text-[11px] text-text-muted">{project.category}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {editing ? (
                <>
                  <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                    <X size={13} />
                  </Button>
                  <Button size="sm" onClick={saveEdit} className="flex items-center gap-1.5">
                    <Save size={13} />
                    Salvar
                  </Button>
                </>
              ) : (
                <Button variant="ghost" size="sm" onClick={startEdit} className="flex items-center gap-1.5">
                  <Edit2 size={13} />
                  Editar
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex border-b border-border shrink-0 px-5">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                activeTab === key
                  ? "border-blue text-blue"
                  : "border-transparent text-text-muted hover:text-text"
              }`}
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === "details" && (
            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-muted w-24 shrink-0">Status</span>
                {editing ? (
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PortfolioStatus)}
                    className="text-xs bg-surface-raised border border-border rounded-lg px-2 py-1 text-text focus:outline-none focus:border-blue"
                  >
                    {STATUS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                ) : (
                  <Badge variant={
                    project.status === "published" ? "blue"
                      : project.status === "completed" ? "emerald"
                      : project.status === "in_progress" ? "amber"
                      : "sky"
                  }>
                    {STATUS_OPTIONS.find((o) => o.value === project.status)?.label}
                  </Badge>
                )}
              </div>

              {/* Description */}
              <div>
                <p className="text-xs text-text-muted mb-1.5">Descrição</p>
                {editing ? (
                  <textarea
                    value={description}
                    onChange={(e) => setDesc(e.target.value)}
                    rows={3}
                    className="w-full text-xs bg-surface-raised border border-border rounded-lg px-3 py-2 text-text focus:outline-none focus:border-blue resize-none"
                  />
                ) : (
                  <p className="text-xs text-text leading-relaxed">
                    {project.description || <span className="text-text-muted italic">Sem descrição</span>}
                  </p>
                )}
              </div>

              {/* Skills */}
              <div>
                <p className="text-xs text-text-muted mb-1.5">Skills demonstradas</p>
                <div className="flex flex-wrap gap-1.5">
                  {(editing ? skills : project.skills).map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-blue/10 text-blue border border-blue/15 font-medium"
                    >
                      {skill}
                      {editing && (
                        <button onClick={() => removeSkill(skill)} className="hover:text-rose">
                          <X size={9} />
                        </button>
                      )}
                    </span>
                  ))}
                  {editing && (
                    <div className="flex items-center gap-1">
                      <input
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(skillInput); } }}
                        placeholder="Adicionar skill..."
                        list="skill-suggestions"
                        className="text-[11px] px-2 py-0.5 rounded-full bg-surface-raised border border-border text-text focus:outline-none focus:border-blue w-36"
                      />
                      <datalist id="skill-suggestions">
                        {ALL_SKILLS.map((s) => <option key={s} value={s} />)}
                      </datalist>
                      <button
                        onClick={() => addSkill(skillInput)}
                        className="text-[11px] text-blue hover:underline"
                      >
                        + Add
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Deliverables */}
              {project.deliverables.length > 0 && (
                <div>
                  <p className="text-xs text-text-muted mb-1.5">Entregáveis</p>
                  <ul className="space-y-1">
                    {project.deliverables.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-text">
                        <CheckSquare size={12} className="text-emerald mt-0.5 shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Links */}
              <div className="space-y-2">
                <p className="text-xs text-text-muted">Links</p>
                <div className="flex items-center gap-2">
                  <GitBranch size={12} className="text-text-muted shrink-0" />
                  {editing ? (
                    <input
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      placeholder="https://github.com/..."
                      className="flex-1 text-xs bg-surface-raised border border-border rounded-lg px-2 py-1 text-text focus:outline-none focus:border-blue"
                    />
                  ) : project.repositoryUrl ? (
                    <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-blue hover:underline flex items-center gap-1">
                      {project.repositoryUrl} <ExternalLink size={10} />
                    </a>
                  ) : (
                    <span className="text-xs text-text-muted italic">Não adicionado</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={12} className="text-text-muted shrink-0" />
                  {editing ? (
                    <input
                      value={liveUrl}
                      onChange={(e) => setLiveUrl(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 text-xs bg-surface-raised border border-border rounded-lg px-2 py-1 text-text focus:outline-none focus:border-blue"
                    />
                  ) : project.liveUrl ? (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-emerald hover:underline flex items-center gap-1">
                      {project.liveUrl} <ExternalLink size={10} />
                    </a>
                  ) : (
                    <span className="text-xs text-text-muted italic">Não adicionado</span>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <p className="text-xs text-text-muted mb-1.5">Notas / Aprendizados</p>
                {editing ? (
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="O que você aprendeu com este projeto?"
                    className="w-full text-xs bg-surface-raised border border-border rounded-lg px-3 py-2 text-text focus:outline-none focus:border-blue resize-none"
                  />
                ) : (
                  <p className="text-xs text-text leading-relaxed whitespace-pre-wrap">
                    {project.notes || <span className="text-text-muted italic">Sem notas ainda</span>}
                  </p>
                )}
              </div>

              {/* Delete */}
              {onDelete && (
                <div className="pt-2 border-t border-border">
                  {confirmDelete ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-rose">Confirmar exclusão?</span>
                      <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>Cancelar</Button>
                      <Button size="sm" variant="ghost" className="text-rose hover:bg-rose/10"
                        onClick={() => { onDelete(project.id); onClose(); }}>
                        Excluir
                      </Button>
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" className="text-rose hover:bg-rose/10 flex items-center gap-1.5"
                      onClick={() => setConfirmDelete(true)}>
                      <Trash2 size={12} />
                      Excluir projeto
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "readme" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-text-muted">README.md gerado automaticamente</p>
                <CopyButton text={readme} />
              </div>
              <pre className="text-[11px] text-text bg-surface-raised border border-border rounded-xl p-4 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                {readme}
              </pre>
            </div>
          )}

          {activeTab === "linkedin" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-text-muted">Post LinkedIn gerado automaticamente</p>
                <CopyButton text={linkedin} />
              </div>
              <pre className="text-[11px] text-text bg-surface-raised border border-border rounded-xl p-4 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                {linkedin}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
