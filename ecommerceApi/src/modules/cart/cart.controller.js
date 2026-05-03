const cartModel = require("./cart.model")

const addToCartController = async (req, res) => {
    const {userId, product} = req.body
    const cartItems = await cartModel.findOne({userId})
}

module.exports = {addToCartController}