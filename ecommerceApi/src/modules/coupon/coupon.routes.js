const express = require("express")
const {createCouponController, applyCouponController, getCoupons} = require("./coupon.controller")
const router = express.Router()

router.post("/create-coupon", createCouponController)
router.post("/apply-coupon", applyCouponController)
router.get("/couponlist", getCoupons)

module.exports = router