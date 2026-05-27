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

  async downloadReport(id) {
    const response = await api.get(`/analysis/${id}/report`, {
      responseType: "blob"
    });

    return response;
  }
};
