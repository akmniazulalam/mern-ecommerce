const cartSchema = require("./cart.model");

const addToCartController = async (req, res) => {
  const userId = req.session.user.id;
  const { product } = req.body;
  const cartItems = await cartSchema.findOne({ userId });

  const cart = new cartSchema({
    userId,
    items: [{ ...product, quantity: 1 }],
  });

  const existingItem = cartItems.items.find(
    (item) => item.productId === product._id,
  );

  if (existingItem) {
    existingItem.quantity += 1;
  }

  await cart.save();

  res.json({ message: "Add to cart the product successfully", data: cart });
};


module.exports = { addToCartController };
