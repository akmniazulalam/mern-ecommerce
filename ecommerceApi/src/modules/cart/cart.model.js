const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    variantId: { type: String },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1, min: 1 },
    image: { type: String },
    color: { type: String },
    size: { type: String },
    ram: { type: String },
    storage: { type: String },
    badge: { type: String },
    sku: { type: String },
  },
  { _id: true },
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("cartItems", cartSchema);
