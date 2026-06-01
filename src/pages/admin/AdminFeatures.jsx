import { Save, ShieldCheck, UserMinus, UserPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import Badge from "../../components/Badge";
import Button from "../../components/Button";
import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import Skeleton from "../../components/Skeleton";
import { adminService } from "../../services/adminService";
import { planLabel, planOrder } from "../../utils/plans";

const AdminFeatures = () => {
  const [features, setFeatures] = useState([]);
  const [usage, setUsage] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState("");
  const [selectedUser, setSelectedUser] = useState({});

  const userOptions = useMemo(() => users.filter((user) => user.role !== "admin"), [users]);

  const load = async () => {
    setLoading(true);
    try {
      const [featuresData, usageData, usersData] = await Promise.all([
        adminService.features(),
        adminService.featureUsage(),
        adminService.users()
      ]);
      setFeatures(featuresData.features || []);
      setUsage(usageData.usage || {});
      setUsers(usersData.users || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load feature controls");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const patchFeature = async (key, payload) => {
    setSavingKey(key);
    try {
      const data = await adminService.updateFeature(key, payload);
      setFeatures((current) => current.map((item) => (item.key === key ? data.feature : item)));
      toast.success("Feature updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update feature");
    } finally {
      setSavingKey("");
    }
  };

  return (
    <div>
      <PageHeader
        action={<Badge variant="brand">Admin</Badge>}
        description="Enable, disable, price-gate, and block access to premium product features."
        eyebrow="Controls"
        title="Feature control"
      />

      {loading ? (
        <Skeleton className="h-72" />
      ) : (
        <div className="grid gap-4">
          {features.map((feature) => {
            const featureUsage = usage[feature.key] || {};
            const blockedUsers = feature.blockedUsers || [];

            return (
              <Card key={feature.key}>
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="grid h-10 w-10 place-items-center rounded-lg bg-zinc-950 text-white dark:bg-brand-400/20">
                        <ShieldCheck size={18} />
                      </div>
                      <h2 className="text-lg font-extrabold text-zinc-950 dark:text-white">{feature.name}</h2>
                      <Badge variant={feature.enabled ? "success" : "danger"}>
                        {feature.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                      <Badge variant="brand">{feature.usageCount || 0} uses</Badge>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{feature.description}</p>
                  </div>

                  <div className="grid min-w-[260px] gap-3 sm:grid-cols-3 xl:min-w-[520px]">
                    <label className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-bold dark:border-zinc-700 dark:bg-zinc-900">
                      <input
                        checked={feature.enabled}
                        className="h-5 w-5 accent-cyan-500"
                        onChange={(event) => patchFeature(feature.key, { enabled: event.target.checked })}
                        type="checkbox"
                      />
                      Enabled
                    </label>
                    <select
                      className="h-11 rounded-lg border border-zinc-300 bg-white px-3 text-sm font-bold dark:border-zinc-700 dark:bg-zinc-950"
                      onChange={(event) => patchFeature(feature.key, { requiredPlan: event.target.value })}
                      value={feature.requiredPlan}
                    >
                      {planOrder.map((plan) => (
                        <option key={plan} value={plan}>
                          {planLabel(plan)}
                        </option>
                      ))}
                    </select>
                    <Button
                      icon={Save}
                      loading={savingKey === feature.key}
                      onClick={() =>
                        patchFeature(feature.key, {
                          enabled: feature.enabled,
                          requiredPlan: feature.requiredPlan,
                          description: feature.description
                        })
                      }
                      variant="secondary"
                    >
                      Save
                    </Button>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 xl:grid-cols-2">
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-700 dark:bg-zinc-950/50">
                    <h3 className="mb-3 text-sm font-extrabold text-zinc-950 dark:text-white">Users using this feature</h3>
                    <div className="grid gap-2">
                      {(featureUsage.users || []).slice(0, 8).map((user) => (
                        <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white/90 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" key={user._id}>
                          <span className="min-w-0 truncate font-bold">{user.name || user.email}</span>
                          <Badge variant="neutral">{planLabel(user.plan)}</Badge>
                        </div>
                      ))}
                      {!featureUsage.users?.length && <p className="text-sm text-zinc-600 dark:text-zinc-300">No usage yet.</p>}
                    </div>
                  </div>

                  <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-700 dark:bg-zinc-950/50">
                    <h3 className="mb-3 text-sm font-extrabold text-zinc-950 dark:text-white">Blocked users</h3>
                    <div className="mb-3 flex gap-2">
                      <select
                        className="h-11 min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-950"
                        onChange={(event) => setSelectedUser((current) => ({ ...current, [feature.key]: event.target.value }))}
                        value={selectedUser[feature.key] || ""}
                      >
                        <option value="">Select user</option>
                        {userOptions.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.email}
                          </option>
                        ))}
                      </select>
                      <Button
                        icon={UserPlus}
                        onClick={() => selectedUser[feature.key] && patchFeature(feature.key, { blockUserId: selectedUser[feature.key] })}
                        variant="secondary"
                      >
                        Block
                      </Button>
                    </div>
                    <div className="grid gap-2">
                      {blockedUsers.map((user) => (
                        <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white/90 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" key={user._id}>
                          <span className="min-w-0 truncate font-bold">{user.email}</span>
                          <Button icon={UserMinus} onClick={() => patchFeature(feature.key, { unblockUserId: user._id })} size="sm" variant="ghost">
                            Unblock
                          </Button>
                        </div>
                      ))}
                      {!blockedUsers.length && <p className="text-sm text-zinc-600 dark:text-zinc-300">No blocked users.</p>}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminFeatures;
