import { Copy, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Button from "../components/Button";
import LockedFeature from "../components/LockedFeature";
import PageHeader from "../components/PageHeader";
import SectionContainer from "../components/SectionContainer";
import { useAuth } from "../context/AuthContext";
import { libraryService } from "../services/libraryService";
import { hasPlan } from "../utils/plans";

const ContentLibrary = () => {
  const { user } = useAuth();
  const canUse = user?.role === "admin" || hasPlan(user, "creator");
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ search: "", platform: "", type: "" });

  const load = async () => {
    const data = await libraryService.list(filters);
    setItems(data.items || []);
  };

  useEffect(() => {
    if (canUse) load().catch(() => {});
  }, [canUse]);

  const remove = async (id) => {
    await libraryService.remove(id);
    setItems((current) => current.filter((item) => item._id !== id));
    toast.success("Deleted");
  };

  return (
    <div>
      <PageHeader eyebrow="Library" title="Content Library" description="Save, search, copy, and reuse your best captions, hooks, titles, CTAs, hashtags, and rewrites." />
      {!canUse ? <LockedFeature title="Content Library" requiredPlan="Creator" /> : (
        <SectionContainer title="Saved content">
          <div className="mb-4 grid gap-3 md:grid-cols-4">
            <input className="h-11 rounded-lg border border-zinc-300 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-950 md:col-span-2" placeholder="Search" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
            <select className="h-11 rounded-lg border border-zinc-300 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-950" value={filters.platform} onChange={(e) => setFilters({ ...filters, platform: e.target.value })}>
              <option value="">All platforms</option>
              {["YouTube", "Instagram", "Facebook", "LinkedIn", "Twitter/X", "X", "Other"].map((item) => <option key={item}>{item}</option>)}
            </select>
            <Button onClick={load} variant="accent">Filter</Button>
          </div>
          <div className="grid gap-3">
            {items.map((item) => (
              <div className="rounded-lg border border-zinc-200 bg-white/90 p-4 dark:border-zinc-700 dark:bg-zinc-900" key={item._id}>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="font-extrabold">{item.title || item.type}</p>
                  <div className="flex gap-2">
                    <Button icon={Copy} onClick={() => navigator.clipboard.writeText(item.content).then(() => toast.success("Copied"))} size="sm" variant="secondary">Copy</Button>
                    <Button icon={Trash2} onClick={() => remove(item._id)} size="sm" variant="danger">Delete</Button>
                  </div>
                </div>
                <p className="whitespace-pre-line text-sm leading-7 text-zinc-700 dark:text-zinc-200">{item.content}</p>
              </div>
            ))}
            {!items.length && <p className="text-sm text-zinc-600 dark:text-zinc-300">No saved content yet.</p>}
          </div>
        </SectionContainer>
      )}
    </div>
  );
};

export default ContentLibrary;
