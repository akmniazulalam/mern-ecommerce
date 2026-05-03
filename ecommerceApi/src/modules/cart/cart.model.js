const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    items: [
      {
        productId: String,
        name: String,
        price: String,
        image: String,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("cartItems", cartSchema);
