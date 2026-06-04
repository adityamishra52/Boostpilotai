import { Copy, Edit3, ExternalLink, Filter, Heart, RefreshCw, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Badge from "../components/Badge";
import Button from "../components/Button";
import LockedFeature from "../components/LockedFeature";
import PageHeader from "../components/PageHeader";
import SectionContainer from "../components/SectionContainer";
import { useAuth } from "../context/AuthContext";
import { libraryService } from "../services/libraryService";
import { hasPlan } from "../utils/plans";

const platforms = ["YouTube", "Instagram", "Facebook", "LinkedIn", "Twitter/X", "X", "Email", "Blog", "Other"];
const types = [
  ["caption", "Captions"],
  ["hook", "Hooks"],
  ["title", "Titles"],
  ["hashtags", "Hashtags"],
  ["rewrite", "AI Rewrite"],
  ["coach", "Growth Coach"],
  ["trend", "Trend Reports"],
  ["cta", "Next Steps"],
  ["other", "Other"]
];

const typeLabel = (value) => types.find(([key]) => key === value)?.[1] || value || "Saved";

const ContentLibrary = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canUse = user?.role === "admin" || hasPlan(user, "creator");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [editForm, setEditForm] = useState({ title: "", content: "" });
  const [filters, setFilters] = useState({ search: "", platform: "", type: "", favorite: false });

  const query = useMemo(() => ({
    search: filters.search,
    platform: filters.platform,
    type: filters.type,
    favorite: filters.favorite ? "true" : ""
  }), [filters]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await libraryService.list(query);
      setItems(data.items || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load Content Library");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canUse) load();
  }, [canUse, query]);

  const remove = async (id) => {
    await libraryService.remove(id);
    setItems((current) => current.filter((item) => item._id !== id));
    toast.success("Deleted");
  };

  const toggleFavorite = async (item) => {
    const data = await libraryService.favorite(item._id, !item.favorite);
    setItems((current) => current.map((entry) => (entry._id === item._id ? data.item : entry)));
  };

  const copy = async (content) => {
    await navigator.clipboard.writeText(content);
    toast.success("Copied");
  };

  const reuse = (item) => {
    sessionStorage.setItem("boostpilot_reuse_library_item", JSON.stringify(item));
    navigate("/analyze", { state: { libraryItem: item } });
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditForm({ title: item.title || "", content: item.content || "" });
  };

  const saveEdit = async (item) => {
    const data = await libraryService.update(item._id, {
      ...item,
      title: editForm.title,
      content: editForm.content
    });
    setItems((current) => current.map((entry) => (entry._id === item._id ? data.item : entry)));
    setEditingId("");
    toast.success("Saved");
  };

  return (
    <div>
      <PageHeader
        eyebrow="Library"
        title="Saved Content"
        description="Find and reuse your captions, hooks, titles, hashtags, trend reports, and rewritten text."
      />
      {!canUse ? (
        <LockedFeature title="Content Library" requiredPlan="Creator" />
      ) : (
        <SectionContainer title="Saved content">
          <div className="mb-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px_auto_auto]">
            <label className="relative min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                className="h-11 w-full rounded-lg border border-zinc-300 bg-white pl-10 pr-3 text-sm font-semibold outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-300/25 dark:border-zinc-700 dark:bg-zinc-950"
                placeholder="Search saved content"
                value={filters.search}
                onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
              />
            </label>
            <select
              className="h-11 rounded-lg border border-zinc-300 bg-white px-3 text-sm font-semibold dark:border-zinc-700 dark:bg-zinc-950"
              value={filters.platform}
              onChange={(event) => setFilters((current) => ({ ...current, platform: event.target.value }))}
            >
              <option value="">All platforms</option>
              {platforms.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select
              className="h-11 rounded-lg border border-zinc-300 bg-white px-3 text-sm font-semibold dark:border-zinc-700 dark:bg-zinc-950"
              value={filters.type}
              onChange={(event) => setFilters((current) => ({ ...current, type: event.target.value }))}
            >
              <option value="">All types</option>
              {types.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <Button
              className={filters.favorite ? "border-red-300 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-950/70 dark:text-red-100" : ""}
              icon={Heart}
              onClick={() => setFilters((current) => ({ ...current, favorite: !current.favorite }))}
              variant="secondary"
            >
              Favorites
            </Button>
            <Button icon={loading ? RefreshCw : Filter} loading={loading} onClick={load} variant="accent">
              Filter
            </Button>
          </div>

          <div className="grid gap-3">
            {items.map((item) => (
              <article
                className="rounded-lg border border-zinc-200 bg-white/90 p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/90"
                key={item._id}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap gap-2">
                      <Badge variant="brand">{item.platform || "Other"}</Badge>
                      <Badge>{typeLabel(item.type)}</Badge>
                      {item.favorite && <Badge variant="warning">Favorite</Badge>}
                    </div>
                    <h2 className="break-words text-lg font-extrabold text-zinc-950 dark:text-white">
                      {item.title || typeLabel(item.type)}
                    </h2>
                    {item.tags?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {item.tags.slice(0, 8).map((tag) => (
                          <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200" key={tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
                    <Button icon={Heart} onClick={() => toggleFavorite(item)} size="sm" variant={item.favorite ? "danger" : "secondary"}>
                      {item.favorite ? "Unfavorite" : "Favorite"}
                    </Button>
                    <Button icon={Copy} onClick={() => copy(item.content)} size="sm" variant="secondary">Copy</Button>
                    <Button icon={Edit3} onClick={() => startEdit(item)} size="sm" variant="secondary">Edit</Button>
                    <Button icon={ExternalLink} onClick={() => reuse(item)} size="sm" variant="secondary">Reuse</Button>
                    <Button icon={Trash2} onClick={() => remove(item._id)} size="sm" variant="danger">Delete</Button>
                  </div>
                </div>
                {editingId === item._id ? (
                  <div className="mt-4 grid gap-3">
                    <input
                      className="h-11 rounded-lg border border-zinc-300 bg-white px-3 text-sm font-semibold dark:border-zinc-700 dark:bg-zinc-950"
                      onChange={(event) => setEditForm((current) => ({ ...current, title: event.target.value }))}
                      value={editForm.title}
                    />
                    <textarea
                      className="min-h-40 rounded-lg border border-zinc-300 bg-white p-3 text-sm leading-6 dark:border-zinc-700 dark:bg-zinc-950"
                      onChange={(event) => setEditForm((current) => ({ ...current, content: event.target.value }))}
                      value={editForm.content}
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={() => saveEdit(item)} variant="accent">Save changes</Button>
                      <Button onClick={() => setEditingId("")} variant="secondary">Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-4 max-h-64 overflow-auto whitespace-pre-line rounded-lg border border-zinc-200 bg-zinc-50/80 p-3 text-sm leading-7 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-200">
                    {item.content}
                  </p>
                )}
              </article>
            ))}

            {!items.length && (
              <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50/80 p-6 text-sm font-semibold text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950/50 dark:text-zinc-300">
                <p>Save captions, hooks, titles, hashtags, and rewrites from your analysis results.</p>
                <Button as={Link} className="mt-4" to="/analyze" variant="accent">
                  Go to Analysis
                </Button>
              </div>
            )}
          </div>
        </SectionContainer>
      )}
    </div>
  );
};

export default ContentLibrary;
