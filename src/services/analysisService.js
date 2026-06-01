import api from "./api";

export const analysisService = {
  async analyze({ file, platform, contentType }) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("platform", platform);
    formData.append("contentType", contentType);

    const { data } = await api.post("/analysis/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    return data;
  },

  async history() {
    const { data } = await api.get("/analysis");
    return data;
  },

  async stats() {
    const { data } = await api.get("/analysis/stats");
    return data;
  },

  async get(id) {
    const { data } = await api.get(`/analysis/${id}`);
    return data;
  },

  async remove(id) {
    const { data } = await api.delete(`/analysis/${id}`);
    return data;
  },

  async premiumAction(id, action, payload = {}) {
    const endpoints = {
      applySuggestions: "apply-suggestions",
      fixWeakness: "fix-weakness",
      variants: "generate-variants",
      youtubeThumbnails: "youtube-thumbnails"
    };

    const endpoint = endpoints[action];

    if (!endpoint) {
      throw new Error("Unsupported premium action");
    }

    const { data } = await api.post(`/analysis/${id}/${endpoint}`, payload);
    return data;
  },

  async repurpose(id, payload = {}) {
    const { data } = await api.post(`/analysis/${id}/repurpose`, payload);
    return data;
  },

  async downloadReport(id) {
    const response = await api.get(`/analysis/${id}/report`, {
      responseType: "blob"
    });

    return response;
  }
};
