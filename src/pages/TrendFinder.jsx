import { ChevronDown, Flame, Goal, Search, TrendingUp, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

import Badge from "../components/Badge";
import Button from "../components/Button";
import Card from "../components/Card";
import LockedFeature from "../components/LockedFeature";
import PageHeader from "../components/PageHeader";
import SectionContainer from "../components/SectionContainer";
import { useAuth } from "../context/AuthContext";
import { trendService } from "../services/trendService";
import { hasPlan } from "../utils/plans";

const nicheOptions = [
  "AI & Technology",
  "Business",
  "Marketing",
  "Finance",
  "Investing",
  "Startups",
  "Fitness",
  "Health",
  "Mental Health",
  "Education",
  "Programming",
  "Gaming",
  "Travel",
  "Food",
  "Fashion",
  "Beauty",
  "Photography",
  "Motivation",
  "Comedy",
  "News",
  "Sports",
  "Crypto",
  "E-commerce",
  "Real Estate"
];

const platformSuggestions = {
  YouTube: ["AI & Technology", "Finance", "Education", "Gaming"],
  Instagram: ["Fitness", "Fashion", "Travel", "Food", "Photography"],
  Facebook: ["News", "Sports", "Health", "Food", "Real Estate"],
  LinkedIn: ["Business", "Marketing", "Leadership", "Startups", "AI & Technology"],
  X: ["News", "Crypto", "AI & Technology", "Finance", "Startups"]
};

const countryOptions = [
  { label: "Global", value: "Global", icon: "🌎" },
  { label: "United States", value: "United States", icon: "🇺🇸" },
  { label: "India", value: "India", icon: "🇮🇳" },
  { label: "United Kingdom", value: "United Kingdom", icon: "🇬🇧" },
  { label: "Canada", value: "Canada", icon: "🇨🇦" },
  { label: "Australia", value: "Australia", icon: "🇦🇺" },
  { label: "Germany", value: "Germany", icon: "🇩🇪" },
  { label: "France", value: "France", icon: "🇫🇷" },
  { label: "Singapore", value: "Singapore", icon: "🇸🇬" },
  { label: "UAE", value: "UAE", icon: "🇦🇪" }
];

const trendStrengthOptions = ["🔥 Exploding", "📈 Rising", "⭐ Stable", "💎 Hidden Opportunity"];
const goalOptions = ["More Views", "More Followers", "More Engagement", "More Leads", "More Sales", "Brand Awareness"];
const recentKey = "boostpilot_trend_recent";

const readRecent = () => {
  try {
    return JSON.parse(localStorage.getItem(recentKey) || "{}");
  } catch {
    return {};
  }
};

const saveRecent = (next) => localStorage.setItem(recentKey, JSON.stringify(next));

const SearchableMultiSelect = ({ label, options, value, onChange, suggestions = [], recent = [] }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef(null);
  const selected = new Set(value);
  const filtered = options.filter((item) => item.toLowerCase().includes(query.toLowerCase()));
  const visible = query ? filtered : [...new Set([...suggestions, ...recent, ...options])];

  useEffect(() => {
    const close = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const toggle = (item) => {
    onChange(selected.has(item) ? value.filter((current) => current !== item) : [...value, item]);
    setQuery("");
  };

  const handleKeyDown = (event) => {
    if (!open && ["ArrowDown", "Enter"].includes(event.key)) setOpen(true);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, visible.length - 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    }
    if (event.key === "Enter" && open && visible[activeIndex]) {
      event.preventDefault();
      toggle(visible[activeIndex]);
    }
    if (event.key === "Escape") setOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-zinc-600 dark:text-zinc-300">{label}</p>
      <div className="rounded-xl border border-zinc-300 bg-white p-2 shadow-sm transition focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-300/20 dark:border-zinc-700 dark:bg-zinc-950">
        <div className="flex flex-wrap gap-2">
          {value.map((item) => (
            <span className="inline-flex items-center gap-1 rounded-lg bg-cyan-100 px-2.5 py-1 text-xs font-extrabold text-cyan-950 dark:bg-cyan-400/20 dark:text-cyan-100" key={item}>
              {item}
              <button onClick={() => toggle(item)} type="button">
                <X size={13} />
              </button>
            </span>
          ))}
          <input
            className="h-8 min-w-[160px] flex-1 bg-transparent px-1 text-sm outline-none"
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
              setActiveIndex(0);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={value.length ? "Add another niche" : "Search niches"}
            value={query}
          />
          <ChevronDown className="mt-2 text-zinc-500" size={18} />
        </div>
      </div>
      {open && (
        <div className="absolute z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-zinc-200 bg-white p-2 shadow-2xl dark:border-zinc-700 dark:bg-zinc-950">
          {!query && suggestions.length > 0 && <p className="px-2 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-600 dark:text-cyan-300">Suggested for platform</p>}
          {visible.map((item, index) => (
            <button
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                index === activeIndex ? "bg-cyan-50 text-cyan-950 dark:bg-cyan-400/15 dark:text-cyan-100" : "hover:bg-zinc-100 dark:hover:bg-zinc-900"
              }`}
              key={`${item}-${index}`}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => toggle(item)}
              type="button"
            >
              <span>{item}</span>
              {selected.has(item) && <Badge variant="success">Selected</Badge>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const SearchableSelect = ({ label, options, value, onChange, recent = [] }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef(null);
  const selected = options.find((item) => item.value === value) || options[0];
  const visible = (query ? options : [...recent, ...options]).filter(
    (item, index, array) =>
      item.label.toLowerCase().includes(query.toLowerCase()) &&
      array.findIndex((candidate) => candidate.value === item.value) === index
  );

  useEffect(() => {
    const close = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-zinc-600 dark:text-zinc-300">{label}</p>
      <button
        className="flex h-12 w-full items-center justify-between rounded-xl border border-zinc-300 bg-white px-3 text-left text-sm font-bold shadow-sm transition hover:border-cyan-400 dark:border-zinc-700 dark:bg-zinc-950"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="flex items-center gap-2">
          <span>{selected.icon}</span>
          {selected.label}
        </span>
        <ChevronDown size={18} />
      </button>
      {open && (
        <div className="absolute z-30 mt-2 w-full rounded-xl border border-zinc-200 bg-white p-2 shadow-2xl dark:border-zinc-700 dark:bg-zinc-950">
          <input
            autoFocus
            className="mb-2 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-cyan-400 dark:border-zinc-700 dark:bg-zinc-900"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search country"
            value={query}
          />
          <div className="max-h-64 overflow-y-auto">
            {visible.map((item) => (
              <button
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold transition hover:bg-zinc-100 dark:hover:bg-zinc-900"
                key={item.value}
                onClick={() => {
                  onChange(item.value);
                  setOpen(false);
                  setQuery("");
                }}
                type="button"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const SegmentGroup = ({ label, icon: Icon, options, value, onChange }) => (
  <div>
    <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-zinc-600 dark:text-zinc-300">
      {Icon && <Icon size={14} />}
      {label}
    </p>
    <div className="flex flex-wrap gap-2">
      {options.map((item) => (
        <button
          className={`rounded-xl border px-3 py-2 text-sm font-bold transition ${
            value === item
              ? "border-cyan-400 bg-cyan-100 text-cyan-950 shadow-sm dark:bg-cyan-400/20 dark:text-cyan-100"
              : "border-zinc-200 bg-white text-zinc-700 hover:border-cyan-300 hover:bg-cyan-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
          }`}
          key={item}
          onClick={() => onChange(item)}
          type="button"
        >
          {item}
        </button>
      ))}
    </div>
  </div>
);

const TrendFinder = () => {
  const { user } = useAuth();
  const canUse = user?.role === "admin" || hasPlan(user, "pro");
  const [form, setForm] = useState({
    platform: "YouTube",
    niches: ["AI & Technology"],
    region: "Global",
    strength: "📈 Rising",
    goal: "More Views"
  });
  const [recent, setRecent] = useState(readRecent);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (canUse) trendService.history().then((data) => setHistory(data.trends || [])).catch(() => {});
  }, [canUse]);

  const suggestedNiches = platformSuggestions[form.platform] || [];
  const recentCountries = (recent.countries || [])
    .map((country) => countryOptions.find((item) => item.value === country))
    .filter(Boolean);
  const recentNiches = recent.niches || [];

  const submit = async () => {
    if (!form.niches.length) {
      toast.error("Select at least one niche");
      return;
    }

    const nextRecent = {
      niches: [...new Set([...form.niches, ...recentNiches])].slice(0, 6),
      countries: [...new Set([form.region, ...(recent.countries || [])])].slice(0, 4)
    };
    setRecent(nextRecent);
    saveRecent(nextRecent);
    setLoading(true);

    try {
      const payload = {
        platform: form.platform,
        niche: `${form.niches.join(", ")} | Strength: ${form.strength} | Goal: ${form.goal}`,
        region: form.region
      };
      const data = await trendService.find(payload);
      setResult(data.trend.result);
      setHistory((current) => [data.trend, ...current]);
      toast.success("Trend suggestions ready");
    } catch (error) {
      toast.error(error.response?.data?.message || "Trend finder failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Growth"
        title="Trend Finder"
        description="AI trend suggestions by platform, niche, goal, trend strength, and region."
      />
      {!canUse ? (
        <LockedFeature title="Trend Finder" requiredPlan="Pro" />
      ) : (
        <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
          <Card className="h-fit">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">
                  Discovery controls
                </p>
                <h2 className="mt-2 text-2xl font-extrabold text-zinc-950 dark:text-white">Find your next angle</h2>
              </div>
              <Badge variant="warning">AI suggestions</Badge>
            </div>
            <div className="grid gap-5">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-zinc-600 dark:text-zinc-300">
                  Platform
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {["YouTube", "Instagram", "Facebook", "LinkedIn", "X"].map((item) => (
                    <button
                      className={`rounded-xl border px-3 py-3 text-sm font-extrabold transition ${
                        form.platform === item
                          ? "border-zinc-950 bg-zinc-950 text-white dark:border-cyan-400 dark:bg-cyan-400/20"
                          : "border-zinc-200 bg-white text-zinc-700 hover:border-cyan-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200"
                      }`}
                      key={item}
                      onClick={() => setForm((current) => ({ ...current, platform: item }))}
                      type="button"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <SearchableMultiSelect
                label="Niche"
                onChange={(niches) => setForm((current) => ({ ...current, niches }))}
                options={nicheOptions}
                recent={recentNiches}
                suggestions={suggestedNiches}
                value={form.niches}
              />
              <SearchableSelect
                label="Country / region"
                onChange={(region) => setForm((current) => ({ ...current, region }))}
                options={countryOptions}
                recent={recentCountries}
                value={form.region}
              />
              <SegmentGroup
                icon={Flame}
                label="Trend strength"
                onChange={(strength) => setForm((current) => ({ ...current, strength }))}
                options={trendStrengthOptions}
                value={form.strength}
              />
              <SegmentGroup
                icon={Goal}
                label="Goal"
                onChange={(goal) => setForm((current) => ({ ...current, goal }))}
                options={goalOptions}
                value={form.goal}
              />
              <Button className="w-full" icon={Search} loading={loading} onClick={submit} size="lg" variant="accent">
                Find trends
              </Button>
            </div>
          </Card>

          <SectionContainer icon={TrendingUp} title="AI trend suggestions">
            {loading ? (
              <div className="grid gap-3">
                {[1, 2, 3, 4].map((item) => (
                  <div className="h-16 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" key={item} />
                ))}
              </div>
            ) : result ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge variant="warning">{result.sourceLabel}</Badge>
                  <Badge variant="brand">{form.strength}</Badge>
                  <Badge variant="success">{form.goal}</Badge>
                </div>
                <h2 className="text-3xl font-extrabold text-zinc-950 dark:text-white">
                  {result.opportunityScore}/100 opportunity
                </h2>
                {["trendingTopics", "trendingKeywords", "trendingHashtags", "trendingHooks", "contentIdeas"].map((key) => (
                  <div key={key}>
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
                      {key.replace(/([A-Z])/g, " $1")}
                    </p>
                    <div className="grid gap-2">
                      {(result[key] || []).map((item) => (
                        <div
                          className="rounded-xl border border-zinc-200 bg-white/90 p-3 text-sm leading-6 shadow-sm transition hover:border-cyan-300 dark:border-zinc-700 dark:bg-zinc-900"
                          key={item}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-600 dark:text-zinc-300">Run a search to generate suggestions.</p>
            )}
          </SectionContainer>
        </div>
      )}
      {canUse && history.length > 0 && (
        <SectionContainer className="mt-5" title="Recent trend searches">
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {history.slice(0, 6).map((item) => (
              <div
                className="rounded-xl border border-zinc-200 bg-white/90 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                key={item._id}
              >
                <p className="font-extrabold text-zinc-950 dark:text-white">{item.platform}</p>
                <p className="mt-1 line-clamp-2 text-zinc-600 dark:text-zinc-300">{item.niche}</p>
              </div>
            ))}
          </div>
        </SectionContainer>
      )}
    </div>
  );
};

export default TrendFinder;
