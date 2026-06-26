"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { formatSeconds } from "@/utils/session-metrics";
import type { DayData } from "@/utils/session-metrics";
import { CalendarDays, X, Clock, Layers, BookOpen } from "lucide-react";

// ── helpers ──────────────────────────────────────────────────────────────────

const DAYS_SHOWN = 91; // 13 full weeks

const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function weekdayIndex(dateStr: string): number {
  return new Date(dateStr + "T12:00:00").getDay(); // 0=Sun
}

function formatDateBR(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

// ── intensity colours (CSS variable-aware) ───────────────────────────────────

const INTENSITY_CLASS: Record<string, string> = {
  none: "bg-white/5 dark:bg-white/5",
  light: "bg-blue-400/30",
  medium: "bg-blue-500/60",
  strong: "bg-blue-500",
};

const INTENSITY_LABEL: Record<string, string> = {
  none: "Sem estudo",
  light: "Leve (< 30min)",
  medium: "Médio (30–59min)",
  strong: "Forte (≥ 60min)",
};

// ── sub-components ────────────────────────────────────────────────────────────

function DayCell({
  day,
  isSelected,
  isToday,
  onSelect,
}: {
  day: DayData;
  isSelected: boolean;
  isToday: boolean;
  onSelect: (d: DayData) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(day)}
      title={`${formatDateBR(day.date)} — ${day.intensity === "none" ? "sem estudo" : formatSeconds(day.totalSeconds)}`}
      className={[
        "size-[14px] sm:size-[16px] rounded-[3px] transition-all duration-150",
        INTENSITY_CLASS[day.intensity],
        isSelected ? "ring-2 ring-white/80 scale-110" : "hover:scale-110 hover:ring-1 hover:ring-white/40",
        isToday ? "ring-2 ring-amber-400/70" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={formatDateBR(day.date)}
    />
  );
}

function DayDetail({
  day,
  onClose,
}: {
  day: DayData;
  onClose: () => void;
}) {
  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 relative animate-in fade-in slide-in-from-top-1 duration-200">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 top-3 text-white/40 hover:text-white/80 transition-colors"
        aria-label="Fechar"
      >
        <X className="size-4" />
      </button>

      <p className="text-sm font-medium text-white/90 capitalize mb-3">
        {formatDateBR(day.date)}
      </p>

      {day.intensity === "none" ? (
        <p className="text-sm text-white/40">Nenhuma sessão registrada neste dia.</p>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-white/50">
              <Clock className="size-3.5" />
              <span className="text-xs">Tempo</span>
            </div>
            <span className="text-base font-semibold text-white">{formatSeconds(day.totalSeconds)}</span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-white/50">
              <Layers className="size-3.5" />
              <span className="text-xs">Sessões</span>
            </div>
            <span className="text-base font-semibold text-white">{day.sessionCount}</span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-white/50">
              <BookOpen className="size-3.5" />
              <span className="text-xs">Trilhas</span>
            </div>
            <span className="text-base font-semibold text-white">{day.missionTitles.length}</span>
          </div>
        </div>
      )}

      {day.missionTitles.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {day.missionTitles.map((t) => (
            <span
              key={t}
              className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs text-blue-300"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <div className="rounded-full bg-white/5 p-4">
        <CalendarDays className="size-8 text-white/30" />
      </div>
      <p className="text-sm font-medium text-white/60">Nenhum estudo registrado ainda</p>
      <p className="text-xs text-white/30 max-w-xs">
        Complete sua primeira sessão de estudo e veja sua consistência surgir aqui.
      </p>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

type Props = {
  data: DayData[];
};

export function ConsistencyCalendar({ data }: Props) {
  const [selected, setSelected] = useState<DayData | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const hasAnyStudy = useMemo(() => data.some((d) => d.intensity !== "none"), [data]);

  // Organise into week columns: each column = 7 days (Sun→Sat)
  // First day in data may not be Sunday, so pad the first column
  const weeks = useMemo(() => {
    const cols: (DayData | null)[][] = [];
    if (data.length === 0) return cols;

    const firstDow = weekdayIndex(data[0].date); // 0=Sun
    // Build flat array with leading nulls so first real day lands on correct row
    const flat: (DayData | null)[] = Array(firstDow).fill(null).concat(data);
    // Chunk into groups of 7
    for (let i = 0; i < flat.length; i += 7) {
      cols.push(flat.slice(i, i + 7).concat(Array(Math.max(0, 7 - (flat.length - i))).fill(null)));
    }
    return cols;
  }, [data]);

  // Month labels: show month name when a new month starts within a column
  const monthLabels = useMemo(() => {
    return weeks.map((col) => {
      const first = col.find((d) => d !== null);
      if (!first) return null;
      const prev = col[0]; // could be null (padding)
      // Show label on first column or when month changes mid-column
      const d = new Date(first.date + "T12:00:00");
      return d.getDate() <= 7
        ? d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")
        : null;
    });
  }, [weeks]);

  function handleSelect(day: DayData) {
    setSelected((prev) => (prev?.date === day.date ? null : day));
  }

  return (
    <Card className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <CalendarDays className="size-4 text-blue-400" />
          <span className="text-sm font-semibold text-white/90">Consistência</span>
          <span className="text-xs text-white/40">— últimos 91 dias</span>
        </div>

        {hasAnyStudy && (
          <span className="text-xs text-white/40">
            {data.filter((d) => d.intensity !== "none").length} dias com estudo
          </span>
        )}
      </div>

      {!hasAnyStudy ? (
        <EmptyState />
      ) : (
        <>
          {/* Grid — horizontally scrollable on small screens */}
          <div className="overflow-x-auto pb-1 -mx-1 px-1">
            <div className="min-w-max">
              {/* Month labels row */}
              <div className="flex gap-[3px] mb-1 pl-8">
                {weeks.map((_, wi) => (
                  <div key={wi} className="w-[14px] sm:w-[16px] text-center">
                    {monthLabels[wi] && (
                      <span className="text-[9px] text-white/30 capitalize">
                        {monthLabels[wi]}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Day-of-week labels + cells */}
              <div className="flex gap-1">
                {/* Day-of-week axis */}
                <div className="flex flex-col gap-[3px] mr-1 justify-start">
                  {DAY_LABELS.map((label, i) => (
                    <div
                      key={label}
                      className="h-[14px] sm:h-[16px] flex items-center"
                    >
                      {i % 2 === 0 && (
                        <span className="text-[9px] text-white/25 w-6 text-right pr-1">
                          {label}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Week columns */}
                <div className="flex gap-[3px]">
                  {weeks.map((col, wi) => (
                    <div key={wi} className="flex flex-col gap-[3px]">
                      {col.map((day, di) =>
                        day ? (
                          <DayCell
                            key={day.date}
                            day={day}
                            isSelected={selected?.date === day.date}
                            isToday={day.date === today}
                            onSelect={handleSelect}
                          />
                        ) : (
                          <div key={`empty-${wi}-${di}`} className="size-[14px] sm:size-[16px]" />
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <span className="text-xs text-white/30">Menos</span>
            {(["none", "light", "medium", "strong"] as const).map((lvl) => (
              <div key={lvl} className="flex items-center gap-1.5">
                <div className={`size-3 rounded-[2px] ${INTENSITY_CLASS[lvl]}`} />
                <span className="text-[10px] text-white/30">{INTENSITY_LABEL[lvl]}</span>
              </div>
            ))}
            <span className="text-xs text-white/30">Mais</span>
          </div>

          {/* Today indicator note */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="size-3 rounded-[2px] ring-2 ring-amber-400/70 bg-transparent" />
            <span className="text-[10px] text-white/30">Hoje</span>
          </div>
        </>
      )}

      {/* Day detail panel */}
      {selected && (
        <DayDetail day={selected} onClose={() => setSelected(null)} />
      )}
    </Card>
  );
}
