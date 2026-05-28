import Card from "./Card";

const SectionContainer = ({ title, description, icon: Icon, action, children, className = "" }) => {
  return (
    <Card className={className}>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          {Icon && (
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-800 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
              <Icon size={18} />
            </div>
          )}
          <div className="min-w-0">
            <h2 className="text-base font-extrabold tracking-tight text-zinc-950 [overflow-wrap:anywhere] dark:text-white">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{description}</p>
            )}
          </div>
        </div>
        {action && <div className="flex w-full shrink-0 sm:w-auto">{action}</div>}
      </div>
      {children}
    </Card>
  );
};

export default SectionContainer;
