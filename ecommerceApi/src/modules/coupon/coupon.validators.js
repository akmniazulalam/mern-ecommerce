const {
  isMissing,
  toTrimmedString,
  validateRequest,
} = require("../../common/middleware/requestValidation");

const DISCOUNT_TYPES = ["percentage", "fixed"];

function validateCreateCouponRequest(req) {
  const { code, discountType, discountValue, minPurchase, expiryDate } =
    req.body || {};

  if (isMissing(code)) {
    return { field: "code", message: "Coupon code is required" };
  }

  const normalizedDiscountType = toTrimmedString(discountType);
  if (!normalizedDiscountType) {
    return { field: "discountType", message: "Discount type is required" };
  }

  if (!DISCOUNT_TYPES.includes(normalizedDiscountType)) {
    return {
      field: "discountType",
      message: `Discount type must be one of: ${DISCOUNT_TYPES.join(", ")}`,
    };
  }

  if (discountValue === undefined || discountValue === null || discountValue === "") {
    return { field: "discountValue", message: "Discount value is required" };
  }

  if (!Number.isFinite(Number(discountValue))) {
    return { field: "discountValue", message: "Discount value must be a number" };
  }

  if (
    minPurchase !== undefined &&
    minPurchase !== null &&
    minPurchase !== "" &&
    !Number.isFinite(Number(minPurchase))
  ) {
    return { field: "minPurchase", message: "Minimum purchase must be a number" };
  }

  if (
    expiryDate !== undefined &&
    expiryDate !== null &&
    expiryDate !== "" &&
    Number.isNaN(new Date(expiryDate).getTime())
  ) {
    return { field: "expiryDate", message: "Expiry date is invalid" };
  }

  return null;
}

function validateApplyCouponRequest(req) {
  const { code, subtotal } = req.body || {};

  if (isMissing(code) || !subtotal) {
    return { message: "Code and subtotal are required" };
  }

  if (!Number.isFinite(Number(subtotal))) {
    return { field: "subtotal", message: "Subtotal must be a number" };
  }

  return null;
}

module.exports = {
  validateApplyCouponRequest: validateRequest(validateApplyCouponRequest),
  validateCreateCouponRequest: validateRequest(validateCreateCouponRequest),
};
