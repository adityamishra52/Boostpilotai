import { CheckCircle2, Copy, CreditCard, FileUp, Gauge, LockKeyhole, WandSparkles, X } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Badge from "../components/Badge";
import Button from "../components/Button";
import Card from "../components/Card";
import ContentTypeSelector, { contentTypesByPlatform } from "../components/ContentTypeSelector";
import FileDropzone from "../components/FileDropzone";
import GoogleAuthButton from "../components/GoogleAuthButton";
import PageHeader from "../components/PageHeader";
import PlatformSelector from "../components/PlatformSelector";
import ProgressBar from "../components/ProgressBar";
import SectionContainer from "../components/SectionContainer";
import { useAuth } from "../context/AuthContext";
import { analysisService } from "../services/analysisService";
import {
  clearGuestAnalysisDraft,
  getGuestAnalysisDraft,
  saveGuestAnalysisDraft
} from "../utils/guestAnalysisDraft";

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
    ? ["Video Post", "Video", "Reel", "Short", "Story"]
    : selectedFile?.type?.startsWith("image/")
      ? ["Image Post", "Post", "Thumbnail", "Carousel"]
      : ["Single Tweet", "Post", "Video"];

  return mediaPreference.find((item) => options.includes(item)) || options[0];
};

const UploadAnalyze = () => {
  const { isAuthenticated, loginWithGoogle, updateUser, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const defaultPlatform = user?.preferences?.defaultPlatform || "Instagram";
  const [file, setFile] = useState(null);
  const [platform, setPlatform] = useState(defaultPlatform);
  const [contentType, setContentType] = useState(getPreferredContentType(defaultPlatform));
  const [loading, setLoading] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [loginRequiredOpen, setLoginRequiredOpen] = useState(false);
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [draftChecked, setDraftChecked] = useState(false);
  const [reuseItem, setReuseItem] = useState(location.state?.libraryItem || null);

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

  const submitAnalysis = async (selectedFile = file) => {
    if (!selectedFile) {
      toast.error("Choose a file before analyzing");
      return;
    }

    if ((user?.credits ?? 0) <= 0) {
      setUpgradeOpen(true);
      return;
    }

    setLoading(true);
    toast.loading("Creating your report. You can keep using BoostPilot while it works.", {
      id: "report-generation"
    });

    try {
      const data = await analysisService.analyze({ file: selectedFile, platform, contentType });
      if (data.user) {
        updateUser(data.user);
      }
      await clearGuestAnalysisDraft();
      toast.success("Report ready", { id: "report-generation" });
      navigate(`/results/${data.analysis._id}`, { state: { analysis: data.analysis } });
    } catch (error) {
      if (error.response?.status === 402) {
        setUpgradeOpen(true);
      }
      toast.error(error.response?.data?.message || "Report failed. Please try again.", {
        id: "report-generation"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveCurrentDraft = async () => {
    const draft = await saveGuestAnalysisDraft({
      file,
      platform,
      contentType,
      selectedOptions: {},
      formState: { platform, contentType }
    });

    if (file && !draft.fileSaved) {
      toast("Your selections were saved. Please select the file again after sign-in.");
    }

    return draft;
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Choose a file before analyzing");
      return;
    }

    if (!isAuthenticated) {
      await saveCurrentDraft();
      setLoginRequiredOpen(true);
      return;
    }

    await submitAnalysis(file);
  };

  const restoreDraft = async () => {
    const draft = await getGuestAnalysisDraft();

    if (!draft) {
      return null;
    }

    if (draft.platform) {
      setPlatform(draft.platform);
    }

    if (draft.contentType) {
      setContentType(draft.contentType);
    }

    if (draft.file) {
      setFile(draft.file);
    } else if (draft.fileMetadata) {
      toast("Your selections were restored. Please select the file again to continue.");
    }

    return draft;
  };

  const continueWithEmail = (path) => {
    setLoginRequiredOpen(false);
    navigate(`${path}?redirect=${encodeURIComponent("/analyze?continueDraft=1")}`);
  };

  const handleGoogle = async (credential) => {
    setGoogleLoading(true);

    try {
      await loginWithGoogle(credential);
      setLoginRequiredOpen(false);
      await restoreDraft();
      setRestoreOpen(true);
      toast.success("Signed in with Google");
    } catch (error) {
      toast.error(error.response?.data?.message || "Google sign-in failed. Please try again or use email login.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const copyReuseContent = async () => {
    await navigator.clipboard.writeText(reuseItem.content);
    toast.success("Copied");
  };

  const handleContinueDraft = async () => {
    setRestoreOpen(false);
    await submitAnalysis(file);
  };

  useEffect(() => {
    let mounted = true;

    const checkDraft = async () => {
      if (!isAuthenticated || draftChecked) {
        return;
      }

      const params = new URLSearchParams(location.search);
      const shouldContinue = params.get("continueDraft") === "1";
      const draft = await restoreDraft();

      if (mounted && draft && (shouldContinue || draft.fileSaved || draft.fileMetadata)) {
        setRestoreOpen(true);
      }

      if (mounted) {
        setDraftChecked(true);
      }
    };

    checkDraft();

    return () => {
      mounted = false;
    };
  }, [draftChecked, isAuthenticated, location.search]);

  useEffect(() => {
    if (reuseItem) {
      return;
    }

    try {
      const saved = JSON.parse(sessionStorage.getItem("boostpilot_reuse_library_item") || "null");
      if (saved?._id) {
        setReuseItem(saved);
      }
    } catch {
      sessionStorage.removeItem("boostpilot_reuse_library_item");
    }
  }, [reuseItem]);

  const readiness = [file ? 34 : 0, platform ? 33 : 0, contentType ? 33 : 0].reduce(
    (sum, item) => sum + item,
    0
  );
  const workflowSteps = [
    ["Upload file", Boolean(file)],
    ["Choose site", Boolean(platform)],
    ["Choose post type", Boolean(contentType)],
    ["Generate Analysis", loading || readiness === 100]
  ];

  return (
    <motion.div animate={{ opacity: 1, y: 0 }} className="pb-28 md:pb-0" initial={{ opacity: 0, y: 10 }}>
      <PageHeader
        action={<Badge variant={file ? "success" : "warning"}>{file ? "Asset ready" : "Awaiting media"}</Badge>}
        description="Upload an image or video, choose where you will post it, then get easy suggestions."
        eyebrow="Analyze"
        title="Generate a content analysis"
      />

      <div className="mx-auto max-w-5xl space-y-5">
        <Card className="p-4 sm:p-5">
          <div className="grid gap-3 md:grid-cols-4">
            {workflowSteps.map(([label, done], index) => (
              <div
                className={`rounded-lg border p-3 transition ${
                  done
                    ? "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100"
                    : "border-zinc-200 bg-white/80 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-300"
                }`}
                key={label}
              >
                <p className="text-xs font-bold uppercase tracking-[0.14em]">Step {index + 1}</p>
                <p className="mt-1 text-sm font-extrabold">{label}</p>
              </div>
            ))}
          </div>
          <ProgressBar className="mt-4" value={readiness} />
        </Card>

        <div className="space-y-5">
          {reuseItem && (
            <Card className="p-4 sm:p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-300">
                    Reusing saved content
                  </p>
                  <h2 className="mt-1 break-words text-lg font-extrabold text-zinc-950 dark:text-white">
                    {reuseItem.title || reuseItem.type || "Saved content"}
                  </h2>
                  <p className="mt-2 max-h-36 overflow-auto whitespace-pre-line rounded-lg border border-zinc-200 bg-zinc-50/80 p-3 text-sm leading-6 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-200">
                    {reuseItem.content}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button icon={Copy} onClick={copyReuseContent} variant="secondary">
                    Copy
                  </Button>
                  <Button
                    icon={X}
                    onClick={() => {
                      setReuseItem(null);
                      sessionStorage.removeItem("boostpilot_reuse_library_item");
                    }}
                    variant="secondary"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <SectionContainer description="Upload an image or video you want to improve." icon={FileUp} title="Step 1: Upload Media">
            <FileDropzone file={file} onFile={handleFile} />
          </SectionContainer>

          <SectionContainer description="Choose where you want to post it." icon={Gauge} title="Step 2: Choose Platform">
            <PlatformSelector onChange={handlePlatformChange} value={platform} />
          </SectionContainer>

          <SectionContainer description="We'll suggest the best content format automatically when possible." icon={CheckCircle2} title="Step 3: Choose Content Format">
            <ContentTypeSelector onChange={setContentType} platform={platform} value={contentType} />
          </SectionContainer>

          <Card className="overflow-hidden p-0">
            <div className="grid gap-0 lg:grid-cols-[1fr_auto]">
              <div className="min-w-0 p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
                  Step 4: Generate Analysis
                </p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                  Ready to check
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  BoostPilot will check your media and suggest captions, opening lines, hashtags, fixes, and a report.
                </p>
                {loading && (
                  <div className="mt-4 rounded-lg border border-cyan-200 bg-cyan-50/90 p-4 text-sm font-semibold leading-6 text-cyan-950 dark:border-cyan-900/60 dark:bg-cyan-950/30 dark:text-cyan-100">
                    We are creating your report in the background. This can take a little while, and your report will open automatically when it is ready.
                  </div>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant={file ? "success" : "warning"}>{file ? "Media selected" : "Media needed"}</Badge>
                  <Badge variant="brand">{platform}</Badge>
                  <Badge>{contentType}</Badge>
                </div>
              </div>
              <div className="flex min-w-[240px] flex-col justify-center border-t border-zinc-200 bg-zinc-50/90 p-5 dark:border-zinc-800 dark:bg-zinc-900/70 lg:border-l lg:border-t-0">
                <Button
                  className="w-full"
                  icon={WandSparkles}
                  loading={loading}
                  onClick={handleSubmit}
                  size="lg"
                  variant="accent"
                >
                  {loading ? "Creating report..." : "Generate Analysis"}
                </Button>
                <p className="mt-3 text-center text-xs font-semibold leading-5 text-zinc-600 dark:text-zinc-300">
                  {loading ? "You can continue using BoostPilot while this runs." : "We check sign-in and credits when you start."}
                </p>
              </div>
            </div>
          </Card>

          {loading && (
            <Card>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 animate-ping rounded-full bg-brand-400" />
                <div>
                  <p className="text-sm font-bold text-zinc-950 dark:text-white">Creating your report</p>
                  <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                    We are checking the file, writing suggestions, and saving the result for you.
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-4">
                {["File details", "Media review", "Post fit", "Report writing"].map((item, index) => (
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
                  You have 0 report credits. Choose a plan to create more reports.
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
                ["Creator", "Rs 349", "50 credits"],
                ["Pro", "Rs 999", "200 credits"],
                ["Agency", "Rs 1499", "1000 credits"]
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

      {loginRequiredOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/60 px-4 backdrop-blur-sm">
          <Card className="w-full max-w-lg p-0">
            <div className="flex items-start justify-between border-b border-zinc-200 p-5 dark:border-zinc-800">
              <div>
                <div className="mb-3 grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br from-brand-500 via-signal to-coral text-white shadow-glow">
                  <LockKeyhole size={22} />
                </div>
                <h2 className="text-2xl font-extrabold text-zinc-950 dark:text-white">
                  Sign in to create your report
                </h2>
                <p className="mt-2 text-sm font-medium leading-6 text-zinc-600 dark:text-zinc-300">
                  Your upload and selections are saved. Sign in to continue without losing progress.
                </p>
              </div>
              <button
                className="grid h-10 w-10 place-items-center rounded-lg text-zinc-700 transition hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300/35 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:focus-visible:ring-brand-400/25"
                onClick={() => setLoginRequiredOpen(false)}
                type="button"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 p-5">
              <GoogleAuthButton disabled={googleLoading} onSuccess={handleGoogle} />
              <Button className="w-full" onClick={() => continueWithEmail("/login")} variant="secondary">
                Sign in with email
              </Button>
              <Button className="w-full" onClick={() => continueWithEmail("/register")} variant="secondary">
                Create account
              </Button>
              <Button className="w-full" onClick={() => setLoginRequiredOpen(false)} variant="ghost">
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {restoreOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/60 px-4 backdrop-blur-sm">
          <Card className="w-full max-w-md p-0">
            <div className="border-b border-zinc-200 p-5 dark:border-zinc-800">
              <div className="mb-3 grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br from-brand-500 via-signal to-coral text-white shadow-glow">
                <WandSparkles size={22} />
              </div>
              <h2 className="text-2xl font-extrabold text-zinc-950 dark:text-white">Continue your report?</h2>
              <p className="mt-2 text-sm font-medium leading-6 text-zinc-600 dark:text-zinc-300">
                Your saved upload and selections are ready to continue.
              </p>
            </div>
            <div className="flex flex-col gap-3 p-5 sm:flex-row">
              <Button className="flex-1" disabled={!file} loading={loading} onClick={handleContinueDraft} variant="accent">
                Continue
              </Button>
              <Button
                className="flex-1"
                onClick={async () => {
                  setRestoreOpen(false);
                  await clearGuestAnalysisDraft();
                }}
                variant="secondary"
              >
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
              {file ? "Ready for analysis" : "Choose media first"}
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
            {loading ? "Creating" : "Analyze"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default UploadAnalyze;
