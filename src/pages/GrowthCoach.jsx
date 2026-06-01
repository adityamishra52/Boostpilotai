import { Brain, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Button from "../components/Button";
import LockedFeature from "../components/LockedFeature";
import PageHeader from "../components/PageHeader";
import SectionContainer from "../components/SectionContainer";
import { useAuth } from "../context/AuthContext";
import { coachService } from "../services/coachService";
import { hasPlan } from "../utils/plans";

const List = ({ items = [] }) => <div className="grid gap-2">{items.map((item) => <div className="rounded-lg border border-zinc-200 bg-white/90 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-900" key={item}>{item}</div>)}</div>;

const GrowthCoach = () => {
  const { user } = useAuth();
  const canUse = user?.role === "admin" || hasPlan(user, "pro");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (canUse) coachService.summary().then((data) => setReport(data.report)).catch(() => {});
  }, [canUse]);

  const generate = async () => {
    setLoading(true);
    try {
      const data = await coachService.generate();
      setReport(data.report);
      toast.success("Growth coach updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Coach failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader action={canUse && <Button icon={RefreshCw} loading={loading} onClick={generate} variant="accent">Generate</Button>} eyebrow="Coach" title="Growth Coach" description="Personalized growth guidance from your analysis history." />
      {!canUse ? <LockedFeature title="Growth Coach" requiredPlan="Pro" /> : report ? (
        <div className="grid gap-5 xl:grid-cols-2">
          <SectionContainer icon={Brain} title={`Growth score: ${report.growthScore}/100`}>
            <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">{report.platformStrategy}</p>
            <p className="mt-3 font-bold">{report.recommendedPostingFrequency}</p>
          </SectionContainer>
          <SectionContainer title="Doing well"><List items={report.doingWell} /></SectionContainer>
          <SectionContainer title="Hurting growth"><List items={report.hurtingGrowth} /></SectionContainer>
          <SectionContainer title="Weekly goals"><List items={report.weeklyGoals} /></SectionContainer>
          <SectionContainer title="Monthly goals"><List items={report.monthlyGoals} /></SectionContainer>
          <SectionContainer title="Content strategy"><List items={[...(report.bestContentTypes || []), report.hookQualityAdvice, report.ctaQualityAdvice]} /></SectionContainer>
        </div>
      ) : (
        <SectionContainer title="No coach report yet"><Button icon={RefreshCw} loading={loading} onClick={generate} variant="accent">Generate coach report</Button></SectionContainer>
      )}
    </div>
  );
};

export default GrowthCoach;
