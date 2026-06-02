import clsx from "clsx";

const variants = {
  neutral: "!bg-zinc-100 !text-zinc-900 ring-zinc-300 dark:!bg-zinc-800 dark:!text-zinc-50 dark:ring-zinc-700",
  brand: "!bg-cyan-100 !text-cyan-950 ring-cyan-300 dark:!bg-cyan-950/80 dark:!text-cyan-50 dark:ring-cyan-400/45",
  success: "!bg-emerald-100 !text-emerald-950 ring-emerald-300 dark:!bg-emerald-950/85 dark:!text-emerald-50 dark:ring-emerald-400/45",
  warning: "!bg-amber-100 !text-amber-950 ring-amber-300 dark:!bg-amber-950/85 dark:!text-amber-50 dark:ring-amber-400/45",
  danger: "!bg-red-100 !text-red-950 ring-red-300 dark:!bg-red-950/85 dark:!text-red-50 dark:ring-red-400/45"
};

const Badge = ({ children, className, variant = "neutral" }) => {
  return (
    <span
      className={clsx(
        "inline-flex max-w-full items-center gap-1 rounded-md px-2.5 py-1 text-left text-xs font-extrabold leading-tight ring-1 ring-inset [overflow-wrap:anywhere]",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
