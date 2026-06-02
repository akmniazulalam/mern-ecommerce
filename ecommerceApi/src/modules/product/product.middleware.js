const mongoose = require("mongoose");
const { sendError } = require("./product.errors");

function isValidProductId(id) {
  if (id === undefined || id === null || id === "") {
    return false;
  }

  return mongoose.Types.ObjectId.isValid(String(id));
}

function validateProductIdParam(req, res, next) {
  if (!isValidProductId(req.params.id)) {
    return sendError(res, {
      status: 400,
      message: "Invalid product id",
    });
  }

  return next();
}

module.exports = {
  isValidProductId,
  validateProductIdParam,
};
