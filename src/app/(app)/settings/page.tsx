"use client";

import { useRef, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  User, Bell, Palette, Shield, Download, Upload,
  AlertTriangle, RefreshCw, Check, X, Pencil,
  FileJson, Info,
} from "lucide-react";
import {
  exportBackup, importBackup, parseBackupSummary, resetJourney,
  BACKUP_VERSION, type BackupSummary,
} from "@/stores/backup-store";
import { useProgressStore } from "@/stores/progress-store";
import { useUIStore, type AppTheme } from "@/stores/useUIStore";
import { ThemeOptionCard } from "@/features/dashboard";

const THEMES: Array<{ name: string; themeKey: AppTheme; colors: string[]; description: string }> = [
  { name: "Moderno", themeKey: "modern", colors: ["#081120", "#0F1A2D", "#3B82F6", "#F59E0B"], description: "Navy premium — padrão" },
  { name: "Pixel Quest", themeKey: "pixel-quest", colors: ["#0d0d1a", "#1a0d2e", "#7c3aed", "#22C55E"], description: "Cyberpunk roxo-neón" },
  { name: "Fantasy RPG", themeKey: "fantasy-rpg", colors: ["#120808", "#2d1212", "#c2410c", "#ca8a04"], description: "Fogo e ouro épico" },
];

type ImportState =
  | { step: "idle" }
  | { step: "confirming"; file: File; summary: BackupSummary }
  | { step: "success" }
  | { step: "error"; message: string };

export default function SettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importState, setImportState] = useState<ImportState>({ step: "idle" });
  const [resetStep, setResetStep] = useState<0 | 1 | 2>(0);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const { username, setUsername } = useProgressStore();

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    try {
      const summary = await parseBackupSummary(file);
      setImportState({ step: "confirming", file, summary });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Arquivo inválido ou corrompido.";
      setImportState({ step: "error", message });
      setTimeout(() => setImportState({ step: "idle" }), 5000);
    }
  }

  async function confirmImport() {
    if (importState.step !== "confirming") return;
    const { file } = importState;
    try {
      await importBackup(file);
      setImportState({ step: "success" });
      setTimeout(() => setImportState({ step: "idle" }), 4000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao importar backup.";
      setImportState({ step: "error", message });
      setTimeout(() => setImportState({ step: "idle" }), 5000);
    }
  }

  function cancelImport() {
    setImportState({ step: "idle" });
  }

  function handleReset() {
    if (resetStep === 0) { setResetStep(1); return; }
    if (resetStep === 1) { setResetStep(2); return; }
    resetJourney();
    setResetStep(0);
  }

  function startEditName() {
    setNameInput(username);
    setEditingName(true);
  }

  function saveName() {
    const trimmed = nameInput.trim();
    if (trimmed) setUsername(trimmed);
    setEditingName(false);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-text">Configurações</h2>
        <p className="text-text-muted mt-1">Gerencie suas preferências e dados locais.</p>
      </div>

      {/* Perfil */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User size={16} className="text-text-muted" />
            <h3 className="font-semibold text-text">Perfil</h3>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between py-3">
            <div className="flex-1 min-w-0 mr-4">
              <p className="text-sm font-medium text-text">Nome de usuário</p>
              {editingName ? (
                <div className="flex items-center gap-2 mt-1.5">
                  <input
                    autoFocus
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") saveName(); if (e.key === "Escape") setEditingName(false); }}
                    className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg border border-blue bg-surface-raised text-sm text-text focus:outline-none focus:ring-1 focus:ring-blue"
                    maxLength={32}
                  />
                  <button onClick={saveName} className="w-7 h-7 rounded-lg bg-blue/10 text-blue hover:bg-blue/20 flex items-center justify-center transition-colors">
                    <Check size={13} />
                  </button>
                  <button onClick={() => setEditingName(false)} className="w-7 h-7 rounded-lg hover:bg-surface-overlay text-text-dim flex items-center justify-center transition-colors">
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <p className="text-xs text-text-muted mt-0.5">{username}</p>
              )}
            </div>
            {!editingName && (
              <Button variant="ghost" size="sm" className="gap-1 shrink-0" onClick={startEditName}>
                <Pencil size={12} /> Editar
              </Button>
            )}
          </div>
          <p className="text-xs text-text-dim pt-2 border-t border-border">
            SkillQuest é 100% local — sem conta, sem e-mail, sem senha. Seus dados ficam no seu dispositivo.
          </p>
        </CardContent>
      </Card>

      {/* Aparência */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette size={16} className="text-text-muted" />
            <h3 className="font-semibold text-text">Aparência</h3>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-0 divide-y divide-border">
          <div className="py-3">
            <p className="text-sm font-medium text-text mb-3">Tema visual</p>
            <div className="grid grid-cols-3 gap-3">
              {THEMES.map((t) => (
                <ThemeOptionCard key={t.themeKey} {...t} />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-text">Idioma</p>
              <p className="text-xs text-text-muted mt-0.5">Português (BR)</p>
            </div>
            <Badge variant="default">Único</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-text-muted" />
            <h3 className="font-semibold text-text">Notificações</h3>
            <Badge variant="default">Em breve</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-text-muted">
            Lembretes de estudo e alertas de conquista serão configuráveis em uma versão futura.
          </p>
        </CardContent>
      </Card>

      {/* Backup & Restore */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Download size={16} className="text-text-muted" />
            <h3 className="font-semibold text-text">Backup & Restauração</h3>
            <Badge variant="default">v{BACKUP_VERSION}</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-surface-raised border border-border">
            <Info size={13} className="text-text-dim mt-0.5 shrink-0" />
            <p className="text-xs text-text-muted leading-relaxed">
              O backup inclui: trilhas, missões, sessões de estudo, notas, revisões, biblioteca, projetos, portfólio e configurações. Exporte com frequência para não perder seu progresso.
            </p>
          </div>

          {/* Idle / action buttons */}
          {importState.step === "idle" && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="secondary" size="sm" onClick={exportBackup} className="gap-2">
                <Download size={14} />
                Exportar backup
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
              >
                <Upload size={14} />
                Importar backup
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileSelected}
              />
            </div>
          )}

          {/* Confirm import */}
          {importState.step === "confirming" && (
            <div className="space-y-3">
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber/5 border border-amber/20">
                <AlertTriangle size={14} className="text-amber mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-medium text-amber">Confirmar importação</p>
                  <p className="text-xs text-text-muted">
                    Seus dados atuais serão substituídos pelos dados do backup abaixo. Esta ação não pode ser desfeita.
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-surface-raised p-3 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <FileJson size={13} className="text-text-dim" />
                  <p className="text-xs font-medium text-text">
                    Backup v{importState.summary.version} — {new Date(importState.summary.exportedAt).toLocaleString("pt-BR")}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {[
                    ["Missões", importState.summary.counts.missions],
                    ["Trilhas", importState.summary.counts.questlines],
                    ["Sessões", importState.summary.counts.sessions],
                    ["Notas", importState.summary.counts.notes],
                    ["Revisões", importState.summary.counts.reviews],
                    ["Biblioteca", importState.summary.counts.resources],
                    ["Projetos", importState.summary.counts.projects],
                    ["Portfólio", importState.summary.counts.portfolioProjects],
                  ].map(([label, count]) => (
                    <div key={label as string} className="flex items-center justify-between">
                      <span className="text-xs text-text-muted">{label}</span>
                      <span className="text-xs font-medium text-text">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="primary" size="sm" onClick={confirmImport} className="gap-2">
                  <Check size={14} />
                  Confirmar importação
                </Button>
                <Button variant="ghost" size="sm" onClick={cancelImport}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {/* Success */}
          {importState.step === "success" && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald/5 border border-emerald/20">
              <Check size={14} className="text-emerald shrink-0" />
              <p className="text-xs text-emerald font-medium">Backup importado com sucesso! Seus dados foram restaurados.</p>
            </div>
          )}

          {/* Error */}
          {importState.step === "error" && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-rose/5 border border-rose/20">
              <X size={14} className="text-rose shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-rose">Falha na importação</p>
                <p className="text-xs text-text-muted mt-0.5">{importState.message}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Zona de Perigo */}
      <Card variant="raised" className="border-rose/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-rose" />
            <h3 className="font-semibold text-text">Zona de Perigo</h3>
            <Badge variant="rose">Irreversível</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <p className="text-sm text-text-muted">
            Resetar a jornada apaga todo o progresso local: XP, missões, conquistas, sessões, notas, revisões, biblioteca, projetos e histórico.
          </p>

          {resetStep > 0 && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-rose/5 border border-rose/20">
              <AlertTriangle size={14} className="text-rose mt-0.5 shrink-0" />
              <p className="text-xs text-rose">
                {resetStep === 1
                  ? "Tem certeza? Clique novamente para confirmar o reset."
                  : "Última chance! Clique uma vez mais para apagar tudo permanentemente."}
              </p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button
              variant="danger"
              size="sm"
              onClick={handleReset}
              className="gap-2"
            >
              <RefreshCw size={14} />
              {resetStep === 0 ? "Resetar jornada" : resetStep === 1 ? "Confirmar reset" : "Apagar tudo agora"}
            </Button>
            {resetStep > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setResetStep(0)}>
                Cancelar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
