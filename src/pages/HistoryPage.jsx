import { Download, ExternalLink, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import Badge from "../components/Badge";
import Button from "../components/Button";
import Card from "../components/Card";
import CopyButton from "../components/CopyButton";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import ProtectedMedia from "../components/ProtectedMedia";
import Skeleton from "../components/Skeleton";
import { analysisService } from "../services/analysisService";
import { downloadBlob } from "../utils/download";
import { formatDate, formatFileSize, platformAccent } from "../utils/formatters";

const platforms = ["All", "YouTube", "Instagram", "Facebook", "LinkedIn", "Twitter/X"];

const HistoryPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("All");

  const loadHistory = async () => {
    try {
      const data = await analysisService.history();
      setItems(data.analyses);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesPlatform = platform === "All" || item.platform === platform;
      const searchable = `${item.file?.originalName || ""} ${item.platform} ${item.contentType || ""} ${
        item.aiOutput?.viralCaption || ""
      }`.toLowerCase();
      return matchesPlatform && searchable.includes(query.toLowerCase());
    });
  }, [items, platform, query]);

  const handleDelete = async (id) => {
    try {
      await analysisService.remove(id);
      setItems((current) => current.filter((item) => item._id !== id));
      toast.success("Analysis deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const handleDownload = async (id) => {
    try {
      const response = await analysisService.downloadReport(id);
      downloadBlob(response);
    } catch (error) {
      toast.error(error.response?.data?.message || "Download failed");
    }
  };

  return (
    <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 10 }}>
      <PageHeader
        description="A searchable archive of generated strategy, media quality, and PDF reports."
        eyebrow="History"
        title="Analysis library"
      />

      <Card className="mb-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex h-11 flex-1 items-center gap-3 rounded-lg border border-zinc-300 bg-white px-4 text-zinc-600 shadow-sm focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-300/35 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:focus-within:ring-brand-400/25">
            <Search size={18} />
            <input
              className="w-full bg-transparent text-sm text-zinc-950 outline-none placeholder:text-zinc-500 dark:text-white dark:placeholder:text-zinc-400"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search file, caption, platform, or content type"
              value={query}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {platforms.map((item) => (
              <button
                className={`rounded-lg px-3 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300/35 dark:focus-visible:ring-brand-400/25 ${
                  platform === item
                    ? "bg-zinc-950 text-white dark:bg-brand-400/20 dark:text-white dark:ring-1 dark:ring-brand-300/40"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                }`}
                key={item}
                onClick={() => setPlatform(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {!loading && filtered.length === 0 ? (
        <EmptyState
          description="No saved analyses match this view."
          title="Nothing here yet"
        />
      ) : (
        <div className="grid gap-3">
          {loading
            ? [0, 1, 2, 3].map((item) => <Skeleton className="h-28" key={item} />)
            : filtered.map((item) => {
                const output = item.aiOutput || {};
                const tech = output.technicalAnalysis || {};
                const file = item.file || {};
                const fileName = file.originalName || "Uploaded media";
                const copyText = [
                  output.summary,
                  output.viralCaption,
                  (output.hashtags || []).join(" "),
                  (output.titleIdeas || []).join("\n"),
                  (output.hookLines || []).join("\n"),
                  (output.cta || output.ctaSuggestions || []).join("\n"),
                  (output.improvementSuggestions || output.engagementSuggestions || []).join("\n"),
                  tech.platformFit || ""
                ].join("\n\n");

                return (
                  <Card className="p-4 hover:-translate-y-0.5" key={item._id}>
                    <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-center">
                      <div className="flex min-w-0 flex-col gap-4 sm:flex-row">
                        <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-lg bg-zinc-950 sm:h-24 sm:w-40">
                          <ProtectedMedia
                            alt={fileName}
                            className="h-full w-full rounded-none"
                            file={file}
                            mediaClassName="h-full w-full object-cover"
                            placeholderClassName="min-h-full text-[11px]"
                          />
                          <div
                            className={`absolute left-2 top-2 grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br ${
                              platformAccent[item.platform]
                            } text-sm font-extrabold text-white shadow-lg`}
                          >
                            {output.contentScore ?? 0}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="truncate text-lg font-extrabold tracking-tight text-zinc-950 dark:text-white">
                              {fileName}
                            </h2>
                            <Badge variant="neutral">{item.platform}</Badge>
                            {item.contentType && <Badge variant="brand">{item.contentType}</Badge>}
                            {tech.platformFit && (
                              <Badge variant={tech.platformFit.toLowerCase().includes("strong") ? "success" : "warning"}>
                                {tech.platformFit}
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                            {formatDate(item.createdAt)} - {formatFileSize(file.size)}
                            {tech.width ? ` - ${tech.width}x${tech.height}` : ""}
                          </p>
                          <p className="mt-3 line-clamp-2 text-sm font-medium leading-6 text-zinc-700 dark:text-zinc-300">
                            {output.viralCaption}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 xl:justify-end">
                        <CopyButton text={copyText} />
                        <Button icon={Download} onClick={() => handleDownload(item._id)} variant="secondary">
                          Report
                        </Button>
                        <Button as={Link} icon={ExternalLink} to={`/results/${item._id}`} variant="secondary">
                          Open
                        </Button>
                        <Button icon={Trash2} onClick={() => handleDelete(item._id)} variant="danger">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
        </div>
      )}
    </motion.div>
  );
};

export default HistoryPage;
