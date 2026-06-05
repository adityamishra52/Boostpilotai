import { CheckCircle2, FileText, Image, Library, RefreshCw, ShieldCheck, Sparkles, TrendingUp, WandSparkles } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "../components/Button";
import Card from "../components/Card";
import PublicFooter from "../components/PublicFooter";
import PublicNavbar from "../components/PublicNavbar";
import { usePageMeta } from "../hooks/usePageMeta";

const features = [
  ["AI analysis reports", "Turn uploads into platform-ready scores, fixes, captions, hooks, hashtags, and exports.", FileText],
  ["AI Rewrite Studio", "Rewrite captions or copy for clearer tone, stronger hooks, and better fit.", RefreshCw],
  ["Content Library", "Save captions, hooks, titles, hashtags, rewrites, coach plans, and trend reports.", Library],
  ["Trend Finder", "Generate platform-specific trend directions before you spend time producing.", TrendingUp],
  ["Growth Coach", "Create practical growth plans for creator goals, posting habits, and content strategy.", WandSparkles],
  ["Media Enhancer", "Review media quality and apply creator-focused improvement suggestions.", Image]
];

const trust = ["Private uploads", "Secure login", "No auto posting without permission", "PDF export", "Google login", "Admin-managed plans"];

const FeaturesPage = () => {
  usePageMeta({
    title: "BoostPilot AI Features",
    description: "Explore BoostPilot AI features including analysis reports, AI Rewrite, Content Library, Trend Finder, Growth Coach, and Media Enhancer.",
    url: "https://boostpilotai.vercel.app/features"
  });

  return (
    <main className="min-h-dvh bg-cloud text-zinc-950 dark:bg-zinc-950 dark:text-white">
      <PublicNavbar />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">Features</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            A premium AI workspace for better creator decisions.
          </h1>
          <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-zinc-700 dark:text-zinc-300">
            BoostPilot brings analysis, rewrite, trends, coaching, saved content, and export workflows into one private product.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button as={Link} icon={Sparkles} size="lg" to="/register?redirect=/analyze" variant="accent">
              Start Free
            </Button>
            <Button as={Link} size="lg" to="/how-it-works" variant="secondary">
              See workflow
            </Button>
          </div>
        </div>
        <Card className="!bg-zinc-950 text-white dark:!bg-zinc-900">
          <div className="grid gap-3 sm:grid-cols-2">
            {trust.map((item) => (
              <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/10 p-3 text-sm font-bold" key={item}>
                <ShieldCheck size={17} className="text-emerald-300" />
                {item}
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {features.map(([title, text, Icon]) => (
            <Card className="transition hover:-translate-y-0.5 hover:shadow-glow" key={title}>
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-zinc-950 text-white dark:bg-brand-400/20">
                <Icon size={20} />
              </div>
              <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white">{title}</h2>
              <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-white/70 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
          {["Upload privately", "Improve with AI", "Reuse and export"].map((title, index) => (
            <div className="flex gap-3" key={title}>
              <CheckCircle2 className="mt-1 shrink-0 text-emerald-500" size={20} />
              <div>
                <h3 className="font-extrabold">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  {index === 0 ? "Your media stays in your workspace." : index === 1 ? "Get practical suggestions for every major platform." : "Save winning content and download clean reports."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <PublicFooter />
    </main>
  );
};

export default FeaturesPage;
