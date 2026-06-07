import { ArrowDown, ArrowUp, Eye, FileVideo, Image, UploadCloud, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";

import Button from "./Button";
import MediaPreviewModal from "./MediaPreviewModal";

const FileDropzone = ({ files = [], onFiles, multiImageLimit = 5 }) => {
  const inputRef = useRef(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const previews = useMemo(
    () =>
      files.map((file) => ({
        file,
        url: URL.createObjectURL(file)
      })),
    [files]
  );

  useEffect(
    () => () => {
      previews.forEach((item) => URL.revokeObjectURL(item.url));
    },
    [previews]
  );

  const primaryFile = files[0] || null;
  const isVideo = primaryFile?.type?.startsWith("video/");
  const showGrid = files.length > 1 && !isVideo;

  const handleFiles = useCallback(
    (incomingFiles) => {
      if (!incomingFiles?.length) {
        return;
      }

      onFiles(Array.from(incomingFiles));
    },
    [onFiles]
  );

  const moveFile = (index, direction) => {
    const nextIndex = index + direction;

    if (nextIndex < 0 || nextIndex >= files.length) {
      return;
    }

    const reordered = [...files];
    const [current] = reordered.splice(index, 1);
    reordered.splice(nextIndex, 0, current);
    onFiles(reordered);
  };

  const removeFile = (index) => {
    const nextFiles = files.filter((_, itemIndex) => itemIndex !== index);
    onFiles(nextFiles);
  };

  return (
    <>
      <div
        className={clsx(
          "relative overflow-hidden rounded-lg border border-dashed p-4 transition duration-200 focus-within:outline-none focus-within:ring-4 focus-within:ring-brand-300/45 dark:focus-within:ring-brand-400/35",
          files.length
            ? "border-brand-400 bg-brand-50/90 text-zinc-950 dark:border-brand-400/55 dark:bg-brand-400/10 dark:text-white"
            : dragActive
              ? "border-brand-400 bg-brand-50/95 text-zinc-950 shadow-glow dark:border-brand-300/70 dark:bg-brand-400/15 dark:text-white"
              : "border-zinc-300 bg-zinc-50/90 text-zinc-950 hover:border-brand-400 hover:bg-brand-50/70 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-100 dark:hover:border-brand-400/70 dark:hover:bg-zinc-900"
        )}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragActive(false);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          handleFiles(event.dataTransfer.files);
        }}
      >
        <input
          accept="image/jpeg,image/jpg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
          className="hidden"
          multiple
          onChange={(event) => handleFiles(event.target.files)}
          ref={inputRef}
          type="file"
        />
        {primaryFile ? (
          <div className="space-y-5">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-center">
              <div className="relative aspect-video overflow-hidden rounded-lg bg-zinc-950">
                {isVideo ? (
                  <video className="h-full w-full object-cover" muted src={previews[0]?.url} />
                ) : (
                  <img
                    alt={primaryFile.name}
                    className="h-full w-full object-cover"
                    decoding="async"
                    loading="lazy"
                    src={previews[0]?.url}
                  />
                )}
                <div className="absolute left-3 top-3 rounded-md bg-black/55 px-2 py-1 text-xs font-bold text-white backdrop-blur">
                  {isVideo ? "Video" : files.length > 1 ? `${files.length} Images` : "Image"}
                </div>
                {files.length > 1 && !isVideo && (
                  <div className="absolute bottom-3 left-3 rounded-md bg-white/90 px-2 py-1 text-xs font-bold text-zinc-950">
                    First image is the hook
                  </div>
                )}
              </div>
              <div>
                <div className="mb-3 grid h-11 w-11 place-items-center rounded-lg bg-zinc-950 text-white shadow-sm dark:bg-zinc-800 dark:text-zinc-100">
                  {isVideo ? <FileVideo size={20} /> : <Image size={20} />}
                </div>
                <h2 className="break-words text-lg font-extrabold text-zinc-950 dark:text-white">
                  {primaryFile.name}
                </h2>
                <p className="mt-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                  {isVideo ? primaryFile.type : `${files.length} file${files.length === 1 ? "" : "s"} selected`}
                </p>
                {!isVideo && (
                  <>
                    <p className="mt-3 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                      Upload up to {multiImageLimit} images for one post
                    </p>
                    <p className="mt-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
                      Drag to reorder. First image becomes the hook image.
                    </p>
                  </>
                )}
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button
                    icon={Eye}
                    onClick={() => {
                      setPreviewIndex(0);
                      setPreviewOpen(true);
                    }}
                    variant="secondary"
                  >
                    Preview
                  </Button>
                  <Button onClick={() => inputRef.current?.click()} variant="accent">
                    Replace files
                  </Button>
                  <Button icon={X} onClick={() => onFiles([])} variant="ghost">
                    Remove all
                  </Button>
                </div>
              </div>
            </div>

            {showGrid && (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-extrabold text-zinc-950 dark:text-white">Image order</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-600 dark:text-zinc-300">
                    {files.length} selected
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                  {previews.map((item, index) => (
                    <div
                      className="overflow-hidden rounded-lg border border-zinc-200 bg-white/88 p-2 dark:border-zinc-700 dark:bg-zinc-900/90"
                      key={`${item.file.name}-${index}`}
                    >
                      <div className="relative aspect-square overflow-hidden rounded-lg bg-zinc-950">
                        <img
                          alt={item.file.name}
                          className="h-full w-full object-cover"
                          decoding="async"
                          loading="lazy"
                          src={item.url}
                        />
                        <div className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-1 text-[11px] font-bold text-white">
                          {index === 0 ? "Primary" : `Image ${index + 1}`}
                        </div>
                      </div>
                      <p className="mt-2 line-clamp-2 text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                        {item.file.name}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button
                          icon={ArrowUp}
                          onClick={() => moveFile(index, -1)}
                          size="sm"
                          variant="secondary"
                        >
                          Up
                        </Button>
                        <Button
                          icon={ArrowDown}
                          onClick={() => moveFile(index, 1)}
                          size="sm"
                          variant="secondary"
                        >
                          Down
                        </Button>
                        <Button
                          icon={Eye}
                          onClick={() => {
                            setPreviewIndex(index);
                            setPreviewOpen(true);
                          }}
                          size="sm"
                          variant="secondary"
                        >
                          View
                        </Button>
                        <Button icon={X} onClick={() => removeFile(index)} size="sm" variant="ghost">
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-10 text-center sm:py-12">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-zinc-950 text-white shadow-glow dark:bg-zinc-800 dark:text-zinc-100 dark:ring-1 dark:ring-zinc-700">
              <UploadCloud size={25} />
            </div>
            <h2 className="mt-5 text-xl font-extrabold text-zinc-950 dark:text-white">
              Drop your creative asset
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm font-medium leading-6 text-zinc-600 dark:text-zinc-300">
              Single image, multiple images, or one video. Images must be JPG, JPEG, PNG, or WebP up to 10 MB each.
            </p>
            <div className="mt-6 flex justify-center">
              <Button onClick={() => inputRef.current?.click()} variant="accent">
                Choose files
              </Button>
            </div>
          </div>
        )}
      </div>
      <MediaPreviewModal
        onClose={() => setPreviewOpen(false)}
        open={previewOpen}
        src={previews[previewIndex]?.url || ""}
        title={files[previewIndex]?.name}
        type={files[previewIndex]?.type}
      />
    </>
  );
};

export default FileDropzone;
