import api from "./api";

export const authService = {
  async register(payload) {
    const { data } = await api.post("/auth/register", payload);
    return data;
  },

  async login(payload) {
    const { data } = await api.post("/auth/login", payload);
    return data;
  },

  async me() {
    const { data } = await api.get("/auth/me");
    return data;
  },

  async updateSettings(payload) {
    const { data } = await api.patch("/auth/settings", payload);
    return data;
  },

  async changePassword(payload) {
    const { data } = await api.patch("/auth/password", payload);
    return data;
  }
};
