"use client";

import { useEffect } from "react";
import { useUIStore } from "@/stores/useUIStore";

export function ThemeApplier() {
  const theme = useUIStore((s) => s.theme);

  useEffect(() => {
    const html = document.documentElement;
    html.removeAttribute("data-theme");
    if (theme !== "modern") {
      html.setAttribute("data-theme", theme);
    }
  }, [theme]);

  return null;
}
