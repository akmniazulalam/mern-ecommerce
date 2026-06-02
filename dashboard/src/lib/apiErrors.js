export function getApiErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  const data = error?.response?.data;

  if (!data) {
    return error?.message || fallback;
  }

  if (typeof data.message === "string" && data.message.trim()) {
    if (data.field) {
      return `${data.message} (${data.field})`;
    }
    return data.message;
  }

  return fallback;
}

export function isNotFoundError(error) {
  return error?.response?.status === 404;
}

export function isConflictError(error) {
  return error?.response?.status === 409;
}
