const { handleAppError, sendError } = require("../../common/middleware/errorHandler");

function handleMongoError(error, res) {
  return handleAppError(error, res, {
    duplicateFields: [
      {
        key: "ordernumber",
        field: "orderNumber",
        message: "Order number already exists",
      },
    ],
  });
}

module.exports = {
  sendError,
  handleMongoError,
};

