const express = require("express")
const { addToCartController } = require("./cart.controller")
const router = express.Router()

router.post("/addcart", addToCartController)

module.exports = router