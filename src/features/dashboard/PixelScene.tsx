export function PixelScene() {
  return (
    <div className="relative w-full h-full min-h-[180px] flex items-center justify-center overflow-hidden select-none pointer-events-none">
      {/* Background glow */}
      <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-blue/8 blur-3xl" />
      <div className="absolute right-1/3 top-1/4 w-32 h-32 rounded-full bg-amber/6 blur-2xl" />

      {/* Outer orbit rings */}
      <div className="absolute w-48 h-48 rounded-full border border-blue/10" />
      <div className="absolute w-36 h-36 rounded-full border border-blue/15" />

      {/* Level badge orb */}
      <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-surface-raised to-canvas border border-blue/30 flex flex-col items-center justify-center shadow-xl">
        <div className="absolute inset-1 rounded-full border border-blue/10" />
        <span className="text-[9px] uppercase tracking-[0.2em] text-blue/60 font-semibold">Nível</span>
        <span className="text-[2rem] font-black text-blue leading-none">7</span>
      </div>

      {/* Orbiting dots */}
      <div className="absolute w-48 h-48">
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-amber/80 ring-4 ring-amber/15" />
        <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald/70 ring-4 ring-emerald/15" />
        <div className="absolute bottom-2 left-4 w-2.5 h-2.5 rounded-full bg-blue/60 ring-4 ring-blue/10" />
      </div>

      {/* Floating stat chips */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
        <div className="flex items-center gap-1.5 bg-amber/10 border border-amber/20 rounded-full px-2.5 py-1">
          <div className="w-1.5 h-1.5 rounded-full bg-amber" />
          <span className="text-[10px] font-semibold text-amber">+850 XP</span>
        </div>
        <div className="flex items-center gap-1.5 bg-blue/10 border border-blue/20 rounded-full px-2.5 py-1">
          <div className="w-1.5 h-1.5 rounded-full bg-blue" />
          <span className="text-[10px] font-semibold text-blue">#34 global</span>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald/10 border border-emerald/20 rounded-full px-2.5 py-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald" />
          <span className="text-[10px] font-semibold text-emerald">4 missões</span>
        </div>
      </div>

      {/* Decorative geometric accents */}
      <div className="absolute bottom-8 left-8 w-8 h-8 border border-blue/15 rotate-45" />
      <div className="absolute top-8 left-12 w-4 h-4 border border-amber/20 rotate-12" />
      <div className="absolute bottom-4 right-1/4 w-2 h-2 rounded-full bg-sky/30" />
    </div>
  );
}
