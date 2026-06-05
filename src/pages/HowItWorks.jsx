import { CheckCircle2, FileText, Library, LockKeyhole, ShieldCheck, Sparkles, UploadCloud, WandSparkles } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "../components/Button";
import PublicFooter from "../components/PublicFooter";
import PublicNavbar from "../components/PublicNavbar";
import { usePageMeta } from "../hooks/usePageMeta";

const steps = [
  "Create an account or continue with Google.",
  "Upload an image or video you want to improve.",
  "Select the platform where you will post.",
  "Select the content format. BoostPilot suggests a good option automatically.",
  "Click Generate Analysis.",
  "Review captions, hooks, hashtags, quality checks, and suggestions.",
  "Use AI Rewrite, Fix Weakness, Save to Library, or Export PDF."
];

const planGuide = [
  ["Free", "Basic analysis with limited credits."],
  ["Creator", "AI Rewrite Studio and Content Library."],
  ["Pro", "Trend Finder and Growth Coach."],
  ["Agency", "Higher limits, advanced workflows, and admin/team-ready usage."]
];

const faqs = [
  ["Is my uploaded media private?", "Yes. Uploaded media is stored for your account and is not posted anywhere."],
  ["Can I use Google login?", "Yes. You can use Google login or email login."],
  ["What platforms are supported?", "YouTube, Instagram, Facebook, LinkedIn, and Twitter/X."],
  ["Can I save content?", "Yes. Save captions, hooks, hashtags, rewrites, trend reports, and coach plans to the Content Library."],
  ["What happens after credits are used?", "You can upgrade your plan or wait for the next credit cycle."]
];

const HowItWorks = () => {
  usePageMeta({
    title: "How BoostPilot AI Works",
    description: "Learn how BoostPilot AI turns uploads into captions, hooks, hashtags, reports, and reusable content.",
    url: "https://boostpilotai.vercel.app/how-it-works"
  });

  return (
    <main className="min-h-dvh bg-cloud text-zinc-950 dark:bg-zinc-950 dark:text-white">
      <PublicNavbar />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-soft dark:border-zinc-700 dark:bg-zinc-900 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">How it works</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">BoostPilot AI in simple words</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-700 dark:text-zinc-300">
            BoostPilot AI helps you turn one uploaded image or video into better captions, hooks, hashtags, platform suggestions, quality checks, and exportable reports.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button as={Link} to="/" variant="secondary">Back to Home</Button>
            <Button as={Link} to="/analyze" variant="accent">Start analysis</Button>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-2">
          <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-zinc-950 text-white dark:bg-brand-400/20">
              <Sparkles size={20} />
            </div>
            <h2 className="text-2xl font-extrabold">Why should I use it?</h2>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
              {["Saves time", "Improves captions and hooks", "Helps choose hashtags", "Checks media quality", "Gives platform-specific suggestions", "Exports reports"].map((item) => (
                <li className="flex gap-2" key={item}>
                  <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-500" size={17} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-zinc-950 text-white dark:bg-brand-400/20">
              <UploadCloud size={20} />
            </div>
            <h2 className="text-2xl font-extrabold">How to use it</h2>
            <ol className="mt-4 grid gap-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
              {steps.map((step, index) => (
                <li className="flex gap-3" key={step}>
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-zinc-950 text-xs font-bold text-white dark:bg-brand-400/20">{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-zinc-950 text-white dark:bg-brand-400/20">
              <Library size={20} />
            </div>
            <h2 className="text-2xl font-extrabold">Plan guide</h2>
            <div className="mt-4 grid gap-3">
              {planGuide.map(([name, detail]) => (
                <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-950/60" key={name}>
                  <p className="font-extrabold">{name}</p>
                  <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-zinc-950 text-white dark:bg-brand-400/20">
              <ShieldCheck size={20} />
            </div>
            <h2 className="text-2xl font-extrabold">Trust and security</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ["Private media storage", LockKeyhole],
                ["Secure authentication", ShieldCheck],
                ["No auto posting", CheckCircle2],
                ["PDF reports", FileText],
                ["Google login supported", CheckCircle2],
                ["Save content safely", WandSparkles]
              ].map(([label, Icon]) => (
                <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/80 p-3 text-sm font-bold dark:border-zinc-800 dark:bg-zinc-950/60" key={label}>
                  <Icon className="text-emerald-500" size={17} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="text-2xl font-extrabold">FAQ</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {faqs.map(([question, answer]) => (
              <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-950/60" key={question}>
                <h3 className="font-extrabold">{question}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <PublicFooter />
    </main>
  );
};

export default HowItWorks;
