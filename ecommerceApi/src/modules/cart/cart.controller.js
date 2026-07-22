const cartSchema = require("./cart.model");
const asyncHandler = require("../../common/middleware/asyncHandler");

function getLineKey(item) {
  const productId = String(item.productId);
  const variantId = item.variantId ? String(item.variantId) : "";
  return variantId ? `${productId}:${variantId}` : productId;
}

function findExistingLine(items, payload) {
  const key = getLineKey(payload);

  return items.find((item) => getLineKey(item) === key);
}

const addToCartController = asyncHandler(async (req, res) => {
  if (!req.session?.user?.id) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const userId = req.session.user.id;
  const {
    productId,
    variantId,
    name,
    price,
    image,
    color,
    size,
    ram,
    storage,
    badge,
    sku,
    quantity = 1,
  } = req.body;

  if (!productId || !name || price === undefined || price === null) {
    return res.status(400).json({
      message: "productId, name, and price are required",
    });
  }

  const parsedPrice = Number(price);
  const parsedQuantity = Math.max(1, Number(quantity) || 1);

  if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
    return res.status(400).json({ message: "Invalid price" });
  }

  const linePayload = {
    productId: String(productId),
    variantId: variantId ? String(variantId) : undefined,
    name: String(name).trim(),
    price: parsedPrice,
    image,
    color,
    size,
    ram,
    storage,
    badge,
    sku,
    quantity: parsedQuantity,
  };

  let cartItems = await cartSchema.findOne({ userId });

  if (!cartItems) {
    cartItems = new cartSchema({
      userId,
      items: [linePayload],
    });
  } else {
    const existingItem = findExistingLine(cartItems.items, linePayload);

    if (existingItem) {
      existingItem.quantity += parsedQuantity;
    } else {
      cartItems.items.push(linePayload);
    }
  }

  await cartItems.save();

  return res.json({
    message: "Add to cart the product successfully",
    data: cartItems,
  });
});

const getAllCartItem = asyncHandler(async (req, res) => {
  const getAllCartItem = await cartSchema.find({});

  return res.status(200).json({
    message: "All Cart Items",
    data: getAllCartItem,
  });
});

module.exports = { addToCartController, getAllCartItem };
