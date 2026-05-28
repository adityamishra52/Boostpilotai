import {
  CheckCircle2,
  Crown,
  Download,
  Image,
  Layers3,
  Lock,
  Sparkles,
  WandSparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import { analysisService } from "../services/analysisService";
import { mediaService } from "../services/mediaService";
import { downloadBlob } from "../utils/download";
import { hasPlan, planLabel } from "../utils/plans";
import Badge from "./Badge";
import Button from "./Button";
import ProtectedMedia from "./ProtectedMedia";
import SectionContainer from "./SectionContainer";

const actions = [
  {
    key: "fixWeakness",
    title: "Fix Weakness",
    requiredPlan: "creator",
    icon: WandSparkles,
    description: "One polished caption, stronger hooks, and the few fixes that matter."
  },
  {
    key: "variants",
    title: "Generate Variants",
    requiredPlan: "creator",
    icon: Layers3,
    description: "Three compact A/B options for captions, hooks, and titles."
  },
  {
    key: "applySuggestions",
    title: "Edit Media",
    requiredPlan: "pro",
    icon: Sparkles,
    description: "Tick fixes, apply them to the media, then preview and download the edited file."
  },
  {
    key: "youtubeThumbnails",
    title: "Thumbnail Images",
    requiredPlan: "agency",
    icon: Image,
    description: "Generate real downloadable YouTube thumbnail PNGs.",
    youtubeOnly: true
  }
];

const list = (items) => (Array.isArray(items) ? items.filter(Boolean) : []);

const mediaFileFromAction = (media) =>
  media
    ? {
        mediaFileId: media.mediaFileId || media.mediaId || media.thumbnailMediaId,
        mediaId: media.mediaId || media.mediaFileId || media.thumbnailMediaId,
        mediaUrl: media.mediaUrl || media.url || media.thumbnailUrl,
        url: media.url || media.mediaUrl || media.thumbnailUrl,
        originalName: media.originalName || "boostpilot-output",
        mimetype: media.mimetype || "image/png",
        mediaType: media.mediaType || "image"
      }
    : null;

const MiniList = ({ items, limit = 3 }) => {
  const values = list(items).slice(0, limit);

  if (!values.length) return null;

  return (
    <div className="mt-3 grid gap-2">
      {values.map((item, index) => (
        <div
          className="rounded-lg border border-zinc-200 bg-white/90 p-3 text-sm leading-6 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-100"
          key={`${item}-${index}`}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

const FixResult = ({ result }) => (
  <div className="mt-4 space-y-3">
    {result.improvedCaption && (
      <div className="rounded-lg border border-zinc-200 bg-white/90 p-4 dark:border-zinc-700 dark:bg-zinc-900/90">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-600 dark:text-zinc-300">
          Final caption
        </p>
        <p className="mt-2 text-sm leading-6 text-zinc-800 dark:text-zinc-100">{result.improvedCaption}</p>
      </div>
    )}
    <MiniList items={result.improvedSuggestions} limit={3} />
  </div>
);

const VariantsResult = ({ result }) => (
  <div className="mt-4 grid gap-3 xl:grid-cols-3">
    {[
      ["Caption", result.captionVariants],
      ["Hook", result.hookVariants],
      ["Title", result.titleVariants]
    ].map(([label, items]) => (
      <div key={label}>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-600 dark:text-zinc-300">{label}</p>
        <MiniList items={items} limit={3} />
      </div>
    ))}
  </div>
);

const ApplyResult = ({ result, selectedFixes, setSelectedFixes, onDownload }) => {
  const options = list(result.fixOptions);
  const editedFile = mediaFileFromAction(result.editedMedia);

  return (
    <div className="mt-4 space-y-4">
      {!!options.length && (
        <div className="grid gap-2 sm:grid-cols-3">
          {options.map((option) => {
            const checked = selectedFixes.includes(option.id);

            return (
              <label
                className="flex cursor-pointer items-start gap-2 rounded-lg border border-zinc-200 bg-white/90 p-3 text-sm font-semibold text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-100"
                key={option.id}
              >
                <input
                  checked={checked}
                  className="mt-1 h-4 w-4 accent-cyan-500"
                  onChange={() =>
                    setSelectedFixes((current) =>
                      checked ? current.filter((id) => id !== option.id) : [...current, option.id]
                    )
                  }
                  type="checkbox"
                />
                <span>{option.label}</span>
              </label>
            );
          })}
        </div>
      )}

      <MiniList items={result.actionSteps} limit={3} />

      {editedFile && (
        <div className="grid gap-4 rounded-lg border border-emerald-300 bg-emerald-50/70 p-4 dark:border-emerald-800 dark:bg-emerald-950/25 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <ProtectedMedia
            alt="Edited media preview"
            className="w-full"
            controls
            file={editedFile}
            mediaClassName="aspect-video w-full object-contain"
            placeholderClassName="aspect-video"
          />
          <Button icon={Download} onClick={() => onDownload(editedFile)} variant="accent">
            Download edited
          </Button>
        </div>
      )}
    </div>
  );
};

const ThumbnailResult = ({ result, onDownload }) => {
  const concepts = list(result.concepts).slice(0, 3);
  const hasImages = concepts.some((concept) => concept.thumbnailUrl || concept.thumbnailMediaId);

  if (!hasImages) {
    return (
      <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/35 dark:text-amber-100">
        Regenerate to create downloadable PNG thumbnail images for this saved result.
      </p>
    );
  }

  return (
    <div className="mt-4 grid gap-3 xl:grid-cols-3">
      {concepts.map((concept, index) => {
        const hasImage = concept.thumbnailUrl || concept.thumbnailMediaId;
      const file = mediaFileFromAction({
        mediaFileId: concept.thumbnailMediaId,
        mediaUrl: concept.thumbnailUrl,
        originalName: `boostpilot-thumbnail-${index + 1}.png`,
        mimetype: "image/png",
        mediaType: "image"
      });

      return (
        <div
          className="rounded-lg border border-zinc-200 bg-white/90 p-3 dark:border-zinc-700 dark:bg-zinc-900/90"
          key={`${concept.titleText}-${index}`}
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <Badge variant="brand">Thumbnail {index + 1}</Badge>
            {hasImage && (
              <Button icon={Download} onClick={() => onDownload(file)} size="sm" variant="secondary">
                PNG
              </Button>
            )}
          </div>
          {hasImage ? (
            <ProtectedMedia
              alt={concept.titleText || `Thumbnail ${index + 1}`}
              className="w-full"
              file={file}
              mediaClassName="aspect-video w-full object-cover"
              placeholderClassName="aspect-video"
            />
          ) : null}
          <p className="mt-3 line-clamp-2 text-sm font-bold text-zinc-950 dark:text-white">
            {concept.titleText}
          </p>
        </div>
      );
      })}
    </div>
  );
};

const PremiumActionsPanel = ({ analysis, onAnalysisUpdate }) => {
  const { user } = useAuth();
  const [loadingKey, setLoadingKey] = useState("");
  const premiumActions = analysis?.premiumActions || {};
  const applyResult = premiumActions.applySuggestions;
  const defaultFixes = useMemo(
    () => list(applyResult?.fixOptions).filter((item) => item.selected !== false).map((item) => item.id),
    [applyResult]
  );
  const [selectedFixes, setSelectedFixes] = useState(defaultFixes);

  useEffect(() => {
    setSelectedFixes(defaultFixes);
  }, [defaultFixes]);

  const userCanUse = (requiredPlan) => user?.role === "admin" || hasPlan(user, requiredPlan);

  const downloadMedia = async (file) => {
    try {
      const response = await mediaService.fetchBlob(file.mediaUrl || file.url);
      downloadBlob(response, file.originalName || "boostpilot-media");
    } catch {
      toast.error("Download failed");
    }
  };

  const runAction = async (action) => {
    if (!analysis?._id) return;

    if (action.youtubeOnly && analysis.platform !== "YouTube") {
      toast.error("Thumbnail images are available only for YouTube analyses.");
      return;
    }

    setLoadingKey(action.key);

    try {
      const payload = action.key === "applySuggestions" ? { selectedFixes } : {};
      const data = await analysisService.premiumAction(analysis._id, action.key, payload);
      onAnalysisUpdate(data.analysis);
      toast.success(action.key === "applySuggestions" ? "Edited media ready" : `${action.title} saved`);
    } catch (error) {
      toast.error(error.response?.data?.message || `${action.title} failed`);
    } finally {
      setLoadingKey("");
    }
  };

  return (
    <SectionContainer
      className="mt-5"
      description="Generate polished outputs and real edited media from this analysis."
      icon={Crown}
      title="Premium studio"
    >
      <div className="grid gap-4">
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
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex min-w-0 gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-zinc-950 text-white dark:bg-brand-400/20 dark:text-brand-100 dark:ring-1 dark:ring-brand-300/40">
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-extrabold text-zinc-950 dark:text-white">{action.title}</h3>
                      <Badge
                        variant={
                          action.requiredPlan === "creator"
                            ? "brand"
                            : action.requiredPlan === "pro"
                              ? "success"
                              : "warning"
                        }
                      >
                        {planLabel(action.requiredPlan)}
                      </Badge>
                      {result && <Badge variant="success">Saved</Badge>}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{action.description}</p>
                  </div>
                </div>

                {locked ? (
                  <Button as={Link} icon={Lock} size="sm" to="/pricing" variant="secondary">
                    Upgrade
                  </Button>
                ) : (
                  <Button
                    disabled={
                      platformLocked || (action.key === "applySuggestions" && result && !selectedFixes.length)
                    }
                    icon={platformLocked ? Lock : action.key === "applySuggestions" ? CheckCircle2 : Sparkles}
                    loading={loadingKey === action.key}
                    onClick={() => runAction(action)}
                    size="sm"
                    variant={platformLocked ? "secondary" : "accent"}
                  >
                    {action.key === "applySuggestions" ? "Apply checked fixes" : result ? "Regenerate" : "Generate"}
                  </Button>
                )}
              </div>

              {locked && (
                <p className="mt-3 rounded-lg border border-dashed border-zinc-300 bg-zinc-50/90 p-3 text-sm font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950/80 dark:text-zinc-200">
                  Requires {planLabel(action.requiredPlan)}. Current plan: {planLabel(user?.plan)}.
                </p>
              )}

              {platformLocked && (
                <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/35 dark:text-amber-100">
                  Available only for YouTube analyses.
                </p>
              )}

              {action.key === "fixWeakness" && result && <FixResult result={result} />}
              {action.key === "variants" && result && <VariantsResult result={result} />}
              {action.key === "applySuggestions" && result && (
                <ApplyResult
                  onDownload={downloadMedia}
                  result={result}
                  selectedFixes={selectedFixes}
                  setSelectedFixes={setSelectedFixes}
                />
              )}
              {action.key === "youtubeThumbnails" && result && (
                <ThumbnailResult onDownload={downloadMedia} result={result} />
              )}
            </div>
          );
        })}
      </div>
    </SectionContainer>
  );
};

export default PremiumActionsPanel;
