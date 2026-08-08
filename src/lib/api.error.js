export function getApiError(error, fallbackMessage = "Something went wrong.") {
  if (error?.code === "ECONNABORTED") {
    return {
      status: 0,
      message: "The request took too long. Please try again.",
    };
  }

  if (!error?.response) {
    return {
      status: 0,
      message: "Unable to connect to the server.",
    };
  }

  const status = error.response.status;

  const body = error.response.data;

  return {
    status,

    message: body?.message ?? body?.error?.message ?? fallbackMessage,

    errors: body?.errors ?? null,
  };
}
