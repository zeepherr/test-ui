export function extractAuthData(payload) {
  const body = payload?.data ?? payload ?? {};

  return {
    accessToken: body.accessToken ?? body.token ?? null,

    user: body.user ?? null,
  };
}

export function extractUser(payload) {
  const body = payload?.data ?? payload ?? {};

  return body.user ?? body;
}
