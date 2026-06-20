import { type LucideIcon } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ChevronRight } from "lucide-react";

interface SettingsItem {
  label: string;
  value: string;
  action: string;
  onAction?: () => void;
}

interface SettingsSectionProps {
  title: string;
  icon: LucideIcon;
  items: SettingsItem[];
}

export function SettingsSection({ title, icon: Icon, items }: SettingsSectionProps) {
  return (
    <Card>
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
              <Button variant="ghost" size="sm" className="gap-1" onClick={item.onAction}>
                {item.action}
                <ChevronRight size={14} />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
