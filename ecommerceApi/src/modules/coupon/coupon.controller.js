const couponSchema = require("./coupon.model")

const applyCouponController = async (req, res) => {
  try {
    const { code, subtotal } = req.body;

    const coupon = await couponSchema.findOne({
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

    if (new Date() > coupon.expiryDate) {
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

    res.status(200).json({
      success: true,
      discount,
      total,
      coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


async function getCoupons(req, res) {
    const couponList = await couponSchema.find({})
    res.status(200).json({message: "All coupons", data: couponList})
}

module.exports = {applyCouponController, getCoupons};
