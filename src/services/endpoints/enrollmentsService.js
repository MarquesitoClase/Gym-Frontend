import { apiClient } from "../http/apiClient";

export const enrollmentsService = {
  listByUser: (userId) => apiClient.get(`/users/${userId}/activities`),
  register: (activityId, userId) =>
    apiClient.post(`/activities/${activityId}/users/${userId}`),
  remove: (activityId, userId) =>
    apiClient.delete(`/activities/${activityId}/users/${userId}`)
};
