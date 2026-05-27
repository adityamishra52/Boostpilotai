import { FileText, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Badge from "../../components/Badge";
import Button from "../../components/Button";
import PageHeader from "../../components/PageHeader";
import ProtectedMedia from "../../components/ProtectedMedia";
import SectionContainer from "../../components/SectionContainer";
import Skeleton from "../../components/Skeleton";
import { adminService } from "../../services/adminService";
import { formatDate, formatFileSize } from "../../utils/formatters";

const AdminAnalyses = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");

  const loadAnalyses = async () => {
    setLoading(true);
    try {
      const data = await adminService.analyses();
      setAnalyses(data.analyses);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load analyses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyses();
  }, []);

  const handleDelete = async (id) => {
    setBusyId(id);
    try {
      await adminService.deleteAnalysis(id);
      await loadAnalyses();
      toast.success("Analysis deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setBusyId("");
    }
  };

  return (
    <div>
      <PageHeader
        action={<Badge variant="brand">{analyses.length} records</Badge>}
        description="Review and remove stored analysis history across all users."
        eyebrow="Admin"
        title="Analysis history"
      />

      <SectionContainer icon={FileText} title="All analyses">
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((item) => (
              <Skeleton className="h-20" key={item} />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                <tr>
                  <th className="px-3 py-2">Preview</th>
                  <th className="px-3 py-2">File</th>
                  <th className="px-3 py-2">User</th>
                  <th className="px-3 py-2">Target</th>
                  <th className="px-3 py-2">Score</th>
                  <th className="px-3 py-2">Size</th>
                  <th className="px-3 py-2">Created</th>
                  <th className="px-3 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {analyses.map((item) => {
                  const file = item.file || {};
                  const fileName = file.originalName || "Uploaded media";

                  return (
                    <tr className="border-t border-zinc-200 dark:border-zinc-800" key={item._id}>
                      <td className="px-3 py-3">
                        <ProtectedMedia
                          alt={fileName}
                          className="h-14 w-24 rounded-md"
                          file={file}
                          mediaClassName="h-full w-full object-cover"
                          placeholderClassName="min-h-full text-[10px]"
                        />
                      </td>
                      <td className="max-w-[260px] truncate px-3 py-3 font-semibold text-zinc-950 dark:text-white">
                        {fileName}
                      </td>
                      <td className="px-3 py-3 text-zinc-600 dark:text-zinc-300">
                        <div className="font-semibold text-zinc-950 dark:text-white">{item.user?.name || "Deleted"}</div>
                        <div className="text-xs text-zinc-500">{item.user?.email}</div>
                      </td>
                      <td className="px-3 py-3">
                        <Badge variant="neutral">
                          {item.platform} {item.contentType}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 font-bold text-zinc-950 dark:text-white">
                        {item.aiOutput?.contentScore ?? 0}
                      </td>
                      <td className="px-3 py-3 text-zinc-600 dark:text-zinc-300">
                        {formatFileSize(file.size || 0)}
                      </td>
                      <td className="px-3 py-3 text-zinc-600 dark:text-zinc-300">{formatDate(item.createdAt)}</td>
                      <td className="px-3 py-3 text-right">
                        <Button
                          disabled={busyId === item._id}
                          icon={Trash2}
                          onClick={() => handleDelete(item._id)}
                          size="sm"
                          variant="danger"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </SectionContainer>
    </div>
  );
};

export default AdminAnalyses;
