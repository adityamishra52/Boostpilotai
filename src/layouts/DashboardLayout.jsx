import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LayoutDashboard, Library, Settings, TrendingUp, UploadCloud } from "lucide-react";
import clsx from "clsx";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useAuth } from "../context/AuthContext";
import { resetPageScroll } from "../utils/scrollReset";

const mobileNavItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Analyze", to: "/analyze", icon: UploadCloud },
  { label: "Library", to: "/library", icon: Library },
  { label: "Trends", to: "/trends", icon: TrendingUp },
  { label: "Profile", to: "/settings", icon: Settings }
];

const BottomNav = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200/80 bg-white/94 px-2 pb-[calc(0.45rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-18px_45px_rgba(15,23,42,0.16)] backdrop-blur-2xl dark:border-zinc-800/80 dark:bg-zinc-950/94 lg:hidden"
    >
      <div className="mx-auto grid max-w-[520px] grid-cols-5 gap-1">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const protectedItem = ["/dashboard", "/trends", "/library", "/settings"].includes(item.to);
          const to = protectedItem && !isAuthenticated ? `/login?redirect=${encodeURIComponent(item.to)}` : item.to;

          return (
            <NavLink
              className={({ isActive }) =>
                clsx(
                  "flex min-w-0 flex-col items-center gap-1 rounded-lg px-1 py-2 text-[11px] font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300/35",
                  isActive
                    ? "bg-zinc-950 text-white shadow-soft dark:bg-brand-400/20"
                    : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
                )
              }
              key={item.to}
              to={to}
            >
              <Icon size={18} />
              <span className="max-w-full truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const mainRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    };

    if (!sidebarOpen) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [sidebarOpen]);

  useLayoutEffect(() => {
    resetPageScroll();
    mainRef.current?.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname, location.search, location.hash]);

  return (
    <div className="premium-grid h-dvh min-h-dvh overflow-hidden bg-cloud text-zinc-950 dark:bg-zinc-950 dark:text-white">
      <div className="flex h-full min-w-0 overflow-hidden">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <Topbar onMenu={() => setSidebarOpen(true)} />

          <main
            className="scrollbar-thin min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-4 py-5 pb-36 sm:px-6 sm:pb-28 lg:px-8 lg:pb-8"
            data-route-scroll-container
            ref={mainRef}
            style={{ overflowAnchor: "none" }}
          >
            <div className="mx-auto w-full max-w-[1440px]">
              <Outlet />
            </div>
          </main>
          <BottomNav />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
