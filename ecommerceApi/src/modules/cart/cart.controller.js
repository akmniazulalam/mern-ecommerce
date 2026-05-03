const cartSchema = require("./cart.model");

const addToCartController = async (req, res) => {
  const { userId, product } = req.body;
  const cartItems = await cartSchema.findOne({ userId });

  if (!cart) {
    cart = new cartSchema({
      userId,
      items: [{ ...product, quantity: 1 }],
    });
  } else {
    const existingItem = cart.items.find(
      (item) => item.productId === product._id,
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ ...product, quantity: 1 });
    }
  }

  await cart.save();

  res.json(cart);
};

const getCartItems

module.exports = { addToCartController };
