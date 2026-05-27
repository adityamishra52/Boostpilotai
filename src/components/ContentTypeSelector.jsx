import clsx from "clsx";

export const contentTypesByPlatform = {
  YouTube: ["Video", "Short", "Thumbnail"],
  Instagram: ["Reel", "Post", "Story"],
  LinkedIn: ["Image Post", "Video Post", "Carousel"],
  Facebook: ["Image Post", "Video Post", "Story"]
};

const helperText = {
  Video: "Long-form video",
  Short: "9:16 under 60s",
  Thumbnail: "16:9 image",
  Reel: "Vertical video",
  Post: "Feed image",
  Story: "Vertical story",
  "Image Post": "Static creative",
  "Video Post": "Feed video",
  Carousel: "Multi-slide story"
};

const ContentTypeSelector = ({ platform, value, onChange }) => {
  const options = contentTypesByPlatform[platform] || [];

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
      {options.map((item) => {
        const active = value === item;

        return (
          <button
            className={clsx(
              "min-h-24 min-w-0 rounded-lg border px-4 py-3 text-left transition duration-200",
              active
                ? "border-transparent bg-zinc-950 text-white shadow-soft dark:bg-white dark:text-zinc-950"
                : "border-zinc-200 bg-white/72 text-zinc-700 hover:-translate-y-0.5 hover:border-brand-300 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-200"
            )}
            key={item}
            onClick={() => onChange(item)}
            type="button"
          >
            <span className="block break-words text-sm font-extrabold">{item}</span>
            <span className={clsx("mt-1 block text-xs", active ? "opacity-70" : "text-zinc-500")}>
              {helperText[item]}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ContentTypeSelector;
