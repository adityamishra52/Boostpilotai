import api from "./api";

const apiOrigin = (import.meta.env.VITE_API_URL || "http://localhost:5000/api")
  .replace(/\/api\/?$/, "")
  .replace(/\/$/, "");

export const getMediaUrlFromFile = (file = {}) => {
  const mediaId = file.mediaFileId || file.mediaId;
  const candidate = file.mediaUrl || file.url || (mediaId ? `/api/media/${mediaId}` : "");

  if (!candidate || candidate.includes("/uploads/")) {
    return "";
  }

  return candidate;
};

const normalizeMediaRequestUrl = (mediaUrl) => {
  if (!mediaUrl) {
    return "";
  }

  if (/^https?:\/\//i.test(mediaUrl)) {
    return mediaUrl;
  }

  if (mediaUrl.startsWith("/api/")) {
    return mediaUrl.slice(4);
  }

  if (mediaUrl.startsWith("/media/")) {
    return mediaUrl;
  }

  return "";
};

export const getAbsoluteMediaUrl = (mediaUrl) => {
  if (!mediaUrl) {
    return "";
  }

  if (/^https?:\/\//i.test(mediaUrl)) {
    return mediaUrl;
  }

  return `${apiOrigin}${mediaUrl.startsWith("/") ? mediaUrl : `/${mediaUrl}`}`;
};

export const mediaService = {
  async fetchBlob(mediaUrl) {
    const requestUrl = normalizeMediaRequestUrl(mediaUrl);

    if (!requestUrl) {
      throw new Error("Preview unavailable");
    }

    const response = await api.get(requestUrl, {
      responseType: "blob"
    });

    return response;
  }
};
