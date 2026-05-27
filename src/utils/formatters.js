export const formatDate = (date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(date));

export const formatFileSize = (bytes = 0) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const platformAccent = {
  YouTube: "from-red-500 to-coral",
  Instagram: "from-fuchsia-500 to-coral",
  Facebook: "from-blue-500 to-brand-500",
  LinkedIn: "from-sky-500 to-blue-700"
};
