import { Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

import Button from "../components/Button";
import Card from "../components/Card";
import GoogleAuthButton from "../components/GoogleAuthButton";
import Input from "../components/Input";
import { useAuth } from "../context/AuthContext";
import { resetPageScroll } from "../utils/scrollReset";

const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const redirect = new URLSearchParams(location.search).get("redirect");
  const from = redirect || location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await login(form);
      resetPageScroll();
      toast.success("Welcome back to BoostPilot");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (credential) => {
    setLoading(true);

    try {
      await loginWithGoogle(credential);
      resetPageScroll();
      toast.success("Welcome to BoostPilot");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Google sign-in failed. Please try again or use email login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full !border-white/70 !bg-white/86 p-4 shadow-2xl backdrop-blur-2xl dark:!border-zinc-700/80 dark:!bg-zinc-900/86 sm:p-5">
      <div className="mb-4">
        <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 text-xs font-extrabold text-brand-800 dark:border-brand-400/30 dark:bg-brand-400/10 dark:text-brand-100">
          <Sparkles size={15} />
          AI content workspace
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
          Sign in to continue your analysis
        </h1>
        <p className="mt-2 text-sm font-medium leading-6 text-zinc-600 dark:text-zinc-300">
          Access your saved uploads, reports, rewrites, and Content Library.
        </p>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2">
        {[
          ["4.9/5", "Rating"],
          ["10k+", "Analyses"],
          ["5", "Platforms"]
        ].map(([value, label]) => (
          <div className="rounded-lg border border-zinc-200 bg-white/90 p-3 text-center dark:border-zinc-700 dark:bg-zinc-950/70" key={label}>
            <p className="text-base font-extrabold text-zinc-950 dark:text-white">{value}</p>
            <p className="mt-1 text-[11px] font-bold text-zinc-500 dark:text-zinc-400">{label}</p>
          </div>
        ))}
      </div>

      <GoogleAuthButton disabled={loading} onSuccess={handleGoogle} />

      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">or use email</span>
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <form className="space-y-3" onSubmit={handleSubmit}>
        <Input
          autoComplete="email"
          icon={Mail}
          label="Email"
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          placeholder="you@company.com"
          required
          type="email"
          value={form.email}
        />
        <Input
          autoComplete="current-password"
          icon={Lock}
          label="Password"
          minLength={6}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          placeholder="Password"
          required
          type="password"
          value={form.password}
        />
        <Button className="w-full" loading={loading} size="lg" type="submit" variant="accent">
          Sign in
        </Button>
      </form>

      <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50/90 p-3 text-sm leading-6 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-300">
        <div className="mb-2 flex items-center gap-2 font-extrabold text-zinc-950 dark:text-white">
          <ShieldCheck size={17} />
          Secure login
        </div>
        We never post anything without permission. Your upload is saved when you sign in from an analysis flow.
      </div>

      <p className="mt-4 text-center text-sm font-medium text-zinc-600 dark:text-zinc-300">
        New to BoostPilot?{" "}
        <Link className="rounded font-bold text-brand-700 hover:text-brand-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300/35 dark:text-brand-200 dark:hover:text-brand-100 dark:focus-visible:ring-brand-400/25" to={`/register?redirect=${encodeURIComponent(from)}`}>
          Create an account
        </Link>
      </p>
    </Card>
  );
};

export default Login;
