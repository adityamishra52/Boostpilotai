import Card from "./Card";

const StatCard = ({ icon: Icon, label, value, detail, accent = "from-brand-400 to-signal" }) => {
  return (
    <Card className="group overflow-hidden hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-600 dark:text-zinc-300">{label}</p>
          <p className="mt-3 text-2xl font-extrabold tracking-tight text-zinc-950 [overflow-wrap:anywhere] dark:text-white sm:text-3xl">
            {value}
          </p>
          <p className="mt-2 text-sm font-medium leading-5 text-zinc-600 dark:text-zinc-300">{detail}</p>
        </div>
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${accent} text-white shadow-lg transition group-hover:scale-105`}>
          <Icon size={21} />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
