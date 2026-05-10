const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    category: {
      type: String,
      trim: true,
    },
    variants: [
      {
        images: [
          {
            type: String,
          },
        ],
        price: {
          type: Number,
          required: true,
        },
        stock: {
          type: Number,
          required: true,
          default: 0,
        },
        size: {
          type: String,
          trim: true,
        },
        color: {
          type: String,
          trim: true,
        },
        ram: {
          type: String,
          trim: true,
        },
        storage: {
          type: String,
          trim: true,
        },
        badge: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
