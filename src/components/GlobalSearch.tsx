"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Map,
  Layers,
  Sword,
  Clock,
  FileText,
  BookOpen,
  FolderKanban,
  ArrowRight,
} from "lucide-react";
import { useUIStore } from "@/stores/useUIStore";
import { useGlobalSearch, type SearchResult, type SearchResultType } from "@/hooks/useGlobalSearch";

// ── Constants ─────────────────────────────────────────────────────────────────

const GROUP_LABELS: Record<SearchResultType, string> = {
  trilha: "Trilhas",
  modulo: "Módulos",
  missao: "Missões",
  sessao: "Sessões",
  nota: "Notas",
  recurso: "Biblioteca",
  projeto: "Projetos",
};

const GROUP_ICONS: Record<SearchResultType, React.ElementType> = {
  trilha: Map,
  modulo: Layers,
  missao: Sword,
  sessao: Clock,
  nota: FileText,
  recurso: BookOpen,
  projeto: FolderKanban,
};

const GROUP_ORDER: SearchResultType[] = [
  "trilha",
  "modulo",
  "missao",
  "sessao",
  "nota",
  "recurso",
  "projeto",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// ── Sub-components ────────────────────────────────────────────────────────────

type ResultItemProps = {
  result: SearchResult;
  isActive: boolean;
  onSelect: (result: SearchResult) => void;
  onHover: () => void;
};

function ResultItem({ result, isActive, onSelect, onHover }: ResultItemProps) {
  const Icon = GROUP_ICONS[result.type];
  return (
    <button
      type="button"
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
        isActive ? "bg-blue/10 text-text" : "text-text-muted hover:bg-surface-raised hover:text-text"
      }`}
      onClick={() => onSelect(result)}
      onMouseEnter={onHover}
    >
      <div
        className={`flex items-center justify-center w-7 h-7 rounded-md shrink-0 ${
          isActive ? "bg-blue/20 text-blue" : "bg-surface-raised text-text-muted"
        }`}
      >
        <Icon size={13} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{result.title}</p>
        <p className="text-xs text-text-muted truncate">{result.subtitle}</p>
      </div>
      {isActive && <ArrowRight size={12} className="text-blue shrink-0" />}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function GlobalSearch() {
  const isOpen = useUIStore((s) => s.commandPaletteOpen);
  const close = useUIStore((s) => s.closeCommandPalette);
  const open = useUIStore((s) => s.openCommandPalette);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 150);
  const results = useGlobalSearch(debouncedQuery);

  // Build flat list for keyboard navigation
  const flatResults: SearchResult[] = GROUP_ORDER.flatMap(
    (type) => results[`${type}s` as keyof typeof results] as SearchResult[]
  );

  const [activeIndex, setActiveIndex] = useState(0);

  // Reset state when modal opens
  useEffect(() => {
    if (!isOpen) return;
    const id = setTimeout(() => {
      setQuery("");
      setActiveIndex(0);
      inputRef.current?.focus();
    }, 0);
    return () => clearTimeout(id);
  }, [isOpen]);

  // Reset active index when results change
  useEffect(() => {
    const id = setTimeout(() => setActiveIndex(0), 0);
    return () => clearTimeout(id);
  }, [debouncedQuery]);

  // Global Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) close();
        else open();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close, open]);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      router.push(result.href);
      close();
    },
    [router, close]
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const active = flatResults[activeIndex];
      if (active) handleSelect(active);
    } else if (e.key === "Escape") {
      close();
    }
  }

  if (!isOpen) return null;

  // Build flat index map to track position per group item
  const groups = GROUP_ORDER.reduce<{ type: SearchResultType; items: SearchResult[]; startIdx: number }[]>(
    (acc, type) => {
      const key = `${type}s` as keyof typeof results;
      const items = results[key] as SearchResult[];
      const startIdx = acc.reduce((n, g) => n + g.items.length, 0);
      if (items.length > 0) acc.push({ type, items, startIdx });
      return acc;
    },
    []
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Busca global"
        className="fixed z-50 top-[10%] left-1/2 -translate-x-1/2 w-full max-w-lg mx-4 bg-surface border border-border rounded-xl shadow-2xl overflow-hidden"
        style={{ maxHeight: "70vh" }}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search size={16} className="text-text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar trilhas, missões, notas..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-text placeholder:text-text-muted outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-text-muted hover:text-text transition-colors"
              aria-label="Limpar busca"
            >
              <X size={14} />
            </button>
          )}
          <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs bg-surface-raised text-text-muted border border-border font-mono">
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div className="overflow-y-auto" style={{ maxHeight: "calc(70vh - 56px)" }}>
          {debouncedQuery.length < 2 ? (
            <div className="px-4 py-8 text-center">
              <Search size={24} className="mx-auto mb-2 text-text-muted opacity-40" />
              <p className="text-sm text-text-muted">Digite pelo menos 2 caracteres para buscar</p>
              <p className="text-xs text-text-muted mt-1 opacity-60">
                Busca em trilhas, missões, notas, biblioteca e mais
              </p>
            </div>
          ) : results.total === 0 ? (
            <div className="px-4 py-8 text-center">
              <Search size={24} className="mx-auto mb-2 text-text-muted opacity-40" />
              <p className="text-sm text-text-muted">
                Nenhum resultado para{" "}
                <span className="font-medium text-text">&quot;{debouncedQuery}&quot;</span>
              </p>
              <p className="text-xs text-text-muted mt-1 opacity-60">
                Tente um termo diferente ou verifique a ortografia
              </p>
            </div>
          ) : (
            <div className="p-2">
              {groups.map(({ type, items, startIdx }) => {
                const Icon = GROUP_ICONS[type];
                return (
                  <div key={type} className="mb-3 last:mb-0">
                    {/* Group header */}
                    <div className="flex items-center gap-1.5 px-3 mb-1">
                      <Icon size={11} className="text-text-muted" />
                      <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                        {GROUP_LABELS[type]}
                      </span>
                    </div>
                    {/* Items */}
                    {items.map((result, i) => (
                      <ResultItem
                        key={result.id}
                        result={result}
                        isActive={activeIndex === startIdx + i}
                        onSelect={handleSelect}
                        onHover={() => setActiveIndex(startIdx + i)}
                      />
                    ))}
                  </div>
                );
              })}

              {/* Footer hint */}
              <div className="mt-2 pt-2 border-t border-border px-3 flex items-center justify-between">
                <span className="text-xs text-text-muted">
                  {results.total} resultado{results.total !== 1 ? "s" : ""}
                </span>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded bg-surface-raised border border-border font-mono text-[10px]">
                      ↑↓
                    </kbd>
                    navegar
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded bg-surface-raised border border-border font-mono text-[10px]">
                      Enter
                    </kbd>
                    abrir
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
