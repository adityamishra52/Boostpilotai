const PageHeader = ({ eyebrow, title, description, action }) => {
  return (
    <div className="mb-5 flex min-w-0 flex-col gap-4 sm:mb-6 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">
            {eyebrow}
          </p>
        )}
        <h1 className="text-balance text-2xl font-extrabold tracking-tight text-zinc-950 [overflow-wrap:anywhere] dark:text-white md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-zinc-700 dark:text-zinc-300">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex w-full shrink-0 sm:w-auto">{action}</div>}
    </div>
  );
};

export default PageHeader;
