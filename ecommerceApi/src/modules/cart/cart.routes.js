const express = require("express")
const { addToCartController, getAllCartItem } = require("./cart.controller")
const router = express.Router()

router.post("/addtocart/:id", addToCartController)
router.get("/allcart", getAllCartItem)

module.exports = router