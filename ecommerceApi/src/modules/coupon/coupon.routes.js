const express = require("express");
const { authMiddleware, adminMiddleware } = require("../auth/auth.middleware");
const {
  createCouponController,
  applyCouponController,
  getCoupons,
  deleteCoupon,
} = require("./coupon.controller");
const { validateObjectIdParam } = require("../../common/middleware/requestValidation");
const {
  validateApplyCouponRequest,
  validateCreateCouponRequest,
} = require("./coupon.validators");
const router = express.Router();

const adminOnly = [authMiddleware, adminMiddleware];

router.post("/create-coupon", ...adminOnly, validateCreateCouponRequest, createCouponController);
router.post("/apply-coupon", validateApplyCouponRequest, applyCouponController);
router.get("/couponlist", ...adminOnly, getCoupons);
router.delete("/deletecoupon/:id", ...adminOnly, validateObjectIdParam("id", "coupon id"), deleteCoupon);

module.exports = router;
