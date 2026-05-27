import { Moon, Sun } from "lucide-react";
import clsx from "clsx";

import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      aria-label="Toggle theme"
      className="group inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-200 bg-white/82 px-3 text-sm font-bold text-zinc-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/72 dark:text-zinc-200 dark:hover:bg-zinc-800"
      onClick={toggleTheme}
      type="button"
    >
      <span
        className={clsx(
          "grid h-6 w-6 place-items-center rounded-md transition",
          isDark ? "bg-zinc-800 text-amber-200" : "bg-zinc-100 text-zinc-700"
        )}
      >
        {isDark ? <Sun size={15} /> : <Moon size={15} />}
      </span>
      <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
};

export default ThemeToggle;
