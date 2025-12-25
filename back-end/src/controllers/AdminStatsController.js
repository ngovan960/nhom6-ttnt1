import db from "../model/index.js";
const { Order, OrderItem, Product, sequelize } = db;

/**
 * Lấy thống kê doanh thu theo ngày.
 * Doanh thu chỉ tính cho các đơn hàng có trạng thái 'completed'.
 * @param {Object} req - Đối tượng request.
 * @param {Object} res - Đối tượng response.
 */
export const getRevenueStats = async (req, res) => {
  try {
    const revenue = await Order.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("Order.createdAt")), "date"],
        [
          sequelize.literal(`COALESCE(SUM(CASE WHEN status = 'completed' THEN total_price ELSE 0 END), 0)`),
          "revenue",
        ],
        [sequelize.fn("COUNT", sequelize.col("Order.id")), "order_count"],
      ],
      group: [sequelize.fn("DATE", sequelize.col("Order.createdAt"))],
      order: [[sequelize.fn("DATE", sequelize.col("Order.createdAt")), "DESC"]],
    });

    res.status(200).json(revenue);
  } catch (error) {
    console.error("Error fetching revenue stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Lấy danh sách 10 sản phẩm bán chạy nhất dựa trên số lượng đã bán.
 * @param {Object} req - Đối tượng request.
 * @param {Object} res - Đối tượng response.
 */
export const getBestSellingProducts = async (req, res) => {
  try {
    const bestSelling = await OrderItem.findAll({
      attributes: [
        "product_id",
        [sequelize.fn("SUM", sequelize.col("OrderItem.quantity")), "total_sold"],
      ],
      include: [
        {
          model: Product,
          attributes: ["name", "price", ["thumbnail", "image"], "stock"], // Alias thumbnail as image for frontend consistency
        },
      ],
      group: ["product_id", "Product.id"], // Group by product_id and Product.id to allow including Product fields
      order: [[sequelize.col("total_sold"), "DESC"]],
      limit: 10, // Top 10 best selling
    });

    res.status(200).json(bestSelling);
  } catch (error) {
    console.error("Error fetching best selling products:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
