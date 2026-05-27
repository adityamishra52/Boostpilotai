import Card from "./Card";

const StatCard = ({ icon: Icon, label, value, detail, accent = "from-brand-400 to-signal" }) => {
  return (
    <Card className="group overflow-hidden hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">{label}</p>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">{value}</p>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{detail}</p>
        </div>
        <div className={`grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br ${accent} text-white shadow-lg transition group-hover:scale-105`}>
          <Icon size={21} />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
