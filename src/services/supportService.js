import api from "./api";

export const supportService = {
  async createTicket(payload) {
    const hasAttachment = payload.attachment instanceof File;
    const body = hasAttachment ? new FormData() : payload;

    if (hasAttachment) {
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          body.append(key, value);
        }
      });
    }

    const { data } = await api.post("/support/tickets", body, hasAttachment ? { headers: { "Content-Type": "multipart/form-data" } } : undefined);
    return data;
  },

  async createFeedback(payload) {
    const { data } = await api.post("/feedback", payload);
    return data;
  },

  async adminTickets(params = {}) {
    const { data } = await api.get("/admin/support/tickets", { params });
    return data;
  },

  async updateTicketStatus(id, status) {
    const { data } = await api.patch(`/admin/support/tickets/${id}/status`, { status });
    return data;
  },

  async adminFeedback(params = {}) {
    const { data } = await api.get("/admin/feedback", { params });
    return data;
  },

  async updateFeedbackStatus(id, status) {
    const { data } = await api.patch(`/admin/feedback/${id}/status`, { status });
    return data;
  }
};
