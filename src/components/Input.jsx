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
          "flex h-12 items-center gap-3 rounded-lg border border-zinc-300 bg-white px-4 shadow-sm transition focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-300/35 dark:border-zinc-700 dark:bg-zinc-900 dark:focus-within:border-brand-400 dark:focus-within:ring-brand-400/25",
          error && "border-red-400 focus-within:border-red-500 focus-within:ring-red-200 dark:border-red-600 dark:focus-within:ring-red-500/25",
          className
        )}
      >
        {Icon && <Icon size={18} className="text-zinc-500 dark:text-zinc-300" />}
        <input
          className="w-full bg-transparent text-sm text-zinc-950 outline-none placeholder:text-zinc-500 dark:text-white dark:placeholder:text-zinc-400"
          {...props}
        />
      </div>
      {error && <span className="mt-2 block text-xs font-medium text-red-500">{error}</span>}
    </label>
  );
};

export default Input;
