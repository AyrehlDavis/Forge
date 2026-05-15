"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "v2-theme";

export function ModeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored =
      typeof window === "undefined"
        ? null
        : (localStorage.getItem(STORAGE_KEY) as Theme | null);
    const initial: Theme = stored === "light" || stored === "dark" ? stored : "dark";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className="h-9 w-9 rounded-full border border-[var(--v2-border-default)]"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="group relative h-9 w-9 rounded-full border border-[var(--v2-border-default)] bg-[var(--v2-surface-primary)] text-[var(--v2-text-secondary)] transition-colors duration-200 hover:border-[var(--v2-accent)] hover:text-[var(--v2-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--v2-background)]"
    >
      <span aria-hidden className="block text-base leading-none">
        {theme === "dark" ? "☀" : "☾"}
      </span>
    </button>
  );
}
