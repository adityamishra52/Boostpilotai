import { CheckCircle2, FileText, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { Outlet } from "react-router-dom";

import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";

const benefitCards = [
  ["Private uploads", "Your media stays in your workspace.", LockKeyhole],
  ["AI suggestions", "Captions, hooks, hashtags, and fixes.", Sparkles],
  ["Export reports", "Copy content or download a PDF.", FileText]
];

const trustBadges = ["Secure login", "Private uploads", "No social posting without permission"];
const platforms = ["YouTube", "Instagram", "Facebook", "LinkedIn", "Twitter/X"];

const AuthLayout = () => {
  return (
    <main className="min-h-dvh overflow-x-hidden bg-cloud text-zinc-950 dark:bg-zinc-950 dark:text-white">
      <div className="grid min-h-dvh lg:grid-cols-[55fr_45fr]">
        <section className="hidden min-h-dvh border-r border-zinc-200 bg-[linear-gradient(135deg,#09090b_0%,#111827_48%,#172554_100%)] p-10 text-white dark:border-zinc-800 lg:flex lg:flex-col lg:justify-between xl:p-12">
          <div>
            <div className="mb-10 flex items-start justify-between gap-6">
              <Logo inverse />
              <span className="shrink-0 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-extrabold text-white shadow-soft">
                Secure AI workspace
              </span>
            </div>

            <div className="max-w-4xl">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-brand-200">BoostPilot AI</p>
              <h1 className="max-w-4xl text-5xl font-extrabold leading-tight tracking-tight xl:text-6xl">
                Create better content from every upload.
              </h1>
              <p className="mt-6 max-w-3xl text-base font-medium leading-7 text-zinc-300 xl:text-lg xl:leading-8">
                Analyze images and videos, improve your copy, save your best ideas, and export reports for every major platform.
              </p>

              <div className="mt-8 grid max-w-3xl gap-3">
                {[
                  "Turn uploads into captions, hooks, hashtags, and reports",
                  "Get platform-specific suggestions before you post",
                  "Save reusable content in your private library"
                ].map((item) => (
                  <div className="flex items-center gap-3 text-sm font-bold text-zinc-100 xl:text-base" key={item}>
                    <CheckCircle2 className="shrink-0 text-emerald-300" size={20} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex max-w-3xl flex-wrap gap-2">
                {platforms.map((item) => (
                  <span className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-xs font-extrabold text-zinc-100" key={item}>
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-8 grid gap-3 xl:grid-cols-3">
                {benefitCards.map(([title, text, Icon]) => (
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
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-xs font-bold text-zinc-300">
            {trustBadges.map((item) => (
              <span className="inline-flex items-center gap-2" key={item}>
                <ShieldCheck size={15} className="text-emerald-300" />
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="flex min-h-dvh min-w-0 items-center justify-center bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] p-4 dark:bg-[linear-gradient(180deg,#050507_0%,#09090b_100%)] sm:p-6 lg:p-10">
          <div className="w-full max-w-[520px]">
            <div className="mb-6 flex items-center justify-between gap-3 lg:justify-end">
              <div className="lg:hidden">
                <Logo />
              </div>
              <ThemeToggle />
            </div>

            <Outlet />
          </div>
        </section>
      </div>
    </main>
  );
};

export default AuthLayout;
