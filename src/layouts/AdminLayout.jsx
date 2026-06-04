import {
  BarChart3,
  FileText,
  LifeBuoy,
  SlidersHorizontal,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  Users
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import clsx from "clsx";

import Button from "../components/Button";
import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Reports", to: "/admin/analyses", icon: FileText },
  { label: "Features", to: "/admin/features", icon: SlidersHorizontal },
  { label: "Support", to: "/admin/support", icon: LifeBuoy },
  { label: "Settings", to: "/admin/settings", icon: Settings }
];

const AdminLayout = () => {
  const { logout, user } = useAuth();

  return (
    <div className="premium-grid min-h-screen bg-cloud text-zinc-950 dark:bg-zinc-950 dark:text-white lg:flex">
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-zinc-200 bg-white/95 p-4 backdrop-blur-2xl dark:border-zinc-800 dark:bg-zinc-950/95 lg:flex">
        <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <Logo />
        </div>
        <div className="mt-4 rounded-lg border border-zinc-200 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 p-4 text-white shadow-soft dark:border-zinc-800">
          <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-white/10">
            <Shield size={22} />
          </div>
          <p className="text-lg font-extrabold">Admin tools</p>
          <p className="mt-2 text-xs leading-5 text-zinc-300">
            Users, credits, plans, reports, and upload safety.
          </p>
        </div>
        <nav className="mt-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300/35 dark:focus-visible:ring-brand-400/25",
                    isActive
                      ? "bg-zinc-950 text-white shadow-soft dark:bg-brand-400/20 dark:text-white dark:ring-1 dark:ring-brand-300/40"
                      : "bg-white text-zinc-800 hover:bg-zinc-100 hover:text-zinc-950 dark:bg-zinc-950/80 dark:text-zinc-100 dark:hover:bg-zinc-900 dark:hover:text-white"
                  )
                }
                key={item.to}
                to={item.to}
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="mt-auto rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-sm font-bold text-zinc-950 dark:text-white">{user?.name}</p>
          <p className="truncate text-xs font-medium text-zinc-600 dark:text-zinc-300">{user?.email}</p>
          <Button className="mt-4 w-full" icon={LogOut} onClick={logout} variant="secondary">
            Sign out
          </Button>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/92 px-4 py-3 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/94 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
                BoostPilot admin
              </p>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Operational SaaS controls</p>
            </div>
            <ThemeToggle />
          </div>
        </header>
        <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-5 grid gap-2 lg:hidden">
            {navItems.map((item) => (
              <NavLink
                className={({ isActive }) =>
                  clsx(
                    "rounded-lg border px-3 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300/35 dark:focus-visible:ring-brand-400/25",
                    isActive
                      ? "border-zinc-950 bg-zinc-950 text-white dark:border-brand-300/60 dark:bg-brand-400/20 dark:text-white"
                      : "border-zinc-200 bg-white/90 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-100 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
                  )
                }
                key={item.to}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
