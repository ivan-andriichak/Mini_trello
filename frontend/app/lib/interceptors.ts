import { api, refresh } from "./api";
import { AxiosError, AxiosRequestConfig } from "axios";

let isRefreshing = false;

export function getUserFriendlyError(error: AxiosError, fallback: string = "Unknown error"): string {
  if (error.response) {
    const { status, data } = error.response;
    if (typeof data === "string") return data;
    if (typeof data === "object" && data !== null) {
      if ("message" in data) {
        const msg = (data as { message?: unknown }).message;
        if (Array.isArray(msg)) return msg.join(', ');
        if (typeof msg === "string") return msg;
      }
      if ("error" in data && typeof (data as { error?: unknown }).error === "string") {
        return (data as { error: string }).error;
      }
    }
    if (status === 401) return "Incorrect email or password";
    if (status === 404) return "User not found";
    if (status === 409) return "User already exists";
    if (status === 422) return "Validation error";
    return fallback;
  }
  if (error.message) return error.message;
  return fallback;
}

export const onError = async (error: AxiosError) => {
  error.message = getUserFriendlyError(error, error.message);

  const url = error.config?.url ?? "";
  const isAuthRequest = url.includes("/auth/login") || url.includes("/auth/refresh");

  if (
    error.response &&
    error.response.status === 401 &&
    !isAuthRequest &&
    !isRefreshing
  ) {
    isRefreshing = true;
    try {
      await refresh();
      isRefreshing = false;
      return api(error.config as AxiosRequestConfig);
    } catch (refreshError) {
      isRefreshing = false;
      (refreshError as AxiosError).message = getUserFriendlyError(
        refreshError as AxiosError,
        "Session expired. Please log in again."
      );
      throw refreshError;
    }
  }
  throw error;
};