import {
  ArrowUpRight,
  CreditCard,
  Gauge,
  History,
  Radio,
  Rocket,
  ShieldCheck,
  Sparkles,
  UploadCloud
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import Badge from "../components/Badge";
import Button from "../components/Button";
import Card from "../components/Card";
import { PlatformBarChart, ScoreTrendChart } from "../components/DashboardChart";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import ProgressBar from "../components/ProgressBar";
import SectionContainer from "../components/SectionContainer";
import Skeleton from "../components/Skeleton";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import { analysisService } from "../services/analysisService";
import { formatDate, formatFileSize, platformAccent } from "../utils/formatters";

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        const [statsResponse, historyResponse] = await Promise.all([
          analysisService.stats(),
          analysisService.history()
        ]);

        if (mounted) {
          setStats(statsResponse.stats);
          setHistory(historyResponse.analyses);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load dashboard");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const recent = history.slice(0, 5);
  const lastAnalysis = recent[0];
  const technicalIssues = useMemo(() => {
    return history.reduce((total, item) => {
      return total + (item.aiOutput?.technicalAnalysis?.qualityIssues?.length || 0);
    }, 0);
  }, [history]);

  return (
    <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 10 }}>
      <PageHeader
        action={
          <Button as={Link} icon={Sparkles} to="/analyze" variant="accent">
            Analyze content
          </Button>
        }
        description="Content intelligence, technical quality, and platform readiness in one workspace."
        eyebrow={`Hi ${user?.name?.split(" ")[0] || "there"}`}
        title="Growth command center"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          accent="from-emerald-400 to-brand-500"
          detail={`${user?.plan || "Free"} - ${user?.billingCycle || "monthly"}`}
          icon={CreditCard}
          label="Credits"
          value={loading ? "-" : user?.credits ?? 0}
        />
        <StatCard
          accent="from-brand-500 to-signal"
          detail={loading ? "Loading workspace" : "Saved to history"}
          icon={History}
          label="Analyses"
          value={loading ? "-" : stats?.totalAnalyses ?? 0}
        />
        <StatCard
          accent="from-mint to-brand-500"
          detail="Average creative quality"
          icon={Gauge}
          label="Score"
          value={loading ? "-" : `${stats?.averageScore ?? 0}/100`}
        />
        <StatCard
          accent="from-signal to-coral"
          detail="Most used destination"
          icon={Rocket}
          label="Top platform"
          value={loading ? "-" : stats?.topPlatform || "None"}
        />
        <StatCard
          accent="from-amber-400 to-coral"
          detail="Across saved media"
          icon={ShieldCheck}
          label="Tech issues"
          value={loading ? "-" : technicalIssues}
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_380px]">
        <Card className="overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-[1fr_280px]">
            <div className="p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-2">
                <Badge variant="brand">
                  <Radio size={13} />
                  AI pipeline
                </Badge>
                <Badge variant="success">MongoDB synced</Badge>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                Upload, analyze, export.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Gemini analysis, technical checks, history, and PDF reports are ready for the next creative.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button as={Link} icon={UploadCloud} to="/analyze" variant="accent">
                  Start analysis
                </Button>
                <Button as={Link} icon={ArrowUpRight} to="/history" variant="secondary">
                  Review library
                </Button>
              </div>
            </div>
            <div className="border-t border-zinc-200 bg-zinc-50/80 p-5 dark:border-zinc-800 dark:bg-zinc-950/45 lg:border-l lg:border-t-0">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">Last result</p>
              {loading ? (
                <div className="mt-4 space-y-3">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ) : lastAnalysis ? (
                <>
                  <p className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                    {lastAnalysis.aiOutput.contentScore}/100
                  </p>
                  <ProgressBar className="mt-3" value={lastAnalysis.aiOutput.contentScore} />
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {lastAnalysis.aiOutput.viralCaption}
                  </p>
                </>
              ) : (
                <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">No saved analysis yet.</p>
              )}
            </div>
          </div>
        </Card>

        <SectionContainer icon={Sparkles} title="AI activity">
          <div className="space-y-4">
            {[
              ["Visual analysis", stats?.totalAnalyses ? 100 : 0],
              ["Technical QA", technicalIssues ? 72 : 100],
              ["PDF reporting", 100]
            ].map(([label, value]) => (
              <div key={label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-200">{label}</span>
                  <span className="text-zinc-500 dark:text-zinc-400">{value}%</span>
                </div>
                <ProgressBar value={value} />
              </div>
            ))}
          </div>
        </SectionContainer>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <ScoreTrendChart data={stats?.recentScores || []} />
        <PlatformBarChart data={stats?.platformCounts || []} />
      </div>

      <SectionContainer
        action={
          <Button as={Link} icon={ArrowUpRight} to="/history" variant="secondary">
            View all
          </Button>
        }
        className="mt-5"
        icon={History}
        title="Recent analyses"
      >
        {recent.length === 0 && !loading ? (
          <EmptyState
            description="Upload a media asset and saved results will appear here."
            title="No analysis history yet"
          />
        ) : (
          <div className="space-y-3">
            {loading
              ? [0, 1, 2].map((item) => <Skeleton className="h-20" key={item} />)
              : recent.map((item) => (
                  <Link
                    className="group grid gap-4 rounded-lg border border-zinc-200 bg-white/72 p-4 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft dark:border-zinc-800 dark:bg-zinc-950/55 dark:hover:border-brand-700 md:grid-cols-[1fr_auto] md:items-center"
                    key={item._id}
                    to={`/results/${item._id}`}
                  >
                    <div className="flex min-w-0 gap-4">
                      <div
                        className={`grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${
                          platformAccent[item.platform]
                        } text-sm font-extrabold text-white shadow-lg`}
                      >
                        {item.aiOutput.contentScore}
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate font-bold text-zinc-950 dark:text-white">
                          {item.file.originalName}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                          {item.platform}
                          {item.contentType ? ` ${item.contentType}` : ""} - {formatDate(item.createdAt)} -{" "}
                          {formatFileSize(item.file.size)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="neutral">Open</Badge>
                  </Link>
                ))}
          </div>
        )}
      </SectionContainer>
    </motion.div>
  );
};

export default Dashboard;
