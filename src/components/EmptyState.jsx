import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "./Button";
import Card from "./Card";

const EmptyState = ({ title, description, actionLabel = "Analyze content", to = "/analyze" }) => {
  return (
    <Card className="py-12 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-gradient-to-br from-brand-400 to-signal text-white shadow-glow">
        <Sparkles size={24} />
      </div>
      <h2 className="mt-5 text-xl font-extrabold text-zinc-950 dark:text-white">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-zinc-600 dark:text-zinc-300">
        {description}
      </p>
      <Button as={Link} className="mt-6" to={to} variant="accent">
        {actionLabel}
      </Button>
    </Card>
  );
};

export default EmptyState;
