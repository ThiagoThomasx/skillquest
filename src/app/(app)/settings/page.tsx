"use client";

import { useRef, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  User, Bell, Palette, Shield, Download, Upload,
  AlertTriangle, ChevronRight, RefreshCw,
} from "lucide-react";
import { exportBackup, importBackup, resetJourney } from "@/stores/backup-store";

export default function SettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle");
  const [resetStep, setResetStep] = useState<0 | 1 | 2>(0);

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

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-text">Configurações</h2>
        <p className="text-text-muted mt-1">Gerencie suas preferências e conta.</p>
      </div>

      {/* Conta */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User size={16} className="text-text-muted" />
            <h3 className="font-semibold text-text">Conta</h3>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="divide-y divide-border">
            {[
              { label: "Nome de usuário", value: "Aventureiro" },
              { label: "E-mail", value: "aventureiro@skillquest.com" },
              { label: "Senha", value: "••••••••" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-text">{item.label}</p>
                  <p className="text-xs text-text-muted mt-0.5">{item.value}</p>
                </div>
                <Button variant="ghost" size="sm" className="gap-1">
                  Editar <ChevronRight size={14} />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-text-muted" />
            <h3 className="font-semibold text-text">Notificações</h3>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="divide-y divide-border">
            {[
              { label: "Lembrete diário", value: "Ativado — 20:00" },
              { label: "Conquistas", value: "Ativado" },
              { label: "Novidades", value: "Desativado" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-text">{item.label}</p>
                  <p className="text-xs text-text-muted mt-0.5">{item.value}</p>
                </div>
                <Button variant="ghost" size="sm" className="gap-1">
                  Editar <ChevronRight size={14} />
                </Button>
              </div>
            ))}
          </div>
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
        <CardContent className="pt-0">
          <div className="divide-y divide-border">
            {[
              { label: "Tema visual", value: "Ver opções no Dashboard" },
              { label: "Idioma", value: "Português (BR)" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-text">{item.label}</p>
                  <p className="text-xs text-text-muted mt-0.5">{item.value}</p>
                </div>
                <Button variant="ghost" size="sm" className="gap-1">
                  Mudar <ChevronRight size={14} />
                </Button>
              </div>
            ))}
          </div>
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
