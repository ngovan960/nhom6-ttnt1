import db from "../model/index.js";

const {
  Cart,
  CartItem,
  Product,
  Coupon,
  Order,
  OrderItem,
  OrderStatusHistory,
  sequelize,
} = db;

export const checkout = async (req, res) => {
  const userId = req.user.id;
  const { couponCode, address_id, payment_method, shipping_fee = 0 } = req.body;

  const transaction = await sequelize.transaction();

  try {
    // 1️⃣ Lấy cart
    const cart = await Cart.findOne({
      where: { user_id: userId },
      include: {
        model: CartItem,
        include: [Product],
      },
      transaction,
      lock: true,
    });

    if (!cart || cart.CartItems.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Giỏ hàng trống",
      });
    }

    // 2️⃣ Tính tổng tiền
    let totalPrice = 0;

    for (const item of cart.CartItems) {
      const product = item.Product;

      if (product.stock < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          message: `Sản phẩm ${product.name} không đủ tồn kho`,
        });
      }

      const price = product.discount_price ?? product.price;
      totalPrice += price * item.quantity;
    }

    // 3️⃣ Áp coupon (nếu có)
    let discount = 0;
    let coupon = null;

    if (couponCode) {
      coupon = await Coupon.findOne({
        where: { code: couponCode },
        transaction,
        lock: true,
      });

      if (!coupon || coupon.status !== "active" || coupon.quantity <= 0) {
        await transaction.rollback();
        return res.status(400).json({
          message: "Mã giảm giá không hợp lệ",
        });
      }

      if (coupon.minOrderAmount && totalPrice < coupon.minOrderAmount) {
        await transaction.rollback();
        return res.status(400).json({
          message: "Đơn hàng chưa đủ điều kiện áp mã",
        });
      }

      if (coupon.discountType === "percent") {
        discount = (totalPrice * coupon.discountValue) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else {
        discount = coupon.discountValue;
      }

      if (discount > totalPrice) discount = totalPrice;

      coupon.quantity -= 1;
      await coupon.save({ transaction });
    }

    const finalPrice = totalPrice - discount + shipping_fee;

    // 4️⃣ Tạo order
    const order = await Order.create(
      {
        user_id: userId,
        address_id,
        payment_method,
        total_price: finalPrice,
        shipping_fee,
        status: "pending",
      },
      { transaction }
    );

    // 5️⃣ Tạo order items + trừ kho
    for (const item of cart.CartItems) {
      const product = item.Product;
      const price = product.discount_price ?? product.price;

      await OrderItem.create(
        {
          order_id: order.id,
          product_id: product.id,
          quantity: item.quantity,
          price,
        },
        { transaction }
      );

      product.stock -= item.quantity;
      await product.save({ transaction });
    }

    // 6️⃣ Lưu lịch sử trạng thái
    await OrderStatusHistory.create(
      {
        order_id: order.id,
        status: "pending",
      },
      { transaction }
    );

    // 7️⃣ Clear cart
    await CartItem.destroy({
      where: { cart_id: cart.id },
      transaction,
    });

    await transaction.commit();

    return res.status(201).json({
      message: "Checkout thành công",
      order,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("CHECKOUT ERROR:", error);
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};
