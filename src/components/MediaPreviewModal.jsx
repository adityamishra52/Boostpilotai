import { X } from "lucide-react";
import { motion } from "framer-motion";

import Button from "./Button";

const MediaPreviewModal = ({ open, onClose, src, type, title }) => {
  if (!open || !src) {
    return null;
  }

  const isVideo = type?.startsWith("video");

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/72 p-4 backdrop-blur-xl">
      <motion.div
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-4xl overflow-hidden rounded-lg border border-white/10 bg-zinc-950 shadow-2xl"
        initial={{ opacity: 0, scale: 0.98, y: 12 }}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <p className="truncate text-sm font-bold text-white">{title || "Preview"}</p>
          <Button className="h-9 w-9 px-0" icon={X} onClick={onClose} variant="ghost" />
        </div>
        <div className="max-h-[78vh] bg-black">
          {isVideo ? (
            <video className="mx-auto max-h-[78vh] w-full object-contain" controls src={src} />
          ) : (
            <img alt={title || "Media preview"} className="mx-auto max-h-[78vh] w-full object-contain" decoding="async" loading="lazy" src={src} />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MediaPreviewModal;
