"use client";

import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", cb);
      return () => media.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 1023px)");
}

export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}
