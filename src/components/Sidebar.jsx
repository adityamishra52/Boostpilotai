import {
  BarChart3,
  Clock,
  CreditCard,
  Crown,
  LayoutDashboard,
  LogOut,
  Radio,
  Settings,
  ShieldCheck,
  UploadCloud,
  X
} from "lucide-react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";

import { useAuth } from "../context/AuthContext";
import Badge from "./Badge";
import Logo from "./Logo";
import Button from "./Button";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Analyze", to: "/analyze", icon: UploadCloud },
  { label: "History", to: "/history", icon: Clock },
  { label: "Pricing", to: "/pricing", icon: CreditCard },
  { label: "Settings", to: "/settings", icon: Settings }
];

const Sidebar = ({ open, onClose }) => {
  const { logout, user } = useAuth();

  return (
    <>
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-zinc-950/55 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden="true"
        onClick={onClose}
      />

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex h-screen h-dvh max-h-dvh w-[288px] max-w-[86vw] flex-col overflow-hidden border-r border-zinc-200 bg-white shadow-2xl transition-transform duration-300 will-change-transform dark:border-zinc-800 dark:bg-zinc-950 lg:static lg:z-auto lg:h-full lg:max-h-none lg:w-[280px] lg:min-w-[280px] lg:max-w-[280px] lg:translate-x-0 lg:shadow-none",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Primary navigation"
        aria-modal={open ? "true" : undefined}
        role={open ? "dialog" : "navigation"}
      >
        <div className="shrink-0 p-4 pb-3">
          <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
            <Logo />
            <Button
              aria-label="Close navigation"
              className="h-12 w-12 rounded-xl border border-zinc-200 bg-white px-0 text-zinc-800 shadow-sm hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 lg:hidden [&>svg]:h-5 [&>svg]:w-5"
              icon={X}
              onClick={onClose}
              variant="secondary"
            />
          </div>
        </div>

        <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-4 pb-4">
          <div className="rounded-xl border border-zinc-200 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 p-4 text-white shadow-soft dark:border-zinc-800">
            <div className="mb-5 flex items-center justify-between">
              <Badge className="bg-white/10 text-white ring-white/15" variant="neutral">
                <Radio size={12} />
                Live
              </Badge>
              <ShieldCheck size={17} className="text-brand-200" />
            </div>
            <p className="text-lg font-extrabold tracking-tight">AI analysis desk</p>
            <p className="mt-2 text-xs leading-5 text-zinc-300">
              Media quality, captions, hooks, and reports in one workflow.
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-signal text-sm font-extrabold text-white shadow-lg">
                {user?.name?.charAt(0)?.toUpperCase() || "B"}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-zinc-950 dark:text-white">
                  {user?.name || "BoostPilot User"}
                </p>
                <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {user?.email || "user@boostpilot.ai"}
                </p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="min-w-0 rounded-xl border border-zinc-200 bg-white/75 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950/50">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">
                  Credits
                </p>
                <p className="mt-1 truncate text-lg font-extrabold text-zinc-950 dark:text-white">
                  {user?.credits ?? 0}
                </p>
              </div>

              <div className="min-w-0 rounded-xl border border-zinc-200 bg-white/75 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950/50">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">
                  Plan
                </p>
                <p className="mt-1 truncate text-lg font-extrabold text-zinc-950 dark:text-white">
                  {user?.plan || "Free"}
                </p>
                <p className="truncate text-[10px] capitalize text-zinc-500">
                  {user?.billingCycle || "monthly"}
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 px-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-zinc-700 dark:text-zinc-200">
            Workspace
          </p>

          <nav className="mt-2 space-y-1 pb-3">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition",
                      isActive
                        ? "bg-zinc-950 text-white shadow-soft dark:bg-white dark:text-zinc-950"
                        : "text-zinc-800 hover:translate-x-0.5 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900 dark:hover:text-white"
                    )
                  }
                  end={item.to === "/dashboard"}
                  key={item.to}
                  onClick={onClose}
                  to={item.to}
                >
                  <Icon className="shrink-0" size={19} />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}

            {user?.role === "admin" && (
              <NavLink
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition",
                    isActive
                      ? "bg-zinc-950 text-white shadow-soft dark:bg-white dark:text-zinc-950"
                      : "text-zinc-800 hover:translate-x-0.5 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900 dark:hover:text-white"
                  )
                }
                onClick={onClose}
                to="/admin/dashboard"
              >
                <Crown className="shrink-0" size={19} />
                <span className="truncate">Admin</span>
              </NavLink>
            )}
          </nav>
        </div>

        <div className="shrink-0 border-t border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-zinc-950 dark:text-white">
              <BarChart3 className="shrink-0" size={18} />
              <span className="truncate">Output quality</span>
            </div>
            <p className="line-clamp-2 text-xs leading-5 text-zinc-600 dark:text-zinc-300">
              Gemini, technical checks, history, and PDF exports are wired together.
            </p>
            <Button className="mt-4 w-full" icon={LogOut} onClick={logout} variant="secondary">
              Sign out
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
