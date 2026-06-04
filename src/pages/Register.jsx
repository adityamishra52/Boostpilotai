import { BarChart3, Lock, Mail, ShieldCheck, Sparkles, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

import Button from "../components/Button";
import Card from "../components/Card";
import GoogleAuthButton from "../components/GoogleAuthButton";
import Input from "../components/Input";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { loginWithGoogle, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const redirect = new URLSearchParams(location.search).get("redirect") || "/dashboard";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await register(form);
      toast.success("Workspace created");
      navigate(redirect, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (credential) => {
    setLoading(true);

    try {
      await loginWithGoogle(credential);
      toast.success("Workspace ready");
      navigate(redirect, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Google sign-in failed. Please try again or use email login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full !border-white/70 !bg-white/86 p-6 shadow-2xl backdrop-blur-2xl dark:!border-zinc-700/80 dark:!bg-zinc-900/86 sm:p-7">
      <div className="mb-6">
        <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 text-xs font-extrabold text-brand-800 dark:border-brand-400/30 dark:bg-brand-400/10 dark:text-brand-100">
          <Sparkles size={15} />
          Start free
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
          Create your free BoostPilot AI account
        </h1>
        <p className="mt-3 text-sm font-medium leading-6 text-zinc-600 dark:text-zinc-300">
          Analyze your first uploads, save reports, and keep generated content in one private workspace.
        </p>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-2">
        {[
          ["5", "Free credits"],
          ["5", "Platforms"],
          ["0", "Auto posts"]
        ].map(([value, label]) => (
          <div className="rounded-lg border border-zinc-200 bg-white/90 p-3 text-center dark:border-zinc-700 dark:bg-zinc-950/70" key={label}>
            <p className="text-base font-extrabold text-zinc-950 dark:text-white">{value}</p>
            <p className="mt-1 text-[11px] font-bold text-zinc-500 dark:text-zinc-400">{label}</p>
          </div>
        ))}
      </div>

      <GoogleAuthButton disabled={loading} onSuccess={handleGoogle} />

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">or use email</span>
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          autoComplete="name"
          icon={User}
          label="Full name"
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          placeholder="Alex Morgan"
          required
          value={form.name}
        />
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
          autoComplete="new-password"
          icon={Lock}
          label="Password"
          minLength={6}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          placeholder="Minimum 6 characters"
          required
          type="password"
          value={form.password}
        />
        <Button className="w-full" loading={loading} size="lg" type="submit" variant="accent">
          Create account
        </Button>
      </form>

      <div className="mt-5 grid gap-2 rounded-lg border border-zinc-200 bg-zinc-50/90 p-4 text-sm font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-300">
        {["Private media storage", "Secure authentication", "No auto posting", "Cancel anytime"].map((item) => (
          <div className="flex items-center gap-2" key={item}>
            <ShieldCheck className="text-emerald-500" size={16} />
            {item}
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-2 text-xs font-bold text-zinc-600 dark:text-zinc-300">
        {["Creator-ready reports", "Content Library", "Platform suggestions"].map((item) => (
          <div className="flex items-center gap-2" key={item}>
            <BarChart3 className="text-brand-500" size={15} />
            {item}
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-sm font-medium text-zinc-600 dark:text-zinc-300">
        Already have an account?{" "}
        <Link className="rounded font-bold text-brand-700 hover:text-brand-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300/35 dark:text-brand-200 dark:hover:text-brand-100 dark:focus-visible:ring-brand-400/25" to={`/login?redirect=${encodeURIComponent(redirect)}`}>
          Sign in
        </Link>
      </p>
    </Card>
  );
};

export default Register;
