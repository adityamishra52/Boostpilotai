import { Download, RefreshCw, Repeat2 } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import { analysisService } from "../services/analysisService";
import { downloadBlob } from "../utils/download";
import { hasPlan, planLabel } from "../utils/plans";
import Badge from "./Badge";
import Button from "./Button";
import CopyButton from "./CopyButton";
import SectionContainer from "./SectionContainer";

const targets = [
  ["instagramPost", "Instagram Post"],
  ["linkedinPost", "LinkedIn Post"],
  ["facebookPost", "Facebook Post"],
  ["twitterThread", "Twitter/X Thread"],
  ["blogSummary", "Blog Summary"],
  ["emailNewsletter", "Email Newsletter"],
  ["youtubeCommunityPost", "YouTube Community"]
];

const repurposeLimit = (user) => {
  if (user?.role === "admin" || hasPlan(user, "pro")) return targets.length;
  if (hasPlan(user, "creator")) return 3;
  return 1;
};

const stringifyContent = (item = {}) =>
  [
    item.label && `# ${item.label}`,
    item.caption,
    item.professionalFormat,
    item.communityStyle,
    item.subject && `Subject: ${item.subject}`,
    item.body,
    item.post,
    item.seoSummary,
    ...(item.tweets || []),
    ...(item.headings || []).map((heading) => `## ${heading}`),
    item.cta && `CTA: ${item.cta}`,
    ...(item.hashtags || [])
  ]
    .filter(Boolean)
    .join("\n\n");

const ContentBlock = ({ item }) => {
  if (!item) return null;

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white/90 p-4 dark:border-zinc-700 dark:bg-zinc-900/90">
      {item.subject && (
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Subject</p>
          <p className="mt-1 font-extrabold text-zinc-950 dark:text-white">{item.subject}</p>
        </div>
      )}
      {[item.caption, item.professionalFormat, item.communityStyle, item.body, item.post, item.seoSummary]
        .filter(Boolean)
        .map((text, index) => (
          <p className="whitespace-pre-line text-sm leading-7 text-zinc-700 dark:text-zinc-200" key={index}>
            {text}
          </p>
        ))}
      {Array.isArray(item.tweets) && item.tweets.length > 0 && (
        <div className="grid gap-2">
          {item.tweets.map((tweet, index) => (
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-950" key={tweet}>
              {tweet || `${index + 1}/`}
            </div>
          ))}
        </div>
      )}
      {Array.isArray(item.headings) && item.headings.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {item.headings.map((heading) => (
            <Badge key={heading} variant="neutral">{heading}</Badge>
          ))}
        </div>
      )}
      {Array.isArray(item.hashtags) && item.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {item.hashtags.map((tag) => (
            <Badge key={tag} variant="brand">{tag}</Badge>
          ))}
        </div>
      )}
      {item.cta && <p className="text-sm font-bold text-zinc-950 dark:text-white">CTA: {item.cta}</p>}
    </div>
  );
};

const RepurposeContentPanel = ({ analysis, onAnalysisUpdate }) => {
  const { user } = useAuth();
  const saved = analysis?.repurposedContent || null;
  const savedPlatforms = saved?.platforms || {};
  const availableKeys = Object.keys(savedPlatforms);
  const [activeKey, setActiveKey] = useState(availableKeys[0] || "instagramPost");
  const [selectedTargets, setSelectedTargets] = useState(() => targets.slice(0, repurposeLimit(user)).map(([key]) => key));
  const [tone, setTone] = useState("");
  const [brandVoice, setBrandVoice] = useState("");
  const [loading, setLoading] = useState(false);
  const limit = repurposeLimit(user);
  const canUseTone = user?.role === "admin" || hasPlan(user, "pro");
  const canUseBrandVoice = user?.role === "admin" || hasPlan(user, "agency");
  const activeItem = savedPlatforms[activeKey] || savedPlatforms[availableKeys[0]];

  const selectedCount = selectedTargets.length;
  const selectedText = useMemo(
    () => Object.values(savedPlatforms).map(stringifyContent).join("\n\n---\n\n"),
    [savedPlatforms]
  );

  const toggleTarget = (key) => {
    setSelectedTargets((current) => {
      if (current.includes(key)) return current.filter((item) => item !== key);
      if (current.length >= limit) {
        toast.error(`${planLabel(user?.plan)} can repurpose ${limit} platform${limit === 1 ? "" : "s"}.`);
        return current;
      }
      return [...current, key];
    });
  };

  const generate = async () => {
    if (!analysis?._id) return;
    setLoading(true);

    try {
      const data = await analysisService.repurpose(analysis._id, {
        targets: selectedTargets,
        tone,
        brandVoice
      });
      onAnalysisUpdate(data.analysis);
      setActiveKey(data.result.targets[0] || "instagramPost");
      toast.success("Repurposed content ready");
    } catch (error) {
      toast.error(error.response?.data?.message || "Repurpose failed");
    } finally {
      setLoading(false);
    }
  };

  const exportMarkdown = () => {
    const blob = new Blob([selectedText || "No repurposed content yet."], { type: "text/markdown" });
    downloadBlob({ data: blob, headers: {} }, "boostpilot-repurposed-content.md");
  };

  return (
    <SectionContainer
      className="mt-5"
      description="Turn this analysis into platform-specific posts, threads, summaries, and newsletters."
      icon={Repeat2}
      title="Repurpose Content"
    >
      <div className="grid gap-4">
        <div className="rounded-lg border border-zinc-200 bg-white/90 p-4 dark:border-zinc-700 dark:bg-zinc-900/90">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="brand">{planLabel(user?.plan)} limit: {limit}</Badge>
                {canUseTone && <Badge variant="success">Tone selection</Badge>}
                {canUseBrandVoice && <Badge variant="warning">Brand voice</Badge>}
              </div>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                Select up to {limit} platform{limit === 1 ? "" : "s"} for this generation.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedText && <CopyButton label="Copy all" text={selectedText} />}
              <Button icon={Download} onClick={exportMarkdown} variant="secondary">Export</Button>
              <Button icon={RefreshCw} loading={loading} onClick={generate} variant="accent">
                {saved ? "Regenerate" : "Generate"}
              </Button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {targets.map(([key, label]) => (
              <button
                className={`rounded-lg border px-3 py-2 text-sm font-bold transition ${
                  selectedTargets.includes(key)
                    ? "border-cyan-400 bg-cyan-100 text-cyan-950 dark:bg-cyan-400/20 dark:text-cyan-100"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-cyan-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200"
                }`}
                key={key}
                onClick={() => toggleTarget(key)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <input
              className="h-11 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-cyan-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              disabled={!canUseTone}
              onChange={(event) => setTone(event.target.value)}
              placeholder={canUseTone ? "Tone, e.g. witty, educational, founder-led" : "Tone selection unlocks on Pro"}
              value={tone}
            />
            <input
              className="h-11 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-cyan-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              disabled={!canUseBrandVoice}
              onChange={(event) => setBrandVoice(event.target.value)}
              placeholder={canUseBrandVoice ? "Brand voice, e.g. crisp, premium, direct" : "Brand voice unlocks on Agency"}
              value={brandVoice}
            />
          </div>
          <p className="mt-3 text-xs font-semibold text-zinc-500">{selectedCount}/{limit} selected</p>
        </div>

        {availableKeys.length > 0 && (
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              {availableKeys.map((key) => (
                <button
                  className={`rounded-lg border px-3 py-2 text-sm font-bold ${
                    (activeKey || availableKeys[0]) === key
                      ? "border-zinc-950 bg-zinc-950 text-white dark:border-brand-300/60 dark:bg-brand-400/20"
                      : "border-zinc-200 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
                  }`}
                  key={key}
                  onClick={() => setActiveKey(key)}
                  type="button"
                >
                  {savedPlatforms[key]?.label || key}
                </button>
              ))}
            </div>
            <div className="mb-3 flex justify-end">
              <CopyButton label="Copy platform" text={stringifyContent(activeItem)} />
            </div>
            <ContentBlock item={activeItem} />
          </div>
        )}
      </div>
    </SectionContainer>
  );
};

export default RepurposeContentPanel;
