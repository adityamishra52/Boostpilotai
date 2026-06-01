import { Search, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Badge from "../components/Badge";
import Button from "../components/Button";
import Card from "../components/Card";
import LockedFeature from "../components/LockedFeature";
import PageHeader from "../components/PageHeader";
import SectionContainer from "../components/SectionContainer";
import { useAuth } from "../context/AuthContext";
import { trendService } from "../services/trendService";
import { hasPlan } from "../utils/plans";

const TrendFinder = () => {
  const { user } = useAuth();
  const canUse = user?.role === "admin" || hasPlan(user, "pro");
  const [form, setForm] = useState({ platform: "YouTube", niche: "", region: "" });
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (canUse) trendService.history().then((data) => setHistory(data.trends || [])).catch(() => {});
  }, [canUse]);

  const submit = async () => {
    setLoading(true);
    try {
      const data = await trendService.find(form);
      setResult(data.trend.result);
      setHistory((current) => [data.trend, ...current]);
      toast.success("Trend suggestions ready");
    } catch (error) {
      toast.error(error.response?.data?.message || "Trend finder failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader eyebrow="Growth" title="Trend Finder" description="AI trend suggestions by platform, niche, and region." />
      {!canUse ? (
        <LockedFeature title="Trend Finder" requiredPlan="Pro" />
      ) : (
        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <div className="grid gap-3">
              <select className="h-11 rounded-lg border border-zinc-300 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-950" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}>
                {["YouTube", "Instagram", "Facebook", "LinkedIn", "X"].map((item) => <option key={item}>{item}</option>)}
              </select>
              <input className="h-11 rounded-lg border border-zinc-300 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-950" placeholder="Niche or category" value={form.niche} onChange={(e) => setForm({ ...form, niche: e.target.value })} />
              <input className="h-11 rounded-lg border border-zinc-300 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-950" placeholder="Country/region optional" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
              <Button icon={Search} loading={loading} onClick={submit} variant="accent">Find trends</Button>
            </div>
          </Card>

          <SectionContainer icon={TrendingUp} title="AI trend suggestions">
            {result ? (
              <div className="space-y-4">
                <Badge variant="warning">{result.sourceLabel}</Badge>
                <h2 className="text-3xl font-extrabold">{result.opportunityScore}/100 opportunity</h2>
                {["trendingTopics", "trendingKeywords", "trendingHashtags", "trendingHooks", "contentIdeas"].map((key) => (
                  <div key={key}>
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">{key.replace(/([A-Z])/g, " $1")}</p>
                    <div className="grid gap-2">
                      {(result[key] || []).map((item) => <div className="rounded-lg border border-zinc-200 bg-white/90 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-900" key={item}>{item}</div>)}
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-zinc-600 dark:text-zinc-300">Run a search to generate suggestions.</p>}
          </SectionContainer>
        </div>
      )}
      {canUse && history.length > 0 && <SectionContainer className="mt-5" title="Recent trend searches">{history.slice(0, 5).map((item) => <div className="rounded-lg border border-zinc-200 bg-white/90 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-900" key={item._id}>{item.platform} - {item.niche}</div>)}</SectionContainer>}
    </div>
  );
};

export default TrendFinder;
