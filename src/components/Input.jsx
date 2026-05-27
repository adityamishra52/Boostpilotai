import clsx from "clsx";

const Input = ({ label, error, icon: Icon, className, ...props }) => {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
          {label}
        </span>
      )}
      <div
        className={clsx(
          "flex h-12 items-center gap-3 rounded-lg border border-zinc-200 bg-white/86 px-4 shadow-sm transition focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-100 dark:border-zinc-800 dark:bg-zinc-950/72 dark:focus-within:ring-brand-900/30",
          error && "border-red-300 focus-within:border-red-400 focus-within:ring-red-100",
          className
        )}
      >
        {Icon && <Icon size={18} className="text-zinc-400" />}
        <input
          className="w-full bg-transparent text-sm text-zinc-950 outline-none placeholder:text-zinc-400 dark:text-white"
          {...props}
        />
      </div>
      {error && <span className="mt-2 block text-xs font-medium text-red-500">{error}</span>}
    </label>
  );
};

export default Input;
