import clsx from "clsx";

const variants = {
  neutral: "!bg-zinc-100 !text-zinc-800 ring-zinc-300 dark:!bg-zinc-800 dark:!text-zinc-100 dark:ring-zinc-700",
  brand: "!bg-brand-100 !text-brand-900 ring-brand-300 dark:!bg-brand-400/20 dark:!text-cyan-50 dark:ring-brand-300/40",
  success: "!bg-emerald-100 !text-emerald-900 ring-emerald-300 dark:!bg-emerald-400/18 dark:!text-emerald-50 dark:ring-emerald-300/35",
  warning: "!bg-amber-100 !text-amber-900 ring-amber-300 dark:!bg-amber-400/18 dark:!text-amber-50 dark:ring-amber-300/35",
  danger: "!bg-red-100 !text-red-900 ring-red-300 dark:!bg-red-400/18 dark:!text-red-50 dark:ring-red-300/35"
};

const Badge = ({ children, className, variant = "neutral" }) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-extrabold ring-1 ring-inset",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
