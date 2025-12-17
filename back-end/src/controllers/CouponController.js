import db from "../model/index.js";
import { Op } from "sequelize";

const { Coupon } = db;

// POST /api/coupons/apply
export const applyCoupon = async (req, res) => {
  try {
    const code = req.body?.code;
    const cartTotal = Number(req.body?.cartTotal);

    if (!code || !Number.isFinite(cartTotal)) {
      return res.status(400).json({ message: "code and cartTotal are required" });
    }

    const now = new Date();

    const coupon = await Coupon.findOne({
      where: {
        code,
        status: "active",
        [Op.and]: [
          { [Op.or]: [{ startDate: null }, { startDate: { [Op.lte]: now } }] },
          { [Op.or]: [{ endDate: null }, { endDate: { [Op.gte]: now } }] },
        ],
      },
    });

    if (!coupon) {
      return res.status(400).json({ message: "Invalid coupon" });
    }

    if (coupon.quantity !== null && coupon.quantity <= 0) {
      return res.status(400).json({ message: "Coupon out of stock" });
    }

    if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
      return res.status(400).json({ message: "Order amount too low" });
    }

    let discount =
      coupon.discountType === "percent"
        ? (cartTotal * coupon.discountValue) / 100
        : coupon.discountValue;

    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount);
    }

    return res.json({
      data: {
        coupon_id: coupon.id,
        discount,
        total_after_discount: Math.max(0, cartTotal - discount),
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Apply coupon failed", error: err.message });
  }


};
