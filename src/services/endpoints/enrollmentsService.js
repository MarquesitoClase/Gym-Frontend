import { apiClient } from "../http/apiClient";

export const enrollmentsService = {
  listByUser: (userId) => apiClient.get(`/users/${userId}/activities`),
  register: (activityId, userId) =>
    apiClient.post(`/activities/${activityId}/users/${userId}`),
  remove: (activityId, userId) =>
    apiClient.delete(`/activities/${activityId}/users/${userId}`),

  listAll: () => apiClient.get("/enrollments"),
  listByActivity: (activityId) =>
    apiClient.get(`/enrollments/activity/${activityId}`),
  listByUserDetailed: (userId) =>
    apiClient.get(`/enrollments/user/${userId}`),
  getOne: (activityId, userId) =>
    apiClient.get(`/enrollments/${activityId}/${userId}`),
  update: (activityId, userId, payload) =>
    apiClient.put(`/enrollments/${activityId}/${userId}`, payload),
  cancel: (activityId, userId) =>
    apiClient.patch(`/enrollments/${activityId}/${userId}/cancel`)
};
