import { ArrowLeft, BarChart3, Copy, Download, Hash, MessageCircle, Plus, Sparkles, Tags, WandSparkles } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Badge from "../components/Badge";
import Button from "../components/Button";
import AIRewriteStudio from "../components/AIRewriteStudio";
import LoadingScreen from "../components/LoadingScreen";
import PageHeader from "../components/PageHeader";
import PremiumActionsPanel from "../components/PremiumActionsPanel";
import RepurposeContentPanel from "../components/RepurposeContentPanel";
import ResultsPanel from "../components/ResultsPanel";
import SectionContainer from "../components/SectionContainer";
import CopyButton from "../components/CopyButton";
import { analysisService } from "../services/analysisService";
import { buildAnalysisReport } from "../utils/analysisReportBuilder";
import { downloadBlob } from "../utils/download";

const listValue = (items) => (Array.isArray(items) ? items.filter(Boolean) : []);

const ListPanel = ({ items, numbered = false }) => {
  const values = listValue(items);

  if (!values.length) {
    return <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">No items available.</p>;
  }

  return (
    <div className="grid gap-3">
      {values.map((item, index) => (
        <div
          className="flex gap-3 rounded-lg border border-zinc-200 bg-white/88 p-4 text-sm leading-6 text-zinc-800 shadow-sm dark:!border-zinc-700 dark:!bg-zinc-900/90 dark:!text-zinc-100"
          key={`${item}-${index}`}
        >
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-zinc-950 text-xs font-bold text-white dark:bg-brand-400/20">
            {numbered ? index + 1 : "*"}
          </span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
};

const ResultPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(location.state?.analysis || null);
  const [loading, setLoading] = useState(!location.state?.analysis);
  const [activeTab, setActiveTab] = useState("overview");
  const [downloading, setDownloading] = useState(false);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/history");
  };

  useEffect(() => {
    let mounted = true;

    if (analysis?._id === id) {
      setLoading(false);
      return undefined;
    }

    const loadResult = async () => {
      try {
        const data = await analysisService.get(id);
        if (mounted) {
          setAnalysis(data.analysis);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load result");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadResult();

    return () => {
      mounted = false;
    };
  }, [analysis?._id, id]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!analysis) {
    return (
      <SectionContainer title="Result unavailable">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">This analysis could not be loaded.</p>
        <Button className="mt-4" icon={ArrowLeft} onClick={handleBack} variant="secondary">
          Back to history
        </Button>
      </SectionContainer>
    );
  }

  const output = analysis?.aiOutput || {};
  const tabs = [
    { id: "overview", label: "Summary", icon: BarChart3 },
    { id: "captions", label: "Captions", icon: MessageCircle },
    { id: "hooks", label: "Openings", icon: Sparkles },
    { id: "hashtags", label: "Hashtags", icon: Hash },
    { id: "rewrite", label: "Rewrite", icon: WandSparkles },
    { id: "enhancer", label: "Improve Media", icon: Sparkles },
    { id: "thumbnails", label: "Thumbnails", icon: Tags },
    { id: "coach", label: "Tips", icon: BarChart3 },
    { id: "export", label: "Download", icon: Download }
  ];
  const reportText = buildAnalysisReport(analysis);
  const captions = listValue([
    output.viralCaption,
    output.improvedPostVersion,
    output.shortTweet,
    output.viralTweet
  ]);
  const ctas = listValue(output.cta || output.ctaSuggestions);
  const handleDownload = async () => {
    setDownloading(true);

    try {
      const response = await analysisService.downloadReport(analysis._id);
      downloadBlob(response, "boostpilot-report.pdf");
    } catch (error) {
      toast.error(error.response?.data?.message || "Report download failed");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <motion.div animate={{ opacity: 1, y: 0 }} className="pb-28 md:pb-0" initial={{ opacity: 0, y: 10 }}>
      <PageHeader
        action={
          <Button as={Link} icon={ArrowLeft} to="/history" variant="secondary">
            History
          </Button>
        }
        description="Copy what you need, improve the media, and download your report."
        eyebrow="Result"
        title="Your report"
      />

      <div className="mb-5 rounded-lg border border-zinc-200 bg-white/90 p-2 shadow-sm backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/88">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,136px),1fr))] gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;

            return (
              <button
                className={`inline-flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-lg px-3 py-2 text-center text-sm font-bold leading-tight transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300/35 ${
                  active
                    ? "bg-zinc-950 text-white shadow-soft dark:bg-brand-400/20"
                    : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
                }`}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                <Icon size={16} />
                <span className="min-w-0 whitespace-normal break-words">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === "overview" && <ResultsPanel analysis={analysis} />}

      {activeTab === "captions" && (
        <div className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
          <SectionContainer action={<CopyButton text={captions.join("\n\n")} />} icon={MessageCircle} title="Captions">
            <ListPanel items={captions} />
          </SectionContainer>
          <SectionContainer action={<CopyButton text={ctas.join("\n")} />} icon={Copy} title="Next steps">
            <ListPanel items={ctas} />
          </SectionContainer>
        </div>
      )}

      {activeTab === "hooks" && (
        <SectionContainer action={<CopyButton text={listValue(output.hookLines).join("\n")} />} icon={Sparkles} title="Opening lines">
          <ListPanel items={output.hookLines} numbered />
        </SectionContainer>
      )}

      {activeTab === "hashtags" && (
        <SectionContainer action={<CopyButton text={listValue(output.hashtags).join(" ")} />} icon={Hash} title="Hashtags">
          <div className="flex flex-wrap gap-2">
            {listValue(output.hashtags).map((tag) => <Badge key={tag} variant="brand">{tag}</Badge>)}
          </div>
        </SectionContainer>
      )}

      {activeTab === "rewrite" && (
        <>
          <AIRewriteStudio analysis={analysis} onAnalysisUpdate={setAnalysis} />
          <RepurposeContentPanel analysis={analysis} onAnalysisUpdate={setAnalysis} />
        </>
      )}

      {activeTab === "enhancer" && <PremiumActionsPanel analysis={analysis} focus="media" onAnalysisUpdate={setAnalysis} />}

      {activeTab === "thumbnails" && <PremiumActionsPanel analysis={analysis} focus="thumbnails" onAnalysisUpdate={setAnalysis} />}

      {activeTab === "coach" && (
        <SectionContainer icon={BarChart3} title="Tips to improve">
          <ListPanel
            items={[
              ...(output.engagementAnalysis?.strengths || []),
              ...(output.engagementAnalysis?.weaknesses || []),
              ...(output.platformSpecificSuggestions || [])
            ]}
          />
        </SectionContainer>
      )}

      {activeTab === "export" && (
        <SectionContainer icon={Download} title="Download">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
            <pre className="max-h-[56vh] overflow-auto rounded-lg border border-zinc-200 bg-white/90 p-4 text-sm leading-6 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-100">
              {reportText}
            </pre>
            <div className="grid gap-3">
              <CopyButton label="Copy report" text={reportText} />
              <Button icon={Download} loading={downloading} onClick={handleDownload} variant="accent">
                Download PDF
              </Button>
            </div>
          </div>
        </SectionContainer>
      )}

      <div className="mt-5 hidden justify-end gap-3 md:flex">
        <Button icon={ArrowLeft} onClick={handleBack} variant="secondary">
          Back
        </Button>
        <Button as={Link} icon={Plus} to="/analyze" variant="accent">
          New report
        </Button>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200/80 bg-white/92 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-16px_40px_rgba(15,23,42,0.14)] backdrop-blur-2xl dark:border-zinc-800/80 dark:bg-zinc-950/92 md:hidden">
        <div className="mx-auto flex max-w-[520px] gap-3">
          <Button className="flex-1" icon={ArrowLeft} onClick={handleBack} variant="secondary">
            Back
          </Button>
          <Button as={Link} className="flex-1" icon={Plus} to="/analyze" variant="accent">
            New report
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultPage;
