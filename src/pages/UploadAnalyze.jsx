import { CheckCircle2, Cpu, CreditCard, FileUp, Gauge, WandSparkles, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Badge from "../components/Badge";
import Button from "../components/Button";
import Card from "../components/Card";
import ContentTypeSelector, { contentTypesByPlatform } from "../components/ContentTypeSelector";
import FileDropzone from "../components/FileDropzone";
import PageHeader from "../components/PageHeader";
import PlatformSelector from "../components/PlatformSelector";
import ProgressBar from "../components/ProgressBar";
import SectionContainer from "../components/SectionContainer";
import { useAuth } from "../context/AuthContext";
import { analysisService } from "../services/analysisService";
import { formatFileSize } from "../utils/formatters";

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime",
  "video/webm"
];

const getPreferredContentType = (platform, selectedFile) => {
  const options = contentTypesByPlatform[platform] || [];

  if (!options.length) {
    return "";
  }

  const mediaPreference = selectedFile?.type?.startsWith("video/")
    ? ["Video", "Video Post", "Reel", "Short", "Story"]
    : selectedFile?.type?.startsWith("image/")
      ? ["Post", "Image Post", "Thumbnail", "Carousel"]
      : [];

  return mediaPreference.find((item) => options.includes(item)) || options[0];
};

const UploadAnalyze = () => {
  const { updateUser, user } = useAuth();
  const navigate = useNavigate();
  const defaultPlatform = user?.preferences?.defaultPlatform || "Instagram";
  const [file, setFile] = useState(null);
  const [platform, setPlatform] = useState(defaultPlatform);
  const [contentType, setContentType] = useState(getPreferredContentType(defaultPlatform));
  const [loading, setLoading] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const handlePlatformChange = (nextPlatform) => {
    setPlatform(nextPlatform);
    setContentType(getPreferredContentType(nextPlatform, file));
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Upload JPG, PNG, WebP, MP4, MOV, or WebM");
      return;
    }

    if (selectedFile.size > 100 * 1024 * 1024) {
      toast.error("File must be 100 MB or smaller");
      return;
    }

    setFile(selectedFile);
    setContentType(getPreferredContentType(platform, selectedFile));
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Choose a file before analyzing");
      return;
    }

    if ((user?.credits ?? 0) <= 0) {
      setUpgradeOpen(true);
      return;
    }

    setLoading(true);

    try {
      const data = await analysisService.analyze({ file, platform, contentType });
      if (data.user) {
        updateUser(data.user);
      }
      toast.success("Analysis complete");
      navigate(`/results/${data.analysis._id}`, { state: { analysis: data.analysis } });
    } catch (error) {
      if (error.response?.status === 402) {
        setUpgradeOpen(true);
      }
      toast.error(error.response?.data?.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const readiness = [file ? 34 : 0, platform ? 33 : 0, contentType ? 33 : 0].reduce(
    (sum, item) => sum + item,
    0
  );

  return (
    <motion.div animate={{ opacity: 1, y: 0 }} className="pb-28 md:pb-0" initial={{ opacity: 0, y: 10 }}>
      <PageHeader
        action={<Badge variant={file ? "success" : "warning"}>{file ? "Asset ready" : "Awaiting media"}</Badge>}
        description="Analyze creative strategy, media quality, platform fit, and export-ready reporting."
        eyebrow="Analyze"
        title="Content intelligence studio"
      />

      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-5">
          <SectionContainer icon={FileUp} title="Media asset">
            <FileDropzone file={file} onFile={handleFile} />
          </SectionContainer>

          <SectionContainer icon={Gauge} title="Content destination">
            <PlatformSelector onChange={handlePlatformChange} value={platform} />
          </SectionContainer>

          <SectionContainer icon={CheckCircle2} title="Content format">
            <ContentTypeSelector onChange={setContentType} platform={platform} value={contentType} />
          </SectionContainer>
        </div>

        <div className="space-y-5 xl:sticky xl:top-5 xl:h-fit">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
                  Launch readiness
                </p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                  {readiness}%
                </h2>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-gradient-to-br from-brand-500 via-signal to-coral text-white shadow-glow">
                <Cpu size={22} />
              </div>
            </div>
            <ProgressBar className="mt-4" value={readiness} />
            <div className="mt-5 space-y-3 text-sm">
              {[
                ["Destination", platform],
                ["Content format", contentType],
                ["Credits", user?.credits ?? 0],
                ["File size", file ? formatFileSize(file.size) : "None"],
                ["AI output", "Creative + technical PDF"]
              ].map(([label, value]) => (
                <div
                  className="flex items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-white/90 px-3 py-3 text-zinc-950 dark:!border-zinc-700 dark:!bg-zinc-900/90 dark:!text-white"
                  key={label}
                >
                  <span className="font-medium text-zinc-700 dark:!text-zinc-300">{label}</span>
                  <span className="text-right font-bold text-zinc-950 dark:!text-white">{value}</span>
                </div>
              ))}
            </div>
            <Button
              className="mt-5 w-full"
              icon={WandSparkles}
              loading={loading}
              onClick={handleSubmit}
              size="lg"
              variant="accent"
            >
              {loading ? "Analyzing..." : "Generate analysis"}
            </Button>
          </Card>

          {loading && (
            <Card>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 animate-ping rounded-full bg-brand-400" />
                <p className="text-sm font-bold text-zinc-950 dark:text-white">AI pipeline running</p>
              </div>
              <div className="mt-4 space-y-4">
                {["Media metadata", "Visual analysis", "Technical fit", "Report model"].map((item, index) => (
                  <div key={item}>
                    <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
                      <span>{item}</span>
                      <span>{25 * (index + 1)}%</span>
                    </div>
                    <ProgressBar value={25 * (index + 1)} />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {upgradeOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/60 px-4 backdrop-blur-sm">
          <Card className="w-full max-w-lg p-0">
            <div className="flex items-start justify-between border-b border-zinc-200 p-5 dark:border-zinc-800">
              <div>
                <div className="mb-3 grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br from-brand-500 via-signal to-coral text-white shadow-glow">
                  <CreditCard size={22} />
                </div>
                <h2 className="text-2xl font-extrabold text-zinc-950 dark:text-white">Upgrade to continue</h2>
                <p className="mt-2 text-sm font-medium leading-6 text-zinc-600 dark:text-zinc-300">
                  You have 0 analysis credits. Choose a plan to unlock more AI analyses.
                </p>
              </div>
              <button
                className="grid h-10 w-10 place-items-center rounded-lg text-zinc-700 transition hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300/35 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:focus-visible:ring-brand-400/25"
                onClick={() => setUpgradeOpen(false)}
                type="button"
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid gap-3 p-5 sm:grid-cols-3">
              {[
                ["Creator", "Rs 299", "50 credits"],
                ["Pro", "Rs 799", "200 credits"],
                ["Agency", "Rs 1999", "1000 credits"]
              ].map(([name, price, credits]) => (
                <div
                  className="rounded-lg border border-zinc-200 bg-white/90 p-4 text-zinc-950 dark:!border-zinc-700 dark:!bg-zinc-900/90 dark:!text-white"
                  key={name}
                >
                  <p className="font-extrabold text-zinc-950 dark:!text-white">{name}</p>
                  <p className="mt-1 text-sm text-zinc-600 dark:!text-zinc-300">{price}/mo</p>
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-300">
                    {credits}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3 border-t border-zinc-200 p-5 dark:border-zinc-800 sm:flex-row">
              <Button as={Link} className="flex-1" to="/pricing" variant="accent">
                View pricing
              </Button>
              <Button className="flex-1" onClick={() => setUpgradeOpen(false)} variant="secondary">
                Not now
              </Button>
            </div>
          </Card>
        </div>
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200/80 bg-white/92 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-16px_40px_rgba(15,23,42,0.14)] backdrop-blur-2xl dark:border-zinc-800/80 dark:bg-zinc-950/92 md:hidden">
        <div className="mx-auto flex max-w-[520px] items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold uppercase tracking-[0.14em] text-zinc-600 dark:text-zinc-300">
              {file ? "Ready to analyze" : "Choose media first"}
            </p>
            <p className="truncate text-sm font-extrabold text-zinc-950 dark:text-white">
              {file ? `${platform} ${contentType}` : "Image or video"}
            </p>
          </div>
          <Button
            className="shrink-0"
            icon={WandSparkles}
            loading={loading}
            onClick={handleSubmit}
            variant="accent"
          >
            {loading ? "Analyzing" : "Generate"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default UploadAnalyze;
