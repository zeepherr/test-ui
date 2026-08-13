import { toast } from "sonner";

import { authApi, publicApi } from "@/api/axios";
import { getApiError } from "@/lib/api.error";

let isInstalled = false;

function handleApiError(error) {
  const apiError = getApiError(error);

  // Component catch block က normalized error ကို သုံးနိုင်ရန်
  error.apiError = apiError;

  const config = error.config;
  const errorMode = config?.errorMode ?? "toast";

  // Retry chain တစ်ခုထဲမှာ toast နှစ်ခါမပြရန်
  if (config?._globalErrorHandled) {
    return Promise.reject(error);
  }

  if (config) {
    config._globalErrorHandled = true;
  }

  if (errorMode === "toast" && !apiError.isCanceled) {
    toast.error(apiError.message, {
      id: apiError.code,
      position: "top-center",
    });
  }

  return Promise.reject(error);
}

export function setupGlobalErrorInterceptors() {
  if (isInstalled) {
    return;
  }

  isInstalled = true;

  publicApi.interceptors.response.use((response) => response, handleApiError);

  authApi.interceptors.response.use((response) => response, handleApiError);
}
