import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import clsx from "clsx";

const platforms = [
  { name: "YouTube", icon: Youtube, accent: "from-red-500 to-coral" },
  { name: "Instagram", icon: Instagram, accent: "from-fuchsia-500 to-coral" },
  { name: "Facebook", icon: Facebook, accent: "from-blue-500 to-brand-500" },
  { name: "LinkedIn", icon: Linkedin, accent: "from-sky-500 to-blue-700" }
];

const PlatformSelector = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,148px),1fr))] gap-3">
      {platforms.map((platform) => {
        const Icon = platform.icon;
        const active = value === platform.name;

        return (
          <button
            className={clsx(
              "group flex min-h-32 min-w-0 flex-col items-start justify-between gap-4 rounded-lg border p-4 text-left transition duration-200",
              active
                ? "border-transparent bg-zinc-950 text-white shadow-glow dark:bg-white dark:text-zinc-950"
                : "border-zinc-200 bg-white/72 text-zinc-700 hover:-translate-y-0.5 hover:border-brand-300 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-200"
            )}
            key={platform.name}
            onClick={() => onChange(platform.name)}
            type="button"
          >
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${platform.accent} text-white shadow-lg`}>
              <Icon size={21} />
            </span>
            <span className="min-w-0">
              <span className="block break-words text-base font-bold leading-tight">{platform.name}</span>
              <span className={clsx("text-xs", active ? "opacity-70" : "text-zinc-500")}>
                Channel rules
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default PlatformSelector;
