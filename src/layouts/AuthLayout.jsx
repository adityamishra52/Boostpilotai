import { CheckCircle2, FileText, LockKeyhole, ShieldCheck, Sparkles, UploadCloud } from "lucide-react";
import { Outlet } from "react-router-dom";

import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";

const benefits = [
  "Turn uploads into captions, hooks, hashtags, and reports",
  "Get platform-specific suggestions before you post",
  "Save reusable content in your private library"
];

const platforms = ["YouTube", "Instagram", "Facebook", "LinkedIn", "Twitter/X"];

const featureCards = [
  ["Private uploads", "Stored for your account only", LockKeyhole],
  ["AI suggestions", "Captions, hooks, titles, hashtags", Sparkles],
  ["PDF reports", "Export a clean report anytime", FileText]
];

const AuthLayout = () => {
  return (
    <main className="min-h-screen bg-cloud text-zinc-950 dark:bg-zinc-950 dark:text-white">
      <div className="grid min-h-screen lg:h-screen lg:grid-cols-[minmax(0,3fr)_minmax(420px,2fr)] lg:overflow-hidden">
        <section className="relative hidden overflow-hidden border-r border-zinc-200 bg-[linear-gradient(135deg,#09090b_0%,#111827_52%,#172554_100%)] px-8 py-7 text-white dark:border-zinc-800 lg:flex lg:flex-col">
          <div className="relative z-10 flex items-center justify-between">
            <Logo inverse />
            <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-extrabold text-white">
              Secure AI workspace
            </div>
          </div>

          <div className="relative z-10 grid flex-1 items-center py-10">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-200">
                BoostPilot AI
              </p>
              <h1 className="mt-4 max-w-3xl text-5xl font-extrabold leading-tight tracking-tight xl:text-6xl">
                Create better content from every upload.
              </h1>
              <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-zinc-300">
                Analyze images and videos, improve your copy, save the best ideas, and export reports for every major platform.
              </p>

              <div className="mt-8 grid gap-3">
                {benefits.map((item) => (
                  <div className="flex items-center gap-3 text-sm font-bold text-zinc-100" key={item}>
                    <CheckCircle2 className="shrink-0 text-emerald-300" size={19} />
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {platforms.map((item) => (
                  <span className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-xs font-extrabold text-zinc-100" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-10 grid gap-4 xl:grid-cols-[1fr_0.85fr]">
            <div className="rounded-lg border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
              <div className="grid aspect-[16/9] place-items-center rounded-lg bg-gradient-to-br from-brand-400 via-signal to-coral">
                <UploadCloud size={48} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  ["4.9/5", "Creator rating"],
                  ["10k+", "Analyses"],
                  ["5", "Platforms"]
                ].map(([value, label]) => (
                  <div className="rounded-lg bg-white/10 p-3" key={label}>
                    <p className="text-lg font-extrabold">{value}</p>
                    <p className="mt-1 text-[11px] font-bold text-zinc-300">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-3">
              {featureCards.map(([title, text, Icon]) => (
                <div className="rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur-xl" key={title}>
                  <div className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-white text-zinc-950">
                    <Icon size={18} />
                  </div>
                  <p className="font-extrabold">{title}</p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-zinc-300">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-6 flex flex-wrap gap-3 text-xs font-bold text-zinc-300">
            {["Secure login", "Private uploads", "No social posting without permission"].map((item) => (
              <span className="inline-flex items-center gap-2" key={item}>
                <ShieldCheck size={15} className="text-emerald-300" />
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="min-h-screen min-w-0 overflow-y-auto px-4 py-5 sm:px-6 lg:h-screen lg:min-h-0 lg:px-8">
          <div className="mx-auto flex min-h-full w-full max-w-md flex-col">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="lg:hidden">
                <Logo />
              </div>
              <div className="ml-auto">
                <ThemeToggle />
              </div>
            </div>
            <div className="flex flex-1 items-center py-2">
              <Outlet />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AuthLayout;
