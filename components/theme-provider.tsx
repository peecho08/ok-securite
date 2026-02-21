"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getAcqColors, setAcqColors as saveAcqColors } from "@/lib/storage";

type Theme = "light" | "dark";
type ThemeCtx = { theme: Theme; toggle: () => void; acqColors: boolean; toggleAcq: () => void };

const ThemeContext = createContext<ThemeCtx>({ theme: "light", toggle: () => {}, acqColors: false, toggleAcq: () => {} });
export const useTheme = () => useContext(ThemeContext);

const STORAGE_KEY = "okchantier_theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [acqColors, setAcqColors] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored === "dark" || stored === "light") {
        setTheme(stored);
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTheme("dark");
      }
    } catch { /* noop */ }
    setAcqColors(getAcqColors());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    try { localStorage.setItem(STORAGE_KEY, theme); } catch { /* noop */ }
  }, [theme, ready]);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.classList.toggle("acq-colors", acqColors);
    saveAcqColors(acqColors);
  }, [acqColors, ready]);

  const toggle = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const toggleAcq = useCallback(() => {
    setAcqColors((prev) => !prev);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle, acqColors, toggleAcq }}>
      {children}
    </ThemeContext.Provider>
  );
}
