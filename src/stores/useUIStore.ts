import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface UIState {
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  xpAnimation: { active: boolean; amount: number };

  toggleSidebar: () => void;
  setSidebarCollapsed: (value: boolean) => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  triggerXPAnimation: (amount: number) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      sidebarCollapsed: false,
      commandPaletteOpen: false,
      xpAnimation: { active: false, amount: 0 },

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarCollapsed: (value) => set({ sidebarCollapsed: value }),

      openCommandPalette: () => set({ commandPaletteOpen: true }),
      closeCommandPalette: () => set({ commandPaletteOpen: false }),

      triggerXPAnimation: (amount) => {
        set({ xpAnimation: { active: true, amount } });
        setTimeout(() => set({ xpAnimation: { active: false, amount: 0 } }), 2_000);
      },
    }),
    { name: "ui-store" }
  )
);
