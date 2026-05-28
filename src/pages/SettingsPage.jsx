import { KeyRound, Save } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";

import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { authService } from "../services/authService";

const platforms = ["YouTube", "Instagram", "Facebook", "LinkedIn"];

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [form, setForm] = useState({
    name: user?.name || "",
    defaultPlatform: user?.preferences?.defaultPlatform || "Instagram"
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const data = await authService.updateSettings({
        name: form.name,
        preferences: {
          defaultPlatform: form.defaultPlatform,
          darkMode: isDark
        }
      });
      updateUser(data.user);
      toast.success("Settings saved");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save settings");
    } finally {
      setLoading(false);
    }
  };

  const updatePasswordField = (key, value) => {
    setPasswordForm((current) => ({ ...current, [key]: value }));
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setPasswordLoading(true);

    try {
      await authService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password changed");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 10 }}>
      <PageHeader
        description="Tune your default platform, profile name and workspace appearance."
        eyebrow="Settings"
        title="Workspace preferences"
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <Card as="form" className="space-y-5" onSubmit={handleSubmit}>
          <Input
            label="Display name"
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Your name"
            required
            value={form.name}
          />
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
              Default platform
            </span>
            <select
              className="h-12 w-full rounded-lg border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-950 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-300/35 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-brand-400 dark:focus:ring-brand-400/25"
              onChange={(event) =>
                setForm((current) => ({ ...current, defaultPlatform: event.target.value }))
              }
              value={form.defaultPlatform}
            >
              {platforms.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-zinc-950 dark:!border-zinc-700 dark:!bg-zinc-900/90 dark:!text-white">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-zinc-950 dark:!text-white">Dark mode</p>
                <p className="mt-1 text-sm font-medium text-zinc-700 dark:!text-zinc-300">
                  Switch the dashboard between light and dark appearances.
                </p>
              </div>
              <button
                aria-pressed={isDark}
                className={`relative h-7 w-12 rounded-full transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300/35 dark:focus-visible:ring-brand-400/25 ${
                  isDark ? "bg-brand-500" : "bg-zinc-300"
                }`}
                onClick={toggleTheme}
                type="button"
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                    isDark ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>
          <Button className="w-full sm:w-auto" icon={Save} loading={loading} type="submit" variant="accent">
            Save settings
          </Button>
        </Card>

        <div className="space-y-5">
          <Card className="h-fit">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
              Account
            </p>
            <h2 className="mt-3 break-words text-2xl font-extrabold text-zinc-950 dark:text-white">
              {user?.name}
            </h2>
            <p className="mt-2 break-all text-sm font-medium text-zinc-600 dark:text-zinc-300">{user?.email}</p>
            <div className="mt-5 rounded-lg bg-zinc-50 p-4 text-sm font-medium leading-6 text-zinc-700 dark:!bg-zinc-900/90 dark:!text-zinc-300">
              JWT authentication protects every analysis route. User settings are stored on the
              MongoDB user document.
            </div>
          </Card>

          <Card as="form" className="h-fit space-y-4" onSubmit={handlePasswordSubmit}>
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-800 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
                <KeyRound size={18} />
              </div>
              <div>
                <p className="font-extrabold text-zinc-950 dark:text-white">Change password</p>
                <p className="mt-1 text-sm font-medium leading-6 text-zinc-600 dark:text-zinc-300">
                  Passwords are saved in MongoDB as bcrypt hashes.
                </p>
              </div>
            </div>
            <Input
              autoComplete="current-password"
              label="Current password"
              onChange={(event) => updatePasswordField("currentPassword", event.target.value)}
              required
              type="password"
              value={passwordForm.currentPassword}
            />
            <Input
              autoComplete="new-password"
              label="New password"
              minLength={6}
              onChange={(event) => updatePasswordField("newPassword", event.target.value)}
              required
              type="password"
              value={passwordForm.newPassword}
            />
            <Input
              autoComplete="new-password"
              label="Confirm new password"
              minLength={6}
              onChange={(event) => updatePasswordField("confirmPassword", event.target.value)}
              required
              type="password"
              value={passwordForm.confirmPassword}
            />
            <Button className="w-full" icon={KeyRound} loading={passwordLoading} type="submit" variant="secondary">
              Change password
            </Button>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
