import api from "./api";

export const trendService = {
  async find(payload) {
    const { data } = await api.post("/trends/find", payload);
    return data;
  },

  async history() {
    const { data } = await api.get("/trends/history");
    return data;
  },

  async remove(id) {
    const { data } = await api.delete(`/trends/${id}`);
    return data;
  }
};
