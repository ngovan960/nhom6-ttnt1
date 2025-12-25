import db from "../model/index.js";
import { Op } from "sequelize";

const { Coupon } = db;

// POST /api/coupons/apply

// GET /api/coupons
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json({ data: coupons });
  } catch (err) {
    console.error("GET COUPONS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch coupons", error: err.message });
  }
};

// POST /api/coupons
export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ data: coupon });
  } catch (err) {
    console.error("CREATE COUPON ERROR:", err);
    res.status(400).json({ 
      message: err.name === 'SequelizeUniqueConstraintError' ? "Mã giảm giá đã tồn tại" : "Lỗi khi tạo mã giảm giá", 
      error: err.message 
    });
  }
};

// PUT /api/coupons/:id
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Coupon.update(req.body, { where: { id } });
    if (!updated) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    const coupon = await Coupon.findByPk(id);
    res.json({ data: coupon });
  } catch (err) {
    console.error("UPDATE COUPON ERROR:", err);
    res.status(400).json({ 
      message: err.name === 'SequelizeUniqueConstraintError' ? "Mã giảm giá đã tồn tại" : "Lỗi khi cập nhật mã giảm giá", 
      error: err.message 
    });
  }
};

// DELETE /api/coupons/:id
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Coupon.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.json({ message: "Coupon deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete coupon", error: err.message });
  }
};

export const applyCoupon = async (req, res) => {
  // ... existing implementation ...

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
