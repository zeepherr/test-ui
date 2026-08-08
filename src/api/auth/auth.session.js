import { fetchMe, refresh } from "@/api/auth/auth.api";
import { useAuthStore } from "@/stores/auth.store";
import { extractAuthData, extractUser } from "./auth.response";

let restorePromise = null;

export async function establishSession(payload) {
  const { accessToken, user: responseUser } = extractAuthData(payload);

  if (!accessToken) {
    throw new Error("Login response did not return an access token");
  }

  const auth = useAuthStore.getState();

  try {
    auth.setAccessToken(accessToken);

    let user = responseUser;

    if (!user) {
      const me = await fetchMe();
      user = extractUser(me);
    }

    if (!user) {
      throw new Error("Unable to establish the authenticated user");
    }

    auth.setSession({
      accessToken,
      user,
    });

    return user;
  } catch (error) {
    auth.clearSession();
    throw error;
  }
}
export function restoreSession() {
  if (restorePromise) {
    return restorePromise;
  }

  restorePromise = (async () => {
    try {
      const { accessToken, user: refreshUser } = await refreshAccessToken();

      let user = refreshUser;

      if (!user) {
        const me = await fetchMe();

        user = extractUser(me);
      }

      useAuthStore.getState().setSession({
        accessToken,
        user,
      });
    } catch {
      useAuthStore.getState().clearSession();
    }
  })().finally(() => {
    restorePromise = null;
  });

  return restorePromise;
}

let refreshPromise = null;

export async function refreshAccessToken() {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = await refresh()
    .then((payload) => {
      const { accessToken, user } = extractAuthData(payload);

      if (!accessToken) {
        throw new Error("Refresh response did not return an access token");
      }

      const auth = useAuthStore.getState();

      auth.setAccessToken(accessToken);

      if (user) {
        auth.setUser(user);
      }

      return {
        accessToken,
        user,
      };
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}
