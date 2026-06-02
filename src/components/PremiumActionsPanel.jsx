import {
  CheckCircle2,
  Crown,
  Download,
  Eye,
  Image,
  Layers3,
  Lock,
  Maximize2,
  RotateCcw,
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
import { thumbnailFormatForAnalysis } from "../utils/mediaFormats";
import { hasPlan, planLabel } from "../utils/plans";
import Badge from "./Badge";
import Button from "./Button";
import ProtectedMedia from "./ProtectedMedia";
import SectionContainer from "./SectionContainer";

const thumbnailStyles = ["Auto", "MrBeast", "Ali Abdaal", "Alex Hormozi", "Iman Gadzhi", "Faceless", "Tech", "News", "Minimal"];

const copyActions = [
  {
    key: "fixWeakness",
    title: "Fix Weakness",
    requiredPlan: "creator",
    icon: WandSparkles,
    description: "One polished caption, stronger hooks, and only the fixes that matter."
  },
  {
    key: "variants",
    title: "Generate Variants",
    requiredPlan: "creator",
    icon: Layers3,
    description: "Three compact A/B options for captions, hooks, and titles."
  }
];

const list = (items) => (Array.isArray(items) ? items.filter(Boolean) : []);

const mediaKind = (analysis = {}) =>
  analysis.file?.mediaType || analysis.file?.fileType || (analysis.file?.mimetype || "").split("/")[0] || "image";

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

const fixOptionsForAnalysis = (analysis = {}) => {
  const kind = mediaKind(analysis);
  const technical = analysis.aiOutput?.technicalAnalysis || {};
  const text = [
    ...(technical.qualityIssues || []),
    ...(technical.fixSuggestions || []),
    analysis.aiOutput?.summary || ""
  ]
    .join(" ")
    .toLowerCase();

  const pick = (options) =>
    options
      .map((option) => ({
        ...option,
        selected:
          option.defaultSelected ||
          option.keywords?.some((keyword) => text.includes(keyword)) ||
          false
      }))
      .sort((a, b) => Number(b.selected) - Number(a.selected))
      .slice(0, 10);

  if (kind === "video") {
    return pick([
      {
        id: "trim-intro",
        label: "Trim weak intro",
        description: "Keeps the opening tighter for retention.",
        keywords: ["duration", "long", "intro", "pacing"]
      },
      {
        id: "crop-shorts",
        label: "Crop for platform",
        description: "Fits the video to the selected platform using padding when needed.",
        keywords: ["short", "reel", "vertical", "aspect"],
        defaultSelected: analysis.contentType === "Short" || analysis.contentType === "Reel"
      },
      {
        id: "brightness",
        label: "Improve brightness",
        description: "Brightens the frame for mobile viewing.",
        keywords: ["brightness", "dark", "lighting"],
        defaultSelected: true
      },
      {
        id: "clarity",
        label: "Increase clarity",
        description: "Improves readability without heavy processing.",
        keywords: ["clarity", "readability", "blur"]
      },
      {
        id: "contrast",
        label: "Increase contrast",
        description: "Adds clearer separation between subject and background.",
        keywords: ["contrast", "flat", "readability"]
      },
      {
        id: "subtitle-safe",
        label: "Subtitle-safe spacing",
        description: "Adds safer composition margins.",
        keywords: ["safe", "margin", "text", "subtitle"]
      },
      {
        id: "optimize-mobile",
        label: "Optimize for mobile",
        description: "Keeps the subject clear in smaller previews.",
        keywords: ["mobile", "small", "preview"]
      },
      {
        id: "fps",
        label: "Optimize pacing",
        description: "Normalizes playback for a smoother preview.",
        keywords: ["fps", "pacing", "smooth"]
      }
    ]);
  }

  return pick([
    {
      id: "crop-instagram",
      label: "Crop for platform",
      description: "Fits to the platform ratio without cutting the subject.",
      keywords: ["crop", "aspect", "ratio", "dimension"]
    },
    {
      id: "brightness",
      label: "Increase brightness",
      description: "Lifts the image without changing the original.",
      keywords: ["brightness", "dark", "lighting"],
      defaultSelected: true
    },
    {
      id: "clarity",
      label: "Increase clarity",
      description: "Adds a subtle clarity lift for mobile viewing.",
      keywords: ["clarity", "readability", "blur"],
      defaultSelected: true
    },
    {
      id: "contrast",
      label: "Increase contrast",
      description: "Makes the subject and text stand out.",
      keywords: ["contrast", "readability", "flat"],
      defaultSelected: true
    },
    {
      id: "sharpness",
      label: "Improve sharpness",
      description: "Adds clarity for small-screen viewing.",
      keywords: ["sharp", "blur", "clarity"],
      defaultSelected: true
    },
    {
      id: "safe-margins",
      label: "Add safe margins",
      description: "Keeps important content away from edges.",
      keywords: ["safe", "margin", "text"]
    },
    {
      id: "subtitle-safe",
      label: "Subtitle safe area",
      description: "Keeps space clear for captions and platform overlays.",
      keywords: ["subtitle", "safe", "caption"]
    },
    {
      id: "optimize-mobile",
      label: "Optimize for mobile",
      description: "Preserves the subject in compact mobile previews.",
      keywords: ["mobile", "small", "preview"]
    },
    {
      id: "saturation",
      label: "Increase saturation slightly",
      description: "Adds a cleaner premium color lift.",
      keywords: ["color", "saturation", "washed"]
    }
  ]);
};

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

const EmptyPreview = ({ message }) => (
  <div className="grid min-h-48 w-full place-items-center rounded-lg border border-dashed border-zinc-300 bg-white/80 p-5 text-center text-sm font-semibold text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-300">
    {message}
  </div>
);

const MediaPreview = ({ analysis, editedFile, mode }) => {
  const originalFile = analysis.file;
  const kind = mediaKind(analysis);
  const previewClass = kind === "video" ? "aspect-video w-full object-contain" : "aspect-video w-full object-contain";
  const placeholderClass = "aspect-video";

  if (mode === "after") {
    if (!editedFile) {
      return (
        <EmptyPreview
          message={
            kind === "video"
              ? "No edited video preview yet. Apply selected fixes first."
              : "No edited image preview yet. Apply selected fixes first."
          }
        />
      );
    }

    return (
      <ProtectedMedia
        alt="Edited media preview"
        className="w-full"
        controls
        file={editedFile}
        mediaClassName={previewClass}
        placeholderClassName={placeholderClass}
      />
    );
  }

  if (mode === "compare") {
    return (
      <div className="grid gap-3 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-zinc-600 dark:text-zinc-300">
            Before
          </p>
          <ProtectedMedia
            alt="Original media preview"
            className="w-full"
            controls
            file={originalFile}
            mediaClassName={previewClass}
            placeholderClassName={placeholderClass}
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-zinc-600 dark:text-zinc-300">
            After
          </p>
          {editedFile ? (
            <ProtectedMedia
              alt="Edited media preview"
              className="w-full"
              controls
              file={editedFile}
              mediaClassName={previewClass}
              placeholderClassName={placeholderClass}
            />
          ) : (
            <EmptyPreview
              message={
                kind === "video"
                  ? "No edited video preview yet. Apply selected fixes first."
                  : "No edited image preview yet. Apply selected fixes first."
              }
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <ProtectedMedia
      alt="Original media preview"
      className="w-full"
      controls
      file={originalFile}
      mediaClassName={previewClass}
      placeholderClassName={placeholderClass}
    />
  );
};

const MediaEnhancer = ({
  analysis,
  applyResult,
  downloadMedia,
  loading,
  onApply,
  selectedFixes,
  setSelectedFixes,
  user
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState("compare");
  const options = useMemo(() => fixOptionsForAnalysis(analysis), [analysis]);
  const editedFile = mediaFileFromAction(applyResult?.editedMedia);
  const kind = mediaKind(analysis);
  const canApplyImage = user?.role === "admin" || hasPlan(user, "pro");
  const canApply = canApplyImage;
  const requiredApplyPlan = "pro";

  useEffect(() => {
    setSelectedFixes(options.filter((option) => option.selected).map((option) => option.id));
  }, [options, setSelectedFixes]);

  const reset = () => {
    setSelectedFixes(options.filter((option) => option.selected).map((option) => option.id));
    setPreviewMode("compare");
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white/90 p-4 text-zinc-950 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-white">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-zinc-950 text-white dark:bg-brand-400/20 dark:text-brand-100 dark:ring-1 dark:ring-brand-300/40">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-extrabold text-zinc-950 dark:text-white">AI Media Enhancer</h3>
              <Badge variant="brand">Creator</Badge>
              <Badge variant={kind === "video" ? "warning" : "success"}>
                Apply: {planLabel(requiredApplyPlan)}
              </Badge>
              {editedFile && <Badge variant="success">Edited</Badge>}
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              Pick only the fixes you want, preview the result, and download a new edited file.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button icon={Eye} onClick={() => setPreviewOpen((value) => !value)} size="sm" variant="secondary">
            Preview
          </Button>
          <Button icon={RotateCcw} onClick={reset} size="sm" variant="secondary">
            Reset
          </Button>
          {canApply ? (
            <Button
              disabled={!selectedFixes.length}
              icon={CheckCircle2}
              loading={loading}
              onClick={() => onApply(selectedFixes)}
              size="sm"
              variant="accent"
            >
              Apply selected fixes
            </Button>
          ) : (
            <Button as={Link} icon={Lock} size="sm" to="/pricing" variant="secondary">
              Upgrade to apply
            </Button>
          )}
        </div>
      </div>

      {!canApply && (
        <p className="mt-3 rounded-lg border border-dashed border-zinc-300 bg-zinc-50/90 p-3 text-sm font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950/80 dark:text-zinc-200">
          {`Creator can view the AI fix checklist. Applying ${kind} fixes requires ${planLabel(requiredApplyPlan)}.`}
        </p>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {options.map((option) => {
          const checked = selectedFixes.includes(option.id);

          return (
            <label
              className="flex cursor-pointer gap-3 rounded-lg border border-zinc-200 bg-white p-3 text-sm shadow-sm transition hover:border-cyan-300 dark:border-zinc-700 dark:bg-zinc-950/80 dark:hover:border-cyan-500"
              key={option.id}
            >
              <input
                checked={checked}
                className="mt-1 h-5 w-5 shrink-0 accent-cyan-500"
                onChange={() =>
                  setSelectedFixes((current) =>
                    checked ? current.filter((id) => id !== option.id) : [...current, option.id]
                  )
                }
                type="checkbox"
              />
              <span>
                <span className="block font-extrabold text-zinc-950 dark:text-white">{option.label}</span>
                <span className="mt-1 block leading-5 text-zinc-600 dark:text-zinc-300">{option.description}</span>
              </span>
            </label>
          );
        })}
      </div>

      {(previewOpen || editedFile) && (
        <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50/70 p-3 dark:border-zinc-700 dark:bg-zinc-950/40">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              {["before", "after", "compare"].map((mode) => (
                <button
                  className={`rounded-lg border px-3 py-2 text-sm font-bold ${
                    previewMode === mode
                      ? "border-cyan-400 bg-cyan-100 text-cyan-950 dark:bg-cyan-400/20 dark:text-cyan-100"
                      : "border-zinc-200 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
                  }`}
                  key={mode}
                  onClick={() => setPreviewMode(mode)}
                  type="button"
                >
                  {mode === "compare" ? "Before / After" : mode}
                </button>
              ))}
            </div>
            {editedFile && (
              <Button icon={Download} onClick={() => downloadMedia(editedFile)} size="sm" variant="accent">
                Download edited
              </Button>
            )}
          </div>
          <MediaPreview analysis={analysis} editedFile={editedFile} mode={previewMode} />
        </div>
      )}
    </div>
  );
};

const ScoreMetric = ({ label, value }) => (
  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-900/70">
    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">{label}</p>
    <p className="mt-1 text-base font-extrabold text-zinc-950 dark:text-white">{Number(value || 0) || 0}</p>
  </div>
);

const ThumbnailResult = ({ analysis, result, onDownload, onFullscreen }) => {
  const concepts = list(result?.concepts).slice(0, 3);
  const hasImages = concepts.some((concept) => concept.thumbnailUrl || concept.thumbnailMediaId);
  const format = result?.thumbnailFormat || thumbnailFormatForAnalysis(analysis);
  const aspectClass = format.aspectClass || thumbnailFormatForAnalysis(analysis).aspectClass;

  if (!hasImages) {
    return (
      <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/35 dark:text-amber-100">
        Regenerate to create content-aware PNG thumbnails from the uploaded media.
      </p>
    );
  }

  return (
    <div className="mt-4 grid gap-4 xl:grid-cols-3">
      {concepts.map((concept, index) => {
        const file = mediaFileFromAction({
          mediaFileId: concept.thumbnailMediaId,
          mediaUrl: concept.thumbnailUrl,
          originalName: `boostpilot-${format.key || "cover"}-${index + 1}.png`,
          mimetype: "image/png",
          mediaType: "image"
        });
        const viralScore = concept.viralScore || {};

        return (
          <div
            className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-950/80"
            key={`${concept.titleText}-${index}`}
          >
            <ProtectedMedia
              alt={concept.titleText || `Thumbnail ${index + 1}`}
              className="w-full rounded-none"
              file={file}
              mediaClassName={`${aspectClass} w-full object-cover`}
              placeholderClassName={aspectClass}
            />
            <div className="space-y-3 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge variant="brand">{format.ratio || "Cover"} {index + 1}</Badge>
                <Badge variant="warning">{concept.style || "Auto"}</Badge>
              </div>
              <h4 className="line-clamp-2 text-base font-extrabold text-zinc-950 dark:text-white">
                {concept.titleText}
              </h4>
              <div className="grid gap-2 text-xs font-semibold leading-5 text-zinc-600 dark:text-zinc-300">
                {concept.contentCategory && <span>Category: {concept.contentCategory}</span>}
                {concept.subjectPlacement && <span>Subject: {concept.subjectPlacement}</span>}
                {concept.backgroundRecommendation && <span>Background: {concept.backgroundRecommendation}</span>}
                {concept.colors && <span>Colors: {concept.colors}</span>}
                {concept.emotion && <span>Emotion: {concept.emotion}</span>}
              </div>
              <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                {concept.ctrReason || concept.whyItMayPerformWell || "Uses the uploaded frame, a clear subject, and a curiosity-driven title."}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <ScoreMetric label="Predicted CTR" value={viralScore.predictedCtr || concept.ctrScore || 86} />
                <ScoreMetric label="Clickability" value={viralScore.clickability || 86} />
                <ScoreMetric label="Curiosity" value={viralScore.curiosity || 86} />
                <ScoreMetric label="Emotion" value={viralScore.emotion || 86} />
              </div>
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                <Button icon={Download} onClick={() => onDownload(file)} size="sm" variant="secondary">
                  PNG
                </Button>
                <Button icon={Maximize2} onClick={() => onFullscreen({ concept, file })} size="sm" variant="secondary">
                  Fullscreen
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const LockedThumbnailPreview = ({ analysis }) => {
  const format = thumbnailFormatForAnalysis(analysis);

  return (
  <div className="mt-4 grid gap-4 xl:grid-cols-3">
    {[1, 2, 3].map((item) => (
      <div
        className="overflow-hidden rounded-lg border border-dashed border-zinc-300 bg-white/70 shadow-sm dark:border-zinc-700 dark:bg-zinc-950/60"
        key={item}
      >
        <div className={`${format.aspectClass} bg-zinc-100 dark:bg-zinc-900`} />
        <div className="space-y-3 p-3">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="neutral">{format.ratio} {item}</Badge>
            <Badge variant="warning">Agency</Badge>
          </div>
          <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3 w-full rounded bg-zinc-100 dark:bg-zinc-900" />
          <div className="h-3 w-5/6 rounded bg-zinc-100 dark:bg-zinc-900" />
        </div>
      </div>
    ))}
  </div>
  );
};

const PremiumActionsPanel = ({ analysis, onAnalysisUpdate }) => {
  const { user } = useAuth();
  const [loadingKey, setLoadingKey] = useState("");
  const [selectedFixes, setSelectedFixes] = useState([]);
  const [thumbnailStyle, setThumbnailStyle] = useState("Auto");
  const [fullscreen, setFullscreen] = useState(null);
  const premiumActions = analysis?.premiumActions || {};
  const thumbnailFormat = thumbnailFormatForAnalysis(analysis);

  const userCanUse = (requiredPlan) => user?.role === "admin" || hasPlan(user, requiredPlan);

  const downloadMedia = async (file) => {
    try {
      const response = await mediaService.fetchBlob(file.mediaUrl || file.url);
      downloadBlob(response, file.originalName || "boostpilot-media");
    } catch {
      toast.error("Download failed");
    }
  };

  const runCopyAction = async (action) => {
    if (!analysis?._id) return;
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

  const applyFixes = async (fixes) => {
    setLoadingKey("applySuggestions");

    try {
      const data = await mediaService.applyFixes(analysis._id, fixes);
      onAnalysisUpdate(data.analysis);
      toast.success("Edited media ready");
    } catch (error) {
      const message = error.response?.data?.message || "Media edit failed";
      toast.error(message, {
        duration: message === VIDEO_EDITING_UNAVAILABLE_MESSAGE ? 7000 : 4000
      });
    } finally {
      setLoadingKey("");
    }
  };

  const generateThumbnails = async () => {
    setLoadingKey("youtubeThumbnails");

    try {
      const data = await mediaService.generateThumbnails(
        analysis._id,
        thumbnailStyle === "Auto" ? "" : thumbnailStyle
      );
      onAnalysisUpdate(data.analysis);
      toast.success("Thumbnail images generated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Thumbnail generation failed");
    } finally {
      setLoadingKey("");
    }
  };

  return (
    <SectionContainer
      className="mt-5"
      description="Generate polished outputs, edited media, and content-aware YouTube thumbnails."
      icon={Crown}
      title="Premium studio"
    >
      <div className="grid gap-4">
        {copyActions.map((action) => {
          const Icon = action.icon;
          const locked = !userCanUse(action.requiredPlan);
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
                      <Badge variant="brand">{planLabel(action.requiredPlan)}</Badge>
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
                    icon={Sparkles}
                    loading={loadingKey === action.key}
                    onClick={() => runCopyAction(action)}
                    size="sm"
                    variant="accent"
                  >
                    {result ? "Regenerate" : "Generate"}
                  </Button>
                )}
              </div>

              {action.key === "fixWeakness" && result && <FixResult result={result} />}
              {action.key === "variants" && result && <VariantsResult result={result} />}
            </div>
          );
        })}

        {userCanUse("creator") ? (
          <MediaEnhancer
            analysis={analysis}
            applyResult={premiumActions.applySuggestions}
            downloadMedia={downloadMedia}
            loading={loadingKey === "applySuggestions"}
            onApply={applyFixes}
            selectedFixes={selectedFixes}
            setSelectedFixes={setSelectedFixes}
            user={user}
          />
        ) : (
          <div className="rounded-lg border border-zinc-200 bg-white/90 p-4 dark:border-zinc-700 dark:bg-zinc-900/90">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-extrabold text-zinc-950 dark:text-white">AI Media Enhancer</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                  Creator unlocks AI fix suggestions. Pro and Agency can apply them to media.
                </p>
              </div>
              <Button as={Link} icon={Lock} size="sm" to="/pricing" variant="secondary">
                Upgrade
              </Button>
            </div>
          </div>
        )}

        <div className="rounded-lg border border-zinc-200 bg-white/90 p-4 text-zinc-950 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-white">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="flex min-w-0 gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-zinc-950 text-white dark:bg-brand-400/20 dark:text-brand-100 dark:ring-1 dark:ring-brand-300/40">
                <Image size={18} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-extrabold text-zinc-950 dark:text-white">{thumbnailFormat.label}</h3>
                  <Badge variant="warning">Agency</Badge>
                  {premiumActions.youtubeThumbnails && <Badge variant="success">Saved</Badge>}
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  {thumbnailFormat.description}
                </p>
              </div>
            </div>

            {userCanUse("agency") ? (
              <Button
                icon={Sparkles}
                loading={loadingKey === "youtubeThumbnails"}
                onClick={generateThumbnails}
                size="sm"
                variant="accent"
              >
                {premiumActions.youtubeThumbnails ? "Regenerate" : "Generate"}
              </Button>
            ) : (
              <Button as={Link} icon={Lock} size="sm" to="/pricing" variant="secondary">
                Upgrade
              </Button>
            )}
          </div>

          {userCanUse("agency") && (
            <div className="mt-4 flex flex-wrap gap-2">
              {thumbnailStyles.map((style) => (
                <button
                  className={`rounded-lg border px-3 py-2 text-sm font-bold transition ${
                    thumbnailStyle === style
                      ? "border-cyan-400 bg-cyan-100 text-cyan-950 dark:bg-cyan-400/20 dark:text-cyan-100"
                      : "border-zinc-200 bg-white text-zinc-700 hover:border-cyan-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200"
                  }`}
                  key={style}
                  onClick={() => setThumbnailStyle(style)}
                  type="button"
                >
                  {style}
                </button>
              ))}
            </div>
          )}

          {!userCanUse("agency") && (
            <>
              <p className="mt-3 rounded-lg border border-dashed border-zinc-300 bg-zinc-50/90 p-3 text-sm font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950/80 dark:text-zinc-200">
                Agency unlocks content-aware YouTube thumbnails, viral scoring, and PNG downloads.
              </p>
              <LockedThumbnailPreview analysis={analysis} />
            </>
          )}

          {userCanUse("agency") && premiumActions.youtubeThumbnails && (
            <ThumbnailResult
              analysis={analysis}
              onDownload={downloadMedia}
              onFullscreen={setFullscreen}
              result={premiumActions.youtubeThumbnails}
            />
          )}
        </div>
      </div>

      {fullscreen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4" onClick={() => setFullscreen(null)}>
          <div
            className="w-full max-w-5xl rounded-lg border border-zinc-700 bg-zinc-950 p-3"
            onClick={(event) => event.stopPropagation()}
          >
            <ProtectedMedia
              alt={fullscreen.concept?.titleText || "Thumbnail fullscreen"}
              className="w-full"
              file={fullscreen.file}
              mediaClassName={`${thumbnailFormat.aspectClass} max-h-[78vh] w-full object-contain`}
              placeholderClassName={thumbnailFormat.aspectClass}
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="font-bold text-white">{fullscreen.concept?.titleText}</p>
              <Button icon={Download} onClick={() => downloadMedia(fullscreen.file)} size="sm" variant="accent">
                Download PNG
              </Button>
            </div>
          </div>
        </div>
      )}
    </SectionContainer>
  );
};

export default PremiumActionsPanel;
