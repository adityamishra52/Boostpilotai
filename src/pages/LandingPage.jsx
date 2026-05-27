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
  ["GridFS media vault", "Authenticated image and video previews stay private to owners and admins.", ShieldCheck],
  ["Creative intelligence", "Captions, hooks, titles, CTAs, hashtags, and platform-fit scores in one run.", Sparkles],
  ["Export-ready reports", "History, admin oversight, and PDF reports are built into the production workflow.", FileText]
];

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const workspacePath = isAuthenticated ? "/dashboard" : "/register";

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Logo inverse />
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Button as={Link} to={isAuthenticated ? "/dashboard" : "/login"} variant="secondary">
            {isAuthenticated ? "Dashboard" : "Sign in"}
          </Button>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:pb-24 lg:pt-14">
        <div className="flex flex-col justify-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-300">
            AI content launch desk
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Turn every upload into platform-ready creative direction.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300">
            BoostPilot AI analyzes images and videos, stores private media in MongoDB GridFS,
            generates strategy, and keeps every report ready for your team.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button as={Link} icon={ArrowRight} size="lg" to={workspacePath} variant="accent">
              {isAuthenticated ? "Open workspace" : "Start free"}
            </Button>
            <Button as={Link} icon={PlayCircle} size="lg" to="/login" variant="secondary">
              View demo account
            </Button>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["Private", "JWT media access"],
              ["Fast", "GridFS streaming"],
              ["Ready", "PDF exports"]
            ].map(([value, label]) => (
              <div className="rounded-lg border border-white/10 bg-white/5 p-4" key={label}>
                <p className="text-lg font-extrabold">{value}</p>
                <p className="mt-1 text-xs text-zinc-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-900 shadow-2xl">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-coral" />
              <span className="h-2.5 w-2.5 rounded-full bg-brand-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-mint" />
              <span className="ml-auto text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                Signal studio
              </span>
            </div>
            <div className="grid gap-4 p-4 sm:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-lg border border-white/10 bg-black p-4">
                <div className="grid aspect-[4/5] place-items-center rounded-lg bg-brand-400">
                  <UploadCloud className="text-zinc-950" size={42} />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="font-extrabold">Media preview</p>
                    <p className="text-xs text-zinc-400">Owner-only access</p>
                  </div>
                  <LockKeyhole className="text-brand-300" size={20} />
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-zinc-300">Launch readiness</p>
                    <p className="text-3xl font-extrabold">92%</p>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-brand-400 via-signal to-coral" />
                  </div>
                </div>
                {["Caption angle", "Hook strength", "Technical quality"].map((item, index) => (
                  <div className="rounded-lg border border-white/10 bg-white/5 p-4" key={item}>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="text-mint" size={18} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">{item}</p>
                        <p className="text-xs text-zinc-400">
                          {index === 0 ? "Short-form ready" : index === 1 ? "Strong opening line" : "No blocking issues"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-extrabold">
                    <BarChart3 size={18} />
                    Report exports
                  </div>
                  <p className="text-sm leading-6 text-zinc-300">
                    Strategy, technical checks, and admin history stay aligned from upload to PDF.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
          {features.map(([title, text, Icon]) => (
            <div className="rounded-lg border border-white/10 bg-zinc-950/80 p-5" key={title}>
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-white text-zinc-950">
                <Icon size={20} />
              </div>
              <h2 className="text-lg font-extrabold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
