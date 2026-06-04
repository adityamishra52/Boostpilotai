import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Button from "./Button";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  ["How it works", "/how-it-works"],
  ["Features", "/features"],
  ["Pricing", "/pricing"],
  ["Contact", "/contact"]
];

const PublicNavbar = () => {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const loginTarget = isAuthenticated ? "/dashboard" : "/login";

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/92 backdrop-blur-2xl dark:border-zinc-800/80 dark:bg-zinc-950/92">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <Link aria-label="BoostPilot AI home" to="/">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-bold text-zinc-700 dark:text-zinc-200 md:flex">
          {navLinks.map(([label, to]) => (
            <NavLink className={({ isActive }) => isActive ? "text-zinc-950 dark:text-white" : "hover:text-zinc-950 dark:hover:text-white"} key={to} to={to}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button as={Link} to={loginTarget} variant="secondary">
            {isAuthenticated ? "Dashboard" : "Login"}
          </Button>
          <Button as={Link} to="/register?redirect=/analyze" variant="accent">
            Start Free
          </Button>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            aria-expanded={open}
            aria-label="Toggle navigation"
            className="grid h-11 w-11 place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-900 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            onClick={() => setOpen((current) => !current)}
            type="button"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-zinc-200 bg-white px-4 py-3 shadow-lg dark:border-zinc-800 dark:bg-zinc-950 md:hidden">
          <nav className="mx-auto grid max-w-7xl gap-2 text-sm font-bold">
            {navLinks.map(([label, to]) => (
              <Link className="rounded-lg px-3 py-3 text-zinc-800 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-900" key={to} onClick={() => setOpen(false)} to={to}>
                {label}
              </Link>
            ))}
            <Link className="rounded-lg px-3 py-3 text-zinc-800 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-900" onClick={() => setOpen(false)} to={loginTarget}>
              {isAuthenticated ? "Dashboard" : "Login"}
            </Link>
            <Button as={Link} className="mt-1 w-full" onClick={() => setOpen(false)} to="/register?redirect=/analyze" variant="accent">
              Start Free
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
