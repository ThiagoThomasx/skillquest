import { Zap, Calendar } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { formatDate } from "@/utils/format";
import type { ActivityEntry } from "@/types";

interface ActivityFeedProps {
  activity: ActivityEntry[];
}

export function ActivityFeed({ activity }: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-text-muted" />
          <h3 className="text-sm font-semibold text-text">Atividade Recente</h3>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-1">
        {activity.length === 0 && (
          <p className="text-sm text-text-muted py-4 text-center">Nenhuma atividade ainda.</p>
        )}
        {activity.map((entry) => (
          <div key={entry.id} className="flex items-center justify-between py-2.5 border-t border-border first:border-0 first:pt-0">
            <div>
              <p className="text-xs text-text-muted capitalize">{entry.type.replace("_", " ")}</p>
              <p className="text-sm font-medium text-text">{entry.title}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <Zap size={11} className="text-amber" />
                <span className="text-sm font-semibold text-amber">+{entry.xpGained}</span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">{formatDate(entry.timestamp)}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
