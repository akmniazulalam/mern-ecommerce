const { handleAppError, sendError } = require("../../common/middleware/errorHandler");

function handleMongoError(error, res) {
  return handleAppError(error, res, {
    defaultCastIdMessage: "Invalid product id",
    duplicateFields: [
      {
        key: "sku",
        field: "variants.sku",
        message: "SKU already exists",
      },
      {
        key: "name",
        field: "name",
        message: "Product name already exists",
      },
    ],
  });
}

module.exports = {
  sendError,
  handleMongoError,
};
