import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { User, Bell, Palette, Shield, ChevronRight } from "lucide-react";

const sections = [
  {
    title: "Conta",
    icon: User,
    items: [
      { label: "Nome de usuário", value: "Aventureiro", action: "Editar" },
      { label: "E-mail", value: "aventureiro@skillquest.com", action: "Editar" },
      { label: "Senha", value: "••••••••", action: "Alterar" },
    ],
  },
  {
    title: "Notificações",
    icon: Bell,
    items: [
      { label: "Lembrete diário", value: "Ativado — 20:00", action: "Editar" },
      { label: "Conquistas", value: "Ativado", action: "Editar" },
      { label: "Novidades", value: "Desativado", action: "Ativar" },
    ],
  },
  {
    title: "Aparência",
    icon: Palette,
    items: [
      { label: "Tema", value: "Dark (padrão)", action: "Mudar" },
      { label: "Idioma", value: "Português (BR)", action: "Mudar" },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-text">Configurações</h2>
        <p className="text-text-muted mt-1">Gerencie suas preferências e conta.</p>
      </div>

      {sections.map(({ title, icon: Icon, items }) => (
        <Card key={title}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Icon size={16} className="text-text-muted" />
              <h3 className="font-semibold text-text">{title}</h3>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="divide-y divide-border">
              {items.map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-text">{item.label}</p>
                    <p className="text-xs text-text-muted mt-0.5">{item.value}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1">
                    {item.action}
                    <ChevronRight size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Danger zone */}
      <Card variant="raised">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-rose" />
            <h3 className="font-semibold text-text">Zona de Perigo</h3>
            <Badge variant="rose">Irreversível</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0 flex flex-col sm:flex-row gap-3">
          <Button variant="secondary" size="sm">Exportar dados</Button>
          <Button variant="danger" size="sm">Excluir conta</Button>
        </CardContent>
      </Card>
    </div>
  );
}
