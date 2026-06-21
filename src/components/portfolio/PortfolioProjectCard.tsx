"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  GitBranch, Globe, Sword, Target, Layers, Plus,
  CheckCircle2, Clock, Lightbulb, Rocket, Eye,
  ChevronRight,
} from "lucide-react";
import type { PortfolioProject, PortfolioStatus, PortfolioSourceType } from "@/stores/portfolio-store";

// ── Config ────────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<PortfolioStatus, { label: string; variant: "blue" | "amber" | "emerald" | "sky"; icon: React.ElementType }> = {
  idea:        { label: "Ideia",        variant: "sky",     icon: Lightbulb },
  in_progress: { label: "Em andamento", variant: "amber",   icon: Clock },
  completed:   { label: "Concluído",    variant: "emerald", icon: CheckCircle2 },
  published:   { label: "Publicado",    variant: "blue",    icon: Rocket },
};

const SOURCE_CONFIG: Record<PortfolioSourceType, { label: string; icon: React.ElementType }> = {
  mission:     { label: "Missão",       icon: Target },
  module:      { label: "Módulo",       icon: Layers },
  boss_battle: { label: "Boss Battle",  icon: Sword },
  custom:      { label: "Personalizado", icon: Plus },
};

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  project: PortfolioProject;
  onOpen: (project: PortfolioProject) => void;
}

export function PortfolioProjectCard({ project, onOpen }: Props) {
  const status = STATUS_CONFIG[project.status];
  const source = SOURCE_CONFIG[project.sourceType];
  const StatusIcon = status.icon;
  const SourceIcon = source.icon;

  const completedDeliverables = project.deliverables.length;
  const hasLinks = project.repositoryUrl || project.liveUrl;

  return (
    <Card className="group flex flex-col gap-0 p-0 overflow-hidden hover:border-blue/30 transition-colors cursor-pointer">
      {/* Header strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue/60 to-blue/20" />

      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-text leading-snug truncate">{project.title}</h3>
            {project.category && (
              <p className="text-[10px] text-text-muted mt-0.5">{project.category}</p>
            )}
          </div>
          <Badge variant={status.variant} className="shrink-0 flex items-center gap-1">
            <StatusIcon size={10} />
            {status.label}
          </Badge>
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        )}

        {/* Skills */}
        {project.skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="text-[10px] px-2 py-0.5 rounded-full bg-blue/10 text-blue border border-blue/15 font-medium"
              >
                {skill}
              </span>
            ))}
            {project.skills.length > 4 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-raised text-text-muted border border-border">
                +{project.skills.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Source + deliverables */}
        <div className="flex items-center justify-between gap-2 text-[10px] text-text-muted">
          <div className="flex items-center gap-1">
            <SourceIcon size={10} />
            <span>{source.label}</span>
          </div>
          {completedDeliverables > 0 && (
            <span>{completedDeliverables} entregável{completedDeliverables !== 1 ? "is" : ""}</span>
          )}
        </div>

        {/* Links */}
        {hasLinks && (
          <div className="flex items-center gap-2">
            {project.repositoryUrl && (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-[10px] text-text-muted hover:text-blue transition-colors"
              >
                <GitBranch size={10} />
                GitHub
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-[10px] text-text-muted hover:text-emerald transition-colors"
              >
                <Globe size={10} />
                Demo
              </a>
            )}
          </div>
        )}

        {/* Action */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-auto flex items-center justify-between text-xs"
          onClick={() => onOpen(project)}
        >
          <span className="flex items-center gap-1.5">
            <Eye size={12} />
            Abrir projeto
          </span>
          <ChevronRight size={12} />
        </Button>
      </div>
    </Card>
  );
}
