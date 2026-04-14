import { apiConfig } from "../config/apiConfig";
import { ApiError } from "./ApiError";

function buildUrl(path, query) {
  const url = new URL(path, apiConfig.baseUrl);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((entry) => url.searchParams.append(key, entry));
        return;
      }

      url.searchParams.set(key, value);
    });
  }

  return url;
}

async function parseResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

async function request(path, { body, headers, method = "GET", query } = {}) {
  const url = buildUrl(path, query);
  const isFormData = body instanceof FormData;

  const response = await fetch(url, {
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    headers: isFormData
      ? headers
      : {
          ...apiConfig.headers,
          ...headers
        },
    method
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, {
      payload,
      status: response.status,
      url: url.toString()
    });
  }

  return payload;
}

export const apiClient = {
  delete: (path, options) => request(path, { ...options, method: "DELETE" }),
  get: (path, options) => request(path, { ...options, method: "GET" }),
  patch: (path, body, options) =>
    request(path, { ...options, body, method: "PATCH" }),
  post: (path, body, options) =>
    request(path, { ...options, body, method: "POST" }),
  put: (path, body, options) =>
    request(path, { ...options, body, method: "PUT" }),
  request
};
