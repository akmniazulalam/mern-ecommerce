const { Order, ORDER_STATUSES } = require("./order.model");
const { sendError, handleMongoError } = require("./order.errors");
const {
  validateCustomer,
  validatePayment,
  validateOrderStatus,
  validatePricingOverride,
} = require("./order.validators");

const Product = require("../product/product.model");
const Cart = require("../cart/cart.model");

function generateOrderNumber() {
  const d = new Date();
  const partA = d.getFullYear();
  const partB = Date.now().toString(36).toUpperCase();
  const partC = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `ORD-${partA}-${partB}-${partC}`;
}

function getVariantFromCartItem({ product, cartItem }) {
  // Prefer explicit variantId, otherwise try SKU fallback.
  if (cartItem.variantId) {
    const variant = product.variants.find((v) => String(v._id) === String(cartItem.variantId));
    if (variant) return variant;
  }

  if (cartItem.sku) {
    const sku = String(cartItem.sku).trim().toUpperCase();
    const variant = product.variants.find((v) => String(v.sku).trim().toUpperCase() === sku);
    if (variant) return variant;
  }

  // Backward compatibility: if the product has only one variant, accept it.
  if (Array.isArray(product.variants) && product.variants.length === 1) {
    return product.variants[0];
  }

  return null;
}

function isPriceMismatch(a, b) {
  const pa = Number(a);
  const pb = Number(b);
  if (Number.isNaN(pa) || Number.isNaN(pb)) return true;
  return Math.abs(pa - pb) > 0.01; // Allow small float drift
}

function computeAllowedTransition(from, to) {
  const transitions = {
    Pending: ["Processing", "Cancelled"],
    Processing: ["Shipped", "Cancelled"],
    Shipped: ["Delivered"],
    Delivered: [],
    Cancelled: [],
  };

  return transitions[from]?.includes(to) ?? false;
}

async function createOrderController(req, res) {
  try {
    const sessionUserId = req?.session?.user?.id;
    const userId = sessionUserId || "guest";

    const { customer, payment, shippingMethod, pricing, items: requestedItems } = req.body || {};

    const customerValidation = validateCustomer(customer);
    if (customerValidation.status !== 200) {
      return sendError(res, customerValidation);
    }

    const paymentValidation = validatePayment(payment);
    if (paymentValidation.status !== 200) {
      return sendError(res, paymentValidation);
    }

    const pricingValidation = validatePricingOverride(pricing);
    if (pricingValidation.status !== 200) {
      return sendError(res, pricingValidation);
    }

    const sourceItems = Array.isArray(requestedItems) ? requestedItems : null;

    let cartItems = null;
    if (sourceItems && sourceItems.length > 0) {
      cartItems = sourceItems;
    } else {
      // Fallback: legacy session cart
      const cart = await Cart.findOne({ userId: sessionUserId });
      if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
        return sendError(res, { status: 400, message: "Cart items are required" });
      }
      cartItems = cart.items;
    }

    // Load all referenced products at once
    const productIds = Array.from(
      new Set(
        cartItems
          .map((i) => (i.productId ? String(i.productId) : null))
          .filter(Boolean),
      ),
    );
    const products = await Product.find({ _id: { $in: productIds } }).lean();
    const productById = new Map(products.map((p) => [String(p._id), p]));

    if (productById.size !== productIds.length) {
      return sendError(res, {
        status: 400,
        message: "One or more products in cart are missing",
      });
    }

    // Build order item snapshot and compute pricing
    let itemsSubtotal = 0;
    const orderItems = [];

    for (let idx = 0; idx < cartItems.length; idx++) {
      const cartItem = cartItems[idx];

      if (!cartItem.productId) {
        return sendError(res, {
          status: 400,
          field: `items[${idx}].productId`,
          message: "Invalid cart item",
        });
      }

      const product = productById.get(String(cartItem.productId));
      if (!product) {
        return sendError(res, { status: 400, message: "Product not found" });
      }

      const variant = getVariantFromCartItem({ product, cartItem });
      if (!variant) {
        return sendError(res, {
          status: 400,
          message: "Cart variant is invalid (variantId/sku mismatch)",
        });
      }

      const quantity = Number(cartItem.quantity);
      if (Number.isNaN(quantity) || quantity < 1 || !Number.isInteger(quantity)) {
        return sendError(res, {
          status: 400,
          field: `items[${idx}].quantity`,
          message: "Invalid quantity",
        });
      }

      // Stock check (read-only; we don't mutate stock here to avoid surprises)
      if (typeof variant.stock === "number" && variant.stock < quantity) {
        return sendError(res, {
          status: 409,
          message: `Insufficient stock for ${product.name}`,
        });
      }

      // Frontend should send the line price it used. We validate against the catalog to prevent tampering.
      if (cartItem.price !== undefined && cartItem.price !== null && isPriceMismatch(cartItem.price, variant.price)) {
        return sendError(res, {
          status: 409,
          message: `Cart price mismatch for ${product.name}. Please review your cart.`,
        });
      }

      const unitPrice = Number(variant.price);
      const lineTotal = unitPrice * quantity;
      itemsSubtotal += lineTotal;

      orderItems.push({
        productId: String(product._id),
        variantId: cartItem.variantId ? String(cartItem.variantId) : String(variant._id),
        sku: variant.sku || cartItem.sku || "",
        name: cartItem.name ? String(cartItem.name).trim() : product.name,
        image: cartItem.image || (variant.images?.[0] ?? ""),
        color: cartItem.color || variant.color || "",
        size: cartItem.size || variant.size || "",
        ram: cartItem.ram || variant.ram || "",
        storage: cartItem.storage || variant.storage || "",
        badge: cartItem.badge || variant.badge || "",
        quantity,
        unitPrice,
        lineTotal,
      });
    }

    const computedPricing = {
      currency: pricingValidation?.data?.currency || "USD",
      itemsSubtotal: Number(itemsSubtotal.toFixed(2)),
      discount: pricingValidation?.data?.discount ?? 0,
      tax: pricingValidation?.data?.tax ?? 0,
      shippingCost: pricingValidation?.data?.shippingCost ?? 0,
    };
    computedPricing.total =
      computedPricing.itemsSubtotal -
      computedPricing.discount +
      computedPricing.tax +
      computedPricing.shippingCost;

    if (!Number.isFinite(computedPricing.total) || computedPricing.total < 0) {
      return sendError(res, { status: 400, field: "pricing", message: "Invalid computed pricing" });
    }

    const paymentData = paymentValidation.data;
    if (paymentData.amount !== undefined && paymentData.amount !== null) {
      if (isPriceMismatch(paymentData.amount, computedPricing.total)) {
        return sendError(res, {
          status: 409,
          field: "payment.amount",
          message: "Payment amount does not match calculated total",
        });
      }
    }

    const allowedShippingMethods = ["standard", "express"];
    const normalizedShippingMethod = shippingMethod
      ? String(shippingMethod).trim().toLowerCase()
      : "standard";
    const safeShippingMethod = allowedShippingMethods.includes(normalizedShippingMethod)
      ? normalizedShippingMethod
      : "standard";

    const order = new Order({
      orderNumber: generateOrderNumber(),
      userId: String(userId),
      customer: customerValidation.data,
      items: orderItems,
      pricing: computedPricing,
      payment: {
        ...paymentData,
        transactionId: paymentData.transactionId || undefined,
      },
      shippingMethod: safeShippingMethod,
      orderStatus: "Pending",
      statusHistory: [{ status: "Pending", changedAt: new Date() }],
    });

    await order.save();

    // Clear cart after successful order placement (legacy session cart).
    if (sessionUserId) {
      await Cart.deleteOne({ userId: sessionUserId });
    }

    return res.status(201).json({
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    return handleMongoError(error, res);
  }
}

async function getAllOrdersController(req, res) {
  try {
    const role = req?.session?.user?.role;
    if (role !== "admin") {
      return sendError(res, { status: 403, message: "Forbidden" });
    }

    const { status, limit } = req.query || {};

    const query = {};
    if (status !== undefined) {
      const statusValidation = validateOrderStatus(status);
      if (statusValidation.status !== 200) {
        return sendError(res, statusValidation);
      }
      query.orderStatus = statusValidation.data;
    }

    const parsedLimit = Math.min(Number(limit) || 50, 100);

    const orders = await Order.find(query).sort({ createdAt: -1 }).limit(parsedLimit);
    return res.status(200).json({
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    return handleMongoError(error, res);
  }
}

async function getMyOrdersController(req, res) {
  try {
    const userId = req?.session?.user?.id;
    if (!userId) {
      return sendError(res, { status: 401, message: "Authentication required" });
    }

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    return handleMongoError(error, res);
  }
}

async function getOrderByIdController(req, res) {
  try {
    const userId = req?.session?.user?.id;
    const role = req?.session?.user?.role;
    if (!userId) {
      return sendError(res, { status: 401, message: "Authentication required" });
    }

    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return sendError(res, { status: 404, message: "Order not found" });
    }

    const isAdmin = role === "admin";
    if (!isAdmin && String(order.userId) !== String(userId)) {
      return sendError(res, { status: 403, message: "Forbidden" });
    }

    return res.status(200).json({
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    return handleMongoError(error, res);
  }
}

async function updateOrderStatusController(req, res) {
  try {
    const userId = req?.session?.user?.id;
    const role = req?.session?.user?.role;
    if (!userId) {
      return sendError(res, { status: 401, message: "Authentication required" });
    }

    const { id } = req.params;
    const { status } = req.body || {};

    const statusValidation = validateOrderStatus(status);
    if (statusValidation.status !== 200) {
      return sendError(res, statusValidation);
    }

    const newStatus = statusValidation.data;

    const order = await Order.findById(id);
    if (!order) {
      return sendError(res, { status: 404, message: "Order not found" });
    }

    const isAdmin = role === "admin";
    if (!isAdmin && String(order.userId) !== String(userId)) {
      return sendError(res, { status: 403, message: "Forbidden" });
    }

    const from = order.orderStatus;
    if (from === newStatus) {
      return res.status(200).json({
        message: "Order status is already set",
        data: order,
      });
    }

    if (!computeAllowedTransition(from, newStatus)) {
      return sendError(res, {
        status: 409,
        message: `Cannot transition order from ${from} to ${newStatus}`,
      });
    }

    // Non-admin users may only cancel, and only while the order isn't already fulfilled.
    if (!isAdmin && newStatus !== "Cancelled") {
      return sendError(res, {
        status: 403,
        message: "Only admins can update order status beyond cancellation",
      });
    }

    order.orderStatus = newStatus;
    order.statusHistory.push({ status: newStatus, changedAt: new Date() });

    await order.save();

    return res.status(200).json({
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    return handleMongoError(error, res);
  }
}

module.exports = {
  createOrderController,
  getAllOrdersController,
  getMyOrdersController,
  getOrderByIdController,
  updateOrderStatusController,
};

