import { ApiError } from "./ApiError";

export function getApiErrorMessage(error, fallbackMessage) {
  if (error instanceof ApiError) {
    if (typeof error.payload === "string" && error.payload.trim()) {
      return error.payload;
    }

    if (error.payload?.message) {
      return error.payload.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}
