const {
  validateCustomer,
  validatePayment,
  validateOrderStatus,
  validatePricingOverride,
} = require("./order.validators");
const {
  sendValidationError,
  validateRequest,
} = require("../../common/middleware/requestValidation");

function validateOrderResult(result) {
  return result.status === 200 ? null : result;
}

function validateCreateOrderRequest(req) {
  const { customer, payment, pricing, items } = req.body || {};

  const customerValidation = validateOrderResult(validateCustomer(customer));
  if (customerValidation) {
    return customerValidation;
  }

  const paymentValidation = validateOrderResult(validatePayment(payment));
  if (paymentValidation) {
    return paymentValidation;
  }

  const pricingValidation = validateOrderResult(validatePricingOverride(pricing));
  if (pricingValidation) {
    return pricingValidation;
  }

  if (items !== undefined && items !== null && !Array.isArray(items)) {
    return {
      field: "items",
      message: "Cart items must be an array",
    };
  }

  return null;
}

function validateOrderStatusRequest(req) {
  return validateOrderResult(validateOrderStatus(req.body?.status));
}

function validateAdminOrderQuery(req, res, next) {
  const { status } = req.query || {};

  if (status !== undefined) {
    const statusValidation = validateOrderStatus(status);
    if (statusValidation.status !== 200) {
      return sendValidationError(res, statusValidation);
    }
  }

  return next();
}

module.exports = {
  validateAdminOrderQuery,
  validateCreateOrderRequest: validateRequest(validateCreateOrderRequest),
  validateOrderStatusRequest: validateRequest(validateOrderStatusRequest),
};
