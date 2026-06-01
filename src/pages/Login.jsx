import { Lock, Mail } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

import Button from "../components/Button";
import Card from "../components/Card";
import GoogleAuthButton from "../components/GoogleAuthButton";
import Input from "../components/Input";
import { useAuth } from "../context/AuthContext";

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
      toast.success("Welcome to BoostPilot");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full p-7">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">
          Welcome back
        </p>
        <h1 className="mt-3 text-3xl font-extrabold text-zinc-950 dark:text-white">
          Sign in to your cockpit
        </h1>
        <p className="mt-2 text-sm font-medium leading-6 text-zinc-600 dark:text-zinc-300">
          Continue analyzing content and improving your creator pipeline.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
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

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">or</span>
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <GoogleAuthButton disabled={loading} onSuccess={handleGoogle} text="signin_with" />

      <p className="mt-6 text-center text-sm font-medium text-zinc-600 dark:text-zinc-300">
        New to BoostPilot?{" "}
        <Link className="rounded font-bold text-brand-700 hover:text-brand-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300/35 dark:text-brand-200 dark:hover:text-brand-100 dark:focus-visible:ring-brand-400/25" to={`/register?redirect=${encodeURIComponent(from)}`}>
          Create an account
        </Link>
      </p>
    </Card>
  );
};

export default Login;
