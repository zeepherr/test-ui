import { authApi, publicApi } from "@/api/axios";
export async function login(payload) {
  const response = await publicApi.post("/auth/login", payload, {
    errorMode: "inline",
    skipGlobalLoading: true,
  });

  return response.data;
}

export async function register(payload) {
  const response = await publicApi.post("/auth/register", payload, {
    skipGlobalLoading: false,
  });

  return response.data;
}
export async function logout() {
  const response = await authApi.post("/auth/logout");

  return response.data;
}

export async function fetchMe() {
  const response = await authApi.get("/users/me");

  return response.data;
}
export async function refresh() {
  const response = await publicApi.post(
    "/auth/refresh",
    {},
    {
      skipGlobalLoading: true,
      errorMode: "silent",
    },
  );

  return response.data;
}
export const verifyRegistrationEmail = async (payload) => {
  const response = await publicApi.post("/auth/register/verify", payload);

  return response.data;
};

export const resendRegistrationOtp = async (payload) => {
  const response = await publicApi.post("/auth/register/resend", payload);

  return response.data;
};
