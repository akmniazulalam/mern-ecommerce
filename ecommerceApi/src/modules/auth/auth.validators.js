const passVal = require("../../common/utils/passVal");
const emailValidation = require("../../common/utils/emailValidation");
const {
  isMissing,
  toTrimmedString,
  validateRequest,
} = require("../../common/middleware/requestValidation");

function validateSignupRequest(req) {
  const { firstName, lastName, email, password } = req.body || {};

  if (isMissing(firstName) || isMissing(lastName)) {
    return { message: "Error: First name and last name are required" };
  }

  if (isMissing(email)) {
    return { field: "email", message: "Error: Email is required" };
  }

  if (isMissing(password)) {
    return { field: "password", message: "Error: Password is required" };
  }

  if (!emailValidation(toTrimmedString(email))) {
    return { field: "email", message: "Error: Email format is not correct." };
  }

  if (!passVal(String(password))) {
    return {
      field: "password",
      message: "Error: Password format is not correct.",
    };
  }

  return null;
}

function validateLoginRequest(req) {
  const { email, password } = req.body || {};

  if (isMissing(email)) {
    return { field: "email", message: "Email is required" };
  }

  if (!emailValidation(toTrimmedString(email))) {
    return { field: "email", message: "Email format is not correct" };
  }

  if (isMissing(password)) {
    return { field: "password", message: "Password is required" };
  }

  return null;
}

function validateOtpRequest(req) {
  const { email, otp } = req.body || {};

  if (isMissing(email)) {
    return { field: "email", message: "Email is required" };
  }

  if (!emailValidation(toTrimmedString(email))) {
    return { field: "email", message: "Email format is not correct" };
  }

  if (isMissing(otp)) {
    return { field: "otp", message: "Required Otp" };
  }

  return null;
}

function validateResendOtpRequest(req) {
  const { email } = req.body || {};

  if (isMissing(email)) {
    return { field: "email", message: "Email is required" };
  }

  if (!emailValidation(toTrimmedString(email))) {
    return { field: "email", message: "Email format is not correct" };
  }

  return null;
}

function validateAvatarUpload(req) {
  if (!req.file) {
    return { field: "image", message: "Image required" };
  }

  return null;
}

module.exports = {
  validateAvatarUpload: validateRequest(validateAvatarUpload),
  validateLoginRequest: validateRequest(validateLoginRequest),
  validateOtpRequest: validateRequest(validateOtpRequest),
  validateResendOtpRequest: validateRequest(validateResendOtpRequest),
  validateSignupRequest: validateRequest(validateSignupRequest),
};
