import api from "./api";

export const contactService = {
  async send(payload) {
    const { data } = await api.post("/contact", payload);
    return data;
  },

  async adminMessages(params = {}) {
    const { data } = await api.get("/admin/contact-messages", { params });
    return data;
  },

  async updateStatus(id, status) {
    const { data } = await api.patch(`/admin/contact-messages/${id}/status`, { status });
    return data;
  }
};
