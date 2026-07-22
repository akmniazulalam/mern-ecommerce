const express = require("express");
const authMiddleware = require("../auth/auth.middleware");
const { adminMiddleware } = require("../auth/auth.middleware");
const { validateObjectIdParam } = require("../../common/middleware/requestValidation");
const {
  validateAdminOrderQuery,
  validateCreateOrderRequest,
  validateOrderStatusRequest,
} = require("./order.middleware");

const {
  createOrderController,
  getAllOrdersController,
  getMyOrdersController,
  getOrderByIdController,
  updateOrderStatusController,
} = require("./order.controller");

const router = express.Router();

// Checkout -> create a new order snapshot from the authenticated user's cart
router.post("/create", validateCreateOrderRequest, createOrderController);

// User order history
router.get("/mine", authMiddleware, getMyOrdersController);
// Admin order listing (fulfillment dashboard)
router.get("/admin", authMiddleware, adminMiddleware, validateAdminOrderQuery, getAllOrdersController);
router.get("/:id", authMiddleware, validateObjectIdParam("id", "order id"), getOrderByIdController);

// Admin fulfillment updates (or cancellation by the order owner)
router.patch("/:id/status", authMiddleware, validateObjectIdParam("id", "order id"), validateOrderStatusRequest, updateOrderStatusController);

module.exports = router;

