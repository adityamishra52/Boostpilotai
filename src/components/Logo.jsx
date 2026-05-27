import { Sparkles } from "lucide-react";
import clsx from "clsx";

const Logo = ({ compact = false, inverse = false }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-brand-400 via-signal to-coral text-white shadow-glow">
        <Sparkles size={20} />
      </div>
      {!compact && (
        <div>
          <p className={clsx("text-sm font-extrabold tracking-tight", inverse ? "text-white" : "text-zinc-950 dark:text-white")}>
            BoostPilot AI
          </p>
          <p className={clsx("text-[11px] font-semibold uppercase tracking-[0.16em]", inverse ? "text-zinc-400" : "text-zinc-500 dark:text-zinc-400")}>
            Signal studio
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo;
