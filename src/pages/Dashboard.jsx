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
import { planLabel } from "../utils/plans";

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
          setStats(statsResponse.stats || {});
          setHistory(historyResponse.analyses || []);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load dashboard");
      } finally {
        if (mounted) setLoading(false);
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
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="min-w-0 space-y-5 overflow-x-hidden"
      initial={{ opacity: 0, y: 10 }}
    >
      <PageHeader
        action={
          <Button as={Link} className="w-full sm:w-auto" icon={Sparkles} to="/analyze" variant="accent">
            Create report
          </Button>
        }
        description="See your plan, credits, recent reports, and what to improve next."
        eyebrow={`Hi ${user?.name?.split(" ")[0] || "there"}`}
        title="Your home"
      />

      <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        <StatCard
          accent="from-emerald-400 to-brand-500"
          detail={`${planLabel(user?.plan)} - ${user?.billingCycle || "monthly"}`}
          icon={CreditCard}
          label="Credits"
          value={loading ? "-" : user?.credits ?? 0}
        />
        <StatCard
          accent="from-brand-500 to-signal"
          detail={loading ? "Loading" : "Saved reports"}
          icon={History}
          label="Reports"
          value={loading ? "-" : stats?.totalAnalyses ?? 0}
        />
        <StatCard
          accent="from-mint to-brand-500"
          detail="Average result"
          icon={Gauge}
          label="Score"
          value={loading ? "-" : `${stats?.averageScore ?? 0}/100`}
        />
        <StatCard
          accent="from-signal to-coral"
          detail="Most used site"
          icon={Rocket}
          label="Top site"
          value={loading ? "-" : stats?.topPlatform || "None"}
        />
        <StatCard
          accent="from-amber-400 to-coral"
          detail="Items to fix"
          icon={ShieldCheck}
          label="Fixes needed"
          value={loading ? "-" : technicalIssues}
        />
      </div>

      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,380px)]">
        <Card className="min-w-0 overflow-hidden p-0">
          <div className="grid min-w-0 gap-0 xl:grid-cols-[minmax(0,1fr)_280px]">
            <div className="min-w-0 p-5 sm:p-6">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <Badge variant="brand">
                  <Radio size={13} />
                  How it works
                </Badge>
                <Badge variant="success">Saved safely</Badge>
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
                Upload, improve, download.
              </h2>

              <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-zinc-700 dark:text-zinc-300">
                Add an image or video and get captions, opening lines, fixes, and a downloadable report.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button as={Link} className="w-full sm:w-auto" icon={UploadCloud} to="/analyze" variant="accent">
                  Start report
                </Button>
                <Button as={Link} className="w-full sm:w-auto" icon={ArrowUpRight} to="/history" variant="secondary">
                  See saved work
                </Button>
              </div>
            </div>

            <div className="min-w-0 border-t border-zinc-200 bg-zinc-50/95 p-5 dark:border-zinc-800 dark:bg-zinc-900/70 xl:border-l xl:border-t-0">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-600 dark:text-zinc-300">
                Last result
              </p>

              {loading ? (
                <div className="mt-4 space-y-3">
                  <Skeleton className="h-6 w-40 max-w-full" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ) : lastAnalysis ? (
                <>
                  <p className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                    {lastAnalysis.aiOutput?.contentScore ?? 0}/100
                  </p>
                  <ProgressBar className="mt-3" value={lastAnalysis.aiOutput?.contentScore ?? 0} />
                  <p className="mt-3 line-clamp-3 text-sm font-medium leading-6 text-zinc-700 dark:text-zinc-300">
                    {lastAnalysis.aiOutput?.viralCaption || "No caption available."}
                  </p>
                </>
              ) : (
                <p className="mt-3 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                  No saved report yet.
                </p>
              )}
            </div>
          </div>
        </Card>

        <SectionContainer icon={Sparkles} title="Report progress">
          <div className="space-y-4">
            {[
              ["Media review", stats?.totalAnalyses ? 100 : 0],
              ["Fix suggestions", technicalIssues ? 72 : 100],
              ["Report download", 100]
            ].map(([label, value]) => (
              <div className="min-w-0" key={label}>
                <div className="mb-2 flex min-w-0 items-center justify-between gap-3 text-sm">
                  <span className="truncate font-semibold text-zinc-700 dark:text-zinc-200">
                    {label}
                  </span>
                  <span className="shrink-0 font-medium text-zinc-600 dark:text-zinc-300">{value}%</span>
                </div>
                <ProgressBar value={value} />
              </div>
            ))}
          </div>
        </SectionContainer>
      </div>

      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="min-w-0">
          <ScoreTrendChart data={stats?.recentScores || []} />
        </div>
        <div className="min-w-0">
          <PlatformBarChart data={stats?.platformCounts || []} />
        </div>
      </div>

      <SectionContainer
        action={
          <Button as={Link} className="w-full sm:w-auto" icon={ArrowUpRight} to="/history" variant="secondary">
            View all
          </Button>
        }
        className="mt-5 min-w-0"
        icon={History}
        title="Recent reports"
      >
        {recent.length === 0 && !loading ? (
          <EmptyState
            description="Upload an image or video and your reports will appear here."
            title="No reports yet"
          />
        ) : (
          <div className="min-w-0 space-y-3">
            {loading
              ? [0, 1, 2].map((item) => <Skeleton className="h-20" key={item} />)
              : recent.map((item) => (
                  <Link
                    className="group grid min-w-0 gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-zinc-950 transition hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50/70 hover:shadow-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300/35 dark:!border-zinc-700 dark:!bg-zinc-900 dark:!text-white dark:hover:!border-brand-400/70 dark:hover:!bg-zinc-800/80 dark:focus-visible:ring-brand-400/25 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                    key={item._id}
                    to={`/results/${item._id}`}
                  >
                    <div className="flex min-w-0 gap-4">
                      <div
                        className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${
                          platformAccent[item.platform] || "from-zinc-500 to-zinc-800"
                        } text-sm font-extrabold text-white shadow-lg`}
                      >
                        {item.aiOutput?.contentScore ?? 0}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-extrabold text-zinc-950 dark:!text-white">
                          {item.file?.originalName || "Untitled media"}
                        </h3>

                        <p className="mt-1 truncate text-sm font-semibold text-zinc-700 dark:!text-zinc-200">
                          {item.platform}
                          {item.contentType ? ` ${item.contentType}` : ""} - {formatDate(item.createdAt)} -{" "}
                          {formatFileSize(item.file?.size || 0)}
                        </p>
                      </div>
                    </div>

                    <Badge className="w-fit md:justify-self-end" variant="neutral">
                      Open
                    </Badge>
                  </Link>
                ))}
          </div>
        )}
      </SectionContainer>
    </motion.div>
  );
};

export default Dashboard;
