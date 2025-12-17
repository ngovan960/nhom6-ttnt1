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
