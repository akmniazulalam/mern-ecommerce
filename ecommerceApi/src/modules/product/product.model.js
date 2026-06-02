const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * Embedded product variant.
 * Core commerce fields (size, color, price, stock, sku) stay first-class.
 * Use `attributes` for extensible specs (material, weight, etc.).
 * `ram`, `storage`, and `badge` remain for backward compatibility with existing clients.
 */
const productVariantSchema = new Schema(
  {
    sku: {
      type: String,
      trim: true,
      uppercase: true,
    },
    size: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Variant price is required"],
      min: [0, "Price cannot be negative"],
    },
    stock: {
      type: Number,
      required: [true, "Variant stock is required"],
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    images: {
      type: [{ type: String, trim: true }],
      default: [],
    },
    badge: {
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
    attributes: {
      type: Map,
      of: String,
    },
  },
  {
    _id: true,
  },
);

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
    variants: {
      type: [productVariantSchema],
      default: [],
    },
  },
  { timestamps: true },
);

productSchema.index({ "variants.sku": 1 }, { unique: true, sparse: true });
productSchema.index({ category: 1, createdAt: -1 });

module.exports = mongoose.model("Product", productSchema);
module.exports.productVariantSchema = productVariantSchema;
