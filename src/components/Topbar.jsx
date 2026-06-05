import { Menu, Plus, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";

import Button from "./Button";
import ThemeToggle from "./ThemeToggle";
import { analysisService } from "../services/analysisService";

const Topbar = ({ onMenu }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [reports, setReports] = useState([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    analysisService
      .history()
      .then((data) => {
        if (mounted) {
          setReports(data.analyses || []);
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const close = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setSuggestionsOpen(false);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const suggestions = useMemo(() => {
    const value = query.trim().toLowerCase();
    const quickLinks = [
      { detail: "Create a new report", label: "New report", to: "/analyze" },
      { detail: "Search saved reports", label: "History", to: "/history" },
      { detail: "Find topic ideas", label: "Trend Finder", to: "/trends" },
      { detail: "Reuse saved captions", label: "Content Library", to: "/library" },
      { detail: "Change account options", label: "Settings", to: "/settings" }
    ];

    const reportMatches = reports
      .map((item) => {
        const fileName = item.file?.originalName || "Uploaded media";
        return {
          detail: `${item.platform || "Report"}${item.contentType ? ` • ${item.contentType}` : ""}`,
          label: fileName,
          searchText: `${fileName} ${item.platform || ""} ${item.contentType || ""} ${item.aiOutput?.viralCaption || ""}`,
          to: `/results/${item._id}`
        };
      })
      .filter((item) => !value || item.searchText.toLowerCase().includes(value))
      .slice(0, 4);

    const quickMatches = quickLinks.filter((item) => !value || `${item.label} ${item.detail}`.toLowerCase().includes(value));
    const searchSuggestion = value
      ? [{ detail: "Search all saved reports", label: `Search for "${query.trim()}"`, to: `/history?search=${encodeURIComponent(query.trim())}` }]
      : [];

    return [...searchSuggestion, ...reportMatches, ...quickMatches].slice(0, 7);
  }, [query, reports]);

  const submitSearch = (event) => {
    event.preventDefault();
    const value = query.trim();
    setSuggestionsOpen(false);
    navigate(value ? `/history?search=${encodeURIComponent(value)}` : "/history");
  };

  const chooseSuggestion = (to) => {
    setSuggestionsOpen(false);
    navigate(to);
  };

  const searchInput = (size = "text-sm") => (
    <input
      className={`min-w-0 flex-1 bg-transparent ${size} text-zinc-950 outline-none placeholder:text-zinc-500 dark:text-white dark:placeholder:text-zinc-400`}
      onChange={(event) => {
        setQuery(event.target.value);
        setSuggestionsOpen(true);
      }}
      onFocus={() => setSuggestionsOpen(true)}
      placeholder="Search reports, sites, or opening lines"
      value={query}
    />
  );

  const renderSuggestionList = () => (
    suggestionsOpen && suggestions.length > 0 ? (
      <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-2 shadow-2xl dark:border-zinc-700 dark:bg-zinc-950">
        {suggestions.map((item) => (
          <button
            className="flex w-full min-w-0 items-start gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-zinc-100 focus-visible:bg-zinc-100 focus-visible:outline-none dark:hover:bg-zinc-900 dark:focus-visible:bg-zinc-900"
            key={`${item.label}-${item.to}`}
            onClick={() => chooseSuggestion(item.to)}
            type="button"
          >
            <Search className="mt-0.5 shrink-0 text-zinc-500" size={16} />
            <span className="min-w-0">
              <span className="block break-words text-sm font-extrabold text-zinc-950 dark:text-white">{item.label}</span>
              <span className="mt-0.5 block break-words text-xs font-semibold text-zinc-600 dark:text-zinc-300">{item.detail}</span>
            </span>
          </button>
        ))}
      </div>
    ) : null
  );

  return (
    <header className="sticky top-0 z-50 shrink-0 border-b border-zinc-200/80 bg-white/92 shadow-[0_10px_35px_rgba(15,23,42,0.06)] backdrop-blur-2xl dark:border-zinc-800/80 dark:bg-zinc-950/94" ref={wrapperRef}>
      <div className="mx-auto flex min-h-16 w-full max-w-[1440px] items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-5 lg:px-8">
        <Button
          aria-label="Open navigation"
          className="h-12 w-12 shrink-0 rounded-xl border-zinc-300 bg-white px-0 text-zinc-950 shadow-[0_12px_34px_rgba(15,23,42,0.18)] ring-1 ring-zinc-950/5 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:ring-white/10 lg:hidden [&>svg]:h-6 [&>svg]:w-6"
          icon={Menu}
          onClick={onMenu}
          variant="secondary"
        />

        <div className="relative hidden min-w-0 flex-1 md:block lg:max-w-xl">
          <form
            className="flex min-w-0 items-center gap-3 rounded-xl border border-zinc-200 bg-white/92 px-3 py-2.5 text-zinc-600 shadow-sm transition focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-300/35 hover:border-brand-300 dark:border-zinc-700 dark:bg-zinc-900/92 dark:text-zinc-300 dark:focus-within:ring-brand-400/25"
            onSubmit={submitSearch}
          >
            <Search className="shrink-0" size={18} />
            {searchInput()}
          </form>
          {renderSuggestionList()}
        </div>

        <div className="ml-auto flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Button
            as={Link}
            className="min-w-0 shrink-0 px-3 sm:px-4"
            icon={Plus}
            to="/analyze"
            variant="accent"
          >
            <span className="hidden sm:inline">New report</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>

      <div className="relative border-t border-zinc-200/80 px-3 py-2 dark:border-zinc-800 md:hidden">
        <form
          className="flex min-w-0 items-center gap-2 rounded-xl border border-zinc-200 bg-white/92 px-3 py-2 text-zinc-600 shadow-sm focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-300/35 dark:border-zinc-700 dark:bg-zinc-900/92 dark:text-zinc-300 dark:focus-within:ring-brand-400/25"
          onSubmit={submitSearch}
        >
          <Search className="shrink-0" size={16} />
          {searchInput("text-xs")}
        </form>
        {renderSuggestionList()}
      </div>
    </header>
  );
};

export default Topbar;
