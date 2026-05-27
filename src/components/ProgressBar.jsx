import clsx from "clsx";

const ProgressBar = ({ value = 0, className, tone = "brand" }) => {
  const clamped = Math.max(0, Math.min(100, Number(value) || 0));
  const tones = {
    brand: "from-brand-400 via-signal to-coral",
    success: "from-emerald-400 to-brand-400",
    warning: "from-amber-400 to-coral",
    danger: "from-red-500 to-coral"
  };

  return (
    <div className={clsx("h-2 overflow-hidden rounded-full bg-zinc-200/80 dark:bg-zinc-800", className)}>
      <div
        className={clsx("h-full rounded-full bg-gradient-to-r transition-all duration-700", tones[tone])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
};

export default ProgressBar;
