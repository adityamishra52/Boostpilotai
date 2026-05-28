import { Loader2 } from "lucide-react";
import clsx from "clsx";

const variants = {
  primary:
    "bg-zinc-950 text-white shadow-sm hover:-translate-y-0.5 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200",
  accent:
    "bg-gradient-to-r from-brand-500 via-signal to-coral text-white shadow-glow hover:-translate-y-0.5 hover:shadow-lg",
  secondary:
    "border border-zinc-200 bg-white/82 text-zinc-800 shadow-sm hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/72 dark:text-zinc-100 dark:hover:border-zinc-700 dark:hover:bg-zinc-800",
  ghost:
    "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white",
  danger:
    "border border-red-200 bg-red-50 text-red-700 hover:-translate-y-0.5 hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
};

const Button = ({
  as,
  children,
  className,
  icon: Icon,
  loading = false,
  size = "md",
  variant = "primary",
  type = "button",
  ...props
}) => {
  const Component = as || "button";
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-sm",
    lg: "h-12 px-5 text-base"
  };

  return (
    <Component
      className={clsx(
        "inline-flex max-w-full items-center justify-center gap-2 rounded-lg text-center font-semibold leading-tight transition duration-200 [touch-action:manipulation] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 [&>svg]:shrink-0",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={loading || props.disabled}
      type={Component === "button" ? type : undefined}
      {...props}
    >
      {loading ? <Loader2 size={18} className="animate-spin" /> : Icon ? <Icon size={18} /> : null}
      {children}
    </Component>
  );
};

export default Button;
