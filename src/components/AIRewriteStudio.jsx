import { RefreshCw } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import { analysisService } from "../services/analysisService";
import { hasPlan } from "../utils/plans";
import Badge from "./Badge";
import Button from "./Button";
import CopyButton from "./CopyButton";
import LockedFeature from "./LockedFeature";
import SaveToLibraryButton from "./SaveToLibraryButton";
import SectionContainer from "./SectionContainer";

const modes = [
  ["viral", "More Viral"],
  ["professional", "More Professional"],
  ["emotional", "More Emotional"],
  ["educational", "More Educational"],
  ["sales", "More Sales Focused"],
  ["storytelling", "More Storytelling"],
  ["human", "More Human"],
  ["shorter", "Shorter Version"],
  ["longer", "Longer Version"]
];

const AIRewriteStudio = ({ analysis, onAnalysisUpdate }) => {
  const { user } = useAuth();
  const [mode, setMode] = useState(analysis?.aiRewriteStudio?.latestMode || "viral");
  const [loading, setLoading] = useState(false);
  const canUse = user?.role === "admin" || hasPlan(user, "creator");
  const current = analysis?.aiRewriteStudio?.[mode] || null;

  const generate = async () => {
    setLoading(true);
    try {
      const data = await analysisService.rewrite(analysis._id, { mode });
      onAnalysisUpdate(data.analysis);
      toast.success("Rewrites generated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Rewrite failed");
    } finally {
      setLoading(false);
    }
  };

  if (!canUse) {
    return (
      <SectionContainer className="mt-5" title="Rewrite Tool">
        <LockedFeature title="Rewrite Tool" requiredPlan="Creator" />
      </SectionContainer>
    );
  }

  return (
    <SectionContainer
      className="mt-5"
      description="Create clearer captions, hooks, titles, and next steps for your post."
      title="Rewrite Tool"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {modes.map(([key, label]) => (
            <button
              className={`rounded-lg border px-3 py-2 text-sm font-bold ${
                mode === key
                  ? "border-cyan-400 bg-cyan-100 text-cyan-950 dark:bg-cyan-400/20 dark:text-cyan-100"
                  : "border-zinc-200 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
              }`}
              key={key}
              onClick={() => setMode(key)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        <Button icon={RefreshCw} loading={loading} onClick={generate} variant="accent">
          {current ? "Regenerate" : "Generate rewrites"}
        </Button>

        {current?.versions?.length > 0 && (
          <div className="grid gap-3">
            {current.versions.map((version) => (
              <div className="rounded-lg border border-zinc-200 bg-white/90 p-4 dark:border-zinc-700 dark:bg-zinc-900/90" key={version.id}>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <Badge variant="brand">{version.label}</Badge>
                    <div className="flex gap-2">
                      <CopyButton text={version.text} />
                      <SaveToLibraryButton
                        payload={{
                          analysisId: analysis._id,
                          platform: analysis.platform,
                          type: "rewrite",
                          title: version.label,
                          content: version.text,
                          tags: [analysis.contentType, mode].filter(Boolean)
                        }}
                      />
                    </div>
                </div>
                <p className="whitespace-pre-line text-sm leading-7 text-zinc-700 dark:text-zinc-200">{version.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionContainer>
  );
};

export default AIRewriteStudio;
