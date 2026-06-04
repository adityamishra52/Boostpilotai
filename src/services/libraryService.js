import api from "./api";

export const libraryService = {
  async create(payload) {
    const { data } = await api.post("/library/save", payload);
    return data;
  },

  async list(params = {}) {
    const { data } = await api.get("/library", { params });
    return data;
  },

  async remove(id) {
    const { data } = await api.delete(`/library/${id}`);
    return data;
  },

  async update(id, payload) {
    const { data } = await api.patch(`/library/${id}`, payload);
    return data;
  },

  async favorite(id, favorite) {
    const { data } = await api.patch("/library/favorite", { id, favorite });
    return data;
  }
};
