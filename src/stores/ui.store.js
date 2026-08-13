import { create } from "zustand";

export const useUiStore = create((set, get) => ({
  pendingRequests: 0,

  startRequest: () => {
    set({
      pendingRequests: get().pendingRequests + 1,
    });
  },

  finishRequest: () => {
    set({
      pendingRequests: Math.max(0, get().pendingRequests - 1),
    });
  },
}));
