import Coupon from "../model/Coupon.js";

export const validateCoupon = async (req, res) => {
  const { code, cartTotal } = req.body;

  if (!code || cartTotal == null) {
    return res.status(400).json({
      valid: false,
      message: "Thiếu mã giảm giá hoặc tổng tiền",
    });
  }

  try {
    const coupon = await Coupon.findOne({
      where: { code },
    });

    if (!coupon) {
      return res.status(404).json({
        valid: false,
        message: "Mã giảm giá không tồn tại",
      });
    }

    const now = new Date();

    if (coupon.status !== "active") {
      return res.status(400).json({
        valid: false,
        message: "Mã giảm giá không còn hiệu lực",
      });
    }

    if (coupon.quantity <= 0) {
      return res.status(400).json({
        valid: false,
        message: "Mã giảm giá đã hết lượt sử dụng",
      });
    }

    if (coupon.startDate && now < coupon.startDate) {
      return res.status(400).json({
        valid: false,
        message: "Mã giảm giá chưa có hiệu lực",
      });
    }

    if (coupon.endDate && now > coupon.endDate) {
      return res.status(400).json({
        valid: false,
        message: "Mã giảm giá đã hết hạn",
      });
    }

    if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
      return res.status(400).json({
        valid: false,
        message: `Đơn hàng tối thiểu ${coupon.minOrderAmount} để áp dụng`,
      });
    }

    // 👉 Tính tiền giảm
    let discount = 0;

    if (coupon.discountType === "percent") {
      discount = (cartTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    if (discount > cartTotal) discount = cartTotal;

    return res.json({
      valid: true,
      discount,
      finalTotal: cartTotal - discount,
      message: "Áp dụng mã giảm giá thành công",
    });
  } catch (error) {
    return res.status(500).json({
      valid: false,
      message: "Lỗi server",
    });
  }
};

export const createCoupon = async (req, res) => {
  const {
    code,
    description,
    discountType,
    discountValue,
    minOrderAmount,
    maxDiscount,
    quantity,
    startDate,
    endDate,
  } = req.body;

  // 1. Validate input
  if (!code || !discountType || discountValue == null) {
    return res.status(400).json({
      message: "Thiếu dữ liệu bắt buộc",
    });
  }

  if (!["percent", "fixed"].includes(discountType)) {
    return res.status(400).json({
      message: "discountType không hợp lệ",
    });
  }

  if (discountValue <= 0) {
    return res.status(400).json({
      message: "Giá trị giảm phải lớn hơn 0",
    });
  }

  try {
    // 2. Check trùng mã
    const existed = await Coupon.findOne({ where: { code } });
    if (existed) {
      return res.status(409).json({
        message: "Mã giảm giá đã tồn tại",
      });
    }

    // 3. Tạo coupon
    const coupon = await Coupon.create({
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      quantity,
      startDate,
      endDate,
      status: "active",
    });

    return res.status(201).json({
      message: "Tạo mã giảm giá thành công",
      coupon,
    });
  } catch (error) {
    console.error("CREATE COUPON ERROR:", error);
    return res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
};
