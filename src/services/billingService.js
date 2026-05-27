import api from "./api";

export const billingService = {
  async settings() {
    const { data } = await api.get("/billing/settings");
    return data;
  },

  async qrBlob() {
    const { data } = await api.get("/billing/qr", { responseType: "blob" });
    return data;
  },

  async requestUpgrade({ plan, billingCycle }) {
    const { data } = await api.post("/billing/upgrade-request", { plan, billingCycle });
    return data;
  }
};
