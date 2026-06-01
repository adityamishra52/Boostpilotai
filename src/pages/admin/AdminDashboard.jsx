import { BarChart3, Crown, FileText, Repeat2, ShieldAlert, UploadCloud, Users } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Badge from "../../components/Badge";
import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import SectionContainer from "../../components/SectionContainer";
import Skeleton from "../../components/Skeleton";
import StatCard from "../../components/StatCard";
import { adminService } from "../../services/adminService";
import { formatDate, formatFileSize } from "../../utils/formatters";

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    adminService
      .analytics()
      .then((data) => {
        if (mounted) setAnalytics(data.analytics);
      })
      .catch((error) => toast.error(error.response?.data?.message || "Unable to load admin analytics"))
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <PageHeader
        action={<Badge variant="brand">Admin</Badge>}
        description="Monitor users, usage, uploads, and platform demand."
        eyebrow="Overview"
        title="Admin dashboard"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard accent="from-brand-500 to-signal" detail="Registered accounts" icon={Users} label="Users" value={loading ? "-" : analytics?.totalUsers || 0} />
        <StatCard accent="from-signal to-coral" detail="All saved analyses" icon={FileText} label="Analyses" value={loading ? "-" : analytics?.totalAnalyses || 0} />
        <StatCard accent="from-amber-400 to-coral" detail="Blocked accounts" icon={ShieldAlert} label="Blocked" value={loading ? "-" : analytics?.blockedUsers || 0} />
        <StatCard accent="from-mint to-brand-500" detail="Stored media records" icon={UploadCloud} label="Uploads" value={loading ? "-" : analytics?.uploadedFiles?.length || 0} />
        <StatCard accent="from-brand-400 to-signal" detail="Saved premium actions" icon={Crown} label="Premium" value={loading ? "-" : analytics?.totalPremiumActions || 0} />
        <StatCard accent="from-cyan-400 to-emerald-500" detail="Analyses with repurposed content" icon={Repeat2} label="Repurpose" value={loading ? "-" : analytics?.repurposeUsage || 0} />
        <StatCard accent="from-purple-400 to-cyan-500" detail="AI rewrite studio uses" icon={FileText} label="Rewrite" value={loading ? "-" : analytics?.rewriteUsage || 0} />
        <StatCard accent="from-emerald-400 to-cyan-500" detail="Trend searches" icon={BarChart3} label="Trends" value={loading ? "-" : analytics?.trendFinderUsage || 0} />
        <StatCard accent="from-orange-400 to-pink-500" detail="Coach reports" icon={Users} label="Coach" value={loading ? "-" : analytics?.coachUsage || 0} />
        <StatCard accent="from-zinc-700 to-zinc-950" detail="Saved library items" icon={UploadCloud} label="Library" value={loading ? "-" : analytics?.librarySavedItems || 0} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <SectionContainer icon={BarChart3} title="Platform-wise usage">
          <div className="space-y-3">
            {loading ? (
              <Skeleton className="h-28" />
            ) : (
              (analytics?.platformUsage || []).map((item) => (
                <div
                  className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white/90 px-4 py-3 text-zinc-950 dark:!border-zinc-700 dark:!bg-zinc-900/90 dark:!text-white"
                  key={item.platform}
                >
                  <span className="font-bold text-zinc-950 dark:!text-white">{item.platform}</span>
                  <Badge variant="brand">{item.count}</Badge>
                </div>
              ))
            )}
          </div>
        </SectionContainer>

        <SectionContainer icon={Users} title="Plan distribution">
          <div className="space-y-3">
            {loading ? (
              <Skeleton className="h-28" />
            ) : (
              (analytics?.planUsage || []).map((item) => (
                <div
                  className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white/90 px-4 py-3 text-zinc-950 dark:!border-zinc-700 dark:!bg-zinc-900/90 dark:!text-white"
                  key={item.plan}
                >
                  <span className="font-bold text-zinc-950 dark:!text-white">{item.plan}</span>
                  <Badge variant="neutral">{item.count}</Badge>
                </div>
              ))
            )}
          </div>
        </SectionContainer>

        <SectionContainer icon={Crown} title="Premium action usage">
          <div className="space-y-3">
            {loading ? (
              <Skeleton className="h-28" />
            ) : (
              Object.entries(analytics?.premiumActionUsage || {}).map(([action, count]) => (
                <div
                  className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white/90 px-4 py-3 text-zinc-950 dark:!border-zinc-700 dark:!bg-zinc-900/90 dark:!text-white"
                  key={action}
                >
                  <span className="font-bold text-zinc-950 dark:!text-white">{action}</span>
                  <Badge variant="brand">{count}</Badge>
                </div>
              ))
            )}
          </div>
        </SectionContainer>
      </div>

      <SectionContainer className="mt-5" icon={UploadCloud} title="Recent uploaded files">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.14em] text-zinc-600 dark:text-zinc-300">
              <tr>
                <th className="px-3 py-2">File</th>
                <th className="px-3 py-2">Target</th>
                <th className="px-3 py-2">Size</th>
                <th className="px-3 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {(analytics?.uploadedFiles || []).map((item) => (
                <tr className="border-t border-zinc-200 dark:border-zinc-800" key={item.id}>
                  <td className="px-3 py-3 font-semibold text-zinc-950 dark:text-white">{item.file?.originalName}</td>
                  <td className="px-3 py-3 text-zinc-600 dark:text-zinc-300">
                    {item.platform} {item.contentType}
                  </td>
                  <td className="px-3 py-3 text-zinc-600 dark:text-zinc-300">{formatFileSize(item.file?.size || 0)}</td>
                  <td className="px-3 py-3 text-zinc-600 dark:text-zinc-300">{formatDate(item.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionContainer>
    </div>
  );
};

export default AdminDashboard;
