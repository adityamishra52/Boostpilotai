import { Bug, HelpCircle, LifeBuoy, Lightbulb, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Button from "./Button";

const links = [
  ["Help Center", "/help", HelpCircle],
  ["Contact Support", "/support", LifeBuoy],
  ["Report Bug", "/feedback", Bug],
  ["Request Feature", "/feedback", Lightbulb]
];

const FloatingHelpWidget = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  if (location.pathname.startsWith("/admin") || location.pathname.startsWith("/login") || location.pathname.startsWith("/register")) {
    return null;
  }

  return (
    <div className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-4 z-40 lg:bottom-5 lg:right-5">
      {open && (
        <div className="mb-3 w-[min(92vw,320px)] rounded-xl border border-zinc-200 bg-white p-3 shadow-2xl backdrop-blur-2xl dark:border-zinc-700 dark:bg-zinc-900">
          <div className="mb-2 flex items-center justify-between gap-3 px-1">
            <div>
              <p className="text-sm font-extrabold text-zinc-950 dark:text-white">Need help?</p>
              <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">Find answers or reach support.</p>
            </div>
            <button
              aria-label="Close help menu"
              className="grid h-9 w-9 place-items-center rounded-lg text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              onClick={() => setOpen(false)}
              type="button"
            >
              <X size={17} />
            </button>
          </div>
          <div className="grid gap-2">
            {links.map(([label, to, Icon]) => (
              <Link
                className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-3 text-sm font-bold text-zinc-900 transition hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:border-brand-400/40 dark:hover:bg-brand-400/10"
                key={label}
                onClick={() => setOpen(false)}
                to={to}
              >
                <Icon size={18} className="text-brand-600 dark:text-brand-200" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
      <Button
        aria-expanded={open}
        aria-label="Open help menu"
        className="h-12 rounded-full px-5 shadow-2xl"
        icon={HelpCircle}
        onClick={() => setOpen((current) => !current)}
        variant="accent"
      >
        Help
      </Button>
    </div>
  );
};

export default FloatingHelpWidget;
