import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  FileText,
  Library,
  LockKeyhole,
  MessageCircle,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  WandSparkles
} from "lucide-react";
import { Link } from "react-router-dom";

import Button from "../components/Button";
import PublicFooter from "../components/PublicFooter";
import PublicNavbar from "../components/PublicNavbar";
import { useAuth } from "../context/AuthContext";
import { usePageMeta } from "../hooks/usePageMeta";
import { plans } from "../utils/plans";

const workflow = [
  ["Upload", "Add an image or video you want to improve.", UploadCloud],
  ["Choose Platform", "Pick YouTube, Instagram, Facebook, LinkedIn, or Twitter/X.", PlayCircle],
  ["Get AI Suggestions", "Generate captions, hooks, hashtags, and fixes.", Sparkles],
  ["Improve", "Rewrite, fix weak points, and save useful text.", WandSparkles],
  ["Export", "Copy content or download a clean PDF report.", FileText]
];

const valueCards = [
  ["What is BoostPilot AI?", "A simple tool that turns your uploaded media into platform-ready post ideas, captions, hooks, hashtags, and reports.", BookOpen],
  ["Why use it?", "Save time, improve your wording, check media quality, and choose the right content format before you publish.", CheckCircle2],
  ["Who is it for?", "Creators, founders, marketers, coaches, small teams, and agencies that want faster content decisions.", BarChart3]
];

const platformList = ["YouTube", "Instagram", "Facebook", "LinkedIn", "Twitter/X"];

const faqs = [
  ["Is my uploaded media private?", "Yes. Your uploads are tied to your account and are not posted to social platforms."],
  ["Can I use Google login?", "Yes. You can sign in with Google or email."],
  ["Can I save generated text?", "Yes. Creator and higher plans include the Content Library."],
  ["What happens when credits run out?", "You can upgrade your plan or wait for your next credit cycle."]
];

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const startPath = isAuthenticated ? "/analyze" : "/register?redirect=/analyze";
  usePageMeta({
    title: "BoostPilot AI - AI Content Optimization",
    description: "Analyze uploads, improve captions, save content, and export reports for every major social platform.",
    url: "https://boostpilotai.vercel.app/"
  });

  return (
    <main className="min-h-screen overflow-x-hidden bg-cloud text-zinc-950 dark:bg-zinc-950 dark:text-white">
      <PublicNavbar />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-14">
        <div className="flex flex-col justify-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">
            AI content optimization
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Turn any image or video into platform-ready content.
          </h1>
          <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-zinc-700 dark:text-zinc-300">
            BoostPilot AI analyzes your content and generates captions, hooks, hashtags, growth suggestions, and reports for YouTube, Instagram, Facebook, LinkedIn, and Twitter/X.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button as={Link} icon={ArrowRight} size="lg" to={startPath} variant="accent">
              Start Free
            </Button>
            <Button as={Link} icon={PlayCircle} size="lg" to="/how-it-works" variant="secondary">
              See How It Works
            </Button>
          </div>
          <div className="mt-7 flex flex-wrap gap-2">
            {["Private uploads", "No auto posting", "PDF export", "Save content"].map((item) => (
              <span className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-extrabold text-zinc-700 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white/92 p-4 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900/92">
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-lg bg-zinc-950 p-4 text-white">
              <div className="grid aspect-[4/5] place-items-center rounded-lg bg-gradient-to-br from-brand-400 via-signal to-coral">
                <UploadCloud size={52} />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="font-extrabold">Uploaded media</p>
                  <p className="text-xs font-semibold text-zinc-300">Private preview</p>
                </div>
                <LockKeyhole className="text-brand-200" size={20} />
              </div>
            </div>
            <div className="space-y-3">
              {[
                ["Suggested caption", "Clearer, shorter, ready to copy", MessageCircle],
                ["Opening hook", "Stronger first line for attention", Sparkles],
                ["Hashtags", "#CreatorGrowth #ContentTips #Marketing", Library],
                ["Report", "Score, fixes, and export-ready PDF", FileText]
              ].map(([title, text, Icon]) => (
                <div className="rounded-lg border border-zinc-200 bg-zinc-50/90 p-4 dark:border-zinc-700 dark:bg-zinc-950/70" key={title}>
                  <div className="flex items-start gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-zinc-950 text-white dark:bg-brand-400/20">
                      <Icon size={17} />
                    </div>
                    <div>
                      <p className="font-extrabold">{title}</p>
                      <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-white/70 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">Workflow</p>
              <h2 className="mt-2 text-3xl font-extrabold">Upload to export in five steps</h2>
            </div>
            <Button as={Link} to="/how-it-works" variant="secondary">Read full guide</Button>
          </div>
          <div className="grid gap-3 md:grid-cols-5">
            {workflow.map(([title, text, Icon], index) => (
              <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-950" key={title}>
                <div className="mb-4 flex items-center justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-zinc-950 text-white dark:bg-brand-400/20">
                    <Icon size={18} />
                  </div>
                  <span className="text-xs font-extrabold text-zinc-500">0{index + 1}</span>
                </div>
                <h3 className="font-extrabold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {valueCards.map(([title, text, Icon]) => (
            <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900" key={title}>
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-zinc-950 text-white dark:bg-brand-400/20">
                <Icon size={20} />
              </div>
              <h2 className="text-xl font-extrabold">{title}</h2>
              <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
            <h2 className="text-xl font-extrabold">Supported platforms</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">Choose where you want to post and BoostPilot adapts the suggestions.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {platformList.map((item) => <span className="rounded-lg bg-zinc-100 px-3 py-2 text-sm font-bold dark:bg-zinc-800" key={item}>{item}</span>)}
            </div>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
            <h2 className="text-xl font-extrabold">Trust and security</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {["Uploaded media is private", "Stored securely", "Only owner/admin can access", "No social posting without permission"].map((item) => (
                <div className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-200" key={item}>
                  <ShieldCheck className="text-emerald-500" size={17} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-white/70 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">Plans</p>
              <h2 className="mt-2 text-3xl font-extrabold">Choose the right plan</h2>
            </div>
            <Button as={Link} to="/pricing" variant="accent">View pricing</Button>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            {plans.map((plan) => (
              <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-950" key={plan.id}>
                <p className="font-extrabold">{plan.name}</p>
                <p className="mt-2 text-2xl font-extrabold">{plan.monthlyPrice}</p>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{plan.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">FAQ</p>
          <h2 className="mt-2 text-3xl font-extrabold">Questions beginners ask</h2>
        </div>
        <div className="grid gap-3">
          {faqs.map(([question, answer]) => (
            <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900" key={question}>
              <h3 className="font-extrabold">{question}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{answer}</p>
            </div>
          ))}
        </div>
      </section>
      <PublicFooter />
    </main>
  );
};

export default LandingPage;
