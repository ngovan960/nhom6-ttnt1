import db from "../model/index.js";

const { Payment, Order, OrderStatusHistory, sequelize } = db;

/**
 * Tạo payment cho đơn hàng
 * POST /payments/create
 */
export const createPayment = async (req, res) => {
  const userId = req.user.id;
  const { order_id, method } = req.body;

  const transaction = await sequelize.transaction();

  try {
    // 1️⃣ Lấy order
    const order = await Order.findOne({
      where: { id: order_id, user_id: userId },
      transaction,
      lock: true,
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng",
      });
    }

    if (order.status !== "pending") {
      await transaction.rollback();
      return res.status(400).json({
        message: "Đơn hàng không hợp lệ để thanh toán",
      });
    }

    // 2️⃣ Kiểm tra payment đã tồn tại chưa
    const existedPayment = await Payment.findOne({
      where: { order_id },
      transaction,
      lock: true,
    });

    if (existedPayment) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Đơn hàng đã có thanh toán",
      });
    }

    // 3️⃣ Tạo payment
    const payment = await Payment.create(
      {
        order_id: order.id,
        user_id: userId,
        amount: order.total_price,
        method,
        status: method === "cod" ? "pending" : "pending",
      },
      { transaction }
    );

    // 4️⃣ Nếu COD → coi như hoàn tất logic thanh toán
    if (method === "cod") {
      order.status = "processing";
      await order.save({ transaction });

      await OrderStatusHistory.create(
        {
          order_id: order.id,
          status: "processing",
        },
        { transaction }
      );
    }

    await transaction.commit();

    return res.status(201).json({
      message: "Tạo thanh toán thành công",
      payment,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("CREATE PAYMENT ERROR:", error);
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

/**
 * POST /payments/callback
 */
export const paymentCallback = async (req, res) => {
  const { order_id, success } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const payment = await Payment.findOne({
      where: { order_id },
      transaction,
      lock: true,
    });

    if (!payment) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Không tìm thấy payment",
      });
    }

    if (payment.status === "paid") {
      await transaction.rollback();
      return res.json({ message: "Payment đã được xử lý trước đó" });
    }

    const order = await Order.findByPk(order_id, {
      transaction,
      lock: true,
    });

    if (success) {
      // ✅ Thanh toán thành công
      payment.status = "paid";
      payment.paid_at = new Date();
      await payment.save({ transaction });

      order.status = "processing";
      await order.save({ transaction });

      await OrderStatusHistory.create(
        {
          order_id: order.id,
          status: "processing",
        },
        { transaction }
      );
    } else {
      // ❌ Thanh toán thất bại
      payment.status = "failed";
      await payment.save({ transaction });

      order.status = "cancelled";
      await order.save({ transaction });

      await OrderStatusHistory.create(
        {
          order_id: order.id,
          status: "cancelled",
        },
        { transaction }
      );
    }

    await transaction.commit();

    return res.json({ message: "Callback xử lý thành công" });
  } catch (error) {
    await transaction.rollback();
    console.error("PAYMENT CALLBACK ERROR:", error);
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};
