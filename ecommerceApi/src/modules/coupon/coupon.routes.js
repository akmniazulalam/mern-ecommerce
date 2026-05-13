const express = require("express");
const {
  createCouponController,
  applyCouponController,
  getCoupons,
  deleteCoupon,
} = require("./coupon.controller");
const router = express.Router();

router.post("/create-coupon", createCouponController);
router.post("/apply-coupon", applyCouponController);
router.get("/couponlist", getCoupons);
router.delete("/deletecoupon/:id", deleteCoupon);

module.exports = router;
