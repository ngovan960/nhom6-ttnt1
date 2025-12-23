import db from "../model/index.js";

const { Order, OrderItem, Product, Payment, OrderStatusHistory, Address } = db;

export const getMyOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await Order.findAll({
      where: { user_id: userId },
      include: [
        { model: Payment, required: false },
        { model: Address, required: false },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const getOrderDetail = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const order = await Order.findOne({
      where: { id, user_id: userId },
      include: [
        {
          model: OrderItem,
          include: [{ model: Product }],
        },
        { model: Payment, required: false },
        { model: OrderStatusHistory },
        { model: Address, required: false },
      ],
    });



    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const cancelOrder = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const order = await Order.findOne({
      where: { id, user_id: userId },
    });

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    if (["shipping", "completed", "cancelled"].includes(order.status)) {
      return res
        .status(400)
        .json({ message: "Không thể hủy đơn hàng ở trạng thái này" });
    }

    // Cập nhật trạng thái
    order.status = "cancelled";
    await order.save();

    // Lưu lịch sử trạng thái (nếu cần thiết, tùy vào logic business)
    await OrderStatusHistory.create({
      order_id: order.id,
      status: "cancelled",
      note: "Người dùng hủy đơn hàng",
    });

    res.json({ message: "Hủy đơn hàng thành công", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
