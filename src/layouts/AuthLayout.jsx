import { Outlet } from "react-router-dom";

import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";

const AuthLayout = () => {
  return (
    <main className="premium-grid min-h-screen bg-cloud text-zinc-950 dark:bg-zinc-950 dark:text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-8 px-4 py-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <section className="surface relative hidden overflow-hidden rounded-lg p-8 lg:flex lg:flex-col lg:justify-between">
          <Logo />
          <div className="max-w-xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-brand-600 dark:text-brand-300">
              AI content command center
            </p>
            <h1 className="text-5xl font-extrabold leading-tight">
              Convert every creative asset into a sharper growth play.
            </h1>
            <p className="mt-5 text-base leading-7 text-zinc-600 dark:text-zinc-400">
              Upload a video or image, choose a platform, and get captions, hooks, tags,
              titles, CTAs, engagement guidance and a score saved to your workspace.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["Captions", "Hooks", "Scores"].map((item, index) => (
              <div
                className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60"
                key={item}
              >
                <p className="text-2xl font-extrabold">{index === 0 ? "8x" : index === 1 ? "12" : "94"}</p>
                <p className="mt-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col">
          <div className="mb-8 flex items-center justify-between lg:justify-end">
            <div className="lg:hidden">
              <Logo />
            </div>
            <ThemeToggle />
          </div>
          <div className="mx-auto flex w-full max-w-md flex-1 items-center">
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  );
};

export default AuthLayout;
