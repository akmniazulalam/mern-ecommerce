const emailValidation = require("../../common/utils/emailValidation");

function toTrimmedString(value) {
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

function validateCustomer(customer) {
  if (!customer || typeof customer !== "object") {
    return {
      status: 400,
      field: "customer",
      message: "Customer object is required",
    };
  }

  const firstName = toTrimmedString(customer.firstName);
  const lastName = toTrimmedString(customer.lastName);
  const email = toTrimmedString(customer.email);
  const phone = toTrimmedString(customer.phone);
  const country = toTrimmedString(customer.country);
  const street = toTrimmedString(customer.street);
  const city = toTrimmedString(customer.city);
  const postcode = toTrimmedString(customer.postcode);

  if (!firstName) {
    return { status: 400, field: "customer.firstName", message: "First name is required" };
  }
  if (!lastName) {
    return { status: 400, field: "customer.lastName", message: "Last name is required" };
  }
  if (!email) {
    return { status: 400, field: "customer.email", message: "Email is required" };
  }
  if (!emailValidation(email)) {
    return { status: 400, field: "customer.email", message: "Email format is invalid" };
  }
  if (!phone) {
    return { status: 400, field: "customer.phone", message: "Phone is required" };
  }
  if (!/^\+?[0-9\s-]{7,}$/.test(phone)) {
    return { status: 400, field: "customer.phone", message: "Phone format is invalid" };
  }

  if (!country) {
    return { status: 400, field: "customer.country", message: "Country is required" };
  }
  if (!street) {
    return { status: 400, field: "customer.street", message: "Street address is required" };
  }
  if (!city) {
    return { status: 400, field: "customer.city", message: "City is required" };
  }
  if (!postcode) {
    return { status: 400, field: "customer.postcode", message: "Postcode is required" };
  }

  // Optional strings
  const company = toTrimmedString(customer.company);
  const apartment = toTrimmedString(customer.apartment);
  const county = toTrimmedString(customer.county);
  const notes = toTrimmedString(customer.notes);

  return {
    status: 200,
    data: {
      ...customer,
      firstName,
      lastName,
      email,
      phone,
      country,
      street,
      city,
      postcode,
      company,
      apartment,
      county,
      notes,
    },
  };
}

const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const PAYMENT_METHODS = ["bank", "bank2", "card", "cod"];
const PAYMENT_STATUSES = ["Pending", "Paid", "Failed", "Refunded"];

function validatePayment(payment) {
  if (!payment || typeof payment !== "object") {
    return {
      status: 400,
      field: "payment",
      message: "Payment object is required",
    };
  }

  const method = toTrimmedString(payment.method).toLowerCase();
  if (!method) {
    return { status: 400, field: "payment.method", message: "Payment method is required" };
  }
  if (!PAYMENT_METHODS.includes(method)) {
    return {
      status: 400,
      field: "payment.method",
      message: `Payment method must be one of: ${PAYMENT_METHODS.join(", ")}`,
    };
  }

  const statusNormalized = (toTrimmedString(payment.status) || "Pending").toLowerCase();
  const canonicalPaymentStatus = PAYMENT_STATUSES.find(
    (s) => s.toLowerCase() === statusNormalized,
  );
  if (!canonicalPaymentStatus) {
    return {
      status: 400,
      field: "payment.status",
      message: `Payment status must be one of: ${PAYMENT_STATUSES.join(", ")}`,
    };
  }

  const transactionId = toTrimmedString(payment.transactionId);
  const currency = toTrimmedString(payment.currency) || "USD";

  const amountRaw = payment.amount;
  const amount = amountRaw === undefined || amountRaw === null ? undefined : Number(amountRaw);
  if (amount !== undefined && (Number.isNaN(amount) || amount < 0)) {
    return { status: 400, field: "payment.amount", message: "Payment amount is invalid" };
  }

  // Do not require details to avoid forcing PCI-risk payloads.
  const details = payment.details && typeof payment.details === "object" ? payment.details : {};

  // Best-effort sanitization: if full card number arrives, drop it.
  if (details.cardNumber) {
    // Keep only last4 if possible.
    const digits = String(details.cardNumber).replace(/\D/g, "");
    if (digits.length >= 4) {
      details.cardLast4 = digits.slice(-4);
    }
    delete details.cardNumber;
  }

  return {
    status: 200,
    data: {
      method,
      status: canonicalPaymentStatus,
      currency,
      amount,
      transactionId: transactionId || undefined,
      details,
    },
  };
}

function validateOrderStatus(status) {
  const normalized = toTrimmedString(status);
  if (!normalized) {
    return { status: 400, field: "status", message: "Order status is required" };
  }
  const statusNormalized = normalized.toLowerCase();
  const canonical = ORDER_STATUSES.find((s) => s.toLowerCase() === statusNormalized);
  if (!canonical) {
    return {
      status: 400,
      field: "status",
      message: `Order status must be one of: ${ORDER_STATUSES.join(", ")}`,
    };
  }
  return { status: 200, data: canonical };
}

function validatePricingOverride(pricing) {
  if (pricing === undefined || pricing === null) return { status: 200, data: null };
  if (!pricing || typeof pricing !== "object") {
    return { status: 400, field: "pricing", message: "Pricing must be an object" };
  }

  const discount = pricing.discount === undefined ? 0 : Number(pricing.discount);
  const tax = pricing.tax === undefined ? 0 : Number(pricing.tax);
  const shippingCost =
    pricing.shippingCost === undefined ? 0 : Number(pricing.shippingCost);

  const errors = [];
  if (Number.isNaN(discount) || discount < 0) errors.push("Invalid discount");
  if (Number.isNaN(tax) || tax < 0) errors.push("Invalid tax");
  if (Number.isNaN(shippingCost) || shippingCost < 0) errors.push("Invalid shippingCost");
  if (errors.length) {
    return { status: 400, field: "pricing", message: errors.join(", ") };
  }

  const currency = toTrimmedString(pricing.currency) || "USD";
  return { status: 200, data: { discount, tax, shippingCost, currency } };
}

module.exports = {
  validateCustomer,
  validatePayment,
  validateOrderStatus,
  validatePricingOverride,
  ORDER_STATUSES,
};

