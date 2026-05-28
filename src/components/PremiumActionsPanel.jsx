import {
  ArrowLeft,
  Crown,
  Image,
  Layers3,
  Lock,
  Plus,
  Sparkles,
  WandSparkles
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import { analysisService } from "../services/analysisService";
import { hasPlan, planLabel } from "../utils/plans";
import Badge from "./Badge";
import Button from "./Button";
import SectionContainer from "./SectionContainer";

const actions = [
  {
    key: "fixWeakness",
    title: "Fix Weakness",
    requiredPlan: "creator",
    icon: WandSparkles,
    description: "Rewrite the weakest parts into stronger captions, hooks, CTA, hashtags, and next-step suggestions.",
    lockedPreview: "Unlock improved captions, stronger hooks, refined CTA options, and better hashtag sets."
  },
  {
    key: "variants",
    title: "Generate Variants",
    requiredPlan: "creator",
    icon: Layers3,
    description: "Generate three alternate captions, hooks, and titles from the current analysis.",
    lockedPreview: "Unlock three ready-to-test caption, hook, and title directions."
  },
  {
    key: "applySuggestions",
    title: "Apply Suggestions",
    requiredPlan: "pro",
    icon: Sparkles,
    description: "Create actionable image or video edit instructions without changing the uploaded media.",
    lockedPreview: "Unlock crop, safe-margin, contrast, pacing, and platform-format instructions."
  },
  {
    key: "youtubeThumbnails",
    title: "YouTube Thumbnail Ideas",
    requiredPlan: "agency",
    icon: Image,
    description: "Generate three YouTube thumbnail concepts with layout, colors, emotion, and CTR rationale.",
    lockedPreview: "Unlock three agency-grade YouTube thumbnail concepts.",
    youtubeOnly: true
  }
];

const list = (items) => (Array.isArray(items) ? items.filter(Boolean) : []);

const ResultList = ({ items }) => {
  const values = list(items);

  if (!values.length) return null;

  return (
    <ul className="mt-3 grid gap-2 text-sm leading-6 text-zinc-700 dark:text-zinc-200">
      {values.map((item, index) => (
        <li
          className="rounded-lg border border-zinc-200 bg-white/90 p-3 dark:border-zinc-700 dark:bg-zinc-900/90"
          key={`${item}-${index}`}
        >
          {item}
        </li>
      ))}
    </ul>
  );
};

const LabeledText = ({ label, value }) => {
  if (!value) return null;

  return (
    <div className="mt-3 rounded-lg border border-zinc-200 bg-white/90 p-3 dark:border-zinc-700 dark:bg-zinc-900/90">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-600 dark:text-zinc-300">{label}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-800 dark:text-zinc-100">{value}</p>
    </div>
  );
};

const ActionResult = ({ actionKey, result }) => {
  if (!result) return null;

  if (actionKey === "fixWeakness") {
    return (
      <div className="mt-4">
        <LabeledText label="Improved caption" value={result.improvedCaption} />
        <ResultList items={result.improvedHooks} />
        <ResultList items={result.improvedCTA} />
        <div className="mt-3 flex flex-wrap gap-2">
          {list(result.improvedHashtags).map((tag) => (
            <Badge key={tag} variant="brand">
              {tag}
            </Badge>
          ))}
        </div>
        <ResultList items={result.improvedSuggestions} />
      </div>
    );
  }

  if (actionKey === "variants") {
    return (
      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-600 dark:text-zinc-300">Captions</p>
          <ResultList items={result.captionVariants} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-600 dark:text-zinc-300">Hooks</p>
          <ResultList items={result.hookVariants} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-600 dark:text-zinc-300">Titles</p>
          <ResultList items={result.titleVariants} />
        </div>
      </div>
    );
  }

  if (actionKey === "applySuggestions") {
    const imageItems = Object.values(result.imageInstructions || {}).filter(Boolean);
    const videoItems = Object.values(result.videoInstructions || {}).filter(Boolean);

    return (
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-600 dark:text-zinc-300">
            Image edits
          </p>
          <ResultList items={imageItems} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-600 dark:text-zinc-300">
            Video edits
          </p>
          <ResultList items={videoItems} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-600 dark:text-zinc-300">
            Action steps
          </p>
          <ResultList items={result.actionSteps} />
        </div>
      </div>
    );
  }

  if (actionKey === "youtubeThumbnails") {
    return (
      <div className="mt-4 grid gap-3 xl:grid-cols-3">
        {list(result.concepts).map((concept, index) => (
          <div
            className="rounded-lg border border-zinc-200 bg-white/90 p-4 dark:border-zinc-700 dark:bg-zinc-900/90"
            key={`${concept.titleText}-${index}`}
          >
            <Badge variant="brand">Concept {index + 1}</Badge>
            <LabeledText label="Title text" value={concept.titleText} />
            <LabeledText label="Visual layout" value={concept.visualLayout} />
            <LabeledText label="Colors" value={concept.colors} />
            <LabeledText label="Subject placement" value={concept.subjectPlacement} />
            <LabeledText label="Emotion" value={concept.emotion} />
            <LabeledText label="CTR reason" value={concept.ctrReason} />
          </div>
        ))}
      </div>
    );
  }

  return null;
};

const PremiumActionsPanel = ({ analysis, onAnalysisUpdate }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loadingKey, setLoadingKey] = useState("");
  const userCanUse = (requiredPlan) => user?.role === "admin" || hasPlan(user, requiredPlan);
  const premiumActions = analysis?.premiumActions || {};

  const runAction = async (action) => {
    if (!analysis?._id) return;

    if (action.youtubeOnly && analysis.platform !== "YouTube") {
      toast.error("YouTube thumbnail ideas are available only for YouTube analyses.");
      return;
    }

    setLoadingKey(action.key);

    try {
      const data = await analysisService.premiumAction(analysis._id, action.key);
      onAnalysisUpdate(data.analysis);
      toast.success(`${action.title} saved`);
    } catch (error) {
      toast.error(error.response?.data?.message || `${action.title} failed`);
    } finally {
      setLoadingKey("");
    }
  };

  return (
    <SectionContainer
      className="mt-5"
      description="Premium actions reuse this analysis and save their output inside the report."
      icon={Crown}
      title="Premium actions"
    >
      <div className="grid gap-4 xl:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;
          const locked = !userCanUse(action.requiredPlan);
          const platformLocked = action.youtubeOnly && analysis?.platform !== "YouTube";
          const result = premiumActions[action.key];

          return (
            <div
              className="rounded-lg border border-zinc-200 bg-white/90 p-4 text-zinc-950 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-white"
              key={action.key}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-zinc-950 text-white dark:bg-brand-400/20 dark:text-brand-100 dark:ring-1 dark:ring-brand-300/40">
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-extrabold text-zinc-950 dark:text-white">{action.title}</h3>
                      <Badge variant={action.requiredPlan === "creator" ? "brand" : action.requiredPlan === "pro" ? "success" : "warning"}>
                        {planLabel(action.requiredPlan)}
                      </Badge>
                      {result && <Badge variant="success">Saved</Badge>}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                      {locked ? action.lockedPreview : action.description}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  {locked ? (
                    <Button as={Link} icon={Lock} size="sm" to="/pricing" variant="secondary">
                      Upgrade
                    </Button>
                  ) : (
                    <Button
                      disabled={platformLocked}
                      icon={platformLocked ? Lock : Sparkles}
                      loading={loadingKey === action.key}
                      onClick={() => runAction(action)}
                      size="sm"
                      variant={platformLocked ? "secondary" : "accent"}
                    >
                      {result ? "Regenerate" : "Generate"}
                    </Button>
                  )}
                </div>
              </div>

              {platformLocked && (
                <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/35 dark:text-amber-100">
                  Available only when the analysis platform is YouTube.
                </p>
              )}

              {locked && (
                <div className="mt-4 rounded-lg border border-dashed border-zinc-300 bg-zinc-50/90 p-4 dark:border-zinc-700 dark:bg-zinc-950/80">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-zinc-700 dark:text-zinc-200">
                    <Lock size={16} />
                    Requires {planLabel(action.requiredPlan)} plan
                  </div>
                  <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                    Your current plan is {planLabel(user?.plan)}. Upgrade to unlock this action.
                  </p>
                </div>
              )}

              <ActionResult actionKey={action.key} result={result} />
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col justify-end gap-3 sm:flex-row">
        <Button icon={ArrowLeft} onClick={() => navigate(-1)} variant="secondary">
          Back
        </Button>
        <Button as={Link} icon={Plus} to="/analyze" variant="accent">
          New analysis
        </Button>
      </div>
    </SectionContainer>
  );
};

export default PremiumActionsPanel;
