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
    <main className="min-h-screen overflow-x-hidden bg-cloud text-zinc-950 dark:bg-zinc-950 dark:text-white lg:h-screen lg:overflow-hidden">
      <div className="grid min-h-screen lg:h-screen lg:grid-cols-[58fr_42fr] lg:overflow-hidden">
        <section className="hidden min-h-0 overflow-hidden border-r border-zinc-200 bg-[linear-gradient(135deg,#09090b_0%,#111827_48%,#172554_100%)] px-8 py-7 text-white dark:border-zinc-800 lg:flex lg:h-screen lg:flex-col">
          <div className="flex shrink-0 items-center justify-between gap-4">
            <Logo inverse />
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-extrabold text-white">
              Secure AI workspace
            </span>
          </div>

          <div className="grid min-h-0 flex-1 content-center py-6">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-200">BoostPilot AI</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight xl:text-5xl">
              Create better content from every upload.
            </h1>
            <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-zinc-300">
              Analyze images and videos, improve your copy, save your best ideas, and export reports for every major platform.
            </p>

            <div className="mt-6 grid max-w-3xl gap-3">
              {[
                "Turn uploads into captions, hooks, hashtags, and reports",
                "Get platform-specific suggestions before you post",
                "Save reusable content in your private library"
              ].map((item) => (
                <div className="flex items-center gap-3 text-sm font-bold text-zinc-100" key={item}>
                  <CheckCircle2 className="shrink-0 text-emerald-300" size={19} />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-7 flex max-w-3xl flex-wrap gap-2">
              {platforms.map((item) => (
                <span className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-xs font-extrabold text-zinc-100" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid shrink-0 gap-3 xl:grid-cols-3">
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

          <div className="mt-5 flex shrink-0 flex-wrap gap-3 text-xs font-bold text-zinc-300">
            {trustBadges.map((item) => (
              <span className="inline-flex items-center gap-2" key={item}>
                <ShieldCheck size={15} className="text-emerald-300" />
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="min-h-screen min-w-0 overflow-y-auto bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-4 py-5 dark:bg-[linear-gradient(180deg,#050507_0%,#09090b_100%)] sm:px-6 lg:h-screen lg:min-h-0 lg:px-8">
          <div className="mx-auto flex min-h-full w-full max-w-[520px] flex-col">
            <div className="mb-5 flex shrink-0 items-center justify-between gap-3">
              <div className="lg:hidden">
                <Logo />
              </div>
              <div className="ml-auto">
                <ThemeToggle />
              </div>
            </div>

            <div className="flex flex-1 items-center py-3">
              <Outlet />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AuthLayout;
