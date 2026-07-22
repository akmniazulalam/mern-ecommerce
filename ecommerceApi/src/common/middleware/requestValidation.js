const mongoose = require("mongoose");
const { sendError } = require("./errorHandler");

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
  return sendError(res, errorPayload);
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
