import { useAuthStore } from "@/stores/auth.store";
import { authApi } from "../axios";
import { refreshAccessToken } from "./auth.session";
let isInstalled = false;

export function setupAuthInterceptors() {
  if (isInstalled) {
    return;
  }

  isInstalled = true;

  // Attach access token
  authApi.interceptors.request.use(
    (config) => {
      const accessToken = useAuthStore.getState().accessToken;

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    },

    (error) => {
      return Promise.reject(error);
    },
  );

  // Handle expired access token
  authApi.interceptors.response.use(
    (response) => response,

    async (error) => {
      const originalRequest = error.config;

      const status = error.response?.status;

      if (
        status !== 401 ||
        !originalRequest ||
        originalRequest._retry ||
        originalRequest.skipAuthRefresh
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const { accessToken } = await refreshAccessToken();

        originalRequest.headers = originalRequest.headers ?? {};

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return authApi(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearSession();

        return Promise.reject(refreshError);
      }
    },
  );
}
