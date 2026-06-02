const mongoose = require("mongoose");
const { Schema } = mongoose;

const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const PAYMENT_METHODS = ["bank", "bank2", "card", "cod"];
const PAYMENT_STATUSES = ["Pending", "Paid", "Failed", "Refunded"];

const statusHistorySchema = new Schema(
  {
    status: { type: String, enum: ORDER_STATUSES, required: true },
    changedAt: { type: Date, default: Date.now, required: true },
  },
  { _id: false }
);

const customerSchema = new Schema(
  {
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
    company: { type: String, trim: true, default: "" },
    country: { type: String, trim: true, required: true },
    street: { type: String, trim: true, required: true },
    apartment: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, required: true },
    county: { type: String, trim: true, default: "" },
    postcode: { type: String, trim: true, required: true },
    phone: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true },
    notes: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const paymentSchema = new Schema(
  {
    method: { type: String, required: true, enum: PAYMENT_METHODS },
    status: {
      type: String,
      required: true,
      enum: PAYMENT_STATUSES,
      default: "Pending",
    },
    currency: { type: String, trim: true, default: "USD" },
    amount: { type: Number, min: 0 },
    transactionId: { type: String, trim: true, default: "" },
    details: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const orderItemSchema = new Schema(
  {
    productId: { type: String, required: true, trim: true },
    variantId: { type: String, trim: true, default: "" },
    sku: { type: String, trim: true, default: "" },
    name: { type: String, required: true, trim: true },
    image: { type: String, trim: true, default: "" },
    color: { type: String, trim: true, default: "" },
    size: { type: String, trim: true, default: "" },
    ram: { type: String, trim: true, default: "" },
    storage: { type: String, trim: true, default: "" },
    badge: { type: String, trim: true, default: "" },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const pricingSchema = new Schema(
  {
    currency: { type: String, trim: true, default: "USD" },
    itemsSubtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, required: true, min: 0, default: 0 },
    tax: { type: Number, required: true, min: 0, default: 0 },
    shippingCost: { type: Number, required: true, min: 0, default: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    // Supports guest checkout (no authenticated session).
    userId: { type: String, required: false, index: true, default: "guest" },
    customer: { type: customerSchema, required: true },
    items: { type: [orderItemSchema], required: true, validate: (v) => v.length > 0 },
    pricing: { type: pricingSchema, required: true },
    payment: { type: paymentSchema, required: true },
    shippingMethod: { type: String, trim: true, default: "standard" },
    orderStatus: { type: String, enum: ORDER_STATUSES, required: true, default: "Pending" },
    statusHistory: { type: [statusHistorySchema], default: [] },
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1, orderStatus: 1, createdAt: -1 });

module.exports = {
  Order: mongoose.model("Order", orderSchema),
  ORDER_STATUSES,
};

