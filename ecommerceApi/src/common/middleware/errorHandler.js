function sendError(res, errorPayload) {
  const { status = 400, field, message, errors } = errorPayload || {};
  const body = { message: message || "Server error" };

  if (field) {
    body.field = field;
  }

  if (errors) {
    body.errors = errors;
  }

  return res.status(status).json(body);
}

function getDuplicateError(error, duplicateFields = []) {
  const keyPattern = error.keyPattern || {};
  const key = Object.keys(keyPattern)[0] || "";
  const normalizedKey = key.toLowerCase();

  const match = duplicateFields.find((item) =>
    normalizedKey.includes(String(item.key || "").toLowerCase()),
  );

  if (match) {
    return {
      status: 409,
      field: match.field,
      message: match.message,
    };
  }

  return {
    status: 409,
    message: "Duplicate value",
  };
}

function normalizeError(error, options = {}) {
  const {
    duplicateFields = [],
    defaultCastIdMessage = "Invalid id",
    defaultMessage = "Server error",
  } = options;

  if (error && error.code === 11000) {
    return getDuplicateError(error, duplicateFields);
  }

  if (error && error.name === "ValidationError") {
    const firstKey = Object.keys(error.errors || {})[0];
    const first = error.errors?.[firstKey];

    return {
      status: 400,
      field: first?.path,
      message: first?.message || "Validation failed",
    };
  }

  if (error && error.name === "CastError") {
    return {
      status: 400,
      field: error.path,
      message: error.path === "_id" ? defaultCastIdMessage : "Invalid request data",
    };
  }

  if (error && (error.status || error.statusCode) && error.message) {
    return {
      status: error.status || error.statusCode,
      field: error.field,
      message: error.message,
      errors: error.errors,
    };
  }

  return {
    status: 500,
    message: defaultMessage,
  };
}

function handleAppError(error, res, options = {}) {
  const payload = normalizeError(error, options);

  if (payload.status >= 500) {
    console.error(error);
  }

  return sendError(res, payload);
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  return handleAppError(error, res);
}

module.exports = {
  errorHandler,
  handleAppError,
  normalizeError,
  sendError,
};
