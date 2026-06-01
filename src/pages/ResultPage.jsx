import { ArrowLeft, Plus } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Button from "../components/Button";
import AIRewriteStudio from "../components/AIRewriteStudio";
import LoadingScreen from "../components/LoadingScreen";
import PageHeader from "../components/PageHeader";
import PremiumActionsPanel from "../components/PremiumActionsPanel";
import RepurposeContentPanel from "../components/RepurposeContentPanel";
import ResultsPanel from "../components/ResultsPanel";
import { analysisService } from "../services/analysisService";

const ResultPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(location.state?.analysis || null);
  const [loading, setLoading] = useState(!location.state?.analysis);

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

  return (
    <motion.div animate={{ opacity: 1, y: 0 }} className="pb-28 md:pb-0" initial={{ opacity: 0, y: 10 }}>
      <PageHeader
        action={
          <Button as={Link} icon={ArrowLeft} to="/history" variant="secondary">
            History
          </Button>
        }
        description="Copy sections, export the full report, and use the score breakdown to tighten your next post."
        eyebrow="Result"
        title="AI analysis report"
      />
      <ResultsPanel analysis={analysis} />
      <AIRewriteStudio analysis={analysis} onAnalysisUpdate={setAnalysis} />
      <RepurposeContentPanel analysis={analysis} onAnalysisUpdate={setAnalysis} />
      <PremiumActionsPanel analysis={analysis} onAnalysisUpdate={setAnalysis} />

      <div className="mt-5 hidden justify-end gap-3 md:flex">
        <Button icon={ArrowLeft} onClick={handleBack} variant="secondary">
          Back
        </Button>
        <Button as={Link} icon={Plus} to="/analyze" variant="accent">
          New analysis
        </Button>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200/80 bg-white/92 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-16px_40px_rgba(15,23,42,0.14)] backdrop-blur-2xl dark:border-zinc-800/80 dark:bg-zinc-950/92 md:hidden">
        <div className="mx-auto flex max-w-[520px] gap-3">
          <Button className="flex-1" icon={ArrowLeft} onClick={handleBack} variant="secondary">
            Back
          </Button>
          <Button as={Link} className="flex-1" icon={Plus} to="/analyze" variant="accent">
            New analysis
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultPage;
