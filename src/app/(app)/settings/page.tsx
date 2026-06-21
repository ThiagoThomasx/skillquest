"use client";

import { useRef, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  User, Bell, Palette, Shield, Download, Upload,
  AlertTriangle, RefreshCw, Check, X, Pencil,
} from "lucide-react";
import { exportBackup, importBackup, resetJourney } from "@/stores/backup-store";
import { useProgressStore } from "@/stores/progress-store";
import { useUIStore, type AppTheme } from "@/stores/useUIStore";
import { ThemeOptionCard } from "@/features/dashboard";

const THEMES: Array<{ name: string; themeKey: AppTheme; colors: string[]; description: string }> = [
  { name: "Moderno", themeKey: "modern", colors: ["#081120", "#0F1A2D", "#3B82F6", "#F59E0B"], description: "Navy premium — padrão" },
  { name: "Pixel Quest", themeKey: "pixel-quest", colors: ["#0d0d1a", "#1a0d2e", "#7c3aed", "#22C55E"], description: "Cyberpunk roxo-neón" },
  { name: "Fantasy RPG", themeKey: "fantasy-rpg", colors: ["#120808", "#2d1212", "#c2410c", "#ca8a04"], description: "Fogo e ouro épico" },
];

export default function SettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle");
  const [resetStep, setResetStep] = useState<0 | 1 | 2>(0);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const { username, setUsername } = useProgressStore();
  const { theme } = useUIStore();

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await importBackup(file);
      setImportStatus("success");
      setTimeout(() => setImportStatus("idle"), 3000);
    } catch {
      setImportStatus("error");
      setTimeout(() => setImportStatus("idle"), 3000);
    }
    e.target.value = "";
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
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <p className="text-sm text-text-muted">
            Exporte toda a sua jornada (XP, missões, conquistas, sequência) como arquivo JSON. Importe para restaurar em qualquer dispositivo.
          </p>

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
              onChange={handleImport}
            />
          </div>

          {importStatus === "success" && (
            <p className="text-xs text-emerald font-medium">✓ Backup importado com sucesso!</p>
          )}
          {importStatus === "error" && (
            <p className="text-xs text-rose font-medium">✗ Arquivo inválido ou corrompido.</p>
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
            Resetar a jornada apaga todo o progresso local: XP, missões, conquistas, sequência e histórico.
          </p>

          {resetStep > 0 && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-rose/5 border border-rose/20">
              <AlertTriangle size={14} className="text-rose mt-0.5 shrink-0" />
              <p className="text-xs text-rose">
                {resetStep === 1
                  ? "Tem certeza? Clique novamente para confirmar o reset."
                  : "Última chance! Clique uma vez mais para apagar tudo."}
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
