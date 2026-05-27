import { Lock, Mail, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";

const AdminLogin = () => {
  const { isAuthenticated, login, logout, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "admin@boostpilot.ai", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const data = await login(form);
      if (data.user.role !== "admin") {
        logout();
        toast.error("Admin access required");
        return;
      }

      toast.success("Admin signed in");
      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-grid min-h-screen bg-cloud px-4 py-8 text-zinc-950 dark:bg-zinc-950 dark:text-white">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1fr_440px] lg:items-center">
          <div className="hidden lg:block">
            <Logo />
            <div className="mt-10 max-w-xl">
              <div className="mb-5 grid h-14 w-14 place-items-center rounded-lg bg-gradient-to-br from-brand-500 via-signal to-coral text-white shadow-glow">
                <Shield size={26} />
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight">Admin operations for BoostPilot AI.</h1>
              <p className="mt-5 text-base leading-7 text-zinc-600 dark:text-zinc-300">
                Manage customers, credits, plans, analyses, uploaded assets, and abuse controls from one protected
                workspace.
              </p>
            </div>
          </div>
          <Card className="p-7">
            <div className="mb-6 flex items-center justify-between">
              <Logo />
              <ThemeToggle />
            </div>
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">
                Admin only
              </p>
              <h2 className="mt-3 text-3xl font-extrabold text-zinc-950 dark:text-white">Sign in as admin</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                Normal user accounts cannot access this dashboard.
              </p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                autoComplete="email"
                icon={Mail}
                label="Admin email"
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                required
                type="email"
                value={form.email}
              />
              <Input
                autoComplete="current-password"
                icon={Lock}
                label="Password"
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                placeholder="Admin password"
                required
                type="password"
                value={form.password}
              />
              <Button className="w-full" loading={loading} size="lg" type="submit" variant="accent">
                Open admin dashboard
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
