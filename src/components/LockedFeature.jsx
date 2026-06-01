import { Lock } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "./Button";
import Card from "./Card";

const LockedFeature = ({ title, requiredPlan = "Pro", description }) => (
  <Card>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-zinc-950 text-white dark:bg-brand-400/20">
          <Lock size={20} />
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-zinc-950 dark:text-white">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            {description || `This feature requires ${requiredPlan} plan.`}
          </p>
        </div>
      </div>
      <Button as={Link} to="/pricing" variant="accent">
        Upgrade
      </Button>
    </div>
  </Card>
);

export default LockedFeature;
