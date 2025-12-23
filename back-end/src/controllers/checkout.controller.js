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
  let transaction; // moved transaction declaration out to allow safe rollback
  try {
    // Ensure user is authenticated and avoid errors before try/catch
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Bạn chưa đăng nhập" });
    }
    const userId = req.user.id;

    // Coerce shipping_fee to number to avoid string concatenation/type issues
    const { couponCode, address_id, payment_method, shipping_fee = 0 } = req.body;
    const shippingFee = Number(shipping_fee) || 0;

    transaction = await sequelize.transaction();

    // 1️⃣ Lấy cart (use explicit UPDATE lock)
    const cart = await Cart.findOne({
      where: { user_id: userId },
      include: {
        model: CartItem,
        include: [Product],
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!cart || !cart.CartItems || cart.CartItems.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Giỏ hàng trống",
      });
    }

    // 2️⃣ Tính tổng tiền (ensure numeric price)
    let totalPrice = 0;
    for (const item of cart.CartItems) {
      const product = item.Product;

      if ((product.stock ?? 0) < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          message: `Sản phẩm ${product.name} không đủ tồn kho`,
        });
      }

      const price = Number(product.discount_price ?? product.price) || 0;
      totalPrice += price * item.quantity;
    }

    // 3️⃣ Áp coupon (nếu có) with numeric coercion and explicit lock
    let discount = 0;
    let coupon = null;

    if (couponCode) {
      coupon = await Coupon.findOne({
        where: { code: couponCode },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!coupon || coupon.status !== "active" || coupon.quantity <= 0) {
        await transaction.rollback();
        return res.status(400).json({
          message: "Mã giảm giá không hợp lệ",
        });
      }

      if (coupon.minOrderAmount && totalPrice < Number(coupon.minOrderAmount)) {
        await transaction.rollback();
        return res.status(400).json({
          message: "Đơn hàng chưa đủ điều kiện áp mã",
        });
      }

      if (coupon.discountType === "percent") {
        const discountValue = Number(coupon.discountValue) || 0;
        discount = (totalPrice * discountValue) / 100;
        if (coupon.maxDiscount && discount > Number(coupon.maxDiscount)) {
          discount = Number(coupon.maxDiscount);
        }
      } else {
        discount = Number(coupon.discountValue) || 0;
      }

      if (discount > totalPrice) discount = totalPrice;

      coupon.quantity -= 1;
      await coupon.save({ transaction });
    }

    // 3.5️⃣ Handle Address (Get existing or Create new)
    let finalAddressId = address_id;
    const { full_name, phone, address_detail, city, district, ward } = req.body;

    if (!finalAddressId) {
       // Case: New Address
       // Relaxed validation: Only require the essentials if the user input is simple
       if (!full_name || !phone || !address_detail) {
          await transaction.rollback();
          console.log("Missing address fields:", { full_name, phone, address_detail });
          return res.status(400).json({ 
            message: "Vui lòng điền đủ: Họ tên, SĐT và Địa chỉ chi tiết" 
          });
       }

       const newAddress = await db.Address.create({
         user_id: userId,
         full_name,
         phone,
         address_detail,
         city: city || "", // Default to empty string if missing
         district: district || "",
         ward: ward || "",
         is_default: false
       }, { transaction });
       
       finalAddressId = newAddress.id;
    } else {
       // Case: Validate Existing Address
       const address = await db.Address.findOne({
          where: { id: finalAddressId, user_id: userId }
       });
       if (!address) {
          await transaction.rollback();
          return res.status(400).json({ message: "Địa chỉ giao hàng không hợp lệ" });
       }
    }

    // 3.6️⃣ Calculate Final Price
    const finalPrice = Math.max(0, totalPrice - discount) + shippingFee;

    // 4️⃣ Tạo order (use finalAddressId)
    const order = await Order.create(
      {
        user_id: userId,
        address_id: finalAddressId,
        payment_method,
        total_price: finalPrice,
        shipping_fee: shippingFee,
        status: "pending",
      },
      { transaction }
    );

    // 5️⃣ Tạo order items + trừ kho (ensure price numeric)
    for (const item of cart.CartItems) {
      const product = item.Product;
      const price = Number(product.discount_price ?? product.price) || 0;

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
    if (transaction) {
      await transaction.rollback();
    }
    console.error("CHECKOUT ERROR:", error);
    return res.status(500).json({
      message: "Lỗi server: " + error.message,
    });
  }
};
