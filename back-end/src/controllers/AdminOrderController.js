import db from "../model/index.js";
import { Op } from "sequelize";

const { Order, User, Payment, OrderStatusHistory, Address } = db;

export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};

    if (status) {
      whereClause.status = status;
    }

    if (search) {
      // Basic search by order ID or user name/email if feasible
      // For simplicity, search by Order ID
       whereClause.id = search;
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        { model: User, attributes: ["id", "fullname", "email"] },
        { model: Payment },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      totalOrders: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      orders,
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách đơn hàng" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    const oldStatus = order.status;
    order.status = status;
    await order.save();

    // Log status history
    await OrderStatusHistory.create({
      order_id: id,
      status: status,
      note: `Admin changed status from ${oldStatus} to ${status}`,
      updatedBy: req.user.id // Assuming middleware adds user to req
    });

    res.json({ message: "Cập nhật trạng thái đơn hàng thành công", order });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi cập nhật trạng thái đơn hàng" });
  }
};

export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ message: "Đơn hàng không tồn tại" });
        }

        // Ideally we might want to just cancel it instead of delete, but if requested to delete:
        await order.destroy();
        res.json({ message: "Đã xóa đơn hàng thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi xóa đơn hàng" });
    }
}
