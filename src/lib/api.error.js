export function getApiError(
  error,
  fallbackMessage = "Something went wrong.",
) {
  if (
    error?.code === "ERR_CANCELED" ||
    error?.name === "CanceledError"
  ) {
    return {
      status: 0,
      code: "REQUEST_CANCELED",
      message: "",
      fieldErrors: null,
      isCanceled: true,
    };
  }

  if (error?.code === "ECONNABORTED") {
    return {
      status: 0,
      code: "REQUEST_TIMEOUT",
      message:
        "The request took too long. Please try again.",
      fieldErrors: null,
      isCanceled: false,
    };
  }

  if (!error?.response) {
    return {
      status: 0,
      code: "NETWORK_ERROR",
      message:
        "Unable to connect to the server.",
      fieldErrors: null,
      isCanceled: false,
    };
  }

  const status = error.response.status;
  const body = error.response.data ?? {};
  const serverError = body.error;

  const serverMessage =
    body.message ??
    (typeof serverError === "string"
      ? serverError
      : serverError?.message);

  const message =
    status >= 500
      ? "The server is temporarily unavailable. Please try again."
      : (serverMessage ?? fallbackMessage);

  return {
    status,

    code:
      body.code ??
      serverError?.code ??
      `HTTP_${status}`,

    message,

    fieldErrors:
      body.errors ??
      serverError?.fields ??
      null,

    isCanceled: false,

    // Optional backend metadata
    attemptsRemaining:
      body.attemptsRemaining ?? null,

    canResend:
      body.canResend ?? false,

    retryAfterSeconds:
      body.retryAfterSeconds ?? null,

    resendAfterSeconds:
      body.resendAfterSeconds ?? null,
  };
}