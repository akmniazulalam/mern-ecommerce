const express = require("express");
const { authMiddleware, adminMiddleware } = require("../auth/auth.middleware");
const {
  createCouponController,
  applyCouponController,
  getCoupons,
  deleteCoupon,
} = require("./coupon.controller");
const router = express.Router();

const adminOnly = [authMiddleware, adminMiddleware];

router.post("/create-coupon", ...adminOnly, createCouponController);
router.post("/apply-coupon", applyCouponController);
router.get("/couponlist", ...adminOnly, getCoupons);
router.delete("/deletecoupon/:id", ...adminOnly, deleteCoupon);

module.exports = router;
