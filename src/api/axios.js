import axios from "axios";

import { useUiStore } from "@/stores/ui.store";

const baseConfig = {
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
};

function startLoading(config) {
  if (config.skipGlobalLoading) {
    return config;
  }

  useUiStore.getState().startRequest();

  config._globalLoadingTracked = true;

  return config;
}

function stopLoading(config) {
  if (!config?._globalLoadingTracked) {
    return;
  }

  useUiStore.getState().finishRequest();

  delete config._globalLoadingTracked;
}

function attachGlobalLoading(instance) {
  instance.interceptors.request.use(
    (config) => {
      return startLoading(config);
    },

    (error) => {
      return Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    (response) => {
      stopLoading(response.config);

      return response;
    },

    (error) => {
      stopLoading(error.config);

      return Promise.reject(error);
    },
  );
}

export const publicApi = axios.create(baseConfig);

export const authApi = axios.create(baseConfig);

attachGlobalLoading(publicApi);
attachGlobalLoading(authApi);
