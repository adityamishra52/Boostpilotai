export const thumbnailFormatForAnalysis = ({ platform = "", contentType = "" } = {}) => {
  const normalizedPlatform = String(platform).toLowerCase();
  const normalizedType = String(contentType).toLowerCase();

  if (normalizedPlatform === "youtube" && ["video", "thumbnail"].includes(normalizedType)) {
    return {
      key: "youtube-wide",
      label: "YouTube Thumbnail Images",
      description: "Generate content-aware 16:9 thumbnails using the uploaded media frame.",
      aspectClass: "aspect-video",
      ratio: "16:9"
    };
  }

  if (
    normalizedType.includes("short") ||
    normalizedType.includes("reel") ||
    normalizedType.includes("story")
  ) {
    return {
      key: "vertical-cover",
      label: "Vertical Cover Images",
      description: "Generate vertical 9:16 cover images using the uploaded media frame.",
      aspectClass: "aspect-[9/16]",
      ratio: "9:16"
    };
  }

  if (normalizedPlatform === "instagram") {
    return {
      key: "instagram-post",
      label: "Post Cover Images",
      description: "Generate feed-ready 4:5 cover images using the uploaded media frame.",
      aspectClass: "aspect-[4/5]",
      ratio: "4:5"
    };
  }

  if (normalizedPlatform === "facebook") {
    return {
      key: "facebook-post",
      label: "Post Cover Images",
      description: "Generate 1200x630 Facebook cover images using the uploaded media frame.",
      aspectClass: "aspect-[40/21]",
      ratio: "1.91:1"
    };
  }

  if (normalizedPlatform === "linkedin") {
    return {
      key: "linkedin-post",
      label: "Post Cover Images",
      description: "Generate 1200x627 LinkedIn cover images using the uploaded media frame.",
      aspectClass: "aspect-[1200/627]",
      ratio: "1.91:1"
    };
  }

  if (normalizedPlatform === "twitter/x" || normalizedPlatform === "x") {
    return {
      key: "twitter-x-post",
      label: "Twitter/X Media Images",
      description: "Generate 1200x675 Twitter/X media images using the uploaded media frame.",
      aspectClass: "aspect-video",
      ratio: "16:9"
    };
  }

  return {
    key: "post-cover",
    label: "Post Cover Images",
    description: "Generate content-aware cover images using the uploaded media frame.",
    aspectClass: "aspect-square",
    ratio: "1:1"
  };
};
