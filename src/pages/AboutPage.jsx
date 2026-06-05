import { CheckCircle2, ShieldCheck, Sparkles, UploadCloud } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "../components/Button";
import Card from "../components/Card";
import PublicFooter from "../components/PublicFooter";
import PublicNavbar from "../components/PublicNavbar";

const values = [
  ["Private by default", "Uploads stay in your workspace and are never posted automatically.", ShieldCheck],
  ["Built for creators", "Reports are written for practical content decisions, not vanity metrics.", Sparkles],
  ["Workflow-first AI", "Upload once, then reuse captions, hooks, hashtags, rewrites, and reports.", UploadCloud]
];

const AboutPage = () => (
  <main className="min-h-dvh bg-cloud text-zinc-950 dark:bg-zinc-950 dark:text-white">
    <PublicNavbar />
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">About BoostPilot AI</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Content intelligence for creators who want clearer decisions.
        </h1>
        <p className="mt-4 text-base leading-8 text-zinc-700 dark:text-zinc-300">
          BoostPilot AI helps creators, marketers, and agencies turn images and videos into platform-ready captions, hooks, hashtags, quality checks, growth suggestions, saved content, and exportable reports.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button as={Link} to="/analyze" variant="accent">Start analysis</Button>
          <Button as={Link} to="/features" variant="secondary">Explore features</Button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {values.map(([title, text, Icon]) => (
          <Card className="p-5" key={title}>
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-zinc-950 text-white dark:bg-brand-400/20">
              <Icon size={20} />
            </div>
            <h2 className="text-xl font-extrabold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{text}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-5 p-5">
        <h2 className="text-2xl font-extrabold">What BoostPilot AI focuses on</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {[
            "Platform-specific recommendations for YouTube, Instagram, Facebook, LinkedIn, and X.",
            "Captions, hooks, hashtags, title ideas, and next-step suggestions.",
            "Media quality checks for image and video content.",
            "Private saved reports, Content Library reuse, and PDF exports."
          ].map((item) => (
            <div className="flex gap-3 text-sm font-semibold leading-6 text-zinc-700 dark:text-zinc-300" key={item}>
              <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-500" size={17} />
              {item}
            </div>
          ))}
        </div>
      </Card>
    </section>
    <PublicFooter />
  </main>
);

export default AboutPage;
