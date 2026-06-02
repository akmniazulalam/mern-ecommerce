function sendError(res, errorPayload) {
  const { status = 400, field, message, errors } = errorPayload;
  const body = { message };

  if (field) {
    body.field = field;
  }

  if (errors) {
    body.errors = errors;
  }

  return res.status(status).json(body);
}

function handleMongoError(error, res) {
  if (error.code === 11000) {
    const keyPattern = error.keyPattern || {};
    const key = Object.keys(keyPattern)[0] || "";

    if (key.includes("sku")) {
      return sendError(res, {
        status: 409,
        field: "variants.sku",
        message: "SKU already exists",
      });
    }

    if (key.includes("name")) {
      return sendError(res, {
        status: 409,
        field: "name",
        message: "Product name already exists",
      });
    }

    return sendError(res, {
      status: 409,
      message: "Duplicate value",
    });
  }

  if (error.name === "ValidationError") {
    const firstKey = Object.keys(error.errors)[0];
    const first = error.errors[firstKey];

    return sendError(res, {
      status: 400,
      field: first?.path,
      message: first?.message || "Validation failed",
    });
  }

  if (error.name === "CastError") {
    return sendError(res, {
      status: 400,
      field: error.path,
      message:
        error.path === "_id" ? "Invalid product id" : "Invalid request data",
    });
  }

  if (error.status === 400 && error.message) {
    return sendError(res, {
      status: 400,
      field: error.field,
      message: error.message,
    });
  }

  console.error(error);

  return sendError(res, {
    status: 500,
    message: "Server error",
  });
}

module.exports = {
  sendError,
  handleMongoError,
};
