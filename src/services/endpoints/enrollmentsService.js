import { apiClient } from "../http/apiClient";

export const enrollmentsService = {
  cancel: (enrollmentId) => apiClient.delete(`/enrollments/${enrollmentId}`),
  create: (payload) => apiClient.post("/enrollments", payload),
  getById: (enrollmentId) => apiClient.get(`/enrollments/${enrollmentId}`),
  list: (query) => apiClient.get("/enrollments", { query }),
  listFutureByUser: (userId) =>
    apiClient.get(`/users/${userId}/future-enrollments`)
};
