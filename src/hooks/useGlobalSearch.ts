"use client";

import { useMemo } from "react";
import { useMissionsStore } from "@/stores/missions-store";
import { useQuestlinesStore } from "@/stores/questlines-store";
import { useStudySessionStore } from "@/stores/study-session-store";
import { useNotesStore } from "@/stores/notes-store";
import { useResourcesStore } from "@/stores/resources-store";
import { useProjectsStore } from "@/stores/projects-store";

export type SearchResultType =
  | "trilha"
  | "modulo"
  | "missao"
  | "sessao"
  | "nota"
  | "recurso"
  | "projeto";

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  href: string;
  badge?: string;
}

export interface GroupedSearchResults {
  trilhas: SearchResult[];
  modulos: SearchResult[];
  missoes: SearchResult[];
  sessoes: SearchResult[];
  notas: SearchResult[];
  recursos: SearchResult[];
  projetos: SearchResult[];
  total: number;
}

const EMPTY: GroupedSearchResults = {
  trilhas: [],
  modulos: [],
  missoes: [],
  sessoes: [],
  notas: [],
  recursos: [],
  projetos: [],
  total: 0,
};

function matches(query: string, ...fields: (string | undefined | null)[]): boolean {
  const q = query.toLowerCase();
  return fields.some((f) => f?.toLowerCase().includes(q));
}

const MAX_PER_GROUP = 5;

export function useGlobalSearch(query: string): GroupedSearchResults {
  const missions = useMissionsStore((s) => s.missions);
  const questlines = useQuestlinesStore((s) => s.questlines);
  const sessions = useStudySessionStore((s) => s.sessions);
  const notes = useNotesStore((s) => s.notes);
  const resources = useResourcesStore((s) => s.resources);
  const projects = useProjectsStore((s) => s.projects);

  return useMemo(() => {
    const q = query.trim();
    if (q.length < 2) return EMPTY;

    // ── Trilhas ───────────────────────────────────────────────────────────────
    const trilhas: SearchResult[] = questlines
      .filter((ql) => matches(q, ql.title, ql.description, ql.category, ql.className))
      .slice(0, MAX_PER_GROUP)
      .map((ql) => ({
        id: ql.id,
        type: "trilha",
        title: ql.title,
        subtitle: `${ql.category} · ${ql.difficulty}`,
        href: "/paths",
        badge: ql.status,
      }));

    // ── Módulos ───────────────────────────────────────────────────────────────
    const modulos: SearchResult[] = questlines
      .flatMap((ql) =>
        ql.modules
          .filter((m) => matches(q, m.title, m.description))
          .map((m) => ({
            id: m.id,
            type: "modulo" as SearchResultType,
            title: m.title,
            subtitle: `Trilha: ${ql.title}`,
            href: "/paths",
          }))
      )
      .slice(0, MAX_PER_GROUP);

    // ── Missões ───────────────────────────────────────────────────────────────
    const missoes: SearchResult[] = missions
      .filter((m) =>
        matches(q, m.title, m.description, m.pathTitle, m.category, m.tips, m.completionCriteria)
      )
      .slice(0, MAX_PER_GROUP)
      .map((m) => ({
        id: m.id,
        type: "missao",
        title: m.title,
        subtitle: `${m.pathTitle} · ${m.category}`,
        href: "/missions",
        badge: m.difficulty,
      }));

    // ── Sessões ───────────────────────────────────────────────────────────────
    const sessoes: SearchResult[] = sessions
      .filter((s) => matches(q, s.missionTitle, s.notes, s.whatILearned, s.links))
      .slice(0, MAX_PER_GROUP)
      .map((s) => {
        const date = s.startedAt ? new Date(s.startedAt).toLocaleDateString("pt-BR") : "";
        const mins = Math.round(s.durationSeconds / 60);
        return {
          id: s.id,
          type: "sessao",
          title: s.missionTitle,
          subtitle: `${date} · ${mins} min`,
          href: "/history",
        };
      });

    // ── Notas ─────────────────────────────────────────────────────────────────
    const notas: SearchResult[] = notes
      .filter((n) =>
        matches(q, n.title, n.content, n.pathTitle, n.moduleTitle, n.missionTitle, ...n.tags)
      )
      .slice(0, MAX_PER_GROUP)
      .map((n) => ({
        id: n.id,
        type: "nota",
        title: n.title,
        subtitle: n.pathTitle || n.moduleTitle || "Nota avulsa",
        href: "/knowledge",
      }));

    // ── Recursos (Biblioteca) ─────────────────────────────────────────────────
    const recursos: SearchResult[] = resources
      .filter((r) => matches(q, r.title, r.notes, r.type, r.url))
      .slice(0, MAX_PER_GROUP)
      .map((r) => ({
        id: r.id,
        type: "recurso",
        title: r.title,
        subtitle: `${r.type} · ${r.status.replace("_", " ")}`,
        href: "/library",
        badge: r.type,
      }));

    // ── Projetos ──────────────────────────────────────────────────────────────
    const projetos: SearchResult[] = projects
      .filter((p) =>
        matches(q, p.name, p.description, p.questlineTitle, p.moduleTitle, p.learnings)
      )
      .slice(0, MAX_PER_GROUP)
      .map((p) => ({
        id: p.id,
        type: "projeto",
        title: p.name,
        subtitle: `${p.questlineTitle || "Projeto"} · ${p.status.replace("_", " ")}`,
        href: "/projects",
        badge: p.status,
      }));

    const total =
      trilhas.length +
      modulos.length +
      missoes.length +
      sessoes.length +
      notas.length +
      recursos.length +
      projetos.length;

    return { trilhas, modulos, missoes, sessoes, notas, recursos, projetos, total };
  }, [query, missions, questlines, sessions, notes, resources, projects]);
}
