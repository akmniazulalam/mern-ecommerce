const express = require("express")
const { addToCartController } = require("./cart.controller")
const router = express.Router()

router.post("/addtocart", addToCartController)

module.exports = router