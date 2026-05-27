import { Menu, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "./Button";
import ThemeToggle from "./ThemeToggle";

const Topbar = ({ onMenu }) => {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-white/62 backdrop-blur-2xl dark:border-zinc-800/80 dark:bg-zinc-950/62">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Button
          aria-label="Open navigation"
          className="h-10 w-10 px-0 lg:hidden"
          icon={Menu}
          onClick={onMenu}
          variant="secondary"
        />
        <div className="hidden h-10 flex-1 max-w-xl items-center gap-3 rounded-lg border border-zinc-200 bg-white/80 px-3 text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/72 md:flex">
          <Search size={18} />
          <span className="text-sm">Search analyses, platforms, hooks</span>
        </div>
        <div className="ml-auto flex min-w-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Button as={Link} className="shrink-0 px-3 sm:px-4" icon={Plus} to="/analyze" variant="accent">
            <span className="hidden sm:inline">New analysis</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
