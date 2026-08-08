import { create } from "zustand";

export const useAuthStore = create((set) => ({
  accessToken: null,
  user: null,

  // checking | authenticated | guest
  status: "checking",

  setAccessToken: (accessToken) => {
    set({ accessToken });
  },

  setUser: (user) => {
    set({ user });
  },

  setSession: ({ accessToken, user }) => {
    set({
      accessToken,
      user,
      status: "authenticated",
    });
  },

  clearSession: () => {
    set({
      accessToken: null,
      user: null,
      status: "guest",
    });
  },
}));
