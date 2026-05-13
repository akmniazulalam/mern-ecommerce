const Coupon = require("./coupon.model");

const createCouponController = async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// APPLY COUPON
const applyCouponController = async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL COUPONS
const getCoupons = async (req, res) => {
  try {
    const couponList = await Coupon.find({});

    return res.status(200).json({
      success: true,
      message: "All coupons",
      data: couponList,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCoupon = async (req, res) => {
  const { id } = req.params;
  const deleteCoupon = await Coupon.findByIdAndDelete(id);
  res.status(200).json({ message: "Coupon deleted", data: deleteCoupon });
};

module.exports = {
  createCouponController,
  applyCouponController,
  getCoupons,
  deleteCoupon,
};
