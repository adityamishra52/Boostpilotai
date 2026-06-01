import api from "./api";

export const coachService = {
  async summary() {
    const { data } = await api.get("/coach/summary");
    return data;
  },

  async generate() {
    const { data } = await api.post("/coach/generate");
    return data;
  }
};
