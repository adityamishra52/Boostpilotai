import api from "./api";

export const adminService = {
  async analytics() {
    const { data } = await api.get("/admin/analytics");
    return data;
  },

  async users() {
    const { data } = await api.get("/admin/users");
    return data;
  },

  async updateCredits(id, credits) {
    const { data } = await api.patch(`/admin/users/${id}/credits`, { credits });
    return data;
  },

  async updatePlan(id, plan, billingCycle = "monthly") {
    const { data } = await api.patch(`/admin/users/${id}/plan`, { plan, billingCycle });
    return data;
  },

  async updateBlock(id, isBlocked) {
    const { data } = await api.patch(`/admin/users/${id}/block`, { isBlocked });
    return data;
  },

  async deleteUser(id) {
    const { data } = await api.delete(`/admin/users/${id}`);
    return data;
  },

  async regeneratePassword(id, password) {
    const payload = password ? { password } : {};
    const { data } = await api.patch(`/admin/users/${id}/password`, payload);
    return data;
  },

  async analyses() {
    const { data } = await api.get("/admin/analyses");
    return data;
  },

  async deleteAnalysis(id) {
    const { data } = await api.delete(`/admin/analyses/${id}`);
    return data;
  },

  async updateBilling(payload) {
    const { data } = await api.patch("/admin/billing", payload);
    return data;
  },

  async uploadBillingQr(file) {
    const formData = new FormData();
    formData.append("qr", file);

    const { data } = await api.post("/admin/billing/qr", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
  },

  async deleteBillingQr() {
    const { data } = await api.delete("/admin/billing/qr");
    return data;
  }
};
