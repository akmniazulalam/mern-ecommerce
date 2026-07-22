const express = require("express")
const { authMiddleware, adminMiddleware } = require("../auth/auth.middleware")
const { addToCartController, getAllCartItem } = require("./cart.controller")
const { requireCartSession, validateAddToCartRequest } = require("./cart.validators")
const router = express.Router()

router.post("/addtocart", requireCartSession, validateAddToCartRequest, addToCartController)
router.get("/allcart", authMiddleware, adminMiddleware, getAllCartItem)

module.exports = router
