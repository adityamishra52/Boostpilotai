import { Eye, FileVideo, Image, UploadCloud, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";

import Button from "./Button";
import MediaPreviewModal from "./MediaPreviewModal";

const FileDropzone = ({ file, onFile }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

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
          "relative overflow-hidden rounded-lg border border-dashed p-4 transition duration-200",
          file
            ? "border-brand-300 bg-brand-50/70 dark:border-brand-800 dark:bg-brand-950/20"
            : "border-zinc-300 bg-white/72 hover:border-brand-400 hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/58 dark:hover:border-brand-600"
        )}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
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
              <div className="mb-3 grid h-11 w-11 place-items-center rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                {file.type.startsWith("video") ? <FileVideo size={20} /> : <Image size={20} />}
              </div>
              <h2 className="break-words text-lg font-extrabold text-zinc-950 dark:text-white">{file.name}</h2>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{file.type}</p>
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
          <div className="py-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-zinc-950 text-white shadow-glow dark:bg-white dark:text-zinc-950">
              <UploadCloud size={25} />
            </div>
            <h2 className="mt-5 text-xl font-extrabold text-zinc-950 dark:text-white">
              Drop your creative asset
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-zinc-500 dark:text-zinc-400">
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
