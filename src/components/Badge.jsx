import clsx from "clsx";

const variants = {
  neutral: "bg-zinc-100 text-zinc-700 ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-800",
  brand: "bg-brand-50 text-brand-700 ring-brand-100 dark:bg-brand-950/40 dark:text-brand-200 dark:ring-brand-900/50",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-900/50",
  warning: "bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-900/50",
  danger: "bg-red-50 text-red-700 ring-red-100 dark:bg-red-950/40 dark:text-red-200 dark:ring-red-900/50"
};

const Badge = ({ children, className, variant = "neutral" }) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold ring-1 ring-inset",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
