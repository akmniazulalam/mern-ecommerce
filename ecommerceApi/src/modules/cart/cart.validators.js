const {
  isMissing,
  validateRequest,
} = require("../../common/middleware/requestValidation");

function requireCartSession(req, res, next) {
  if (!req.session?.user?.id) {
    return res.status(401).json({ message: "Authentication required" });
  }

  return next();
}

function validateAddToCartRequest(req) {
  const { productId, name, price, quantity } = req.body || {};

  if (isMissing(productId) || isMissing(name) || price === undefined || price === null) {
    return {
      message: "productId, name, and price are required",
    };
  }

  const parsedPrice = Number(price);
  if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
    return { field: "price", message: "Invalid price" };
  }

  if (quantity !== undefined && quantity !== null && quantity !== "") {
    const parsedQuantity = Number(quantity);
    if (Number.isNaN(parsedQuantity) || parsedQuantity < 1) {
      return { field: "quantity", message: "Invalid quantity" };
    }
  }

  return null;
}

module.exports = {
  requireCartSession,
  validateAddToCartRequest: validateRequest(validateAddToCartRequest),
};
