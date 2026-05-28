import { Menu, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "./Button";
import ThemeToggle from "./ThemeToggle";

const Topbar = ({ onMenu }) => {
  return (
    <header className="z-20 shrink-0 border-b border-zinc-200/80 bg-white/82 backdrop-blur-2xl dark:border-zinc-800/80 dark:bg-zinc-950/82">
      <div className="mx-auto flex min-h-16 w-full max-w-[1440px] items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-5 lg:px-8">
        <Button
          aria-label="Open navigation"
          className="h-12 w-12 shrink-0 rounded-xl border-zinc-300 bg-white px-0 text-zinc-950 shadow-[0_12px_34px_rgba(15,23,42,0.18)] ring-1 ring-zinc-950/5 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:ring-white/10 [&>svg]:h-6 [&>svg]:w-6"
          icon={Menu}
          onClick={onMenu}
          variant="secondary"
        />

        <div className="hidden min-w-0 flex-1 items-center gap-3 rounded-xl border border-zinc-200 bg-white/85 px-3 py-2.5 text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/75 md:flex lg:max-w-xl">
          <Search className="shrink-0" size={18} />
          <span className="truncate text-sm">
            Search analyses, platforms, hooks
          </span>
        </div>

        <div className="ml-auto flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <Button
            as={Link}
            className="min-w-0 shrink-0 px-3 sm:px-4"
            icon={Plus}
            to="/analyze"
            variant="accent"
          >
            <span className="hidden sm:inline">New analysis</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>

      <div className="border-t border-zinc-200/70 px-3 py-2 dark:border-zinc-800/70 md:hidden">
        <div className="flex min-w-0 items-center gap-2 rounded-xl border border-zinc-200 bg-white/85 px-3 py-2 text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/75">
          <Search className="shrink-0" size={16} />
          <span className="truncate text-xs">
            Search analyses, platforms, hooks
          </span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
