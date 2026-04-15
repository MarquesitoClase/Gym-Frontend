import { apiClient } from "../http/apiClient";

export const usersService = {
  create: (payload) => apiClient.post("/users", payload),
  getById: (userId) => apiClient.get(`/users/${userId}`),
  listActive: () => apiClient.get("/users/active"),
  list: (query) => apiClient.get("/users", { query }),
  remove: (userId) => apiClient.delete(`/users/${userId}`),
  update: (userId, payload) => apiClient.put(`/users/${userId}`, payload)
};
