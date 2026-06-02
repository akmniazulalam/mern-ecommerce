const express = require("express");
const authMiddleware = require("../auth/auth.middleware");

const {
  createOrderController,
  getAllOrdersController,
  getMyOrdersController,
  getOrderByIdController,
  updateOrderStatusController,
} = require("./order.controller");

const router = express.Router();

// Checkout -> create a new order snapshot from the authenticated user's cart
router.post("/create", createOrderController);

// User order history
router.get("/mine", authMiddleware, getMyOrdersController);
// Admin order listing (fulfillment dashboard)
router.get("/admin", authMiddleware, getAllOrdersController);
router.get("/:id", authMiddleware, getOrderByIdController);

// Admin fulfillment updates (or cancellation by the order owner)
router.patch("/:id/status", authMiddleware, updateOrderStatusController);

module.exports = router;

