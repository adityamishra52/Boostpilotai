import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Copy,
  Download,
  Gauge,
  Lightbulb,
  Megaphone,
  MessageCircle,
  MonitorPlay,
  Ruler,
  Sparkles,
  Tags,
  ThumbsDown,
  ThumbsUp,
  Users,
  WandSparkles
} from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import { analysisService } from "../services/analysisService";
import { downloadBlob } from "../utils/download";
import Badge from "./Badge";
import Button from "./Button";
import Card from "./Card";
import CopyButton from "./CopyButton";
import ProgressBar from "./ProgressBar";
import ProtectedMedia from "./ProtectedMedia";
import ScoreRing from "./ScoreRing";
import SectionContainer from "./SectionContainer";

const listValue = (items) => (Array.isArray(items) ? items.filter(Boolean) : []);

const ListBlock = ({ items, numbered = false }) => {
  const values = listValue(items);

  if (!values.length) {
    return <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">No items available.</p>;
  }

  return (
    <div className="space-y-2">
      {values.map((item, index) => (
        <div
          className="flex gap-3 rounded-lg border border-zinc-200 bg-white/88 p-3 text-sm leading-6 text-zinc-800 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/82 dark:text-zinc-100"
          key={`${item}-${index}`}
        >
          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-zinc-950 text-[11px] font-bold text-white dark:bg-brand-400/20 dark:text-white dark:ring-1 dark:ring-brand-300/35">
            {numbered ? index + 1 : "*"}
          </span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
};

const healthFromValue = (value, goodAt = 80) => {
  const numeric = Number(value) || 0;
  if (numeric >= goodAt) return "success";
  if (numeric >= goodAt * 0.55) return "warning";
  return "danger";
};

const TechnicalMetric = ({ label, value, detail, progress, icon: Icon }) => (
  <div className="rounded-lg border border-zinc-200 bg-white/88 p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/82">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-600 dark:text-zinc-300">{label}</p>
        <p className="mt-2 text-lg font-extrabold tracking-tight text-zinc-950 dark:text-white">{value}</p>
      </div>
      {Icon && (
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
          <Icon size={17} />
        </div>
      )}
    </div>
    {detail && <p className="mt-2 text-xs leading-5 text-zinc-600 dark:text-zinc-300">{detail}</p>}
    {typeof progress === "number" && (
      <ProgressBar className="mt-4" tone={healthFromValue(progress)} value={progress} />
    )}
  </div>
);

const EngagementMetric = ({ label, value }) => (
  <div className="rounded-lg border border-zinc-200 bg-white/88 p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/82">
    <div className="flex items-center justify-between gap-3">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-600 dark:text-zinc-300">{label}</p>
      <p className="text-lg font-extrabold text-zinc-950 dark:text-white">{Number(value) || 0}</p>
    </div>
    <ProgressBar className="mt-3" tone={healthFromValue(value)} value={Number(value) || 0} />
  </div>
);

const ResultsPanel = ({ analysis }) => {
  const output = analysis?.aiOutput;
  const [downloading, setDownloading] = useState(false);

  const data = useMemo(() => {
    const technical = output?.technicalAnalysis || {};
    return {
      hashtags: listValue(output?.hashtags),
      titleIdeas: listValue(output?.titleIdeas),
      hookLines: listValue(output?.hookLines),
      cta: listValue(output?.cta || output?.ctaSuggestions),
      improvementSuggestions: listValue(output?.improvementSuggestions || output?.engagementSuggestions),
      platformSpecificSuggestions: listValue(output?.platformSpecificSuggestions),
      strengths: listValue(output?.engagementAnalysis?.strengths),
      weaknesses: listValue(output?.engagementAnalysis?.weaknesses),
      engagement: output?.engagementAnalysis || {},
      technical
    };
  }, [output]);

  if (!analysis || !output) {
    return null;
  }

  const file = analysis.file || {};
  const fileName = file.originalName || "Uploaded media";
  const fitIsStrong = data.technical.platformFit?.toLowerCase().includes("strong");
  const resolutionProgress = Math.min(100, Math.round(((data.technical.width || 0) / 1080) * 100));
  const durationProgress = data.technical.durationSeconds
    ? Math.max(10, 100 - Math.min(100, data.technical.durationSeconds))
    : 100;

  const fullCopy = [
    output.summary,
    output.viralCaption,
    ...data.hashtags,
    ...data.titleIdeas,
    ...data.hookLines,
    ...data.cta,
    ...data.improvementSuggestions,
    output.targetAudience,
    output.improvedPostVersion,
    ...data.platformSpecificSuggestions,
    ...data.strengths,
    ...data.weaknesses,
    ...(data.technical.qualityIssues || []),
    ...(data.technical.fixSuggestions || [])
  ].join("\n");

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
    <div className="space-y-5">
      <div className="rounded-lg border border-zinc-200 bg-white/92 p-3 shadow-soft backdrop-blur-xl dark:border-zinc-700 dark:bg-zinc-900/92">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-zinc-950 dark:text-white">AI analysis report</p>
            <p className="text-xs leading-5 text-zinc-600 dark:text-zinc-300">
              Overview, creative assets, and technical quality on one page
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <CopyButton label="Copy report" text={fullCopy} />
            <Button icon={Download} loading={downloading} onClick={handleDownload} variant="accent">
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge variant="brand">{analysis.platform}</Badge>
              {analysis.contentType && <Badge>{analysis.contentType}</Badge>}
              <Badge variant={fitIsStrong ? "success" : "warning"}>
                {fitIsStrong ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
                {data.technical.platformFit || "Fit pending"}
              </Badge>
            </div>
            <h2 className="text-balance text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-white md:text-3xl">
              {fileName}
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-700 dark:text-zinc-100">
              {output.summary}
            </p>
          </div>
          <div className="border-t border-zinc-200 bg-zinc-50/90 p-5 dark:border-zinc-800 dark:bg-zinc-900/65 xl:border-l xl:border-t-0">
            <div className="flex items-center justify-center">
              <ScoreRing score={output.contentScore} />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900/70">
                <p className="text-lg font-extrabold text-zinc-950 dark:text-white">
                  {data.technical.aspectRatio || "N/A"}
                </p>
                <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Aspect</p>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900/70">
                <p className="text-lg font-extrabold text-zinc-950 dark:text-white">
                  {data.technical.fileSizeMB || "N/A"} MB
                </p>
                <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">File size</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionContainer icon={Users} title="Target audience">
          <p className="rounded-lg border border-zinc-200 bg-white/88 p-4 text-sm leading-7 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900/82 dark:text-zinc-100">
            {output.targetAudience || "Audience insight unavailable for this result."}
          </p>
        </SectionContainer>
        <SectionContainer
          action={<CopyButton text={output.improvedPostVersion || ""} />}
          icon={Sparkles}
          title="Improved post version"
        >
          <p className="rounded-lg border border-zinc-200 bg-white/88 p-4 text-sm leading-7 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900/82 dark:text-zinc-100">
            {output.improvedPostVersion || "No improved post version available."}
          </p>
        </SectionContainer>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionContainer icon={MonitorPlay} title="Media preview">
          <ProtectedMedia
            alt={fileName}
            className="w-full"
            controls
            file={file}
            mediaClassName="aspect-video w-full object-contain"
            placeholderClassName="aspect-video text-sm"
          />
        </SectionContainer>

        <SectionContainer
          action={<CopyButton text={output.viralCaption} />}
          icon={Megaphone}
          title="Viral caption"
        >
          <p className="rounded-lg border border-zinc-200 bg-white/88 p-4 text-sm leading-7 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900/82 dark:text-zinc-100">
            {output.viralCaption}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {data.hashtags.map((tag) => (
              <Badge key={tag} variant="brand">
                {tag}
              </Badge>
            ))}
          </div>
        </SectionContainer>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <SectionContainer
          action={<CopyButton text={data.titleIdeas.join("\n")} />}
          icon={WandSparkles}
          title="Title ideas"
        >
          <ListBlock items={data.titleIdeas} numbered />
        </SectionContainer>
        <SectionContainer
          action={<CopyButton text={data.hookLines.join("\n")} />}
          icon={MessageCircle}
          title="Hook lines"
        >
          <ListBlock items={data.hookLines} numbered />
        </SectionContainer>
        <SectionContainer
          action={<CopyButton text={data.cta.join("\n")} />}
          icon={Copy}
          title="CTA options"
        >
          <ListBlock items={data.cta} />
        </SectionContainer>
        <SectionContainer
          action={<CopyButton text={data.improvementSuggestions.join("\n")} />}
          icon={Lightbulb}
          title="Improvement suggestions"
        >
          <ListBlock items={data.improvementSuggestions} />
        </SectionContainer>
        <SectionContainer
          action={<CopyButton text={data.platformSpecificSuggestions.join("\n")} />}
          icon={BarChart3}
          title="Platform-specific suggestions"
        >
          <ListBlock items={data.platformSpecificSuggestions} />
        </SectionContainer>
        <SectionContainer
          action={<CopyButton text={data.hashtags.join(" ")} />}
          icon={Tags}
          title="Hashtags"
        >
          <div className="flex flex-wrap gap-2">
            {data.hashtags.map((tag) => (
              <Badge key={tag} variant="brand">
                {tag}
              </Badge>
            ))}
          </div>
        </SectionContainer>
      </div>

      <SectionContainer icon={BarChart3} title="Engagement analysis">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <EngagementMetric label="Hook score" value={data.engagement.hookScore} />
          <EngagementMetric label="Clarity" value={data.engagement.clarityScore} />
          <EngagementMetric label="Visual appeal" value={data.engagement.visualAppealScore} />
          <EngagementMetric label="CTA strength" value={data.engagement.ctaScore} />
        </div>
        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          <div className="rounded-lg border border-zinc-200 bg-white/88 p-4 dark:border-zinc-700 dark:bg-zinc-900/82">
            <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-zinc-950 dark:text-white">
              <ThumbsUp size={17} />
              Strengths
            </div>
            <ListBlock items={data.strengths} />
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white/88 p-4 dark:border-zinc-700 dark:bg-zinc-900/82">
            <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-zinc-950 dark:text-white">
              <ThumbsDown size={17} />
              Weaknesses
            </div>
            <ListBlock items={data.weaknesses} />
          </div>
        </div>
      </SectionContainer>

      <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <SectionContainer icon={Ruler} title="Technical quality">
          <div className="grid gap-3 sm:grid-cols-2">
            <TechnicalMetric
              detail={data.technical.recommendedDimensions}
              icon={Ruler}
              label="Resolution"
              progress={resolutionProgress}
              value={`${data.technical.width || 0}x${data.technical.height || 0}`}
            />
            <TechnicalMetric
              detail={data.technical.recommendedDuration}
              icon={Gauge}
              label="Duration"
              progress={durationProgress}
              value={`${data.technical.durationSeconds || 0}s`}
            />
            <TechnicalMetric
              detail="Measured media shape"
              icon={MonitorPlay}
              label="Aspect ratio"
              progress={fitIsStrong ? 96 : 58}
              value={data.technical.aspectRatio || "Unknown"}
            />
            <TechnicalMetric
              detail={data.technical.recommendedFileSize}
              icon={Download}
              label="File size"
              progress={Math.max(10, 100 - Number(data.technical.fileSizeMB || 0))}
              value={`${data.technical.fileSizeMB || "Unknown"} MB`}
            />
          </div>
        </SectionContainer>

        <div className="space-y-5">
          <SectionContainer icon={AlertTriangle} title="Quality issues">
            <ListBlock items={data.technical.qualityIssues || []} />
          </SectionContainer>
          <SectionContainer icon={CheckCircle2} title="Recommended fixes">
            <ListBlock items={data.technical.fixSuggestions || []} />
          </SectionContainer>
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;
