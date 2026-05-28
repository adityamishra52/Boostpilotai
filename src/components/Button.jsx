import { Loader2 } from "lucide-react";
import clsx from "clsx";

const variants = {
  primary:
    "bg-zinc-950 text-white shadow-sm hover:-translate-y-0.5 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200",
  accent:
    "bg-gradient-to-r from-brand-500 via-signal to-coral text-white shadow-glow hover:-translate-y-0.5 hover:shadow-lg",
  secondary:
    "border border-zinc-300 bg-white text-zinc-900 shadow-sm hover:-translate-y-0.5 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-500 dark:hover:bg-zinc-800",
  ghost:
    "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white",
  danger:
    "border border-red-300 bg-red-50 text-red-800 hover:-translate-y-0.5 hover:bg-red-100 dark:border-red-700 dark:bg-red-950/70 dark:text-red-100 dark:hover:bg-red-900/70"
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
        "inline-flex max-w-full items-center justify-center gap-2 rounded-lg text-center font-semibold leading-tight transition duration-200 [touch-action:manipulation] active:translate-y-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300/45 dark:focus-visible:ring-brand-400/35 disabled:cursor-not-allowed disabled:opacity-60 [&>svg]:shrink-0",
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
