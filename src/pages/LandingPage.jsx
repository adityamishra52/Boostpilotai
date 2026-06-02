import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  LockKeyhole,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  UploadCloud
} from "lucide-react";
import { Link } from "react-router-dom";

import Button from "../components/Button";
import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";

const features = [
  [
    "Private uploads",
    "Only you and admins can view your images and videos.",
    ShieldCheck
  ],
  [
    "Post ideas",
    "Get captions, hooks, titles, hashtags, next steps, and scores in one report.",
    Sparkles
  ],
  [
    "Easy reports",
    "Save your history and download PDF reports when you need them.",
    FileText
  ]
];

const stats = [
  ["Private", "Safe media"],
  ["Fast", "Quick previews"],
  ["Ready", "PDF reports"]
];

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const workspacePath = isAuthenticated ? "/dashboard" : "/login?redirect=/dashboard";

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_32%),linear-gradient(180deg,#ffffff,#f8fafc)] text-slate-950 dark:bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_32%),linear-gradient(180deg,#05070b,#0b0f19)] dark:text-white">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Logo inverse={false} />

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Button
            as={Link}
            to={isAuthenticated ? "/dashboard" : "/login"}
            variant="secondary"
          >
            {isAuthenticated ? "Dashboard" : "Sign in"}
          </Button>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:pb-24 lg:pt-14">
        <div className="flex flex-col justify-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-600 dark:text-brand-300">
            AI post helper
          </p>

          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-6xl dark:text-white">
            Turn every upload into better posts.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-zinc-300">
            BoostPilot AI checks your images and videos, suggests better text, and saves a report you can download.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button as={Link} icon={ArrowRight} size="lg" to={workspacePath} variant="accent">
              Open app
            </Button>

            <Button as={Link} icon={PlayCircle} size="lg" to="/analyze" variant="secondary">
              Check content
            </Button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {stats.map(([value, label]) => (
              <div
                className="rounded-xl border border-slate-200 bg-white/95 p-4 text-slate-950 shadow-sm backdrop-blur"
                key={label}
              >
                <p className="text-lg font-extrabold text-slate-950">{value}</p>
                <p className="mt-1 text-xs font-bold text-slate-700">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/85 shadow-2xl backdrop-blur dark:border-white/10 dark:bg-zinc-900/90">
            <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-white/10">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />

              <span className="ml-auto text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-zinc-300">
                Creator tools
              </span>
            </div>

            <div className="grid gap-4 p-4 sm:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-xl border border-slate-200 bg-slate-950 p-4 text-white dark:border-white/10 dark:bg-black">
                <div className="grid aspect-[4/5] place-items-center rounded-xl bg-cyan-400">
                  <UploadCloud className="text-slate-950" size={42} />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="font-extrabold">Media preview</p>
                    <p className="text-xs text-zinc-400">Private view</p>
                  </div>
                  <LockKeyhole className="text-cyan-300" size={20} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4 text-slate-950 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-extrabold text-slate-700">
                      Ready to post
                    </p>
                    <p className="text-3xl font-extrabold text-slate-950">92%</p>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-orange-500" />
                  </div>
                </div>

                {["Caption idea", "Opening line", "File quality"].map((item, index) => (
                  <div
                    className="rounded-xl border border-slate-200 bg-white p-4 text-slate-950 shadow-sm"
                    key={item}
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="text-emerald-500" size={18} />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold text-slate-950">
                          {item}
                        </p>
                        <p className="text-xs font-bold text-slate-700">
                          {index === 0
                            ? "Ready for short posts"
                            : index === 1
                            ? "Strong first line"
                            : "No big problems"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="rounded-xl border border-slate-200 bg-white p-4 text-slate-950 shadow-sm">
                  <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-950">
                    <BarChart3 size={18} />
                    Report downloads
                  </div>

                  <p className="text-sm font-semibold leading-6 text-slate-700">
                    Save your suggestions and download a clean PDF report.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white/60 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
          {features.map(([title, text, Icon]) => (
            <div
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-zinc-950/80"
              key={title}
            >
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-slate-950 text-white dark:bg-white dark:text-zinc-950">
                <Icon size={20} />
              </div>

              <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">{title}</h2>

              <p className="mt-2 text-sm font-medium leading-6 text-slate-600 dark:text-zinc-300">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
