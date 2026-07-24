const Coupon = require("./coupon.model");
const asyncHandler = require("../../common/middleware/asyncHandler");

const createCouponController = asyncHandler(async (req, res) => {
  const { code, discountType, discountValue, minPurchase, expiryDate } =
    req.body;

  // check duplicate
  const existingCoupon = await Coupon.findOne({
    code: code.toUpperCase(),
  });

  if (existingCoupon) {
    return res.status(400).json({
      success: false,
      message: "Coupon already exists",
    });
  }

  const newCoupon = new Coupon({
    code: code.toUpperCase(),
    discountType,
    discountValue,
    minPurchase,
    expiryDate,
    isActive: true,
  });

  await newCoupon.save();

  return res.status(201).json({
    success: true,
    message: "Coupon created successfully",
    data: newCoupon,
  });
});

// APPLY COUPON
const applyCouponController = asyncHandler(async (req, res) => {
  const { code, subtotal } = req.body;

  if (!code || !subtotal) {
    return res.status(400).json({
      success: false,
      message: "Code and subtotal are required",
    });
  }

  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
  });

  if (!coupon) {
    return res.status(404).json({
      success: false,
      message: "Invalid coupon code",
    });
  }

  if (!coupon.isActive) {
    return res.status(400).json({
      success: false,
      message: "Coupon is inactive",
    });
  }

  if (new Date() > new Date(coupon.expiryDate)) {
    return res.status(400).json({
      success: false,
      message: "Coupon expired",
    });
  }

  if (subtotal < coupon.minPurchase) {
    return res.status(400).json({
      success: false,
      message: `Minimum purchase $${coupon.minPurchase}`,
    });
  }

  let discount = 0;

  if (coupon.discountType === "percentage") {
    discount = (subtotal * coupon.discountValue) / 100;
  } else {
    discount = coupon.discountValue;
  }

  const total = subtotal - discount;

  return res.status(200).json({
    success: true,
    message: "Coupon applied successfully",
    discount,
    total,
    coupon,
  });
});

// GET ALL COUPONS WITH PAGINATION SUPPORT
const getCoupons = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(req.query.limit, 10) || 50),
  );
  const skip = (page - 1) * limit;

  const total = await Coupon.countDocuments({});
  const couponList = await Coupon.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return res.status(200).json({
    success: true,
    message: "All coupons",
    data: couponList,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  });
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedCoupon = await Coupon.findByIdAndDelete(id);

  if (!deletedCoupon) {
    return res.status(404).json({
      success: false,
      message: "Coupon not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Coupon deleted",
    data: deletedCoupon,
  });
});

module.exports = {
  createCouponController,
  applyCouponController,
  getCoupons,
  deleteCoupon,
};
