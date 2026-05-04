const cartSchema = require("./cart.model");

const addToCartController = async (req, res) => {
  const userId = req.session.user.id;
  const { productId, name, price, image } = req.body;
  let cartItems = await cartSchema.findOne({ userId });

  if (!cartItems) {
    cartItems = new cartSchema({
      userId,
      items: [{ productId, name, price, image, quantity: 1 }],
    });
  } else {
    const existingItem = cartItems.items.find(
      (item) => item.productId === productId,
    );

    if (existingItem) {
      existingItem.quantity += 1;
    }
    else{
      cartItems.items.push({productId, name, price, image, quantity: 1})
    }
  }

  await cartItems.save();

  res.json({
    message: "Add to cart the product successfully",
    data: cartItems,
  });
};

const getAllCartItem = async (req, res) => {
  const getAllCartItem = await cartSchema.find({});
  res.status(200).json({
    message: "All Cart Items",
    data: getAllCartItem,
  });
};

module.exports = { addToCartController, getAllCartItem };
