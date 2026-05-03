const express = require('express')
const router = express.Router()
const authRoute = require('../modules/auth/auth.routes')
const categoryRoute = require('../modules/category/category.routes')
const productRoute = require('../modules/product/product.routes')
const cartRoute = require("../modules/cart/cart.routes")

router.use("/auth", authRoute)
router.use("/category", categoryRoute)
router.use("/product", productRoute)
router.use("/cart", cartRoute)

module.exports = router