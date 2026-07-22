const mongoose = require("mongoose");

function toTrimmedString(value) {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
}

function isMissing(value) {
  return toTrimmedString(value) === "";
}

function isValidObjectId(value) {
  return !isMissing(value) && mongoose.Types.ObjectId.isValid(String(value));
}

function sendValidationError(res, errorPayload) {
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

function validateRequest(validator) {
  return (req, res, next) => {
    const error = validator(req);

    if (error) {
      return sendValidationError(res, error);
    }

    return next();
  };
}

function validateObjectIdParam(paramName = "id", label = "id") {
  return validateRequest((req) => {
    if (!isValidObjectId(req.params[paramName])) {
      return {
        field: paramName,
        message: `Invalid ${label}`,
      };
    }

    return null;
  });
}

module.exports = {
  isMissing,
  isValidObjectId,
  sendValidationError,
  toTrimmedString,
  validateObjectIdParam,
  validateRequest,
};
