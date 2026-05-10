const express = require("express")
const applyCouponController = require("./coupon.controller")
const router = express.Router()

router.post("/apply-coupon", applyCouponController)

module.exports = router