import { Moon, Sun } from "lucide-react";
import clsx from "clsx";

import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      aria-label="Toggle theme"
      className="group inline-flex h-12 min-w-12 items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 sm:h-10 sm:min-w-0"
      onClick={toggleTheme}
      type="button"
    >
      <span
        className={clsx(
          "grid h-6 w-6 place-items-center rounded-md transition",
          isDark ? "bg-amber-300 text-zinc-950" : "bg-zinc-100 text-zinc-800"
        )}
      >
        {isDark ? <Sun size={15} /> : <Moon size={15} />}
      </span>
      <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
};

export default ThemeToggle;
