import { apiClient } from "../http/apiClient";

export const activitiesService = {
  create: (payload) => apiClient.post("/activities", payload),
  getById: (activityId) => apiClient.get(`/activities/${activityId}`),
  list: (query) => apiClient.get("/activities", { query }),
  remove: (activityId) => apiClient.delete(`/activities/${activityId}`),
  update: (activityId, payload) =>
    apiClient.put(`/activities/${activityId}`, payload)
};
