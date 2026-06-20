import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type AppTheme = "modern" | "pixel-quest" | "fantasy-rpg";

interface UIState {
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  xpAnimation: { active: boolean; amount: number };
  theme: AppTheme;

  toggleSidebar: () => void;
  setSidebarCollapsed: (value: boolean) => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  triggerXPAnimation: (amount: number) => void;
  setTheme: (theme: AppTheme) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        sidebarCollapsed: false,
        commandPaletteOpen: false,
        xpAnimation: { active: false, amount: 0 },
        theme: "modern" as AppTheme,

        toggleSidebar: () =>
          set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

        setSidebarCollapsed: (value) => set({ sidebarCollapsed: value }),

        openCommandPalette: () => set({ commandPaletteOpen: true }),
        closeCommandPalette: () => set({ commandPaletteOpen: false }),

        triggerXPAnimation: (amount) => {
          set({ xpAnimation: { active: true, amount } });
          setTimeout(() => set({ xpAnimation: { active: false, amount: 0 } }), 2_000);
        },

        setTheme: (theme) => set({ theme }),
      }),
      {
        name: "skillquest-ui",
        partialize: (state) => ({ theme: state.theme, sidebarCollapsed: state.sidebarCollapsed }),
      }
    ),
    { name: "ui-store" }
  )
);
