const express = require('express')
const router = express.Router()
const authRoute = require('./auth')
const categoryRoute = require('./category')
const shopRoute = require('./shop')
const productRoute = require('./product')

router.use("/auth", authRoute)
router.use("/category", categoryRoute)
router.use("/shop", shopRoute)
router.use("/product", productRoute)

module.exports = router