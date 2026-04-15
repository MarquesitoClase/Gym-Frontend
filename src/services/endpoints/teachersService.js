import { apiClient } from "../http/apiClient";

export const teachersService = {
  create: (payload) => apiClient.post("/teachers", payload),
  getById: (teacherId) => apiClient.get(`/teachers/${teacherId}`),
  listActive: () => apiClient.get("/teachers/active"),
  list: (query) => apiClient.get("/teachers", { query }),
  remove: (teacherId) => apiClient.delete(`/teachers/${teacherId}`),
  update: (teacherId, payload) =>
    apiClient.put(`/teachers/${teacherId}`, payload)
};
