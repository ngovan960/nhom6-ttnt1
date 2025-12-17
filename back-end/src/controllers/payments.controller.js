import db from "../model/index.js";

const { Payment, Order, OrderStatusHistory, sequelize } = db;

/**
 * POST /payments/create
 * Tạo payment cho đơn hàng
 */
export const createPayment = async (req, res) => {
  const userId = req.user.id;
  const { order_id, method } = req.body;

  try {
    // 1️⃣ Lấy order
    const order = await Order.findOne({
      where: {
        id: order_id,
        user_id: userId,
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng",
      });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        message: "Đơn hàng không thể thanh toán",
      });
    }

    // 2️⃣ Tạo payment
    const payment = await Payment.create({
      order_id: order.id,
      user_id: userId,
      amount: order.total_price,
      method,
      status: "pending",
    });

    // 3️⃣ Xử lý theo phương thức
    if (method === "cod") {
      // COD: không callback
      order.status = "processing";
      await order.save();

      await OrderStatusHistory.create({
        order_id: order.id,
        status: "processing",
      });

      return res.json({
        message: "Đặt hàng COD thành công",
        payment,
      });
    }

    // Momo / VNPay (mock)
    return res.json({
      message: "Tạo thanh toán thành công",
      payment,
      payment_url: `https://sandbox-pay/${payment.id}`,
    });
  } catch (error) {
    console.error("CREATE PAYMENT ERROR:", error);
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

/**
 * POST /payments/callback
 * Webhook từ cổng thanh toán
 */
export const paymentCallback = async (req, res) => {
  const { payment_id, result } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const payment = await Payment.findByPk(payment_id, {
      transaction,
      lock: true,
    });

    if (!payment) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Payment không tồn tại",
      });
    }

    if (payment.status !== "pending") {
      await transaction.rollback();
      return res.json({
        message: "Payment đã được xử lý",
      });
    }

    const order = await Order.findByPk(payment.order_id, {
      transaction,
      lock: true,
    });

    if (result === "success") {
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
      payment.status = "failed";
      await payment.save({ transaction });
    }

    await transaction.commit();

    return res.json({
      message: "Callback xử lý thành công",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("PAYMENT CALLBACK ERROR:", error);
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};
