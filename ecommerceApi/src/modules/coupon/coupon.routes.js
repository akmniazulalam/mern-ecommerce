const express = require("express")
const {applyCouponController, getCoupons} = require("./coupon.controller")
const router = express.Router()

router.post("/apply-coupon", applyCouponController)
router.get("/couponlist", getCoupons)

module.exports = router