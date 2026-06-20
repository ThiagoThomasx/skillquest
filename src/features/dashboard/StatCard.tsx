import { type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconClassName?: string;
  iconBgClassName?: string;
}

export function StatCard({ label, value, icon: Icon, iconClassName, iconBgClassName }: StatCardProps) {
  return (
    <Card className="p-4">
      <div className={cn("inline-flex items-center justify-center w-9 h-9 rounded-lg border mb-3", iconBgClassName)}>
        <Icon size={16} className={iconClassName} />
      </div>
      <p className="text-2xl font-bold text-text">{value}</p>
      <p className="text-xs text-text-muted mt-0.5">{label}</p>
    </Card>
  );
}
