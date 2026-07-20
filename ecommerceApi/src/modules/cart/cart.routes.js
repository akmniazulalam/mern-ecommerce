const express = require("express")
const { authMiddleware, adminMiddleware } = require("../auth/auth.middleware")
const { addToCartController, getAllCartItem } = require("./cart.controller")
const router = express.Router()

router.post("/addtocart", addToCartController)
router.get("/allcart", authMiddleware, adminMiddleware, getAllCartItem)

module.exports = router
