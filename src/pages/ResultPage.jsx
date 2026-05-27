import { ArrowLeft } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Button from "../components/Button";
import LoadingScreen from "../components/LoadingScreen";
import PageHeader from "../components/PageHeader";
import ResultsPanel from "../components/ResultsPanel";
import { analysisService } from "../services/analysisService";

const ResultPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [analysis, setAnalysis] = useState(location.state?.analysis || null);
  const [loading, setLoading] = useState(!location.state?.analysis);

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
    <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 10 }}>
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
    </motion.div>
  );
};

export default ResultPage;
