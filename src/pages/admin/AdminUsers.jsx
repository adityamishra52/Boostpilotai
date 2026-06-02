import { Copy, CreditCard, KeyRound, ShieldOff, ShieldCheck, Trash2, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import Badge from "../../components/Badge";
import Button from "../../components/Button";
import Input from "../../components/Input";
import PageHeader from "../../components/PageHeader";
import SectionContainer from "../../components/SectionContainer";
import Skeleton from "../../components/Skeleton";
import { adminService } from "../../services/adminService";
import { formatDate } from "../../utils/formatters";
import { planLabel, planNames } from "../../utils/plans";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [creditDrafts, setCreditDrafts] = useState({});
  const [resetResult, setResetResult] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.users();
      setUsers(data.users);
      setCreditDrafts(
        data.users.reduce((drafts, user) => ({ ...drafts, [user.id]: user.credits }), {})
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const totals = useMemo(
    () => ({
      users: users.length,
      blocked: users.filter((user) => user.isBlocked).length,
      admins: users.filter((user) => user.role === "admin").length
    }),
    [users]
  );

  const mutate = async (id, action) => {
    setBusyId(id);
    try {
      await action();
      await loadUsers();
      toast.success("User updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setBusyId("");
    }
  };

  const handleRegeneratePassword = async (user) => {
    if (!window.confirm(`Regenerate a temporary password for ${user.email}?`)) {
      return;
    }

    setBusyId(user.id);

    try {
      const data = await adminService.regeneratePassword(user.id);
      setResetResult({ id: user.id, password: data.temporaryPassword });
      await loadUsers();
      toast.success("Temporary password generated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to regenerate password");
    } finally {
      setBusyId("");
    }
  };

  const copyTemporaryPassword = async (password) => {
    if (!navigator.clipboard) {
      toast.error("Clipboard is not available");
      return;
    }

    await navigator.clipboard.writeText(password);
    toast.success("Temporary password copied");
  };

  return (
    <div>
      <PageHeader
        action={<Badge variant="brand">{totals.users} users</Badge>}
        description="Adjust credits, plans, and account status without exposing controls to normal users."
        eyebrow="Admin"
        title="User management"
      />

      <div className="mb-5 grid gap-4 md:grid-cols-3">
        {[
          ["Total users", totals.users],
          ["Blocked", totals.blocked],
          ["Admins", totals.admins]
        ].map(([label, value]) => (
          <div
            className="rounded-lg border border-zinc-200 bg-white/90 p-4 text-zinc-950 dark:!border-zinc-700 dark:!bg-zinc-900/90 dark:!text-white"
            key={label}
          >
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-700 dark:!text-zinc-300">{label}</p>
            <p className="mt-2 text-2xl font-extrabold text-zinc-950 dark:!text-white">{value}</p>
          </div>
        ))}
      </div>

      <SectionContainer icon={Users} title="All users">
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((item) => (
              <Skeleton className="h-24" key={item} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div
                className="grid gap-4 rounded-lg border border-zinc-200 bg-white/90 p-4 text-zinc-950 dark:!border-zinc-700 dark:!bg-zinc-900/90 dark:!text-white xl:grid-cols-[minmax(0,1fr)_520px] xl:items-center"
                key={user.id}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-extrabold text-zinc-950 dark:!text-white">{user.name}</p>
                    <Badge variant={user.role === "admin" ? "brand" : "neutral"}>{user.role}</Badge>
                    <Badge variant={user.isBlocked ? "danger" : "success"}>
                      {user.isBlocked ? "Blocked" : "Active"}
                    </Badge>
                  </div>
                  <p className="mt-1 truncate text-sm font-medium text-zinc-700 dark:!text-zinc-300">{user.email}</p>
                  <p className="mt-2 text-xs font-medium text-zinc-700 dark:!text-zinc-300">
                    {user.analysisCount} reports - {user.premiumActionCount || 0} premium actions - joined{" "}
                    {formatDate(user.createdAt)}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="grid gap-3 md:grid-cols-[120px_120px_120px_1fr]">
                    <label className="block">
                      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-zinc-600 dark:text-zinc-300">
                        Plan
                      </span>
                      <select
                        className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-900 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-300/35 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:ring-brand-400/25"
                        disabled={busyId === user.id}
                        onChange={(event) =>
                          mutate(user.id, () =>
                            adminService.updatePlan(user.id, event.target.value, user.billingCycle || "monthly")
                          )
                        }
                        value={user.plan}
                      >
                        {planNames.map((plan) => (
                          <option key={plan} value={plan}>
                            {planLabel(plan)}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-zinc-600 dark:text-zinc-300">
                        Cycle
                      </span>
                      <select
                        className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-900 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-300/35 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:ring-brand-400/25"
                        disabled={busyId === user.id}
                        onChange={(event) =>
                          mutate(user.id, () =>
                            adminService.updatePlan(user.id, user.plan, event.target.value)
                          )
                        }
                        value={user.billingCycle || "monthly"}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </label>

                    <div>
                      <Input
                        className="h-11"
                        icon={CreditCard}
                        label="Credits"
                        min="0"
                        onChange={(event) =>
                          setCreditDrafts((current) => ({ ...current, [user.id]: event.target.value }))
                        }
                        type="number"
                        value={creditDrafts[user.id] ?? 0}
                      />
                      <Button
                        className="mt-2 w-full"
                        disabled={busyId === user.id}
                        onClick={() => mutate(user.id, () => adminService.updateCredits(user.id, creditDrafts[user.id]))}
                        size="sm"
                        variant="secondary"
                      >
                        Save
                      </Button>
                    </div>

                    <div className="flex flex-wrap items-end gap-2">
                      <Button
                        disabled={busyId === user.id || user.role === "admin"}
                        icon={KeyRound}
                        onClick={() => handleRegeneratePassword(user)}
                        size="sm"
                        variant="secondary"
                      >
                        Reset
                      </Button>
                      <Button
                        disabled={busyId === user.id || user.role === "admin"}
                        icon={user.isBlocked ? ShieldCheck : ShieldOff}
                        onClick={() => mutate(user.id, () => adminService.updateBlock(user.id, !user.isBlocked))}
                        size="sm"
                        variant={user.isBlocked ? "secondary" : "danger"}
                      >
                        {user.isBlocked ? "Unblock" : "Block"}
                      </Button>
                      <Button
                        disabled={busyId === user.id || user.role === "admin"}
                        icon={Trash2}
                        onClick={() => mutate(user.id, () => adminService.deleteUser(user.id))}
                        size="sm"
                        variant="danger"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>

                  {resetResult?.id === user.id && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-950/35">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-200">
                        Temporary password
                      </p>
                      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                        <code className="min-w-0 flex-1 break-all rounded-md bg-white px-3 py-2 text-sm font-bold text-zinc-950 [overflow-wrap:anywhere] dark:bg-zinc-950 dark:text-white">
                          {resetResult.password}
                        </code>
                        <Button
                          className="shrink-0"
                          icon={Copy}
                          onClick={() => copyTemporaryPassword(resetResult.password)}
                          size="sm"
                          variant="secondary"
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionContainer>
    </div>
  );
};

export default AdminUsers;
