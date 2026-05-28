import { Eye, FileVideo, Image, UploadCloud, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";

import Button from "./Button";
import MediaPreviewModal from "./MediaPreviewModal";

const FileDropzone = ({ file, onFile }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return undefined;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFiles = useCallback(
    (files) => {
      const selected = files?.[0];
      if (selected) {
        onFile(selected);
      }
    },
    [onFile]
  );

  return (
    <>
      <div
        className={clsx(
          "relative overflow-hidden rounded-lg border border-dashed p-4 transition duration-200 focus-within:outline-none focus-within:ring-4 focus-within:ring-brand-300/45 dark:focus-within:ring-brand-400/35",
          file
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
          accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
          ref={inputRef}
          type="file"
        />
        {file && previewUrl ? (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-center">
            <div className="relative aspect-video overflow-hidden rounded-lg bg-zinc-950">
              {file.type.startsWith("video") ? (
                <video className="h-full w-full object-cover" muted src={previewUrl} />
              ) : (
                <img alt={file.name} className="h-full w-full object-cover" src={previewUrl} />
              )}
              <div className="absolute left-3 top-3 rounded-md bg-black/55 px-2 py-1 text-xs font-bold text-white backdrop-blur">
                {file.type.startsWith("video") ? "Video" : "Image"}
              </div>
            </div>
            <div>
              <div className="mb-3 grid h-11 w-11 place-items-center rounded-lg bg-zinc-950 text-white shadow-sm dark:bg-zinc-800 dark:text-zinc-100">
                {file.type.startsWith("video") ? <FileVideo size={20} /> : <Image size={20} />}
              </div>
              <h2 className="break-words text-lg font-extrabold text-zinc-950 dark:text-white">{file.name}</h2>
              <p className="mt-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">{file.type}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button icon={Eye} onClick={() => setPreviewOpen(true)} variant="secondary">
                  Preview
                </Button>
                <Button icon={X} onClick={() => onFile(null)} variant="ghost">
                  Remove
                </Button>
              </div>
            </div>
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
              JPG, PNG, WebP, MP4, MOV, or WebM up to 100 MB.
            </p>
            <div className="mt-6 flex justify-center">
              <Button onClick={() => inputRef.current?.click()} variant="accent">
                Choose file
              </Button>
            </div>
          </div>
        )}
      </div>
      <MediaPreviewModal
        onClose={() => setPreviewOpen(false)}
        open={previewOpen}
        src={previewUrl}
        title={file?.name}
        type={file?.type}
      />
    </>
  );
};

export default FileDropzone;
