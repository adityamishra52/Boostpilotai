import clsx from "clsx";

export const contentTypesByPlatform = {
  YouTube: ["Video", "Short", "Thumbnail"],
  Instagram: ["Post", "Reel", "Story", "Video"],
  LinkedIn: ["Post", "Image Post", "Video Post", "Carousel", "Video"],
  Facebook: ["Post", "Image Post", "Video Post", "Story", "Video"]
};

const helperText = {
  Video: "Motion creative",
  Short: "9:16 under 60s",
  Thumbnail: "16:9 image",
  Reel: "9:16 vertical",
  Post: "Feed image",
  "Image Post": "Feed image",
  "Video Post": "Feed video",
  Story: "Vertical story",
  Carousel: "Multi-slide story"
};

const ContentTypeSelector = ({ platform, value, onChange }) => {
  const options = contentTypesByPlatform[platform] || [];

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))] gap-3">
      {options.map((item) => {
        const active = value === item;

        return (
          <button
            className={clsx(
              "min-h-24 min-w-0 rounded-lg border px-4 py-3 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300/45 dark:focus-visible:ring-brand-400/35",
              active
                ? "border-zinc-950 bg-zinc-950 text-white shadow-soft dark:border-brand-300/60 dark:bg-brand-400/20 dark:text-white"
                : "border-zinc-200 bg-white/90 text-zinc-900 hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50/70 dark:!border-zinc-700 dark:!bg-zinc-900/90 dark:!text-zinc-100 dark:hover:!border-brand-400/70 dark:hover:!bg-zinc-900"
            )}
            key={item}
            onClick={() => onChange(item)}
            type="button"
          >
            <span className="block break-words text-sm font-extrabold">{item}</span>
            <span className={clsx("mt-1 block text-xs font-semibold", active ? "text-zinc-200 dark:text-brand-100" : "text-zinc-700 dark:!text-zinc-300")}>
              {helperText[item]}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ContentTypeSelector;
