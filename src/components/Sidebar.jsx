import {
  BarChart3,
  Clock,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Crown,
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
          "fixed inset-0 z-30 bg-zinc-950/40 backdrop-blur-sm transition lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-zinc-200/80 bg-white/88 p-4 shadow-soft backdrop-blur-2xl transition duration-300 dark:border-zinc-800/80 dark:bg-zinc-950/88 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow-none",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white/70 p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
          <Logo />
          <Button
            aria-label="Close navigation"
            className="h-10 w-10 px-0 lg:hidden"
            icon={X}
            onClick={onClose}
            variant="ghost"
          />
        </div>

        <div className="mt-4 overflow-hidden rounded-lg border border-zinc-200 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 p-4 text-white shadow-soft dark:border-zinc-800">
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

        <div className="mt-4 rounded-lg border border-zinc-200 bg-white/72 p-3 dark:border-zinc-800 dark:bg-zinc-900/55">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-brand-400 to-signal text-sm font-extrabold text-white shadow-lg">
              {user?.name?.charAt(0)?.toUpperCase() || "B"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-zinc-950 dark:text-white">{user?.name}</p>
              <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{user?.email}</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-zinc-200 bg-white/75 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950/50">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">Credits</p>
              <p className="mt-1 text-lg font-extrabold text-zinc-950 dark:text-white">{user?.credits ?? 0}</p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white/75 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950/50">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">Plan</p>
              <p className="mt-1 truncate text-lg font-extrabold text-zinc-950 dark:text-white">{user?.plan || "Free"}</p>
              <p className="text-[10px] capitalize text-zinc-500">{user?.billingCycle || "monthly"}</p>
            </div>
          </div>
        </div>

        <p className="mt-6 px-2 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
          Workspace
        </p>
        <nav className="mt-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition",
                    isActive
                      ? "bg-zinc-950 text-white shadow-soft dark:bg-white dark:text-zinc-950"
                      : "text-zinc-600 hover:translate-x-0.5 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
                  )
                }
                end={item.to === "/dashboard"}
                key={item.to}
                onClick={onClose}
                to={item.to}
              >
                <Icon size={19} />
                {item.label}
              </NavLink>
            );
          })}
          {user?.role === "admin" && (
            <NavLink
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-zinc-600 transition hover:translate-x-0.5 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
              onClick={onClose}
              to="/admin/dashboard"
            >
              <Crown size={19} />
              Admin
            </NavLink>
          )}
        </nav>

        <div className="mt-auto rounded-lg border border-zinc-200 bg-white/70 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-zinc-950 dark:text-white">
            <BarChart3 size={18} />
            Output quality
          </div>
          <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            Gemini, technical checks, history, and PDF exports are wired together.
          </p>
          <Button className="mt-4 w-full" icon={LogOut} onClick={logout} variant="secondary">
            Sign out
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
