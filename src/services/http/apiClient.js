import { apiConfig } from "../config/apiConfig";
import { ApiError } from "./ApiError";

function buildUrl(path, query) {
  const baseUrl = apiConfig.baseUrl.endsWith("/")
    ? apiConfig.baseUrl
    : `${apiConfig.baseUrl}/`;
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  const url = new URL(normalizedPath, baseUrl);

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

function resolveErrorMessage(payload, response) {
  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  if (payload?.message) {
    return payload.message;
  }

  return `Request failed with status ${response.status}`;
}

async function request(path, { body, headers, method = "GET", query } = {}) {
  const url = buildUrl(path, query);
  const isFormData = body instanceof FormData;

  let response;

  try {
    response = await fetch(url, {
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
      headers: isFormData
        ? headers
        : {
            ...apiConfig.headers,
            ...headers
          },
      method
    });
  } catch (error) {
    throw new ApiError("No se pudo conectar con el backend.", {
      cause: error,
      payload: null,
      status: 0,
      url: url.toString()
    });
  }

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new ApiError(resolveErrorMessage(payload, response), {
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
