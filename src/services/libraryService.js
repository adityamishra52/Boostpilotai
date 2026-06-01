import api from "./api";

export const libraryService = {
  async create(payload) {
    const { data } = await api.post("/library", payload);
    return data;
  },

  async list(params = {}) {
    const { data } = await api.get("/library", { params });
    return data;
  },

  async remove(id) {
    const { data } = await api.delete(`/library/${id}`);
    return data;
  }
};
